export const c = (prompt, options, answer, explanation) => ({ type: 'choice', prompt, options, answers: [answer], explanation });
export const w = (prompt, answers, explanation) => ({ type: 'text', prompt, answers, explanation });
