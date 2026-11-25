---
slug: enode
url: https://enode.com
source: landbook
corpus: production
surface: site
captured: 2026-10-26
award_type: Gallery
score: null
tags: [energy, cleantech, climate, fintech, b2b, saas, developer, api, data-viz, mono]
when_to_use: [landing, product-marketing, feature-section, hero, footer]
directions: [minimalist, editorial]
layout: [content-grid, center-stack]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high]
provenance:
  gallery_url: https://land-book.com/websites/101538-enode-orchestrating-energy-for-the-next-grid
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [mono-eyebrow-fluid-masthead, in-view-reveal-blur-rise]
tokens_snapshot: ../tokens/enode.json
screenshots: ../screenshots/enode/
---

## What works (transferable principles)

- **A single warm near-neutral ground + one electric signal hue carries a whole infra product with zero gradients.** The page lives entirely on warm paper (`#f4f2f1`, a ~48.7°-hue warm gray, not a blue-gray), a warm-ink text ramp (`#252322` → `#4c4948` → `#6e6a68`) and barely-there card surfaces (`oklch(94.47%)` ≈ 1–2% darker than the page). Exactly **one** saturated color appears — an electric lime `#b0f87d` — and it is rationed to the eyebrow marker, the primary-CTA *hover*, focus rings, and the "live" accents inside product demos (charge arc, chart line, pulsing nodes). Transferable: choose the *undertone* of your neutral to mean something (warm = grounded/physical/energy; cool = clinical) and spend one chroma so sparingly that every appearance signals "this is live / act here."
- **Hierarchy is pure scale contrast in one variable family — weight is almost flat.** "Enode Sans" is a variable face used across a tiny weight band (≈450–535); a 68px fluid masthead over 18px body is a ~3.8× jump that does all the ranking, so the page reads calm even as it stacks dense product demos. Transferable: reach for a bigger size (and a surface flip) before a heavier weight; a near-constant weight is what makes a type system feel like one voice.
- **A monospace is a semantic layer, not decoration.** "Enode Mono" is reserved for machine/label content — the uppercase eyebrows (`THE ENODE PLATFORM`, `USE CASES`), status chips inside the mockups (`2.1 kW · Discharging to grid`, `Ready by 06:00`), metric figures. Each eyebrow is prefixed by a 6px lime square. The typeface switch itself says "this is a measured, system fact," which for an energy-API product is the credibility move. Transferable: let a second family carry *meaning* (data vs prose), not variety; mark section starts with mono-caps + a signal dot rather than a heavier heading.
- **The product's own UI is the hero art — rendered, animated, and annotated as live telemetry.** Instead of a stock 3D render, the hero is a photoreal home with glass chips labeling real device states (`BATTERIES 2.1 kW`, `EV CHARGING 7.4 kW`), and the use-cases are three literal product mockups: a phone with a filling charge ring (`23%`), an isometric house energy diagram, and a forecast area-band chart. For an orchestration platform this *is* the demo and doubles as proof. Transferable: if your product emits structured state, style that state beautifully and ship it as the imagery — it out-persuades any abstract illustration.
- **Optical cap-trimming + a named semantic type scale give print-grade vertical rhythm.** A `.cap-trim` utility pulls the line box to the glyph cap/baseline (`margin: calc(0.344em - 0.5lh)`), and type is addressed by role (`masthead / display / h1–h3 / standfirst / lede / lead / body / quote / label / fine`) with per-role line-height, tracking, and weight baked in. Transferable: define type by *role* with its metrics bundled, and trim the cap box so headline-to-body spacing is measured from the ink, not the font's leading — the whole page snaps to a tighter grid.
- **Depth lives inside the mockups, not in the page scroll.** The document is a flat warm scroll; what reads as "rich" is local — frosted glass chips (`backdrop-filter: blur(2–24px)`) over the hero video, phone/browser chrome frames, and isometric line diagrams, each floating on faint inset hairlines rather than drop shadows. Transferable: you can keep a page honest and fast (one flat ground) and still feel premium by investing depth *into the components* — glass + hairline + chrome framing — instead of parallax.

## Design-system read

- **Type:** One variable family, **Enode Sans** (`375–635` axis, used ≈450–535), plus **Enode Mono** for labels/data. Role-named scale: `masthead` `clamp(2.125rem, 1.211rem + 3.9vw, 4.25rem)` (34→68px, lh 1.05, tracking −0.02em), `display` 2.75rem, `h1` 2.25 / `h2` 1.875 / `h3` 1.5rem, `standfirst` clamp(1.5→2.5rem), `body` 1.125rem/1.45 (weight 470), `label` .875rem, `fine` .75rem. Tracking is size-proportional: negative on display (−0.02 → −0.005em), opening to positive caps on mono eyebrows (`.52px` ≈ +0.04em). Hierarchy = **scale**, not weight. Mobile masthead ≈ 34.6px; body stays 18px. `font-feature-settings:"kern"`, mono gets `"zero" 1` (slashed zero).
- **Color:** Warm-neutral spine — page `#f4f2f1`, secondary surface `#fff`, text `#252322`/`#4c4948`/`#6e6a68`, borders/hairlines `#dcd8d6`/`#e8e5e3`, card bg `oklch(94.47%)` with `oklch(92.14%)` hairline. A full warm-gray alpha ramp (`#15141308 … #151413`) does dividers and glass. **One** page accent: enode lime `#b0f87d` (brand-225) with a tint/shade family (`#e4fed2 … #022c06`); roles → `signal-brand`, `control-link`, `control-focus-ring`, `node`. Semantic green `#55973b` for "on schedule." No page-level dark re-theme — the cream ground holds in both captures; a scoped `[data-mode="dark"]` exists **only** to flip the *insides of diagrams/phone/browser mockups* for contrast.
- **Spacing rhythm:** 4px base (`--spacing:.25rem`). Micro-gaps **6/8/12px** inside chips and data rows; layout gap 20px; section rhythm `py-24`/`py-32` (96/128px). The tight chip gaps make the mockups read dense-but-ordered against the huge section air.
- **Layout system:** 12-col grid on a ~1308px track (`--grid-max:81.75rem`), gutter 1.25rem. Hero is a left-aligned `center-stack` (masthead + two CTAs) over a full-width media card; feature + use-case + metric bands resolve to 3-up cells (`content-grid`); footer is a 4-column link grid. Flex-dominant (98 flex vs 8 grid). Mobile collapses to 1–2 cols and the 6-link nav to a hamburger (2 visible). `scroll-padding-top:5.5rem` for the pinned header.
- **Layering / page architecture:** **Single flat warm scroll.** `has_static_backdrop:true` but it's an `opacity:0` fixed `-z-20` plate used only as a crossfade target for section theme-tinting; `has_blend_overlay:false`. 8 fixed elements are the pinned header + HubSpot anchors, not parallax. Depth is purely local to components (glass chips, chrome frames, line diagrams on inset hairlines). A `--theme-fade-tokens` set crossfades a batch of surface/text tokens over `0.4s` as sections change context — section-driven tinting, not a moving backdrop.
- **Motion / easing intent:** Durations `150` (default) / 200 / 300 / 400 / 500 / 520 / 700ms. Easings: signature **`cubic-bezier(0.16,1,0.3,1)`** (expo-out) for the reveal and settles, `cubic-bezier(0.4,0,0.2,1)` standard for state, `cubic-bezier(0,0,0.2,1)` ease-out, `cubic-bezier(0.32,0.72,0,1)` snappy. 22 `@keyframes`, 16 reduced-motion blocks. Intent: **alive at rest, quick on interaction, never scroll-jacked.**
- **Density:** High *apparent* density (photoreal hero, three live mockups, metric row, 30+ footer links) kept legible by enormous section padding and a near-monochrome palette — color never competes, so the eye reads one block at a time.
- **Hierarchy:** Scale first, then surface (card vs page), then the lime signal. Weight is deliberately flat.
- **Restraint:** No gradients, no drop-shadow stacks (inset hairlines instead), no page-wide dark flip, no scroll-jacking, one accent hue. Spectacle is confined to the product mockups.

## Interaction & motion (techniques)

- **In-view reveal: blur + rise + fade, expo-out, IO-gated & staggered** — *Trigger:* in-view. *Mechanism:* `@keyframes reveal-enter` drives `opacity 0.01→1`, `filter blur(8px)→0`, `transform translateY(12px)→0` over `0.7s cubic-bezier(0.16,1,0.3,1)`, `animation-fill-mode:backwards`, per-element `--reveal-delay` stagger (~120–360ms); gated by `[data-reveal]` + IntersectionObserver (33 targets, `rootMargin:0px 0px -15% 0px`). A `reveal-safety` keyframe force-completes at 4s if JS never hydrates. *Reads as:* content materializing into focus, calm and expensive. *Transfers to:* any section/card entrance. *Safety:* **production-safe** — only `opacity/filter/transform`; reduced-motion sets `[data-reveal]{opacity:1}` and disables `[data-reveal-css]`. See `patterns/in-view-reveal-blur-rise.md`.
- **Hero media montage with live glass annotations** — *Trigger:* load/loop + in-view. *Mechanism:* looping `<video>` scenes crossfade (`opacity 1→0`, `filter→blur(6px)`) while frosted `chrome-glass` chips (`backdrop-filter:blur(24px) brightness(.92)`) label device states. *Reads as:* a home actively being orchestrated in real time. *Transfers to:* any "live system" hero. *Safety:* **production-safe** (compositor-only), but gate video autoplay/decode cost and offer a static poster under reduced-motion.
- **Ambient product-demo micro-loops** — *Trigger:* in-view. *Mechanism:* each mockup runs tiny looped SVG/canvas keyframes — `progress-ring-first/second` (charge arc filling to 23%), `forecast-drift` (area-band chart breathing), `pulse-breathe`/`charge-pulse`/`beat-flare` (node + signal pulses), `webhook-log-line`/`chat-*`/`caret-blink` (a simulated live log). *Reads as:* the product is running, not a screenshot. *Transfers to:* dashboard/feature mockups. *Safety:* **production-safe** if confined to small nodes and paused off-screen; watch for many simultaneous rAF loops (probe counted heavy rAF) — budget them.
- **Pinned glass header + section-theme crossfade** — *Trigger:* scroll-progress / in-view. *Mechanism:* transparent fixed header (`z-40`) gains a `chrome-glass` blurred backdrop; a `--theme-fade-tokens` batch transitions surface/text/card tokens over `0.4s` as each section's theme context enters. *Reads as:* chrome that stays legible over any content and sections that "settle" into their own tint. *Transfers to:* long marketing pages with varied section grounds. *Safety:* **production-safe**; `backdrop-filter` has a GPU cost — one header layer is fine.
- **Isometric platform cube reveal** — *Trigger:* in-view. *Mechanism:* an exploded composable-cube SVG rotates (`transform: rotate(-36°)`) as it enters. *Reads as:* "composable building blocks assembling." *Transfers to:* architecture/platform diagrams. *Safety:* **production-safe** (single transform).
- **Scroll section-index chip** — a small pinned `01 Platform / 02 Use cases` indicator tracks scroll position (bottom-right). *Safety:* **production-safe**; nice orientation cue on long pages.

Reduced motion is **respected** throughout (16 PRM rules; `[data-reveal]` and `[data-reveal-css]` both reset; `scroll-behavior:smooth` gated behind `no-preference`).

## Production-safety note
- Everything here is production-safe; the only budgets to watch are (a) multiple autoplay `<video>` + canvas demos (decode/memory) and (b) many concurrent rAF micro-loops — pause both off-screen. a11y caveat: the probe flags **33 small tap targets** (dense footer link lists + compact nav), so size footer/nav hit areas up on touch.

## Extracted patterns
- `mono-eyebrow-fluid-masthead` — mono-caps eyebrow + signal dot over a fluid-clamp masthead in one variable family, on a warm near-mono ground. Reuse for any section header / hero.
- `in-view-reveal-blur-rise` — IO-gated, staggered blur+rise+fade entrance with a no-JS safety timeout and reduced-motion reset. Reuse for any section/card reveal.
