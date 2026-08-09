const SAVE_URL = '/api/save';
const chapterTokens = () => Object.fromEntries(Array.from({ length: 7 }, (_, index) => [`day${String(index + 1).padStart(2, '0')}`, 3]));
const chapterUses = () => Object.fromEntries(Array.from({ length: 7 }, (_, index) => [`day${String(index + 1).padStart(2, '0')}`, []]));
const chapterTutorUses = () => Object.fromEntries(Array.from({ length: 7 }, (_, index) => [`day${String(index + 1).padStart(2, '0')}`, false]));

export function emptySave() {
  return {
    version: 2,
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
    completed: Array.isArray(value.completed) ? value.completed : [],
    skipped: Array.isArray(value.skipped) ? value.skipped : [],
    attempts: value.attempts && typeof value.attempts === 'object' ? value.attempts : {},
    hints: value.hints && typeof value.hints === 'object' ? value.hints : {},
    drafts: value.drafts && typeof value.drafts === 'object' ? value.drafts : {},
    inputs: value.inputs && typeof value.inputs === 'object' ? value.inputs : {},
    consecutiveFailures: value.consecutiveFailures && typeof value.consecutiveFailures === 'object' ? value.consecutiveFailures : {},
    currentChapter: Number.isInteger(value.currentChapter) && value.currentChapter >= 0 && value.currentChapter < 7 ? value.currentChapter : 0,
    answerTokens: value.answerTokens && typeof value.answerTokens === 'object' ? { ...chapterTokens(), ...value.answerTokens } : chapterTokens(),
    answerUses: value.answerUses && typeof value.answerUses === 'object' ? { ...chapterUses(), ...value.answerUses } : chapterUses(),
    aiTutorUses: value.aiTutorUses && typeof value.aiTutorUses === 'object' ? { ...chapterTutorUses(), ...value.aiTutorUses } : chapterTutorUses()
  };
}

export async function loadSave() {
  const response = await fetch(SAVE_URL, { cache: 'no-store' });
  if (!response.ok) throw new Error(`读取存档失败（HTTP ${response.status}）`);
  return normalizeSave(await response.json());
}

export async function writeSave(value) {
  const save = normalizeSave({ ...value, version: 2, updatedAt: new Date().toISOString() });
  const response = await fetch(SAVE_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(save)
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.ok) throw new Error(result.error || `保存失败（HTTP ${response.status}）`);
  return save;
}
