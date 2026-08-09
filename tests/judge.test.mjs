import test from 'node:test';
import assert from 'node:assert/strict';
import { gradeLesson } from '../web/judge.mjs';

const lesson = {
  validation: {
    output: { mode: 'exact', value: 'Hello\n' },
    code: [{ pattern: /\bprintf\s*\(/, message: '需要 printf' }],
    maxPrintf: 1
  }
};

test('passes matching output and required construct', () => {
  const result = gradeLesson(lesson, 'printf("Hello\\n");', { ok: true, output: 'Hello\n' });
  assert.equal(result.passed, true);
});

test('does not count a required construct hidden in comments', () => {
  const result = gradeLesson(lesson, '// printf("Hello")', { ok: true, output: 'Hello\n' });
  assert.equal(result.passed, false);
});

test('compile failures fail immediately', () => {
  const result = gradeLesson(lesson, '', { ok: false, stage: 'compile', output: '' });
  assert.equal(result.passed, false);
  assert.equal(result.tests[0].name, '编译与运行');
});

test('accepts any explicitly listed exact output alternative', () => {
  const alternativeLesson = {
    validation: { output: { mode: 'exact', value: ['North\n', 'East\n'] }, code: [] }
  };
  assert.equal(gradeLesson(alternativeLesson, '', { ok: true, output: 'East\n' }).passed, true);
  assert.equal(gradeLesson(alternativeLesson, '', { ok: true, output: 'South\n' }).passed, false);
});

test('accepts any equivalent required code pattern', () => {
  const alternativeLesson = {
    validation: {
      output: { mode: 'exact', value: 'Gold: 18\n' },
      code: [{ anyOf: [/\w+\s*=\s*\w+\s*-\s*\w+/, /\w+\s*-=\s*\w+/], message: '需要减法' }]
    }
  };
  assert.equal(gradeLesson(alternativeLesson, 'coins -= fee;', { ok: true, output: 'Gold: 18\n' }).passed, true);
});

test('ordered flexible output accepts extra story text but rejects reversed required events', () => {
  const orderedLesson = {
    validation: {
      output: { mode: 'custom', includes: ['Key collected', 'Door opened'], minLines: 2, ordered: true },
      code: []
    }
  };
  assert.equal(gradeLesson(orderedLesson, '', { ok: true, output: 'Key collected\nA rune flashes\nDoor opened\n' }).passed, true);
  assert.equal(gradeLesson(orderedLesson, '', { ok: true, output: 'Door opened\nKey collected\n' }).passed, false);
});
