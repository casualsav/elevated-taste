---
pattern: full-bleed-object-catalogue
from: stripepress
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [catalogue, hero, portfolio, ecommerce, editorial]
---

## What it is
A catalogue where each item is presented as a large, photoreal *object* (a book, a product, a device) isolated one-per-viewport in a chromatically neutral void, rather than tiled into a grid of cards. The container supplies zero color and zero decoration; all richness lives in the rendered/photographed item. Vertical scroll reads as moving through a physical space — descending a shelf, walking a showroom. Used by Stripe Press to turn a back-catalogue of ~20 books into a slow gallery walk.

## Why it works
Two mechanisms. First, **a silent ground lets clashing item palettes coexist** — when the stage is one near-black, 20 different cover colors never fight each other or the UI. Second, **viewport-scale spacing forces single-object focus** — giving each item a full screen of void (not a 24px gap) makes the eye commit to one thing, so high total volume feels calm and curated instead of dense. Because depth is baked into the item art, the UI itself needs no shadows, gradients, or rounded cards — keeping the chrome austere is what makes the merchandise read as the loud element. Type shrinks to a quiet caption role so it never competes with the object.

## Reference implementation
```html
<!-- framework-neutral; tokens from /tokens/stripepress.json -->
<style>
  :root {
    --void: #201819;            /* neutral stage — the only site-level color */
    --fg-muted: #E2CAB0;        /* quiet serif caption on dark */
    --space-item: clamp(96px, 18vh, 315px);  /* viewport-scale isolation gap */
    --container: 1280px;
    --dur: 300ms;
    --ease: ease-out;
  }

  .catalogue { background: var(--void); color: var(--fg-muted); }

  /* one object per viewport: the gap, not a border, frames each item */
  .object-row {
    max-width: var(--container);
    margin-inline: auto;
    padding-block: var(--space-item);
    display: grid;
    place-items: center;
  }

  /* the item carries ALL richness — render/photo already has shadow + texture.
     no box-shadow, no gradient, no radius on the frame itself. */
  .object {
    width: min(100%, var(--container));
    perspective: 1600px;
  }
  .object img {
    display: block;
    width: 100%;
    height: auto;
    /* subtle resting perspective so it reads as a held object, not a flat scan */
    transform: rotateX(8deg);
    transform-origin: center 70%;
    transition: transform var(--dur) var(--ease);
    will-change: transform;
  }
  /* a few degrees of cursor-driven life, transform-only (cheap) */
  .object:hover img { transform: rotateX(6deg) rotateY(-2deg); }

  /* caption stays tiny and uniform — it must not compete with the object */
  .object-row figcaption {
    margin-top: 1.5rem;
    font-family: "Ivar Text", Georgia, serif;
    font-size: 1rem;
    letter-spacing: 0.32px;
  }

  @media (prefers-reduced-motion: reduce) {
    .object img,
    .object:hover img { transform: none; transition: none; }
  }
</style>

<section class="catalogue">
  <figure class="object-row">
    <div class="object">
      <img src="/render/maintenance.jpg" alt="Maintenance: Of Everything — Stewart Brand">
    </div>
    <figcaption>Stewart Brand · Maintenance: Of Everything</figcaption>
  </figure>

  <figure class="object-row">
    <div class="object">
      <img src="/render/origins-of-efficiency.jpg" alt="The Origins of Efficiency — Brian Potter">
    </div>
    <figcaption>Brian Potter · The Origins of Efficiency</figcaption>
  </figure>
  <!-- repeat per item -->
</section>
```

Keep the frame element decoration-free: if your item art lacks baked-in depth, add a single soft shadow to the `.object` (not a card), but never a gradient + rounded card + headline stack — that collapses back into the generic template this pattern exists to avoid.
