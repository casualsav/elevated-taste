---
slug: rainbow
url: https://rainbow.me
source: manual-pick
corpus: production
captured: 2026-06-30
award_type: Manual (crypto/wallet)
score: null
tags: [crypto, web3, wallet, consumer, fintech, playful, colorful, b2c, app-marketing]
when_to_use: [landing, hero, product-marketing, feature-section, brand-experience]
directions: [expressive, soft]
layout: [bento]
a11y: [reduced-motion-ignored]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [saturated-icon-tile-grid, glossy-gradient-pill-button, pastel-gradient-section-ground]
tokens_snapshot: ../tokens/rainbow.json
screenshots: ../screenshots/rainbow/
---

## What works (transferable principles)
- **Rounded-heavy display type carries the whole brand voice.** Hierarchy is created almost entirely by *one rounded geometric sans at extreme weight + scale* (≈96px Heavy/Black headings vs ~20px body — a 4–5× jump), not by color or decoration. The rounded terminals read "friendly," the 800–900 weight reads "confident"; together they say *playful but trustworthy* — the exact tension a consumer crypto product needs. Transfers to any consumer fintech/app brand that wants approachable authority without a custom typeface (SF Pro Rounded is a system face).
- **Color lives in full-bleed pastel grounds, saturation lives in the content.** Each section sits on its own soft pastel wash (sky, lavender, mint, peach) stitched edge-to-edge, while the punchy saturated color is rationed to small objects — icon tiles, CTA pills, product UI. The page feels *drenched in color yet calm* because nothing loud spans more than a tile. Transfers to any brand that wants a vivid identity without a garish or fatiguing page. See `pastel-gradient-section-ground`.
- **Saturated icon tiles do the work a gradient-mockup would.** Feature capabilities are shown as a grid of vivid rounded-square tiles (cyan/yellow/magenta/green/orange/purple) each holding a single black hand-drawn line icon, with a bold label + muted one-liner beneath. It's instantly scannable, on-brand, and avoids the generic "three feature cards with a fake dashboard." Transfers to any feature/capability section. See `saturated-icon-tile-grid`.
- **Glassy gradient pill buttons signal "tap me" physically.** Primary CTAs are big-radius pills with a dual-tone gradient fill and a stack of *inset white-highlight* shadows that read as a glossy convex surface; hover swells the highlight rather than moving the element. The affordance is the polish itself. Transfers to any consumer app's download/primary action. See `glossy-gradient-pill-button`.
- **Generous radius is a system constant, not a per-element choice.** Everything — buttons, tiles, cards, image frames, the nav pill — shares the same family of large radii (16/24/32/40/64px, full pills at 100px). The repeated softness is what makes a high-color, high-density page cohere into one object. Transfers as a tokenized radius scale.
- **Whitespace, not rules, separates sections.** Despite heavy color, sections are divided by large vertical padding (≈64–100px blocks) and the ground-color change alone — no dividers, no boxes around everything. Density stays legible because each band gets air. Transfers to any long marketing page.

## Design-system read
- **Type:** One family — SF Pro Rounded (system rounded sans) across Medium→Black. Scale spans ~1rem body to 6rem display (≈96px desktop / 56px mobile h1); ratio is large and gapped (few intermediate steps), so hierarchy is unmistakable. Display tracking tightens negative (−0.02 to −0.03em) for a packed, poster-like headline; body stays neutral. Hierarchy = weight × scale, never color.
- **Color:** Neutral text system (near-black `#0f101a` fg, mid-grey `#777885` muted) on white/`#f1f3f6` surfaces, over rotating pastel section grounds. Saturated accents (pink `#ff54bb`, orange `#ff8a00`, plus the tile rainbow) are *object-level only*. No dark theme on the marketing page; dark appears only inside the embedded product screenshots.
- **Spacing rhythm:** 8px base; common steps 8/16/24/32/48/64/100. Section padding is large (32–100px blocks); intra-component gaps cluster at 10/16/20px.
- **Layout system:** Centered max-width container (~1280–1540px) with flex rows of 2/3/5/6 columns; feature grids are 3-up collapsing to 1-up on mobile. Headings often left-aligned at section start, content centered — a relaxed, non-rigid grid. Mobile h1 drops 96→56px; body holds.
- **Motion / easing intent:** Single base duration (300ms) on a symmetric `cubic-bezier(0.44,0,0.56,1)` ease-in-out plus plain `ease`. Motion is *welcoming, not theatrical* — staggered fade-ins on load, gentle in-view reveals, a slow scroll-linked rotate, soft parallax. Built on Framer; heavy IntersectionObserver use (47 observed targets) and rAF.
- **Density:** Medium-high (many features, many product shots) kept legible by big type contrast, large radii, and ground-color zoning.
- **Hierarchy:** Scale + weight dominate; color is identity, not ranking.
- **Restraint:** No dark marketing theme, no neon-on-neon (saturation is rationed), no custom display font, no scroll-jacking or pinned takeovers — motion stays in the "tasteful enhancement" lane.

## Interaction & motion (techniques)
- **Hero stagger fade-in** — *Trigger:* load. *Mechanism:* headline, sub, and the two CTA pills animate opacity 0→1 with small offset delays (first elements ~150ms, hero line ~500ms). *Reads as:* a calm, sequenced "settle." *Transfers to:* any above-the-fold hero. *Safety:* **production-safe** (opacity only). See `in-view-fade-rise`.
- **In-view fade-rise on sections** — *Trigger:* in-view (IntersectionObserver, ~47 targets, 10% rootMargin). *Mechanism:* section blocks transform/opacity in as they enter viewport. *Reads as:* content arriving as you reach it. *Transfers to:* long marketing pages. *Safety:* **production-safe** (transform+opacity). See `in-view-fade-rise`.
- **Constellation-ring scroll-rotate** — *Trigger:* scroll-progress. *Mechanism:* the "all the chains" radial cluster of chain logos rotates (raw shows −90°/−180° transforms tied to scroll) inside its section. *Reads as:* a living orbit of supported networks. *Transfers to:* any "ecosystem / integrations" cluster. *Safety:* **production-safe** (transform), but gate with reduced-motion. See `scroll-progress-rotate`.
- **Color-card row + fanned-phone parallax** — *Trigger:* in-view / scroll-progress. *Mechanism:* the tall color-card row ("manage hundreds of wallets") and the fanned NFT-phone deck drift at parallax offsets as the section scrolls. *Reads as:* depth and tactility. *Transfers to:* product-gallery sections. *Safety:* **production-safe** (transform). See `parallax-drift`, `fanned-card-deck-reveal`.
- **Glossy-pill hover swell** — *Trigger:* hover. *Mechanism:* CTA pills keep position but their inset white-highlight shadow stack intensifies (and outer shadow softens) over 300ms — the button looks lit-up rather than lifted. *Reads as:* a physical, pressable surface. *Transfers to:* primary CTAs. *Safety:* **production-safe** (box-shadow). See `glossy-gradient-pill-button`.

Reduced motion: **not respected** (no `prefers-reduced-motion` rules detected). All effects above are low-risk transform/opacity/shadow, but a port should add the reduced-motion guard the site omits.

## Production-safety note
Every technique here is production-safe — no scroll-jacking, no layout-thrashing properties, no motion-sickness risk. The one honest gap is the **missing reduced-motion fallback**; the patterns below add it back.

## Extracted patterns
- `saturated-icon-tile-grid` — vivid rounded-square icon tiles (one black line-icon each) as a scannable feature/capability grid.
- `glossy-gradient-pill-button` — large-radius gradient pill CTA with inset-highlight gloss and a hover shadow-swell.
- `pastel-gradient-section-ground` — full-bleed soft pastel wash per section, color-zoning a long page without dividers.
