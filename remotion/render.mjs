// Pre-renders every composition to WebM (VP9, 720p) + JPEG poster + WebVTT captions into web/public/video/olympiad/.
// Usage: node render.mjs [id ...]   (no ids = all). Each render has a hard timeout so a hung browser cannot stall the run.
import path from 'node:path';
import { mkdir, writeFile, stat } from 'node:fs/promises';
import { bundle } from '@remotion/bundler';
import { selectComposition, renderMedia, renderStill } from '@remotion/renderer';
import { videos } from '../web/courses/olympiad/course.mjs';
import { FPS, INTRO, STEP, durationFor, stepStart } from './src/timing.mjs';
const out = path.resolve('../web/public/video/olympiad'); await mkdir(out, { recursive: true });
const browserExecutable = process.env.REMOTION_CHROME || undefined;
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.jsx') });
const ts = f => { const s = f / FPS; const h = String(Math.floor(s / 3600)).padStart(2, '0'), m = String(Math.floor(s / 60) % 60).padStart(2, '0'); return `${h}:${m}:${(s % 60).toFixed(3).padStart(6, '0')}`; };
export const vtt = v => 'WEBVTT\n\n' + [`${ts(0)} --> ${ts(INTRO)}\n先读题：${v.problem}`, ...v.captions.map((c, i) => `${ts(stepStart(i))} --> ${ts(i === v.captions.length - 1 ? durationFor(v.captions.length) : stepStart(i + 1))}\n第 ${i + 1} 步：${c}`)].join('\n\n') + '\n';
const ids = process.argv.slice(2); const list = ids.length ? videos.filter(v => ids.includes(v.id)) : videos;
for (const v of list) {
  const t0 = Date.now();
  const composition = await selectComposition({ serveUrl, id: v.id, browserExecutable });
  await renderMedia({ composition, serveUrl, codec: 'vp9', crf: +(process.env.CRF || 46), outputLocation: path.join(out, `${v.id}.webm`), browserExecutable, concurrency: +(process.env.CONC || 4), timeoutInMilliseconds: +(process.env.RTIMEOUT || 120000), imageFormat: 'jpeg', jpegQuality: 85 });
  await renderStill({ composition, serveUrl, frame: composition.durationInFrames - 20, output: path.join(out, `${v.id}.jpg`), imageFormat: 'jpeg', jpegQuality: 72, browserExecutable });
  await writeFile(path.join(out, `${v.id}.vtt`), vtt(v));
  console.log(v.id, `${((await stat(path.join(out, `${v.id}.webm`))).size / 1024).toFixed(0)} KB`, `${((Date.now() - t0) / 1000).toFixed(0)} s`);
}
