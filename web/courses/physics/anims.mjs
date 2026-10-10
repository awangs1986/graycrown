// Hand-written SVG animations for the physics course (no libraries, no network, no images).
// Each animation is a pure function frame(t, value) → SVG markup for a 400×220 viewBox, so it can be
// tested in Node, paused at any moment, and shown as a still picture when the user prefers reduced motion.
const W = 400, H = 220;
const f = n => Math.round(n * 10) / 10;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const txt = (x, y, s, o = '') => `<text x="${f(x)}" y="${f(y)}" ${o}>${s}</text>`;
const arrow = (x1, y1, x2, y2, color, w = 3) => {
  const a = Math.atan2(y2 - y1, x2 - x1), h = 8;
  if (Math.hypot(x2 - x1, y2 - y1) < 2) return '';
  return `<g stroke="${color}" fill="${color}" stroke-width="${w}" stroke-linecap="round"><line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2 - Math.cos(a) * h * 0.6)}" y2="${f(y2 - Math.sin(a) * h * 0.6)}"/>` +
    `<polygon stroke-width="0" points="${f(x2)},${f(y2)} ${f(x2 - h * Math.cos(a - 0.45))},${f(y2 - h * Math.sin(a - 0.45))} ${f(x2 - h * Math.cos(a + 0.45))},${f(y2 - h * Math.sin(a + 0.45))}"/></g>`;
};
const ground = (y = 200) => `<rect x="0" y="${y}" width="${W}" height="${H - y}" fill="#d9cdb4"/><line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="#8b7a5a" stroke-width="2"/>`;
const person = (x, y, lean = 0, color = '#1f5fa8') => `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(lean)})" stroke="${color}" stroke-width="4" stroke-linecap="round" fill="none"><circle cx="0" cy="-46" r="8" fill="#ffe0bd"/><line x1="0" y1="-38" x2="0" y2="-14"/><line x1="0" y1="-30" x2="12" y2="-22"/><line x1="0" y1="-14" x2="-7" y2="0"/><line x1="0" y1="-14" x2="7" y2="0"/></g>`;
const bar = (x, y, value, color, label) => `<g><rect x="${x}" y="${y - 80}" width="22" height="80" fill="#eef1f4" stroke="#b9c2cc"/><rect x="${x}" y="${f(y - 80 * clamp(value, 0, 1))}" width="22" height="${f(80 * clamp(value, 0, 1))}" fill="${color}"/>${txt(x + 11, y + 16, label, 'text-anchor="middle" font-size="12"')}</g>`;

// Roller coaster track precomputed once: height profile and a time table from energy conservation.
const coaster = (() => {
  const h = x => 120 * Math.exp(-(((x - 40) / 60) ** 2)) + 75 * Math.exp(-(((x - 250) / 45) ** 2)) + 12;
  const g = 400, h0 = h(40) + 2, pts = [];
  let x = 40, t = 0;
  while (x < 390 && t < 20) { const v = Math.sqrt(Math.max(2 * g * (h0 - h(x)), 400)); const slope = (h(x + 0.5) - h(x - 0.5)); x += v * Math.cos(Math.atan(slope)) * 0.01; t += 0.01; pts.push([t, x]); }
  return { h, h0, pts, end: t };
})();

export const animations = {
  'motion-trail': { title: '匀速运动 vs 加速运动', caption: '每隔 1 秒留下一个小圆点：上面的小车每秒走一样远（匀速）；下面的小车圆点越拉越开（加速）。', duration: 10, still: 8,
    frame(t) {
      const s = Math.min(t, 8), xa = k => 30 + 40 * k, xb = k => 30 + 5 * k * k;
      let dots = '';
      for (let k = 0; k <= Math.floor(s); k++) dots += `<circle cx="${xa(k)}" cy="78" r="4" fill="#1f5fa8"/><circle cx="${xb(k)}" cy="168" r="4" fill="#c0392b"/>`;
      const car = (x, y, c) => `<g transform="translate(${f(x)} ${y})"><rect x="-22" y="-26" width="44" height="18" rx="5" fill="${c}"/><rect x="-12" y="-36" width="22" height="12" rx="3" fill="${c}" opacity=".75"/><circle cx="-12" cy="-6" r="6" fill="#222"/><circle cx="12" cy="-6" r="6" fill="#222"/></g>`;
      return `<rect width="${W}" height="${H}" fill="#f4f7fb"/><line x1="10" y1="94" x2="390" y2="94" stroke="#9aa"/><line x1="10" y1="184" x2="390" y2="184" stroke="#9aa"/>` + dots +
        car(xa(s), 92, '#1f5fa8') + car(xb(s), 182, '#c0392b') + txt(12, 22, '匀速：每秒都走 1 格', 'font-size="14" fill="#1f5fa8"') + txt(12, 116, '加速：每秒越走越远', 'font-size="14" fill="#c0392b"') + txt(388, 22, `t = ${Math.floor(s)} s`, 'text-anchor="end" font-size="14"');
    } },
  'free-fall': { title: '自由落体：越落越快', caption: '频闪照片效果：每 0.2 秒拍一次。相邻两个影子的距离越来越大，说明小球越落越快。', duration: 3.4, still: 2,
    frame(t) {
      const s = Math.min(t, 2), y = k => 24 + 42 * k * k; let ghosts = '';
      for (let k = 0; k <= s + 1e-9; k += 0.2) ghosts += `<circle cx="150" cy="${f(y(k))}" r="9" fill="#e67e22" opacity=".28"/>`;
      let ruler = ''; for (let m = 0; m <= 20; m += 5) ruler += `<line x1="200" x2="212" y1="${f(24 + m * 8.4)}" y2="${f(24 + m * 8.4)}" stroke="#555"/>` + txt(218, 28 + m * 8.4, `${m} m`, 'font-size="11"');
      return `<rect width="${W}" height="${H}" fill="#f4f7fb"/>${ground(200)}<line x1="206" y1="24" x2="206" y2="192" stroke="#555"/>${ruler}${ghosts}<circle cx="150" cy="${f(y(s))}" r="10" fill="#e67e22" stroke="#9a4d0b"/>` +
        txt(280, 60, `时间 ${s.toFixed(1)} s`, 'font-size="14"') + txt(280, 84, `速度 ≈ ${Math.round(9.8 * s)} m/s`, 'font-size="14" fill="#c0392b"') + txt(280, 108, '每秒快约 10 m/s', 'font-size="12" fill="#5b6875"');
    } },
  projectile: { title: '平抛：横着飞也同时落地', caption: '一个球直接落下，另一个球同时被水平弹出。拖动滑块改变水平速度：飞得再远，两球也总是同时落地。', duration: 2.6, still: 1.2,
    slider: { label: '水平速度', min: 0, max: 4, step: 1, value: 2, unit: '格/秒' },
    frame(t, v = 2) {
      const s = Math.min(t, 1.2), y = k => 60 + 97 * k * k, x = k => 70 + v * 55 * k; let ghosts = '';
      for (let k = 0; k <= s + 1e-9; k += 0.2) ghosts += `<circle cx="70" cy="${f(y(k))}" r="6" fill="#7f8c8d" opacity=".3"/><circle cx="${f(x(k))}" cy="${f(y(k))}" r="6" fill="#c0392b" opacity=".3"/><line x1="60" x2="${f(Math.max(x(k), 80))}" y1="${f(y(k))}" y2="${f(y(k))}" stroke="#bbb" stroke-dasharray="3 3"/>`;
      return `<rect width="${W}" height="${H}" fill="#f4f7fb"/>${ground(200)}<rect x="0" y="66" width="64" height="134" fill="#a47c52"/>${ghosts}<circle cx="70" cy="${f(y(s))}" r="8" fill="#7f8c8d"/><circle cx="${f(x(s))}" cy="${f(y(s))}" r="8" fill="#c0392b"/>` +
        txt(392, 24, s >= 1.2 ? '同时落地！' : `t = ${s.toFixed(1)} s`, 'text-anchor="end" font-size="15" fill="#1d7a4c"');
    } },
  'bus-brake': { title: '惯性：公交车急刹车', caption: '车突然停下，脚跟着车停了，身体上半部分却“还想保持原来的运动”，所以人会往前倾。', duration: 5, still: 2.2,
    frame(t) {
      const braking = t > 1.6 && t < 3, stopped = t >= 3, lean = braking ? 22 * Math.sin(Math.PI * Math.min((t - 1.6) / 0.7, 1) / 2) : stopped ? 22 * Math.max(0, 1 - (t - 3) / 0.6) : 0;
      const roadShift = t < 1.6 ? t * 160 : 256 + (1 - Math.exp(-(Math.min(t, 3) - 1.6) * 3)) * 40; let stripes = '';
      for (let k = -1; k < 10; k++) stripes += `<rect x="${f(k * 60 - (roadShift % 60))}" y="203" width="30" height="4" fill="#fff"/>`;
      return `<rect width="${W}" height="${H}" fill="#eaf2fb"/><rect y="196" width="${W}" height="24" fill="#555"/>${stripes}<rect x="70" y="60" width="270" height="124" rx="14" fill="#f1c40f" stroke="#a37f05" stroke-width="3"/>` +
        `<rect x="88" y="74" width="230" height="56" fill="#dff1ff" stroke="#a37f05"/><circle cx="120" cy="188" r="15" fill="#222"/><circle cx="290" cy="188" r="15" fill="#222"/>` + person(200, 172, lean, '#1d2733') +
        (braking ? arrow(214, 112, 262, 112, '#c0392b') + txt(205, 52, '急刹车！身体还想往前冲', 'text-anchor="middle" font-size="15" fill="#c0392b"') : txt(205, 52, stopped ? '车停了，人慢慢站稳' : '公交车匀速向右行驶 →', 'text-anchor="middle" font-size="15"'));
    } },
  'tug-of-war': { title: '拔河：力的平衡', caption: '两边力一样大时，绳子中点不动（二力平衡）；拖动滑块让右队力气更大，绳子就会被拉向右边。', duration: 4, still: 2.5,
    slider: { label: '右队拉力', min: 200, max: 400, step: 50, value: 300, unit: 'N' },
    frame(t, right = 300) {
      const left = 300, d = clamp((right - left) / 100 * 22 * t * t, -40, 40), c = 200 + d;
      return `<rect width="${W}" height="${H}" fill="#f4f7fb"/>${ground(170)}<line x1="200" x2="200" y1="150" y2="180" stroke="#888" stroke-dasharray="4 3"/>` +
        `<line x1="${f(c - 150)}" y1="130" x2="${f(c + 150)}" y2="130" stroke="#8b5a2b" stroke-width="5"/><rect x="${f(c - 4)}" y="118" width="8" height="24" fill="#c0392b"/>` +
        person(c - 140, 170, -14, '#1f5fa8') + person(c - 115, 170, -14, '#1f5fa8') + person(c + 140, 170, 14, '#1d7a4c') + person(c + 115, 170, 14, '#1d7a4c') +
        arrow(c - 6, 100, c - 6 - left / 4, 100, '#1f5fa8') + arrow(c + 6, 100, c + 6 + right / 4, 100, '#1d7a4c') +
        txt(c - 50, 90, `${left} N`, 'text-anchor="middle" font-size="13" fill="#1f5fa8"') + txt(c + 50, 90, `${right} N`, 'text-anchor="middle" font-size="13" fill="#1d7a4c"') +
        txt(200, 30, right === left ? '两边力相等 → 平衡，不动' : right > left ? '右边力大 → 向右加速' : '左边力大 → 向左加速', 'text-anchor="middle" font-size="15"');
    } },
  friction: { title: '摩擦力：冰面 vs 地毯', caption: '两块木块被推出时一样快。冰面很光滑、摩擦力小，滑得很远；地毯粗糙、摩擦力大，很快就停了。', duration: 5, still: 3.5,
    frame(t) {
      const pos = (a) => { const v0 = 120, ts = v0 / a, s = Math.min(t, ts); return 30 + v0 * s - 0.5 * a * s * s; };
      const block = (x, y) => `<rect x="${f(x)}" y="${y - 26}" width="36" height="26" fill="#b5835a" stroke="#6e4b2c" stroke-width="2"/>`;
      return `<rect width="${W}" height="${H}" fill="#f4f7fb"/><rect x="0" y="90" width="${W}" height="10" fill="#bfe6f5"/><rect x="0" y="190" width="${W}" height="10" fill="#b05a4c"/>` +
        `<path d="M0 195 ${Array.from({ length: 40 }, (_, i) => `L${i * 10 + 5} ${i % 2 ? 191 : 199}`).join(' ')}" stroke="#7a3a30" fill="none"/>` +
        block(pos(20), 90) + block(pos(110), 190) + txt(12, 24, '冰面：摩擦力小，滑得远', 'font-size="14" fill="#1f5fa8"') + txt(12, 124, '地毯：摩擦力大，很快停下', 'font-size="14" fill="#b4362d"');
    } },
  orbit: { title: '月亮为什么不掉下来，也不飞走', caption: '红箭头是地球的引力，一直指向地球；蓝箭头是月亮的速度，沿着圆的切线。引力不停地把月亮“拐弯”，于是它绕着地球转。', duration: 8, still: 1.3,
    frame(t) {
      const a = t / 8 * Math.PI * 2, x = 200 + 130 * Math.cos(a), y = 110 + 80 * Math.sin(a), vx = -Math.sin(a) * 130, vy = Math.cos(a) * 80, n = Math.hypot(vx, vy);
      let stars = ''; for (let k = 0; k < 24; k++) stars += `<circle cx="${(k * 97) % 400}" cy="${(k * 53) % 220}" r="1" fill="#fff" opacity=".7"/>`;
      return `<rect width="${W}" height="${H}" fill="#0f1a2c"/>${stars}<ellipse cx="200" cy="110" rx="130" ry="80" fill="none" stroke="#5b6f8f" stroke-dasharray="4 5"/><circle cx="200" cy="110" r="26" fill="#2e86de"/><path d="M186 100q8-8 16 0t10 10" stroke="#27ae60" stroke-width="6" fill="none"/>` +
        arrow(x, y, x + (200 - x) * 0.35, y + (110 - y) * 0.35, '#ff6b6b') + arrow(x, y, x + vx / n * 50, y + vy / n * 50, '#74b9ff') + `<circle cx="${f(x)}" cy="${f(y)}" r="10" fill="#dfe6e9"/>` +
        txt(10, 20, '红：引力（指向地球）', 'font-size="13" fill="#ff6b6b"') + txt(10, 38, '蓝：速度（沿切线）', 'font-size="13" fill="#74b9ff"');
    } },
  'roller-coaster': { title: '过山车：动能和势能互相转化', caption: '越高，势能（橙色）越大；越低，速度越快、动能（蓝色）越大。两者加起来几乎不变——这就是机械能守恒。', duration: coaster.end + 1, still: coaster.end * 0.32,
    frame(t) {
      const { h, h0, pts, end } = coaster, s = Math.min(t, end), p = pts.find(q => q[0] >= s) ?? pts.at(-1), x = p[1], y = 200 - h(x);
      let d = 'M30 200'; for (let k = 30; k <= 395; k += 5) d += ` L${k} ${f(200 - h(k))}`;
      const pe = h(x) / h0, ke = 1 - pe, ang = Math.atan2(-(h(x + 1) - h(x - 1)), 2) * 180 / Math.PI;
      return `<rect width="${W}" height="${H}" fill="#eaf4ff"/>${ground(200)}<path d="${d} L395 200 Z" fill="#cdd9e5" opacity=".5"/><path d="${d.replace('M30 200 L30', 'M30')}" stroke="#c0392b" stroke-width="4" fill="none"/>` +
        `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})"><rect x="-13" y="-16" width="26" height="12" rx="3" fill="#1f5fa8"/><circle cx="-7" cy="-3" r="3" fill="#222"/><circle cx="7" cy="-3" r="3" fill="#222"/></g>` +
        `<rect x="300" y="8" width="94" height="112" fill="#fff" opacity=".85" rx="6"/>` + bar(312, 100, pe, '#e67e22', '势能') + bar(356, 100, ke, '#2e86de', '动能');
    } },
  pendulum: { title: '秋千（单摆）：能量来回搬家', caption: '荡到最高点时几乎停住，势能最大；经过最低点时最快，动能最大。拖动滑块改变绳长：绳越长，来回一次越慢。', duration: 12, still: 0.6,
    slider: { label: '绳长', min: 1, max: 4, step: 1, value: 2, unit: 'm' },
    frame(t, len = 2) {
      const L = 50 + len * 25, period = 2 * Math.PI * Math.sqrt(len / 9.8) * 1.6, th0 = 0.6, th = th0 * Math.cos(2 * Math.PI * t / period);
      const x = 160 + L * Math.sin(th), y = 30 + L * Math.cos(th), pe = (1 - Math.cos(th)) / (1 - Math.cos(th0));
      return `<rect width="${W}" height="${H}" fill="#f4f7fb"/><rect x="90" y="24" width="140" height="6" fill="#6e4b2c"/><line x1="160" y1="30" x2="${f(x)}" y2="${f(y)}" stroke="#444" stroke-width="2"/>` +
        `<path d="M${f(160 + L * Math.sin(-th0))} ${f(30 + L * Math.cos(th0))} A ${L} ${L} 0 0 0 ${f(160 + L * Math.sin(th0))} ${f(30 + L * Math.cos(th0))}" stroke="#bbb" stroke-dasharray="4 4" fill="none"/>` +
        `<circle cx="${f(x)}" cy="${f(y)}" r="12" fill="#8e44ad"/>` + bar(300, 150, pe, '#e67e22', '势能') + bar(344, 150, 1 - pe, '#2e86de', '动能') + txt(330, 190, `来回一次约 ${(period / 1.6).toFixed(1)} s`, 'text-anchor="middle" font-size="12"');
    } },
  collision: { title: '碰撞：“冲劲”传给了别人', caption: '前半段：一样重的两辆小车，一辆撞上静止的另一辆，它自己停下，把运动“交给”对方。后半段：两车撞上后粘在一起，变成更重的整体，速度减半。', duration: 8, still: 2.6,
    frame(t) {
      const sticky = t >= 4, s = t % 4, cart = (x, y, c, label) => `<g transform="translate(${f(x)} ${y})"><rect x="-22" y="-24" width="44" height="20" rx="4" fill="${c}"/><circle cx="-12" cy="-3" r="5" fill="#222"/><circle cx="12" cy="-3" r="5" fill="#222"/>${txt(0, -9, label, 'text-anchor="middle" font-size="11" fill="#fff"')}</g>`;
      let a, b, va, vb; const hit = 1.5, v = 100;
      if (s < hit) { a = 40 + v * s; b = 40 + v * hit + 44; va = v; vb = 0; }
      else if (!sticky) { a = 40 + v * hit; b = 40 + v * hit + 44 + v * (s - hit); va = 0; vb = v; }
      else { a = 40 + v * hit + v / 2 * (s - hit); b = a + 44; va = vb = v / 2; }
      return `<rect width="${W}" height="${H}" fill="#f4f7fb"/>${ground(170)}` + cart(a, 170, '#1f5fa8', 'A') + cart(b, 170, '#c0392b', 'B') +
        arrow(a, 128, a + va * 0.5, 128, '#1f5fa8') + arrow(b, 112, b + vb * 0.5, 112, '#c0392b') + txt(200, 30, sticky ? '粘在一起：质量变 2 倍，速度变一半' : '弹性碰撞：A 停下，B 接着跑', 'text-anchor="middle" font-size="15"');
    } },
  lever: { title: '跷跷板（杠杆）：力 × 力臂', caption: '左边小朋友重 400 N，坐在离支点 2 m 处。拖动滑块改变右边 200 N 小朋友的位置：当 200 × 距离 = 400 × 2 时，跷跷板就平衡了。', duration: 3, still: 3,
    slider: { label: '右边小朋友离支点', min: 1, max: 5, step: 1, value: 4, unit: 'm' },
    frame(t, d = 4) {
      const left = 400 * 2, right = 200 * d, target = clamp((right - left) / 400 * 12, -12, 12), ease = 1 - Math.exp(-3 * t), ang = target * ease, rad = ang * Math.PI / 180;
      const pt = m => [200 + m * 34 * Math.cos(rad), 150 + m * 34 * Math.sin(rad)], [lx, ly] = pt(-2), [rx, ry] = pt(d);
      return `<rect width="${W}" height="${H}" fill="#f4f7fb"/>${ground(190)}<polygon points="200,150 184,190 216,190" fill="#7f8c8d"/>` +
        `<g transform="rotate(${f(ang)} 200 150)"><rect x="20" y="144" width="360" height="8" rx="3" fill="#a0522d"/>${Array.from({ length: 11 }, (_, i) => `<line x1="${30 + i * 34}" x2="${30 + i * 34}" y1="144" y2="152" stroke="#fff"/>`).join('')}</g>` +
        `<rect x="${f(lx - 15)}" y="${f(ly - 36)}" width="30" height="30" rx="6" fill="#1f5fa8"/><rect x="${f(rx - 11)}" y="${f(ry - 28)}" width="22" height="22" rx="5" fill="#1d7a4c"/>` +
        txt(200, 26, `左：400 × 2 = ${left}　右：200 × ${d} = ${right}`, 'text-anchor="middle" font-size="14"') +
        txt(200, 48, right === left ? '相等 → 平衡！' : right > left ? '右边大 → 右边往下' : '左边大 → 左边往下', 'text-anchor="middle" font-size="14" fill="#c0392b"');
    } },
  pulley: { title: '动滑轮：省一半力，多拉一倍绳', caption: '重物挂在动滑轮上，由两段绳子一起提着，所以手只需用重物一半的力；代价是：手拉下 2 m，重物只升高 1 m。', duration: 5, still: 2.5,
    frame(t) {
      const s = clamp((t - 0.4) / 3, 0, 1), up = 50 * s, py = 150 - up, hand = 120 + 2 * up;
      return `<rect width="${W}" height="${H}" fill="#f4f7fb"/><rect x="80" y="10" width="240" height="10" fill="#555"/><circle cx="250" cy="40" r="16" fill="#bdc3c7" stroke="#555" stroke-width="3"/><line x1="250" y1="20" x2="250" y2="40" stroke="#555" stroke-width="3"/>` +
        `<line x1="150" y1="20" x2="150" y2="${f(py)}" stroke="#8b5a2b" stroke-width="3"/><line x1="182" y1="${f(py)}" x2="234" y2="40" stroke="#8b5a2b" stroke-width="3"/><line x1="266" y1="40" x2="266" y2="${f(hand)}" stroke="#8b5a2b" stroke-width="3"/>` +
        `<circle cx="166" cy="${f(py)}" r="16" fill="#bdc3c7" stroke="#555" stroke-width="3"/><line x1="166" y1="${f(py)}" x2="166" y2="${f(py + 26)}" stroke="#555" stroke-width="3"/><rect x="146" y="${f(py + 26)}" width="40" height="30" fill="#7f8c8d"/>${txt(166, py + 46, '200 N', 'text-anchor="middle" font-size="11" fill="#fff"')}` +
        `<circle cx="266" cy="${f(hand + 6)}" r="8" fill="#ffe0bd" stroke="#c08a5a"/>` + arrow(285, hand - 10, 285, hand + 30, '#c0392b') + txt(296, hand + 14, '100 N', 'font-size="13" fill="#c0392b"') +
        txt(20, 200, `重物升高 ${(up / 50).toFixed(1)} m　手拉下 ${(2 * up / 50).toFixed(1)} m`, 'font-size="14"');
    } },
  'liquid-pressure': { title: '越深压强越大：水桶上的三个小孔', caption: '小孔越深，上面压着的水越多，压强越大，水喷得越急、越远。', duration: 4, still: 2,
    frame(t) {
      const holes = [[70, 25], [110, 45], [150, 65]]; let jets = '';
      for (const [hy, depth] of holes) {
        const v = Math.sqrt(depth) * 13; let d = `M110 ${hy}`; for (let k = 0.05; k <= 1.6; k += 0.05) { const x = 110 + v * k * 5, y = hy + 40 * k * k; if (y > 200) break; d += ` L${f(x)} ${f(y)}`; }
        jets += `<path d="${d}" stroke="#3498db" stroke-width="3" fill="none" opacity=".6"/>`;
        for (let j = 0; j < 4; j++) { const k = ((t * 0.8 + j * 0.4) % 1.6), x = 110 + v * k * 5, y = hy + 40 * k * k; if (y < 200) jets += `<circle cx="${f(x)}" cy="${f(y)}" r="3" fill="#2980b9"/>`; }
      }
      return `<rect width="${W}" height="${H}" fill="#f4f7fb"/>${ground(200)}<rect x="30" y="30" width="80" height="170" fill="#d6eaf8" stroke="#555" stroke-width="3"/><rect x="33" y="46" width="74" height="152" fill="#5dade2" opacity=".7"/>` + jets +
        holes.map(([hy], i) => txt(26, hy + 4, ['浅', '中', '深'][i], 'text-anchor="end" font-size="12"')).join('') + txt(392, 24, '深处的水喷得最远', 'text-anchor="end" font-size="14"');
    } },
  buoyancy: { title: '浮力：木块浮、冰块半沉、石头沉', caption: '向上的蓝箭头是浮力，向下的红箭头是重力。木块浮力能托住重力；石头太重（密度大），浮力托不住，就沉到底。', duration: 5, still: 3,
    frame(t) {
      const bob = Math.sin(t * 2.5) * 3, stone = 70 + Math.min(t / 2.4, 1) * 108;
      return `<rect width="${W}" height="${H}" fill="#f4f7fb"/><rect x="20" y="70" width="360" height="130" fill="#85c1e9" opacity=".75"/><rect x="20" y="40" width="360" height="160" fill="none" stroke="#555" stroke-width="3"/>` +
        `<rect x="60" y="${f(56 + bob)}" width="50" height="28" fill="#c8945c" stroke="#6e4b2c" stroke-width="2"/>` + arrow(85, 100 + bob, 85, 128 + bob, '#c0392b') + arrow(85, 98 + bob, 85, 60 + bob, '#1f5fa8') +
        `<rect x="170" y="${f(62 + bob * 0.6)}" width="44" height="40" fill="#eaf6ff" stroke="#9cc" stroke-width="2" opacity=".95"/>` +
        `<ellipse cx="300" cy="${f(stone)}" rx="22" ry="16" fill="#7f8c8d" stroke="#555" stroke-width="2"/>` + arrow(300, stone + 18, 300, stone + 48 > 198 ? 198 : stone + 48, '#c0392b') + arrow(300, stone - 18, 300, stone - 34, '#1f5fa8') +
        txt(85, 30, '木块：漂浮', 'text-anchor="middle" font-size="13"') + txt(192, 30, '冰块：大部分在水下', 'text-anchor="middle" font-size="13"') + txt(300, 30, '石头：下沉', 'text-anchor="middle" font-size="13"');
    } },
  'transverse-wave': { title: '绳子上的波：形状在跑，绳子不跑', caption: '抖动绳子一端，波形向右跑；可盯着红点看：它只上下动，并没有跟着波跑走。', duration: 6, still: 1.5,
    frame(t) {
      let d = ''; for (let x = 20; x <= 380; x += 4) { const y = 110 - 40 * Math.sin(2 * Math.PI * (x / 160 - t / 1.5)) * Math.min(1, Math.max(0, (t * 110 - (x - 20)) / 40)); d += `${x === 20 ? 'M' : 'L'}${x} ${f(y)} `; }
      const rx = 220, ry = 110 - 40 * Math.sin(2 * Math.PI * (rx / 160 - t / 1.5)) * Math.min(1, Math.max(0, (t * 110 - (rx - 20)) / 40));
      return `<rect width="${W}" height="${H}" fill="#f4f7fb"/><line x1="20" x2="380" y1="110" y2="110" stroke="#ccc" stroke-dasharray="4 4"/><path d="${d}" stroke="#1f5fa8" stroke-width="4" fill="none"/>` +
        `<circle cx="${rx}" cy="${f(ry)}" r="7" fill="#c0392b"/>` + person(16, 150, 0, '#1d2733') + arrow(260, 190, 340, 190, '#1d7a4c') + txt(300, 182, '波向右传', 'text-anchor="middle" font-size="13" fill="#1d7a4c"') + txt(200, 26, '红点：只上下振动', 'text-anchor="middle" font-size="14" fill="#c0392b"');
    } },
  'sound-wave': { title: '声音：空气一疏一密地传出去', caption: '喇叭的纸盆前后振动，推挤空气：小点挤在一起是“密部”，散开是“疏部”。每个空气小点只在原地附近来回晃，传出去的是振动。', duration: 6, still: 1,
    frame(t) {
      const cone = 60 + 8 * Math.sin(2 * Math.PI * t * 1.2); let dots = '';
      for (let i = 0; i < 26; i++) for (let j = 0; j < 7; j++) { const x0 = 80 + i * 12, x = x0 + 6 * Math.sin(2 * Math.PI * (t * 1.2 - (x0 - 70) / 100)) * Math.min(1, Math.max(0, (t * 120 - (x0 - 70)) / 30)); dots += `<circle cx="${f(x)}" cy="${50 + j * 20}" r="2.4" fill="${i === 12 && j === 3 ? '#c0392b' : '#34495e'}"/>`; }
      return `<rect width="${W}" height="${H}" fill="#f4f7fb"/><rect x="18" y="80" width="26" height="60" fill="#2c3e50"/><polygon points="44,80 ${f(cone)},40 ${f(cone)},180 44,140" fill="#7f8c8d"/>` + dots + txt(220, 20, '密 → 疏 → 密 → 疏 …… 向右传播', 'text-anchor="middle" font-size="14"');
    } },
  'heat-conduction': { title: '热传导：铁棒 vs 木棒', caption: '两根棒的左端都放在火上。铁里的“热”沿着粒子一个挤一个，很快传到右端；木头传热很慢。所以冬天摸铁栏杆觉得比木头凉——铁把你手上的热迅速带走了。', duration: 8, still: 5,
    frame(t) {
      const rod = (y, speed, name) => {
        let s = ''; for (let i = 0; i < 18; i++) { const x = 80 + i * 16, heat = clamp(t * speed - i, 0, 4) / 4, jig = heat * 3 * Math.sin(t * 25 + i * 1.7);
          const r = Math.round(90 + 165 * heat), g = Math.round(110 - 60 * heat), b = Math.round(140 - 110 * heat); s += `<circle cx="${f(x + jig)}" cy="${f(y + jig * 0.6)}" r="6" fill="rgb(${r},${g},${b})"/>`; }
        return `<rect x="70" y="${y - 12}" width="290" height="24" rx="6" fill="none" stroke="#888"/>${s}${txt(370, y + 5, name, 'font-size="14"')}`;
      };
      const flame = (y) => `<path d="M48 ${y + 24} q-14 -18 0 -40 q4 14 10 6 q10 16 -10 34z" fill="#e67e22"/><path d="M50 ${y + 22} q-6 -10 0 -20 q6 10 0 20z" fill="#f9e79f"/>`;
      return `<rect width="${W}" height="${H}" fill="#f4f7fb"/>` + flame(56) + flame(146) + rod(70, 4.2, '铁') + rod(160, 0.7, '木') + txt(200, 26, '颜色越红越热，粒子振动越剧烈', 'text-anchor="middle" font-size="14"');
    } }
};

export function renderFrame(id, t, value) {
  const anim = animations[id]; if (!anim) throw new Error(`Unknown physics animation ${id}`);
  const v = value ?? anim.slider?.value;
  return anim.frame(Math.max(0, t), v);
}

// Browser widget: <figure class="ph-anim"> with play/pause, replay and an optional slider.
// prefers-reduced-motion: nothing moves until the learner presses play; a still frame is shown instead.
export function mountAnimation(id, { still = false } = {}) {
  const anim = animations[id]; if (!anim) throw new Error(`Unknown physics animation ${id}`);
  const doc = document, figure = doc.createElement('figure'); figure.className = `ph-anim${still ? ' still' : ''}`; figure.dataset.anim = id;
  const svg = doc.createElementNS('http://www.w3.org/2000/svg', 'svg'); svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', `${anim.title}：${anim.caption}`);
  svg.setAttribute('font-family', '"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif');
  let value = anim.slider?.value, t = anim.still, playing = false, last = 0, raf = 0;
  const draw = () => { svg.innerHTML = anim.frame(t, value); figure.dataset.t = t.toFixed(2); };
  figure.append(svg);
  if (still) { draw(); return figure; }
  const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bar = doc.createElement('div'); bar.className = 'ph-anim-controls';
  const mk = (text, label, cls) => { const b = doc.createElement('button'); b.type = 'button'; b.className = `ph-btn ${cls}`; b.textContent = text; b.setAttribute('aria-label', label); bar.append(b); return b; };
  const toggle = mk('▶ 播放', '播放或暂停动画', 'ph-anim-toggle'), replay = mk('↺ 重播', '从头重播动画', 'ph-anim-replay');
  const tick = now => { if (!figure.isConnected && last) { playing = false; return; } if (!playing) return; if (last) t = (t + Math.min((now - last) / 1000, 0.1)) % anim.duration; last = now; draw(); raf = requestAnimationFrame(tick); };
  const play = () => { if (playing) return; playing = true; last = 0; toggle.textContent = '⏸ 暂停'; figure.dataset.playing = 'true'; raf = requestAnimationFrame(tick); };
  const pause = () => { playing = false; cancelAnimationFrame(raf); toggle.textContent = '▶ 播放'; figure.dataset.playing = 'false'; };
  toggle.addEventListener('click', () => playing ? pause() : play());
  replay.addEventListener('click', () => { t = 0; draw(); play(); });
  if (anim.slider) {
    const label = doc.createElement('label'); label.className = 'ph-anim-slider'; const input = doc.createElement('input'), out = doc.createElement('output');
    Object.assign(input, { type: 'range', min: anim.slider.min, max: anim.slider.max, step: anim.slider.step, value }); out.textContent = `${value} ${anim.slider.unit}`;
    input.addEventListener('input', () => { value = Number(input.value); out.textContent = `${value} ${anim.slider.unit}`; t = 0; draw(); if (!reduce) play(); });
    label.append(`${anim.slider.label} `, input, out); bar.append(label);
  }
  const cap = doc.createElement('figcaption'); cap.innerHTML = ''; const strong = doc.createElement('strong'); strong.textContent = `🎬 ${anim.title}`; cap.append(strong, doc.createElement('br'), anim.caption);
  figure.append(bar, cap); figure.dataset.reducedMotion = String(reduce); figure.dataset.playing = 'false';
  if (reduce) draw(); else { t = 0; draw(); queueMicrotask(play); }
  return figure;
}
