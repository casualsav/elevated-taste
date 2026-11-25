---
pattern: photo-overlap-product-hero
from: land-book
corpus: production
safety: production-safe
tags: [hero, layout, photography, product-ui, b2b, brand-experience]
---

## What it is
A hero that fuses **mood and proof in one viewport**: a full-bleed evocative photograph (Solidroad uses a mountain ridge with a drawn summit "trail") carries the brand feeling on the left, while a **real, dense product panel overflows the right edge**, overlapping the photo. One editorial serif headline + a two-line subhead + a single accent CTA sit over the photo. You get "this brand has a point of view" and "this is a real tool" at once, so the copy can stay short. Distinct from `embedded-product-frame`/`inline-capture-hero` (product on a flat/tinted panel) and `perspective-screenshot-field-hero` (tilted screenshots) — here the product sits *on top of full-bleed photography*, bridging brand story and product.

## Why it works
Photography supplies emotion that a flat UI screenshot can't; the overlapping product surface supplies the credibility that a pretty photo can't. Overlapping them (rather than stacking sections) compresses both jobs into the first screen and creates depth — the panel reads as "closer" than the scene behind it. The asymmetric split (headline ~45% left, panel bleeding off the right) avoids the dead-centered template and gives the eye a clear left-to-right read: *headline → CTA → proof*. The single acid CTA is the one saturated object, so it can't be missed against the muted photo.

## Why it works / safety
Production-safe and responsive: on mobile the panel drops below the headline and the photo becomes a shorter banner. **Contrast is the one risk** — white headline text over a photo needs a scrim. Use a gradient overlay tuned to the headline side, and keep the product panel on an opaque surface so its dense text stays crisp over the busy photo.

## Reference implementation
```html
<style>
  .photo-hero {
    position: relative;
    min-block-size: 88vh;
    background: var(--color-surface-inverse) center/cover no-repeat;
    background-image: url("/hero.jpg");
    color: var(--color-fg-inverse);
    overflow: clip;
  }
  /* scrim: darken the headline side so text clears contrast */
  .photo-hero::before {
    content: "";
    position: absolute; inset: 0;
    background: linear-gradient(100deg,
      rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0) 70%);
  }
  .photo-hero__inner {
    position: relative;
    max-inline-size: var(--container-xl);
    margin-inline: auto;
    padding: var(--space-9) var(--space-6);
    display: grid;
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    align-items: center;
    gap: var(--space-7);
  }
  .photo-hero__copy { max-inline-size: 30ch; }
  .photo-hero h1 {
    font-family: var(--font-display);
    font-weight: var(--weight-regular);     /* light/regular serif — scale carries hierarchy */
    font-size: var(--text-5xl);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    margin: 0 0 var(--space-4);
  }
  .photo-hero p { font-family: var(--font-sans); font-size: var(--text-md); margin: 0 0 var(--space-5); opacity: 0.92; }
  .photo-hero__cta {
    display: inline-flex; align-items: center; gap: var(--space-2);
    background: var(--color-accent);
    color: var(--color-accent-fg);          /* DARK text on acid fill — never light */
    font-family: var(--font-sans);
    padding: var(--space-3) var(--space-5);
    border-radius: var(--radius-full);      /* pill shape language */
    text-decoration: none;
  }
  /* real product surface, opaque, overflowing the right edge */
  .photo-hero__panel {
    background: var(--color-surface);
    color: var(--color-fg);
    border-radius: var(--radius-xl);
    box-shadow: 0 0 35px rgba(0,0,0,0.18);
    padding: var(--space-5);
    margin-inline-end: calc(var(--space-9) * -1);  /* bleed off the right */
    min-inline-size: 0;
  }
  @media (max-width: 860px) {
    .photo-hero__inner { grid-template-columns: 1fr; }
    .photo-hero__panel { margin-inline-end: 0; }
  }
</style>

<section class="photo-hero">
  <div class="photo-hero__inner">
    <div class="photo-hero__copy">
      <h1>Quality assurance for enterprise CX</h1>
      <p>Your definition of quality is the only one that matters.</p>
      <a class="photo-hero__cta" href="/demo">Book a Demo →</a>
    </div>
    <div class="photo-hero__panel" role="img" aria-label="Product dashboard preview">
      <!-- real dense product UI: stat row + scored table; the interface IS the proof -->
    </div>
  </div>
</section>
```
