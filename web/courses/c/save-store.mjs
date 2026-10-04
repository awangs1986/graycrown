import { chapters, lessons } from './course.mjs';
const chapterTokens = () => Object.fromEntries(chapters.map(chapter => [chapter.id, 3]));
const chapterUses = () => Object.fromEntries(chapters.map(chapter => [chapter.id, []]));
const chapterTutorUses = () => Object.fromEntries(chapters.map(chapter => [chapter.id, false]));

export function emptySave() {
  return {
    version: 2,
    language: 'en',
    started: false,
    currentChapter: 0,
    currentQuest: 0,
    completed: [],
    skipped: [],
    attempts: {},
    hints: {},
    drafts: {},
    inputs: {},
    consecutiveFailures: {},
    answerTokens: chapterTokens(),
    answerUses: chapterUses(),
    aiTutorUses: chapterTutorUses(),
    xp: 0,
    gold: 0,
    updatedAt: new Date().toISOString()
  };
}

export function normalizeSave(value) {
  const base = emptySave();
  if (!value || value.version !== 2) return base;
  return {
    ...base,
    ...value,
    language: value.language === 'zh-CN' ? 'zh-CN' : 'en',
    completed: Array.isArray(value.completed) ? value.completed : [],
    skipped: Array.isArray(value.skipped) ? value.skipped : [],
    attempts: value.attempts && typeof value.attempts === 'object' ? value.attempts : {},
    hints: value.hints && typeof value.hints === 'object' ? value.hints : {},
    drafts: value.drafts && typeof value.drafts === 'object' ? value.drafts : {},
    inputs: value.inputs && typeof value.inputs === 'object' ? value.inputs : {},
    consecutiveFailures: value.consecutiveFailures && typeof value.consecutiveFailures === 'object' ? value.consecutiveFailures : {},
    currentChapter: Number.isInteger(value.currentChapter) && value.currentChapter >= 0 && value.currentChapter < chapters.length ? value.currentChapter : 0,
    currentQuest: Number.isInteger(value.currentQuest) && value.currentQuest >= 0 && value.currentQuest < lessons.length ? value.currentQuest : 0,
    answerTokens: value.answerTokens && typeof value.answerTokens === 'object' ? { ...chapterTokens(), ...value.answerTokens } : chapterTokens(),
    answerUses: value.answerUses && typeof value.answerUses === 'object' ? { ...chapterUses(), ...value.answerUses } : chapterUses(),
    aiTutorUses: value.aiTutorUses && typeof value.aiTutorUses === 'object' ? { ...chapterTutorUses(), ...value.aiTutorUses } : chapterTutorUses()
  };
}

