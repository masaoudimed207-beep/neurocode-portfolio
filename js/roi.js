/* Detour ROI : le scroll (ordinateur) ou le temps (mobile) raconte le cas réel,
   puis le visiteur change les paramètres et le calcul se refait sous ses yeux.
   Formule du moteur : net = (prix_moyen - prix) x litres - (2 x km / 100) x conso x prix */
(() => {
  const { $, $$, reduce } = window.NC;
  const roi = $('#roi'); if (!roi) return;
  const road = $('#road'), detour = $('#detour'), truck = $('#truck'), sa = $('#sa'), sb = $('#sb');
  const detLbl = $('.det-lbl', roi), form = $('.roi-ctrl', roi), cmd = $('.roi-cmd', roi);
  const cards = { a: $('#ca'), b: $('#cb') };

  // Cas réel (sortie du moteur, prix du 22/10/2026) : A 7,39 / -2,59 / 4,81 et B 27,55 / -25,43 / 2,12
  const TANK = 800, AVG = 2.1682, PRICE_A = 2.155, KM_A = 2;
  const REAL = { level: 30, km: 20, price: 2.119, conso: 30 };
  const P = { ...REAL };

  const calc = () => {
    const litres = TANK * (1 - P.level / 100);
    const a = { g: (AVG - PRICE_A) * litres, c: 2 * KM_A / 100 * P.conso * PRICE_A };
    const b = { g: (AVG - P.price) * litres, c: 2 * P.km / 100 * P.conso * P.price };
    a.n = a.g - a.c; b.n = b.g - b.c;
    return { a, b, win: a.n >= b.n ? 'a' : 'b' };
  };
  const money = (v) => (v > 0.0049 ? '+' : v < -0.0049 ? '−' : '') + window.NC.num(Math.abs(v), 2) + ' €';

  /* ---------- géométrie de la carte ---------- */
  const L = road.getTotalLength(), tA = 0.40;
  let tSplit = 0.7, best = 1e9;
  for (let k = 0; k <= 400; k++) { const q = road.getPointAtLength(L * k / 400), d = Math.abs(q.x - 575); if (d < best) { best = d; tSplit = k / 400; } }
  const pA = road.getPointAtLength(L * tA), pS = road.getPointAtLength(L * tSplit);
  sa.setAttribute('transform', `translate(${pA.x} ${pA.y})`);
  let LD = 1;
  const layout = () => {
    const bx = 640, by = pS.y + 46 + P.km * 5.9;
    sb.setAttribute('transform', `translate(${bx} ${by})`);
    sb.classList.toggle('near', P.km < 10);
    detour.setAttribute('d', `M${pS.x} ${pS.y} C ${pS.x + 26} ${pS.y + 40}, ${bx} ${Math.max(pS.y + 20, by - 70)}, ${bx} ${by - 34}`);
    LD = Math.max(1, detour.getTotalLength());
    detour.style.strokeDasharray = `${LD}`;
    detLbl.setAttribute('x', bx - 34); detLbl.setAttribute('y', (pS.y + by) / 2 + 8);
    detLbl.textContent = window.NC.t('roi.detT', { km: P.km });
    $('.pb', sb).textContent = window.NC.num(P.price, 3);
    $('.pa', sa).textContent = window.NC.num(PRICE_A, 3);
  };

  /* ---------- affichage ---------- */
  let manual = false, prog = 0;
  const clamp = (x) => Math.max(0, Math.min(1, x));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const paint = (key, r, k1, k2, animate) => {
    const c = cards[key], dd = $$('dd', c), MAX = Math.max(r.a.g, r.b.g, 1);
    const g = r[key].g * k1, cost = r[key].c * k2, net = g - cost;
    const vals = [g, -cost, net];
    dd.forEach((el, i) => { if (animate) window.NC.tween(el, vals[i], money); else { cancelAnimationFrame(el._raf); el._v = vals[i]; el.textContent = money(vals[i]); } });
    const gw = Math.max(0, g) / MAX * 100, cw = cost / MAX * 100;
    $('.g', c).style.width = gw + '%'; const ci = $('.c', c); ci.style.width = Math.min(cw, 100) + '%'; ci.style.left = Math.max(0, gw - cw) + '%';
  };
  const place = (p) => {
    let pt;
    if (p < 0.2) pt = road.getPointAtLength(L * tA * seg(p, 0, 0.2));
    else if (p < 0.42) pt = pA;
    else if (p < 0.55) pt = road.getPointAtLength(L * (tA + (tSplit - tA) * seg(p, 0.42, 0.55)));
    else if (p < 0.72) pt = detour.getPointAtLength(LD * seg(p, 0.55, 0.72));
    else if (p < 0.9) pt = detour.getPointAtLength(LD * (1 - seg(p, 0.72, 0.9)));
    else pt = road.getPointAtLength(L * (tSplit + (1 - tSplit) * seg(p, 0.9, 1)));
    truck.setAttribute('transform', `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
  };
  const render = (animate) => {
    const r = calc(), p = manual ? 1 : prog;
    place(prog);
    detour.style.strokeDashoffset = `${LD * (1 - (manual ? 1 : seg(p, 0.55, 0.72)))}`;
    paint('a', r, seg(p, 0.2, 0.3), seg(p, 0.3, 0.4), animate);
    paint('b', r, seg(p, 0.55, 0.65), seg(p, 0.65, 0.88), animate);
    const done = manual || p > 0.9;
    roi.classList.toggle('p2', manual || p > 0.55);
    roi.classList.toggle('done', done);
    roi.dataset.win = r.win;
    ['a', 'b'].forEach(k => {
      cards[k].classList.toggle('win', done && r.win === k);
      $('.rc-badge', cards[k]).textContent = window.NC.t(r.win === k ? 'roi.keep' : 'roi.drop');
    });
  };

  /* ---------- curseurs ---------- */
  const out = {
    level: (v) => v + ' %', km: (v) => v + ' km',
    price: (v) => window.NC.num(v, 3) + ' €/L', conso: (v) => v + ' L/100 km'
  };
  const readForm = () => {
    $$('input', form).forEach(i => { P[i.name] = +i.value; $(`output[for="${i.id}"]`, form).textContent = out[i.name](+i.value); });
    cmd.textContent = `python optimizer.py --level ${P.level} --detour ${P.km} --price ${P.price.toFixed(3)} --conso ${P.conso}`;
    roi.classList.toggle('edited', Object.keys(REAL).some(k => P[k] !== REAL[k]));
  };
  form.addEventListener('input', () => { manual = true; readForm(); layout(); render(true); });
  form.addEventListener('reset', () => setTimeout(() => { readForm(); layout(); render(true); }));
  form.addEventListener('submit', (e) => e.preventDefault());

  /* ---------- pilotage : scroll sur grand écran, temps sur mobile ---------- */
  const desk = matchMedia('(min-width: 900px) and (min-height: 640px)');
  const fromScroll = () => {
    const r = roi.getBoundingClientRect(), span = r.height - innerHeight;
    return clamp(-r.top / Math.max(1, span) * 1.15);
  };
  let playRaf = 0;
  const play = () => {
    cancelAnimationFrame(playRaf);
    const t0 = performance.now(), D = 4800;
    const tick = (t) => { prog = clamp((t - t0) / D); render(false); if (prog < 1) playRaf = requestAnimationFrame(tick); };
    playRaf = requestAnimationFrame(tick);
  };
  if (reduce) prog = 1;
  else if (!desk.matches) {
    // mobile : pas de blocage du scroll, l'histoire se joue à chaque entrée dans l'écran
    let shown = false;
    new IntersectionObserver(es => es.forEach(e => {
      if (e.intersectionRatio >= 0.3 && !shown) { shown = true; play(); }
      else if (!e.isIntersecting && shown) { shown = false; cancelAnimationFrame(playRaf); if (!manual) { prog = 0; render(false); } }
    }), { threshold: [0, 0.3] }).observe(roi);
  }
  window.__roi = () => { if (!reduce && desk.matches) { const p = fromScroll(); if (p !== prog) { prog = p; render(false); } } };
  document.addEventListener('nc:lang', () => { readForm(); layout(); render(false); });

  readForm(); layout();
  if (!reduce && desk.matches) prog = fromScroll();
  render(false);
  roi.classList.add('ready');
})();
