---
slug: teak
url: https://teak.io
source: landbook
corpus: production
captured: 2026-06-22
award_type: Gallery
score: null
tags: [saas, b2b, gaming, landing, product-marketing, developer-tool]
when_to_use: [product-marketing, landing, feature-section, hero]
directions: [soft, editorial]
layout: [split-hero]
a11y: [reduced-motion-ignored]
provenance:
  gallery_url: https://land-book.com/websites/96398-teak-retention-engine-for-top-grossing-f2p-games
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [highlighter-emphasis-hero, sticker-label-feature-list, parallax-drift, scroll-scale, scroll-progress-rotate, scroll-linked-recolor, sticky-pin-scrollytelling]
tokens_snapshot: ../tokens/teak.json
screenshots: ../screenshots/teak/
---

## What works (transferable principles)

- **A warm off-white canvas + near-black-but-tinted ink reads more premium than pure #fff/#000.** The page sits on `#f0f2ef` (warm grey-green) with display type in `#2a0f14` (a dark plum, not black) and body in warm grey `#766e70`. Killing the pure-white/pure-black extremes removes the "default browser" sterility and makes the whole surface feel art-directed before a single accent lands. Transfers to any light-mode marketing or doc site: shift bg ~3-5% off white and ink ~5% off black, both toward one warm hue, and the page instantly feels designed.

- **Hierarchy is built from scale + two distinct typefaces, never from bolding** — the entire page lives in weights 400/500 only. A soft humanist *display* face (ABC Solar) at 50-65px does the shouting; a neutral grotesque (Haffer) at 16-17px carries body; a *monospace* (Haffer Mono) tags every eyebrow/badge/button. The family swap, not weight, signals "this is a label vs a headline vs prose." Transfers anywhere you want rich hierarchy without a heavy/loud feel: pick display + text + mono, hold one weight each, let size and family separate the levels.

- **Highlighter marks turn flat text into a brand device for zero structural cost.** One word in the H1 ("irresistible") sits on a hand-drawn yellow highlighter bar; the same trick reappears as colored blocks behind the mono words *integrate / build / execute*. It draws the eye to the exact word that carries meaning, costs one inline span, and degrades gracefully (still readable with styles off). Transfers to any hero or feature heading where you want emphasis on a single semantic word without changing type size or weight. (See `highlighter-emphasis-hero`.)

- **Mono-tagged eyebrows + sticker labels give a playful, "made-by-engineers" voice while staying legible.** Section kickers ("Integrate in under a week"), nav-adjacent badges, button text, and the feature words are all set in tracked-out uppercase/lowercase monospace. Mono is doing personality work, not data work — it reads as craft/dev-culture without the cost of a custom display treatment. Transfers to any developer-facing B2B product wanting warmth + technical credibility; reserve mono strictly for short labels (it tires the eye in long runs).

- **Color is rationed: one functional accent (yellow), everything else is confetti.** Yellow `#fae261` is the *only* color that ever means "act" — it owns the primary pill CTA and the hero highlight. Coral/pink/plum/mint appear solely as decorative sticker blocks and scattered diamond confetti, never on interactive elements. Because chroma is starved everywhere else, the yellow CTA is unmissable and the palette never competes with itself. Transfers universally: assign exactly one color to "the action," and let any other hues be explicitly decorative.

- **Hairline-boxed clusters create structure without cards-in-cards.** The feature trio and the dashboard mock are framed by single 1px warm-grey rules into a quiet bordered grid, rather than stacking shadowed cards inside shadowed cards. Lines (not elevation) do the grouping, so a dense section stays flat and calm. Transfers to spec tables, feature matrices, pricing — group with borders + whitespace before reaching for shadows.

- **Generous vertical air keeps a long (8.5k-px) page from feeling dense.** Large `~40px+` section breaks and roomy line-height (24px on 16px body) mean each idea gets isolation; the page is information-rich but never cramped. Transfers to any long-scroll landing page — let whitespace, not dividers, pace the narrative.

## Design-system read

- **Type:** Three families, each held to one weight. Display = ABC Solar (soft humanist, slightly serif-flared) at ~50/56/65px with tight tracking (~-0.02em / raw -1px) and ~1.05 leading; body = Haffer grotesque at 16-17px / 1.4-1.5 leading; labels/buttons/badges = Haffer Mono, tracked out (~+0.035em). Scale is a wide two-cluster ramp (12-17px UI/body, then a jump to 50-65px display) — the gap itself is the hierarchy. Weights observed: 400 and 500 only.
- **Color:** Warm light system. `bg #f0f2ef` → `surface #ffffff` (cards) → `surface-2 #f8faf7` → ink `#2a0f14` → `muted #766e70` → secondary-strong `#544145`; borders are a warm hairline grey `#e3e1de`. One functional accent: yellow `#fae261` (CTA + highlight). Decorative-only roles: coral `#ffab8d`, soft pink `#ffdcef`, hot pink `#ff4eaf`, deep plum `#4b003a`, mint — used as sticker blocks/confetti, never interactive.
- **Spacing rhythm:** ~8px base; clusters use 4/6/8/12/16/24px, section padding ~32-40px, with larger vertical breaks between blocks. Whitespace is the primary separator; visible dividers are rare and hairline.
- **Layout system:** Centered max-width content column (~1200px). Hero is asymmetric two-column (text left, product/floating UI right). Feature section is a left text-block + right vertically-stacked 3-row bordered list. Logo wall and 4-column footer collapse to single column on mobile (captured 1170px wide). Desktop captured 1440×900.
- **Motion / easing intent:** Two registers. (1) Micro: light hover/state feedback on pills (the CTA flips yellow→black on hover, "Learn more" grey→black), quick + restrained (~120-200ms ease-out). (2) Macro: a dense, Framer-driven *scroll choreography* — parallax, scale, rotate, and background-shift on the floating product UI — that is the page's actual signature and runs much hotter than the static read implied. Full breakdown, evidence, and per-technique safety in **Interaction & motion** below.
- **Density:** Medium-high content density (stats, feature trios, dashboard mock, testimonials) kept legible by large air, hairline grouping, and high value-contrast ink on off-white.
- **Hierarchy:** Dominant ordering device is **scale**, reinforced by **family swap** (display vs body vs mono) and **position** (left-aligned headers), with the yellow accent as the single attention magnet.
- **Restraint:** No bold weights, no text gradients, no heavy/stacked drop shadows, no second functional accent color. Decorative color is fenced off from anything clickable. Pure white/black are deliberately avoided.

## Interaction & motion

Teak's motion is **the opposite of Attio's** — where Attio rations motion and respects reduced-motion, teak is **motion-dense spectacle**: a Framer-built scroll choreography that flings the floating product UI (campaign-builder cards, message bubbles, a phone mock, confetti diamonds) through the viewport on layered parallax + scale + rotate, while category chips recolor on entry. Evidence from the motion capture: **48 scroll-driven effects** (1 pin, 8 rotate, 14 parallax, 12 scale, 13 background-shift), **254 IntersectionObservers over 254 targets**, **~5191 `requestAnimationFrame` calls** in one scroll pass, 5 cursor-followers fed by 9 `mousemove` listeners, 4 `<video>` + 1 `<canvas>`, 49 `draggable` nodes. Stack is **Framer** (`script_main.*.mjs`) — *not* hand-rolled; there are **0 `@keyframes` / 0 CSS animation rules** (it's all JS-driven transforms via a dense IO threshold array `[0,0.01,…,0.99]` plus a `0.25 / rootMargin:200px` reveal observer). Captured easing is the bare `"ease"` default; no explicit durations exposed (Framer drives per-frame). **Critically: `prefers-reduced-motion` is NOT respected** (`prmRules:0`, `a11y.reduced_motion:false`) — the single biggest production liability here. Frames cited below are `corpus/production/screenshots/teak-io/frames/`.

- **Layered parallax drift of floating product UI** — *Trigger:* scroll-progress (14 `transform/parallax` effects, e.g. `div.framer-13mperm` / `-4f1rr0` / `-1spd07q`, plus the "Last Ditch Effort" / "300M Coins" / "Weekly" card stacks). *Mechanism:* each floating card, bubble, and confetti diamond translates at its own rate as the section scrolls, so foreground UI, mid-ground chips, and background grid separate into depth planes. *Reads as:* a living workspace assembling itself — the product "floats" toward you (s00 hero chips → s03 the campaign builder + scattered gold/pink/blue diamonds at visibly different depths → s06 a phone mock drifting through frame). *Transfers to:* any hero where you want floating UI to feel dimensional instead of pasted-on. *Safety:* **prod-safe only if subtle**; teak's amount is **spectacle** — many simultaneous transformed layers + ~5k rAF/scroll is a real CPU/jank cost on low-end devices. → `parallax-drift`.
- **Scroll-linked scale (zoom) of UI panels** — *Trigger:* scroll-progress (12 `scale` effects with real captured ranges: `0.999→1.117`, `1.002→0.759`, `0.997→0.883`, `1.006→1.13`). *Mechanism:* cards and the campaign-builder panel grow or shrink as they cross the viewport — note both up-scales (cards swelling on entry) and a strong down-scale (`1.002→0.759`, a panel receding ~24%). *Reads as:* the focal panel "breathes" / is pushed and pulled by the scroll, reinforcing the parallax depth. *Transfers to:* a single hero asset you want to feel reader-driven. *Safety:* **prod-safe if subtle** (compositor transform); teak stacks it on top of parallax, so combined it's **spectacle**. Cap the range (±5%), not teak's ±24%. → `scroll-scale`.
- **Scroll-progress rotation of confetti / decorative shapes** — *Trigger:* scroll-progress (8 `rotate` effects, large captured angles: `-85.3°`, `37.1°`, `40.6°`, `-66.8°`, `89.5°`, and one full `-180°` on `div.framer-2yrist`). *Mechanism:* the diamond/sticker confetti spins as a function of scroll, tying the decorative layer to reader motion. *Reads as:* playful, "made-by-engineers" energy — the confetti is alive, not static garnish. *Transfers to:* purely decorative accent shapes (never body text or UI you must read). *Safety:* **prod-safe if the angle is capped**; teak's near-180° swings are **spectacle-leaning** and a motion-sickness vector at this density. → `scroll-progress-rotate`.
- **In-view background-shift on category chips** — *Trigger:* in-view (13 `background-shift` effects with real from→to pairs, e.g. "Lapsed Players" `rgb(255,229,220)→rgb(253,241,176)` warm-peach→yellow; "Spend" `#f0f2ef→rgb(215,248,230)` off-white→mint; "Install Date" blue-tint→canvas). *Mechanism:* audience/segment chips resolve from one tint to another as they enter — the same recolor-on-entry idea as Attio, applied to the product's own data chips. *Reads as:* "this segment just activated"; the static categorical palette made temporal. *Transfers to:* tag/segment/status chips, dashboard cells. *Safety:* **production-safe** (one-shot, cheap; meaning isn't hue-dependent — keep the chip's text label). → `scroll-linked-recolor`.
- **Sticky-pinned nav / scrollytelling spine** — *Trigger:* scroll-progress (the single `pin (fixed)` effect: the `Product Pricing Blog About / Log in / Book a demo` bar pins). *Mechanism:* the nav cluster holds `position: fixed` while the choreography scrolls beneath it, so the action (Book a demo) is always reachable and the floating UI reads as passing *behind* a stable frame. *Reads as:* a persistent stage on which the product performs. *Transfers to:* persistent nav/CTA on a long animated scroll; the deep-dive variant pins a section heading over evolving evidence. *Safety:* **production-safe** (native sticky/fixed, no per-frame JS). → `sticky-pin-scrollytelling`.
- **Cursor-follower decorations** — *Trigger:* hover/mousemove (5 `cursor-follower` nodes, 9 `mousemove` listeners; captured as continuously updating `matrix(...)` transforms). *Mechanism:* small decorative elements track and lag the pointer. *Reads as:* extra liveliness / craft on fine-pointer devices. *Transfers to:* brand-experience hero garnish only. *Safety:* **spectacle** — pointer-only (does nothing on touch), adds `mousemove` work, and is the kind of flourish to drop first under a perf or reduced-motion budget. (No corpus recipe; reuse the *principle* sparingly, fine-pointer-gated.)
- **Hover micro-states on actions** — *Trigger:* hover. *Mechanism:* the two interactive pills invert on hover — "Book a demo" yellow `#fae261`→black, "Learn more" grey→black (`bg` change over ~120-200ms). *Reads as:* responsive, intentional chrome; the one place motion is purely functional. *Transfers to:* all interactive pills/links. *Safety:* **production-safe**.

## Production-safety note

This is a real shipping marketing site; all techniques are **production-safe**:
- Warm off-white + tinted ink: **production-safe**, zero cost. A11y caveat — verify `muted #766e70` on `#f0f2ef` meets 4.5:1 for small body text (it is borderline; use `#544145` for the smallest captions).
- Scale + family-driven hierarchy in one weight: **production-safe**. Cost is **font payload** — three families (display + sans + mono) is a real download budget; subset and `font-display: swap`, and supply solid fallbacks (the capture itself shows the generic-`sans-serif` fallback flash before fonts resolved).
- Highlighter marks / sticker labels: **production-safe**; pure CSS (background image or inline-block tint), no JS, degrades cleanly.
- Hairline-boxed clusters: **production-safe**, cheap, scales to any spec/pricing grid.
- Rationed single accent + decorative confetti: **production-safe**; the discipline (color only on actions) is what makes it work — copying the brights onto interactive elements would break the signal.

## Extracted patterns

- **highlighter-emphasis-hero** — an oversized display headline where one semantic word sits on a hand-drawn highlighter bar; reuse to emphasize a single word in a hero/feature heading without changing its size or weight.
- **sticker-label-feature-list** — a vertical, hairline-divided list of feature rows, each led by a short monospace word set in a colored "sticker" block + a one-line description; reuse for a compact, playful 3-5 item capability list beside an explanatory heading.
