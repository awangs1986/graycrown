import { spawnSync } from 'node:child_process';
import { readFileSync, cpSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('..', import.meta.url));
const compiler = process.env.GRAY_CROWN_CLANG || path.join(root, 'web/public/compiler/clang-0.160000.1.webc');
const bytes = readFileSync(compiler);
if (bytes.length < 1_000_000 || bytes.subarray(0, 80).toString().includes('git-lfs.github.com')) {
  throw new Error('Missing full Clang asset. Run git lfs pull, or set GRAY_CROWN_CLANG to the downloaded .webc file.');
}
for (const args of [
  ['scripts/build-csharp.mjs'],
  ['node_modules/vite/bin/vite.js', 'build', '--mode', 'public', '--outDir', '../dist/public-site']
]) {
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
const output = path.join(root, 'dist/public-site');
cpSync(compiler, path.join(output, 'compiler/clang-0.160000.1.webc'));
for (const name of ['LICENSE', 'THIRD_PARTY_NOTICES.txt']) cpSync(path.join(root, name), path.join(output, name));
