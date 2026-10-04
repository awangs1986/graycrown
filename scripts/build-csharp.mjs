import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('..', import.meta.url));
const output = path.join(root, 'runtime/csharp/bin/publish');
const result = spawnSync(process.env.GRAY_CROWN_DOTNET || 'dotnet', ['publish', path.join(root, 'runtime/csharp/CourseRunner.csproj'), '-c', 'Release', '-o', output, '--nologo'], { stdio: 'inherit' });
if (result.error || result.status !== 0) {
  console.error('C# build requires .NET 9 SDK and the wasm-tools workload. Run: dotnet workload install wasm-tools');
  process.exit(1);
}
mkdirSync(path.join(root, 'web/public/csharp'), { recursive: true });
cpSync(path.join(output, 'wwwroot/_framework'), path.join(root, 'web/public/csharp/_framework'), { recursive: true });

const directory = path.join(root, 'web/public/csharp/_framework');
const assemblies = ['CourseRunner', 'System.Private.CoreLib', 'System.Runtime', 'System.Console', 'System.Collections', 'System.Linq', 'System.Linq.Expressions', 'System.Runtime.Extensions', 'System.ObjectModel', 'System.Collections.NonGeneric', 'netstandard'];
const manifest = JSON.parse(readFileSync(path.join(directory, 'blazor.boot.json'), 'utf8'));
const files = Object.entries(manifest.resources.fingerprinting);
const references = assemblies.map(name => {
  const file = files.find(([, original]) => original === name + '.dll')?.[0];
  if (!file) throw new Error('Missing compilation reference: ' + name);
  return file;
});
writeFileSync(path.join(root, 'web/public/csharp/references.json'), JSON.stringify(references));
