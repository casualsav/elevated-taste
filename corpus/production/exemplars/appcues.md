---
slug: appcues
url: https://www.appcues.com
source: manual
corpus: production
surface: site
captured: 2026-08-31
award_type: null
score: null
tags: [saas, b2b, product-marketing, warm, pastel, serif, editorial]
when_to_use: [landing, product-marketing, feature-section, hero]
directions: [soft, editorial]
layout: [center-stack, scroll-theater]
a11y: [focus-visible, alt-coverage-high, reduced-motion-ignored]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [sticky-stacking-cards, serif-mono-editorial-headline]
tokens_snapshot: ../tokens/appcues.json
screenshots: ../screenshots/appcues/
---

## What works
- **Three-way font pairing does the hierarchy work — a high-contrast serif display, a grotesk body, and a mono eyebrow.** Every big statement is set in a Plantijn-style serif (`Martinaplantijn`) at 76/66/48px in a single weight (400); paragraph copy is a neutral grotesque (`GT Standard`) at 16/1.5; and section labels are an all-caps mono (`Basel Grotesk Mono`, 13.5px, +0.06em tracking). The *voice change between families* — not weight or color — is what separates display, body, and label. Transfers to any editorial-leaning product marketing page that wants warmth without a script font.
- **Italicize one word of the headline to carry the whole idea.** "Launch products that *land*", "What moves your customers *moves your business*" — the serif's italic cut is used surgically on a single verb so the emphasis reads as editorial voice, not bolding. Cheap, reusable anywhere you have a display serif with a real italic.
- **A warm cream canvas + rotating pastel section tints replace the default white-on-white SaaS look.** The page never uses pure `#fff` as the field; it alternates butter cream (`#fffcef`), off-white (`#fbfbfb`), lilac (`#f6ebf8`), teal glacier (`#ecfbff`), and a deep aubergine panel (`#291a3d`). Each feature card and stat card gets its own pastel so sections are legible by hue, and the single chartreuse accent (`#f0fe52`) stays the only "loud" color — reserved exclusively for CTAs. Transfers as a palette strategy: one saturated accent, many desaturated surface tints, no raw white.
- **Sticky stacking cards turn a plain feature list into a scroll payoff without a heavy library.** Three feature cards share `position: sticky` with *stepped* top offsets (5rem → 7rem → 9rem); as you scroll each pins under the nav and the next rides up over it, building a physical deck. It's pure CSS sticky — no scroll-event handler, no GSAP. See `patterns/sticky-stacking-cards.md`.
- **Oversized numerals as the hero of a proof section.** The stat cards lead with the metric set in the display serif at 76px (`21%`, `620%`, `1000+`) with the label small beneath — scale contrast makes the number the first thing read, and the pastel card tint codes each stat. Reusable for any metrics/results band.
- **Restraint in motion is a deliberate brand choice.** Apart from the stacking cards the resting page is almost entirely static — no entrance stagger, no hover transforms, no parallax. The calm reads as confidence and keeps the warm/editorial tone from feeling gimmicky.

## Design-system read
- **Type:** Three families by role, not by weight. Display serif `Martinaplantijn` (76/66/54/48/28px, weight 400, tracking −0.04em ≈ −3px at display sizes, leading 1.0–1.2, italic used for emphasis words). Body grotesque `GT Standard` at 16px / line-height 24px (1.5). Eyebrow/tagline mono `Basel Grotesk Mono` at 13.5px, all-caps, +0.06em. Ratio from 16 → 76 is ~4.75×, and the whole ramp lives in weight 400 — scale and family, never bold, create hierarchy.
- **Color:** Warm neutral system. Canvas cream/off-white (`#fffcef`, `#fbfbfb`); ink is aubergine (`#291a3d`) with softer body text (`#20222e`, neutral-700 `#373c54`); the lone accent is amp-yellow `#f0fe52` on pill CTAs. Surface tints rotate through petal lilac `#f6ebf8`, glacier teal `#ecfbff`/`#beedef`, and card colors blurple `#e9d9ff`, pink `#f8d0d1`/`#fa9496`, teal `#6feeec`. One dark panel (`#291a3d`) inverts to `#f6ebf8` text. Accent is never used for text or large fields — CTA only.
- **Spacing rhythm:** ~4px base; common steps 4·8·12·14·16·20·24·32·40·60·80·100. Cards pad 40px, gap 32px internally; section CTAs pad 12–14px × 26–28px. Generous vertical air (hero pads 220px top) does the section separation.
- **Layout system:** Mostly flexbox (98 flex vs 2 grid); content container 1320/1200px, prose 800px. Hero is centered (`center-stack`) — eyebrow, serif h1, 22px serif sub, pill CTA, then a product mock ~1086px wide. Feature section is a single sticky-card column; the momentum panel is a two-column label→description list with hairline dividers; proof is a 3-up pastel stat grid. Mobile collapses grids to 1–2 columns; h1 drops 76→48px.
- **Layering / page architecture:** Single flat scroll over opaque sections — no static backdrop, no blend/glass layers (`has_static_backdrop: false`, `has_blend_overlay: false`). The only real z-axis play is the sticky nav (transparent bar over the cream field, `top:0`) plus the sticky stacking cards with stepped `top` offsets that pin and overlap. The hero uses a negative `margin-top:-138px` to slide under the transparent nav so the cream field runs full-bleed to the top.
- **Motion / easing intent:** Webflow IX2, `ease` only, no custom durations. Motion communicates almost nothing except the one stacking-card reveal — a choice to feel calm and editorial rather than animated.
- **Density:** Low-to-medium. Big type, wide gutters, one idea per card. Reads relaxed even in the dense momentum list because hairlines + a single column keep the eye on one row at a time.
- **Hierarchy:** Scale contrast first, family second, color third. The chartreuse accent is a hierarchy tool by scarcity — the eye jumps to the only yellow thing on screen.
- **Restraint:** No entrance animations, no hover motion, no gradients-as-decoration, no fake glassmorphism, no second accent color competing with the yellow.

## Interaction & motion
- **Sticky stacking cards** — *Trigger:* scroll-progress (native sticky). *Mechanism:* sibling cards each `position: sticky` with increasing `top` (5→7→9rem); as the section scrolls each card pins in turn and the next overlaps it, forming a stacked deck. Driven entirely by scroll position via CSS sticky — no JS scroll listener on the hot path. *Reads as:* a deliberate "here's step 1, 2, 3" progression with physical depth. *Transfers to:* feature walkthroughs, how-it-works, onboarding step sequences. *Safety:* **production-safe** (compositor-friendly, no reflow); pointer-events stay live. See `patterns/sticky-stacking-cards.md`.
- **Static resting page** — no IntersectionObserver-gated entrance reveals, hover transforms, or parallax were observed in the frames; the ~723 rAF calls trace to embedded Wistia video players, not page choreography. Reduced-motion is **not** explicitly respected in CSS (`prefers-reduced-motion` rules: 0) — a gap worth closing if you adopt the stacking cards, since native sticky itself is harmless but any JS-enhanced version should honor it.

## Production-safety note
- Sticky stacking cards: **production-safe** — pure CSS, no main-thread scroll work; just verify on short viewports that the stepped `top` offsets don't push the last card off-screen.
- No `prefers-reduced-motion` handling shipped: flagged **reduced-motion-ignored**. Cheap to fix — disable any transition/transform enhancements under the media query.
- 26 of 53 interactive targets flagged small (**tap-targets-risky**) — mostly footer/nav links; enlarge hit areas on mobile.

## Extracted patterns
- `sticky-stacking-cards` — CSS-only deck-of-cards feature section where each card pins under the header on scroll.
- `serif-mono-editorial-headline` — mono all-caps eyebrow + display-serif headline with a single italic emphasis word, over a warm non-white canvas.
