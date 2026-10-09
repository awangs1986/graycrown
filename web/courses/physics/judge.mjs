// Numeric judge for the physics course. Accepts "12.5", "1.25e1", "1.25×10^1", "1.25 x 10⁴", "12,5" (decimal comma),
// with or without a unit. A compatible unit is converted (km/h → m/s, cm → m, kJ → J …); an incompatible unit is rejected.
// Answers within a relative tolerance (default 2 %) are accepted so reasonable rounding (2–3 significant figures) passes.
const SUP = { '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-', '⁺': '+' };
// [dimension, factor to the canonical unit of that dimension]
const UNITS = {
  '': ['1', 1], '%': ['%', 1],
  m: ['L', 1], cm: ['L', 0.01], mm: ['L', 0.001], km: ['L', 1000], 'μm': ['L', 1e-6], um: ['L', 1e-6], '米': ['L', 1], '厘米': ['L', 0.01], '毫米': ['L', 0.001], '千米': ['L', 1000], '公里': ['L', 1000],
  s: ['T', 1], ms: ['T', 0.001], min: ['T', 60], h: ['T', 3600], '秒': ['T', 1], '分钟': ['T', 60], '小时': ['T', 3600],
  'm/s': ['V', 1], 'km/h': ['V', 1 / 3.6], 'kmh': ['V', 1 / 3.6], 'cm/s': ['V', 0.01], '米每秒': ['V', 1], '千米每小时': ['V', 1 / 3.6],
  'm/s^2': ['A', 1], 'm/s2': ['A', 1], 'rad/s': ['W', 1], 'rad/s^2': ['AA', 1], 'rad/s2': ['AA', 1], rad: ['rad', 1],
  kg: ['M', 1], g: ['M', 0.001], mg: ['M', 1e-6], t: ['M', 1000], '千克': ['M', 1], '克': ['M', 0.001], '公斤': ['M', 1],
  N: ['F', 1], kN: ['F', 1000], '牛': ['F', 1], '牛顿': ['F', 1],
  J: ['E', 1], kJ: ['E', 1000], MJ: ['E', 1e6], '焦': ['E', 1], '焦耳': ['E', 1],
  W: ['P', 1], kW: ['P', 1000], MW: ['P', 1e6], '瓦': ['P', 1], '瓦特': ['P', 1], '千瓦': ['P', 1000],
  Pa: ['Pr', 1], kPa: ['Pr', 1000], MPa: ['Pr', 1e6], '帕': ['Pr', 1], '帕斯卡': ['Pr', 1],
  'kg*m/s': ['p', 1], 'N*s': ['p', 1], 'N*m': ['tau', 1], 'kg*m^2': ['I', 1], 'kg*m2': ['I', 1], 'N/m': ['k', 1],
  'kg/m^3': ['rho', 1], 'kg/m3': ['rho', 1], 'g/cm^3': ['rho', 1000], 'g/cm3': ['rho', 1000], 'm^3': ['Vol', 1], m3: ['Vol', 1], L: ['Vol', 0.001], 'm^2': ['Area', 1], m2: ['Area', 1],
  Hz: ['f', 1], kHz: ['f', 1000], MHz: ['f', 1e6], '赫兹': ['f', 1], K: ['K', 1], '°C': ['C', 1], C: ['C', 1], '℃': ['C', 1], '摄氏度': ['C', 1], '度': ['deg', 1], '°F': ['F°', 1], dB: ['dB', 1], '倍': ['1', 1]
};
export function normalizeUnit(text) {
  return String(text ?? '').trim().replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]/g, c => '^' + SUP[c]).replace(/\^\^/g, '^').replace(/\^(\d)/g, '^$1')
    .replace(/[·⋅•×]/g, '*').replace(/\s*\*\s*/g, '*').replace(/\s*\/\s*/g, '/').replace(/\s+/g, '*').replace(/^\*|\*$/g, '')
    .replace(/^kg\*m\/s$/i, 'kg*m/s').replace(/^n\*m$/i, 'N*m').replace(/^n\*s$/i, 'N*s').replace(/^km\/hr?$/i, 'km/h').replace(/^m\/s\/s$/, 'm/s^2');
}
export function parseNumeric(input) {
  let text = String(input ?? '').trim().replace(/[，]/g, ',').replace(/[−–—]/g, '-').replace(/[０-９]/g, d => String.fromCharCode(d.charCodeAt(0) - 0xFEE0));
  if (!text) return null;
  // Scientific notation written by hand: 1.2×10^3, 1.2 x 10⁻³, 1.2*10^3
  text = text.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+/g, run => '^' + [...run].map(c => SUP[c]).join(''));
  const match = text.match(/^([+-]?(?:\d[\d ]*(?:[.,]\d+)?|[.,]\d+))(?:\s*(?:[eE]\s*([+-]?\d+)|\s*[×xX*]\s*10\s*\^\s*\(?([+-]?\d+)\)?))?\s*(.*)$/);
  if (!match) return null;
  let mantissa = match[1].replace(/ /g, '');
  // "1,500" is a thousands separator, "12,5" a decimal comma.
  mantissa = /^\d{1,3}(,\d{3})+$/.test(mantissa) ? mantissa.replace(/,/g, '') : mantissa.replace(',', '.');
  const exponent = Number(match[2] ?? match[3] ?? 0);
  const value = Number(mantissa) * 10 ** exponent;
  if (!Number.isFinite(value)) return null;
  return { value, unit: normalizeUnit(match[4]) };
}
const lookup = unit => UNITS[unit] ?? UNITS[unit.toLowerCase()] ?? null;
export function gradeNumeric(question, input) {
  const parsed = parseNumeric(input);
  if (!parsed) return { correct: false, reason: 'format', message: '请输入一个数字，例如 12.5、1.2e3 或 1.2×10^3，可以带单位。' };
  let value = parsed.value;
  if (parsed.unit) {
    const given = lookup(parsed.unit), expected = lookup(normalizeUnit(question.unit));
    if (!given) return { correct: false, reason: 'unit', message: `无法识别单位“${parsed.unit}”。可以只填数字，单位按题目要求（${question.unit || '无单位'}）。` };
    if (!expected || given[0] !== expected[0]) {
      if (!(question.unit === '' && ['1', '%'].includes(given[0]))) return { correct: false, reason: 'unit', message: `单位不对：本题答案的单位应是 ${question.unit || '纯数字'}。` };
    } else value = value * given[1] / expected[1];
  }
  const target = question.answer, tolerance = question.tolerance ?? 0.02;
  const ok = Math.abs(value - target) <= Math.max(Math.abs(target) * tolerance, 1e-12);
  return ok ? { correct: true, value } : { correct: false, reason: 'value', value, message: '数值不对，请检查公式和计算过程。' };
}
export function gradeQuestion(question, response) {
  if (question.type === 'choice') return { correct: response === question.answer };
  return gradeNumeric(question, response);
}
// Deterministic shuffle so options keep their order across reloads.
export function shuffled(items, seed) {
  const result = [...items]; let hash = 2166136261;
  for (const char of seed) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  for (let index = result.length - 1; index > 0; index--) { hash = Math.imul(hash ^ index, 16777619); const swap = Math.abs(hash) % (index + 1); [result[index], result[swap]] = [result[swap], result[index]]; }
  return result;
}
