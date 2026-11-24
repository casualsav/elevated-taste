---
pattern: kicker-led-section-header
from: aesop
corpus: production
safety: production-safe
tags: [section-header, editorial, ecommerce]
---

## What it is

A single, reusable section-opener template applied to *every* block of a long page: a tiny tracked **kicker label**, a **humanist-display title**, one **supporting sentence**, and a **thin-bordered text button**. Aesop runs this exact stack above the hero ("Evergreen exhilaration"), the care finder ("Enlightening assistance"), and the fragrance trio ("Perfectly portable"), so a dense homepage reads as one composed rhythm instead of a pile of unrelated sections.

## Why it works

Hierarchy comes from a **typeface swap plus a fixed micro-structure**, not from a big type-scale ramp. The kicker (small grotesque) signals "a section starts here"; the title (characterful humanist face) carries identity; the sentence and ghost button never vary in shape. Because the *pattern* repeats, the reader's eye learns it once and then scans the whole page effortlessly — and the small kicker lets you add context without inflating the heading size. It is pure static CSS, degrades to readable text with styles off, and ports to any stack.

## Reference implementation

```html
<!-- framework-neutral; tokens from /tokens/aesop.json -->
<section class="section">
  <p class="section__kicker">Perfectly portable</p>
  <h2 class="section__title">Quintessential Fragrance Trio</h2>
  <p class="section__lede">
    Three of our most sought-after fragrances come together: a pocket-sized
    primer, to introduce our fragrant world.
  </p>
  <a class="ghost-btn" href="/fragrance/trio">
    Discover the trio
    <span class="ghost-btn__arrow" aria-hidden="true">&rarr;</span>
  </a>
</section>

<style>
  .section {
    max-width: 730px;             /* text measure */
    padding-block: var(--space-10, 40px);
    color: var(--fg, #333333);
  }
  .section__kicker {
    font-family: var(--font-text, "SuisseIntl", sans-serif);
    font-size: var(--text-2xs, 0.6875rem);   /* 11px */
    font-weight: 400;
    letter-spacing: var(--tracking-label, 0.01em);
    color: var(--muted, #666666);
    margin: 0 0 var(--space-3, 8px);
  }
  .section__title {
    font-family: var(--font-display, "Zapf-Humanist", sans-serif); /* humanist / Optima-class */
    font-size: var(--text-2xl, 1.9rem);       /* ~30px */
    font-weight: 400;                          /* hierarchy from family, not weight */
    line-height: 1.33;
    margin: 0 0 var(--space-4, 12px);
  }
  .section__lede {
    font-family: var(--font-text, "SuisseIntl", sans-serif);
    font-size: var(--text-sm, 0.875rem);       /* 14px */
    line-height: 1.5;
    color: var(--fg, #333333);
    margin: 0 0 var(--space-6, 20px);
  }
  /* thin-bordered text button — no fill, sharp corners, hairline rule */
  .ghost-btn {
    display: inline-flex;
    align-items: center;
    gap: var(--space-3, 8px);
    padding: var(--space-3, 8px) var(--space-6, 20px);
    font-family: var(--font-text, "SuisseIntl", sans-serif);
    font-size: var(--text-sm, 0.875rem);
    color: var(--fg, #333333);
    text-decoration: none;
    border: 1px solid var(--fg, #333333);
    border-radius: var(--radius-xs, 2px);
    transition: color var(--dur-3, 300ms) var(--ease-out, ease-out),
                border-color var(--dur-3, 300ms) var(--ease-out, ease-out);
  }
  .ghost-btn:hover { color: #000; border-color: #000; }
  .ghost-btn__arrow {
    transition: transform var(--dur-3, 300ms) var(--ease-out, ease-out);
  }
  .ghost-btn:hover .ghost-btn__arrow { transform: translateX(4px); }

  @media (prefers-reduced-motion: reduce) {
    .ghost-btn, .ghost-btn__arrow { transition: none; }
    .ghost-btn:hover .ghost-btn__arrow { transform: none; }
  }
</style>
```

**Note:** the whole device rests on holding `font-weight: 400` everywhere and letting `--font-display` (a stressed humanist face) versus `--font-text` (a neutral grotesque) create the level change. If you only have one family, this pattern collapses — supply a second, characterful display face.
