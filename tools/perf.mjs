// Mesure la fluidité du scroll sur ordinateur : node tools/perf.mjs [--runs=3] [--width=1440]
// Défilement à la molette du haut vers le bas, souris posée sur la page, trace de performance Chromium.
// Donne : images par seconde, images lentes (> 25 ms), longues tâches (> 50 ms),
// recalculs de style et mises en page forcés par le JavaScript (lecture de géométrie après une écriture).
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith(`--${k}=`)); return a ? +a.split('=')[1] : d; };
const RUNS = arg('runs', 3), WIDTH = arg('width', 1440);
// --css="..." : diagnostic seulement, injecte un style pour mesurer le coût d'un effet (jamais dans le site)
const CSS = (process.argv.find(x => x.startsWith('--css=')) || '').slice(6);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.avif': 'image/avif', '.png': 'image/png', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webm': 'video/webm', '.pdf': 'application/pdf' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const URL_ = `http://127.0.0.1:${server.address().port}/?lang=en`;

const browser = await chromium.launch({ channel: 'msedge' });
const results = [];
for (let run = 0; run < RUNS; run++) {
  const page = await browser.newPage({ viewport: { width: WIDTH, height: 900 } });
  await page.goto(URL_, { waitUntil: 'load' });
  if (CSS) await page.addStyleTag({ content: CSS });
  await page.mouse.move(WIDTH / 2, 450);
  await page.waitForTimeout(5000); // intro et chargements différés terminés

  await browser.startTracing(page, { categories: ['devtools.timeline', 'disabled-by-default-devtools.timeline'] });
  await page.evaluate(() => {
    window.__f = []; const f = t => { window.__f.push(t); if (!window.__stop) requestAnimationFrame(f); }; requestAnimationFrame(f);
  });
  const max = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  let y = 0, k = 0;
  while (y < max - 5) { // molette : 100 px toutes les 16 ms, la souris bouge un peu comme une vraie main
    await page.mouse.wheel(0, 100); await page.waitForTimeout(16);
    if (++k % 6 === 0) await page.mouse.move(WIDTH / 2 + (k % 12 ? 40 : -40), 450);
    y = await page.evaluate(() => scrollY);
  }
  await page.waitForTimeout(400);
  const frames = await page.evaluate(() => { window.__stop = true; return window.__f; });
  const trace = JSON.parse((await browser.stopTracing()).toString());
  await page.close();

  const ev = trace.traceEvents;
  const main = ev.find(e => e.name === 'thread_name' && e.args && e.args.name === 'CrRendererMain');
  const onMain = e => !main || (e.pid === main.pid && e.tid === main.tid);
  const longTasks = ev.filter(e => e.name === 'RunTask' && e.ph === 'X' && onMain(e) && e.dur > 50000).length;
  // forcé = le recalcul a lieu pendant l'exécution d'un script (le script a lu une géométrie)
  const JS = new Set(['FunctionCall', 'EvaluateScript', 'FireAnimationFrame', 'EventDispatch', 'TimerFire', 'v8.callFunction']);
  const spans = ev.filter(e => JS.has(e.name) && e.ph === 'X' && onMain(e)).map(e => [e.ts, e.ts + e.dur]).sort((a, b) => a[0] - b[0]);
  const inJs = t => { let lo = 0, hi = spans.length - 1, best = -1; while (lo <= hi) { const m = (lo + hi) >> 1; if (spans[m][0] <= t) { best = m; lo = m + 1; } else hi = m - 1; } for (let i = best; i >= 0 && i > best - 50; i--) if (spans[i][1] >= t) return true; return false; };
  const forced = n => ev.filter(e => e.name === n && e.ph === 'X' && onMain(e) && inJs(e.ts)).length;
  if (process.argv.includes('--why') && run === 0) { // d'où viennent les recalculs forcés : script et ligne
    const calls = ev.filter(e => e.name === 'FunctionCall' && e.ph === 'X' && onMain(e) && e.args && e.args.data);
    const who = {};
    for (const l of ev.filter(e => (e.name === 'Layout' || e.name === 'UpdateLayoutTree') && e.ph === 'X' && onMain(e) && inJs(e.ts))) {
      const c = calls.filter(f => f.ts <= l.ts && f.ts + f.dur >= l.ts).pop();
      const k = `${l.name} ← ${c ? `${(c.args.data.url || '').split('/').pop()}:${c.args.data.lineNumber} ${c.args.data.functionName || '(anonyme)'}` : 'hors FunctionCall'}`;
      who[k] = (who[k] || 0) + 1;
    }
    console.log(Object.entries(who).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, v]) => `  ${v}  ${k}`).join('\n'));
  }
  const gaps = frames.slice(1).map((t, i) => t - frames[i]);
  const dur = (frames[frames.length - 1] - frames[0]) / 1000;
  results.push({
    fps: frames.length / dur,
    slow: gaps.filter(g => g > 25).length,
    longTasks,
    style: forced('UpdateLayoutTree'),
    layout: forced('Layout'),
    paint: ev.filter(e => e.name === 'Paint' && e.ph === 'X' && onMain(e)).reduce((s, e) => s + e.dur, 0) / 1000,
  });
}
await browser.close(); server.close();

const med = k => { const v = results.map(r => r[k]).sort((a, b) => a - b); return v[Math.floor(v.length / 2)]; };
console.log(`Scroll en ${WIDTH} px, ${RUNS} passages (médiane) :`);
console.log(`  images par seconde        : ${med('fps').toFixed(1)}`);
console.log(`  images lentes (> 25 ms)   : ${med('slow')}`);
console.log(`  longues tâches (> 50 ms)  : ${med('longTasks')}`);
console.log(`  recalculs de style forcés : ${med('style')}`);
console.log(`  mises en page forcées     : ${med('layout')}`);
console.log(`  temps de peinture (ms)    : ${med('paint').toFixed(0)}`);
console.log('  détail par passage :', results.map(r => `${r.fps.toFixed(1)} i/s, ${r.slow} lentes, ${r.longTasks} LT, ${r.style} style, ${r.layout} layout`).join(' | '));
