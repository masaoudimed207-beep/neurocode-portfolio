// Test du ROI interactif : bouge les curseurs et vérifie que le calcul et le gagnant changent.
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const b = await chromium.launch({ channel: 'msedge' });
for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const p = await b.newPage({ viewport: vp });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto(pathToFileURL(path.join(ROOT, 'index.html')).href + '?lang=en');
  await p.waitForTimeout(2500);
  await p.evaluate(() => document.querySelector('#roi').scrollIntoView());
  await p.waitForTimeout(800);
  if (vp.width > 900) await p.evaluate(() => window.scrollBy(0, 900));
  await p.waitForTimeout(5200);
  const read = () => p.evaluate(() => ({ win: document.querySelector('#roi').dataset.win, a: [...document.querySelectorAll('#ca dd')].map(d => d.textContent), b: [...document.querySelectorAll('#cb dd')].map(d => d.textContent), cmd: document.querySelector('.roi-cmd').textContent, verdict: document.querySelector('.roi-verdict').innerText }));
  console.log(vp.width, 'réel  ', JSON.stringify(await read()));
  await p.evaluate(() => { const i = document.querySelector('#r-km'); i.value = 3; i.dispatchEvent(new Event('input', { bubbles: true })); });
  await p.waitForTimeout(900);
  console.log(vp.width, 'km=3  ', JSON.stringify(await read()));
  await p.evaluate(() => document.querySelector('.roi-ctrl').scrollIntoView({ block: 'end' }));
  await p.screenshot({ path: path.join(ROOT, 'tools/shots', `q-roi-km3-${vp.width}.png`) });
  await p.click('.roi-reset'); await p.waitForTimeout(900);
  console.log(vp.width, 'reset ', JSON.stringify(await read()), errs.join('|'));
  await p.close();
}
await b.close();
