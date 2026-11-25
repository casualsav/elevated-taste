---
pattern: alternating-ground-catalogue
from: teenage-engineering
corpus: expressive
safety: production-safe
tags: [layout, ecommerce, product-marketing]
---

## What it is
A long product/portfolio page chaptered by **edge-to-edge background inversion** instead of dividers or section headers. The scroll alternates between near-black full-bleed "stage" bands — a single product shown as a dramatic, well-lit render floating in void with only a tiny caption — and light "shelf" rows that lay related SKUs out in a hairline-separated 3-up grid with name + price + a functional buy link. Dark stage to *perform*, light shelf to *sell*, repeating.

## Why it works
Ground color does the chaptering for free: an edge-to-edge flip from `#0F0E12` to `#F6F8F7` reads as a hard section break with zero divider chrome, so the page feels like moving through rooms rather than down one scroll. The black stage isolates a hero product (no competing UI, image owns the hierarchy); the light shelf restores a calm, scannable grid for comparison and purchase. Keeping the cells sharp-cornered, shadowless, and split only by 1px hairlines makes the austere frame recede so the photography stays the loudest thing on the page. Transfers to any catalogue, product family, or case-study index with strong imagery.

## Reference implementation
```html
<!-- framework-neutral; tokens from /tokens (no magic numbers) -->
<style>
  .stage {
    background: var(--color-stage, #0F0E12);
    color: var(--color-fg-on-dark, #F5F5F5);
    padding: var(--space-64, 64px) var(--space-32, 32px);
    display: grid; place-items: center;
    min-block-size: 80vh;
  }
  .stage__media { max-inline-size: min(72ch, 80%); }
  .stage__media img { display: block; inline-size: 100%; height: auto; }
  .stage__caption {
    justify-self: start; align-self: end;
    font-size: var(--text-sm, 0.8rem); font-weight: 300;
    color: var(--color-muted, #B2B2B2);
  }

  .shelf {
    background: var(--color-surface, #F6F8F7);
    color: var(--color-fg, #0F0E12);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* hairline grid: gap shows the row background through 1px seams */
    gap: 1px;
    border-block: 1px solid var(--color-hairline, #E5E5E5);
    background-color: var(--color-hairline, #E5E5E5);
  }
  .shelf__cell {
    background: var(--color-surface, #F6F8F7);
    padding: var(--space-24, 24px);
    display: flex; flex-direction: column; gap: var(--space-12, 12px);
  }
  .shelf__name { font-size: var(--text-sm, 0.8rem); font-weight: 300; }
  .shelf__buy {
    font-size: var(--text-sm, 0.8rem); font-weight: 300;
    color: var(--color-accent, #0071BB); text-decoration: none;
  }
  .shelf__buy:hover, .shelf__buy:focus-visible { text-decoration: underline; }
  .shelf__cell img { display: block; inline-size: 100%; height: auto; }

  @media (max-width: 640px) {
    .shelf { grid-template-columns: 1fr; }
  }
</style>

<!-- chapter 1: dark stage -->
<section class="stage" aria-label="OB-4">
  <figure class="stage__media">
    <img src="/img/ob-4.jpg" alt="OB-4 magic radio, lit on black">
  </figure>
  <figcaption class="stage__caption">OB-4</figcaption>
</section>

<!-- chapter 2: light shelf -->
<section class="shelf" aria-label="OB-4 colors">
  <article class="shelf__cell">
    <img src="/img/ob4-white.jpg" alt="OB-4 white">
    <h3 class="shelf__name">OB-4 white</h3>
    <a class="shelf__buy" href="/store/ob4-white">buy now</a>
  </article>
  <article class="shelf__cell">
    <img src="/img/ob4-black.jpg" alt="OB-4 black">
    <h3 class="shelf__name">OB-4 black</h3>
    <a class="shelf__buy" href="/store/ob4-black">buy now</a>
  </article>
  <article class="shelf__cell">
    <img src="/img/ob4-red.jpg" alt="OB-4 red">
    <h3 class="shelf__name">OB-4 red</h3>
    <a class="shelf__buy" href="/store/ob4-red">buy now</a>
  </article>
</section>
<!-- repeat stage → shelf per product family -->
```
