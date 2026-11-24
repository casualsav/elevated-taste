---
pattern: staggered-display-headline
from: 14islands
corpus: expressive
safety: production-safe
tags: [hero, typography, headline, agency, portfolio]
---

## What it is
An oversized hero headline set in a single weight, where the words are broken onto separate lines and each line is horizontally offset across the canvas — e.g. "Design" flush-left, then "& Technology" indented far right. Tracking is pulled negative so the giant glyphs stay optically tight, and a secondary word/glyph (here the "&") is dropped to the muted ink. No bold, no color: drama comes purely from size, negative tracking, and asymmetric placement. On small screens the stagger is preserved (the indent shrinks but stays), so the art direction survives the breakpoint instead of collapsing to a centered block.

## Why it works
Hierarchy is decoupled from font-weight. Because every word is the same weight, the eye orders the composition by *scale and position* rather than by "which word is boldest" — this reads as composed/editorial rather than loud, and it scales to any type family with one weight. The horizontal offsets turn the headline into a layout (the negative space between the words is doing the work), which is why it feels art-directed even though it's just text. The negative tracking is the load-bearing detail: at display sizes default letter-spacing looks gappy and amateurish, so tightening it is what makes the size feel intentional.

## Reference implementation
```html
<style>
  .stagger-hero {
    background: var(--color-bg);
    color: var(--color-fg);
    padding-block: var(--space-10);
    padding-inline: var(--space-6);
  }
  .stagger-hero h1 {
    font-family: var(--font-sans);
    font-weight: var(--weight-regular);   /* single weight is the whole point */
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight); /* negative; essential at display scale */
    margin: 0;
    /* fluid display size; ceiling ~ the largest house step,
       floor low enough that the indented line still fits a 375px viewport */
    font-size: clamp(var(--text-4xl), 12vw, var(--text-display));
  }
  /* each word is its own line, offset by a fraction of the measure */
  .stagger-hero .line { display: block; }
  .stagger-hero .line--indent { padding-inline-start: 22%; }
  .stagger-hero .muted { color: var(--color-muted); }

  /* tiny asymmetric eyebrow, placed right-of-centre, mono caps */
  .stagger-hero .eyebrow {
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--color-muted);
    max-width: 22ch;
    margin-inline-start: 50%;        /* asymmetry: sits right of centre */
    margin-block-end: var(--space-8);
  }

  @media (max-width: 640px) {
    .stagger-hero .line--indent { padding-inline-start: 12%; } /* keep, don't kill */
  }
</style>

<header class="stagger-hero">
  <p class="eyebrow">Creative agency — we design and build premium digital products, brands, and experiences.</p>
  <h1>
    <span class="line">Design</span>
    <span class="line line--indent"><span class="muted">&amp;</span> Technology</span>
  </h1>
</header>
```
