// Capture rapide d'une section : node tools/shot.mjs <selecteur> [desktop|mobile] [en|fr] [decalage_px] [attente_ms]
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const [sel = 'body', vp = 'desktop', lang = 'en', off = '0', wait = '1500'] = process.argv.slice(2);
const size = vp === 'mobile' ? { width: 390, height: 844 } : { width: 1440, height: 900 };
const b = await chromium.launch({ channel: 'msedge' });
const p = await b.newPage({ viewport: size });
const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
await p.goto(pathToFileURL(path.join(ROOT, 'index.html')).href + '?lang=' + lang);
await p.waitForTimeout(2600);
await p.evaluate(([s, o]) => { const el = document.querySelector(s); if (el) { el.scrollIntoView({ block: 'start' }); window.scrollBy(0, +o); } }, [sel, off]);
await p.waitForTimeout(+wait);
const out = path.join(ROOT, 'tools', 'shots', `q-${vp}-${lang}-${sel.replace(/[^a-z0-9]+/gi, '_')}.png`);
await p.screenshot({ path: out });
console.log(out, errs.length ? 'ERREURS: ' + errs.join(' | ') : 'ok');
await b.close();
