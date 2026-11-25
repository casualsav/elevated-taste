---
pattern: pinned-panel-scrolling-index
from: dishoom
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [motion, navigation, feature-section, editorial, locations, brand-experience]
---

## What it is

A long list — locations, chapters, a roster, a table of contents — scrolls across a full-viewport photograph that holds perfectly still beneath it. The photograph is `position: sticky`; the list is ordinary flow content in the same section. Both ends of the list are dissolved into the image by a gradient mask, so names appear out of the dark and return to it rather than clipping at a hard edge. Dishoom pins a café interior and runs eighteen café names (Battersea → Portobello) across it in 44px serif; a standing headline and a single "Explore cafés" link sit in the lower-left of the pinned layer.

## Why it works

An eighteen-item list is a scale claim — "we are everywhere" — and a `<ul>` on white destroys it by making each item look like a row in a table. Pinning a single photograph converts the list into *place*: you are standing somewhere while the names go past. The stillness is the effect. Nothing animates; the fixed layer is the one thing your eye trusts, and the movement of the list against it is manufactured entirely by the reader's own scroll.

Three constraints make it work rather than annoy:

- **Nothing is pinned longer than the list is long.** The section's height *is* the list's height. A sticky panel that outlives its content is a scroll-jail.
- **The mask fades into the panel's own ground**, not to transparent. Fading to transparent reveals whatever is behind and reads as a bug; fading to the image's dark end reads as depth. Use `mask-image` where supported, and a `background-image` gradient overlay as the guaranteed fallback.
- **Zero JavaScript, zero listeners.** Native `position: sticky` is compositor-driven. Anything you'd add — an "active item" highlight, a crossfading image per name — buys a scroll listener and an accessibility problem, and buys the reader nothing they weren't already getting.

Reduced motion still gets the content: the panel un-sticks into a plain image above a plain list. Nothing was ever encoded in the movement, so nothing is lost — which is the test any scroll-linked section should pass before it ships.

## Reference implementation

```html
<style>
  .pinned-index {
    position: relative;
    background: var(--color-band-ink, #353839);
    color: var(--color-fg-on-dark);
  }

  /* The still layer. Its height is one viewport; the SECTION's height is the list's. */
  .pinned-index__panel {
    position: sticky;
    top: var(--header-height, 0px);
    block-size: calc(100svh - var(--header-height, 0px));
    overflow: hidden;
  }
  .pinned-index__panel img {
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
    /* The photograph is a ground, not a subject — let the type own the contrast. */
    filter: brightness(0.55);
  }

  /* The standing headline rides along with the still layer. */
  .pinned-index__caption {
    position: absolute;
    inset-block-end: var(--space-8);
    inset-inline-start: var(--container-padding, var(--space-6));
    max-inline-size: 30ch;
  }
  .pinned-index__caption h2 {
    font-family: var(--font-serif, Georgia, "Times New Roman", serif);
    font-size: var(--text-3xl);
    font-weight: var(--weight-regular);
    line-height: var(--leading-snug);
    letter-spacing: 0.04em;
    margin: 0 0 var(--space-4);
    text-wrap: balance;
  }
  .pinned-index__link {
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
    color: inherit;
  }

  /* The moving layer: normal flow, pulled up over the sticky panel. */
  .pinned-index__list {
    position: relative;
    z-index: 1;
    margin: calc(-100svh + var(--header-height, 0px)) 0 0;   /* overlap the panel exactly */
    padding-inline: var(--container-padding, var(--space-6));
    padding-block: 40svh;                                     /* first + last name enter/leave inside the frame */
    list-style: none;
    text-align: end;
    pointer-events: none;                                     /* the panel's link stays reachable */
    /* Names dissolve into the panel's ground at both ends. */
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%);
    mask-image: linear-gradient(to bottom, transparent 0%, #000 18%, #000 82%, transparent 100%);
  }
  .pinned-index__list a { pointer-events: auto; color: inherit; text-decoration: none; }
  .pinned-index__list li {
    font-family: var(--font-serif, Georgia, "Times New Roman", serif);
    font-size: var(--text-4xl);
    line-height: var(--leading-snug);
    letter-spacing: 0.02em;
  }
  .pinned-index__list a:hover,
  .pinned-index__list a:focus-visible { opacity: 0.6; transition: opacity var(--duration-fast) var(--ease-standard); }

  /* Engines without mask-image: paint the same fade as an overlay instead. */
  @supports not (mask-image: linear-gradient(#000, transparent)) {
    .pinned-index__list { -webkit-mask-image: none; mask-image: none; }
    .pinned-index__panel::after {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 2;
      pointer-events: none;
      background:
        linear-gradient(to bottom, var(--color-band-ink, #353839) 0%, transparent 18%),
        linear-gradient(to top,    var(--color-band-ink, #353839) 0%, transparent 18%);
    }
  }

  /* Mandatory. The section carries no information in the movement, so it simply stops moving. */
  @media (prefers-reduced-motion: reduce) {
    .pinned-index__panel { position: static; block-size: auto; }
    .pinned-index__panel img { block-size: auto; aspect-ratio: 16 / 9; }
    .pinned-index__caption { position: static; max-inline-size: none; padding: var(--space-6); }
    .pinned-index__list {
      margin-top: 0;
      padding-block: var(--space-6);
      text-align: start;
      -webkit-mask-image: none;
      mask-image: none;
    }
  }

  /* Small screens: a pinned viewport-tall photo under a 44px list is a scroll-jail. Unstack it. */
  @media (max-width: 768px) {
    .pinned-index__panel { position: static; block-size: 60svh; }
    .pinned-index__caption { inset-block-end: var(--space-6); }
    .pinned-index__list {
      margin-top: 0;
      padding-block: var(--space-6);
      text-align: start;
      -webkit-mask-image: none;
      mask-image: none;
    }
    .pinned-index__list li { font-size: var(--text-2xl); }
  }
</style>

<section class="pinned-index" aria-labelledby="cafes-heading">
  <div class="pinned-index__panel">
    <img src="/photos/cafe-interior.jpg" alt="A quiet corner of the café, chairs stacked, morning light through the shutters">
    <div class="pinned-index__caption">
      <h2 id="cafes-heading">Take refuge with a warming cup of chai, a simple snack or sublime feast</h2>
      <a class="pinned-index__link" href="/cafes">Explore cafés &rarr;</a>
    </div>
  </div>

  <ul class="pinned-index__list">
    <li><a href="/cafes/battersea">Battersea</a></li>
    <li><a href="/cafes/canary-wharf">Canary Wharf</a></li>
    <li><a href="/cafes/carnaby">Carnaby</a></li>
    <li><a href="/cafes/covent-garden">Covent Garden</a></li>
    <li><a href="/cafes/kensington">Kensington</a></li>
    <li><a href="/cafes/kings-cross">King&rsquo;s Cross</a></li>
    <li><a href="/cafes/shoreditch">Shoreditch</a></li>
    <li><a href="/cafes/birmingham">Birmingham</a></li>
  </ul>
</section>
```

**Watch the two failure modes.** (1) The negative margin must equal the panel's height exactly, or the list drifts off the photograph — derive both from the same `100svh - var(--header-height)` expression, never from two hand-typed numbers. (2) Keyboard focus must not scroll a name behind the mask's transparent zone: the 18% fade bands are decoration, so keep the list's `padding-block` larger than them, as above.
