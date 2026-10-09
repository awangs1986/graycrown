// Français · Paris en BD: Paris/French-themed scenes, an original recurring cast and French keywords,
// all composed from the shared comic kit (same ink outline, flat palette and halftone as English).
// No raster images, no third-party or franchise characters.
import { createComicKit, baseProps, INK, S, r, c, e, p, t, sky, wall, floor, windowPane, tree } from '../shared/comic-kit.mjs';

const BLEU = '#2b4c9b', ROUGE = '#c23b3d', CREME = '#f4efe4';
const awning = (x, w, y, a = ROUGE, b = '#fff') => `${Array.from({ length: Math.ceil(w / 20) }, (_, i) => `<rect x="${x + i * 20}" y="${y}" width="${Math.min(20, w - i * 20)}" height="22" fill="${i % 2 ? b : a}"/>`).join('')}${p(`M${x} ${y} H${x + w} V${y + 22} ${Array.from({ length: Math.ceil(w / 20) }, (_, i) => `Q${x + w - i * 20 - 10} ${y + 32} ${x + w - (i + 1) * 20} ${y + 22}`).join(' ')} Z`, 'none')}`;
const sign = (x, y, w, label, bg = BLEU, ink = '#fff', size = 14) => `${r(x, y, w, 26, bg)}<text x="${x + w / 2}" y="${y + 18}" font-size="${size}" font-family="Georgia,'Times New Roman',serif" font-weight="700" fill="${ink}" text-anchor="middle" letter-spacing="1.5">${label}</text>`;
const haussmann = (x, w, h, color = '#f1e3c6') => `${r(x, 180 - h, w, h, color)}${p(`M${x - 4} ${180 - h} L${x + 10} ${166 - h} H${x + w - 10} L${x + w + 4} ${180 - h}Z`, '#6f7d96')}${Array.from({ length: Math.floor((h - 30) / 34) }, (_, row) => [0, 1, 2].map(col => `${r(x + 8 + col * (w - 16) / 3, 180 - h + 12 + row * 34, (w - 16) / 3 - 8, 20, '#bfe8ff', 'stroke-width="2"')}<line x1="${x + 6 + col * (w - 16) / 3}" y1="${180 - h + 34 + row * 34}" x2="${x + (col + 1) * (w - 16) / 3}" y2="${180 - h + 34 + row * 34}" stroke="${INK}" stroke-width="2"/>`).join('')).join('')}`;
const eiffel = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${p('M0 -120 L-6 -80 L-14 -40 L-30 0 H-18 Q0 -24 18 0 H30 L14 -40 L6 -80Z', '#8a6f5a', 'stroke-width="2.5"')}${p('M-12 -40 H12 M-6 -80 H6', 'none', 'stroke-width="2.5"')}</g>`;
const lamp = x => `${r(x - 3, 90, 6, 90, '#33405c')}${p(`M${x - 10} 90 H${x + 10} L${x + 6} 74 H${x - 6}Z`, '#ffe9a0')}`;
const bistroTable = x => `${e(x, 168, 26, 6, '#fff')}${r(x - 3, 168, 6, 22, '#555')}${p(`M${x - 40} 196 V160 M${x - 40} 178 H${x - 26} V196`, 'none', 'stroke="#9a6a3c" stroke-width="4"')}`;

const places = {
  rue: () => `${sky()}${eiffel(330, 150, .9)}${haussmann(0, 120, 140)}${haussmann(128, 110, 120, '#efe0c0')}${r(0, 180, 400, 70, '#b9b2a6')}<line x1="0" y1="180" x2="400" y2="180" ${S}/>${Array.from({ length: 10 }, (_, i) => `<path d="M${i * 44} 210 h30" stroke="#9a9388" stroke-width="3"/>`).join('')}${lamp(262)}${sign(140, 150, 80, 'RUE', BLEU, '#fff', 11)}`,
  cafe: () => `${wall('#f6dfc4')}${r(20, 30, 230, 150, '#7a2f2f')}${awning(14, 242, 30)}${sign(70, 64, 130, 'CAFÉ', '#1d1a26', '#ffe9a0', 16)}${windowPane(40, 98, 80, 60)}${windowPane(150, 98, 80, 60)}${floor('#c8b49a')}${bistroTable(300)}${bistroTable(370)}${r(270, 40, 100, 70, '#2a2a2a')}<path d="M282 60 h60 M282 76 h40 M282 92 h70" stroke="#fff" stroke-width="3" opacity=".8"/>`,
  boulangerie: () => `${wall('#efe6d6')}${r(20, 24, 360, 156, BLEU)}${sign(110, 34, 180, 'BOULANGERIE', CREME, BLEU, 15)}${r(40, 74, 320, 70, '#fff7e0')}${[60, 110, 160].map(x => `<g transform="translate(${x} 128) rotate(-12)">${p('M-22 -6 Q-24 -16 -14 -16 H22 Q30 -14 26 -4 Q20 2 -16 2Z', '#e3a857')}<path d="M-10 -14 l6 8 M2 -14 l6 8 M14 -14 l6 8" stroke="${INK}" stroke-width="2"/></g>`).join('')}${[240, 290, 330].map(x => `<g transform="translate(${x} 130)">${p('M-18 0 Q-22 -18 0 -20 Q22 -18 18 0 Q0 -6 -18 0Z', '#f2b866')}<path d="M-8 -16 Q-4 -6 -8 0 M6 -18 Q2 -8 6 0" stroke="${INK}" stroke-width="2" fill="none"/></g>`).join('')}${floor('#d9c7a8')}${r(0, 180, 400, 6, '#9a6a3c')}`,
  metro: () => `${wall('#f3f3ee')}${Array.from({ length: 14 }, (_, i) => Array.from({ length: 6 }, (_, j) => `<rect x="${i * 30}" y="${j * 20}" width="28" height="18" rx="6" fill="#fff" stroke="#c9c9c0" stroke-width="1.5"/>`).join('')).join('')}${p('M120 110 V34 Q200 -6 280 34 V110', 'none', 'stroke="#2f6b4f" stroke-width="8"')}${sign(150, 26, 100, 'MÉTRO', '#2f6b4f', '#ffe9a0', 15)}${r(0, 112, 400, 56, '#3b6fb6')}${[20, 120, 220, 320].map(x => r(x, 122, 70, 30, '#d9f1ff')).join('')}<line x1="0" y1="164" x2="400" y2="164" stroke="#ffe45c" stroke-width="5"/>${floor('#8e8a84', 170)}`,
  marche: () => `${sky('#a9dcff')}${haussmann(0, 400, 150, '#f3e7cf')}${[0, 135, 270].map((x, i) => `${awning(x + 4, 126, 96, ['#2f8f5b', ROUGE, BLEU][i])}${r(x + 10, 150, 114, 34, '#c48d58')}${[0, 1, 2, 3, 4].map(k => c(x + 24 + k * 22, 148, 9, ['#ff5d5d', '#ffb347', '#7bc96f', '#ffd23f', '#9b6ad6'][(k + i) % 5], 'stroke-width="2"')).join('')}`).join('')}${floor('#cbbfae', 184)}${sign(150, 52, 100, 'MARCHÉ', '#fff', ROUGE, 14)}`,
  gare: () => `${wall('#e9e4da')}${p('M0 120 Q200 -40 400 120', '#cfe5f2')}${[60, 130, 200, 270, 340].map(x => `<line x1="${x}" y1="${x < 200 ? 120 - (x / 200) * 110 : 120 - ((400 - x) / 200) * 110}" x2="${x}" y2="130" stroke="${INK}" stroke-width="2"/>`).join('')}${c(200, 56, 18, '#fff')}${p('M200 56 V44 M200 56 L209 60', 'none')}${r(20, 64, 110, 30, '#1d1a26')}<text x="75" y="84" font-size="12" fill="#ffd23f" text-anchor="middle" font-family="monospace" font-weight="700">DÉPARTS</text>${r(0, 120, 400, 50, '#d9dee6')}${p('M40 168 V128 Q40 120 50 120 H360 L392 140 V168Z', '#e9eef5')}${r(60, 130, 260, 16, '#bfe8ff', 'stroke-width="2"')}<line x1="40" y1="152" x2="392" y2="152" stroke="${ROUGE}" stroke-width="5"/>${floor('#b7ad9c', 170)}`,
  pharmacie: () => `${wall('#e7f4ec')}${r(150, 20, 70, 70, '#fff')}<path d="M175 30 h20 v20 h20 v20 h-20 v20 h-20 v-20 h-20 v-20 h20Z" transform="translate(-2 -5) scale(1 .92)" fill="#2fbf5b" ${S}/>${sign(240, 34, 140, 'PHARMACIE', '#2fbf5b', '#fff', 13)}${[100, 140].map(y => `${r(10, y, 120, 6, '#8d6136')}${[18, 40, 62, 84, 106].map((x, i) => r(x, y - 22, 16, 22, ['#fff', '#bfe8ff', '#ffd3d3', '#fff3c4', '#d4f5d9'][i])).join('')}`).join('')}${floor('#d3e4da')}${r(230, 130, 160, 50, '#fff')}`,
  ecole: () => `${wall('#fff1c4')}${r(90, 28, 220, 100, '#2f6b4f')}<text x="200" y="66" font-size="20" fill="#fff" text-anchor="middle" font-family="'Comic Neue','Comic Sans MS',sans-serif" font-weight="700">Bonjour !</text><path d="M120 94 h60 M120 110 h110" stroke="#fff" stroke-width="3" opacity=".8"/>${r(84, 126, 232, 8, '#b98a52')}${r(20, 30, 50, 34, BLEU, 'stroke-width="2"')}${r(36, 30, 18, 34, '#fff', 'stroke-width="2"')}${r(54, 30, 16, 34, ROUGE, 'stroke-width="2"')}${floor('#c9a272')}${r(300, 150, 90, 12, '#d9a464')}`,
  appartement: () => `${wall('#f3e3f0')}${r(230, 26, 130, 110, '#cfe9ff')}${[250, 290, 330].map((x, i) => `${r(x, 136 - 30 - i * 8, 26, 30 + i * 8, '#a7b3c6', 'stroke-width="2"')}`).join('')}${eiffel(300, 132, .5)}<line x1="295" y1="26" x2="295" y2="136" ${S}/>${r(224, 136, 142, 8, '#fff')}${floor('#b98a5b')}${r(20, 140, 150, 40, BLEU)}${r(14, 126, 18, 54, '#24407f')}${r(158, 126, 18, 54, '#24407f')}${c(60, 60, 18, '#fff')}`,
  jardin: () => `${sky()}<path d="M0 150 Q100 120 200 140 T400 132 V250 H0Z" fill="#9fdc84" ${S}/>${tree(40, 182, 1.1)}${tree(360, 178, .9)}${e(200, 170, 70, 14, '#7fc7ee')}${r(192, 130, 16, 36, '#d8d2c4')}${e(200, 128, 26, 6, '#d8d2c4')}${p('M200 120 Q190 104 196 96 M200 120 Q212 104 206 96', 'none', 'stroke="#3b82c4"')}${floor('#e3d3a6', 196)}${[100, 300].map(x => `${p(`M${x - 12} 214 V190 H${x + 12} V214 M${x - 12} 202 H${x + 12}`, 'none', 'stroke="#2f8f5b" stroke-width="5"')}`).join('')}`,
  poste: () => `${wall('#fff6cf')}${sign(110, 20, 180, 'LA POSTE', '#ffd23f', BLEU, 16)}${r(0, 120, 400, 60, '#2b4c9b')}${r(0, 114, 400, 10, '#fff')}${windowPane(40, 40, 70, 56)}${r(310, 60, 50, 60, '#ffd23f', 'rx="8"')}${r(320, 74, 30, 6, INK)}${floor('#e3dccb')}`,
  seine: () => `${sky()}${eiffel(70, 130, .8)}<path d="M0 150 H400 V196 H0Z" fill="#5fa8d9" ${S}/>${p('M120 150 Q200 92 280 150', 'none', 'stroke="#cdbfa6" stroke-width="16"')}${p('M110 140 H290', 'none', 'stroke="#cdbfa6" stroke-width="10"')}${[10, 90, 300].map(x => r(x, 196, 70, 24, '#2f6b4f')).join('')}${floor('#d4c7aa', 220)}`
};

const cast = {
  lea: { name: 'Léa', skin: '#f6c9a0', shirt: '#2b4c9b', pants: '#1d2c66', hair: '#3a2416', style: 'beret', skirt: true },
  hugo: { name: 'Hugo', skin: '#e9b48a', shirt: '#ffd23f', pants: '#3b5bdb', hair: '#2b2b3a', style: 'spiky' },
  marie: { name: 'Marie', skin: '#efbf8e', shirt: '#9b6ad6', pants: '#4a4a5a', hair: '#7a4a2a', style: 'bob', glasses: true },
  luc: { name: 'Luc', skin: '#f3cfb0', shirt: '#7a5a3a', pants: '#3a3f66', hair: '#9aa0aa', style: 'side', glasses: true, mustache: true },
  camille: { name: 'Camille', skin: '#f1c79a', shirt: '#ffffff', pants: '#2a2440', hair: '#1d1a26', style: 'chef', extra: r(-16, -70, 32, 30, '#f4efe4', 'stroke-width="2"') },
  zoe: { name: 'Zoé', skin: '#a8714a', shirt: '#2bb3a3', pants: '#5c4033', hair: '#2b1a12', style: 'curly' },
  ines: { name: 'Inès', skin: '#d9a77c', shirt: '#7bc96f', pants: '#9b6ad6', hair: '#2b1a12', style: 'ponytail', skirt: true },
  paul: { name: 'Paul', skin: '#f6c9a0', shirt: '#c23b3d', pants: '#1f2a52', hair: '#3a2a1a', style: 'cap', scale: .8 },
  anne: { name: 'Anne', skin: '#f3cfb0', shirt: '#ff8fb1', pants: '#7a6a8a', hair: '#f2f2f2', style: 'bun', glasses: true, skirt: true }
};

const props = {
  ...baseProps,
  croissant: ['', () => `${p('M-26 -8 Q-30 -30 0 -32 Q30 -30 26 -8 Q0 -18 -26 -8Z', '#f2b866')}${p('M-12 -28 Q-6 -16 -10 -10 M2 -31 Q4 -20 0 -14 M14 -28 Q10 -16 12 -10', 'none', 'stroke-width="2"')}`],
  baguette: ['', () => `<g transform="rotate(-20)">${p('M-40 -14 Q-42 -24 -32 -24 H36 Q44 -22 40 -14 Q34 -8 -32 -8Z', '#e3a857')}<path d="M-24 -22 l8 10 M-6 -22 l8 10 M12 -22 l8 10" stroke="${INK}" stroke-width="2"/></g>`],
  fromage: ['', () => `${p('M-28 -6 V-26 L22 -40 L28 -26 V-6Z', '#ffd84d')}${c(-8, -16, 4, '#f2b84d', 'stroke-width="2"')}${c(12, -22, 3, '#f2b84d', 'stroke-width="2"')}`],
  clock: ['', () => `${c(0, -30, 20, '#fff')}${p('M0 -30 V-44 M0 -30 L10 -26', 'none')}`],
  metroTicket: ['', () => `${r(-26, -30, 52, 26, '#d9e6ff')}${p('M-20 -18 H20', 'none', 'stroke="#3b6fb6" stroke-width="5"')}${t(0, -8, 'T+', 9)}`]
};
// French keywords (with and without accents where learners commonly type both) select the props.
const keywords = {
  umbrella: 'parapluie|il pleut', pen: 'stylo|crayon|écrire|écris|épeler|l\'alphabet', book: 'livre|lire|lis|roman|devoirs|cahier',
  watch: 'heures?|heure|midi|minuit|et quart|et demie|moins le quart|tôt|tard', coat: 'manteau|il fait froid|froid', dress: 'robe|jupe',
  shirt: 'chemise|t-shirt|vêtements?|taille|s\'habiller', hat: 'chapeau|casquette', shoes: 'chaussures', bag: 'sac|valise',
  key: 'clé|clef|porte', car: 'voiture|taxi', bus: 'bus|autobus', bike: 'vélo', train: 'train|tgv|quai', plane: 'avion|aéroport',
  ticket: 'billet|ticket|réservation', phone: 'téléphone|appeler|portable', computer: 'ordinateur|e-mail|internet', tv: 'télé|télévision|cinéma|film',
  camera: 'photo|appareil', letter: 'lettre|carte postale|adresse|timbre|colis', newspaper: 'journal|magazine', cup: 'café|thé|tasse|boire',
  milk: 'eau|lait|jus|bouteille', apple: 'pomme|fruits?|orange|banane|légumes', bread: 'déjeuner|dîner|petit-déjeuner|manger|repas|riz|poisson|viande',
  egg: 'œufs?|oeufs?|beurre', icecream: 'glace|gâteau|dessert', money: 'euros?|addition|prix|cher|combien|kilo|payer|acheter',
  gift: 'cadeau|anniversaire|fête', flower: 'fleurs?|jardin', dog: 'chien', cat: 'chat', chair: 'chaise|s\'asseoir', table: 'table|bureau',
  bed: 'lit|dormir|se coucher|se lever|fatigué|chambre', ball: 'foot|tennis|sport|ballon|jouer|natation', guitar: 'guitare|musique|chanter|piano|concert',
  glasses: 'lunettes|regarder|voir', medicine: 'médicament|malade|médecin|hôpital|pharmacie|fièvre|gorge|tête|ventre|dos|toux|dents|bras|jambe|main|pied|rendez-vous',
  map: 'gauche|droite|tout droit|rue|où|près de|devant|derrière|plan', calendar: 'lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|semaine|week-end|demain|hier|aujourd\'hui|janvier|février|mai|juillet|août|mois',
  window: 'fenêtre', house: 'maison|appartement|habiter|habite|cuisine|salon|salle de bains', sun: 'soleil|il fait beau|il fait chaud|chaud|beau',
  rain: 'nuage|vent|orage', snow: 'neige|il neige', tree: 'parc|arbre|campagne', boat: 'bateau|mer|plage|vacances|seine', police: 'police|voleur', bell: 'réveil|cloche',
  croissant: 'croissant|boulangerie', baguette: 'pain|baguette', fromage: 'fromage', clock: 'horloge|pendule', metroTicket: 'métro|station'
};
const kit = createComicKit({ places, cast, props, keywords, defaultPlace: 'rue', defaultHero: 'lea', villainStyle: 'beret' });
export const VILLAIN = 'Gribouille 先生';
export { places };
export const { castNames, propNames, propsFor, comicPanel } = kit;
export const placeLabels = { rue: 'RUE DE PARIS', cafe: 'CAFÉ', boulangerie: 'BOULANGERIE', metro: 'MÉTRO', marche: 'MARCHÉ', gare: 'GARE', pharmacie: 'PHARMACIE', ecole: 'ÉCOLE', appartement: 'APPARTEMENT', jardin: 'JARDIN', poste: 'LA POSTE', seine: 'QUAI DE SEINE' };
// Words in a question's French that move the scene somewhere more specific than its chapter's home place.
export const PLACE_WORDS = [
  ['cafe', /(?<!\p{L})(café|thé|l'addition|serveur|menu)(?!\p{L})/iu], ['boulangerie', /(?<!\p{L})(pain|croissant|baguette|boulangerie)(?!\p{L})/iu],
  ['metro', /(?<!\p{L})(métro|bus|station)(?!\p{L})/iu], ['marche', /(?<!\p{L})(marché|kilo|pommes?|légumes|fromage|fruits?)(?!\p{L})/iu],
  ['gare', /(?<!\p{L})(gare|train|billet|quai|partir|arriver)(?!\p{L})/iu], ['pharmacie', /(?<!\p{L})(pharmacie|médicament|malade|fièvre|médecin|hôpital|toux)(?!\p{L})/iu],
  ['ecole', /(?<!\p{L})(école|étudiante?|professeur|classe|alphabet|épeler)(?!\p{L})/iu], ['appartement', /(?<!\p{L})(maison|chambre|cuisine|salon|salle de bains|appartement|famille)(?!\p{L})/iu],
  ['jardin', /(?<!\p{L})(parc|jardin|tennis|foot|natation|fête)(?!\p{L})/iu], ['poste', /(?<!\p{L})(adresse|lettre|la poste|téléphone)(?!\p{L})/iu]
];
