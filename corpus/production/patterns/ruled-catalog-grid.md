---
pattern: ruled-catalog-grid
from: maven
corpus: production
safety: production-safe
tags: [catalog, listing, grid, index, ranked-list]
---

## What it is

A dense grid of real items — courses, listings, changelog entries, templates — where the cells are separated by **shared 1px hairlines** and bounded by a single outer rule. No per-cell border-radius, no shadow, no hover lift. Each cell carries a title, one meta line, a face/byline row, and a low-contrast ordinal in the corner. It is a printed schedule or a stock table, rendered as a grid.

## Why it works

A **card** makes an implicit promise: this object is self-contained, elevated, worth its own frame. Nine of them together break that promise, and twenty-four of them become visual static — twenty-four shadows, twenty-four radii, twenty-four hover states competing for the same eye. A **ruled cell** says the opposite: this is one row of many, scan me. Removing the elevation removes the noise, so information density can go *up* while perceived busyness goes *down*.

The hairlines come free from the layout. Set the grid's own background to the rule color, give it `gap: 1px`, and paint each cell with the surface color — every internal rule is a gap, so they can never double up, misalign at wraps, or need `:last-child` exceptions. This is the whole trick, and it survives any column count.

The ordinal earns its place only when the order is a *fact* (trending, ranked, chronological). Rendered ghosted and oversized, it reads as a chart position rather than a label — the page shows the ranking instead of asserting it.

## Reference implementation

```html
<section class="catalog">
  <header class="catalog__head">
    <h2>Trending this week</h2>
    <a href="/courses">See all</a>
  </header>

  <ol class="catalog__grid">
    <li class="cell">
      <h3 class="cell__title">Mastering Agentic AI: Certification</h3>
      <p class="cell__meta">5 weeks · Starts Oct 3</p>
      <p class="cell__byline">
        <img src="/a.avif" alt="" width="24" height="24" class="cell__face">
        Aishwarya Srinivasan
      </p>
      <span class="cell__rank" aria-hidden="true">1</span>
    </li>
    <!-- …23 more cells, ordinal supplied by the source data, not by CSS counters -->
  </ol>
</section>

<style>
  .catalog__head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-block-end: var(--space-5);
  }

  /* The grid's background IS the rule color; every gap paints a hairline. */
  .catalog__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1px;
    margin: 0;
    padding: 0;
    list-style: none;
    background: var(--color-border);
    border: 1px solid var(--color-border);
  }
  @media (min-width: 48rem) { .catalog__grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 64rem) { .catalog__grid { grid-template-columns: repeat(3, 1fr); } }

  .cell {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    padding: var(--space-5);
    background: var(--color-bg);          /* the sheet showing through the rules */
    transition: background var(--duration-fast) var(--ease-standard);
  }
  .cell:hover,
  .cell:focus-within { background: var(--color-surface); }   /* tint, never lift */

  .cell__title {
    margin: 0;
    font-size: var(--text-md);
    font-weight: var(--weight-regular);
    line-height: var(--leading-snug);
    letter-spacing: var(--tracking-heading);
    text-wrap: balance;
  }

  .cell__meta {
    margin: 0;
    margin-block-start: auto;             /* meta + byline pin to the cell floor */
    font-size: var(--text-sm);
    color: var(--color-muted);
  }

  .cell__byline {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-fg);
  }
  .cell__face { border-radius: var(--radius-full); }

  /* Ghost ordinal — a fact, shown. Only use when the order means something. */
  .cell__rank {
    position: absolute;
    inset-block-end: var(--space-4);
    inset-inline-end: var(--space-4);
    font-family: var(--font-rank, var(--font-mono));
    font-size: var(--text-xl);
    line-height: 1;
    color: var(--color-rank-ghost, #d4d4d4);
    pointer-events: none;
  }

  /* Dark-ground variant: the sheet inverts, the rules desaturate rather than fade.
     A navy hairline beats white-at-8% — low-alpha white on dark reads milky. */
  .catalog--on-dark .catalog__grid {
    background: var(--color-rule-on-dark, #333a5a);
    border-color: var(--color-rule-on-dark, #333a5a);
  }
  .catalog--on-dark .cell { background: var(--color-bg-dark); color: var(--color-fg-on-dark); }
  .catalog--on-dark .cell:hover,
  .catalog--on-dark .cell:focus-within { background: var(--color-surface-dark); }
  .catalog--on-dark .cell__meta { color: var(--color-muted-on-dark); }
</style>
```

**Notes on reuse.** Keep the hover to a background tint — a `translateY` lift on a hairline grid tears the shared rules. If the cells are links, wrap the whole cell in the `<a>` and let `:focus-within` do the highlight, so the focus ring lands on a 200px-tall target rather than a 6-word title. Drop `.cell__rank` entirely unless the ordinal is real; a decorative number in a grid of nine is worse than nothing.
