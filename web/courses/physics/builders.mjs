// mc(): the first option is the correct one; the player shuffles options deterministically per question.
// `extra` may add { hint, anim } — a gentle hint shown on request and an optional still SVG picture.
export const mc = (id, prompt, options, explanation, extra = {}) => ({ id, type: 'choice', prompt, options, answer: options[0], explanation, ...extra });
// num(): `answer` is what the app grades against; `verify` is an independent JS expression that
// tests/physics-course.test.mjs evaluates to prove every stored answer. `unit` is the expected unit ('' = pure number).
export const num = (id, prompt, answer, unit, verify, explanation, tolerance = 0.02, extra = {}) => ({ id, type: 'numeric', prompt, answer, unit, verify, explanation, tolerance, ...extra });
