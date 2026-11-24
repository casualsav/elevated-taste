---
slug: ssense
url: https://www.ssense.com
source: editorial-pick
corpus: expressive
captured: 2026-07-10
award_type: Curated
score: null
tags: [fashion, luxury, retail, magazine, monochrome, photography, typography]
when_to_use: [editorial, ecommerce, landing, blog, navigation]
directions: [editorial, minimalist]
layout: [editorial-columns, content-grid]
a11y: [alt-coverage-high, focus-visible-missing, tap-targets-risky, reduced-motion-ignored]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [hanging-meta-label, editorial-row-archetypes]
tokens_snapshot: ../tokens/ssense.json
screenshots: ../screenshots/ssense/
---

## What works

- **Type-role inversion — grotesque headlines, serif running copy.** Every headline is an ultralight (weight 100) uppercase grotesque; every dek, kicker and category label is a semilight serif. That's the reverse of the default serif-display / sans-body pairing, and it's why the page reads as a magazine index rather than a store: uppercase light grotesque behaves like a *caption* — it announces without shouting — so the photography stays the loudest element on screen, while the serif does the actual reading work. Transfers to any image-led index (news, portfolio, catalog) where the headline must label the image, not compete with it.

- **Tracking is a function of size, not a fixed value.** Tracking tightens proportionally as type grows: −0.05px at 20px, −1.25px at 28.5px, −2px at 53px, −3.75px at 100px — a near-constant ≈ −0.0375em across the whole scale. Setting tracking in `em` (rather than px per component) makes a light grotesque hold together at display sizes without collapsing at body sizes. Reusable in any type scale: one `--tracking-display: -0.04em` token beats six hand-tuned px values.

- **Hairlines do all the dividing; there are no cards.** A single 1px #979797 rule (top, and bottom on the last item) separates list rows; sections separate with whitespace alone. No shadow, no fill, no border-radius except one 10px outline pill CTA — the entire elevation vocabulary is `0`. Separation-by-rule survives density where separation-by-card does not: the dense article rail fits four items in a column that a card grid would need twice the height for. Transfers directly to data tables, changelogs, and settings lists.

- **Near-monochrome chrome so the photography carries all chroma.** Page is `#fff` / `#f4f4f4` / `#333` / `#979797`. Body text is `#333`, never `#000` — pure black is reserved for buttons, focus borders and form outlines, which buys a full step of contrast headroom for interactive elements without introducing a hue. The only saturated color in the stylesheet is the error red. Any brand whose content is photographic should spend its palette this way.

- **The page is a sequence of row archetypes, not one grid.** The homepage composes a closed vocabulary of about five row types — full-bleed link module, fifty-fifty, three-thirds, dense list rail, editorial break — in any order, each row internally a negative-margin gutter flex grid. Editorial variety comes from *sequencing* a small set, not from bespoke one-off layouts. This is what keeps a 4,800px homepage from feeling either monotonous or arbitrary, and it's how you give a CMS an authoring surface that can't produce an ugly page.

- **Crop ratio is a rhythm instrument, and it's reserved before load.** Tiles carry different aspect ratios (a 4:3 portrait beside a 1.4:1 landscape beside a 8:1 strip), each reserved with a padding-box aspect hack on the image wrapper before the lazy image resolves. Varying crops give the scroll cadence; reserving them gives zero layout shift. The variety is free — the stability is the engineering.

- **Metadata hangs outside the text column.** At ≥1024px the category label is pulled into the left margin (`width: 4.25rem; margin-left: -4.25rem`) so the headline's left edge stays flush on the column grid; below that breakpoint it collapses inline. Hanging the secondary information preserves the primary alignment — the oldest trick in print, and still the cheapest way to make a web page look typeset.

## Design-system read

- **Type:** Two families, two jobs. Grotesque (`Favorit SSENSE Inter`) at weight 100 for all headlines and UI labels, uppercase; serif (`JHA Times Now`, semilight) for deks, kickers, dates. Scale runs 11px → 100px (≈9×) at four fixed steps (768 / 1024 / 1440 breakpoints; no `clamp()` — the type steps rather than flows). Leading is tight everywhere: 0.94 at display, 1.19 at tile headline, 1.3 for serif body, 1.36 for 11px meta. Hierarchy is created by **scale and case**, never by weight — there is effectively one weight on the page.
- **Color:** `bg #ffffff` · `surface #f4f4f4` (image placeholder *and* the announcement bar — one gray does both) · `fg #333333` · `muted #888888` · `hairline #979797` · `accent #000000` (button fill, input border, link underline). Semantic red `#ff2b00` for errors only. Roles are strictly separated: text never uses the accent black, chrome never uses the text gray.
- **Spacing rhythm:** base 10px. Row gutters step 10 → 20 → 30 → 40px across the three breakpoints; vertical section rhythm steps 40 → 80px; page margin 20 → 80 → 120px. Whitespace, not rules, separates *sections*; rules separate *rows within a section*.
- **Layout system:** Flex, not CSS grid (77 flex containers, 1 grid). Rows are negative-margin gutter grids (`margin: 0 -0.625rem` on the row, matching positive margin on the cell) with cells at 100% / 50% / 33.33% / 66.66%. Container bleeds negative at mobile (`margin: 0 -23px`) so images run edge-to-edge while text stays inset. Breakpoints 768 / 1024 / 1440 for type and gutters; 568 / 768 / 1024 for structure.
- **Layering / page architecture:** Single flat scroll. Two fixed layers only — the opaque white header (z 1000, 10% viewport coverage) and an invisible notification host. No static backdrop, no blend overlay, no `backdrop-filter`, no glass. Depth is *photographic*, never *architectural*: the images have depth, the page does not.
- **Motion / easing intent:** Two durations (350ms, 500ms) and one easing (`ease`), applied to transitions only. The four `@keyframes` in the entire stylesheet are loading indicators. The message: motion is a loading affordance here, not an expressive one.
- **Density:** Very high — ~30 linked stories above the footer, 91 interactive elements. It stays legible because the 11px meta type is *set at 11px on purpose* (it's a label, not text you read) while the actual prose sits at 20px/26px serif; the eye sorts by size instantly.
- **Hierarchy:** Scale first, case second, position third. Color and weight carry no hierarchical load at all.
- **Restraint:** No hero image. No gradient. No shadow. No card. No scroll animation. No second weight. No accent hue. The homepage of a luxury retailer opens on a text link (`SHOP MENSWEAR`) at 100px — the product photography starts below the fold.

## Interaction & motion

The site is **deliberately static**. Evidence: 0 IntersectionObservers, 0 entrance reveals, 0 hover transforms, 0 cursor followers, 0 canvases or marquees; 4 `@keyframes` all named for loaders (`s-loader-blink`, `s-loader-dash`, `blink`, `sk-scaleout`); 37 transition rules, 2 durations, 1 easing. The 9 scroll listeners, 8 mousemove listeners and 83 rAF calls trace to third-party analytics hosts (TikTok, Pinterest, Datadog, GTM), not to page choreography — the 11-frame scroll sequence shows nothing moving but the content itself. The two techniques worth naming:

- **Opaque pinned header** — *Trigger:* load (fixed, not scroll-toggled). *Mechanism:* full-width `position: fixed` bar at z 1000 with a solid `#fff` background — no blur, no transparency, no hide-on-scroll-down. *Reads as:* stable furniture; the page moves, the chrome does not. *Transfers to:* any long index where wayfinding matters more than immersion. *Safety:* **production-safe** — opaque beats `backdrop-filter` (no paint cost, no text-over-image contrast failures).
- **Aspect-reserved lazy image** — *Trigger:* in-view (intersection handled by `lazysizes`, not app code). *Mechanism:* the image wrapper reserves the crop with a percentage padding-box before the responsive `srcset` resolves, then the absolutely-positioned `<img>` fades into place. *Reads as:* the page never jumps. *Transfers to:* every image grid. *Safety:* **production-safe**; the modern form is `aspect-ratio` + `loading="lazy"` + `decoding="async"`. See `patterns/editorial-row-archetypes.md`.

Reduced motion is **not** respected (0 `prefers-reduced-motion` rules), but the exposure is near-zero — the only animations are loading spinners. Copy the stillness, not the omission.

## Production-safety note

Everything structural here is **production-safe**; the expressive risk is entirely typographic. Two costs to price in before borrowing:

- **Weight-100 grotesque at small sizes** is a contrast failure waiting to happen. It works at 28px+ on white. Below ~15px the site switches to a normal weight — do the same, and never render hairline weight on a colored or photographic ground.
- **11px UI type + 25 sub-44px tap targets** (`tap-targets-risky`) and **no `:focus-visible` styles at all** (`focus-visible-missing`, only a `:focus` border on inputs) are the two things not to copy. Keep the density, keep the hairline aesthetic, and still ship a visible focus ring — a 1px `outline-offset: 2px` ring costs nothing in this design language.
- The whole page is one `<h1>` + one `<h2>` + 33 `<h4>`s — the heading levels skip. Alt coverage is 100% (`alt-coverage-high`), so fix the outline, keep the alts.

## Extracted patterns

- `hanging-meta-label` — pull the category/date label into the left margin so headlines stay flush on the column grid; collapses inline below the breakpoint.
- `editorial-row-archetypes` — compose a page from a closed vocabulary of gutter-grid row types with per-tile reserved crop ratios and hairline-divided dense rails.
