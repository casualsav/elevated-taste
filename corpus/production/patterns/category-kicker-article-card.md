---
pattern: category-kicker-article-card
from: quanta
corpus: production
safety: production-safe
tags: [card, editorial, blog, grid, section-header]
---

## What it is

The atomic unit of a publication grid: a vivid square-ish thumbnail, then a tiny uppercase, heavily-tracked **category kicker** in the brand accent, then a **serif headline**, then a small **sans byline**. Quanta runs this exact stack for every article — hero, grid card, and list row — so a homepage mixing physics, math, biology and CS reads as one scannable system instead of a pile of unrelated tiles.

## Why it works

Three jobs collapse into one repeated micro-structure. The **kicker** is simultaneously taxonomy (what field), the page's lone **color accent**, and a structural "an article starts here" marker. The **family swap** — accent sans kicker + sans byline bracketing a serif headline — creates hierarchy without a steep size ramp: the reader learns the shape once, then scans the whole grid effortlessly. Because the scaffolding is plain (square corners, hairline rule, white bg, near-invisible shadow), the commissioned illustration carries the visual energy and the UI never competes. It is pure static CSS, degrades to readable text with styles off, and ports to any stack.

## Reference implementation

```html
<!-- framework-neutral; tokens from /tokens/quanta.json -->
<article class="card">
  <a class="card__media" href="/article/cell-ribs">
    <img src="/img/cell-ribs.jpg" alt="Illustration of a cell's cytoskeleton under load" />
  </a>
  <p class="card__kicker">Biomechanics</p>
  <h3 class="card__title">
    <a href="/article/cell-ribs">What Breaks a Cell's Ribs Can Make It Stronger</a>
  </h3>
  <p class="card__byline">By Yasemin Saplakoglu</p>
</article>

<style>
  .card {
    display: flex;
    flex-direction: column;
    gap: var(--space-2, 8px);
    background: var(--bg, #ffffff);
    border-top: 1px solid var(--hairline, #d0d0d0);  /* group with rules, not boxes */
    padding-top: var(--space-2, 8px);
  }
  .card__media {
    display: block;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    border-radius: var(--radius-xs, 2px);   /* near-sharp; the image is the event */
    margin-bottom: var(--space-2, 8px);
  }
  .card__media img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform var(--dur-2, 200ms) var(--ease, ease);
  }
  .card__media:hover img { transform: scale(1.03); }

  /* kicker: the accent color's ONLY job is wayfinding/taxonomy */
  .card__kicker {
    font-family: var(--font-sans, "Pangram", Avenir, sans-serif);
    font-size: var(--text-2xs, 0.625rem);   /* 10px */
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: var(--tracking-kicker, 2.6px);
    color: var(--accent, #ff8600);
    margin: 0;
  }
  /* headline: serif owns the words */
  .card__title {
    font-family: var(--font-serif, "Merriweather", Georgia, serif);
    font-size: var(--text-lg, 1.375rem);     /* 22px */
    font-weight: 700;
    line-height: 1.2;
    margin: 0;
  }
  .card__title a { color: var(--fg, #1a1a1a); text-decoration: none; }
  .card__title a:hover { color: var(--accent, #ff8600); }
  /* byline: sans owns the chrome */
  .card__byline {
    font-family: var(--font-sans, "Pangram", Avenir, sans-serif);
    font-size: var(--text-xs, 0.8125rem);    /* 13px */
    color: var(--muted, #6b6b6b);
    margin: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .card__media img { transition: none; }
    .card__media:hover img { transform: none; }
  }
</style>
```

**Note:** the device rests on two rules — (1) the kicker is the *only* place the accent color appears in a card, so it never competes with the artwork; (2) serif headline vs sans kicker/byline does the level-setting, so headlines need no oversized type. Drop either (accent on the headline, or one-family) and the card flattens into a generic blog tile.
