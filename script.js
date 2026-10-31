/* NeuroCode_Med · portfolio v3 interactions (vanilla) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- intro: counter, then the curtain opens on the hero ---------- */
  const startHero = () => root.classList.add('go');
  if (!root.classList.contains('intro-on')) {
    startHero();
  } else {
    const num = $('.intro-count span'), line = $('.intro-line i');
    const t0 = performance.now(), D = 1300;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 3);
      num.textContent = Math.round(e * 100); line.style.transform = `scaleX(${e})`;
      if (k < 1) return requestAnimationFrame(tick);
      const img = $('.hero-portrait'), t1 = performance.now();
      const open = () => {
        root.classList.add('intro-out');
        setTimeout(startHero, 250);
        setTimeout(() => root.classList.remove('intro-on', 'intro-out'), 1300);
      };
      const wait = () => (img.complete || performance.now() - t1 > 2500) ? open() : setTimeout(wait, 60);
      wait();
    };
    requestAnimationFrame(tick);
    try { sessionStorage.setItem('intro', '1'); } catch (e) {}
  }

  /* ---------- i18n (EN lives in the HTML, FR here) ---------- */
  const FR = {
    'nav.about': 'À propos', 'nav.work': 'Projets', 'nav.skills': 'Compétences', 'nav.path': 'Parcours', 'nav.contact': 'Contact', 'nav.cv': 'Télécharger le CV',
    'hero.kicker': 'Étudiant en Génie Informatique · EST Meknès, Maroc',
    'hero.lead': 'Je transforme de vrais problèmes d’entreprise en outils IA, data et full-stack qui fonctionnent. Testés, mesurés, livrés.',
    'hero.cta1': 'Voir mes projets', 'hero.cta2': 'Me recruter en stage',
    'about.title': 'JE SUIS MOHAMED',
    'about.p1': 'Étudiant en 2e année de DUT Génie Informatique à l’EST Meknès. Je travaille là où l’IA, la data et le logiciel se rencontrent, et je préfère livrer un outil fiable plutôt qu’une démo spectaculaire.',
    'about.p2': 'Le « Neuro » de NeuroCode vient d’une curiosité ancienne pour le fonctionnement de l’esprit, humain comme artificiel. Le « Code », c’est ma façon d’en faire des outils.',
    'about.s1': 'tests automatisés sur mes trois projets', 'about.s2': 'projets réels pour de vraies entreprises : transport, suivi de flotte, librairie', 'about.s3': 'véhicules dans la flotte pour laquelle je construis un assistant IA',
    'work.eyebrow': 'Projet sélectionné', 'work.title': 'Projet phare', 'work.tag': 'Stage · SaaS · Optimisation',
    'work.lead': 'La station la moins chère n’est souvent pas la meilleure. J’ai conçu un moteur qui classe les stations selon <b>l’économie nette une fois le détour payé</b>, puis j’en ai fait une plateforme multi-entreprises qui mesure ce qu’une flotte économise vraiment.',
    'work.read': 'Lire l’étude de cas',
    'case.role': 'Rôle', 'case.roleV': 'Stagiaire développeur : conception, back end, front end, tests', 'case.client': 'Entreprise', 'case.when': 'Période', 'case.whenV': 'Juillet 2026, poursuivi de ma propre initiative en août', 'case.sup': 'Encadrant',
    'case.h1': 'Le problème',
    'case.p1': 'Un logiciel de transport planifie les tournées et le chargement, mais l’arrêt carburant reste au choix du chauffeur, qui ne voit que le prix au litre. Or un détour se paie en carburant et peut effacer l’économie. Faites défiler l’exemple ci-dessous : ce sont les vrais résultats de mon moteur.',
    'roi.k': 'Detour ROI · sortie réelle du moteur', 'roi.v': 'Le prix le plus bas n’est pas la meilleure affaire.',
    'roi.sa': 'A · 2,155 €/L', 'roi.sb': 'B · 2,119 €/L', 'roi.start': 'Départ', 'roi.end': 'Arrivée', 'roi.det': '20 km de détour, aller et retour',
    'roi.a': 'Station A, sur la route', 'roi.b': 'Station B, la moins chère', 'roi.keep': 'Retenue', 'roi.drop': 'Écartée',
    'roi.gross': 'Gain sur le prix', 'roi.cost': 'Coût du détour', 'roi.net': 'Économie nette',
    'roi.note': 'Camion : réservoir de 800 L à 30 %, donc 560 L à acheter, 30 L/100 km. Le détour compte deux fois, car le camion doit revenir sur sa route.',
    'case.h2': 'Comment le moteur décide',
    'case.p2': 'Il cherche d’abord où un arrêt a du sens, à partir du réservoir, du niveau, de la consommation et d’une marge de sécurité. Ensuite il note chaque station de cette zone selon son économie nette.',
    'case.h3': 'Du prototype à la plateforme',
    'case.p3': 'Après les premiers résultats, le directeur a validé plus : plusieurs entreprises, des comptes, la gestion de flotte et un tableau de bord des économies. Les écrans ci-dessous viennent de l’application en marche sur des données publiques réelles (prix du 22/10/2026).',
    'case.t1': 'Chaque entreprise ne voit que ses données. Je l’ai testé avec deux vraies sociétés côte à côte.',
    'case.t2': 'Les droits sont relus en base à chaque requête : un compte désactivé perd l’accès tout de suite.',
    'case.t3': 'Une économie ne compte que si le chauffeur confirme la station. Un chiffre plus petit, mais qu’un client peut croire.',
    'case.fig2': 'Vue chauffeur : l’itinéraire est recalculé via la station choisie (détour réel +1,7 km, 13,17 € économisés).',
    'case.fig3': 'Vue gestionnaire : seules les économies confirmées sont additionnées.',
    'case.fig4': 'La carte, faite avec Leaflet et le calcul d’itinéraire gratuit OSRM.',
    'arch.h': 'Suivez une recherche dans le système', 'arch.p': 'Faites défiler : chaque étape éclaire la partie du code qui travaille.',
    'arch.l1': 'Interface · React 19 + TypeScript', 'arch.c1': 'Accueil', 'arch.c2': 'Chauffeur', 'arch.c3': 'Flotte',
    'arch.l2': 'API · FastAPI, jeton JWT, contrôle entreprise', 'arch.l3': 'Services métier · aucun HTTP dedans',
    'arch.l4': 'Données publiques en direct', 'arch.l5': 'Base de données', 'arch.l5b': 'recherches, choix',
    'arch.s1h': 'Le chauffeur saisit son trajet', 'arch.s1': 'Départ, arrivée, niveau du réservoir et camion. L’écran React l’envoie avec le jeton de connexion.',
    'arch.s2h': 'FastAPI vérifie qui demande', 'arch.s2': 'Il valide les données, relit le rôle en base et garde la requête dans l’entreprise du chauffeur.',
    'arch.s3h': 'Le moteur fait le calcul', 'arch.s3': 'L’optimiseur trouve la zone d’arrêt et note chaque station. Il ne connaît ni les comptes ni le HTTP, il pourra donc rejoindre le logiciel principal de BFRET.',
    'arch.s4h': 'Données en direct, coût zéro', 'arch.s4': 'Prix du flux officiel français, itinéraires OSRM, lieux Nominatim. La recherche est enregistrée avec les offres affichées.',
    'arch.s5h': 'Le gestionnaire voit les vraies économies', 'arch.s5': 'Quand le chauffeur choisit une station, l’économie est relue côté serveur, jamais reçue du navigateur, puis ajoutée au total de la flotte.',
    'case.h4': 'Résultats et ce que j’ai appris',
    'case.r1': 'tests réussis (106 pytest, 61 Vitest)', 'case.r2': 'de détour réel pour 13,17 € économisés sur un Paris → Lille', 'case.r3': 'de coût d’infrastructure : uniquement des données publiques gratuites',
    'case.p4': 'Sur trois bugs sérieux, les tests n’en ont trouvé qu’un. Les deux autres sont apparus dans un vrai navigateur ou aux valeurs extrêmes. Depuis, je vérifie chaque étape en conditions réelles, pas seulement avec des tests.',
    'more.eyebrow': 'En cours', 'more.title': 'Ce que je construis en ce moment',
    'p1.tag': 'Freelance · Machine learning', 'p1.status': 'Démo · données simulées', 'p1.h': 'Assistant de vérification des alertes carburant',
    'p1.p': 'Une plateforme de suivi de flotte lève des alertes de vol de carburant, et beaucoup sont fausses : bruit du capteur, pente, coupure de tension. Aujourd’hui un expert vérifie chaque graphe à la main avant d’appeler le client. Mon outil prépare chaque dossier, propose une décision avec ses raisons, et apprend de chaque réponse de l’expert.',
    'p1.f1': 'Humain dans la boucle : le système ne contacte jamais un client tout seul',
    'p1.f2': 'Isolation Forest au départ, Random Forest dès que l’expert a étiqueté des alertes',
    'p1.f3': 'Trois niveaux d’autonomie, audit aléatoire de 10 % et arrêt automatique si un vrai vol est raté',
    'p1.note': 'Les scores de la démo viennent de données simulées. Les vraies données de l’API Wialon arrivent ensuite.',
    'p2.tag': 'Produit · Hors ligne d’abord', 'p2.status': 'En développement', 'p2.h': 'Kounach, une application pour librairie',
    'p2.c': 'Librairie-papeterie à côté d’un lycée',
    'p2.p': 'À la rentrée, le magasin sert jusqu’à 100 clients par heure, sans aucun système. Kounach réunit caisse rapide, stock, crédit client (le cahier « kounach ») et service d’impression dans une seule application qui continue de marcher quand internet coupe.',
    'p2.f1': 'Une vente n’est jamais bloquée : ni par le réseau, ni par une donnée manquante',
    'p2.f2': 'Le stock est une somme de mouvements, jamais un chiffre qu’on écrase',
    'p2.f3': 'Recherche des produits en français et en arabe, raccourcis clavier pour la caisse',
    'next.k': 'Ensuite', 'next.v': 'Un CRM pour un cabinet médical, bientôt.',
    'skills.eyebrow': 'Boîte à outils', 'skills.title': 'Avec quoi je travaille', 'skills.h1': 'IA & Data', 'skills.h2': 'Back end', 'skills.h3': 'Front end', 'skills.h4': 'Qualité & outils',
    'skills.metrics': 'métriques d’évaluation', 'skills.ai': 'code assisté par IA avec vérification stricte', 'skills.langs': 'Langues', 'skills.native': '(maternelle)', 'skills.ar': 'Arabe', 'skills.fr': 'Français', 'skills.en': 'Anglais',
    'path.eyebrow': 'Parcours', 'path.title': 'Expérience & formation',
    'path.w0': 'Oct. 2026', 'path.h0': 'Freelance, InnoSoft Tracking', 'path.p0': 'Cadrage et développement d’un assistant de machine learning qui vérifie les alertes de vol de carburant avec l’expert de l’entreprise.',
    'path.w1': 'Juil. 2026', 'path.h1': 'Stagiaire développeur, BFRET (BSS), Casablanca', 'path.p1': 'Stage en télétravail. Conception et développement du Fuel Optimizer : moteur Detour ROI, back end FastAPI, front end React, sécurité multi-entreprises et tests.',
    'path.h2': 'DUT Génie Informatique, EST Meknès', 'path.p2': 'Université Moulay Ismail. Structures de données, bases de données, réseaux, web, machine learning.',
    'path.h3': 'Baccalauréat Sciences Physiques, mention Très Bien', 'path.p3': 'Lycée Moulay Idriss Al Akbar, Sefrou.',
    'path.h4': 'Autoformation', 'path.p4': 'Harvard CS50P (Python), parcours data science DataCamp.',
    'open.eyebrow': 'Travailler ensemble', 'open.title': 'Construisons quelque chose de concret.',
    'open.p': 'Je cherche un <b>stage d’avril à mai 2027</b> en IA, data ou développement full-stack, au Maroc, à l’étranger ou à distance. Je prends aussi de petites missions freelance.',
    'open.mail': 'M’écrire', 'open.c1': 'Stage', 'open.c1p': 'Avril à mai 2027 · IA, data ou full-stack · sur site, hybride ou à distance',
    'open.c2': 'Freelance', 'open.c2p': 'Applications web, tableaux de bord, pipelines de données et automatisation pour PME', 'open.c3': 'Délai de réponse', 'open.c3p': 'En général sous 24 heures',
    'footer.top': 'Haut de page ↑'
  };
  const EN = {};
  $$('[data-i18n]').forEach(el => { EN[el.dataset.i18n] = el.innerHTML; });
  const setLang = (l) => {
    const dict = l === 'fr' ? FR : EN;
    $$('[data-i18n]').forEach(el => { const v = dict[el.dataset.i18n]; if (v) el.innerHTML = v; });
    root.lang = l;
    $$('a[href*="CV_Mohamed_Messaoudi"]').forEach(a => { a.href = l === 'fr' ? 'assets/CV_Mohamed_Messaoudi.pdf' : 'assets/CV_Mohamed_Messaoudi_EN.pdf'; });
    $$('.lang [data-l]').forEach(s => s.classList.toggle('on', s.dataset.l === l));
    try { localStorage.setItem('lang', l); } catch (e) {}
    if (window.__roi) window.__roi();
  };
  let lang = new URLSearchParams(location.search).get('lang');
  if (!lang) { try { lang = localStorage.getItem('lang'); } catch (e) {} }
  if (!lang) lang = (navigator.language || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en';
  setLang(lang);
  $('.lang').addEventListener('click', () => { lang = lang === 'fr' ? 'en' : 'fr'; setLang(lang); });

  /* ---------- nav ---------- */
  const nav = $('.nav'), links = $('.nav-links'), burger = $('.burger');
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open)); links.classList.toggle('open', !open);
  });
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => { burger.setAttribute('aria-expanded', 'false'); links.classList.remove('open'); }));
  const sectionObs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) $$('.nav-links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['about', 'work', 'skills', 'path', 'contact'].forEach(id => { const s = document.getElementById(id); if (s) sectionObs.observe(s); });

  /* ---------- reveal ---------- */
  if ('IntersectionObserver' in window && !reduce) {
    const ro = new IntersectionObserver((es) => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach((el, i) => { el.style.transitionDelay = ((i % 4) * 0.07) + 's'; ro.observe(el); });
    const po = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); po.unobserve(e.target); } }), { threshold: 0.25 });
    $$('.about-photo').forEach(el => po.observe(el));
  } else { root.classList.add('js-off'); $$('.about-photo').forEach(el => el.classList.add('in')); }

  /* ---------- counters ---------- */
  const countObs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, to = +el.dataset.to, t0 = performance.now(), d = reduce ? 1 : 1400;
    const tick = (t) => { const k = Math.min(1, (t - t0) / d); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick); countObs.unobserve(el);
  }), { threshold: 0.6 });
  $$('.count').forEach(el => countObs.observe(el));

  /* ---------- Detour ROI: scroll scrubs the story ---------- */
  const roi = $('#roi');
  const road = $('#road'), detour = $('#detour'), truck = $('#truck'), sa = $('#sa');
  const L = road.getTotalLength();
  const tA = 0.40;
  const pA = road.getPointAtLength(L * tA);
  sa.setAttribute('transform', `translate(${pA.x} ${pA.y})`);
  let tSplit = 0.7, best = 1e9;
  for (let k = 0; k <= 400; k++) { const q = road.getPointAtLength(L * k / 400); const d = Math.abs(q.x - 575); if (d < best) { best = d; tSplit = k / 400; } }
  const pS = road.getPointAtLength(L * tSplit);
  detour.setAttribute('d', `M${pS.x} ${pS.y} C ${pS.x + 30} ${pS.y + 80}, 640 200, 640 265`);
  const LD = detour.getTotalLength();
  detour.style.strokeDasharray = `${LD}`; detour.style.strokeDashoffset = `${LD}`;
  const fmt = (v, sign) => {
    const n = Math.abs(v).toFixed(2).replace('.', root.lang === 'fr' ? ',' : '.');
    return (sign && v > 0 ? '+' : v < 0 ? '−' : '') + n + ' €';
  };
  const clamp = (x) => Math.max(0, Math.min(1, x));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const card = (id, k1, k2) => {
    const c = $(id), dd = $$('dd', c), g = $('.g', c), cst = $('.c', c);
    const gain = +dd[0].dataset.v, cost = -dd[1].dataset.v, net = +dd[2].dataset.v, MAX = 27.55;
    dd[0].textContent = fmt(gain * k1, true);
    dd[1].textContent = fmt(-cost * k2, true);
    dd[2].textContent = fmt(k1 === 1 && k2 === 1 ? net : gain * k1 - cost * k2, true);
    const gw = gain / MAX * 100 * k1, cw = cost / MAX * 100 * k2;
    g.style.width = gw + '%'; cst.style.width = cw + '%'; cst.style.left = (gw - cw) + '%';
    return net;
  };
  const place = (p) => {
    let pt;
    if (p < 0.2) pt = road.getPointAtLength(L * tA * seg(p, 0, 0.2));
    else if (p < 0.42) pt = road.getPointAtLength(L * tA);
    else if (p < 0.55) pt = road.getPointAtLength(L * (tA + (tSplit - tA) * seg(p, 0.42, 0.55)));
    else if (p < 0.72) pt = detour.getPointAtLength(LD * seg(p, 0.55, 0.72));
    else if (p < 0.9) pt = detour.getPointAtLength(LD * (1 - seg(p, 0.72, 0.9)));
    else pt = road.getPointAtLength(L * (tSplit + (1 - tSplit) * seg(p, 0.9, 1)));
    truck.setAttribute('transform', `translate(${pt.x} ${pt.y - 2})`);
  };
  const updRoi = () => {
    const r = roi.getBoundingClientRect(), span = r.height - innerHeight;
    const p = reduce ? 1 : clamp(-r.top / Math.max(1, span));
    place(p);
    card('#ca', seg(p, 0.2, 0.3), seg(p, 0.3, 0.4));
    detour.style.strokeDashoffset = `${LD * (1 - seg(p, 0.55, 0.72))}`;
    card('#cb', seg(p, 0.55, 0.65), seg(p, 0.65, 0.88));
    roi.classList.toggle('p2', p > 0.55);
    roi.classList.toggle('done', p > 0.9);
  };
  window.__roi = updRoi;

  /* ---------- architecture: which step is on screen ---------- */
  const arch = $('.arch');
  const stepObs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
      $$('.arch-steps li').forEach(li => li.classList.toggle('on', li === e.target));
      arch.dataset.step = e.target.dataset.s;
    }
  }), { rootMargin: '-45% 0px -45% 0px' });
  $$('.arch-steps li').forEach(li => stepObs.observe(li));

  /* ---------- scroll loop: progress bar, ROI, hero star ---------- */
  const bar = $('.progress'), star = $('.hero-shape'), checker = $('.checker');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const h = root, y = h.scrollTop;
      bar.style.transform = `scaleX(${y / Math.max(1, h.scrollHeight - h.clientHeight)})`;
      nav.classList.toggle('scrolled', y > 10);
      if (!reduce && y < innerHeight * 1.2) star.style.rotate = `${y * 0.25}deg`;
      if (!reduce && checker) checker.style.transform = `translateY(${(checker.getBoundingClientRect().top - innerHeight / 2) * -0.08}px)`;
      updRoi();
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); onScroll();

  /* ---------- pointer effects (desktop) ---------- */
  if (fine && !reduce) {
    const cur = $('.cursor');
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
    addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; cur.classList.add('on'); }, { passive: true });
    const loop = () => { cx += (x - cx) * 0.22; cy += (y - cy) * 0.22; cur.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); };
    loop();
    $$('a,button').forEach(el => { el.addEventListener('mouseenter', () => cur.classList.add('big')); el.addEventListener('mouseleave', () => cur.classList.remove('big')); });
    $$('.magnetic').forEach(el => {
      el.addEventListener('mousemove', e => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.35}px)`; });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
    const hero = $('.hero-stage');
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect(), dx = (e.clientX - r.left) / r.width - 0.5, dy = (e.clientY - r.top) / r.height - 0.5;
      star.style.translate = `${dx * 40}px ${dy * 26}px`;
    });
    hero.addEventListener('mouseleave', () => { star.style.translate = ''; });
  }

  const yr = $('.year'); if (yr) yr.textContent = new Date().getFullYear();
})();
