---
slug: cashapp
url: https://cash.app
source: manual-pick
corpus: production
surface: site
captured: 2026-06-30
award_type: Manual (fintech/consumer)
score: null
tags: [fintech, consumer, payments, b2c, bold, brutalist, dark]
when_to_use: [landing, product-marketing, hero, brand-experience]
directions: [brutalist, minimalist]
layout: [split-hero]
a11y: [reduced-motion-ignored]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [sticky-device-demo-scrollytelling, centered-device-flanked-hero]
tokens_snapshot: ../tokens/cashapp.json
screenshots: ../screenshots/cashapp/
---

## What works
- **One saturated brand color as the ground, not the accent.** The hero is a full-bleed field of signature green (#00E013) with black type on it; the same green becomes the primary CTA fill further down. Because the brand hue carries an entire surface instead of a button or underline, identity is unmistakable on the first frame and the palette stays disciplined (green / black / white + greys, nothing else). Transfers to any single-brand product page that wants instant recognition without a logo wall.
- **Scale-driven hierarchy in a single weight.** Almost everything is one weight (400 dominates; 700 is rare). Display vs body is a ~3.5× size jump (≈56px → 16px), so the eye is ordered by *size and position*, not by bolding. This reads calmer and more confident than a page that fights for attention with weight, and it ports cleanly to any grotesque/neo-grotesk family.
- **Tight display typesetting.** The H1 runs sub-1.0 leading (≈56/53) with negative tracking (≈-0.03em), so the two-line headline reads as one dense optical block. Set big type tight and small type loose — the contrast itself becomes the hierarchy.
- **The product IS the hero.** Instead of an abstract illustration or a fake dashboard, the center column is a real, photographic phone running the actual app (live balance, card, offers). The marketing claim ("the way money should work") sits beside concrete proof of it. Always show the literal thing you sell when you have it.
- **Pill geometry as a consistent signature.** Buttons, nav chips, and status bars are fully-rounded pills (100px / 999px radius); cards use a softer 20px radius. Two radius tiers, applied consistently, do more brand work than a third decorative flourish would. Transfers as a cheap, legible house style.
- **Whitespace does the separating.** Sections after the hero sit on plain white with generous vertical padding (80–90px blocks), letting each claim + device breathe instead of being boxed. Calm at high information density.

## Design-system read
- **Type:** Cash Sans (neo-grotesque, Helvetica-adjacent) as a near-solo family. Scale ratio ≈1.25 across UI sizes with a large display jump to ~56px. Hierarchy = scale + position, not weight. Display set tight (negative tracking, <1.0 leading); body at 16px / 1.5.
- **Color:** Brand green (#00E013) as full-surface ground and primary action; black ink on green, white ink on black sections; three greys (#555/#696969/#999) for all secondary text. No gradients of consequence. White and black are the neutral working surfaces.
- **Spacing rhythm:** 8px base. Section blocks padded 80–90px vertically; component gaps cluster at 16/20/24px. Generous, even rhythm.
- **Layout system:** A roomy multi-column grid (16-col desktop → 8-col mobile) used as a three-zone hero: headline left, device center, supporting copy + CTA right. Below the fold it relaxes into single-column claim+device stacks.
- **Motion / easing intent:** Quiet and functional. Durations 200–600ms on `ease`/`ease-in-out`; motion exists to (a) keep the device pinned while its screens cycle, and (b) slide a floating CTA in/out. Nothing decorative.
- **Density:** Marketing-low overall, but the device shows genuinely dense app UI — the contrast (sparse page / busy screen) makes the product look capable without making the page look cluttered.
- **Hierarchy:** Scale first, position second, color (green field / black CTA) third.
- **Restraint:** No gradient meshes, no glassmorphism, no illustration system, no second accent color, no oversized-hero-plus-three-cards template. One color, one typeface, two radii, a real phone.

## Interaction & motion
The page is mostly static type on flat color; the one substantial behavior is the pinned device demo. Evidence: `motion.scroll_effects` shows 4 `pin` effects (`position: sticky/fixed`) on the hero device wrapper and nav; 36 IntersectionObservers over 44 targets; frames s00→s05→s08 show the center phone holding viewport-center while its on-screen content advances (Money balance → tortoiseshell Card + Lock/•••4465 → Offers grid) and the flanking headline/paragraph stay put, then the whole device releases and scrolls away. Keyframe names corroborate: `*_fadein` (in-view reveals), `*ctaSlideIn` / `*ctaSlideOut` (floating CTA), `my-first-stock-splash-screen*introAnimation`.

- **Sticky device demo (screen-cycling)** — *Trigger:* scroll-progress. *Mechanism:* the device column is `position: sticky` (top) inside a tall track; as the track scrolls, the pinned phone swaps/cross-fades its inner screen while the left headline and right copy hold position. *Reads as:* "watch the same app do several things" — one continuous product walkthrough instead of three separate screenshots. *Transfers to:* any app/product marketing hero with a single device and multiple features to show. *Safety:* **production-safe** (pin + opacity swaps are cheap); cost is layout-thrash only if you animate the wrapper's size — animate inner opacity instead. See `patterns/sticky-device-demo-scrollytelling.md`.
- **Floating CTA slide-in/out** — *Trigger:* scroll-progress / in-view. *Mechanism:* a persistent "Get started" CTA translates in (`ctaSlideIn`) once the hero leaves view and out (`ctaSlideOut`) near the footer, gated by an IntersectionObserver sentinel. *Reads as:* the action is always one tap away without occupying the resting hero. *Transfers to:* long marketing pages that need a durable conversion path. *Safety:* **production-safe** (transform/opacity only).
- **In-view fade-in** — *Trigger:* in-view. *Mechanism:* sections fade in via `*_fadein` keyframes gated by IO (thresholds 0.51/0.75/1). Subtle, single-property opacity. *Safety:* **production-safe**.
- **Pill-button invert hover** — *Trigger:* hover. *Mechanism:* the primary pill flips bg/ink (white→near-black, black ink→near-white) over ~200ms; the card-fan figure and arrow glyph recolor in concert. *Reads as:* crisp, tactile affordance matching the pill brand language. *Safety:* **production-safe**.

**Reduced-motion: NOT respected** (`prmRules: 0`, `respectsReducedMotion: false`). The scroll-pin and CTA slide run regardless of user preference — a genuine a11y gap. Any reuse MUST add the `prefers-reduced-motion: reduce` fallback (jump to end state / disable pin), which the reference patterns include.

## Production-safety note
All techniques here are **production-safe** — pin + opacity + transform, no parallax math on the main thread, no canvas/WebGL. The single defect to fix on reuse is the missing reduced-motion fallback; the patterns below ship it.

## Extracted patterns
- `sticky-device-demo-scrollytelling` — a center device pinned while its on-screen content cycles and flanking copy holds; reuse for single-device feature walkthroughs.
- `centered-device-flanked-hero` — three-zone hero (headline · product · supporting copy+CTA) on a full-bleed brand-color ground; reuse when the product itself is the strongest hero asset.
