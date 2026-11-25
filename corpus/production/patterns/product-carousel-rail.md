---
pattern: product-carousel-rail
from: ourplace
corpus: production
safety: production-safe
trigger: drag
tags: [ecommerce, product-card, carousel, motion]
---

## What it is

A horizontal, scroll-snapping shelf of product cards with a title and ‹ › prev/next controls in the top-right corner. Each card is a fixed structure — image tile · serif name + variant count · one-line spec · active price beside a struck-through compare-at price · a row of round finish swatches — so a browsable row of products stays scannable and trustworthy without a tall vertical grid.

## Why it works

The card answers the only three questions a shopper has — *what is it, how much, which finish* — in a fixed reading order, so a rail of six reads as fast as one. Native CSS scroll-snap does the carousel work (no JS animation loop, no scroll-jacking): the rail is just an overflow container, the arrows nudge `scrollLeft` by one card, and the browser handles momentum, drag, and keyboard. Hierarchy inside the card comes from the **family swap** (serif name vs sans spec/price), not from weight; the single terracotta accent marks the live price; and metallic finishes are faked with a `conic-gradient` swatch so you don't need a photo per finish. Because snap + `scroll-behavior` are native, reduced-motion users simply get instant jumps for free.

## Reference implementation

```html
<section class="rail">
  <header class="rail__head">
    <h2 class="rail__title">Shop Bestsellers</h2>
    <div class="rail__nav">
      <button class="rail__btn" data-dir="-1" aria-label="Previous products">‹</button>
      <button class="rail__btn" data-dir="1"  aria-label="Next products">›</button>
    </div>
  </header>

  <ul class="rail__track">
    <li class="card">
      <a class="card__media" href="/p/titanium-pro"><img src="…" alt="Titanium Pro Cookware Set"></a>
      <h3 class="card__name">Titanium Pro Cookware Set <span class="card__count">(10 piece)</span></h3>
      <p class="card__spec">A full set of high-performance titanium cookware</p>
      <p class="card__price">
        <span class="card__now">$399</span>
        <span class="card__was">$698</span>
      </p>
      <ul class="card__swatches" aria-label="Finishes">
        <li><button class="swatch swatch--steel" aria-label="Brushed steel"></button></li>
        <li><button class="swatch swatch--gold"  aria-label="Gold"></button></li>
        <li><button class="swatch" style="background:var(--color-surface-2)" aria-label="Cream"></button></li>
      </ul>
    </li>
    <!-- …more cards… -->
  </ul>
</section>

<style>
  .rail__head {
    display: flex; align-items: baseline; justify-content: space-between;
    margin-bottom: var(--space-4);
  }
  .rail__title { font: 400 1.75rem/1.1 var(--font-serif); color: var(--color-fg); }
  .rail__nav { display: flex; gap: var(--space-2); }
  .rail__btn {
    inline-size: 44px; block-size: 44px;            /* keep tap target ≥44px */
    border: 1px solid var(--border-ink, #35312E); border-radius: var(--radius-full);
    background: transparent; color: var(--color-fg); cursor: pointer;
    transition: background var(--duration-fast) var(--ease-standard);
  }
  .rail__btn:hover { background: var(--color-surface); }

  .rail__track {
    display: flex; gap: var(--space-4); margin: 0; padding: 0; list-style: none;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    scrollbar-width: none;                            /* arrows are the affordance */
  }
  .rail__track::-webkit-scrollbar { display: none; }

  .card {
    flex: 0 0 clamp(240px, 30%, 340px);
    scroll-snap-align: start;
  }
  .card__media {
    display: block; aspect-ratio: 1; border-radius: var(--radius-sm);
    background: var(--color-surface);                       /* warm sand tile behind product */
    overflow: hidden;
  }
  .card__media img { inline-size: 100%; block-size: 100%; object-fit: contain; }

  .card__name  { margin: var(--space-3) 0 var(--space-1); font: 400 1.25rem/1.2 var(--font-serif); }
  .card__count { font: 400 0.875rem/1 var(--font-sans); color: var(--color-muted); }
  .card__spec  { margin: 0 0 var(--space-2); font: 400 1rem/1.4 var(--font-sans); color: var(--color-muted); }
  .card__price { display: flex; gap: var(--space-2); align-items: baseline; }
  .card__now   { color: var(--price-active, #AF5A3C); font: 600 1rem/1 var(--font-sans); }   /* terracotta */
  .card__was   { color: var(--price-compare, #5A5854); text-decoration: line-through; font-size: 1rem; }

  .card__swatches { display: flex; gap: var(--space-1); margin: var(--space-2) 0 0; padding: 0; list-style: none; }
  .swatch {
    inline-size: 22px; block-size: 22px; border-radius: var(--radius-full);
    border: 1px solid var(--border-light, #E6E6E6); cursor: pointer; padding: 0;
  }
  /* fake metallic finishes with a conic-gradient instead of a photo per variant */
  .swatch--steel { background: conic-gradient(from 90deg, #f2f3f3, #8c9194 53deg, #6a7075 121deg, #fff); }
  .swatch--gold  { background: conic-gradient(from 90deg, #f7f8f8, #d3c468 34deg, #ada474 90deg, #5a6167); }

  @media (prefers-reduced-motion: reduce) {
    .rail__track { scroll-behavior: auto; }           /* jump, don't animate */
  }
</style>

<script>
  // Arrows nudge by one card width; native scroll-snap settles the rest.
  document.querySelectorAll('.rail').forEach((rail) => {
    const track = rail.querySelector('.rail__track');
    const step = () => track.querySelector('.card')?.getBoundingClientRect().width
      + parseInt(getComputedStyle(track).columnGap || '0', 10);
    rail.querySelectorAll('.rail__btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        track.scrollBy({ left: Number(btn.dataset.dir) * step() });
      });
    });
  });
</script>
```

Notes: this is the framework-neutral distillation of the site's Splide rail — the principle (scroll-snap shelf + fixed-structure card + family-swap hierarchy + single accent price + conic-gradient swatches) ports to any stack; drop the JS and the arrows still work as native scroll on touch. Keep swatch *hit-areas* ≥44px even though the visible dot is ~22px (wrap in padded `<li>` or expand with a pseudo-element).
