import React from 'react';
import { interpolate, spring, useVideoConfig } from 'remotion';
// Crayon box palette: soft, saturated, kid-friendly; ink is a dark plum crayon instead of black.
export const C = { ink: '#3d3150', muted: '#857a90', paper: '#fbf0d9', line: '#cdb68e', orange: '#f57f2a', orangeSoft: '#ffcf9e', teal: '#1fa898', tealSoft: '#b4ece2', red: '#e8504f', purple: '#8462e0', yellow: '#ffcd2e', blue: '#3f8ee0' };
export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' };
export const lerp = (v, a, b, x = 0, y = 1) => interpolate(v, [a, b], [x, y], clamp);
// ctx: { f: frame, step: current step (-1 = intro), at(i): 0..1 progress inside step i (1 after it), all: 0..1 }
// Hand-written text (ZCOOL KuaiLe, OFL; Noto Sans SC fallback for symbols). Opacity 0→1 is shown as being written left→right.
const DARK = { [C.orange]: '#d65a0c', [C.red]: '#cc3434', [C.teal]: '#0f8577', [C.purple]: '#6a46cc', [C.blue]: '#2a6fc0', [C.muted]: '#6f6479', [C.yellow]: '#c99a00' };
export const T = ({ x, y, s = 30, c: c0 = C.ink, w = 700, a = 'middle', o = 1, children }) => { const c = DARK[c0] || c0; const k = Math.max(0, Math.min(1, o)); if (k <= 0.001) return null;
  return <text x={x} y={y} fontSize={s * 1.08} fill={c} textAnchor={a} fontFamily="KuaiLe, NotoSansSC" filter="url(#waxText)" stroke={c} strokeWidth={s > 32 ? 1.1 : 0.8} paintOrder="stroke"
    style={k < 1 ? { clipPath: `inset(-20% ${((1 - k) * 100).toFixed(1)}% -20% -5%)` } : undefined}>{children}</text>; };
export const Box = ({ x, y, w = 80, h = 80, fill = '#fff', stroke = C.ink, r = 12, o = 1, label, s = 34, lc = C.ink }) => <g opacity={o}><rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={stroke} strokeWidth={4} />{label != null && <T x={x + w / 2} y={y + h / 2 + s * 0.36} s={s} c={lc}>{label}</T>}</g>;
export const Arrow = ({ x1, y1, x2, y2, c = C.orange, o = 1, w = 5 }) => { const a = Math.atan2(y2 - y1, x2 - x1), L = 16; return <g opacity={o} stroke={c} strokeWidth={w} strokeLinecap="round" fill="none"><line x1={x1} y1={y1} x2={x2} y2={y2} /><polyline points={`${x2 - L * Math.cos(a - .45)},${y2 - L * Math.sin(a - .45)} ${x2},${y2} ${x2 - L * Math.cos(a + .45)},${y2 - L * Math.sin(a + .45)}`} /></g>; };
export const Pop = ({ p, x, y, children }) => { const k = lerp(p, 0, 1); return <g transform={`translate(${x} ${y}) scale(${0.6 + 0.4 * k}) translate(${-x} ${-y})`} opacity={k}>{children}</g>; };
export const useSpring = (f, delay) => { const { fps } = useVideoConfig(); return spring({ frame: f - delay, fps, config: { damping: 14 } }); };
