// Gray Crown English: an original course aligned to the grammar syllabus and topic sequence of
// New Concept English Books 1–2 (新概念英语 第一、二册). No NCE lesson text, dialogue, title or exercise is reproduced.
import { c, w } from './items.mjs';
import { book1a } from './content-book1a.mjs';
import { book1b } from './content-book1b.mjs';
import { book2 } from './content-book2.mjs';
export const units = [...book1a, ...book1b, ...book2];
// Cumulative graduation items written only for the final boss; none of them appears in practice.
export const finalReview = [
  c('选择正确的句子：', ['Excuse me, is this your seat?', 'Excuse me, this is your seat?', 'Excuse me, is your this seat?'], 'Excuse me, is this your seat?', '一般疑问句：Is this your…?'),
  w('补全：My aunt ___ (live) in Leeds since 2015.', ['has lived'], '从过去持续到现在：has + 过去分词。'),
  c('选择：There ___ some bread and two eggs on the plate.', ['is', 'are', 'be'], 'is', 'there be 的单复数通常与最近的名词一致：some bread 不可数。'),
  w('补全：Listen! Someone ___ (knock) at the door.', ['is knocking'], 'Listen! 提示正在发生，用现在进行时。'),
  c('选择：This is the ___ day of my life!', ['happiest', 'happier', 'most happy'], 'happiest', 'happy 的最高级 happiest。'),
  w('补全：The museum ___ (open) by the Queen in 1950.', ['was opened'], '过去时被动：was + 过去分词。'),
  c('选择：If I ___ a car, I would drive to the sea.', ['had', 'have', 'will have'], 'had', '与现在事实相反的假设：if + 过去时。'),
  w('间接引语："I can help," said Sam. → Sam said that he ___ help.', ['could'], 'can → could。'),
  c('选择：When I got home, my parents ___ dinner.', ['had already eaten', 'have already eaten', 'already eat'], 'had already eaten', '“过去的过去”用过去完成时。'),
  w('补全：The girl ___ dog won the prize is my cousin.', ['whose'], 'whose 表示所属。'),
  c('门上贴着“营业中”，但里面没有灯：', ['The shop might be closed.', 'The shop must to be closed.', 'The shop can closed.'], 'The shop might be closed.', 'might + 原形表示可能。'),
  w('翻译：我小时候常常去游泳。', ['I used to go swimming when I was a child.', 'When I was a child, I used to go swimming.', 'I used to swim when I was a child.', 'When I was a child, I used to swim.', 'I used to go swimming when I was young.', 'When I was young, I used to go swimming.', 'I used to go swimming when I was little.'], 'used to + 原形表示过去的习惯。')
];
export const credits = {
  syllabus: '课程顺序对齐《新概念英语》第一、二册（Longman / 外语教学与研究出版社）的语法与话题大纲；所有课文、对话、标题与练习均为本项目原创，未复制任何教材内容。',
  syllabusEn: 'Aligned to the New Concept English Books 1–2 syllabus. All texts, dialogues and exercises are original. New Concept English is a trademark of its publishers; this course is not affiliated with or endorsed by them.'
};
