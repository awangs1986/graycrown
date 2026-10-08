import './player.css';
import { PUBLIC_SITE } from '../../deployment.mjs';
import { attachAdventure, adventurer, rewardFor, chapterComplete, regionUnlocked, crystalsLeft } from './adventure.mjs';
import { createProgress, unlocked } from './progress.mjs';
import { loadAiSettings, saveAiSettings, testAiConnection, requestAiTutor } from '../../ai-service.mjs';

export function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text != null) node.textContent = text;
  if (className) node.className = className;
  return node;
}
export function button(text, action, className = 'soft-btn') {
  const node = element('button', text, className);
  node.type = 'button'; node.addEventListener('click', action); return node;
}
export function downloadJson(filename, value) {
  downloadFile(filename, JSON.stringify(value, null, 2), 'application/json');
}
export function downloadFile(filename, value, type = 'text/plain') {
  const url = URL.createObjectURL(new Blob([value], { type }));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function createCoursePlayer(root, context, course, renderExercise) {
  attachAdventure(course.chapters, course.adventure);
  const adventure = course.adventure;
  let screen = 'start';
  root.innerHTML = `<section class="learning-course adventure-course">
    <header class="learn-header"><div><h1></h1><p class="learn-subtitle"></p><div class="learn-progress"></div></div><div class="learn-tools"></div></header>
    <div class="learn-layout"><nav class="learn-nav" aria-label="冒险区域"></nav><main class="learn-main"></main></div>
    <dialog class="learn-dialog"><h2>AI 导师设置</h2><form method="dialog"><button class="ghost-btn">关闭</button></form><div class="ai-form"></div></dialog>
  </section>`;
  const $ = selector => root.querySelector(selector);
  $('.learning-course').dataset.theme = adventure.theme;
  $('h1').textContent = course.title;
  $('.learn-subtitle').textContent = course.subtitle;
  let busy = false, cleanup = () => {}, disposed = false;
  const status = element('p', '', 'learn-status'); status.setAttribute('role', 'status');
  const report = error => { status.textContent = error.message; status.style.color = '#a13524'; };
  const progress = createProgress(context, course.lessons, report);
  const current = () => course.lessons.find(lesson => lesson.id === progress.state.currentLessonId) ?? course.lessons[0];
  const ui = {
    root, context, progress, current,
    get state() { return progress.state; },
    get busy() { return busy; },
    setBusy(value) {
      busy = value;
      root.querySelectorAll('[data-lock-while-busy]').forEach(node => { node.disabled = value; });
      updateFooter();
      root.dispatchEvent(new Event('course-busy-change'));
    },
    notify(text) { status.textContent = text; status.style.color = ''; }, report,
    save() { progress.schedule(); },
    refresh() { if(!busy) render(); },
    async record(passed, score) {
      const lesson = current();
      const first = !progress.state.completed.includes(lesson.id);
      const before = adventurer(progress.state, course.lessons);
      progress.state.consecutiveFailures[lesson.id] = passed ? 0 : (Number(progress.state.consecutiveFailures[lesson.id]) || 0) + 1;
      progress.state.started = true;
      progress.state.attempts[lesson.id] = (Number(progress.state.attempts[lesson.id]) || 0) + 1;
      progress.state.scores[lesson.id] = Math.max(Number(progress.state.scores[lesson.id]) || 0, score);
      if (passed && !progress.state.completed.includes(lesson.id)) progress.state.completed.push(lesson.id);
      await progress.persist();
      renderNav(); updateFooter();
      if(passed) showVictory(lesson, first, before);
    },
    async revealAnswer() {
      if(busy) return false;
      const lesson = current(), chapter = course.chapters[lesson.chapterIndex];
      if(progress.state.answerReveals.includes(lesson.id)) return true;
      if(!crystalsLeft(progress.state,chapter)) {ui.notify('本区域的三枚真知水晶已用完；仍可使用知识手册和提示。');return false;}
      if(!confirm('消耗本区域一枚真知水晶，查看本任务参考答案？重复查看不再消耗。')) return false;
      ui.setBusy(true);
      try {
        progress.state.answerReveals.push(lesson.id);progress.state.assisted[lesson.id]=true;
        await progress.persist();renderNav();return true;
      } catch(error) {report(error);return false;} finally {ui.setBusy(false);}
    },
    async askTutor(payload) {
      if (busy) return;
      const lesson = current();
      if ((progress.state.consecutiveFailures[lesson.id] || 0) < 3) return ui.notify('连续三次未通过后，可召唤本区域的 AI 导师。');
      if (progress.state.tutorUses[lesson.chapterId]) return ui.notify('本章的 AI 导师机会已经使用；你仍可阅读知识说明和逐题反馈。');
      if (!confirm('将本题内容、你的作答和结果发送到你配置的 AI 服务，获取提示？')) return;
      ui.setBusy(true);
      try {
        const result = await requestAiTutor({courseId: context.courseId, lessonId: lesson.id, title: lesson.title, objective: lesson.objective ?? lesson.topic, rules: lesson.teach ?? course.chapters[lesson.chapterIndex].grammar, code: '', ...payload});
        progress.state.tutorUses[lesson.chapterId] = true;
        await progress.persist();
        const panel = element('div', '', 'learn-explanation'); panel.append(element('strong','导师提示'),element('p',result.content));
        $('.learn-main').append(panel);
      } catch (error) { report(error); }
      finally { ui.setBusy(false); }
    }
  };
  const tools = $('.learn-tools');
  tools.append(button('冒险地图',()=>{if(!busy){if(screen==='quest')progress.state.mapChapter=current().chapterIndex;screen='map';ui.save();render();}}),button('行囊 / 旅途日志',showJournal));
  const exportButton = button('备份本课程', () => downloadJson(`${context.courseId}-progress.json`, {kind:'course-progress',version:1,courseId:context.courseId,progress:progress.state}));
  tools.append(exportButton);
  const label = element('label','导入备份','soft-btn file-label');
  const file = element('input');file.type='file';file.accept='application/json';file.hidden=true;label.append(file);tools.append(label);
  file.addEventListener('change', async () => {
    const backup = file.files?.[0]; file.value=''; if(!backup || busy) return;
    ui.setBusy(true);
    try {
      const value=JSON.parse(await backup.text());
      if(value.kind!=='course-progress'||value.version!==1||value.courseId!==context.courseId) throw new Error('这不是当前课程的备份。');
      if(!confirm('用备份替换当前课程进度？其他课程不受影响。')) return;
      await progress.replace(value.progress); screen='start';render();
    } catch(error) {report(error);} finally {ui.setBusy(false);}
  });
  const reset = button('重置本课程', async () => {
    if(busy || !confirm('清除当前课程进度并重新开始？其他课程不受影响。')) return;
    ui.setBusy(true);
    try {await progress.replace(null);screen='start';render();} catch(error) {report(error);} finally {ui.setBusy(false);}
  });
  reset.dataset.lockWhileBusy='';tools.append(reset);
  const settings = button('AI 设置', async () => {
    if(busy) return; ui.setBusy(true);
    const dialog=$('dialog'), form=$('.ai-form');form.replaceChildren(element('p','正在读取设置…'));dialog.showModal();
    try {
      const value=await loadAiSettings();form.replaceChildren();
      const inputs={};
      for(const [key,title,type] of [['apiUrl','API URL','url'],['model','模型','text'],['apiKey','API Key（留空保留）','password']]) {
        const field=element('label',title),input=element('input');input.type=type;input.value=key==='apiKey'?'':value[key]??'';field.append(input);form.append(field);inputs[key]=input;
      }
      const info=element('p','密钥只保存在本机，不进入课程备份。');form.append(info);
      const save=async()=>saveAiSettings(Object.fromEntries(Object.entries(inputs).map(([key,input])=>[key,input.value.trim()])));
      form.append(button('保存设置',async()=>{if(busy)return;ui.setBusy(true);try{await save();inputs.apiKey.value='';info.textContent='已保存。';}catch(e){info.textContent=e.message;}finally{ui.setBusy(false);}}));
      form.append(button('测试连接',async()=>{if(busy)return;ui.setBusy(true);try{await save();inputs.apiKey.value='';const r=await testAiConnection();info.textContent='连接成功：'+r.reply;}catch(e){info.textContent=e.message;}finally{ui.setBusy(false);}}));
    } catch(error) {form.replaceChildren(element('p',error.message));} finally {ui.setBusy(false);}
  });
  settings.dataset.lockWhileBusy='';if(!PUBLIC_SITE) tools.append(settings);
  function renderNav() {
    const state=progress.state, hero=adventurer(state,course.lessons);
    const chapter=course.chapters[screen==='quest'?current().chapterIndex:state.mapChapter];
    $('.learn-progress').textContent=`${adventure.role} · Lv.${hero.level} · ✦ ${hero.xp} XP · ◉ ${hero.gold} 金币 · ◈ ${crystalsLeft(state,chapter)}/3 真知水晶 · 遗物 ${course.chapters.filter(c=>chapterComplete(c,state)).length}/${course.chapters.length}`;
    $('.learn-nav').replaceChildren(...course.chapters.map((chapter,index)=>{
      const done=chapterComplete(chapter,state), available=regionUnlocked(course.chapters,state,index);
      const node=button(`${done?'✓':available?chapter.adventure.icon:'🔒'} ${index+1}. ${chapter.adventure.name} · ${chapter.lessons.filter(l=>state.completed.includes(l.id)).length}/${chapter.lessons.length}`,()=>{
        if(busy)return;state.mapChapter=index;ui.save();screen='map';render();
      },'');
      node.disabled=!available;node.classList.toggle('selected',index===(screen==='quest'?current().chapterIndex:state.mapChapter));return node;
    }));
  }
  let nextButton, completionLabel;
  function updateFooter() {
    if(!nextButton) return;
    completionLabel.textContent=progress.state.completed.includes(current().id)?'✓ 委托已完成 · 重温不重复领取奖励':'完成试炼，解锁下一段旅途';
    const index=course.lessons.indexOf(current());
    nextButton.disabled=busy||index===course.lessons.length-1||!unlocked(course.lessons,progress.state,index+1);
  }
  function showDialog(title, build) {
    const dialog=element('dialog',null,'learn-dialog adventure-dialog');
    dialog.append(element('h2',title));build(dialog);
    dialog.append(button('关闭',()=>dialog.close()));
    dialog.addEventListener('close',()=>dialog.remove());$('.learning-course').append(dialog);dialog.showModal();return dialog;
  }
  function showJournal() {
    if(busy)return;
    showDialog('行囊与旅途日志',dialog=>{
      const hero=adventurer(progress.state,course.lessons);
      dialog.append(element('p',`Lv.${hero.level} · ${hero.xp} XP · ${hero.gold} 金币 · 距下一级 ${hero.nextLevel} XP`));
      dialog.append(element('p','首次完成普通委托：20 XP / 10 金币；守关试炼：40 XP / 20 金币。金币记录你的冒险功绩。每个区域有三枚真知水晶，可换取参考答案。'));
      for(const chapter of course.chapters){
        const region=chapter.adventure,done=chapterComplete(chapter,progress.state);
        const entry=element('details');entry.append(element('summary',`${done?region.relicIcon:'◇'} ${region.relic} · ${done?'已获得':'尚未获得'}`),element('p',region.relicLore));
        for(const lesson of chapter.lessons.filter(l=>progress.state.completed.includes(l.id)))entry.append(element('p',`✓ ${lesson.adventure.title}：${lesson.adventure.aftermath}`));
        dialog.append(entry);
      }
    });
  }
  function showVictory(lesson, first, before) {
    const region=course.chapters[lesson.chapterIndex].adventure, reward=rewardFor(lesson,course.lessons), hero=adventurer(progress.state,course.lessons);
    const finished=progress.state.completed.length===course.lessons.length;
    showDialog(finished?'✦ 远征完成':reward.boss?'✦ 守关试炼完成':'✦ 委托完成',dialog=>{
      dialog.append(element('p',lesson.adventure.aftermath),element('p',first?`+${reward.xp} XP　+${reward.gold} 金币`:'重温完成，奖励已在首次通关时领取。','adventure-reward'));
      if(hero.level>before.level)dialog.append(element('p',`等级提升！Lv.${before.level} → Lv.${hero.level}`));
      if(reward.boss&&chapterComplete(course.chapters[lesson.chapterIndex],progress.state))dialog.append(element('p',`${region.relicIcon} 获得 ${region.relic}！${course.chapters[lesson.chapterIndex+1]?'新区域已解锁：'+course.chapters[lesson.chapterIndex+1].adventure.name:''}`));
      course.presentation?.victory?.(dialog,lesson,ui);
      if(finished)dialog.append(element('p',adventure.ending));
      dialog.append(button('返回冒险地图',()=>{if(busy)return;dialog.close();progress.state.mapChapter=Math.min(lesson.chapterIndex+(reward.boss?1:0),course.chapters.length-1);ui.save();screen='map';render();},'primary-btn'));
      const next=course.lessons.indexOf(lesson)+1;
      if(unlocked(course.lessons,progress.state,next))dialog.append(button('继续旅途 →',()=>{if(busy)return;dialog.close();go(next);}));
    });
  }
  function renderStart(main) {
    const card=element('section',null,'adventure-prologue');
    card.append(element('div',adventure.emblem,'adventure-emblem'),element('p',adventure.subtitle,'learn-topic'),element('h2',adventure.title),element('p',adventure.prologue));
    card.append(element('p','接下 NPC 委托 → 学习与试炼 → 获得经验、金币与遗物 → 解锁新区域','adventure-loop'));
    card.append(button(progress.state.started?'继续远征 →':'踏上旅途 →',()=>{progress.state.started=true;progress.state.mapChapter=current().chapterIndex;ui.save();screen='map';render();},'primary-btn'));
    course.presentation?.start?.(card,ui);
    main.append(card);
  }
  function renderMap(main) {
    const chapter=course.chapters[progress.state.mapChapter], region=chapter.adventure;
    main.append(element('p',`区域 ${progress.state.mapChapter+1} / ${course.chapters.length}`,'learn-topic'),element('h2',`${region.icon} ${region.name}`),element('p',region.description,'adventure-description'));
    course.presentation?.map?.(main,chapter,ui);
    const scene=element('section',null,'adventure-map');scene.setAttribute('aria-label',region.name+'任务地图');
    for(const lesson of chapter.lessons){
      const index=course.lessons.indexOf(lesson),done=progress.state.completed.includes(lesson.id),available=unlocked(course.lessons,progress.state,index);
      const node=button('',()=>go(index),'adventure-node');node.disabled=!available;node.dataset.lessonId=lesson.id;
      node.classList.toggle('completed',done);node.classList.toggle('boss',lesson.adventure.boss);node.classList.toggle('available',available&&!done);
      node.append(element('span',done?'✓':!available?'🔒':lesson.adventure.boss?'♜':String(lesson.localIndex+1),'adventure-orb'),element('strong',lesson.adventure.title),element('small',done?'已完成 · 可重温':!available?'完成前置委托后解锁':lesson.adventure.boss?'守关试炼 · 40 XP':'可接取 · 20 XP'));
      course.presentation?.node?.(node,lesson,ui);
      scene.append(node);
    }
    main.append(scene);
    const npc=element('aside',null,'adventure-npc');npc.append(element('strong',region.npc),element('blockquote',region.quote),element('p',`${region.relicIcon} 区域遗物：${region.relic} · ${chapterComplete(chapter,progress.state)?'已收入行囊':'完成本区域全部委托获得'}`));main.append(npc);
    if(progress.state.completed.length===course.lessons.length)main.append(element('p',adventure.ending,'learn-explanation'));
  }
  function render() {
    cleanup();cleanup=()=>{};nextButton=null;completionLabel=null;
    const main=$('.learn-main');main.replaceChildren();main.append(status);
    $('.learning-course').dataset.screen=screen;
    if(screen==='start') renderStart(main);
    else if(screen==='map') renderMap(main);
    else {
      const lesson=current(),chapter=course.chapters[lesson.chapterIndex],quest=lesson.adventure;
      main.append(button('← 返回区域地图',()=>{if(busy)return;progress.state.mapChapter=lesson.chapterIndex;screen='map';render();}));
      main.append(element('p',`${chapter.adventure.name} · 委托 ${lesson.localIndex+1}/${chapter.lessons.length} · ${lesson.topic}`,'learn-topic'),element('h2',quest.title));
      const layout=element('div',null,'adventure-trial'),story=element('aside',null,'adventure-story');
      story.append(element('div',chapter.adventure.icon,'adventure-emblem'),element('h3',quest.npc),element('blockquote',quest.quote),element('p',quest.story),element('h3','本次试炼'),element('p',lesson.objective??`运用${lesson.topic}完成下方旅途委托，所有答复正确后推进剧情。`));
      story.append(element('p',`奖励：${rewardFor(lesson,course.lessons).xp} XP · ${rewardFor(lesson,course.lessons).gold} 金币${quest.boss?' · 区域遗物':''}`,'adventure-reward'));
      const intro=element('details',null,'learn-explanation');intro.append(element('summary','旅途知识手册'),element('p',chapter.introduction??chapter.grammar));intro.open=lesson.localIndex===0;story.append(intro);
      const body=element('div',null,'adventure-workbench');layout.append(story,body);main.append(layout);
      cleanup=renderExercise(Object.assign(Object.create(ui),{body,lesson,chapter}))??(()=>{});
      const footer=element('footer',null,'learn-footer');completionLabel=element('span');nextButton=button('继续旅途 →',()=>go(course.lessons.indexOf(current())+1),'primary-btn');footer.append(completionLabel,nextButton);main.append(footer);
    }
    renderNav();updateFooter();
  }
  async function go(index) {
    if(busy||!course.lessons[index]||!unlocked(course.lessons,progress.state,index)) return;
    ui.setBusy(true);
    try {progress.state.currentLessonId=course.lessons[index].id;progress.state.started=true;await progress.persist();screen='quest';render();$('.learn-main').scrollIntoView({block:'start'});}catch(error){report(error);}finally{ui.setBusy(false);}
  }
  course.presentation?.setup?.(ui,tools,showDialog);
  render();
  return {
    async flush() {if(busy)throw new Error('请等待当前操作完成后再切换课程。');await progress.flush();},
    dispose() {if(disposed)return;disposed=true;cleanup();progress.dispose();root.replaceChildren();}
  };
}
