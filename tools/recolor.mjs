// One-shot : remplace les couleurs en dur de style.css par des tokens (phase 1).
import fs from 'node:fs';
const f = new URL('../style.css', import.meta.url);
let css = fs.readFileSync(f, 'utf8');
const rootEnd = css.indexOf('}', css.indexOf(':root{'));
let head = css.slice(0, rootEnd + 1), body = css.slice(rootEnd + 1);
const map = [
  [/rgba\(255,107,26,\.35\)/g, 'color-mix(in srgb,var(--accent) 45%,transparent)'],
  [/rgba\(255,107,26,\.25\)/g, 'color-mix(in srgb,var(--accent) 25%,transparent)'],
  [/rgba\(239,234,227,\.82\)/g, 'color-mix(in srgb,var(--paper) 92%,transparent)'],
  [/rgba\(19,128,74,\.15\)/g, 'color-mix(in srgb,var(--good) 15%,transparent)'],
  [/rgba\(18,18,18,\.12\)/g, 'var(--line)'],
  [/rgba\(0,0,0,/g, 'rgba(14,16,20,'],
  [/#ffd2b8/gi, '#C9D1FF'],
  [/#ffe6d6/gi, 'var(--accent-soft)'],
  [/#b44708/gi, 'var(--accent-strong)'],
  [/#b3400c/gi, 'var(--accent)'],
  [/#fff7f1/gi, 'var(--accent-tint)'],
  [/#1f1a16/gi, 'color-mix(in srgb,var(--accent) 12%,var(--ink-2))'],
  [/#f6f1ea/gi, 'var(--paper-3)'], [/#e9e2d8/gi, 'var(--paper-2)'],
  [/#f6f2ec/gi, 'var(--paper-3)'], [/#e3ddd3/gi, 'var(--paper-2)'],
  [/#f1ede8/gi, 'var(--paper-2)'], [/#cfc8bd/gi, 'var(--line-strong)'], [/#bdb5a9/gi, 'var(--line-strong)'],
  [/#3b3833/gi, 'var(--text-2)'], [/#4a4640/gi, 'var(--text-2)'],
  [/#3a3a3a/gi, 'var(--ink-3)'], [/#262626/gi, 'var(--ink-2)'], [/#2b2b2b/gi, 'var(--ink-3)'],
  [/#0b0b0b/gi, 'var(--ink-deep)'], [/#9b958c/gi, 'var(--on-dark-3)'],
  [/#d8d3cc/gi, 'var(--on-dark-2)'], [/#c9c3ba/gi, 'var(--on-dark-2)'], [/#cfc9c0/gi, 'var(--on-dark-2)'],
  [/#bdb6ac/gi, 'var(--on-dark-3)'], [/#f3efe9/gi, 'var(--on-dark)'],
  [/#d9f2e3/gi, 'var(--good-soft)'], [/#fde1df/gi, 'var(--bad-soft)'], [/#e6544b/gi, 'var(--bad-2)'],
  [/#22c55e/gi, 'var(--live)'],
  [/background:var\(--accent\);color:#111/g, 'background:var(--accent);color:var(--accent-ink)'],
  [/border:2px solid #111/g, 'border:2px solid var(--accent-ink)'],
  [/background:#111;border-radius:2px/g, 'background:var(--accent-ink);border-radius:2px'],
  [/background:#fff;border-radius/g, 'background:var(--surface);border-radius'],
  [/\.roi-map\{([^}]*)background:#fff/g, '.roi-map{$1background:var(--surface)'],
  [/\.results div\{background:#fff/g, '.results div{background:var(--surface)'],
  [/\.roi-card\{background:#fff/g, '.roi-card{background:var(--surface)'],
  [/\.arch-svg \.L>rect\{fill:#fff/g, '.arch-svg .L>rect{fill:var(--surface)'],
];
for (const [re, to] of map) body = body.replace(re, to);
fs.writeFileSync(f, head + body);
const left = [...body.matchAll(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g)].map(m => m[0]);
const counts = left.reduce((a, c) => (a[c] = (a[c] || 0) + 1, a), {});
console.log('restant :', counts);
