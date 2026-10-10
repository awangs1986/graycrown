// Worked-example visuals for 小学低/中年级 units (om01–om06). Each receives ctx (see kit.jsx); canvas 1280×430.
import React from 'react';
import { C, T, Box, Arrow, Pop, lerp } from './kit.jsx';

const range = n => Array.from({ length: n }, (_, i) => i);

export const sequence = ({ at }) => { const nums = [2, 5, 8, 11, 14, 17]; return <g>
  {nums.map((n, i) => <Box key={i} x={130 + i * 180} y={170} w={120} h={100} fill={i === 4 ? (at(2) > 0 ? C.orangeSoft : '#fff') : '#fff'} stroke={i === 4 ? C.orange : C.ink} label={i === 4 ? (at(2) > .3 ? '14' : '?') : n} s={44} />)}
  {range(5).map(i => <g key={i} opacity={lerp(at(0), i / 5, i / 5 + .25)}><Arrow x1={200 + i * 180} y1={150} x2={300 + i * 180} y2={150} /><T x={250 + i * 180} y={125} c={C.orange} s={30}>+3</T></g>)}
  <T x={640} y={360} s={34} c={C.teal} o={at(1)}>每次都 +3 → 等差数列</T>
  <T x={640} y={410} s={30} c={C.teal} o={at(3)}>验算：14 + 3 = 17 ✓</T></g>; };

export const gauss = ({ at }) => { const top = [1, 2, 3, '…', 48, 49, 50], bot = [100, 99, 98, '…', 53, 52, 51]; return <g>
  {top.map((n, i) => <Box key={'t' + i} x={170 + i * 140} y={40} w={110} h={80} label={n} s={34} />)}
  {bot.map((n, i) => <g key={'b' + i} transform={`translate(0 ${lerp(at(0), 0, .6, -130, 0)})`}><Box x={170 + i * 140} y={190} w={110} h={80} fill={C.tealSoft} label={n} s={34} /></g>)}
  {range(7).map(i => i !== 3 && <T key={i} x={225 + i * 140} y={165} s={26} c={C.orange} o={at(0) > .6 ? lerp(at(0), .6, 1) : 0}>101</T>)}
  <T x={640} y={330} s={34} o={at(1)}>100 个数 → 50 对</T>
  <T x={640} y={380} s={34} c={C.orange} o={at(2)}>每对的和都是 101</T>
  <T x={640} y={425} s={40} c={C.teal} o={at(3)}>101 × 50 = 5050</T></g>; };

export const makeTen = ({ at }) => { const xs = [[38, 0], [45, 2], [62, 1], [55, 3]]; const target = [[300, 80], [740, 80], [460, 80], [900, 80]];
  return <g>{xs.map(([n, slot], i) => { const x0 = 160 + i * 260, k = lerp(at(slot < 2 ? 0 : 1), 0, 1); const tx = slot === 0 ? 300 : slot === 1 ? 460 : slot === 2 ? 740 : 900;
    return <Box key={i} x={x0 + (tx - x0) * k} y={60 + 80 * (1 - k)} w={130} h={90} fill={slot < 2 ? C.orangeSoft : C.tealSoft} label={n} s={44} />; })}
    <T x={445} y={240} s={38} c={C.orange} o={at(0)}>38 + 62 = 100</T><T x={885} y={240} s={38} c={C.teal} o={at(1)}>45 + 55 = 100</T>
    <T x={640} y={360} s={48} o={at(2)}>100 + 100 = 200</T></g>; };

const Tree = ({ x, y, o = 1 }) => <g opacity={o}><rect x={x - 6} y={y - 30} width={12} height={34} fill="#8a5a2b" /><circle cx={x} cy={y - 52} r={30} fill="#3a9d4f" /><circle cx={x - 14} cy={y - 40} r={18} fill="#4cb862" /></g>;
export const trees = ({ at }) => <g>
  <rect x={140} y={240} width={1000} height={36} rx={8} fill="#d8c7a6" />
  {range(5).map(i => <g key={i}><Tree x={140 + i * 250} y={240} o={at(2) > 0 ? lerp(at(2), i * .15, i * .15 + .3) : 0} /><line x1={140 + i * 250} y1={290} x2={140 + i * 250} y2={310} stroke={C.ink} strokeWidth={3} /><T x={140 + i * 250} y={340} s={24} c={C.muted}>{i * 5} m</T></g>)}
  {range(4).map(i => <g key={'g' + i} opacity={lerp(at(0), i * .2, i * .2 + .3)}><Arrow x1={160 + i * 250} y1={300} x2={370 + i * 250} y2={300} c={C.orange} w={4} /><T x={265 + i * 250} y={290} s={24} c={C.orange}>5 m</T></g>)}
  <T x={640} y={60} s={34} c={C.orange} o={at(0)}>20 ÷ 5 = 4 个间隔</T>
  <T x={640} y={400} s={34} c={C.teal} o={at(1)}>两端都种：棵数 = 间隔数 + 1</T>
  <T x={640} y={110} s={40} c={C.teal} o={at(2) > .9 ? 1 : 0}>4 + 1 = 5 棵</T></g>;

export const segments = ({ at }) => { const P = [240, 500, 760, 1020], names = 'ABCD'; const segs = [[0, 1, 0], [0, 2, 0], [0, 3, 0], [1, 2, 1], [1, 3, 1], [2, 3, 2]];
  return <g><line x1={200} y1={300} x2={1080} y2={300} stroke={C.ink} strokeWidth={5} />
    {P.map((x, i) => <g key={i}><circle cx={x} cy={300} r={12} fill={C.ink} /><T x={x} y={355} s={36}>{names[i]}</T></g>)}
    {segs.map(([a, b, s], k) => { const idx = segs.filter(z => z[2] === s).findIndex(z => z === segs[k]), n = segs.filter(z => z[2] === s).length; const p = lerp(at(s), idx / n, (idx + 1) / n);
      const h = 40 + (b - a) * 55 + a * 8, col = [C.orange, C.teal, C.purple][s]; const mx = (P[a] + P[b]) / 2;
      return <path key={k} d={`M${P[a]} 290 Q${mx} ${290 - 2 * h} ${P[b]} 290`} fill="none" stroke={col} strokeWidth={5} strokeDasharray={1400} strokeDashoffset={1400 * (1 - p)} />; })}
    <T x={1180} y={90} s={30} c={C.orange} o={at(0)} a="end">A 出发：3 条</T><T x={1180} y={135} s={30} c={C.teal} o={at(1)} a="end">B 出发：2 条</T><T x={1180} y={180} s={30} c={C.purple} o={at(2)} a="end">C 出发：1 条</T>
    <T x={640} y={420} s={40} o={at(3)}>3 + 2 + 1 = 6 条</T></g>; };

export const bridges = ({ at }) => { const N = { A: [640, 70], B: [400, 220], D: [880, 220], C: [640, 370] };
  const E = [['A', 'B', -40], ['A', 'B', 40], ['C', 'B', -40], ['C', 'B', 40], ['A', 'D', 0], ['C', 'D', 0], ['B', 'D', 0]]; const deg = { A: 3, B: 5, C: 3, D: 3 };
  return <g><g opacity={1 - .75 * at(0)}><rect x={150} y={0} width={980} height={130} fill="#cfe6c4" /><rect x={150} y={310} width={980} height={120} fill="#cfe6c4" /><rect x={150} y={130} width={980} height={180} fill="#9fd0ec" /><ellipse cx={400} cy={220} rx={110} ry={60} fill="#cfe6c4" /><ellipse cx={880} cy={220} rx={90} ry={55} fill="#cfe6c4" /></g>
    {E.map(([a, b, bend], i) => { const [x1, y1] = N[a], [x2, y2] = N[b]; const mx = (x1 + x2) / 2 + bend * 1.5, my = (y1 + y2) / 2 - Math.abs(bend) * 0.4 * Math.sign(bend);
      return <path key={i} d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} fill="none" stroke={C.ink} strokeWidth={6} opacity={.3 + .7 * at(0)} />; })}
    {Object.entries(N).map(([k, [x, y]]) => <g key={k}><circle cx={x} cy={y} r={30} fill={at(2) > .5 ? C.red : C.orange} /><T x={x} y={y + 11} s={30} c="#fff">{k}</T>
      <T x={x + (x < 640 ? -70 : x > 640 ? 70 : 75)} y={y + (x === 640 ? (y < 200 ? 10 : 10) : 10)} s={28} c={C.purple} o={at(1)}>{deg[k]} 条</T></g>)}
    <T x={640} y={428} s={34} c={C.red} o={at(3)}>4 个奇点 &gt; 2 → 不能一笔画</T></g>; };

export const sumDiff = ({ at }) => { const unit = 40; return <g>
  <T x={150} y={110} a="start" s={32}>哥哥</T><T x={150} y={230} a="start" s={32}>弟弟</T>
  <rect x={260} y={70} width={8 * unit * (1 - .0)} height={56} rx={8} fill={C.tealSoft} stroke={C.teal} strokeWidth={4} />
  <rect x={260 + 8 * unit} y={70} width={4 * unit} height={56} rx={8} fill={C.orangeSoft} stroke={C.orange} strokeWidth={4} opacity={1 - .8 * at(1)} strokeDasharray={at(1) > 0 ? '10 8' : 'none'} />
  <rect x={260} y={190} width={8 * unit} height={56} rx={8} fill={C.tealSoft} stroke={C.teal} strokeWidth={4} />
  <T x={260 + 10 * unit} y={60} s={28} c={C.orange} o={at(0)}>多 4 颗</T>
  <path d={`M${260 + 12 * unit + 30} 80 q 30 85 0 160`} stroke={C.ink} strokeWidth={4} fill="none" /><T x={260 + 12 * unit + 80} y={170} s={30} a="start">共 20 颗</T>
  <T x={640} y={330} s={36} c={C.orange} o={at(1)}>20 − 4 = 16（变成两份一样多）</T>
  <T x={640} y={380} s={36} c={C.teal} o={at(2)}>16 ÷ 2 = 8 → 弟弟 8 颗</T>
  <T x={640} y={428} s={36} o={at(3)}>哥哥 8 + 4 = 12 颗</T></g>; };

export const ages = ({ at, all }) => { const years = Math.round(lerp(at(3), 0, 1) * 6); const kid = 8 + years, mom = 36 + years, sc = 14; return <g>
  <T x={130} y={95} a="start" s={30}>妈妈</T><T x={130} y={205} a="start" s={30}>小明</T>
  <rect x={230} y={60} width={mom * sc} height={50} rx={8} fill={C.orangeSoft} stroke={C.orange} strokeWidth={4} /><T x={240 + mom * sc} y={98} a="start" s={30}>{mom} 岁</T>
  <rect x={230} y={170} width={kid * sc} height={50} rx={8} fill={C.tealSoft} stroke={C.teal} strokeWidth={4} /><T x={240 + kid * sc} y={208} a="start" s={30}>{kid} 岁</T>
  <rect x={230 + kid * sc} y={60} width={28 * sc} height={50} fill="none" stroke={C.purple} strokeWidth={5} strokeDasharray="12 8" opacity={at(0)} /><T x={230 + kid * sc + 14 * sc} y={145} s={28} c={C.purple} o={at(0)}>差 28 岁（不变）</T>
  <T x={640} y={300} s={34} o={at(1)}>3 倍时：差 = 小明的 2 倍</T>
  <T x={640} y={350} s={34} c={C.teal} o={at(2)}>28 ÷ 2 = 14 岁</T>
  <T x={640} y={410} s={38} c={C.orange} o={at(3)}>14 − 8 = 6 → {years} 年后</T></g>; };

// Round, cute crayon chicken & bunny (same lift logic as before: chickens lift 2 legs, bunnies stand on 2 legs).
const Chicken = ({ x, lift }) => { const y = -lift * 60; return <g>
  {[-10, 10].map(d => <line key={d} x1={x + d} y1={222 + y} x2={x + d} y2={258 - lift * 70} stroke={C.orange} strokeWidth={5} />)}
  <ellipse cx={x} cy={196 + y} rx={38} ry={32} fill={C.yellow} stroke={C.ink} strokeWidth={3} />
  <path d={`M${x - 30} ${190 + y} q -18 -14 -10 -26 q 6 10 16 12`} fill={C.yellow} stroke={C.ink} strokeWidth={3} />
  <circle cx={x + 26} cy={168 + y} r={20} fill={C.yellow} stroke={C.ink} strokeWidth={3} />
  <path d={`M${x + 18} ${150 + y} q 4 -14 10 -2 q 6 -12 10 2`} fill={C.red} stroke={C.red} strokeWidth={3} />
  <polygon points={`${x + 44},${164 + y} ${x + 58},${170 + y} ${x + 44},${176 + y}`} fill={C.orange} stroke={C.orange} strokeWidth={2} />
  <circle cx={x + 32} cy={164 + y} r={3.5} fill={C.ink} /><ellipse cx={x + 22} cy={176 + y} rx={6} ry={4} fill="#ff9aa2" opacity={0.8} />
  <path d={`M${x - 12} ${196 + y} q 12 14 26 0`} fill="none" stroke={C.orange} strokeWidth={3} /></g>; };
const Rabbit = ({ x, lift }) => { const y = -lift * 14, W = '#ffffff'; return <g>
  {[-24, -12].map(d => <line key={d} x1={x + d} y1={224 + y} x2={x + d} y2={258 - lift * 30} stroke={C.ink} strokeWidth={5} opacity={1 - lift} />)}
  {[14, 26].map(d => <line key={d} x1={x + d} y1={224} x2={x + d} y2={258} stroke={C.red} strokeWidth={6} />)}
  <ellipse cx={x + 26} cy={136 + y} rx={9} ry={26} fill={W} stroke={C.ink} strokeWidth={3} /><ellipse cx={x + 46} cy={138 + y} rx={9} ry={26} fill={W} stroke={C.ink} strokeWidth={3} />
  <ellipse cx={x + 26} cy={138 + y} rx={3.5} ry={7} fill="#ffb3c1" /><ellipse cx={x + 46} cy={140 + y} rx={3.5} ry={7} fill="#ffb3c1" />
  <ellipse cx={x} cy={200 + y} rx={42} ry={32} fill={W} stroke={C.ink} strokeWidth={3} /><circle cx={x - 40} cy={196 + y} r={9} fill={W} stroke={C.ink} strokeWidth={3} />
  <circle cx={x + 34} cy={174 + y} r={22} fill={W} stroke={C.ink} strokeWidth={3} />
  <circle cx={x + 42} cy={170 + y} r={3.5} fill={C.ink} /><ellipse cx={x + 32} cy={182 + y} rx={6} ry={4} fill="#ff9aa2" /><circle cx={x + 54} cy={176 + y} r={3} fill="#ff7a8a" /></g>; };
export const chickenRabbit = ({ at }) => { const lift = lerp(at(0), 0, .6); return <g>
  <line x1={100} y1={260} x2={1180} y2={260} stroke={C.line} strokeWidth={4} />
  {range(5).map(i => <Chicken key={'c' + i} x={150 + i * 110} lift={lift} />)}{range(4).map(i => <Rabbit key={'r' + i} x={760 + i * 120} lift={lift} />)}
  <T x={640} y={60} s={28} c={C.muted}>（示意：每只鸡代表若干只，每只兔也一样）</T>
  <T x={640} y={320} s={34} c={C.orange} o={at(0)}>每只抬起 2 条腿：35 × 2 = 70 条</T>
  <T x={640} y={365} s={34} c={C.red} o={at(1)}>还站着 94 − 70 = 24 条，全是兔腿</T>
  <T x={640} y={410} s={36} c={C.teal} o={at(2)}>兔 24 ÷ 2 = 12 只{at(3) > 0 ? '，鸡 35 − 12 = 23 只' : ''}</T></g>; };

export const candy = ({ at }) => { const kid = (i, y, give, col) => <g key={i}><circle cx={180 + i * 150} cy={y} r={26} fill={col} /><T x={180 + i * 150} y={y + 70} s={26}>{give}</T></g>; return <g>
  <T x={110} y={60} a="start" s={28}>每人 3 颗：多 8 颗</T>{range(6).map(i => kid(i, 100, '●●●', C.orangeSoft))}<T x={1110} y={140} s={30} c={C.orange}>+8</T>
  <T x={110} y={225} a="start" s={28}>每人 5 颗：差 4 颗</T>{range(6).map(i => kid(i, 265, '●●●●●', C.tealSoft))}<T x={1110} y={305} s={30} c={C.red}>−4</T>
  <T x={640} y={392} s={28} o={at(0)}>每人多 2 颗；</T><T x={640} y={430} s={28} c={C.orange} o={at(1)}>总差 8 + 4 = 12 → 12 ÷ 2 = 6 人{at(3) > 0 ? '，糖 26 颗' : ''}</T></g>; };

// Cute crayon kid walker: name tag above, coloured shirt, round face.
const Walker = ({ x, y, c, label, dx = 0 }) => { x += dx; return <g transform={`translate(${x} ${y + 30}) scale(1.35) translate(${-x} ${-(y + 30)})`}>
  <line x1={x - 8} y1={y + 18} x2={x - 10} y2={y + 30} stroke={C.ink} strokeWidth={4} /><line x1={x + 8} y1={y + 18} x2={x + 10} y2={y + 30} stroke={C.ink} strokeWidth={4} />
  <ellipse cx={x} cy={y + 4} rx={17} ry={18} fill={c} stroke={C.ink} strokeWidth={3} />
  <circle cx={x} cy={y - 28} r={17} fill="#ffe0c2" stroke={C.ink} strokeWidth={3} /><path d={`M${x - 17} ${y - 32} q 17 -22 34 0 q -17 -8 -34 0`} fill={C.ink} stroke={C.ink} strokeWidth={2} />
  <circle cx={x - 6} cy={y - 27} r={2.5} fill={C.ink} /><circle cx={x + 6} cy={y - 27} r={2.5} fill={C.ink} /><ellipse cx={x - 10} cy={y - 20} rx={4} ry={2.5} fill="#ff9aa2" /><ellipse cx={x + 10} cy={y - 20} rx={4} ry={2.5} fill="#ff9aa2" />
  <T x={x} y={y - 54} s={24} c={c}>{label}</T></g>; };
export const meet = ({ at, step }) => { const k = lerp(at(2), 0, 1); const ax = 160 + 7 * 80 * k, bx = 1120 - 5 * 80 * k; return <g>
  <line x1={160} y1={200} x2={1120} y2={200} stroke={C.ink} strokeWidth={5} /><T x={640} y={250} s={30}>600 米</T>
  <rect x={160} y={190} width={ax - 160} height={20} fill={C.orangeSoft} /><rect x={bx} y={190} width={1120 - bx} height={20} fill={C.tealSoft} />
  <Walker x={ax} y={170} c={C.orange} label="明" dx={-18} /><Walker x={bx} y={170} c={C.teal} label="红" dx={18} />
  <T x={300} y={270} s={28} c={C.orange}>70 米/分</T><T x={980} y={270} s={28} c={C.teal}>50 米/分</T>
  <T x={640} y={340} s={34} o={at(0)}>每分钟一共走 70 + 50 = 120 米</T>
  <T x={640} y={410} s={38} c={C.purple} o={at(2)}>600 ÷ 120 = 5 分钟（已过 {Math.round(k * 5)} 分）</T></g>; };

export const chase = ({ at }) => { const k = lerp(at(2), 0, 1); const slow = 360 + 160 * k * 5 / 5 * 2, fast = 160 + (200 + 160 * 2) * k; return <g>
  <line x1={120} y1={200} x2={1180} y2={200} stroke={C.ink} strokeWidth={5} />
  <rect x={Math.min(fast, slow)} y={190} width={Math.abs(slow - fast)} height={20} fill={C.orangeSoft} />
  <Walker x={fast} y={170} c={C.orange} label="哥" dx={-18} /><Walker x={slow} y={170} c={C.teal} label="弟" dx={18} />
  <T x={(fast + slow) / 2} y={250} s={28} c={C.orange} o={1 - k}>相差 200 米</T>
  <T x={640} y={330} s={34} o={at(1)}>每分钟追近 40 米（速度差）</T>
  <T x={640} y={400} s={38} c={C.purple} o={at(2)}>200 ÷ 40 = 5 分钟</T></g>; };
