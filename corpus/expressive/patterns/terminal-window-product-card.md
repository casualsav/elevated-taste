---
pattern: terminal-window-product-card
from: doronsupply
corpus: expressive
safety: production-safe
tags: [ecommerce, card, product, catalog, content-section]
---

## What it is

A catalog/product card dressed as a software application window. From top to bottom: a **title bar** (mono label flanked by a `||` glyph on the left and a `[x]` close glyph on the right), the product **thumbnail** with small bracketed corner/registration ticks, a **segmented spec strip** (a 3-cell mono row like `< REAL-TIME CONTROLS | 40+ DITHER EFFECTS | FULL COLOR SUITE >` that doubles as the feature list), a **wordmark plate** (the product name set big, bracketed by rule glyphs), then a quiet metadata + action row (`$65.00 USD … [+] Add Item`). Everything inside is one monospace font at one small size; the only non-mono element is the product imagery itself.

## Why it works

The window metaphor pre-loads meaning: a title bar + close glyph + spec strip reads instantly as "an application / a tool," which is exactly the promise for a store selling plugins and design assets — the *frame* sells the product as software before the copy does. Mechanically, it solves catalog hierarchy without scale or weight: the title bar, the segmented strip, and the rule-bracketed wordmark are **typographic frames** that rank the card's contents (chrome → subject → name → action) using position and borders instead of font-size jumps, so a wall of these cards stays calm and scannable at high density. Monospace makes the segmented spec strip self-align into equal cells with no grid math. The transferable rule: when content is busy (here, glitchy thumbnails), make the card chrome maximally rigid and quiet — orderly frames around chaotic content tell the eye where the subject is, and a single consistent "window" schema makes a whole catalog feel like one designed system rather than a grid of rows. Reusable for digital goods, plugin/template marketplaces, font shops, or any catalog wanting a technical, product-as-software character.

## Reference implementation

```html
<style>
  .twpc {
    display: flex;
    flex-direction: column;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    overflow: hidden;
    font-family: var(--font-mono);
    color: var(--color-fg);
  }

  /* title bar — the "window chrome" */
  .twpc__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    padding: var(--space-2) var(--space-3);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    border-bottom: 1px solid var(--color-border);
  }
  .twpc__bar-title { flex: 1; text-align: center; color: var(--color-muted); }
  .twpc__bar-glyph { color: var(--color-muted); }

  .twpc__thumb {
    display: block;
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
  }

  /* segmented spec strip = the feature list, auto-aligned by monospace */
  .twpc__specs {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--color-muted);
    border-top: 1px solid var(--color-border);
  }
  .twpc__specs li {
    padding: var(--space-2) var(--space-3);
    text-align: center;
    border-left: 1px solid var(--color-border);
    list-style: none;
  }
  .twpc__specs li:first-child { border-left: 0; }

  /* wordmark plate — product name, bracketed by rule glyphs */
  .twpc__name {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-4) var(--space-3);
    font-size: var(--text-lg);
    text-transform: uppercase;
    letter-spacing: var(--tracking-tight);
  }
  .twpc__name::before,
  .twpc__name::after {
    content: "[ ]";
    flex: 0 0 auto;
    color: var(--color-muted);
    opacity: 0.6;
  }
  .twpc__name span { flex: 1; text-align: center; }

  .twpc__meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3);
    font-size: var(--text-sm);
    border-top: 1px solid var(--color-border);
  }
  .twpc__price { color: var(--color-fg); }
  .twpc__add {
    background: none;
    border: 0;
    color: var(--color-fg);
    font: inherit;
    cursor: pointer;
    transition: color var(--duration-fast) var(--ease-standard);
  }
  .twpc__add:hover,
  .twpc__add:focus-visible { color: var(--color-accent); }
</style>

<article class="twpc">
  <div class="twpc__bar">
    <span class="twpc__bar-glyph" aria-hidden="true">||</span>
    <span class="twpc__bar-title">Advanced Bitmapping · Plugin</span>
    <span class="twpc__bar-glyph" aria-hidden="true">[x]</span>
  </div>

  <img class="twpc__thumb" src="dithertone.png" alt="Dithertone Pro plugin preview" />

  <ul class="twpc__specs">
    <li>Real-time controls</li>
    <li>40+ dither effects</li>
    <li>Full color suite</li>
  </ul>

  <h3 class="twpc__name"><span>Dithertone Pro</span></h3>

  <div class="twpc__meta">
    <span class="twpc__price">$65.00 USD</span>
    <button class="twpc__add" type="button">[+] Add Item</button>
  </div>
</article>
```
