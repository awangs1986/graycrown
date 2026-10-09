import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { chapters, lessons } from '../web/courses/french-a1/course.mjs';
import { adventure } from '../web/courses/french-a1/adventure.mjs';
import { comicPanel, places, propsFor } from '../web/courses/french-a1/art.mjs';
import { comicPanel as englishPanel } from '../web/courses/english-nce/art.mjs';
import { normalizeProgress } from '../web/courses/shared/progress.mjs';
import { attachAdventure } from '../web/courses/shared/adventure.mjs';

const FRANCHISE = new RegExp('p\\u006fk[e\\u00e9]m\\u006fn|pik\\u0061chu|\\u5b9d\\u53ef\\u68a6|\\u5bf6\\u53ef\\u5922|\\u30dd\\u30b1\\u30e2\\u30f3|\\u5ba0\\u7269|\\u9053\\u9986', 'i');

test('every French question has its own Paris comic panel and every exam is a boss panel', () => {
  const used = new Set();
  for (const lesson of lessons) for (const q of lesson.questions) {
    assert.ok(places[q.scene.place], `${q.id} place ${q.scene.place}`);
    used.add(q.scene.place);
    const svg = comicPanel(q.scene);
    assert.match(svg, /^<svg class="comic-panel"/); assert.ok(!/<image|\.png/i.test(svg), q.id);
  }
  for (const name of ['cafe', 'boulangerie', 'metro', 'marche', 'gare', 'pharmacie']) assert.ok(used.has(name), name);
  assert.ok(lessons.filter(l => l.key === 'exam').every(l => l.questions.every(q => q.scene.villain)));
  assert.ok(propsFor('Un croissant et un café, s’il vous plaît.').includes('croissant'));
  assert.ok(propsFor('Il fait froid, je prends mon manteau.').includes('coat'));
  assert.ok(englishPanel({}).includes('comic-panel'), 'English still renders through the shared kit');
});

test('French lesson ids are unchanged and old pet-era saves load cleanly', () => {
  assert.equal(lessons.length, 156);
  for (const id of ['fr01-01', 'fr01-12', 'fr08-12', 'fr-basics-exam', 'fr-health-drill']) assert.ok(lessons.some(l => l.id === id), id);
  const legacy = { version: 1, started: true, companionId: 'pet-7', currentLessonId: 'fr02-03', completed: ['fr01-01', 'fr01-02'], battles: { 'fr01-03': { cleared: ['fr01-v3'], stamina: 2 } } };
  const state = normalizeProgress(legacy, lessons);
  assert.deepEqual(state.completed, ['fr01-01', 'fr01-02']); assert.equal(state.currentLessonId, 'fr02-03');
  assert.deepEqual(state.battles['fr01-03'], { cleared: ['fr01-v3'], stamina: 2 });
  assert.equal('companionId' in state, false);
});

test('French adventure keeps map, quests and a boss per unit with no creature-collection wording', () => {
  adventure.prepare(chapters); attachAdventure(chapters, adventure);
  assert.equal(adventure.regions.length, chapters.length);
  for (const chapter of chapters) { assert.equal(chapter.adventure.quests.length, chapter.lessons.length); assert.equal(chapter.lessons.at(-1).adventure.boss, true); }
  assert.ok(!FRANCHISE.test(JSON.stringify(adventure)));
});

test('repository source ships no franchise names and no French raster art', () => {
  assert.equal(existsSync(new URL('../web/public/art/french-pets', import.meta.url)), false);
  const walk = dir => readdirSync(dir).flatMap(name => { const path = new URL(name, dir); return statSync(path).isDirectory() ? walk(new URL(`${name}/`, dir)) : [path]; });
  for (const file of [...walk(new URL('../web/courses/', import.meta.url)), new URL('../README.md', import.meta.url), new URL('../ARCHITECTURE.md', import.meta.url)]) {
    assert.ok(!FRANCHISE.test(readFileSync(file, 'utf8')), file.pathname);
  }
});
