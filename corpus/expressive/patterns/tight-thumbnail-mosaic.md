---
pattern: tight-thumbnail-mosaic
from: studiofreight
corpus: expressive
safety: production-safe
tags: [portfolio-index, gallery, feed, agency, interactive-showcase]
---

## What it is

A work index laid out as a **dense, borderless contact sheet**: thumbnails snap to a fixed row-height module and each tile spans an integer number of grid cells (1×1, 2×1, 1×2, 2×2), separated by **one tight, uniform gutter** — no cards, borders, radius, shadows, or captions. Variety comes entirely from *span size* (some tiles are wide, some tall, some big squares), so the wall stays packed edge-to-edge while still feeling composed. It deliberately contrasts with `staggered-masonry-feed`, whose signature is the *opposite*: generous gutters + vertical column offset + a serif title under every plate. Here there is no offset and no caption — the grid is snapped, tight, and image-only, reading as a printer's lookbook rather than a curated mis-registered wall. (For tiles that carry on-image taxonomy chips, compose with `metadata-tagged-thumbnail-plate`; this pattern is the *container*, not the cell decoration.)

## Why it works

When the work is already visual and colorful, the strongest pitch is **volume of evidence shown at once**, and the cheapest way to keep a high item count calm is to remove every container chrome element and let a single small gutter do all the separating. A snapped module (fixed `grid-auto-rows` + integer spans) buys two things a free-flowing masonry can't: tiles always tile cleanly with no ragged bottom edge, and **DOM order equals visual order**, so it stays correct for keyboard and screen-reader users and for feeds where sequence matters (recency, ranking). Span size becomes a built-in importance signal — a 2×2 hero project reads as more important than a 1×1 without any badge or copy. Keeping the system achromatic (see studiofreight tokens: no accent hue) means each thumbnail's own palette pops at full strength against the neutral frame. The transferable rule: **for an image-first index, use a snapped span grid on one tight gutter with zero box decoration; let span size carry hierarchy and let the images supply all the color.** Reusable for portfolios, case-study indexes, press/lookbook walls, and asset grids.

## Reference implementation

```html
<!-- Snapped span grid, one tight gutter, borderless. All values from /tokens. -->
<style>
  .mosaic {
    display: grid;
    /* Dense columns; each fixed-height row is the layout module. */
    grid-template-columns: repeat(auto-fill, minmax(var(--container-content), 1fr));
    grid-auto-rows: var(--container-content);   /* row module = tile base height */
    grid-auto-flow: dense;                       /* backfill gaps left by big spans */
    gap: var(--space-3);                         /* the ONE tight gutter = the rhythm */
    background: var(--color-bg);
    padding: var(--space-3);
  }
  /* Better than minmax(720px,…): on a wide canvas you want many small cells.
     Override the column track to a small base via a wrapper var if needed. */

  .mosaic__item {
    position: relative;
    display: block;
    overflow: clip;                              /* no radius, no shadow, no border */
    background: var(--color-surface);            /* placeholder while image loads */
    text-decoration: none;
    grid-column: span 1;                          /* default 1×1 */
    grid-row: span 1;
  }
  /* Span size IS the hierarchy — no badges needed. */
  .mosaic__item--wide  { grid-column: span 2; }   /* 2×1 */
  .mosaic__item--tall  { grid-row:    span 2; }   /* 1×2 */
  .mosaic__item--feat  { grid-column: span 2; grid-row: span 2; } /* 2×2 hero */

  .mosaic__img {
    width: 100%; height: 100%;
    object-fit: cover;                            /* fill the snapped cell exactly */
    display: block;
    transition: transform var(--duration-base) var(--ease-standard);
  }
  .mosaic__item:hover .mosaic__img { transform: scale(1.04); }

  .mosaic__item:focus-visible {
    outline: 2px solid var(--color-fg);
    outline-offset: calc(-1 * var(--space-1));
  }

  /* Collapse spans on small screens so the wall stays a tidy 2-up. */
  @media (max-width: 48rem) {
    .mosaic {
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: 1fr;
      aspect-ratio: unset;
    }
    .mosaic__item--wide,
    .mosaic__item--feat { grid-column: span 2; }
    .mosaic__item--tall { grid-row: span 1; }
  }
  @media (prefers-reduced-motion: reduce) {
    .mosaic__img { transition: none; }
    .mosaic__item:hover .mosaic__img { transform: none; }
  }
</style>

<section class="mosaic" aria-label="Selected work">
  <a class="mosaic__item mosaic__item--feat" href="/work/one">
    <img class="mosaic__img" src="/work/one.jpg" alt="Project One" loading="lazy">
  </a>
  <a class="mosaic__item" href="/work/two">
    <img class="mosaic__img" src="/work/two.jpg" alt="Project Two" loading="lazy">
  </a>
  <a class="mosaic__item mosaic__item--tall" href="/work/three">
    <img class="mosaic__img" src="/work/three.jpg" alt="Project Three" loading="lazy">
  </a>
  <a class="mosaic__item mosaic__item--wide" href="/work/four">
    <img class="mosaic__img" src="/work/four.jpg" alt="Project Four" loading="lazy">
  </a>
  <!-- …more tiles; mix default / --wide / --tall / --feat for the contact-sheet feel… -->
</section>
```
