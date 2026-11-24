---
pattern: soft-tag-palette
from: attio
corpus: production
safety: production-safe
tags: [data-table, dashboard, feature-section, forms]
---

## What it is
A small family of categorical "tag" pills — each a low-chroma tinted background paired with a slightly stronger same-hue border and dark, fully-legible text. Attio lifts these straight from its CRM's own record/label UI (a soft blue tag, a soft green tag, etc.) and reuses them on the marketing page so the product's data looks alive. Each hue means *one category*; the set is deliberately pastel so that several distinct colors can coexist on a near-white surface without any of them shouting.

## Why it works
When you need to distinguish many categories at once — record types, statuses, table cells, filter chips, kanban labels — saturated fills turn the UI into confetti and fight the content for attention. Pairing a ~10–15% tint background with a matching mid-tint border and keeping the *text* near-black gives you (a) enough hue separation to scan categories at a glance and (b) consistent, AA-passing legibility regardless of which color the cell happens to be, because contrast lives in the dark text on a light tint, not in the hue. The border (rather than a heavier fill) keeps the chip crisp on white and lets it sit calmly inside a data-dense table. Because the hues are low-chroma, a page can hold a whole palette of them and still read as monochrome-with-accents. Transfers to any tagging system, table status column, segmented label, or filter bar — anywhere you'd otherwise reach for a rainbow of solid badges.

## Reference implementation
```html
<style>
  .tag {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-full);
    border: 1px solid var(--tag-border);
    background: var(--tag-bg);
    color: var(--color-fg);                 /* dark text on every tint = uniform contrast */
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    font-weight: var(--weight-medium);
    line-height: 1;
    white-space: nowrap;
  }
  /* each category sets only its two hue vars */
  .tag--blue  { --tag-bg: var(--color-tint-blue-bg, #e5eeff);  --tag-border: var(--color-tint-blue-border, #d6e5ff); }
  .tag--green { --tag-bg: var(--color-tint-green-bg, #ddf9e4); --tag-border: var(--color-tint-green-border, #c7f4d3); }
  .tag--gray  { --tag-bg: var(--color-surface);       --tag-border: var(--color-border-strong); }
</style>

<span class="tag tag--blue">Customer</span>
<span class="tag tag--green">Active</span>
<span class="tag tag--gray">Prospect</span>
```

**Safety:** production-safe. Because every tint carries dark text, contrast holds across the whole palette — but never encode meaning in hue *alone* (the visible text label must carry it, for colorblind users and for greyscale). Keep tints low-chroma so a row of them stays calm; if you need an alert/critical state, that's a *semantic* color job (success/danger tokens), not another decorative tag hue. The `--tag-bg`/`--tag-border` var pair makes adding a new category a two-line change with no per-tag CSS rule explosion.
