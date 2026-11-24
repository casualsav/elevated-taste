---
pattern: fixed-backdrop-reveal
from: emergent
corpus: production
safety: production-safe
trigger: scroll
tags: [background, texture, atmosphere, layout]
---

## What it is
A full-viewport background layer that is `position: fixed` at a negative z-index and **never scrolls**; the page's sections are mostly **transparent** (no background of their own), so as content scrolls the static backdrop stays put and shows through wherever a section or seam is open. Opaque bands (a pricing section, white cards) act as "sheets" sliding over the backdrop; transparent stretches read as windows onto it. Emergent pairs it with a second fixed layer *above* the content — a texture image with `mix-blend-mode: screen` and `pointer-events: none` — so a faint atmosphere sits over dark showcase areas while vanishing over white.

## Why it works
The depth illusion is free: no parallax math, no scroll listeners, no `background-attachment: fixed` (which is buggy on iOS Safari and defeats compositing). The backdrop is one ordinary fixed element painted once; scrolling content is composited over it. Because the reveal comes from *sections choosing to be transparent*, the technique degrades perfectly — an opaque fallback background on `body` costs nothing and no-JS changes nothing. The page feels layered and alive at zero motion cost, and `prefers-reduced-motion` is irrelevant since nothing animates.

## Reference implementation
```html
<body>
  <!-- static backdrop: paints once, never scrolls -->
  <picture class="backdrop" aria-hidden="true">
    <source media="(max-width: 767px)" srcset="/assets/backdrop-mobile.png">
    <source media="(prefers-color-scheme: dark)" srcset="/assets/backdrop-dark.png">
    <img class="backdrop__img" src="/assets/backdrop-light.png" alt="" loading="eager">
  </picture>

  <!-- transparent section: the backdrop shows through and stays static as this scrolls -->
  <section class="section">…</section>

  <!-- opaque band: a "sheet" sliding over the backdrop -->
  <section class="section section--band">…</section>

  <!-- optional: fixed texture ABOVE content; screen-blend = invisible on white -->
  <img class="atmosphere" src="/assets/texture.png" alt="" aria-hidden="true">

<style>
  body { background: var(--color-bg, #fff); } /* fallback if the image fails */

  .backdrop { position: fixed; inset: 0; z-index: -10; }
  .backdrop__img { width: 100%; height: 100%; object-fit: cover; object-position: center; }

  .section { /* no background — this is the whole trick */ }
  .section--band { background: var(--color-surface, #f5f4f2); } /* opaque sheet */

  .atmosphere {
    position: fixed; inset: 0; z-index: 1000;
    width: 100%; height: 100%; object-fit: cover;
    mix-blend-mode: screen; pointer-events: none;
  }
</style>
</body>
```

Contrast is the one real risk: text sitting directly on the backdrop must clear 4.5:1 against the image's *busiest* region, not its average — keep the backdrop near-monochrome (a faint texture, a soft wash) or reserve transparent stretches for large display type with a scrim.
