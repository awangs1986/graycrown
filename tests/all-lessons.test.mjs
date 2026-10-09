import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { lessons } from '../web/courses/c/course.mjs';
import { gradeLesson } from '../web/courses/c/judge.mjs';
import { lessonSolutions } from './lesson-solutions.mjs';

// Each batch runs in a fresh process with a fresh Wasmer runtime; see
// tests/c-lesson-batch.mjs for why one runtime cannot compile all 140 lessons.
// A runtime fails on its 11th compile, so 5 leaves a wide margin (the web app
// itself compiles at most a warm-up plus one job per worker).
const LESSONS_PER_PROCESS = 5;
// The child reports every lesson as soon as it finishes (about 1 s each). If
// it goes silent this long, the Wasmer deadlock described in
// c-lesson-batch.mjs has blocked it completely; kill it and retry.
const SILENCE_TIMEOUT_MS = 60_000;
// A stalled Wasmer run is retried in a new process at most this many times per
// lesson before the test fails.
const MAX_STALL_RETRIES = 3;
const RESULT_PREFIX = '@@LESSON_BATCH_RESULT@@';
const batchScript = join(dirname(fileURLToPath(import.meta.url)), 'c-lesson-batch.mjs');

// Resolves with { results, stalled } where `stalled` (if set) names the first
// lesson whose Wasmer run never finished.
function runBatch(start, end) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [batchScript, String(start), String(end)], { stdio: ['ignore', 'pipe', 'pipe'] });
    const results = [];
    let stalled;
    let failure;
    let done = false;
    let buffer = '';
    let stderr = '';
    let timer;
    const label = `第 ${start + 1}–${end} 题`;
    const watch = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        stalled ??= { index: start + results.length, message: `${lessons[start + results.length].id} 的 Wasmer 进程 ${SILENCE_TIMEOUT_MS / 1000} 秒无响应` };
        child.kill('SIGKILL');
      }, SILENCE_TIMEOUT_MS);
    };
    watch();
    child.stdout.on('data', chunk => {
      buffer += chunk;
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.startsWith(RESULT_PREFIX)) continue;
        const message = JSON.parse(line.slice(RESULT_PREFIX.length));
        if (message.result) results.push(message.result);
        if (message.stalled) stalled = message.stalled;
        if (message.error) failure = message.error;
        if (message.done) done = true;
        watch();
      }
    });
    child.stderr.on('data', chunk => { stderr += chunk; });
    child.on('error', error => { clearTimeout(timer); reject(error); });
    child.on('close', code => {
      clearTimeout(timer);
      if (failure) return reject(new Error(`${label}：${failure}`));
      if (!done && !stalled) return reject(new Error(`${label}的编译进程异常退出（${code}）：${stderr.slice(-2000)}`));
      resolve({ results, stalled });
    });
  });
}

test('all 140 lessons compile, run, and pass their own judge rules', {
  timeout: 1_800_000,
  skip: process.platform === 'win32' ? 'Wasmer Node worker has a Windows path issue; browser worker regression is the release test.' : false
}, async () => {
  assert.equal(lessons.length, 140, '七章必须共140题');
  assert.equal(lessonSolutions.length, lessons.length, '每道题都必须有自动化答案');

  const report = [];
  const stalls = new Map();
  let start = 0;
  while (start < lessons.length) {
    const end = Math.min(start + LESSONS_PER_PROCESS, lessons.length);
    const { results, stalled } = await runBatch(start, end);
    if (stalled) {
      const count = (stalls.get(stalled.index) ?? 0) + 1;
      stalls.set(stalled.index, count);
      assert.ok(count <= MAX_STALL_RETRIES, `${stalled.message}（已在新进程中重试 ${MAX_STALL_RETRIES} 次）`);
      console.log(`Wasmer 运行卡住，换新进程重试：${stalled.message}`);
    }
    assert.equal(results.length, (stalled ? stalled.index : end) - start, `第 ${start + 1}–${end} 题应全部返回结果`);

    for (const { index, id, compiled, execution } of results) {
      const lesson = lessons[index];
      const source = lessonSolutions[index];
      assert.equal(id, lesson.id);
      assert.equal(compiled.ok, true, `${lesson.id} ${lesson.title} 编译失败：${compiled.stderr}`);
      assert.equal(execution.ok, true, `${lesson.id} ${lesson.title} 运行失败：${execution.stderr}`);

      const judged = gradeLesson(lesson, source, {
        ok: execution.ok,
        stage: 'run',
        code: execution.code,
        output: execution.stdout,
        stdout: execution.stdout,
        stderr: execution.stderr,
        diagnostics: []
      });
      assert.equal(judged.passed, true, `${lesson.id} 判题失败：${judged.tests.filter(item => !item.passed).map(item => item.message).join('；')}`);
      report.push(`${lesson.id} PASS (${execution.stdout.length} bytes)`);
    }
    start = stalled ? stalled.index : end;
  }

  assert.equal(report.length, 140);
  console.log(`\n${report.join('\n')}\nALL 140 LESSONS PASS`);
});
