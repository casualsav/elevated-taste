---
slug: aesop
url: https://www.aesop.com
source: manual-pick
corpus: production
captured: 2026-06-30
award_type: Manual (ecommerce/luxury)
score: null
tags: [ecommerce, dtc, beauty, luxury, retail, editorial, restraint, light]
when_to_use: [ecommerce, product-marketing, landing, brand-experience, navigation, footer]
directions: [editorial, minimalist]
layout: [split-hero, content-grid]
a11y: [reduced-motion-respected, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [kicker-led-section-header, product-comparison-strip]
tokens_snapshot: ../tokens/aesop.json
screenshots: ../screenshots/aesop/
---

## What works (transferable principles)

- **Hierarchy is built from a two-family swap, not from size or weight on the body.** Body and UI text sit almost entirely in one grotesque (SuisseIntl) at a uniformly *tiny* 12–14px / weight 400; every section title jumps to a humanist, stress-stroked display face (Zapf-Humanist / Optima-class) at ~30px. The reader knows "this is a title" because the *typeface changed*, not because it got bold. Transfers to any editorial or luxury surface: pick one neutral text face + one characterful humanist display face, hold body to a single small size/weight, and let the family swap carry the levels — you get rich hierarchy with almost no type-scale ramp.

- **A consistent kicker → title → sentence → hairline-button stack gives every section the same calm rhythm.** Each block opens with a tiny tracked label ("Evergreen exhilaration", "Enlightening assistance", "Perfectly portable"), then the humanist title, one supporting sentence, and a thin-bordered text button. The repeated micro-structure is what makes a long, content-dense homepage feel composed rather than assembled. Transfers to any multi-section marketing/ecommerce page — adopt one section-header template and reuse it verbatim. (See `kicker-led-section-header`.)

- **Warm ivory canvas + tinted dark ink reads premium where pure #fff/#000 reads default.** The page sits on `#fffef2` (a warm off-white, not white) with ink at `#333` and a single darker `#252525`; tiles are a slightly deeper `#f6f5e8`. Killing both extremes makes the surface feel art-directed before any color lands — the whole palette is two warm neutrals plus photography. Transfers to any light-mode brand site: shift bg a few percent warm-off-white and ink to ~#2e2e2e, and the page stops looking like an unstyled document.

- **Color is rationed to almost nothing; the product photography *is* the color.** The chrome is monochrome warm-neutral; the only chromatic events are a full-bleed green hero photograph and an amber-brown accent (`#945c26`) reserved for special/eau-de-parfum labelling. Because the UI never competes, each product image becomes the page's color. Transfers to any catalog where the imagery is strong — strip accent color out of the frame and let the goods supply it.

- **Restraint as a system: sharp corners, hairline rules, near-invisible shadows.** Radii are effectively 0–3px, elevation is a barely-there `rgba(0,0,0,.08) 0 2px 4px`, and grouping is done with 1px `rgba(51,51,51,.2)` rules — never with card stacks or gradients. The flatness is the brand. Transfers wherever you want an austere, gallery-like feel: group with lines + whitespace, cap shadow opacity under ~10%, and avoid rounded "app card" softness.

- **Whitespace, not dividers, paces a very long page.** Big cream gaps isolate each section; the eye never sees a busy seam. With tiny type, the generous air is what keeps density legible. Transfers to any long-scroll page — let vertical rhythm do the chaptering before reaching for rules or background bands.

- **A horizontal product-comparison strip turns "help me choose" into one legible object.** The fragrance comparator lays each product in a column (image · name · notes · price) over a shared row of binary aroma chips (Woody/Spicy/Ambery filled vs the rest empty), then closes with "Aromatically alike" cross-links. It answers selection without a configurator. Transfers to any catalog with multi-attribute products — perfume, wine, coffee, plans. (See `product-comparison-strip`.)

## Design-system read

- **Type:** Two families. **SuisseIntl** (neutral grotesque) carries *everything* functional at a deliberately small ramp — 12px dominant body, 14px secondary, 11px micro-labels, 16/18px lead-ins. **Zapf-Humanist** (Optima-class humanist, stressed strokes) is the *display* face for section titles (~30–31px) and the `Aēsop` wordmark; H1 36px desktop / 24px mobile. Leading is tight-to-normal: headings ~1.33–1.4, body ~1.4–1.5. Weights 400 (overwhelmingly), 500, 700. Tracking is near-zero (≈+0.01em) on labels. Hierarchy = **family + position + whitespace**, never a large size jump.
- **Color:** Warm neutral system. `bg #fffef2` → tile/`surface #f6f5e8` → ghost-image placeholder `#e8e7da` → ink `#333333` → ink-strong `#252525` → muted `#666666`. One reserved accent: amber-brown `#945c26` (special/EDP labels). Hero is a green photograph `#468254` darkened by a `transparent→#000` gradient with white text. Footer inverts: `#333` bg, ivory `#fffef2` text. Legal links use a lone blue `#3860be`; B-Corp badge green `#32ae88`. Borders: hairline `rgba(51,51,51,.2)`.
- **Spacing rhythm:** 8px base (by far the most common gap). Cluster scale 4/6/8/12/15/16/20/24, section padding 32–40px. Text columns capped ~730px, content ~1200px. Whitespace is the primary separator.
- **Layout system:** Centered content column (~1200px max), text measure ~730px. Hero is full-bleed photographic with centered wordmark nav above 10 top-level links. Sections alternate text-left/image-right and image-left/text-right; "Browse by category" is a 5-up image-tile row; the comparator is a horizontally-scrolling column table. Desktop 1440×900; mobile 390 collapses nav to a hamburger (12 links → 2) and category row to a scroller.
- **Motion / easing intent:** Minimal and functional. Short hover transitions (0.2–0.5s `ease`/`ease-out`) on links and the logo; motion exists only as chrome (mega-menu slide, snackbar, back-to-top, carousels, accordions), never as scroll spectacle. `prefers-reduced-motion` is respected. Full read below.
- **Density:** High content density (product trios, category grid, comparator, editorial cards, two-tier footer) kept legible by tiny-but-airy type and generous section gaps.
- **Hierarchy:** Dominant ordering device is **typeface family** (humanist display vs grotesque text), reinforced by **whitespace** and the repeated **kicker-label** eyebrow.
- **Restraint:** No rounded app-cards, no gradients (except the photographic hero darken), no bright UI accent, no heavy shadows, no large display sizes, no bold body. Austerity is the design.

## Interaction & motion

Aesop is **deliberately near-static** — the antithesis of scroll-spectacle. Motion capture confirms it: **0 entrance reveals, 0 IntersectionObservers, 0 rAF in a scroll pass, 1 scroll listener**, and the only two scroll-driven effects are utility pins (a `c-snackbar` and a `c-back-top` button going `position: fixed`). The AOS library is present but observed doing nothing on the homepage. `prefers-reduced-motion` **is respected** (`prmRules: 4`, `a11y.reduced_motion: true`). What animation exists is functional chrome, evidenced by `@keyframes` names (`slideDownIn/Out`, `rightSlideIn`, `fadeIn/Out`, `loader-spin`, `scrolldown-icon`) and interactive counts (5 carousels, 5 tabs, 39 disclosure widgets). Because the site is static, this section is intentionally short.

- **Mega-menu / disclosure slide** — *Trigger:* hover/tap. *Mechanism:* nav panels and the 39 disclosure widgets reveal via short `slideDownIn` / `fadeIn` transitions (CSS keyframes, ~200–400ms `ease`). *Reads as:* quiet, considered navigation; nothing leaps. *Transfers to:* any nav/accordion where you want composure over flourish. *Safety:* **production-safe** (CSS-driven, reduced-motion gated).
- **Utility pins (snackbar + back-to-top)** — *Trigger:* scroll-progress. *Mechanism:* a notification snackbar and a back-to-top button switch to `position: fixed` past a scroll threshold (1 scroll listener, no rAF). *Reads as:* persistent help without stealing focus. *Transfers to:* long pages needing a reachable return/notice affordance. *Safety:* **production-safe** (native fixed positioning, no per-frame JS).
- **Hover micro-states** — *Trigger:* hover. *Mechanism:* links and the logo shift ink (`#838279`→`#333`, logo `#333`→`#000`) over 0.2–0.4s; the hairline text-buttons cue with their arrow. *Reads as:* responsive, restrained chrome. *Transfers to:* all text links/ghost buttons. *Safety:* **production-safe**.

## Production-safety note

A live shipping luxury-ecommerce site; everything here is **production-safe**. The two real caveats are accessibility, not motion:
- **Tiny type:** 12px body is below comfortable reading size and a touch-target risk (capture flagged 80 small tap targets, 425 interactive nodes). Reuse the *family-swap hierarchy* but bump body to ≥14–15px outside a luxury context, and keep tap targets ≥44px.
- **Low-chroma contrast:** verify `muted #666` on `#fffef2` and any ivory-on-green hero copy meet 4.5:1; the hero relies on a photographic gradient for legibility, which can fail over lighter image regions — keep the `transparent→#000` scrim.
- Warm-neutral palette, hairline grouping, family-driven hierarchy, kicker-header rhythm, comparison strip: all **production-safe**, cheap, framework-neutral.

## Extracted patterns

- **kicker-led-section-header** — a repeatable section opener: tiny tracked kicker label → humanist-display title → one supporting sentence → thin-bordered text button; reuse to give every section of a long page the same calm rhythm.
- **product-comparison-strip** — a horizontally-scrolling, column-per-product comparison (image · name · notes · price) over a shared row of binary attribute chips, closed with cross-sell links; reuse for multi-attribute catalogs (fragrance, wine, coffee, plans) to answer "help me choose" without a configurator.
