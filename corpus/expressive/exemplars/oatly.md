---
slug: oatly
url: https://www.oatly.com
source: manual-pick
corpus: expressive
surface: site
captured: 2026-06-30
award_type: Manual (ecommerce/maximalist)
score: null
tags: [ecommerce, dtc, food, brand, maximalist, editorial, handwritten, brutalist, mono, zine]
when_to_use: [brand-experience, landing, ecommerce, editorial, product-marketing, navigation]
directions: [brutalist, editorial, expressive]
layout: [bento]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high]
provenance:
  gallery_url: https://www.oatly.com
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [brutalist-sticker-grid, route-cover-transition]
tokens_snapshot: ../tokens/oatly.json
screenshots: ../screenshots/oatly/
---

## What works (transferable principles)
- **The page IS the grid — hairline black borders are the layout.** Every tile, label bar, and module is drawn with the same 1px near-black stroke (`#222`), so structure is *visible* rather than implied by whitespace. The page reads like a zine spread or a contact sheet. Transfers to any brand/editorial surface that wants density to feel intentional instead of busy: let one consistent border weight do the dividing and you can pack many modules without a soft-gradient bailout.
- **Hard offset shadow, zero blur (`2px 2px 0 #000`).** Cards and buttons sit on a flat, ink-stamped drop shadow — a "sticker on paper" depth cue that costs nothing and never muddies. It's the anti-thesis of the generic soft `0 10px 40px rgba()` glow. Transfers anywhere you want playful, physical, print-derived elevation; it photographs and scales crisply because there's no blur to soften at large sizes.
- **One typewriter family carries everything.** A single quirky monospace-flavored face (Margo Pro) runs body, UPPERCASE mono labels, and bold display. Hierarchy comes from *case + weight + scale* (regular sentence body → ALL-CAPS tracked nav/label → 900-weight hand-drawn display), not from pairing two or three typefaces. Transfers to brand systems that want a strong, ownable voice from one license: vary case and weight aggressively before you reach for a second family.
- **Flat candy color as content, not chrome.** Pink, purple, amber, sky-blue and forest-green appear as full-bleed tile fills behind headlines — each module a different swatch — over a white/cream page. Color blocks the grid into rhythm; there are no gradients at all. Transfers to catalog/landing layouts: assign each section a flat swatch from a fixed playful palette and the variety reads as a system, not as chaos.
- **Editorial irreverence as the product.** Copy ("We know you didn't come here for cookies", "F.A.Q-ING AMAZING", "PEE FOR THE PLANET") and hand-lettered headlines do the persuading; imagery is incidental. Transfers to any DTC/brand site whose moat is voice — lead with the writing and a strong type system, not with a hero photo + three feature cards.
- **Maximalism that stays accessible.** Despite the loud surface, the build keeps `img_alt_ratio: 1`, visible focus rings (blue glow + black outline), and `prefers-reduced-motion` respected. Transfers as proof that brutalist/zine energy and WCAG hygiene are not in tension.

## Design-system read
- **Type:** one family (Margo Pro, typewriter/mono-flavored sans). Fluid scale ~13.5 → 32px on desktop (h1 32/41.6, body 16/20.8), compressing to 28/14 on mobile — a modest ~2.4× body-to-display range; the display *feel* comes from hand-drawn lettered art, not from extreme point size. Weights 400 / 700 / 900. Hierarchy device = **case + weight**, then scale.
- **Color:** near-black ink (`#222`) on white/cream (`#fff` / `#fffef6`); light-gray surfaces (`#f6f6f6`). Accent system is a flat candy palette used as tile fills: amber `#fdcf85`, pink `#f8c8d8`, light-pink `#fbcccc`, purple `#a67eb1`, sky `#98c5d3`, forest `#2c622c`. No gradients anywhere. Borders are always the ink color.
- **Spacing rhythm:** 4px base; common steps 4 / 8 / 16 / 24 / 40 / 44. Tight, even gaps (8/4/16) pack the grid; generous inline page padding (40–44px) frames it.
- **Layout system:** a true CSS grid (observed 13-/4-/2-/1-col tracks) of bordered tiles, collapsing to 4/2/1 on mobile; container max ~1365–1399px. Modules are uniform-bordered cells with a mono caption bar pinned to the bottom edge.
- **Motion / easing intent:** minimal and utilitarian — `0.3s ease` / `0.4s ease-in-out`. Motion is reserved for route changes and micro-feedback, not scroll spectacle (see below).
- **Density:** high module count, kept legible by the single border weight + consistent caption bars + flat color separation. Nothing floats; everything is in a cell.
- **Hierarchy:** dominant ordering device is **position-in-grid + color block**; within a tile it's case/weight.
- **Restraint:** no gradients, no blur shadows, no parallax, no carousels, no second typeface, no rounded corners (except pill buttons). The loudness is entirely in color, copy, and hand-lettering — the *structure* is rigorously plain.

## Interaction & motion (evidence-backed)
The site is **largely static** — the probe found 0 entrance reveals and 0 scroll-progress transforms; the only "pins" are the cookie banner and accessibility skip-links (chrome, not choreography). Notable behavior is concentrated at route boundaries and micro-feedback:
- **Route cover-transition** — *Trigger:* navigation (click). *Mechanism:* a full-screen color panel fills the viewport, then shrinks/reveals the next page (keyframes `PageTransition_fillScreen`, `_shrink`, `_darken`). *Reads as:* a deliberate page "turn", reinforcing the zine/print metaphor. *Transfers to:* multi-page brand sites wanting continuity between routes. *Safety:* **spectacle-only** — adds perceived latency and a full-viewport repaint; gate behind reduced-motion and keep under ~400ms. See `patterns/route-cover-transition.md`.
- **Header slide-in** — *Trigger:* load. *Mechanism:* the page header drops in with a jagged/squiggle edge mask (keyframes `PageHeader-module_slide-in-from-top-squiggle` / `-jagged`). *Reads as:* hand-cut paper. *Transfers to:* announcement bars / page headers. *Safety:* **production-safe** (transform/opacity, one-shot).
- **Counter & bar-chart bounce** — *Trigger:* in-view (IntersectionObserver, `rootMargin: 200px`). *Mechanism:* number counters and bars settle with a bounce (`Counter-module_maxed-value`, `BarChart-module_barBounce`, `ci-bounce`). *Reads as:* playful data emphasis. *Transfers to:* impact/stat sections. *Safety:* **production-safe** if `transform`-only and reduced-motion jumps to end state.
- **Disclosure / accordion** (13 instances) — *Trigger:* click. FAQ-style expand/collapse; the core content pattern, not decoration. *Safety:* **production-safe**.
- **Button hover** — color + border crossfade only (no movement); `0.3s ease`. **production-safe**.

Reduced motion is **respected** (3 `prefers-reduced-motion` rules present).

## Production-safety note
- The visual system (bordered sticker grid, hard offset shadow, flat color, mono type) is entirely **production-safe** and the most reusable part of this exemplar.
- The **route cover-transition** is **spectacle-only**: it injects a full-viewport repaint and perceived nav latency; always provide the reduced-motion / instant-swap fallback.

## Extracted patterns
- `brutalist-sticker-grid` — modular grid of hairline-bordered tiles with a hard offset shadow and a mono caption bar; the signature static layout.
- `route-cover-transition` — a full-screen color panel that covers then reveals on navigation; spectacle-only, reduced-motion-aware.
