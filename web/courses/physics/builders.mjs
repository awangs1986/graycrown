// mc(): the first option is the correct one; the player shuffles options deterministically per question.
export const mc = (id, prompt, options, explanation) => ({ id, type: 'choice', prompt, options, answer: options[0], explanation });
// num(): `answer` is what the app grades against; `verify` is an independent JS expression that
// tests/physics-course.test.mjs evaluates to prove every stored answer. `unit` is the expected unit ('' = pure number).
export const num = (id, prompt, answer, unit, verify, explanation, tolerance = 0.02) => ({ id, type: 'numeric', prompt, answer, unit, verify, explanation, tolerance });
