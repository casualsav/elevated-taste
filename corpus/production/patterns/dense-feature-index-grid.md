---
pattern: dense-feature-index-grid
from: shopify-checkout
corpus: production
safety: production-safe
tags: [feature-section, content-grid]
---

## What it is
A closing "everything it does" section rendered as a dense multi-column grid of many small cells — each an icon, a short label, and one line of copy — on a single dark band. It replaces the tired three-padded-hero-card "features" block with a confident catalog whose sheer count ("there are this many") is itself the message.

## Why it works
When a product genuinely has 20+ capabilities, three cards under-sell and a long vertical list exhausts. A tight grid makes breadth *scannable*: the eye samples the field, trusts the volume, and stops on whatever matters to it. It reads as calm rather than cramped because every cell is the same strict template (icon / label / one line), the container is a quiet monochrome ground so the cells don't each fight for attention, and generous row gaps do the separating instead of borders or boxes. Transfers to any spec sheet, integrations list, or capability index.

## Reference implementation
```html
<section class="feature-index">
  <h2 class="feature-index__title">Everything it does</h2>
  <ul class="feature-index__grid">
    <li class="feature-cell">
      <svg class="feature-cell__icon" aria-hidden="true" width="24" height="24"><!-- icon --></svg>
      <h3 class="feature-cell__label">Quick visual customizations</h3>
      <p class="feature-cell__desc">Anyone can restyle checkout with brand colors, logo, and layout — no code.</p>
    </li>
    <!-- …repeat for the full capability list… -->
  </ul>
</section>

<style>
  .feature-index {
    background: var(--color-bg-dark, #000);
    color: var(--color-fg-on-dark, #f5f7fa);
    padding-block: var(--space-9, 6rem);
    border-top-left-radius: var(--radius-section, 48px);   /* stitch to the band above */
    border-top-right-radius: var(--radius-section, 48px);
  }
  .feature-index__title {
    max-width: var(--container-content, 600px);
    margin: 0 auto var(--space-8, 4rem);
    padding-inline: var(--space-5, 1.5rem);
    text-align: center;
    font-size: var(--text-4xl); letter-spacing: var(--tracking-heading); line-height: var(--leading-tight);
    font-weight: var(--weight-medium);                     /* micro-step, not bold */
  }
  .feature-index__grid {
    max-width: var(--container-xl, 1280px);
    margin-inline: auto; padding-inline: var(--space-5, 1.5rem);
    list-style: none; margin-block: 0;
    display: grid; gap: var(--space-7, 3rem) var(--space-6, 2rem);
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));   /* 3–4 up on desktop, 1 on phone */
  }
  .feature-cell__icon  { color: var(--color-fg-on-dark, #f5f7fa); margin-bottom: var(--space-3, 0.75rem); }
  .feature-cell__label { margin: 0 0 var(--space-2, 0.5rem); font-size: var(--text-md); font-weight: var(--weight-medium); }
  .feature-cell__desc  { margin: 0; font-size: var(--text-sm); line-height: var(--leading-normal); color: var(--color-muted-on-dark, rgba(245,247,250,0.64)); }
</style>
```
Notes: keep the cell template rigid (icon → label → one line) so 24 cells still read as one system. Row gap should exceed column gap so rows separate without rules. `auto-fit` + `minmax` collapses to a single column on phones automatically; ensure the whole cell (or its label link) is a ≥44px tap target when cells are interactive — the source flagged 58 sub-44px targets.
