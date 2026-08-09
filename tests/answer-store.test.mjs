import test from 'node:test';
import assert from 'node:assert/strict';
import { consumeAnswerToken, tokenCount } from '../web/answer-store.mjs';
import { emptySave, normalizeSave } from '../web/save-store.mjs';

test('a new chapter starts with three answer crystals', () => {
  assert.equal(tokenCount(emptySave()), 3);
  assert.equal(tokenCount(emptySave(), 'day07'), 3);
});

test('each chapter consumes its own crystals independently', () => {
  const state = emptySave();
  consumeAnswerToken(state, 'D2-Q01', 'day02');
  assert.equal(tokenCount(state, 'day02'), 2);
  assert.equal(tokenCount(state, 'day03'), 3);
});

test('answer crystals are consumed and recorded in the JSON state', () => {
  const state = emptySave();
  assert.equal(consumeAnswerToken(state, 'D1-Q01'), true);
  assert.equal(tokenCount(state), 2);
  assert.deepEqual(state.answerUses.day01, ['D1-Q01']);
});

test('a fourth answer cannot be revealed', () => {
  const state = emptySave();
  consumeAnswerToken(state, 'D1-Q01');
  consumeAnswerToken(state, 'D1-Q02');
  consumeAnswerToken(state, 'D1-Q03');
  assert.equal(consumeAnswerToken(state, 'D1-Q04'), false);
  assert.equal(tokenCount(state), 0);
});

test('old version-2 saves receive the new three-crystal field', () => {
  const state = normalizeSave({ version: 2, started: true });
  assert.equal(tokenCount(state), 3);
  assert.deepEqual(state.answerUses.day01, []);
});
