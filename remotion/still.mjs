import path from 'node:path';
import { bundle } from '@remotion/bundler';
import { selectComposition, renderStill } from '@remotion/renderer';
const [id, ...frames] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.jsx') });
const composition = await selectComposition({ serveUrl, id });
for (const fr of frames) { await renderStill({ composition, serveUrl, frame: +fr, output: `/workspace/graycrown/shots/crayon-${id}-${fr}.png` }); console.log(fr); }
