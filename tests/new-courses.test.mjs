import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { chapters as csChapters, lessons as csLessons } from '../web/courses/csharp/course.mjs';
import { gradeCode } from '../web/courses/csharp/judge.mjs';
import { chapters as frChapters, lessons as frLessons, audio } from '../web/courses/french-a1/course.mjs';
import { gradeFrench, normalizeFrench, shuffled } from '../web/courses/french-a1/judge.mjs';
import { normalizeProgress, unlocked } from '../web/courses/shared/progress.mjs';

test('C# offers seven progressive chapters and 84 complete exercises',()=>{
  assert.equal(csChapters.length,7);assert.equal(csLessons.length,84);
  assert.equal(new Set(csLessons.map(l=>l.id)).size,84);
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
test('French includes 96 exercises, vocabulary practice and cumulative A1 assessment',()=>{
  assert.equal(frChapters.length,8);assert.equal(frLessons.length,96);
  assert.equal(frChapters.reduce((n,c)=>n+c.vocabulary.length,0),128);
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
  assert.equal(audio.length,152);assert.equal(new Set(audio.map(item=>item.path)).size,audio.length);
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
