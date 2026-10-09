// Build-time only: Piper + the en_GB-cori-medium voice (trained on public-domain LibriVox recordings),
// then ffmpeg encodes compact mono MP3 files for offline playback.
// Example: PIPER=/path/piper PIPER_MODEL=/path/en_GB-cori-medium.onnx node scripts/generate-english-audio.mjs [--missing] [--ids a,b]
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { audio } from '../web/courses/english-nce/course.mjs';
const directory = path.resolve('web/public/audio/en');
mkdirSync(directory, { recursive: true });
if (!process.env.PIPER || !process.env.PIPER_MODEL) throw new Error('Set PIPER and PIPER_MODEL to the Piper executable and English model.');
const ffmpeg = process.env.FFMPEG || 'ffmpeg';
const args = process.argv.slice(2);
const onlyMissing = args.includes('--missing');
const idsIndex = args.indexOf('--ids');
const ids = idsIndex >= 0 ? new Set((args[idsIndex + 1] ?? '').split(',').filter(Boolean)) : null;
const items = audio.filter(item => (!ids || ids.has(item.id)) && (!onlyMissing || !existsSync(path.join(directory, item.id + '.mp3'))));
for (const [index, item] of items.entries()) {
  const wav = path.join(tmpdir(), `gray-crown-en-${item.id}.wav`), output = path.join(directory, item.id + '.mp3');
  const speech = spawnSync(process.env.PIPER, ['--model', process.env.PIPER_MODEL, '--length_scale', '1.12', '--sentence_silence', '0.35', '--output_file', wav], { input: item.text.replace(/\n/g, ' '), stdio: ['pipe', 'ignore', 'inherit'], timeout: 120000 });
  if (speech.status !== 0) throw new Error(`Piper failed for ${item.id}`);
  const encode = spawnSync(ffmpeg, ['-y', '-loglevel', 'error', '-i', wav, '-ac', '1', '-ar', '22050', '-b:a', '48k', output], { stdio: 'inherit', timeout: 60000 });
  rmSync(wav, { force: true });
  if (encode.status !== 0) throw new Error(`ffmpeg failed for ${item.id}`);
  console.log(`[${index + 1}/${items.length}] ${item.id}`);
}
console.log(`Synthesized ${items.length} clip(s).`);
