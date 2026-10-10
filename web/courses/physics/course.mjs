import { unitsA } from './content-a.mjs';
import { unitsB } from './content-b.mjs';
import { unitsC } from './content-c.mjs';
import { images } from './images.mjs';
import { juniorA } from './junior-a.mjs';
import { juniorB } from './junior-b.mjs';
import { animations } from './anims.mjs';
export { animations };
export { images };

export const credits = {
  text: '讲解与例题改编自 OpenStax《Physics》（Rice University，2020）与《College Physics》（Rice University，2012，流体单元），均采用 CC BY 4.0 许可。',
  changes: '改动说明：每单元开头的“入门”阶段（故事、生活例子、小实验、动画与测验）为本项目原创；进阶阶段翻译为简体中文，按入门顺序重新组织与精简，改写讲解、替换例题数据并配写实照片；所有测验与单元测试题为本项目原创。本课程不代表 OpenStax 或 Rice University 认可。',
  sources: [
    { title: 'OpenStax, Physics', url: 'https://openstax.org/details/books/physics', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/' },
    { title: 'OpenStax, College Physics (1st ed.)', url: 'https://openstax.org/details/books/college-physics', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/' }
  ],
  images: '插图均为来自 Wikimedia Commons 的真实照片（公有领域、CC0、CC BY 或 CC BY-SA），已缩放并转为 WebP，逐张署名见“来源与版权”。'
};

// Saved progress is keyed by these explicit IDs: ph05-02 is always unit 5, stage 2; ph05-exam is unit 5's exam.
export const units = [...unitsA, ...unitsB, ...unitsC];
// Junior-high intro layer (原创，面向初中零基础) placed BEFORE each unit's original stages. Original stages,
// explanations and questions are kept unchanged as the advanced layer, and keep their ids (ph05-02 = unit 5, original stage 2).
export const junior = { ...juniorA, ...juniorB };
// Animations attached to original stages without changing their text.
export const coreAnimations = { 'ph02-03': 'free-fall', 'ph03-02': 'projectile', 'ph04-03': 'friction', 'ph06-02': 'roller-coaster', 'ph08-02': 'lever', 'ph09-03': 'buoyancy', 'ph10-01': 'pendulum', 'ph10-02': 'transverse-wave' };
export const chapters = units.map((unit, chapterIndex) => {
  const intro = (junior[unit.id] ?? []).map(stage => ({ id: stage.id, kind: 'stage', level: 'junior', title: stage.title, teach: stage.teach, anim: stage.anim ?? null,
    image: images[stage.image], imageId: stage.image, questions: stage.quiz, chapterId: unit.id, chapterIndex }));
  const core = unit.stages.map((stage, index) => {
    const id = `${unit.id}-${String(index + 1).padStart(2, '0')}`;
    return { id, kind: 'stage', level: 'core', title: stage.title, teach: stage.teach, anim: coreAnimations[id] ?? null, image: images[stage.image], imageId: stage.image,
      questions: stage.quiz, chapterId: unit.id, chapterIndex };
  });
  // Explicit easy-to-hard order: gentle intro stages → original stages → unit exam.
  const stageLessons = [...intro, ...core].map((lesson, localIndex) => ({ ...lesson, localIndex }));
  const exam = {
    id: `${unit.id}-exam`, kind: 'exam', level: 'core', title: `${unit.title} · 单元测试`, questions: unit.exam, chapterId: unit.id, chapterIndex, localIndex: stageLessons.length,
    // The exam opens with a formula recap of the unit (its "teach" step) before the test.
    recap: stageLessons.flatMap(stage => stage.teach.formulas), image: images[unit.stages.at(-1).image], imageId: unit.stages.at(-1).image
  };
  return { ...unit, stageCount: stageLessons.length, lessons: [...stageLessons, exam] };
});
export const lessons = chapters.flatMap(chapter => chapter.lessons);
export const questions = lessons.flatMap(lesson => lesson.questions);
if (new Set(lessons.map(lesson => lesson.id)).size !== lessons.length) throw new Error('Duplicate physics lesson id');
if (new Set(questions.map(question => question.id)).size !== questions.length) throw new Error('Duplicate physics question id');
for (const lesson of lessons) { if (!lesson.image) throw new Error(`Physics lesson ${lesson.id} has no image`); if (lesson.anim && !animations[lesson.anim]) throw new Error(`Physics lesson ${lesson.id} has unknown animation`); }
