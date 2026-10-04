import { Directory, Wasmer, init } from '@wasmer/sdk';

let clangPromise;

async function loadClang() {
  if (!clangPromise) {
    clangPromise = (async () => {
      await init();
      const response = await fetch('/compiler/clang-0.160000.1.webc');
      if (!response.ok) throw new Error(`无法读取离线 Clang 包（HTTP ${response.status}）`);
      return Wasmer.fromFile(new Uint8Array(await response.arrayBuffer()));
    })();
  }
  return clangPromise;
}

async function prewarmClang(clang) {
  const project = new Directory();
  await project.writeFile('warmup.c', '#include <stdio.h>\nint main(void){return 0;}\n');
  const process = await clang.entrypoint.run({
    args: ['/project/warmup.c', '-std=c11', '-O0', '-o', '/project/warmup.wasm'],
    mount: { '/project': project },
    cwd: '/project'
  });
  const result = await process.wait();
  if (!result.ok) throw new Error(`Clang预热失败：${result.stderr}`);
  const warmupWasm = await project.readFile('warmup.wasm');
  const warmupProgram = Wasmer.fromWasm(warmupWasm);
  const execution = await (await warmupProgram.entrypoint.run()).wait();
  if (!execution.ok) throw new Error(`WASM运行预热失败：${execution.stderr}`);
}

function post(type, detail = {}) {
  self.postMessage({ type, ...detail });
}

self.onmessage = async event => {
  const { type, id, source, stdin = '' } = event.data ?? {};
  if (type === 'warmup') {
    try {
      const clang = await loadClang();
      await prewarmClang(clang);
      post('ready');
    } catch (error) {
      post('fatal', { message: error instanceof Error ? error.message : String(error) });
    }
    return;
  }
  if (type === 'compile-batch') {
    try {
      post('phase', { id, phase: 'loading' });
      const clang = await loadClang();
      const project = new Directory();
      const paths = [];
      for (const [index, item] of (event.data.sources ?? []).entries()) {
        const filename = `${String(index + 1).padStart(3, '0')}-${item.id}.c`;
        await project.writeFile(filename, item.source);
        paths.push(`/project/${filename}`);
      }
      post('phase', { id, phase: 'batch-compiling' });
      const process = await clang.entrypoint.run({
        args: ['-std=c11', '-O0', '-Wall', '-Wextra', '-Wpedantic', '-fsyntax-only', ...paths],
        mount: { '/project': project },
        cwd: '/project'
      });
      const compiled = await process.wait();
      post('result', { id, result: { ok: compiled.ok, stage: 'compile', code: compiled.code, output: '', stdout: compiled.stdout, stderr: compiled.stderr } });
    } catch (error) {
      post('result', { id, result: { ok: false, stage: 'internal', code: -1, output: '', stdout: '', stderr: error instanceof Error ? error.message : String(error) } });
    }
    return;
  }
  if (type !== 'compile-run') return;

  try {
    post('phase', { id, phase: 'loading' });
    const clang = await loadClang();
    const project = new Directory();
    await project.writeFile('main.c', source);
    post('phase', { id, phase: 'compiling' });
    const compiler = await clang.entrypoint.run({
      args: ['/project/main.c', '-std=c11', '-O0', '-Wall', '-Wextra', '-Wpedantic', '-o', '/project/program.wasm'],
      mount: { '/project': project },
      cwd: '/project'
    });
    const compiled = await compiler.wait();
    if (!compiled.ok) {
      post('result', { id, result: { ok: false, stage: 'compile', code: compiled.code, output: '', stdout: compiled.stdout, stderr: compiled.stderr } });
      return;
    }
    post('phase', { id, phase: 'running' });
    const wasm = await project.readFile('program.wasm');
    const program = Wasmer.fromWasm(wasm);
    const instance = await program.entrypoint.run({ stdin });
    const executed = await instance.wait();
    post('result', {
      id,
      result: {
        ok: executed.ok,
        stage: 'run',
        code: executed.code,
        output: executed.stdout,
        stdout: executed.stdout,
        stderr: executed.stderr
      }
    });
  } catch (error) {
    post('result', { id, result: { ok: false, stage: 'internal', code: -1, output: '', stdout: '', stderr: error instanceof Error ? error.message : String(error) } });
  }
};
