import test from 'node:test';
import assert from 'node:assert/strict';
import { parseClangDiagnostics } from '../web/courses/c/compiler.mjs';

test('parses clang line and column diagnostics', () => {
  const diagnostics = parseClangDiagnostics("/project/main.c:4:15: error: expected ';' after expression\n");
  assert.deepEqual(diagnostics, [{ line: 4, column: 15, level: 'error', message: "这里缺少分号 ';'。 after expression" }]);
});

test('returns an empty list for runtime stderr', () => {
  assert.deepEqual(parseClangDiagnostics('something happened'), []);
});
