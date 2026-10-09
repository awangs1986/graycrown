import { chapters, lessons, furtherPractice } from './course.mjs';
import { gradeFrench, shuffled } from './judge.mjs';
import { createCoursePlayer, element, button } from '../shared/player.mjs';
import './french.css';

export async function mount(root,context){
  return createCoursePlayer(root,context,{title:'法语 · Bonjour A1',subtitle:`${chapters.length} 个单元 · ${lessons.length} 个练习 · 词汇、语法、听力与阅读`,theme:'french',chapters,lessons},ui=>{
    const {body,lesson,chapter}=ui;
    const responses=ui.state.responses[lesson.id]&&typeof ui.state.responses[lesson.id]==='object'&&!Array.isArray(ui.state.responses[lesson.id])?ui.state.responses[lesson.id]:{};
    ui.state.responses[lesson.id]=responses;
    const media=[];let vocabularyAudio;
    const goal=element('p',null,'unit-goal');goal.append(element('span','本单元目标'),element('strong',chapter.goal));body.append(goal);
    const vocab=element('details',null,'learn-explanation');vocab.append(element('summary',`本章词表与发音（${chapter.vocabulary.length} 项）`));
    const grid=element('div',null,'vocabulary-grid');
    chapter.vocabulary.forEach(item=>{
      const card=element('div',null,'vocabulary-card'),copy=element('div',item.fr);copy.append(element('small',item.meaning));
      const play=button('▶',async()=>{vocabularyAudio?.pause();vocabularyAudio=new Audio(item.audio);try{await vocabularyAudio.play();}catch{ui.notify('音频无法播放，请检查课程音频文件。');}});play.setAttribute('aria-label',`播放 ${item.fr}`);card.append(play,copy);grid.append(card);
    });vocab.append(grid,element('p',chapter.pronunciation));
    const links=element('ul',null,'further-links');
    for(const item of furtherPractice){const li=element('li'),a=element('a',item.label);a.href=item.url;a.target='_blank';a.rel='noopener noreferrer';li.append(a);links.append(li);}
    vocab.append(element('p','课外延伸（可选，外部网站，需要联网）：'),links);body.append(vocab);
    if(lesson.topic==='听力'||lesson.questions.some(q=>q.audio))body.append(element('p','先听录音再回答，可以重复播放或调慢速度。需要帮助时再查看文字稿。','learn-explanation'));
    const feedback=new Map();let lastGrade=null;
    for(const [index,question] of lesson.questions.entries()){
      const field=element('fieldset',null,'french-question');field.dataset.questionId=question.id;
      const legend=element('legend');legend.append(element('span',String(index+1),'question-number'),document.createTextNode(question.prompt));field.append(legend);
      if(question.passage)field.append(element('p',question.passage,'fr-passage'));
      if(question.audio){
        const box=element('div',null,'listening-box');field.append(box);
        const audio=element('audio');audio.controls=true;audio.preload='none';audio.src=question.audio;audio.setAttribute('aria-label',`第${index+1}题法语录音`);media.push(audio);box.append(audio);
        audio.addEventListener('play',()=>{media.filter(item=>item!==audio).forEach(item=>item.pause());vocabularyAudio?.pause();});
        audio.addEventListener('error',()=>ui.notify('无法加载听力音频。请检查安装包中的 audio/fr 文件夹。'));
        const speed=button('慢速 0.8×',()=>{audio.playbackRate=audio.playbackRate===1?0.8:1;speed.textContent=audio.playbackRate===1?'慢速 0.8×':'恢复正常速度';});box.append(speed);
        const transcript=element('details');transcript.append(element('summary','需要帮助：查看文字稿'),element('p',question.transcript));
        transcript.addEventListener('toggle',()=>{if(transcript.open){ui.state.assisted[lesson.id]=true;ui.save();}});box.append(transcript);
      }
      const saveAnswer=value=>{responses[question.id]=value;ui.save();feedback.get(question.id)?.replaceChildren();};
      if(question.type==='choice'){
        shuffled(question.options,question.id).forEach((option,optionIndex)=>{
          const label=element('label',null,'french-choice'),input=element('input');input.type='radio';input.name=question.id;input.value=option;input.checked=responses[question.id]===option;input.setAttribute('aria-label',option);
          input.addEventListener('change',()=>saveAnswer(option));label.append(input,element('span',option));field.append(label);
        });
      }else if(question.type==='ordering'){
        let selected=Array.isArray(responses[question.id])?[...responses[question.id]]:[];
        const answer=element('div',null,'word-answer');answer.setAttribute('aria-label','已选词语');answer.dataset.placeholder='点击下方词语，按顺序组成句子';
        const bank=element('div',null,'word-bank');
        function redraw(){
          answer.replaceChildren(...selected.map((word,index)=>button(word,()=>{selected.splice(index,1);saveAnswer([...selected]);redraw();},'')));
          const remaining=[...selected];
          bank.replaceChildren(...shuffled(question.tokens.map((word,index)=>({word,index})),question.id).map(({word,index})=>{
            const used=remaining.indexOf(word);const control=button(word,()=>{selected.push(word);saveAnswer([...selected]);redraw();},'');
            if(used>=0){remaining.splice(used,1);control.disabled=true;}return control;
          }));
        }
        redraw();field.append(answer,bank,button('重新排列',()=>{selected=[];saveAnswer([]);redraw();}));
      }else{
        const input=element('input',null,'french-answer');input.type='text';input.lang='fr';input.autocomplete='off';input.spellcheck=false;input.setAttribute('aria-label',question.prompt);input.value=typeof responses[question.id]==='string'?responses[question.id]:'';
        input.addEventListener('input',()=>saveAnswer(input.value));field.append(input);
        const accents=element('div',null,'accent-keys');
        for(const char of ['é','è','ê','ë','à','â','ç','î','ï','ô','ù','û','ü','œ',"'"]){const key=button(char,()=>{const start=input.selectionStart??input.value.length,end=input.selectionEnd??start;input.setRangeText(char,start,end,'end');saveAnswer(input.value);input.focus();},'');key.setAttribute('aria-label',`插入 ${char}`);accents.append(key);}
        field.append(accents);
      }
      const message=element('div');message.setAttribute('aria-live','polite');feedback.set(question.id,message);field.append(message);body.append(field);
    }
    const summary=element('div','完成所有小题后提交；可以修改并再次尝试。','learn-result');summary.setAttribute('role','status');
    const submit=button('提交答案',async()=>{
      if(ui.busy)return;ui.setBusy(true);
      try{
        lastGrade=gradeFrench(lesson,responses);
        lastGrade.checks.forEach(check=>{
          const node=feedback.get(check.id);node.className=`question-feedback ${check.passed?'correct':''}`;
          node.textContent=check.passed?'✓ 正确':`再试一次。参考答案：${check.expected}\n${check.explanation}`;
        });
        summary.className=`learn-result ${lastGrade.passed?'success':'error'}`;
        summary.textContent=`${lastGrade.correct} / ${lastGrade.total} 项正确，${lastGrade.score} 分。${lastGrade.passed?(lesson===lessons.at(-1)?'毕业综合测试已通过，恭喜完成本课程！':'本单元已通过，下一单元已解锁。'):'请根据逐题反馈修改后再提交。'}${ui.state.assisted[lesson.id]?' 本次使用了文字稿辅助。':''}`;
        await ui.record(lastGrade.passed,lastGrade.score);
      }catch(error){ui.report(error);}finally{ui.setBusy(false);}
    },'primary-btn');submit.dataset.lockWhileBusy='';
    const actions=element('div',null,'learn-actions');actions.append(submit,button('请 AI 导师解释',()=>ui.askTutor({code:JSON.stringify(responses),objective:lesson.questions.map(q=>q.prompt).join('\n'),compilerMessage:lastGrade?JSON.stringify(lastGrade):'尚未提交',output:''})));body.append(actions,summary);
    return ()=>{media.forEach(audio=>{audio.pause();audio.removeAttribute('src');audio.load();});vocabularyAudio?.pause();};
  });
}
