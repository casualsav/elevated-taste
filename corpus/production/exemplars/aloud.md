---
slug: aloud
url: https://www.aloud.sh
source: landbook
corpus: production
captured: 2026-09-28
award_type: Gallery
score: null
tags: [ai, dev-tools, mac-app, productivity, saas, dark, monochrome]
when_to_use: [landing, product-marketing, feature-section, hero]
directions: [minimalist, soft]
layout: [center-stack, editorial-columns]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: https://land-book.com/websites/100472-aloud-say-it-ship-it-feedback-your-coding-agent-can-run
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [layered-progressive-blur-nav, container-unit-mockup]
tokens_snapshot: ../tokens/aloud.json
screenshots: ../screenshots/aloud/
---

## What works (transferable principles)
- **The product demo *is* the argument — rebuilt in live DOM, not screenshotted.** Every section stages a working replica of the app (a notes grid, a floating command bar, a before/after annotation slider, a Claude-style terminal, a task checklist) built from real markup + CSS and animated to enact the feature the copy claims. Density signals capability; the argument is legible because everything else on the page is quiet. This is the opposite of the generic "fake dashboard PNG under a hero" — reach for it whenever you can show the software actually doing the thing.
- **Scale-contrast hierarchy in a single light weight.** The hero is `clamp(60px, 10.4vw, 124px)` at weight **400** with `-0.058em` tracking; body is 16px. A ~7× jump does all the shouting so the type never has to — nothing on the page is bolder than 600. Hierarchy comes from *size + negative tracking*, not weight, which is what keeps a dense page reading calm. Transfers to any premium/dev-tool marketing surface.
- **Near-monochrome + one borrowed brand accent.** The whole palette is grayscale on `#0a0a0a` (four text greys `#ededed → #5a5a5a`, three white-alpha hairlines). The *only* chromatic ink is `--claude: #d97757`, spent exclusively on the agent/terminal surfaces — so color literally means "this is your coding agent." The primary CTA isn't colored at all; it's a near-white pill (`#f2f2f2`). Reserving hue for one meaning is the cheapest, strongest signal on a dark page.
- **Depth from stacked elevation, not layers or parallax.** It's a single flat scroll over one ground color. Every surface floats via the same recipe: a 1px inset white-alpha hairline for the top-lit edge + a large, very-soft black drop shadow (`0 40px 100px -30px rgba(0,0,0,0.8)`) + a faint top-sheen gradient (`--card`). Codifying elevation as *one* token pair (`--card` / `--card-shadow`) makes twenty different mockups feel cut from the same material.
- **Hairlines and mono labels carry the "engineered" tone.** Structure is drawn with `rgba(255,255,255,0.075)` rules (tile grids, section tops, FAQ dividers) instead of filled boxes, and every technical label — eyebrows, step numbers, meta, kbd caps, terminal — is set in Geist Mono. The sans/mono split does the work a second color usually would.
- **Fluid units make pixel-perfect mockups responsive without media queries.** Each mockup is a container (`container-type: inline-size`) that publishes a proportional unit `--u: calc(100cqw / <designWidth>)`; every inner offset, size, and radius is `calc(N * var(--u))`. The whole scene scales as one object at any width — see `container-unit-mockup`.

## Design-system read
- **Type:** Geist (variable, 100–900) for everything, Geist Mono for technical labels. Fluid clamp scale — hero `clamp(60,10.4vw,124)`, h2 `clamp(36,5.4vw,60)`, h3 `clamp(26,3.2vw,36)`, lede `clamp(17,1.5vw,19)`, body 16/1.5. Weights **400 / 500 / 600 only**. Tracking ramps hard-negative with size (`-0.058em` at 124px, `-0.045em` at h2, ~0 at body) and slightly positive for mono caps. Display headings use `linear-gradient(#fff → #9d9d9d) text` clipping for a subtle top-lit sheen. Hierarchy = scale + tracking, never heavy weight.
- **Color:** dark-native (no light theme). Ground `#0a0a0a`; surfaces `#121212` / `#181818`; text ramp `#ededed` / `#8f8f8f` / `#7a7a7a` / `#5a5a5a`; hairlines `rgba(255,255,255,0.075 / 0.12 / 0.2)`. Sole hue `--claude #d97757` on agent/terminal only. Primary CTA = near-white pill `#f2f2f2` → `#fff` on hover; ghost CTA = `rgba(255,255,255,0.04)` + inset hairline.
- **Spacing rhythm:** section vertical rhythm is a single dominant unit — **176px** top padding on nearly every section (112px on mobile). Component gaps 8 / 12 / 20 / 24px; gutter 24px (16px mobile). Generous air between dense mockups is what keeps the density legible.
- **Layout system:** centered hero (center-stack) then a stack of editorial feature bands inside a 1200px wrap (+24px gutter). Section skeletons vary — `grid-3`, split `1.38fr/1fr`, 3-column diff, `2fr/1fr` after-grid, `5fr/7fr` privacy & FAQ. 80 flex : 20 grid. Breakpoints 420 / 720 / 900 / 1080; single-column + hamburger below 720.
- **Layering / page architecture:** single flat scroll (`has_static_backdrop:false`, `has_blend_overlay:false`). Only three fixed/sticky layers: a `z-50` fixed nav with a **progressive gradient-blur curtain** that fades in past the hero, a `z-5` sticky **command bar** (`pointer-events:none`) that docks near the viewport bottom while the hero mockup scrolls behind it, and the film-player dialog. Depth is elevation + shadow, not parallax planes.
- **Motion / easing intent:** one signature easing everywhere — `cubic-bezier(0.16,1,0.3,1)` (expo-out) — with durations 200–1300ms. Motion always *enacts the product* (a note saves, a correction rewrites, an area gets circled, checkmarks pop, an agent types) rather than decorating. Reduced motion is respected globally (transitions/animations collapsed to 0.01ms).
- **Density:** high per-mockup (real app UIs), low per-page (one idea per band, huge whitespace). Resolved by monochrome + scale contrast.
- **Hierarchy:** dominant ordering device is **scale**, with the lone coral accent marking the agent and the near-white pill marking the one action.
- **Restraint:** no chromatic gradients-as-hero, no glass everywhere (blur is reserved for the nav curtain and captions), no parallax, no stock illustration. The only image is a warm dune photo used as a faint glow behind the hero window.

## Interaction & motion (techniques)
- **Progressive (gradient) blur nav curtain** — *Trigger:* scroll-progress (in-view of hero exit). *Mechanism:* five stacked `<i>` layers each with a stronger `backdrop-filter` (`blur(1px)`→`blur(18px) saturate(1.4)`) and a `mask-image` gradient that cuts each layer off higher up, so blur *ramps* from clear at top to heavy at the fade line; the whole curtain crossfades `opacity 0→1` when `.is-scrolled`. *Reads as:* the page dissolving softly under the chrome, not a hard bar. *Transfers to:* any fixed header over imagery/content. *Safety:* **production-safe** (compositor-only; drop below tablet for perf). See `layered-progressive-blur-nav`.
- **In-view "scene run" via class-toggle choreography** — *Trigger:* in-view (IntersectionObserver, 10 observers / 50 targets, thresholds 0.06–0.55, `rootMargin -8%`). *Mechanism:* JS only adds a state class (`.is-in`, `.is-run`, `.is-done`, `.is-y1/y2/y3`); *all* choreography lives in CSS transitions with per-item `--d` stagger delays — strikethrough sweeps (`background-size 0→100%`), fade-rise (`translateY(28px)→0`), checkmark pop (`scale(.6)→1`), staged SVG annotation drawing. *Reads as:* the feature performing itself as it enters. *Transfers to:* any scrollytelling feature section. *Safety:* **production-safe** (transform/opacity only; reduced-motion jumps to end).
- **Load entrance rise-stagger** — *Trigger:* load. *Mechanism:* `@keyframes rise` (fade + `translateY(18px)`) on hero title/lede/actions/meta with 0.08s step delays; `rise-window` (larger `translateY(48px) scale(.985)`) on the two hero mockups at 0.2/0.34s. *Reads as:* the interface settling into place. *Transfers to:* hero intros. *Safety:* **production-safe**.
- **Expanding utility pill** — *Trigger:* scroll-progress (`.is-past`). *Mechanism:* the nav "Watch video" pill animates `max-width 0→180px` + padding + opacity over 0.55s, revealing a secondary action only once the hero CTA has scrolled away. *Reads as:* chrome that earns its space. *Transfers to:* sticky secondary CTAs. *Safety:* **production-safe** (animating `max-width` is cheap on a tiny fixed element; avoid on large/reflowing nodes).
- **Auto-advancing tabs with a scrub timer** — *Trigger:* in-view + timer. *Mechanism:* `.flows.is-auto` runs a 6.5s linear `flow-bar` `scaleX(0→1)` under the selected tab; `animation-play-state: paused` on hover (`.is-held`). *Reads as:* a self-playing gallery you can grab. *Transfers to:* feature carousels. *Safety:* **production-safe**.
- **Ambient product loops** — *Trigger:* load (idle). *Mechanism:* small infinite CSS keyframes hint liveness — `mic-ping` (recording halo), `bar-this` (shimmer sweep across the word "this"), `bar-wait` (typing dots), `caret-blink` (terminal cursor). All gated behind an `.anim` class and killed by reduced-motion. *Reads as:* "the app is alive." *Transfers to:* device mockups. *Safety:* **production-safe** (tiny, composited).

## Production-safety note
Everything here is production-safe. The nav curtain stacks five `backdrop-filter` layers — cheap on desktop but worth dropping under a media query on low-end mobile. The `max-width` pill transition is fine only because the node is tiny; never animate `max-width`/`width` on layout-bearing elements. Reduced motion is respected globally.

## Extracted patterns
- layered-progressive-blur-nav — stacked, mask-gradiented `backdrop-filter` layers that ramp blur strength under a fixed header and fade in on scroll; reuse for any chrome over content.
- container-unit-mockup — author a fluid, pixel-accurate app/device mockup in fixed "design pixels" via `container-type: inline-size` + `--u: calc(100cqw / designWidth)`; reuse for any responsive product replica.
