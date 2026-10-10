import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyLibrary, normalizeLibrary, withCourseProgress } from '../web/save-store.mjs';
import { courses } from '../web/course-registry.mjs';

test('legacy C migration retains drafts, progress, rewards and mentor usage', () => {
  const legacy = { version: 2, language: 'zh-CN', started: true, currentQuest: 23, completed: ['D1-Q01'], drafts: { 'D2-Q04': 'int main() {}' }, gold: 17, answerTokens: { day01: 1 }, aiTutorUses: { day01: true } };
  const migrated = normalizeLibrary(legacy);
  assert.equal(migrated.version, 3);
  assert.equal(migrated.language, 'zh-CN');
  assert.deepEqual(migrated.courses.c, legacy);
  migrated.courses.c.gold = 0;
  assert.equal(legacy.gold, 17);
});

test('same lesson IDs in different courses cannot overwrite each other', () => {
  let library = withCourseProgress(emptyLibrary(), 'c', { drafts: { q1: 'printf' }, completed: ['q1'] });
  library = withCourseProgress(library, 'csharp', { drafts: { q1: 'Console.WriteLine' }, completed: [] });
  const resetC = withCourseProgress(library, 'c', { drafts: {}, completed: [] });
  assert.deepEqual(resetC.courses.csharp, library.courses.csharp);
  assert.equal(library.courses.c.drafts.q1, 'printf');
});

test('normalization and writes retain progress for courses not currently installed', () => {
  const library = normalizeLibrary({ ...emptyLibrary(), courses: { 'future-course': { version: 9, recordings: ['audio'] } } });
  assert.deepEqual(withCourseProgress(library, 'c', {}).courses['future-course'], { version: 9, recordings: ['audio'] });
});

test('unsupported or damaged envelopes fail instead of replacing progress with empty data', () => {
  for (const value of [null, [], { version: 4 }, { version: 3, courses: [] }, { version: 3, courses: { c: null } }, { version: 2, recoveryWarning: 'damaged' }]) {
    assert.throws(() => normalizeLibrary(value));
  }
});

test('course IDs cannot inject prototype keys or filesystem paths', () => {
  for (const id of ['__proto__', 'constructor', '../c', '/tmp/save', '']) {
    assert.throws(() => withCourseProgress(emptyLibrary(), id, {}));
  }
  assert.throws(() => normalizeLibrary(JSON.parse('{"version":3,"courses":{"__proto__":{}}}')));
});

test('new saves contain no C chapter assumptions and course payloads are copied', () => {
  const empty = emptyLibrary();
  assert.deepEqual(empty.courses, {});
  const progress = { vocabulary: ['bonjour'], listening: { a: true } };
  const next = withCourseProgress(empty, 'french-a1', progress);
  progress.vocabulary.push('salut');
  assert.deepEqual(next.courses['french-a1'].vocabulary, ['bonjour']);
});

test('only finished, bundled courses can be launched', () => {
  assert.equal(new Set(courses.map(course => course.id)).size, courses.length);
  assert.deepEqual(courses.filter(course => course.status === 'available').map(course => course.id), ['c', 'csharp', 'french-a1', 'english-nce', 'physics', 'olympiad']);
  for (const course of courses) {
    assert.equal(typeof course.load, course.status === 'available' ? 'function' : 'undefined');
  }
});

test('missing active course defaults to C without deriving an executable path', () => {
  assert.equal(normalizeLibrary({ version: 3, courses: {} }).activeCourseId, 'c');
});
