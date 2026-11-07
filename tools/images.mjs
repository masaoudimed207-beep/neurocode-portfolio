// Génère les variantes AVIF et WebP des images affichées, sans recadrage ni retouche.
// Les fichiers d'origine restent en place et servent de repli.
// Usage : node tools/images.mjs   (puis node tools/images.mjs --diff pour mesurer l'écart avec l'original)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import sharp from 'sharp';

const IMG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'img');

// nom (sans .webp) → largeurs à produire (jamais plus que la source)
export const SETS = {
  'med-cutout': [320, 640],
  'med-about': [400, 520],
  'fuel-hero': [640, 1024, 1600],
  'fuel-choice': [640, 1024, 1600],
  'fuel-fleet': [640, 1024, 1600],
  'fuel-map': [640, 1024, 1600],
  'innosoft-review': [640, 1024, 1600],
  'kounach-cart': [640, 1024, 1600],
};
// qualité élevée : la source est déjà compressée, on ne veut pas de perte visible
const Q = { avif: { quality: 62, effort: 6 }, webp: { quality: 86, effort: 6, alphaQuality: 100 } };

const out = (name, w, ext) => path.join(IMG, `${name}-${w}.${ext}`);

async function build() {
  let total = { avif: 0, webp: 0 };
  for (const [name, widths] of Object.entries(SETS)) {
    const src = path.join(IMG, name + '.webp');
    const { width } = await sharp(src).metadata();
    for (const w of widths) {
      const ww = Math.min(w, width);
      const base = sharp(src).resize({ width: ww, withoutEnlargement: true });
      await base.clone().avif(Q.avif).toFile(out(name, w, 'avif'));
      // à la taille d'origine, le WebP d'origine sert tel quel (réencoder ne ferait que perdre)
      if (ww < width) await base.clone().webp(Q.webp).toFile(out(name, w, 'webp'));
      const a = fs.statSync(out(name, w, 'avif')).size, b = ww < width ? fs.statSync(out(name, w, 'webp')).size : 0;
      total.avif += a; total.webp += b;
      console.log(`${name}-${w}`.padEnd(24), `avif ${(a / 1024).toFixed(1).padStart(6)} Ko`, `webp ${(b / 1024).toFixed(1).padStart(6)} Ko`);
    }
  }
  console.log(`total avif ${(total.avif / 1024).toFixed(0)} Ko, webp ${(total.webp / 1024).toFixed(0)} Ko`);
}

// écart moyen et maximal (canaux RGBA, 0 à 255) entre la plus grande variante et l'original
async function diff() {
  for (const [name, widths] of Object.entries(SETS)) {
    const src = path.join(IMG, name + '.webp');
    const ref = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const w = Math.max(...widths);
    for (const ext of ['avif', 'webp']) {
      if (!fs.existsSync(out(name, w, ext))) continue;
      const cmp = await sharp(out(name, w, ext)).ensureAlpha().resize(ref.info.width, ref.info.height).raw().toBuffer();
      let sum = 0, max = 0, big = 0;
      for (let i = 0; i < cmp.length; i++) { const d = Math.abs(cmp[i] - ref.data[i]); sum += d; if (d > max) max = d; if (d > 24) big++; }
      console.log(`${name}-${w}.${ext}`.padEnd(28), `écart moyen ${(sum / cmp.length).toFixed(2)}`, `pixels > 24 : ${(big / cmp.length * 100).toFixed(2)} %`);
    }
  }
}

// lancé directement (pas importé par tools/picture.mjs)
if (import.meta.url === pathToFileURL(process.argv[1]).href) { if (process.argv.includes('--diff')) await diff(); else await build(); }
