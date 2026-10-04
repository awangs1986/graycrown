// Build-time only: Piper and the CC-BY 4.0 fr_FR-siwis-medium model.
// Example: PIPER=/path/piper PIPER_MODEL=/path/fr_FR-siwis-medium.onnx node scripts/generate-french-audio.mjs
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { audio } from '../web/courses/french-a1/course.mjs';
const directory = path.resolve('web/public/audio/fr');
mkdirSync(directory, { recursive: true });
if (!process.env.PIPER || !process.env.PIPER_MODEL) throw new Error('Set PIPER and PIPER_MODEL to the Piper executable and French model.');
const child = spawn(process.env.PIPER, ['--model', process.env.PIPER_MODEL, '--json-input', '--length_scale', '1.15', '--sentence_silence', '0.35'], { stdio: ['pipe', 'inherit', 'inherit'] });
for (const item of audio) child.stdin.write(JSON.stringify({ text: item.text, output_file: path.join(directory, item.id + '.wav') }) + '\n');
child.stdin.end();
child.on('exit', code => process.exit(code ?? 1));
