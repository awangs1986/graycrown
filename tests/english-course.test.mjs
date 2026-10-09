import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { chapters, lessons, audio, LESSON_NUMBERS, credits } from '../web/courses/english-nce/course.mjs';
import { gradeEnglish, normalizeEnglish, englishMatches, shuffled } from '../web/courses/english-nce/judge.mjs';
import { comicPanel, places, propNames, propsFor } from '../web/courses/english-nce/art.mjs';
import { adventure } from '../web/courses/english-nce/adventure.mjs';
import { attachAdventure } from '../web/courses/shared/adventure.mjs';
import { normalizeProgress, unlocked } from '../web/courses/shared/progress.mjs';
import { lessons as frLessons } from '../web/courses/french-a1/course.mjs';

test('English follows NCE Books 1–2: 15 + 10 units, 325 lessons with explicit stable IDs',()=>{
  assert.equal(chapters.length,25);assert.equal(lessons.length,325);
  assert.equal(chapters.filter(c=>c.book===1).length,15);assert.equal(chapters.filter(c=>c.book===2).length,10);
  assert.deepEqual(chapters.map(c=>c.id),[...Array.from({length:15},(_,i)=>`en1-${String(i+1).padStart(2,'0')}`),...Array.from({length:10},(_,i)=>`en2-${String(i+1).padStart(2,'0')}`)]);
  for(const lesson of lessons){
    assert.match(lesson.id,/^en[12]-\d\d-\d\d$/);
    assert.equal(lesson.id,`${lesson.chapterId}-${LESSON_NUMBERS[lesson.key]}`);
  }
  assert.equal(lessons[0].id,'en1-01-01');assert.equal(lessons.at(-1).id,'en2-10-13');
  for(const chapter of chapters){assert.equal(chapter.lessons.at(-1).key,'exam');assert.equal(chapter.vocabulary.length,10);assert.ok(chapter.grammar&&chapter.goal&&chapter.tips);}
  assert.ok(lessons.at(-1).questions.length>=18);
});
test('every English item is answerable, rejects wrong and empty answers, and has sane options',()=>{
  for(const lesson of lessons){
    assert.equal(new Set(lesson.questions.map(q=>q.id)).size,lesson.questions.length,lesson.id);
    const correct=Object.fromEntries(lesson.questions.map(q=>[q.id,q.answers[0]]));
    assert.equal(gradeEnglish(lesson,correct).passed,true,lesson.id);
    assert.equal(gradeEnglish(lesson,{}).passed,false,lesson.id);
    assert.equal(gradeEnglish(lesson,{...correct,[lesson.questions[0].id]:'incorrect answer'}).passed,false,lesson.id);
    for(const q of lesson.questions){
      assert.ok(q.explanation,q.id);
      for(const answer of q.answers)assert.equal(gradeEnglish({questions:[q]},{[q.id]:answer}).passed,true,`${q.id} ${answer}`);
      if(q.options){assert.equal(new Set(q.options).size,q.options.length,q.id);assert.ok(q.options.includes(q.answers[0]),q.id);
        for(const option of q.options.filter(o=>o!==q.answers[0]))assert.equal(gradeEnglish({questions:[q]},{[q.id]:option}).passed,false,`${q.id} distractor ${option}`);}
      if(q.tokens)assert.equal(normalizeEnglish(q.tokens.join(' ')),normalizeEnglish(q.answers[0]),q.id);
    }
  }
});
test('English grading accepts contractions, UK/US spelling and alternative translations',()=>{
  assert.ok(englishMatches("I'm an engineer.",'i am an engineer'));
  assert.ok(englishMatches("You mustn't run in the classroom.",'You must not run in the classroom'));
  assert.ok(englishMatches("He's gone to Paris.",'He has gone to Paris.'));
  assert.ok(englishMatches('What colour is your hat?','What color is your hat'));
  assert.ok(englishMatches("If I were you, I'd take an umbrella.",'If I were you, I would take an umbrella.'));
  assert.ok(!englishMatches('She goes to school.','She go to school.'));
  assert.ok(!englishMatches("Leo's bag",'Leo is bag'));
  const lesson=lessons.find(l=>l.id==='en1-02-08'),id=lesson.questions[0].id;
  for(const answer of ['Nice to meet you.','Pleased to meet you!',"it's nice to meet you"])assert.equal(gradeEnglish(lesson,{[id]:answer}).passed,true,answer);
  const spelling=lessons.find(l=>l.id==='en1-01-03');
  assert.equal(gradeEnglish(spelling,{[spelling.questions[0].id]:'an umbrella'}).passed,true);
  assert.ok(lessons.filter(l=>l.key==='translate').every(l=>l.questions[0].answers.length>=1));
  assert.ok(lessons.filter(l=>l.key==='translate').filter(l=>l.questions[0].answers.length>1).length>=20);
});
test('chapter bosses and graduation use items that practice never shows',()=>{
  for(const chapter of chapters){
    const exam=chapter.lessons.at(-1),practice=chapter.lessons.slice(0,-1).flatMap(l=>l.questions);
    const seen=new Set(practice.map(q=>q.prompt+'|'+q.answers[0]+'|'+(q.audio??'')));
    for(const q of exam.questions)assert.ok(!seen.has(q.prompt+'|'+q.answers[0]+'|'+(q.audio??'')),q.id);
  }
});
test('offline English audio: one compact MP3 per vocabulary, listening and dictation clip',()=>{
  assert.equal(audio.length,325);assert.equal(new Set(audio.map(item=>item.path)).size,audio.length);
  let total=0;
  for(const item of audio){
    const bytes=readFileSync(new URL('../web/public'+item.path,import.meta.url));total+=bytes.length;
    assert.ok(bytes.toString('ascii',0,3)==='ID3'||(bytes[0]===0xff&&(bytes[1]&0xe0)===0xe0),item.id);
    assert.ok(bytes.length>1500,item.id);assert.ok(item.text.length);
  }
  assert.ok(total<12*1024*1024,`audio bundle ${total} bytes`);
  assert.equal(readdirSync(new URL('../web/public/audio/en/',import.meta.url)).filter(name=>name.endsWith('.mp3')).length,325);
});
test('every question has its own everyday comic panel built from the shared original kit',()=>{
  const placesUsed=new Set(),propsUsed=new Set();
  for(const lesson of lessons)for(const q of lesson.questions){
    assert.ok(places[q.scene.place],q.id);placesUsed.add(q.scene.place);
    assert.ok(q.scene.props.every(name=>propNames.includes(name)),q.id);q.scene.props.forEach(name=>propsUsed.add(name));
    const svg=comicPanel(q.scene);
    assert.match(svg,/^<svg class="comic-panel"/);assert.ok(!/undefined|NaN/.test(svg),q.id);assert.ok(svg.length<40000,q.id);
  }
  assert.ok(placesUsed.size>=12,`places ${placesUsed.size}`);assert.ok(propsUsed.size>=35,`props ${propsUsed.size}`);
  assert.deepEqual(propsFor('Is this your umbrella?'),['umbrella']);
  assert.ok(lessons.find(l=>l.id==='en1-12-09').questions[0].scene.place==='station');
  assert.ok(lessons.filter(l=>l.key==='exam').every(l=>l.questions.every(q=>q.scene.villain)));
  assert.ok(comicPanel({bubble:'<script>alert(1)</script>'}).includes('&lt;script&gt;'));
});
test('English course ships no Pokémon references or raster artwork, and states its NCE alignment',()=>{
  const dir=new URL('../web/courses/english-nce/',import.meta.url);
  for(const name of readdirSync(dir)){
    assert.match(name,/\.(mjs|css|md)$/,name);
    // CREDITS.md may state the policy itself; code and styles must not reference the franchise.
    if(!name.endsWith('.md'))assert.ok(!/pok[eé]mon|pikachu|宝可梦|寶可夢|ポケモン/i.test(readFileSync(new URL(name,dir),'utf8')),name);
  }
  assert.match(credits.syllabus,/原创/);assert.match(credits.syllabusEn,/original/i);
});
test('English adventure attaches one quest per lesson, boss last, and progress stays isolated',()=>{
  adventure.prepare(chapters);attachAdventure(chapters,adventure);
  assert.equal(adventure.regions.length,25);
  for(const chapter of chapters){assert.equal(chapter.adventure.quests.length,13);assert.equal(chapter.lessons.at(-1).adventure.boss,true);assert.ok(!chapter.lessons.at(-1).adventure.title.includes('{'));}
  const value=normalizeProgress({version:1,currentLessonId:'en1-01-02',completed:['en1-01-01','fr01-01','bogus']},lessons);
  assert.deepEqual(value.completed,['en1-01-01']);assert.equal(value.currentLessonId,'en1-01-02');
  assert.equal(unlocked(lessons,value,1),true);assert.equal(unlocked(lessons,value,2),false);
  assert.deepEqual(normalizeProgress(value,frLessons).completed,[]);
  const positions=new Set();
  for(const lesson of lessons)for(const q of lesson.questions.filter(q=>q.options)){assert.deepEqual(shuffled(q.options,q.id),shuffled(q.options,q.id));positions.add(shuffled(q.options,q.id).indexOf(q.answers[0]));}
  assert.ok(positions.size>1);
});
