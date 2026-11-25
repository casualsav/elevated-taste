---
slug: metabase
url: https://www.metabase.com
source: manual
corpus: production
surface: site
captured: 2026-09-07
award_type: null
score: null
tags: [saas, analytics, bi, dashboard, data-table, ai, open-source, b2b, light]
when_to_use: [landing, product-marketing, hero, feature-section, dashboard, data-table]
directions: [soft, minimalist]
layout: [center-stack, content-grid]
a11y: [focus-visible, alt-coverage-high, reduced-motion-respected]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [inspectable-answer-panel, typing-indicator-dots]
tokens_snapshot: ../tokens/metabase.json
screenshots: ../screenshots/metabase/
---

## What works (transferable principles)
- **One brand blue does every job of emphasis; everything else is a tinted-neutral ramp.** The page is drawn in a five-step neutral scale carrying a faint cool cast — ink `#22242b`, secondary `#5a6072` (the single most-used text color, 1276 hits), tertiary `#8d93a5`, hairline `#e2e4e9`, faint surface `#f1f2f4` — with exactly one accent (`#509ee3`) reserved for links, the primary CTA, and live data marks. Because the neutrals already share the blue's temperature, the one saturated hue never looks bolted on. Transfers to any data-heavy product page: build the whole UI from tinted grays, spend saturation only on action and data.
- **Sell trust by showing the machine's work, not by claiming it.** The hero's value prop is literally "inspect the query behind every answer," and the demo panel proves it: an AI answers a plain-English question, then shows the *data source it drew from* with per-answer thumbs-up/down. The product's credibility argument becomes a piece of layout. Reusable for any AI/automation product where the objection is "can I trust the output" — surface the evidence next to the answer instead of a testimonial about accuracy.
- **The hero is a working instrument, never a faux mockup.** Below a quiet centered headline sits a full-width panel of *real* Metabase surfaces — a big-number KPI card, a stacked bar chart with a proper legend, a chat/answer thread — rendered in the product's own type and color, not a decorative screenshot. This is the explicit antidote to the generic "fake dashboard image" hero: the marketing page is assembled from the app itself.
- **Scale and value carry hierarchy; weight is nearly binary.** Type runs 60→36→24→18→16→14px in a single family (Lato) with only two working weights — 400 for all reading text, 700 for display — and secondary information recedes by *lightening the same neutral* (`#22242b`→`#5a6072`→`#8d93a5`) rather than shrinking or de-bolding. The page reads as one system because the ordering device never changes.
- **Negative tracking is the display signature, eased off toward body.** The 60px H1 runs `-2.4px` (~-0.04em) letter-spacing; 24px subheads run `-0.48px` (~-0.02em); body sits at 0. Tracking scales *with* size so optical density stays constant across the ramp — a confident, packed headline that doesn't make body copy feel cramped.
- **One soft two-layer shadow, used everywhere, does all elevation.** Every card, chart, and popover floats on the same `0 4px 8px -2px / 0 2px 4px -2px` rgba(16,24,40) shadow (121 occurrences) over a near-white ground; a single heavier variant is reserved for true overlays. Uniform elevation makes a dense page of many panels feel like one calm surface rather than a pile of competing boxes.
- **Named, ramped design tokens under the hood.** 118 custom properties expose full neutral (`--base-color-neutral-15…99`) and blue (`--base-color-blue-25…105`) ramps plus role aliases (`--text-color-primary/secondary/tertiary`, `--color-brand/-hover/-strong/-muted`). The visible restraint is the output of a real token system, not hand-picked hexes.

## Design-system read
- **Type:** Lato throughout (system-sans fallback in tokens; Roboto Mono for code, Merriweather loaded but barely used). Scale ≈ 0.75·0.875·1·1.125·1.25·1.5·1.875·2.25·3·3.75rem. Two weights do the work (400 body, 700 display; 600/900 rare). Hierarchy = **scale contrast + value contrast**. Signature: negative letter-spacing that scales with size (-0.04em display → 0 at body). Fluid type; H1 60→34px mobile, body holds 16px across breakpoints.
- **Color:** Neutral base white `#ffffff` + faint surfaces `#f9fafb`/`#f1f2f4`/`#fcfcfd`; ink `#22242b`; secondary `#5a6072`; tertiary `#8d93a5`; hairline `#e2e4e9`. Single brand accent `#509ee3` (blue-60) with a hover/link ramp `#1c6bb0`→strong `#12436e` and muted fills `#e4ecfb`/`#cbdaf6`/faint `#fafbfe`. Semantics: success `#80b946`/strong `#236d00`/faint `#f5f9f0`. A six-hue **chart** palette (purple/blue/green/yellow/orange `#c94922`/coral `#ef8c8c`) appears only inside data marks, never as page decoration.
- **Spacing rhythm:** base unit `.25rem` token expressed on an 8px rhythm — pervasive 20/24px padding, 4/6/8/12px gaps, 80px section blocks. Whitespace, not rules, separates sections; the page stays calm at high panel density.
- **Layout system:** centered container maxes 1320 / 1264px, with 640 / 840px measures for prose. Mostly flex (293 flex vs 5 grid nodes); the few grids are 3-col feature rows and 2-col splits that collapse to 1 on mobile. Rich responsive ladder (400→1400px breakpoints). Nav collapses 49 desktop links → hamburger under ~992px.
- **Layering / page architecture:** single flat light scroll — `has_static_backdrop: false`, `has_blend_overlay: false`, no glass/blend anywhere. Only load-bearing fixed layer is the pinned white header (`z-index: 10000`, sticky, ~9% viewport height); five `opacity:0 pointer-events:none` fixed `*-nav-menu-wrapper` panels are the pre-rendered mega-menu dropdowns, and one fixed GDPR notice sits at z-1000. Depth is faked entirely by the one soft card shadow, not by z-axis parallax. ~84% of section height is transparent, but with no backdrop behind it that just means sections inherit the page's near-white ground.
- **Motion / easing intent:** resting page is essentially still. Micro-interactions are fast (100–300ms) on `ease` / `cubic-bezier(.4,0,.2,1)`; the deliberate motions are ambient product-liveness (hero typing-dots, a slow 90s logo marquee) plus nav mechanics. Motion communicates "live, working analytics," not spectacle. `prefers-reduced-motion` is honored with an explicit override block.
- **Density:** high (KPI cards, multi-series charts, logo wall, testimonial masonry) kept legible by whitespace and the recede-to-gray secondary text — dense content drops to `#5a6072`/`#8d93a5` so the eye lands on the ink headline and the single blue CTA.
- **Hierarchy:** dominant ordering device is **scale**, backed by **value** (ink vs muted tint); accent blue marks the one action per view.
- **Restraint:** no dark mode, no blend modes, no glass, essentially no gradients (two trivial ones), no second display face, no scroll-entrance theater. Rainbow appears only inside charts.

## Interaction & motion (techniques)
- **Typing-indicator dots** — *Trigger:* load (perpetual loop). *Mechanism:* three 5px dots each run a 1.2s `ease-in-out` `opacity`+`scale` keyframe (`hero-demo-typing`) staggered 0.18s / 0.36s, so a wave pulses left→right. *Reads as:* "the assistant is thinking / this is live." *Transfers to:* any chat, agent, or async-answer UI. *Safety:* **production-safe** (transform/opacity only); reduced-motion block freezes them to a static 0.5 opacity. See `patterns/typing-indicator-dots.md`.
- **Inspectable answer reveal** — *Trigger:* load (scripted demo). *Mechanism:* a question bubble, an AI answer, and its cited data source fade/rise in sequence in the hero panel; a small hover tip (`hero-demo-source-tip`, z-6) explains the source on hover. *Reads as:* "you can audit every answer." *Transfers to:* trust-critical AI product heroes. *Safety:* **production-safe**; reduced-motion collapses the enter transforms to `none`. See `patterns/inspectable-answer-panel.md`.
- **Duplicated-track logo marquee** — *Trigger:* load. *Mechanism:* an `.inner-marquee` track translated `0 → -100%` over 90s linear infinite (a `--slower` 60s variant); hovering a "trusted" variant pauses + blurs the track to surface a CTA. *Reads as:* "used by many companies," in continuous motion. *Transfers to:* logo/social-proof strips. *Safety:* **production-safe** if reduced-motion-gated (transform-only). See existing `patterns/duplicated-track-marquee.md`.
- **Pinned sticky nav with pre-rendered mega-menus** — *Trigger:* scroll-progress + hover. *Mechanism:* header is `position: sticky; z-index: 10000`; each dropdown is a `position: fixed`, `opacity:0`, `pointer-events:none` panel toggled on hover/focus rather than mounted on demand. *Reads as:* instant, flicker-free menus and always-available nav. *Transfers to:* content-heavy marketing navs. *Safety:* **production-safe** (no reflow; opacity toggle).
- **Link color-crossfade** — *Trigger:* hover. *Mechanism:* nav links and text links crossfade `#5a6072`→`#509ee3` (and primary links `#509ee3`→`#1c6bb0`) over ~200ms `ease`. *Reads as:* quiet, tactile affordance. *Transfers to:* any link system. *Safety:* **production-safe**.

## Production-safety note
- Everything here is production-safe and, unusually, reduced-motion is properly respected (`respectsReducedMotion: true`, 27 PRM rules) and focus-visible rings are present (`focus_visible: true`, alt coverage 100%). The one liability is tap-target size: 98 of 309 interactive elements are below the ~44px comfortable minimum (dense nav + chart controls) — an adopter should enlarge touch targets on mobile.

## Extracted patterns
- `inspectable-answer-panel` — an AI answer shown beside the exact data source/query it drew from, with per-answer feedback controls; turns "trust the output" into layout.
- `typing-indicator-dots` — three staggered pulsing dots signaling a live/thinking assistant; reduced-motion-aware.
