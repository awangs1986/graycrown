// 初中代数与几何 visuals (om13–om14). Canvas 1280×430.
import React from 'react';
import { C, T, lerp } from './kit.jsx';

export const completeSquare = ({ at }) => { const u = 40, x = 6 * u, b = 3 * u, ox = 380, oy = 40; const k = lerp(at(0), 0, 1); return <g>
  <rect x={ox} y={oy} width={x} height={x} fill={C.tealSoft} stroke={C.teal} strokeWidth={4} /><T x={ox + x / 2} y={oy + x / 2 + 12} s={36}>x²</T>
  <g transform={`translate(${(1 - k) * 260} 0)`}><rect x={ox + x} y={oy} width={b} height={x} fill={C.orangeSoft} stroke={C.orange} strokeWidth={4} /><T x={ox + x + b / 2} y={oy + x / 2 + 12} s={30}>3x</T></g>
  <g transform={`translate(0 ${(1 - k) * 120})`} opacity={k > 0 ? 1 : .6}><rect x={ox} y={oy + x} width={x} height={b} fill={C.orangeSoft} stroke={C.orange} strokeWidth={4} /><T x={ox + x / 2} y={oy + x + b / 2 + 12} s={30}>3x</T></g>
  <rect x={ox + x} y={oy + x} width={b} height={b} fill={C.yellow} stroke={C.ink} strokeWidth={4} strokeDasharray={at(1) > .5 ? 'none' : '10 8'} opacity={at(1)} /><T x={ox + x + b / 2} y={oy + x + b / 2 + 12} s={30} o={at(1)}>9</T>
  <T x={1040} y={120} s={32} o={at(1)}>x² + 6x + 9</T><T x={1040} y={170} s={32} c={C.teal} o={at(1)}>= (x + 3)²</T>
  <T x={1040} y={260} s={32} o={at(2)}>原式 = (x+3)² + 1</T><T x={1040} y={330} s={34} c={C.orange} o={at(3)}>最小值 1</T></g>; };

export const diffSquares = ({ at }) => { const s = 300, t = 60, ox = 200, oy = 50; const k = lerp(at(1), 0, 1); return <g>
  <rect x={ox} y={oy} width={s} height={s} fill={C.tealSoft} stroke={C.teal} strokeWidth={4} /><rect x={ox + s - t} y={oy + s - t} width={t} height={t} fill="#fff" stroke={C.red} strokeWidth={4} strokeDasharray="8 6" opacity={at(0)} />
  <T x={ox + s / 2} y={oy - 12} s={26}>100</T><T x={ox + s - t / 2} y={oy + s + 34} s={24} c={C.red} o={at(0)}>1</T>
  <g opacity={at(1)}><rect x={620} y={160} width={s + t} height={s - t} fill={C.orangeSoft} stroke={C.orange} strokeWidth={4} transform={`translate(${(1 - k) * -100} 0)`} />
    <T x={620 + (s + t) / 2} y={150} s={26}>100 + 1</T><T x={620 + s + t + 20} y={300} s={26} a="start">100 − 1</T></g>
  <T x={640} y={60} s={34} c={C.orange} o={at(1)}>(100+1)(100−1) = 100² − 1²</T>
  <T x={800} y={420} s={40} c={C.teal} o={at(2)}>10000 − 1 = 9999</T></g>; };

export const angleSum = ({ at }) => { const A = [640, 70], B = [380, 360], Cc = [960, 360]; return <g>
  <polygon points={`${A} ${B} ${Cc}`} fill={C.tealSoft} stroke={C.ink} strokeWidth={5} />
  <line x1={260} y1={70} x2={1020} y2={70} stroke={C.purple} strokeWidth={5} strokeDasharray={1000} strokeDashoffset={1000 * (1 - at(0))} />
  <path d="M410 360 A 30 30 0 0 0 400 335" fill="none" stroke={C.orange} strokeWidth={8} /><path d="M930 360 A 30 30 0 0 1 940 335" fill="none" stroke={C.blue} strokeWidth={8} />
  <path d="M600 70 A 40 40 0 0 0 615 100" fill="none" stroke={C.orange} strokeWidth={8} opacity={at(1)} /><path d="M680 70 A 40 40 0 0 1 665 100" fill="none" stroke={C.blue} strokeWidth={8} opacity={at(1)} />
  <path d="M622 104 A 36 36 0 0 0 658 104" fill="none" stroke={C.red} strokeWidth={8} />
  <T x={640} y={50} s={28}>A</T><T x={350} y={390} s={28}>B</T><T x={990} y={390} s={28}>C</T>
  <T x={1110} y={140} s={28} c={C.purple} o={at(0)}>平行于 BC</T>
  <T x={640} y={300} s={30} o={at(2)}>三个角拼成一条直线</T><T x={640} y={425} s={38} c={C.teal} o={at(3)}>∠A + ∠B + ∠C = 180°</T></g>; };

// Hanoi: 7 moves for 3 disks, spread over steps 0–2; step 3 shows the count.
const MOVES = [[0, 2], [0, 1], [2, 1], [0, 2], [1, 0], [1, 2], [0, 2]];
export const hanoi = ({ at }) => { const p = at(0) < 1 ? at(0) * 3 / 7 : at(1) < 1 ? (3 + at(1)) / 7 : (4 + at(2) * 3) / 7; const done = Math.floor(p * 7 + 1e-6);
  const pegs = [[3, 2, 1], [], []]; for (let i = 0; i < done; i++) { const [a, b] = MOVES[i]; pegs[b].push(pegs[a].pop()); }
  const px = [320, 640, 960], cols = { 1: C.orange, 2: C.teal, 3: C.purple }; return <g>
  <rect x={160} y={340} width={960} height={16} rx={6} fill="#8a5a2b" />{px.map(x => <rect key={x} x={x - 7} y={110} width={14} height={232} fill="#8a5a2b" />)}
  {pegs.flatMap((stack, i) => stack.map((d, h) => <rect key={d} x={px[i] - 40 - d * 30} y={300 - h * 46} width={80 + d * 60} height={38} rx={12} fill={cols[d]} stroke={C.ink} strokeWidth={3} />))}
  <T x={640} y={60} s={34}>已移动 {done} 步</T><T x={640} y={415} s={38} c={C.teal} o={at(3)}>3 + 1 + 3 = 7 = 2³ − 1</T></g>; };

// Balance scale for the equation unit (om15): pans stay level while the same amount is removed / split on both sides.
const Pan = ({ x, y, children }) => <g><line x1={x} y1={y - 120} x2={x - 120} y2={y} stroke={C.ink} strokeWidth={3} /><line x1={x} y1={y - 120} x2={x + 120} y2={y} stroke={C.ink} strokeWidth={3} /><path d={`M${x - 140} ${y} Q${x} ${y + 60} ${x + 140} ${y}`} fill={C.line} stroke={C.ink} strokeWidth={4} />{children}</g>;
const Scale = ({ left, right }) => <g><polygon points="615,250 665,250 640,90" fill="#8a5a2b" /><rect x={580} y={248} width={120} height={14} rx={6} fill="#8a5a2b" /><rect x={300} y={84} width={680} height={12} rx={6} fill={C.ink} /><Pan x={340} y={210}>{left}</Pan><Pan x={940} y={210}>{right}</Pan></g>;
const Dots = ({ x, n, o = 1, c = C.orange }) => <g opacity={o}>{Array.from({ length: n }, (_, i) => <circle key={i} cx={x - 110 + (i % 10) * 24} cy={196 - Math.floor(i / 10) * 22} r={10} fill={c} />)}</g>;
export const balanceAdd = ({ at }) => { const gone = at(1); return <g><Scale left={<g><rect x={220} y={130} width={70} height={70} rx={8} fill={C.purple} /><T x={255} y={178} s={36} c="#fff">x</T><Dots x={430} n={12} o={1 - gone} /></g>} right={<g><Dots x={940} n={16} /><Dots x={940 + 0} n={0} /><g opacity={1 - gone}><Dots x={1060} n={0} /></g></g>} />
  <T x={940} y={60} s={28}>{gone > .5 ? '16' : '28'}</T><T x={340} y={60} s={28}>{gone > .5 ? 'x' : 'x + 12'}</T>
  <g opacity={1 - gone}><Dots x={940} n={28} /></g>
  <T x={640} y={300} s={30} c={C.orange} o={at(1)}>两边同时拿走 12 颗，天平依然平衡</T><T x={640} y={360} s={40} c={C.teal} o={at(2)}>x = 16</T><T x={640} y={415} s={30} o={at(3)}>检验：16 + 12 = 28 ✓</T></g>; };
export const balanceDiv = ({ at }) => { const k = at(1); return <g><Scale left={<g>{[0, 1, 2, 3].map(i => <g key={i} opacity={i === 0 ? 1 : 1 - k}><rect x={205 + i * 70} y={130} width={60} height={60} rx={8} fill={C.purple} /><T x={235 + i * 70} y={172} s={30} c="#fff">x</T></g>)}</g>} right={<g><Dots x={940} n={9} /><g opacity={1 - k}><Dots x={940} n={36} /></g></g>} />
  <T x={340} y={60} s={28}>{k > .5 ? 'x' : '4x'}</T><T x={940} y={60} s={28}>{k > .5 ? '9' : '36'}</T>
  <T x={640} y={300} s={30} c={C.orange} o={at(1)}>两边都平均分成 4 份，只看其中 1 份</T><T x={640} y={360} s={40} c={C.teal} o={at(2)}>x = 9</T><T x={640} y={415} s={30} o={at(3)}>检验：4 × 9 = 36 ✓</T></g>; };
