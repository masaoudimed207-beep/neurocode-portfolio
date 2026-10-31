/* Mini-terminal caché : touche ~ (ou le bouton du pied de page).
   Quelques commandes pour parcourir le site comme un développeur. Échap pour fermer. */
(() => {
  const { $ } = window.NC;
  if ($('.nc-term')) return;
  const fr = () => window.NC.lang() === 'fr';
  const T = {
    hello: ['Type "help" to see what I can do.', 'Tapez « help » pour voir les commandes.'],
    help: ['Commands', 'Commandes'],
    unknown: ['command not found: {c}. Try "help".', 'commande introuvable : {c}. Essayez « help ».'],
    whoami: ['mohamed_messaoudi · AI & data engineering student · EST Meknès, Morocco', 'mohamed_messaoudi · étudiant en IA & data · EST Meknès, Maroc'],
    open: ['opening {x}…', 'ouverture de {x}…'],
    lang: ['language switched.', 'langue changée.'],
    bye: ['bye.', 'à bientôt.'],
    status: ['open to an internship, April to May 2027 · AI, data or full-stack', 'ouvert à un stage, avril à mai 2027 · IA, data ou full-stack'],
  };
  const t = (k, v = {}) => { let s = T[k][fr() ? 1 : 0]; for (const x in v) s = s.split('{' + x + '}').join(v[x]); return s; };
  const go = (sel) => { const el = $(sel); if (el) el.scrollIntoView({ behavior: window.NC.reduce ? 'auto' : 'smooth' }); };
  const CMDS = {
    help: { en: 'list commands', fr: 'liste des commandes', run: () => [t('help') + ':', ...Object.keys(CMDS).map(k => '  ' + k.padEnd(10) + CMDS[k][fr() ? 'fr' : 'en'])] },
    whoami: { en: 'who is this?', fr: 'qui est-ce ?', run: () => [t('whoami')] },
    status: { en: 'availability', fr: 'disponibilité', run: () => [t('status')] },
    projects: { en: 'list projects', fr: 'liste des projets', run: () => ['01  BFRET Fuel Optimizer   shipped', '02  InnoSoft fuel alerts    wip', '03  Kounach (bookshop app)  wip'] },
    skills: { en: 'jump to the toolbox', fr: 'aller aux compétences', run: () => { go('#skills'); return [t('open', { x: '#skills' })]; } },
    work: { en: 'jump to the case study', fr: 'aller au projet', run: () => { go('#work'); return [t('open', { x: '#work' })]; } },
    cv: { en: 'download my CV', fr: 'télécharger mon CV', run: () => { const a = $('a[href*="CV_Mohamed_Messaoudi"]'); if (a) window.open(a.href, '_blank', 'noopener'); return [t('open', { x: a ? a.getAttribute('href') : 'CV' })]; } },
    contact: { en: 'get in touch', fr: 'me contacter', run: () => { go('#contact'); return ['masaoudimed207@gmail.com']; } },
    lang: { en: 'lang fr | lang en', fr: 'lang fr | lang en', run: (a) => { const l = a[0] === 'fr' || a[0] === 'en' ? a[0] : (fr() ? 'en' : 'fr'); if (window.NC.setLang) window.NC.setLang(l); return [t('lang')]; } },
    clear: { en: 'clear the screen', fr: 'effacer l’écran', run: () => { out.textContent = ''; return []; } },
    exit: { en: 'close', fr: 'fermer', run: () => { setTimeout(close, 250); return [t('bye')]; } },
  };

  const box = document.createElement('div');
  box.className = 'nc-term';
  box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Terminal');
  box.innerHTML = '<div class="nt-win"><div class="nt-bar"><i></i><i></i><i></i><span>mohamed@neurocode: ~</span><button type="button" class="nt-x" aria-label="Close">×</button></div>' +
    '<div class="nt-out" aria-live="polite"></div><form class="nt-in"><label><span aria-hidden="true">~ $</span><input autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Command"></label></form></div>';
  document.body.appendChild(box);
  const out = $('.nt-out', box), input = $('input', box), hist = []; let hi = 0, opener = null;

  const print = (lines, cls) => { lines.forEach(l => { const p = document.createElement('p'); if (cls) p.className = cls; p.textContent = l; out.appendChild(p); }); out.scrollTop = out.scrollHeight; };
  const run = (raw) => {
    const [c, ...args] = raw.trim().split(/\s+/); if (!c) return;
    print(['~ $ ' + raw.trim()], 'cmd');
    hist.push(raw); hi = hist.length;
    const k = c.toLowerCase();
    print(CMDS[k] ? CMDS[k].run(args) : [t('unknown', { c })], CMDS[k] ? '' : 'err');
  };
  const open = () => {
    opener = document.activeElement;
    box.classList.add('on');
    if (!out.childElementCount) print([t('hello')], 'dim');
    setTimeout(() => input.focus(), 30);
  };
  const close = () => { box.classList.remove('on'); if (opener && opener.focus) opener.focus(); };

  $('form', box).addEventListener('submit', (e) => { e.preventDefault(); run(input.value); input.value = ''; });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && hi > 0) { input.value = hist[--hi]; e.preventDefault(); }
    else if (e.key === 'ArrowDown') { hi = Math.min(hist.length, hi + 1); input.value = hist[hi] || ''; e.preventDefault(); }
    else if (e.key === 'Tab') { const m = Object.keys(CMDS).filter(k => k.startsWith(input.value)); if (m.length === 1) input.value = m[0]; e.preventDefault(); }
  });
  box.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  $('.nt-x', box).addEventListener('click', close);
  window.NC.term = { open, close, toggle: () => (box.classList.contains('on') ? close() : open()) };
})();
