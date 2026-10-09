// Build-time only: Piper and the CC-BY 4.0 fr_FR-siwis-medium model.
// Example: PIPER=/path/piper PIPER_MODEL=/path/fr_FR-siwis-medium.onnx node scripts/generate-french-audio.mjs
// Options: --missing      only synthesize clips whose WAV file does not exist yet
//          --ids a,b,c    only synthesize the listed clip IDs (e.g. after editing a transcript)
// Each clip is synthesized by a separate Piper process reading text on stdin, which works with both the
// original C++ piper binary and the newer `piper-tts` Python CLI.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { audio } from '../web/courses/french-a1/course.mjs';
const directory = path.resolve('web/public/audio/fr');
mkdirSync(directory, { recursive: true });
if (!process.env.PIPER || !process.env.PIPER_MODEL) throw new Error('Set PIPER and PIPER_MODEL to the Piper executable and French model.');
const args = process.argv.slice(2);
const onlyMissing = args.includes('--missing');
const idsIndex = args.indexOf('--ids');
const ids = idsIndex >= 0 ? new Set((args[idsIndex + 1] ?? '').split(',').filter(Boolean)) : null;
const items = audio.filter(item => (!ids || ids.has(item.id)) && (!onlyMissing || !existsSync(path.join(directory, item.id + '.wav'))));
for (const [index, item] of items.entries()) {
  const output = path.join(directory, item.id + '.wav');
  const result = spawnSync(process.env.PIPER, ['--model', process.env.PIPER_MODEL, '--length_scale', '1.15', '--sentence_silence', '0.35', '--output_file', output], { input: item.text, stdio: ['pipe', 'ignore', 'inherit'] });
  if (result.status !== 0) throw new Error(`Piper failed for ${item.id}`);
  console.log(`[${index + 1}/${items.length}] ${item.id}`);
}
console.log(`Synthesized ${items.length} clip(s).`);
