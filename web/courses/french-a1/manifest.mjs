export default {
  id:'french-a1',version:1,status:'available',
  title:{en:'French · Dawn Pet League A1','zh-CN':'法语 · 晨钟宠物联盟 A1'},
  description:{en:'156 progressive exercises across 12 A1 regions, with vocabulary, grammar, sentences and offline French listening.', 'zh-CN':'选择初始伙伴，挑战十二座道馆，收集 24 种宠物！在 156 场回合对战中，通过词汇、句子、语法与听力发动招式，逐步掌握法语 A1。'},
  exerciseTypes:['choice','text','ordering','listening'],load:()=>import('./player.mjs')
};
