---
slug: ardor
url: https://ardor.cloud
source: landbook
corpus: production
captured: 2026-10-12
award_type: Gallery
score: null
tags: [ai, saas, b2b, developer-tools, soft, retro-tech, glass, light]
when_to_use: [landing, product-marketing, hero, feature-section, pricing]
directions: [soft, minimalist, editorial]
layout: [center-stack, full-bleed]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: https://land-book.com/websites/100986-ardor-one-ai-agent-that-builds-deploys-and-runs-apps
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [pastel-bloom-backdrop, in-view-blur-reveal]
tokens_snapshot: ../tokens/ardor.json
screenshots: ../screenshots/ardor/
---

## What works
- **One dot-matrix display face does all the branding work.** The display headlines render in Doto — a pixel/dot-grid variable font — against an otherwise neutral Roboto Flex body. A single idiosyncratic typeface at display scale gives the page a "terminal / machine" personality without a logo wall, custom illustration, or a second accent color. Transfers anywhere you want character cheaply: pick *one* unusual display face, keep the body face utterly neutral, and never mix two personalities.
- **The product IS the hero — a live, editable composer, not a screenshot.** Instead of a static dashboard mockup, the hero is a real-looking command input whose placeholder cycles through tasks ("Automate reports" → "Create content machine" → "Create a presentation"). It shows the product's one gesture (type an instruction) in the product's own chrome. Transfers to any tool whose value is a single input surface — show the actual interaction, animated, over an illustration of it.
- **A still pastel world; the content scrolls over it.** A fixed full-viewport backdrop (soft peach→pink→lavender bloom bleeding from the top, over a faint blurred grid of app logos) sits at `z:-10` while every section scrolls above it on transparent backgrounds. Depth comes from *parallax between a pinned backdrop and flowing foreground*, not from shadows. Reusable for any calm, airy landing — one cheap fixed layer replaces per-section background art.
- **Glass plates unify every surface.** Cards, the composer, the cookie bar, pricing tiles all share one recipe: 75%-white fill + `backdrop-blur(10px)` + 20px radius. Because they're translucent, the pastel backdrop tints each one slightly differently by position, so a flat UI reads as layered without a shadow system (elevation shadows are effectively zero).
- **Hierarchy from scale + whitespace, in a single weight.** Body text is 400 almost everywhere (the only other weight is 900, reserved for Doto display). The jump from 13px body to 32px display plus `--spacing-section: 180px` of air between bands does all the ordering — the page stays calm at high information density (10 full sections).
- **Restraint with the accent.** The brand accent `#4d0099` is a deep violet held in reserve for links/semantics; the *visible* color is entirely the low-saturation pastel bloom. Color never competes with content — the page is functionally monochrome ink-on-off-white with one atmospheric gradient.

## Design-system read
- **Type:** Two families, one personality. **Doto** (variable 100–900, dot-matrix) for display headings only; **Roboto Flex** (variable) for all body/UI; ui-monospace for code. Scale is compact and token-driven: caption 10 · body/label 13 · subheading 19 · heading/title 32 (utility steps to 3rem). Leading is tight (1.0 on headings, 1.2 body). Hierarchy = scale contrast, not weight (body is 400 throughout). Mobile *bumps* the scale up (body 13→16, heading 32→36) rather than down — desktop uses a global `zoom: 1.25` (`--ui-scale`) so the compact px values render comfortably large.
- **Color:** Warm off-white canvas `#f2f3f1`; ink `#000` with muted `rgba(0,0,0,.62)` and faint `rgba(0,0,0,.52)` for secondary text; glass surface `rgba(255,255,255,.75)`; inverted pills use ink-on-white (`#fff` on `#000`). Atmosphere is a three-stop pastel — peach `#f0d5be`, pink `#e8bedb`, lavender `#c3bef2` — used in the backdrop bloom and the spinning conic ring. Reserved accent violet `#4d0099`, warning `#d97706`.
- **Spacing rhythm:** 4px base (`--spacing:.25rem`). Section rhythm is huge: `--spacing-section: 180px`. Inner gutters small and consistent (6px gutter, 20px page gutter, 52px grid unit). Common gaps 10/20/24/40/52. Whitespace, not dividers, separates bands.
- **Layout system:** Center-stacked, narrow measure — `--container-content: 762px`, `--container-copy: 378px`, `--container-media: 506px`. Mostly flexbox (355 flex vs 11 grid); grids appear as 3- and 4-up card rows that collapse to 1–3 on mobile. Breakpoints 767 / 900 / 1023.
- **Layering / page architecture:** The signature. `has_static_backdrop: true`, `has_blend_overlay: false`. Z-stack from back to front: fixed pastel backdrop (`z:-10`, full viewport) → section content (transparent bg) → blurred top scrim header (`z:40`, `backdrop-blur(12px)` + bottom mask) + reveal nav (`z:50`) → fixed bottom "Start free" CTA bar (`z:40`) and scroll-hint (`z:50`) → cookie consent (`z:70`). Every content section is transparent (`transparent_height_pct: 100`) so the one backdrop shows through all of them. Depth is pure layering, zero elevation shadow.
- **Motion / easing intent:** Two easings — `cubic-bezier(.4,0,.2,1)` for UI state (150ms default) and `cubic-bezier(0,0,.2,1)` ease-out for entrances/reveals (280–560ms). Motion means "the machine is working": reveals de-blur as you reach them, skeletons sheen then resolve into real content, SVG cables pulse. 16 `@keyframes`, 31 IntersectionObservers over 388 targets, and `prefers-reduced-motion: reduce` disables/short-circuits *every* animation.
- **Density:** High (10 sections, embedded product demos, full pricing + usage tables) yet legible because each band is isolated by 180px of air and capped at a 762px measure.
- **Hierarchy:** Scale is the dominant ordering device; position (centered) and whitespace second; weight and color deliberately not used.
- **Restraint:** No drop shadows, no second accent color, no hero screenshot, no illustration system, no bold body weights. Character is carried entirely by one display face + one atmospheric gradient.

## Interaction & motion
- **In-view blur-reveal** — *Trigger:* in-view (IntersectionObserver, threshold 0.35, 388 targets). *Mechanism:* elements start `opacity:0; filter:blur(8px)` and transition to sharp+opaque when they enter view (opacity 280ms, blur 560ms, staggered). *Reads as:* content "focusing" into place — calm, not bouncy. *Transfers to:* any long scroll page wanting life without movement-sickness. *Safety:* **production-safe** (opacity+filter only, no layout; mobile & reduced-motion jump straight to the end state). See `patterns/in-view-blur-reveal.md`.
- **Cycling prompt placeholder** — *Trigger:* loop (CSS `hero-placeholder` keyframe, 3.4s). *Mechanism:* the composer's placeholder text crossfades between example prompts — each blurs in from `translateY(.9em)`, holds, blurs out upward. *Reads as:* "look how many jobs this one input handles." *Transfers to:* any search/command/AI input hero. *Safety:* **production-safe**; reduced-motion pins a single prompt. See `patterns/in-view-blur-reveal.md` note.
- **Skeleton → content resolve** — *Trigger:* in-view/load. *Mechanism:* a mock dashboard shows `mock-skeleton-sheen` (sweeping gradient) then `mock-skeleton-out` (blur-fade) handing off to `mock-content-in` — simulating the agent building a real app. *Reads as:* the product's core promise, demonstrated. *Transfers to:* "generate / build" product demos. *Safety:* **production-safe**, confined to one component.
- **Spinning gradient ring** — *Trigger:* loop. *Mechanism:* a `conic-gradient(from var(--gradient-ring-angle), peach/pink/lavender)` border animated via a registered `@property` angle (`gradient-ring-spin`, 6s linear), masked to a 2.5px frame. *Reads as:* a soft "active/alive" focus ring on the composer. *Transfers to:* highlighting a primary input. *Safety:* **production-safe** (GPU-friendly; reduced-motion stops it).
- **Backdrop parallax + logo marquee** — *Trigger:* scroll-progress / loop. *Mechanism:* fixed pastel backdrop stays put while content scrolls (parallax by stillness); a logo row translates on a `logo-marquee` loop with side mask-fades. *Reads as:* an atmospheric, continuously-moving-but-quiet world. *Safety:* **production-safe**; marquee uses `transform` + `will-change` and is masked, not JS-scrolled.
- **Flowing SVG cables** — *Trigger:* loop. *Mechanism:* `cable-flow` animates `stroke-dashoffset` on connector paths in the "how it works" diagram. *Reads as:* data/signal flowing between tools. *Safety:* **production-safe**; `display:none` under reduced-motion.

## Production-safety note
Every technique here is production-safe: animations touch only `opacity`, `filter`, `transform`, and a registered custom-property angle; there is no scroll-jacking despite a custom scroll container, elevation is flat, and `prefers-reduced-motion: reduce` has an explicit fallback for all 14 animation rules. Watch-outs: 126 small tap targets flagged (dense footer/pricing controls — size up for touch), and a page-wide `zoom:1.25` is a non-standard scaling trick (prefer rem scaling if porting).

## Extracted patterns
- `pastel-bloom-backdrop` — a fixed full-viewport soft-gradient + blurred-logo world that transparent content scrolls over; depth without shadows.
- `in-view-blur-reveal` — IntersectionObserver-gated opacity+blur reveal (and the looping placeholder/ring variants), fully reduced-motion-aware.
