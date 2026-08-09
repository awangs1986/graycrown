export const ANSWER_CHAPTER_ID = 'day01';
export const ANSWER_TOKENS_PER_CHAPTER = 3;

export function tokenCount(state, chapterId = ANSWER_CHAPTER_ID) {
  const count = Number(state.answerTokens?.[chapterId]);
  return Number.isInteger(count) && count >= 0 ? count : ANSWER_TOKENS_PER_CHAPTER;
}

export function consumeAnswerToken(state, lessonId, chapterId = ANSWER_CHAPTER_ID) {
  state.answerUses ??= {};
  const uses = Array.isArray(state.answerUses[chapterId]) ? state.answerUses[chapterId] : [];
  if (uses.includes(lessonId)) return true;
  const remaining = tokenCount(state, chapterId);
  if (remaining < 1) return false;
  state.answerTokens ??= {};
  state.answerTokens[chapterId] = remaining - 1;
  state.answerUses[chapterId] = [...new Set([...uses, lessonId])];
  return true;
}
