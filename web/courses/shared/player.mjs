import './player.css';
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
  root.innerHTML = `<section class="learning-course">
    <header class="learn-header"><div class="learn-heading"><h1></h1><p class="learn-subtitle"></p>
      <div class="learn-progress-row"><div class="learn-meter" role="progressbar" aria-label="课程进度" aria-valuemin="0" aria-valuemax="100"><span></span></div><span class="learn-progress"></span></div></div>
      <div class="learn-tools"></div></header>
    <div class="learn-layout"><nav class="learn-nav" aria-label="课程章节"></nav><main class="learn-main"></main></div>
    <dialog class="learn-dialog"><h2>AI 导师设置</h2><form method="dialog"><button class="ghost-btn">关闭</button></form><div class="ai-form"></div></dialog>
  </section>`;
  const $ = selector => root.querySelector(selector);
  if (course.theme) $('.learning-course').dataset.theme = course.theme;
  $('h1').textContent = course.title;
  $('.learn-subtitle').textContent = course.subtitle;
  let busy = false, cleanup = () => {}, disposed = false;
  const status = element('p', '', 'learn-status'); status.setAttribute('role', 'status');
  const report = error => { status.textContent = error.message; status.classList.add('error'); };
  const progress = createProgress(context, course.lessons, report);
  const current = () => course.lessons.find(lesson => lesson.id === progress.state.currentLessonId) ?? course.lessons[0];
  const ui = {
    root, context, progress, current,
    get state() { return progress.state; },
    get busy() { return busy; },
    setBusy(value) {
      busy = value;
      root.querySelectorAll('[data-lock-while-busy]').forEach(node => { node.disabled = value; });
    },
    notify(text) { status.textContent = text; status.classList.remove('error'); }, report,
    save() { progress.schedule(); },
    async record(passed, score) {
      const lesson = current();
      progress.state.started = true;
      progress.state.attempts[lesson.id] = (Number(progress.state.attempts[lesson.id]) || 0) + 1;
      progress.state.scores[lesson.id] = Math.max(Number(progress.state.scores[lesson.id]) || 0, score);
      if (passed && !progress.state.completed.includes(lesson.id)) progress.state.completed.push(lesson.id);
      await progress.persist();
      renderNav(); updateFooter();
    },
    async askTutor(payload) {
      if (busy) return;
      const lesson = current();
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
  const exportButton = button('备份本课程', () => downloadJson(`${context.courseId}-progress.json`, {kind:'course-progress',version:1,courseId:context.courseId,progress:progress.state}));
  tools.append(exportButton);
  const label = element('label','导入备份','soft-btn');
  const file = element('input');file.type='file';file.accept='application/json';file.hidden=true;label.append(file);tools.append(label);
  file.addEventListener('change', async () => {
    const backup = file.files?.[0]; file.value=''; if(!backup || busy) return;
    ui.setBusy(true);
    try {
      const value=JSON.parse(await backup.text());
      if(value.kind!=='course-progress'||value.version!==1||value.courseId!==context.courseId) throw new Error('这不是当前课程的备份。');
      if(!confirm('用备份替换当前课程进度？其他课程不受影响。')) return;
      await progress.replace(value.progress); render();
    } catch(error) {report(error);} finally {ui.setBusy(false);}
  });
  const reset = button('重置本课程', async () => {
    if(busy || !confirm('清除当前课程进度并重新开始？其他课程不受影响。')) return;
    ui.setBusy(true);
    try {await progress.replace(null);render();} catch(error) {report(error);} finally {ui.setBusy(false);}
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
  settings.dataset.lockWhileBusy='';tools.append(settings);
  function renderNav() {
    const state=progress.state;
    const done=state.completed.length,total=course.lessons.length,percent=Math.round(done/total*100);
    $('.learn-progress').textContent=`已完成 ${done} / ${total}${done===total?' · 课程已完成！':''}`;
    $('.learn-meter').setAttribute('aria-valuenow',String(percent));$('.learn-meter > span').style.width=`${percent}%`;
    $('.learn-nav').replaceChildren(...course.chapters.map((chapter,chapterIndex)=>{
      const details=element('details');details.open=chapter.id===current().chapterId;
      const finished=chapter.lessons.filter(l=>state.completed.includes(l.id)).length;
      const summary=element('summary'),name=element('span',`${chapterIndex+1}. ${chapter.title}`,'nav-chapter-title');
      if(chapter.subtitle??chapter.goal)name.append(element('small',chapter.subtitle??chapter.goal));
      summary.append(name,element('span',`${finished}/${chapter.lessons.length}`,`nav-count${finished===chapter.lessons.length?' complete':''}`));details.append(summary);
      chapter.lessons.forEach(lesson=>{
        const index=course.lessons.indexOf(lesson),complete=state.completed.includes(lesson.id),open=unlocked(course.lessons,state,index);
        const node=button('',()=>go(index),complete?'done':'');
        node.append(element('span',complete?'✓':String(lesson.localIndex+1),'nav-dot'),element('span',lesson.title));
        node.setAttribute('aria-label',`${lesson.localIndex+1}. ${lesson.title}${complete?'（已完成）':open?'':'（未解锁）'}`);
        node.classList.toggle('selected',lesson.id===current().id);node.disabled=!open;node.dataset.lessonId=lesson.id;
        if(lesson.id===current().id)node.setAttribute('aria-current','step');
        details.append(node);
      });return details;
    }));
  }
  let nextButton, completionLabel;
  function updateFooter() {
    if(!nextButton) return;
    completionLabel.textContent=progress.state.completed.includes(current().id)?'✓ 本题已完成，可重复练习':'通过本题后解锁下一题';
    const index=course.lessons.indexOf(current());
    nextButton.disabled=index===course.lessons.length-1||!unlocked(course.lessons,progress.state,index+1);
  }
  function render() {
    cleanup();
    const main=$('.learn-main');main.replaceChildren();
    const lesson=current(),chapter=course.chapters[lesson.chapterIndex];
    const topic=element('p',null,'learn-topic');
    topic.append(element('span',`第 ${lesson.chapterIndex+1} 章 · ${chapter.title}`,'learn-chip muted'),element('span',lesson.topic,'learn-chip'),element('span',`约 ${lesson.minutes} 分钟`,'learn-chip muted'));
    main.append(topic,element('h2',lesson.title),status);
    const intro=element('details',null,'learn-explanation');intro.append(element('summary','本章知识说明'),element('p',chapter.introduction ?? chapter.grammar));intro.open=lesson.localIndex===0;main.append(intro);
    const body=element('div');main.append(body);
    cleanup=renderExercise(Object.assign(Object.create(ui), {body,lesson,chapter})) ?? (()=>{});
    const footer=element('footer',null,'learn-footer');
    completionLabel=element('span');footer.append(completionLabel);
    nextButton=button('下一题 →',()=>go(course.lessons.indexOf(current())+1),'primary-btn');footer.append(nextButton);main.append(footer);
    renderNav();updateFooter();
  }
  async function go(index) {
    if(busy||!course.lessons[index]||!unlocked(course.lessons,progress.state,index)) return;
    ui.setBusy(true);
    try {progress.state.currentLessonId=course.lessons[index].id;progress.state.started=true;await progress.persist();render();$('.learn-main').scrollIntoView({block:'start'});}catch(error){report(error);}finally{ui.setBusy(false);}
  }
  render();
  return {
    async flush() {if(busy)throw new Error('请等待当前操作完成后再切换课程。');await progress.flush();},
    dispose() {if(disposed)return;disposed=true;cleanup();progress.dispose();root.replaceChildren();}
  };
}
