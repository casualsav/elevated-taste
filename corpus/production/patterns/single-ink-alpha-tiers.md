---
pattern: single-ink-alpha-tiers
from: grafana-play
corpus: production
safety: production-safe
tags: [dark, dashboard, color-system, typography]
---

## What it is
A tone system for dense dark UI: route **one foreground hue** through the entire interface at descending opacity — primary text at `1.0`, secondary/labels at `~0.65`, then the *same ink* becomes the border and fill system at low alpha (`0.12` subtle fills, `0.08` hairlines). Pure white is held back for the rare peak-emphasis moment. Hierarchy is created by **tone (and weight 400→500), not by scale** — the type stays a near-single size (`14px` UI / `12px` micro), which is what keeps a screen full of panels and values scannable as a grid instead of a document.

## Why it works
Collapsing `fg`, `muted`, and `border` into one hue at different alphas means the whole surface is retoned by a single variable, and every layer feels mixed from the same pigment rather than assembled from unrelated greys. Alpha borders sit *on top of* whatever surface tint is beneath them, so one border value reads correctly on ground, panel, and raised control alike — no per-surface border tokens. Because ranking is by opacity and weight, you avoid the marketing-page reflex of sizing everything up; uniform type is the honest choice for data density. Grafana's ink is a faintly lavender off-white (`#ccccdc`), *not* `#ffffff` — the slight desaturation is what stops a dark UI from vibrating.

## Reference implementation
```html
<!-- framework-neutral; house dark-context tokens with Grafana ink as inline fallback -->
<style>
  .panel {
    --ink: 204, 204, 220;                 /* the one hue, as an RGB triple to re-alpha */
    background: var(--color-surface-dark, #181b1f);
    /* border = the ink at low alpha, works on any surface beneath it */
    border: 1px solid rgba(var(--ink), 0.08);
    border-radius: var(--radius-md, 6px);
    padding: var(--space-4);
    color: rgb(var(--ink));               /* primary text, alpha 1.0 */
    font: var(--weight-regular) var(--text-sm)/1.57 Inter, system-ui, sans-serif;
  }

  .panel__title {
    font-size: var(--text-md);            /* barely larger — rank by weight, not scale */
    font-weight: var(--weight-medium);    /* 500 marks emphasis, not 700 */
    margin: 0 0 var(--space-2);
  }
  .panel__label { color: rgba(var(--ink), 0.65); }   /* secondary tier */
  .panel__value { font-weight: var(--weight-medium); color: rgb(var(--ink)); }
  .panel__peak  { color: var(--color-fg-inverse, #ffffff); }  /* rare true-white emphasis */

  /* subtle fill (hover row, chip) = the same ink, a touch more alpha */
  .panel__chip {
    background: rgba(var(--ink), 0.12);
    border-radius: var(--radius-sm, 4px);
    padding: 2px var(--space-2);
  }
  .panel__divider { border-top: 1px solid rgba(var(--ink), 0.08); }
</style>

<section class="panel">
  <h3 class="panel__title">🏆 Dashboard of the Month</h3>
  <p class="panel__label">Updated 2h ago</p>
  <div class="panel__divider"></div>
  <p><span class="panel__value">2,481</span>
     <span class="panel__label">active series</span>
     <span class="panel__chip">live</span></p>
</section>
```

The three visible tiers — `1.0` text, `0.65` label, `0.08–0.12` structure — plus `500`-weight emphasis do all the ranking. Verify the `0.65` muted tier still clears AA (~4.5:1) over your darkest surface for the smallest labels; drop to `0.7` if it doesn't.
