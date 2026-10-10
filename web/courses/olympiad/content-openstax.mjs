// Adapted from OpenStax, Prealgebra 2e (Lynn Marecek, MaryAnne Anthony-Smith, Andrea Honeycutt Mathis; Rice University, 2020),
// Sections 8.1 "Solve Equations Using the Subtraction and Addition Properties of Equality" and
// 8.2 "Solve Equations Using the Division and Multiplication Properties of Equality",
// https://openstax.org/details/books/prealgebra-2e — licensed CC BY-NC-SA 4.0 (https://creativecommons.org/licenses/by-nc-sa/4.0/).
// Changes: translated into Simplified Chinese, condensed, rewritten for kids with a balance-scale story; example numbers changed;
// quiz/exam questions, hooks, fun facts and animations are original.
// THIS FILE is licensed CC BY-NC-SA 4.0 (non-commercial, share-alike), NOT under the project's MIT license.
// Not endorsed by OpenStax or Rice University.
import { mc, num, stage } from './builders.mjs';

export const openstaxSource = { title: 'OpenStax, Prealgebra 2e (§8.1–8.2)', url: 'https://openstax.org/details/books/prealgebra-2e', license: 'CC BY-NC-SA 4.0', licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/' };

export const unitsOpenstax = [
{ id: 'om15', grade: 'junior', title: '解方程：等式的性质（改编自 OpenStax）', topic: '天平 · 等式性质', source: 'openstax', stages: [
  stage('om15-01', '方程是一道谜题：加减不改平衡', '天平模型', {
    hook: '天平左边放一个神秘盒子和 12 颗弹珠，右边放 28 颗弹珠，正好平衡。盒子里有几颗？两边同时拿走 12 颗，答案就露出来了。',
    life: '买东西：“我带的钱 − 12 元 = 还剩 16 元”，带了多少钱？这就是一个方程。',
    concept: ['解方程就像解谜：要找到让等号两边相等的那个数，它叫方程的“解”。', '检验一个数是不是解：①把数代入方程；②分别算出两边；③两边相等就是解，不相等就不是。', '等式的减法性质：两边同时减去同一个数，等式仍成立；加法性质：两边同时加上同一个数，等式也仍成立。目标是让未知数单独留在一边。'],
    example: { problem: '解方程 x + 12 = 28，并检验。', steps: ['想让 x 单独留下，就要去掉 +12', '两边同时减 12：x + 12 − 12 = 28 − 12', '化简得 x = 16', '检验：16 + 12 = 28，两边相等 ✓'], answer: 'x = 16' },
    funFact: '“方程”这个词最早出自中国古代的《九章算术》，里面专门有一章叫“方程”。'
  }, [
    num('om15-01-q1', '解方程 n − 12 = 16，n = ?', 28, '16+12', '两边同时加 12：n = 28。', '去掉 −12 要加 12。'),
    mc('om15-01-q2', 'x = 2 是不是方程 5x − 3 = 7 的解？', ['是', '不是', '无法判断', '只有 x = 3 才是'], '代入：5×2 − 3 = 7，两边相等，所以是解。', '把 2 代进去算一算。'),
    num('om15-01-q3', '解方程 y + 3.5 = 10，y = ?', 6.5, '10-3.5', '两边同时减 3.5：y = 6.5。', '两边同时减去同一个数。')
  ]),
  stage('om15-02', '乘除也不改平衡：求出一份是多少', '天平模型', {
    hook: '天平左边 4 个一样的盒子，右边 36 颗弹珠，平衡了。一个盒子里有几颗？把两边都平均分成 4 份看看。',
    life: '4 个人平分 36 元餐费，每人出 x 元：4x = 36。',
    concept: ['等式的除法性质：两边同时除以同一个不为 0 的数，等式仍成立。', '等式的乘法性质：两边同时乘同一个数，等式也仍成立。', '4x = 36 两边除以 4；x ÷ 3 = 5 两边乘 3。解完记得代回去检验。'],
    example: { problem: '解方程 4x = 36，并检验。', steps: ['x 被乘了 4，要“撤销”乘 4', '两边同时除以 4：4x ÷ 4 = 36 ÷ 4', '得到 x = 9', '检验：4 × 9 = 36 ✓'], answer: 'x = 9' },
    funFact: '“乘”和“除”、“加”和“减”互为逆运算，解方程就是一步步“倒着做”。'
  }, [
    num('om15-02-q1', '解方程 7x = 63，x = ?', 9, '63/7', '两边除以 7。', '撤销乘 7。'),
    num('om15-02-q2', '解方程 x ÷ 5 = 8，x = ?', 40, '8*5', '两边乘 5：x = 40。', '撤销除以 5。'),
    num('om15-02-q3', '3 本相同的笔记本共 27 元，一本多少元？', 9, '27/3', '3x = 27，x = 9。', '先列方程 3x = 27。')
  ])],
  exam: [
    num('om15-exam-1', '解方程 x − 25 = 40。', 65, '40+25', 'x = 65。', ''),
    num('om15-exam-2', '解方程 6x = 42。', 7, '42/6', 'x = 7。', ''),
    num('om15-exam-3', '解方程 x ÷ 4 = 12。', 48, '12*4', 'x = 48。', ''),
    num('om15-exam-4', '解方程 2x + 5 = 17（先减再除）。', 6, '(17-5)/2', '2x = 12，x = 6。', '')
  ] }
];
