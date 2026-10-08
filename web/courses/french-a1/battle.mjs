import { element, button } from '../shared/player.mjs';
import { gradeFrench } from './judge.mjs';
import { companion, encounter, portrait, typeBadge, icon } from './pets.mjs';

const moves={词汇:['叶片词语','grass'],拼写:['精准刻写','spark'],句子:['句子连击','fire'],语法:['语法护符','mind'],听力:['回声波','sound'],阅读:['读心光线','light'],综合:['羁绊连击','water'],综合测试:['晨钟共鸣','light']};
export function createBattle(ui,lessons,responses) {
 const {lesson,body}=ui, enemy=encounter(lesson), ally=companion(ui.state,lessons);
 const saved=ui.state.battles[lesson.id], replay=ui.state.completed.includes(lesson.id);
 const valid=new Set(gradeFrench(lesson,responses).checks.filter(c=>c.passed).map(c=>c.id));
 const cleared=new Set(!replay&&Array.isArray(saved?.cleared)?saved.cleared.filter(id=>valid.has(id)):[]);
 let stamina=!replay&&Number.isInteger(saved?.stamina)?Math.max(0,Math.min(3,saved.stamina)):3;
 let awaitingNext=false,finished=false,active=lesson.questions.find(q=>!cleared.has(q.id));
 const fields=new Map(),feedback=new Map(),move=moves[lesson.topic]??moves.综合;
 const stage=element('section',null,'pet-battle');stage.setAttribute('aria-label','宠物回合对战');
 const banner=element('div',lesson.localIndex===11?'道馆挑战 · GYM BATTLE':'野外遭遇 · WILD ENCOUNTER','pet-eyebrow');
 const arena=element('div',null,'pet-arena');arena.style.setProperty('--habitat-x',`${lesson.chapterIndex%4*100/3}%`);arena.style.setProperty('--habitat-y',`${Math.floor(lesson.chapterIndex/4)*100}%`);
 function fighter(pet,side,max) {
  const card=element('div',null,`pet-fighter ${side}`),info=element('div',null,'pet-fighter-info'),name=element('strong',`${pet.name} · ${pet.fr}`),meter=element('progress'),health=element('small');
  meter.max=max;meter.setAttribute('aria-label',`${pet.name}体力`);info.append(name,typeBadge(pet.type),meter,health);card.append(info,portrait(pet,'pet-battle-art'));arena.append(card);return {card,meter,health};
 }
 const rival=fighter(enemy,'rival',lesson.questions.length*20),partner=fighter(ally,'partner',3);
 const log=element('p',`遭遇 ${enemy.name}！使用法语招式赢得它的信任。`,'pet-battle-log');log.setAttribute('role','status');
 const round=element('p',null,'pet-round');stage.append(banner,arena,round,log);body.append(stage);
 const controls=element('div',null,'pet-battle-controls');
 const attack=button('',strike,'primary-btn');attack.append(icon(move[1]),element('span',`发动 · ${move[0]}`));
 const next=button('下一回合 →',()=>{if(ui.busy)return;awaitingNext=false;active=lesson.questions.find(q=>!cleared.has(q.id));sync();active&&fields.get(active.id)?.scrollIntoView({block:'nearest',behavior:'smooth'});},'primary-btn');
 const rest=button('营地休整 · 恢复体力',async()=>{
  if(ui.busy)return;ui.setBusy(true);stamina=3;store();
  try{await ui.progress.persist();log.textContent='伙伴恢复精神！已击破的回合会保留，准备再次挑战。';}catch(error){ui.report(error);}finally{ui.setBusy(false);sync();}
 });
 const capture=button('◉ 投出伙伴球 · 收服',async()=>{
  if(ui.busy||cleared.size!==lesson.questions.length||finished)return;
  ui.setBusy(true);
  try{await ui.record(true,100);finished=true;stage.classList.add('captured');log.textContent=`收服成功！${enemy.name} 已加入宠物图鉴。`;}catch(error){ui.report(error);}finally{ui.setBusy(false);sync();}
 },'primary-btn');
 controls.append(attack,next,rest,capture);
 function store(){ui.state.battles[lesson.id]={cleared:[...cleared],stamina};}
 function sync(){
  const remaining=lesson.questions.length-cleared.size;
  rival.meter.value=remaining*20;rival.health.textContent=`HP ${remaining*20} / ${lesson.questions.length*20}`;
  partner.meter.value=stamina;partner.health.textContent=`体力 ${stamina} / 3`;
  round.textContent=`已击破 ${cleared.size} / ${lesson.questions.length} 回合 · ${remaining?'每答对一题造成 20 点伤害':'对手认可了你，可以收服！'}`;
  attack.hidden=!active||awaitingNext||stamina===0||remaining===0;attack.disabled=ui.busy;
  next.hidden=!awaitingNext||remaining===0;next.disabled=ui.busy;
  rest.hidden=stamina>0||remaining===0;rest.disabled=ui.busy;
  capture.hidden=remaining>0;capture.disabled=ui.busy||finished;
  if(finished)capture.textContent='✓ 已登记图鉴';
  for(const [id,field] of fields){field.hidden=id!==active?.id||remaining===0;field.disabled=ui.busy||awaitingNext||stamina===0;}
 }
 async function strike(){
  if(ui.busy||!active||awaitingNext||stamina===0||finished)return;
  const answer=responses[active.id];
  if(answer==null||(Array.isArray(answer)?!answer.length:!String(answer).trim())){log.textContent='先完成本回合的答复，再发动招式。';return;}
  ui.setBusy(true);sync();
  try {
   const result=gradeFrench({questions:[active]},responses),message=feedback.get(active.id);
   if(result.passed){
    cleared.add(active.id);awaitingNext=true;message.textContent='命中！答复正确，造成 20 点伤害。';message.className='question-feedback correct';
    log.textContent=`${ally.name} 使用「${move[0]}」！命中 ${enemy.name}，HP −20。${cleared.size===lesson.questions.length?'它愿意成为你的伙伴！':''}`;
    rival.card.getAnimations().forEach(a=>a.cancel());if(!matchMedia('(prefers-reduced-motion: reduce)').matches)rival.card.animate([{transform:'translateX(0)'},{transform:'translateX(10px)',filter:'brightness(1.3)'},{transform:'translateX(-6px)'},{transform:'translateX(0)'}],{duration:400});
    store();await ui.progress.persist();
   }else{
    stamina--;message.textContent='招式没有命中。对照知识手册检查词形、词序或重听录音，再试一次。';message.className='question-feedback';
    log.textContent=`${enemy.name} 发动反击！伙伴体力 −1。${stamina?'调整答案，再次出招。':'去营地休整，已完成回合不会丢失。'}`;
    store();await ui.record(false,Math.round(cleared.size/lesson.questions.length*100));
   }
  }catch(error){ui.report(error);}finally{ui.setBusy(false);sync();}
 }
 return {
  addQuestion(question,field,message){fields.set(question.id,field);feedback.set(question.id,message);},
  mountControls(){body.append(controls,element('p','答对 → 招式命中；答错 → 对手反击；体力耗尽可以免费休整。全部回合击破后，使用伙伴球收服。','pet-battle-help'));ui.root.addEventListener('course-busy-change',sync);sync();},
  dispose(){ui.root.removeEventListener('course-busy-change',sync);},
  get feedback(){return log.textContent;}
 };
}
