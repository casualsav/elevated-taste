---
slug: mschf
url: https://mschf.xyz
source: editorial-pick
corpus: expressive
surface: site
captured: 2026-07-10
award_type: null
score: null
tags: [brand, art, culture, streetwear, dark, monospace, terminal, archive, drop-culture, ecommerce]
when_to_use: [landing, brand-experience, portfolio, navigation]
directions: [brutalist, expressive]
layout: [text-only, catalog]
a11y: [reduced-motion-ignored, focus-visible-missing, tap-targets-ok]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [indexed-catalog-rows, char-cell-marquee]
tokens_snapshot: ../tokens/mschf.json
screenshots: ../screenshots/mschf/
---

## What works

- **The inventory *is* the homepage.** No hero, no headline, no images (`img_count: 0`), no `<h1>`–`<h6>` anywhere (`headings: all 0`), no marketing sentence. 128 numbered rows of product names, top-aligned at `y=0`, and that's the whole page. The brand argument is made by *volume and sequence* — you scroll a receipt of everything they've ever shipped. Transfers to any org whose credibility is cumulative (studios, labels, research groups, changelogs): if you have a lot of a thing, listing all of it beats describing three of it. The generic template's "three feature cards" is the exact opposite move.

- **A character grid instead of a layout grid.** Every column is measured in `ch`, not px or fr: a `4ch` index gutter and a `33ch` title column (`19ch` under 500px). The custom monospace (`MSCHFSansMono`) makes `ch` a hard unit, so the page is a fixed-width terminal buffer rather than a fluid grid — 419 flex boxes, **zero CSS Grid**. Titles that exceed 33ch don't wrap and don't ellipse; they *scroll* (see `char-cell-marquee`). Transfers to logs, ledgers, ticket queues, diff views — anywhere alignment carries meaning and a monospace face is already justified.

- **Type sized in `vw`, so the page is a poster, not a document.** Body is `4.51vw` (65px at 1440) with line-height `3.89vw` (56px) — a **leading ratio of 0.86**, i.e. lines are set tighter than their own cap height. Nothing reflows between 500px and 1440px; the composition *scales*. Two sizes exist in the entire stylesheet — `4.51vw` for rows and `1.81vw` for the index numbers (a 2.5× ratio). Transfers wherever you want one fixed picture at every width; the cost is that text size is now a function of window width, which is a real a11y trade (see safety).

- **Sub-1 leading turns a list into a slab.** At 0.86 leading the rows fuse into a single block of texture — you perceive the *mass* of the catalog before you read any one line. This is the mechanism behind the "wall of product" feeling; it is not an accident of the mono face. Transfers to any dense index where the aggregate is the message. Invert it (leading ≥1.5) the moment individual lines need to be compared rather than surveyed.

- **Color is taxonomy, never decoration.** One gray (`#84898E`) carries 886 of ~900 colored elements. **White is not a text color — it is the hover state**, the only "on" signal on the page. Four saturated hues each mean exactly one thing and appear on 2–8 elements total: dim gold rail = shipped/archive, blue = subscribe, red = unreleased, yellow = outbound link and the one CTA. Section identity is carried entirely by the color of a 3px **left border rail** — there are no headings, no dividers, no labels. Transfers directly to dashboards and status UIs: spend saturation only where it encodes state, and let a rail replace a heading.

- **A veil at rest, resolution on hover.** Every row sits under a 50% checkerboard of black squares on a 6px cell (two offset 45° `linear-gradient`s). Hovering a linked row `display:none`s its overlay. So the resting page is *half-screened* — degraded, print-like, un-clicked — and touching a row develops it. The affordance is discovered by moving the mouse, not by looking. Transfers as a cheaper, more physical alternative to `opacity: 0.5` for "not-yet-engaged" states; the visual cost (halved effective contrast) is real and discussed below.

- **One interaction, applied 12 times.** Every hover on the page is the same two-step: recolor gray → white, and append `↗` via `::after { content }`. No transitions, no easing, no scale, no underline. A single legible gesture repeated 128 times reads as a *system*; twelve bespoke hovers read as decoration. Transfers everywhere: pick one hover verb and never spend a second one.

## Design-system read

- **Type:** One face, one weight — `MSCHFSansMono` 400, `text-transform: uppercase` set on `body` so casing is never a per-element decision. The scale has exactly **two steps**: `1.81vw` (26px @1440) for index numbers and `4.51vw` (65px @1440) for everything else — a 2.5× jump with nothing between. Hierarchy is therefore created by **color and position, not size or weight**: the index is small and left; the title is large and gray; state is a hue. Leading is `0.86` desktop / `0.97` mobile — both sub-1. Mobile adds `letter-spacing: -0.232vw` to buy back the extra `ch` needed to fit a title in `19ch`.
- **Color:** Ground `#000000` (true black, not near-black). Body `#84898E` — 5.9:1 on black, AA for body text. Hover/active `#ffffff`. Then a four-hue semantic set, each ≤8 elements: `rgba(168,145,65,0.3)` (archive rail, a 30%-alpha gold that reads as tarnished brass), `#40aaff` (subscription — the only section where the rail color is *also* the text color), `#f00007` (unreleased — the `?????` rows, and a rail that fades red→black down its own length via `border-image: linear-gradient(180deg,#f00007,#000) 1`), `#ffc700` (outbound links and the fixed CTA square). No surfaces, no cards, no borders except the rails. No gradients except the one rail fade.
- **Spacing rhythm:** Everything is `vw`, base ≈ `0.694vw` (10px @1440). Observed steps: `0.208vw` (3px, rail width) · `0.417vw` (6px, dither cell) · `0.694vw` (10px, gutter/inset) · `0.972vw` (14px, chrome gap) · `1.777vw` (25.6px, section right pad). Whitespace does almost nothing here: the negative leading deliberately removes it. The only breathing room is the `4ch` index gutter and the page's right margin.
- **Layout system:** Single column, `100vw` wide, flush to the top of the viewport. Rows are `display:flex` with a `flex-shrink:0` `4ch` index and a `flex-grow:1` `33ch` title that is `overflow:hidden; white-space:nowrap`. Sections are stacked `<section>`s distinguished only by `border-left-color`. One breakpoint: **500px** — below it the rail thickens (3px → ~10px), the title column narrows to `19ch`, tracking goes negative, and the corner CTA grows to `16vw`. `container_widths: [1440px]` is the capture width, not a max-width; there is none.
- **Layering / page architecture:** **Single flat scroll over a black ground.** `has_static_backdrop: false`, `has_blend_overlay: false`, no `mix-blend-mode`, no `backdrop-filter`. Five fixed layers, all chrome: the `z:1` header (yellow CTA square, top-right), a `z:10` mobile-only footer, and two `z:9999` `pointer-events:none` cursor labels. Depth on this page is not spatial — it is the **dither veil**, an absolutely-positioned overlay *inside* each row that simulates a printing screen at 50% coverage. The z-axis story is "one plane, selectively screened."
- **Motion / easing intent:** Exactly **one `@keyframes`** in the whole site, zero CSS animation rules beyond it, zero `requestAnimationFrame`, zero IntersectionObservers, zero libraries. Timing is `steps(n)` and a 50-second linear cycle. The intent is *machine idle*, not choreography: nothing enters, nothing reveals, nothing eases. The only thing that moves is text that doesn't fit, sliding one character cell at a time. **`prefers-reduced-motion` is not respected** (`prmRules: 0`).
- **Density:** Extremely high — ~128 rows in one viewport-width column, 56px apart, at 65px type. It stays legible because of the `4ch` index (a fixed anchor for the eye), the mono face (uniform advance width, so scanning is saccade-cheap), and the ban on wrapping (every row is exactly one line, so row count = item count).
- **Hierarchy:** **Position + color.** The index number tells you where you are; the rail color tells you what kind of thing you're looking at; white tells you what you're touching. Size is not an ordering device — the display size *is* the body size.
- **Restraint:** No hero, no images, no headings, no cards, no radii (`0` everywhere), no shadows, no gradients (except one rail), no second weight, no second family, no transition timing functions, no scroll animation, no dark/light toggle. The entire brand load is carried by the black, the gray, the mono, and the count.

## Interaction & motion

Grounded in: `keyframeCount: 1` (`marquee-*`), `cssAnimationRules: 0`, `rafCalls: 0`, `usesIntersectionObserver: false`, `libraries: []`, `hoverEffects: 12`, `mousemoveListeners: 3`, `scrollListeners: 2`, `interactive.marquee: 1`, `durations_ms: [50000]`, `easings: ["ease", "steps(50)"]`, `respectsReducedMotion: false`. The profiler's two "scroll effects" are the `position:fixed` header (a pin, not an effect) and a `transform` on the row `Global Supply Chain Telephone Handbag…` — that is the marquee, not parallax. **Nothing on this page reveals, fades, or eases on scroll.**

- **Character-cell marquee** — *Trigger:* load (continuous). *Mechanism:* script measures a row's overflow **in `ch`** and writes two custom properties (`--overflow-amount`, `--animation-duration`); one keyframe drives `transform: translateX(calc(var(--overflow-amount) * -1ch))` with `steps(var(--overflow-amount))` timing, so the string advances **exactly one glyph cell per step** and never renders between cells. An `alternate` variant ping-pongs instead of looping. *Reads as:* a split-flap departure board — mechanical, discrete, deliberately not smooth. `steps()` is what separates this from every generic ticker. *Transfers to:* long labels in fixed-width columns (log viewers, file names, now-playing bars, ticket titles) where truncation loses information. *Safety:* **spectacle-only as shipped** — 50s infinite loops, no reduced-motion guard, and an overflowed title is *unreadable at rest* (you must wait for it). Compositor-only `transform`, so the cost is battery not jank. Gate on hover/focus and ship `text-overflow: ellipsis` under reduced motion. → `patterns/char-cell-marquee.md`

- **Dither-veil hover reveal** — *Trigger:* hover. *Mechanism:* an absolutely-positioned, `pointer-events:none` overlay paints two 45° `linear-gradient`s offset by half a cell (`background-size: 0.417vw`), producing a 50% black checkerboard over the row's text; `.has-link:hover .right .tile-overlay { display: none }` removes it. Not opacity — a **halftone screen**. *Reads as:* the row develops, like a photo coming up in a tray; unlinked rows stay screened forever. *Transfers to:* "not yet engaged / archived / disabled-but-present" states where you want texture rather than a flat alpha wash. *Safety:* **production-safe with a contrast caveat** — 50% cell coverage roughly halves effective contrast (5.9:1 → ~2.9:1), so a dithered row fails AA at rest. Use it on decorative or *duplicated* information, or lift the veil on `:focus-visible` too, not only `:hover`. `display:none` toggling is free (no paint on the hot path). → `patterns/indexed-catalog-rows.md`

- **Hover recolor + appended glyph** — *Trigger:* hover. *Mechanism:* `color: #84898E → #fff` plus `a:not(.latest):hover::after { content: "↗" }`. All 12 detected hover effects are this same pair (the 13th is the CTA square inverting its fill to transparent). *Reads as:* "this is live, and it leaves the site." *Transfers to:* any link list that can't afford underlines. *Safety:* **production-safe**, with one trap: appending a character to a `nowrap` flex row **shifts layout by 1ch** and can shove a marquee. Reserve the cell (`::after { content: "\00a0" }` at rest) instead of inserting it.

- **Cursor-tethered label** — *Trigger:* mousemove (3 listeners). *Mechanism:* a small `1.81vw` chip (yellow or black fill) positioned at the pointer and lifted `translateY(-150%)`, `pointer-events: none`, `z-index: 9999`, `display:none` below 500px. *Reads as:* a marginal annotation the page whispers rather than a tooltip it declares. *Transfers to:* dense rows where a persistent metadata column would double the width. *Safety:* **spectacle-only** — pointer-only (no touch, no keyboard equivalent), and it carries information that has no non-hover route. Mirror it into a `title`/`aria-describedby` or an on-focus chip before shipping.

- **Rail-gradient fade-out** — *Trigger:* none (static). *Mechanism:* the unreleased section's left rail is `border-image: linear-gradient(180deg, #f00007, #000) 1`, so the rail *dissolves into the background* down the section's length while its `?????` rows stay red. *Reads as:* the catalog running out into the future. *Transfers to:* "end of known data" boundaries — the last rows of a feed, a forecast horizon, an unloaded tail. *Safety:* **production-safe** (one border-image, no motion).

**Reduced motion:** not respected. Zero `prefers-reduced-motion` rules against a 50-second infinite animation — the single most fixable defect here.

## Production-safety note

- **Character-cell `steps()` marquee** — *spectacle-only.* Cost: information is hidden at rest (you must wait ~50s for a full cycle), it never stops, and there is no reduced-motion path. The *technique* is production-safe once gated (`:hover`/`:focus-within` to start, ellipsis otherwise).
- **50% dither veil over body text** — *spectacle-only at this coverage.* Cost: a11y. Body gray on black is 5.9:1; screened at 50% it lands near 2.9:1 and fails AA. Ship it over imagery, over already-duplicated text, or at a much lower cell coverage (e.g. 12.5%) — and lift it on focus, not just hover.
- **`vw`-locked type (`font-size: 4.51vw`)** — *spectacle-only.* Cost: type no longer responds to the user's browser font-size or zoom in the way `rem` does, and at 320px the body drops to ~25px while at 2560px it balloons to 115px. The transferable form is `clamp()` with a `rem` middle term.
- **Sub-1 leading (0.86)** — *spectacle-only for prose, production-safe for a mono index.* Cost: descenders collide with the next line's caps; uppercase-only text hides this, mixed case will not. Only works because `text-transform: uppercase` is set globally.
- **Color-as-taxonomy on a black ground** — *production-safe, and the most portable lesson.* One neutral, white reserved for the hover state, four hues that each mean one thing. Caveat: color is currently the *only* channel encoding section state — pair each rail with a visually-hidden label.
- **Rail-only section identity (no headings)** — *spectacle-only as built.* Cost: `headings: 0` across `h1`–`h6` means screen-reader and crawler users get one undifferentiated list of 128 links. Keep the visual rail; add real headings, visually hidden.
- **Focus states** — the site does render an outline on `:focus`, but it is `1px solid rgb(16,16,16)` on a `#000` ground: **1.1:1, effectively invisible**. Flagged `focus-visible-missing` for that reason, not for absence of a rule. Use the accent yellow.

## Extracted patterns
- `indexed-catalog-rows` — a numbered, character-grid catalog where a colored left rail encodes section state and a dither veil marks un-hovered rows; reuse for archives, changelogs, release indexes, and any "everything we've shipped" page that should read as an inventory rather than a portfolio.
- `char-cell-marquee` — an overflow-aware marquee whose `steps()` timing advances the string exactly one monospace cell per tick; reuse for long labels in fixed-`ch` columns where ellipsis would destroy information.
