---
slug: apple
url: https://www.apple.com
source: editorial-pick
corpus: production
surface: site
captured: 2026-07-10
award_type: Editorial pick (canonical consumer-hardware retail front page)
score: null
tags: [consumer, hardware, retail, ecommerce, glass, light, product-marketing]
when_to_use: [landing, product-marketing, hero, navigation, ecommerce]
directions: [minimalist, soft]
layout: [full-bleed, center-stack]
a11y: [reduced-motion-ignored, focus-visible, alt-coverage-high]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [billboard-tile-stack, glass-nav-blur-curtain]
tokens_snapshot: ../tokens/apple.json
screenshots: ../screenshots/apple/
---

## What works (transferable principles)

- **Two optical cuts of one family, and the tracking sign flips between them.** Body and UI text run in a *Text* cut with **negative** tracking (17px → -0.374px ≈ -0.022em; 12px → -0.01em); headlines run in a *Display* cut with **near-zero-to-positive** tracking (21px → +0.011em, 28px → +0.007em, 56px → -0.005em). This inverts the usual "bigger = tighter" reflex, and it is correct: small text needs tightening to hold a word together, large text needs air to stop letters from clotting. Transferable rule — if your family ships optical sizes (SF, Inter Display/Text, Roboto Flex), pair them and let tracking follow *optical size*, not a single global em value.

- **Semantic colors ship as fill/glyph pairs, not as one hex.** Every semantic hue exists twice: a saturated `fill` value for surfaces and a darkened `glyph` value for text and icons on white — green `#03a10e` fill / `#008009` glyph; orange `#f56300` fill / `#b64400` glyph; blue `#0071e3` fill / `#0066cc` glyph. Contrast is then a property of the token system, not of the designer's memory: you can never accidentally set 3:1 body text because the text token was pre-darkened. This is the single most copyable idea on the page and it drops into any design system unchanged.

- **Chrome text is ink-with-alpha, never a gray hex.** Nav links are `rgba(0,0,0,0.8)` and hover to `rgba(0,0,0,1)` — the hover state *raises alpha*, it doesn't switch color. Because the value is a tint of the ground, the same nav renders correctly over white, over `#f5f5f7`, and (with the alpha flipped to white) over a dark hero, with one variable change instead of a second palette. Transfers to any header/footer/overlay that must sit on unpredictable grounds.

- **The page is a stack of self-contained billboards, not a scroll narrative.** Each product gets one full-bleed tile at a fixed content height (~692px hero, ~580px promo), with copy anchored at the *top* of the tile and the product photo bleeding out of the *bottom*. Grounds alternate white / `#f5f5f7` so the seams read without a single divider rule. Below the fold the same tile is halved and paired 2-up on a ~13px gutter. One primitive, three densities — that's why a 5,800px page needs no section headers to stay navigable.

- **A twin-CTA pair does the work of a decision tree.** Every tile carries exactly two pills: a filled blue "Learn more" and an outlined blue "Buy/Shop". Same size, same radius, different weight of commitment — the user never has to read to know which one is the low-risk click. Reuse anywhere a section serves both a browser and a buyer; it beats one CTA plus a text link because both affordances stay tappable.

- **Full-round pills (`980px` radius) as the only shape language.** There are effectively three radii on the page: `980px` (every button/control, 35 occurrences), `8px`/`5px` (a handful of media cards), and nothing else. No card frames, no borders, no shadows except one soft drop on the floating gallery tiles. The product photography carries all the visual interest; the chrome refuses to compete. Restraint by inventory: cap your radius set at three and elevation at one.

- **Glass is used exactly once — where the layering is real.** The only `backdrop-filter` on the page is on the fixed 44px nav (`saturate(180%) blur(20px)`) and its full-viewport blur curtain. Because nothing else is translucent, the blur *means* "this floats above your content." Glass used everywhere means nothing; glass used once is a z-index annotation.

## Design-system read

- **Type:** SF Pro Text (body/UI) + SF Pro Display (≥~20px), one superfamily, weights **400 and 600 only** (700 appears 6× — effectively absent). Observed ramp: 12 / 14 / 17 / 21 / 24 / 28 / 40 / 44 / 56px — a ~3.3× body-to-display range, small for a marketing page. Leading collapses with size: 17/25 (1.47) for body, 24/28 (1.17), 40/44 (1.1), 56/60 (1.07). Tracking is **size-proportional but sign-flipping** (see principle 1). No fluid type (`clamp()`) at all — the ramp steps at breakpoints instead. Hierarchy = scale + leading, with weight as a binary (400 prose / 600 labels).
- **Color:** Ground white `#ffffff`; tertiary fill `#f5f5f7` (the alternating band); secondary fill `#fafafc` (nav-open ground). Ink `#1d1d1f` — never `#000`; secondary `#333336`; muted `#6e6e73`; tertiary glyph `#86868b`. Accent blue splits by role: **fill** `#0071e3` (buttons, focus ring) vs **glyph/link** `#0066cc`. Semantics carry the same fill/glyph split: red `#e30000`/`#e30000`, green `#03a10e`/`#008009`, orange `#f56300`/`#b64400`, plus `#af1e2d` (product red) and `#00d959` (environment green). Alpha ramp for chrome: `rgba(0,0,0,0.88 / 0.72 / 0.56 / 0.48 / 0.16 / 0.08)` — one channel, six roles.
- **Spacing rhythm:** No clean 8px grid — this is a **17px-typographic** rhythm. Control padding is 7–9px block × 11px inline (which is why 236 tap targets land under 44px). Section block padding runs 40 / 53 / 56px; tile gutters are 12–14px. Section *height* is set by a token (`--hero-content-height: 692px`, `--promo-content-height: 580px`), not by content flow — the billboards are fixed stages, and the copy is positioned inside them.
- **Layout system:** A 12-column flex grid (`flex-basis: 8.333%` steps, `-offset-`/`-order-` utilities) inside a **1024px** content container (980px for legal/footer). Breakpoints at **734 / 1068 / 1441** with a secondary nav set at 833/834. Structurally the page is 29 grids to 205 flex containers — flexbox does the work, grid only where 2-up tiles need it. Mobile collapses every tile to full-width single column and the nav from 77 links to 3 behind a hamburger.
- **Layering / page architecture:** Nearly flat. `has_static_backdrop: false`, `has_blend_overlay: false`, zero `mix-blend-mode`, no parallax. Exactly **three fixed layers**, all chrome: the message aside and the nav at `z: 9999`, and a full-viewport curtain (`rgba(232,232,237,0.4)` + `blur(20px)`, `opacity: 0`) at `z: 9998` that only materializes when a nav flyout opens. Content z-indices stay in a 1–4 band. Every content `<section>` is transparent and simply inherits the body ground — the alternating bands come from the *tiles*, not the sections. Depth is created once, by the nav, and nowhere else.
- **Motion / easing intent:** Durations 140 / 160 / 180 / 200 / 220 / 240 / **320**ms; the house easing is `cubic-bezier(0.4, 0, 0.6, 1)` (a symmetric ease-in-out) on 205 declarations, with bare `ease` on 97 and `steps(1)` used deliberately to snap `visibility` at the end of an opacity fade. Stagger delays 80→260ms in 20–40ms increments. All 30 `@keyframes` belong to the nav flyout and the gallery dot-nav — **there is no scroll choreography on this page at all**. Motion exists to make disclosure legible, not to entertain.
- **Density:** Low above the fold (one product, one line of copy, two buttons per screen), extremely high in the footer (77 nav links + a 5-column sitemap). The switch is handled purely by type size — 17px billboard copy vs 12px footer — and it works because the 12px text is set in the Text cut with tightened tracking.
- **Hierarchy:** **Scale**, then **position** (copy always top-anchored in its tile). Color and weight are almost never used for emphasis; the single blue is reserved for "you can act on this."
- **Restraint:** No gradients on text surfaces, one shadow value in the whole page, no borders on cards, no dark mode (`color_scheme: normal`; the dark tokens exist but only for embedded nav themes), no serif, no third font, no `clamp()`, no scroll animation, no hero video. The photography is the only maximalist element.

## Interaction & motion

The homepage is **effectively static on scroll** — and that is the finding, not an omission. Frame-diffing produced exactly **2 scroll effects, both `position: fixed` pins** (the nav and its curtain). No parallax, no in-view reveals on content, no scroll-progress transforms. The 3 IntersectionObservers and 176 rAF calls belong to the media gallery and the lazy image swap; the 6 "entrance" opacity changes are the footer link list fading in at ~150ms as the progressive-image class resolves. All **30 `@keyframes`** are named for two subsystems — `globalnav-flyout-slide-*`, `globalnav-search-fade-and-slide`, `globalnav-scrim-height-change`, `globalnav-chevron-slide-in-hover` — and `dotnav-timed-dot-expand` / `dotnav-shift-*` / `progress-indicator-animating`. **`prefers-reduced-motion` is not respected (0 PRM rules)**, though the motion budget is so small the exposure is limited to the flyout and the auto-advancing gallery.

- **Translucent pinned nav + full-viewport blur curtain** — *Trigger:* load (pin) → hover/focus (curtain). *Mechanism:* a 44px `position: fixed` bar with `backdrop-filter: saturate(180%) blur(20px)` over `rgba(250,250,252,0.8)`; opening a menu fades a sibling full-viewport layer (`opacity 0→1`, 320ms, `cubic-bezier(0.4,0,0.6,1)`, 80ms delay) that blurs the entire page behind the flyout. `visibility` is switched with `step-end`/`step-start` so it never intercepts clicks mid-fade. *Reads as:* the site steps back so the menu can step forward. *Transfers to:* any mega-menu, command palette, or filter drawer. *Safety:* **production-safe**; cost is a full-viewport `backdrop-filter` composite while open — Apple itself drops the blur on `max-width: 833px` rather than pay it on phones. → `glass-nav-blur-curtain`.

- **Alpha-ramp hover on chrome text** — *Trigger:* hover. *Mechanism:* the 12 captured hover deltas are all the same move — link color `rgba(0,0,0,0.8) → rgba(0,0,0,0.96)` (or `#333336 → #050506`), 240ms. Nothing translates, nothing underlines. *Reads as:* the item "leans in" without moving. *Transfers to:* dense nav bars and footers where a transform would cause reflow or optical jitter across 77 links. *Safety:* **production-safe** and free (color only). Caveat: an alpha bump of 0.8→0.96 is a weak affordance on its own — pair it with an underline or a focus ring for low-vision users.

- **Timed dot-nav with a filling progress indicator** — *Trigger:* load (auto-advance), tap/click (override). *Mechanism:* the gallery advances every `--media-gallery-slide-duration: 800ms` transition; the active dot *expands* into a track and a progress bar fills it (`dotnav-timed-dot-expand` / `dotnav-timed-animation` / `progress-indicator-animating`), while inactive dots shift positions (`dotnav-shift-start-1..3`). *Reads as:* "this is moving on its own, and here's how long you have" — an honest carousel affordance. *Transfers to:* any auto-advancing gallery or onboarding stepper. *Safety:* **production-safe only with a pause control**; auto-advance with no PRM gate (as here) is a genuine a11y defect (WCAG 2.2.2). Add `prefers-reduced-motion` → freeze on slide 1.

- **`steps(1)` visibility snapping** — *Trigger:* hover/focus disclosure. *Mechanism:* `transition: opacity 320ms cubic-bezier(...), visibility 320ms step-end` — opacity animates, `visibility` flips instantly at the boundary. *Reads as:* nothing, which is the point. *Transfers to:* every fade-out overlay you have ever built that stayed click-blocking for 300ms. *Safety:* **production-safe**; this is a correctness technique, not a decorative one.

## Production-safety note

- Fill/glyph semantic token pairs, ink-with-alpha chrome, two-optical-cut typography, three-radius shape inventory, one-shadow elevation: all **production-safe**, cheap, and improve a11y by construction.
- The nav curtain is **production-safe** but is the page's only expensive composite — mirror Apple's choice and disable `backdrop-filter` below the tablet breakpoint.
- **A11y, measured (honest, with defects):** `:focus-visible` is real and consistent (2px `#0071e3` outline, 1px offset, driven by `--sk-focus-color` / `--sk-focus-offset` tokens — a *tokenized focus ring* is itself worth copying). Image alt coverage is perfect (`img_alt_ratio: 1`, 49/49). Two real defects: (1) **236 of 365 interactive elements (65%) are under the 44px tap minimum** — a consequence of the 7–9px control padding; do not copy the padding scale onto touch surfaces. (2) **Zero `prefers-reduced-motion` rules** while an auto-advancing gallery runs — add the gate. Also note the disabled state is `opacity: 0` (fully hidden) rather than a dimmed control, which is a nav-specific trick, not a form pattern.
- No dark mode is shipped on this page despite dark tokens existing in the nav bundle — don't infer a dark palette from `--r-globalnav-background-opened-dark`.

## Extracted patterns

- billboard-tile-stack — fixed-height, full-bleed product billboards with top-anchored copy, bottom-bleeding photography, twin pill CTAs, and alternating grounds; halve the same tile for a 2-up row. Reuse for consumer product landing pages and any "many products, no narrative" front page.
- glass-nav-blur-curtain — a fixed translucent nav whose menu fades a full-viewport backdrop-blur curtain over the page, with `steps()` visibility snapping and a reduced-motion fallback. Reuse for mega-menus, command palettes, and filter drawers.
