---
slug: dishoom
url: https://www.dishoom.com
source: editorial-pick
corpus: production
captured: 2026-07-10
award_type: null
score: null
tags: [restaurant, hospitality, food, brand, b2c, editorial, photography, serif, letterpress, warm, light]
when_to_use: [landing, brand-experience, hero, editorial, feature-section]
directions: [editorial]
layout: [editorial-columns, full-bleed]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [letterpress-frame-card, pinned-panel-scrolling-index]
tokens_snapshot: ../tokens/dishoom.json
screenshots: ../screenshots/dishoom/
---

## What works

- **Tracking widens with size instead of tightening.** The display serif runs at 0.1em letterspacing at 32px and 0.2em at 30px caps; even 21px body serif carries +0.02em. This is the exact inverse of the contemporary ramp (bigger type → tighter tracking) that most design systems ship. It works because the reference is *letterpress*, where large wood type was spaced open, and the effect is instant period signalling with zero ornament. The transferable rule: a type ramp's tracking *direction* is a stronger style signal than the typeface itself — pick the direction deliberately, and if you invert the modern convention, invert it everywhere (eyebrow, display, and body) or it reads as a mistake.

- **Hierarchy from case, family and tracking — never from weight.** 2,038 elements sit at weight 400 against 163 at 700. Ranking is done by switching register: tracked small-caps sans eyebrow → serif display → justified serif body → italic serif caption. A page can carry eleven h2s and thirty-eight h4s with one weight, because each tier is a *different voice* rather than a heavier one. Transfers to any content-dense site where a weight ladder has run out of rungs.

- **The page ground is paper, not white.** Nothing on this site is `#ffffff` in a load-bearing role: the ground is beige `#f0ece0`, ink is a charcoal `#353839` (never `#000`), rules and muted text are `#c4bfaf`, and text on dark grounds is `#fffdf9`. A four-value warm palette with a *single* off-brand accent (a coral `#e1a894` chip) makes photography — 78 images, 69 with srcset — look like it was printed on the page rather than pasted onto it. Any brand shipping heavy photography should tint its ground toward the photos' paper, not away from it.

- **Editorial artefacts replace UI chrome.** Awards are engraved certificate plaques with double-rule frames and a star ornament; photographs get inset hairline frames plus an `ABOVE:` italic caption; recipes get a coral sticker chip. There are exactly **two box-shadows on the entire page** and radii of 2–6px. Depth is manufactured by *drawn rules and frames*, not by elevation. This is the concrete escape from the three-feature-card grid: give each block the form of a printed object (plaque, caption, stamp, index) and the "cards" disappear.

- **A 20-column grid buys asymmetry that a 12-column grid cannot.** Above 768px the container is `repeat(20, minmax(0,1fr))` (6 columns below), with spans like 7 / 11 / 2 / 3. Twenty columns means a text block can be offset by one narrow column and an image can hang half a gutter into the margin — the magazine moves that a 12-col system rounds off. Cost is nil; the grid is still uniform. Reach for a high column count whenever the layout's job is *composition* rather than *modularity*.

- **Justified serif body with hyphenation, used only where the measure supports it.** Long-form columns are `text-align: justify` at ~45–60 characters. It reads as a book page and it is the single cheapest signal that the copy was written rather than generated. It fails badly at narrow measures — which is why the same copy runs ragged-right at mobile widths. Justify is a measure-dependent decision, not a taste one.

- **309 IntersectionObserver targets and zero entrance reveals.** The probe finds nineteen observers watching 309 elements, and `entranceReveals: 0`. The observers do lazy-loading, a header sentinel, and a reading-line text fill — not the ubiquitous "everything fades and rises 20px." Restraint here is what lets the *two* real motion moments (hero zoom, pinned café panel) land.

## Design-system read

- **Type:** Two families. `cheltenhamBT` — a Victorian old-style serif with a true italic — carries display, body, and captions (2,192 elements); `gill-sans-nova` carries only eyebrows, buttons, and UI labels (214). Sizes: 10 · 12 · 13 · 14 · 15 · 16 · 18 · 20 · 21 · 30 · 32 · 40–45px. Ratio ≈ 1.15–1.25 through the reading tiers with one ~2.5× jump to display — a shallow scale, because contrast is carried by case and tracking instead. Body serif is 21px/27.3px (1.3); UI sans is 16px/24px (1.5). Display tracking **+0.1em**, eyebrow **+0.25em**. A condensed wood-type face appears once, for the "25 MILLION MEALS" plaque — a single guest voice, not a third system font.
- **Color:** `#f0ece0` beige = page ground. `#353839` charcoal = ink, and also the ground of the dark bands (hero, café panel, footer). `#fffdf9` off-white = text and rules on dark. `#c4bfaf` = every hairline, every muted caption, and, at 30–50% alpha, every hover fill. `#ffffff` appears only inside photographs and one modal. Accents are ceremonial rather than functional: coral `#e1a894` (recipe chips), and per-café brand hues (`#b52b2a`, `#006642`, orange, teal) used at four occurrences each. There is **no dark mode** (`supportsDark: false`) — the dark bands are a design device, not a theme.
- **Spacing rhythm:** Base 4px, but page rhythm is coarse and asymmetric: 40 / 48 / 67 / 80 / 96px section padding, `--container-padding: clamp(1.25rem, 3vw, 2.5rem)`, max shell 1536px, prose columns capped at 576 / 672 / 936px. Whitespace is *around* blocks, never inside them — the plaques and photo frames are tight.
- **Layout system:** 421 flex containers to 39 grids; grid appears where composition matters (`.grid-container`: 6 cols → 20 cols at 768px, column-gap 16 → 12 → 16 → 24px across 768/1024/1280). Fourteen breakpoints observed, real work at 768 / 1024 / 1280. Desktop nav has 44 visible links; mobile has 2 plus a hamburger and a 70px pinned bottom action bar.
- **Layering / page architecture:** `has_static_backdrop: true` — a `pointer-events-none; position: fixed; inset: 0; z-index: -1` layer sits behind everything, and all ten content blocks are `background: transparent` (`transparent_height_pct: 100`), so the page scrolls over a still ground rather than stacking opaque sheets. Two `position: sticky` tracks create the only real depth: the hero (`top: 0; height: 100svh`) and the café panel (`top: var(--header-height); height: calc(100vh - var(--header-height))`). No `mix-blend-mode` anywhere; exactly one `backdrop-filter: blur(8px)`, on the nav overlay. Fifteen fixed layers, but thirteen are chrome (header, search, nav sheets, consent). The z-scale is small and intentional — 1 through 7 for the page, 20/21/50 for overlays.
- **Motion / easing intent:** One easing (`cubic-bezier(0.4, 0, 0.2, 1)`) at 150 / 300 / 500 / 700 / 1000ms; 150ms owns hover (238 rules), 300ms owns state (131), and the second-plus durations belong exclusively to the hero. Motion says "this page is a physical object being turned," never "look what we can do."
- **Density:** High and unafraid — justified multi-paragraph essays sit next to full-bleed food photography. It stays legible because the eyebrow/display/body/caption voices never blur, and because the ground is a single unbroken beige.
- **Hierarchy:** Position first (what's in the 20-col composition), then case+tracking, then scale. Color ranks nothing; weight ranks nothing.
- **Restraint:** No gradient mesh, no glass, no dark mode, no shadow system, no rounded cards, no icon set, no entrance animations, no fake dashboard, no three-up feature grid (the one 3-up row is three full-bleed photographs with plaques, not cards).

## Interaction & motion

Evidence: 11 scroll frames; 30 scroll effects; 19 IntersectionObservers / 309 targets; 21 `@keyframes`; one library (Swiper); `entranceReveals: 0`.

- **Sticky hero that zooms to full-bleed while the words change** — *Trigger:* scroll-progress. *Mechanism:* a 100svh `position: sticky` track holds a media panel whose `transform: scale()` runs 0.624 → 1 (frames s00 → s01: an inset dark card becomes the full viewport), while an overlaid epigraph crossfades into the brand line and a decorative `img.sign` fades `0.88 → 0`. Transform and opacity only — no layout. *Reads as:* the camera pushing in through a doorway; the quote becomes the sign above it. *Transfers to:* any hero that has both a manifesto sentence and a brand line and refuses to stack them. *Safety:* **production-safe**; both CTAs are present and clickable at every scroll position, which is the condition that makes a pinned hero legitimate.

- **Header ink inversion driven by a ground sentinel** — *Trigger:* in-view. *Mechanism:* while the fixed header overlaps the dark hero it is transparent with `#ffffff` text; once the beige band arrives, background transitions `transparent → #f0ece0` and every child recolors to `#353839` (the primary button inverts too: `#fffdf9`-on-transparent → `#353839`-on-beige). One IO sentinel toggles a class; a 300ms transition does the rest. *Reads as:* one header that belongs to whichever ground it's over. *Transfers to:* every site with a dark hero and a light body — this is strictly better than a header that pops opaque at `scrollY > 0`. *Safety:* **production-safe**; the only cost is that the transparent state must still clear 4.5:1 against the photograph beneath it.

- **Pinned photo panel with a scrolling index** — *Trigger:* scroll-progress. *Mechanism:* a full-viewport café photograph is `position: sticky` under the header while a right-aligned column of café names (Battersea → Portobello, ~44px serif) scrolls past it and is clipped by a `linear-gradient(rgba(255,255,255,0) 0%, #36393a 100%)` fade at the panel's edges (frames s04 → s05). The still image is the fixed layer; the list is the only thing moving. *Reads as:* standing in one café while the estate is read aloud. *Transfers to:* location lists, chapter indexes, roster/team pages — anywhere a long list would otherwise be a boring `<ul>` on white. *Safety:* **production-safe** (native `position: sticky`, zero JS). See `patterns/pinned-panel-scrolling-index.md`.

- **Progressive text fill on the reading line** — *Trigger:* in-view, with an IO `rootMargin` of `0px 0px -98% 0px` (a one-line-tall trip wire near the top of the viewport) and a `fillAnimation` keyframe. Display copy sits in muted `#c4bfaf` and inks to `#353839` as each line crosses the wire. *Evidence + caveat:* the static full-page capture shows the intro heading still entirely un-inked, which is exactly what a JS-gated fill looks like when nothing scrolls. *Reads as:* the page reading along with you. *Transfers to:* one manifesto paragraph per page, never to a body column. *Safety:* **production-safe** in kind, **defective as shipped**: `#c4bfaf` on `#f0ece0` is roughly 1.4:1, so the un-inked state is decorative-only text. Reuse it with a muted tint that already passes contrast (a 60% ink tint, not a beige), so a reduced-motion or no-JS reader loses nothing.

- **Ground-slower-than-page parallax on photographic bands** — *Trigger:* scroll-progress. *Mechanism:* a `::before` pseudo-element carrying the band's photograph is translated at a fraction of scroll speed; two content blocks additionally fade `0 → 1` on entry. Three parallax effects on the entire page. *Reads as:* photographs sitting *behind* the paper rather than on it. *Safety:* **production-safe** at this amplitude; the same technique at 40% travel is motion-sickness territory.

- **Chrome-level hover only** — *Trigger:* hover. *Mechanism:* nav buttons fill with `rgba(196,191,175,0.3)` and drop text to 80% opacity; links dim to ~0.53; 150ms, one curve, 12 effects total. Nothing scales, nothing lifts.

Named keyframes the home page does **not** corroborate — `marquee`, `rotate-slightly`, `rotate-slightly-oposite`, and a set of per-café choreographies (`cheff-walla-covent-garden`, `food-covent-garden-1…4`) — are loaded from the shared bundle and presumably belong to the café subpages. They are recorded here as provenance, not as observed behaviour.

**Reduced motion: respected, thinly.** `respectsReducedMotion: true`, but the single `@media (prefers-reduced-motion: reduce)` block contains only Tailwind's opt-in `motion-reduce:duration-0 / delay-0` utilities — it zeroes what it is applied to, and nothing else. Treat it as a partial guard: the patterns below ship a blanket fallback instead.

## Production-safety note

Every technique is transform/opacity/`position: sticky` — no scroll-hijacking, no canvas, no cursor follower, and 58 of 78 images are lazy. Three defects to fix on reuse: (1) the un-inked text-fill state fails contrast at ~1.4:1; (2) 145 of 336 interactive elements fall below the 44px tap-target minimum (the dense footer link columns and the 44-link desktop nav); (3) the reduced-motion guard is opt-in per class rather than a blanket disable, so the hero zoom and band parallax run regardless of preference. Focus rings are present and visible (2px outline plus a two-tone ring), and alt coverage is 100%.

## Extracted patterns
- `letterpress-frame-card` — a double-rule plaque with a tracked small-caps eyebrow and an ornament divider; reuse for awards, stats, and pull-quotes wherever a shadowed rounded card would flatten the content into "three features."
- `pinned-panel-scrolling-index` — a sticky full-viewport photograph with a long list scrolling across it behind a gradient fade; reuse for locations, chapters, or rosters, built on native `position: sticky` with no JS.
