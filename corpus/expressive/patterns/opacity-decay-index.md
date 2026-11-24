---
pattern: opacity-decay-index
from: 14islands
corpus: expressive
safety: production-safe
tags: [list, index, archive, changelog, portfolio, feed]
---

## What it is
A text index — one project (or entry) per row, each row a `name — category` pair separated by hairline rules — where the rows progressively lose opacity as they descend the list. The top rows are full-strength ink; by the bottom they've faded toward the background. It typically sits *below* a richer block (here, a 2-up image grid of the featured work), so the page reads as: featured work shown in full, then the long tail literally receding into the page. Hover/focus restores a row to full opacity.

## Why it works
The layout itself encodes priority. Instead of a flat list that implies every item is equal, the opacity gradient signals "these top entries matter most; the rest is depth, not headline." It communicates that there's *more* without paginating and without a louder visual treatment — the recession is the message. It pairs naturally with a featured grid above it (rich → sparse → fading) to produce a single priority ramp down the page. The mechanism is transferable to any ranked or chronological tail: changelog history, archive of past posts, secondary case studies, "all projects" after the highlights.

## Why it's framed production-safe (with the a11y guardrail baked in)
Faded rows can drop below contrast and read as *disabled*. The fix is structural, not optional: drive the fade with a CSS custom property per row, and **reset it to 1 on `:hover`/`:focus-within`** so any keyboard or pointer user can always surface a link to full strength. Never let the fade hide the only path to a destination, and honour `prefers-reduced-motion` for the restore transition.

## Reference implementation
```html
<style>
  .decay-index { list-style: none; margin: 0; padding: 0; }
  .decay-index li {
    /* per-row fade is set inline (--i / --n); falls back to 1 */
    opacity: calc(1 - (var(--i, 0) / var(--n, 1)) * 0.78);
    border-block-start: 1px solid var(--color-muted);
    transition: opacity var(--duration-base) var(--ease-standard);
  }
  .decay-index li:last-child { border-block-end: 1px solid var(--color-muted); }

  /* a11y: any user can bring a row back to full strength */
  .decay-index li:hover,
  .decay-index li:focus-within { opacity: 1; }

  .decay-index a {
    display: flex;
    justify-content: space-between;
    gap: var(--space-4);
    padding-block: var(--space-3);
    font-family: var(--font-sans);
    font-weight: var(--weight-regular);
    font-size: var(--text-md);
    color: var(--color-fg);
    text-decoration: none;
  }
  .decay-index .cat { color: var(--color-muted); }  /* category in the muted ink */

  @media (prefers-reduced-motion: reduce) {
    .decay-index li { transition: none; }
  }
</style>

<!-- set --n to the row count; --i is the row's zero-based position -->
<ul class="decay-index" style="--n: 8;">
  <li style="--i: 0;"><a href="#"><span>Quantum Wallet</span><span class="cat">Creative Tech</span></a></li>
  <li style="--i: 1;"><a href="#"><span>JustFoodForDogs</span><span class="cat">Ecommerce</span></a></li>
  <li style="--i: 2;"><a href="#"><span>Ankra</span><span class="cat">Business Solutions</span></a></li>
  <li style="--i: 3;"><a href="#"><span>HeroKit</span><span class="cat">Creative Tech</span></a></li>
  <li style="--i: 4;"><a href="#"><span>Oyyo</span><span class="cat">Ecommerce</span></a></li>
  <li style="--i: 5;"><a href="#"><span>Antler</span><span class="cat">Corporate Website</span></a></li>
  <li style="--i: 6;"><a href="#"><span>Flipside</span><span class="cat">Fin Tech</span></a></li>
  <li style="--i: 7;"><a href="#"><span>Neuro</span><span class="cat">Gaming</span></a></li>
</ul>
```
