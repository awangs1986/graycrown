export default {
  id:'french-a1',version:1,status:'available',
  title:{en:'French · Bonjour A1','zh-CN':'法语 · Bonjour A1'},
  description:{en:'156 progressive exercises across 12 A1 units, from the alphabet to travel plans, with vocabulary, grammar, offline listening and unit tests.', 'zh-CN':'从字母发音到出行计划，12 个 A1 单元、156 个练习，结合单词、语法、离线听力、阅读与章节测试循序渐进。'},
  exerciseTypes:['choice','text','ordering','listening'],load:()=>import('./player.mjs')
};
