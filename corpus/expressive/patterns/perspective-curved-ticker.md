---
pattern: perspective-curved-ticker
from: corentinbernadou
corpus: expressive
safety: spectacle-only
tags: [hero, marquee, ticker, decoration, motion]
---

## What it is

A vertical list of short labels (project names, credits, categories) mapped onto a receding 3D path so the line bends and shrinks into the background. Items near the top read at full size; each successive item is rotated and pushed back in Z, so the column appears to curve away into the dark void as ambient motion texture. On the exemplar it repeats a project set (`Moving Portraits · Issey Miyake SS25 · Studies in Motion · Ruby Campbell · Shaped by Earth · Echoes in Light`) and scrolls/rotates continuously.

## Why it works

It buys "depth and motion" — the two things that make an expressive hero feel alive — using only text and CSS 3D transforms, with no extra color, imagery, or ornament. Because the spectacle is isolated to one decorative element, the surrounding system stays plain and the effect can be lazy-loaded, paused off-screen, or disabled wholesale. The mechanism (perspective + per-item Z offset + rotation) is general: any list can be turned into a curved 3D crawl. The cost is that far items become illegible by design, so it is *decoration, not navigation* — which is exactly why it must ship with a flat, readable fallback and honor reduced-motion.

## Reference implementation

```html
<style>
  .ticker {
    perspective: 60rem;                 /* depth of the scene */
    height: 100%;
    overflow: hidden;
    color: var(--color-muted);
    font-family: var(--font-sans);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-tight);
  }
  .ticker__track {
    transform-style: preserve-3d;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    /* continuous crawl; gated by reduced-motion below */
    animation: ticker-rise 24s linear infinite;
  }
  /* each item recedes a little further than the one above it */
  .ticker__item {
    transform-origin: top center;
    transform: translateZ(calc(var(--i) * -4rem))
               rotateX(calc(var(--i) * 6deg));
    opacity: calc(1 - (var(--i) * 0.08));
    font-size: var(--text-md);
    white-space: nowrap;
    will-change: transform;
  }
  .ticker__item:nth-child(3) { color: var(--color-accent); } /* lone highlight */

  @keyframes ticker-rise {
    from { transform: translateY(0); }
    to   { transform: translateY(calc(var(--space-9) * -1)); }
  }

  /* decoration only — collapse to a plain, readable list when motion/3D is unwanted */
  @media (prefers-reduced-motion: reduce) {
    .ticker__track { animation: none; transform: none; }
    .ticker__item  { transform: none; opacity: 1; }
  }
</style>

<aside class="ticker" aria-hidden="true">
  <div class="ticker__track">
    <span class="ticker__item" style="--i:0">Moving Portraits</span>
    <span class="ticker__item" style="--i:1">Issey Miyake SS25</span>
    <span class="ticker__item" style="--i:2">Studies in Motion</span>
    <span class="ticker__item" style="--i:3">Ruby Campbell</span>
    <span class="ticker__item" style="--i:4">Shaped by Earth</span>
    <span class="ticker__item" style="--i:5">Echoes in Light</span>
  </div>
</aside>
<!-- a real, flat, focusable list of the same links lives elsewhere in the DOM for navigation/SEO -->
```
