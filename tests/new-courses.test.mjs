import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { chapters as csChapters, lessons as csLessons } from '../web/courses/csharp/course.mjs';
import { gradeCode } from '../web/courses/csharp/judge.mjs';
import { chapters as frChapters, lessons as frLessons, audio } from '../web/courses/french-a1/course.mjs';
import { gradeFrench, normalizeFrench, shuffled } from '../web/courses/french-a1/judge.mjs';
import { normalizeProgress, unlocked } from '../web/courses/shared/progress.mjs';

test('C# offers eight progressive chapters and 96 complete exercises',()=>{
  assert.equal(csChapters.length,8);assert.equal(csLessons.length,96);
  assert.equal(new Set(csLessons.map(l=>l.id)).size,96);
  for(const lesson of csLessons){
    assert.ok(lesson.teach&&lesson.objective&&lesson.starter&&lesson.solution);
    assert.equal(lesson.hints.length,3);assert.ok(lesson.tests.length);
    for(const sample of lesson.tests){assert.equal(typeof sample.input,'string');assert.equal(typeof sample.output,'string');}
    const result={compiled:{ok:true},executions:lesson.tests.map(t=>({ok:true,output:t.output}))};
    assert.equal(gradeCode(lesson,lesson.solution,result).passed,true,lesson.id);
    assert.equal(gradeCode(lesson,lesson.solution,{compiled:{ok:false,stderr:'syntax error'}}).passed,false);
    result.executions[0].output+='wrong';assert.equal(gradeCode(lesson,lesson.solution,result).passed,false,lesson.id);
  }
});
test('C# graduation requires all routes, not only the victory transcript',()=>{
  const final=csLessons.at(-1);assert.equal(final.tests.length,7);
  assert.ok(final.tests.some(t=>t.output.includes('Victory')));
  assert.ok(final.tests.some(t=>t.output.includes('Defeat')));
  assert.ok(final.tests.some(t=>t.output.includes('Bye')));
  assert.ok(final.tests.some(t=>t.input===''));
  const result={compiled:{ok:true},executions:final.tests.map(t=>({ok:true,output:final.tests[0].output}))};
  assert.equal(gradeCode(final,final.solution,result).passed,false);
});
test('French includes 156 exercises, vocabulary practice and cumulative A1 assessment',()=>{
  assert.equal(frChapters.length,12);assert.equal(frLessons.length,156);
  assert.equal(frChapters.reduce((n,c)=>n+c.vocabulary.length,0),192);
  assert.ok(frLessons.at(-1).questions.length>=13);
  for(const lesson of frLessons){
    assert.equal(new Set(lesson.questions.map(q=>q.id)).size,lesson.questions.length);
    const correct=Object.fromEntries(lesson.questions.map(q=>[q.id,q.answers[0]]));
    assert.equal(gradeFrench(lesson,correct).passed,true,lesson.id);
    assert.equal(gradeFrench(lesson,{}).passed,false,lesson.id);
    const wrong={...correct,[lesson.questions[0].id]:'incorrect answer'};
    assert.equal(gradeFrench(lesson,wrong).passed,false,lesson.id);
    for(const q of lesson.questions){
      assert.ok(q.explanation);
      if(q.options){assert.equal(new Set(q.options).size,q.options.length);assert.ok(q.options.includes(q.answers[0]));}
      if(q.tokens)assert.equal(normalizeFrench(q.tokens.join(' ')),normalizeFrench(q.answers[0]));
    }
  }
});
test('French ignores typography but preserves meaningful accents',()=>{
  assert.equal(normalizeFrench('  J’ai vingt ans ! '),normalizeFrench("j'ai vingt ans."));
  assert.equal(normalizeFrench('sœur'),normalizeFrench('soeur'));
  assert.notEqual(normalizeFrench('ou'),normalizeFrench('où'));
  assert.notEqual(normalizeFrench('visite'),normalizeFrench('visité'));
  assert.equal(normalizeFrench('e\u0301'),normalizeFrench('é'));
});
test('offline audio exists for every vocabulary and listening prompt',()=>{
  assert.equal(audio.length,228);assert.equal(new Set(audio.map(item=>item.path)).size,audio.length);
  for(const item of audio){
    const bytes=readFileSync(new URL('../web/public'+item.path,import.meta.url));
    assert.equal(bytes.toString('ascii',0,4),'RIFF',item.id);assert.equal(bytes.toString('ascii',8,12),'WAVE',item.id);
    assert.ok(bytes.length>1000,item.id);assert.ok(item.text.length);
  }
});
test('choice order is stable but answers do not always occupy the same slot',()=>{
  const positions=new Set();
  for(const lesson of frLessons)for(const q of lesson.questions.filter(q=>q.options)){
    const first=shuffled(q.options,q.id);assert.deepEqual(first,shuffled(q.options,q.id));
    assert.deepEqual([...first].sort(),[...q.options].sort());positions.add(first.indexOf(q.answers[0]));
  }
  assert.ok(positions.size>1);
});
test('new course progress repairs navigation, isolates IDs and unlocks only earned lessons',()=>{
  const value=normalizeProgress({version:1,currentLessonId:'not-a-lesson',completed:['cs01-01','bogus','cs01-01'],drafts:{'cs01-01':'code','bogus':'data'}},csLessons);
  assert.deepEqual(value.completed,['cs01-01']);assert.equal(value.currentLessonId,'cs01-01');assert.deepEqual(Object.keys(value.drafts),['cs01-01']);
  assert.equal(unlocked(csLessons,value,1),true);assert.equal(unlocked(csLessons,value,2),false);
  assert.deepEqual(normalizeProgress(value,frLessons).completed,[]);
  assert.throws(()=>normalizeProgress({version:2},frLessons));
});

test('lesson IDs from the first release survive reordering, so saved progress keeps its meaning',()=>{
  const csIds=new Set(csLessons.map(l=>l.id));
  // cs02-10 (TryParse) was merged into cs03-10; every other original positional ID is still present.
  for(let chapter=1;chapter<=7;chapter++)for(let n=1;n<=12;n++){
    const id=`cs0${chapter}-${String(n).padStart(2,'0')}`;
    if(id!=='cs02-10')assert.ok(csIds.has(id),id);
  }
  assert.equal(csLessons.find(l=>l.id==='cs03-08').topic,'条件运算符');
  assert.equal(csLessons.find(l=>l.id==='cs04-11').topic,'循环边界');
  assert.equal(csLessons.at(-1).id,'cs07-12');
  const kinds=['vocab-meaning','vocab-choice','spelling','order','grammar-choice','grammar-text','translate','listen','dictation','reading','practice','exam'];
  for(let unit=1;unit<=8;unit++)kinds.forEach((kind,index)=>{
    const lesson=frLessons.find(l=>l.id===`fr0${unit}-${String(index+1).padStart(2,'0')}`);
    assert.ok(lesson,`fr0${unit} ${kind}`);assert.equal(lesson.key,kind);
  });
  const value=normalizeProgress({version:1,currentLessonId:'fr02-08',completed:['fr01-01','fr02-07','cs03-08']},frLessons);
  assert.deepEqual(value.completed,['fr01-01','fr02-07']);assert.equal(value.currentLessonId,'fr02-08');
});
test('C# concepts are taught before reference solutions rely on them',()=>{
  const first=pattern=>csLessons.findIndex(l=>pattern.test(l.solution));
  assert.equal(csLessons[first(/[^?]\?(?![?.])[^;\n]*:/)].id,'cs03-08');
  assert.equal(csLessons[first(/string\?/)].id,'cs04-09');
  assert.ok(first(/\benum\b/)>first(/\bclass Hero\b/));
  assert.ok(first(/get; set;/)<csLessons.findIndex(l=>l.chapterId==='cs07'));
  assert.ok(!csLessons.some(l=>l.chapterId==='cs07'&&/public int Hp\s*=/.test(l.solution)),'RPG chapter uses properties');
});
test('C# knowledge checks do not accept look-alike operators',()=>{
  const lesson=csLessons.find(l=>l.id==='cs03-06');
  const ran={compiled:{ok:true},executions:lesson.tests.map(t=>({ok:true,output:t.output}))};
  assert.equal(gradeCode(lesson,'bool cursed = true; Console.WriteLine(cursed != true);',ran).passed,false);
  assert.equal(gradeCode(lesson,'bool cursed = true; Console.WriteLine(!cursed);',ran).passed,true);
});
test('French accepts equivalent translations and alternates',()=>{
  const lesson=frLessons.find(l=>l.id==='fr01-07');
  const id=lesson.questions[0].id;
  for(const answer of ['Je suis Paul.',"Je m'appelle Paul.",'je m’appelle paul'])assert.equal(gradeFrench(lesson,{[id]:answer}).passed,true,answer);
  assert.equal(gradeFrench(lesson,{[id]:'Je suis Pierre.'}).passed,false);
  const custom={questions:[{id:'x',answers:['Bonjour'],alternates:['Salut'],explanation:'.'}]};
  assert.equal(gradeFrench(custom,{x:'salut !'}).passed,true);
  assert.equal(gradeFrench(custom,{x:''}).passed,false);
  assert.ok(frLessons.find(l=>l.id==='fr06-07').questions[0].answers.includes('Où se trouve la gare ?'));
  assert.ok(audio.some(item=>item.text.includes('Demain, il va faire beau')));
});
test('chapter tests and graduation use items that practice lessons never show',()=>{
  for(const chapter of frChapters){
    const exam=chapter.lessons.at(-1);const practice=chapter.lessons.slice(0,-1).flatMap(l=>l.questions);
    const seen=new Set(practice.map(q=>q.prompt+'|'+q.answers[0]+'|'+(q.audio??'')));
    for(const q of exam.questions)assert.ok(!seen.has(q.prompt+'|'+q.answers[0]+'|'+(q.audio??'')),q.id);
  }
});
