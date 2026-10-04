export default {
  id: 'c',
  version: 1,
  status: 'available',
  title: { en: 'C · The Ashen Crown', 'zh-CN': 'C · 灰烬王冠' },
  description: {
    en: '140 trials across 7 chapters. Learn programming from scratch through a console RPG adventure.',
    'zh-CN': '7 章 140 道试炼，从零学习语法与编程逻辑，逐步完成控制台文字 RPG。'
  },
  exerciseTypes: ['code'],
  load: () => import('./player.mjs')
};
