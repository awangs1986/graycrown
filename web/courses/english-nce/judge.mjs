// English answers are compared after removing typography differences. Contractions are expanded
// (I'm = I am, don't = do not); ambiguous 's / 'd produce both readings so "He's gone" matches "He has gone".
// British and American spellings of the same word are both accepted.
const SPELLING = { colour: 'color', colours: 'colors', favourite: 'favorite', realise: 'realize', realised: 'realized', travelled: 'traveled', travelling: 'traveling', centre: 'center', theatre: 'theater', programme: 'program', grey: 'gray', neighbour: 'neighbor', mum: 'mom', maths: 'math', mathematics: 'math', cancelled: 'canceled' };
const FIXED = [[/\bwon't\b/g, 'will not'], [/\bcan't\b/g, 'cannot'], [/\bcan not\b/g, 'cannot'], [/\bshan't\b/g, 'shall not'], [/\bain't\b/g, 'is not'], [/\blet's\b/g, 'let us'], [/n't\b/g, ' not'], [/'m\b/g, ' am'], [/'re\b/g, ' are'], [/'ve\b/g, ' have'], [/'ll\b/g, ' will']];
const PRONOUN_S = /\b(he|she|it|that|what|where|there|here|who|how|this)'s\b/;
const ANY_D = /\b(i|you|he|she|it|we|they|there|who)'d\b/;
export function normalizeEnglish(value) {
  let text = String(value ?? '').normalize('NFC').replace(/[’‘`´]/g, "'").replace(/[“”«»"]/g, '').toLowerCase()
    .replace(/[.,!?;:()…]|—|–/g, ' ').replace(/\s*'\s*/g, "'").replace(/\s+/g, ' ').trim();
  for (const [rule, replacement] of FIXED) text = text.replace(rule, replacement);
  return text.split(' ').map(word => SPELLING[word] ?? word).join(' ').replace(/\s+/g, ' ').trim();
}
export function englishVariants(value) {
  let forms = [normalizeEnglish(value)];
  for (let guard = 0; guard < 3; guard++) {
    const next = [];
    for (const form of forms) {
      if (PRONOUN_S.test(form)) next.push(form.replace(PRONOUN_S, '$1 is'), form.replace(PRONOUN_S, '$1 has'));
      else if (ANY_D.test(form)) next.push(form.replace(ANY_D, '$1 would'), form.replace(ANY_D, '$1 had'));
      else next.push(form);
    }
    forms = [...new Set(next)];
  }
  return forms;
}
export function englishMatches(answer, response) {
  if (!String(response ?? '').trim()) return false;
  const accepted = new Set(englishVariants(answer));
  return englishVariants(response).some(form => accepted.has(form));
}
export function gradeEnglish(lesson, responses) {
  const checks = lesson.questions.map(question => {
    const response = responses[question.id];
    const value = Array.isArray(response) ? response.join(' ') : String(response ?? '');
    // answers[0] is the model answer; further answers and alternates are equally accepted.
    const accepted = [...question.answers, ...(question.alternates ?? [])];
    const passed = value.trim() !== '' && accepted.some(answer => englishMatches(answer, value));
    return { id: question.id, passed, actual: value, expected: question.answers[0], explanation: question.explanation };
  });
  const correct = checks.filter(check => check.passed).length;
  return { passed: correct === checks.length, score: Math.round(correct / checks.length * 100), correct, total: checks.length, checks };
}
export { shuffled } from '../french-a1/judge.mjs';
