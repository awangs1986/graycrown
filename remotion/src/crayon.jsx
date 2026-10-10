// Children's crayon picture-book style kit (shared by all 30 compositions).
// - <CrayonDefs/>: SVG filters (waxy displaced edges + grain holes, paper texture, text wax)
// - crayonize(tree, boil): expands the visual's React tree and swaps every primitive shape for a rough.js
//   hand-drawn version (hachure fill over a pale wash), re-seeded every BOIL frames ("line boil", ~7.5 fps).
// rough.js: MIT (https://github.com/rough-stuff/rough).
import React from 'react';
import rough from 'roughjs/bin/rough';
const gen = rough.generator();
export const BOIL = 6; // frames per redraw at 30 fps
const SHAPES = new Set(['rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'path']);
const LIGHT = new Set(['#fff', '#ffffff', 'white', '#eee', '#fffaf0']);
const num = (v, d = 0) => (v == null ? d : +v);
const pts = s => String(s).trim().split(/[\s]+/).map(p => p.split(',').map(Number)).filter(p => p.length === 2 && !p.some(isNaN));
const roundRect = (x, y, w, h, r) => { r = Math.min(r, w / 2, h / 2); return `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`; };
function drawable(type, p, o) {
  switch (type) {
    case 'rect': { const x = num(p.x), y = num(p.y), w = num(p.width), h = num(p.height), r = num(p.rx); return r > 2 ? gen.path(roundRect(x, y, w, h, r), o) : gen.rectangle(x, y, w, h, o); }
    case 'circle': return gen.ellipse(num(p.cx), num(p.cy), 2 * num(p.r), 2 * num(p.r), o);
    case 'ellipse': return gen.ellipse(num(p.cx), num(p.cy), 2 * num(p.rx), 2 * num(p.ry), o);
    case 'line': return gen.line(num(p.x1), num(p.y1), num(p.x2), num(p.y2), o);
    case 'polyline': return gen.linearPath(pts(p.points), o);
    case 'polygon': return gen.polygon(pts(p.points), o);
    case 'path': return gen.path(p.d, o);
  }
}
const small = (t, p) => (t === 'circle' && num(p.r) < 8) || (t === 'ellipse' && Math.max(num(p.rx), num(p.ry)) < 8);
function roughen(type, p, key, seed0, boil) { const seed = seed0;
  const { fill, stroke, strokeWidth, opacity, transform, strokeDasharray, strokeDashoffset, style } = p;
  if (strokeDasharray || p['data-plain'] || small(type, p) || (type === 'rect' && num(p.width) < 3)) return React.createElement(type, { ...p, key });
  const hasFill = fill && fill !== 'none' && type !== 'line' && type !== 'polyline', light = hasFill && LIGHT.has(String(fill).toLowerCase());
  const sw = num(strokeWidth, stroke ? 1 : 0);
  const o = { seed, roughness: 1.1, bowing: 1.2, stroke: stroke || 'none', strokeWidth: Math.max(2.2, sw * 0.85), disableMultiStroke: false,
    fill: hasFill && !light ? fill : undefined, fillStyle: 'hachure', hachureGap: 6.5, fillWeight: 2.6, hachureAngle: -41 + (seed % 7) - 3, preserveVertices: false };
  // Hachure fill keeps a fixed seed (cheap to encode); only the outline 'boils'.
  const fillPaths = o.fill ? gen.toPaths(drawable(type, p, { ...o, stroke: 'none', strokeWidth: 0.01 })).filter(q => q.stroke !== 'none' || q.fill) : [];
  const linePaths = o.stroke !== 'none' ? gen.toPaths(drawable(type, p, { ...o, seed: seed0 + boil * 101, fill: undefined })) : [];
  const paths = [...fillPaths, ...linePaths];
  const wash = hasFill ? React.createElement(type, { ...p, stroke: 'none', key: 'w', opacity: undefined, transform: undefined, fill: light ? '#fffdf5' : fill, fillOpacity: light ? 1 : 0.5 }) : null;
  return <g key={key} opacity={opacity} transform={transform} style={style}>{wash}{paths.map((q, i) => <path key={i} d={q.d} stroke={q.stroke} strokeWidth={q.strokeWidth} fill={q.fill || 'none'} strokeLinecap="round" strokeLinejoin="round" />)}</g>;
}
const hash = s => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); };
export function crayonize(node, boil, path = '0') {
  if (node == null || typeof node === 'boolean' || typeof node === 'string' || typeof node === 'number') return node;
  if (Array.isArray(node)) return node.map((n, i) => crayonize(n, boil, path + '.' + (n?.key ?? i)));
  if (!React.isValidElement(node)) return node;
  const { type, props } = node;
  if (typeof type === 'function') return crayonize(type(props), boil, path);
  if (type === React.Fragment) return <React.Fragment key={node.key}>{crayonize(props.children, boil, path)}</React.Fragment>;
  if (SHAPES.has(type)) return roughen(type, props, node.key ?? path, hash(path) % 9973, boil);
  if (type === 'text' || type === 'tspan') return node;
  return React.cloneElement(node, { key: node.key ?? path }, crayonize(props.children, boil, path));
}
export const CrayonDefs = ({ boil }) => <defs>
  {/* waxy edges: low-freq wobble + high-freq grain punched out of strokes */}
  <filter id="wax" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed={boil % 5} result="wob" />
    <feDisplacementMap in="SourceGraphic" in2="wob" scale="3" xChannelSelector="R" yChannelSelector="G" result="d" />
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" result="g" />
    <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.75" result="holes" />
    <feComposite in="d" in2="holes" operator="in" />
  </filter>
  <filter id="waxStatic" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="1" result="wob" />
    <feDisplacementMap in="SourceGraphic" in2="wob" scale="3" xChannelSelector="R" yChannelSelector="G" result="d" />
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" result="g" />
    <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.75" result="holes" />
    <feComposite in="d" in2="holes" operator="in" />
  </filter>
  <filter id="waxText" x="-5%" y="-20%" width="110%" height="140%">
    <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="2" result="wob" />
    <feDisplacementMap in="SourceGraphic" in2="wob" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="d" />
    <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="9" result="g" />
    <feColorMatrix in="g" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.9 1.35" result="holes" />
    <feComposite in="d" in2="holes" operator="in" />
  </filter>
  <filter id="paper" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" seed="11" result="n" />
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.33  0 0 0 0 0.18  0 0 0 0.11 0" result="grain" />
    <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="5" result="m" />
    <feColorMatrix in="m" type="matrix" values="0 0 0 0 0.8  0 0 0 0 0.6  0 0 0 0 0.3  0 0 0 0.18 0" result="mottle" />
    <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="mottle" /><feMergeNode in="grain" /></feMerge>
  </filter>
  <radialGradient id="vign" cx="50%" cy="45%" r="75%"><stop offset="70%" stopColor="#a07a40" stopOpacity="0" /><stop offset="100%" stopColor="#a07a40" stopOpacity="0.22" /></radialGradient>
</defs>;
export const Paper = () => <g><rect width={1280} height={720} fill="#fbf0d9" filter="url(#paper)" /><rect width={1280} height={720} fill="url(#vign)" /></g>;
