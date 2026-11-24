---
pattern: photo-first-catalog-row
from: faire
corpus: production
safety: production-safe
tags: [ecommerce, catalog, feature-section, grid, cards]
---

## What it is
A full-width row of six product or brand tiles in which **there is no card**. No border, no shadow, no filled container, no padding shell — just a photograph with a 4px corner softening, and three or four lines of metadata sitting directly on the page ground beneath it. Ranking inside the tile is done entirely with type weight and grey. Faire stacks four of these rows ("Featured brands", "Bestsellers near you", "Explore categories", "Shop by your values") and draws exactly three box-shadows on the whole 6,400px page.

## Why it works
Card chrome is compensation. A border, a radius, and an elevation exist to tell the eye "this rectangle is one thing" when the contents are too weak to say it themselves. A photograph already says it: a picture has its own edge, and it separates from a warm off-white ground without help. Adding chrome to a grid of photographs charges every tile a border, a shadow, and 16px of internal padding for information the image already carried — and it multiplies. At six tiles per row and four rows, that is 24 shadows and 24 borders competing with 24 photographs.

What replaces the chrome is a **metadata ladder**: the same three or four slots in the same order, ranked by weight and hue rather than size. Primary (product or brand name) is ink at regular weight; secondary (vendor, location) is grey at a light weight; tertiary (rating, count) is grey at micro size; the action is a plain underlined link. Nothing here is smaller than 12px — the recession comes from `color` and `font-weight`, which cost nothing in legibility, not from shrinking type, which costs everything.

Two consequences that make this worth the discipline:

1. **Hover has room to mean something.** With no resting elevation, a background tint or a border-bottom is a clear state change. On a grid of elevated cards, hover has to out-shout an existing shadow, which is why so many catalogs end up with a lift-and-scale that makes the whole page shimmer.
2. **Density stops being expensive.** Separation is whitespace and alignment: 4px between metadata lines, 24–30px between columns, 56px between rows. The tight-inside/loose-outside contrast is what groups the tile. Chrome would have done the same job for ten times the paint.

Use the aspect-ratio box and reserve it before the image loads, or the row will reflow four times as the lazy images decode.

## Reference implementation
```html
<style>
  .catalog {
    background: var(--color-bg);
    padding-block: var(--space-8);
  }

  .catalog__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-5);
    margin-bottom: var(--space-5);
    padding-inline: var(--space-5);
  }
  .catalog__title {
    /* The one serif on the page: this is the editorial voice, not a control. */
    font-family: var(--font-display, "Nantes", Georgia, serif);
    font-size: var(--text-2xl);
    font-weight: var(--weight-regular);
    line-height: var(--leading-snug);
    color: var(--color-fg);
    margin: 0;
  }
  .catalog__all {
    font-size: var(--text-sm);
    color: var(--color-fg);
    text-underline-offset: 3px;
  }

  .catalog__row {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: var(--space-5);
    padding-inline: var(--space-5);
  }
  @media (max-width: 1023px) { .catalog__row { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 600px)  { .catalog__row { grid-template-columns: repeat(2, 1fr); } }

  /* No border. No shadow. No background. The tile is a link and a stack. */
  .tile {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    text-decoration: none;
    color: inherit;
  }
  .tile__media {
    aspect-ratio: 1;                       /* reserved before decode — no reflow on lazy load */
    margin-bottom: var(--space-2);
    border-radius: var(--radius-sm);
    overflow: hidden;
    background: var(--color-surface-2);    /* the placeholder IS the empty state */
  }
  .tile__media img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity var(--duration-slow) var(--ease-standard);
  }
  .tile__media img.is-decoded { opacity: 1; }

  /* The ladder: weight and hue rank the lines, never size. Nothing below 12px. */
  .tile__name   { font-size: var(--text-sm); font-weight: var(--weight-regular); color: var(--color-fg); }
  .tile__vendor { font-size: var(--text-sm); font-weight: var(--weight-light, 300); color: var(--color-muted); }
  .tile__rating { font-size: var(--text-xs); color: var(--color-subtle, #6c6a6a); }
  .tile__action { font-size: var(--text-xs); color: var(--color-fg); text-decoration: underline; text-underline-offset: 2px; }

  /* With no resting elevation, a flat tint is a legible hover. Nothing lifts. */
  .tile:hover .tile__media { background: var(--color-border); }
  .tile:hover .tile__name  { text-decoration: underline; text-underline-offset: 2px; }
  .tile:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 4px; border-radius: var(--radius-sm); }

  @media (prefers-reduced-motion: reduce) {
    .tile__media img { transition: none; opacity: 1; }
  }
</style>

<section class="catalog" aria-labelledby="featured-brands">
  <div class="catalog__head">
    <h2 class="catalog__title" id="featured-brands">Featured brands</h2>
    <a class="catalog__all" href="/brands">All home decor</a>
  </div>

  <div class="catalog__row">
    <!-- repeat per tile -->
    <a class="tile" href="/brand/flowerhead-tea">
      <span class="tile__media">
        <!-- alt is not optional on a catalog: it is the product name for a screen reader -->
        <img src="/img/flowerhead.jpg" alt="Three boxes of Flowerhead Tea against a green fence" loading="lazy" decoding="async">
      </span>
      <span class="tile__name">Early Grey loose leaf, 4 oz</span>
      <span class="tile__vendor">Flowerhead Tea</span>
      <span class="tile__rating">★ 4.9 (390)</span>
      <span class="tile__action">Unlock wholesale price</span>
    </a>
  </div>
</section>

<script>
  // Fade each image in when it has actually decoded, so the row never flashes a half-painted grid.
  // No IntersectionObserver needed for the fade — `loading="lazy"` already defers the fetch.
  for (const img of document.querySelectorAll('.tile__media img')) {
    if (img.complete) img.classList.add('is-decoded');
    else img.addEventListener('load', () => img.classList.add('is-decoded'), { once: true });
  }
</script>
```
