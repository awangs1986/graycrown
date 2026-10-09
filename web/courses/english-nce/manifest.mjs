export default {
  id: 'english-nce', version: 1, status: 'available',
  title: { en: 'English · Comic City Quest (NCE 1–2 syllabus)', 'zh-CN': '英语 · 漫画城大冒险（新概念 1–2 册）' },
  description: { en: '25 comic-book regions and 325 quests aligned to the New Concept English Books 1–2 grammar syllabus: vocabulary, dialogues, stories, grammar, translation and offline listening. All content is original.', 'zh-CN': '对齐新概念英语第一、二册语法大纲的原创漫画 RPG：25 个街区、325 格漫画任务，词汇、对话、小故事、语法、中译英与离线听力，打败捣蛋鬼 Muddle 先生，收集你的漫画册。' },
  exerciseTypes: ['choice', 'text', 'ordering', 'listening'], load: () => import('./player.mjs')
};
