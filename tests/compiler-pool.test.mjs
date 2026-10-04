import test from 'node:test';
import assert from 'node:assert/strict';
import { CompilerService } from '../web/courses/c/compiler.mjs';

class FakeWorker {
  constructor() { this.messages = []; this.terminated = false; }
  postMessage(message) { this.messages.push(message); }
  terminate() { this.terminated = true; }
  emit(data) { this.onmessage?.({ data }); }
}

test('compiler prewarms a three-worker pool and rotates to standby workers', async () => {
  const workers = [];
  const service = new CompilerService(() => {}, () => {
    const worker = new FakeWorker();
    workers.push(worker);
    return worker;
  }, 0);
  assert.equal(workers.length, 3);
  assert.equal(workers[0].messages[0].type, 'warmup');
  assert.equal(workers[1].messages[0].type, 'warmup');
  assert.equal(workers[2].messages[0].type, 'warmup');

  workers[0].emit({ type: 'ready' });
  workers[1].emit({ type: 'ready' });
  workers[2].emit({ type: 'ready' });
  const first = service.compileAndRun('first');
  await Promise.resolve();
  const firstJob = workers[0].messages.find(message => message.type === 'compile-run');
  assert.ok(firstJob);
  workers[0].emit({ type: 'result', id: firstJob.id, result: { ok: true, stage: 'run', stderr: '', output: 'one' } });
  assert.equal((await first).output, 'one');
  assert.equal(workers[0].terminated, true);
  await new Promise(resolve => setTimeout(resolve, 0));
  assert.equal(workers.length, 4, '用过的worker应立即在后台补充');

  const second = service.compileAndRun('second');
  await Promise.resolve();
  const secondJob = workers[1].messages.find(message => message.type === 'compile-run');
  assert.ok(secondJob, '第二次编译应直接使用已经预热的备用worker');
  workers[1].emit({ type: 'result', id: secondJob.id, result: { ok: true, stage: 'run', stderr: '', output: 'two' } });
  assert.equal((await second).output, 'two');
});

test('leaving a course releases workers and rejects queued compilation', async () => {
  const workers = [];
  const service = new CompilerService(() => {}, () => {
    const worker = new FakeWorker(); workers.push(worker); return worker;
  }, 0);
  const pending = service.compileAndRun('waiting for warmup');
  const rejected = assert.rejects(pending, /已关闭/);
  service.dispose();
  await rejected;
  assert.ok(workers.every(worker => worker.terminated));
  workers[0].emit({ type: 'ready' });
  await assert.rejects(service.compileAndRun('after closing'), /已关闭/);
  assert.equal(workers.length, 3);
});

test('leaving immediately after acquiring a worker does not start another job', async () => {
  const workers = [];
  const service = new CompilerService(() => {}, () => {
    const worker = new FakeWorker(); workers.push(worker); return worker;
  }, 0);
  workers[0].emit({ type: 'ready' });
  const pending = service.compileAndRun('race');
  service.dispose();
  await assert.rejects(pending, /已关闭/);
  assert.ok(workers.every(worker => worker.messages.every(message => message.type !== 'compile-run')));
});
