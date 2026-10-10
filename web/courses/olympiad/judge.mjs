// Judge for the olympiad course: integers, decimals, fractions ("3/4"), mixed fullwidth digits, optional trailing unit text.
export function parseNumber(input) {
  let s = String(input ?? '').trim().replace(/[０-９]/g, d => String.fromCharCode(d.charCodeAt(0) - 0xFEE0)).replace(/[−–—]/g, '-').replace(/／/g, '/').replace(/，/g, ',');
  if (!s) return null;
  const m = s.match(/^([+-]?\d+(?:[.,]\d+)?)(?:\s*\/\s*(\d+(?:\.\d+)?))?\s*[^\d.\/]*$/u);
  if (!m) return null;
  const a = Number(m[1].replace(',', '.')), b = m[2] ? Number(m[2]) : 1;
  return b === 0 ? null : a / b;
}
export function gradeQuestion(question, answer) {
  if (question.type === 'choice') return answer === question.answer;
  const value = parseNumber(answer);
  return value != null && Math.abs(value - question.answer) <= 1e-6 * Math.max(1, Math.abs(question.answer));
}
export function shuffled(options, seed) {
  let h = 2166136261; for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
  const list = [...options];
  for (let i = list.length - 1; i > 0; i -= 1) { h = Math.imul(h ^ (h >>> 13), 1597334677) >>> 0; const j = h % (i + 1); [list[i], list[j]] = [list[j], list[i]]; }
  return list;
}
