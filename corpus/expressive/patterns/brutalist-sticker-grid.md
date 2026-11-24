---
pattern: brutalist-sticker-grid
from: oatly
corpus: expressive
safety: production-safe
tags: [grid, layout, editorial, ecommerce, brutalist]
---

## What it is
A modular grid where every tile is drawn with one consistent hairline ink border and lifted by a hard, zero-blur offset shadow ("sticker on paper"). Each cell carries a bottom-pinned UPPERCASE mono caption bar, and tiles alternate between photo content and flat candy-color fills. The borders *are* the layout — structure is drawn, not implied by whitespace — so the page can run dense and still read as deliberate.

## Why it works
Three cheap, transferable mechanisms do all the work: (1) a **single border weight** repeated everywhere makes many modules feel like one system; (2) a **hard offset shadow** (`2px 2px 0 #000`, no blur) gives physical, print-derived depth that stays crisp at any scale — the opposite of the generic soft glow; (3) **flat color blocks** instead of gradients turn variety into rhythm. Because there's no blur and no gradient, the look is GPU-trivial and photographs/prints cleanly. Hierarchy inside a tile comes from case + weight in one type family, not from extra fonts.

## Reference implementation
```html
<!-- framework-neutral; tokens from /tokens (oatly.json) -->
<style>
  .sticker-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: var(--space-2, 8px);
    padding-inline: var(--space-6, 44px);
    background: var(--color-bg, #fff);
  }
  .tile {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 280px;
    border: var(--border, 1px solid #222);
    box-shadow: var(--shadow-sticker, 2px 2px 0 0 #000);  /* hard, zero-blur */
    border-radius: 0;
    background: var(--tile-fill, #fff);
    overflow: hidden;
  }
  .tile--pink   { --tile-fill: var(--color-pink,   #f8c8d8); }
  .tile--amber  { --tile-fill: var(--color-amber,  #fdcf85); }
  .tile--purple { --tile-fill: var(--color-purple, #a67eb1); }
  .tile--sky    { --tile-fill: var(--color-sky,    #98c5d3); }

  .tile__art {            /* photo or hand-lettered display fills the body */
    flex: 1;
    display: grid;
    place-items: center;
    padding: var(--space-4, 24px);
    font-weight: 900;
    text-transform: uppercase;
    color: var(--color-fg, #222);
  }
  .tile__caption {        /* bottom-pinned mono label bar */
    border-top: var(--border, 1px solid #222);
    padding: var(--space-2, 8px) var(--space-4, 16px);
    display: flex;
    justify-content: space-between;
    font-family: var(--font-mono, "Margo Pro", monospace);
    font-size: var(--text-xs, 0.84rem);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--color-fg, #222);
  }
  /* optional playful affordance: nudge the sticker on hover (transform-only) */
  .tile { transition: transform var(--dur-1, 300ms) var(--ease, ease),
                      box-shadow var(--dur-1, 300ms) var(--ease, ease); }
  .tile:hover {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0 0 #000;
  }
  @media (prefers-reduced-motion: reduce) {
    .tile { transition: none; }
    .tile:hover { transform: none; box-shadow: var(--shadow-sticker, 2px 2px 0 0 #000); }
  }
  @media (max-width: 600px) {
    .sticker-grid { grid-template-columns: repeat(2, 1fr); padding-inline: var(--space-3, 16px); }
  }
</style>

<section class="sticker-grid">
  <article class="tile tile--pink">
    <div class="tile__art">The plan for not perfect</div>
    <div class="tile__caption"><span>The Oatly look book</span><span>Refill</span></div>
  </article>
  <article class="tile tile--amber">
    <div class="tile__art">Tastes like Miami</div>
    <div class="tile__caption"><span>News</span><span>→</span></div>
  </article>
  <article class="tile">
    <img class="tile__art" src="/oat-drink-chocolate.jpg" alt="Carton of Oat Drink Chocolate">
    <div class="tile__caption"><span>Oat drink chocolate</span><span>Products</span></div>
  </article>
</section>
```
