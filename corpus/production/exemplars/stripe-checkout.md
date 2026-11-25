---
slug: stripe-checkout
url: https://checkout.stripe.dev
source: manual
corpus: production
surface: app
captured: 2026-08-24
award_type: null
score: null
tags: [fintech, saas, b2b, payments, product-configurator, light, forms]
when_to_use: [checkout, onboarding, settings, forms, dashboard]
directions: [soft, minimalist]
layout: [app-shell, center-stack]
a11y: [alt-coverage-high, reduced-motion-ignored, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [soft-elevation-surface, plan-choice-card-pair, modal-scale-fade]
tokens_snapshot: ../tokens/stripe-checkout.json
screenshots: ../screenshots/stripe-checkout/
---

## What works (transferable principles)
- **Elevation is built from stacked low-alpha shadow layers, not one blur.** Every surface composes a hairline "ring" (`0 0 0 1px rgba(136,152,170,.1)`) + a soft ambient layer + a tighter key layer — e.g. the choice modal is `0 40px 100px rgba(0,0,0,.2), 0 6px 12px rgba(0,0,0,.03)`. The 1px ring reads as a crisp edge at any zoom while the wide blur reads as ambient depth; the result feels physical without any single shadow being visible. Reusable for any card/modal/popover system that must look premium on a white ground.
- **Hairline borders + tiny radii create calm precision.** Controls sit on a `0.5–1px` `#d8dee4` border with a `6px` radius; the whole UI stays inside a `6 → 8 → 10 → 12px` radius ramp, reserving big radii (pills at `100px`, phone bezel at `40px`) for deliberately "device"-like objects. Thin borders + small corners telegraph "instrument, not toy" — the right register for money/settings UI.
- **A dot-grid canvas turns floating white panels into a workspace.** The body paints a tiled dot texture behind everything; white sidebars and preview frames float on it with soft shadows. The texture does the work of separating figure from ground so the surfaces themselves can stay borderless-clean. Transfers to any builder/configurator/editor that needs an "app canvas" feel.
- **Indigo is rationed to exactly two jobs: primary action and current selection.** Almost the entire chrome is neutral (`#353a44` text, `#596171` subdued, `#697386` gray) — the `#675dff` accent appears only on the filled CTA and as a selection ring/outline (`2px solid`, or an offset `box-shadow` ring). Because color is never decorative, a single accent instantly signals "this is the actionable/selected thing." The strongest restraint lesson in the corpus for dense forms.
- **Hierarchy comes from weight + a short size ramp, in one family.** Inter runs the whole page across a tight `12 → 14 → 16 → 18 → 24px` scale; emphasis is carried by weight jumps (`400 → 500 → 600 → 700`) far more than by size. Keeps a control-dense UI legible without any display type — the labels, values, and headings all feel part of one instrument.
- **Selectable objects announce state with a ring + a hero tint, never a color swap.** A chosen card keeps its layout and text color and gains only an accent outline plus a gradient wash on its image well (`linear-gradient(70deg, …cyan…, …violet…)` fading in at `opacity 0→1`). State change is additive and reversible, so nothing shifts position — the calm way to show selection in a picker.

## Design-system read
- **Type:** Inter (self-hosted variable, `100–900`) with a system-font fallback stack. Range is deliberately short — body `16px/24px`, UI labels `14px/20px`, micro `12px/16px`, section head `18px/28px @600`, modal card title `24px/32px @700`. ~1.5× body→heading ratio; hierarchy is weight-led. Slight negative tracking (`-0.15px`) on tabular/summary rows.
- **Color:** Neutral-dominant. Ink ramp `#1a1f36`(dark) → `#353a44`(default) → `#596171`(subdued) → `#697386`(gray) → `#8792a2`(icon). Surfaces `#ffffff` on nested `#f5f6f8`; hairline `#d8dee4`. One accent, indigo `#675dff` (link/toggle variant blue `#0072e9`, card checkmark violet `#9966ff`). Semantic error `#df1b41`. No decorative color.
- **Spacing rhythm:** 4px base; the live scale is `4 · 6 · 8 · 12 · 16 · 24 · 40 · 48px`. `16px` is the workhorse gap/padding; `24px` for card interiors; `40–48px` separates major regions. Tight, even, predictable.
- **Layout system:** App-shell — `grid-template-columns: auto 4fr` puts a fixed-width control sidebar (`~364px`) beside a fluid preview stage, `24px` page padding, `16px` column gap. Preview content is chrome-framed (browser bezel at `min-width 640px`, phone bezel `360px`). Collapses to a single column at `≤992px`; breakpoints at `768` and `992`. The integration picker is a centered modal (`936px`) with a two-card row.
- **Layering / page architecture:** Single flat scroll over a static dot-grid backdrop; depth is entirely shadow-driven, not parallax. The only true fixed layer is the modal portal (`z 99998` scrim + `99999` content). No sticky chrome, no blend/glass layers. The z-story is a conventional dialog stack, nothing more.
- **Motion / easing intent:** Fast and functional. Base transitions `0.1–0.2s linear` for hovers/color; panel entrances `0.45s ease-in-out`; the modal uses the signature Stripe curve `cubic-bezier(0.18,1,0.4,1)` at `0.25s`. Motion confirms state (open, select, hover-lift), never performs.
- **Density:** High — a full config sidebar of toggles, dropdowns, sliders, swatches. Kept legible by generous line-height, hairline dividers, and grouping into tinted `#f5f6f8` sub-sections.
- **Hierarchy:** Weight and color-restraint are the dominant ordering devices; scale is secondary.
- **Restraint:** No gradients in the chrome (only inside a preview image well), no big type, no decorative color, no scroll theatrics, no glass. The "wow" is entirely in shadow craft and precision.

## Interaction & motion (techniques)
- **Layered-shadow hover lift** — *Trigger:* hover. *Mechanism:* a resting card carries the hairline-ring shadow; on hover it swaps to `--shadow-medium` (adds a `7px/14px` ambient layer) via `transition: box-shadow 0.2s linear` — no transform, so no reflow. *Reads as:* "this is pickable / liftable." *Transfers to:* any card grid, list row, or draggable tile. *Safety:* **production-safe** (compositor-friendly; animating box-shadow is cheap here at this blur).
- **Additive selection ring + gradient reveal** — *Trigger:* click/select. *Mechanism:* selected card gains `outline: 2px solid accent` and fades a `70deg` cyan→violet gradient into its image well (`opacity 0→1`, `0.2s linear`); nothing reflows. *Reads as:* "this is the current choice," reversibly. *Transfers to:* plan pickers, theme/variant selectors, onboarding forks. *Safety:* **production-safe**. See `plan-choice-card-pair`.
- **Modal scale-fade entrance** — *Trigger:* load/open. *Mechanism:* scrim fades (`opacity 0→1`) while content scales `0.97→1`, both `0.25s cubic-bezier(0.18,1,0.4,1)`; on mobile it becomes a bottom-sheet `translateY(100%)→0`. *Reads as:* the dialog "settles in" from slightly small. *Transfers to:* any dialog/sheet. *Safety:* **production-safe** — but this site ships **no** `prefers-reduced-motion` fallback (see below). See `modal-scale-fade`.
- **Panel slide-in on view swap** — *Trigger:* in-view/mount. *Mechanism:* sidebar `slideInFromLeft` and preview `slideInFromRight` (`translateX(±100%)→0` + opacity, `0.45s ease-in-out`) when switching integration modes. *Reads as:* the two regions arrive from their own sides. *Transfers to:* master/detail view transitions. *Safety:* **production-safe**, same reduced-motion caveat.
- **Micro press/scale on buttons** — *Trigger:* hover/active. *Mechanism:* pill buttons `transform: scale(1.05)` on hover, primary buttons `scale(0.99)` on `:active`, `0.15–0.2s`. *Reads as:* tactile affordance. *Transfers to:* any CTA. *Safety:* **production-safe**.

Evidence: `@keyframes slideInFromLeft/slideInFromRight` (the only two keyframe rules), 49 transition rules, modal open handled by the `--modal-transition-curve` cubic-bezier, no IntersectionObserver, no scroll-driven effects. **Reduced motion is NOT respected** (`prefers-reduced-motion` rule count = 0) — the one real a11y gap in an otherwise careful UI.

## Production-safety note
- Every technique here is production-safe by construction (transform/opacity/box-shadow, sub-250ms, no scroll hijack). The exceptions to flag on reuse: (1) add the `prefers-reduced-motion` fallback the site omits; (2) some tap targets are below 44px (color swatches `20–24px`, the `8px` window dots) — fine as decoration but size up anything actually interactive on touch.

## Extracted patterns
- soft-elevation-surface — the stacked-low-alpha shadow + hairline-border + small-radius surface recipe; reuse for any premium card/modal/popover on a light ground.
- plan-choice-card-pair — two selectable cards (tag chips + checklist + image well) with additive ring/tint selection; reuse for plan/integration/variant pickers.
- modal-scale-fade — reduced-motion-aware dialog/bottom-sheet entrance (scrim fade + `0.97→1` content scale).
