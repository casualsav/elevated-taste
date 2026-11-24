---
pattern: duotone-gradient-hero
from: plaid
corpus: production
safety: production-safe
tags: [hero, split-hero]
---

## What it is
A split hero where the text column sits over a real photograph that has been reduced to a two-color **duotone** (brand-dark shadows → brand-accent highlights) and bled behind the copy, blended into a matching gradient so the seam disappears. The headline stays a single weight but paints one load-bearing phrase in the brand accent; below it, two pill CTAs (solid + outline). The result is a richly colored hero that keeps the reading text crisp — because the duotone/gradient does the coloring, not the type.

## Why it works
Saturation is delivered through the image and a color-matched gradient, so you get a vivid brand moment without tinting the text surface. Duotoning a photo to exactly two brand hues (shadow + highlight) forces any stock/product photo into the palette — it can never clash. Emphasis inside the headline comes from **hue on one clause** instead of a second font weight, which reads as deliberate and keeps the type system to one weight. `mix-blend-mode` (or a duotone `filter`) plus a same-direction gradient hides the boundary between photo and canvas, so the hero feels like one designed field rather than an image pasted on a background.

## Reference implementation
```html
<section class="hero">
  <div class="hero__copy">
    <h1>Turn <span class="accent">data into</span> revolutionary financial products</h1>
    <p>Connect to real-time insights to create fast, safe, and smart financial experiences.</p>
    <div class="hero__cta">
      <a class="btn btn--solid" href="#">Start building</a>
      <a class="btn btn--outline" href="#">Talk with our team</a>
    </div>
  </div>
  <figure class="hero__media" aria-hidden="true">
    <img class="hero__photo" src="portrait.jpg" alt="">
  </figure>
</section>

<style>
  .hero {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    gap: var(--space-8, 40px);
    align-items: center;
    padding: var(--space-9, 88px) var(--space-6, 32px);
    /* gradient matched to the duotone's two hues so photo + canvas share a field */
    background: linear-gradient(48deg,
      var(--color-teal-ink, #012e37) 0%,
      var(--color-navy, #02294b) 55%,
      var(--color-accent-deep, #088181) 100%);
    color: #fff;
    isolation: isolate; /* contain the blend to this section */
    overflow: clip;
  }
  .hero__copy { max-width: 34ch; z-index: 1; }
  .hero h1 {
    font-size: clamp(2rem, 6vw, 4.75rem);
    font-weight: 600;
    line-height: 1.08;
    letter-spacing: -0.045em; /* tight negative tracking on display */
    margin: 0 0 var(--space-4, 16px);
  }
  .hero h1 .accent { color: var(--color-accent, #0ba299); }
  .hero p { font-size: 1.125rem; line-height: 1.5; opacity: 0.9; max-width: 42ch; }

  .hero__media { margin: 0; }
  .hero__photo {
    width: 100%; height: 100%; object-fit: cover;
    /* two-tone the photo into brand shadow + highlight */
    filter: grayscale(1) contrast(1.1);
    mix-blend-mode: luminosity;   /* let the gradient's hues bleed through the photo */
    opacity: 0.9;
  }

  .hero__cta { display: flex; gap: var(--space-3, 12px); margin-top: var(--space-6, 32px); }
  .btn {
    display: inline-flex; align-items: center;
    padding: 12px 24px; border-radius: 100px; /* full pill */
    font-weight: 600; text-decoration: none;
    transition: opacity var(--duration-fast, 100ms) var(--ease-standard, ease-out);
  }
  .btn--solid { background: var(--color-fg, #111112); color: #fff; }
  .btn--outline { border: 1px solid rgba(255,255,255,0.6); color: #fff; }
  .btn:hover { opacity: 0.75; }

  @media (max-width: 768px) {
    .hero { grid-template-columns: 1fr; }
    .hero__media { order: -1; }
  }
</style>
```

For a true two-color duotone (not just luminosity blend), swap the photo filter for an SVG `<feColorMatrix>`/`feComponentTransfer` duotone filter mapping black→`--color-teal-ink` and white→`--color-accent`. The blend-mode version above is the cheap, dependency-free approximation the exemplar effectively achieves.
