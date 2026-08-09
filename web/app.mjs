import { chapters, lessons, solutions, chapterStart } from './course.mjs';
import { CompilerService } from './compiler.mjs';
import { createEditor } from './editor.mjs';
import { gradeLesson, visibleOutput } from './judge.mjs';
import { emptySave, loadSave, normalizeSave, writeSave } from './save-store.mjs';
import { consumeAnswerToken, tokenCount } from './answer-store.mjs';
import { loadAiSettings, requestAiTutor, requestCompilerExplanation, saveAiSettings, testAiConnection } from './ai-service.mjs';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
let state = emptySave();
let activeTab = 'console';
let lastResult = null;
let saveTimer;
let saveChain = Promise.resolve();
let toastTimer;
let editorFontSize = 15;
let busy = false;
let aiTutorBusy = false;
let compilerExplainBusy = false;

const editor = createEditor($('#codeEditor'), source => {
  if (!state.started || $('#challengeView').hidden) return;
  state.drafts[currentLesson().id] = source;
  scheduleSave();
});

const compiler = new CompilerService((status, text) => {
  const badge = $('#runtimeBadge');
  badge.className = `runtime-badge ${status}`;
  badge.textContent = text;
});

if (new URLSearchParams(location.search).has('regression')) {
  const regressionApi = {
    count: lessons.length,
    lesson(index) { return { id: lessons[index]?.id, title: lessons[index]?.title }; },
    async compile(index) {
      const lesson = lessons[index];
      if (!lesson) throw new Error(`不存在第 ${index} 道题。`);
      const execution = await compiler.compileAndRun(solutions[index], lesson.defaultInput ?? '');
      const judged = gradeLesson(lesson, solutions[index], execution);
      return { id: lesson.id, title: lesson.title, compiled: execution.ok, passed: judged.passed, stderr: execution.stderr, failed: judged.tests.filter(test => !test.passed).map(test => test.message) };
    },
    async compileSyntaxBatch(start = 0, end = lessons.length) {
      return compiler.compileBatch(lessons.slice(start, end).map((lesson, offset) => ({ id: lesson.id, source: solutions[start + offset] })));
    }
  };
  window.__GRAY_CROWN_REGRESSION__ = regressionApi;
  const bridge = document.createElement('div');
  bridge.id = 'regressionBridge';
  bridge.style.cssText = 'position:fixed;left:8px;bottom:8px;z-index:99999;padding:6px;background:#fff;color:#000';
  bridge.dataset.status = 'idle';
  bridge.innerHTML = '<input id="regressionStart" value="0"><input id="regressionEnd" value="1"><button type="button">run</button><button id="regressionBatch" type="button">batch</button><output></output>';
  bridge.querySelector('button').addEventListener('click', async () => {
    bridge.dataset.status = 'running';
    const start = Number(bridge.querySelector('#regressionStart').value);
    const end = Number(bridge.querySelector('#regressionEnd').value);
    const results = [];
    try {
      for (let index = start; index < end; index++) results.push(await regressionApi.compile(index));
      bridge.querySelector('output').textContent = JSON.stringify(results);
      bridge.dataset.status = 'done';
    } catch (error) {
      bridge.querySelector('output').textContent = JSON.stringify({ error: error.message });
      bridge.dataset.status = 'error';
    }
  });
  bridge.querySelector('#regressionBatch').addEventListener('click', async () => {
    bridge.dataset.status = 'running';
    const start = Number(bridge.querySelector('#regressionStart').value);
    const end = Number(bridge.querySelector('#regressionEnd').value);
    try {
      const result = await regressionApi.compileSyntaxBatch(start, end);
      bridge.querySelector('output').textContent = JSON.stringify(result);
      bridge.dataset.status = result.ok ? 'done' : 'error';
    } catch (error) {
      bridge.querySelector('output').textContent = JSON.stringify({ error: error.message });
      bridge.dataset.status = 'error';
    }
  });
  document.body.appendChild(bridge);
}

function queueSave(showStatus = true) {
  state.updatedAt = new Date().toISOString();
  const snapshot = structuredClone(state);
  if (showStatus) $('#saveState').textContent = '○ 正在写入 JSON';
  saveChain = saveChain
    .catch(() => {})
    .then(() => writeSave(snapshot))
    .then(saved => {
      state.updatedAt = saved.updatedAt;
      if (showStatus) $('#saveState').textContent = '● JSON 存档已保存';
    })
    .catch(error => {
      if (showStatus) $('#saveState').textContent = '× 存档失败';
      showToast('本地存档写入失败', error.message, true);
    });
  updateStats();
  return saveChain;
}

function scheduleSave() {
  $('#saveState').textContent = '○ 等待写入 JSON';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => queueSave(), 450);
}

function level() { return Math.floor(state.xp / 100) + 1; }
function completedCount() { return state.completed.length; }
function currentLesson() { return lessons[state.currentQuest]; }
function currentChapter() { return chapters[state.currentChapter] ?? chapters[0]; }
function completedInChapter(chapter = currentChapter()) { return chapter.lessons.filter(lesson => state.completed.includes(lesson.id)).length; }
function isChapterUnlocked(index) { return index === 0 || completedInChapter(chapters[index - 1]) >= chapters[index - 1].total; }

function updateStats() {
  $$('[data-gold]').forEach(node => { node.textContent = state.gold; });
  $$('[data-level]').forEach(node => { node.textContent = level(); });
  const chapterId = currentChapter().id;
  $$('[data-crystals]').forEach(node => { node.textContent = tokenCount(state, chapterId); });
  const answerButton = $('#answerBtn');
  if (answerButton) {
    const used = state.answerUses?.[chapterId]?.includes(currentLesson()?.id);
    answerButton.disabled = tokenCount(state, chapterId) < 1 && !used;
    answerButton.textContent = used ? '🔮 再看正确答案' : '🔮 查看正确答案';
  }
  updateAiTutorButton();
}

function updateAiTutorButton() {
  const button = $('#aiTutorBtn');
  const lesson = currentLesson();
  if (!button || !lesson) return;
  const failures = state.consecutiveFailures?.[lesson.id] ?? 0;
  const used = Boolean(state.aiTutorUses?.[lesson.chapterId]);
  button.disabled = aiTutorBusy || used || failures < 3;
  button.textContent = used ? '🧙 本章已使用' : failures < 3 ? `🧙 AI导师 ${failures}/3` : aiTutorBusy ? '🧙 正在请教…' : '🧙 AI导师可用';
  button.title = used ? 'AI导师每章只能使用一次' : failures < 3 ? `还需连续提交错误 ${3 - failures} 次` : '本章唯一一次AI导师已经解锁';
}

function showView(view) {
  $$('.view').forEach(node => { node.hidden = node !== view; });
  window.scrollTo(0, 0);
}

function showToast(title, text, error = false) {
  $('#toastTitle').textContent = title;
  $('#toastText').textContent = text;
  $('#toast').classList.toggle('error', error);
  $('#toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 3800);
}

function statusFor(index) {
  const id = lessons[index].id;
  if (state.completed.includes(id)) return 'completed';
  if (state.skipped.includes(id)) return 'skipped';
  return 'open';
}

function isUnlocked(index) {
  const lesson = lessons[index];
  if (!lesson || !isChapterUnlocked(lesson.chapterIndex)) return false;
  if (lesson.localIndex === 0) return true;
  if (lesson.localIndex === 19 && completedInChapter(chapters[lesson.chapterIndex]) < 18) return false;
  const previousId = lessons[index - 1].id;
  return state.completed.includes(previousId) || state.skipped.includes(previousId);
}

async function startJourney(reset = false) {
  if (reset) state = emptySave();
  state.started = true;
  state.currentChapter = 0;
  await queueSave(false);
  renderMap();
  showView($('#mapView'));
}

function renderStart() {
  const hasSave = state.started;
  $('#continueBtn').hidden = !hasSave;
  $('#saveSummary').hidden = !hasSave;
  if (hasSave) {
    const next = lessons[Math.min(state.currentQuest, lessons.length - 1)];
    const savedChapter = chapters[next.chapterIndex] ?? chapters[0];
    $('#saveSummary').textContent = `${savedChapter.title} ${completedInChapter(savedChapter)}/20 · 总进度 ${completedCount()}/140 · 最近任务：${next.title}`;
    $('#newJourneyBtn').textContent = '重新开始';
  }
  updateStats();
  showView($('#startView'));
}

function renderMap() {
  const chapter = currentChapter();
  const path = $('#questPath');
  path.replaceChildren();
  chapter.lessons.forEach((lesson, localIndex) => {
    const index = chapterStart(state.currentChapter) + localIndex;
    const unlocked = isUnlocked(index);
    const status = statusFor(index);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `quest-node ${unlocked ? 'unlocked' : 'locked'} ${status !== 'open' ? status : ''} ${index === state.currentQuest ? 'current' : ''}`;
    button.disabled = !unlocked;
    button.title = unlocked ? `${lesson.id} ${lesson.title}` : '完成前一项试炼后开放';
    const icon = status === 'completed' ? '✓' : status === 'skipped' ? '!' : unlocked ? String(localIndex + 1).padStart(2, '0') : '🔒';
    button.innerHTML = `<span class="node-orb">${icon}</span><small>${lesson.title}</small>`;
    if (unlocked) button.addEventListener('click', () => openQuest(index));
    path.appendChild(button);
  });
  const progress = completedInChapter(chapter);
  $('#mapProgressBar').style.width = `${progress / chapter.total * 100}%`;
  $('#mapProgressText').textContent = `${progress} / ${chapter.total}`;
  $('#mapRune').textContent = chapter.rune;
  $('#mapChapterTitle').textContent = chapter.title;
  $('#mapChapterDescription').textContent = chapter.description;
  $('#chapterCounter').textContent = `第 ${state.currentChapter + 1} / ${chapters.length} 章`;
  $('#questPath').setAttribute('aria-label', `${chapter.title}任务路线`);
  $('#prevChapterBtn').disabled = state.currentChapter === 0;
  $('#nextChapterBtn').disabled = state.currentChapter === chapters.length - 1 || !isChapterUnlocked(state.currentChapter + 1);

  const cards = $('#chapterCards');
  cards.replaceChildren(...chapters.map((item, index) => {
    const unlocked = isChapterUnlocked(index);
    const done = completedInChapter(item);
    const card = document.createElement('article');
    card.className = `region-card ${unlocked ? 'unlocked' : ''} ${index === state.currentChapter ? 'current' : ''}`;
    card.innerHTML = `<span>${item.numeral}</span><div><b>${item.title}</b><small>${unlocked ? `${done}/${item.total} · ${item.subtitle}` : `完成${chapters[index - 1]?.title ?? ''}后开放`}</small></div><button type="button" ${unlocked ? '' : 'disabled'} aria-label="${item.title}">${unlocked ? (index === state.currentChapter ? '●' : '→') : '🔒'}</button>`;
    if (unlocked) card.querySelector('button').addEventListener('click', () => switchChapter(index));
    return card;
  }));
  updateStats();
}

function switchChapter(index) {
  if (index < 0 || index >= chapters.length || !isChapterUnlocked(index)) return;
  state.currentChapter = index;
  queueSave(false);
  renderMap();
}

function openQuest(index) {
  if (!isUnlocked(index)) return;
  state.currentQuest = index;
  state.currentChapter = lessons[index].chapterIndex;
  queueSave(false);
  renderQuest();
  showView($('#challengeView'));
  setTimeout(() => editor.focus(), 0);
}

function renderQuest() {
  const lesson = currentLesson();
  const index = state.currentQuest;
  const chapter = chapters[lesson.chapterIndex];
  const localIndex = lesson.localIndex;
  $('#challengeCrumb').textContent = `${chapter.title} / ${lesson.title}`;
  $('#questCounter').textContent = `${String(localIndex + 1).padStart(2, '0')} / ${chapter.total}`;
  $('#questEyebrow').textContent = `${lesson.id} · ${chapter.title}试炼`;
  $('#questTitle').textContent = lesson.title;
  $('#difficultyChip').textContent = lesson.difficulty;
  $('#knowledgeChip').textContent = lesson.knowledge;
  $('#timeChip').textContent = `约 ${lesson.minutes} 分钟`;
  $('#questQuote').textContent = lesson.quote;
  $('#questStory').textContent = lesson.story;
  $('#questObjective').innerHTML = lesson.objective;
  $('#questRules').innerHTML = lesson.rules;
  $('#prevQuestBtn').disabled = localIndex === 0 || !isUnlocked(index - 1);
  $('#nextQuestBtn').disabled = localIndex === chapter.total - 1 || !isUnlocked(index + 1);

  const hintsOpened = new Set(state.hints[lesson.id] ?? []);
  $('#hintList').replaceChildren(...lesson.hints.map((hintText, hintIndex) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `hint ${hintsOpened.has(hintIndex) ? 'open' : ''}`;
    button.innerHTML = `<span class="hint-head">提示${['一 · 方向', '二 · 步骤', '三 · 骨架'][hintIndex]}<b>${hintsOpened.has(hintIndex) ? '−' : '＋'}</b></span><span class="hint-body">${hintText}</span>`;
    button.addEventListener('click', () => toggleHint(hintIndex, button));
    return button;
  }));

  editor.setValue(state.drafts[lesson.id] ?? lesson.starterCode);
  editor.setDiagnostics([]);
  $('#stdinInput').value = state.inputs[lesson.id] ?? lesson.defaultInput ?? '';
  updateSkipVisibility();
  const failures = state.consecutiveFailures?.[lesson.id] ?? 0;
  $('#attemptLabel').textContent = `正式提交 ${state.attempts[lesson.id] ?? 0} 次 · 连续错误 ${failures}/3`;
  lastResult = null;
  setResultTab('console');
  $('#questPanel').scrollTop = 0;
  updateStats();
}

function openAnswerDialog(lesson, answer, alreadyRevealed) {
  const chapterId = lesson.chapterId;
  $('#answerCode').textContent = answer;
  $('#answerDialogCopy').textContent = alreadyRevealed
    ? '这道题已经解锁过答案，不会再次消耗水晶。'
    : `本章还剩 ${tokenCount(state, chapterId)} 枚真知水晶。答案仅供参考，建议重新输入并运行一次。`;
  $('#answerDialog').showModal();
}

function showAnswer() {
  const lesson = currentLesson();
  const answer = solutions[state.currentQuest];
  if (!answer) {
    showToast('答案暂未配置', '这道题还没有加入真知水晶的答案库。', true);
    return;
  }
  const chapterId = lesson.chapterId;
  const alreadyRevealed = state.answerUses?.[chapterId]?.includes(lesson.id);
  if (alreadyRevealed) {
    openAnswerDialog(lesson, answer, true);
    return;
  }
  const remaining = tokenCount(state, chapterId);
  if (remaining < 1) {
    showToast('真知水晶已经用完', '本章20题只有3枚水晶。', true);
    return;
  }
  $('#answerConfirmCopy').textContent = `查看“${lesson.title}”的完整答案会消耗1枚水晶。当前剩余：${remaining}枚。`;
  $('#answerConfirmDialog').showModal();
}

function confirmAnswerUse() {
  const lesson = currentLesson();
  const answer = solutions[state.currentQuest];
  if (!consumeAnswerToken(state, lesson.id, lesson.chapterId)) {
    $('#answerConfirmDialog').close();
    showToast('真知水晶已经用完', '本章20题只有3枚水晶。', true);
    return;
  }
  queueSave(false);
  $('#answerConfirmDialog').close();
  showToast('水晶已消耗', `本章还剩 ${tokenCount(state, lesson.chapterId)} 枚真知水晶。`);
  openAnswerDialog(lesson, answer, false);
}

function toggleHint(index, button) {
  const id = currentLesson().id;
  const opened = new Set(state.hints[id] ?? []);
  if (opened.has(index)) opened.delete(index); else opened.add(index);
  state.hints[id] = [...opened];
  queueSave(false);
  button.classList.toggle('open', opened.has(index));
  button.querySelector('.hint-head b').textContent = opened.has(index) ? '−' : '＋';
  updateSkipVisibility();
}

function updateSkipVisibility() {
  const id = currentLesson().id;
  const attempts = state.attempts[id] ?? 0;
  const opened = state.hints[id]?.length ?? 0;
  $('#skipQuestBtn').hidden = state.completed.includes(id) || state.skipped.includes(id) || (attempts < 3 && opened < 3);
}

function setResultTab(tab) {
  activeTab = tab;
  $$('.result-tab').forEach(button => button.classList.toggle('active', button.dataset.tab === tab));
  renderResult();
}

function updateCompilerExplainButton() {
  const button = $('#explainCompilerBtn');
  if (!button) return;
  const execution = lastResult?.execution ?? lastResult;
  const hasError = Boolean(execution && (!execution.ok || execution.stderr?.trim()));
  button.hidden = activeTab !== 'compiler' || !hasError;
  button.disabled = compilerExplainBusy;
  button.textContent = compilerExplainBusy ? '✨ 正在解释…' : '✨ AI解释错误';
}

function formatTests(result) {
  if (!result?.tests?.length) return '还没有正式测试结果。';
  const lines = result.tests.map(test => `${test.passed ? '✓' : '✕'} ${test.name}\n  ${test.message}`);
  const failedDiff = result.tests.find(test => !test.passed && 'expected' in test);
  if (failedDiff) lines.push(`\n你的输出：\n${visibleOutput(failedDiff.actual)}\n\n预期输出：\n${visibleOutput(failedDiff.expected)}`);
  return lines.join('\n');
}

function formatCompiler(result) {
  const execution = result?.execution ?? result;
  if (!execution) return '运行代码后，这里会显示真正的 Clang 编译信息。';
  if (execution.ok && !execution.stderr) return '✓ Clang 编译通过，程序正常结束。';
  const localized = execution.diagnostics?.map(item => `${item.level === 'warning' ? '△' : '✕'} 第${item.line}行:${item.column} ${item.message}`).join('\n');
  return [localized, execution.stderr].filter(Boolean).join('\n\n') || `程序退出码：${execution.code}`;
}

function renderResult() {
  const panel = $('#resultContent');
  panel.className = 'result-content';
  updateCompilerExplainButton();
  if (!lastResult) {
    panel.textContent = activeTab === 'console' ? '等待运行程序…' : activeTab === 'tests' ? '提交符文后，这里会显示逐项测试结果。' : '运行代码后，这里会显示真正的 Clang 编译信息。';
    return;
  }
  const execution = lastResult.execution ?? lastResult;
  if (activeTab === 'console') {
    panel.textContent = execution.ok ? `> 程序运行结束（退出码 ${execution.code}）\n\n${execution.output || '(没有输出)'}` : `> 程序没有成功结束\n\n${formatCompiler(lastResult)}`;
    panel.classList.add(execution.ok ? 'success' : 'error');
  } else if (activeTab === 'tests') {
    panel.textContent = formatTests(lastResult);
    panel.classList.add(lastResult.passed ? 'success' : 'error');
  } else {
    panel.textContent = formatCompiler(lastResult);
    panel.classList.add(execution.ok ? 'success' : 'error');
  }
}

async function explainCompilerError() {
  const execution = lastResult?.execution ?? lastResult;
  if (!execution || (execution.ok && !execution.stderr?.trim()) || compilerExplainBusy) return;
  const lesson = currentLesson();
  compilerExplainBusy = true;
  updateCompilerExplainButton();
  try {
    const result = await requestCompilerExplanation({
      lessonId: lesson.id,
      title: lesson.title,
      objective: lesson.objective,
      rules: lesson.rules,
      code: editor.getValue(),
      compilerMessage: formatCompiler(lastResult),
      output: execution.output ?? ''
    });
    $('#aiTutorTitle').textContent = `${lesson.title} · 错误解释`;
    $('#aiTutorDisclaimer').textContent = '这次解释不消耗每章一次的AI导师机会；最终仍以真实Clang编译结果为准。';
    $('#aiTutorContent').textContent = result.content;
    $('#aiTutorDialog').showModal();
  } catch (error) {
    showToast('AI未能解释错误', `${error.message}。请确认设置中的API连接正常。`, true);
  } finally {
    compilerExplainBusy = false;
    updateCompilerExplainButton();
  }
}

function setBusy(value) {
  busy = value;
  $('#runBtn').disabled = value;
  $('#submitBtn').disabled = value;
  $('#runBtn').textContent = value ? '⏳ 编译中…' : '▶ 运行代码';
}

async function execute() {
  if (busy) return null;
  setBusy(true);
  editor.setDiagnostics([]);
  try {
    const result = await compiler.compileAndRun(editor.getValue(), $('#stdinInput').value);
    editor.setDiagnostics(result.diagnostics ?? []);
    return result;
  } catch (error) {
    return { ok: false, stage: 'internal', code: -1, output: '', stderr: error.message, diagnostics: [] };
  } finally {
    setBusy(false);
  }
}

async function runCode() {
  const result = await execute();
  if (!result) return;
  lastResult = result;
  setResultTab(result.ok ? 'console' : 'compiler');
}

async function submitCode() {
  const lesson = currentLesson();
  const id = lesson.id;
  const execution = await execute();
  if (!execution) return;
  state.attempts[id] = (state.attempts[id] ?? 0) + 1;
  state.drafts[id] = editor.getValue();
  state.inputs[id] = $('#stdinInput').value;
  lastResult = gradeLesson(lesson, editor.getValue(), execution);
  setResultTab(lastResult.passed ? 'tests' : execution.ok ? 'tests' : 'compiler');
  $('#attemptLabel').textContent = `正式提交 ${state.attempts[id]} 次 · 运行不会扣除奖励`;
  updateSkipVisibility();
  if (lastResult.passed) completeQuest();
  else {
    state.consecutiveFailures[id] = (state.consecutiveFailures[id] ?? 0) + 1;
    $('#attemptLabel').textContent = `正式提交 ${state.attempts[id]} 次 · 连续错误 ${state.consecutiveFailures[id]}/3`;
    updateAiTutorButton();
    queueSave(false);
    showToast('符文尚未响应', lastResult.tests.find(test => !test.passed)?.message ?? '请查看 Clang 的错误提示。', true);
  }
}

function completeQuest() {
  const lesson = currentLesson();
  state.consecutiveFailures[lesson.id] = 0;
  const firstPass = !state.completed.includes(lesson.id);
  if (firstPass) {
    state.completed.push(lesson.id);
    state.skipped = state.skipped.filter(id => id !== lesson.id);
    state.xp += lesson.localIndex === 19 ? 40 : 20;
    state.gold += lesson.localIndex === 19 ? 20 : 10;
  }
  queueSave(false);
  $('#completionTitle').textContent = firstPass ? `${lesson.title} · 完成` : '符文再次回应';
  $('#completionStory').textContent = lesson.passStory;
  $('#xpReward').textContent = firstPass ? (lesson.localIndex === 19 ? 40 : 20) : 0;
  $('#goldReward').textContent = firstPass ? (lesson.localIndex === 19 ? 20 : 10) : 0;
  $('#nextAfterPassBtn').hidden = state.currentQuest === lessons.length - 1;
  $('#completionDialog').showModal();
}

async function openSettings() {
  $('#settingsDialog').showModal();
  const status = $('#aiSettingsStatus');
  status.className = 'ai-settings-status';
  status.textContent = '正在读取本机AI设置…';
  try {
    const settings = await loadAiSettings();
    $('#aiApiUrl').value = settings.apiUrl ?? '';
    $('#aiModel').value = settings.model ?? '';
    $('#aiApiKey').value = '';
    $('#aiApiKey').placeholder = settings.hasApiKey ? '已保存API Key；留空则保持不变' : '本地无鉴权服务可留空';
    status.textContent = settings.configured ? 'AI接口已配置，可以测试连接。' : '尚未配置AI接口。';
  } catch (error) {
    status.className = 'ai-settings-status error';
    status.textContent = error.message;
  }
}

function aiSettingsFromForm() {
  return { apiUrl: $('#aiApiUrl').value.trim(), model: $('#aiModel').value.trim(), apiKey: $('#aiApiKey').value.trim() };
}

async function persistAiSettings() {
  const status = $('#aiSettingsStatus');
  status.className = 'ai-settings-status';
  status.textContent = '正在保存AI设置…';
  const result = await saveAiSettings(aiSettingsFromForm());
  $('#aiApiKey').value = '';
  $('#aiApiKey').placeholder = result.hasApiKey ? '已保存API Key；留空则保持不变' : '本地无鉴权服务可留空';
  status.className = 'ai-settings-status success';
  status.textContent = 'AI设置已保存到本机。';
}

async function saveAiSettingsFromDialog() {
  try { await persistAiSettings(); }
  catch (error) {
    $('#aiSettingsStatus').className = 'ai-settings-status error';
    $('#aiSettingsStatus').textContent = error.message;
  }
}

async function testAiSettingsFromDialog() {
  const button = $('#testAiSettingsBtn');
  button.disabled = true;
  button.textContent = '正在测试…';
  try {
    await persistAiSettings();
    const result = await testAiConnection();
    $('#aiSettingsStatus').className = 'ai-settings-status success';
    $('#aiSettingsStatus').textContent = `连接成功，模型回复：${result.reply}`;
  } catch (error) {
    $('#aiSettingsStatus').className = 'ai-settings-status error';
    $('#aiSettingsStatus').textContent = `连接失败：${error.message}`;
  } finally {
    button.disabled = false;
    button.textContent = '测试连接';
  }
}

function showAiTutorConfirm() {
  const lesson = currentLesson();
  const failures = state.consecutiveFailures?.[lesson.id] ?? 0;
  if (state.aiTutorUses?.[lesson.chapterId]) {
    showToast('本章已经召唤过AI导师', '每章只能使用一次AI导师。', true);
    return;
  }
  if (failures < 3) {
    showToast('AI导师尚未解锁', `同一道题还需连续提交错误 ${3 - failures} 次。`, true);
    return;
  }
  $('#aiConfirmCopy').textContent = `“${lesson.title}”已连续提交错误${failures}次。AI导师每章只能使用一次；确认后会发送当前题目、代码、编译信息和输出。`;
  $('#aiConfirmDialog').showModal();
}

async function confirmAiTutor() {
  const lesson = currentLesson();
  if (state.aiTutorUses?.[lesson.chapterId] || aiTutorBusy) return;
  aiTutorBusy = true;
  updateAiTutorButton();
  const button = $('#confirmAiTutorBtn');
  button.disabled = true;
  button.textContent = '正在请教…';
  try {
    const execution = lastResult?.execution ?? lastResult;
    const result = await requestAiTutor({
      lessonId: lesson.id,
      title: lesson.title,
      objective: lesson.objective,
      rules: lesson.rules,
      code: editor.getValue(),
      compilerMessage: formatCompiler(lastResult),
      output: execution?.output ?? ''
    });
    state.aiTutorUses[lesson.chapterId] = true;
    await queueSave(false);
    $('#aiConfirmDialog').close();
    $('#aiTutorTitle').textContent = `${lesson.title} · 导师的低语`;
    $('#aiTutorDisclaimer').textContent = 'AI只提供提示，最终通关仍以真实Clang编译和测试结果为准。';
    $('#aiTutorContent').textContent = result.content;
    $('#aiTutorDialog').showModal();
  } catch (error) {
    $('#aiConfirmDialog').close();
    showToast('AI导师未能回应', `${error.message}；本章次数没有消耗。`, true);
  } finally {
    aiTutorBusy = false;
    button.disabled = false;
    button.textContent = '确认召唤';
    updateAiTutorButton();
  }
}

function skipQuest() {
  const lesson = currentLesson();
  if (!confirm(`暂时跳过“${lesson.title}”？你可以随时从地图返回补做。`)) return;
  if (!state.skipped.includes(lesson.id)) state.skipped.push(lesson.id);
  queueSave(false);
  showToast('已标记为待补', '下一项试炼已经开放。');
  if (state.currentQuest < lessons.length - 1 && isUnlocked(state.currentQuest + 1)) openQuest(state.currentQuest + 1);
  else { renderMap(); showView($('#mapView')); }
}

function exportProgress() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `灰烬王冠-旅程备份-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

async function importProgress(file) {
  try {
    const imported = JSON.parse(await file.text());
    if (imported?.version !== 2 || !Array.isArray(imported.completed)) throw new Error('这不是第二版存档。');
    state = normalizeSave({ ...imported, started: true });
    await queueSave(false);
    $('#settingsDialog').close();
    renderMap();
    showToast('旅程已导入', 'progress.json 已经更新。');
  } catch (error) { showToast('无法导入', error.message, true); }
}

$('#continueBtn').addEventListener('click', () => { renderMap(); showView($('#mapView')); });
$('#newJourneyBtn').addEventListener('click', async () => {
  if (state.started && !confirm('重新开始会覆盖本机 JSON 存档。确定继续吗？')) return;
  await startJourney(true);
});
$('#backToMapBtn').addEventListener('click', () => {
  state.drafts[currentLesson().id] = editor.getValue();
  state.inputs[currentLesson().id] = $('#stdinInput').value;
  queueSave(false); renderMap(); showView($('#mapView'));
});
$('#prevQuestBtn').addEventListener('click', () => openQuest(state.currentQuest - 1));
$('#nextQuestBtn').addEventListener('click', () => openQuest(state.currentQuest + 1));
$('#skipQuestBtn').addEventListener('click', skipQuest);
$('#runBtn').addEventListener('click', runCode);
$('#submitBtn').addEventListener('click', submitCode);
$('#answerBtn').addEventListener('click', showAnswer);
$('#resetCodeBtn').addEventListener('click', () => {
  if (!confirm('恢复初始代码会覆盖当前草稿，确定继续吗？')) return;
  editor.setValue(currentLesson().starterCode);
  state.drafts[currentLesson().id] = editor.getValue();
  editor.setDiagnostics([]);
  queueSave(); lastResult = null; renderResult();
});
$('#stdinInput').addEventListener('input', () => {
  state.inputs[currentLesson().id] = $('#stdinInput').value;
  scheduleSave();
});
$('#codeEditor').addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault(); event.stopPropagation(); runCode();
  }
}, true);
$$('.result-tab').forEach(tab => tab.addEventListener('click', () => setResultTab(tab.dataset.tab)));
$('#fontDownBtn').addEventListener('click', () => { editorFontSize = Math.max(12, editorFontSize - 1); editor.setFontSize(editorFontSize); });
$('#fontUpBtn').addEventListener('click', () => { editorFontSize = Math.min(22, editorFontSize + 1); editor.setFontSize(editorFontSize); });
$('#stayBtn').addEventListener('click', () => $('#completionDialog').close());
$('#nextAfterPassBtn').addEventListener('click', () => { $('#completionDialog').close(); openQuest(Math.min(state.currentQuest + 1, lessons.length - 1)); });
$('#closeAnswerBtn').addEventListener('click', () => $('#answerDialog').close());
$('#cancelAnswerBtn').addEventListener('click', () => $('#answerConfirmDialog').close());
$('#confirmAnswerBtn').addEventListener('click', confirmAnswerUse);
$('#applyAnswerBtn').addEventListener('click', () => {
  editor.setValue($('#answerCode').textContent);
  state.drafts[currentLesson().id] = editor.getValue();
  queueSave();
  $('#answerDialog').close();
  showToast('答案已填入编辑器', '你仍然可以修改它，再运行一次看看结果。');
});
$('#settingsBtn').addEventListener('click', openSettings);
$('#challengeSettingsBtn').addEventListener('click', openSettings);
$('#prevChapterBtn').addEventListener('click', () => switchChapter(state.currentChapter - 1));
$('#nextChapterBtn').addEventListener('click', () => switchChapter(state.currentChapter + 1));
$('#closeSettingsBtn').addEventListener('click', () => $('#settingsDialog').close());
$('#saveAiSettingsBtn').addEventListener('click', saveAiSettingsFromDialog);
$('#testAiSettingsBtn').addEventListener('click', testAiSettingsFromDialog);
$('#aiTutorBtn').addEventListener('click', showAiTutorConfirm);
$('#explainCompilerBtn').addEventListener('click', explainCompilerError);
$('#cancelAiTutorBtn').addEventListener('click', () => $('#aiConfirmDialog').close());
$('#confirmAiTutorBtn').addEventListener('click', confirmAiTutor);
$('#closeAiTutorBtn').addEventListener('click', () => $('#aiTutorDialog').close());
$('#exportBtn').addEventListener('click', exportProgress);
$('#importInput').addEventListener('change', event => { const file = event.target.files?.[0]; if (file) importProgress(file); });
$('#resetProgressBtn').addEventListener('click', async () => {
  const answer = prompt('此操作无法撤销。请输入“重新启程”确认清除全部进度：');
  if (answer !== '重新启程') return;
  state = emptySave(); await queueSave(false); $('#settingsDialog').close(); renderStart();
});

try {
  state = await loadSave();
} catch (error) {
  showToast('无法读取本地存档', `${error.message}；已使用临时空白进度。`, true);
}
renderStart();
