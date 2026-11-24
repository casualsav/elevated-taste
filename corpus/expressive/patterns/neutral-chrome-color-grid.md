---
pattern: neutral-chrome-color-grid
from: thepudding
corpus: expressive
safety: production-safe
tags: [index, gallery, archive, editorial, navigation, blog, portfolio]
---

## What it is
A directory/index grid where the **UI shell is monochrome** (white page, near-black ink, grey deks, mono metadata) and **all color comes from the items' own thumbnails**. Each item is a *boxless card*: a saturated artwork block with a serif title and grey dek hanging below on plain white — no border, no shadow, no rounded container. A consistent mono **meta rail** (issue/number pill flush-left, date flush-right) brackets each card and gives the whole thing an archive/zine cadence.

## Why it works
The transferable idea: when items carry their own varied artwork, any colored chrome *competes* with them and the page turns muddy. Strip the chrome to neutral and the grid becomes a vivid rainbow at zero cost — the content is the palette. Dropping the card box (border/shadow/radius) removes ~3 visual lines per item, which at 50+ items is the difference between a calm catalog and noise; the colored block alone reads as the unit, whitespace does the separating. Hierarchy is carried by **typeface family** (serif title vs. sans dek vs. mono meta), not by a large size jump, so registers stay distinct even when titles are only ~2× body.

## Reference implementation
```html
<style>
  .index {
    max-width: var(--container-max, 1280px);
    margin-inline: auto;
    padding-inline: var(--space-16, 16px);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-48, 48px) var(--space-32, 32px);
    color: var(--fg, #262626);
    background: var(--bg, #fff);
  }
  @media (max-width: 720px) { .index { grid-template-columns: 1fr; } }

  /* boxless card: the thumbnail IS the card */
  .card { display: flex; flex-direction: column; }

  .card__rail {
    display: flex; justify-content: space-between; align-items: center;
    font-family: var(--font-mono, "Atlas Typewriter", monospace);
    font-size: var(--text-meta, 0.8rem);
    margin-bottom: var(--space-8, 8px);
  }
  .card__num {                      /* bordered mono pill: #223 */
    border: 1px solid currentColor;
    border-radius: var(--radius-pill, 28px);
    padding: var(--space-4, 4px) var(--space-12, 12px);
  }
  .card__date { color: var(--muted, #6d6d6d); letter-spacing: 1px; }

  .card__thumb {                    /* color lives ONLY here */
    aspect-ratio: 1 / 1;
    background: var(--swatch, #e68f33);   /* per-item; set inline or via data attr */
    display: grid; place-items: center;
    overflow: hidden;
  }
  .card__thumb img { width: 100%; height: 100%; object-fit: cover; }

  .card__title {
    font-family: var(--font-serif, "Gooper SemiCondensed", serif);
    font-size: var(--text-title, 2rem);
    letter-spacing: -0.8px;
    line-height: 1.05;
    margin: var(--space-16, 16px) 0 var(--space-8, 8px);
  }
  .card__dek {
    font-family: var(--font-sans, "Atlas Grotesk", sans-serif);
    color: var(--muted, #6d6d6d);
    line-height: 1.4; margin: 0;
  }

  /* editorial interruption: drop into a grid cell where a card would be */
  .card--editorial { justify-content: center; text-align: center; font-style: italic; }

  a:focus-visible { outline: 2px solid var(--accent, #3ae660); outline-offset: 2px; }
</style>

<section class="index">
  <article class="card">
    <div class="card__rail"><span class="card__num">#223</span><span class="card__date">JUN 2026</span></div>
    <a class="card__thumb" href="#" style="--swatch:#e68f33"><img src="…" alt="Ethical NBA champions chart"></a>
    <h2 class="card__title">ethical nba champions</h2>
    <p class="card__dek">Which teams don’t need asterisks by their title?</p>
  </article>

  <article class="card">
    <div class="card__rail"><span class="card__num">#222</span><span class="card__date">JUN 2026</span></div>
    <a class="card__thumb" href="#" style="--swatch:#63c34b"><img src="…" alt="Lawn mowing game"></a>
    <h2 class="card__title">lawn mowing game</h2>
    <p class="card__dek">Mow a series of lawns as efficiently as you can.</p>
  </article>

  <!-- editorial interruption breaks the rhythm -->
  <article class="card card--editorial">
    <p>Some of my favorite projects: <a href="#">defining punk</a>, <a href="#">abortion mazes</a>.</p>
  </article>
</section>
```
Notes: set `--swatch` per item (inline, data-attr, or sampled from the artwork) — that single variable is the whole color strategy. Keep titles in one weight; let the serif/sans/mono split carry hierarchy. No shadows, no card borders. Pure layout — nothing to gate for reduced motion.
