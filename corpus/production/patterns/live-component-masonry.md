---
pattern: live-component-masonry
from: shadcn
corpus: production
safety: production-safe
tags: [interactive-showcase, hero, design-system, layout]
---

## What it is

A wide multi-column masonry packed with many *small, real component instances* — forms, a chart, a chat panel, progress/savings cards, settings rows, a slider — each in a hairline card, used as the primary proof section of a design-system / component-library / UI-kit page. Instead of describing the kit with a feature list or one big screenshot, you **compose the landing page out of the product**: breadth is proven by seeing ~30 working things at once.

## Why it works

Density reads as capability. A visitor scanning a dozen varied, *functioning* components in one glance concludes "this kit has everything" faster than any copy could claim it. Three mechanisms keep that density calm rather than chaotic: (1) **monochrome chrome** — one neutral ramp for every surface/border/text so the cards don't fight; (2) **rationed accent** — color appears only inside the live data (chart bars, progress fills, primary actions), so it reads as real signal; (3) **hairline-border elevation** — 1px rings instead of drop shadows, so thirty cards stay flat. A shared token system (one radius scale, one border, one space base) is what makes heterogeneous widgets look like one family. Masonry (column-packed, varying card heights) also signals "catalog/collection" rather than "marketing section."

## Reference implementation

```html
<section class="showcase">
  <div class="masonry">
    <!-- each card is a REAL component instance, not a mockup -->
    <article class="card">
      <h3 class="card-title">Contribution History</h3>
      <p class="card-sub">Last 6 months of activity</p>
      <div class="bars">
        <span style="--h:55%"></span><span style="--h:80%"></span>
        <span style="--h:65%"></span><span style="--h:95%"></span>
        <span style="--h:45%"></span><span style="--h:70%"></span>
      </div>
    </article>

    <article class="card">
      <h3 class="card-title">Set a new milestone</h3>
      <label class="field">Goal Name<input placeholder="e.g. New Car"></label>
      <button class="btn-accent">Create Goal</button>
    </article>

    <article class="card">
      <p class="eyebrow">Retirement</p>
      <p class="metric">$420,000</p>
      <div class="progress"><i style="--p:65%"></i></div>
      <p class="card-sub">65% achieved</p>
    </article>
    <!-- …repeat with chat, settings list, slider, sparklines, etc. -->
  </div>
</section>

<style>
  .showcase { background: var(--color-bg); padding: var(--space-6) var(--space-5); }

  /* column masonry: cards flow & pack at varying heights */
  .masonry {
    column-width: 320px;
    column-gap: var(--space-5);
    max-width: var(--container-wide, 1400px);
    margin-inline: auto;
  }

  .card {
    break-inside: avoid;          /* keep a card whole across columns */
    margin-bottom: var(--space-5);
    background: var(--color-surface);
    border: 1px solid var(--color-border);   /* hairline-first elevation */
    border-radius: var(--radius-md);       /* one shared radius */
    box-shadow: var(--shadow-sm);       /* a whisper, or none */
    padding: var(--space-5);
    font-size: 0.875rem;          /* 14px app-density baseline */
    line-height: 1.43;
    color: var(--color-fg);
  }

  .card-title { font-size: 0.875rem; font-weight: 600; margin: 0; }
  .card-sub   { color: var(--color-muted); margin: var(--space-1, 4px) 0 var(--space-4); }
  .eyebrow    { font-size: 0.75rem; letter-spacing: 0.6px; text-transform: uppercase; color: var(--color-muted); }
  .metric     { font-size: 1.5rem; font-weight: 600; letter-spacing: -0.02em; margin: 0; }

  /* accent is RATIONED to live data only */
  .bars { display: flex; align-items: flex-end; gap: var(--space-2, 8px); height: 120px; }
  .bars span { flex: 1; height: var(--h); background: var(--color-accent); border-radius: var(--radius-sm, 6px); }
  .progress { height: 8px; background: var(--color-bg); border-radius: 999px; overflow: hidden; }
  .progress i { display: block; height: 100%; width: var(--p); background: var(--color-accent); }

  .field { display: grid; gap: var(--space-2, 8px); font-size: 0.875rem; }
  .field input {
    border: 1px solid var(--color-border); border-radius: var(--radius-sm, 6px);
    padding: var(--space-2, 8px) var(--space-3, 12px); font: inherit;
  }
  .btn-accent {
    margin-top: var(--space-4); border: 0; border-radius: var(--radius-sm, 6px);
    background: var(--color-accent); color: #fff; padding: var(--space-2, 8px) var(--space-3, 12px);
    font: inherit; font-weight: 500; cursor: pointer;
  }

  /* fewer columns on small screens (pair with scroll-edge-fade-mask for overflow) */
  @media (max-width: 640px) { .masonry { column-width: 280px; column-gap: var(--space-4); } }
</style>
```

> Layout is static — no motion needed. For the "scroll for more" dissolve at the bottom of a tall masonry, compose with `scroll-edge-fade-mask`. Honesty: column-masonry orders cards top-to-bottom *per column* (DOM order ≠ visual order); if reading order matters, use a JS masonry or a CSS grid with explicit spans instead.
