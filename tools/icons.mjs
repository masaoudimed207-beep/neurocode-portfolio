// Génère le sprite d'icônes (vrais tracés simple-icons, version fixée dans package.json)
// et le contenu du bandeau, puis les injecte dans index.html entre les marqueurs.
// Usage : node tools/icons.mjs
import fs from 'node:fs';
import * as si from 'simple-icons';

const html = new URL('../index.html', import.meta.url);
const get = (slug) => { const k = 'si' + slug[0].toUpperCase() + slug.slice(1); if (!si[k]) throw new Error('icône absente : ' + slug); return si[k]; };

// Bandeau : outil -> projets où il a servi (uniquement ce que le site affirme déjà)
export const MARQUEE = [
  ['python', 'Fuel Optimizer · InnoSoft'],
  ['fastapi', 'Fuel Optimizer'],
  ['react', 'Fuel Optimizer · Kounach'],
  ['typescript', 'Fuel Optimizer · Kounach'],
  ['scikitlearn', 'InnoSoft'],
  ['pandas', 'InnoSoft'],
  ['sqlite', 'Fuel Optimizer · InnoSoft'],
  ['sqlalchemy', 'Fuel Optimizer'],
  ['streamlit', 'InnoSoft'],
  ['leaflet', 'Fuel Optimizer'],
  ['pytest', 'Fuel Optimizer'],
  ['vitest', 'Fuel Optimizer'],
  ['docker', 'Fuel Optimizer'],
  ['vite', 'Kounach'],
  ['pwa', 'Kounach'],
];
// Icônes utilisées par la section Skills
const SKILLS = ['numpy', 'tensorflow', 'keras', 'pydantic', 'mysql', 'jsonwebtokens', 'php', 'tailwindcss', 'javascript', 'html5', 'css', 'testinglibrary', 'git', 'github'];

const slugs = [...new Set([...MARQUEE.map(m => m[0]), ...SKILLS])];
const sprite = '<svg class="sprite" aria-hidden="true" focusable="false">' +
  slugs.map(s => `<symbol id="si-${s}" viewBox="0 0 24 24"><path d="${get(s).path}"/></symbol>`).join('') + '</svg>';

const item = ([s, where]) => `<span class="mq-item"><svg class="mq-logo" viewBox="0 0 24 24"><use href="#si-${s}"/></svg><span class="mq-txt"><b>${get(s).title}</b><small>${where}</small></span></span>`;
const row = MARQUEE.map(item).join('');
const marquee = `<div class="marquee-track"><div class="mq-set">${row}</div><div class="mq-set">${row}</div></div>`;

let h = fs.readFileSync(html, 'utf8');
const put = (name, body) => {
  const a = `<!-- ${name}:start -->`, b = `<!-- ${name}:end -->`;
  if (!h.includes(a)) throw new Error('marqueur absent : ' + name);
  h = h.slice(0, h.indexOf(a) + a.length) + body + h.slice(h.indexOf(b));
};
put('icons', sprite);
put('marquee', marquee);
fs.writeFileSync(html, h);
const meta = JSON.parse(fs.readFileSync(new URL('./node_modules/simple-icons/package.json', import.meta.url)));
console.log(`sprite : ${slugs.length} icônes, ${(sprite.length / 1024).toFixed(1)} Ko (simple-icons ${meta.version})`);
