---
slug: lightspark
url: https://www.lightspark.com
source: landbook
corpus: production
surface: site
captured: 2026-10-12
award_type: Gallery
score: null
tags: [fintech, api, payments, stablecoin, b2b, saas, developer-tools, light]
when_to_use: [landing, product-marketing, hero, feature-section, navigation]
directions: [minimalist, editorial]
layout: [center-stack, editorial-columns]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: https://land-book.com/websites/100969-lightspark-the-api-for-money-accounts-payments-cards
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [ambient-drift-card-field, rule-divided-metric-ledger]
tokens_snapshot: ../tokens/lightspark.json
screenshots: ../screenshots/lightspark/
---

## What works
- **Color is quarantined to the product, the shell stays bone-white.** The entire chrome is a single near-white ground (#f8f8f7) with near-black ink (#020202 / #1a1a1a) and one grey muted step — *all* saturation lives inside the floating product mockups and the soft colored auras (blue, cyan, green, red, violet) blooming behind them. A page about "accounts, payments, cards, stablecoins" could drown in brand colors; instead the neutral frame makes a dozen different product surfaces read as one calm system, and the glow does the selling. Transfers to any product/platform landing where the screenshots are visually loud and the frame must not compete.
- **Hierarchy is pure scale contrast in one weight.** One variable family (Suisse Intl) carries the whole page at essentially a single weight (400, with 450 on buttons). A ~3.3× jump from 13px body to a 43px display headline — plus tightening tracking as size grows (−0.144px at body → −1.7px at display) — does all the ranking. No bold, no second family, no color pops for emphasis. The result reads as confident and spec-sheet precise. Transfers to developer-facing and fintech marketing that wants authority without shouting.
- **The hero is an explorable world, not a static mockup.** Instead of the one-big-dashboard cliché, the hero scatters ~20 product cards in a constellation that *gently drifts forever* (independent looping x/y wander), responds to a `grab`/`grabbing` cursor (the whole field is draggable), grows cards on hover, and reveals a dot-grid under a cursor-following spotlight mask. The centered headline sits calmly on top. It communicates "many products, one surface, alive" far better than a feature list. Transfers to any platform that sells breadth and wants a tactile, investigate-me first screen. (See safety note — it is heavy; gate it hard.)
- **Progressive blur instead of hard glass seams.** The fixed header doesn't sit on a flat frosted bar; it stacks five backdrop-blur layers (4→8→16→32→64px), each masked by a top-weighted alpha gradient and composited, so content scrolling underneath *melts* into frost with no seam line. The same progressive-blur family softens the logo marquee edges and section glow edges. It's the detail that makes the page feel engineered rather than templated. (Covered by the existing `layered-progressive-blur-nav` pattern.)
- **Editorial numbered rows replace the feature-card grid.** "What we do" is a sequence of ruled, index-numbered rows (01–04) — left label + small description, a centered glowing product mockup, right a stack of CTA links — and the stats band is four hairline-divided columns with the kicker pinned top and the big number pinned to the baseline. Whitespace and thin rules carry the structure; nothing is boxed. Transfers to feature sections and spec/stat bands that want to feel like a ledger, not a brochure.
- **The nav knows what's under it.** Logo and nav links flip ink→white as a dark section (the footer) scrolls beneath the fixed header — a section-aware contrast swap, not a blend mode — so the chrome stays legible over any background without a solid bar. Transfers to any transparent pinned nav crossing light and dark regions.

## Design-system read
- **Type:** One variable family — Suisse Intl (+ Suisse Intl Mono for figures) — run almost entirely at weight 400 with 450 on buttons. Fluid scale via `clamp()`: body ~1.3rem (13px), captions/kickers ~0.99rem (≈10px), stat numbers ~32px, section headings 32px, hero display `clamp(3.6rem, 2.88rem + 1.5vw, 4.8rem)` (36–48px; 43px at 1440). Tracking tightens with size (−0.02em headings, −0.04em hero). Line-height ~1.15 display / 1.3 body. `font-feature-settings: "salt","zero","case"` for the clean alternates and slashed zero. Hierarchy = scale + tracking, never weight.
- **Color:** Monochrome shell — bg `#f8f8f7` (gray-050), surfaces `#ffffff` / `#f0f0ee` (gray-100), ink `#020202` / `#1a1a1a` (gray-950), muted `#7c7c7c` / `#656565`, hairline `rgba(38,38,35,0.1)`. One electric link/focus blue `#0000ee` (focus ring `#1827fa`). Dark footer on `#1a1a1a`/`#111`. All real color is per-card glow — blues (`#0052ff`,`#00a2c7`), violet (`#820ad1`), plus red/green/orange auras — never applied to the UI chrome.
- **Spacing rhythm:** rem scale on a 10px root; a 6/12/24/48px family (0.6/1.2/2.4/4.8rem) for component gaps, section padding `clamp(5.6rem,…,8rem)` (56–80px). Dot grid at 16px. Whitespace is the primary separator — the page breathes between dense clusters.
- **Layout system:** Centered content in a ~1098px measure inside a 122rem page-width grid overlay (12-col, observed 4/15/2 fragments); reading blocks tighten to ~522px. Flex-dominant (164 flex vs 7 grid). Breakpoints 376/480/720/768/960/1023/1200. Hero is full-viewport (`100dvh`) center-stack; feature/stat sections are editorial columns.
- **Layering / page architecture:** Mostly flat scroll with purposeful fixed chrome — no full-viewport backdrop, no blend curtain (`has_static_backdrop:false`, `has_blend_overlay:false`). The z-story is in the header stack: a transparent pinned `<header>` (z-10) over a 13rem progressive-blur strip (z-9), a 1px status-bar fill, and a −1 rubberband underlay. Depth comes from the blur gradient and the colored glow auras, not from box-shadows (the only shadow on the page is a faint `rgba(0,0,0,.06) -12px 0 32px`).
- **Motion / easing intent:** House timings 150–600ms; signature eases are a slight-overshoot `cubic-bezier(.175,.885,.32,1.1)` for UI, an in-out sine `cubic-bezier(.455,.03,.515,.955)` for the idle wander, and easeOutQuint `cubic-bezier(.22,1,.36,1)` for reveals. Motion is ambient and communicative — cards drift, sections rise in, the nav recolors — never a demo that hijacks the scroll. Reduced-motion is respected (17 PRM rules).
- **Density:** High *content* density (many mockups, small type, long footer index) kept legible by a strict monochrome frame and generous section whitespace.
- **Hierarchy:** Scale and position first; color is a distant last, reserved for product glow and the single link-blue.
- **Restraint:** No gradient chrome, no multi-weight ramp, no drop-shadow cards, no hero dashboard cliché — big calm type over a living but muted field, with saturation locked inside the product.

## Interaction & motion
- **Ambient idle card drift** — *Trigger:* load (infinite loop). *Mechanism:* each hero card runs two independent infinite keyframe loops (`wander-x` ~12s, `wander-y` ~16s) translating a few px on an in-out-sine ease, offsets set per card via custom properties, `animation-play-state: paused` when the hero is "asleep" (offscreen/idle). *Reads as:* a living, buoyant product field. *Transfers to:* hero constellations, logo gardens, any "many things, gently alive" surface. *Safety:* **production-safe** — transform-only, paused when offscreen, reduced-motion disables it; keep card count and blur modest. See `ambient-drift-card-field`.
- **Draggable field + cursor spotlight mask** — *Trigger:* drag + mousemove. *Mechanism:* the hero is `cursor: grab`/`grabbing`, draggable as one "world"; a dot-grid background is revealed only through a radial `mask-image` centered on `--mx/--my` (the cursor), updated via rAF. *Reads as:* a tactile, investigate-me playground. *Transfers to:* exploratory heroes. *Safety:* **spectacle-only** — the mousemove+rAF spotlight is the one continuous-input cost on the page; cheap (mask only, no layout) but drop the spotlight on touch and under reduced-motion.
- **Hover grow + mask swap on cards** — *Trigger:* hover. *Mechanism:* `transform: scale(1.12)` with a crossfade between two `mask-image`s (rest vs hover shape) on a `.45s` overshoot ease. *Reads as:* responsive, physical cards. *Transfers to:* any card grid. *Safety:* **production-safe** (transform/opacity only).
- **In-view fade-rise reveal** — *Trigger:* in-view. *Mechanism:* `[data-reveal]` starts `opacity:0; translate:0 1.2rem`, an IntersectionObserver flips it to `in` → `opacity:1; translate:0` over `.65s` easeOutQuint with a `--reveal-delay` stagger. *Reads as:* content settling into place as you reach it. *Transfers to:* every scroll section. *Safety:* **production-safe** — one class toggle, no scroll handler.
- **Progressive edge-blur curtain** — *Trigger:* scroll-progress (reads as reveal under the fixed header). *Mechanism:* five stacked `backdrop-filter` layers of increasing radius, each with a top-weighted alpha `mask-image` + `mask-composite: source-in`, so blur ramps smoothly with no seam. *Reads as:* real frosted depth. *Transfers to:* pinned navs, marquee edges. *Safety:* **production-safe** but blur-heavy — collapse to one layer on mobile. Covered by `layered-progressive-blur-nav`.
- **Section-aware nav contrast** — *Trigger:* in-view. *Mechanism:* observers watch which section underlaps the fixed header and toggle the logo/link color black↔white (not a blend mode). *Reads as:* chrome that stays legible over anything. *Transfers to:* transparent pinned navs crossing light/dark. *Safety:* **production-safe**.
- **Edge-blurred logo marquee** — *Trigger:* load (infinite translate) + progressive edge blur. *Mechanism:* duplicated track scrolls under a mask + stacked `blur(3/9px)` edge layers so logos dissolve rather than hard-clip at the container edge. *Safety:* **production-safe**; pause on hover and under reduced-motion.

## Production-safety note
- The constellation hero is the one place to budget carefully: ~20 drifting cards, a cursor-tracked spotlight (mousemove + rAF), and multiple backdrop-blur stacks are each cheap alone but add up. It's done right here — transform/opacity only, `animation-play-state: paused` when idle, blur layers collapsed on mobile, and reduced-motion honored — but reproduce those guards or the page will jank on low-end devices. The spotlight/dot-grid is **spectacle-only**; everything else is **production-safe**.
- 82 small tap targets flagged (dense footer index + nav); audit hit areas on mobile.

## Extracted patterns
- `ambient-drift-card-field` — a field of cards that loops a gentle infinite drift (draggable, hover-grow), for an explorable hero instead of a single mockup.
- `rule-divided-metric-ledger` — hairline-divided stat/feature columns with the kicker pinned top and the number pinned to the baseline; reads as a ledger, not cards.
