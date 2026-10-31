// Génère le schéma "What I work with" (pipeline Data → API → Interface sur un socle Qualité)
// et le remplace dans index.html entre <!-- skills:start --> et <!-- skills:end -->.
// Usage : node tools/skills-frag.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(ROOT, 'index.html');

// [nom affiché, slug simple-icons ou null, couleur de marque]
const COLS = [
  { k: 'data', h: '<h3 data-i18n="skills.h1">AI &amp; Data</h3>', bg: 'python', tools: [
    ['Python', 'python', '#3776AB'], ['pandas', 'pandas', '#150458'], ['NumPy', 'numpy', '#013243'],
    ['scikit-learn', 'scikitlearn', '#F7931E'], ['TensorFlow', 'tensorflow', '#FF6F00'], ['Keras', 'keras', '#D00000'],
  ], extra: 'Isolation Forest · Random Forest · <span class="nw">K-Means</span> · <span data-i18n="skills.metrics">evaluation metrics</span>' },
  { k: 'api', h: '<h3 data-i18n="skills.h2">Back end</h3>', bg: 'fastapi', tools: [
    ['FastAPI', 'fastapi', '#009688'], ['Pydantic', 'pydantic', '#E92063'], ['SQLAlchemy', 'sqlalchemy', '#D71F00'],
    ['MySQL', 'mysql', '#4479A1'], ['SQLite', 'sqlite', '#003B57'], ['JWT', 'jsonwebtokens', '#15171C'], ['PHP', 'php', '#777BB4'],
  ], extra: 'Alembic · bcrypt · REST' },
  { k: 'ui', h: '<h3 data-i18n="skills.h3">Front end</h3>', bg: 'react', tools: [
    ['React 19', 'react', '#087EA4'], ['TypeScript', 'typescript', '#3178C6'], ['Tailwind', 'tailwindcss', '#0891B2'],
    ['Vite', 'vite', '#646CFF'], ['Leaflet', 'leaflet', '#199900'], ['Streamlit', 'streamlit', '#FF4B4B'],
    ['PWA', 'pwa', '#5A0FC8'], ['JavaScript', 'javascript', '#B8A200'], ['HTML5', 'html5', '#E34F26'], ['CSS', 'css', '#663399'],
  ] },
];
const BASE = { h: '<h3 data-i18n="skills.h4">Quality &amp; tooling</h3>', tools: [
  ['pytest', 'pytest', '#0A9EDC'], ['Vitest', 'vitest', '#6E9F18'], ['Testing Library', 'testinglibrary', '#E33332'],
  ['Git', 'git', '#F05032'], ['GitHub', 'github', '#181717'], ['Docker', 'docker', '#2496ED'],
], extra: '<span data-i18n="skills.ai">AI-assisted coding with strict checks</span>' };

const tile = ([name, slug, color]) =>
  `<li><svg aria-hidden="true" style="--c:${color}"><use href="#si-${slug}"/></svg>${name}</li>`;
const list = (tools) => `<ul class="sk-tools">${tools.map(tile).join('')}</ul>`;

const cols = COLS.map((c, i) => `
      <article class="sk-col reveal" data-k="${c.k}">
        <svg class="sk-bg" aria-hidden="true"><use href="#si-${c.bg}"/></svg>
        <p class="sk-step mono">0${i + 1}</p>
        ${c.h}
        ${list(c.tools)}${c.extra ? `\n        <p class="sk-extra">${c.extra}</p>` : ''}
      </article>${i < COLS.length - 1 ? '\n      <span class="sk-arrow" aria-hidden="true"><i></i></span>' : ''}`).join('');

const html = `<!-- skills:start -->
    <div class="sk-flow">${cols}
    </div>
    <div class="sk-base reveal">
      <svg class="sk-bg" aria-hidden="true"><use href="#si-pytest"/></svg>
      <div class="sk-base-h"><p class="sk-step mono">∞</p>${BASE.h}</div>
      ${list(BASE.tools)}
      <p class="sk-extra">${BASE.extra}</p>
    </div>
    <!-- skills:end -->`;

let s = fs.readFileSync(file, 'utf8');
const a = s.indexOf('<!-- skills:start -->'), b = s.indexOf('<!-- skills:end -->');
if (a < 0 || b < 0) throw new Error('repères skills introuvables');
s = s.slice(0, a) + html + s.slice(b + '<!-- skills:end -->'.length);
fs.writeFileSync(file, s);
console.log('schéma skills écrit');
