const record = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
export function normalizeProgress(value, lessons, language = 'zh-CN') {
  if (value && value.version !== 1) throw new Error('不支持此课程存档版本。');
  const ids = new Set(lessons.map(lesson => lesson.id));
  const map = key => Object.fromEntries(Object.entries(record(value?.[key])).filter(([id]) => ids.has(id)));
  return {
    version: 1, started: Boolean(value?.started), language,
    currentLessonId: ids.has(value?.currentLessonId) ? value.currentLessonId : lessons[0].id,
    completed: [...new Set((Array.isArray(value?.completed) ? value.completed : []).filter(id => ids.has(id)))],
    drafts: map('drafts'), inputs: map('inputs'), responses: map('responses'), attempts: map('attempts'),
    // Older saves may carry a retired companionId field; it is dropped here and nothing else changes.
    battles: map('battles'),
    scores: map('scores'), assisted: map('assisted'), hints: map('hints'),
    answerReveals: [...new Set((Array.isArray(value?.answerReveals) ? value.answerReveals : []).filter(id => ids.has(id)))],
    consecutiveFailures: map('consecutiveFailures'),
    mapChapter: Number.isInteger(value?.mapChapter) && value.mapChapter >= 0 ? Math.min(value.mapChapter, lessons.at(-1).chapterIndex) : 0,
    tutorUses: record(value?.tutorUses), updatedAt: value?.updatedAt ?? null
  };
}
export function createProgress(context, lessons, report) {
  let state = normalizeProgress(context.progress, lessons, context.language);
  let queue = Promise.resolve();
  let timer;
  const persist = () => {
    clearTimeout(timer);
    state.updatedAt = new Date().toISOString();
    const snapshot = structuredClone(state);
    queue = queue.catch(() => {}).then(() => context.saveProgress(snapshot));
    return queue;
  };
  return {
    get state() { return state; },
    schedule() { clearTimeout(timer); timer = setTimeout(() => persist().catch(report), 300); },
    persist,
    async replace(value) { state = normalizeProgress(value, lessons, state.language); await persist(); },
    async flush() { await persist(); },
    dispose() { clearTimeout(timer); }
  };
}
export function unlocked(lessons, state, index) {
  if (!lessons[index]) return false;
  const lastCompleted = lessons.reduce((last, lesson, position) => state.completed.includes(lesson.id) ? position : last, -1);
  return index <= lastCompleted + 1 || lessons.slice(0, index).every(lesson => state.completed.includes(lesson.id));
}
