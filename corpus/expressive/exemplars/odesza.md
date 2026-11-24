---
slug: odesza
url: https://odesza.com
source: editorial-pick
corpus: expressive
captured: 2026-07-10
award_type: Curated
score: null
tags: [music, artist, brand, monochrome, svg, dark, events]
when_to_use: [hero, brand-experience, landing, navigation, footer]
directions: [minimalist, expressive]
layout: [full-bleed, center-stack]
a11y: [reduced-motion-ignored, focus-visible-missing, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [nav-invert-past-hero, event-row-to-card]
tokens_snapshot: ../tokens/odesza.json
screenshots: ../screenshots/odesza/
---

## What works

- **A strict two-color binary replaces an elevation system.** The entire page is ink `#262744` and paper `#EEEEEE` — nothing else. The computed-style profile confirms zero shadows and zero gradients across the document. Depth and emphasis come from *swapping which of the two colors is the ground*: a button is ink-on-paper at rest and paper-on-ink on hover, the same 2px border holding both states. When you only have two colors, every surface change is legible without a shadow ramp, and you never have to invent a "surface-3". Transfers to any brand that wants force without decoration — the constraint does the work a shadow scale would otherwise do badly.

- **The fixed nav has no background until it needs one.** Over the full-bleed hero the nav is `background: unset` with paper-colored links and logo; once the page scrolls past the hero it gains a paper background and ink content. The mechanism that matters is *where the flip is triggered*: `heroHeight − navHeight`, measured from the hero element, not a hard-coded pixel offset. The nav therefore inverts at the exact instant the dark backdrop stops passing beneath it, at any viewport size, with no breakpoint tuning. This is the correct general solution to "transparent header over a hero" and it transfers to every landing page that has one. See `patterns/nav-invert-past-hero.md`.

- **Brand identity shipped as path data, not pixels.** The document contains zero `<img>` elements and ten inline SVGs — wordmark, icosahedron, every social glyph. Because they are inline, they're filled with `fill` from the same two-color system and recolor for free when the nav state flips; because they're vectors, the 220px hero mark and the 100px logo are one asset. The only raster is the hero's background texture, where photography is actually the point. The rule: anything that must recolor with state, or scale across breakpoints, should be inline SVG — an `<img>` can do neither.

- **A persistent frame, honestly accounted for.** Nav and footer are both `position: fixed`, both 80px, top and bottom — the content scrolls through a fixed window rather than under a header alone. The failure mode of a fixed footer is that the last section slides beneath it forever; here the hero is lifted to `z-index: 2` so it *occludes* the footer while it's on screen, and an empty spacer element reserves the footer's height at the end of the flow so the final content can always clear it. If you pin chrome to the bottom of the viewport, you owe the document that reserved height. Transfers to any app shell or brand site with persistent chrome.

- **Hierarchy is size and weight only — never color.** Everything is uppercase (`text-transform: uppercase` set on `html, body`), one family, one hue for all text. The whole scale is 16 / 18 / 22 / 58px with weights 400 / 600 / 700 and a flat `-1px` tracking. That's a ~2.6× body-to-display jump, small by display standards, but with color and case removed from the ordering toolkit the size jump reads as much larger than it is. Removing a hierarchy device makes the remaining ones louder — useful whenever a brand's palette is too small to encode rank.

- **Responsive reflow reassigns hierarchy instead of shrinking it.** Desktop tour rows are a four-column flex line (date · venue · city · button) where the venue is 18px body text. Below 768px the row becomes a stacked card and the venue *grows* to 36px, becoming the card's headline; the date shifts 600 → 700 weight to hold its rank as an eyebrow. The h1 stays 58px at both widths. The mobile layout is not the desktop layout scaled down — it is a different assignment of the same type scale to the same content, because a phone reads a list as a stack of cards and a stack of cards needs a headline. Transfers to any table or row list that must survive a narrow viewport.

- **Restraint:** no scroll animation, no entrance reveal, no parallax, no carousel, no shadow, no gradient, no second accent color. For a music artist — a category that reliably over-animates — the page's whole expressive budget is spent on one texture and one large vector mark, and it lands harder for it.

## Design-system read

- **Type:** One family (Inter 400/600/700) at 16 / 18 / 22 / 58px; body base is an unusually large 22px, so the display jump is only ~2.6×. A display face (`ErotiqueRegular`) is loaded but the wordmark is drawn as SVG paths rather than set as text — the logotype is art, not type. Global uppercase with `-1px` tracking; the negative tracking is what keeps 22px all-caps from feeling shouty and loose. Hierarchy = size + weight, never color, never case (everything is already caps).
- **Color:** A two-token system. `ink #262744` (a desaturated navy that reads black at a glance but stays warm next to the hero's blues) and `paper #EEEEEE` (never pure white — pure white appears only inside the third-party cookie banner, which is exactly why that banner reads as foreign). Roles collapse: ink is fg *and* the button's surface *and* every border; paper is bg *and* the fg on those surfaces. Hover swaps the pair. The hero's photographic blue is the only color outside the system and it belongs to the image, not the UI.
- **Spacing rhythm:** Base 15px with a 7.5 / 15 / 30 halving-doubling scale — an odd base, but consistently applied: gaps, gutters, section padding and margins are all drawn from it. Sections get 95px block padding, giving the two-content-block page enormous vertical air. Chrome height is 80px top and bottom.
- **Layout system:** Flex only — zero CSS grid on the page apart from one image grid elsewhere in the site. A single 980px content container centers the tour list; the hero is full-bleed. One breakpoint, 768px, which flips the tour row to a card and the nav to a hamburger. Density is deliberately low: two sections on the homepage.
- **Layering / page architecture:** Six fixed layers, no sticky, no blend modes, no backdrop-filter, no static backdrop. The z-story is short and legible: footer at `z: 1`, hero at `z: 2` (so the hero covers the footer while it's on screen), nav at `z: 100`, modal at `110`, cookie banner at `9999`, loader at `10000`. The hero's background image is painted on the section itself rather than on a fixed layer behind the page — so this is a flat scroll with pinned chrome, not a parallax world. The one subtlety worth stealing: raising a section above the pinned footer to hide it, rather than toggling the footer's visibility.
- **Motion / easing intent:** Almost none, and that is the design. Exactly one `@keyframes` (`lds-facebook`, the page loader's bar bounce) and six transition rules. Two durations carry everything: `150ms ease-in-out` for the nav's color/background inversion, `300ms ease` for the button's color swap. Motion here exists only to keep a state change from being a jump cut — it never draws attention to itself.
- **Density:** Very low. A hero holding one vector mark, and a six-row event list. The information the site actually needs to deliver — dates, venues, ticket links — is delivered in one glance because nothing competes with it.
- **Hierarchy:** Scale, then weight. Position does the rest: the tour row's fixed `min-width` columns (170px date, 350px venue) create implicit alignment rails, so six rows scan vertically without a single divider line.
- **Restraint:** No shadows, no gradients, no accent color, no scroll choreography, no imagery beyond one texture. The page also hides its own scrollbar (`::-webkit-scrollbar { display: none }`) — a stylistic call with a real usability cost, since scroll affordance disappears on desktop.

## Interaction & motion

The site is near-static; the motion budget is spent on state transitions, not choreography. Grounded in: one `@keyframes` name (`lds-facebook`), 6 transition rules, 1 scroll listener, 0 IntersectionObservers, 0 detected animation libraries, 0 entrance reveals.

- **Hero-clearance nav inversion** — *Trigger:* scroll-progress (a single threshold, not a continuous mapping). *Mechanism:* a scroll listener toggles a `.scrolled` class when `pageYOffset > heroHeight − navHeight`; the class swaps `background-color`, link `color`, logo `fill` and hamburger bars between the two brand colors, each on a `150ms ease-in-out` transition. *Reads as:* the header belonging to whatever is behind it. *Transfers to:* any transparent header over a dark hero. *Safety:* **production-safe** — but the reference implementation in `patterns/nav-invert-past-hero.md` replaces the scroll handler with an IntersectionObserver sentinel, because the site's version reads `offsetHeight` on every scroll event and forces layout on the main thread.

- **Two-color state swap on controls** — *Trigger:* hover/focus. *Mechanism:* `color` and `background-color` trade places across a `300ms` transition while the 2px border stays fixed — the button doesn't lift, tint, or glow, it inverts. *Reads as:* a switch being thrown. *Transfers to:* any button system in a two-color brand; it survives forced-colors mode better than a shadow-based hover. *Safety:* **production-safe** (color transitions don't reflow).

- **Full-viewport load curtain** — *Trigger:* load. *Mechanism:* a `z: 10000` fixed paper-colored panel holds three bars animating height/`top` (`lds-facebook`), then fades out on `opacity 0.1s` and is removed from flow. *Reads as:* a shutter opening on the hero. *Transfers to:* sites whose first paint is one heavy hero asset. *Safety:* **spectacle-only** — a loader animating `height` and `top` runs off the main thread's layout path every frame, and any full-screen curtain delays first meaningful paint by design. Use only when a large hero image would otherwise flash in unstyled.

**Reduced motion is not respected** — there are zero `prefers-reduced-motion` rules on the page. The exposure is small (the loader's bar bounce is the only sustained animation), but it's an unforced omission; every pattern below ships the fallback.

## Production-safety note

- Nav inversion — **production-safe**; prefer an IntersectionObserver sentinel over the site's per-scroll `offsetHeight` read.
- Button color swap — **production-safe**.
- Load curtain — **spectacle-only**; costs first-contentful-paint and animates layout properties.
- Hidden scrollbar — **spectacle-only**; removes the desktop scroll affordance and the position indicator. Don't inherit this.
- Accessibility debts to fix if you borrow this system: no `:focus-visible` styling (the page relies on the UA's 1px outline, which is nearly invisible against ink); 15 of 23 interactive elements are below the 44px tap-target minimum, mostly the footer's 28px social glyphs; and a global `text-transform: uppercase` on `html, body` means screen readers receive correctly-cased text but *all* copy is visually all-caps, which measurably slows reading of anything longer than a label — cap it at headings and UI chrome.

## Extracted patterns

- `nav-invert-past-hero` — a transparent fixed header that flips to a solid, inverted color scheme exactly when the full-bleed hero scrolls out from under it, driven by an IntersectionObserver sentinel.
- `event-row-to-card` — a tour/event list that reflows from an aligned multi-column row to a stacked card, promoting a body-sized field to the card's headline instead of scaling the row down.
