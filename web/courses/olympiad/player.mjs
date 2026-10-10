import './olympiad.css';
import { chapters, lessons, credits, grades } from './course.mjs';
import { gradeQuestion, shuffled } from './judge.mjs';
import { createProgress, unlocked } from '../shared/progress.mjs';

const el = (tag, text, className) => { const n = document.createElement(tag); if (text != null) n.textContent = text; if (className) n.className = className; return n; };
const btn = (text, action, className = 'om-btn') => { const n = el('button', text, className); n.type = 'button'; n.addEventListener('click', action); return n; };
const reducedMotion = () => globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Pre-rendered Remotion worked example: native <video> + Chinese captions (WebVTT) + play/pause/replay.
// With prefers-reduced-motion the poster and the step list are shown instead of autoplaying motion.
export function videoPlayer(lesson) {
  const box = el('figure', null, 'om-video'); box.dataset.video = lesson.video;
  const video = el('video'); video.src = `./video/olympiad/${lesson.video}.webm`; video.poster = `./video/olympiad/${lesson.video}.jpg`;
  video.preload = 'metadata'; video.playsInline = true; video.muted = true; video.setAttribute('aria-label', `动画例题：${lesson.title}`);
  const track = el('track'); track.kind = 'captions'; track.srclang = 'zh-CN'; track.label = '中文'; track.src = `./video/olympiad/${lesson.video}.vtt`; // Captions are also burned into the video; the WebVTT track stays available (off by default) for screen readers and the CC menu.
  video.controls = false; video.append(track);
  const bar = el('div', null, 'om-video-bar');
  const play = btn('▶ 播放动画', () => { if (video.paused) video.play().catch(() => {}); else video.pause(); }, 'om-btn primary om-play');
  const replay = btn('↺ 重播', () => { video.currentTime = 0; video.play().catch(() => {}); }, 'om-btn ghost om-replay');
  video.addEventListener('play', () => { play.textContent = '⏸ 暂停'; }); video.addEventListener('pause', () => { play.textContent = '▶ 继续播放'; }); video.addEventListener('ended', () => { play.textContent = '▶ 再看一遍'; });
  bar.append(play, replay);
  const cap = el('figcaption', `🎬 动画例题 · ${lesson.method}`);
  if (reducedMotion()) { box.classList.add('reduced'); const img = el('img'); img.src = video.poster; img.alt = `例题示意图：${lesson.title}`; box.append(img, cap, el('p', '已开启“减少动态效果”，下面用文字分步展示。', 'om-note')); return box; }
  box.append(video, bar, cap); return box;
}

export async function mount(root, context) {
  root.innerHTML = `<section class="olympiad-course"><header class="om-header"><div><p class="om-eyebrow">MATH THINKING · 先讲解，后测验</p><h1>奥数思维课</h1>
    <p class="om-sub">${chapters.length} 个单元 · ${lessons.length} 关 · 🌱 小学低年级 → 🌿 中年级 → 🌳 高年级 → 🚀 初中</p></div>
    <div class="om-meter-wrap"><div class="om-meter" role="progressbar" aria-label="课程进度" aria-valuemin="0" aria-valuemax="100"><span></span></div><span class="om-meter-label"></span>
    <button type="button" class="om-btn ghost om-credits-btn">来源与版权</button></div></header>
    <div class="om-layout"><nav class="om-nav" aria-label="课程单元"></nav><main class="om-main"></main></div></section>`;
  const $ = s => root.querySelector(s);
  const status = el('p', '', 'om-status'); status.setAttribute('role', 'status');
  const report = error => { status.textContent = error.message; status.classList.add('error'); };
  const progress = createProgress(context, lessons, report);
  const state = () => progress.state;
  const current = () => lessons.find(l => l.id === state().currentLessonId) ?? lessons[0];
  const record = lesson => { const v = state().responses[lesson.id]; const safe = v && typeof v === 'object' && !Array.isArray(v) ? v : {}; safe.answers = safe.answers && typeof safe.answers === 'object' ? safe.answers : {}; state().responses[lesson.id] = safe; return safe; };
  let busy = false;

  function renderHeader() {
    const percent = Math.round(state().completed.length / lessons.length * 100);
    $('.om-meter').setAttribute('aria-valuenow', String(percent)); $('.om-meter > span').style.width = `${percent}%`;
    $('.om-meter-label').textContent = `已完成 ${state().completed.length} / ${lessons.length}`;
    const nodes = []; let lastGrade;
    chapters.forEach((chapter, ci) => {
      if (chapter.grade !== lastGrade) { lastGrade = chapter.grade; const g = grades[chapter.grade]; nodes.push(el('p', `${g.emoji} ${g.name}`, `om-grade grade-${chapter.grade}`)); }
      const group = el('section', null, 'om-nav-unit'); const done = chapter.lessons.filter(l => state().completed.includes(l.id)).length;
      group.append(el('h3', `${ci + 1}. ${chapter.title}`), el('small', `${done}/${chapter.lessons.length}`));
      for (const lesson of chapter.lessons) {
        const index = lessons.indexOf(lesson), open = unlocked(lessons, state(), index), complete = state().completed.includes(lesson.id);
        const item = btn(`${complete ? '✓' : open ? (lesson.kind === 'exam' ? '✎' : '○') : '🔒'} ${lesson.kind === 'exam' ? '单元测试' : lesson.title}`, () => go(index), 'om-nav-item');
        item.dataset.lessonId = lesson.id; item.disabled = !open; item.classList.toggle('active', lesson === current()); item.classList.toggle('done', complete); group.append(item);
      }
      nodes.push(group);
    });
    $('.om-nav').replaceChildren(...nodes);
  }

  function renderTeach(lesson, main, saved, onRead) {
    const teach = el('section', null, 'om-step om-teach'); teach.dataset.step = 'teach';
    const t = lesson.teach;
    teach.append(el('p', '第 1 步 · 讲解', 'om-step-label'), el('span', `🧠 思维方法：${lesson.method}`, 'om-method'));
    const hook = el('div', null, 'om-hook'); hook.append(el('strong', '🤔 想一想'), el('p', t.hook)); teach.append(hook);
    const life = el('div', null, 'om-life'); life.append(el('strong', '🏠 生活中的例子'), el('p', t.life)); teach.append(life);
    const text = el('div', null, 'om-concept'); text.append(el('h3', '💡 方法讲解')); t.concept.forEach(p => text.append(el('p', p))); teach.append(text);
    const example = el('div', null, 'om-example'); example.append(el('h3', '✏️ 动画例题'), el('p', t.example.problem, 'om-problem'));
    example.append(videoPlayer(lesson));
    const steps = el('ol', null, 'om-solution'), answer = el('p', `答案：${t.example.answer}`, 'om-example-answer');
    let shown = saved.read || reducedMotion() ? t.example.steps.length : 0;
    const finish = btn('我已读完讲解，开始测验 →', () => { if (busy) return; saved.read = true; progress.schedule(); finish.disabled = true; onRead(); }, 'om-btn primary om-finish-teach');
    const reveal = btn('显示下一步解答', () => { shown += 1; draw(); });
    const draw = () => { steps.replaceChildren(...t.example.steps.slice(0, shown).map(s => el('li', s))); const all = shown >= t.example.steps.length; reveal.hidden = all; answer.hidden = !all; finish.hidden = !all; finish.disabled = Boolean(saved.read); if (saved.read) finish.textContent = '✓ 讲解已读完，测验已解锁'; };
    example.append(steps, answer, reveal); teach.append(example);
    const fun = el('div', null, 'om-funfact'); fun.append(el('strong', '🌟 你知道吗？'), el('p', t.funFact)); teach.append(fun);
    teach.append(finish); draw(); main.append(teach);
  }

  function renderQuiz(lesson, main, saved) {
    const quiz = el('section', null, `om-step om-quiz${saved.read || lesson.kind === 'exam' ? '' : ' locked'}`); quiz.dataset.step = 'quiz';
    quiz.append(el('p', lesson.kind === 'exam' ? '单元测试' : '第 2 步 · 测验', 'om-step-label'));
    if (lesson.kind !== 'exam' && !saved.read) { quiz.append(el('p', '🔒 先看完上面的讲解和动画例题，再开始测验。', 'om-locked-note')); main.append(quiz); return; }
    quiz.append(el('p', '填空题只填数字即可（可以写分数，例如 2/3）。', 'om-hint'));
    const checks = [];
    lesson.questions.forEach((question, index) => {
      const field = el('fieldset', null, 'om-question'); field.dataset.questionId = question.id;
      const legend = el('legend'); legend.append(el('span', String(index + 1), 'om-qnum'), el('span', question.prompt)); field.append(legend);
      const feedback = el('div', null, 'om-feedback'); feedback.setAttribute('aria-live', 'polite');
      const save = value => { saved.answers[question.id] = value; progress.schedule(); feedback.replaceChildren(); field.classList.remove('right', 'wrong'); };
      if (question.type === 'choice') {
        for (const option of shuffled(question.options, question.id)) { const label = el('label', null, 'om-choice'), input = el('input'); input.type = 'radio'; input.name = question.id; input.value = option; input.checked = saved.answers[question.id] === option; input.addEventListener('change', () => save(option)); label.append(input, el('span', option)); field.append(label); }
      } else {
        const input = el('input', null, 'om-input'); input.type = 'text'; input.inputMode = 'decimal'; input.autocomplete = 'off'; input.setAttribute('aria-label', `第 ${index + 1} 题答案`);
        input.value = typeof saved.answers[question.id] === 'string' ? saved.answers[question.id] : ''; input.addEventListener('input', () => save(input.value)); field.append(input);
      }
      if (lesson.kind !== 'exam') { const hint = el('p', `💡 提示：${question.hint}`, 'om-hint-text'); hint.hidden = true; const hb = btn('💡 给我一点提示', () => { hint.hidden = false; hb.hidden = true; state().hints[lesson.id] = (Number(state().hints[lesson.id]) || 0) + 1; progress.schedule(); }, 'om-btn ghost om-hint-btn'); field.append(hb, hint); }
      field.append(feedback); quiz.append(field);
      checks.push(() => { const ok = gradeQuestion(question, saved.answers[question.id]); field.classList.toggle('right', ok); field.classList.toggle('wrong', !ok);
        feedback.replaceChildren(el('p', ok ? `✓ 答对了！${question.explanation}` : '✗ 差一点点，再想一想。')); if (!ok && lesson.kind !== 'exam') feedback.append(el('p', `📖 讲解：${question.explanation}`, 'om-explain')); return ok; });
    });
    const summary = el('p', null, 'om-summary'); summary.setAttribute('role', 'status');
    const submit = btn(lesson.kind === 'exam' ? '提交单元测试' : '提交测验', async () => {
      if (busy) return;
      const results = checks.map(c => c()), right = results.filter(Boolean).length;
      saved.attempts = (Number(saved.attempts) || 0) + 1; state().attempts[lesson.id] = saved.attempts;
      state().scores[lesson.id] = Math.max(Number(state().scores[lesson.id]) || 0, Math.round(right / results.length * 100));
      if (right === results.length) { if (!state().completed.includes(lesson.id)) state().completed.push(lesson.id); summary.textContent = `全部正确（${right}/${results.length}）！${lesson.kind === 'exam' ? '本单元完成。' : '下一关已解锁。'}`; summary.className = 'om-summary pass'; }
      else { summary.textContent = `答对 ${right}/${results.length}，看看提示和讲解，改正后再提交。`; summary.className = 'om-summary retry'; }
      busy = true; try { await progress.persist(); } catch (e) { report(e); } finally { busy = false; }
      renderHeader(); updateFooter();
    }, 'om-btn primary om-submit');
    quiz.append(submit, summary); main.append(quiz);
  }

  let nextButton;
  function updateFooter() { if (!nextButton) return; const i = lessons.indexOf(current()); nextButton.disabled = i === lessons.length - 1 || !unlocked(lessons, state(), i + 1); }
  function render() {
    const lesson = current(), chapter = chapters[lesson.chapterIndex], main = $('.om-main'), saved = record(lesson), g = grades[chapter.grade];
    main.replaceChildren(status);
    if (chapter.source === 'openstax' && lesson.localIndex === 0) main.append(el('p', '本单元讲解与例题改编自 OpenStax《Prealgebra 2e》§8.1–8.2（CC BY-NC-SA 4.0，仅限非商业使用）。', 'om-goal'));
    main.append(el('p', `${g.emoji} ${g.name} · 单元 ${lesson.chapterIndex + 1} · ${chapter.title} · ${lesson.kind === 'exam' ? '单元测试' : `第 ${lesson.localIndex + 1} 关`}`, 'om-topic'), el('h2', lesson.title));
    if (lesson.kind === 'exam') {
      const recap = el('section', null, 'om-step om-recap'); recap.append(el('p', '考前回顾', 'om-step-label'), el('p', '本单元学到的思维方法。测试不给提示，全部答对即完成本单元。'));
      const list = el('ul'); lesson.recap.forEach(r => list.append(el('li', `🧠 ${r.method} —— ${r.title}`))); recap.append(list); main.append(recap); renderQuiz(lesson, main, saved);
    } else { const slot = el('div'); renderTeach(lesson, main, saved, () => { slot.replaceChildren(); renderQuiz(lesson, slot, saved); slot.querySelector('.om-quiz')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }); main.append(slot); renderQuiz(lesson, slot, saved); }
    const footer = el('footer', null, 'om-footer'), index = lessons.indexOf(lesson);
    const prev = btn('← 上一关', () => go(index - 1)); prev.disabled = index === 0;
    nextButton = btn('下一关 →', () => go(index + 1), 'om-btn primary'); footer.append(prev, nextButton); main.append(footer);
    renderHeader(); updateFooter();
  }
  async function go(index) {
    if (busy || !lessons[index] || !unlocked(lessons, state(), index)) return;
    busy = true;
    try { state().currentLessonId = lessons[index].id; state().started = true; state().mapChapter = lessons[index].chapterIndex; await progress.persist(); } catch (e) { report(e); } finally { busy = false; }
    render(); $('.om-main').scrollIntoView({ block: 'start' });
  }
  $('.om-credits-btn').addEventListener('click', () => {
    const dialog = el('dialog', null, 'om-dialog'); dialog.append(el('h2', '来源与版权'), el('p', credits.text), el('p', credits.changes), el('p', credits.tools));
    const list = el('ul'); for (const src of credits.sources) { const li = el('li'), a = el('a', src.title); a.href = src.url; a.target = '_blank'; a.rel = 'noopener'; li.append(a, document.createTextNode(` · ${src.license}`)); list.append(li); }
    dialog.append(list, btn('关闭', () => dialog.close(), 'om-btn primary'));
    dialog.addEventListener('close', () => dialog.remove()); $('.olympiad-course').append(dialog); dialog.showModal();
  });
  render();
  return { async flush() { if (busy) throw new Error('请等待当前操作完成后再切换课程。'); await progress.flush(); }, dispose() { progress.dispose(); root.replaceChildren(); } };
}
