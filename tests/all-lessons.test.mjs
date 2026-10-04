import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Directory, Wasmer, init } from '@wasmer/sdk/node';
import { lessons } from '../web/courses/c/course.mjs';
import { gradeLesson } from '../web/courses/c/judge.mjs';
import { lessonSolutions } from './lesson-solutions.mjs';

test('all 140 lessons compile, run, and pass their own judge rules', {
  timeout: 900_000,
  skip: process.platform === 'win32' ? 'Wasmer Node worker has a Windows path issue; browser worker regression is the release test.' : false
}, async () => {
  assert.equal(lessons.length, 140, '七章必须共140题');
  assert.equal(lessonSolutions.length, lessons.length, '每道题都必须有自动化答案');

  const testDir = dirname(fileURLToPath(import.meta.url));
  const packagePath = process.env.GRAY_CROWN_CLANG ?? join(testDir, '..', 'web', 'public', 'compiler', 'clang-0.160000.1.webc');
  const sdkRoot = join(testDir, '..', 'node_modules', '@wasmer', 'sdk', 'dist');
  await init({
    module: new Uint8Array(await readFile(join(sdkRoot, 'wasmer_js_bg.wasm'))),
    workerUrl: join(sdkRoot, 'worker.mjs'),
    sdkUrl: join(sdkRoot, 'node.mjs')
  });
  const clang = await Wasmer.fromFile(new Uint8Array(await readFile(packagePath)));
  const report = [];

  for (const [index, lesson] of lessons.entries()) {
    const source = lessonSolutions[index];
    const project = new Directory();
    await project.writeFile('main.c', source);
    const compiler = await clang.entrypoint.run({
      args: ['/project/main.c', '-std=c11', '-O0', '-Wall', '-Wextra', '-Wpedantic', '-o', '/project/program.wasm'],
      mount: { '/project': project },
      cwd: '/project'
    });
    const compiled = await compiler.wait();
    assert.equal(compiled.ok, true, `${lesson.id} ${lesson.title} 编译失败：${compiled.stderr}`);

    const programWasm = await project.readFile('program.wasm');
    const program = Wasmer.fromWasm(programWasm);
    const execution = await (await program.entrypoint.run({ stdin: lesson.defaultInput ?? '' })).wait();
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

  console.log(`\n${report.join('\n')}\nALL 140 LESSONS PASS`);
});
