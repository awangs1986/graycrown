export default {
  id:'french-a1',version:1,status:'available',
  title:{en:'French · Bonjour A1','zh-CN':'法语 · Bonjour A1'},
  description:{en:'96 progressive exercises across 8 everyday situations, with vocabulary, grammar, sentences and offline French listening.', 'zh-CN':'8 个日常场景、96 个练习单元，结合单词、句子、语法、离线听力与综合测试，循序渐进学习 A1。'},
  exerciseTypes:['choice','text','ordering','listening'],load:()=>import('./player.mjs')
};
