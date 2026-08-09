import test from 'node:test';
import assert from 'node:assert/strict';
import { chapters, lessons } from '../web/course.mjs';
import { EN, ZH, localizeChapter, localizeLesson, localizeStarterCode } from '../web/i18n.mjs';
import { emptySave, normalizeSave } from '../web/save-store.mjs';

const chinese = /[\u3400-\u9fff]/;

test('a new save defaults to English and preserves a valid language', () => {
  assert.equal(emptySave().language, EN);
  assert.equal(normalizeSave({ ...emptySave(), language: ZH }).language, ZH);
  assert.equal(normalizeSave({ ...emptySave(), language: 'invalid' }).language, EN);
});

test('all 7 chapters and 140 lessons have complete English presentation text', () => {
  assert.equal(chapters.length, 7);
  assert.equal(lessons.length, 140);
  for (const chapter of chapters) {
    const visible = localizeChapter(chapter, EN);
    assert.doesNotMatch([visible.rune, visible.title, visible.subtitle, visible.description, visible.scene].join(' '), chinese, chapter.id);
  }
  for (const lesson of lessons) {
    const visible = localizeLesson(lesson, EN);
    const presentation = [visible.title, visible.difficulty, visible.knowledge, visible.quote, visible.story, visible.objective, visible.rules, ...visible.hints, visible.passStory].join(' ');
    assert.doesNotMatch(presentation, chinese, lesson.id);
    assert.doesNotMatch(localizeStarterCode(lesson.starterCode, EN), chinese, `${lesson.id} starter code`);
    assert.match(visible.objective, /<code>/, lesson.id);
    assert.equal(localizeLesson(lesson, ZH), lesson);
  }
});
