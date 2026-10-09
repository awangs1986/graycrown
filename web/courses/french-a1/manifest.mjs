export default {
  id:'french-a1',version:1,status:'available',
  title:{en:'French · Paris Comic Adventure A1','zh-CN':'法语 · 巴黎漫画大冒险 A1'},
  description:{en:'156 comic-panel missions across 12 Paris neighbourhoods: vocabulary, grammar, sentences and offline French listening, with turn-based battles and bosses.', 'zh-CN':'和 Léa 一起走遍巴黎 12 个街区，修好 156 格被 Gribouille 先生涂花的漫画！在回合对战中用词汇、句子、语法与听力发动招式，逐步掌握法语 A1。'},
  exerciseTypes:['choice','text','ordering','listening'],load:()=>import('./player.mjs')
};
