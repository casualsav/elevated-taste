---
slug: societies
url: https://societies.ai
source: landbook
corpus: production
captured: 2026-10-26
award_type: Gallery
score: null
tags: [ai, b2b, research, editorial, enterprise]
when_to_use: [landing, product-marketing, feature-section, hero, interactive-showcase]
directions: [editorial, minimalist]
layout: [scroll-theater, full-bleed]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: https://land-book.com/websites/101530-artificial-societies-understand-people-make-better-decisions
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [pinned-scrub-list-focus, fullbleed-photo-interlude]
tokens_snapshot: ../tokens/societies.json
screenshots: ../screenshots/societies/
---

## What works (transferable principles)
- **Serif-display / grotesque-body pairing carries the whole hierarchy.** A single-weight transitional serif (Martina, `dlig` ligatures on) does every expressive moment — the hero line, the methodology word-list, the solution names — while a neo-grotesque sans does all functional text (nav, body, labels, buttons). Register, not weight, signals importance: everything ships at weight 400, so the serif/sans *switch* and the scale jump (16px body → 48–80px display, a 3–5× leap) do the ordering. Transfers to any brand that wants "institutional, considered" without going heavy or loud.
- **Muted-vs-full-strength is the primary emphasis device.** The palette is nearly monochrome — porcelain ground `#f4f4f0`, off-black ink `#1c1a16`, one warm grey `#8c8880`. Emphasis is created by *dimming the context*: in every stacked list exactly one row sits at full off-black and the rest drop to the warm grey. You get the information scent of tabs/menus with zero chrome (no borders, no active pill, no accent fill). Transfers to any index, nav, pricing tier list, or feature menu.
- **Color lives in the imagery, never in the UI.** All saturated hue (terracotta, sage, oxblood, midnight) is confined to framed painterly artworks and full-bleed photographs; the interface chrome stays achromatic. This lets the content be vivid while the system reads calm and premium — the opposite of a saturated-accent SaaS template. Transfers wherever you have rich media and want the frame around it to disappear.
- **Extravagant whitespace as pacing.** Sections are separated by 200–240px of vertical gap (`page-stack` gap `12.5–15rem`) and most content sits in a 560–680px measure centered in an 1800px field. The emptiness is the luxury signal and it makes a dense B2B pitch read slowly and confidently. Transfers to editorial landing pages that want gravitas over density.
- **Full-bleed cinematic interludes break the reading rhythm.** Between content blocks, tall edge-to-edge photographs (a stone colonnade, a tree-lined allée) run as "breathing" bands with a single quiet overline caption. They reset attention and give the long page a magazine cadence instead of an endless feature stack. Transfers to any long-scroll narrative page.
- **Scroll pins a stage, then scrubs focus through it.** Key sections become sticky `scroll-pin-stage` panels that hold while you scroll, and scroll position advances which list row / which paired artwork is "active." The scroll becomes a dial, not just a conveyor — the reader feels they're operating the page. Transfers to methodology walk-throughs, product capability tours, stepped stories.

## Design-system read
- **Type:** two families, one weight. Serif *Martina* (`--font-serif`, 300–900 variable but used at 400 with discretionary ligatures) for display; neo-grotesque *grotesk* (`--font-sans`) for everything functional. Fluid-ish stepped scale via CSS vars: body 16/14/12, then h5 24 · h4 32 · h3 40 · h2 48 · h1 60 · h1-plus 80 (desktop); the scale compresses on mobile (h1 40, h4 20). Hierarchy = family switch + scale contrast, never weight.
- **Color:** monochrome-warm system. Ground porcelain `#f4f4f0`, ink `#1c1a16`, single muted grey `#8c8880` (= inactive/secondary), white surfaces, light-grey `#e6e6e4` hairlines. A deep *oxblood* `#270802` themes the mobile menu. Saturated hues (terracotta `#732110`, ember `#ef4800`, sage `#577662`, midnight `#111b31`, limestone `#d6cfbe`) exist only inside artwork/photography, never as UI fill.
- **Spacing rhythm:** base `0.25rem` with an 8/12/20px working rhythm for components; section rhythm is enormous — `page-stack` gap `12.5rem` → `15rem`, section padding to 240px. Gutters via `--grid-margin: calc(5vw + 6px)`; text measures `--measure-copy: 560px`, `--measure-article: 680px`.
- **Layout system:** 12-col desktop / 6-col mobile, `--content-max-width: 1800px`. The page is a vertical `page-stack` of centered editorial blocks interleaved with two things: full-bleed image bands and sticky `scroll-pin-stage` panels. Flex-dominant (132 flex vs 19 grid). Breakpoints at 500 and 768px. `content-visibility: auto` on stack children for long-page perf.
- **Layering / page architecture:** mostly a single flat light scroll — `has_static_backdrop: false`, `has_blend_overlay: false`, every section transparent. Depth comes from *stickiness*, not z-stacked worlds: a `pointer-events-none` sticky header (z-40) floats over content, and two `scroll-pin-stage` panels (100vw × ~93vh) pin while their contents scrub. A fixed oxblood mobile-menu layer (z-50) and a dialog (z-60) sit above, inert until opened. Full-bleed photos are in normal flow, not fixed backdrops.
- **Motion / easing intent:** restrained and functional. Durations 150 / 300 / 600ms; easing `ease` and `cubic-bezier(.4,0,.2,1)`. Motion exists to *reveal content in reading order* and *tie focus to scroll* — never decorative spectacle. `prefers-reduced-motion` is honored throughout (9 PRM rules; reveals fall back to static).
- **Density:** low by choice. Big measures, big gaps, one idea per screen in the pinned stages — a deliberately slow, high-trust read for an enterprise/research audience.
- **Hierarchy:** dominant ordering device is **register + scale + opacity-dimming**, in that order. Position (centered vs left-rail) is secondary.
- **Restraint:** no gradients-on-text, no glass, no saturated accent in chrome, no shadows beyond one faint card shadow, no multiple weights, no bold. The spectacle is outsourced entirely to photography and painting.

## Interaction & motion (techniques)
- **Pinned scroll-scrub focus list** — *Trigger:* scroll-progress inside a sticky stage. *Mechanism:* a section becomes `position: sticky` (`scroll-pin-stage`, `top: var(--nav-height)`); as the page scrolls past it, scroll offset maps to an active index and exactly one stacked serif row is set to full ink (`#1c1a16`) while the rest sit at the muted grey (`#8c8880`) — on the Solutions stage the active row also swaps the paired framed artwork. *Reads as:* "I'm turning a dial through the method / capabilities." *Transfers to:* methodology tours, capability menus, stepped narratives. *Safety:* **production-safe** (opacity/color only, but uses a sticky stage + scroll listener; keep to a few per page). See `patterns/pinned-scrub-list-focus.md`.
- **In-view staggered reveal (`reveal-group`)** — *Trigger:* in-view via IntersectionObserver (5 observers, 52 targets, rootMargin `200px`). *Mechanism:* a container flips `data-reveal="in"`; children carrying `reveal-up/-fade/-left/-right` run their keyframe with `animation-delay: calc(var(--reveal-index) * var(--reveal-beat, 60ms))`, so items cascade in reading order. Resting state in the DOM is the final state (animation `play-state: paused` until in-view). *Reads as:* content arriving calmly, top-to-bottom. *Transfers to:* any section entrance. *Safety:* **production-safe**; PRM disables it to the end state.
- **Full-bleed photo parallax** — *Trigger:* in-view/scroll. *Mechanism:* the cinematic interlude images drift at a slightly different rate than the page (transform on an in-flow full-bleed figure). *Reads as:* cinematic depth between chapters. *Transfers to:* editorial section breaks. *Safety:* **production-safe** (transform only); see `patterns/fullbleed-photo-interlude.md`.
- **Staggered load reveal of the hero** — *Trigger:* load. *Mechanism:* hero words fade up in two beats (300ms, 500ms) then the sub-paragraph + nav at 800ms — a short opacity cascade, not a long intro animation. *Reads as:* the page settling, once. *Safety:* **production-safe**.
- **Micro feedback only on hover** — *Trigger:* hover. *Mechanism:* links shift ink → warm grey (`--opacity-hover-text: 50%`), buttons drop to 0.5 opacity; a small question-glyph wave and an announcement-bar "chase" opacity loop are the only ambient loops. *Reads as:* quiet, precise. *Safety:* **production-safe**.

Reduced motion is respected (`respectsReducedMotion: true`, 9 PRM rules); the ambient glyph/announcement loops and all reveals collapse to static end states under `prefers-reduced-motion: reduce`.

## Production-safety note
Everything here is production-safe. The only costs to watch: the sticky `scroll-pin-stage` panels pair with scroll listeners (11 on the page) + a persistent rAF loop — fine at this count, but don't multiply pinned stages; and the hero relies on web-font load for the serif register, so ship a tuned fallback (the site declares `martina Fallback`) to avoid a register-shifting FOUT.

## Extracted patterns
- `pinned-scrub-list-focus` — a sticky-pinned stage whose scroll progress advances a single "active" row in a stacked editorial list (optionally swapping a paired visual); emphasis by dimming, no chrome.
- `fullbleed-photo-interlude` — an edge-to-edge cinematic image band with a gradient-anchored overline caption, used to pace a long editorial scroll.
