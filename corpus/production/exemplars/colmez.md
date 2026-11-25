---
slug: colmez
url: https://www.colmez.com
source: landbook
corpus: production
surface: site
captured: 2026-10-19
award_type: Gallery
score: null
tags: [b2b, saas, dark, industrial, data, security]
when_to_use: [landing, product-marketing, feature-section, hero]
directions: [brutalist, editorial]
layout: [scroll-theater, editorial-columns]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high]
provenance:
  gallery_url: https://land-book.com/websites/101080-colmez-powering-next-generation-hazardous-waste-teams
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [blend-difference-pinned-chrome, cta-text-wash-hover]
tokens_snapshot: ../tokens/colmez.json
screenshots: ../screenshots/colmez/
---

## What works
- **The chrome auto-inverts instead of recoloring.** The entire nav — oversized `COLMEZ` wordmark left, mustard `BOOK A MEETING` tab right — lives in one `position:fixed; inset:0; z-50; mix-blend-difference` layer with `pointer-events:none` (a sibling layer re-enables clicks). Because it is a difference-blend layer, the wordmark reads crisp white over the near-black hero and flips to pure black the instant the light team section scrolls under it — no scroll listener, no section-aware class toggling, no solid bar. One mechanism guarantees legibility across every background. Transfers to any transparent pinned header that must cross light and dark regions; the cost is you get inversion, not arbitrary brand colors (see `blend-difference-pinned-chrome`).
- **A single ultra-black wordmark carries the whole brand; everything else is restrained.** Hierarchy is scale, not weight-soup: section heads and body run at a calm medium-weight grotesque, and the only heavy ink on the page is the compressed 900-weight `COLMEZ` logotype — in the hero it fills the full viewport width edge-to-edge, and it reappears giant in the footer over a topographic texture. One loud mark + otherwise quiet type makes an industrial-waste B2B tool feel like a flagship product. Transfers to brand-forward landings that want impact from one element rather than from color or many weights.
- **Type scales off one viewport unit — no clamp tiers.** Every size is `calc(N * var(--u))` where `--u: calc(100vw / 1496)`, i.e. the design is drawn at 1496px and scales linearly with the viewport. `--fs-hero: calc(48*u)`, `--fs-claim: calc(56*u)`, `--fs-body: calc(20*u)`, `--fs-caption: calc(14*u)` — a whole fluid system from one token, with tracking tightening as size grows (−2% at display). It keeps proportions pixel-identical at every width without authoring breakpoint ramps. Transfers to any design that was comped at a fixed width and wants honest fluidity (watch the floor — pin `--u` below a min width so body text never gets too small).
- **Sections pin and stack like a theater, and the footer is a curtain.** Content sections are `md:sticky md:top-0 md:h-screen` inside tall scroll tracks (`h-[430vh]`, `calc(1022*u + 210vh)`); each pins while the next scrolls up over it, and the `footer` is `sticky bottom-0 z-0`, so the whole page scrolls *off* to reveal the fixed footer underneath. Depth comes from z-stacking and overscroll, not shadows. Reads as deliberate, cinematic pacing for a long narrative. Transfers to story-driven landings — gate it to `md:` and keep a flat mobile fallback (this site does). Spectacle-adjacent: budget it.
- **Editorial numbered rows replace the three-feature-card grid.** Problems are a ruled sequence — index `001 / 002 / 003`, a big head and a small paragraph on the left, a wide full-bleed image band on the right — separated by hairlines, nothing boxed. The same ledger logic runs the "every buying signal" list and the team roster. It reads as a spec sheet, not a brochure, and sidesteps the generic feature-card template entirely. Transfers to any feature/problem section that wants authority over decoration.
- **Color is quarantined to one mustard accent and the imagery.** The palette is two values — near-black paper `#121212` and white ink — plus a single olive/mustard accent `#ae9a29` reserved for the CTA, index chips, and data highlights. All other saturation lives inside the aerial hazardous-waste photography (black debris flecked with the same yellow) and the glowing map pins, so the photos and the UI read as one system. Transfers to any product where the imagery is loud and the frame must not compete.

## Design-system read
- **Type:** Two variable grotesques. `brandSans` (weight axis 300–900) is the display/editorial voice — section heads at a medium weight, the `COLMEZ` wordmark at a compressed ~900 black. `productSans` (100–900) carries body copy and the dense fake product-UI (tabular-nums figures). Fluid scale from one unit `--u = 100vw/1496`: caption 14, body/list-row 20, cta 16, person 32, item-title 40, statement 44, hero/section-head/quote 48, claim/team-head 56 — all `× --u`. Tracking is negative and size-linked (−0.62px at 30px → −1.08px at 54px). Hierarchy = scale + the one heavy mark, never a weight ladder.
- **Color:** Ground `--paper #121212`, ink `--ink #fff`; one accent `--accent #ae9a29` with `--accent-deep #38360d` and `--accent-foreground #fff`. Surfaces `--surface #313131` / `--surface-strong #454748`; light sections `--paper-ink #fff` + `--paper-muted #ebebeb`. Muted ramp `#8e8e8e / #b0b0b0 / #737373`; lines `--line #313131`, `--line-soft #73737333`, `--line-light #e3e3e3`. Semantic data states exist (`--capture-weak #c64237` red, `--capture-strong #dfa32f` amber) used only inside the demo graphs. Several in-UI colors are derived relationally with `oklch(from var(--ink) …)`.
- **Spacing rhythm:** 8px base for component gaps (gap:8 dominant), with layout distances expressed in `--u` so padding scales with the comp. Whitespace is heavy and intentional — vast black margins around sparse content per screen.
- **Layout system:** Flex-dominant (438 flex / 3 grid). Feature rows are a 2-column editorial split (text | wide image). Breakpoints at 767/768 — effectively one desktop/mobile switch; mobile collapses the sticky theater to a flat stacked scroll. Design width 1496px.
- **Layering / page architecture:** NOT flat — this is the signature. `has_blend_overlay:true`: a full-viewport `fixed z-50 mix-blend-difference` chrome layer sits over everything. Below it, content sections are `md:sticky` pins inside tall tracks that scroll over one another, and the `footer` is `sticky bottom-0 z-0` as a reveal-from-under curtain. Depth is z-order + overscroll, not elevation; the only box-shadow on the page is the inset accent ring on the CTA.
- **Motion / easing intent:** House transition `0.36s cubic-bezier(0.32,0.72,0,1)` (smooth ease-out) with a fast `0.16s` variant and a `0.55s cubic-bezier(0.33,0,0.2,1)` CTA wash. 339 generated `@keyframes` (`vg-k1…k54`, `demo-sheet-in`, `cta-wash`, `spin`, `pulse`) drive canvas product demos and glowing pins via rAF (184 calls). Motion communicates — words arrive, images grow from a seed, the CTA sweeps — rather than demoing itself. Reduced motion respected (6 PRM rules).
- **Density:** Low per-screen density (one idea at a time, lots of black) wrapping a very high-density embedded product UI; the calm frame makes the dense demo legible.
- **Hierarchy:** Scale first, then position (numbered index chips), then the single accent. Weight is used exactly once (the wordmark).
- **Restraint:** Two colors, no gradient chrome, no drop-shadow cards, no feature-card grid, no second accent hue — and the giant type is confined to the wordmark so the body stays quiet.

## Interaction & motion
- **Blend-difference pinned chrome** — *Trigger:* scroll-progress (passive). *Mechanism:* the fixed nav sits in a `mix-blend-difference` layer, so its color is computed against whatever pixels scroll beneath it; white over dark, black over light, automatically. *Reads as:* chrome that is always legible and feels "aware" of the page. *Transfers to:* any transparent sticky header crossing mixed backgrounds. *Safety:* **production-safe** (no JS, no reflow; one GPU-composited blend layer — verify contrast on mid-grey sections). See `blend-difference-pinned-chrome`.
- **CTA gradient text-wash on hover** — *Trigger:* hover. *Mechanism:* an `@property --cfill` animated percentage drives a `background-clip:text` gradient that sweeps ink→accent→translucent across the button label. *Reads as:* a crisp, premium "charge-up" without moving layout. *Transfers to:* primary CTAs, nav links. *Safety:* **production-safe**, animates a custom property + clipped gradient only; reduced-motion disables it. See `cta-text-wash-hover`.
- **Word-by-word in-view reveal** — *Trigger:* in-view. *Mechanism:* each headline word (and each chemical-list token) is its own span, faded + risen when an IntersectionObserver (`threshold 0.01`, `rootMargin 0 0 -12% 0`) crosses it; 15 observed targets across 5 observers. *Reads as:* the headline assembling as you arrive. *Transfers to:* hero and section headlines. *Safety:* **production-safe** (opacity/transform, IO-gated; reduced-motion jumps to end state).
- **Sticky-stacked section theater** — *Trigger:* scroll-progress. *Mechanism:* sections are `md:sticky md:top-0 md:h-screen` inside tall tracks (430vh, 210vh); they pin while the next scrolls over, and the footer is `sticky bottom-0` to reveal from under. *Reads as:* cinematic, paced narrative. *Transfers to:* story landings. *Safety:* **spectacle-only** — hijacks scroll length/feel; gate to `md:`, keep a flat mobile fallback, respect reduced-motion.
- **Scroll-progress image/parallax reveals + canvas demos** — *Trigger:* scroll-progress. *Mechanism:* image bands scale up from a tiny glowing seed and translate with scroll progress (23 transform/parallax effects); 18 `<canvas>` elements render the product dashboards and map pins on rAF loops. *Reads as:* live, product-is-real energy. *Safety:* **spectacle-only** for the canvas demos (main-thread/rAF cost); the image grow-in is cheap transform/opacity.

## Production-safety note
- **production-safe:** blend-difference chrome, CTA text-wash, word-by-word IO reveal, image grow-in (transform/opacity only).
- **spectacle-only:** sticky-stacked theater (scroll-length hijack, disable on mobile), canvas product demos + animated map pins (184 rAF calls, 18 canvases — lazy-mount and pause offscreen). Reduced motion is respected site-wide; keep it that way.

## Extracted patterns
- blend-difference-pinned-chrome — a fixed nav that auto-inverts over light and dark sections via one blend layer; reuse for transparent sticky headers crossing mixed backgrounds.
- cta-text-wash-hover — `@property`-driven gradient sweep clipped to a button label on hover; reuse for premium primary CTAs and nav links.
