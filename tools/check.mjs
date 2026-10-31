// Vérification du portfolio : node tools/check.mjs [--shots] [--only=en|fr] [--vp=desktop|mobile]
// Lance un petit serveur local, ouvre la page avec Playwright (Edge installé), contrôle et mesure.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'tools', 'shots');
const args = process.argv.slice(2);
const SHOTS = args.includes('--shots');
const only = (args.find(a => a.startsWith('--only=')) || '').split('=')[1];
const vpOnly = (args.find(a => a.startsWith('--vp=')) || '').split('=')[1];

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.jpg': 'image/jpeg', '.pdf': 'application/pdf', '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain' };

// --- serveur statique (avec Range pour la vidéo) ---
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('404'); }
  const size = fs.statSync(f).size, type = TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream';
  const range = req.headers.range;
  if (range) {
    const [a, b] = range.replace('bytes=', '').split('-');
    const start = +a, end = b ? +b : size - 1;
    res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 });
    return fs.createReadStream(f, { start, end }).pipe(res);
  }
  res.writeHead(200, { 'Content-Type': type, 'Content-Length': size, 'Accept-Ranges': 'bytes' });
  fs.createReadStream(f).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}/`;

const report = { problems: [], notes: [] };
const bad = (m) => report.problems.push(m);

// --- contrôles statiques sur les fichiers ---
const srcFiles = ['index.html', 'style.css', 'script.js', ...(fs.existsSync(path.join(ROOT, 'js')) ? fs.readdirSync(path.join(ROOT, 'js')).map(f => 'js/' + f) : [])];
for (const f of srcFiles) {
  const lines = fs.readFileSync(path.join(ROOT, f), 'utf8').split('\n');
  lines.forEach((l, i) => { if (/[–—]/.test(l)) bad(`tiret long dans ${f}:${i + 1}`); });
}
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(ROOT, 'script.js'), 'utf8');
const keys = [...new Set([...html.matchAll(/data-i18n="([^"]+)"/g)].map(m => m[1]))];
const frBlock = js.slice(js.indexOf('const FR = {'), js.indexOf('};', js.indexOf('const FR = {')));
const frKeys = new Set([...frBlock.matchAll(/'([a-zA-Z0-9_.]+)'\s*:/g)].map(m => m[1]));
const missingFr = keys.filter(k => !frKeys.has(k));
const unusedFr = [...frKeys].filter(k => !keys.includes(k));
if (missingFr.length) bad(`clés sans FR : ${missingFr.join(', ')}`);
if (unusedFr.length) report.notes.push(`clés FR inutilisées : ${unusedFr.join(', ')}`);
for (const [re, name] of [[/<title>[^<]+<\/title>/, 'title'], [/name="description"/, 'description'], [/rel="canonical"/, 'canonical'], [/property="og:image"/, 'og:image'], [/hreflang="fr"/, 'hreflang fr'], [/hreflang="x-default"/, 'hreflang x-default'], [/application\/ld\+json/, 'JSON-LD']]) if (!re.test(html)) bad(`SEO manquant : ${name}`);
try { JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]); } catch (e) { bad('JSON-LD invalide'); }
const ogPath = path.join(ROOT, 'assets/img/og.png'); if (!fs.existsSync(ogPath)) bad('og.png absent');

// --- navigateur ---
const browser = await chromium.launch({ channel: 'msedge' });
const VPS = [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }].filter(v => !vpOnly || v.name === vpOnly);
const LANGS = ['en', 'fr'].filter(l => !only || l === only);
const SECTIONS = [['hero', '.hero'], ['herofoot', '.hero-foot'], ['about', '#about'], ['marquee', '.marquee-clip'], ['work', '#work'], ['case', '.case-meta'], ['roi', '#roi'], ['case2', '.case-block:nth-of-type(3)'], ['arch', '.arch-block'], ['results', '.results'], ['more', '.more'], ['skills', '#skills'], ['path', '#path'], ['contact', '#contact'], ['footer', '.footer']];
if (SHOTS) fs.mkdirSync(OUT, { recursive: true });

for (const vp of VPS) for (const lang of LANGS) {
  const tag = `${vp.name}-${lang}`;
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(e.message));
  const bytes = {}; let total = 0, totalGz = 0;
  page.on('response', async r => {
    try {
      const b = await r.body(); const t = (r.headers()['content-type'] || '').split(';')[0];
      const kind = /image/.test(t) ? 'image' : /video/.test(t) ? 'video' : /font/.test(t) || /woff/.test(r.url()) ? 'font' : /css/.test(t) ? 'css' : /javascript/.test(t) ? 'js' : /html/.test(t) ? 'html' : 'other';
      const gz = /text|javascript|css|svg|json|xml/.test(t) ? zlib.gzipSync(b).length : b.length;
      bytes[kind] = (bytes[kind] || 0) + gz; total += b.length; totalGz += gz;
    } catch (e) {}
  });
  const t0 = Date.now();
  await page.goto(BASE + (lang === 'fr' ? '?lang=fr' : '?lang=en'), { waitUntil: 'load' });
  const loadMs = Date.now() - t0;
  const nav = await page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; return { dcl: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd) }; });
  await page.waitForFunction(() => document.documentElement.classList.contains('go') && !document.documentElement.classList.contains('intro-on'), null, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(1600);
  if (SHOTS) await page.screenshot({ path: path.join(OUT, `${tag}-00-top.png`) });

  // défilement complet, lent, pour déclencher toutes les animations et charger tout
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += Math.round(vp.height * 0.6)) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(120); }
  await page.waitForTimeout(800);

  const hScroll = await page.evaluate(() => {
    const d = document.documentElement; const over = [];
    if (d.scrollWidth > d.clientWidth) document.querySelectorAll('body *').forEach(el => { const r = el.getBoundingClientRect(); if (r.right > d.clientWidth + 1 && getComputedStyle(el).position !== 'fixed') over.push(el.tagName.toLowerCase() + '.' + [...el.classList].join('.')); });
    return { sw: d.scrollWidth, cw: d.clientWidth, over: over.slice(0, 6) };
  });
  if (hScroll.sw > hScroll.cw) bad(`[${tag}] scroll horizontal ${hScroll.sw}>${hScroll.cw} : ${hScroll.over.join(', ')}`);
  const lang2 = await page.evaluate(() => ({ lang: document.documentElement.lang, cv: [...document.querySelectorAll('a[href*="CV_Mohamed"]')].map(a => a.getAttribute('href')) }));
  const wantCv = lang === 'fr' ? 'assets/CV_Mohamed_Messaoudi.pdf' : 'assets/CV_Mohamed_Messaoudi_EN.pdf';
  if (lang2.lang !== lang) bad(`[${tag}] html lang=${lang2.lang}`);
  if (lang2.cv.some(h => h !== wantCv)) bad(`[${tag}] lien CV faux : ${lang2.cv.join(', ')}`);
  const noAlt = await page.evaluate(() => [...document.images].filter(i => !i.hasAttribute('alt')).map(i => i.src));
  if (noAlt.length) bad(`[${tag}] images sans alt : ${noAlt.join(', ')}`);
  const dashes = await page.evaluate(() => (document.body.innerText.match(/[–—]/g) || []).length);
  if (dashes) bad(`[${tag}] ${dashes} tiret(s) long(s) dans le texte rendu`);

  // contraste AA (axe), après défilement complet pour que tout soit visible
  const axe = await new AxeBuilder({ page }).withRules(['color-contrast']).analyze();
  for (const v of axe.violations) for (const n of v.nodes.slice(0, 12)) bad(`[${tag}] contraste : ${n.target.join(' ')} ${(n.any[0] && n.any[0].message || '').replace(/\s+/g, ' ').slice(0, 140)}`);

  if (SHOTS) for (const [i, [name, sel]] of SECTIONS.entries()) {
    const ok = await page.evaluate(s => { const el = document.querySelector(s); if (!el) return false; el.scrollIntoView({ block: 'start' }); window.scrollBy(0, -70); return true; }, sel);
    if (!ok) continue;
    await page.waitForTimeout(1100);
    await page.screenshot({ path: path.join(OUT, `${tag}-${String(i + 1).padStart(2, '0')}-${name}.png`) });
  }
  if (errors.length) bad(`[${tag}] erreurs console : ${errors.slice(0, 5).join(' | ')}`);
  const kb = n => (n / 1024).toFixed(0) + ' Ko';
  console.log(`\n[${tag}] chargement ${loadMs} ms (DOMContentLoaded ${nav.dcl} ms, load ${nav.load} ms, serveur local)`);
  console.log(`[${tag}] poids page entièrement défilée : ${kb(totalGz)} transférés (texte compressé gzip), ${kb(total)} brut`);
  console.log(`[${tag}] détail : ` + Object.entries(bytes).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${kb(v)}`).join(', '));
  await ctx.close();
}
await browser.close();
server.close();

console.log('\n' + (report.problems.length ? `PROBLÈMES (${report.problems.length}) :\n- ` + report.problems.join('\n- ') : 'AUCUN PROBLÈME'));
if (report.notes.length) console.log('\nNotes :\n- ' + report.notes.join('\n- '));
process.exitCode = report.problems.length ? 1 : 0;
