import { unitsA } from './content-a.mjs';
import { unitsB } from './content-b.mjs';
import { unitsC } from './content-c.mjs';
import { images } from './images.mjs';
export { images };

export const credits = {
  text: '讲解与例题改编自 OpenStax《Physics》（Rice University，2020）与《College Physics》（Rice University，2012，流体单元），均采用 CC BY 4.0 许可。',
  changes: '改动说明：翻译为简体中文，按入门顺序重新组织与精简，改写讲解、替换例题数据并配写实照片；所有测验与单元测试题为本项目原创。本课程不代表 OpenStax 或 Rice University 认可。',
  sources: [
    { title: 'OpenStax, Physics', url: 'https://openstax.org/details/books/physics', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/' },
    { title: 'OpenStax, College Physics (1st ed.)', url: 'https://openstax.org/details/books/college-physics', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/' }
  ],
  images: '插图均为来自 Wikimedia Commons 的真实照片（公有领域、CC0、CC BY 或 CC BY-SA），已缩放并转为 WebP，逐张署名见“来源与版权”。'
};

// Saved progress is keyed by these explicit IDs: ph05-02 is always unit 5, stage 2; ph05-exam is unit 5's exam.
export const units = [...unitsA, ...unitsB, ...unitsC];
export const chapters = units.map((unit, chapterIndex) => {
  const stageLessons = unit.stages.map((stage, index) => ({
    id: `${unit.id}-${String(index + 1).padStart(2, '0')}`, kind: 'stage', title: stage.title, teach: stage.teach, image: images[stage.image], imageId: stage.image,
    questions: stage.quiz, chapterId: unit.id, chapterIndex, localIndex: index
  }));
  const exam = {
    id: `${unit.id}-exam`, kind: 'exam', title: `${unit.title} · 单元测试`, questions: unit.exam, chapterId: unit.id, chapterIndex, localIndex: stageLessons.length,
    // The exam opens with a formula recap of the unit (its "teach" step) before the test.
    recap: unit.stages.flatMap(stage => stage.teach.formulas), image: images[unit.stages.at(-1).image], imageId: unit.stages.at(-1).image
  };
  return { ...unit, lessons: [...stageLessons, exam] };
});
export const lessons = chapters.flatMap(chapter => chapter.lessons);
export const questions = lessons.flatMap(lesson => lesson.questions);
if (new Set(lessons.map(lesson => lesson.id)).size !== lessons.length) throw new Error('Duplicate physics lesson id');
if (new Set(questions.map(question => question.id)).size !== questions.length) throw new Error('Duplicate physics question id');
for (const lesson of lessons) if (!lesson.image) throw new Error(`Physics lesson ${lesson.id} has no image`);
