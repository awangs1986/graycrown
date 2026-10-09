import { units, finalReview, credits } from './content.mjs';
import { propsFor } from './art.mjs';
export { credits };
const choice = (id, prompt, options, answer, explanation, extra = {}) => ({ id, type: 'choice', prompt, options, answers: [answer], explanation, ...extra });
const text = (id, prompt, answers, explanation, extra = {}) => ({ id, type: 'text', prompt, answers, explanation, ...extra });
const withId = (id, item) => ({ ...item, id });
const tokensOf = sentence => sentence.replace(/\s*[.!?]$/, '').split(' ');
export const audio = [];
function recording(id, transcript) {
  const path = `/audio/en/${id}.mp3`;
  audio.push({ id, text: transcript, path });
  return { audio: path, transcript };
}
// Saved progress is keyed by lesson ID. Each lesson kind owns a fixed number, so units can be reordered or
// extended later without remapping progress: en1-01-01 is always the first vocabulary lesson of unit en1-01.
export const LESSON_NUMBERS = Object.freeze({ 'vocab-meaning': '01', 'vocab-choice': '02', spelling: '03', order: '04', 'grammar-choice': '05', 'grammar-text': '06', drill: '07', translate: '08', listen: '09', dictation: '10', reading: '11', practice: '12', exam: '13' });
const article = word => /^[a-z]+$/i.test(word) ? [`a ${word}`, `an ${word}`, `the ${word}`] : [];
const PLACE_WORDS = [['kitchen', /\b(kitchen|fridge|cook|cooking|soup)\b/i], ['station', /\b(station|platform|train)\b/i], ['classroom', /\b(classroom|school|teacher|lesson|test)\b/i], ['shop', /\b(shop|market|buy|bought|price|pounds?)\b/i], ['hospital', /\b(hospital|doctor|nurse|ill|appointment)\b/i], ['library', /\b(library|librarian|novel|dictionary)\b/i], ['airport', /\b(airport|plane|fly|flight)\b/i], ['cafe', /\b(cafe|waiter|menu|recipe|coffee)\b/i], ['park', /\b(park|picnic|lake|garden)\b/i], ['beach', /\b(sea|beach|boat|swim)\b/i], ['bedroom', /\b(bed|sleep|bedroom|get up)\b/i], ['office', /\b(office|company|manager|meeting|email)\b/i], ['countryside', /\b(village|farm|bridge|countryside)\b/i]];
const placeLabels = { home: 'HOME', kitchen: 'KITCHEN', classroom: 'CLASSROOM', shop: 'CORNER SHOP', street: 'HIGH STREET', park: 'PARK', station: 'STATION', office: 'OFFICE', hospital: 'CLINIC', cafe: 'CAFE', bedroom: 'BEDROOM', airport: 'AIRPORT', beach: 'BEACH', library: 'LIBRARY', countryside: 'VILLAGE' };
// Every question gets its own everyday-life comic panel: the place and props are read from the English
// in the question, so "umbrella" shows an umbrella, "station" moves the scene to the platform, and so on.
function illustrate(unit, lesson, question, index) {
  const english = [question.answers?.[0], question.transcript, question.passage, ...(question.options ?? [])].filter(Boolean).join(' ');
  const props = propsFor(`${english} ${question.prompt}`, 2);
  const unitProps = propsFor(unit.vocabulary.map(item => item.en).join(' '), 3);
  const focus = [question.answers?.[0], question.transcript].filter(Boolean).join(' ');
  const place = question.passage ? unit.place : (PLACE_WORDS.find(([, rule]) => rule.test(focus))?.[0]) ?? unit.place;
  const cast = unit.cast.length > 1 ? [unit.cast[index % unit.cast.length], unit.cast[(index + 1) % unit.cast.length]] : unit.cast;
  const exam = lesson.key === 'exam';
  const bubble = lesson.key === 'vocab-meaning' ? question.prompt.match(/“(.+?)”/)?.[1]
    : question.audio ? '♪ Listen…' : lesson.key === 'translate' || question.id.endsWith('sentence-review') ? question.prompt.replace(/^翻译成英语：/, '') : lesson.key === 'reading' ? question.passage.split('\n')[0].slice(0, 60) : undefined;
  return { place, cast: exam ? cast.slice(0, 1) : cast, props: props.length ? props : unitProps.slice(index % 2, index % 2 + 1), bubble, villain: exam, burst: exam && index === 0 ? 'BOSS!' : undefined, caption: `${placeLabels[place]} · #${index + 1}`, label: `${placeLabels[place]} 场景插图`, pose: question.audio ? 'hold' : index % 3 === 2 ? 'point' : 'wave', mood: exam ? 'surprised' : 'happy' };
}

export const chapters = units.map((unit, chapterIndex) => {
  const id = unit.id;
  const isLast = chapterIndex === units.length - 1;
  const vocab = unit.vocabulary.map(([en, meaning], index) => ({ en, meaning, ...recording(`${id}-v${index + 1}`, en) }));
  const q = (n, ...args) => choice(`${id}-${n}`, ...args);
  const tx = (n, ...args) => text(`${id}-${n}`, ...args);
  const distractors = index => [vocab[index].en, vocab[(index + 1) % vocab.length].en, vocab[(index + 2) % vocab.length].en];
  const [drillA, drillB, ...drillRest] = unit.drills;
  const listening = q('listen', unit.listen[1], unit.listen[2], unit.listen[3], `录音：${unit.listen[0]}`, recording(`${id}-listen`, unit.listen[0]));
  const examListening = q('exam-listen', unit.examAudio[1], unit.examAudio[2], unit.examAudio[3], `录音：${unit.examAudio[0]}`, recording(`${id}-exam`, unit.examAudio[0]));
  const translateNote = answers => `参考表达：${answers.slice(0, 3).join(' / ')}`;
  const rows = [
    ['vocab-meaning', '认识新词', '词汇', [q('v1', `“${vocab[0].en}”是什么意思？`, [vocab[0].meaning, vocab[1].meaning, vocab[2].meaning], vocab[0].meaning, `${vocab[0].en}：${vocab[0].meaning}`)]],
    ['vocab-choice', '选择合适的词', '词汇', [q('v2', `选择“${vocab[1].meaning}”的英语。`, distractors(1), vocab[1].en, `${vocab[1].en}：${vocab[1].meaning}`)]],
    ['spelling', '亲手写出单词', '拼写', [tx('v3', `用英语写“${vocab[2].meaning}”。`, [vocab[2].en], `正确拼写：${vocab[2].en}`, { alternates: article(vocab[2].en) })]],
    ['order', '把词排成句子', '句子', [{ id: `${id}-order`, type: 'ordering', prompt: `排列词语：${unit.sentenceMeaning}`, tokens: tokensOf(unit.sentence), answers: [unit.sentence], explanation: `${unit.sentence} —— ${unit.sentenceMeaning}` }]],
    ['grammar-choice', '选择正确语法', '语法', [q('g1', ...unit.grammarChoice), withId(`${id}-g3`, drillA)]],
    ['grammar-text', '补全句子', '语法', [tx('g2', ...unit.grammarText), withId(`${id}-g4`, drillB)]],
    ['drill', '语法强化', '语法', drillRest.map((item, index) => withId(`${id}-d${index + 1}`, item))],
    ['translate', '用英语表达', '句子', [tx('translate', `翻译成英语：${unit.translate[0]}`, unit.translate[1], translateNote(unit.translate[1]))]],
    ['listen', '听懂关键信息', '听力', [listening]],
    ['dictation', '听写句子', '听力', [tx('dictation', '听录音，写出你听到的英语句子。', unit.dictation[1], `录音：${unit.dictation[0]}`, recording(`${id}-dictation`, unit.dictation[0]))]],
    ['reading', unit.book === 1 ? '读懂对话' : '读懂短篇故事', '阅读', [q('reading', unit.reading[1], unit.reading[2], unit.reading[3], '从原文中找出对应的信息。', { passage: unit.reading[0] })]],
    ['practice', '场景综合练习', '综合', [
      q('v4', `选择“${vocab[3].meaning}”。`, distractors(3), vocab[3].en, `${vocab[3].en}：${vocab[3].meaning}`),
      tx('v5', `用英语写“${vocab[4].meaning}”。`, [vocab[4].en], vocab[4].en, { alternates: article(vocab[4].en) }),
      tx('review', ...unit.reviewGrammar),
      tx('sentence-review', `翻译成英语：${unit.translate2[0]}`, unit.translate2[1], translateNote(unit.translate2[1])),
      q('v6', `“${vocab[5].en}”是什么意思？`, [vocab[5].meaning, vocab[6].meaning, vocab[7].meaning], vocab[5].meaning, vocab[5].meaning),
      // Reuses a vocabulary recording, so practice never previews the unit test's listening item.
      q('practice-listen', '听录音，选出你听到的词。', distractors(8), vocab[8].en, `录音：${vocab[8].en}（${vocab[8].meaning}）`, { audio: vocab[8].audio, transcript: vocab[8].en })
    ]],
    ['exam', isLast ? '毕业大结局：综合测试' : '本章 Boss 战：综合测试', '综合测试', [
      q('v7', `选择“${vocab[6].meaning}”。`, distractors(6), vocab[6].en, `${vocab[6].en}：${vocab[6].meaning}`),
      tx('v8', `用英语写“${vocab[7].meaning}”。`, [vocab[7].en], vocab[7].en, { alternates: article(vocab[7].en) }),
      withId(`${id}-exam-grammar`, unit.examItems[0]),
      withId(`${id}-exam-review`, unit.examItems[1]),
      { id: `${id}-exam-order`, type: 'ordering', prompt: `排列句子：${unit.examSentence[1]}`, tokens: tokensOf(unit.examSentence[0]), answers: [unit.examSentence[0]], explanation: `${unit.examSentence[0]} —— ${unit.examSentence[1]}` },
      examListening
    ]]
  ];
  // Every glossary word beyond the core eight is practised, not merely listed.
  for (let index = 8; index < vocab.length; index++) {
    rows[(index - 8) % 3][3].push(q(`extra-${index}`, `选择“${vocab[index].meaning}”的英语。`, distractors(index), vocab[index].en, `${vocab[index].en}：${vocab[index].meaning}`));
  }
  const lessons = rows.map(([key, title, topic, questions], localIndex) => ({ id: `${id}-${LESSON_NUMBERS[key]}`, key, title, topic, questions, chapterId: id, chapterIndex, localIndex, minutes: questions.length > 1 ? (key === 'exam' || key === 'practice' ? 15 : 8) : 5 }));
  return { ...unit, vocabulary: vocab, lessons, introduction: `${unit.grammar}\n\n发音与朗读：${unit.tips}` };
});
const final = chapters.at(-1).lessons.at(-1);
finalReview.forEach((item, index) => final.questions.push(withId(`en-final-review-${index + 1}`, item)));
final.minutes = 25;
for (const chapter of chapters) for (const lesson of chapter.lessons) lesson.questions.forEach((question, index) => { question.scene = illustrate(chapter, lesson, question, index); });
export const lessons = chapters.flatMap(chapter => chapter.lessons);
if (new Set(lessons.map(lesson => lesson.id)).size !== lessons.length) throw new Error('Duplicate English lesson id');
