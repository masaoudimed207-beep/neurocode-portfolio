/* Hero : un réseau de neurones en 3D (canvas 2D, sans bibliothèque) derrière le portrait.
   Les nœuds sont posés sur une sphère, reliés à leurs voisins proches, et des signaux
   circulent sur les liaisons. Pause hors écran et onglet caché ; image fixe si mouvement réduit. */
(() => {
  const { $, reduce } = window.NC;
  const stage = $('.hero-stage'); if (!stage) return;
  const cv = document.createElement('canvas');
  cv.className = 'hero-net'; cv.setAttribute('aria-hidden', 'true');
  stage.prepend(cv);
  const ctx = cv.getContext('2d');
  const css = getComputedStyle(document.documentElement);
  const ACC = css.getPropertyValue('--accent').trim() || '#3B55E6';
  const ACC2 = css.getPropertyValue('--accent-2').trim() || '#C26A4A';

  // nœuds : sphère de Fibonacci, plus quelques nœuds intérieurs (les couches cachées)
  const N = 84, P = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.39996;
    P.push([Math.cos(th) * r, y, Math.sin(th) * r]);
  }
  for (let i = 0; i < 14; i++) { const a = i * 2.4, b = i * 1.3; P.push([Math.cos(a) * .45 * Math.sin(b), Math.cos(b) * .45, Math.sin(a) * .45 * Math.sin(b)]); }
  // liaisons : chaque nœud vers ses 3 plus proches voisins
  const E = [], seen = new Set();
  P.forEach((p, i) => {
    P.map((q, j) => [j, (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2])
      .filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]).slice(0, 3)
      .forEach(([j]) => { const k = i < j ? i + ':' + j : j + ':' + i; if (!seen.has(k)) { seen.add(k); E.push([i, j]); } });
  });
  // signaux qui voyagent sur les liaisons
  const S = Array.from({ length: 10 }, (_, i) => ({ e: (i * 37) % E.length, t: Math.random() }));

  let W = 0, H = 0, R = 0, cx = 0, cy = 0, dpr = 1;
  const size = () => {
    const b = stage.getBoundingClientRect();
    dpr = Math.min(2, devicePixelRatio || 1);
    W = b.width; H = b.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    const mob = W < 768;
    R = Math.min(W * (mob ? .46 : .3), H * (mob ? .34 : .42));
    cx = W * (mob ? .5 : .5); cy = H * (mob ? .5 : .5);
  };

  let ax = .35, ay = 0, mx = 0, my = 0, tmx = 0, tmy = 0, grow = reduce ? 1 : 0;
  const proj = (p) => {
    const cosY = Math.cos(ay), sinY = Math.sin(ay), cosX = Math.cos(ax + my * .25), sinX = Math.sin(ax + my * .25);
    let x = p[0] * cosY - p[2] * sinY, z = p[0] * sinY + p[2] * cosY;
    const y = p[1] * cosX - z * sinX; z = p[1] * sinX + z * cosX;
    const f = 2.6 / (2.6 + z), k = R * grow;
    return [cx + (x + mx * .08) * k * f, cy + y * k * f, z, f];
  };
  const draw = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const Q = P.map(proj);
    ctx.lineWidth = 1;
    for (const [i, j] of E) {
      const a = Q[i], b = Q[j], d = (a[2] + b[2]) / 2; // d de -1 (devant) à 1 (derrière)
      ctx.globalAlpha = .1 + (1 - d) * .16;
      ctx.strokeStyle = ACC;
      ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
    }
    for (let i = 0; i < Q.length; i++) {
      const q = Q[i], inner = i >= N;
      ctx.globalAlpha = .35 + (1 - q[2]) * .3;
      ctx.fillStyle = inner ? ACC2 : ACC;
      ctx.beginPath(); ctx.arc(q[0], q[1], (inner ? 2.6 : 2.1) * q[3] * (W < 768 ? .9 : 1.15), 0, 6.283); ctx.fill();
    }
    for (const s of S) {
      const [i, j] = E[s.e], a = Q[i], b = Q[j];
      const x = a[0] + (b[0] - a[0]) * s.t, y = a[1] + (b[1] - a[1]) * s.t;
      ctx.globalAlpha = .9; ctx.fillStyle = ACC2;
      ctx.beginPath(); ctx.arc(x, y, 3.2, 0, 6.283); ctx.fill();
      ctx.globalAlpha = .18; ctx.beginPath(); ctx.arc(x, y, 8, 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  let raf = 0, last = 0, on = false;
  const step = (t) => {
    const dt = Math.min(50, t - (last || t)); last = t;
    ay += dt * .00011; mx += (tmx - mx) * .05; my += (tmy - my) * .05;
    if (grow < 1) grow = Math.min(1, grow + dt / 1400);
    for (const s of S) {
      s.t += dt * .0011;
      if (s.t >= 1) { // le signal continue sur une liaison voisine
        const end = E[s.e][1], next = E.map((e, k) => [e, k]).filter(([e]) => e[0] === end);
        s.e = next.length ? next[(Math.random() * next.length) | 0][1] : (Math.random() * E.length) | 0; s.t = 0;
      }
    }
    draw();
    raf = requestAnimationFrame(step);
  };
  const play = () => { if (on || reduce || document.hidden) return; on = true; last = 0; raf = requestAnimationFrame(step); };
  const stop = () => { on = false; cancelAnimationFrame(raf); };

  size(); draw();
  addEventListener('resize', () => { size(); draw(); });
  if (!reduce) {
    new IntersectionObserver(es => es.forEach(e => (e.isIntersecting ? play() : stop()))).observe(stage);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : play()));
    if (matchMedia('(pointer:fine)').matches) addEventListener('mousemove', e => { tmx = e.clientX / innerWidth - .5; tmy = e.clientY / innerHeight - .5; }, { passive: true });
  }
  cv.classList.add('on');
})();
