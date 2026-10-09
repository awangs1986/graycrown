// Gray Crown shared comic kit (English + French): every illustration is composed at runtime from these hand-authored SVG parts
// (places, a recurring original cast, everyday props). No raster images, no third-party characters.
export const INK = '#1d1a26';
export const S = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
export const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
export const r = (x, y, w, h, fill, extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${S} ${extra}/>`;
export const c = (x, y, rad, fill, extra = '') => `<circle cx="${x}" cy="${y}" r="${rad}" fill="${fill}" ${S} ${extra}/>`;
export const e = (x, y, rx, ry, fill, extra = '') => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${S} ${extra}/>`;
export const p = (d, fill = 'none', extra = '') => `<path d="${d}" fill="${fill}" ${S} ${extra}/>`;
export const t = (x, y, text, size = 12, extra = '') => `<text x="${x}" y="${y}" font-size="${size}" font-family="'Comic Neue','Comic Sans MS','Chalkboard SE','Marker Felt',sans-serif" font-weight="700" fill="${INK}" text-anchor="middle" ${extra}>${esc(text)}</text>`;
export const sky = (top = '#9fd8ff', bottom = '#e3f5ff') => `<rect width="400" height="250" fill="${bottom}"/><rect width="400" height="120" fill="${top}" opacity=".6"/>`;
export const wall = color => `<rect width="400" height="180" fill="${color}"/>`;
export const floor = (color, y = 180) => `<rect x="0" y="${y}" width="400" height="${250 - y}" fill="${color}"/><line x1="0" y1="${y}" x2="400" y2="${y}" ${S}/>`;
export const windowPane = (x, y, w = 70, h = 56) => `${r(x, y, w, h, '#bfe8ff')}<line x1="${x + w / 2}" y1="${y}" x2="${x + w / 2}" y2="${y + h}" ${S}/><line x1="${x}" y1="${y + h / 2}" x2="${x + w}" y2="${y + h / 2}" ${S}/>`;
export const tree = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${r(-6, -40, 12, 40, '#9a6a3c')}${c(0, -58, 28, '#5cc06a')}${c(-18, -46, 16, '#4fae5d')}${c(18, -46, 16, '#4fae5d')}</g>`;
export const building = (x, w, h, color) => `${r(x, 180 - h, w, h, color)}${Array.from({ length: Math.floor((h - 24) / 30) }, (_, row) => [0, 1].map(col => r(x + 10 + col * (w / 2 - 4), 180 - h + 14 + row * 30, w / 2 - 22, 16, '#fff7c2', 'stroke-width="2"')).join('')).join('')}`;

export const basePlaces = {
  home: () => `${wall('#ffe1b3')}${windowPane(250, 40)}${r(60, 46, 44, 34, '#fff')}${p('M66 74 L80 56 L90 68 L98 60 L98 74Z', '#7cc8f0', 'stroke-width="2"')}${floor('#d99a5b')}${r(20, 140, 120, 40, '#e86f6f')}${r(14, 126, 18, 54, '#d65b5b')}${r(128, 126, 18, 54, '#d65b5b')}`,
  kitchen: () => `${wall('#d4f1ec')}${Array.from({ length: 10 }, (_, i) => `<line x1="${i * 40}" y1="60" x2="${i * 40}" y2="130" stroke="#a9d8cf" stroke-width="2"/>`).join('')}${r(300, 40, 70, 140, '#f5f7fb')}<line x1="300" y1="95" x2="370" y2="95" ${S}/>${r(0, 130, 260, 50, '#f2b866')}${r(0, 124, 262, 10, '#fff')}${c(60, 124, 8, '#555', 'stroke-width="2"')}${c(90, 124, 8, '#555', 'stroke-width="2"')}${floor('#f6efe1')}`,
  classroom: () => `${wall('#fff1c4')}${r(90, 28, 220, 100, '#2f7a57')}<path d="M110 60 h60 M110 80 h90 M110 100 h40" stroke="#fff" stroke-width="3" opacity=".8"/>${r(84, 126, 232, 8, '#b98a52')}${floor('#c9a272')}${r(300, 150, 90, 12, '#d9a464')}${r(310, 162, 8, 26, '#8d6136')}${r(372, 162, 8, 26, '#8d6136')}`,
  shop: () => `${wall('#ffdbe6')}${[40, 80, 120].map(y => `${r(20, y, 160, 8, '#c68b59')}${[30, 62, 94, 126, 150].map((x, i) => r(x, y - 22, 20, 22, ['#ffd166', '#6ec6ff', '#a0e07a', '#ff9f80', '#c9a0ff'][(i + y / 40) % 5])).join('')}`).join('')}${r(240, 12, 130, 28, '#ffe45c')}${t(305, 32, 'CORNER SHOP', 14)}${floor('#e9d8c8')}${r(230, 130, 160, 50, '#7bc4c0')}`,
  street: () => `${sky()}${building(0, 90, 130, '#f4a3a3')}${building(96, 80, 100, '#a9c8ff')}${building(300, 100, 140, '#ffd38a')}${r(0, 180, 400, 70, '#8b93a1')}<line x1="0" y1="180" x2="400" y2="180" ${S}/>${[150, 180, 210, 240].map(x => r(x, 196, 18, 40, '#fff', 'stroke-width="2"')).join('')}${r(262, 70, 6, 110, '#556')}${c(265, 66, 10, '#ffe45c')}`,
  park: () => `${sky()}<path d="M0 150 Q100 110 200 140 T400 130 V250 H0Z" fill="#9fdc84" ${S}/>${tree(40, 182, 1.1)}${tree(360, 178, .9)}<path d="M150 250 Q190 200 260 180" stroke="#e8d3a2" stroke-width="26" fill="none"/>${floor('#8fd277', 196)}`,
  station: () => `${wall('#e5e0f8')}${r(150, 20, 100, 24, '#3a3f66')}<text x="200" y="38" font-size="13" fill="#ffe45c" text-anchor="middle" font-family="monospace" font-weight="700">PLATFORM 2</text>${r(0, 70, 400, 90, '#5aa9e6')}${[20, 120, 220, 320].map(x => r(x, 84, 70, 40, '#d9f1ff')).join('')}<line x1="0" y1="138" x2="400" y2="138" stroke="#ffe45c" stroke-width="6"/>${floor('#c8c3d9', 160)}${r(0, 160, 400, 8, '#ffe45c')}`,
  office: () => `${wall('#e1eaf4')}${windowPane(40, 30, 90, 70)}${r(150, 32, 70, 46, '#fff')}<path d="M158 70 l14 -16 l12 10 l16 -22" ${S} fill="none"/>${floor('#9aa6b5')}${r(230, 120, 160, 12, '#c48d58')}${r(270, 74, 70, 46, '#3a3f66')}${r(276, 80, 58, 34, '#8fe3ff', 'stroke-width="2"')}${r(240, 132, 8, 48, '#8d6136')}${r(372, 132, 8, 48, '#8d6136')}`,
  hospital: () => `${wall('#e4f6ee')}${r(170, 22, 60, 60, '#fff')}<path d="M192 32 h16 v18 h18 v16 h-18 v18 h-16 v-18 h-18 v-16 h18Z" transform="translate(0 -6) scale(1 .9)" fill="#ff6b6b" ${S}/>${floor('#cfe3dd')}${r(250, 130, 140, 30, '#fff')}${r(250, 112, 30, 30, '#bfe8ff')}${r(256, 160, 8, 26, '#99a')}${r(376, 160, 8, 26, '#99a')}`,
  cafe: () => `${wall('#f6dfc4')}${r(40, 26, 120, 70, '#3b3530')}<path d="M54 46 h70 M54 62 h50 M54 78 h80" stroke="#fff" stroke-width="3" opacity=".75"/>${[200, 240, 280, 320].map(x => `${r(x, 60, 26, 30, '#fff')}`).join('')}${r(190, 90, 160, 6, '#b98a52')}${floor('#a8744a')}${e(300, 168, 46, 8, '#fff')}${r(296, 168, 8, 20, '#555')}`,
  bedroom: () => `${wall('#e7e1ff')}${windowPane(60, 34)}${floor('#c8a27a')}${r(230, 120, 160, 50, '#fff')}${r(230, 140, 160, 30, '#8ec5ff')}${r(380, 96, 12, 84, '#9a6a3c')}${r(160, 120, 34, 50, '#d9a464')}${p('M168 98 h18 l-6 22 h-6Z', '#ffe45c')}`,
  airport: () => `${sky('#8fcfff')}${r(0, 24, 400, 130, '#cfe9ff', 'opacity=".6"')}${[0, 100, 200, 300, 400].map(x => `<line x1="${x}" y1="24" x2="${x}" y2="154" ${S}/>`).join('')}<path d="M210 90 l90 -10 l20 -14 l10 4 l-10 16 l40 4 l4 8 l-44 2 l-30 22 l-12 0 l14 -20 l-80 0Z" fill="#fff" ${S}/>${r(20, 34, 120, 40, '#2c2f4a')}<text x="80" y="58" font-size="12" fill="#ffe45c" text-anchor="middle" font-family="monospace" font-weight="700">DEPARTURES</text>${floor('#d9dde5', 154)}`,
  beach: () => `${sky('#7fd0ff', '#ffe9b0')}<path d="M0 130 Q100 120 200 132 T400 128 V170 H0Z" fill="#3fb3e6" ${S}/>${floor('#ffe0a0', 170)}${c(350, 40, 22, '#ffd23f')}`,
  library: () => `${wall('#f4ead7')}${[30, 80, 130].map(y => `${r(10, y, 380, 6, '#8d6136')}${Array.from({ length: 22 }, (_, i) => r(16 + i * 17, y - 26, 13, 26, ['#e5484d', '#3b82c4', '#2bb3a3', '#f2b866', '#9b6ad6'][i % 5], 'stroke-width="2"')).join('')}`).join('')}${floor('#b98a52')}`,
  countryside: () => `${sky()}<path d="M0 140 Q120 90 240 130 T400 120 V250 H0Z" fill="#b8e07a" ${S}/>${r(270, 90, 80, 60, '#ff9f80')}${p('M262 92 L310 58 L358 92Z', '#c0504d')}${r(300, 118, 20, 32, '#8d6136')}${[20, 50, 80, 110].map(x => r(x, 150, 6, 30, '#fff', 'stroke-width="2"')).join('')}<line x1="14" y1="160" x2="122" y2="160" ${S}/>${floor('#a6d36b', 190)}`
};

// Recurring original cast. Each design is drawn with the same proportions, outline and flat palette.
export const baseCast = {
  leo: { name: 'Leo', skin: '#f6c9a0', shirt: '#e5484d', pants: '#3b5bdb', hair: '#2b2b3a', style: 'spiky', extra: `${p('M-20 -76 Q0 -66 20 -76 L16 -66 Q0 -58 -16 -66Z', '#ffd23f')}` },
  mia: { name: 'Mia', skin: '#efbf8e', shirt: '#2bb3a3', pants: '#9b6ad6', hair: '#7a4a2a', style: 'ponytail', skirt: true },
  grant: { name: 'Mr Grant', skin: '#e9b48a', shirt: '#9a6a3c', pants: '#4a4a5a', hair: '#9aa0aa', style: 'side', glasses: true, mustache: true },
  rose: { name: 'Grandma Rose', skin: '#f3cfb0', shirt: '#ff8fb1', pants: '#7a6a8a', hair: '#f2f2f2', style: 'bun', glasses: true, skirt: true },
  sam: { name: 'Sam', skin: '#f6c9a0', shirt: '#ffd23f', pants: '#3b82c4', hair: '#ff8a3d', style: 'cap', scale: .78 },
  lin: { name: 'Dr Lin', skin: '#f1c79a', shirt: '#ffffff', pants: '#5b6b8a', hair: '#1d1a26', style: 'bob', extra: `${p('M-10 -76 Q-14 -54 0 -52 Q14 -54 10 -76', 'none', 'stroke="#3b82c4"')}` },
  ada: { name: 'Ada', skin: '#a8714a', shirt: '#7bc96f', pants: '#5c4033', hair: '#2b1a12', style: 'curly', extra: r(-16, -70, 32, 30, '#e8f7d8', 'stroke-width="2"') },
  bell: { name: 'Officer Bell', skin: '#e0a882', shirt: '#2c3e7a', pants: '#1f2a52', hair: '#3a2a1a', style: 'police' }
};
function hair(style, color) {
  const fill = color;
  switch (style) {
    case 'spiky': return p('M-27 -100 L-24 -126 L-13 -118 L-6 -136 L4 -121 L15 -134 L18 -118 L29 -122 L27 -98 Q4 -118 -27 -100Z', fill);
    case 'ponytail': return `${e(30, -112, 9, 18, fill)}${p('M-27 -98 Q-28 -132 0 -131 Q28 -132 27 -98 Q8 -118 -27 -98Z', fill)}`;
    case 'side': return `${p('M-27 -96 Q-29 -118 -17 -124 L-12 -108 Q-20 -104 -27 -96Z', fill)}${p('M27 -96 Q29 -118 17 -124 L12 -108 Q20 -104 27 -96Z', fill)}`;
    case 'bun': return `${c(0, -134, 11, fill)}${p('M-27 -96 Q-28 -130 0 -129 Q28 -130 27 -96 Q4 -112 -27 -96Z', fill)}`;
    case 'cap': return `${p('M-27 -104 Q-26 -132 0 -132 Q26 -132 27 -104Z', '#ff8a3d')}${p('M10 -106 L44 -104 L40 -98 L10 -100Z', '#ff8a3d')}`;
    case 'bob': return p('M-30 -84 Q-34 -134 0 -133 Q34 -134 30 -84 L20 -84 Q22 -112 0 -114 Q-22 -112 -20 -84Z', fill);
    case 'curly': return [-22, -11, 0, 11, 22].map((x, i) => c(x, -124 + (i % 2) * 4, 10, fill)).join('') + c(-27, -108, 8, fill) + c(27, -108, 8, fill);
    case 'police': return `${r(-28, -136, 56, 18, '#1f2a52')}${p('M-32 -118 H32 L28 -112 H-28Z', '#1f2a52')}${c(0, -127, 5, '#ffd23f', 'stroke-width="2"')}`;
    case 'beret': return `${p('M-27 -98 Q-28 -126 0 -126 Q28 -126 27 -98 Q4 -112 -27 -98Z', fill)}${p('M-30 -116 Q-26 -140 6 -140 Q34 -138 30 -118 Q0 -124 -30 -116Z', '#c23b3d')}${c(4, -141, 3, '#c23b3d', 'stroke-width="2"')}`;
    case 'chef': return `${p('M-24 -112 Q-34 -140 -14 -142 Q-4 -158 10 -146 Q30 -150 26 -128 L22 -112Z', '#fff')}${r(-24, -116, 48, 10, '#fff')}`;
    default: return '';
  }
}
function person(who, x, { pose = 'stand', mood = 'happy', flip = false } = {}) {
  const s = who.scale ?? 1;
  const arm = pose === 'wave' ? 'M18 -70 Q34 -84 36 -108' : pose === 'point' ? 'M18 -68 L50 -72' : pose === 'hold' ? 'M18 -68 Q34 -60 30 -50' : 'M18 -70 Q28 -56 26 -42';
  const hand = pose === 'wave' ? [36, -110] : pose === 'point' ? [52, -72] : pose === 'hold' ? [30, -50] : [26, -42];
  const mouth = mood === 'surprised' ? e(0, -90, 4, 5, '#7a2a2a', 'stroke-width="2"') : mood === 'worried' ? p('M-6 -88 Q0 -93 6 -88', 'none', 'stroke-width="2.5"') : p('M-8 -92 Q0 -84 8 -92', '#fff', 'stroke-width="2.5"');
  const bottom = who.skirt ? p('M-22 -40 L-26 -16 H26 L22 -40Z', who.pants) + r(-12, -16, 7, 16, who.skin) + r(5, -16, 7, 16, who.skin) : r(-15, -42, 12, 42, who.pants) + r(3, -42, 12, 42, who.pants);
  return `<g transform="translate(${x} 236) scale(${flip ? -s : s} ${s})">
${e(0, 2, 30, 5, '#00000022', 'stroke="none"')}${bottom}${e(-9, 0, 10, 5, INK)}${e(9, 0, 10, 5, INK)}
${p('M-20 -76 Q-24 -40 -22 -38 H22 Q24 -40 20 -76 Q0 -84 -20 -76Z', who.shirt)}${who.extra ?? ''}
${p('M-18 -70 Q-28 -56 -26 -42', 'none', 'stroke-width="7"')}${p('M-18 -70 Q-28 -56 -26 -42', 'none', `stroke="${who.shirt}" stroke-width="3.5"`)}${c(-26, -41, 5, who.skin, 'stroke-width="2"')}
${p(arm, 'none', 'stroke-width="7"')}${p(arm, 'none', `stroke="${who.shirt}" stroke-width="3.5"`)}${c(hand[0], hand[1], 5, who.skin, 'stroke-width="2"')}
${c(0, -102, 26, who.skin)}${hair(who.style, who.hair)}
${c(-9, -103, 3.2, INK, 'stroke="none"')}${c(9, -103, 3.2, INK, 'stroke="none"')}${c(-16, -94, 4, '#ff8fa3', 'stroke="none" opacity=".55"')}${c(16, -94, 4, '#ff8fa3', 'stroke="none" opacity=".55"')}${mouth}
${who.glasses ? `${c(-9, -103, 7, 'none', 'stroke-width="2"')}${c(9, -103, 7, 'none', 'stroke-width="2"')}<line x1="-2" y1="-103" x2="2" y2="-103" ${S} stroke-width="2"/>` : ''}
${who.mustache ? p('M-10 -94 Q-4 -98 0 -95 Q4 -98 10 -94 Q4 -91 0 -93 Q-4 -91 -10 -94Z', '#9aa0aa', 'stroke-width="2"') : ''}
</g>`;
}
// Mr Muddle: an original trickster who scrambles words. He is the "enemy" of every comic battle.
export function muddle(x, y = 236, s = 1, style = 'tophat') {
  return `<g transform="translate(${x} ${y}) scale(${s})">${e(0, 2, 34, 5, '#00000022', 'stroke="none"')}
${p('M-34 -20 Q-46 -48 -28 -62 Q-30 -92 -2 -90 Q20 -104 34 -80 Q54 -68 40 -44 Q50 -18 26 -10 Q0 4 -20 -6 Q-40 -4 -34 -20Z', '#a99be0')}
${style === 'beret' ? `${p('M-36 -86 Q-34 -118 4 -116 Q42 -112 36 -86 Q0 -96 -36 -86Z', '#2a2440')}${c(4, -118, 4, '#2a2440')}${p('M-24 -46 Q-12 -40 0 -46 Q12 -40 24 -46', 'none', 'stroke-width="3"')}` : `${r(-20, -122, 40, 32, '#2a2440')}${r(-30, -94, 60, 8, '#2a2440')}${r(-20, -102, 40, 6, '#ff6b6b', 'stroke-width="2"')}`}
${p('M-16 -56 m-7 0 a7 7 0 1 0 14 0 a4 4 0 1 0 -8 0', '#fff', 'stroke-width="2.5"')}${p('M14 -56 m-7 0 a7 7 0 1 0 14 0 a4 4 0 1 0 -8 0', '#fff', 'stroke-width="2.5"')}
${p('M-14 -34 Q0 -22 16 -36', '#fff', 'stroke-width="2.5"')}${t(52, -88, '?!', 20)}</g>`;
}

// Everyday props. Keywords let a question's English text pick the matching picture automatically.
export const baseProps = {
  umbrella: ['umbrella', () => `${p('M-26 -40 Q0 -70 26 -40 Q13 -46 0 -40 Q-13 -46 -26 -40Z', '#e5484d')}${p('M0 -40 V-6 Q0 0 -6 -2', 'none')}`],
  pen: ['pen|pencil|write|wrote|written', () => `<g transform="rotate(-35)">${r(-4, -46, 8, 40, '#3b82c4')}${p('M-4 -6 L0 4 L4 -6Z', '#ffe0a0')}</g>`],
  book: ['book|read|story|novel|library|dictionary|homework', () => `${r(-24, -34, 22, 30, '#e5484d')}${r(2, -34, 22, 30, '#3b82c4')}${p('M-2 -34 V-4', 'none')}`],
  watch: ['watch|time|o\'clock|late|early|minute|hour|clock', () => `${c(0, -26, 18, '#fff')}${p('M0 -26 V-38 M0 -26 L9 -22', 'none')}${r(-5, -48, 10, 6, '#ffd23f', 'stroke-width="2"')}`],
  coat: ['coat|jacket|cold|winter', () => p('M-18 -46 L-6 -50 L0 -40 L6 -50 L18 -46 L24 -4 H-24Z', '#8c6fd1')],
  dress: ['dress|skirt|blouse', () => p('M-10 -48 H10 L8 -34 L22 -2 H-22 L-8 -34Z', '#ff8fb1')],
  shirt: ['shirt|tie|t-shirt|clothes|wear', () => p('M-20 -44 L-8 -48 Q0 -40 8 -48 L20 -44 L28 -32 L18 -28 V-2 H-18 V-28 L-28 -32Z', '#7bc4ff')],
  hat: ['hat|cap', () => `${e(0, -12, 26, 6, '#2a2440')}${r(-14, -36, 28, 24, '#2a2440')}${r(-14, -18, 28, 5, '#ff6b6b', 'stroke-width="2"')}`],
  shoes: ['shoe|shoes|boots', () => `${p('M-26 -4 V-16 Q-18 -18 -12 -12 L-2 -8 V-4Z', '#9a6a3c')}${p('M2 -4 V-16 Q10 -18 16 -12 L26 -8 V-4Z', '#9a6a3c')}`],
  bag: ['bag|handbag|backpack|suitcase|luggage|case', () => `${r(-22, -34, 44, 32, '#f2b866', 'rx="6"')}${p('M-10 -34 Q0 -50 10 -34', 'none')}`],
  key: ['key|keys|lock|door', () => `${c(-12, -24, 9, '#ffd23f')}${p('M-3 -24 H22 M14 -24 V-16 M20 -24 V-18', 'none')}`],
  car: ['car|drive|drove|taxi|garage', () => `${p('M-34 -12 V-24 L-20 -26 L-12 -38 H12 L22 -26 L34 -22 V-12Z', '#ff6b6b')}${c(-18, -10, 7, '#333')}${c(18, -10, 7, '#333')}${r(-8, -34, 16, 8, '#bfe8ff', 'stroke-width="2"')}`],
  bus: ['bus|coach', () => `${r(-34, -44, 68, 36, '#ffd23f', 'rx="6"')}${[-26, -8, 10].map(x => r(x, -38, 14, 12, '#bfe8ff', 'stroke-width="2"')).join('')}${c(-20, -8, 7, '#333')}${c(20, -8, 7, '#333')}`],
  bike: ['bike|bicycle|cycle|ride', () => `${c(-18, -14, 12, 'none')}${c(18, -14, 12, 'none')}${p('M-18 -14 L-4 -34 L10 -14 Z M-4 -34 H12 L18 -14 M8 -40 H16', 'none', `stroke="#e5484d"`)}`],
  train: ['train|station|platform|railway', () => `${r(-34, -46, 68, 38, '#5aa9e6', 'rx="8"')}${r(-24, -38, 20, 14, '#fff', 'stroke-width="2"')}${r(4, -38, 20, 14, '#fff', 'stroke-width="2"')}${c(-18, -6, 6, '#333')}${c(18, -6, 6, '#333')}`],
  plane: ['plane|flight|fly|flew|airport|abroad', () => p('M-34 -24 L20 -28 L30 -40 L36 -38 L30 -24 L36 -20 L30 -18 L-30 -14Z', '#fff')],
  ticket: ['ticket|tickets|passport', () => `${r(-26, -30, 52, 26, '#ffe45c')}${p('M6 -30 V-4', 'none', 'stroke-dasharray="3 4" stroke-width="2"')}${t(-10, -12, 'TICKET', 8)}`],
  phone: ['phone|call|telephone|rang|ring|message|text', () => `${r(-12, -46, 24, 42, '#2a2440', 'rx="5"')}${r(-8, -40, 16, 28, '#8fe3ff', 'stroke-width="2"')}`],
  computer: ['computer|laptop|email|internet|online|screen', () => `${r(-26, -44, 52, 32, '#3a3f66')}${r(-21, -39, 42, 22, '#8fe3ff', 'stroke-width="2"')}${p('M-32 -6 H32 L26 -12 H-26Z', '#c9cfdb')}`],
  tv: ['television|tv|film|programme|watch tv', () => `${r(-30, -46, 60, 38, '#2a2440', 'rx="4"')}${r(-24, -40, 48, 26, '#9fd8ff', 'stroke-width="2"')}${p('M-10 -8 L-16 0 M10 -8 L16 0', 'none')}`],
  camera: ['camera|photo|picture|photograph', () => `${r(-24, -34, 48, 30, '#555b6e', 'rx="5"')}${c(0, -19, 10, '#9fd8ff')}${r(-18, -40, 14, 6, '#555b6e', 'stroke-width="2"')}`],
  letter: ['letter|post|postcard|envelope|stamp|parcel', () => `${r(-26, -34, 52, 30, '#fff')}${p('M-26 -34 L0 -16 L26 -34', 'none')}${r(14, -32, 9, 9, '#e5484d', 'stroke-width="2"')}`],
  newspaper: ['newspaper|news|magazine|article|report', () => `${r(-26, -40, 52, 36, '#f4f4f4')}${t(0, -27, 'NEWS', 10)}${p('M-20 -20 H20 M-20 -13 H8', 'none', 'stroke-width="2"')}`],
  cup: ['tea|coffee|cup|mug|drink', () => `${p('M-16 -34 H16 L12 -4 H-12Z', '#fff')}${p('M16 -28 Q28 -26 14 -14', 'none')}${p('M-6 -42 q4 -6 0 -10 M6 -42 q4 -6 0 -10', 'none', 'stroke-width="2" opacity=".6"')}`],
  teapot: ['teapot|kettle|boil', () => `${e(0, -22, 22, 18, '#7bc4c0')}${p('M20 -26 Q34 -32 34 -40', 'none')}${p('M-20 -28 Q-34 -24 -24 -12', 'none')}${c(0, -42, 4, '#7bc4c0')}`],
  milk: ['milk|bottle|water|juice', () => `${p('M-10 -48 H10 V-40 L16 -30 V-2 H-16 V-30 L-10 -40Z', '#fff')}${r(-16, -26, 32, 12, '#7bc4ff', 'stroke-width="2"')}`],
  apple: ['apple|fruit|orange|banana', () => `${c(0, -20, 16, '#ff5d5d')}${p('M0 -36 Q2 -44 6 -46', 'none')}${e(8, -40, 6, 3, '#5cc06a', 'stroke-width="2"')}`],
  bread: ['bread|sandwich|toast|cake|breakfast|lunch|dinner|meal|food|eat|ate|cook|hungry', () => `${p('M-26 -8 V-26 Q-26 -40 -10 -40 H10 Q26 -40 26 -26 V-8Z', '#f2b866')}${p('M-12 -32 l6 -4 M2 -32 l6 -4', 'none', 'stroke-width="2"')}`],
  egg: ['egg|eggs|butter|cheese|kitchen', () => `${e(-10, -10, 14, 8, '#fff')}${c(-10, -10, 5, '#ffd23f', 'stroke-width="2"')}${e(14, -16, 9, 12, '#fff3d6')}`],
  icecream: ['ice cream|ice-cream|sweet|dessert', () => `${p('M-12 -30 L0 0 L12 -30Z', '#f2b866')}${c(0, -36, 13, '#ff8fb1')}`],
  money: ['money|pound|pounds|dollar|price|cost|pay|paid|cheap|expensive|buy|bought|sell|sold|shop|shopping', () => `${r(-26, -30, 40, 22, '#a0e07a')}${t(-6, -14, '£', 14)}${c(18, -12, 9, '#ffd23f')}`],
  gift: ['gift|present|birthday|party', () => `${r(-22, -32, 44, 30, '#9b6ad6')}${r(-4, -32, 8, 30, '#ffd23f', 'stroke-width="2"')}${p('M0 -32 Q-14 -48 -4 -46 Q0 -40 0 -32 Q0 -40 4 -46 Q14 -48 0 -32', '#ffd23f', 'stroke-width="2"')}`],
  flower: ['flower|flowers|garden|rose', () => `${p('M0 0 V-30', 'none', 'stroke="#3d9b4c"')}${[0, 72, 144, 216, 288].map(a => c(Math.cos(a * Math.PI / 180) * 9, -38 + Math.sin(a * Math.PI / 180) * 9, 7, '#ff8fb1', 'stroke-width="2"')).join('')}${c(0, -38, 5, '#ffd23f', 'stroke-width="2"')}`],
  dog: ['dog|puppy|pet', () => `${e(0, -18, 22, 13, '#d99a5b')}${c(20, -32, 11, '#d99a5b')}${e(16, -40, 4, 8, '#9a6a3c', 'stroke-width="2"')}${c(23, -33, 2, INK, 'stroke="none"')}${p('M-14 -6 V2 M12 -6 V2 M-22 -22 Q-30 -30 -28 -36', 'none')}`],
  cat: ['cat|kitten', () => `${e(0, -16, 18, 13, '#9aa0aa')}${c(14, -32, 10, '#9aa0aa')}${p('M7 -38 L8 -48 L13 -40 M17 -40 L22 -48 L22 -37', '#9aa0aa', 'stroke-width="2"')}${p('M-18 -16 Q-30 -30 -22 -40', 'none')}`],
  chair: ['chair|sit|sat|seat', () => `${r(-16, -54, 6, 52, '#b98a52')}${r(-16, -26, 32, 6, '#b98a52')}${r(10, -20, 6, 18, '#b98a52')}`],
  table: ['table|desk|on the table', () => `${r(-34, -32, 68, 8, '#c48d58')}${r(-28, -24, 6, 22, '#8d6136')}${r(22, -24, 6, 22, '#8d6136')}`],
  bed: ['bed|sleep|slept|tired|bedroom|wake|woke|get up|got up', () => `${r(-34, -26, 68, 16, '#8ec5ff')}${r(-34, -40, 10, 38, '#9a6a3c')}${e(-18, -30, 9, 5, '#fff', 'stroke-width="2"')}`],
  ball: ['ball|football|tennis|play|game|sport|match|team', () => `${c(0, -16, 16, '#fff')}${p('M0 -32 L6 -20 L-6 -14 L-12 -26 M6 -20 L14 -12 M-6 -14 L-4 -1', 'none', 'stroke-width="2"')}`],
  guitar: ['guitar|music|song|sing|sang|piano|concert', () => `${e(-6, -14, 14, 12, '#f2b866')}${c(-6, -14, 4, INK, 'stroke="none"')}${r(4, -48, 6, 30, '#9a6a3c', 'transform="rotate(30 6 -30)"')}`],
  glasses: ['glasses|eyes|see|saw|look', () => `${c(-12, -18, 10, '#bfe8ff')}${c(12, -18, 10, '#bfe8ff')}${p('M-2 -18 H2 M-22 -20 L-30 -24 M22 -20 L30 -24', 'none')}`],
  medicine: ['medicine|ill|sick|doctor|hospital|headache|temperature|cold|pill|nurse|hurt', () => `${r(-12, -38, 24, 36, '#fff', 'rx="4"')}${r(-12, -38, 24, 8, '#ff6b6b', 'stroke-width="2"')}${p('M-4 -18 H4 M0 -22 V-14', 'none', 'stroke="#ff6b6b"')}`],
  map: ['map|way|where|street|turn|left|right|corner|direction|near', () => `${p('M-30 -40 L-10 -34 L10 -40 L30 -34 V-4 L10 -10 L-10 -4 L-30 -10Z', '#fff3c4')}${p('M-22 -24 Q-6 -34 4 -22 T22 -18', 'none', 'stroke="#e5484d" stroke-dasharray="3 4"')}`],
  calendar: ['calendar|monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|month|date|tomorrow|yesterday|ago|next', () => `${r(-24, -40, 48, 38, '#fff')}${r(-24, -40, 48, 10, '#ff6b6b', 'stroke-width="2"')}${t(0, -10, '7', 16)}`],
  window: ['window|open|close|shut', () => windowPane(-26, -48, 52, 44)],
  house: ['house|home|flat|room|live|lived', () => `${r(-24, -32, 48, 30, '#ffd38a')}${p('M-30 -30 L0 -54 L30 -30Z', '#e5484d')}${r(-6, -18, 12, 16, '#9a6a3c', 'stroke-width="2"')}`],
  sun: ['sun|sunny|hot|warm|fine|summer|weather', () => `${c(0, -30, 16, '#ffd23f')}${Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4; return `<line x1="${Math.cos(a) * 22}" y1="${-30 + Math.sin(a) * 22}" x2="${Math.cos(a) * 30}" y2="${-30 + Math.sin(a) * 30}" ${S}/>`; }).join('')}`],
  rain: ['rain|raining|rained|wet|storm|cloud|cloudy|wind|windy', () => `${p('M-28 -30 Q-30 -46 -14 -46 Q-8 -60 8 -54 Q26 -56 26 -40 Q34 -28 20 -26 H-20 Q-30 -24 -28 -30Z', '#dfe7f2')}${[-16, 0, 16].map(x => p(`M${x} -18 l-4 10`, 'none', 'stroke="#3b82c4"')).join('')}`],
  snow: ['snow|snowing|ice|freezing', () => `${[[-14, -30], [10, -40], [16, -16]].map(([x, y]) => `<g transform="translate(${x} ${y})">${p('M-8 0 H8 M0 -8 V8 M-6 -6 L6 6 M6 -6 L-6 6', 'none', 'stroke="#3b82c4" stroke-width="2.5"')}</g>`).join('')}`],
  tree: ['tree|park|forest|wood|countryside|farm', () => `<g transform="scale(.55)">${tree(0, 0)}</g>`],
  boat: ['boat|ship|sea|river|swim|swam|beach|holiday', () => `${p('M-32 -16 H32 L22 -2 H-22Z', '#ff9f80')}${p('M0 -16 V-54 L24 -22Z', '#fff')}`],
  police: ['police|thief|stole|stolen|steal|crime|policeman', () => `${p('M0 -46 L20 -38 Q20 -12 0 -2 Q-20 -12 -20 -38Z', '#2c3e7a')}${c(0, -26, 7, '#ffd23f', 'stroke-width="2"')}`],
  bell: ['bell|alarm', () => `${p('M-18 -10 Q-18 -44 0 -44 Q18 -44 18 -10Z', '#ffd23f')}${c(0, -6, 5, '#ffd23f')}`]
};
const skyProps = new Set(['sun', 'rain', 'snow', 'plane']), wallProps = new Set(['calendar', 'window', 'newspaper', 'clock', 'menuBoard']);
function bubble(text, x, tailX) {
  const words = String(text).split(' '), lines = [''];
  if (/[\u3000-\u9fff\uff00-\uffef]/.test(text)) { const chars = [...String(text)]; lines.length = 0; for (let i = 0; i < chars.length && lines.length < 3; i += 15) lines.push(chars.slice(i, i + 15).join('') + (i + 15 < chars.length && lines.length === 2 ? '…' : '')); words.length = 0; }
  for (const word of words) { if ((lines.at(-1) + ' ' + word).trim().length > 26 && lines.length < 3) lines.push(word); else lines[lines.length - 1] = (lines.at(-1) + ' ' + word).trim(); }
  const width = line => [...line].reduce((sum, ch) => sum + (ch.charCodeAt(0) > 255 ? 13 : 7.4), 0);
  const w = Math.min(230, Math.max(70, Math.max(...lines.map(width)) + 24)), h = 14 + lines.length * 16;
  const left = Math.max(8, Math.min(392 - w, x - w / 2));
  return `<g>${p(`M${left + 8} 10 H${left + w - 8} Q${left + w} 10 ${left + w} 18 V${10 + h - 8} Q${left + w} ${10 + h} ${left + w - 8} ${10 + h} H${Math.min(left + w - 16, tailX + 10)} L${tailX} ${h + 28} L${Math.max(left + 16, tailX - 6)} ${10 + h} H${left + 8} Q${left} ${10 + h} ${left} ${10 + h - 8} V18 Q${left} 10 ${left + 8} 10Z`, '#fff')}${lines.map((line, i) => t(left + w / 2, 30 + i * 16, line, 13)).join('')}</g>`;
}
// Keyword rules work for accented words too (French), so word boundaries are Unicode letter lookarounds.
const keywordRule = words => new RegExp(`(?<!\\p{L})(?:${words})(?!\\p{L})`, 'iu');
let serial = 0;
/**
 * Build a course-specific comic kit from shared parts.
 * @param {{places?:object, cast?:object, props?:object, keywords?:Record<string,string>, defaultPlace?:string, defaultHero?:string, villainStyle?:string}} options
 *  props: name -> [englishKeywords, draw]; keywords: optional name -> keyword list overriding the prop's own (e.g. French words).
 */
export function createComicKit({ places = basePlaces, cast = baseCast, props = baseProps, keywords, defaultPlace = 'street', defaultHero = 'leo', villainStyle = 'tophat' } = {}) {
  const castNames = Object.fromEntries(Object.entries(cast).map(([id, value]) => [id, value.name]));
  const propNames = Object.keys(props);
  const rules = Object.entries(props).map(([name, [words]]) => [name, keywords ? keywords[name] : words]).filter(([, words]) => words).map(([name, words]) => [name, keywordRule(words)]);
  function propsFor(text, limit = 2) {
    const found = [];
    for (const [name, rule] of rules) if (rule.test(text) && !found.includes(name)) found.push(name);
    return found.slice(0, limit);
  }
  const drawProp = (name, x, y, s = 1.15) => props[name] ? `<g transform="translate(${x} ${y}) scale(${s})">${props[name][1]()}</g>` : '';
  /** Compose one panel. scene: {place, cast, props, bubble, caption, villain, burst, label, pose, mood} */
  function comicPanel(scene = {}) {
    const id = `hc${++serial}`;
    const place = places[scene.place] ? scene.place : defaultPlace;
    const people = (scene.cast?.length ? scene.cast : [defaultHero]).slice(0, scene.villain ? 2 : 3);
    const slots = people.length === 1 ? [110] : people.length === 2 ? [90, 310] : [70, 200, 330];
    const peopleSvg = people.map((who, i) => person(cast[who] ?? cast[defaultHero], scene.villain && i === 1 ? 200 : slots[i], { pose: i === 0 ? (scene.pose ?? 'wave') : 'stand', flip: slots[i] > 200 && !(scene.villain && i === 1), mood: scene.mood ?? 'happy' })).join('');
    const items = (scene.props ?? []).filter(name => props[name]).slice(0, 3);
    const floorSpots = people.length === 1 ? [[230, 222], [310, 222], [370, 222]] : people.length === 2 ? [[200, 224], [160, 230], [244, 230]] : [[135, 230], [265, 230], [380, 232]];
    let floorIndex = 0;
    const propSvg = items.map(name => skyProps.has(name) ? drawProp(name, 350, 98, 1.1) : wallProps.has(name) ? drawProp(name, 200, 120, 1.1) : drawProp(name, ...floorSpots[floorIndex++ % floorSpots.length], people.length === 1 ? 1.5 : 1.2)).join('');
    const capWidth = Math.min(300, [...String(scene.caption ?? '')].reduce((sum, ch) => sum + (ch.charCodeAt(0) > 255 ? 13 : 7.4), 0) + 20);
    const caption = scene.caption ? `<g>${r(8, 214, capWidth, 28, '#ffe45c', 'stroke-width="2.5"')}${t(8 + capWidth / 2, 233, scene.caption, 12)}</g>` : '';
    const burst = scene.burst ? `<g transform="translate(330 60)">${p('M0 -40 L10 -18 L34 -26 L20 -6 L40 6 L16 12 L22 36 L2 20 L-14 38 L-14 14 L-38 12 L-20 -4 L-34 -24 L-10 -18Z', '#ffd23f')}${t(0, 6, scene.burst, 13)}</g>` : '';
    const speech = scene.bubble ? bubble(scene.bubble, slots[0] + 40, slots[0] + 8) : '';
    return `<svg class="comic-panel" viewBox="0 0 400 250" role="img" aria-label="${esc(scene.label ?? '漫画插图')}" xmlns="http://www.w3.org/2000/svg">
<defs><pattern id="${id}-dots" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.3" fill="${INK}" opacity=".13"/></pattern><clipPath id="${id}-clip"><rect x="3" y="3" width="394" height="244" rx="6"/></clipPath></defs>
<g clip-path="url(#${id}-clip)">${places[place]()}<rect width="400" height="250" fill="url(#${id}-dots)"/>${propSvg}${scene.villain ? muddle(330, 236, .95, villainStyle) : ''}${peopleSvg}${speech}${burst}${caption}</g>
<rect x="3" y="3" width="394" height="244" rx="6" fill="none" stroke="${INK}" stroke-width="6"/></svg>`;
  }
  return { places, cast, props, castNames, propNames, propsFor, comicPanel };
}
