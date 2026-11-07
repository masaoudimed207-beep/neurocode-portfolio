/* NeuroCode_Med · portfolio v3 interactions (vanilla) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- une seule image partagée : toutes les lectures de géométrie, puis toutes les écritures ----------
     frame(job) : job(t) lit la géométrie et renvoie une fonction qui écrit les styles. Évite les recalculs
     forcés quand plusieurs effets (bandeau, curseur, scroll) tournent dans la même image. */
  const jobs = new Set();
  let frameRaf = 0;
  const frame = (job) => { jobs.add(job); if (!frameRaf) frameRaf = requestAnimationFrame(runFrame); };
  function runFrame(t) {
    frameRaf = 0;
    const list = [...jobs]; jobs.clear();
    const out = list.map(job => job(t));                    // 1. lectures
    out.forEach(o => o && o.mid && o.mid());                 // 2. modules qui lisent puis écrivent eux-mêmes (ROI)
    out.forEach(o => o && (typeof o === 'function' ? o() : o.write && o.write())); // 3. écritures
  }

  /* ---------- outils partagés avec les modules (js/*.js) ---------- */
  const loaded = {};
  const NC = window.NC = {
    reduce, $, $$,
    lang: () => root.lang === 'fr' ? 'fr' : 'en',
    load: (src) => loaded[src] || (loaded[src] = new Promise((ok, ko) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = ko; document.body.appendChild(s); })),
    // texte d'un gabarit traduit (span caché data-i18n), avec remplacement de {cle}
    t: (key, vars) => { const el = document.querySelector('[data-i18n="' + key + '"]'); let s = el ? el.textContent : key; for (const k in vars || {}) s = s.split('{' + k + '}').join(vars[k]); return s; },
    num: (v, d) => new Intl.NumberFormat(root.lang === 'fr' ? 'fr-FR' : 'en-US', { minimumFractionDigits: d, maximumFractionDigits: d }).format(v),
    // fait défiler un nombre de sa valeur affichée vers la cible
    tween: (el, to, render, dur = 650) => {
      const from = el._v == null ? 0 : el._v; cancelAnimationFrame(el._raf);
      if (reduce || dur <= 0 || from === to) { el._v = to; el.textContent = render(to); return; }
      const t0 = performance.now();
      const tick = (t) => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el._v = from + (to - from) * e; el.textContent = render(el._v); if (k < 1) el._raf = requestAnimationFrame(tick); else el._v = to; };
      el._raf = requestAnimationFrame(tick);
    }
  };

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
    'hero.lead': 'Je transforme de vrais problèmes d’entreprise en outils IA, data et full-stack qui fonctionnent. <em>Testés, mesurés, livrés.</em>',
    'hero.avail': 'Ouvert à un stage', 'hero.availWhen': 'Avril à mai 2027', 'hero.availWhere': 'IA, data ou full-stack · Maroc, étranger ou à distance',
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
    'roi.v': 'Le prix le plus bas n’est pas la meilleure affaire.',
    'roi.v2': 'Ici, le détour est rentable.', 'roi.skip': 'Passer la démo', 'roi.start': 'Départ', 'roi.end': 'Arrivée',
    'roi.try': 'À vous : bougez un curseur, le moteur recalcule.', 'roi.reset': 'Revenir au cas réel',
    'roi.c1': 'Carburant restant à l’arrivée', 'roi.c2': 'Détour vers B, par trajet', 'roi.c3': 'Prix chez B', 'roi.c4': 'Consommation du camion',
    'roi.detT': '{km} km hors route, à l’aller et au retour',
    'roi.a': 'Station A, sur la route', 'roi.b': 'Station B, la moins chère', 'roi.keep': 'Retenue', 'roi.drop': 'Écartée',
    'roi.gross': 'Gain sur le prix', 'roi.cost': 'Coût du détour', 'roi.net': 'Économie nette',
    'roi.note': 'Camion : réservoir de 800 L, 30 L/100 km dans le cas réel. Le détour compte deux fois, car le camion doit revenir sur sa route.',
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
    'arch.h': 'Suivez une recherche dans le système', 'arch.p': 'Chaque étape éclaire la partie du back end qui travaille. Ça défile tout seul, ou choisissez une étape.',
    'arch.l1': 'Interface · React 19 + TypeScript', 'arch.c2': 'Chauffeur', 'arch.c3': 'Flotte',
    'arch.l2': 'API · FastAPI, jeton JWT, contrôle entreprise', 'arch.l3': 'Services métier · aucun HTTP dedans',
    'arch.l4': 'Données publiques en direct', 'arch.l5': 'Base de données',
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
    'path.hw': 'Avr. 2027', 'path.hh': 'Prochain commit : votre équipe ?', 'path.hp': 'Stage d’avril à mai 2027, en IA, data ou full-stack.', 'path.hl': 'Parlons-en',
    'open.ping': 'réponse de mohamed : en général sous 24 h', 'open.title': 'Construisons quelque chose de <span class="u">concret</span>.',
    'open.copy': 'Copier', 'open.live': 'en ligne',
    'open.p': 'Je cherche un <b>stage d’avril à mai 2027</b> en IA, data ou développement full-stack, au Maroc, à l’étranger ou à distance. Je prends aussi de petites missions freelance.',
    'open.mail': 'M’écrire', 'open.c1': 'Stage', 'open.c1p': 'Avril à mai 2027 · IA, data ou full-stack · sur site, hybride ou à distance',
    'open.c2': 'Freelance', 'open.c2p': 'Applications web, tableaux de bord, pipelines de données et automatisation pour PME', 'open.c3': 'Délai de réponse', 'open.c3p': 'En général sous 24 heures',
    'footer.top': 'Haut de page ↑',
    'mq.pin': 'l’outil → où il a servi',
    'alt.med-cutout': 'Portrait de Mohamed Messaoudi',
    'alt.med-about': 'Mohamed Messaoudi regarde son téléphone dans un champ au coucher du soleil',
    'alt.fuel-hero': 'BFRET Fuel Optimizer sur ordinateur et mobile, stations classées par économie nette',
    'alt.fuel-choice': 'Vue chauffeur : station choisie et détour réel de 1,7 km',
    'alt.fuel-fleet': 'Tableau de bord du gestionnaire de flotte avec les économies confirmées',
    'alt.fuel-map': 'Carte Leaflet avec l’itinéraire passant par la station choisie',
    'alt.innosoft-review': 'Écran de revue experte de l’assistant d’alertes carburant',
    'alt.kounach-cart': 'Écran d’encaissement rapide de Kounach avec un panier en dirhams', 'footer.term': 'Terminal (~)'
  };
  const EN = {};
  $$('[data-i18n]').forEach(el => { EN[el.dataset.i18n] = el.innerHTML; });
  $$('[data-i18n-alt]').forEach(el => { EN[el.dataset.i18nAlt] = el.alt; });
  const setLang = (l) => {
    const dict = l === 'fr' ? FR : EN;
    $$('[data-i18n]').forEach(el => { const v = dict[el.dataset.i18n]; if (v) el.innerHTML = v; });
    $$('[data-i18n-alt]').forEach(el => { const v = dict[el.dataset.i18nAlt]; if (v) el.alt = v; }); // texte alternatif des images
    root.lang = l;
    $$('a[href*="CV_Mohamed_Messaoudi"]').forEach(a => { a.href = l === 'fr' ? 'assets/CV_Mohamed_Messaoudi.pdf' : 'assets/CV_Mohamed_Messaoudi_EN.pdf'; });
    $$('.lang [data-l]').forEach(s => s.classList.toggle('on', s.dataset.l === l));
    try { localStorage.setItem('lang', l); } catch (e) {}
    document.dispatchEvent(new CustomEvent('nc:lang'));
  };
  NC.setLang = setLang;
  let lang = new URLSearchParams(location.search).get('lang');
  if (!lang) { try { lang = localStorage.getItem('lang'); } catch (e) {} }
  if (!lang) lang = (navigator.language || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en';
  setLang(lang);
  $('.lang').addEventListener('click', () => { lang = lang === 'fr' ? 'en' : 'fr'; setLang(lang); });

  /* ---------- nav ---------- */
  const nav = $('.nav'), links = $('.nav-links'), burger = $('.burger');
  burger.addEventListener('click', () => {
    const open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open)); links.classList.toggle('menu-open', !open);
  });
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => { burger.setAttribute('aria-expanded', 'false'); links.classList.remove('menu-open'); }));
  const sectionObs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) $$('.nav-links a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['about', 'work', 'skills', 'path', 'contact'].forEach(id => { const s = document.getElementById(id); if (s) sectionObs.observe(s); });

  /* ---------- reveal ---------- */
  if ('IntersectionObserver' in window && !reduce) {
    root.classList.add('rv');
    const ro = new IntersectionObserver((es) => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach((el, i) => { el.style.transitionDelay = ((i % 4) * 0.07) + 's'; ro.observe(el); });
    // photo About : entre quand 25 % est visible, ressort seulement une fois hors écran (pas de clignotement)
    const po = new IntersectionObserver(es => es.forEach(e => {
      if (e.intersectionRatio >= 0.25) e.target.classList.add('in');
      else if (!e.isIntersecting) e.target.classList.remove('in');
    }), { threshold: [0, 0.25] });
    $$('.about-photo').forEach(el => po.observe(el));
  } else { root.classList.add('js-off'); $$('.about-photo').forEach(el => el.classList.add('in')); }

  /* ---------- contact : copier l'adresse ---------- */
  const copyBtn = $('.copy'), copyStatus = $('.copy-status');
  if (copyBtn) copyBtn.addEventListener('click', async () => {
    const mail = copyBtn.dataset.email;
    let ok = false;
    try { await navigator.clipboard.writeText(mail); ok = true; } catch (e) {
      const t = document.createElement('textarea'); t.value = mail; t.setAttribute('readonly', ''); t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select(); try { ok = document.execCommand('copy'); } catch (e2) {} t.remove();
    }
    const fr = root.lang === 'fr';
    copyStatus.textContent = ok ? (fr ? 'Adresse copiée' : 'Email copied') : (fr ? 'Copie impossible, sélectionnez l’adresse' : 'Could not copy, select the address');
    copyBtn.classList.toggle('ok', ok); // le bouton confirme aussi la copie
    clearTimeout(copyBtn._t); copyBtn._t = setTimeout(() => { copyStatus.textContent = ''; copyBtn.classList.remove('ok'); }, 3000);
  });

  /* ---------- contact : vidéo de fond (ordinateur seulement, chargée à l'approche) ---------- */
  const vid = $('.open-video');
  const saveData = navigator.connection && navigator.connection.saveData;
  if (vid && !reduce && !saveData && matchMedia('(min-width: 768px)').matches && 'IntersectionObserver' in window) {
    let loaded = false;
    const start = () => {
      if (!loaded) {
        loaded = true;
        [['webm', 'video/webm'], ['mp4', 'video/mp4']].forEach(([k, type]) => { const s = document.createElement('source'); s.src = vid.dataset[k]; s.type = type; vid.appendChild(s); });
        vid.addEventListener('playing', () => vid.classList.add('on'), { once: true });
        vid.load();
      }
      const p = vid.play(); if (p && p.catch) p.catch(() => {});
    };
    const vo = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { if (document.readyState === 'complete') start(); else addEventListener('load', start, { once: true }); }
      else if (loaded) vid.pause();
    }), { rootMargin: '400px 0px' });
    vo.observe($('#contact'));
    document.addEventListener('visibilitychange', () => { if (document.hidden) vid.pause(); else if (loaded && vid.getBoundingClientRect().top < innerHeight) start(); });
  }

  /* ---------- bandeau : suit la vitesse et le sens du scroll ---------- */
  const mqTrack = $('.marquee-track'), mqSet = $('.mq-set');
  if (mqTrack && mqSet && !reduce) {
    let x = 0, dir = 1, boost = 0, lastY = scrollY, running = false, last = 0, pending = false;
    // le sens et la vitesse du scroll sont lus dans la phase de lecture de l'image, pas dans l'écouteur
    const track = () => {
      if (!pending) return; pending = false;
      const sy = scrollY, dy = sy - lastY; lastY = sy;
      if (dy) { dir = dy > 0 ? 1 : -1; boost = Math.min(boost + Math.abs(dy) * 0.06, 9); }
    };
    addEventListener('scroll', () => { if (!pending) { pending = true; frame(track); } }, { passive: true });
    const step = (t) => {
      track();
      const dt = Math.min(48, t - (last || t)) / 16.67; last = t;
      const w = mqSet.offsetWidth;
      x -= dir * (0.6 + boost) * dt; boost *= Math.pow(0.92, dt);
      if (x <= -w) x += w; if (x > 0) x -= w;
      return () => { mqTrack.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)'; if (running) frame(step); };
    };
    new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting && !running) { running = true; last = 0; frame(step); }
      else if (!e.isIntersecting) { running = false; jobs.delete(step); }
    })).observe($('.marquee'));
  }

  /* ---------- counters ---------- */
  const countObs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, to = +el.dataset.to, t0 = performance.now(), d = reduce ? 1 : 1400;
    const tick = (t) => { const k = Math.min(1, (t - t0) / d); el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick); countObs.unobserve(el);
  }), { threshold: 0.6 });
  $$('.count').forEach(el => countObs.observe(el));

  /* ---------- mini-terminal : touche ~ ou bouton du pied de page, chargé au premier appel ---------- */
  const openTerm = () => NC.load('js/term.js').then(() => NC.term.toggle());
  addEventListener('keydown', (e) => {
    const t = e.target, typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
    if ((e.key === '~' || e.key === '`' || e.key === '²') && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); openTerm(); }
  });
  $$('.term-open').forEach(b => b.addEventListener('click', openTerm));

  /* ---------- blocs 02 à 05 : poussée à l'entrée, recul à la sortie, dans les deux sens ---------- */
  if (!reduce && 'IntersectionObserver' in window) {
    const pushObs = new IntersectionObserver(es => es.forEach(e => {
      const el = e.target, fromTop = e.boundingClientRect.top < 0;
      if (e.intersectionRatio >= 0.12) el.classList.add('on');
      else if (e.intersectionRatio < 0.04) { el.classList.remove('on'); el.classList.toggle('from-top', fromTop); }
    }), { threshold: [0, 0.04, 0.12] });
    $$('.case-block').forEach(b => { const n = $('.num', b); if (n && +n.textContent >= 2) { b.classList.add('push'); pushObs.observe(b); } });
  }

  /* ---------- cartes résultats :les chiffres comptent au moment où la carte entre ---------- */
  const rcText = (el, v) => (el.dataset.pre || '') + NC.num(v, +(el.dataset.d || 0)) + (el.dataset.suf || '');
  const rcPaint = () => {
    $$('.rc').forEach(el => { el.textContent = rcText(el, el._v == null ? +el.dataset.to : el._v); });
    $$('.receipt .z').forEach(z => { z.textContent = NC.num(0, 2) + ' €'; });
  };
  const RC_DELAY = { 106: 350, 61: 1550, 167: 2300, 1.7: 500 };
  const resObs = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    resObs.unobserve(e.target);
    $$('.rc', e.target).forEach(el => {
      const to = +el.dataset.to;
      el._v = 0; el.textContent = rcText(el, 0);
      setTimeout(() => NC.tween(el, to, v => rcText(el, v), to === 167 ? 900 : 1100), RC_DELAY[to] || 0);
    });
  }), { threshold: 0.45 });
  if (!reduce) $$('.res').forEach(el => resObs.observe(el));
  rcPaint();
  document.addEventListener('nc:lang', rcPaint);

  /* ---------- modules lourds chargés à l'approche de leur section ---------- */
  const lazy = (sel, src) => {
    const el = $(sel); if (!el) return;
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); NC.load(src); } }, { rootMargin: '900px 0px' });
    io.observe(el);
  };
  lazy('#roi', 'js/roi.js');

  /* ---------- architecture : stepper, lecture auto tant qu'il est visible ---------- */
  const arch = $('.arch');
  if (arch) {
    const steps = $$('.arch-steps li', arch), dots = $$('.arch-dots button', arch), N = steps.length, DUR = 4500;
    let cur = 1, timer = 0, visible = false, held = false;
    const show = (n) => {
      cur = ((n - 1 + N) % N) + 1;
      arch.dataset.step = cur;
      steps.forEach(li => li.classList.toggle('on', +li.dataset.s === cur));
      dots.forEach(b => { if (+b.dataset.go === cur) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
    };
    const stop = () => { clearTimeout(timer); arch.classList.remove('playing'); };
    const run = () => {
      stop();
      if (reduce || held || !visible || document.hidden) return;
      void arch.offsetWidth; // relance la barre de temps
      arch.classList.add('playing');
      timer = setTimeout(() => { show(cur + 1); run(); }, DUR);
    };
    const pick = (n) => { held = true; show(n); stop(); };
    $('.an-prev', arch).addEventListener('click', () => pick(cur - 1));
    $('.an-next', arch).addEventListener('click', () => pick(cur + 1));
    dots.forEach(b => b.addEventListener('click', () => pick(+b.dataset.go)));
    arch.style.setProperty('--dur', DUR + 'ms');
    new IntersectionObserver(es => es.forEach(e => {
      visible = e.isIntersecting;
      if (!visible) held = false; // en revenant, la lecture reprend
      run();
    }), { threshold: 0.35 }).observe(arch);
    document.addEventListener('visibilitychange', run);
    show(1);
  }

  /* ---------- parcours : la branche git se dessine, chaque commit s'allume au passage ---------- */
  const log = $('.timeline'), commits = $$('.commit');
  let logEnd = 0, commitTops = [];
  // positions des commits mises en cache : relues seulement au chargement, au resize et au changement de langue
  const sizeLog = () => {
    if (!log) return;
    commitTops = commits.map(c => c.offsetTop);
    logEnd = commitTops[commitTops.length - 1] + 12;
    log.style.setProperty('--end', (log.offsetHeight - logEnd) + 'px');
  };
  // lecture (géométrie) et écriture (styles) séparées, pour que onScroll lise tout avant d'écrire
  const readLog = () => log && log.getBoundingClientRect().top;
  const writeLog = (top) => {
    if (!log) return;
    const reach = reduce ? 1e9 : innerHeight * 0.62 - top; // jusqu'où la branche est dessinée, en px depuis le haut de la liste
    log.style.setProperty('--p', Math.max(0, Math.min(1, (reach - 10) / Math.max(1, logEnd - 10))).toFixed(4));
    commits.forEach((c, i) => c.classList.toggle('lit', commitTops[i] + 10 <= reach));
  };
  const drawLog = () => { if (log) writeLog(readLog()); };
  sizeLog(); addEventListener('resize', sizeLog);
  ['load', 'nc:lang'].forEach(ev => (ev === 'load' ? window : document).addEventListener(ev, () => { sizeLog(); drawLog(); }));

  // drawLog et le ROI ne tournent que lorsque leur section est visible (marge pour être à jour avant d'entrer)
  const seen = { log: false, roi: false };
  const watch = (el, key) => el && new IntersectionObserver(es => { seen[key] = es.some(e => e.isIntersecting); if (seen[key]) onScroll(); }, { rootMargin: '150px 0px' }).observe(el);

  /* ---------- scroll loop: progress bar, ROI, parcours ---------- */
  // réseau 3D du hero : chargé une fois la page prête, pour ne rien retarder
  if (document.readyState === 'complete') NC.load('js/hero-net.js'); else addEventListener('load', () => NC.load('js/hero-net.js'), { once: true });
  const bar = $('.progress'), checker = $('.checker');
  const scrollJob = () => {
    // 1. toutes les lectures de géométrie
    const h = root, y = h.scrollTop, span = Math.max(1, h.scrollHeight - h.clientHeight);
    const chkTop = !reduce && checker ? checker.getBoundingClientRect().top : 0;
    const logTop = seen.log ? readLog() : null;
    return {
      // 2. le ROI lit puis écrit lui-même (js/roi.js, non modifié) : entre les lectures et les écritures
      mid: () => { if (seen.roi && window.__roi) window.__roi(); },
      // 3. toutes les écritures
      write: () => {
        bar.style.transform = `scaleX(${y / span})`;
        nav.classList.toggle('scrolled', y > 10);
        if (!reduce && checker) checker.style.transform = `translateY(${(chkTop - innerHeight / 2) * -0.08}px)`;
        if (logTop !== null) writeLog(logTop);
      }
    };
  };
  function onScroll() { frame(scrollJob); }
  watch(log, 'log'); watch($('#roi'), 'roi');
  addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); onScroll();

  /* ---------- pointer effects (desktop) ---------- */
  if (fine && !reduce) {
    const cur = $('.cursor');
    let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, moving = true;
    // la boucle s'arrête quand le curseur a rejoint la souris (écart sous 0,1 px), et repart au mouvement suivant
    const loop = () => {
      cx += (x - cx) * 0.22; cy += (y - cy) * 0.22;
      const done = Math.abs(x - cx) < 0.1 && Math.abs(y - cy) < 0.1, tx = cx, ty = cy;
      return () => { cur.style.transform = `translate(${tx}px,${ty}px)`; if (done) moving = false; else frame(loop); };
    };
    addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; cur.classList.add('on'); if (!moving) { moving = true; frame(loop); } }, { passive: true });
    frame(loop);
    $$('a,button').forEach(el => { el.addEventListener('mouseenter', () => cur.classList.add('big')); el.addEventListener('mouseleave', () => cur.classList.remove('big')); });
    $$('.magnetic').forEach(el => {
      // rect lu une fois par survol (dans la phase de lecture de la première image après l'entrée, relu seulement
      // si la page a défilé), transform écrit dans la phase d'écriture. Le rect est gardé sans décalage et on y
      // ajoute le dernier décalage écrit, comme l'ancien rect relu à chaque mouvement (qui l'incluait) : même amplitude.
      let r = null, mx = 0, my = 0, dx = 0, dy = 0, inside = false;
      const stale = () => { r = null; };
      const job = () => {
        if (!inside) return null;
        if (!r) { const b = el.getBoundingClientRect(); r = { left: b.left - dx, top: b.top - dy, width: b.width, height: b.height }; }
        dx = (mx - (r.left + dx) - r.width / 2) * 0.25; dy = (my - (r.top + dy) - r.height / 2) * 0.35;
        const tx = dx, ty = dy;
        return () => { el.style.transform = `translate(${tx}px,${ty}px)`; };
      };
      el.addEventListener('mouseenter', () => { inside = true; dx = dy = 0; r = null; addEventListener('scroll', stale, { passive: true }); });
      el.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; frame(job); });
      el.addEventListener('mouseleave', () => { inside = false; jobs.delete(job); r = null; dx = dy = 0; removeEventListener('scroll', stale); el.style.transform = ''; });
    });
  }

  const yr = $('.year'); if (yr) yr.textContent = new Date().getFullYear();
})();
