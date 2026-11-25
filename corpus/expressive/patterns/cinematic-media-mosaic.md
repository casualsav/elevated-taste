---
pattern: cinematic-media-mosaic
from: anduril
corpus: expressive
safety: production-safe
tags: [feature-section, product-marketing, gallery, mosaic, bento, dark]
---

## What it is
A product-family / capability index built as an **asymmetric full-bleed image mosaic** rather than a uniform card grid. One large anchor tile (Anduril's tall Roadrunner cell) sits among varied-size cells; every tile is an edge-to-edge cinematic still or render with a **bottom-left label** (product name + one-line tagline) over a subtle bottom legibility scrim, and a **corner ↗ glyph** marking it as a link. The chrome is monochrome and near-square (2px radius); each tile's own footage supplies all the color. Anduril uses it for Ghost / Barracuda / Lattice / Fury / Roadrunner / Menace / Dive-XL — seven products, one calm grid.

## Why it works
The asymmetry is the mechanism. A uniform card grid forces a loud product and a quiet one into the same box, so they read as equals and the eye skims a wall of sameness — the generic "three feature cards" template. Giving one tile dominant area (and letting the rest vary) creates a focal anchor and an editorial, magazine-spread rhythm, so the grid reads as a *curated catalogue of capabilities* rather than a spec list. Because hierarchy comes from **tile area + position**, the surrounding UI can stay strictly neutral: type is demoted to a tracked-out micro-cap caption riding on the media, the only color is in the imagery, and the scrim guarantees the label is legible over any frame. It survives any palette and any number of items, and degrades cleanly to a single stacked column on mobile. Transfers to product lines, portfolios, service indexes, or any list where each item owns a strong image.

## Reference implementation

```html
<section class="mosaic" aria-label="Products">
  <a class="tile tile--tall" href="/roadrunner">
    <img class="tile__img" src="/roadrunner.jpg" alt="Roadrunner launch system at dusk" loading="lazy" decoding="async" />
    <div class="tile__label">
      <span class="tile__name">Roadrunner</span>
      <span class="tile__tag">Launch. Loiter. Recover. Reuse.</span>
    </div>
    <svg class="tile__arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M6 4h6v6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>
  </a>
  <!-- repeat .tile per product; add no modifier for standard cells -->
  <a class="tile" href="/ghost"> … </a>
  <a class="tile" href="/barracuda"> … </a>
</section>

<style>
  .mosaic {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 18rem;
    gap: var(--space-2);                 /* tight 8–16px gaps */
    background: var(--color-bg);         /* #010101 ground */
    padding: var(--space-2);
  }
  /* the anchor tile spans two rows — the asymmetry */
  .tile--tall { grid-row: span 2; }

  .tile {
    position: relative;
    overflow: hidden;
    border-radius: var(--radius-sm);     /* 2px — "machined", not soft */
    color: var(--color-fg);
    text-decoration: none;
    isolation: isolate;
  }
  .tile__img {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform var(--duration-slow) var(--ease-expo-out, cubic-bezier(0.16, 1, 0.3, 1));
  }
  .tile:hover .tile__img { transform: scale(1.03); }   /* restrained; transform-only */

  /* bottom legibility scrim — guarantees label contrast over any frame */
  .tile::after {
    content: "";
    position: absolute; inset: 0; z-index: 1;
    background: linear-gradient(to top, var(--color-scrim, rgba(8, 9, 12, 0.44)) 0%, transparent 45%);
    pointer-events: none;
  }

  .tile__label {
    position: absolute; left: var(--space-3); bottom: var(--space-3); z-index: 2;
    display: grid; gap: var(--space-1);
  }
  .tile__name {
    font-family: var(--font-sans);
    font-size: var(--text-lg);
    letter-spacing: var(--tracking-tight);
    line-height: var(--leading-tight);
  }
  .tile__tag {
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);   /* +0.48px tracked-out micro-cap */
    opacity: 0.85;
  }
  .tile__arrow {
    position: absolute; right: var(--space-3); bottom: var(--space-3); z-index: 2;
    width: 1rem; height: 1rem;
  }

  @media (max-width: 48rem) {
    .mosaic { grid-template-columns: 1fr; grid-auto-rows: 14rem; }
    .tile--tall { grid-row: auto; }        /* collapse to a single stacked column */
  }
  @media (prefers-reduced-motion: reduce) {
    .tile__img { transition: none; }
    .tile:hover .tile__img { transform: none; }
  }
</style>
```
