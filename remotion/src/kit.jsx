import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
export const C = { ink: '#2a2433', muted: '#6b6475', paper: '#fffaf0', line: '#eadfcb', orange: '#e8730c', orangeSoft: '#ffe3c4', teal: '#0f8a7e', tealSoft: '#cdeee9', red: '#c2412d', purple: '#6b4fd8', yellow: '#f7c948', blue: '#2f6fd6' };
export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' };
export const lerp = (v, a, b, x = 0, y = 1) => interpolate(v, [a, b], [x, y], clamp);
// ctx: { f: frame, step: current step (-1 = intro), at(i): 0..1 progress inside step i (1 after it), all: 0..1 }
export const T = ({ x, y, s = 30, c = C.ink, w = 700, a = 'middle', o = 1, children }) => <text x={x} y={y} fontSize={s} fill={c} fontWeight={w} textAnchor={a} opacity={o} fontFamily="NotoSansSC">{children}</text>;
export const Box = ({ x, y, w = 80, h = 80, fill = '#fff', stroke = C.ink, r = 12, o = 1, label, s = 34, lc = C.ink }) => <g opacity={o}><rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={stroke} strokeWidth={4} />{label != null && <T x={x + w / 2} y={y + h / 2 + s * 0.36} s={s} c={lc}>{label}</T>}</g>;
export const Arrow = ({ x1, y1, x2, y2, c = C.orange, o = 1, w = 5 }) => { const a = Math.atan2(y2 - y1, x2 - x1), L = 16; return <g opacity={o} stroke={c} strokeWidth={w} strokeLinecap="round" fill="none"><line x1={x1} y1={y1} x2={x2} y2={y2} /><polyline points={`${x2 - L * Math.cos(a - .45)},${y2 - L * Math.sin(a - .45)} ${x2},${y2} ${x2 - L * Math.cos(a + .45)},${y2 - L * Math.sin(a + .45)}`} /></g>; };
export const Pop = ({ p, x, y, children }) => { const k = lerp(p, 0, 1); return <g transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * k}) translate(${-x} ${-y})`} opacity={k}>{children}</g>; };
export const useSpring = (f, delay) => { const { fps } = useVideoConfig(); return spring({ frame: f - delay, fps, config: { damping: 14 } }); };
