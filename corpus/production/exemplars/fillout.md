---
slug: fillout
url: https://www.fillout.com
source: manual
corpus: production
surface: site
captured: 2026-08-24
award_type: null
score: null
tags: [saas, b2b, forms, product-marketing, ai, light]
when_to_use: [landing, product-marketing, feature-section, hero, forms, navigation]
directions: [soft, minimalist]
layout: [center-stack, bento]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [hairline-banded-sections, tilt-in-card-reveal]
tokens_snapshot: ../tokens/fillout.json
screenshots: ../screenshots/fillout/
---

## What works (transferable principles)
- **A near-monochrome neutral scale does 95% of the work; one warm accent is rationed to conversion.** Text and chrome live on a tight gray ramp (`#171717 → #333 → #737373 → #ebebeb → #fbfbfb → #fff`); a single tangerine (`#f9b31e`) appears only on the primary "Get started" CTA, rating stars, and the in-mock "Purchase" button. Because the accent is spent nowhere else, the eye finds the action instantly and the page reads as calm and trustworthy — the right register for a *data-intake* product. Transfers to any B2B tool that must look credible over exciting.
- **Every feature claim is proven by a cropped slice of the real product, not an icon.** Each card pairs a two-line text block (bold title + one muted line) with a believable fragment of the actual UI — a drag-and-drop canvas, an automation flow with "Branch/Send email" nodes, a themed form preview. "We have automations" becomes "here is the automation graph." Transfers to any product-marketing page: show the artifact, don't illustrate the concept.
- **Hierarchy comes from scale + ink-opacity in one weight family, not from bold-vs-regular.** Headings and body separate by a 4× scale jump (16px body → 68px hero) and by ink level (gray-900 heading over gray-500 support), while weight stays in the 400–600 band. The result stays quiet at high card density. Reusable in any dense product UI.
- **A long page is paced by full-bleed tonal bands seamed with a single hairline.** Sections alternate white / off-white (`#fff` ↔ `#fbfbfb`) and are divided only by a 1px `border-top`, giving macro-rhythm with zero decorative dividers — the whitespace and the tonal flip do the separating. See `hairline-banded-sections`.
- **Each section opens with the same centered "icon-kicker → display heading → sub-line" unit.** A tiny glyph+label ("✦ Features", "❤ Wall of Love") sits above a `blMelody` display heading and one muted line, all centered. Repeating one header signature makes six different sections feel like one system. Transfers to any multi-section landing page.
- **A display face is reserved for section headings only; body and hero run on Inter.** `blMelody` (a geometric display sans) is scoped to the H2s at 32–40px; Inter carries the hero H1 and all body. One typographic "special move," used consistently, reads as intentional rather than busy.

## Design-system read
- **Type:** Two families with strict roles — **Inter** (hero H1 + all body/UI) and **blMelody** (section H2s only). Scale is modular-ish, ~1.25–1.3 steps at the top: body 16px/1.5 → 20 → 22 → 32 → 40 → 52 → 68px, hero at `leading-none` (1.0). Weights 400/450/500/600 (700 rare). Slight negative tracking (`-0.16px`) on headings. Fluid steps come from breakpoint swaps (40→52→68), not `clamp()`.
- **Color:** Neutral-dominant. Grays: ink `#171717`/`#333`, muted `#737373`/`#a3a3a3`, hairline `#ebebeb`, surface `#fbfbfb`, bg `#fff`. Single brand accent tangerine `#f9b31e` (hover `#f3940d`). Product mocks introduce their own semantics — payments green `#22c55e`, link blue `#2f72e2`, purple/blue chart hues — but the page frame stays neutral. Primary buttons are **dark** (`#333`), not tangerine; tangerine is the *conversion* accent.
- **Spacing rhythm:** 4px base (`--spacing: .25rem`); dominant steps 4/8/12/16/24, section padding 28–32 (7–8rem top). Card interiors on a 16px pad. Container maxes at **1240px** (with 625px measure for centered copy).
- **Layout system:** Centered column of full-bleed bands; feature bays are 2-up card grids (quad on desktop, stacking to 1–2 on mobile). Breakpoints ~767/1023/1279. `display:flex` everywhere (384 nodes); grid is barely used — this is a flex-and-gap layout.
- **Layering / page architecture:** Essentially a **single flat light scroll** — no static backdrop, no blend layers. Depth is carried by *soft multi-stop shadows + 1px rings* on floating cards (`shadow-marketing-*`), not by a z-axis story. Two `fixed` layers only: a floating **pill nav** (top-13px, `backdrop-blur(8px)`, soft ring shadow) and a `pointer-events-none` **bottom CTA** layer. The hero's illustrated sky is in-flow, not fixed.
- **Motion / easing intent:** House timing is `.15s`/`.3s`/`.4s` on `cubic-bezier(.4,0,.2,1)`. Motion is almost entirely *hover feedback* (nav-item fill, button darken+lift) plus slow auto-marquees and gentle in-view reveals — it confirms interactivity and adds life, never narrates. `prefers-reduced-motion` is respected (2 PRM rules).
- **Density:** High card count kept legible by generous inter-section whitespace, one-line supporting copy, and the muted/ink split.
- **Hierarchy:** Scale first, ink-opacity second, color (tangerine) only for the single CTA.
- **Restraint:** No gradients on the frame, no glassmorphism beyond the one nav blur, no multi-color buttons, no bold-weight shouting, no parallax theater. The "special" is confined to the illustrated sky hero and the display heading font.

## Interaction & motion
- **Floating blur pill-nav** — *Trigger:* load (fixed). *Mechanism:* a detached rounded nav bar pinned at `top:13px` with `backdrop-filter: blur(8px)` over `bg-white/50` and a soft `shadow-marketing-fillout` ring; nav items fill with a translucent white on hover. *Reads as:* a light, premium chrome that floats over content. *Transfers to:* any marketing header. *Safety:* **production-safe** (one cheap blur layer). See `floating-pill-nav`.
- **Dual-direction logo/chip marquees** — *Trigger:* load (CSS `@keyframes scroll`, ~70–150s). *Mechanism:* duplicated tracks translate horizontally; the integrations section runs two rows in opposite directions. *Reads as:* "works with everything," ambient motion. *Transfers to:* trust/logo/integration strips. *Safety:* **production-safe** (transform-only; pausing on hover recommended). See existing `duplicated-track-marquee`.
- **Tilt-in card reveal** — *Trigger:* in-view (IntersectionObserver, `rootMargin:200px`, 158 targets). *Mechanism:* a product card enters slightly rotated (~12–13°) and faded and settles to flat+opaque as it scrolls into view (seen on the branding "Theme" panel). *Reads as:* a physical card being laid down. *Transfers to:* any hero/feature mock reveal. *Safety:* **production-safe** (opacity+transform only; jumps to rest under reduced-motion). See `tilt-in-card-reveal`.
- **Shine-border travel on the hero composer** — *Trigger:* load. *Mechanism:* an animated gradient traces the rounded border of the AI "Describe the form…" input (`@keyframes shine-border-travel`) to mark it as the primary CTA. *Reads as:* "type here, it's live." *Transfers to:* AI input CTAs. *Safety:* **production-safe**; covered by `rotating-gradient-cta-border`.
- **Button darken + shadow lift on hover** — *Trigger:* hover. *Mechanism:* primary buttons shift `#333→#42` and gain a second soft shadow stop; secondary buttons gain a ring + subtle fill. *Reads as:* tactile affordance. *Safety:* **production-safe.**

## Production-safety note
Every technique here is production-safe: transform/opacity/blur only, respects reduced motion, no scroll-jacking. The only watch-item is the marquee (keep it `transform`-driven and pause on hover) and tap-target sizing — the probe flags 65 small targets in the dense nav/footer, so enforce ≥44px hit areas when porting.

## Extracted patterns
- `hairline-banded-sections` — full-bleed alternating white/off-white sections seamed by a single 1px hairline, each led by a centered icon-kicker + display heading; the calm skeleton of a long marketing page.
- `tilt-in-card-reveal` — in-view rotate+rise settle for a product mock, IntersectionObserver-gated and reduced-motion-safe.
