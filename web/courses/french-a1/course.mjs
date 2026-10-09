import { units, finalReview, furtherPractice } from './content.mjs';
import { propsFor, placeLabels, PLACE_WORDS } from './art.mjs';
export { furtherPractice };
// Home scene and recurring characters for each unit (Léa is the learner's companion throughout).
const SCENES = {
  'fr-basics': { place: 'ecole', cast: ['lea', 'anne'] }, fr01: { place: 'rue', cast: ['lea', 'hugo'] }, fr02: { place: 'poste', cast: ['lea', 'marie'] },
  fr03: { place: 'appartement', cast: ['lea', 'anne', 'paul'] }, fr04: { place: 'boulangerie', cast: ['lea', 'luc'] }, 'fr-time': { place: 'metro', cast: ['lea', 'luc'] },
  fr05: { place: 'cafe', cast: ['lea', 'camille'] }, fr06: { place: 'seine', cast: ['lea', 'zoe'] }, fr07: { place: 'marche', cast: ['lea', 'ines'] },
  'fr-invite': { place: 'jardin', cast: ['lea', 'ines', 'hugo'] }, 'fr-health': { place: 'pharmacie', cast: ['lea', 'camille'] }, fr08: { place: 'gare', cast: ['lea', 'paul'] }
};
const choice = (id, prompt, options, answer, explanation, extra = {}) => ({ id, type: 'choice', prompt, options, answers: [answer], explanation, ...extra });
const text = (id, prompt, answers, explanation, extra = {}) => ({ id, type: 'text', prompt, answers, explanation, ...extra });
const withId = (id, item) => ({ ...item, id });
const tokensOf = sentence => sentence.replace(/\s*[.!?]$/, '').split(' ');
export const audio = [];
function recording(id, transcript) {
  const path = `/audio/fr/${id}.wav`;
  audio.push({ id, text: transcript, path });
  return { audio: path, transcript };
}
// Saved progress is keyed by lesson ID. First-release units keep their positional IDs (fr01-01 … fr01-12)
// for these twelve lesson kinds; lessons added later get key-based IDs, so reordering never remaps progress.
const FIRST_RELEASE_KEYS = ['vocab-meaning', 'vocab-choice', 'spelling', 'order', 'grammar-choice', 'grammar-text', 'translate', 'listen', 'dictation', 'reading', 'practice', 'exam'];
const lessonId = (unit, key) => unit.legacy && FIRST_RELEASE_KEYS.includes(key)
  ? `${unit.id}-${String(FIRST_RELEASE_KEYS.indexOf(key) + 1).padStart(2, '0')}`
  : `${unit.id}-${key}`;

export const chapters = units.map((unit, chapterIndex) => {
  const id = unit.id;
  const isLast = chapterIndex === units.length - 1;
  const vocab = unit.vocabulary.map(([fr, meaning], index) => ({ fr, meaning, ...recording(`${id}-v${index+1}`, fr) }));
  const q = (n, ...args) => choice(`${id}-${n}`, ...args);
  const tx = (n, ...args) => text(`${id}-${n}`, ...args);
  const distractors = index => [vocab[index].fr, vocab[(index+1)%vocab.length].fr, vocab[(index+2)%vocab.length].fr];
  const [drillA, drillB, ...drillRest] = unit.drills;
  const listening = q('listen', unit.listen[1], unit.listen[2], unit.listen[3], `录音：${unit.listen[0]}`, recording(`${id}-listen`, unit.listen[0]));
  const examListening = q('exam-listen', unit.examAudio[1], unit.examAudio[2], unit.examAudio[3], `录音：${unit.examAudio[0]}`, recording(`${id}-exam`, unit.examAudio[0]));
  const translateNote = answers => `参考表达：${answers.join(' / ')}`;
  const rows = [
    ['vocab-meaning', '认识新词', '词汇', [q('v1', `“${vocab[0].fr}”是什么意思？`, [vocab[0].meaning,vocab[1].meaning,vocab[2].meaning], vocab[0].meaning, `${vocab[0].fr}：${vocab[0].meaning}`)]],
    ['vocab-choice', '选择合适的词', '词汇', [q('v2', `选择“${vocab[1].meaning}”的法语。`, distractors(1), vocab[1].fr, `${vocab[1].fr}：${vocab[1].meaning}`)]],
    ['spelling', '亲手写出单词', '拼写', [tx('v3', `用法语写“${vocab[2].meaning}”。保留词表中的冠词。`, [vocab[2].fr], `正确形式：${vocab[2].fr}。重音符号也是拼写的一部分。`)]],
    ['order', '把词排成句子', '句子', [{ id: `${id}-order`, type: 'ordering', prompt: `排列词语：${unit.sentenceMeaning}`, tokens: tokensOf(unit.sentence), answers: [unit.sentence], explanation: `${unit.sentence} —— ${unit.sentenceMeaning}` }]],
    ['grammar-choice', '选择正确语法', '语法', [q('g1', ...unit.grammarChoice), withId(`${id}-g3`, drillA)]],
    ['grammar-text', '补全句子', '语法', [tx('g2', ...unit.grammarText), withId(`${id}-g4`, drillB)]],
    ['drill', '语法强化', '语法', drillRest.map((item, index) => withId(`${id}-d${index+1}`, item))],
    ['translate', '用法语表达', '句子', [tx('translate', unit.translate[0], unit.translate[1], translateNote(unit.translate[1]))]],
    ['listen', '听懂关键信息', '听力', [listening]],
    ['dictation', '听写短句', '听力', [tx('dictation','听录音，写出你听到的法语。',unit.dictation[1],`录音：${unit.dictation[0]}`,recording(`${id}-dictation`,unit.dictation[0]))]],
    ['reading', '读懂短文', '阅读', [q('reading', unit.reading[1],unit.reading[2],unit.reading[3],`从短文中找出对应的信息。`,{passage:unit.reading[0]})]],
    ['practice', '场景综合练习', '综合', [
      q('v4',`选择“${vocab[3].meaning}”。`,distractors(3),vocab[3].fr,`${vocab[3].fr}：${vocab[3].meaning}`),
      tx('v5',`用法语写“${vocab[4].meaning}”，保留词表中的冠词。`,[vocab[4].fr],vocab[4].fr),
      tx('review', ...unit.reviewGrammar),
      tx('sentence-review',unit.translate2[0],unit.translate2[1],translateNote(unit.translate2[1])),
      q('v6',`“${vocab[5].fr}”是什么意思？`,[vocab[5].meaning,vocab[6].meaning,vocab[7].meaning],vocab[5].meaning,vocab[5].meaning),
      // Reuses an existing vocabulary recording, so practice never previews the unit test's listening item.
      q('practice-listen','听录音，选出你听到的词。',distractors(8),vocab[8].fr,`录音：${vocab[8].fr}（${vocab[8].meaning}）`,{audio:vocab[8].audio,transcript:vocab[8].fr})
    ]],
    ['exam', isLast ? 'A1 毕业综合测试' : '章节综合测试', '综合测试', [
      q('v7',`选择“${vocab[6].meaning}”。`,distractors(6),vocab[6].fr,`${vocab[6].fr}：${vocab[6].meaning}`),
      tx('v8',`用法语写“${vocab[7].meaning}”，保留词表中的冠词。`,[vocab[7].fr],vocab[7].fr),
      withId(`${id}-exam-grammar`, unit.examItems[0]),
      withId(`${id}-exam-review`, unit.examItems[1]),
      {id:`${id}-exam-order`,type:'ordering',prompt:`排列句子：${unit.examSentence[1]}`,tokens:tokensOf(unit.examSentence[0]),answers:[unit.examSentence[0]],explanation:`${unit.examSentence[0]} —— ${unit.examSentence[1]}`},
      examListening
    ]]
  ];
  // Every additional glossary word is practised, not merely listed.
  for (let index = 8; index < vocab.length; index++) {
    rows[(index - 8) % 3][3].push(q(`extra-${index}`, `选择“${vocab[index].meaning}”的法语。`, distractors(index), vocab[index].fr, `${vocab[index].fr}：${vocab[index].meaning}`));
  }
  const lessons = rows.map(([key,title,topic,questions],localIndex) => ({id:lessonId(unit,key),key,title,topic,questions,chapterId:id,chapterIndex,localIndex,minutes:questions.length>1?(key==='exam'||key==='practice'?15:8):5}));
  return {...unit,...SCENES[id],vocabulary:vocab,lessons};
});
// Graduation adds cumulative items written for the final test, rather than re-asking earlier practice.
const final = chapters.at(-1).lessons.at(-1);
finalReview.forEach((item, index) => final.questions.push(withId(`fr-final-review-${index+1}`, item)));
final.minutes = 25;
// Every question gets its own everyday Paris comic panel, chosen from the French in the question.
function illustrate(chapter, lesson, question, index) {
  const french = [question.answers?.[0], question.transcript, question.passage, ...(question.options ?? [])].filter(Boolean).join(' ');
  const props = propsFor(`${french} ${question.prompt}`, 2);
  const unitProps = propsFor(chapter.vocabulary.map(item => item.fr).join(' '), 3);
  const focus = [question.answers?.[0], question.transcript, question.prompt].filter(Boolean).join(' ');
  const place = question.passage ? chapter.place : (PLACE_WORDS.find(([, rule]) => rule.test(focus))?.[0]) ?? chapter.place;
  const cast = [chapter.cast[index % chapter.cast.length], chapter.cast[(index + 1) % chapter.cast.length]];
  const exam = lesson.key === 'exam';
  const bubble = lesson.key === 'vocab-meaning' ? question.prompt.match(/“(.+?)”/)?.[1]
    : question.audio ? '♪ Écoute…' : lesson.key === 'reading' ? question.passage.split(/(?<=[.!?])\s/)[0].slice(0, 60) : undefined;
  return { place, cast: exam ? cast.slice(0, 1) : cast, props: props.length ? props : unitProps.slice(index % 2, index % 2 + 1), bubble, villain: exam, burst: exam && index === 0 ? 'BOSS!' : undefined, caption: `${placeLabels[place]} · #${index + 1}`, label: `${placeLabels[place]} 场景插图`, pose: question.audio ? 'hold' : index % 3 === 2 ? 'point' : 'wave', mood: exam ? 'surprised' : 'happy' };
}
for (const chapter of chapters) for (const lesson of chapter.lessons) lesson.questions.forEach((question, index) => { question.scene = illustrate(chapter, lesson, question, index); });
export const lessons = chapters.flatMap(chapter=>chapter.lessons);
if (new Set(lessons.map(lesson => lesson.id)).size !== lessons.length) throw new Error('Duplicate French lesson id');
