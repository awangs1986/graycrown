import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { chapters, lessons, questions, videos, grades } from '../web/courses/olympiad/course.mjs';
import { gradeQuestion, parseNumber, shuffled } from '../web/courses/olympiad/judge.mjs';
import { normalizeProgress, unlocked } from '../web/courses/shared/progress.mjs';
import { courses } from '../web/course-registry.mjs';
import manifest from '../web/courses/olympiad/manifest.mjs';
import { durationFor, FPS } from '../remotion/src/timing.mjs';

test('olympiad course: 4 grades, 14 units, teach→test stages + exam, explicit stable ids', () => {
  assert.equal(chapters.length, 15);
  assert.deepEqual(chapters.map(c => c.id), ['om01','om02','om03','om04','om05','om06','om07','om08','om09','om10','om11','om15','om12','om13','om14']);
  assert.deepEqual([...new Set(chapters.map(c => c.grade))], ['low', 'mid', 'high', 'junior'], 'easy → hard grade order');
  assert.deepEqual(Object.keys(grades), ['low', 'mid', 'high', 'junior']);
  assert.equal(lessons.length, 45); assert.equal(questions.length, 150);
  for (const chapter of chapters) {
    assert.deepEqual(chapter.lessons.map(l => l.id), [`${chapter.id}-01`, `${chapter.id}-02`, `${chapter.id}-exam`]);
    for (const lesson of chapter.lessons.filter(l => l.kind === 'stage')) {
      const t = lesson.teach;
      for (const k of ['hook', 'life', 'funFact']) assert.ok(t[k].length >= 15, `${lesson.id} ${k}`);
      assert.ok(lesson.method && t.concept.length >= 3 && t.example.steps.length >= 3 && t.example.answer, lesson.id);
      assert.equal(lesson.questions.length, 3);
      lesson.questions.forEach((q, i) => { assert.equal(q.id, `${lesson.id}-q${i + 1}`); assert.ok(q.hint && q.explanation, q.id); });
    }
    const exam = chapter.lessons.at(-1); assert.equal(exam.questions.length, 4);
    exam.questions.forEach((q, i) => assert.equal(q.id, `${chapter.id}-exam-${i + 1}`));
  }
  assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
  assert.equal(manifest.id, 'olympiad'); assert.ok(courses.some(c => c.id === 'olympiad'));
});

test('every numeric answer is recomputed independently; choice answers are among options', () => {
  for (const q of questions) {
    if (q.type === 'numeric') { const v = Function(`return (${q.verify});`)(); assert.ok(Math.abs(v - q.answer) < 1e-9, `${q.id}: ${q.verify} = ${v}, stored ${q.answer}`); assert.ok(gradeQuestion(q, String(q.answer))); }
    else { assert.equal(new Set(q.options).size, q.options.length); assert.equal(q.answer, q.options[0]); assert.ok(gradeQuestion(q, q.answer)); assert.ok(!gradeQuestion(q, q.options[1])); }
  }
  assert.ok(questions.filter(q => q.type === 'numeric').length >= 110);
});

test('judge accepts fractions, fullwidth digits and trailing units', () => {
  assert.equal(parseNumber('2/3'), 2 / 3); assert.equal(parseNumber('１２'), 12); assert.equal(parseNumber('5 棵'), 5); assert.equal(parseNumber('-3'), -3); assert.equal(parseNumber('abc'), null);
  const q = questions.find(x => x.id === 'om07-01-q3'); assert.ok(gradeQuestion(q, '2/3')); assert.ok(gradeQuestion(q, '4/6')); assert.ok(!gradeQuestion(q, '0.66'));
  assert.deepEqual(shuffled(['a', 'b', 'c', 'd'], 'x'), shuffled(['a', 'b', 'c', 'd'], 'x'));
});

test('30 pre-rendered Remotion videos: WebM + poster + Chinese WebVTT captions matching example steps, total < 60 MB', async () => {
  assert.equal(videos.length, 30);
  let total = 0;
  for (const v of videos) {
    const base = `web/public/video/olympiad/${v.id}`;
    const webm = await stat(`${base}.webm`), jpg = await stat(`${base}.jpg`); total += webm.size + jpg.size;
    assert.ok(webm.size > 20_000 && webm.size < 4_000_000, `${v.id} webm size`); assert.ok(jpg.size > 5_000, `${v.id} poster`);
    const head = (await readFile(`${base}.webm`)).subarray(0, 4); assert.deepEqual([...head], [0x1a, 0x45, 0xdf, 0xa3], `${v.id} is WebM/Matroska`);
    const vtt = await readFile(`${base}.vtt`, 'utf8'); assert.ok(vtt.startsWith('WEBVTT'));
    v.captions.forEach((c, i) => assert.ok(vtt.includes(`第 ${i + 1} 步：${c}`), `${v.id} caption ${i + 1}`));
    assert.ok(durationFor(v.captions.length) / FPS <= 30, `${v.id} short`);
  }
  assert.ok(total < 60 * 1024 * 1024, `total ${total}`);
  const map = (await import('../remotion/src/map.mjs')).VISUAL_FOR; assert.deepEqual(Object.keys(map).sort(), videos.map(v => v.id).sort());
});

test('progress: stable ids, unknown ids dropped, sequential unlock', () => {
  const state = normalizeProgress({ version: 1, currentLessonId: 'om05-02', completed: ['om01-01', 'bogus'] }, lessons, 'zh-CN');
  assert.equal(state.currentLessonId, 'om05-02'); assert.deepEqual(state.completed, ['om01-01']);
  assert.ok(unlocked(lessons, state, 1)); assert.ok(!unlocked(lessons, state, 2));
});

test('OpenStax (CC BY-NC-SA) adaptation is isolated in its own file with license header and credits', async () => {
  const src = await readFile('web/courses/olympiad/content-openstax.mjs', 'utf8');
  assert.match(src, /Prealgebra 2e/); assert.match(src, /CC BY-NC-SA 4\.0/); assert.match(src, /NOT under the project's MIT license/);
  for (const f of ['content-a.mjs', 'content-b.mjs']) assert.doesNotMatch(await readFile(`web/courses/olympiad/${f}`, 'utf8'), /OpenStax/);
  assert.deepEqual(chapters.filter(c => c.source === 'openstax').map(c => c.id), ['om15']);
  for (const f of ['web/courses/olympiad/CREDITS.md', 'THIRD_PARTY_NOTICES.txt', 'README.md', 'README.zh-CN.md']) assert.match(await readFile(f, 'utf8'), /CC BY-NC-SA/, f);
});

test('olympiad crayon kit: fonts cover all composition text, licenses bundled', async () => {
  const { readFile: rf } = await import('node:fs/promises');
  const kit = await rf('remotion/src/crayon.jsx', 'utf8'); assert.match(kit, /roughjs/); assert.match(kit, /feDisplacementMap/);
  const ofl = await rf('remotion/public/ZCOOLKuaiLe-OFL.txt', 'utf8'); assert.match(ofl, /SIL Open Font License/);
  const notices = await rf('THIRD_PARTY_NOTICES.txt', 'utf8'); assert.match(notices, /ZCOOL KuaiLe/); assert.match(notices, /rough\.js/);
  assert.ok((await stat('remotion/public/ZCOOLKuaiLe-subset.woff2')).size > 20_000);
});
