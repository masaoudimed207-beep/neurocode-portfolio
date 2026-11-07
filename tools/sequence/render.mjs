// Rend la séquence « des données brutes à une décision » image par image et l'écrit en WebP.
// Usage : node tools/sequence/render.mjs [--frames=44] [--q=60] [--preview]
//   --preview : écrit seulement 4 images PNG dans tools/shots/ pour regarder la scène.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';

const TOOLS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.resolve(TOOLS, '..', 'assets', 'sequence');
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith(`--${k}=`)); return a ? +a.split('=')[1] : d; };
const FRAMES = arg('frames', 44), Q = arg('q', 60), PREVIEW = process.argv.includes('--preview');
const SIZES = { d: 960, m: 640 };         // d : ordinateur et tablette, m : mobile
const INK = [0x15, 0x17, 0x1C];

// serveur local : les modules ES ne se chargent pas depuis file://
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript' };
const server = http.createServer((req, res) => {
  const f = path.join(TOOLS, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!f.startsWith(TOOLS) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));

const browser = await chromium.launch({ channel: 'msedge', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', e => { console.error('Erreur de la scène :', e.message); process.exitCode = 1; });
await page.goto(`http://127.0.0.1:${server.address().port}/sequence/scene.html`);
await page.waitForFunction(() => window.ready === true);

const grab = async i => {
  const b64 = await page.evaluate(([i, n]) => { window.renderFrame(i, n); return document.querySelector('canvas').toDataURL('image/png').split(',')[1]; }, [i, FRAMES]);
  return Buffer.from(b64, 'base64');
};

if (PREVIEW) {
  fs.mkdirSync(path.join(TOOLS, 'shots'), { recursive: true });
  for (const i of [0, Math.round(FRAMES * 0.25), Math.round(FRAMES * 0.5), Math.round(FRAMES * 0.75), FRAMES - 1]) {
    await sharp(await grab(i)).resize(960).png().toFile(path.join(TOOLS, 'shots', `_seq-${i}.png`));
  }
  console.log('aperçu écrit dans tools/shots/_seq-*.png');
} else {
  fs.mkdirSync(OUT, { recursive: true });
  for (const f of fs.readdirSync(OUT)) if (/^[dm]-\d+\.webp$/.test(f)) fs.unlinkSync(path.join(OUT, f));
  const total = { d: 0, m: 0 };
  for (let i = 0; i < FRAMES; i++) {
    const png = await grab(i);
    if (i === 0) { // le fond doit être exactement celui des sections voisines
      const { data } = await sharp(png).extract({ left: 0, top: 0, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
      if (data[0] !== INK[0] || data[1] !== INK[1] || data[2] !== INK[2]) { console.error(`Fond ${[...data.slice(0, 3)]} différent de #15171C`); process.exitCode = 1; }
    }
    for (const [k, w] of Object.entries(SIZES)) {
      const buf = await sharp(png).resize(w).webp({ quality: Q, effort: 6 }).toBuffer();
      fs.writeFileSync(path.join(OUT, `${k}-${String(i).padStart(2, '0')}.webp`), buf);
      total[k] += buf.length;
    }
  }
  console.log(`${FRAMES} images, q${Q} : ordinateur ${(total.d / 1024).toFixed(0)} Ko, mobile ${(total.m / 1024).toFixed(0)} Ko`);
}
await browser.close();
server.close();
