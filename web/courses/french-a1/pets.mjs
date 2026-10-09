import { element, button } from '../shared/player.mjs';

const rows = [
 ['叶耳狐','Feuille','grass','叶片耳朵会随着法语问候轻轻摆动。'],
 ['焰团兔','Flamme','fire','每学会一个新词，尾巴上的火苗就会更明亮。'],
 ['泡泡獭','Bulle','water','喜欢把听见的短句藏进透明泡泡里。'],
 ['铃音雀','Clochette','sound','港口的小歌手，用问候声唤醒清晨。'],
 ['贝壳海豹','Coquille','water','收集海边的口信，躲在贝壳后等你介绍自己。'],
 ['灯塔龙','Phare','light','问候港的守护者，能听懂的人才能获得它的信任。'],
 ['墨迹猫','Encre','mind','在名册上留下爪印，对名字和年龄格外好奇。'],
 ['邮羽鸮','Lettre','grass','翅膀像折好的信封，从不会忘记新朋友的名字。'],
 ['晶冠狮','Cristal','mind','守护身份驿站，水晶会映出准确的自我介绍。'],
 ['缎带鼠','Ruban','light','用缎带把家书系好，最喜欢听亲人的称呼。'],
 ['桃绒羊','Laine','grass','柔软的绒毛像云，总是守在家书村的门口。'],
 ['花角鹿','Rose','grass','花角上挂着村民的思念，是家庭道馆的守护者。'],
 ['滴答鼠','Tic-tac','spark','尾巴像钟表指针，按时练习会让它特别开心。'],
 ['齿轮刺猬','Rouage','spark','背上的齿轮记录每天的作息。'],
 ['铜钟鸮','Horloge','spark','钟楼守护者，以准确的日程为荣。'],
 ['奶油松鼠','Crème','earth','珍藏菜单上的新词，尾巴散发焦糖香气。'],
 ['莓果企鹅','Baie','water','在咖啡市集送餐，喜欢有礼貌的点单。'],
 ['甜塔熊','Gâteau','earth','用甜点招待挑战者的市集守护者。'],
 ['罗盘壁虎','Boussole','earth','尾巴永远指着下一块路牌。'],
 ['地图龟','Carte','water','龟甲上有城市地图，擅长帮人找车站。'],
 ['碧角巡鹿','Sentier','grass','路标城的守护者，会考验训练师的方向感。'],
 ['云团犬','Nuage','light','天气改变时，耳朵也会变成不同的云。'],
 ['月纹蛾','Lune','mind','喜欢夜晚的音乐，翅膀会回应你的喜好。'],
 ['银翼狮鹫','Voyage','light','守护远方的旅程，等待学会交流的伙伴同行。']
];
export const pets = rows.map(([name,fr,type,lore],index)=>({id:`pet-${index}`,index,name,fr,type,lore}));
export const types = {
 grass:['草','Feuille','#408b60'],fire:['火','Flamme','#d86546'],water:['水','Eau','#3786bd'],
 sound:['音','Son','#9863b2'],light:['光','Lumière','#b88b2d'],mind:['念','Esprit','#8865ab'],spark:['电','Éclair','#bb912b'],earth:['地','Terre','#ae7950']
};
const paths={grass:'M18 3C7 3 3 8 5 15c6 4 13 0 13-12ZM5 20 15 7',fire:'M13 2c2 6-3 6 1 9 2-1 3-3 3-3 7 10-7 18-11 10-3-5 2-7 3-12 0 4 2 5 2 5s3-4 2-9Z',water:'M12 2C10 6 4 11 4 15a8 8 0 0 0 16 0c0-4-6-9-8-13Z',sound:'M9 17V5l10-2v12M9 6l10-2M9 17c0 4-7 4-7 0s7-4 7 0Zm10-2c0 4-7 4-7 0s7-4 7 0Z',light:'m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z',mind:'M4 14c-4-10 16-16 17-4 1 7-13 11-14 4-1-4 8-7 9-3',spark:'m14 2-9 12h6l-1 8 9-13h-6Z',earth:'m2 20 7-15 5 8 3-4 5 11Z'};
export function icon(type) {
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.classList.add('pet-icon');
 const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',paths[type]??paths.light);path.setAttribute('fill','none');path.setAttribute('stroke','currentColor');path.setAttribute('stroke-width','1.8');path.setAttribute('stroke-linecap','round');path.setAttribute('stroke-linejoin','round');svg.append(path);return svg;
}
export function typeBadge(type) {const value=types[type],node=element('span',null,'pet-type');node.style.setProperty('--type-color',value[2]);node.append(icon(type),element('span',`${value[0]} · ${value[1]}`));return node;}
export function portrait(pet,className='') {
 const node=element('div',null,`pet-portrait ${className}`);node.setAttribute('role','img');node.setAttribute('aria-label',pet.name);
 node.style.backgroundPosition=`${pet.index%6*20}% ${Math.floor(pet.index/6)*100/3}%`;return node;
}
const habitats={
 'fr-basics':[0,1,2],fr01:[3,4,5],fr02:[6,7,8],fr03:[9,10,11],
 fr04:[12,13,14],'fr-time':[12,13,14],fr05:[15,16,17],fr06:[18,19,20],
 fr07:[21,22,23],'fr-invite':[0,1,2],'fr-health':[6,7,8],fr08:[0,1,23]
};
export function encounter(lesson) {const set=habitats[lesson.chapterId]??habitats.fr01;return pets[set[lesson.localIndex>=12?2:lesson.localIndex%2]];}
function captured(state,lessons) {return new Set(lessons.filter(l=>state.completed.includes(l.id)).map(l=>encounter(l).id));}
export function companion(state,lessons) {
 const owned=captured(state,lessons);
 return pets.find(p=>p.id===state.companionId&&(p.index<3||owned.has(p.id)))??pets[0];
}
export function collection(state,lessons) {return new Set([...captured(state,lessons),companion(state,lessons).id]);}
export function petCoursePresentation(lessons) {
 function choose(ui,pet,redraw) {if(ui.busy)return;ui.state.companionId=pet.id;ui.save();redraw();ui.refresh();}
 return {
  setup(ui,tools,showDialog) {
   tools.prepend(button('宠物图鉴 / 更换伙伴',()=>{if(ui.busy)return;showDialog('晨钟宠物图鉴 · 24 种',dialog=>{
    const intro=element('p'),grid=element('div',null,'pet-dex');dialog.append(intro,grid);
    const redraw=()=>{
     const owned=collection(ui.state,lessons),active=companion(ui.state,lessons);
     intro.textContent=`已结识 ${owned.size} / ${pets.length} 种 · 当前伙伴：${active.name}。前三只为可选初始伙伴；完成挑战可结识更多宠物。`;
     grid.replaceChildren(...pets.map(pet=>{
      const known=owned.has(pet.id)||pet.index<3,card=element('section',null,`pet-card ${known?'':'undiscovered'}`);
      card.append(portrait(pet),element('small',`N° ${String(pet.index+1).padStart(3,'0')}`),element('h3',known?pet.name:'尚未结识'),element('p',known?pet.fr:'???'),typeBadge(pet.type));
      if(known){card.append(element('p',pet.lore));const select=button(active.id===pet.id?'正在同行':'设为伙伴',()=>choose(ui,pet,redraw));select.disabled=active.id===pet.id;card.append(select);}
      else card.append(element('p','完成对应区域的宠物挑战后解锁。'));
      return card;
     }));
    };redraw();
   });}));
  },
  start(card,ui) {
   const starters=element('div',null,'pet-starters');
   const redraw=()=>{starters.replaceChildren(...pets.slice(0,3).map(pet=>{
    const control=button('',()=>choose(ui,pet,redraw),'pet-starter');control.setAttribute('aria-pressed',String(companion(ui.state,lessons).id===pet.id));
    control.append(portrait(pet),element('strong',pet.name),typeBadge(pet.type));return control;
   }));};redraw();card.append(element('h3','选择你的初始伙伴'),starters);
  },
  map(main,chapter,ui) {
   const strip=element('div',null,'pet-habitat');strip.append(element('div','本区出没 · HABITAT','pet-eyebrow'));
   for(const index of habitats[chapter.id]??habitats.fr01){const pet=pets[index],item=element('div',null,'pet-habitat-item');item.append(portrait(pet),element('strong',pet.name),typeBadge(pet.type));strip.append(item);}
   const active=companion(ui.state,lessons);strip.append(element('p',`同行伙伴：${active.name} · 答对发动招式，完成挑战后结识宠物。`));main.append(strip);
  },
  node(node,lesson) {const pet=encounter(lesson);node.prepend(portrait(pet,'pet-node-art'));node.append(element('span',`${lesson.localIndex>=12?'道馆守护':'野外遭遇'} · ${pet.name}`,'pet-node-name'));},
  victory(dialog,lesson) {
   const pet=encounter(lesson),card=element('div',null,'pet-capture');card.append(element('div','收服成功 · 新的羁绊','pet-eyebrow'),portrait(pet),element('h3',`${pet.name} · ${pet.fr}`),typeBadge(pet.type),element('p',`已登记图鉴，可在“宠物图鉴 / 更换伙伴”中让它同行。`));dialog.prepend(card);
  }
 };
}
