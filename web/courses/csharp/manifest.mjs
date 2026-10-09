export default {
  id:'csharp',version:1,status:'available',
  title:{en:'C# · Crown Quest','zh-CN':'C# · 王冠远征'},
  description:{en:'96 exercises in 8 chapters: syntax, input, decisions, loops, methods, collections, classes and exceptions, ending in a console RPG.', 'zh-CN':'8 章 96 道编程试炼，由浅入深学习语法、逻辑、集合与面向对象，亲手完成有探索、战斗和结局的文字 RPG。'},
  exerciseTypes:['code'],load:()=>import('./player.mjs')
};
