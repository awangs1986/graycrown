import React from 'react';
import { AbsoluteFill, useCurrentFrame, staticFile, delayRender, continueRender, Easing, interpolate } from 'remotion';
import { CrayonDefs, Paper, crayonize, BOIL } from './crayon.jsx';
import { C, T, lerp } from './kit.jsx';
import { INTRO, STEP, durationFor, stepStart } from './timing.mjs';
import * as V1 from './visuals1.jsx';
import * as V2 from './visuals2.jsx';
import * as V3 from './visuals3.jsx';
export const visuals = { ...V1, ...V2, ...V3 };

// Bundled Noto Sans SC subsets (OFL) so Chinese renders identically on any machine; rendering waits until they load.
const handle = delayRender('fonts');
Promise.all([['Regular', '400'], ['Bold', '700']].map(([n, w]) => new FontFace('NotoSansSC', `url(${staticFile(`NotoSansSC-${n}-subset.woff2`)})`, { weight: w }).load().then(face => document.fonts.add(face))).concat(new FontFace('KuaiLe', `url(${staticFile('ZCOOLKuaiLe-subset.woff2')})`).load().then(face => document.fonts.add(face))))
  .then(() => continueRender(handle)).catch(err => { console.error(err); continueRender(handle); });
const font = '';
const wrap = (s, n) => { const out = []; for (let i = 0; i < s.length; i += n) out.push(s.slice(i, i + n)); return out; };
export const Example = ({ lesson, visual }) => {
  const f = useCurrentFrame(), steps = lesson.captions, total = durationFor(steps.length);
  const step = f < INTRO ? -1 : Math.min(steps.length - 1, Math.floor((f - INTRO) / STEP));
  const at = i => interpolate(f, [stepStart(i), stepStart(i) + STEP * 0.6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });
  const boil = Math.floor(f / BOIL);
  const Visual = visuals[visual];
  const cap = step < 0 ? '先读题，想一想……' : `第 ${step + 1} 步：${steps[step]}`;
  const prog = Math.min(1, f / total);
  const deco = crayonize(<g>
    <path d="M40 72 Q 300 64 560 74 T 1000 70" stroke={C.orange} strokeWidth={5} fill="none" />
    <rect x={28} y={608} width={1224} height={86} rx={22} fill="#fffdf5" stroke={C.ink} strokeWidth={4} />
    <g transform={`rotate(${(boil % 3) * 4} 1205 62)`}><circle cx={1205} cy={62} r={26} fill={C.yellow} stroke={C.orange} strokeWidth={3} />{[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i * Math.PI / 4; return <line key={i} x1={1205 + 34 * Math.cos(a)} y1={62 + 34 * Math.sin(a)} x2={1205 + 46 * Math.cos(a)} y2={62 + 46 * Math.sin(a)} stroke={C.orange} strokeWidth={4} />; })}</g>
    <path d="M1080 60 q 10 -22 30 -10 q 14 -20 34 -2 q 22 0 14 18 z" fill="#ffffff" stroke={C.blue} strokeWidth={3} />
    <line x1={50} y1={705} x2={50 + 1180 * prog} y2={705} stroke={C.teal} strokeWidth={7} />
  </g>, 0, 'deco');
  return <AbsoluteFill style={{ background: C.paper }}>
    <svg width={1280} height={720} viewBox="0 0 1280 720"><CrayonDefs boil={boil} /><Paper />
      <g filter="url(#waxStatic)">{deco}</g><g filter="url(#wax)"><g transform="translate(0 170)">{crayonize(<Visual f={f} step={step} at={at} all={f / total} />, boil, 'v')}</g></g>
      <T x={40} y={52} a="start" s={26} c={C.orange}>{lesson.method} · {lesson.title}</T>
      {wrap(lesson.problem, 38).slice(0, 2).map((line, i) => <T key={i} x={40} y={108 + i * 40} a="start" s={30}>{line}</T>)}
      <T x={640} y={662} s={step < 0 ? 32 : (cap.length > 34 ? 28 : 32)} c={C.ink}>{cap}</T>
    </svg></AbsoluteFill>;
};
