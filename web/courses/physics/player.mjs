import katex from 'katex';
import 'katex/dist/katex.min.css';
import './physics.css';
import { chapters, lessons, credits, images } from './course.mjs';
import { gradeQuestion, shuffled } from './judge.mjs';
import { mountAnimation } from './anims.mjs';
import { createProgress, unlocked } from '../shared/progress.mjs';

const el = (tag, text, className) => { const node = document.createElement(tag); if (text != null) node.textContent = text; if (className) node.className = className; return node; };
const btn = (text, action, className = 'ph-btn') => { const node = el('button', text, className); node.type = 'button'; node.addEventListener('click', action); return node; };
const tex = (source, display = false) => { const node = el(display ? 'div' : 'span', null, display ? 'ph-formula-tex' : 'ph-math'); node.innerHTML = katex.renderToString(source, { displayMode: display, throwOnError: false, output: 'html' }); return node; };
// Course text marks inline math with $…$; everything else is plain text (never HTML).
function rich(text, tag = 'p', className) {
  const node = el(tag, null, className);
  String(text).split(/(\$[^$]+\$)/).forEach(part => node.append(part.startsWith('$') && part.endsWith('$') && part.length > 2 ? tex(part.slice(1, -1)) : document.createTextNode(part)));
  return node;
}
function photo(image, className = 'ph-photo') {
  const figure = el('figure', null, className), img = el('img');
  img.src = `.${image.path}`; img.alt = image.alt; img.loading = 'lazy'; img.decoding = 'async';
  const caption = el('figcaption'); caption.append(el('span', image.alt), el('small', `照片：${image.author} · ${image.license} · Wikimedia Commons`));
  figure.append(img, caption); return figure;
}

export async function mount(root, context) {
  root.innerHTML = `<section class="physics-course"><header class="ph-header"><div><p class="ph-eyebrow">PHYSICS · 从生活出发 · 先讲解，后测验</p><h1>经典物理入门</h1>
    <p class="ph-sub">${chapters.length} 个单元 · ${lessons.length} 个阶段 · 🌱 入门（初中零基础）→ 🚀 进阶（改编自 OpenStax，CC BY 4.0）</p></div>
    <div class="ph-meter-wrap"><div class="ph-meter" role="progressbar" aria-label="课程进度" aria-valuemin="0" aria-valuemax="100"><span></span></div><span class="ph-meter-label"></span>
    <button type="button" class="ph-btn ghost ph-credits-btn">来源与版权</button></div></header>
    <div class="ph-layout"><nav class="ph-nav" aria-label="课程单元"></nav><main class="ph-main"></main></div></section>`;
  const $ = selector => root.querySelector(selector);
  const status = el('p', '', 'ph-status'); status.setAttribute('role', 'status');
  const report = error => { status.textContent = error.message; status.classList.add('error'); };
  const progress = createProgress(context, lessons, report);
  const state = () => progress.state;
  const current = () => lessons.find(lesson => lesson.id === state().currentLessonId) ?? lessons[0];
  const record = lesson => { const value = state().responses[lesson.id]; const safe = value && typeof value === 'object' && !Array.isArray(value) ? value : {}; safe.answers = safe.answers && typeof safe.answers === 'object' ? safe.answers : {}; state().responses[lesson.id] = safe; return safe; };
  let busy = false;

  function renderHeader() {
    const percent = Math.round(state().completed.length / lessons.length * 100);
    $('.ph-meter').setAttribute('aria-valuenow', String(percent)); $('.ph-meter > span').style.width = `${percent}%`;
    $('.ph-meter-label').textContent = `已完成 ${state().completed.length} / ${lessons.length}`;
    $('.ph-nav').replaceChildren(...chapters.map((chapter, chapterIndex) => {
      const group = el('section', null, 'ph-nav-unit'); const done = chapter.lessons.filter(l => state().completed.includes(l.id)).length;
      group.append(el('h3', `${chapterIndex + 1}. ${chapter.title}`), el('small', `${done}/${chapter.lessons.length}`));
      for (const lesson of chapter.lessons) {
        const index = lessons.indexOf(lesson), open = unlocked(lessons, state(), index), complete = state().completed.includes(lesson.id);
        const item = btn(`${complete ? '✓' : open ? (lesson.kind === 'exam' ? '✎' : '○') : '🔒'} ${lesson.kind === 'exam' ? '单元测试' : lesson.title}`, () => go(index), `ph-nav-item level-${lesson.level}`);
        if (lesson.kind === 'stage') item.prepend(el('span', lesson.level === 'junior' ? '入门' : '进阶', `ph-level ${lesson.level}`));
        item.dataset.lessonId = lesson.id; item.disabled = !open; item.classList.toggle('active', lesson === current()); item.classList.toggle('done', complete); group.append(item);
      }
      return group;
    }));
  }

  function renderTeach(lesson, main, saved, onRead) {
    const teach = el('section', null, 'ph-step ph-teach'); teach.dataset.step = 'teach';
    teach.append(el('p', '第 1 步 · 讲解', 'ph-step-label'));
    const t = lesson.teach;
    if (t.hook) { const hook = el('div', null, 'ph-hook'); hook.append(el('strong', '🤔 想一想'), rich(t.hook)); teach.append(hook); }
    if (t.life) { const life = el('div', null, 'ph-life'); life.append(el('strong', '🏠 生活中的例子'), rich(t.life)); teach.append(life); }
    const layout = el('div', null, 'ph-teach-grid'), text = el('div', null, 'ph-teach-text');
    if (lesson.level === 'junior') text.append(el('h3', '💡 用大白话说'));
    t.concept.forEach(paragraph => text.append(rich(paragraph)));
    const visual = el('div', null, 'ph-visual');
    if (lesson.anim) visual.append(mountAnimation(lesson.anim));
    visual.append(photo(lesson.image));
    layout.append(text, visual); teach.append(layout);
    if (t.symbols?.length) {
      const box = el('div', null, 'ph-symbols'); box.append(el('h3', '🔤 符号小词典'));
      const list = el('dl'); for (const sym of t.symbols) { list.append(el('dt', sym.s), el('dd', `${sym.name}${sym.unit ? `（单位 ${sym.unit}）` : ''}：${sym.plain}`)); } box.append(list); teach.append(box);
    }
    if (t.formulas.length) { const formulas = el('div', null, 'ph-formulas'); formulas.append(el('h3', lesson.level === 'junior' ? '📐 一个公式就够' : '核心公式'));
    for (const formula of t.formulas) { const box = el('div', null, 'ph-formula'); box.append(tex(formula.tex, true)); if (formula.note) box.append(el('small', formula.note)); formulas.append(box); }
    teach.append(formulas); }
    const example = el('div', null, 'ph-example'); example.append(el('h3', lesson.level === 'junior' ? '✏️ 小例题' : '例题'), rich(lesson.teach.example.problem, 'p', 'ph-problem'));
    const steps = el('ol', null, 'ph-solution'); example.append(steps);
    const answer = rich(`答案：${lesson.teach.example.answer}`, 'p', 'ph-example-answer');
    let shown = saved.read ? lesson.teach.example.steps.length : 0;
    const finish = btn('我已读完讲解，开始测验 →', () => { if (busy) return; saved.read = true; progress.schedule(); finish.disabled = true; onRead(); }, 'ph-btn primary ph-finish-teach');
    const reveal = btn('显示下一步解答', () => { shown += 1; drawSteps(); });
    const drawSteps = () => {
      steps.replaceChildren(...lesson.teach.example.steps.slice(0, shown).map(step => rich(step, 'li')));
      const all = shown >= lesson.teach.example.steps.length;
      reveal.hidden = all; answer.hidden = !all; finish.hidden = !all; finish.disabled = Boolean(saved.read);
      if (saved.read) finish.textContent = '✓ 讲解已读完，测验已解锁';
    };
    example.append(answer, reveal); teach.append(example);
    if (t.experiment) { const box = el('div', null, 'ph-experiment'); box.append(el('h3', `🧪 生活小实验：${t.experiment.title}`)); const ol = el('ol'); t.experiment.steps.forEach(step => ol.append(rich(step, 'li'))); box.append(ol); if (t.experiment.safety) box.append(el('p', `⚠️ 安全提示：${t.experiment.safety}`, 'ph-safety')); teach.append(box); }
    if (t.funFact) { const box = el('div', null, 'ph-funfact'); box.append(el('strong', '🌟 你知道吗？'), rich(t.funFact)); teach.append(box); }
    teach.append(finish); drawSteps(); main.append(teach);
  }

  function renderQuiz(lesson, main, saved) {
    const quiz = el('section', null, `ph-step ph-quiz${saved.read || lesson.kind === 'exam' ? '' : ' locked'}`); quiz.dataset.step = 'quiz';
    quiz.append(el('p', lesson.kind === 'exam' ? '单元测试' : '第 2 步 · 测验', 'ph-step-label'));
    if (lesson.kind !== 'exam' && !saved.read) { quiz.append(el('p', '🔒 先读完上面的讲解和例题，再开始测验。', 'ph-locked-note')); main.append(quiz); return; }
    quiz.append(el('p', '数值题可以只填数字（单位按题目给出），也可以带单位，例如 “20 m/s” 或 “72 km/h”；写 1.2e3 或 1.2×10^3 都可以。合理的四舍五入（误差 2% 以内）会判为正确。', 'ph-hint'));
    const checks = [];
    lesson.questions.forEach((question, index) => {
      const field = el('fieldset', null, 'ph-question'); field.dataset.questionId = question.id;
      const legend = el('legend'); legend.append(el('span', String(index + 1), 'ph-qnum'), rich(question.prompt, 'span')); field.append(legend);
      if (question.anim) field.append(mountAnimation(question.anim, { still: true }));
      const feedback = el('div', null, 'ph-feedback'); feedback.setAttribute('aria-live', 'polite');
      const save = value => { saved.answers[question.id] = value; progress.schedule(); feedback.replaceChildren(); field.classList.remove('right', 'wrong'); };
      if (question.type === 'choice') {
        for (const option of shuffled(question.options, question.id)) {
          const label = el('label', null, 'ph-choice'), input = el('input'); input.type = 'radio'; input.name = question.id; input.value = option; input.checked = saved.answers[question.id] === option;
          input.addEventListener('change', () => save(option)); label.append(input, rich(option, 'span')); field.append(label);
        }
      } else {
        const row = el('div', null, 'ph-numeric'), input = el('input'); input.type = 'text'; input.inputMode = 'decimal'; input.autocomplete = 'off'; input.setAttribute('aria-label', `第 ${index + 1} 题答案`);
        input.value = typeof saved.answers[question.id] === 'string' ? saved.answers[question.id] : ''; input.addEventListener('input', () => save(input.value));
        row.append(input, el('span', question.unit ? question.unit.replace('^2', '²').replace('^3', '³').replace('*', '·') : '（纯数字）', 'ph-unit')); field.append(row);
      }
      if (lesson.kind !== 'exam') {
        const hintText = question.hint ?? '回到上面的讲解和例题看一看，答案就藏在里面。';
        const hint = el('p', `💡 提示：${hintText}`, 'ph-hint-text'); hint.hidden = true;
        const hintBtn = btn('💡 给我一点提示', () => { hint.hidden = false; hintBtn.hidden = true; state().hints[lesson.id] = (Number(state().hints[lesson.id]) || 0) + 1; progress.schedule(); }, 'ph-btn ghost ph-hint-btn');
        field.append(hintBtn, hint);
      }
      field.append(feedback); quiz.append(field);
      checks.push(() => {
        const result = gradeQuestion(question, saved.answers[question.id]);
        field.classList.toggle('right', result.correct); field.classList.toggle('wrong', !result.correct);
        feedback.replaceChildren(result.correct ? rich(`✓ 答对了！${question.explanation}`, 'p') : el('p', `✗ ${result.message ?? '差一点点，再想一想。'}`));
        if (!result.correct && lesson.kind !== 'exam') feedback.append(rich(`📖 讲解：${question.explanation}`, 'p', 'ph-explain'));
        return result.correct;
      });
    });
    const summary = el('p', null, 'ph-summary'); summary.setAttribute('role', 'status');
    const submit = btn(lesson.kind === 'exam' ? '提交单元测试' : '提交测验', async () => {
      if (busy) return;
      const results = checks.map(check => check()); const right = results.filter(Boolean).length;
      saved.attempts = (Number(saved.attempts) || 0) + 1; state().attempts[lesson.id] = saved.attempts;
      state().scores[lesson.id] = Math.max(Number(state().scores[lesson.id]) || 0, Math.round(right / results.length * 100));
      if (right === results.length) {
        if (!state().completed.includes(lesson.id)) state().completed.push(lesson.id);
        summary.textContent = `全部正确（${right}/${results.length}）！${lesson.kind === 'exam' ? '本单元完成。' : '下一阶段已解锁。'}`; summary.className = 'ph-summary pass';
      } else { summary.textContent = `答对 ${right}/${results.length}，已经很棒了！看看提示和讲解，改正后再提交。`; summary.className = 'ph-summary retry'; }
      busy = true; try { await progress.persist(); } catch (error) { report(error); } finally { busy = false; }
      renderHeader(); updateFooter();
    }, 'ph-btn primary ph-submit');
    quiz.append(submit, summary); main.append(quiz);
  }

  let nextButton;
  function updateFooter() { if (!nextButton) return; const index = lessons.indexOf(current()); nextButton.disabled = index === lessons.length - 1 || !unlocked(lessons, state(), index + 1); }

  function render() {
    const lesson = current(), chapter = chapters[lesson.chapterIndex], main = $('.ph-main'), saved = record(lesson);
    main.replaceChildren(status);
    main.append(el('p', `单元 ${lesson.chapterIndex + 1} · ${chapter.title} · ${lesson.kind === 'exam' ? '单元测试' : `${lesson.level === 'junior' ? '🌱 入门' : '🚀 进阶'} · 阶段 ${lesson.localIndex + 1}/${chapter.stageCount}`}`, 'ph-topic'), el('h2', lesson.title));
    if (lesson.localIndex === 0) main.append(el('p', `本单元目标：${chapter.goal}　（来源：${chapter.source}）`, 'ph-goal'));
    if (lesson.kind === 'exam') {
      const recap = el('section', null, 'ph-step ph-recap'); recap.append(el('p', '考前回顾', 'ph-step-label'), el('p', '本单元的核心公式。测试不再给提示讲解，全部答对即完成本单元。'));
      const grid = el('div', null, 'ph-recap-grid'); lesson.recap.forEach(formula => { const box = el('div', null, 'ph-formula'); box.append(tex(formula.tex, true)); if (formula.note) box.append(el('small', formula.note)); grid.append(box); });
      recap.append(grid, photo(lesson.image, 'ph-photo ph-photo-wide')); main.append(recap);
      renderQuiz(lesson, main, saved);
    } else {
      const quizSlot = el('div');
      renderTeach(lesson, main, saved, () => { quizSlot.replaceChildren(); renderQuiz(lesson, quizSlot, saved); quizSlot.querySelector('.ph-quiz')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
      main.append(quizSlot); renderQuiz(lesson, quizSlot, saved);
    }
    const footer = el('footer', null, 'ph-footer'), index = lessons.indexOf(lesson);
    const prev = btn('← 上一阶段', () => go(index - 1)); prev.disabled = index === 0;
    nextButton = btn('下一阶段 →', () => go(index + 1), 'ph-btn primary'); footer.append(prev, nextButton); main.append(footer);
    renderHeader(); updateFooter();
  }
  async function go(index) {
    if (busy || !lessons[index] || !unlocked(lessons, state(), index)) return;
    busy = true;
    try { state().currentLessonId = lessons[index].id; state().started = true; state().mapChapter = lessons[index].chapterIndex; await progress.persist(); } catch (error) { report(error); } finally { busy = false; }
    render(); $('.ph-main').scrollIntoView({ block: 'start' });
  }
  $('.ph-credits-btn').addEventListener('click', () => {
    const dialog = el('dialog', null, 'ph-dialog'); dialog.append(el('h2', '来源与版权'), el('p', credits.text), el('p', credits.changes));
    const list = el('ul'); for (const source of credits.sources) { const item = el('li'), link = el('a', source.title); link.href = source.url; link.target = '_blank'; link.rel = 'noopener'; item.append(link, document.createTextNode(` · ${source.license}`)); list.append(item); }
    dialog.append(list, el('h3', '插图'), el('p', credits.images));
    const imageList = el('ol', null, 'ph-image-credits');
    for (const [id, image] of Object.entries(images)) { const item = el('li'), link = el('a', image.file); link.href = image.source; link.target = '_blank'; link.rel = 'noopener'; item.append(document.createTextNode(`${id} ${image.alt}：`), link, document.createTextNode(` · ${image.author} · ${image.license}`)); imageList.append(item); }
    dialog.append(imageList, btn('关闭', () => dialog.close(), 'ph-btn primary'));
    dialog.addEventListener('close', () => dialog.remove()); $('.physics-course').append(dialog); dialog.showModal();
  });
  render();
  return {
    async flush() { if (busy) throw new Error('请等待当前操作完成后再切换课程。'); await progress.flush(); },
    dispose() { progress.dispose(); root.replaceChildren(); }
  };
}
