---
slug: tend
url: https://www.hellotend.com
source: editorial-pick
corpus: production
surface: site
captured: 2026-07-10
award_type: Editorial Pick
score: null
tags: [healthcare, dental, clinic, local-business, booking, consumer, warm, serif]
when_to_use: [landing, hero, feature-section, navigation, product-marketing]
directions: [soft, editorial]
layout: [center-stack, content-grid]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [arch-portrait-flanked-hero, peek-rail-auto-scroll]
tokens_snapshot: ../tokens/tend.json
screenshots: ../screenshots/tend/
---

## What works

- **Delete the cool grays and a clinical category stops feeling clinical.** There is no pure black, no pure white ground and no blue-gray anywhere in the content: the page sits on bone (`#f9f9f6`), body copy is a warm taupe (`#6c675c`), and every semantic hue — mint, sage, terracotta, chartreuse — shares that warm undertone. The calm is not "lots of whitespace"; it is the *absence of a cold neutral axis*. Transfers to any category (health, finance, legal) whose default palette signals authority when it should signal approachability.

- **Hierarchy from family + hue, not from weight or darkness.** Headings are a serif (Nantes, 700) in desaturated sage `#698680`; body is a grotesque (Founders Grotesk, 400) in taupe. The heading is *lighter in value* than the paragraph under it, so the page never shouts — the family switch and the hue shift carry the ordering, and a ~3.4× body→display size jump does the rest. Only h1/h2 take the serif; h3–h6 fall back to the sans, which keeps the serif rare enough to stay expensive.

- **Faces at the edges, message in the middle.** Instead of the default split-hero (text left, photo right), two portraits are arch-cropped and bled off the left and right viewport edges while the headline holds the center column. The humans frame the message rather than compete with it, and the composition still centers on narrow viewports because the arches simply leave. The device repeats verbatim on the clinical-team band, which is what makes it read as a system and not a hero trick. → `arch-portrait-flanked-hero`

- **One radius idea at three scales.** 25px on cards, 50px on every button and input pill, 206px on photography (`--border-radius-xlg: 12.875rem`). Nothing on the page has a square corner, and the arch is not a separate "shape" — it is the same rounding taken to its limit, which is why cropped photography reads as part of the design system instead of pasted into it. Reusable rule: derive your most expressive shape from your smallest one.

- **Fluid type as a token, not as a media query.** Every heading size is a single custom property of the form `clamp(2.5rem, calc(5vw - 0.5rem), 3.625rem)`. Desktop h1 (63px) and mobile h1 (39px) come out of one declaration; the five breakpoints (500/900/1150/1280px) then only ever collapse *grids*, never retype the page. Cuts the responsive surface area of a design system roughly in half.

- **Color bands are the elevation system.** Section separation comes from full-bleed grounds — deep green `#36514c` for insurance, mint `#eaf4eb` for the clinical team — and cards sit on flat tints. A drop shadow appears four times on the entire page. Chapters made of color instead of shadow are cheaper to render, survive at any zoom, and don't accumulate the muddy "floating card soup" look.

- **Progressive disclosure over long copy.** 18 native `<details>` and 30 disclosure controls (a "View more" on the benefit grid, "Read more" on each testimonial, per-city studio counts) keep every section to one screen. The commitment: default state answers the question, expansion answers the follow-up.

## Design-system read

- **Type:** Two families, strictly divided. `Nantes` serif 700 for h1/h2 only; `Founders Grotesk` 300–700 for everything else. Fluid clamp scale, ratio ≈1.2–1.25 per step: 1.0625 → 1.125 → 1.25 → 1.375 → 1.5 → 1.875 → 2.375 → 3 → 3.625rem. Body 17px / 1.45 leading; h1 63px / 1.19. Tracking is effectively neutral (0.17px ≈ 0.01em) except 1.2–1.5px on small all-caps eyebrows. Hierarchy = family + hue + size; weight is nearly constant (400 accounts for 3,616 of 4,258 sampled nodes).
- **Color:** Ground bone `#f9f9f6` / white cards. Text taupe `#6c675c` — and there is **no separate muted-text token**; secondary copy is the same taupe, one size down. Sage `#698680` is the heading/quote-card hue, deep green `#36514c` the inverted band, terracotta `#bc8452` the icon + focus-ring + secondary-CTA accent, and a chartreuse `#e7fb7e` appears only twice (utility bar, star ratings) as the brand's one loud note. The primary CTA is a plain trust-blue `#0178d1` — deliberately *not* on-brand, so "Book Now" reads as a system affordance rather than decoration.
- **Spacing rhythm:** Base unit 10px (`--space-10` … `--space-160`, all decade multiples), not the usual 8. Gap defaults to 10px inside components and 30px between them; section padding runs 100px. Content max-width 1316px, prose columns clamp near 946px / 520px.
- **Layout system:** Center-stack hero, then a content grid of two-column flex rows that collapse to one column at 900px. Only two real CSS grids exist — the page is flex rows with `max-width` + `margin-inline: auto`. Nav is 22 links visible at 1440px with no hamburger until small screens.
- **Layering / page architecture:** Essentially a single flat scroll — no static backdrop, no blend or backdrop-filter anywhere (`blend_glass` is empty on all three axes). The z-axis carries exactly three ideas: a floating pill header that swaps from `position: absolute; background: transparent` to `position: fixed` once a `.scroll` class lands (and shrinks the logo 6.94→6.19rem in the same rule), a sticky store-locator map holding the right column still while city rows scroll past it, and a fixed accessibility toggle at the bottom-left. Everything else is in document flow. The "depth" people perceive is color banding, not stacking.
- **Motion / easing intent:** 200ms `ease-out` is the house transition (450 declarations); 100ms `linear` is reserved for the parallax transform; 1s `ease` for carousel travel. No custom cubic-béziers, no stagger delays. Motion here confirms interaction — it never narrates.
- **Density:** High. Ten headline sections, 83 buttons, 196 images, eight carousels — yet each viewport holds one idea, because disclosure hides the second layer and color bands hard-cut the chapters.
- **Hierarchy:** Position and hue first, size second, weight last.
- **Restraint:** No dark mode, no gradient beyond one 30px mint fade, no cursor follower, no scroll-jacking, no hero video (the product film is a click-to-play poster). The serif is withheld from h3 downward. The brand's loudest color is confined to a 40px utility strip.

## Interaction & motion

- **Custom-property parallax** — *Trigger:* scroll-progress. *Mechanism:* the element carries `transform: translateY(var(--parallax, 0px)); transition: transform .1s linear; will-change: transform; backface-visibility: hidden` and script writes **only the number** into `--parallax`; CSS owns the transform. *Reads as:* photography that breathes against its band rather than sitting on it. *Transfers to:* any layered image section — separating "who computes the value" from "who applies it" means one CSS rule can be disabled wholesale. *Safety:* **production-safe** (transform-only, composited), but this build pays for it with 8 scroll listeners and a hot rAF loop; the corpus's `parallax-drift` gets the same result on `animation-timeline: view()` with no main-thread cost. See `patterns/parallax-drift.md`.
- **Auto-advancing peek rail** — *Trigger:* load (continuous), with hover/arrow override. *Mechanism:* a looped horizontal rail translates its list continuously; neighbor cards are deliberately allowed to bleed past both edges rather than being clipped flush. *Reads as:* "there is more here than fits" — the peek, not the arrows, is what tells you the rail scrolls. *Transfers to:* testimonials, logo walls, service chips, any set whose *volume* is the argument. *Safety:* **production-safe** only with pause-on-hover/focus, a manual-scroll fallback, and reduced-motion honoring; perpetual motion beside body copy is a known reading hazard. → `patterns/peek-rail-auto-scroll.md`
- **Transparent → pinned pill header** — *Trigger:* scroll-progress (class toggle past a threshold). *Mechanism:* the nav starts absolutely positioned and transparent over the hero, and on `.scroll` becomes `position: fixed` with reduced logo size and button padding — the same element, two states, no clone. *Reads as:* the header earns its background only once it starts overlapping content. *Transfers to:* any hero with a header over imagery. *Safety:* **production-safe**; keep the fixed height small (this one reserves `--header-height: 8.375rem`, which is a lot of viewport on a laptop).
- **Brand-shaped media window** — *Trigger:* none (static). *Mechanism:* the media rail's track takes `mask-image: url(blob.svg); mask-size: 100% 100%` above 1281px, and falls back to plain `border-radius` below it. *Reads as:* photography cut to the brand's own silhouette. *Transfers to:* any hero image you want off-rectangle. *Safety:* **production-safe** — the fallback is declared in the same ruleset, so a missing mask never breaks the crop.
- **Reduced motion:** **respected, twice over.** A global `@media (prefers-reduced-motion: reduce)` clamps every animation and transition to `0.01ms` and disables smooth scroll, and the parallax element additionally resets `transform: none !important`. This is the right shape: a blanket rule plus an explicit reset for the one effect that leaves an element displaced.

## Production-safety note

Everything here is production-safe; the two costs worth naming are **176 sub-44px tap targets out of 574 interactive elements** (the dense footer link columns and carousel arrows), and the **scroll-listener + rAF parallax**, which is the one place the page spends main-thread budget it did not have to. The a11y positives are real and worth copying: a `transform`-hidden skip link that slides in on focus, a global `:focus, :target { outline: 2px solid #bc8452; outline-offset: .125rem }` in a brand hue rather than a suppressed outline, `:target { scroll-margin-top: var(--header-height) }` so anchors clear the pinned nav, and alt text on 196 of 196 images.

## Extracted patterns

- `arch-portrait-flanked-hero` — centered display stack framed by arch-cropped portraits bleeding off both viewport edges; reuse when the humans *are* the product and a split-hero would make them compete with the message.
- `peek-rail-auto-scroll` — continuously advancing looped card rail whose neighbors peek past the edges; reuse for testimonial/logo sets where volume is the argument. Pause-on-hover, keyboard-reachable, reduced-motion aware.
