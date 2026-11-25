---
slug: grida
url: https://grida.co
source: landbook
corpus: production
surface: site
captured: 2026-11-02
award_type: Gallery
score: null
tags: [design-tool, creative-tools, ai, canvas, gaming, saas, product-marketing, light, dark]
when_to_use: [landing, product-marketing, hero, feature-section, interactive-showcase]
directions: [minimalist, editorial]
layout: [scroll-theater, full-bleed]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: https://land-book.com/websites/100941-an-open-canvas-to-design-and-create-grida
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [chapter-theme-crossfade, scroll-parallax-depth-layers]
tokens_snapshot: ../tokens/grida.json
screenshots: ../screenshots/grida/
---

## What works
- **The page is told in chapters that swap light↔dark as you scroll, not one flat scroll.** A near-white opener (`#fafafa`/`#f6f6f6`) hands off to a tall near-black "creative chapter" (`#111`, a single 6650px wrapper) and back to a light ownership/footer close. The handoff is animated: a sentinel section crossfades its background `rgb(250,250,250)→rgb(17,17,17)` and fades its own text out as the next chapter enters view. Darkness becomes *punctuation* — it marks where the pitch changes register (ideation → world-building) — instead of a theme toggle (`supportsDark:false`). Transfers to any long single-column story that needs acts without navigation.
- **Hierarchy from scale contrast in one weight, not from bold.** 987 of ~1060 text nodes are weight 400; 500 does light emphasis; 600 is nearly unused. The ladder is pure size: a 113px display H1 over 16px/24px body — a ~7× jump — with whitespace doing the separating. The page reads calm and editorial even though it stacks demo after demo. Reusable in any product-marketing page tempted to reach for weight.
- **Negative tracking that scales with type size.** Tracking tightens as the glyphs grow — `-7.6px` at 114px, `-4.5px` at 78px, `-3.4px` at 56px, `-0.45px` at 18px, ~`0` at body — a measured ramp, not one global letter-spacing. Big declaratives ("Worlds start here.", "Go with the flow.", "Start creating.") stay optically tight and poster-like while body stays open. Transfers to any system with a wide size range.
- **Color is quarantined: monochrome chrome, one indigo reserved for "the software."** The entire layout frame is grayscale — ink `#181818`/`#202020`, muted `#6b6b6b`/`#777`, one hairline `#e3e3e3` (used 600+ times). The only saturated hue is a periwinkle indigo (`#6b70d6` focus ring / `#777ce4` selection handles) that appears exclusively on canvas-UI selection boxes and focus outlines. Color reads as "you are using the editor," never as decoration. Transfers to any tool landing that wants a trustworthy surface with a live product inside.
- **Product demos are the real editor UI, mid-task.** Mockups carry breadcrumbs ("Form study / Exploration 01"), a layers panel ("Your layers · 5 layers connected"), selection handles around a headline being edited, tab rows — the canvas is shown *in use*, not as a hero screenshot. The argument "this is a live open canvas" is made by the chrome itself. Transfers wherever the value is the act of creating.
- **Soft, low-contrast elevation keeps cards floating without borders.** Shadows are wide and faint (`0 12px 50px rgba(0,0,0,.047)`, `0 4px 10px rgba(0,0,0,.035)`), radii generous (16/20/24px, 999px pills). Cards separate from the backdrop by depth and whitespace, not outlines — consistent with the monochrome, hairline-only frame.

## Design-system read
- **Type:** Inter variable (100–900) self-hosted, one family for everything; monospace for a few canvas labels. Fluid scale, display 113.76px desktop → 46px mobile, body 16px/24px (1.5 leading), hero leading ~1.01. Hierarchy = scale + color; weight held at 400/500. Size-proportional negative tracking ramp.
- **Color:** Light base `#fafafa`, white cards `#ffffff`, one hairline `#e3e3e3`; ink text `#181818`/`#202020`, muted `#6b6b6b`/`#777`. Dark chapters `#111`/`#171717` surface with `#242424` panels and `rgba(255,255,255,0.1)` borders. Single accent = indigo `#6b70d6`/`#777ce4`, scoped to selection + focus. A cool slate `#839097` appears in product UI chrome.
- **Spacing rhythm:** 8px base (gaps cluster 4/8/12/16/24/32); section padding steps to `py-28` (112px) with some 164px block pads. Whitespace, not rules, separates sections.
- **Layout system:** flex-dominant (126 flex vs 18 grid), containers capped 1200/1280/1400px. Headlines left-aligned at generous left margin with a device/canvas to the side; closing headlines center. Breakpoints ~600–1500; nav collapses to a hamburger on mobile (5 links → 1). Mobile H1 drops to 46px.
- **Layering / page architecture:** NOT a parallax world behind a static page — `has_static_backdrop:false`, `has_blend_overlay:false`. Depth comes from **three full-viewport `sticky` stages** (`canvas-journey`, `fx-world`, `models`), each pinned `top:0` at 100%×100% while a tall track scrolls, plus a pinned `z-50` header. Inside the fx-world stage, absolutely-stacked depth layers (Sky/Hills/Trees/Ground/Foreground) parallax to assemble a game background. No glass/blend layers.
- **Motion / easing intent:** base durations 150/180/280/420/650/700ms; signature easing `cubic-bezier(0.2,0.7,0.2,1)` for reveals, `cubic-bezier(0.4,0,0.2,1)` for UI, plus an ambient 70s `game-pan` loop. Motion communicates "layers coming together into a world" — assembly, depth, continuity. 220 rAF callbacks, 4 IntersectionObservers (47 targets), custom scroll-linking (no animation library detected).
- **Density:** moderate — a long page of large, airy single-idea sections; kept legible by huge type, deep padding, and capped reading widths.
- **Hierarchy:** scale first, color (ink vs muted, light vs dark chapter) second, position third; weight is deliberately not a lever.
- **Restraint:** no page-level gradient wash, no colored chrome, no hero video, one accent hue confined to product UI, one hairline. All richness is pushed into the canvas demos and the scroll choreography.

## Interaction & motion
- **Chapter theme crossfade** — *Trigger:* in-view. *Mechanism:* a sentinel section animates its `background` `#fafafa→#111` and fades its own content out as the next (dark) chapter scrolls into view, so the whole page flips register without a reload or a theme switch. *Reads as:* turning a page / act break. *Transfers to:* any long narrative landing that needs acts. *Safety:* **production-safe** (animates background/opacity only; cheap). See `patterns/chapter-theme-crossfade.md`.
- **Multi-layer scroll parallax (depth assembly)** — *Trigger:* scroll-progress inside a sticky stage. *Mechanism:* named layers (Sky/Hills/Trees/Ground/Foreground) translate at different rates while a "Source artwork" figure fades (`1→0`) and scales (`1→0.6`), so a flat illustration visibly separates into depth — mirroring the product (a looping game-background builder). *Reads as:* layers pulling apart into a 3D world. *Transfers to:* any feature whose value is layers/compositing/depth. *Safety:* **production-safe** if confined to `transform`/`opacity` on a pinned stage; watch motion-sickness on long travels. See `patterns/scroll-parallax-depth-layers.md`.
- **Sticky-pin scrollytelling** — *Trigger:* scroll-progress. *Mechanism:* three 100vh `sticky top:0` stages pin while their tall tracks scroll, giving each demo a held frame to play its steps (`previewEnter`, `arrive`, `game-pan`). *Reads as:* "watch this build." *Transfers to:* step-by-step product explainers. *Safety:* **production-safe**; needs `prefers-reduced-motion` and a sensible non-sticky fallback.
- **Scroll-progress horizontal conveyor** — *Trigger:* scroll-progress. *Mechanism:* the "More ways to create" model cards translate horizontally and the focused card scales up (scale ramps crossfade `0.19↔1.12`) as vertical scroll advances — a filmstrip driven by page scroll, not a drag carousel. *Reads as:* models passing on a belt, one in focus. *Transfers to:* galleries/logo walls/showcases. *Safety:* **production-safe** (transform-only), but map scroll→scale carefully to avoid jitter.
- **Clip-path diagonal reveal** — *Trigger:* in-view. *Mechanism:* a `clip-path` polygon wipes diagonally (`polygon(100% 0 …)→polygon(-40% 0 …)`) to uncover a 3D wireframe mesh over the rendered image. *Reads as:* "see under the render." *Transfers to:* before/after, render-vs-wireframe, reveal moments. *Safety:* **production-safe**; clip-path animation is composited.
- **Scroll-driven tab highlight + in-view fade-rise** — *Trigger:* in-view / scroll-progress. *Mechanism:* as a pinned section advances, the active tab's text color brightens (`#252525↔#6e6e6e`) to track progress; entering cards fade-rise and one tilts `~4°` on entrance (`scroll-fade-reveal-t/b/s/e` keyframes, 85/170ms stagger). *Reads as:* orientation + gentle arrival. *Transfers to:* any sectioned feature list. *Safety:* **production-safe**.

## Production-safety note
Every technique here is production-safe when confined to `transform`/`opacity`/`clip-path` and `background`/`color` crossfades. `prefers-reduced-motion` is respected (15 PRM rules) — the parallax and conveyor should jump to an assembled end-state under reduce. One caution unrelated to motion: 59 of 78 interactive targets are small (`tap-targets-risky`) — enlarge hit areas before reusing the compact canvas-chrome controls.

## Extracted patterns
- `chapter-theme-crossfade` — animate a section light↔dark as the next act enters view, to punctuate a long page without a theme toggle.
- `scroll-parallax-depth-layers` — stacked layers translating at different rates inside a sticky stage to assemble depth from a flat image.
