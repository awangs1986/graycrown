export default {
  id: 'olympiad', version: 1, status: 'available',
  title: { en: 'Math Olympiad Thinking · Primary to Junior High', 'zh-CN': '奥数思维课 · 小学到初中' },
  description: { en: '14 units in 4 stages (primary low/mid/high → junior high). Every stage teaches a thinking method with a real-life hook and an animated worked example, then tests you. Original Chinese content.', 'zh-CN': '4 个学段、14 个单元：找规律、鸡兔同笼、行程、数论、抽屉原理、容斥、配方、汉诺塔……每个阶段先讲思维方法（生活引入 + 动画例题 + 分步解答），再测验。全部中文原创。' },
  exerciseTypes: ['choice', 'numeric'], load: () => import('./player.mjs')
};
