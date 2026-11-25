---
pattern: kpi-stat-row
from: catalyst
corpus: production
safety: production-safe
tags: [dashboard, data-table, stat, metrics]
---

## What it is
The "Overview" strip of a dashboard: a responsive row of KPIs (1 column on mobile → 2 → 4 on wide screens) where **each cell is unboxed** — separated only by a full-width top hairline — and reads top-to-bottom as *label → big number → semantic delta badge*. No card, no shadow, no vertical divider; the hairline and whitespace do all the structuring.

## Why it works
Boxed stat cards add four borders and a shadow per metric, which stacks into visual noise when you have four of them in a row. Replacing the box with a single 1px top rule at ~5% ink keeps the grouping legible while removing almost all weight — the numbers, not the chrome, become the loudest thing. Three deliberate moves make it scan:
- **Modest scale, strong weight.** The number is only ~1.7× body size but semibold against medium labels; emphasis comes from weight + the muted label above it, not a display-size jump. This keeps four metrics side by side from competing.
- **The delta badge is a tinted-fill + saturated-text chip.** A low-alpha wash of a semantic hue behind a dark, high-chroma label of the *same* hue (green = up, pink/red = down) is legible at 12px and reads as color-coded status without shouting.
- **One grid, three stops.** `1 → repeat(2) → repeat(4)` means the same markup serves phone, tablet, and desktop; the hairline runs along each cell's top edge at every width.

## Reference implementation
```html
<style>
  .stats {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-6, 2rem);
  }
  @media (min-width: 640px)  { .stats { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 1280px) { .stats { grid-template-columns: repeat(4, 1fr); } }

  .stat {
    border-top: 1px solid var(--color-hairline, rgba(9,9,11,0.05));  /* the only chrome */
    padding-top: var(--space-4, 1rem);
  }
  .stat__label {
    font-size: var(--text-sm, 0.875rem);
    font-weight: var(--weight-medium, 500);
    color: var(--color-fg, #09090b);
  }
  .stat__value {
    margin-top: var(--space-4, 1rem);
    font-size: var(--text-xl, 1.5rem);
    font-weight: var(--weight-semibold, 600);
    line-height: 1.33;
    color: var(--color-fg, #09090b);
    font-variant-numeric: tabular-nums;   /* numbers align across cells */
  }
  .stat__meta {
    margin-top: var(--space-3, 0.75rem);
    display: flex;
    align-items: center;
    gap: var(--space-2, 0.5rem);
    font-size: var(--text-sm, 0.875rem);
    color: var(--color-muted, #71717a);
  }
  /* Tinted-fill + saturated-text status chip. */
  .badge {
    display: inline-flex;
    align-items: center;
    border-radius: var(--radius-md, 6px);
    padding: 2px var(--space-2, 0.5rem);
    font-size: var(--text-xs, 0.75rem);
    font-weight: var(--weight-medium, 500);
  }
  .badge--up   { background: var(--badge-up-bg,   rgba(132,204,22,0.20)); color: var(--badge-up-fg,   #4d7c0f); }
  .badge--down { background: var(--badge-down-bg, rgba(236,72,153,0.15)); color: var(--badge-down-fg, #be185d); }
</style>

<div class="stats">
  <div class="stat">
    <div class="stat__label">Total revenue</div>
    <div class="stat__value">$2.6M</div>
    <div class="stat__meta"><span class="badge badge--up">+4.5%</span> from last week</div>
  </div>
  <div class="stat">
    <div class="stat__label">Average order value</div>
    <div class="stat__value">$455</div>
    <div class="stat__meta"><span class="badge badge--down">−0.5%</span> from last week</div>
  </div>
  <div class="stat">
    <div class="stat__label">Tickets sold</div>
    <div class="stat__value">5,888</div>
    <div class="stat__meta"><span class="badge badge--up">+4.5%</span> from last week</div>
  </div>
  <div class="stat">
    <div class="stat__label">Pageviews</div>
    <div class="stat__value">823,067</div>
    <div class="stat__meta"><span class="badge badge--up">+21.2%</span> from last week</div>
  </div>
</div>
```

Keep the badge hues strictly semantic (up/down), reuse `tabular-nums` so columns of figures align, and never let the delta chip outweigh the number — it's a footnote, not the headline. The same hairline-only treatment extends straight into the table below: divide rows with a single bottom rule, mute secondary columns to `--color-muted`, and right-align numeric amounts.
