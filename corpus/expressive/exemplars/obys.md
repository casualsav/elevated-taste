---
slug: obys
url: https://obys.agency
source: godly
corpus: expressive
captured: 2026-06-22
award_type: Curated
score: null
tags: [agency, portfolio, motion-led, experimental, editorial, award-submission]
when_to_use: [brand-experience, agency, hero-spectacle, portfolio]
directions: [expressive, brutalist, editorial]
layout: [center-stack]
a11y: [reduced-motion-ignored, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: https://godly.website/websites
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [centered-spine-index, bracket-focus-row, sticky-pin-scrollytelling, parallax-drift]
tokens_snapshot: ../tokens/obys.json
screenshots: ../screenshots/obys/
---

## What works (transferable principles)

- **Two-tier type scale = instant hierarchy without weight.** The entire site runs on exactly two sizes — ~11px body and ~80px display — in a *single* 400-weight custom face. A ~7× jump does all the ordering; nothing is bolded. Mechanism: when the size ratio is large enough, weight and color become free to use for other signals (state, links). Transfers to any editorial/brand site that wants a calm, typographic voice; in product UI, cap the ratio nearer 4–5× so mid-level text still has somewhere to live.

- **A single centered vertical "spine" replaces the grid.** Instead of a multi-column gallery, work thumbnails stack in one narrow centered column down the page axis. Mechanism: a strong central axis turns scrolling itself into the layout — the eye tracks one line, whitespace on both flanks frames each image like a plate. Reuses for portfolio indexes, changelog/story feeds, any "one thing at a time" browse. Cheap to make responsive because there is only one column to begin with (see mobile: identical, just narrower).

- **Margins carry the metadata, center carries the content.** The live spine stays clean; project names (left TOC), category tags, role credits and an index number live in the far margins, set in tiny type. Mechanism: spatial separation of *navigation* from *content* lets each be dense without crowding the other — the page reads minimal while actually being information-rich. Transfers to docs, dashboards, and editorial layouts that need chrome without clutter.

- **State is shown by framing, not by fill.** The focused item is wrapped in two oversized bracket `[ ]` glyphs and gains flanking metadata, rather than a hover background, shadow, or color shift. Mechanism: a typographic frame reads as "selected" while keeping the monochrome system intact — it adds *meaning* without adding *material*. Reusable as a restrained hover/active treatment anywhere a card highlight would feel heavy.

- **Slow expo-out motion as the house signature.** Nearly every transition is `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) at unusually long durations — 0.8s and 1.6s, occasionally 3.5s. Mechanism: a fast start that decelerates into a long tail reads as weighty and "designed"; consistency of one curve across the whole site is what makes motion feel authored rather than defaulted. Transfer the *curve and the consistency*, not the duration — at 1.6s this is spectacle pacing, far past the 150–300ms a task UI should use.

- **Monochrome system + the images are the only color.** UI is pure white/black/grey; every thumbnail is desaturated toward greyscale too, so the page is effectively colorless. Mechanism: removing hue removes one whole axis of decision and forces hierarchy onto scale, space and motion — it also guarantees the work, not the chrome, is the loudest thing. Transfers to any brand wanting a gallery-quiet, "the work speaks" tone.

## Design-system read

- **Type:** Custom face `Obys` (a tight grotesque-serif), **one weight (400)**, **two sizes** — ~0.7rem body / ~5rem display (~7× ratio). Tight tracking that scales with size (body ≈ -0.01em, display ≈ -0.03em). Hierarchy is created *entirely by scale contrast and position*, never by weight.
- **Color:** Monochrome. `bg` pure white; `fg` black; one `muted` grey (#c9c9c9) for secondary/inactive text; white used as fg over dark imagery; brackets/rules in white or grey. No accent hue at all — semantic color is deliberately absent.
- **Spacing rhythm:** Small base (~10px) for gaps and ~1px box padding (brutalist, edge-to-edge boxes), set against very large vertical voids between spine items. The contrast of tiny internal padding vs huge external whitespace is the rhythm.
- **Layout system:** A single centered content column (the spine) with two outboard margin rails for navigation/metadata; fixed corners (wordmark, clock, contact, copyright, view-toggle). Effectively a 1-column grid with margin annotations; mobile is the same system at narrower width — almost no reflow needed.
- **Motion / easing intent:** Two easings in the probe — bare `ease` (used once, for a 0.4s utility) and the house **expo-out `cubic-bezier(0.16,1,0.3,1)`**, which carries the whole system at `0.8s` (39 rules) and `1.6s` (38 rules), with rare one-offs at `1s`, `0.6s`, and a single `3.5s` showpiece. So the params are essentially *one curve, two long durations* (`params.durations_ms: [800, 1600]`). Communicates craft, weight, deliberateness; transitions glide in on a fast-start/long-tail. No `@keyframes` at all (keyframeCount 0) — the *scroll* motion is JS-driven (779 rAF callbacks, 1 `<canvas>`), while the CSS easings govern hover/state transitions. The live CEST clock adds ambient "alive" motion. Full choreography in **Interaction & motion** below.
- **Density:** Looks sparse, reads dense — a full project index, categories, roles and credits are all present, kept legible by pushing detail to tiny type in the margins and keeping the center axis uncluttered.
- **Hierarchy:** Dominant ordering device is **scale + position**: huge wordmark and huge focus-bracket anchor; everything else is whisper-small and placed by region.
- **Restraint:** No accent color, no second font, no second weight, no shadows, no rounded corners, no card fills, no multi-column gallery. The expressiveness is bought with *motion and scale*, not ornament.

## Interaction & motion

Obys is a **scroll-choreographed agency piece**, but the capture is honest about its limits. The motion probe reports **48 scroll effects (28 pins + 20 parallax)**, **779 `requestAnimationFrame` callbacks**, **1 `<canvas>`**, and **zero `@keyframes`/`IntersectionObserver`/scroll/mousemove listeners** — the signature of a **JS-rAF smooth-scroll engine** (Locomotive/Lenis-class; no library global was detected, so this is inferred from the rAF+pin+`position:fixed` fingerprint, not asserted). **Caveat on the frames:** the scroll-capture stalled — frames `s02`→`s10` are byte-identical, and `s00`→`s02` differ by <1% of pixels (top-bar clock, a small center/margin settle, footer). So I can *see* only ambient micro-motion; **the pin/parallax choreography is probe-derived and frame-unconfirmed** — flagged per technique below. **Reduced motion is NOT respected** (`respectsReducedMotion: false`, 0 PRM rules) — a real defect on a motion-heavy site.

- **Pinned plate / scroll-handoff** — *Trigger:* scroll-progress. *Mechanism:* each project `figure`/plate takes `position: fixed` (probe: 28 `pin (fixed)` entries on `figure.ho-wo-2-r` and the project `div`s) so the centered image holds in the viewport while its caption/credits and the next plate scroll through and replace it. *Reads as:* a deliberate "one work at a time" handoff down the spine — the gallery advances by swap, not by a moving grid. *Transfers to:* portfolio indexes, case-study reels, any "hold the hero, change the caption" scrollytelling. *Safety:* **production-safe** (native sticky/fixed is cheap and JS-optional) — but here it's driven by a rAF scroll engine that hijacks native scrolling, which *is* **spectacle-leaning**: it adds main-thread cost and breaks scroll-anchoring/`prefers-reduced-motion` unless re-added. Frame-unconfirmed (scroll stalled). → `sticky-pin-scrollytelling`.
- **Spine parallax drift** — *Trigger:* in-view (per the probe's `transform` + `trigger: in-view` on every project-name span and the credits `div`). *Mechanism:* the margin metadata (left TOC names, right role credits) and plates translate at slightly different rates than the scroll, so foreground text drifts against the centered image. *Reads as:* depth and "alive" weight on an otherwise flat monochrome page; the margins feel like a separate layer from the spine. *Transfers to:* editorial mastheads, layered hero credits, any two-rail layout wanting subtle depth. *Safety:* **prod-safe when subtle → spectacle when heavy** (transform-only is GPU-cheap, but rate-bound-to-scroll can induce motion-sickness and must ship a reduced-motion off-switch — which this site omits). Frame-unconfirmed. → `parallax-drift`.
- **Bracket-frame focus reveal** — *Trigger:* in-view / hover (active item). *Mechanism:* the focused row gains two oversized `[ ]` glyphs and flanking metadata (the static `bracket-focus-row`), and the *transition between* focus states rides the house `1.6s` expo-out. The one center-band delta I can measure (s00→s02, cols 0/2/9/10) is exactly the left-TOC + right-credits gutters resolving around the focused plate — consistent with this beat settling. *Reads as:* "this is selected/important" stated typographically, gliding rather than snapping. *Transfers to:* monochrome list highlights, TOC active-states, anywhere a fill/box would feel heavy. *Safety:* **production-safe as a style**, but the `1.6s` glide is **spectacle pacing** — drop to 150–300ms for anything interactive, and give the real link a non-decorative focus ring (brackets aren't a focus indicator). → `bracket-focus-row`.
- **Ambient live clock** — *Trigger:* load (continuous, scroll-independent). *Mechanism:* a fixed-corner CEST clock updates on a rAF/interval loop (top-right; it reads "CEST 8:24 PM" across every frame because wall-time barely moved during capture, but the probe's 779 rAF and the top-band delta in cols 9-10 corroborate a live ticker). *Reads as:* the page is "awake" even at rest — a tiny breath of motion that signals craft without demanding attention. *Transfers to:* studio/agency chrome, status bars, "now" indicators. *Safety:* **production-safe** (one text node, no layout, trivially pausable) — but a perpetual rAF should idle when off-screen/`prefers-reduced-motion`. **No pattern file exists** → see `patterns_to_build` below.

**Components** (from `.craft.states` — sparse: the capture found only link focus, no button/card/input/disabled deltas, consistent with the brutalist all-`<a>` chrome):
- **Link / nav** — resting black/grey text; **focus** draws `outline: 1px rgb(16,16,16)` (a near-black 1px ring, captured on 8 `<a>`s). No hover *background/fill* delta was captured — hover state on the spine is the bracket-frame reveal above, not a chip. `:focus-visible` specifically is reported **false** (the ring fires on `:focus`, i.e. also on mouse click — acceptable but not best-practice).
- **Button / card / input** — **no distinct component states captured.** The site has effectively no filled buttons or form inputs in view (it's links + image plates), and **no `disabled` states exist** (`states.disabled: []`). Treat button/card/input tokens as *unspecified by this exemplar* rather than inheriting the link ring.

**Grid / container:** raw `.craft.grid.columns` = `["12"]` desktop, collapsing to `["4"]` at 390px — but **the rendered layout is a single centered spine, not a visible 12-col grid** (frame-confirmed: the 12→4 figure is the underlying CSS-grid track count, which the design uses only to *center one column* with wide margin rails). Read it as **1 effective content column + 2 margin rails**, with a **measured ~10px gutter**. No `max-width` was captured, so the content-column width stays a ~1440px-viewport estimate. *(container width frame-estimated; columns + gutter measured)*

**Tracking note:** only **one** size was sampled by the craft probe — `11px → -0.11px` (≈ **-0.01em**), the body. The display tier (~80px) is *not* in `tracking_by_size`, so the "-0.03em on display" figure in the Design-system read is carried from the raw `letterSpacing` profile (`-2.4px` on 80px ≈ -0.03em), **not** from `type_detail`. So: tracking **does** tighten with size, but only the body value is corroborated by the craft sampler; the display value is single-source. *(thin data)*

## Production-safety note

- **Two-tier scale hierarchy** — **production-safe.** Reduces decisions; just keep enough size steps that mid-level content (sub-nav, captions) is legible. The 11px body here is itself a borderline a11y choice — bump to ≥14–16px in production.
- **Centered single-column spine** — **production-safe.** Trivially responsive and accessible; works as a normal scroll feed. Only caveat: a center-axis layout can feel sparse on ultrawide screens — cap the column and let margins grow.
- **Margin-rail metadata** — **production-safe** with care. Tiny edge type can fail contrast/zoom and is awkward for screen readers if it's positioned out of DOM order — keep it in logical reading order and size it accessibly.
- **Bracket-frame focus state** — **production-safe.** Pure typographic decoration; just ensure the *real* affordance (the link) has a non-decorative focus ring for keyboard users — brackets alone aren't a visible focus indicator.
- **1.6s+ expo-out transitions** — **spectacle-only.** Beautiful on an idle portfolio; in a task flow this much latency feels broken and blocks interaction. Respect `prefers-reduced-motion`, and drop to 150–300ms for anything the user is waiting on. The 3.5s transition is pure show.
- **Fully desaturated imagery** — **spectacle-only / brand-dependent.** Greying every image is a strong aesthetic commitment that throws away product/photo information; fine for an agency mood piece, costly anywhere the image content carries meaning (e-commerce, docs).
- **Single custom display font as the whole system** — **production-safe** if you self-host and `font-display: swap`; with one weight the payload is small. The risk is purely FOUT/loading, not usability.
- **A11y, honestly (probe `.craft.a11y`):** **`prefers-reduced-motion` is NOT respected** (0 PRM rules) on a page that pins/parallaxes/runs a perpetual rAF — the headline accessibility defect; any reuse must add the gate. **`focus-visible` is false** — a near-black `1px` ring fires on `:focus` (so also on mouse), not scoped to keyboard. **83 of 198 interactive elements are small tap targets** (<44px) — expected given 11px margin type, but a mobile/zoom hazard. **`img_alt_ratio` = 1.0** — every one of the 38 images has alt text (the one unambiguous win). No dark mode (`supportsDark: false`; the page is permanently light). Net: visually meticulous, but it **fails reduced-motion and tap-size** and only half-passes focus.

## Extracted patterns

- **centered-spine-index** — a single centered vertical column of media as the primary browse layout, with navigation/metadata pushed to the margins. Reuse for portfolio indexes, story/changelog feeds, "one item at a time" galleries. *production-safe.*
- **bracket-focus-row** — a list/row whose active item is framed by oversized bracket glyphs and flanked by metadata instead of a fill/hover background. Reuse as a restrained, monochrome-friendly active/hover state. *production-safe.* (motion: also the focus-reveal beat, on the house expo-out)
- **sticky-pin-scrollytelling** *(cited, from production)* — the pinned-plate / scroll-handoff above; reuse to hold a hero image while its caption and the next item scroll through. *production-safe as native sticky; spectacle when driven by a scroll-hijack rAF engine.* (motion)
- **parallax-drift** *(cited, from production)* — the spine/margin parallax above; reuse to give a flat layout subtle depth between a content rail and its metadata rails. *prod-safe subtle → spectacle heavy; must gate reduced-motion.* (motion)

**`patterns_to_build:`**
- **ambient-live-clock** — a fixed-corner, rAF/interval-driven live time/status readout (scroll-independent) that signals "the page is awake" with one text node. Seen here (CEST clock) but **no recipe file exists** in the corpus; build a framework-neutral, off-screen-idle, reduced-motion-aware snippet before citing it in `patterns:`.
