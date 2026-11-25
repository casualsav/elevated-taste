---
pattern: kpi-stat-card-grid
from: shadcn-dashboard
corpus: production
safety: production-safe
trigger: hover
tags: [dashboard, stat-card, data-table, kpi, container-query]
---

## What it is
A row of KPI cards (revenue, customers, growth…) that reflows by the width of its *container* rather than the viewport, so it lays out correctly beside a collapsible sidebar. Each card is a muted label, a large tabular-figure value, a directional delta badge, and a one-line trend note. Elevation is a single hairline border — no shadow.

## Why it works
Three transferable moves. (1) **Container queries, not media queries** — `@container` + `@xl/@5xl` breakpoints mean the grid responds to the space the content actually has, so collapsing the rail instantly re-packs 4→2→1 with no JS and no window resize. (2) **Tabular figures** — `font-variant-numeric: tabular-nums` fixes each digit's advance so columns of numbers align and live values don't jitter. (3) **Directional, not chromatic, deltas** — the change pill carries an ↑/↓ glyph and a neutral outline instead of a red/green fill, keeping the board monochrome and colorblind-safe. Cards are separated by a 1px border on a near-equal surface, so the grid stays flat and calm at high density.

## Reference implementation
```html
<style>
  .kpi-grid {
    container-type: inline-size;        /* children query THIS width, not the viewport */
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-5, 1.5rem);
  }
  @container (min-width: 36rem)  { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }
  @container (min-width: 72rem)  { .kpi-grid { grid-template-columns: repeat(4, 1fr); } }

  .kpi-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-2, 0.5rem);
    padding: var(--space-5, 1.5rem);
    background: var(--color-bg, #fff);
    border: 1px solid var(--color-border, #e5e5e5);   /* elevation = hairline, no shadow */
    border-radius: var(--radius-lg, 10px);
  }
  .kpi-head { display: flex; align-items: center; justify-content: space-between; }
  .kpi-label {
    font-size: var(--text-sm, 0.875rem);
    color: var(--color-muted, #737373);
  }
  .kpi-value {
    font-size: var(--text-2xl, 1.875rem);
    font-weight: var(--weight-semibold, 600);
    line-height: var(--leading-tight, 1.25);
    font-variant-numeric: tabular-nums;               /* aligned, non-jittering figures */
  }
  .kpi-note { font-size: var(--text-sm, 0.875rem); color: var(--color-muted, #737373); }

  /* delta: direction by glyph + neutral outline, NOT red/green fill */
  .kpi-delta {
    display: inline-flex; align-items: center; gap: var(--space-1, 0.25rem);
    padding: 2px var(--space-2, 0.5rem);
    font-size: var(--text-xs, 0.75rem);
    font-weight: var(--weight-medium, 500);
    border: 1px solid var(--color-border, #e5e5e5);
    border-radius: var(--radius-full, 9999px);
    color: var(--color-fg, #000);
    transition: box-shadow var(--duration-fast, 150ms) var(--ease-standard, cubic-bezier(0.4,0,0.2,1));
  }
</style>

<div class="kpi-grid">
  <div class="kpi-card">
    <div class="kpi-head">
      <span class="kpi-label">Total Revenue</span>
      <span class="kpi-delta"><span aria-hidden="true">↗</span> +12.5%</span>
    </div>
    <div class="kpi-value">$1,250.00</div>
    <div class="kpi-note">Trending up this month</div>
  </div>
  <!-- repeat .kpi-card ×4 -->
</div>
```
