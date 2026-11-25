---
pattern: product-spotlight-card
from: rhode
corpus: production
safety: production-safe
tags: [ecommerce, product, card, dtc]
---

## What it is
A single product reduced to one calm capsule: a rounded card holding the product shot, a lowercase bold name, a star-rating chip with review count, a one-line descriptor, the price, and a full-width pill "buy" CTA. Several sit in a row (or a Swiper track on mobile) over a warm tinted panel. Every edge — the card, the rating chip, the button — is drawn with a single `inset 0 0 0 1px` hairline in the brand ink, so the whole group reads as one family.

## Why it works
It answers the only four questions a shopper has — *what is it · is it good · how much · how do I buy* — in a fixed vertical order, so a row of them scans instantly with zero layout variance. Drawing the borders as **inset box-shadows instead of `border`** keeps the hairline out of box-sizing: it never nudges layout on hover/focus and layers cleanly over any radius or background. One shared pill radius and one ink color unify the card, the rating chip, and the CTA without per-element styling — the cohesion is structural, not decorative. Holding the card chrome to a single neutral ink lets the product photography supply all the color.

## Reference implementation
```html
<style>
  .spotlight-row {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: var(--space-4); padding: var(--space-6);
    background: var(--color-surface);          /* warm tint behind white cards */
  }
  .spotlight-card {
    display: flex; flex-direction: column; gap: var(--space-3);
    padding: var(--space-4);
    background: var(--color-bg);               /* white */
    border-radius: var(--radius-lg);           /* one big radius, e.g. 20px */
    box-shadow: inset 0 0 0 1px var(--color-fg);   /* hairline as inset shadow */
  }
  .spotlight-card__media {
    aspect-ratio: 1; border-radius: var(--radius-md);
    background: var(--color-surface) center/cover no-repeat;
  }
  .spotlight-card__name {
    font-family: var(--font-display); font-weight: 700;
    font-size: var(--text-lg); color: var(--color-fg);
    text-transform: lowercase; letter-spacing: -0.02em;
  }
  .spotlight-card__rating {        /* the star + count chip */
    align-self: start; display: inline-flex; align-items: center; gap: var(--space-1);
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-full);         /* 40px */
    box-shadow: inset 0 0 0 1px var(--color-fg);
    font-size: var(--text-xs); color: var(--color-muted);
  }
  .spotlight-card__meta {
    display: flex; justify-content: space-between; align-items: baseline;
    font-size: var(--text-sm); color: var(--color-muted);
  }
  .spotlight-card__cta {
    margin-top: auto; padding: var(--space-3);
    border-radius: var(--radius-full); background: transparent;
    box-shadow: inset 0 0 0 1px var(--color-fg);
    color: var(--color-fg); font-size: var(--text-sm);
    text-align: center; cursor: pointer;
    transition: background-color var(--duration-fast) var(--ease-standard),
                color var(--duration-fast) var(--ease-standard);
  }
  .spotlight-card__cta:hover { background: var(--color-fg); color: var(--color-bg); }

  @media (max-width: 640px) {
    .spotlight-row { grid-auto-flow: column; grid-auto-columns: 78%;
                     grid-template-columns: none; overflow-x: auto;
                     scroll-snap-type: x mandatory; }
    .spotlight-card { scroll-snap-align: start; }
  }
</style>

<div class="spotlight-row">
  <article class="spotlight-card">
    <div class="spotlight-card__media" style="background-image:url(highlight.jpg)"></div>
    <span class="spotlight-card__rating">★★★★★ <span>(58)</span></span>
    <h3 class="spotlight-card__name">highlight</h3>
    <div class="spotlight-card__meta"><span>Multipurpose luminizer</span><span>$28</span></div>
    <button class="spotlight-card__cta">buy highlight milk — $28</button>
  </article>
  <!-- repeat for bronze, case … -->
</div>
```
