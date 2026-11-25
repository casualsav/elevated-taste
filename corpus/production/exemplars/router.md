---
slug: router
url: https://router.com
source: landbook
corpus: production
surface: site
captured: 2026-10-19
award_type: Gallery
score: null
tags: [ai, llm, fintech, developer, b2b, saas, mono, data-viz]
when_to_use: [landing, product-marketing, feature-section, hero, footer]
directions: [minimalist, editorial]
layout: [center-stack, full-bleed]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high]
provenance:
  gallery_url: https://land-book.com/websites/100965-ramp-router-the-llm-gateway-that-cuts-inference-costs
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [ambient-wordmark-light-sweep, mono-telemetry-ledger-card]
tokens_snapshot: ../tokens/router.json
screenshots: ../screenshots/router/
---

## What works (transferable principles)

- **A warm-neutral "financial instrument" palette carries an AI product without a single gradient hero.** The whole page lives on paper-white (`#fff`), a parchment band (`#f3f0ea`), a warm-gray text ramp (ink `#1a1919` → `#6d6a65` → `#86837e` → `#a39d99`) and near-black product panels (`#0d0e0d`) — plus exactly **one** saturated hue, an acid "solar" yellow (`#e4f222`), held back until the closing CTA. The warm grays (not blue-grays) read as ledger paper / terminal, which is the whole pitch (CFO + CTO, "tokens are money"). Transferable: pick the undertone of your neutral ramp to *mean* something — warm = financial/editorial, cool = clinical/technical — and ration the one chroma so its single appearance lands like a punchline.
- **Hierarchy is built from scale + surface, never weight.** Lausanne appears almost entirely in light weights (300/350/400); a 64px/64 display headline against 16px/24 body is a ~4× jump that does all the ranking, while "primary vs secondary" is signalled by *which surface you're on* (ink panel vs parchment vs paper), not by bolding. Result: a dense, data-heavy page stays optically calm. Transferable: reach for a bigger size or a surface flip before you reach for a heavier weight — bold is the lever of last resort.
- **Monospace is a semantic layer, not a texture.** IBM Plex Mono is reserved for anything that is *data or machinery* — eyebrows (`ROUTER.COM SAVES YOU TIME AND MONEY`), status chips (`Cache hit · 100%`), every numeral, the `curl … | sh` install line, axis ticks. The typeface switch itself tells you "this is a measured fact," which for an infra/billing product is the credibility move. Transferable: let a second family *carry meaning* (data vs prose) rather than mere variety, and always set numerals tabular so columns of figures align.
- **The product's own telemetry is the hero art.** Instead of an abstract illustration, the marketing panels render literal-looking request ledgers — per-turn cost, cache-hit %, a proportion bar split into cached/new/output tokens, a routing graph, a cost-over-time chart, a model score-vs-spend scatter. For an observability/routing tool this *is* the demo and doubles as proof. Transferable: if your product outputs structured data, style that data beautifully and ship it as the imagery — it out-persuades any stock 3D render.
- **Every section sits inside a thin full-bleed ruled frame.** 1px warm-gray hairlines (`#d7d4ce`) box the page edge-to-edge and divide feature cells, giving a long (7400px) page a "spec-sheet / blueprint" skeleton with zero color or shadow budget. Transferable: hairline rules are the cheapest way to make a stacked page feel engineered and intentional — structure felt more than seen, as long as you back each rule with real spacing so it isn't the only boundary cue.
- **One acid accent, deferred to the finale.** The solar yellow is entirely absent from the hero and body; it detonates once in the footer as a giant blurred `$` glyph behind "Tokens are money. Save both." Because you've been trained on grayscale for 7000px, the single color arrival is memorable and on-message. Transferable: a scarce accent spent *late* becomes a payoff rather than decoration — budget color like a narrative beat.
- **Ambient, not kinetic.** The motion budget goes to slow infinite loops (a 120s edge ticker, a 14s light sweeping across a blurred wordmark) and quiet in-view panel rises — nothing scrubs or hijacks the scroll. The page feels *alive at rest* while staying a normal, readable document. Transferable: a couple of long ambient loops buy "premium/alive" far more cheaply (and safely) than scroll-jacked choreography.

## Design-system read

- **Type:** Two families. **Lausanne** (grotesque sans) for display + body, used in light weights 300/350/400 (700 exists but is rare); **IBM Plex Mono** for all data/labels/numerals. Effective scale (desktop): mono eyebrow 10–12px, body 16/24, sub-heads 24–28px, section H2 ~48px, hero H1 **64px/64** — a ~4× display-to-body jump. Tracking is size-proportional and slightly negative on display (64px ≈ -0.64px / -0.01em), opening to positive on small mono caps (~+0.045em). Mobile H1 drops to 40px; body stays 16px. `font-feature-settings: "ss01"` + tabular numerals. Hierarchy = **scale + surface**, not weight.
- **Color:** Warm-neutral spine — bg `#fff`, parchment band `#f3f0ea`, ink `#1a1919`, muted `#6d6a65`, subtle `#86837e`, faint `#a39d99`, hairline `#d7d4ce`; product panels near-black `#0d0e0d`/`#0c0a08` with off-white text. Exactly **one** page accent: solar `#e4f222` (closing CTA only). A *scoped* data palette lives inside the demo panels (periwinkle cached-token / acid new-token / mauve output bars; blaze-orange + provider marks on the benchmark scatter; sage/rose status chips) — treat it as a chart palette, not page color. No dark re-theme (`supportsDark:false`).
- **Spacing rhythm:** 4px base (`--spacing: .25rem`). Data rows run tight — dominant gaps **6/8px**; section rhythm steps up to 32/48/64/80/128px. The tight micro-gaps are what make the mono ledgers read as dense-but-ordered.
- **Layout system:** 1440px full-bleed ruled frame with a ~1312px content track; hero is centered single-column (`center-stack`). Feature bands resolve to 2-up / 3-up cells on a hairline grid (observed track counts 2 / 3 / 18). Two horizontal snap rails (testimonials, "More from the Lab"). Breakpoints ~600/768/992/1024/1280; mobile collapses grids to one column and the 16-link nav to a hamburger (8 links).
- **Layering / page architecture:** Fundamentally a **single flat opaque scroll** — `has_static_backdrop:false`, `has_blend_overlay:false`; only 2 fixed + 1 sticky element exist. Depth is faked locally, not stacked: (1) the hero's giant **blurred wordmark** with a `radial-gradient` light that sweeps across it on `mix-blend-mode: plus-lighter` (reads as back-lighting, not a placed graphic); (2) near-black product panels float on soft warm shadows (`0 18px 44px rgba(29,27,25,.18)`); (3) a `backdrop-filter: blur(50px)` frosts the top announcement bar and a `blur(8px)` bottom edge-fade softens a panel's base. The "condensing" fixed header sits at `opacity:0` over the hero and fades in once you scroll past it. Transferable: you don't need a parallax backdrop for depth — a couple of blurred/blended local layers plus honest shadow do it on an otherwise flat page.
- **Motion / easing intent:** durations split into *ambient loops* (120000ms ticker, 14000ms light sweep, 6000ms route-draw) and *UI* (100/120/150/200/300/320ms). Easings: `cubic-bezier(.4,0,.2,1)` and `cubic-bezier(0,0,.2,1)` for state/entrance, `cubic-bezier(.16,1,.3,1)` for a slower settle, bare `ease` incidental. **33 `@keyframes`** but reduced-motion is respected (7 PRM blocks). Intent: *alive at rest, quick on interaction, never scroll-jacked.*
- **Density:** High (nested ledgers, a 26-model scatter, multi-tab benchmark, long feature list) kept legible by one sans family, mono-for-data, tight 6/8px data gaps, and the hairline grid chunking it all.
- **Hierarchy:** Dominant device is **scale**, with **surface** (ink panel vs parchment vs paper) as the secondary rank and **color** (the lone solar) as a single terminal accent. Weight is deliberately not a lever.
- **Restraint:** No gradient hero, no drop-shadowed cards on flat sections, no second accent, no bold display weights, no scroll-jacking. Expressiveness is concentrated in two cheap ambient loops and one late color.

## Interaction & motion

Router is **ambient, not interactive-heavy**, and — unlike many gallery picks — it **respects reduced motion** (`respectsReducedMotion:true`, 7 `prefers-reduced-motion` blocks; the dashed route and tickers pause). No scroll-jacking: 5 scroll + 12 mousemove listeners and ~299 rAF calls in a pass feed the ambient loops and in-view reveals, not a scrub. Probes: **7 IntersectionObservers over 19 targets** (rootMargins `200px` / `120px` / `0 0 -12% 0`), **33 `@keyframes`**, 2 video, 18 canvas (the charts), 8 tabs, 3 disclosure, 2 snap rails. Stack: `IntersectionObserver` · CSS `@keyframes` · CSS container/scroll queries · `requestAnimationFrame` (no GSAP/Lenis/Framer detected).

- **Ambient wordmark light-sweep** — *Trigger:* load (infinite). *Mechanism:* a giant blurred "Router" glyph sits behind the hero; a `radial-gradient` white blob (`mix-blend-mode: plus-lighter`) `translate3d`s across it on a 14s `cubic-bezier(.42,0,.58,1)` loop (`@keyframes rhs-wordmark-light`/`rhs-line-flow`), sizing off `cqw`/`cqh` container units. *Reads as:* a slow light raking a frosted sign — "alive at rest" without demanding attention. *Transfers to:* any hero that wants ambient life instead of a static gradient. *Safety:* **production-safe** — composited `transform`/`opacity` only; gate reduced motion (pause → static glow). → `ambient-wordmark-light-sweep`.
- **Infinite edge ticker** — *Trigger:* load (120s linear loop, `motion-safe:` gated). *Mechanism:* `@keyframes announcement-ticker { 100% { transform: translate(-100%) } }` scrolls a duplicated `$26 IN MODEL CREDITS · FREE ROUTING…` band across the viewport top; a sibling `model-provider-marquee` runs the logo wall. *Reads as:* a calm newswire of offers/providers. *Transfers to:* promo bars, logo/press strips. *Safety:* **production-safe** if it pauses on hover/focus and gates reduced motion (here it's `motion-safe:`-wrapped — good). → `announcement-ticker-marquee` (existing recipe).
- **In-view panel rise + cascade** — *Trigger:* in-view (IO, rootMargin `0 0 -12% 0`). *Mechanism:* product panels fade+rise (`@keyframes panel-rise`: `translateY(18px)→0`) and their inner rows cascade (`panel-cascade`: `translateY(7px)→0`) a beat later; a routing-summary **toast slides in** from `translateX(+50%)` with fade (`toast-enter`). *Reads as:* the telemetry "assembling" as you reach it. *Transfers to:* any product-demo / dashboard reveal. *Safety:* **production-safe** (opacity+transform, fires once); keep the reduced-motion jump-to-end. → `mono-telemetry-ledger-card` (the panel it reveals).
- **Dashed route-draw** — *Trigger:* in-view (paused off-screen). *Mechanism:* an SVG routing path animates `stroke-dashoffset` on a 6s linear loop (`@keyframes proof-route-drift`), `animation-play-state:paused` when `data-proof-visible="false"` *and* under reduced motion. *Reads as:* traffic flowing along the router graph. *Transfers to:* any connector/pipeline diagram. *Safety:* **production-safe** — cheap `stroke-dashoffset`; exemplary visibility+PRM gating. (no separate recipe)
- **Scroll-progress parallax (light)** — *Trigger:* scroll-progress. *Mechanism:* hero credit text / wordmark and proof cards get small `transform` offsets tied to scroll position — drift, not scrub. *Reads as:* gentle depth as you leave the hero. *Transfers to:* hero accents. *Safety:* **production-safe** (transform only; small range). → `parallax-drift` (existing recipe).

## Production-safety note

- Warm-neutral ramp, mono-for-data, scale-driven hierarchy, hairline ruled grid, product-telemetry-as-art, single deferred accent: all **production-safe**, cheap, and a11y-positive (high text contrast, one font family, no heavy media).
- The ambient loops are safe **because** they're composited transforms/opacity on a bounded number of elements and **do gate reduced motion** — replicate that gating, don't just the effect. The hero's blurred wordmark uses `filter: blur()` on one large static element (fine); never animate the blur radius itself.
- `backdrop-filter: blur(50px)` on the announcement bar is not paint-free — one static instance is fine; don't stack or animate it.
- **Tap targets:** 70 of 95 interactive elements flagged <44px (dense desktop nav + data chips/axis controls). Verify ≥44px on the mobile breakpoint before lifting the nav or the chart controls.

## Extracted patterns

- ambient-wordmark-light-sweep — giant blurred brand glyph behind a hero with a `plus-lighter` radial light looping across it; ambient hero life without a gradient. (motion)
- mono-telemetry-ledger-card — near-black product panel rendering request/cost data in tabular mono, with a proportion bar, a status chip, and a right-aligned cost; the "show the real telemetry" hero art, revealed by an in-view rise+cascade. (static + motion reveal)
