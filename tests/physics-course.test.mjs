import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat, readdir } from 'node:fs/promises';
import { chapters, lessons, questions, images, credits, units } from '../web/courses/physics/course.mjs';
import { gradeNumeric, gradeQuestion, parseNumeric, shuffled } from '../web/courses/physics/judge.mjs';
import { normalizeProgress, unlocked } from '../web/courses/shared/progress.mjs';
import manifest from '../web/courses/physics/manifest.mjs';

test('physics course: 11 units, 3 teach→test stages each plus a unit exam, explicit stable ids', () => {
  assert.equal(chapters.length, 11);
  assert.deepEqual(chapters.map(c => c.id), Array.from({ length: 11 }, (_, i) => `ph${String(i + 1).padStart(2, '0')}`));
  assert.equal(lessons.length, 44);
  for (const chapter of chapters) {
    assert.deepEqual(chapter.lessons.map(l => l.id), [`${chapter.id}-01`, `${chapter.id}-02`, `${chapter.id}-03`, `${chapter.id}-exam`]);
    for (const lesson of chapter.lessons.filter(l => l.kind === 'stage')) {
      assert.ok(lesson.teach.concept.length >= 2, `${lesson.id} teaching text`);
      assert.ok(lesson.teach.formulas.length >= 1, `${lesson.id} formula`);
      assert.ok(lesson.teach.example.steps.length >= 2 && lesson.teach.example.answer, `${lesson.id} worked example`);
      assert.ok(lesson.questions.length >= 3, `${lesson.id} quiz`);
      lesson.questions.forEach((q, i) => assert.equal(q.id, `${lesson.id}-q${i + 1}`));
    }
    const exam = chapter.lessons.at(-1);
    assert.ok(exam.questions.length >= 5 && exam.recap.length >= 3);
    exam.questions.forEach((q, i) => assert.equal(q.id, `${chapter.id}-exam-${i + 1}`));
  }
  assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
  assert.equal(questions.length, 158);
  assert.equal(manifest.id, 'physics');
});

test('every numeric answer is recomputed independently from its verify expression', () => {
  const numeric = questions.filter(q => q.type === 'numeric');
  assert.ok(numeric.length >= 100);
  for (const q of numeric) {
    const computed = Function(`"use strict"; return (${q.verify});`)();
    assert.ok(Number.isFinite(computed), q.id);
    assert.ok(Math.abs(computed - q.answer) <= Math.abs(q.answer) * 0.005, `${q.id}: stored ${q.answer}, computed ${computed}`);
    assert.equal(gradeNumeric(q, String(computed)).correct, true, q.id);
    assert.equal(gradeNumeric(q, String(q.answer * 1.1)).correct, false, `${q.id} rejects 10% error`);
  }
  for (const q of questions.filter(q => q.type === 'choice')) {
    assert.ok(q.options.includes(q.answer) && new Set(q.options).size === q.options.length, q.id);
    assert.equal(gradeQuestion(q, q.answer).correct, true);
    assert.equal(gradeQuestion(q, q.options[1]).correct, false);
    assert.deepEqual([...shuffled(q.options, q.id)].sort(), [...q.options].sort());
  }
});

test('numeric judge: rounding, notation, units and conversions', () => {
  const v = { answer: 20, unit: 'm/s', tolerance: 0.02 };
  for (const input of ['20', '20.0', '19.8', '20 m/s', '72 km/h', '2e1', '2×10^1', '2 x 10¹', '２０', '20 m / s']) assert.equal(gradeNumeric(v, input).correct, true, input);
  for (const input of ['21', '20 kg', '', 'abc', '20 furlongs']) assert.equal(gradeNumeric(v, input).correct, false, input);
  assert.equal(gradeNumeric(v, '20 kg').reason, 'unit');
  assert.equal(gradeNumeric({ answer: 3.03, unit: 's' }, '3.0').correct, true);
  assert.equal(gradeNumeric({ answer: 3.03, unit: 's' }, '3').correct, true);
  assert.equal(gradeNumeric({ answer: 196000, unit: 'Pa' }, '1.96×10⁵').correct, true);
  assert.equal(gradeNumeric({ answer: 196000, unit: 'Pa' }, '196 kPa').correct, true);
  assert.equal(gradeNumeric({ answer: 150000, unit: 'J' }, '1,50,000').correct, false);
  assert.equal(gradeNumeric({ answer: 150000, unit: 'J' }, '150,000').correct, true);
  assert.equal(gradeNumeric({ answer: 50, unit: 'kW' }, '50000 W').correct, true);
  assert.equal(gradeNumeric({ answer: 6.67e-5, unit: 'N' }, '6.67e-5').correct, true);
  assert.equal(gradeNumeric({ answer: -196.15, unit: '°C' }, '−196 °C').correct, true);
  assert.equal(gradeNumeric({ answer: 2.5, unit: 'm/s^2' }, '2.5 m/s²').correct, true);
  assert.equal(gradeNumeric({ answer: 12.5, unit: 'm' }, '12,5').correct, true);
  assert.equal(gradeNumeric({ answer: 100, unit: '' }, '100倍').correct, true);
  assert.equal(parseNumeric('1.2 x 10^-3 kg').value, 0.0012);
});

test('every stage and exam has a realistic photo with complete attribution, stored offline', async () => {
  const allowed = /^(Public domain|CC0|CC BY(-SA)? [0-9.]+( [a-z]+)?)$/;
  const used = new Set(lessons.map(l => l.imageId));
  for (const id of used) {
    const image = images[id];
    assert.ok(image, id);
    assert.match(image.license, allowed, `${id} license ${image.license}`);
    if (/^CC BY/.test(image.license)) assert.match(image.licenseUrl, /creativecommons\.org\/licenses\/by/, id);
    assert.ok(image.author && image.file && image.alt, id);
    assert.match(image.source, /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/, id);
    assert.equal(image.path, `/art/physics/${id}.webp`);
    const info = await stat(new URL(`../web/public${image.path}`, import.meta.url));
    assert.ok(info.size > 5000 && info.size < 400000, `${id} size ${info.size}`);
  }
  assert.equal(used.size, 33);
  const files = await readdir(new URL('../web/public/art/physics/', import.meta.url));
  let total = 0; for (const file of files) total += (await stat(new URL(`../web/public/art/physics/${file}`, import.meta.url))).size;
  assert.ok(total < 40 * 1024 * 1024);
  const md = await readFile(new URL('../web/courses/physics/CREDITS.md', import.meta.url), 'utf8');
  for (const [id, image] of Object.entries(images)) assert.ok(md.includes(id) && md.includes(image.source), `CREDITS.md lists ${id}`);
  assert.match(md, /CC BY 4\.0/); assert.match(credits.text, /OpenStax/); assert.match(credits.changes, /改动/);
  const notices = await readFile(new URL('../THIRD_PARTY_NOTICES.txt', import.meta.url), 'utf8');
  assert.match(notices, /OpenStax/); assert.match(notices, /Wikimedia Commons/);
});

test('physics progress: shared normalizer, teach-before-quiz, sequential unlock', () => {
  const state = normalizeProgress({ version: 1, completed: ['ph01-01', 'nope'], responses: { 'ph01-01': { read: true, answers: {} }, junk: 1 } }, lessons);
  assert.deepEqual(state.completed, ['ph01-01']);
  assert.ok(state.responses['ph01-01'].read && !('junk' in state.responses));
  assert.equal(unlocked(lessons, state, 1), true);
  assert.equal(unlocked(lessons, state, 2), false);
  assert.equal(units.length, 11);
});
