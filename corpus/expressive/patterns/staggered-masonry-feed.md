---
pattern: staggered-masonry-feed
from: hellomonday
corpus: expressive
safety: production-safe
tags: [portfolio-index, gallery, feed, agency, interactive-showcase]
---

## What it is

A work/portfolio feed laid out as a **multi-column masonry where neighbouring columns are vertically offset and items vary in aspect ratio** — some plates are square, some tall portrait — so no two rows line up. Each cell is just an image plate plus a serif title and a row of tiny, tracked, muted category tags; there are no cards, borders, shadows or corner radius. The columns are separated by generous gutters and the whole thing floats on white. The vertical mis-registration between columns is the entire visual signature: it reads as hand-composed even though the layout is mechanical, and it is what makes a 20-item grid say "studio" instead of "search results".

## Why it works

Regular grids read as *generated*; broken alignment reads as *curated*. By letting items keep their natural aspect ratios and offsetting one column from the next, the eye can never lock onto a horizontal row, so it scans each plate individually — exactly the attention a portfolio wants. Because separation comes from whitespace and not from boxes, you can pack a high item count without the page feeling like a dense list. The cheap, robust way to get the offset for free is CSS multi-column flow: the browser balances items into columns top-to-bottom, and mixed item heights produce the stagger automatically with zero per-item placement. The trade is reading order: column flow means DOM order ≠ visual order, so this is right for galleries where order is loose and wrong where reading sequence is load-bearing — in that case switch to an explicit grid with row spans. Pairing a neutral grotesque for the tracked metadata with a display serif for the title gives each cell a clear two-tier hierarchy in two lines.

## Reference implementation

```html
<style>
  .feed {
    columns: 3 var(--container-sm);     /* 3 cols, collapses to fewer as width drops */
    column-gap: var(--space-7);          /* the generous gutter */
    background: var(--color-bg);
    padding-inline: var(--space-7);
  }

  .feed__item {
    break-inside: avoid;                 /* keep a plate + its caption together */
    margin-bottom: var(--space-9);       /* big void = the rhythm between rows */
    display: block;
    color: var(--color-fg);
    text-decoration: none;
  }
  /* nudge every other item down so neighbouring columns mis-register */
  .feed__item:nth-child(even) { margin-top: var(--space-8); }

  .feed__media {
    position: relative;
    aspect-ratio: 4 / 3;                 /* default; portrait items override below */
    background: var(--color-surface);    /* placeholder colour while the image loads */
    overflow: clip;
  }
  .feed__item--tall .feed__media { aspect-ratio: 3 / 4; }   /* mixed aspect = the stagger */
  .feed__media img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    opacity: 0;
    transition: opacity var(--duration-slow) var(--ease-entrance);
  }
  .feed__media img.is-loaded { opacity: 1; }   /* progressive reveal on lazy-load */

  .feed__title {
    margin: var(--space-4) 0 var(--space-3);
    font-family: var(--font-serif, Georgia, serif);   /* Clarendon-style accent serif */
    font-weight: var(--weight-regular);
    font-size: var(--text-xl);
    line-height: var(--leading-snug);
  }
  .feed__tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-4);
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    letter-spacing: var(--tracking-wide);
    color: var(--color-muted);
  }
  .feed__tags a { color: inherit; text-underline-offset: 0.2em; }
  .feed__item:focus-visible { outline: 2px solid var(--color-focus); outline-offset: var(--space-2); }

  @media (max-width: 64rem) { .feed { columns: 2; } }
  @media (max-width: 40rem) {
    .feed { columns: 1; padding-inline: var(--space-4); }
    .feed__item:nth-child(even) { margin-top: 0; }   /* drop the offset when single-column */
  }
  @media (prefers-reduced-motion: reduce) {
    .feed__media img { transition: none; opacity: 1; }
  }
</style>

<section class="feed" aria-label="Selected work">
  <a class="feed__item" href="/work/strava">
    <div class="feed__media feed__media--tall">
      <img src="/work/strava.jpg" alt="Strava — Year In Sport" loading="lazy"
           onload="this.classList.add('is-loaded')">
    </div>
    <h3 class="feed__title">Strava — Year In Sport</h3>
    <p class="feed__tags"><a href="/c/platform">Platform</a><a href="/c/products">Products</a></p>
  </a>

  <a class="feed__item" href="/work/delivery">
    <div class="feed__media">
      <img src="/work/delivery.jpg" alt="The best delivery experience" loading="lazy"
           onload="this.classList.add('is-loaded')">
    </div>
    <h3 class="feed__title">The best delivery experience not on earth.</h3>
    <p class="feed__tags"><a href="/c/platform">Platform</a><a href="/c/experiences">Experiences</a></p>
  </a>
  <!-- …more items… -->
</section>
```
