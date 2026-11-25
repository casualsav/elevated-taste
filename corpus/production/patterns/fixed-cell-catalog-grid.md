---
pattern: fixed-cell-catalog-grid
from: mcmaster
corpus: production
safety: production-safe
tags: [ecommerce, navigation, catalog, icon-grid, dense-grid, static]
---

## What it is

A wall of many small, uniform things — parts, icons, media, categories — laid out on a single rigidly quantized cell. Every item occupies the same fixed `cell-w × cell-h` box: a fixed-size graphic, a fixed gap, and a label clipped to a fixed number of lines. Each *group* of items is then sized to a literal multiple of that cell, so groups of unequal length pack into shared rows by ordinary inline/flex flow, with no column math and no reflow surprises. Chrome is a 1px hairline; hover is a color wash; nothing lifts, scales, or reveals. Use it when the visitor's task is **retrieval, not discovery** and the honest answer to "how many should we show?" is "all of them."

## Why it works

Three mechanisms, each independently portable:

1. **The cell is the design system.** Because width, height, graphic box, gap, and label clip are all constants, the eye stops parsing layout and starts parsing shape and position. Density becomes survivable precisely because the grid is boring — differences between cells carry only the one signal that matters (what the thing looks like).
2. **Quantized group widths make packing arithmetic.** A group of `n` items gets `width: calc(n * cell-w)`. Adjacent groups then float or flex into the same row exactly when they fit, with zero fractional-column negotiation. Modern `grid-template-columns: repeat(auto-fill, var(--cell-w))` gives you the same guarantee inside a group; the `n × cell` container width is what makes *groups* tile against each other.
3. **Hierarchy is bought with a hairline and a hue, not with scale.** At this density you cannot afford the vertical space that a 4× type ramp consumes. A 1px accent-colored rule above each section heading, plus a hue step (accent heading → foreground subheading → muted label), separates ~1,300 items across dozens of sections while the total type range stays under 2×.

The counterpart rule: **do not animate a high-cardinality grid.** With a thousand hover candidates, a transform or shadow is a compositor bill and a visual jitter, and a 120ms fade under a fast pointer sweep reads as lag. An instant background wash reads as zero-latency machinery. That is the correct feel for a tool.

## Reference implementation

```html
<section class="catalog">
  <h2 class="catalog__title">Fastening &amp; Joining</h2>

  <div class="catalog__group">
    <h3 class="catalog__group-title">Fasteners</h3>
    <!-- --n is the item count; the container width is exactly n cells wide -->
    <ul class="catalog__cells" style="--n: 6">
      <li>
        <a href="/screws">
          <!-- one sprite per group: <use> offsets into a single cached SVG symbol set -->
          <svg class="catalog__icon" aria-hidden="true" focusable="false"><use href="#icon-screws"></use></svg>
          <span class="catalog__label" title="Socket Head Cap Screws">Socket Head Cap Screws</span>
        </a>
      </li>
      <!-- …five more <li> -->
    </ul>
  </div>
</section>
```

```css
.catalog {
  /* The cell IS the spacing scale. Publish it once; derive everything from it. */
  --cell-w: 72px;
  --cell-h: 114px;
  --cell-icon: 60px;
  --cell-gap: var(--space-1);
  --label-lines: 2;

  font-family: var(--font-sans);
  background: var(--color-bg);
}

/* Section separator: a hairline in the accent hue + a hue step. No scale jump. */
.catalog__title {
  border-top: 1px solid var(--color-accent);
  color: var(--color-accent);
  font-size: var(--text-lg);
  font-weight: var(--weight-regular);
  letter-spacing: var(--tracking-heading);
  padding-top: var(--space-1);
  margin-bottom: var(--space-2);
}

.catalog__group-title {
  color: var(--color-fg);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  padding: 0 var(--cell-gap) var(--space-2);
}

/* Groups tile against each other because each is an exact multiple of the cell. */
.catalog__group { display: inline-block; max-width: 100%; vertical-align: top; padding-bottom: var(--space-3); }

.catalog__cells {
  list-style: none;
  margin: 0;
  padding: 0;
  width: calc(var(--n) * var(--cell-w));
  max-width: 100%;                /* below n cells' width, auto-fill wraps to fewer columns per row */
  display: grid;
  grid-template-columns: repeat(auto-fill, var(--cell-w));
}

.catalog__cells a {
  display: block;
  width: var(--cell-w);
  height: var(--cell-h);
  padding-inline: var(--cell-gap);
  box-sizing: border-box;
  overflow: hidden;              /* the cell clips; `title` carries the full name */
  text-align: center;
  text-decoration: none;
  color: var(--color-muted);
  font-size: var(--text-2xs, 10.5px);
  line-height: var(--leading-tight);
  background-color: transparent;
}

/* Hairline chrome, never a card. Shadow is reserved for things that actually float. */
.catalog__icon {
  display: block;
  width: var(--cell-icon);
  height: var(--cell-icon);
  margin: 0 auto var(--cell-gap);
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  color: var(--color-muted);     /* silhouette icons inherit one weight + one tone */
}

.catalog__label {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: var(--label-lines);
  line-clamp: var(--label-lines);
  overflow: hidden;
}

/* Color-only hover: instant, no transition, no transform. At 1000+ candidates this is the point. */
.catalog__cells a:hover { background-color: var(--color-tile-hover, #edf2ed); }
.catalog__cells a:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: -2px;
}

/* Nothing here animates, so there is nothing for reduced-motion to disable —
   which is the design. Guard anyway if you add a transition later. */
@media (prefers-reduced-motion: reduce) {
  .catalog__cells a { transition: none; }
}
```

**Notes on reuse**

- `--text-2xs` (10.5px) is intentionally below the house ramp: it is what makes a two-line label fit a 114px cell. It is also below comfortable reading size. Only go there when the label is a *name being recognized*, not prose being read — and never remove the `title`/`aria-label`.
- The `<svg><use>` reference assumes one inline or fetched symbol sprite per group, not one file per icon. That is the modern form of the original PNG `background-position` sprite: one cacheable, versioned asset per editorial unit, and icons that scale, recolor with `currentColor`, and survive high-DPI.
- `--n` is the only per-group value. If your group counts are dynamic, set it from the server or a one-line `style="--n:{{items.length}}"` — it is a width, not a column count, so it never fights `auto-fill`.
