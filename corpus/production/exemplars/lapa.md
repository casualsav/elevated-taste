---
slug: lapa
url: https://www.foundation-labs.xyz
source: lapa
corpus: production
captured: 2026-06-29
award_type: Gallery
score: null
tags: [agency, portfolio, brand, web3, nft, creative, brutalist, monospace, type-driven, acid]
when_to_use: [brand-experience, portfolio, agency, hero, navigation, footer, landing, interactive-showcase]
directions: [brutalist, expressive]
layout: [content-grid]
provenance:
  gallery_url: https://www.lapa.ninja/
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [mono-bracket-section-labels, ascii-halftone-canvas-footer]
tokens_snapshot: ../tokens/lapa.json
screenshots: ../screenshots/lapa/
---

## What works
- **Two-color brand field as the entire canvas.** One acid green (`#00FF11`) full-bleed, pure-black ink, *zero* gradients and *zero* shadows. The palette is maximally loud but minimally broad — confidence comes from refusing a third color, not from adding effects. The only chroma variety lives inside the product cards, so attention lands on the products. Transfers to any brand wanting high recall on a budget of two values: pick one saturated field + one ink, and let layout (not color count) do the work.
- **Hierarchy from scale + field, not weight.** A single grotesque (Suisse Intl) runs almost entirely at weight 400; the jump from body (16px) to display (72→208px) is 4.5–13×. Whitespace and the loud monochrome field do the separating, so a visually *aggressive* page still reads as calm and structured. The transferable rule: when you have one strong typeface and a strong ground, buy hierarchy with size, not with bold/semibold steps.
- **Monospace bracket labels as a wayfinding voice.** Section kickers are set in a mono companion face inside literal brackets — `[ NAV ]`, `[ ABOUT ]`, `[ OUR APPS ]`, `[ EXPERIMENTS ]`. Cheap structural signposting that needs no heavy heading, and the mono/round contrast against the display grotesque sets a "technical document / engineering log" register. Reusable anywhere you want an editorial or dev-tool voice without extra type sizes. See `mono-bracket-section-labels`.
- **Optical tracking that tightens with size.** Negative letter-spacing scales with the font: roughly −0.4px@16, −3.6px@72, −12.48px@208 (≈ −0.025em → −0.06em). Huge type set at body tracking looks gappy and loose; tightening proportionally keeps the giant wordmark dense and deliberate. A portable display-type rule, independent of this site.
- **Product-screenshot cards as the only imagery.** Each app is a full-bleed device shot / UI capture on a card whose background matches that product's brand (`#242424` dark, `#FFFFFF` white, `#E44CE7` magenta), followed by a mono meta row: monogram + name + year `( 2021 )` + one-line description. A clean, repeatable "app / work index" module — the colored card carries product identity while the page stays two-color.
- **Spectacle quarantined to the footer.** The signature move — the wordmark dissolving into a generative ASCII/halftone dither field — is parked at the very bottom, after the content. The brand flourish costs nothing functional because nothing the user needs sits inside it. A good model for "earn the gimmick": put the expensive, showy effect where failure is harmless. See `ascii-halftone-canvas-footer`.

## Design-system read
- **Type:** Two-family system — Suisse Intl (grotesque, display + body) and Suisse Intl Mono (labels). Scale (px): 14 / 16 / 20 / 24 / 60 / 72 / 208, fluid at the top. Body 16/24 (1.5 leading); display ~1.0 leading (72/72). Hierarchy is *scale-driven*, weight is near-constant (400, occasional 500). Tracking tightens optically as size grows.
- **Color:** Two-value brand field — `bg #00FF11` (acid green), `fg #000000`/`#101010` (ink). Secondary text is ink at 60% (`rgba(0,0,0,.6)`). No semantic palette, no gradients. Card surfaces are the only deviation and are chosen per-product: dark `#242424`, white `#FFFFFF`, magenta `#E44CE7`.
- **Spacing rhythm:** 8px base. Observed steps 8 / 12 / 16 / 24 / 32 / 36 / 40 / 64, with a large 256px block opening up vertical air around the footer. Section gutters ~36px inline. Generous vertical rhythm keeps the loud field breathing.
- **Layout system:** ~1170px container; 2-column grid for the app/experiment cards collapsing to 1 column on mobile. Top-left logo glyph, top-right stacked nav. Left-aligned throughout. Low information density, lots of ground showing.
- **Motion / easing intent:** One transition token — `0.2s cubic-bezier(0.4,0,0.2,1)` — for link/card hover only. Everything else is resting-state static; the single moving system is the footer canvas (+ a custom cursor). Motion communicates "craft toy in the basement," not "guided narrative."
- **Density:** Deliberately sparse. Large empty green expanses between the logo, the about line, and the card rows; the page reads as a poster, not a dashboard.
- **Hierarchy:** Dominant device is **scale** (giant display vs mono micro-labels), reinforced by **position** (consistent left edge) and the figure/ground contrast of black on acid green.
- **Restraint:** No shadows, no gradients, no glassmorphism, no scroll choreography, no entrance animations. Nav stays five short text links with no hamburger even on mobile. Imagery is limited to product shots and one geometric logo glyph.

## Interaction & motion
The page is **almost entirely static** — the probe found 0 scroll effects, 0 entrance reveals, 0 hover reveals, 0 `@keyframes`. The 3 IntersectionObservers show no in-view style deltas across frames and are almost certainly image lazy-loading, not animation. Two real behaviors plus hover micro-states:

- **ASCII / halftone canvas footer** — *Trigger:* load (continuous rAF), likely cursor-reactive. *Mechanism:* a `<canvas>` (1 present, ~725 rAF calls observed) renders the "foundation labs, inc." wordmark as a field of dithered glyphs (▲ ○ □ + · ASCII characters) whose density forms a halftone gradient; it animates / responds to pointer position (40 mousemove listeners). *Reads as:* a generative, hand-built brand toy — a closing signature. *Transfers to:* footers, 404s, brand/hero moments wanting a generative texture. *Safety:* **spectacle-only** — continuous rAF holds the main thread; harmless here only because it sits below the fold after all content. See `ascii-halftone-canvas-footer`.
- **Custom cursor follower** — *Trigger:* mousemove. *Mechanism:* a `pointer-events-none`, `z-50` element tracked to the pointer via rAF (the `transform: matrix(...)` → `none` cursor entry in the profile). *Reads as:* bespoke, designed-not-defaulted. *Transfers to:* brand/agency sites. *Safety:* **spectacle-only** — replacing the native cursor can weaken affordance and hit-target legibility; gate it to fine pointers and reduced-motion.
- **Hover micro-transitions** — *Trigger:* hover. *Mechanism:* `0.2s cubic-bezier(0.4,0,0.2,1)` color/opacity transitions on nav links and cards. *Reads as:* responsive, crisp. *Transfers to:* anywhere. *Safety:* **production-safe** (color/opacity only, no layout).

**Reduced motion is NOT respected** (`prefers-reduced-motion` has no rules). Any reuse of the canvas or cursor follower must add the fallback the patterns below include.

## Production-safety note
- The two-color field, scale-driven hierarchy, mono bracket labels, optical tracking, and product-card index are all **production-safe** and the genuinely portable takeaways.
- The ASCII canvas and custom cursor are **spectacle-only** (main-thread rAF; cursor can hurt affordance) and ship here without a reduced-motion guard — a defect to fix on reuse.

## Extracted patterns
- `mono-bracket-section-labels` — monospace kicker labels in brackets as a lightweight wayfinding + voice device; pairs a mono companion face against a display grotesque.
- `ascii-halftone-canvas-footer` — a canvas dither/halftone field that renders a wordmark or gradient from ASCII glyphs; reduced-motion- and pointer-aware drop-in for footers and brand moments.
