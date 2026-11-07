# Portfolio NeuroCode_Med

Site statique (HTML, CSS, JS, sans framework) de Mohamed Messaoudi, déployé sur Vercel.
Ce fichier est lu au début de chaque session. Il passe avant tes habitudes par défaut.

## À lire avant toute action

1. `PRODUCT.md` : à qui sert le site, ce qui est vrai, ce qui est interdit.
2. `DESIGN.md` : couleurs, typo, composants. N'invente aucune valeur qui n'y figure pas.
3. Le code concerné. Regarde avant de créer : réutilise une classe, un token CSS ou une fonction existante plutôt que d'en ajouter une nouvelle.

## Façon de travailler

- **Une couche à la fois.** Jamais tout le site d'un coup. Une demande, une section ou une couche : structure, typo, profondeur, interactions, mouvement, finition.
- **Plan d'abord.** Pour tout changement qui touche plus de deux fichiers ou plus de 30 lignes : liste les fichiers, ce qui change, ce qui ne change pas, puis attends mon accord.
- **Ce n'est pas une refonte.** Sauf si je le demande, garde le contenu, la palette, la typo, le motif terminal, l'ordre des sections, les URL et le SEO.
- **Un commit par étape validée**, message court en français qui dit ce qui a changé.

## Sections protégées

Ne modifie pas ces éléments sauf si ma demande les nomme explicitement :

- le moteur Detour ROI (`js/roi.js`) et ses chiffres ;
- le réseau neuronal 3D du hero (`js/hero-net.js`) ;
- le mini-terminal (`js/term.js`) ;
- le `<head>` SEO (meta, Open Graph, JSON-LD, hreflang), `sitemap.xml`, `robots.txt`, `vercel.json`.

## Règles fixes

- **Parité EN/FR.** Chaque texte anglais de `index.html` (attribut `data-i18n`) a sa traduction dans l'objet FR de `script.js`. Changer l'un sans l'autre est une erreur.
- **Aucun tiret long dans un texte visible** : ni U+2014 (cadratin) ni U+2013 (demi-cadratin). Virgule ou point à la place.
- **Chiffres vrais uniquement.** 167 tests, +1,7 km, 13,17 €, 301 tests : rien d'autre ne s'invente. CS50P est en cours, ne jamais l'écrire comme terminé ou certifié. Les démos simulées restent marquées comme simulées.
- **Pas de framework, pas de build.** Pas de React, Tailwind, TypeScript ni bundler. Une bibliothèque externe seulement si je l'accepte, et chargée en différé.
- **Budget** : page complète sous 1,5 Mo transférés. Animer seulement `transform` et `opacity`. `prefers-reduced-motion` coupe tout mouvement non essentiel.
- **Aucun secret dans le code** : ni clé, ni mot de passe, ni token.

## Avant de dire que c'est fait

1. `node tools/check.mjs` : zéro erreur console, zéro violation axe bloquante, poids affiché.
2. Si la mise en page a bougé : `node tools/check.mjs --shots`, puis regarde les captures desktop et mobile.
3. Cherche U+2014 et U+2013 dans `index.html` et `script.js` : zéro résultat attendu.
4. Résume en trois lignes : ce que tu as fait, ce que tu as vérifié, ce qui reste.

Ne dis jamais qu'une chose marche sans l'avoir lancée.

## Comment me répondre

Court. Ce que tu as fait, ce que je dois faire moi-même (pas à pas si ça se passe sur GitHub, Vercel ou dans le terminal), et la prochaine étape. Je me connecte moi-même à mes comptes : quand une connexion est nécessaire, arrête-toi et dis-moi quoi faire.

Si tu sens que tu as dérivé de ces règles pendant une longue session, relis ce fichier et corrige ta dernière réponse.

## Lancer le projet

- Aperçu : ouvrir `index.html`, ou `npx serve .` à la racine.
- Vérification : `node tools/check.mjs` (dépendances dans `tools/`, faire `npm install` dans `tools/` si elles manquent).
- `tools/` et `photos-brutes/` ne sont jamais déployés (voir `.vercelignore`).
