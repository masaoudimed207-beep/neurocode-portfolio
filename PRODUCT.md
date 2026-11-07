# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Primary: tech leads and engineers** at companies that might take an intern. They read in depth: the Fuel Optimizer case study, the back-end architecture, the test results, the trade-offs. They are deciding whether Mohamed can be trusted with real work on a real codebase.

**Secondary:** recruiters and HR, who scan quickly before passing a profile on, and small businesses looking for a freelance developer (web apps, dashboards, data pipelines, automation).

## Product Purpose

The personal portfolio of Mohamed Messaoudi (handle **NeuroCode_Med**), a second-year Computer Engineering student (DUT) at EST Meknès, Université Moulay Ismail, Morocco.

Its job is to land an **internship from April to May 2027** in AI, data or full-stack development (Morocco, abroad or remote), and secondarily to bring in small freelance projects. Success: an engineer finishes the page convinced the work is real, tested and shipped, and gets in touch (email, CV download, LinkedIn, GitHub).

## Positioning

"I turn real business problems into AI, data and full-stack tools that work. Tested, measured, shipped." Every project was built for a real business (transport, fleet tracking, a bookshop), and the site proves it with real engine output, real test counts and real routes instead of claims. The terminal motif and the "Neuro + Code" story (curiosity about how minds work, human and artificial, turned into tools) are what set it apart.

## Operating Context

- Visitors usually come from a CV, LinkedIn or an application link, and often share the page with a teammate.
- Engineers explore the interactive parts: the Detour ROI demo with sliders, the step-by-step back-end diagram, the mini-terminal.
- Two languages: English by default, French through the EN/FR button or `?lang=fr`. The CV download matches the active language (`assets/CV_Mohamed_Messaoudi.pdf`, `assets/CV_Mohamed_Messaoudi_EN.pdf`).
- Deployed on Vercel at `https://neurocode-portfolio.vercel.app/`.

## Capabilities and Constraints

**Non-negotiable:**
- **EN/FR parity.** Every piece of text exists in both languages: English in `index.html`, French in `script.js`. No change may break that parity.
- **Plain static site, no framework.** HTML + CSS + JS, around 1 MB in total, deployed on Vercel. Keep the current performance budget.
- **Terminal / code motif** (`whoami`, `cat profile.json`, SQL queries, `git log`, `make test`, `ping`) is part of the NeuroCode identity.
- **Honest numbers only.** Never invent achievements, metrics, clients, projects or technical claims. Simulated examples are clearly labelled.
- **Keep what works:** technical architecture, SEO (meta, Open Graph, JSON-LD, sitemap, robots), accessibility, responsive behaviour, performance budget and all verified content. Changes must not break existing functionality.

These constraints protect product truth and function. They do **not** block creative improvements to the visual identity, logo, typography or overall design.

**Existing features:** intro loader, 3D neural network in the hero, Detour ROI interactive demo (`js/roi.js`), animated back-end diagram, test/result counters, skills stack, git-log career timeline, contact block with copy-email, mini-terminal (`js/term.js`), EN/FR switch.

**Verification tooling:** `node tools/check.mjs [--shots] [--only=en|fr] [--vp=desktop|mobile]` runs Playwright + axe and reports the transferred page weight. `tools/roi-test.mjs` tests the ROI engine.

## Brand Commitments

- Name: **Mohamed Messaoudi**; handle **NeuroCode_Med** (written `NeuroCode _Med` in the logo).
- Voice: plain, concrete, modest and precise. Prefers "a tool a business can trust" to "a flashy demo." Shows rather than tells.
- The terminal/code motif is binding (see above). Visual identity, logo and typography may still change.

## Evidence on Hand

- **BFRET Fuel Optimizer** (developer intern, BFRET / Black Service Solutions, Casablanca, July 2026, continued on his own in August; supervisor M. Amine Medjber, CEO): 167 tests passing (106 pytest, 61 Vitest); +1.7 km real detour for 13.17 € saved on a Paris to Lille run; 0 € infrastructure cost (data.gouv.fr, OSRM, Nominatim, CARTO); multi-company isolation tested with two real companies; screens from live public data (prices of 22/10/2026). Images: `assets/img/fuel-*.webp`, `detour-roi.webp`, `architecture.webp`.
- **InnoSoft Tracking** fuel alert verification assistant (freelance, Oct 2026, in progress): the demo uses **simulated data** and must stay labelled as such; real Wialon API data is still to come. Images: `assets/img/innosoft-*.webp`.
- **Kounach**, an offline-first shop app for a bookshop (in development): 301 tests. Images: `assets/img/kounach-*.webp`.
- Next: a CRM for a medical practice, "starting soon" (no further claims).
- Education: Baccalaureate in Physical Sciences, Mention Très Bien (2024, Lycée Moulay Idriss Al Akbar, Sefrou); DUT Computer Engineering, EST Meknès (2025 to 2027); Harvard CS50P, DataCamp tracks.
- Languages: Arabic (native), French, English.
- Photos: `assets/img/med-about.webp`, `med-cutout*.webp`; raw photos in `photos-brutes/`. Share image: `assets/img/og.png`. Hero video folder: `assets/video/`.
- **Absent, never fabricate:** testimonials, client logos beyond the named businesses, awards, press, user counts, and production metrics for InnoSoft or Kounach.

## Product Principles

1. **Proof over claims.** Every statement is backed by real output, a real number or a real screen; if it can't be shown, it isn't said.
2. **Depth for engineers, clarity for everyone.** The case study holds up under close reading, and a quick scan still gets the point.
3. **Honesty is part of the brand.** Simulated, in-progress and upcoming work is labelled exactly as it is.
4. **Two languages, one product.** French and English are equal; neither is a lesser translation.
5. **Light and fast.** Static, dependency-free and within budget, because the site itself is a sample of the work.

## Accessibility & Inclusion

WCAG 2.2 AA: contrast, full keyboard use, visible focus, skip link, meaningful alt text in both languages. Full `prefers-reduced-motion` support: every animation (intro, 3D hero, scroll scenes, counters) has a calm equivalent, and every interactive demo stays usable without motion.
