import { element, button } from '../shared/player.mjs';
import { gradeFrench } from './judge.mjs';
import { comicPanel, VILLAIN } from './art.mjs';

const moves = { 词汇: '单词飞镖', 拼写: '重音光束', 句子: '句子连击', 语法: '语法护盾', 听力: '顺风耳雷达', 阅读: '阅读放大镜', 综合: '对话组合拳', 综合测试: '大结局必杀' };
const minions = ['墨点小怪', '涂鸦小怪', '错音小怪', '回声小怪', '倒序小怪', '漏音符小怪'];
export const rivalName = lesson => lesson.key === 'exam' ? VILLAIN : `Gribouille 的${minions[lesson.localIndex % minions.length]}`;
// Same turn rules as the other RPG courses: a correct answer lands a hit, a wrong one costs stamina,
// resting is free, and cleared rounds are kept. Only the art and wording differ.
export function createBattle(ui, responses) {
  const { lesson, chapter, body } = ui, rival = rivalName(lesson), move = moves[lesson.topic] ?? moves.综合;
  const saved = ui.state.battles[lesson.id], replay = ui.state.completed.includes(lesson.id);
  const valid = new Set(gradeFrench(lesson, responses).checks.filter(c => c.passed).map(c => c.id));
  const cleared = new Set(!replay && Array.isArray(saved?.cleared) ? saved.cleared.filter(id => valid.has(id)) : []);
  let stamina = !replay && Number.isInteger(saved?.stamina) ? Math.max(0, Math.min(3, saved.stamina)) : 3;
  let awaitingNext = false, finished = false, active = lesson.questions.find(q => !cleared.has(q.id));
  const fields = new Map(), feedback = new Map();
  const stage = element('section', null, 'comic-battle'); stage.setAttribute('aria-label', '漫画回合对战');
  const banner = element('div', lesson.key === 'exam' ? 'BOSS 战 · 本章大结局' : '漫画格修复 · 回合对战', 'comic-eyebrow');
  const arena = element('div', null, 'comic-arena');
  arena.innerHTML = comicPanel({ place: chapter.place, cast: ['lea'], villain: true, burst: lesson.key === 'exam' ? 'BOSS!' : 'POW!', caption: rival, label: `Léa 对战 ${rival}`, pose: 'point' });
  const meters = element('div', null, 'comic-meters');
  const meter = (label, max) => { const box = element('div', null, 'comic-meter'), bar = element('progress'), text = element('small'); bar.max = max; bar.setAttribute('aria-label', label); box.append(element('strong', label), bar, text); meters.append(box); return { bar, text }; };
  const hero = meter('Léa · 体力', 3), enemy = meter(`${rival} · 捣乱值`, lesson.questions.length * 20);
  const log = element('p', `${rival} 把这一格漫画搅乱了！用法语招式把它修好。`, 'comic-log'); log.setAttribute('role', 'status');
  const round = element('p', null, 'comic-round');
  stage.append(banner, arena, meters, round, log); body.append(stage);
  const controls = element('div', null, 'comic-controls');
  const attack = button(`💥 发动 · ${move}`, strike, 'primary-btn');
  const next = button('下一格 →', () => { if (ui.busy) return; awaitingNext = false; active = lesson.questions.find(q => !cleared.has(q.id)); sync(); active && fields.get(active.id)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 'primary-btn');
  const rest = button('去咖啡馆休息 · 恢复体力', async () => {
    if (ui.busy) return; ui.setBusy(true); stamina = 3; store();
    try { await ui.progress.persist(); log.textContent = 'Léa 喝了杯热巧克力，吃了个可颂，精神满满！已修好的画格会保留。'; } catch (error) { ui.report(error); } finally { ui.setBusy(false); sync(); }
  });
  const complete = button('▤ 收录这一页漫画', async () => {
    if (ui.busy || cleared.size !== lesson.questions.length || finished) return;
    ui.setBusy(true);
    try { await ui.record(true, 100); finished = true; stage.classList.add('complete'); log.textContent = `${rival} 被击退了！这一格漫画已经修好。`; } catch (error) { ui.report(error); } finally { ui.setBusy(false); sync(); }
  }, 'primary-btn');
  controls.append(attack, next, rest, complete);
  function store() { ui.state.battles[lesson.id] = { cleared: [...cleared], stamina }; }
  function sync() {
    const remaining = lesson.questions.length - cleared.size;
    enemy.bar.value = remaining * 20; enemy.text.textContent = `${remaining * 20} / ${lesson.questions.length * 20}`;
    hero.bar.value = stamina; hero.text.textContent = `${stamina} / 3`;
    round.textContent = `已修好 ${cleared.size} / ${lesson.questions.length} 格 · ${remaining ? '每答对一题造成 20 点伤害' : 'Gribouille 的涂鸦被清除了，收录这一页吧！'}`;
    attack.hidden = !active || awaitingNext || stamina === 0 || remaining === 0; attack.disabled = ui.busy;
    next.hidden = !awaitingNext || remaining === 0; next.disabled = ui.busy;
    rest.hidden = stamina > 0 || remaining === 0; rest.disabled = ui.busy;
    complete.hidden = remaining > 0; complete.disabled = ui.busy || finished;
    if (finished) complete.textContent = '✓ 已收录进漫画册';
    for (const [id, field] of fields) { field.hidden = id !== active?.id || remaining === 0; field.disabled = ui.busy || awaitingNext || stamina === 0; }
  }
  async function strike() {
    if (ui.busy || !active || awaitingNext || stamina === 0 || finished) return;
    const answer = responses[active.id];
    if (answer == null || (Array.isArray(answer) ? !answer.length : !String(answer).trim())) { log.textContent = '先写好这一格的答案，再发动招式。'; return; }
    ui.setBusy(true); sync();
    try {
      const result = gradeFrench({ questions: [active] }, responses), message = feedback.get(active.id);
      if (result.passed) {
        cleared.add(active.id); awaitingNext = true; message.textContent = 'POW! 答对了，造成 20 点伤害。'; message.className = 'question-feedback correct';
        log.textContent = `Léa 使出「${move}」！${rival} 捣乱值 −20。${cleared.size === lesson.questions.length ? '这一页漫画修好了！' : ''}`;
        if (!matchMedia('(prefers-reduced-motion: reduce)').matches) arena.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-1.2deg) scale(1.02)' }, { transform: 'rotate(1deg)' }, { transform: 'rotate(0)' }], { duration: 380 });
        store(); await ui.progress.persist();
      } else {
        stamina--; message.textContent = '没打中！对照本章词表检查词形、重音符号和词序，或重听录音再试。'; message.className = 'question-feedback';
        log.textContent = `${rival} 反击！Léa 体力 −1。${stamina ? '调整答案，再来一次。' : '去咖啡馆休息一下，已修好的画格不会丢。'}`;
        store(); await ui.record(false, Math.round(cleared.size / lesson.questions.length * 100));
      }
    } catch (error) { ui.report(error); } finally { ui.setBusy(false); sync(); }
  }
  return {
    addQuestion(question, field, message) { fields.set(question.id, field); feedback.set(question.id, message); },
    mountControls() { body.append(controls, element('p', '答对 → 招式命中；答错 → Gribouille 反击；体力耗尽可以免费休息。所有画格修好后，把这一页收进漫画册。', 'comic-help')); ui.root.addEventListener('course-busy-change', sync); sync(); },
    dispose() { ui.root.removeEventListener('course-busy-change', sync); },
    get feedback() { return log.textContent; }
  };
}
