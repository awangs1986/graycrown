import './pets.css';
import { petCoursePresentation } from './pets.mjs';
import { createBattle } from './battle.mjs';
import { adventure } from './adventure.mjs';
import { PUBLIC_SITE } from '../../deployment.mjs';
import { chapters, lessons, furtherPractice } from './course.mjs';
import { shuffled } from './judge.mjs';
import { createCoursePlayer, element, button } from '../shared/player.mjs';
import './french.css';

export async function mount(root,context){
  return createCoursePlayer(root,context,{title:'法语 · 晨钟宠物联盟 A1',subtitle:`24 种宠物 · ${chapters.length} 座道馆 · ${lessons.length} 场法语挑战`,chapters,lessons,adventure,presentation:petCoursePresentation(lessons)},ui=>{
    const {body,lesson,chapter}=ui;
    const responses=ui.state.responses[lesson.id]&&typeof ui.state.responses[lesson.id]==='object'&&!Array.isArray(ui.state.responses[lesson.id])?ui.state.responses[lesson.id]:{};
    ui.state.responses[lesson.id]=responses;
    const battle=createBattle(ui,lessons,responses);
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
    const feedback=new Map();
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
      const message=element('div');message.setAttribute('aria-live','polite');feedback.set(question.id,message);field.append(message);body.append(field);battle.addQuestion(question,field,message);
    }
    battle.mountControls();
    if(!PUBLIC_SITE)body.append(button('召唤语言导师',()=>ui.askTutor({code:JSON.stringify(responses),objective:lesson.questions.map(q=>q.prompt).join('\n'),compilerMessage:battle.feedback,output:''})));
    const answers=element('div');
    body.append(button('◈ 真知水晶 · 参考答复',async()=>{
      if(!await ui.revealAnswer())return;
      answers.replaceChildren(...lesson.questions.map((q,index)=>element('p',`${index+1}. ${q.answers.join(' / ')} — ${q.explanation}`,'learn-explanation')));
    }),answers);
    return ()=>{battle.dispose();media.forEach(audio=>{audio.pause();audio.removeAttribute('src');audio.load();});vocabularyAudio?.pause();};
  });
}
