---
pattern: layered-progressive-blur-nav
from: aloud
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [navigation, motion, glass, header, dark]
---

## What it is
A fixed top nav whose background is not a flat blurred bar but a **progressive (gradient) blur curtain**: several stacked full-width layers, each with a *stronger* `backdrop-filter: blur()` and a `mask-image` gradient that fades that layer out higher up the strip. Composited, the blur ramps from crisp at the very top edge to heavy at a soft bottom fade line, with no hard cut anywhere. The whole curtain is `opacity: 0` until the page scrolls past the hero, then crossfades in — so the transparent hero shows through at rest and content dissolves gently under the chrome once you scroll.

## Why it works
A single `backdrop-filter` bar has one flaw on a scrolling page: it ends in a hard horizontal line where "blurred" meets "sharp," and that line reads as a seam. Real frosted glass blurs *progressively* with depth. You fake that by stacking layers whose blur radius increases (`1px → 2.5px → 5px → 10px → 18px`) while each layer's `mask-image` linear-gradient makes it opaque only near the top and transparent lower down. The strongest blur therefore only paints the top sliver; weaker blurs extend further; their sum is a smooth blur *gradient* instead of a step. A tinted `::after` gradient (opaque at top → transparent at bottom) rides on top to add legibility ink without a visible edge.

Two engineering points make it correct: (1) `pointer-events: none` on the curtain so it never eats clicks meant for the page; (2) gate the whole thing on a scroll *threshold* (an `IntersectionObserver` on a sentinel at hero's end), not a scroll handler — one class toggle, zero main-thread work while scrolling. The blur is expensive enough that you should drop to a single layer (or a solid bar) on small screens.

## Reference implementation
```html
<!-- framework-neutral; house tokens + inline fallbacks for the exemplar's blur ramp -->
<header class="pbnav" id="pbnav">
  <div class="pbnav__blur" aria-hidden="true">
    <i></i><i></i><i></i><i></i><i></i>
  </div>
  <nav class="pbnav__inner">
    <a class="pbnav__logo" href="#">Brand</a>
    <div class="pbnav__links"><a href="#">One</a><a href="#">Two</a></div>
  </nav>
</header>
<div id="pbnav-sentinel" aria-hidden="true"></div>

<style>
  .pbnav { position: fixed; inset-block-start: 0; inset-inline: 0; z-index: 50; }

  /* The curtain: extends below the bar so the fade line sits in empty space. */
  .pbnav__blur {
    position: absolute; inset: 0 0 -40px;
    pointer-events: none;
    opacity: 0;
    transition: opacity var(--duration-slow, 400ms) var(--ease-standard);
  }
  .pbnav.is-scrolled .pbnav__blur { opacity: 1; }

  /* Tint layer for text legibility — opaque at top, gone at the fade line. */
  .pbnav__blur::after {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(
      var(--color-bg-dark, #0a0a0a) 0%,
      color-mix(in srgb, var(--color-bg-dark, #0a0a0a) 62%, transparent) 40%,
      transparent 100%);
  }

  /* Each layer: stronger blur, masked off higher up → a blur GRADIENT, not a step. */
  .pbnav__blur i { position: absolute; inset: 0; }
  .pbnav__blur i:nth-child(1) { backdrop-filter: blur(1px);   -webkit-backdrop-filter: blur(1px);
    mask-image: linear-gradient(#000 0%, #000 72%, transparent 100%); }
  .pbnav__blur i:nth-child(2) { backdrop-filter: blur(2.5px); -webkit-backdrop-filter: blur(2.5px);
    mask-image: linear-gradient(#000 0%, #000 60%, transparent 90%); }
  .pbnav__blur i:nth-child(3) { backdrop-filter: blur(5px);   -webkit-backdrop-filter: blur(5px);
    mask-image: linear-gradient(#000 0%, #000 48%, transparent 78%); }
  .pbnav__blur i:nth-child(4) { backdrop-filter: blur(10px);  -webkit-backdrop-filter: blur(10px);
    mask-image: linear-gradient(#000 0%, #000 36%, transparent 64%); }
  .pbnav__blur i:nth-child(5) { backdrop-filter: saturate(1.4) blur(18px); -webkit-backdrop-filter: saturate(1.4) blur(18px);
    mask-image: linear-gradient(#000 0%, #000 24%, transparent 50%); }

  .pbnav__inner {
    position: relative; display: flex; align-items: center; gap: var(--space-6);
    height: 64px; max-width: 1248px; margin-inline: auto; padding-inline: var(--space-5);
  }
  .pbnav__links { display: flex; gap: var(--space-1); margin-inline-start: auto; }
  .pbnav__links a {
    padding: var(--space-2) var(--space-3); border-radius: var(--radius-full);
    color: var(--color-muted-on-dark); font-size: var(--text-sm); text-decoration: none;
    transition: color var(--duration-base) var(--ease-standard),
                background-color var(--duration-base) var(--ease-standard);
  }
  .pbnav__links a:hover { color: var(--color-fg-on-dark); background: rgba(255,255,255,0.05); }
  .pbnav__links a:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 3px; border-radius: var(--radius-sm); }

  /* Cost control: one layer (or none) on small screens. */
  @media (max-width: 720px) {
    .pbnav__blur i:nth-child(-n+4) { display: none; }
    .pbnav__blur i:nth-child(5) { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); mask-image: none; }
  }
  @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    .pbnav__blur i { display: none; }
    .pbnav__blur::after { background: var(--color-bg-dark, #0a0a0a); }
  }

  /* Reveal is information, not decoration: under reduced motion it still appears, instantly. */
  @media (prefers-reduced-motion: reduce) {
    .pbnav__blur { transition: none; }
  }
</style>

<script>
  // Threshold crossing via a sentinel — no scroll listener, no rAF on the hot path.
  const nav = document.getElementById('pbnav');
  const sentinel = document.getElementById('pbnav-sentinel');
  new IntersectionObserver(
    ([e]) => nav.classList.toggle('is-scrolled', !e.isIntersecting),
    { rootMargin: '-64px 0px 0px 0px' }
  ).observe(sentinel);
</script>
```
