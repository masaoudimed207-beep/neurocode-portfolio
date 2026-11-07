// Enveloppe les <img> de assets/img dans un <picture> (AVIF, WebP, puis l'image d'origine en repli)
// et ajoute la clé de traduction de leur texte alternatif. Sans effet sur une image déjà enveloppée.
// Usage : node tools/picture.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SETS } from './images.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(ROOT, 'index.html');

// largeur affichée, mesurée de 360 à 1440 px (voir tools/check.mjs)
const SIZES = {
  'med-cutout': '(max-width: 640px) 290px, 330px',
  'med-about': '(max-width: 980px) 320px, 410px',
  'fuel-hero': '(max-width: 980px) calc(100vw - 32px), 680px',
  'fuel-choice': '(max-width: 640px) calc(100vw - 32px), (max-width: 980px) 290px, 490px',
  'fuel-fleet': '(max-width: 640px) calc(100vw - 32px), (max-width: 980px) 290px, 490px',
  'fuel-map': '(max-width: 640px) calc(100vw - 32px), (max-width: 1100px) 82vw, 990px',
  'innosoft-review': '(max-width: 980px) calc(100vw - 32px), 565px',
  'kounach-cart': '(max-width: 980px) calc(100vw - 32px), 565px',
};
const SRC_W = { 'med-cutout': 640, 'med-about': 520 }; // les autres sources font 1600 px

let h = fs.readFileSync(file, 'utf8'), n = 0;
h = h.replace(/(<picture>)?<img ([^>]*?)src="assets\/img\/([a-z-]+)\.webp"([^>]*)>/g, (m, wrapped, pre, name, post) => {
  if (wrapped || !SETS[name] || /data-i18n-alt=/.test(m)) return m; // déjà traitée
  const ws = SETS[name], full = SRC_W[name] || 1600;
  const set = (ext) => ws.map(w => (ext === 'webp' && w >= full ? `assets/img/${name}.webp` : `assets/img/${name}-${w}.${ext}`) + ` ${Math.min(w, full)}w`).join(', ');
  let attrs = pre + `src="assets/img/${name}.webp"` + post;
  if (!/decoding=/.test(attrs)) attrs += ' decoding="async"';
  if (!/data-i18n-alt=/.test(attrs)) attrs += ` data-i18n-alt="alt.${name}"`;
  n++;
  return `<picture><source type="image/avif" srcset="${set('avif')}" sizes="${SIZES[name]}"><source type="image/webp" srcset="${set('webp')}" sizes="${SIZES[name]}"><img ${attrs}></picture>`;
});
fs.writeFileSync(file, h);
console.log(`${n} image(s) enveloppée(s)`);
