---
slug: userflow
url: https://userflow.com
source: manual
corpus: production
captured: 2026-08-31
award_type: null
score: null
tags: [saas, b2b, product-adoption, onboarding, ai, playful, light]
when_to_use: [landing, product-marketing, feature-section, hero, onboarding]
directions: [soft, minimalist]
layout: [split-hero, scroll-theater]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [sticky-stack-recede, audience-tinted-collage-panel]
tokens_snapshot: ../tokens/userflow.json
screenshots: ../screenshots/userflow/
---

## What works
- **Elevation by outline, not shadow.** Nearly every card, button, and inset panel wears a single 1px near-black stroke (`rgb(20,20,20)` appears as a border 1044×; the page has only two real box-shadows). The result is a flat "sticker" surface language that reads crisp and intentional at any density, prints/scales cleanly, and never muddies pastel fills the way soft shadows do. Transfers to any product-marketing page that wants a friendly-but-precise look without the default SaaS drop-shadow haze.
- **Semantic color-coding by audience.** The "Built for customer-obsessed teams" band gives each persona its own pastel hue — Product & Growth = mint, Customer Success = powder blue, Customer Marketing = lavender — and repeats the *identical* layout inside each. Color becomes wayfinding: the reader navigates a long page by hue, not by re-reading headings. Reusable anywhere you present the same structure to multiple segments (personas, plans, verticals).
- **Scale contrast in one family does the hierarchy.** A single typeface (Figtree) runs the whole page; hierarchy comes from a ~4× jump (16px body → 64px display) plus size-proportional negative tracking (−0.02em at 64px, easing to neutral at body), never from exotic weights. Calm and legible even in dense bento sections. Transfers to any system that wants range without a second font.
- **Warm off-white ground instead of pure white.** The page sits on `#fffdf8`/`#faf5f0` cream, not `#fff`. That single decision makes the bright pastel tiles and blue accent read as deliberate rather than like a loud prototype, and softens the black outlines. A cheap, high-leverage move for any bright-accent palette.
- **Two distinct inks for two jobs.** Warm near-black `#141414` carries body copy and every outline; cool navy `#121941` carries the big headings. The temperature split gives display type quiet authority without a color the brand has to "spend." Transfers to any type system that wants headings to feel weightier than a single ink allows.
- **Scroll used to focus, not to perform.** The signature motion is a sticky-stacking card deck: each full-bleed audience panel pins, the next slides up to cover it, and the covered card scales down slightly and dims. It sequences a long section into one-at-a-time focus while staying calm and reversible — spectacle serving comprehension, not replacing it.

## Design-system read
- **Type:** One family, Figtree (300–900 loaded). Scale ~12 / 14 / 15 / 16 / 18 / 20 / 24 / 28 / 36 / 44 / 56 / 64px — roughly a major-third ramp with a big body→display leap (16→64, ~4×). Body 15–16px at 1.5 leading; display 64px at 1.0 leading (set solid). Tracking is size-proportional: −1.28px (−0.02em) on display, easing to a hair *positive* (+0.1px) on 15px UI text. Hierarchy = scale + tracking, weight stays at bold/semibold for headings.
- **Color:** Warm cream ground (`#fffdf8`, `#faf5f0`) · white card surfaces · warm-black ink `#141414` (body + all outlines) · navy `#121941` (headings) · slate `#52577a` (secondary). One true accent: blue `#2a4eef`, deepening to `#1032cf` on hover/links. A pastel *tint* set — mint `#d5fec0`, powder blue `#d1e5ff`, lavender `#d7d4ff`, cream `#f4ebe1` — each paired with a matched darker border, used to code audiences and to back product illustrations. Orange `#fe784e` is a rare spark accent.
- **Spacing rhythm:** 8px-family base with a generous section rhythm (large 64–124px block padding); card interiors run 24–32px. Whitespace is used at section scale to keep dense bento clusters from crowding — the tiles are tight, the gaps between sections are big.
- **Layout system:** 1440px max container (also 936/1140 for narrower reading columns); flex-dominant (500 flex vs 35 grid nodes). Split-hero up top, then alternating bento clusters, a sticky-stacking audience deck, a tinted testimonial band, and an FAQ disclosure. Grids are 1fr/1fr and 2- to 4-up, collapsing to one column on mobile; h1 64→52px. Breakpoints at 479/767/991/1279/1440.
- **Layering / page architecture:** Mostly a single flat scroll on a cream ground — `has_static_backdrop:false`, `has_blend_overlay:false`. Depth is authored in two local places: (1) a sticky nav whose `navbar7_component-bg` layer is a full-viewport `backdrop-filter: blur(7px)` curtain that fades from opacity 0 as you leave the hero; (2) the `stacked-cards_item` deck, sticky siblings at z 1/2/3 that pin and overlap. No parallax world behind the page — the drama is confined to those two components.
- **Motion / easing intent:** Short and gentle — 200/300/400ms on `ease`/`ease-in-out`, one 1.5s `cubic-bezier(0.25,0.1,0.25,1)` for the marquee. Motion communicates *sequence and focus* (which card you're on), never spectacle. Reduced-motion is respected.
- **Density:** High information density (bento tiles, feature quads, multi-panel audience sections) kept legible by the uniform outline weight (separates cells the way whitespace would), one type family, and the calm cream ground.
- **Hierarchy:** Scale first, then color-coding, then position. Weight is nearly constant.
- **Restraint:** No drop-shadow elevation, no gradient heroes, no second typeface, no dark mode, one accent hue. Playfulness comes entirely from pastel tints + rounded outlines, not from effects.

## Interaction & motion
- **Sticky-stack recede** — *Trigger:* in-view / scroll-progress. *Mechanism:* consecutive full-bleed panels are `position: sticky` siblings at increasing z-index; as the next panel scrolls up to cover the current one, GSAP ScrollTrigger drives the covered card `transform: scale(1→~0.92)` and `filter: brightness(1→~0.9)` (the card carries `transition: transform .2s, filter .2s`). *Reads as:* a deck of cards you page through, one in focus at a time. *Transfers to:* long persona/plan/step sections that would otherwise be an endless scroll. *Safety:* **production-safe** — transform+filter only (compositor-friendly), deltas are tiny (≤0.08), resting state is a correct flat stack. See `patterns/sticky-stack-recede.md`.
- **Duplicated-track logo marquee** — *Trigger:* load. *Mechanism:* the `trusted_by_track` translates continuously via the `trustedMarquee` keyframe (1.5s-scale linear loop) with edge fade-out gradients masking the wrap. *Reads as:* social proof in motion without a static wall of logos. *Transfers to:* any trusted-by / integrations strip. *Safety:* **production-safe** (single transform loop; pausable). Covered by existing `patterns/duplicated-track-marquee.md`.
- **Cursor-parallax logo constellation** — *Trigger:* hover/mousemove. *Mechanism:* the "works with your existing stack" section scatters `random-logo` app icons that each translate a few px toward/away from the pointer via a mousemove-driven rAF (12 mousemove listeners, 5 cursor-tracked nodes). *Reads as:* a live, tactile field of integrations. *Transfers to:* integration/partner showcases wanting playful life. *Safety:* **spectacle-only** — continuous mousemove + rAF is main-thread work and pure decoration; gate behind reduced-motion and keep displacement small.
- **Disclosure icon rotate** — *Trigger:* in-view/click. *Mechanism:* FAQ `faq3_icon-wrapper` rotates 180° on open. *Reads as:* standard accordion affordance. *Safety:* **production-safe**.
- **Sticky-nav blur curtain** — *Trigger:* scroll-progress. *Mechanism:* a fixed full-viewport `backdrop-filter: blur(7px)` layer behind the nav fades from opacity 0 as the hero leaves, giving the bar a frosted ground only once content sits under it. *Reads as:* nav that "activates" on scroll. *Safety:* **production-safe** (opacity of one fixed layer). Related: `patterns/glass-nav-blur-curtain.md`.

## Production-safety note
- Everything is production-safe except the **cursor-parallax logo constellation** (spectacle-only: continuous mousemove/rAF main-thread cost, decorative). Reduced-motion is respected globally; alt coverage is complete (img_alt_ratio 1.0); focus-visible outlines are present (2px `#1032cf`). Watch tap targets: 51 small interactive targets were flagged.

## Extracted patterns
- `sticky-stack-recede` — full-bleed panels that pin and stack, the covered card scaling down + dimming, to page a long section one panel at a time.
- `audience-tinted-collage-panel` — a persona section that pairs a display heading + outlined-sticker feature bento with a hue-matched rounded photo tile carrying floating product-UI chips; the pastel hue codes the audience.
