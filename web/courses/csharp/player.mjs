import { chapters, lessons } from './course.mjs';
import { createEditor } from './editor.mjs';
import { CSharpRuntime } from './runtime.mjs';
import { gradeCode } from './judge.mjs';
import { createCoursePlayer, element, button, downloadFile } from '../shared/player.mjs';

export async function mount(root, context) {
  return createCoursePlayer(root,context,{title:'C# · 王冠远征',subtitle:'7 章 · 84 道编程试炼 · 从第一行代码到文字 RPG',chapters,lessons},ui=>{
    const {body,lesson}=ui;
    const theory=element('section',null,'learn-explanation');theory.append(element('strong',lesson.topic),element('p',lesson.teach));body.append(theory);
    body.append(element('p',lesson.objective,'learn-task'));
    if(lesson.rules){const rules=element('ol',null,'learn-task');lesson.rules.forEach(rule=>rules.append(element('li',rule)));body.append(rules);}
    const samples=element('details',null,'learn-explanation');samples.append(element('summary',`测试用例（${lesson.tests.length} 组）`));
    lesson.tests.forEach((test,index)=>{samples.append(element('strong',`测试 ${index+1}`),element('pre',`输入：\n${test.input||'（无）'}\n期望输出：\n${test.output||'（无）'}`));});body.append(samples);
    const editorRoot=element('div',null,'learn-editor');editorRoot.setAttribute('aria-label','C# 代码编辑器');body.append(editorRoot);
    let initializing=true;
    const editor=createEditor(editorRoot,value=>{if(initializing)return;ui.state.drafts[lesson.id]=value;ui.save();});
    editor.setValue(typeof ui.state.drafts[lesson.id]==='string'?ui.state.drafts[lesson.id]:lesson.starter);initializing=false;
    body.append(element('label','程序输入（预先填写，每行对应一次 ReadLine）'));
    const input=element('textarea',null,'learn-input');input.setAttribute('aria-label','程序输入');input.value=typeof ui.state.inputs[lesson.id]==='string'?ui.state.inputs[lesson.id]:(lesson.demoInput??lesson.tests[0].input);body.append(input);
    input.addEventListener('input',()=>{ui.state.inputs[lesson.id]=input.value;ui.save();});
    const status=element('p','C# 编译器将在运行时按需加载。','learn-status');body.append(status);
    const runtime=new CSharpRuntime(text=>status.textContent=text);
    const result=element('pre','运行代码查看输出；提交时会执行全部测试用例。','learn-result');result.setAttribute('aria-live','polite');
    let lastFeedback='';
    async function execute(submit) {
      if(ui.busy)return;
      ui.setBusy(true);input.disabled=true;editorRoot.style.pointerEvents='none';editor.setDiagnostics([]);
      const source=editor.getValue();ui.state.drafts[lesson.id]=source;ui.state.inputs[lesson.id]=input.value;
      try {
        const value=await runtime.run(source,submit?lesson.tests.map(test=>test.input):[input.value]);
        editor.setDiagnostics((value.compiled.diagnostics??[]).map(item=>({...item,level:item.severity})));
        if(submit){
          const graded=gradeCode(lesson,source,value);
          result.className=`learn-result ${graded.passed?'success':'error'}`;
          lastFeedback=graded.checks.map(check=>`${check.passed?'✓':'✗'} ${check.label}：${check.message}${!check.passed&&check.expected!==undefined?`\n输入：${check.input||'（无）'}\n期望：${JSON.stringify(check.expected)}\n实际：${JSON.stringify(check.actual)}`:''}`).join('\n');
          result.textContent=(graded.passed?(lesson===lessons.at(-1)?'本题通过！恭喜完成 C# 课程，文字 RPG 已完成。\n':'本题通过！下一题已解锁。\n'):'还没有通过，请根据反馈修改。\n')+lastFeedback;
          await ui.record(graded.passed,graded.score);
        }else{
          const execution=value.executions[0];
          result.className=`learn-result ${value.compiled.ok&&execution?.ok?'success':'error'}`;
          result.textContent=value.compiled.ok?`${execution?.output??''}${execution?.stderr?'\n'+execution.stderr:''}`:value.compiled.stderr;
          lastFeedback=result.textContent;await ui.progress.persist();
        }
      }catch(error){result.className='learn-result error';result.textContent=error.message;ui.report(error);}
      finally{ui.setBusy(false);input.disabled=false;editorRoot.style.pointerEvents='';}
    }
    const actions=element('div',null,'learn-actions');
    for(const [name,action,style] of [['▶ 运行',()=>execute(false),'soft-btn'],['提交全部测试',()=>execute(true),'primary-btn'],['恢复起始代码',()=>{if(ui.busy||!confirm('恢复起始代码会替换当前草稿，继续？'))return;editor.setValue(lesson.starter);},'ghost-btn']]){
      const control=button(name,action,style);control.dataset.lockWhileBusy='';actions.append(control);
    }
    body.append(actions,result);
    const hints=element('details',null,'learn-explanation');hints.append(element('summary','分级提示'));
    lesson.hints.forEach((text,index)=>{hints.append(button(`提示 ${index+1}`,event=>{event.currentTarget.replaceWith(element('p',text));ui.state.hints[lesson.id]=(Number(ui.state.hints[lesson.id])||0)+1;ui.save();}));});body.append(hints);
    const answer=element('div');
    const reveal=button('查看参考解法',()=>{
      if(ui.busy||!confirm('先尝试自己完成。现在查看参考解法？本次会记录为参考练习。'))return;
      ui.state.assisted[lesson.id]=true;ui.save();answer.replaceChildren(element('pre',lesson.solution,'learn-code'));
      answer.append(button('填入编辑器',()=>{if(!ui.busy)editor.setValue(lesson.solution);}));
    });reveal.dataset.lockWhileBusy='';body.append(reveal,answer);
    const bottom=element('div',null,'learn-actions');bottom.append(button('下载 Program.cs',()=>downloadFile('Program.cs',editor.getValue())),button('请 AI 导师提示',()=>ui.askTutor({code:editor.getValue(),compilerMessage:lastFeedback,output:''})));body.append(bottom);
    if(lesson===lessons.at(-1))body.append(element('p','毕业后：用 dotnet new console 创建控制台项目，将下载的 Program.cs 放入项目，再用 dotnet run 启动。输入 look、right、fight 等命令即可实时游玩。','learn-explanation'));
    return ()=>{runtime.dispose();editor.destroy();};
  });
}
