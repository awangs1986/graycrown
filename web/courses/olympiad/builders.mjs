// mc(): first option is correct (player shuffles deterministically). num(): `verify` is an independent JS expression
// that tests/olympiad-course.test.mjs evaluates to prove each stored answer.
export const mc = (id, prompt, options, explanation, hint) => ({ id, type: 'choice', prompt, options, answer: options[0], explanation, hint });
export const num = (id, prompt, answer, verify, explanation, hint, unit = '') => ({ id, type: 'numeric', prompt, answer, verify, explanation, hint, unit });
// stage(): one "teach first, then test" stage. The worked example is animated by the Remotion video `video` (same id);
// example.steps double as the video's Chinese captions.
export const stage = (id, title, method, teach, quiz) => ({ id, title, method, video: id, teach, quiz });
