---
slug: varda
url: https://www.varda.com
source: manual-pick
corpus: expressive
captured: 2026-06-30
award_type: Manual (techno-feudal genre)
score: null
tags: [aerospace, space, hardware, deeptech, b2b, dark, editorial, duotone, blueprint, two-color]
when_to_use: [brand-experience, hero, landing, feature-section, navigation, footer]
directions: [editorial, brutalist, expressive]
layout: [bento, full-bleed]
a11y: [reduced-motion-ignored, focus-visible, alt-coverage-high]
provenance:
  gallery_url: https://www.varda.com
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [duotone-brand-imagery, labeled-color-block-mosaic]
tokens_snapshot: ../tokens/varda.json
screenshots: ../screenshots/varda/
---

## What works (transferable principles)
- **A two-color system, enforced everywhere.** The entire site is built from deep navy (#0A3065) and orange (#E6813B) plus a near-white and a light grey — and *every* photograph is recolored into that pair (satellite terrain, reentry footage, a capsule on a lakebed, a factory floor all render as navy/orange duotones). The mechanism: cohesion comes from *constraining the palette and pushing imagery through it*, not from matching art direction shot-to-shot. Transfers to any brand that must unify heterogeneous photography (press photos, stock, screenshots) into one identity. See `duotone-brand-imagery`.
- **The grid is drawn, not just implied.** Thin hairline + dotted lines are rendered *on top of* the hero as a literal blueprint/schematic overlay. It signals engineering precision and turns empty space into intentional structure. The effect is cheap (a `repeating-linear-gradient` or 1px inset box-shadows) and reads as deliberate rather than decorative. Transfers to deeptech/hardware/scientific brands wanting an "instrument panel" feel.
- **Hierarchy from scale + color-block, not weight.** Display headline runs ~107px with aggressive negative tracking (−3px) against 17px body — a ~6× jump — all in a *single* sans at weights 400/500. Emphasis is then reinforced by full-bleed color panels (a navy headline on orange, an orange headline on navy), so the page never needs bold or a second typeface to establish rank. Transfers anywhere you want a calm, systematic voice at high density.
- **Modular tile mosaic as the whole page body.** Below the hero, content is a grid of full-bleed colored tiles that alternate navy / orange / white / duotone-photo. Each tile is one idea. Color-blocking creates the rhythm and the section breaks simultaneously — no dividers, no cards-on-a-background, no shadows. Transfers to feature sections, link hubs, and "explore our verticals" indexes. See `labeled-color-block-mosaic`.
- **One repeated affordance: eyebrow label + corner arrow.** Every tile carries a small-caps eyebrow top-left ("Mission", "Government", "Careers") and a ↗ arrow top-right. The pair becomes a learned "this is a labeled destination, click to go" convention, so the grid is self-navigating without buttons. Cheap, scalable, accessible (the whole tile is the link).
- **Restraint as the aesthetic.** No rounded corners (radius ≈ 0 except tiny icon chips), no gradients, no drop shadows — the only "shadows" are 1px inset hairlines that *are* the grid lines. The discipline is the brand: it reads as exacting hardware engineering rather than soft SaaS.

## Design-system read
- **Type:** single family — MT Everyday Sans (a geometric-humanist grotesque), Arial fallback. Fluid scale roughly 17 → 22 → 24 → 35 → 42 → 55 → 107px; ratio steepens at the top (display is its own register). Hierarchy is **scale + color**, never weight (400 body, 500 labels, 700 rare). Large sizes carry tight negative tracking (−1 to −3px) to keep the display tight and architectural.
- **Color:** strict two-color brand — navy `#0A3065` (primary bg/ink) + orange `#E6813B` (accent/headline-on-dark). Neutrals: `#FAFCFF` near-white, `#EAECEE` light surface, `#CFD4D9` / `#90A7C7` muted blue-greys for secondary text, `#496792` for hairline grid lines. Roles invert per tile: on navy the headline is orange; on orange the ink is navy; photos are duotoned into the same two hues.
- **Spacing rhythm:** base unit ≈ 21px (recurring container padding / gutter), with finer steps ~8 / 10px for label rows. Whitespace inside tiles is generous; tiles themselves butt edge-to-edge with no gap, so negative space lives *inside* the modules.
- **Layout system:** 6-column desktop grid collapsing to 2 on mobile; container max ~1120/880px. The page is a mosaic of full-bleed rectangular panels of varying col/row span. Strong left-alignment; labels pinned to tile corners.
- **Motion / easing intent:** minimal and functional. One easing — `cubic-bezier(0.165, 0.84, 0.44, 1)` (easeOutQuart) — at 300/500ms drives hover color crossfades and a sticky-nav transition. Motion communicates *responsiveness*, not spectacle.
- **Density:** high information density made legible by the tile system — each module is visually quarantined by its own color field, so the eye parses one block at a time.
- **Hierarchy:** dominant ordering device is **scale**, backed by **color-block contrast**.
- **Restraint:** no rounded corners, no gradients, no drop shadows, no second typeface, no third hue.

## Interaction & motion (largely static; functional micro-motion only)
The homepage is essentially static — `usesIntersectionObserver: false`, `entranceReveals: 0`, no carousels/canvas in view. Stack is Webflow IX2 + GSAP + Swiper, but most bundled `@keyframes` (`marquee-scroll-*`, `spin`, `tabsFadeIn`, `autoplayProgress`) are library boilerplate not exercised on this page. Evidence supports three modest techniques:
- **Sticky nav with content-swap + wordmark fade.** *Trigger:* scroll-progress / in-view (logo link + Menu pin `fixed`; `svg.nav-logo_wordmark` opacity 1→0). *Mechanism:* as the hero scrolls away the wordmark fades to just the brandmark and the nav's top-row items give way to the section anchors (Government / Biopharma) that scroll up into the bar. *Reads as:* the chrome compacting to stay out of the way. *Transfers to:* any header that should shed labels on scroll. *Safety:* **production-safe** (opacity/position only).
- **Hover color-inversion on tiles & nav.** *Trigger:* hover. *Mechanism:* background, text, and border crossfade together (e.g. transparent nav item → light fill with navy ink; a navy tile lightens to `#194480`) over 300/500ms on the single easeOutQuart curve. *Reads as:* every labeled rectangle is a button. *Transfers to:* link grids, nav bars. *Safety:* **production-safe**.
- **Inline duotone video tile.** *Trigger:* load/tap (a play affordance over a duotoned reentry clip). *Mechanism:* media held inside the same two-color treatment as stills so it doesn't break the system. *Reads as:* "the system is alive." *Safety:* **production-safe**; gate autoplay and provide controls.

**Reduced motion:** `prefers-reduced-motion` is **not respected** (`prmRules: 0`) — a gap to fix in any reuse. The effects are all opacity/color, so a single `@media (prefers-reduced-motion: reduce)` block that snaps transitions to `none` makes it safe.

## Production-safety note
Everything here is production-safe: the palette discipline, drawn grid, tile mosaic, and color-inversion hovers are cheap and accessible (whole-tile links, visible focus outlines, 100% alt-text in the probe). Two cautions for reuse: (1) add the missing reduced-motion fallback; (2) duotone treatment can crush contrast — keep eyebrow/secondary text on the high-contrast member of the pair and verify WCAG against the duotoned photo, not the flat brand color.

## Extracted patterns
- `duotone-brand-imagery` — push all photography through a fixed two-color duotone so mixed sources read as one brand. Reuse for heterogeneous imagery on a tightly-branded site.
- `labeled-color-block-mosaic` — edge-to-edge grid of full-bleed colored tiles, each an eyebrow-labeled, corner-arrowed destination with inverting hover. Reuse for feature sections and vertical/link indexes.
