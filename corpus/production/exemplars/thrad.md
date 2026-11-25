---
slug: thrad
url: https://www.thrad.ai
source: landbook
corpus: production
surface: site
captured: 2026-10-19
award_type: Gallery
score: null
tags: [ai, adtech, b2b, saas, dsp, warm, editorial, light]
when_to_use: [landing, product-marketing, feature-section, hero, interactive-showcase]
directions: [editorial, minimalist, soft]
layout: [editorial-columns, full-bleed]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: https://land-book.com/websites/101267-thrad-paid-ads-in-ai-the-dsp-for-llms
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [line-draw-connector-reveal, eyebrow-split-masthead]
tokens_snapshot: ../tokens/thrad.json
screenshots: ../screenshots/thrad/
---

## What works (transferable principles)
- **Warm "paper" neutral ground instead of white.** The page bg is `#f2ede9` (a warm oat) with a sibling `#f9f8f7` and a sunken `#e8e2dc` — three warm off-whites a few values apart. White (`#fff`) is reserved for *cards* so surfaces read as objects floating on paper, not panels on a panel. The warmth makes a dense B2B ad-tech page feel like a printed report rather than a dashboard. Transfers to any product-marketing page that wants calm authority over SaaS-blue sterility.
- **One ember accent, rationed.** A single orange (`#ec521b`, ramp 50→800) carries every CTA, eyebrow square, focus ring, and hover recolor; everything else is ink + paper. Scarcity makes the accent read as *action* — the eye tracks it as a wayfinding thread down the page. The restraint is the brand.
- **Hierarchy from scale + tight tracking, not weight.** Display runs light/regular (300–400) at 54–104px with aggressive negative tracking (`-.065em` at hero), while body sits at 16/400. The 4–6× size jump and the optical tightening — not bold weight — create the drama, so headings stay elegant and the page reads quiet even at high information density.
- **A dedicated micro-type scale for embedded product UI.** The fake prompt/rank/bid/deploy cards and the analytics dashboard are typeset on their *own* token ramp (`mock-title 15 · mock-body 13 · mock-label 12 · mock-micro 10`, with `tabular-nums`) separate from the editorial scale. Giving embedded "proof" UI its own small, tabular type system is what makes the mockups read as credible software rather than oversized marketing graphics. Reusable on any page that stages a product demo.
- **Backgrounds do the sectioning — no divider lines, almost no shadow.** The long page is segmented purely by swapping full-bleed band color (`page` → `page-secondary` → `sunken` → dark `ember` canvas). Depth comes from hairline borders (`rgba(10,10,10,.12)`) and glass blur, not drop shadows. Shifting the ground value is a cheaper, calmer rhythm device than rules or cards-in-boxes.
- **Dark "ember" canvas sections for punctuation.** Two moments go near-black-brown (`#2a0e07`) — the phone-on-desk film band and the giant `thrad` wordmark footer over a terrain photo — inverting text to off-white. Rare tonal inversion gives a mostly-light page two memorable beats without a second accent color.

## Design-system read
- **Type:** Inter Variable, single family, weights 300/400/500/600. Rich scale: body 16/lh22, lead 20, h2 40, display 54, display-2xl 104, plus hero `clamp(44px,5.6vw,82px)`. Tracking is size-proportional and negative at display sizes (`-.028em` body → `-.065em` hero); a parallel "mock" ramp (15/13/12/10) + `tabular-nums` serves embedded UI. Hierarchy = scale contrast + optical tracking, never heavy weight.
- **Color:** warm paper grounds (`#f2ede9 / #f9f8f7 / #e8e2dc`), ink ramp (`#111112 / #3a3a3c / #6e6e73 / #a1a1a6`), one ember accent (`#ec521b`, ramp 50–800), dark ember canvas (`#2a0e07`), muted terrain browns (`#866b5b→#d8c3b5`) for the illustrated mountain. Roles are fully tokenized (anchor/strong/emphasis border tiers, surface-glass, success).
- **Spacing rhythm:** 4px base; scale 4·8·12·16·20·24·32·40·48·64·80·96·128. Section rhythm 96 (`--space-section`) / 128. Gutter 40px, `--rail-measure: min(100% − 80px, 1200px)` inside a 1280 container.
- **Layout system:** centered 1280 rail, editorial two/three-column splits (display headline left + lede pushed to a far-right column), heavy flex with grid for the mockups. Breakpoints 810 (tablet) / 1200 (desktop); hero reflows to a bottom-anchored `min-height: 100svh` stack on mobile.
- **Layering / page architecture:** essentially a single flat warm scroll — every content surface is opaque, sectioning is by band color. The z-axis is limited to chrome: sticky header (z50), a skip link (z80), consent banner (z60), and a **fixed scrim at z-index −1** that fades in behind the header only when a nav item opens (CSS `:has()`), dimming the page under the megamenu. The hero's halftone dot-mountain is an absolutely-positioned SVG behind the copy, horizontally mask-faded at the rail edges. No parallax theater.
- **Motion / easing intent:** house easing `cubic-bezier(.44,0,.56,1)` for UI (.15–.4s); a distinct entrance family — `--ease-rise (.22,1,.36,1)`, `--ease-fade (.25,0,.4,1)`, overshoot `--ease-grow (.34,1.4,.64,1)` — at .6–.9s for scroll reveals, plus a slow 2.5s SVG draw. Motion communicates "assembling": content rises, connector lines grow, the network diagram draws itself.
- **Density:** high (nav of ~35 links, multiple embedded UIs, dense dashboard) but kept legible by whitespace bands, the paper ground, and the separate small mock-type scale isolating dense data from editorial prose.
- **Hierarchy:** dominant device is **scale** (massive display vs 16px body), reinforced by the ember accent for action and position (left headline / right lede).
- **Restraint:** no drop shadows to speak of, no gradients in content, no second accent, no parallax, no auto-playing spectacle — one font, one accent, paper + ink.

## Interaction & motion
- **In-view fade-rise, IO-gated** — *Trigger:* in-view. *Mechanism:* `[data-motion-rise]` starts `opacity:0; translateY(24px)` and clears to `opacity:1; transform:none` when an IntersectionObserver (`rootMargin: 0 0 -8% 0`) adds `data-motion-in`; only opacity/transform animate. *Reads as:* content settling into place as you arrive. *Transfers to:* any section entrance. *Safety:* **production-safe** (compositor-only, reduced-motion disables it). See `line-draw-connector-reveal` for the family.
- **Line-grow connector** — *Trigger:* in-view. *Mechanism:* a horizontal rule scales from `scaleX(0)` to `1` (`transform-origin:left`) on the overshoot `--ease-grow`, with a leading dot fading in and a trailing label sliding along `translateX`, sequenced by `--grow-lead`. *Reads as:* a connection being drawn between two labels (Advertisers ↔ Publishers). *Transfers to:* step flows, "how it connects" diagrams. *Safety:* **production-safe**. Pattern: `line-draw-connector-reveal`.
- **SVG stroke draw** — *Trigger:* in-view. *Mechanism:* `[data-motion-draw] .string__reveal` animates `stroke-dashoffset` from the path length to 0 over 2.5s (`--ease-draw`), drawing the converging fan of thin curved lines where the two columns meet. *Reads as:* the network wiring itself together. *Transfers to:* schematic/architecture diagrams, signal-flow graphics. *Safety:* **production-safe** (cheap on a single path; reduced-motion jumps to drawn state).
- **Megamenu scrim via `:has()`** — *Trigger:* hover/focus (nav open). *Mechanism:* a fixed `z-index:-1` scrim transitions `opacity 0→1` when `.site-header:has(.nav__item[data-open="true"])`; no JS. *Reads as:* the page dims so the dropdown owns focus. *Transfers to:* any mega-nav. *Safety:* **production-safe**.
- **Hero logo-row crossfade** — *Trigger:* load/timer. *Mechanism:* logo cells swap via `data-state` (`pre/out`) toggling opacity + a small `translate`, staggered `--i * 45ms`. *Reads as:* a rotating client wall in a fixed footprint. *Safety:* **production-safe**.
- **Micro-interactions** — nav links/buttons recolor ink→ember on hover (.15s); client logos lift from `grayscale(.6)` to full color; cells reveal corner-tick + label. All `--duration-fast`, compositor-cheap.

Reduced motion is **respected** globally: a `prefers-reduced-motion: reduce` block clamps all transition/animation durations to ~0 and the reveal system only arms under `no-preference`.

## Production-safety note
- Everything here is **production-safe**: reveals animate only `opacity`/`transform`, the SVG draw is a single path, and reduced-motion is fully honored. Watch the **tap targets** — the probe flags 54 of 125 interactive elements as small (dense nav + mock-UI controls); enforce 44px hit areas when porting. The 2.5s draw is long; keep it to one hero diagram, not every section.

## Extracted patterns
- `line-draw-connector-reveal` — IO-gated entrance family (rise / line-grow / SVG stroke-draw) that makes sections "assemble" on scroll; reduced-motion-aware.
- `eyebrow-split-masthead` — accent-square eyebrow + large light-weight display headline on the left, lede pushed to a far-right column, over a warm tinted band.
