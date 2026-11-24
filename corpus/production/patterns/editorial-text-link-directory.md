---
pattern: editorial-text-link-directory
from: monzo
corpus: production
safety: production-safe
tags: [navigation, feature-section, editorial]
---

## What it is
A section whose primary content is a short list of **oversized text links** — a product taxonomy or site index rendered as big, tappable type rather than an icon-card grid. A quiet kicker ("Tell me about…") sits above a stack of display-scale links, set on a tinted surface so the section reads as a confident editorial directory.

## Why it works
Turning navigation into typography removes an entire layer of visual furniture (cards, icons, borders) and lets **scale alone** carry both hierarchy and affordance. Big text is faster to scan than a grid of equal-weight tiles, costs nothing in assets, and stays perfectly legible when it reflows to one column on mobile. Using a distinct link color (editorial blue, or the brand accent) signals "tap me" without needing buttons. It works precisely because it's restrained — the list *is* the design, so the surrounding canvas can be empty.

## Reference implementation
```html
<section class="directory">
  <p class="directory__kicker">Tell me about…</p>
  <ul class="directory__list">
    <li><a href="#">Bank accounts</a></li>
    <li><a href="#">Savings and ISAs</a></li>
    <li><a href="#">Investments</a></li>
    <li><a href="#">Credit</a></li>
    <li><a href="#">Mortgages</a></li>
    <li><a href="#">Pensions</a></li>
  </ul>
</section>

<style>
  .directory {
    background: var(--color-surface);            /* tinted band sections the page */
    padding: var(--space-10) var(--space-5);
    font-family: var(--font-display);
  }
  .directory__kicker {
    font-size: var(--text-lg);             /* ~1.25rem */
    color: var(--color-fg);
    margin: 0 0 var(--space-5);
  }
  .directory__list {
    list-style: none;
    margin: 0; padding: 0;
    display: grid;
    gap: var(--space-3);
  }
  .directory__list a {
    display: inline-block;
    font-size: var(--text-3xl);            /* ~2.4rem display scale */
    line-height: 1.1;
    letter-spacing: -1px;
    color: var(--color-accent);                    /* editorial blue or brand accent */
    text-decoration: none;
    transition: color var(--duration-base) var(--ease-standard);
  }
  .directory__list a:hover,
  .directory__list a:focus-visible {
    color: var(--color-accent);                  /* swap to the one loud color on intent */
    text-decoration: underline;
    text-underline-offset: 4px;
  }
  /* the list naturally stacks; only the type shrinks on small screens */
  @media (max-width: 600px) {
    .directory__list a { font-size: var(--text-2xl); }
    .directory { padding: var(--space-8) var(--space-5); }
  }
</style>
```
