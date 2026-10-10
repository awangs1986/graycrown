// Worked-example visuals for 小学高年级 + 初中 units (om07–om14). Canvas 1280×430.
import React from 'react';
import { C, T, Box, Arrow, lerp } from './kit.jsx';
const range = n => Array.from({ length: n }, (_, i) => i);

const Bar = ({ y, frac, col, label, txt }) => <g><T x={200} y={y + 38} a="end" s={28}>{label}</T><rect x={220} y={y} width={840} height={54} rx={10} fill="#fff" stroke={C.ink} strokeWidth={3} /><rect x={220} y={y} width={840 * frac} height={54} rx={10} fill={col} /><T x={1080} y={y + 38} a="start" s={28}>{txt}</T></g>;
export const work = ({ at }) => <g>
  <Bar y={30} frac={lerp(at(1), 0, 1) / 6} col={C.orange} label="甲一天" txt="1/6" />
  <Bar y={110} frac={lerp(at(1), 0, 1) / 3} col={C.teal} label="乙一天" txt="1/3" />
  <g opacity={at(2)}><Bar y={190} frac={lerp(at(2), 0, 1) / 2} col={C.purple} label="合作一天" txt="1/2" /></g>
  <g opacity={at(3)}><rect x={220} y={270} width={420 * lerp(at(3), 0, .5)} height={54} fill={C.purple} opacity={.6} /><rect x={640} y={270} width={420 * lerp(at(3), .5, 1)} height={54} fill={C.purple} opacity={.9} /><rect x={220} y={270} width={840} height={54} rx={10} fill="none" stroke={C.ink} strokeWidth={3} /><T x={200} y={308} a="end" s={28}>两天</T></g>
  <T x={640} y={400} s={36} c={C.ink} o={at(0)}>把整面墙看成“1”{at(3) > .9 ? '：1 ÷ 1/2 = 2 天' : ''}</T></g>;

export const sugar = ({ at }) => { const water = lerp(at(2), 0, 1), h = 140 + 140 * water; const dots = range(20); return <g>
  <path d="M480 60 L480 360 Q480 380 500 380 L780 380 Q800 380 800 360 L800 60" fill="none" stroke={C.ink} strokeWidth={6} />
  <rect x={486} y={374 - h} width={308} height={h} fill="#bfe3f7" opacity={.8} />
  {dots.map(i => <circle key={i} cx={510 + (i * 53) % 260} cy={370 - ((i * 37) % Math.floor(h - 20)) - 10} r={7} fill={C.orange} />)}
  <T x={340} y={120} s={30} o={at(0)}>糖 20 克</T><T x={340} y={165} s={26} c={C.muted} o={at(0)}>100 × 20%</T>
  <T x={960} y={120} s={30} c={C.teal} o={at(1)}>10% 时溶液</T><T x={960} y={165} s={30} c={C.teal} o={at(1)}>20 ÷ 10% = 200 克</T>
  <T x={960} y={260} s={32} c={C.blue} o={at(2)}>加水 200 − 100</T><T x={960} y={305} s={36} c={C.blue} o={at(2)}>= 100 克</T>
  <T x={640} y={425} s={30} c={C.orange}>糖（橙色点）的数量始终不变</T></g>; };

export const hanxin = ({ at }) => { const list = [2, 9, 16, 23, 30, 37]; return <g>
  <T x={640} y={50} s={30} o={at(0)}>除以 7 余 2 的数：</T>
  {list.map((n, i) => { const ok5 = n % 5 === 3, ok3 = n % 3 === 2, dim = (at(1) > .5 && !ok5) || (at(2) > .5 && !ok3);
    return <Box key={i} x={190 + i * 160} y={90} w={120} h={90} o={lerp(at(0), i / 6, i / 6 + .2) * (dim ? .25 : 1)} fill={n === 23 && at(3) > 0 ? C.orangeSoft : '#fff'} stroke={n === 23 && at(1) > .5 ? C.orange : C.ink} label={n} s={40} />; })}
  <T x={640} y={250} s={30} c={C.teal} o={at(1)}>÷5 余 3？ 23 = 5×4 + 3 ✓</T>
  <T x={640} y={310} s={30} c={C.purple} o={at(2)}>÷3 余 2？ 23 = 3×7 + 2 ✓</T>
  <T x={640} y={390} s={44} c={C.orange} o={at(3)}>最小是 23</T></g>; };

const FT = ({ x, n, f, o, hl }) => <g opacity={o}><Box x={x - 50} y={20} w={100} h={70} label={n} s={36} /><T x={x} y={150} s={34}>=</T>
  {f.map((p, i) => <g key={i}><circle cx={x - (f.length - 1) * 50 + i * 100} cy={220} r={36} fill={hl[i] ? C.orangeSoft : '#fff'} stroke={hl[i] ? C.orange : C.ink} strokeWidth={4} /><T x={x - (f.length - 1) * 50 + i * 100} y={232} s={34}>{p}</T>{i < f.length - 1 && <T x={x - (f.length - 1) * 50 + i * 100 + 50} y={232} s={30}>×</T>}</g>)}</g>;
export const gcd = ({ at }) => { const h = at(2) > .3; return <g>
  <FT x={360} n={12} f={[2, 2, 3]} o={at(0)} hl={[h, false, h]} /><FT x={920} n={18} f={[2, 3, 3]} o={at(1)} hl={[h, h, false]} />
  <T x={640} y={330} s={32} c={C.orange} o={at(2)}>公共的质因数：2 和 3</T>
  <T x={640} y={400} s={40} c={C.teal} o={at(3)}>最大公约数 = 2 × 3 = 6</T></g>; };

export const outfits = ({ at }) => { const shirts = [C.red, C.blue, C.yellow], pants = ['#333', '#7a5', '#a67', '#59c']; const shown = Math.round(lerp(at(2), 0, 1) * 12); return <g>
  {shirts.map((c, i) => <rect key={i} x={90} y={30 + i * 100} width={70} height={60} rx={10} fill={c} opacity={at(0)} />)}<T x={125} y={350} s={26} o={at(0)}>3 件上衣</T>
  {pants.map((c, j) => <rect key={j} x={300 + j * 120} y={10} width={50} height={70} rx={6} fill={c} opacity={at(1)} />)}<T x={540} y={110} s={26} o={at(1)}>4 条裤子</T>
  {range(12).map(k => { const i = Math.floor(k / 4), j = k % 4; return <g key={k} opacity={k < shown ? 1 : 0}><rect x={296 + j * 120} y={140 + i * 90} width={58} height={36} rx={6} fill={shirts[i]} /><rect x={306 + j * 120} y={176 + i * 90} width={38} height={36} rx={4} fill={pants[j]} /></g>; })}
  <T x={1000} y={200} s={34} o={at(2)}>每步都要做</T><T x={1000} y={250} s={34} o={at(2)}>→ 用乘法</T><T x={1000} y={330} s={44} c={C.teal} o={at(3)}>3 × 4 = 12 种</T></g>; };

export const venn = ({ at }) => <g>
  <rect x={240} y={10} width={800} height={340} rx={20} fill="#fff" stroke={C.ink} strokeWidth={3} /><T x={270} y={50} a="start" s={26}>全班 40 人</T>
  <circle cx={540} cy={190} r={140} fill={C.orange} opacity={.25} stroke={C.orange} strokeWidth={5} /><circle cx={740} cy={190} r={140} fill={C.teal} opacity={.25} stroke={C.teal} strokeWidth={5} />
  <T x={470} y={180} s={28} c={C.orange}>足球 25</T><T x={810} y={180} s={28} c={C.teal}>篮球 20</T>
  <T x={640} y={200} s={34} c={C.purple} o={at(0)}>10</T><T x={640} y={235} s={22} c={C.purple} o={at(0)}>都喜欢</T>
  <T x={960} y={330} s={30} c={C.red} o={at(2)}>5</T>
  <T x={640} y={382} s={30} o={at(1)}>至少喜欢一样：25 + 20 − 10 = 35</T><T x={640} y={424} s={30} c={C.red} o={at(2)}>都不喜欢：40 − 35 = 5 人</T></g>;

export const pigeon = ({ at }) => { const cols = [C.red, C.yellow, C.blue]; const balls = [0, 1, 2, 0]; return <g>
  {range(3).map(i => <g key={i}><rect x={260 + i * 280} y={200} width={200} height={150} rx={12} fill="#fff" stroke={cols[i]} strokeWidth={6} opacity={at(0)} /><T x={360 + i * 280} y={390} s={26} c={cols[i]} o={at(0)}>{['红', '黄', '蓝'][i]}</T></g>)}
  {balls.map((b, k) => { const p = k < 3 ? lerp(at(1), k / 3, (k + 1) / 3) : lerp(at(2), 0, 1); const x = 360 + b * 280 + (k === 3 ? 50 : 0), y = 20 + (310 - 20) * p;
    return <circle key={k} cx={x} cy={y} r={30} fill={cols[b]} stroke={C.ink} strokeWidth={3} opacity={p > 0 ? 1 : 0} />; })}
  <T x={640} y={60} s={30} c={C.muted} o={at(1) * (1 - at(2))}>最倒霉：前 3 个颜色都不同</T>
  <T x={640} y={60} s={36} c={C.teal} o={at(3)}>3 + 1 = 4 个，一定有 2 个同色</T></g>; };

export const logic = ({ at }) => { const rows = ['甲', '乙', '丙'], cols = ['老师', '医生', '警察'];
  const marks = [[1, 0, '×', 0], [1, 1, '×', 0], [1, 2, '✓', 0], [0, 0, '×', 1], [0, 2, '×', 1], [0, 1, '✓', 1], [2, 1, '×', 2], [2, 2, '×', 2], [2, 0, '✓', 2]];
  return <g>{cols.map((c, j) => <T key={j} x={560 + j * 160} y={50} s={30}>{c}</T>)}
    {rows.map((r, i) => <g key={i}><T x={420} y={130 + i * 100} s={32}>{r}</T>{cols.map((_, j) => <rect key={j} x={490 + j * 160} y={80 + i * 100} width={140} height={80} fill="#fff" stroke={C.line} strokeWidth={3} />)}</g>)}
    {marks.map(([i, j, m, s], k) => <T key={k} x={560 + j * 160} y={140 + i * 100} s={50} c={m === '✓' ? C.teal : C.red} o={lerp(at(s), 0.2 * (k % 3), 0.2 * (k % 3) + .4)}>{m}</T>)}
    <T x={640} y={420} s={34} c={C.teal} o={at(2)}>每行每列只有一个 ✓ → 丙是老师</T></g>; };

export const parallelogram = ({ at }) => { const k = lerp(at(1), 0, 1); return <g>
  <polygon points="380,320 780,320 880,80 480,80" fill="none" stroke={C.teal} strokeWidth={3} strokeDasharray="8 8" opacity={.5} /><polygon points="480,320 780,320 880,80 480,80" fill={C.tealSoft} stroke={C.teal} strokeWidth={5} />
  <g transform={`translate(${400 * k} 0)`}><polygon points="380,320 480,320 480,80" fill={at(0) > 0 ? C.orangeSoft : C.tealSoft} stroke={at(0) > 0 ? C.orange : C.teal} strokeWidth={5} /></g>
  <line x1={480} y1={80} x2={480} y2={320} stroke={C.ink} strokeWidth={3} strokeDasharray="10 8" opacity={at(0)} />
  <T x={580} y={360} s={30}>底 8</T><T x={440} y={210} s={28} a="end" o={1 - k}>高 5</T>
  <T x={640} y={400} s={34} c={C.teal} o={at(2)}>拼成长 8、宽 5 的长方形</T><T x={640} y={50} s={40} c={C.orange} o={at(3)}>8 × 5 = 40 平方厘米</T></g>; };

export const slide = ({ at, f }) => { const x = 300 + 680 * (0.5 + 0.5 * Math.sin(f / 22)) * (at(1) > 0 ? 1 : 0) + (at(1) > 0 ? 0 : 300); return <g>
  <rect x={300} y={60} width={680} height={280} fill="none" stroke={C.ink} strokeWidth={4} />
  <polygon points={`300,340 980,340 ${Math.min(980, x)},60`} fill={C.orangeSoft} stroke={C.orange} strokeWidth={5} />
  <line x1={Math.min(980, x)} y1={60} x2={Math.min(980, x)} y2={340} stroke={C.purple} strokeWidth={3} strokeDasharray="10 8" opacity={at(1)} />
  <T x={640} y={385} s={30}>底 10</T><T x={1020} y={210} s={30} a="start">宽 6</T>
  <T x={640} y={428} s={34} c={C.teal} o={at(2)}>10 × 6 ÷ 2 = 30{at(3) > 0 ? '，顶点怎么滑都不变' : ''}</T></g>; };

const NL = ({ y = 220, min = -6, max = 8, x0 = 140, x1 = 1140 }) => { const sx = v => x0 + (v - min) / (max - min) * (x1 - x0); return { sx, el: <g><line x1={x0 - 20} y1={y} x2={x1 + 20} y2={y} stroke={C.ink} strokeWidth={4} />{range(max - min + 1).map(i => <g key={i}><line x1={sx(min + i)} y1={y - 10} x2={sx(min + i)} y2={y + 10} stroke={C.ink} strokeWidth={3} /><T x={sx(min + i)} y={y + 45} s={24} w={500}>{min + i}</T></g>)}</g> }; };
export const absLine = ({ at, f }) => { const { sx, el } = NL({ min: -2, max: 8 }); const x = at(1) > 0 ? 3 + 4.5 * Math.sin(f / 25) : 3; const d = Math.abs(x - 1) + Math.abs(x - 5); return <g>{el}
  {[1, 5].map(v => <circle key={v} cx={sx(v)} cy={220} r={14} fill={C.teal} />)}
  <circle cx={sx(x)} cy={220} r={18} fill={C.orange} opacity={at(0) > 0 ? 1 : 0} /><T x={sx(x)} y={180} s={28} c={C.orange} o={at(0) > 0 ? 1 : 0}>x</T>
  <line x1={sx(Math.min(1, x))} y1={140} x2={sx(Math.max(1, x))} y2={140} stroke={C.purple} strokeWidth={8} opacity={at(0)} /><line x1={sx(Math.min(5, x))} y1={120} x2={sx(Math.max(5, x))} y2={120} stroke={C.blue} strokeWidth={8} opacity={at(0)} />
  <T x={640} y={340} s={36} o={at(1)}>两段距离和 = {d.toFixed(1)}</T><T x={640} y={410} s={40} c={C.teal} o={at(3)}>最小值 4（1 ≤ x ≤ 5 时）</T></g>; };

export const inequality = ({ at }) => { const { sx, el } = NL({ min: -1, max: 8, y: 260 }); const tilt = lerp(at(0), 0, 1) * 0; return <g>
  <T x={640} y={60} s={40} o={1 - at(0) * .0}>{at(1) > 0 ? 'x < 4' : at(0) > 0 ? '3x < 12' : '3x + 2 < 14'}</T>
  <T x={640} y={130} s={28} c={C.muted} o={at(0)}>{at(1) > 0 ? '两边 ÷ 3（正数，方向不变）' : '两边同时 − 2'}</T>
  <g opacity={at(2)}>{el}<circle cx={sx(4)} cy={260} r={14} fill="#fff" stroke={C.orange} strokeWidth={5} /><Arrow x1={sx(4) - 16} y1={230} x2={sx(-1) - 10} y2={230} c={C.orange} w={8} /><T x={640} y={390} s={32} c={C.orange}>4 左边的所有数（空心圆：不含 4）</T></g></g>; };
