# NeuroCode_Med · Portfolio v3

Site statique (HTML + CSS + JS, sans framework, environ 1 Mo au total). Bilingue EN / FR (bouton EN/FR, ou `?lang=fr`).

## Fichiers
```
index.html      structure + textes anglais + SEO (meta, Open Graph, JSON-LD)
script.js       traduction FR, intro, animations au scroll (Detour ROI, architecture), compteurs, curseur
style.css       design (couleurs dans :root en haut du fichier)
assets/img/     photos détourées, captures retouchées (Fuel Optimizer, InnoSoft, Kounach), og.png
assets/CV_*.pdf CV FR et EN (le bouton télécharge la bonne langue)
robots.txt, sitemap.xml, favicon.svg, vercel.json
```

## Avant de publier
Ouvre `index.html` dans le navigateur et relis les textes (EN puis FR).

## Déployer sur le même lien Vercel (neurocode-portfolio.vercel.app)
Ouvre PowerShell dans ce dossier (clic droit dans le dossier, « Ouvrir dans le terminal »), puis :
```
npx vercel login
npx vercel link     (choisis le projet existant "neurocode-portfolio")
npx vercel --prod
```
Ou, si le projet Vercel est relié à un repo GitHub : remplace le contenu du repo par ces fichiers, puis `git add . && git commit -m "portfolio v2" && git push`.

## Après la mise en ligne
- Google Search Console → ajoute le site → envoie `sitemap.xml`.
- Teste l'aperçu de partage : https://www.opengraph.xyz (colle ton lien).
- Teste la vitesse : https://pagespeed.web.dev

## Vidéo du hero (optionnel, avec Gemini / Veo)
Si tu génères une vidéo, exporte-la en `.mp4` (H.264, moins de 3 Mo, 6 à 8 s en boucle) dans `assets/video/hero.mp4` et dis-le-moi : je l'intègre derrière le texte du hero.

## Nom de domaine (GitHub Student Pack)
1. education.github.com/pack, offre Namecheap : un domaine `.me` gratuit la première année.
2. Vercel, projet neurocode-portfolio, Settings, Domains : ajoute le domaine.
3. Namecheap, Advanced DNS : copie exactement les enregistrements que Vercel affiche (A pour la racine, CNAME pour www).
4. Dis-moi le domaine : je mets à jour `canonical`, `sitemap.xml`, `robots.txt` et les balises Open Graph.
