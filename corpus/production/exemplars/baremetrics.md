---
slug: baremetrics
url: https://baremetrics.com
source: manual
corpus: production
surface: site
captured: 2026-08-31
award_type: null
score: null
tags: [saas, analytics, dashboard, fintech, b2b, marketing, light]
when_to_use: [landing, product-marketing, feature-section, hero, dashboard]
directions: [soft, minimalist]
layout: [split-hero, content-grid]
a11y: [alt-coverage-high, focus-visible-missing, tap-targets-risky, reduced-motion-ignored]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [slot-machine-word-rotator, accent-coded-metric-triptych]
tokens_snapshot: ../tokens/baremetrics.json
screenshots: ../screenshots/baremetrics/
---

## What works (transferable principles)
- **Ink, not black.** The entire page is drawn in a dark *indigo* (`#33334F`) against white, with body copy in a lighter desaturated indigo (`#767EAD`). Choosing a near-black that carries the brand hue makes a data-heavy marketing page feel calm and designed rather than default-Bootstrap. Transfers to any product-marketing page: pick one tinted near-black for foreground and one desaturated tint of it for secondary text, and you get a coherent neutral scale for free.
- **Scale + value contrast carry hierarchy — weight barely varies.** Headlines jump 56→40→22→16px, and secondary text is separated by *lightening the same hue* (`#33334F` → `#767EAD`/`#7171A6`) rather than by shrinking or de-bolding. Only display headings go heavy (Inter 800); everything else is a single 400 weight. The page reads as one system because the ordering device is consistent.
- **Tight negative tracking is the display signature.** The hero H1 runs Inter 800 at 56px with `-3.6px` letter-spacing (~-0.064em) and 66px leading — the letters pack into a dense, confident block. Tracking is scaled *with* size (56px→-3.6px, 40px→-0.84px, 20px→-0.28px, body→-0.014em), so the optical density stays constant across the type ramp. Reusable rule: negative-track display type, ease off toward body size.
- **A disciplined six-hue accent set used only as category coding.** Blue/purple/teal/yellow/green/pink each tag exactly one metric or feature (a small monogram/icon + label), never a background or a large fill. The cards themselves stay neutral white; color is a wayfinding index, not decoration. This lets a busy analytics page use rainbow color without looking like a toy — the hues are quiet because they're tiny and consistent.
- **Repeating a two-column section header turns a long page into a system.** Every feature block opens with the same geometry: an oversized H2 on the left (max-width ~500px), a short muted paragraph on the right (max-width ~520px), `justify-content: space-between`. The eye learns the rhythm and trusts the page. On narrow viewports both columns stack to one.
- **Soft, hue-tinted elevation.** Cards and product screenshots sit on `border-radius: 16px` with a single very-soft shadow tinted in the ink color (`rgba(51,51,79,0.06) 0 10px 40px 10px`) rather than a hard gray drop shadow — the product mockups appear to float a few millimeters off a white page. One shadow value, used everywhere.

## Design-system read
- **Type:** Inter throughout (system-sans fallback). Modular-ish scale 12·14·16·18·20·22 / 40 / 56px. Two weights do the work: 400 for all reading text, 700–800 for display. Hierarchy = **scale contrast + value contrast**, not weight. Signature move is negative letter-spacing that scales with size (-0.064em on the hero, easing to -0.014em on body).
- **Color:** Neutral base of white `#FFFFFF` + faint surface `#F7F7FC`/`#F9F9FB`; foreground ink `#33334F`; two muted tints `#767EAD`, `#7171A6`, and a faint `#B8B8D9` for hairline text. Single brand accent periwinkle `#6078FF` (all primary CTAs, links, chart lines). A secondary **category palette** — purple `#724CE9`, teal `#36BEDF`, yellow `#FFC148`, green `#12C457`, pink `#E84C85`, orange `#FF8D43` — appears only as small icon/label coding.
- **Spacing rhythm:** ~8px base. Section padding 80px vertical, stepping up to 150px on the emphasis (periwinkle) section for a deliberate breath. Generous 100px gap between a section header and its feature row. Whitespace, not rules, separates sections.
- **Layout system:** 12-col HubSpot grid expressed as `grid-template-columns: 1fr 1fr` (hero, section headers) and flex triplets for feature rows. Container maxes 1360 / 1200 / 560px. Breakpoints collapse 2→1 col around 900px; H1 56→38px on mobile. Body size holds at 16px across breakpoints.
- **Layering / page architecture:** Single flat white scroll — `has_static_backdrop: false`, `has_blend_overlay: false`, no glass/blend anywhere. The only fixed layer that matters is the pinned white header (z 99, 12% viewport height); the remaining 13 fixed elements are transparent HubSpot/CTA anchor stubs. Depth is faked entirely by soft shadows on cards, not by z-axis parallax.
- **Motion / easing intent:** Resting page is essentially still. Micro-transitions are fast and linear/ease-out (0.15s linear on links, 0.125s ease-out on card hover-lift). The two deliberate motions are the hero's autoplaying Lottie product demo and a slow (0.5s ease-in-out) vertical word rotator in the headline. Motion communicates "live product / many integrations," not spectacle.
- **Density:** High information density (dashboards, metric cards, logo walls) kept legible by whitespace and the muted-tint secondary text — dense content recedes to gray so the eye lands on the ink headline and the one periwinkle CTA.
- **Hierarchy:** Dominant ordering device is **scale**, backed by **value** (ink vs muted tint). Color accent is reserved for the single action per view.
- **Restraint:** No gradients (`craft.elevation.gradients: []`), no dark mode, no blend modes, no heavy shadows, no second display face. The rainbow accents are deliberately confined to small marks.

## Interaction & motion (techniques)
- **Slot-machine word rotator with per-word recolor** — *Trigger:* load (timed loop). *Mechanism:* the final word of the H1 lives in an `overflow: clip` slot; an inner span is stepped with `transform: translateY(...)` on a 0.5s `ease-in-out` transition, and each incoming integration name (`+ Shopify`, `+ Stripe`, …) also swaps to its own accent hue (green→muted→periwinkle observed). *Reads as:* "works with all of these," stated as a concrete set. *Transfers to:* any hero whose value prop is "many integrations/things." *Safety:* **production-safe**, but it's a perpetual animation beside a CTA and the site ships **no** `prefers-reduced-motion` rule — add one. See `patterns/slot-machine-word-rotator.md`.
- **Pinned header** — *Trigger:* scroll-progress. *Mechanism:* the nav is `position: fixed` (z 99) over a flat white page; no shrink/condense, just persistence. *Reads as:* always-available navigation. *Transfers to:* any long marketing page. *Safety:* **production-safe** (no reflow).
- **Autoplaying Lottie product demo** — *Trigger:* load. *Mechanism:* a `<dotlottie-wc>` vector animation loops a live-looking MRR chart in the hero's right column (the site lazy-loads it / defers a heavy hero asset until idle). *Reads as:* "this is a living dashboard." *Transfers to:* hero product showcases where a static screenshot undersells liveness. *Safety:* **production-safe** if lazy-loaded and reduced-motion-gated (this site does neither for reduced motion).
- **Card hover-lift** — *Trigger:* hover. *Mechanism:* feature cards carry `transition: 125ms ease-out; will-change: transform` for a small translate on hover; nav links crossfade color (muted→periwinkle) over 0.15s linear. *Reads as:* tactile, responsive. *Transfers to:* any card grid. *Safety:* **production-safe** (transform/opacity only).
- Note: AOS is loaded but the frame sequence shows **no** scroll-entrance reveals firing; `rafCalls` is high because of the Lottie player, not scroll effects. `respectsReducedMotion: false`.

## Production-safety note
- Everything here is production-safe. The one liability is accessibility, not spectacle: `focus_visible: false` (no visible focus ring on custom controls), 71 small tap targets, and **no reduced-motion rule** despite a perpetual headline loop and an autoplaying Lottie. Any adopter should add `:focus-visible` rings, enlarge tap targets to ≥44px, and gate both animations behind `prefers-reduced-motion`.

## Extracted patterns
- `slot-machine-word-rotator` — clipped vertical word slot that rolls integration names through the headline and recolors each to its brand hue; reduced-motion-aware.
- `accent-coded-metric-triptych` — three neutral product-screenshot cards under a split heading, each indexed by a small icon+label from a fixed multi-hue accent set.
