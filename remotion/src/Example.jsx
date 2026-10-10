import React from 'react';
import { AbsoluteFill, useCurrentFrame, staticFile, delayRender, continueRender } from 'remotion';
import { C, T, lerp } from './kit.jsx';
import { INTRO, STEP, durationFor, stepStart } from './timing.mjs';
import * as V1 from './visuals1.jsx';
import * as V2 from './visuals2.jsx';
import * as V3 from './visuals3.jsx';
export const visuals = { ...V1, ...V2, ...V3 };

// Bundled Noto Sans SC subsets (OFL) so Chinese renders identically on any machine; rendering waits until they load.
const handle = delayRender('fonts');
Promise.all([['Regular', '400'], ['Bold', '700']].map(([n, w]) => new FontFace('NotoSansSC', `url(${staticFile(`NotoSansSC-${n}-subset.woff2`)})`, { weight: w }).load().then(face => document.fonts.add(face))))
  .then(() => continueRender(handle)).catch(err => { console.error(err); continueRender(handle); });
const font = '';
const wrap = (s, n) => { const out = []; for (let i = 0; i < s.length; i += n) out.push(s.slice(i, i + n)); return out; };
export const Example = ({ lesson, visual }) => {
  const f = useCurrentFrame(), steps = lesson.captions, total = durationFor(steps.length);
  const step = f < INTRO ? -1 : Math.min(steps.length - 1, Math.floor((f - INTRO) / STEP));
  const at = i => lerp(f, stepStart(i), stepStart(i) + STEP * 0.6);
  const Visual = visuals[visual];
  const cap = step < 0 ? '先读题，想一想……' : `第 ${step + 1} 步：${steps[step]}`;
  return <AbsoluteFill style={{ background: C.paper }}><style>{font}</style>
    <svg width={1280} height={720} viewBox="0 0 1280 720">
      <rect x={0} y={0} width={1280} height={10} fill={C.orange} />
      <T x={40} y={56} a="start" s={26} c={C.orange}>{lesson.method} · {lesson.title}</T>
      {wrap(lesson.problem, 38).slice(0, 2).map((line, i) => <T key={i} x={40} y={100 + i * 38} a="start" s={30} w={700}>{line}</T>)}
      <g transform="translate(0 170)"><Visual f={f} step={step} at={at} all={f / total} /></g>
      <rect x={30} y={620} width={1220} height={78} rx={18} fill={C.ink} opacity={0.92} />
      <T x={640} y={670} s={step < 0 ? 30 : (cap.length > 34 ? 26 : 30)} c="#fff" w={600}>{cap}</T>
      <rect x={30} y={704} width={1220 * Math.min(1, f / total)} height={6} rx={3} fill={C.teal} />
    </svg></AbsoluteFill>;
};
