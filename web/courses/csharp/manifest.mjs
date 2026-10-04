export default {
  id:'csharp',version:1,status:'available',
  title:{en:'C# · Crown Quest','zh-CN':'C# · 王冠远征'},
  description:{en:'84 exercises in 7 chapters: syntax, input, decisions, loops, methods and objects, ending in a console RPG.', 'zh-CN':'7 章 84 道编程试炼，从零学习语法与逻辑，亲手完成有探索、战斗和结局的文字 RPG。'},
  exerciseTypes:['code'],load:()=>import('./player.mjs')
};
