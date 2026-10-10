import { unitsA } from './content-a.mjs';
import { unitsB } from './content-b.mjs';
// CC BY-NC-SA 4.0 adapted unit (separate file, separate license) — placed as the bridge at the start of 初中.
import { unitsOpenstax, openstaxSource } from './content-openstax.mjs';

export const grades = {
  low: { name: '小学低年级', emoji: '🌱', note: '1–2 年级 · 观察、画图、有序' },
  mid: { name: '小学中年级', emoji: '🌿', note: '3–4 年级 · 线段图、假设、比较' },
  high: { name: '小学高年级', emoji: '🌳', note: '5–6 年级 · 转化、分类、最坏情况' },
  junior: { name: '初中', emoji: '🚀', note: '7–9 年级 · 数形结合、构造、归纳' }
};
export const credits = {
  text: '本课程的讲解、例题、测验与动画均为本项目原创。经典名题（高斯求和、七桥问题、鸡兔同笼与“物不知数”出自《孙子算经》、百鸡问题出自《张丘建算经》、盈不足出自《九章算术》、汉诺塔）属于公有领域，按自己的话重新讲述。',
  changes: '没有找到许可证允许改编的中文奥数开源课程（核查记录见 CREDITS.md）。只有“解方程：等式的性质”一个单元（om15）的讲解与例题改编自 OpenStax《Prealgebra 2e》§8.1–8.2（Rice University，CC BY-NC-SA 4.0），已译为中文并改写、更换例题数字；该单元的文件 content-openstax.mjs 按 CC BY-NC-SA 4.0 授权（非商业、相同方式共享），仅供个人非商业学习使用。',
  sources: [openstaxSource],
  tools: '例题动画用 Remotion（Remotion License，个人免费）预先渲染为 WebM 视频；中文字体为 Noto Sans SC（SIL OFL 1.1）。'
};
// Saved progress is keyed by these explicit IDs: om05-02 is always unit 5 stage 2; om05-exam is unit 5's exam.
const junior = unitsB.findIndex(u => u.grade === 'junior');
export const units = [...unitsA, ...unitsB.slice(0, junior), ...unitsOpenstax, ...unitsB.slice(junior)];
export const chapters = units.map((unit, chapterIndex) => {
  const stageLessons = unit.stages.map((s, localIndex) => ({ ...s, kind: 'stage', questions: s.quiz, chapterId: unit.id, chapterIndex, localIndex, grade: unit.grade }));
  const exam = { id: `${unit.id}-exam`, kind: 'exam', title: `${unit.title} · 单元测试`, questions: unit.exam, chapterId: unit.id, chapterIndex, localIndex: stageLessons.length, grade: unit.grade,
    recap: stageLessons.map(s => ({ method: s.method, title: s.title })) };
  return { ...unit, lessons: [...stageLessons, exam] };
});
export const lessons = chapters.flatMap(c => c.lessons);
export const questions = lessons.flatMap(l => l.questions);
export const videos = lessons.filter(l => l.video).map(l => ({ id: l.video, title: l.title, captions: l.teach.example.steps, problem: l.teach.example.problem }));
if (new Set(lessons.map(l => l.id)).size !== lessons.length) throw new Error('Duplicate olympiad lesson id');
if (new Set(questions.map(q => q.id)).size !== questions.length) throw new Error('Duplicate olympiad question id');
