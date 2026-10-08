import { PUBLIC_SITE } from '../../deployment.mjs';
import { chapters, lessons, solutions, chapterStart } from './course.mjs';
import { CompilerService } from './compiler.mjs';
import { createEditor } from './editor.mjs';
import { gradeLesson, visibleOutput } from './judge.mjs';
import { emptySave, normalizeSave } from './save-store.mjs';
import template from './view.html?raw';
import { consumeAnswerToken, tokenCount } from './answer-store.mjs';
import { loadAiSettings, requestAiTutor, requestCompilerExplanation, saveAiSettings, testAiConnection } from '../../ai-service.mjs';
import { EN, ZH, applyStaticLanguage, localizeChapter, localizeLesson, localizeStarterCode, pick, runtimeStatus } from './i18n.mjs';

export async function mount(root, context) {
  if (context.progress != null && context.progress.version !== 2) throw new Error('Unsupported C progress version / 不支持此 C 课程存档版本');
  root.innerHTML = template;
  const writeSave = context.saveProgress;
  const $ = selector => root.querySelector(selector);
  const $$ = selector => [...root.querySelectorAll(selector)];
  let state = normalizeSave({ ...emptySave(), ...context.progress, language: context.language });
  let activeTab = 'console';
  let lastResult = null;
  let saveTimer;
  let saveChain = Promise.resolve();
  let saveError = null;
  let settingsBusy = false;
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
    badge.textContent = runtimeStatus(text, state.language);
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
    root.appendChild(bridge);
  }

  function queueSave(showStatus = true) {
    state.updatedAt = new Date().toISOString();
    const snapshot = structuredClone(state);
    if (showStatus) $('#saveState').textContent = tr('○ Writing JSON', '○ 正在写入 JSON');
    saveChain = saveChain
      .catch(() => {})
      .then(() => writeSave(snapshot))
      .then(saved => {
        saveError = null;
        state.updatedAt = saved.updatedAt;
        if (showStatus) $('#saveState').textContent = tr('● JSON save stored', '● JSON 存档已保存');
      })
      .catch(error => {
        saveError = error;
        if (showStatus) $('#saveState').textContent = tr('× Save failed', '× 存档失败');
        showToast(tr('Local Save Failed', '本地存档写入失败'), localizedError(error.message), true);
      });
    updateStats();
    return saveChain;
  }

  function scheduleSave() {
    $('#saveState').textContent = tr('○ Waiting to write JSON', '○ 等待写入 JSON');
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => queueSave(), 450);
  }

  function level() { return Math.floor(state.xp / 100) + 1; }
  function completedCount() { return state.completed.length; }
  function currentLesson() { return lessons[state.currentQuest]; }
  function currentChapter() { return chapters[state.currentChapter] ?? chapters[0]; }
  function shownLesson(lesson = currentLesson()) { return localizeLesson(lesson, state.language); }
  function shownChapter(chapter = currentChapter()) { return localizeChapter(chapter, state.language); }
  function tr(english, chinese) { return pick(state.language, english, chinese); }
  function localizedError(message = '') {
    if (state.language === ZH) return message;
    return message
      .replace(/读取存档失败（HTTP (\d+)）/, 'Failed to read save (HTTP $1)')
      .replace(/保存失败（HTTP (\d+)）/, 'Save failed (HTTP $1)')
      .replace(/请求失败（HTTP (\d+)）/, 'Request failed (HTTP $1)');
  }
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
      answerButton.textContent = used ? tr('🔮 View Answer Again', '🔮 再看正确答案') : tr('🔮 Reveal Answer', '🔮 查看正确答案');
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
    button.textContent = used ? tr('🧙 Used This Chapter', '🧙 本章已使用') : failures < 3 ? tr(`🧙 AI Mentor ${failures}/3`, `🧙 AI导师 ${failures}/3`) : aiTutorBusy ? tr('🧙 Asking…', '🧙 正在请教…') : tr('🧙 AI Mentor Ready', '🧙 AI导师可用');
    button.title = used ? tr('The AI Mentor can be used once per chapter', 'AI导师每章只能使用一次') : failures < 3 ? tr(`${3 - failures} more consecutive failed submissions required`, `还需连续提交错误 ${3 - failures} 次`) : tr('This chapter’s one AI Mentor use is unlocked', '本章唯一一次AI导师已经解锁');
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
    if (lesson.localIndex === chapters[lesson.chapterIndex].total - 1 && completedInChapter(chapters[lesson.chapterIndex]) < chapters[lesson.chapterIndex].total - 2) return false;
    const previousId = lessons[index - 1].id;
    return state.completed.includes(previousId) || state.skipped.includes(previousId);
  }

  async function startJourney(reset = false) {
    if (reset) state = { ...emptySave(), language: state.language };
    state.started = true;
    state.currentChapter = 0;
    await queueSave(false);
    renderMap();
    showView($('#mapView'));
  }

  function renderStart() {
    applyStaticLanguage(state.language, root);
    document.documentElement.lang = state.language;
    const hasSave = state.started;
    $('#continueBtn').hidden = !hasSave;
    $('#saveSummary').hidden = !hasSave;
    if (hasSave) {
      const rawNext = lessons[Math.min(state.currentQuest, lessons.length - 1)];
      const savedChapter = chapters[rawNext.chapterIndex] ?? chapters[0];
      const next = shownLesson(rawNext);
      const visibleChapter = shownChapter(savedChapter);
      $('#saveSummary').textContent = tr(`${visibleChapter.title} ${completedInChapter(savedChapter)}/${savedChapter.total} · Total ${completedCount()}/${lessons.length} · Latest: ${next.title}`, `${visibleChapter.title} ${completedInChapter(savedChapter)}/${savedChapter.total} · 总进度 ${completedCount()}/${lessons.length} · 最近任务：${next.title}`);
      $('#newJourneyBtn').textContent = tr('Restart Journey', '重新开始');
    }
    updateStats();
    showView($('#startView'));
  }

  function renderMap() {
    applyStaticLanguage(state.language, root);
    document.documentElement.lang = state.language;
    const chapter = currentChapter();
    const visibleChapter = shownChapter(chapter);
    const path = $('#questPath');
    path.replaceChildren();
    chapter.lessons.forEach((lesson, localIndex) => {
      const visibleLesson = shownLesson(lesson);
      const index = chapterStart(state.currentChapter) + localIndex;
      const unlocked = isUnlocked(index);
      const status = statusFor(index);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `quest-node ${unlocked ? 'unlocked' : 'locked'} ${status !== 'open' ? status : ''} ${index === state.currentQuest ? 'current' : ''}`;
      button.disabled = !unlocked;
      button.title = unlocked ? `${lesson.id} ${visibleLesson.title}` : tr('Complete the previous trial to unlock', '完成前一项试炼后开放');
      const icon = status === 'completed' ? '✓' : status === 'skipped' ? '!' : unlocked ? String(localIndex + 1).padStart(2, '0') : '🔒';
      button.innerHTML = `<span class="node-orb">${icon}</span><small>${visibleLesson.title}</small>`;
      if (unlocked) button.addEventListener('click', () => openQuest(index));
      path.appendChild(button);
    });
    const progress = completedInChapter(chapter);
    $('#mapProgressBar').style.width = `${progress / chapter.total * 100}%`;
    $('#mapProgressText').textContent = `${progress} / ${chapter.total}`;
    $('#mapRune').textContent = visibleChapter.rune;
    $('#mapChapterTitle').textContent = visibleChapter.title;
    $('#mapChapterDescription').textContent = visibleChapter.description;
    $('#chapterCounter').textContent = tr(`Chapter ${state.currentChapter + 1} / ${chapters.length}`, `第 ${state.currentChapter + 1} / ${chapters.length} 章`);
    $('#questPath').setAttribute('aria-label', tr(`${visibleChapter.title} quest route`, `${visibleChapter.title}任务路线`));
    $('#prevChapterBtn').disabled = state.currentChapter === 0;
    $('#nextChapterBtn').disabled = state.currentChapter === chapters.length - 1 || !isChapterUnlocked(state.currentChapter + 1);

    const cards = $('#chapterCards');
    cards.replaceChildren(...chapters.map((item, index) => {
      const visibleItem = shownChapter(item);
      const unlocked = isChapterUnlocked(index);
      const done = completedInChapter(item);
      const card = document.createElement('article');
      card.className = `region-card ${unlocked ? 'unlocked' : ''} ${index === state.currentChapter ? 'current' : ''}`;
      const previous = index ? shownChapter(chapters[index - 1]).title : '';
      const status = unlocked ? `${done}/${item.total} · ${visibleItem.subtitle}` : tr(`Complete ${previous} to unlock`, `完成${previous}后开放`);
      card.innerHTML = `<span>${item.numeral}</span><div><b>${visibleItem.title}</b><small>${status}</small></div><button type="button" ${unlocked ? '' : 'disabled'} aria-label="${visibleItem.title}">${unlocked ? (index === state.currentChapter ? '●' : '→') : '🔒'}</button>`;
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
    if (busy || aiTutorBusy || compilerExplainBusy) return;
    if (!isUnlocked(index)) return;
    state.currentQuest = index;
    state.currentChapter = lessons[index].chapterIndex;
    queueSave(false);
    renderQuest();
    showView($('#challengeView'));
    setTimeout(() => editor.focus(), 0);
  }

  function renderQuest() {
    applyStaticLanguage(state.language, root);
    document.documentElement.lang = state.language;
    const lesson = currentLesson();
    const visibleLesson = shownLesson(lesson);
    const index = state.currentQuest;
    const chapter = chapters[lesson.chapterIndex];
    const visibleChapter = shownChapter(chapter);
    const localIndex = lesson.localIndex;
    $('#challengeCrumb').textContent = `${visibleChapter.title} / ${visibleLesson.title}`;
    $('#questCounter').textContent = `${String(localIndex + 1).padStart(2, '0')} / ${chapter.total}`;
    $('#questEyebrow').textContent = tr(`${lesson.id} · ${visibleChapter.title} Trial`, `${lesson.id} · ${visibleChapter.title}试炼`);
    $('#questTitle').textContent = visibleLesson.title;
    $('#difficultyChip').textContent = visibleLesson.difficulty;
    $('#knowledgeChip').textContent = visibleLesson.knowledge;
    $('#timeChip').textContent = tr(`About ${lesson.minutes} min`, `约 ${lesson.minutes} 分钟`);
    $('#questQuote').textContent = visibleLesson.quote;
    $('#questStory').textContent = visibleLesson.story;
    $('#questObjective').innerHTML = visibleLesson.objective;
    $('#questRules').innerHTML = visibleLesson.rules;
    $('#prevQuestBtn').disabled = localIndex === 0 || !isUnlocked(index - 1);
    $('#nextQuestBtn').disabled = localIndex === chapter.total - 1 || !isUnlocked(index + 1);

    const hintsOpened = new Set(state.hints[lesson.id] ?? []);
    $('#hintList').replaceChildren(...visibleLesson.hints.map((hintText, hintIndex) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `hint ${hintsOpened.has(hintIndex) ? 'open' : ''}`;
      const hintNames = state.language === ZH ? ['提示一 · 方向', '提示二 · 步骤', '提示三 · 骨架'] : ['Hint 1 · Direction', 'Hint 2 · Steps', 'Hint 3 · Skeleton'];
      button.innerHTML = `<span class="hint-head">${hintNames[hintIndex]}<b>${hintsOpened.has(hintIndex) ? '−' : '＋'}</b></span><span class="hint-body">${hintText}</span>`;
      button.addEventListener('click', () => toggleHint(hintIndex, button));
      return button;
    }));

    editor.setValue(state.drafts[lesson.id] ?? localizeStarterCode(lesson.starterCode, state.language));
    editor.setDiagnostics([]);
    $('#stdinInput').value = state.inputs[lesson.id] ?? lesson.defaultInput ?? '';
    updateSkipVisibility();
    const failures = state.consecutiveFailures?.[lesson.id] ?? 0;
    $('#attemptLabel').textContent = tr(`Submitted ${state.attempts[lesson.id] ?? 0} times · Consecutive failures ${failures}/3`, `正式提交 ${state.attempts[lesson.id] ?? 0} 次 · 连续错误 ${failures}/3`);
    lastResult = null;
    setResultTab('console');
    $('#questPanel').scrollTop = 0;
    updateStats();
  }

  function openAnswerDialog(lesson, answer, alreadyRevealed) {
    const chapterId = lesson.chapterId;
    $('#answerCode').textContent = answer;
    $('#answerDialogCopy').textContent = alreadyRevealed
      ? tr('This answer is already unlocked. No additional crystal will be spent.', '这道题已经解锁过答案，不会再次消耗水晶。')
      : tr(`This chapter has ${tokenCount(state, chapterId)} crystals left. Use the answer as a reference, then run it yourself.`, `本章还剩 ${tokenCount(state, chapterId)} 枚真知水晶。答案仅供参考，建议重新输入并运行一次。`);
    $('#answerDialog').showModal();
  }

  function showAnswer() {
    const lesson = currentLesson();
    const answer = solutions[state.currentQuest];
    if (!answer) {
      showToast(tr('Answer Not Available', '答案暂未配置'), tr('This quest has not been added to the answer archive.', '这道题还没有加入真知水晶的答案库。'), true);
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
      showToast(tr('No Crystals Left', '真知水晶已经用完'), tr('Each chapter provides only 3 crystals for 20 quests.', '本章20题只有3枚水晶。'), true);
      return;
    }
    $('#answerConfirmCopy').textContent = tr(`Revealing the full answer to “${shownLesson(lesson).title}” costs 1 crystal. Remaining: ${remaining}.`, `查看“${shownLesson(lesson).title}”的完整答案会消耗1枚水晶。当前剩余：${remaining}枚。`);
    $('#answerConfirmDialog').showModal();
  }

  function confirmAnswerUse() {
    const lesson = currentLesson();
    const answer = solutions[state.currentQuest];
    if (!consumeAnswerToken(state, lesson.id, lesson.chapterId)) {
      $('#answerConfirmDialog').close();
      showToast(tr('No Crystals Left', '真知水晶已经用完'), tr('Each chapter provides only 3 crystals for 20 quests.', '本章20题只有3枚水晶。'), true);
      return;
    }
    queueSave(false);
    $('#answerConfirmDialog').close();
    showToast(tr('Crystal Spent', '水晶已消耗'), tr(`${tokenCount(state, lesson.chapterId)} crystals remain in this chapter.`, `本章还剩 ${tokenCount(state, lesson.chapterId)} 枚真知水晶。`));
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
    button.textContent = compilerExplainBusy ? tr('✨ Explaining…', '✨ 正在解释…') : tr('✨ Explain with AI', '✨ AI解释错误');
  }

  function formatTests(result) {
    if (!result?.tests?.length) return tr('No formal test results yet.', '还没有正式测试结果。');
    const lines = result.tests.map(test => `${test.passed ? '✓' : '✕'} ${test.name}\n  ${test.message}`);
    const failedDiff = result.tests.find(test => !test.passed && 'expected' in test);
    if (failedDiff) lines.push(tr(`\nYour output:\n${visibleOutput(failedDiff.actual, state.language)}\n\nExpected output:\n${visibleOutput(failedDiff.expected, state.language)}`, `\n你的输出：\n${visibleOutput(failedDiff.actual, state.language)}\n\n预期输出：\n${visibleOutput(failedDiff.expected, state.language)}`));
    return lines.join('\n');
  }

  function formatCompiler(result) {
    const execution = result?.execution ?? result;
    if (!execution) return tr('Run the code to see real Clang compiler information here.', '运行代码后，这里会显示真正的 Clang 编译信息。');
    if (execution.ok && !execution.stderr) return tr('✓ Clang compilation passed and the program ended normally.', '✓ Clang 编译通过，程序正常结束。');
    const localized = execution.diagnostics?.map(item => tr(`${item.level === 'warning' ? '△' : '✕'} Line ${item.line}:${item.column} ${item.message}`, `${item.level === 'warning' ? '△' : '✕'} 第${item.line}行:${item.column} ${item.message}`)).join('\n');
    return [localized, execution.stderr].filter(Boolean).join('\n\n') || tr(`Program exit code: ${execution.code}`, `程序退出码：${execution.code}`);
  }

  function renderResult() {
    const panel = $('#resultContent');
    panel.className = 'result-content';
    updateCompilerExplainButton();
    if (!lastResult) {
      panel.textContent = activeTab === 'console' ? tr('Waiting to run the program…', '等待运行程序…') : activeTab === 'tests' ? tr('Submit the rune to see each test result.', '提交符文后，这里会显示逐项测试结果。') : tr('Run the code to see real Clang compiler information here.', '运行代码后，这里会显示真正的 Clang 编译信息。');
      return;
    }
    const execution = lastResult.execution ?? lastResult;
    if (activeTab === 'console') {
      panel.textContent = execution.ok ? tr(`> Program finished (exit code ${execution.code})\n\n${execution.output || '(no output)'}`, `> 程序运行结束（退出码 ${execution.code}）\n\n${execution.output || '(没有输出)'}`) : tr(`> Program did not finish successfully\n\n${formatCompiler(lastResult)}`, `> 程序没有成功结束\n\n${formatCompiler(lastResult)}`);
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
    const visibleLesson = shownLesson(lesson);
    compilerExplainBusy = true;
    updateCompilerExplainButton();
    try {
      const result = await requestCompilerExplanation({
        lessonId: lesson.id,
        title: visibleLesson.title,
        objective: visibleLesson.objective,
        rules: visibleLesson.rules,
        code: editor.getValue(),
        compilerMessage: formatCompiler(lastResult),
        output: execution.output ?? ''
      });
      $('#aiTutorTitle').textContent = tr(`${visibleLesson.title} · Error Explanation`, `${visibleLesson.title} · 错误解释`);
      $('#aiTutorDisclaimer').textContent = tr('This explanation does not spend the chapter’s AI Mentor use. Real Clang results remain authoritative.', '这次解释不消耗每章一次的AI导师机会；最终仍以真实Clang编译结果为准。');
      $('#aiTutorContent').textContent = result.content;
      $('#aiTutorDialog').showModal();
    } catch (error) {
      showToast(tr('AI Could Not Explain the Error', 'AI未能解释错误'), tr(`${error.message}. Check the API connection in Settings.`, `${error.message}。请确认设置中的API连接正常。`), true);
    } finally {
      compilerExplainBusy = false;
      updateCompilerExplainButton();
    }
  }

  function setBusy(value) {
    busy = value;
    $('#runBtn').disabled = value;
    $('#submitBtn').disabled = value;
    $('#runBtn').textContent = value ? tr('⏳ Compiling…', '⏳ 编译中…') : tr('▶ Run Code', '▶ 运行代码');
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
    lastResult = gradeLesson(lesson, editor.getValue(), execution, state.language);
    setResultTab(lastResult.passed ? 'tests' : execution.ok ? 'tests' : 'compiler');
    $('#attemptLabel').textContent = tr(`Submitted ${state.attempts[id]} times · Running never reduces rewards`, `正式提交 ${state.attempts[id]} 次 · 运行不会扣除奖励`);
    updateSkipVisibility();
    if (lastResult.passed) completeQuest();
    else {
      state.consecutiveFailures[id] = (state.consecutiveFailures[id] ?? 0) + 1;
      $('#attemptLabel').textContent = tr(`Submitted ${state.attempts[id]} times · Consecutive failures ${state.consecutiveFailures[id]}/3`, `正式提交 ${state.attempts[id]} 次 · 连续错误 ${state.consecutiveFailures[id]}/3`);
      updateAiTutorButton();
      queueSave(false);
      showToast(tr('The Rune Has Not Responded', '符文尚未响应'), lastResult.tests.find(test => !test.passed)?.message ?? tr('Check the Clang error details.', '请查看 Clang 的错误提示。'), true);
    }
  }

  function completeQuest() {
    const lesson = currentLesson();
    const visibleLesson = shownLesson(lesson);
    state.consecutiveFailures[lesson.id] = 0;
    const firstPass = !state.completed.includes(lesson.id);
    if (firstPass) {
      state.completed.push(lesson.id);
      state.skipped = state.skipped.filter(id => id !== lesson.id);
      state.xp += lesson.localIndex === chapters[lesson.chapterIndex].total - 1 ? 40 : 20;
      state.gold += lesson.localIndex === chapters[lesson.chapterIndex].total - 1 ? 20 : 10;
    }
    queueSave(false);
    $('#completionTitle').textContent = firstPass ? tr(`${visibleLesson.title} · Complete`, `${visibleLesson.title} · 完成`) : tr('The Rune Answers Again', '符文再次回应');
    $('#completionStory').textContent = visibleLesson.passStory;
    $('#xpReward').textContent = firstPass ? (lesson.localIndex === chapters[lesson.chapterIndex].total - 1 ? 40 : 20) : 0;
    $('#goldReward').textContent = firstPass ? (lesson.localIndex === chapters[lesson.chapterIndex].total - 1 ? 20 : 10) : 0;
    $('#nextAfterPassBtn').hidden = state.currentQuest === lessons.length - 1;
    $('#completionDialog').showModal();
  }

  async function openSettings() {
    if (settingsBusy) return;
    settingsBusy = true;
    try {
    applyStaticLanguage(state.language, root);
    document.documentElement.lang = state.language;
    $('#settingsDialog').showModal();
    if (PUBLIC_SITE) return;
    const status = $('#aiSettingsStatus');
    status.className = 'ai-settings-status';
    status.textContent = tr('Reading local AI settings…', '正在读取本机AI设置…');
    try {
      const settings = await loadAiSettings();
      $('#aiApiUrl').value = settings.apiUrl ?? '';
      $('#aiModel').value = settings.model ?? '';
      $('#aiApiKey').value = '';
      $('#aiApiKey').placeholder = settings.hasApiKey ? tr('API key saved; leave blank to keep it', '已保存API Key；留空则保持不变') : tr('Leave blank for local services without authentication', '本地无鉴权服务可留空');
      status.textContent = settings.configured ? tr('The AI API is configured. You can test the connection.', 'AI接口已配置，可以测试连接。') : tr('The AI API is not configured yet.', '尚未配置AI接口。');
    } catch (error) {
      status.className = 'ai-settings-status error';
      status.textContent = error.message;
    }

    } finally { settingsBusy = false; }
  }

  function aiSettingsFromForm() {
    return { apiUrl: $('#aiApiUrl').value.trim(), model: $('#aiModel').value.trim(), apiKey: $('#aiApiKey').value.trim() };
  }

  async function persistAiSettings() {
    const status = $('#aiSettingsStatus');
    status.className = 'ai-settings-status';
    status.textContent = tr('Saving AI settings…', '正在保存AI设置…');
    const result = await saveAiSettings(aiSettingsFromForm());
    $('#aiApiKey').value = '';
    $('#aiApiKey').placeholder = result.hasApiKey ? tr('API key saved; leave blank to keep it', '已保存API Key；留空则保持不变') : tr('Leave blank for local services without authentication', '本地无鉴权服务可留空');
    status.className = 'ai-settings-status success';
    status.textContent = tr('AI settings were saved locally.', 'AI设置已保存到本机。');
  }

  async function saveAiSettingsFromDialog() {
    if (settingsBusy) return;
    settingsBusy = true;
    try {
    try { await persistAiSettings(); }
    catch (error) {
      $('#aiSettingsStatus').className = 'ai-settings-status error';
      $('#aiSettingsStatus').textContent = error.message;
    }

    } finally { settingsBusy = false; }
  }

  async function testAiSettingsFromDialog() {
    if (settingsBusy) return;
    settingsBusy = true;
    try {
    const button = $('#testAiSettingsBtn');
    button.disabled = true;
    button.textContent = tr('Testing…', '正在测试…');
    try {
      await persistAiSettings();
      const result = await testAiConnection();
      $('#aiSettingsStatus').className = 'ai-settings-status success';
      $('#aiSettingsStatus').textContent = tr(`Connected. Model reply: ${result.reply}`, `连接成功，模型回复：${result.reply}`);
    } catch (error) {
      $('#aiSettingsStatus').className = 'ai-settings-status error';
      $('#aiSettingsStatus').textContent = tr(`Connection failed: ${error.message}`, `连接失败：${error.message}`);
    } finally {
      button.disabled = false;
      button.textContent = tr('Test Connection', '测试连接');
    }

    } finally { settingsBusy = false; }
  }

  function showAiTutorConfirm() {
    const lesson = currentLesson();
    const visibleLesson = shownLesson(lesson);
    const failures = state.consecutiveFailures?.[lesson.id] ?? 0;
    if (state.aiTutorUses?.[lesson.chapterId]) {
      showToast(tr('AI Mentor Already Used', '本章已经召唤过AI导师'), tr('The AI Mentor can be used only once per chapter.', '每章只能使用一次AI导师。'), true);
      return;
    }
    if (failures < 3) {
      showToast(tr('AI Mentor Is Still Locked', 'AI导师尚未解锁'), tr(`Submit an incorrect answer ${3 - failures} more consecutive time(s) on this quest.`, `同一道题还需连续提交错误 ${3 - failures} 次。`), true);
      return;
    }
    $('#aiConfirmCopy').textContent = tr(`“${visibleLesson.title}” has failed ${failures} consecutive submissions. The AI Mentor can be used once per chapter; your quest, code, compiler details, and output will be sent to your configured API.`, `“${visibleLesson.title}”已连续提交错误${failures}次。AI导师每章只能使用一次；确认后会发送当前题目、代码、编译信息和输出。`);
    $('#aiConfirmDialog').showModal();
  }

  async function confirmAiTutor() {
    const lesson = currentLesson();
    const visibleLesson = shownLesson(lesson);
    if (state.aiTutorUses?.[lesson.chapterId] || aiTutorBusy) return;
    aiTutorBusy = true;
    updateAiTutorButton();
    const button = $('#confirmAiTutorBtn');
    button.disabled = true;
    button.textContent = tr('Asking…', '正在请教…');
    try {
      const execution = lastResult?.execution ?? lastResult;
      const result = await requestAiTutor({
        lessonId: lesson.id,
        title: visibleLesson.title,
        objective: visibleLesson.objective,
        rules: visibleLesson.rules,
        code: editor.getValue(),
        compilerMessage: formatCompiler(lastResult),
        output: execution?.output ?? ''
      });
      state.aiTutorUses[lesson.chapterId] = true;
      await queueSave(false);
      $('#aiConfirmDialog').close();
      $('#aiTutorTitle').textContent = tr(`${visibleLesson.title} · Mentor’s Whisper`, `${visibleLesson.title} · 导师的低语`);
      $('#aiTutorDisclaimer').textContent = tr('AI provides hints only. Real Clang compilation and tests decide whether you pass.', 'AI只提供提示，最终通关仍以真实Clang编译和测试结果为准。');
      $('#aiTutorContent').textContent = result.content;
      $('#aiTutorDialog').showModal();
    } catch (error) {
      $('#aiConfirmDialog').close();
      showToast(tr('The AI Mentor Did Not Respond', 'AI导师未能回应'), tr(`${error.message}; this chapter’s use was not spent.`, `${error.message}；本章次数没有消耗。`), true);
    } finally {
      aiTutorBusy = false;
      button.disabled = false;
      button.textContent = tr('Summon Mentor', '确认召唤');
      updateAiTutorButton();
    }
  }

  function skipQuest() {
    const lesson = currentLesson();
    const visibleLesson = shownLesson(lesson);
    if (!confirm(tr(`Skip “${visibleLesson.title}” for now? You can return from the map at any time.`, `暂时跳过“${visibleLesson.title}”？你可以随时从地图返回补做。`))) return;
    if (!state.skipped.includes(lesson.id)) state.skipped.push(lesson.id);
    queueSave(false);
    showToast(tr('Marked for Later', '已标记为待补'), tr('The next trial is now open.', '下一项试炼已经开放。'));
    if (state.currentQuest < lessons.length - 1 && isUnlocked(state.currentQuest + 1)) openQuest(state.currentQuest + 1);
    else { renderMap(); showView($('#mapView')); }
  }

  function exportProgress() {
    const blob = new Blob([JSON.stringify({ kind: 'course-progress', version: 1, courseId: 'c', progress: state }, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${tr('ashen-crown-journey', '灰烬王冠-旅程备份')}-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function importProgress(file) {
    try {
      const backup = JSON.parse(await file.text());
      const imported = backup.kind === 'course-progress' && backup.version === 1 && backup.courseId === 'c' ? backup.progress : backup;
      if (imported?.version !== 2 || !Array.isArray(imported.completed)) throw new Error(tr('This is not a Version 2 save file.', '这不是第二版存档。'));
      if (!confirm(tr('Replace this C course’s progress with the backup?', '用备份替换当前 C 课程的进度？'))) return;
      state = normalizeSave({ ...imported, language: state.language });
      await queueSave(false);
      $('#settingsDialog').close();
      if (saveError) throw saveError;
      renderStart();
      showToast(tr('Journey Imported', '旅程已导入'), tr('progress.json has been updated.', 'progress.json 已经更新。'));
    } catch (error) { showToast(tr('Import Failed', '无法导入'), error.message, true); }
  }

  async function toggleLanguage() {
    if (busy || aiTutorBusy || compilerExplainBusy) return;
    const previousLanguage = state.language;
    const source = !$('#challengeView').hidden ? editor.getValue() : null;
    state.language = previousLanguage === ZH ? EN : ZH;
    applyStaticLanguage(state.language, root);
    document.documentElement.lang = state.language;
    if (!$('#challengeView').hidden) {
      if (source === localizeStarterCode(currentLesson().starterCode, previousLanguage)) delete state.drafts[currentLesson().id];
      else state.drafts[currentLesson().id] = source;
      state.inputs[currentLesson().id] = $('#stdinInput').value;
      renderQuest();
    } else if (!$('#mapView').hidden) renderMap();
    else renderStart();
    await queueSave(false);
  }

  $('#continueBtn').addEventListener('click', () => { renderMap(); showView($('#mapView')); });
  $('#newJourneyBtn').addEventListener('click', async () => {
    if (state.started && !confirm(tr('Restart this C course? Other courses will keep their progress.', '重新开始当前 C 课程？其他课程的进度会保留。'))) return;
    await startJourney(true);
  });
  $('#backToMapBtn').addEventListener('click', () => {
    if (busy || aiTutorBusy || compilerExplainBusy) return;
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
    if (!confirm(tr('Restoring the starter code will overwrite your draft. Continue?', '恢复初始代码会覆盖当前草稿，确定继续吗？'))) return;
    editor.setValue(localizeStarterCode(currentLesson().starterCode, state.language));
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
    showToast(tr('Answer Inserted', '答案已填入编辑器'), tr('You can still edit it and run it again.', '你仍然可以修改它，再运行一次看看结果。'));
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
  $$('[data-language-toggle]').forEach(button => button.addEventListener('click', toggleLanguage));
  $('#resetProgressBtn').addEventListener('click', async () => {
    const phrase = tr('RESET JOURNEY', '重新启程');
    const answer = prompt(tr(`This cannot be undone. Type “${phrase}” to clear this C course’s progress:`, '此操作无法撤销。请输入“重新启程”确认清除当前 C 课程进度：'));
    if (answer !== phrase) return;
    const language = state.language;
    state = { ...emptySave(), language }; await queueSave(false); $('#settingsDialog').close(); renderStart();
  });

  renderStart();

  return {
    async flush() {
      if (busy || aiTutorBusy || compilerExplainBusy || settingsBusy) throw new Error(tr('Please wait for the current operation to finish.', '请等待当前操作完成后再切换课程。'));
      clearTimeout(saveTimer);
      if (!$('#challengeView').hidden) {
        state.drafts[currentLesson().id] = editor.getValue();
        state.inputs[currentLesson().id] = $('#stdinInput').value;
      }
      await queueSave(false);
      if (saveError) throw saveError;
    },
    dispose() {
      clearTimeout(saveTimer);
      clearTimeout(toastTimer);
      compiler.dispose();
      editor.destroy();
      delete window.__GRAY_CROWN_REGRESSION__;
      root.replaceChildren();
    }
  };
}
