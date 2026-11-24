---
slug: noma
url: https://noma.dk
source: editorial-pick
corpus: expressive
captured: 2026-07-10
award_type: null
score: null
tags: [restaurant, hospitality, food, brand, serif, warm, photography, seasonal-theming, video-hero, wordpress]
when_to_use: [brand-experience, editorial, hero, landing, footer]
directions: [editorial, minimalist]
layout: [editorial-columns, full-bleed]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [currentcolor-ink-theme, offset-measure-column]
tokens_snapshot: ../tokens/noma.json
screenshots: ../screenshots/noma/
---

## What works (transferable principles)

- **The "black" is a dark tint of the brand hue, and it is the only ink on the page.** Text, hairlines, button borders and icons are all `#29382b` — a deep forest green, never `#000` — on a warm paper `#f9f9f3`, never `#fff`. The raw profile shows it plainly: 415 nodes take that color as `color` and 378 take it as `border-color`. Mechanism: when foreground and border resolve to the *same* variable and components draw with `currentColor`, the page has exactly one ink; nothing needs a separate grey-border token, and the whole surface picks up a subtle temperature that pure neutrals cannot fake. Transfers to any brand system — replace `#000/#fff/#e5e5e5` with `ink / paper / currentColor` and the interface stops looking like a default stylesheet. → `currentcolor-ink-theme`

- **Recolor the site by swapping one pair, not by restyling components.** The whole palette hangs off `--color-background` / `--color-foreground`, set by a single class on `<body>` (`season-vegetable` here; `season-forest` and `season-ocean` exist alongside it, each an 8-step ramp). Mechanism: because every component consumes the pair rather than literal hex, a theme is one class and two declarations — the restaurant's "twelve seasons" concept becomes a *token* rather than a redesign. Transfers to seasonal campaigns, per-category sections, per-tenant white-labels, and dark mode; it is the same move light/dark already teaches you, generalized past two states.

- **Tracking is a function of size, inverted.** `h1`–`h3` (the fluid `clamp()` sizes) take `-0.02em`, mid headings `-0.01em`, and body text `+0.01em`. Mechanism: optical spacing grows with size, so large type needs it removed and small type needs it added back; one ramp, applied by rung, removes per-headline fiddling. Transfers to every type system — the rule is "bigger tightens, smaller opens," and it is the difference between a scale that was set and one that was defaulted.

- **Long prose gets a narrow measure and enormous leading, placed off-center on a wide grid.** The founder's letter runs ~45 characters wide at `18px / 1.8` (32.4px line box — the single most common leading on the page, 175 nodes) in a 4-of-14-column track, offset right, with a photograph in the columns beside it. Mechanism: the page is not centered, so the whitespace reads as *composition* rather than as leftover margin; the short measure plus loose leading makes 900 words of continuous text feel unhurried instead of dense. Transfers to essays, manifestos, changelogs, About pages — anywhere you want people to actually read. → `offset-measure-column`

- **Hierarchy is scale and position; weight never moves.** 475 of 503 profiled nodes are weight 400. A single serif carries body *and* headings (`Reckless` / `Reckless-Neue`), the sans (`Roobert`) is reserved for utility chrome — labels, form fields, the `EMAIL / NAME / MARKETING PERMISSION` micro-caps. Mechanism: when weight is constant, the only ways to rank things are size, position and color, and all three are structural — so the page cannot drift into bold-soup. Transfers everywhere; keep the sans strictly for machine-facing text and the voice stays consistent.

- **The photography is the color system.** Nothing on the page is chromatic except the images — pickled purple artichokes, terracotta walls, a green cactus plate. Mechanism: a monochrome-ink shell means every image is automatically the loudest thing in its section, so art direction does the persuading and no accent hue has to compete with the food. Transfers to any content business (restaurants, publishers, galleries, product photography): starve the chrome of color and the imagery gets it all.

- **Full-bleed pairs, then a caption underneath — never a card.** The two product teasers, the group portrait, the cookbook shot all run edge-to-edge with fixed `aspect-ratio` + `object-fit: cover`, with the headline and a text link sitting *below* the frame on the paper. Mechanism: removing the card (no radius, no shadow, no inset padding) removes the "web component" reading and leaves a print plate. Transfers to editorial grids and shop landings — reserve cards for things that are genuinely tappable objects.

## Design-system read

- **Type:** One serif family in two cuts (`Reckless` body/`Reckless-Neue` headings) plus `Roobert` sans for utility only. Fluid scale via `clamp()`: `--font-size-1: clamp(2rem, -0.5rem + 8vw, 4.5rem)` (32px mobile → 72px desktop), `-2: clamp(1.25rem…2.25rem)`, `-3: clamp(1.125rem…1.875rem)`, then static rungs 1.5 / 1.25 / 1.125 / 1 / 0.9375rem. Body is `--font-size-6` = 1.125rem. Display:body ≈ **4×** — a restrained ratio, so mid-level text still has rungs. Weights 400 (dominant) / 500 / 600. Leading ramps by size: 1.05 (h1) → 1.15 → 1.25 → 1.8 (body). Tracking ramps *inversely*: −0.02em → −0.01em → +0.01em.
- **Color:** `--color-background: #f9f9f3` (warm paper), `--color-foreground: #29382b` (forest ink), both set by a season class on `<body>` from an 8-step ramp. Secondary ink `#465443` fills the newsletter Submit button against a pale `#ecefdf`. White `#fff` appears only as text over the dark hero and as photo mattes. **There is no accent hue and no semantic palette on the marketing surface** — `--color-alert/-error/-success` exist in `:root` but never render here. Borders = the ink, at full strength.
- **Spacing rhythm:** base `--spacing: 1.25rem` (20px), with `s = 15px`, `m = 40px`, `m-l = 60px`, `l = 80px`, `xl = 112px` (the one hand-set step). Grid gap is one base unit. Section rhythm is macro (80–200px block padding) against micro button padding (`0.33em`), the same micro/macro contrast that makes a page feel typeset.
- **Layout system:** a **14-column** grid (`--site-grid: repeat(14, 1fr)`, gap 20px, `max-width: 120rem`) shared by header, main and footer; collapses to **6 columns** at 45em and to one at mobile. Fourteen (not twelve) is the point: it makes off-center placements like `grid-column: 6 / span 4` and `9 / span 6` land asymmetrically instead of on the obvious thirds. Header reserves `1 / span 8` for the wordmark, `9 / span 4` for nav, `13 / span 2` for the EN/DA switcher. Breakpoints observed: 37.5em, 45em, 64em, 75em, 87.5em.
- **Layering / page architecture:** **single flat scroll.** `architecture.layers_summary` reports zero sticky elements, `has_static_backdrop: false`, `has_blend_overlay: false`, and all four `fixed` layers are third-party (cookie banner, Klaviyo teaser). The theme sets `--site-header-height: 0` and lets the header scroll away with the page — confirmed in the frames, where the wordmark is gone by the second stop. Depth is created *only* by photographic scale (full-bleed plate vs. inset column) and by the hero's dark scrim under white type. The one z-axis idea worth stealing is polarity inheritance: body classes `has-hero-block-first has-overlay header-light` let the header take its contrast scheme **from the first block**, not from scroll position — light chrome over the dark video, dark chrome everywhere else, with no listener.
- **Motion / easing intent:** three durations (`--speed-fast: .15s`, `--speed: .3s`, `--speed-slow: .5s`) and two easings (`ease`, `ease-in-out`). Motion exists to confirm a pointer, not to perform. See below.
- **Density:** low per screen, high per page. Any one viewport holds a photograph, a heading and a link; the information (menus, hours, careers, four link columns) is banked into a plain 4-column footer rather than a mega-menu.
- **Hierarchy:** **scale + position.** Color is monochrome and weight is constant, so ranking is done by size rung and by where a block sits on the 14-column grid.
- **Restraint:** no accent color · no gradients (`craft.elevation.gradients: []`) · no shadows in theme CSS · `border-radius: 0` on every control · no underline on prose links (hover dims to `opacity: 0.6`) · **no sticky header** · no scroll-jacking, no parallax, no reveal-on-scroll. The site's expressiveness is entirely in photography, ink temperature and typesetting.

## Interaction & motion

**This page is deliberately, almost aggressively static — and that is the finding.** The probe reports `scrollEffects: 2`, but both are the cookie banner and the Klaviyo teaser going `fixed`; `staggeredEntrance: false`; `cursorFollowers: 0`; `canvas: 0`; `libraries: []`. Of the 35 `@keyframes`, all but a handful (`fadeVideoIn`, `slide`, and WordPress's lightbox visibility toggles) are vendored from Klaviyo. Nine IntersectionObservers exist but drive third-party analytics/forms, not reveals. The frame sequence corroborates it: nothing enters, pins, parallaxes or recolors between stops — content simply arrives. `prefers-reduced-motion` **is** respected, via a global kill-switch (`* { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important }`).

- **Load-faded video plate with a still fallback** — *Trigger:* load. *Mechanism:* a real `<video autoplay loop muted playsinline>` at `aspect-ratio: 1920/1080` sits in the first block with a sibling `<figure><img srcset>` fallback; a `fadeVideoIn` keyframe takes it `opacity: 0 → 1` (the probe caught it mid-fade at 0.41) so the first frame never pops. A dark scrim under the plate holds white type at contrast on *any* video frame. *Reads as:* the room lights coming up — a plate, not a "hero animation." *Transfers to:* any brand hero that wants footage without a bespoke player. *Safety:* **production-safe** — muted+playsinline autoplay is universally allowed, the `<img>` covers data-saver and decode failure, and the fade is opacity-only. Pair it with `poster` and pause the loop under reduced motion.
- **Hover = color inversion, not lift** — *Trigger:* hover/focus. *Mechanism:* the outline button (`1px solid currentColor`, `border-radius: 0`, transparent fill) swaps `background-color` and `color` over `var(--speed) ease`; the Submit button does the same between its two greens. No transform, no shadow, no scale. *Reads as:* a printed block being stamped. *Transfers to:* every CTA in a monochrome system — it costs one rule and needs no elevation token. *Safety:* **production-safe**; `background-color` transitions do not reflow. → `currentcolor-ink-theme`
- **Hover = opacity dim on links** — *Trigger:* hover. *Mechanism:* `.site a:hover { opacity: 0.6 }` over 150ms; the language switcher runs it backwards (inactive `DA` rests at 0.6 and brightens to 1). *Reads as:* one consistent "I am touching this" idiom across logo, nav, prose links and footer. *Transfers to:* any single-ink page — but it is *only* a hover affordance; keep a real underline or focus ring for the accessible signal. *Safety:* **production-safe**, with the caveat below.
- **Section-scoped sticky rails** — *Trigger:* scroll-progress, within a section only. *Mechanism:* inner content (a listing header, a text column beside a gallery) takes `position: sticky` inside its own block, so it holds while its siblings scroll and releases at the section boundary. Nothing is fixed to the viewport. *Reads as:* a caption staying with its subject. *Transfers to:* spec/gallery/job-listing sections where the label must survive a long scroll. *Safety:* **production-safe** — native sticky, no listener, no rAF.

## Production-safety note

- **Single-ink `currentColor` system + swappable season pair** — **production-safe** and cheap. Watch contrast when you author a new ramp: `#29382b` on `#f9f9f3` is ~10.5:1, but a lighter season step used for text will not be.
- **Outline button, `radius: 0`, invert on hover** — **production-safe.** Verify the *hover* state's contrast too (inverted fill), and never rely on the inversion alone to signal focus.
- **Load-faded `<video>` hero with `<img>` fallback and scrim** — **production-safe**, with cost: it is the page's heaviest asset. Ship `poster`, `preload="none"` below the fold, and gate the loop under `prefers-reduced-motion` (the global duration kill-switch does *not* stop a looping `<video>`).
- **No sticky header** — **spectacle-only as drawn.** It is the most beautiful decision here and the most expensive: on a 6,900px page a user who wants "Reservations" must scroll to the footer. Defensible for a brand-experience page whose only job is to be read once; do not copy it onto a site with tasks.
- **Hover-opacity as the sole link affordance** — **spectacle-only as drawn.** Prose links carry no underline, so they are indistinguishable from body text until pointed at (and forever on touch). Keep the ink system; add `text-decoration` with an offset. The theme's `:focus-visible` fallback (a dashed `border-bottom`) is present but thin — 33 of 79 interactive elements are already sub-44px tap targets.
- **Global `transition-duration: 0.01ms !important` under reduced motion** — **production-safe** and worth copying verbatim as a floor, but it is a blunt instrument: it also kills state transitions users *want*. Prefer disabling the offending animations explicitly and keep the kill-switch as a backstop.

## Extracted patterns

- **currentcolor-ink-theme** — one ink + one paper on `<body>`, every component drawn with `currentColor`, so a whole-site recolor (season, tenant, dark mode) is a single class swap. *production-safe.*
- **offset-measure-column** — a ~45ch prose column at 1.8 leading placed off-center on a wide (14-col) grid, with images breaking full-bleed around it. Reuse for letters, manifestos, long-form About pages. *production-safe.*
