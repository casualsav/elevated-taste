---
pattern: billboard-tile-stack
from: apple
corpus: production
safety: production-safe
tags: [landing, product-marketing, hero, ecommerce, feature-section]
---

## What it is
A front page built from one primitive repeated at three densities: a **billboard tile** — a full-bleed block of *fixed* height whose copy (headline, one-line subhead, two pill CTAs) is anchored to the **top** and whose product photograph bleeds out of the **bottom**. Tiles alternate between the page ground and a faint tinted ground so the seams read without a single divider rule. Below the fold the same tile is halved and paired 2-up on a narrow gutter, and a tile can invert to a dark ground when the photography demands it. No card frames, no borders, no shadows — the photography is the only visual interest.

## Why it works
Fixing the tile's *content height* instead of letting content dictate it turns each product into a stage of known size, so the page has a predictable scroll cadence and every product gets equal billing regardless of copy length. Top-anchoring the text and bottom-bleeding the image means the eye always lands on the claim first and the object second, at every tile, without any scroll choreography to enforce it — which is why this page can animate nothing and still feel authored. The alternating ground does the job of a section divider with zero ink. And because the tile is one primitive, halving it for a 2-up row costs no new design decisions: same anchor, same type ramp, same twin CTAs, half the width.

The twin CTA is the second load-bearing idea. Two pills of identical size and radius — one filled, one outlined — separate *learn* from *buy* without a word of instruction, and both stay tappable. A single CTA plus a text link makes the browser feel like the wrong kind of visitor.

## Reference implementation
```html
<style>
  .billboard {
    /* Height is a token, not a consequence of the copy. */
    --billboard-h: 692px;
    min-height: var(--billboard-h);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-block-start: var(--space-7);
    background: var(--color-bg);
    overflow: hidden;                       /* the photo bleeds; the tile clips */
    text-align: center;
  }
  /* Alternate the ground — this replaces every divider rule on the page. */
  .billboard--tinted { background: var(--color-surface); }
  .billboard--inverted {
    background: var(--color-bg-dark);
    color: var(--color-fg-on-dark);
  }
  .billboard--inverted .billboard__sub { color: var(--color-muted-on-dark); }

  .billboard--promo { --billboard-h: 580px; }

  .billboard__title {
    margin: 0;
    font-size: var(--text-5xl);
    font-weight: var(--weight-semibold);
    line-height: var(--leading-tight);
    /* Display optical cut: near-zero tracking. Do NOT reuse the body's -0.022em here. */
    letter-spacing: var(--tracking-display-open, -0.005em);
  }
  .billboard__sub {
    margin: var(--space-2) 0 0;
    font-size: var(--text-lg);
    font-weight: var(--weight-regular);
    line-height: var(--leading-snug);
    color: var(--color-fg);
  }

  /* Twin CTAs: identical geometry, different commitment. */
  .billboard__actions {
    display: flex;
    justify-content: center;
    gap: var(--space-3);
    margin-block-start: var(--space-5);
  }
  .billboard__cta {
    padding: var(--space-2) var(--space-5);
    border-radius: var(--radius-full);
    border: 1px solid transparent;
    font-size: var(--text-base);
    line-height: 1.2;
    text-decoration: none;
    transition: background-color var(--duration-base) var(--ease-standard),
                color var(--duration-base) var(--ease-standard);
  }
  .billboard__cta--fill {
    background: var(--color-accent);
    color: var(--color-accent-fg);
  }
  .billboard__cta--fill:hover { background: var(--color-accent-hover, #0077ed); }
  .billboard__cta--outline {
    color: var(--color-accent);
    border-color: var(--color-accent);
  }
  .billboard__cta--outline:hover {
    background: var(--color-accent);
    color: var(--color-accent-fg);
  }
  .billboard__cta:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 1px;
  }

  /* Image bleeds out of the bottom of the stage; it is never boxed. */
  .billboard__media {
    margin-block-start: auto;
    max-width: 100%;
    height: auto;
    object-fit: cover;
    object-position: top center;
  }

  /* Halve the same tile for a 2-up row. Nothing else changes. */
  .billboard-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-3);
  }
  .billboard-row .billboard { --billboard-h: 580px; }

  @media (max-width: 734px) {
    .billboard { --billboard-h: auto; padding-block: var(--space-7); }
    .billboard__title { font-size: var(--text-3xl); }
    .billboard-row { grid-template-columns: 1fr; }
    /* 44px minimum — do not inherit desktop's tight control padding on touch. */
    .billboard__cta { min-height: 44px; display: inline-flex; align-items: center; }
  }
</style>

<section class="billboard">
  <h2 class="billboard__title">Phone</h2>
  <p class="billboard__sub">Meet the latest lineup.</p>
  <div class="billboard__actions">
    <a class="billboard__cta billboard__cta--fill" href="/learn">Learn more</a>
    <a class="billboard__cta billboard__cta--outline" href="/buy">Shop</a>
  </div>
  <img class="billboard__media" src="/phone.jpg" alt="Three phones in graphite, white, and rose." />
</section>

<section class="billboard billboard--tinted billboard--promo">
  <h2 class="billboard__title">Laptop Air</h2>
  <p class="billboard__sub">Now supercharged.</p>
  <div class="billboard__actions">
    <a class="billboard__cta billboard__cta--fill" href="/learn">Learn more</a>
    <a class="billboard__cta billboard__cta--outline" href="/buy">Buy</a>
  </div>
  <img class="billboard__media" src="/laptop.jpg" alt="An open laptop seen from the front edge." />
</section>

<div class="billboard-row">
  <section class="billboard billboard--inverted"><!-- … --></section>
  <section class="billboard billboard--tinted"><!-- … --></section>
</div>
```
