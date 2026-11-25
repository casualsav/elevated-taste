---
slug: knock
url: https://knock.app
source: manual
corpus: production
surface: site
captured: 2026-09-21
award_type: null
score: null
tags: [saas, b2b, dev-tools, infrastructure, developer-tools, light]
when_to_use: [landing, product-marketing, feature-section, dashboard, settings]
directions: [minimalist, soft]
layout: [content-grid, bento]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [blueprint-column-rules, animated-connector-diagram]
tokens_snapshot: ../tokens/knock.json
screenshots: ../screenshots/knock/
---

## What works (transferable principles)
- **Blueprint column rules do the structuring, not boxes.** Full-width sections are framed by 0.5px vertical hairlines (`#CDCED6`) dropped at the content grid's column edges, pinned at `z-100` and `pointer-events:none`. The page reads as an engineered schematic — technical, precise — while staying almost entirely whitespace. Transfers to any dev-tool / infra marketing site that wants "rigor" without heavy borders or filled cards.
- **Show the real product at full fidelity, rendered as living diagrams — not an abstract hero mockup.** Every section drops in dense, true-to-life product surfaces (a workflow builder, a preference center with real toggles, a data-pipeline node graph, a code editor) and *animates them as they'd behave in use*. Density signals capability; the calm neutral palette keeps it legible. This is the opposite of the generic "faux dashboard screenshot" — the mockups are the argument.
- **Single-hue accent economy.** One coral (`#FF6C52`, hover `#E33A1E`) is spent *only* on the primary CTA and interactive hover states; a single green (`#00AA72`) means "live / success". Everything else is neutral grayscale. Because the accent appears nowhere decorative, its presence always means "act" — the strongest, cheapest hierarchy device on the page.
- **Scale-contrast hierarchy inside one family.** Inter carries nearly everything; the h1 is ~56px/62px against 16px/24px body — a ~3.5× jump — with weight capped at 500–600. Hierarchy comes from *size and neutral tracking* (tighter as type grows: −0.16px at 24px), not bold. The page stays quiet even at high component density.
- **Keyboard-hint affordances as product personality.** Buttons carry inline key-cap badges (`Get started S`, `Book a demo D`, `Log in L`) — a tiny detail that says "built for developers who live on the keyboard" without a word of copy. A reusable way to inject product character into otherwise-plain CTAs.
- **Near-white surface stepping + micro-elevation instead of hard edges.** Cards separate from ground with `#F9F9FB` vs `#FFFFFF` plus layered, very-low-alpha shadows (`rgba(28,32,36,0.08) 0 14px 30px` stacked with 0.01 layers). The result is a "settings-panel calm" — depth you feel before you see it.

## Design-system read
- **Type:** Inter for UI/marketing, Inconsolata for code (ppNeueMontreal / openSauce are loaded but Inter dominates 231:32). Modular-ish scale 10→11→12→13→14→15→16→18→20→24→28→30 … 48 → 56 (h1). Body 16/24; h1 56/62 desktop, 34 mobile (fluid). Weights 400 / 500 / 600 only. Tracking ramps negative with size (−0.225px at 30px) and slightly positive for small uppercase labels (0.42px at 15px). Hierarchy = scale + tracking, never heavy weight.
- **Color:** ground `#FFFFFF`; stepped surface `#F9F9FB`; ink `#1C2024` / near-black `#222`; muted `#60646C`; subtle `#888E95`; hairlines `#CDCED6` and lighter `#E0E1E6`. Accent coral `#FF6C52` (hover `#E33A1E`, plus `#FF573A`). One semantic green `#00AA72` / deep `#00834F` on mint `#D3F1E0`. Dark chips/cards use near-black `#1C2024` as an inversion accent, not a theme.
- **Spacing rhythm:** 4px base; observed 4 / 6 / 8 / 10 / 12 / 16 / 24 / 32 / 48 / 80 / 144. Gap of 10px is the workhorse for component internals; section rhythm jumps to 80–144px. Generous vertical air between dense components is what keeps the density readable.
- **Layout system:** a 12-column content grid inside 1216–1440px containers (640px for prose), with the column edges *exposed* as vertical rules. 187 grids / 519 flex; 85 aspect-ratio locks keep the product mockups crisp. Centered hero (center-stack) then alternating ruled feature bands. Breakpoints 512/650/768/1024/1100/1200/1280/1920; mobile collapses to a single column with a hamburger.
- **Layering / page architecture:** essentially a single flat light scroll (`has_static_backdrop:false`, `has_blend_overlay:false`) — depth is not from a fixed backdrop but from (1) the `z-100` vertical column rules that sit above content as a blueprint overlay, (2) a translucent sticky header (`rgba(255,255,255,0.8)→0.95`, 0.5px bottom rule appearing on scroll), and (3) a fixed bottom-left utility layer (cookie notice + CTA chip). No parallax.
- **Motion / easing intent:** house easing `cubic-bezier(0.4,0,0.2,1)` (standard) with `(0,0,0.2,1)` for entrances and `(0.4,0,1,1)` for exits; durations 150 / 200 / 300 / 400 / 700 / 1000ms. Motion communicates *the product working* — connectors dash, cells split, badges trace — never spectacle. Reduced motion is respected.
- **Density:** high per-component (real settings UIs), low per-page (lots of whitespace, one idea per band). The tension is resolved by neutral color + scale contrast.
- **Hierarchy:** dominant ordering device is **scale**, backed by the lone coral accent for the single action per band.
- **Restraint:** no gradients-as-hero, no glass, no parallax, no oversized vague headline over a fake dashboard. The "hero image" is literally the product doing its job.

## Interaction & motion (techniques)
- **Self-animating schematic diagrams** — *Trigger:* load + in-view (looping). *Mechanism:* CSS `@keyframes` drive product-demo micro-diagrams — `dashToRight/Left/Bottom/Top` animate the dash-offset of connector lines so data appears to *flow* through a workflow; `workflowCellBorderSplit` and `branchBadgeBorderTrace` trace borders as a node activates; `dotPulse` / `ping` mark live endpoints; 16 `<canvas>` + 146 inline SVG carry the heavier renders. *Reads as:* "the platform is alive and moving messages right now." *Transfers to:* any infra/automation product wanting to show a pipeline in motion instead of a static diagram. *Safety:* **production-safe** (transform/opacity/stroke-dashoffset only), but 16 canvases is a real GPU/main-thread cost — gate off-screen instances with IO and honor reduced-motion. See `patterns/animated-connector-diagram.md`.
- **In-view reveal gated by IntersectionObserver** — *Trigger:* in-view. *Mechanism:* 32 observers over 335 targets, `rootMargin` ~50px, thresholds 0/0.1/0.3 — components fade/rise once just before entering; the hero canvas fades `0→1` at ~500ms on load. *Reads as:* the page assembling itself as you descend. *Transfers to:* any long marketing page. *Safety:* **production-safe**; IO + CSS transition, no scroll handler on the hot path.
- **Translucent condensing sticky header** — *Trigger:* scroll-progress. *Mechanism:* background alpha shifts `0.8→0.95` and a 0.5px bottom hairline fades in once scrolled off the top; nav links recolor to coral on hover. *Reads as:* chrome that firms up only when it overlaps content. *Transfers to:* any sticky nav on a light page. *Safety:* **production-safe**.
- **Scroll-scaled dot-grid backdrop** — *Trigger:* scroll-progress. *Mechanism:* a radial-masked dot grid (`span.absolute`) scales `1.78→1.28` while opacity eases `0.17→0.54` as the hero scrolls. *Reads as:* a subtle depth breath behind the headline. *Transfers to:* hero backdrops that need life without a video. *Safety:* **production-safe** (transform + opacity).
- **Micro hover states** — nav links → coral, filled CTAs darken `#FF6C52→#E33A1E`, ghost tabs pick up a `#EFF0F3` fill. Fast (150–200ms), functional, no flourish.

## Production-safety note
- Everything here is production-safe. The only cost to watch is the **canvas count** (16) powering the animated demos — lazy-mount and pause off-screen instances, and the reduced-motion path should freeze diagrams at a legible resting frame (respected here via a single `prefers-reduced-motion` rule). 56 sub-44px tap targets flagged — the dense product chrome is decorative on marketing, but re-check hit areas if any are truly interactive on touch.

## Extracted patterns
- `blueprint-column-rules` — expose a section's grid columns as thin vertical hairlines to give an engineered, schematic structure with almost no visual weight.
- `animated-connector-diagram` — self-looping dashed connector lines that make a static node/pipeline diagram appear to move data, with a reduced-motion resting state.
