import { units } from './content.mjs';
const choice = (id, prompt, options, answer, explanation, extra = {}) => ({ id, type: 'choice', prompt, options, answers: [answer], explanation, ...extra });
const text = (id, prompt, answers, explanation, extra = {}) => ({ id, type: 'text', prompt, answers, explanation, ...extra });
export const audio = [];
function recording(id, transcript) {
  const path = `/audio/fr/${id}.wav`;
  audio.push({ id, text: transcript, path });
  return { audio: path, transcript };
}
export const chapters = units.map((unit, chapterIndex) => {
  const id = unit.id;
  const vocab = unit.vocabulary.map(([fr, meaning], index) => ({ fr, meaning, ...recording(`${id}-v${index+1}`, fr) }));
  const q = (n, ...args) => choice(`${id}-${n}`, ...args);
  const tx = (n, ...args) => text(`${id}-${n}`, ...args);
  const distractors = index => [vocab[index].fr, vocab[(index+1)%vocab.length].fr, vocab[(index+2)%vocab.length].fr];
  const grammarChoice = () => q('g1', ...unit.grammarChoice);
  const grammarText = () => tx('g2', ...unit.grammarText);
  const review = () => tx('review', ...unit.reviewGrammar);
  const listening = () => q('listen', unit.listen[1], unit.listen[2], unit.listen[3], `录音：${unit.listen[0]}`, recording(`${id}-listen`, unit.listen[0]));
  const examListening = q('exam-listen', unit.examAudio[1], unit.examAudio[2], unit.examAudio[3], `录音：${unit.examAudio[0]}`, recording(`${id}-exam`, unit.examAudio[0]));
  const rows = [
    ['认识新词', '词汇', [q('v1', `“${vocab[0].fr}”是什么意思？`, [vocab[0].meaning,vocab[1].meaning,vocab[2].meaning], vocab[0].meaning, `${vocab[0].fr}：${vocab[0].meaning}`)]],
    ['选择合适的词', '词汇', [q('v2', `选择“${vocab[1].meaning}”的法语。`, distractors(1), vocab[1].fr, `${vocab[1].fr}：${vocab[1].meaning}`)]],
    ['亲手写出单词', '拼写', [tx('v3', `用法语写“${vocab[2].meaning}”。保留词表中的冠词。`, [vocab[2].fr], `正确形式：${vocab[2].fr}。重音符号也是拼写的一部分。`)]],
    ['把词排成句子', '句子', [{ id: `${id}-order`, type: 'ordering', prompt: `排列词语：${unit.sentenceMeaning}`, tokens: unit.sentence.replace(/[.!?]$/,'').split(' '), answers: [unit.sentence], explanation: `${unit.sentence} —— ${unit.sentenceMeaning}` }]],
    ['选择正确语法', '语法', [grammarChoice()]],
    ['补全句子', '语法', [grammarText()]],
    ['用法语表达', '句子', [tx('translate', unit.translate[0], unit.translate[1], `参考表达：${unit.translate[1].join(' / ')}`)]],
    ['听懂关键信息', '听力', [listening()]],
    ['听写短句', '听力', [tx('dictation','听录音，写出你听到的法语。',unit.dictation[1],`录音：${unit.dictation[0]}`,recording(`${id}-dictation`,unit.dictation[0]))]],
    ['读懂短文', '阅读', [q('reading', unit.reading[1],unit.reading[2],unit.reading[3],`从短文中找出对应的信息。`,{passage:unit.reading[0]})]],
    ['场景综合练习', '综合', [
      q('v4',`选择“${vocab[3].meaning}”。`,distractors(3),vocab[3].fr,`${vocab[3].fr}：${vocab[3].meaning}`),
      tx('v5',`用法语写“${vocab[4].meaning}”，保留词表中的冠词。`,[vocab[4].fr],vocab[4].fr),
      review(),
      tx('sentence-review',unit.translate[0],unit.translate[1],unit.translate[1][0]),
      q('v6',`“${vocab[5].fr}”是什么意思？`,[vocab[5].meaning,vocab[6].meaning,vocab[7].meaning],vocab[5].meaning,vocab[5].meaning),
      {...examListening,id:`${id}-practice-listen`}
    ]],
    [chapterIndex === units.length-1 ? 'A1 毕业综合测试' : '章节综合测试', '综合测试', [
      q('v7',`选择“${vocab[6].meaning}”。`,distractors(6),vocab[6].fr,`${vocab[6].fr}：${vocab[6].meaning}`),
      tx('v8',`用法语写“${vocab[7].meaning}”，保留词表中的冠词。`,[vocab[7].fr],vocab[7].fr),
      {...grammarChoice(),id:`${id}-exam-grammar`},
      {...review(),id:`${id}-exam-review`},
      {id:`${id}-exam-order`,type:'ordering',prompt:`排列句子：${unit.sentenceMeaning}`,tokens:unit.sentence.replace(/[.!?]$/,'').split(' '),answers:[unit.sentence],explanation:unit.sentence},
      examListening
    ]]
  ];
  // Every additional glossary word is practised, not merely listed.
  for (let index = 8; index < vocab.length; index++) {
    rows[(index - 8) % 3][2].push(q(`extra-${index}`, `选择“${vocab[index].meaning}”的法语。`, distractors(index), vocab[index].fr, `${vocab[index].fr}：${vocab[index].meaning}`));
  }
  const lessons = rows.map(([title,topic,questions],localIndex) => ({id:`${id}-${String(localIndex+1).padStart(2,'0')}`,title,topic,questions,chapterId:id,chapterIndex,localIndex,minutes:questions.length>1?15:5}));
  return {...unit,vocabulary:vocab,lessons};
});
// Graduation samples earlier topics as well, rather than testing only the last unit.
const final = chapters.at(-1).lessons.at(-1);
for (const index of [0,1,2,3,4,5,6]) {
  const source = chapters[index].lessons[index%2 ? 5 : 4].questions[0];
  final.questions.push({...source,id:`fr-final-review-${index+1}`});
}
export const lessons = chapters.flatMap(chapter=>chapter.lessons);
