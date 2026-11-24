---
slug: apple-airpods-pro
url: https://www.apple.com/airpods-pro/
source: manual-pick
corpus: expressive
captured: 2026-07-06
award_type: Manual (product-marketing/scroll-cinema)
score: null
tags: [apple, product-marketing, hardware, consumer-electronics, light, photography-led, scrollytelling, motion-led]
when_to_use: [product-marketing, landing, hero, feature-section, brand-experience, interactive-showcase, navigation]
directions: [expressive, editorial, minimalist]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [scroll-reveal-text-fill, sticky-product-subnav]
tokens_snapshot: ../tokens/apple-airpods-pro.json
screenshots: ../screenshots/apple-airpods-pro/
---

## What works (transferable principles)
- **The product photograph *is* the layout — no card, no border, no shadow.** The hero earbuds, the H2-chip macro, the silhouettes are cut out and full-bleed on a near-white field; they appear to float in the page's own light. The page ships essentially **one shadow token** (a `0 0 0.5px inset` hairline) — elevation comes from the subject and from a faint bg-tint gradient (`#fff → #f5f5f7`), never a drop shadow. Transfers to any hardware / physical-product marketing: shoot the object clean, let it occupy the optical center, and drop the container chrome so nothing competes with it.
- **Hierarchy is pure *scale contrast* in one family.** A 96px display headline against 17px body is a ~5.6× jump, set in a single type family (SF Pro) at only two weights (400 / 600). No color tricks, no five weights — whitespace and size do all the ordering, so the page reads calm even as information density climbs. Transfers to product UI and editorial alike: buy hierarchy with a big scale ramp, not a weight zoo.
- **Optical tracking scales *inversely* with size.** Large display tightens (−0.015em at 96px, −0.009em at 64px); small labels/eyebrows loosen (+0.009em at 24px, +0.011em at 21px); body sits at SF's native −0.022em. Implement it as a tracking-by-size ramp and big type reads *set* while small type stays legible — the single most copyable detail of the Apple type voice.
- **Every section is `eyebrow → oversized display headline`.** A small, muted, positively-tracked label ("Audio performance", "Hearing Health", "Personalized listening") sits above a giant display line ("The sound of science.", "Check, aid, and help protect your hearing."). The eyebrow gives the section a name; the display line gives it a claim. A repeatable two-line section header that never needs a rule or a box to feel structured.
- **Section identity comes from *ground tint*, not containers.** The page alternates two grounds — white and `#f5f5f7` — and lets dark subjects bleed edge-to-edge into black with no wrapper. There are almost no visible dividers or bordered blocks; the shift in background is the section boundary. Transfers to long marketing pages that would otherwise turn into a stack of cards.
- **One accent, quarantined to interaction; saturation quarantined to content.** Apple blue (`#0071e3`) appears *only* on interactive affordances (Buy pill, links, focus ring). All the loud color — the 60° `#0894ff → #c959dd → #ff2e54 → #ff9003` sound-arc gradient, the lifestyle photos — lives in decorative/content zones. The chrome stays monochrome so the accent always means "you can act here."
- **The conversion rail never leaves.** A local product sub-nav pins under the global nav as you scroll, carrying the section links *and* a persistent blue Buy pill with price. The primary action is always one glance away without a nagging modal. Transfers to any product or pricing page.

## Design-system read
- **Type:** SF Pro Display for headlines, SF Pro Text for body/UI (two optical cuts of one superfamily). Scale ≈ 12 / 17(body) / 19 / 21 / 24 / 28 / 44 / 56 / 64 / 96px — a wide ramp with a ~5.6× body-to-display range. Weights **400 & 600 only**. Leading tightens toward display (~1.0–1.05 on headlines, ~1.47 on 17px body). Hierarchy = **scale**, reinforced by size-dependent tracking.
- **Color:** Light monochrome. `bg #ffffff` alternating with `surface #f5f5f7`; ink `#1d1d1f`; secondary `#333336`, muted `#6e6e73 / #86868b`. Single accent Apple-blue `#0071e3` (buttons) / link-blue `#0066cc`; success green `#00c866`. Dark passages are done by full-bleed black photography, not a re-themed dark mode (site does **not** support `prefers-color-scheme: dark`).
- **Spacing rhythm:** ~4px base with generous section rhythm — vertical block padding at 28 / 40 / 76 / **160px**; gaps 18 / 20 / 34 / 80px. The dominant "spacing" is the tall empty air above and below each hero object.
- **Layout system:** 12-column content grid inside a `~1024–1440px` max-width (samples: 1024 / 1260 / 1440px); feature rows collapse to a swipeable carousel. Copy blocks sit in a narrow measure (≈3–4 col) beside full-bleed imagery. Mobile keeps the 12-col grid and body stays 17px; the display H1 drops 28→21px and the nav collapses to a hamburger.
- **Motion / easing intent:** Base durations 100–320ms; signature easing `cubic-bezier(0.4, 0, 0.6, 1)` (205 uses) plus `ease`. Motion is quiet and readerly — it choreographs *reading and reveal* (text darkening in, product pinning) rather than showing off. House `--duration-slow` (320ms) matches Apple's primary exactly.
- **Density:** Low-to-medium and paced — one idea per viewport, lots of air, then a dense spec/footnote block at the very bottom. Legibility never at risk.
- **Hierarchy:** Dominant ordering device = **scale** (eyebrow vs. display), with position and ground-tint as secondary signals.
- **Restraint:** No drop shadows, no borders around content, no second accent, no gradients on chrome, no dark-mode re-theme. Loud color is confined to one decorative gradient and to photography. The discipline is what lets the expressive moments (giant type, black silhouettes, rainbow arcs) land.

## Interaction & motion (evidence-backed)
Frames s00→s10 show a scroll-driven story: global nav → sticky local sub-nav → full-bleed product/chip macros → feature carousel → silhouette bleeds → copy that darkens as it enters. Probe: 4 IntersectionObservers (rootMargin `-53px 0 0 0`), 51 scroll listeners, 496 rAF calls, 26 `@keyframes`, 5 `prefers-reduced-motion` rules — reduced motion **respected**.
- **Sticky-pin product sub-nav** — *Trigger:* scroll-progress. *Mechanism:* a `globalnav-curtain` element goes `position: fixed` and an IntersectionObserver (rootMargin `-53px`) toggles a pinned local nav (section links + Buy pill) once the hero passes under the global bar. *Reads as:* the page keeps a persistent table-of-contents and an ever-present buy action. *Transfers to:* product / pricing / docs pages. *Safety:* **production-safe** (position + opacity, no reflow storm). See `patterns/sticky-product-subnav.md`.
- **In-view text color-fill reveal** — *Trigger:* in-view. *Mechanism:* headline and body copy render muted (gray) and animate to full ink as the block scrolls into view (keyframes `link-in`, `fade-in`; observed mid-fill in frame s05). *Reads as:* the copy "turns on" exactly when you reach it — directed reading. *Transfers to:* editorial marketing, long-form feature sections. *Safety:* **production-safe** (color/opacity only; must jump to final ink under reduced-motion). See `patterns/scroll-reveal-text-fill.md`.
- **Staggered entrance fade-rise** — *Trigger:* in-view / load. *Mechanism:* grouped elements fade + rise (`transform: scale/translate`) on a stagger ladder (80 / 160 / 200 / 220 / 240 / 260ms); nav items enter at 0.90→1.0 scale. *Reads as:* a composed, sequential reveal rather than a hard pop. *Transfers to:* any grid/list first-paint. *Safety:* **production-safe** (transform + opacity).
- **Horizontal feature carousel** — *Trigger:* drag / tap / chevron. *Mechanism:* feature tiles (rounded image + caption) scroll horizontally with prev/next chevron buttons; 12 tab controls, marquee tracks. *Reads as:* browsable secondary detail without lengthening the page. *Transfers to:* feature grids, spec highlights. *Safety:* **production-safe** (native scroll-snap is enough; keep keyboard + chevron parity).
- **Animated ribbon banner** — *Trigger:* load / in-view. *Mechanism:* a notification ribbon drops in and cross-animates its background, text, and link colors (`ribbon-drop`, `ribbon-animate-background`, `ribbon-animate-text-color`, `ribbon-animate-link-color`). *Reads as:* a lively but contained announcement strip. *Transfers to:* promo / availability banners. *Safety:* **production-safe** (short one-shot color/opacity).
- **Inline product spin** — *Trigger:* in-view. *Mechanism:* a media element rotates through frames (`inline-media-spin`) to turn the product in place. *Reads as:* a tactile "handle the object" beat. *Transfers to:* hardware detail sections. *Safety:* **spectacle-only-lite** — it's cheap if pre-rendered frames, but decorative; gate under reduced-motion.

Reduced motion: **respected** (5 `prefers-reduced-motion` rules). Honor it by jumping every reveal to its end state (ink text, resting layout) and disabling the spin/ribbon animation.

## Production-safety note
- Sticky sub-nav, text color-fill reveal, staggered fade-rise, and the carousel are all **production-safe** — they animate only `transform`/`opacity`/`color`, respect reduced-motion, and serve reading or conversion. The **inline product spin** and the color-cycling **ribbon** are decorative; keep them short, pre-rendered where possible, and reduced-motion-gated. The one real a11y liability is **tap-target size** — 346 of 535 interactive elements measured small; enforce ≥44px hit areas if you borrow this dense nav/footer.

## Extracted patterns
- `scroll-reveal-text-fill` — copy renders muted and fills to ink as it enters the viewport; directs reading in long editorial/marketing sections.
- `sticky-product-subnav` — local section nav + persistent Buy CTA that pins under the global bar once the hero scrolls past; for product and pricing pages.
