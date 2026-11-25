---
slug: domaineworldwide
url: https://domaineworldwide.com
source: landbook
corpus: production
surface: site
captured: 2026-10-05
award_type: Gallery
score: null
tags: [agency, ecommerce, shopify, b2b, editorial, monochrome, portfolio]
when_to_use: [agency, portfolio, landing, feature-section, navigation]
directions: [editorial, minimalist]
layout: [editorial-columns, content-grid]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-partial, tap-targets-risky]
provenance:
  gallery_url: https://land-book.com/websites/99836-ecommerce-website-design-and-development-shopify-agency-domaine-is-the-leading-shopify-partner-for-global-brands
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [sticky-section-label-fade, oversized-index-row-list]
tokens_snapshot: ../tokens/domaineworldwide.json
screenshots: ../screenshots/domaineworldwide/
---

## What works (transferable principles)
- **One typeface, one weight, hierarchy from scale alone.** Nearly the entire page is Suisse Intl at weight 400 (the profile counts 1498 nodes in a single family/weight); rank comes from a ~5× size jump (16px body → 80px display) and from *negative tracking that only switches on at display sizes* (−0.04em at 48–80px, ~0 at body). Set a grotesque in one weight and let size do the ordering and the page reads calm even when it's information-dense — reusable in any editorial or agency layout that wants authority without bold.
- **Monochrome ground + a single reserved accent.** The system is black / white / two grays (#EDEDED page, #DBDBDB border, #686C6D secondary) with exactly one saturated color — electric blue #2749FF — held back for focus rings, links, and the odd semantic chip. Because color is rationed, the real color on the page comes from the *client photography*; the chrome never competes with it. Transfers to any portfolio/agency site where the work must be the loudest thing.
- **Alternating full-bleed black chapters structure the scroll.** Instead of dividers, whole sections flip to pure #000 (hero, partners) between light sections, so the page reads as labeled chapters. The black bands are the rhythm device — and they're what force the next principle.
- **Contrast-aware fixed nav.** The header is fixed, transparent, and its link text *inverts* (black over light sections → white over black sections) as each section crosses behind it, driven by an IntersectionObserver band rather than a per-frame brightness calc. One floating nav survives both #EDEDED and #000 grounds with no scrim. (See `inview-theme-adaptive-sticky-cta` for the same band-observer mechanism on a CTA.)
- **Sticky left-column labels in an asymmetric grid.** Long sections use a two-column editorial grid (`1fr 2fr`, and more extreme `.25fr 1.5fr 2.75fr`) where the short section label (`SERVICES`, `INSIGHTS`) is `position: sticky` and rides alongside the scrolling content, masked by a background-colored gradient so it fades at its own edge. The label becomes persistent wayfinding without a heavier nav. See `patterns/sticky-section-label-fade.md`.
- **Fluid tokens anchored to the design width.** Every space/size token is `max(<floor>px, calc((<n> / 1440) * 100vw))` — a value that scales proportionally with the viewport but never drops below a floor. It's a single transferable formula that gives true fluid layout from one design comp without a dozen breakpoints.
- **Oversized text rows as a data index.** Locations ("NEW YORK CITY", "LONDON") are a right-justified ledger of display-scale rows with a country superscript and a live local clock in the metadata column, separated by hairlines. A list rendered as big type reads as design, not a table. See `patterns/oversized-index-row-list.md`.

## Design-system read
- **Type:** One family — Suisse Intl (grotesque), with Suisse Intl Mono reserved for eyebrows/labels/code. Weights available 200/400/500 but 400 does ~all the work. Scale (px): 12 · 13.3 · 14 · 16(body) · 18 · 24 · 40 · 48(h1) · 80(display), plus a `15vw` giant for the footer line. Hierarchy = **scale contrast + tracking ramp**, never weight. Leading is near-solid on display (80px → 72px lh ≈ 0.9; 48px → 48px) and ~1.35 on body.
- **Color:** Essentially monochrome. Roles — bg `#EDEDED`, surface `#FFFFFF`, inverse ground `#000000`, fg `#000000`, secondary/muted `#686C6D`, border `#DBDBDB`, faint ink `#1C1C1C`. Single accent `#2749FF` (links, focus ring is a near-identical `rgb(60,0,255)`). Latent semantics only — success `#00FF7B`, orange `#FF5831` — rarely surfaced. Color discipline is the point: chrome is neutral, photos carry the hue.
- **Spacing rhythm:** 5px base. Token ladder `2xs 5 → xs 10 → sm 15 → md 20 → lg 30 → xl 40 → 2xl 60 → 3xl 80 → 4xl 120`, each emitted as `max(floorpx, (n/1440)*100vw)` so it breathes with the viewport. Page gutter `clamp(20px, 2vw, 60px)`; grid gap 20px. Whitespace is spent *between* chapters (large) while rows/cards stay tight.
- **Layout system:** Content capped at a 1440px measure; flex-dominant (467 flex nodes vs 20 grid). The signature is **asymmetric editorial grids** — `1fr 2fr`, `.25fr 1.5fr 2.75fr`, `.5fr 1.5fr 2.5fr` — a narrow label/meta rail beside a wide content column. Breakpoints 640 / 768 / 1024; grids collapse 4→2 cols and h1 48→34px on mobile.
- **Layering / page architecture:** Single flat scroll with pinned chrome — no static backdrop, no blend overlays. The z-story is: fixed transparent header (z999) whose fg color is swapped per section; several sticky section-labels and form submit bars (z1–3) that pin within their section and fade via a gradient mask; blurred `backdrop-filter: blur(30px)` only on dialogs/popups (cookie, region, search, notifications), not on the page itself. Depth comes from the alternating black/light grounds, not from shadows.
- **Motion / easing intent:** House easing is `cubic-bezier(.22,1,.36,1)` (ease-out-quint — a fast, decisive settle) at three durations: `.3s` UI, `.8s` medium, `1.2s` reveals. Motion is used to *reveal and orient*, never to perform: content fades up into place, the nav restyles to stay legible, a slow logo ticker idles. Reduced-motion is respected.
- **Density:** High information density (76 projects, 7 offices, multi-column insight feeds) kept legible by the one-weight type, generous inter-chapter whitespace, and hairline separators instead of boxes.
- **Hierarchy:** Dominant ordering device is **scale** (then position — the sticky label rail). Weight and color are deliberately *not* used to rank.
- **Restraint:** No drop shadows anywhere on the page (one `drop-shadow(...32px)` on a floating dialog aside); radius maxes at 3px (sharp, editorial corners); no second typeface weight for emphasis; accent color rationed to near-zero. The discipline is the brand.

## Interaction & motion (techniques)
- **In-view fade-rise reveal** — *Trigger:* in-view. *Mechanism:* a single IntersectionObserver (threshold 0.3, `rootMargin: 0% 0% -10% 0%`, ~51 targets) toggles a class that transitions `opacity 0→1` (and a small rise) over `1.2s` ease-out-quint on headings, stat blocks, links, cards. *Reads as:* content arriving composed, not popping. *Transfers to:* any long marketing/portfolio page. *Safety:* **production-safe** (opacity/transform only; one observer, no scroll handler). See corpus `in-view-fade-rise`.
- **Contrast-aware nav inversion** — *Trigger:* in-view / scroll-progress. *Mechanism:* the fixed transparent header's link `color` flips `#000↔#fff` as each section's ground crosses behind it (band-shaped observer stamps a theme attribute; nav restyles from it — not a per-frame luminance read). *Reads as:* one nav that's always legible over alternating black/light chapters. *Transfers to:* any fixed chrome over mixed grounds. *Safety:* **production-safe**. See corpus `inview-theme-adaptive-sticky-cta`.
- **Sticky section-label with gradient fade** — *Trigger:* scroll-progress (CSS `position: sticky`). *Mechanism:* the short left-column label pins at `top:0` while its wide content column scrolls past; a `linear-gradient(180deg, bg 80%, transparent)` on the label masks it so it dissolves at the sticky seam. *Reads as:* persistent wayfinding that never looks bolted on. *Transfers to:* docs, long feature sections, case studies. *Safety:* **production-safe** (pure CSS, no JS). See `patterns/sticky-section-label-fade.md`.
- **Infinite logo ticker** — *Trigger:* load (CSS animation). *Mechanism:* a `max-content` flex track translates via `@keyframes client-scroll` over `calc(var(--logo-count) * 4s)` linear infinite, `will-change: translate`. A slow (~40s), hypnotic client marquee. *Reads as:* breadth of roster without a static wall of logos. *Transfers to:* client/partner strips. *Safety:* **production-safe** (animates `translate`); pair with reduced-motion pause. See corpus `duplicated-track-marquee`.
- **Hover pill on nav links** — *Trigger:* hover. *Mechanism:* link gains a near-opaque white pill background while its text drops to the muted gray, `.3s` ease-out-quint. *Reads as:* a quiet, tactile affordance consistent with the monochrome chrome. *Safety:* **production-safe**.

## Production-safety note
- Everything here is production-safe: motion is opacity/transform/color only, driven by one IntersectionObserver plus CSS sticky/animation — no scroll-jacking, no per-frame layout. The marquee and reveals should honor `prefers-reduced-motion` (the site respects it for view-transitions; gate the ticker and reveals too when you port them). Watch two craft debts to avoid copying: image `alt` coverage is only ~0.69, and there are many sub-44px tap targets (127 flagged) — tighten both in a reuse.

## Extracted patterns
- `sticky-section-label-fade` — a sticky left-rail section label in an asymmetric editorial grid, masked with a background gradient so it fades at its sticky edge.
- `oversized-index-row-list` — a list rendered as display-scale text rows with a right-aligned metadata column (live clock / count) and hairline separators.
