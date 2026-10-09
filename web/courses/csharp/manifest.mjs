export default {
  id:'csharp',version:1,status:'available',
  title:{en:'C# · Crown Quest','zh-CN':'C# · 王冠远征'},
  description:{en:'96 exercises in 8 chapters: syntax, input, decisions, loops, methods and objects, ending in a console RPG.', 'zh-CN':'穿越八大区域、完成 96 道符文委托，收集王冠核心。从零学习 C# 语法与逻辑，亲手造出文字 RPG。'},
  exerciseTypes:['code'],load:()=>import('./player.mjs')
};
