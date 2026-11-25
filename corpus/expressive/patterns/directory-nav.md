---
pattern: directory-nav
from: teenage-engineering
corpus: expressive
safety: production-safe
tags: [navigation, header, ecommerce]
---

## What it is
A site header built as a *miniature sitemap* rather than a slim link bar. Instead of 4–6 top-level links (or a hamburger), it presents several **labelled columns** — each a category heading (`products`, `store`, `latest`, `finder`) above a short stack of destination links, optionally led by a custom pictographic glyph — laid edge-to-edge across the top, with the brand mark anchoring one end. It exposes the entire information architecture at a glance.

## Why it works
When a site's IA is genuinely wide (a hardware catalogue, a multi-section brand site), a minimal bar either lies about the breadth or buries it behind a click. Grouping links under visible category headings turns navigation into orientation: the visitor sees the whole map and self-routes in one move. The category heading carries the grouping logic, so each link can stay tiny and unweighted — density without clutter. It degrades gracefully: on narrow viewports the columns stack and collapse to a disclosure. Reuse it for catalogue commerce, documentation portals, agency/brand sites — anywhere the menu is the product map.

## Reference implementation
```html
<!-- framework-neutral; tokens from /tokens (no magic numbers) -->
<style>
  .dirnav {
    display: grid;
    grid-template-columns: auto repeat(4, 1fr) auto;
    align-items: start;
    gap: var(--space-24, 24px);
    padding: var(--space-24, 24px) var(--space-32, 32px);
    background: var(--color-surface, #F6F8F7);
    color: var(--color-fg, #0F0E12);
    font-family: var(--font-grotesque, system-ui, sans-serif);
  }
  .dirnav__brand { font-size: var(--text-md, 1rem); font-weight: 300; }
  .dirnav__col { display: flex; flex-direction: column; gap: var(--space-8, 8px); }
  .dirnav__head {
    display: flex; align-items: center; gap: var(--space-8, 8px);
    font-size: var(--text-md, 1rem); font-weight: 300;
  }
  .dirnav__glyph { width: 1.4em; height: 1.4em; transition: transform var(--dur, 200ms) var(--ease, ease); }
  .dirnav__head:hover .dirnav__glyph { transform: scale(1.18); } /* playful "bulge" */
  .dirnav__link {
    font-size: var(--text-sm, 0.8rem); font-weight: 300;
    color: var(--color-muted, #B2B2B2); text-decoration: none; line-height: 1.5;
  }
  .dirnav__link:hover, .dirnav__link:focus-visible { color: var(--color-fg, #0F0E12); }
  .dirnav__mark { justify-self: end; font-weight: 400; }

  @media (prefers-reduced-motion: reduce) {
    .dirnav__glyph { transition: none; }
    .dirnav__head:hover .dirnav__glyph { transform: none; }
  }

  /* Narrow: fold to a stacked disclosure */
  @media (max-width: 640px) {
    .dirnav { grid-template-columns: 1fr auto; }
    .dirnav__col { display: none; }
    .dirnav[data-open="true"] .dirnav__col { display: flex; grid-column: 1 / -1; }
  }
</style>

<nav class="dirnav" aria-label="Primary">
  <a class="dirnav__brand" href="/">teenage<br>engineering</a>

  <div class="dirnav__col">
    <span class="dirnav__head"><svg class="dirnav__glyph" aria-hidden="true"><!-- icon --></svg>products</span>
    <a class="dirnav__link" href="/instruments">instruments</a>
    <a class="dirnav__link" href="/audio">audio</a>
    <a class="dirnav__link" href="/designs">designs</a>
  </div>

  <div class="dirnav__col">
    <span class="dirnav__head"><svg class="dirnav__glyph" aria-hidden="true"><!-- icon --></svg>store</span>
    <a class="dirnav__link" href="/store">visit store</a>
    <a class="dirnav__link" href="/cart">cart &amp; checkout</a>
    <a class="dirnav__link" href="/deals">deals</a>
  </div>

  <div class="dirnav__col">
    <span class="dirnav__head"><svg class="dirnav__glyph" aria-hidden="true"><!-- icon --></svg>latest</span>
    <a class="dirnav__link" href="/newsletter">newsletter</a>
    <a class="dirnav__link" href="/now">now</a>
  </div>

  <div class="dirnav__col">
    <span class="dirnav__head"><svg class="dirnav__glyph" aria-hidden="true"><!-- icon --></svg>finder</span>
    <a class="dirnav__link" href="/guides">guides &amp; downloads</a>
    <a class="dirnav__link" href="/support">support</a>
    <a class="dirnav__link" href="/search">search</a>
  </div>

  <a class="dirnav__mark" href="/" aria-label="Home">▲●</a>
</nav>
```
