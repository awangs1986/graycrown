// Child process for tests/all-lessons.test.mjs: compiles and runs a small
// batch of C lessons with a fresh Wasmer runtime and prints each raw result as
// one JSON line as soon as it is ready. Judging and assertions stay in the
// parent test.
//
// Why a separate process: @wasmer/sdk 0.10 does not release a finished clang
// instance inside a long-lived runtime (RSS grows ~100 MB per compile, and
// neither Instance.free(), Directory.free() nor a forced GC reclaims it). The
// 11th compile on the same runtime never finishes. The web app never hits this
// because CompilerService terminates each compiler worker after one job and
// swaps in a fresh one, so the test mirrors that by starting a new runtime for
// every few lessons.
//
// Separately, a clang run on a fresh runtime occasionally never finishes (the
// process sits at 100% CPU with no output; seen in about 1 of 10 five-lesson
// batches on Node 20 and 22 alike). That is a scheduler deadlock inside
// @wasmer/sdk, not a lesson problem, so a stuck run is reported back as
// `stalled` and the parent retries that lesson in a new process. Compile
// errors, runtime errors and wrong output are never retried. The deadlock can
// also block this process's main thread so that its own timer never fires;
// the parent therefore also watches for progress and kills a silent child.
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Directory, Wasmer, init } from '@wasmer/sdk/node';
import { lessons } from '../web/courses/c/course.mjs';
import { lessonSolutions } from './lesson-solutions.mjs';

const RESULT_PREFIX = '@@LESSON_BATCH_RESULT@@';
// A lesson compiles in about one second; 30 s is far beyond any real run.
const PROCESS_TIMEOUT_MS = 30_000;

class StalledError extends Error {}

// Node < 21 has no global `navigator`. Wasmer's worker threads read
// navigator.hardwareConcurrency to answer WASIX's thread_parallelism call, and
// without it wasm-ld's thread pool cannot start: the clang driver reports
// "linker command failed with exit code 45". Browsers and Node >= 21 have
// navigator, so there we keep exactly the flags of compiler.worker.mjs. On
// older Node, link single-threaded; the linked program is identical.
const NODE_LINK_FLAGS = typeof globalThis.navigator === 'undefined' ? ['-Wl,--threads=1'] : [];

// Wait for a Wasmer instance with a ref'd timer running.
// @wasmer/sdk 0.10 delivers the exit status to the main thread via
// Atomics.waitAsync, which does not keep Node's event loop alive. Once the
// worker threads are gone, a bare `await instance.wait()` leaves nothing
// pending and Node would exit early. The timer keeps the loop alive and turns
// a genuinely stuck process into a clear failure.
async function finish(instance, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new StalledError(`${label} 超过 ${PROCESS_TIMEOUT_MS / 1000} 秒仍未结束`)), PROCESS_TIMEOUT_MS);
  });
  try {
    return await Promise.race([instance.wait(), timeout]);
  } finally {
    clearTimeout(timer);
  }
}

function pick({ ok, code, stdout, stderr }) {
  return { ok, code, stdout, stderr };
}

async function main(start, end, results) {
  const testDir = dirname(fileURLToPath(import.meta.url));
  const packagePath = process.env.GRAY_CROWN_CLANG ?? join(testDir, '..', 'web', 'public', 'compiler', 'clang-0.160000.1.webc');
  const sdkRoot = join(testDir, '..', 'node_modules', '@wasmer', 'sdk', 'dist');
  await init({
    module: new Uint8Array(await readFile(join(sdkRoot, 'wasmer_js_bg.wasm'))),
    workerUrl: join(sdkRoot, 'worker.mjs'),
    sdkUrl: join(sdkRoot, 'node.mjs')
  });
  const clang = await Wasmer.fromFile(new Uint8Array(await readFile(packagePath)));
  for (let index = start; index < end; index++) {
    const lesson = lessons[index];
    const project = new Directory();
    await project.writeFile('main.c', lessonSolutions[index]);
    const compiler = await clang.entrypoint.run({
      args: ['/project/main.c', '-std=c11', '-O0', '-Wall', '-Wextra', '-Wpedantic', ...NODE_LINK_FLAGS, '-o', '/project/program.wasm'],
      // Without `stdin`, Wasmer opens an interactive stdin pipe whose JS handle
      // keeps the process from finishing until V8 happens to garbage-collect it
      // (about 8 s the first time, and sometimes never). clang reads no input.
      stdin: '',
      mount: { '/project': project },
      cwd: '/project'
    });
    const compiled = pick(await finish(compiler, `${lesson.id} 编译`));
    let execution = null;
    if (compiled.ok) {
      const program = Wasmer.fromWasm(await project.readFile('program.wasm'));
      execution = pick(await finish(await program.entrypoint.run({ stdin: lesson.defaultInput ?? '' }), `${lesson.id} 运行`));
    }
    const result = { index, id: lesson.id, compiled, execution };
    results.push(result);
    emit({ result });
  }
}

function emit(message) {
  process.stdout.write(`\n${RESULT_PREFIX}${JSON.stringify(message)}\n`);
}

const [start, end] = process.argv.slice(2).map(Number);
const results = [];
// Always exit explicitly: Wasmer worker threads would otherwise keep a stuck
// runtime alive.
try {
  await main(start, end, results);
  emit({ done: true });
  process.exit(0);
} catch (error) {
  const stalled = error instanceof StalledError ? { index: start + results.length, message: error.message } : undefined;
  emit(stalled ? { stalled } : { error: String(error?.stack ?? error) });
  process.exit(1);
}
