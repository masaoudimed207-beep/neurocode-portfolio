---
name: NeuroCode_Med Portfolio
description: Warm paper for the story, ink-black terminal for the proof.
colors:
  signal-cobalt: "#3B55E6"
  signal-cobalt-strong: "#2C43C8"
  signal-cobalt-on-dark: "#8496FF"
  signal-cobalt-soft: "#E3E7FD"
  signal-cobalt-tint: "#EEF1FE"
  fired-clay: "#C26A4A"
  fired-clay-text: "#9A4E33"
  paper: "#F3EDE4"
  paper-deep: "#EAE2D6"
  paper-light: "#F8F4EE"
  surface: "#FFFDF9"
  ink: "#15171C"
  ink-raised: "#1D2027"
  ink-high: "#2A2E37"
  ink-deep: "#0E1014"
  text-secondary: "#3D3A35"
  text-muted: "#625D55"
  on-dark: "#F3EDE4"
  on-dark-secondary: "#C9C4BC"
  on-dark-muted: "#A9A49C"
  good: "#0B6B3A"
  good-soft: "#DDF1E5"
  live: "#22C55E"
  bad: "#B42318"
  bad-soft: "#FDE4E1"
typography:
  display:
    fontFamily: "Archivo, Arial Black, system-ui, sans-serif"
    fontSize: "clamp(64px, 15.2vw, 232px)"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Archivo, Arial Black, system-ui, sans-serif"
    fontSize: "clamp(36px, 4.6vw, 60px)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  statement:
    fontFamily: "Archivo, Arial Black, system-ui, sans-serif"
    fontSize: "clamp(28px, 3.3vw, 46px)"
    fontWeight: 800
    lineHeight: 1.12
    letterSpacing: "-0.022em"
  title:
    fontFamily: "Archivo, Arial Black, system-ui, sans-serif"
    fontSize: "1.6rem"
    fontWeight: 800
    lineHeight: 1.05
  number:
    fontFamily: "Archivo, Arial Black, system-ui, sans-serif"
    fontSize: "3.4rem"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  body:
    fontFamily: "Inter, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "JetBrains Mono, ui-monospace, Menlo, Consolas, monospace"
    fontSize: "0.78rem"
    fontWeight: 500
    letterSpacing: "0.06em"
  terminal:
    fontFamily: "JetBrains Mono, ui-monospace, Menlo, Consolas, monospace"
    fontSize: "0.82rem"
    fontWeight: 500
    letterSpacing: "0"
  button:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 700
    letterSpacing: "0.06em"
rounded:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "18px"
  xl: "24px"
  pill: "999px"
spacing:
  gutter: "24px"
  gap-sm: "14px"
  gap-md: "22px"
  block: "64px"
  section-mobile: "80px"
  section: "110px"
  wrap: "1180px"
components:
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "#FFFFFF"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "13px 22px"
  button-dark-hover:
    backgroundColor: "{colors.signal-cobalt}"
    textColor: "#FFFFFF"
  button-accent:
    backgroundColor: "{colors.signal-cobalt}"
    textColor: "#FFFFFF"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "13px 22px"
  button-accent-hover:
    backgroundColor: "#FFFFFF"
    textColor: "{colors.ink}"
  button-ghost-on-dark:
    backgroundColor: "transparent"
    textColor: "#FFFFFF"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "13px 22px"
  tag:
    backgroundColor: "{colors.signal-cobalt-soft}"
    textColor: "{colors.signal-cobalt-strong}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "6px 10px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.xs}"
    padding: "6px 10px"
  card-light:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "26px 28px"
  card-dark:
    backgroundColor: "{colors.ink-raised}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.lg}"
    padding: "22px 24px"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    padding: "4px 0"
  lang-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.pill}"
    padding: "7px 12px"
---

# Design System: NeuroCode_Med Portfolio

## Overview

**Creative North Star: "Paper and Terminal"**

The site is made of two materials that take turns. **Warm paper** (`paper`) carries the story: the hero, the case study, the career path. It reads like a well-set editorial page, with poster-sized Archivo headlines and calm Inter body text. **Ink-black terminal** (`ink`) carries the proof and the conversation: About, the toolbox, contact. There, mono command lines (`$ whoami`, `$ make test`, `$ ping mohamed`) introduce each section the way a prompt introduces output. Each switch between materials is staged, never a hard cut: the hero portrait dissolves into ink through a long gradient.

The mood is **confident and editorial**, **warm and human**, **precise and engineered**, and **playful in the details**, all at the same time. Confidence comes from the type scale: the hero words run to 232px with tight negative tracking. Warmth comes from paper tones, the real portraits and one Fired Clay underline. Precision comes from mono labels, tabular figures and accessible contrast pairs checked by hand (ratios are noted next to each token in `style.css`). The playful details are small and purposeful: commands that type themselves, a rotating "scroll down" badge, a cursor dot that grows over links, a pulsing "online" dot.

Things it is not: no neon hacker look (green-on-black, glitch, Matrix rain), no generic SaaS template (purple gradients, glassy feature cards, rows of stock icons), and no dark-only developer site. Paper has to stay the home material.

**Key Characteristics:**
- Two alternating materials: paper sections (hero, work, path) and ink sections (about, skills, contact, footer).
- One working accent, Signal Cobalt; Fired Clay appears at most once per screen.
- Heavy, tight Archivo display type against relaxed 17px Inter body text.
- Terminal command lines as section kickers, in both themes.
- Real data drawn in the UI (route maps, test output, receipts), never illustrated as abstractions.
- Components are quiet and precise: hairline borders, mono labels, little decoration.

## Colors

A warm off-white paper and a blue-black ink do almost all the work, with one cobalt signal on top and one clay highlight held back.

### Primary
- **Signal Cobalt** (`signal-cobalt`): the one accent. It marks the terminal prompt `$`, the reading-progress bar, active nav underlines, the custom cursor, the brand mark, list ticks, the primary contact button and the travelling dots in the architecture diagram. Large numbers (`.num`) use it too.
- **Signal Cobalt Strong** (`signal-cobalt-strong`): small cobalt text on paper or on cobalt tints (tags, the `_Med` in the logo), where the base cobalt would fall short of AA.
- **Signal Cobalt on Dark** (`signal-cobalt-on-dark`): the cobalt that reads on ink: prompts, "HELLO", kickers and hover borders in dark sections.
- **Cobalt Soft / Tint** (`signal-cobalt-soft`, `signal-cobalt-tint`): tag backgrounds and quiet highlighted areas on paper.

### Secondary
- **Fired Clay** (`fired-clay`): a warm counterweight, used sparingly: the underline under "real." in the contact title, the glow behind the About portrait, the warm nodes of the hero network.
- **Fired Clay Text** (`fired-clay-text`): the only clay value allowed for text on paper.

### Neutral
- **Paper** (`paper`): the page background and the nav bar (at 92% with blur).
- **Paper Deep / Paper Light** (`paper-deep`, `paper-light`): empty bar tracks, project media backgrounds, control panels.
- **Surface** (`surface`): cards, maps and diagrams sitting on paper.
- **Ink** (`ink`): text on paper, and the background of dark sections and the dark button.
- **Ink Raised / Ink High** (`ink-raised`, `ink-high`): layered panels inside dark sections.
- **Ink Deep** (`ink-deep`): the footer, and the base color of every shadow.
- **Text Secondary / Muted** (`text-secondary`, `text-muted`): body copy and captions on paper.
- **On Dark / Secondary / Muted** (`on-dark`, `on-dark-secondary`, `on-dark-muted`): the same three-step text ladder on ink.
- **Lines**: hairlines are `ink` mixed at 13% (`--line`) or 24% (`--line-strong`) on paper, and `on-dark` at 14% (`--line-dark`) on ink. They are never a solid grey.

### Semantic
- **Good / Good Soft** (`good`, `good-soft`): savings, passing tests, the winning station.
- **Bad / Bad Soft** (`bad`, `bad-soft`): costs, the losing station.
- **Live** (`live`): only the pulsing availability dot and `passed` output in the terminal.

### Named Rules
**The One Signal Rule.** Cobalt is the only interactive and emphasis color. Don't add a second accent hue for links, buttons or highlights.

**The Clay Once Rule.** Fired Clay appears at most once per screen and never as a button or link color. Its rarity is what makes it warm.

**The Checked Pair Rule.** Every text and background pair uses a token whose contrast is already noted in `style.css`. A new pair needs its ratio checked and noted before it ships.

## Typography

**Display Font:** Archivo 800–900 (fallback: Arial Black)
**Body Font:** Inter 400–700 (fallback: system-ui)
**Label/Mono Font:** JetBrains Mono 400–500 (fallback: ui-monospace)

**Character:** Archivo's heavy grotesque gives poster weight, and Inter stays out of the way for reading. JetBrains Mono is the voice of the machine: every label, prompt, chip and metric caption is set in it.

### Hierarchy
- **Display** (900, clamp(64px → 232px), line-height 0.86, tracking −0.035em, uppercase): only the two hero words "AI & DATA / ENGINEER".
- **Headline** (800–900, clamp(36px → 60px); the About title runs to 76px): section titles, centered on paper and on ink.
- **Statement** (800, clamp(28px → 46px), line-height 1.12, balanced wrapping): the positioning sentence under the hero, and the ROI verdict.
- **Title** (800, 1.3–1.6rem): project and card titles.
- **Number** (900, 2.1–3.4rem, tabular figures): stats, results and money values. Figures always use `tnum`.
- **Body** (400, 17px, line-height 1.65): paragraphs, kept to about 65ch.
- **Label** (mono 500–600, 0.66–0.78rem, tracking 0.05–0.08em, uppercase): kickers, tags, `dt` labels, small toggles.
- **Terminal** (mono 500, 0.74–0.9rem, no tracking, original case): command lines, the formula, test output.
- **Button / Nav** (Inter 600–700, 0.82rem, tracking 0.06em, uppercase).

### Named Rules
**The Machine Speaks Mono Rule.** Anything the computer would print (commands, output, labels, units, file names) is set in JetBrains Mono. Anything a person would say is set in Inter or Archivo.

**The Real Case Rule.** Terminal lines keep their real lowercase and syntax. Only labels are uppercased.

## Layout

A centered column, max 1180px wide (`--wrap`) with 24px side gutters, sits under a sticky nav that lines up with the same column. Paper and ink sections alternate down the page: hero (paper) → hero foot and About (ink) → logo band → Work (paper) → Toolbox (ink) → Path (paper) → Contact (ink, with background video) → footer (ink deep). Sections breathe at 110–130px vertical padding on desktop and 80px below 640px. Case-study blocks use a 120px number rail plus a content column, separated by hairlines at 64px rhythm.

Grids collapse to a single column at 980px (About, feature card, project grid, hero foot, open cards). The nav links become a dropdown panel behind a two-line burger. Below 640px, the hero stage shortens to about 74vh, ROI cards stack, and the map labels grow larger to stay readable.

The ROI scene is sticky-scrolled only when the viewport is at least 900×640. Everywhere else it plays as a normal block.

## Elevation & Depth

Mostly flat, with depth from **material contrast** (paper against ink) more than from shadows. The few shadows there are long, soft and pulled downward, always tinted with `ink-deep` and never pure black. Hover lift is the only shadow that responds to state.

### Shadow Vocabulary
- **Feature float** (`box-shadow: 0 30px 60px -30px rgba(14,16,20,.25)`): the featured case-study card at rest.
- **Project lift** (`box-shadow: 0 30px 60px -34px rgba(14,16,20,.35)` + `translateY(-6px)`): project cards on hover.
- **Diagram rest** (`box-shadow: 0 30px 60px -40px rgba(14,16,20,.35)`): the architecture panel.
- **Cutout drop** (`filter: drop-shadow(0 30px 40px rgba(14,16,20,.12))`): portrait cutouts and the receipt, so cut-out shapes cast a real silhouette.
- **Win ring** (`box-shadow: 0 0 0 3px color-mix(in srgb, var(--good) 15%, transparent)`): a state ring on the winning ROI card.

### Named Rules
**The Material Before Shadow Rule.** Separate areas by switching paper and ink, or surface and paper, before reaching for a shadow.

## Shapes

Generously rounded rectangles with hairline borders. Cards use 16–24px corners (`--radius` 18px is the default), buttons and icon buttons use 12px, chips use 8px, and anything that works as a toggle, tag or status is a full pill. Circles are kept for live things: the cursor, the status dot, the scroll badge, station markers. Dashed borders mean "not final": the "in development" status pill, and the losing ROI card once the engine has decided.

## Components

Quiet and precise: thin borders, mono labels, and content that carries the weight. The buttons are the one solid element.

### Buttons
- **Shape:** gently rounded (12px), 2px border reserved for the ghost variant.
- **Dark (primary on paper):** ink fill, white uppercase Inter 700 at 0.82rem with 0.06em tracking, padding 13px 22px. On hover it turns Signal Cobalt.
- **Accent (primary on ink):** Signal Cobalt fill. On hover it turns white with ink text.
- **Ghost on dark:** transparent with a 2px white border at 50%. On hover it fills white.
- **Focus:** a 2px Signal Cobalt outline, 3px offset, on every focusable element.

### Chips
- **Stack chip:** mono 0.74rem, 1px hairline border, 8px radius, secondary text, no fill.
- **Tag:** a Cobalt Soft pill with Cobalt Strong mono text, used for the project category.
- **Status:** a dashed cobalt pill for work in progress.
- **Skill chip (on ink):** a light pill with the tool's own logo. It's the only place brand colors from outside the system appear, and they stay inside the chip.

### Cards / Containers
- **Light card:** Surface fill, 1px `--line` border, 16–22px radius, 22–28px padding. Project cards lift 6px on hover and zoom their screenshot by 4%.
- **Dark card:** ink fill at 72% with 14px backdrop blur, `--line-dark` border, 18px radius. On hover the border turns Cobalt on Dark and the card lifts 4px.
- **Formula / terminal block:** ink fill, pale cobalt mono text (`#C9D1FF`), 14px radius.

### Inputs / Fields
- **Range sliders (ROI demo):** cobalt thumb and fill on a paper track, inside a Paper Light panel with a hairline border and 16px radius. Each value shows as mono `output` with tabular figures.
- **Copy button:** a mono uppercase pill with a hairline on ink, and an aria-live status line next to it.

### Navigation
Sticky, Paper at 92% with 12px blur. A hairline appears once the page scrolls. The brand is a 34px cobalt square with a white neural mark, plus "NeuroCode" with `_Med` in Cobalt Strong. Links are uppercase Inter 600 at 0.82rem. A 2px cobalt underline wipes in from the left on hover and on the active section. The EN/FR toggle is a mono pill; the active language turns ink. Under 980px the links move into a rounded paper dropdown.

### Terminal Kicker (signature)
A line of mono text at the top of a section: a cobalt `$` prompt, a white or ink command, then a muted response. When the reveal engine runs, the command types itself one character at a time behind a blinking block cursor, then the response fades in. It comes in a dark variant and a `.light` variant for paper (cobalt-strong prompt, `good` green output).

### Data-as-Illustration (signature)
Figures are drawn from real output and never decorative: the ROI route map with stations, the pytest output, the Paris to Lille route, the zero-cost infrastructure receipt, and the five-step back-end diagram with travelling cobalt dots. They use Surface fills, hairline borders, mono captions, and green/red semantics only for gain and loss.

## Do's and Don'ts

### Do:
- **Do** alternate paper and ink sections, and stage each switch (a gradient dissolve or a hairline), never a hard cut in the middle of content.
- **Do** open sections with a terminal kicker whose command really fits the content (`$ make test` above the results).
- **Do** use Signal Cobalt for every interactive state, and Cobalt on Dark (`#8496FF`) for it on ink.
- **Do** set every number in tabular figures and every unit or label in JetBrains Mono.
- **Do** give every motion a `prefers-reduced-motion` equivalent that shows the final state immediately.
- **Do** tint shadows with `ink-deep` and keep them long and soft (negative spread).

### Don't:
- **Don't** drift toward a neon hacker / Matrix look: no green-on-black terminals, glitch effects or scanlines. Green is only for `passed` and "online".
- **Don't** use generic SaaS-template styling: no purple-to-blue gradients, glassy feature grids or rows of decorative stock icons.
- **Don't** turn the site dark-only. Paper stays the home material, and ink is the second one.
- **Don't** add a second accent hue, or use Fired Clay for buttons, links or more than one element per screen.
- **Don't** uppercase terminal commands, or put Archivo in labels.
- **Don't** draw a chart, map or metric that isn't backed by real output. Simulated data is labelled where it is shown.
