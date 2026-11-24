---
pattern: product-comparison-strip
from: aesop
corpus: production
safety: production-safe
tags: [ecommerce, comparison, data-table]
---

## What it is

A horizontally-scrolling, **one-column-per-product** comparison: each column carries an image, name, attribute notes, and price, all sitting above a **shared row of binary attribute chips** (Woody / Spicy / Ambery filled = present, the rest empty = absent). Aesop uses it as "Compare our fragrances," closing with an "Aromatically alike" cross-sell list. It answers "help me choose between similar SKUs" without a heavyweight configurator or a wall-of-checkmarks table.

## Why it works

It maps two axes a shopper actually compares — *which products* (columns) against *which attributes* (the chip row) — onto one scannable object. The chips are **binary fills, not numbers**, so difference is read by presence/absence at a glance, and the meaning never depends on color alone (the chip keeps its text label). Native horizontal overflow handles "more products than fit" honestly on both desktop and touch, and the shared chip row keeps every product measured on the *same* vocabulary. Transfers to any catalog of multi-attribute, similar-priced items: perfume, wine, coffee, mattresses, pricing plans.

## Reference implementation

```html
<!-- framework-neutral; tokens from /tokens/aesop.json -->
<section class="compare" aria-label="Compare fragrances">
  <div class="compare__track" role="list">
    <article class="compare__col" role="listitem">
      <div class="compare__media"><img src="/p/rozu.jpg" alt="Rōzu Eau de Parfum"></div>
      <h3 class="compare__name">Rōzu Eau de Parfum</h3>
      <p class="compare__notes">Rose, Shiso, Guaiacwood</p>
      <p class="compare__price">$200.00</p>
      <ul class="chips" aria-label="Aroma profile">
        <li class="chip is-on">Woody</li>
        <li class="chip is-on">Spicy</li>
        <li class="chip is-on">Ambery</li>
        <li class="chip">Fresh</li>
        <li class="chip">Citrus</li>
        <li class="chip">Green</li>
        <li class="chip">Floral</li>
        <li class="chip">Smoky</li>
      </ul>
    </article>
    <!-- repeat .compare__col per product; the chip set is identical across columns -->
  </div>
</section>

<style>
  .compare__track {
    display: flex;
    gap: var(--space-9, 32px);
    overflow-x: auto;
    scroll-snap-type: x proximity;
    padding-block: var(--space-6, 20px);
    -webkit-overflow-scrolling: touch;
  }
  .compare__col {
    flex: 0 0 280px;          /* fixed column; track scrolls */
    scroll-snap-align: start;
    color: var(--fg, #333333);
    text-align: center;
  }
  .compare__media {
    aspect-ratio: 1 / 1;
    background: var(--surface, #f6f5e8);   /* warm tile, not white */
    margin-bottom: var(--space-4, 12px);
  }
  .compare__media img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .compare__name {
    font-family: var(--font-text, "SuisseIntl", sans-serif);
    font-size: var(--text-sm, 0.875rem); font-weight: 400; margin: 0 0 var(--space-2, 6px);
  }
  .compare__notes {
    font-size: var(--text-xs, 0.75rem); color: var(--muted, #666666);
    margin: 0 0 var(--space-3, 8px);
  }
  .compare__price { font-size: var(--text-sm, 0.875rem); margin: 0 0 var(--space-4, 12px); }

  /* binary attribute chips — fill = present, outline = absent; never color-only */
  .chips {
    list-style: none; margin: 0; padding: 0;
    display: flex; flex-wrap: wrap; gap: 1px;       /* hairline grid feel */
    justify-content: center;
  }
  .chip {
    font-family: var(--font-text, "SuisseIntl", sans-serif);
    font-size: var(--text-2xs, 0.6875rem);
    padding: var(--space-4, 12px) var(--space-2, 6px);
    border: 1px solid var(--border-hairline, rgba(51,51,51,0.2));
    color: var(--muted, #666666);
    background: transparent;                          /* absent */
  }
  .chip.is-on {
    background: var(--surface, #f6f5e8);              /* present — fill + darker ink */
    color: var(--fg, #333333);
    font-weight: 500;
  }
</style>
```

This is a static, scroll-native pattern (no JS required). If you progressively enhance with drag-to-scroll or arrow buttons, gate any scroll-into-view animation behind `@media (prefers-reduced-motion: reduce)` and keep the chips readable with text alone — never signal "present" by hue only.
