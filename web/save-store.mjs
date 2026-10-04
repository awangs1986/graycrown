const SAVE_URL = '/api/save';
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const validId = id => typeof id === 'string' && /^[a-z][a-z0-9-]{0,63}$/.test(id) && !['constructor', 'prototype'].includes(id);

export function emptyLibrary() {
  return { version: 3, language: 'en', activeCourseId: 'c', courses: {}, updatedAt: new Date().toISOString() };
}

export function normalizeLibrary(value) {
  if (!isRecord(value)) throw new Error('Invalid save file / 存档格式错误');
  if (value.recoveryWarning) throw new Error(value.recoveryWarning);
  if (value.version === 2) {
    return {
      ...emptyLibrary(),
      language: value.language === 'zh-CN' ? 'zh-CN' : 'en',
      courses: { c: structuredClone(value) }
    };
  }
  if (value.version !== 3 || !isRecord(value.courses)) {
    throw new Error('Unsupported save version / 不支持此存档版本');
  }
  for (const [id, progress] of Object.entries(value.courses)) {
    if (!validId(id) || !isRecord(progress)) throw new Error('Invalid course progress / 课程进度格式错误');
  }
  return {
    ...structuredClone(value),
    language: value.language === 'zh-CN' ? 'zh-CN' : 'en',
    activeCourseId: validId(value.activeCourseId) ? value.activeCourseId : 'c'
  };
}

// Unknown course IDs are retained so a temporarily absent course never loses progress.
export function withCourseProgress(library, courseId, progress) {
  if (!validId(courseId) || !isRecord(progress)) throw new Error('Invalid course progress');
  const next = normalizeLibrary(library);
  next.courses[courseId] = structuredClone(progress);
  next.activeCourseId = courseId;
  next.updatedAt = new Date().toISOString();
  return next;
}

export async function loadLibrary() {
  const response = await fetch(SAVE_URL, { cache: 'no-store' });
  if (!response.ok) throw new Error(`读取存档失败（HTTP ${response.status}）`);
  return normalizeLibrary(await response.json());
}

export async function writeLibrary(value) {
  const snapshot = normalizeLibrary(value);
  const response = await fetch(SAVE_URL, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(snapshot)
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.ok) throw new Error(result.error || `保存失败（HTTP ${response.status}）`);
  return snapshot;
}
