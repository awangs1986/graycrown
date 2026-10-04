import test from 'node:test';
import assert from 'node:assert/strict';
import { emptySave, normalizeSave } from '../web/courses/c/save-store.mjs';

test('new saves use JSON schema version 2', () => {
  assert.equal(emptySave().version, 2);
  assert.equal(Object.keys(emptySave().answerTokens).length, 7);
  assert.equal(emptySave().answerTokens.day07, 3);
  assert.equal(emptySave().aiTutorUses.day07, false);
  assert.deepEqual(emptySave().consecutiveFailures, {});
});

test('normalization repairs malformed collections', () => {
  const value = normalizeSave({ version: 2, completed: 'bad', drafts: null });
  assert.deepEqual(value.completed, []);
  assert.deepEqual(value.drafts, {});
  assert.equal(value.aiTutorUses.day01, false);
});
