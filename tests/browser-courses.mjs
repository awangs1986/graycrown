// Run after build:web and cargo build. Uses a disposable data directory, never user saves.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, mkdir, symlink, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { lessons as csLessons } from '../web/courses/csharp/course.mjs';
import { lessons as frLessons } from '../web/courses/french-a1/course.mjs';
import { gradeCode } from '../web/courses/csharp/judge.mjs';

const root=process.cwd();
const evidence=await mkdtemp(path.join(tmpdir(),'verify-graycrown-courses-'));
await mkdir(path.join(evidence,'save'));
await symlink(path.join(root,'data/app'),path.join(evidence,'app'),process.platform==='win32'?'junction':'dir');
const seed={version:3,language:'zh-CN',activeCourseId:'c',courses:{c:{version:2,started:true,gold:17,drafts:{'D1-Q01':'legacy C draft'}}}};
await writeFile(path.join(evidence,'save/progress.json'),JSON.stringify(seed));
const launcher=process.env.GRAY_CROWN_LAUNCHER||path.join(root,'target/debug/gray-crown-launcher'+(process.platform==='win32'?'.exe':''));
const server=spawn(launcher,['--data-dir',evidence,'--no-open']);let serverLog='';
server.stdout.on('data',data=>serverLog+=data);server.stderr.on('data',data=>serverLog+=data);
const reports=[];let browser;
function pass(message){reports.push('PASS '+message);console.log('PASS '+message);}
async function waitFor(predicate,timeout=10000){const start=Date.now();while(!await predicate()){if(Date.now()-start>timeout)throw new Error('Condition timed out');await new Promise(r=>setTimeout(r,50));}}
try{
  await waitFor(()=>/http:\/\/127\.0\.0\.1:\d+\//.test(serverLog));
  const url=serverLog.match(/http:\/\/127\.0\.0\.1:\d+\//)[0];
  browser=await chromium.launch({headless:true,executablePath:process.env.GRAY_CROWN_BROWSER_PATH||undefined,args:process.platform==='linux'?['--no-sandbox']:[]});
  const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const consoleMessages=[];page.on('console',message=>consoleMessages.push(message.text()));
  const cdp=await page.context().newCDPSession(page);await cdp.send('Log.enable');cdp.on('Log.entryAdded',({entry})=>consoleMessages.push(entry.text));
  const receivedResponses=[];page.on('response',response=>receivedResponses.push(response.url()));
  const requests=[];page.on('request',r=>requests.push(r.url()));
  await page.goto(url);await page.locator('.course-card').first().waitFor();
  assert.equal(await page.locator('.course-card button:disabled').count(),0);
  assert.ok(!requests.some(value=>value.includes('/csharp/')));
  await page.screenshot({path:path.join(evidence,'01-courses.png'),fullPage:true});pass('Three available courses; no eager compiler load.');

  // Reuse the worker for reference regression only. Production uses a fresh worker per submission.
  await page.evaluate(()=>{
    window.referenceWorker=new Worker('/csharp/runner.worker.js',{type:'module'});
    window.runReference=(source,inputs)=>new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>{window.referenceWorker.terminate();reject(new Error('reference timeout'));},90000);
      window.referenceWorker.onmessage=({data})=>{if(data.type==='phase')return;clearTimeout(timer);if(data.type==='error')reject(new Error(data.message));else resolve(data);};
      window.referenceWorker.onerror=e=>{clearTimeout(timer);reject(new Error(e.message));};
      window.referenceWorker.postMessage({source,inputs});
    });
  });
  for(const lesson of (process.env.GRAY_CROWN_BROWSER_UI_ONLY ? [] : csLessons)){
    const result=await page.evaluate(({source,inputs})=>window.runReference(source,inputs),{source:lesson.solution,inputs:lesson.tests.map(test=>test.input)});
    const grade=gradeCode(lesson,lesson.solution,result);
    assert.equal(grade.passed,true,lesson.id+' '+JSON.stringify(grade.checks.filter(check=>!check.passed)));
    if(lesson===csLessons.filter(l=>l.chapterId===lesson.chapterId).at(-1))pass(`Browser C# chapter ${lesson.chapterIndex+1}: all reference programs pass.`);
  }
  const syntax=await page.evaluate(()=>window.runReference('this is not C#',['']));assert.equal(syntax.compiled.ok,false);
  const outputLimit=await page.evaluate(()=>window.runReference('using System; Console.WriteLine(new string(\'x\', 70000));',['']));assert.equal(outputLimit.executions[0].ok,false);
  assert.match(outputLimit.executions[0].stderr,/64KB/);
  await page.evaluate(()=>window.referenceWorker.terminate());pass(process.env.GRAY_CROWN_BROWSER_UI_ONLY ? 'C# syntax errors and output limit.' : `Real C# browser compiler: ${csLessons.length} programs / ${csLessons.reduce((n,l)=>n+l.tests.length,0)} cases, syntax errors and output limit.`);

  // Canonical and equivalent URLs must share the restrictive policy.
  for(const workerPath of ['csharp/runner.worker.js','csharp/%72unner.worker.js','/csharp/runner.worker.js']){
    const response=await fetch(url+workerPath);const policy=response.headers.get('content-security-policy');
    assert.ok(policy?.includes(`connect-src ${url}csharp/`),workerPath+' '+policy);
    assert.ok(policy.includes("worker-src 'none'"));
  }
  pass('C# worker CSP also protects encoded and repeated-slash URLs.');

  // Exercise actual C# reflection into HttpClient, not merely a synthetic JS CSP check.
  const beforeResponses=receivedResponses.length;
  const network=await page.evaluate(async ({url})=>{
    const source=`using System; using System.Reflection;\nvar type = Assembly.Load("System.Net.Http").GetType("System.Net.Http.HttpClient")!;\nobject client = Activator.CreateInstance(type)!;\nvar task = (System.Threading.Tasks.Task)type.GetMethod("GetStringAsync", new[] {typeof(string)})!.Invoke(client, new object[] {"${url}api/save"})!;\nConsole.WriteLine(task.IsFaulted);
var external = (System.Threading.Tasks.Task)type.GetMethod("GetStringAsync", new[] {typeof(string)})!.Invoke(client, new object[] {"https://example.com/graycrown-worker-probe"})!;
var http = Assembly.Load("System.Net.Http");
object content = Activator.CreateInstance(http.GetType("System.Net.Http.StringContent")!, new object[] {"{}"})!;
var post = type.GetMethod("PostAsync", new[] {typeof(string), http.GetType("System.Net.Http.HttpContent")!})!.Invoke(client, new object[] {"${url}api/ai/tutor", content});`;
    return await new Promise((resolve,reject)=>{
      const worker=new Worker('/csharp/runner.worker.js',{type:'module'});const timer=setTimeout(()=>{worker.terminate();reject(new Error('network probe timeout'));},90000);
      worker.onmessage=({data})=>{if(data.type==='phase')return;clearTimeout(timer);setTimeout(()=>{worker.terminate();resolve(data)},250);};worker.onerror=e=>{clearTimeout(timer);reject(new Error(e.message));};
      worker.postMessage({source,inputs:['']});
    });
  },{url});
  await writeFile(path.join(evidence,'network-probe.json'),JSON.stringify(network,null,2));
  assert.ok(network.compiled?.ok,'network reflection probe should compile');
  // A blocked fetch can appear in Playwright request events; the server log and CSP error establish denial.
  assert.ok(network.executions[0].ok);
  const violations=consoleMessages.filter(message=>/Content Security Policy|violates|Refused to connect/.test(message));
  await writeFile(path.join(evidence,'csp-violations.txt'),violations.join('\n'));
  for(const target of ['api/save','api/ai/tutor','example.com/graycrown-worker-probe']) {
    assert.ok(violations.some(message=>message.includes(target)),target+' should be denied by CSP: '+JSON.stringify(consoleMessages));
    assert.ok(!receivedResponses.slice(beforeResponses).some(value=>value.includes(target)));
  }
  pass('Submitted C# reflection/HttpClient request to save API is blocked by worker CSP.');

  // Student workflow: edit, submit, unlock and return with saved drafts.
  await page.locator('.course-card button').nth(1).click();await page.locator('.learn-editor .cm-content').waitFor();
  await page.locator('.learn-editor .cm-content').fill(csLessons[0].solution);
  await page.getByRole('button',{name:'提交全部测试',exact:true}).click();
  await page.locator('.learn-result.success').filter({hasText:'本题通过'}).waitFor({timeout:90000});
  await page.screenshot({path:path.join(evidence,'02-csharp.png'),fullPage:true});
  await page.getByRole('button',{name:'下一题 →',exact:true}).click();
  await page.locator('.learn-main h2').filter({hasText:csLessons[1].title}).waitFor();
  await page.locator('.learn-editor .cm-content').fill('// retained C# draft');
  await page.locator('#backToCourses').click();await page.locator('#library').waitFor({state:'visible'});pass('C# UI compiles, grades, unlocks next lesson and saves draft on exit.');

  await page.locator('.course-card button').nth(2).click();await page.locator('.french-question').first().waitFor();
  const frFirst=frLessons[0];
  for(const question of frFirst.questions)await page.locator(`[data-question-id="${question.id}"]`).getByRole('radio',{name:question.answers[0],exact:true}).check();
  await page.getByRole('button',{name:'提交答案',exact:true}).click();
  await page.locator('.learn-result.success').waitFor();
  await page.screenshot({path:path.join(evidence,'03-french.png'),fullPage:true});
  await page.locator('#backToCourses').click();await page.locator('#library').waitFor({state:'visible'});
  let save=JSON.parse(await readFile(path.join(evidence,'save/progress.json'),'utf8'));
  assert.equal(save.courses.c.gold,17);assert.equal(save.courses.c.drafts['D1-Q01'],'legacy C draft');
  assert.equal(save.courses.csharp.drafts[csLessons[1].id],'// retained C# draft');assert.ok(save.courses['french-a1'].completed.includes(frFirst.id));
  pass('French first unit passes; C, C# and French saves remain independent.');

  // Fixture unlocks prerequisites only, so audio, spelling and graduation can be exercised directly.
  const dictation=frLessons.findIndex(l=>l.key==='dictation');
  save.courses['french-a1'].completed=frLessons.slice(0,dictation).map(l=>l.id);save.courses['french-a1'].currentLessonId=frLessons[dictation].id;
  save.courses.csharp.completed=csLessons.slice(0,-1).map(l=>l.id);save.courses.csharp.currentLessonId=csLessons.at(-1).id;
  await fetch(url+'api/save',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(save)});
  await page.reload();await page.locator('.course-card button').nth(2).click();await page.locator('audio').waitFor();
  const played=await page.locator('audio').evaluate(async audio=>{await audio.play();await new Promise(resolve=>setTimeout(resolve,300));return {duration:audio.duration,time:audio.currentTime,ready:audio.readyState};});
  assert.ok(played.duration>0&&played.time>0&&played.ready>=2);await page.locator('audio').evaluate(audio=>audio.pause());
  await page.locator('.french-answer').fill('wrong');await page.getByRole('button',{name:'提交答案',exact:true}).click();await page.locator('.learn-result.error').waitFor();
  await page.locator('.french-answer').fill(frLessons[dictation].questions[0].answers[0]);await page.getByRole('button',{name:'提交答案',exact:true}).click();await page.locator('.learn-result.success').waitFor();
  await page.screenshot({path:path.join(evidence,'04-listening.png'),fullPage:true});
  await page.locator('#backToCourses').click();await page.locator('#library').waitFor({state:'visible'});pass('Offline French audio plays; wrong dictation rejected and corrected answer passes.');
  await page.locator('.course-card button').nth(1).click();await page.locator('.learn-editor .cm-content').fill(csLessons.at(-1).solution);
  await page.getByRole('button',{name:'提交全部测试',exact:true}).click();await page.locator('.learn-result.success').filter({hasText:'本题通过'}).waitFor({timeout:90000});
  await page.screenshot({path:path.join(evidence,'05-rpg.png'),fullPage:true});
  await page.locator('#backToCourses').click();await page.locator('#library').waitFor({state:'visible'});pass('Graduation RPG passes all seven paths through the actual course UI.');
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(evidence,'06-mobile.png'),fullPage:true});
  assert.deepEqual(errors,[]);pass('No uncaught browser errors.');
}catch(error){reports.push('FAIL '+error.stack);console.error(error);process.exitCode=1;}
finally{
  await browser?.close();server.kill();await once(server,'exit');
  await writeFile(path.join(evidence,'results.txt'),reports.join('\n'));await writeFile(path.join(evidence,'server.log'),serverLog);
  console.log('Evidence: '+evidence);
}
