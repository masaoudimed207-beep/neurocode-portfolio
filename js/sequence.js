/* Séquence au scroll « des données brutes à une décision ».
   44 images WebP (assets/sequence) dessinées dans un canvas collant, selon la position de défilement.
   Préchargement avec indicateur ; image fixe si mouvement réduit, économie de données ou erreur de chargement. */
(() => {
  const sec = document.getElementById('sequence'); if (!sec) return;
  const N = 44, canvas = sec.querySelector('.seq-canvas'), pct = sec.querySelector('.seq-pct'), steps = [...sec.querySelectorAll('.seq-steps li')];
  const still = () => sec.classList.add('still');
  const saveData = navigator.connection && navigator.connection.saveData;
  if (NC.reduce || saveData || !canvas.getContext) return still();

  const ctx = canvas.getContext('2d');
  const set = innerWidth < 768 ? 'm' : 'd';
  const frames = [];
  let cur = 0, target = 0, raf = 0, visible = false, ready = false;

  // dimensions : « cover » sur grand écran, « contain » sur écran étroit (les bandes restent sur le même fond)
  const size = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2), w = canvas.clientWidth, h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    if (ready) draw(cur);
  };
  const draw = f => {
    const i = Math.min(N - 1, Math.floor(f)), a = f - i, img = frames[i];
    const cw = canvas.width, ch = canvas.height, r = img.naturalWidth / img.naturalHeight;
    const wide = cw / ch > 1.2; // écran étroit : image entière, agrandie de 25 % (les bords de la scène sont vides)
    const s = wide ? Math.max(cw / img.naturalWidth, ch / img.naturalHeight) : Math.min(cw / img.naturalWidth, ch / img.naturalHeight) * 1.25, dw = img.naturalWidth * s, dh = dw / r;
    const x = (cw - dw) / 2, y = (ch - dh) / 2;
    ctx.globalAlpha = 1; ctx.fillStyle = '#15171C'; ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, dw, dh);
    if (a > 0.01 && frames[i + 1]) { ctx.globalAlpha = a; ctx.drawImage(frames[i + 1], x, y, dw, dh); } // fondu entre deux images
  };
  const progress = () => {
    const r = sec.getBoundingClientRect(), run = r.height - innerHeight;
    return run > 0 ? Math.min(1, Math.max(0, -r.top / run)) : 0;
  };
  const caption = p => { const k = p < 0.3 ? 0 : p < 0.62 ? 1 : 2; steps.forEach((li, j) => li.classList.toggle('on', j === k)); };
  // lissage : l'image courante rejoint la cible, puis la boucle s'arrête
  const tick = () => {
    cur += (target - cur) * 0.18;
    if (Math.abs(target - cur) < 0.01) cur = target;
    draw(cur);
    raf = cur === target ? 0 : requestAnimationFrame(tick);
  };
  const onScroll = () => {
    if (!ready || !visible) return;
    const p = progress(); target = p * (N - 1); caption(p);
    if (!raf) raf = requestAnimationFrame(tick);
  };

  const start = () => {
    let done = 0;
    const loads = Array.from({ length: N }, (_, i) => new Promise((ok, ko) => {
      const img = new Image(); img.decoding = 'async';
      img.onload = () => { frames[i] = img; done++; pct.textContent = Math.round(done / N * 100); ok(); };
      img.onerror = ko;
      img.src = `assets/sequence/${set}-${String(i).padStart(2, '0')}.webp`;
    }));
    Promise.all(loads).then(() => {
      ready = true; size();
      cur = target = progress() * (N - 1); caption(progress()); draw(cur);
      sec.classList.add('ready');
    }, still);
  };

  new IntersectionObserver(es => { visible = es.some(e => e.isIntersecting); if (visible) onScroll(); }).observe(sec);
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', size);
  caption(0); size();
  // préchargement après le chargement de la page, quand la section approche
  const near = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { near.disconnect(); start(); } }, { rootMargin: '100% 0px' });
  const arm = () => near.observe(sec);
  if (document.readyState === 'complete') arm(); else addEventListener('load', arm, { once: true });
})();
