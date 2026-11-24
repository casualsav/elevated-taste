---
pattern: dark-capability-bento
from: framer
corpus: production
safety: production-safe
tags: [feature-section, bento]
---

## What it is
A "full platform" section: a mixed-size grid of dark tiles, each holding a small *live-looking* product-UI fragment (a settings form, a branch list, a stat row, an analytics bar, a status uptime figure) with a one-line capability label + `→` anchored at the tile's bottom edge. Tiles vary in column/row span so the grid reads as a curated dashboard, not a uniform card wall. No icons — the proof is the mini-UI itself.

## Why it works
Depth comes from hairline `rgba(255,255,255,0.08)` borders and near-black surface half-steps (#050505 → #111 → #1e1e1e), never drop shadows, so the section stays flat and calm in dark mode while still separating tiles. Spanning a few tiles across 2 columns/rows breaks the monotony of an even grid and gives the eye a reading order. Putting the label at the bottom lets the mockup own the tile and keeps every card's affordance in the same place.

## Why it works (reuse rule)
Fill each tile with a concrete artifact (real field labels, real numbers) instead of a glyph — concreteness is what separates this from the generic three-feature-card template. Keep the palette monochrome and spend saturated accent (a single blue bar, a green "Live" pill) on at most one element per tile.

## Reference implementation
```html
<section class="bento">
  <h2 class="bento__title">Not just vibes,<br>a full platform</h2>
  <div class="bento__grid">
    <article class="tile tile--tall">
      <div class="tile__ui"><!-- Site Settings form fragment --></div>
      <a class="tile__label" href="#">SEO →</a>
    </article>
    <article class="tile">
      <div class="tile__ui"><!-- branch list --></div>
      <a class="tile__label" href="#">CMS →</a>
    </article>
    <article class="tile tile--stat">
      <p class="tile__stat">99.99%<span> uptime</span></p>
      <a class="tile__label" href="#">Hosting →</a>
    </article>
    <article class="tile"><div class="tile__ui"></div><a class="tile__label" href="#">Collaboration →</a></article>
    <article class="tile"><div class="tile__ui"></div><a class="tile__label" href="#">Localization →</a></article>
    <article class="tile"><div class="tile__ui"></div><a class="tile__label" href="#">Security →</a></article>
    <article class="tile tile--wide"><div class="tile__ui"><!-- analytics bar --></div><a class="tile__label" href="#">Analytics →</a></article>
  </div>
</section>

<style>
  .bento {
    max-width: var(--container-xl); margin-inline: auto; padding-block: var(--space-10);
    background: var(--color-bg-dark, #050505); color: var(--color-fg-on-dark, #fff);
  }
  .bento__title { font-size: var(--text-4xl); letter-spacing: var(--tracking-display);
                  text-align: center; margin-bottom: var(--space-8); }

  .bento__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;                                   /* the gap reads as the hairline */
    background: var(--color-hairline, rgba(255,255,255,0.08));
    border: 1px solid var(--color-hairline, rgba(255,255,255,0.08));
    border-radius: var(--radius-lg); overflow: hidden;
  }

  .tile {
    position: relative;
    min-height: 260px; padding: var(--space-6);
    background: var(--color-bg-dark, #050505);
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .tile--tall { grid-row: span 2; }
  .tile--wide { grid-column: span 2; }

  .tile__ui {                                   /* the embedded mini-mockup */
    flex: 1; border-radius: var(--radius-md);
    background: var(--color-surface-dark, #111);
    border: 1px solid var(--color-hairline, rgba(255,255,255,0.08));
  }
  .tile__stat { font-size: var(--text-4xl); font-weight: var(--weight-medium); letter-spacing: var(--tracking-display); }
  .tile__stat span { color: var(--color-muted-on-dark, rgba(255,255,255,0.6)); }

  .tile__label {
    margin-top: var(--space-4); align-self: start;
    color: var(--color-fg-on-dark, #fff); text-decoration: none;
    transition: opacity var(--duration-fast) var(--ease-standard);
  }
  .tile__label:hover { opacity: 0.62; }

  @media (max-width: 820px) {
    .bento__grid { grid-template-columns: 1fr; }
    .tile--tall, .tile--wide { grid-row: auto; grid-column: auto; }
  }
</style>
```
