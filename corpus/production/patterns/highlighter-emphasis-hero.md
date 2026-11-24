---
pattern: highlighter-emphasis-hero
from: teak
corpus: production
safety: production-safe
tags: [hero, heading, marketing]
---

## What it is
An oversized display headline (set in one weight, tight tracking) in which a single load-bearing word is given a hand-drawn-looking highlighter bar behind it — a soft, slightly-rotated tinted block that sits *under* the baseline like a marker swipe, not a solid background box. Everything else in the headline stays plain ink on the page canvas. One inline `<mark>`/`<span>` carries the effect.

## Why it works
Emphasis usually costs a weight change (bold) or a size change, both of which disturb the line's rhythm. A highlighter mark adds attention on a *separate visual channel* (background, not type), so the headline keeps a single weight and even baseline while still steering the eye to the exact word that carries the pitch. It also injects brand color and a human/analog texture into otherwise neutral type for near-zero structural cost, and it degrades gracefully — with CSS off, the word is still just text. Reusable in any hero, feature heading, or pull quote where one word should win.

## Reference implementation
```html
<style>
  .hl-hero {
    max-width: var(--container-lg);
    margin-inline: auto;
    padding-inline: var(--space-6);
    padding-block: var(--space-8);
  }
  .hl-hero__title {
    font-family: var(--font-display, var(--font-sans));
    font-size: var(--text-5xl);            /* scale does the shouting */
    font-weight: var(--weight-medium);     /* NOT bold */
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--color-fg);
    margin: 0;
  }
  /* the highlighter swipe: a tinted bar sitting low behind the word */
  .hl-hero__mark {
    background-color: var(--color-accent);
    color: var(--color-fg);                /* ink stays dark; accent is behind */
    padding-inline: var(--space-1);
    border-radius: var(--radius-sm);
    box-decoration-break: clone;           /* survives line wraps */
    -webkit-box-decoration-break: clone;
  }
  /* optional: marker-only-under-the-text variant (doesn't tint full line-box) */
  .hl-hero__mark--swipe {
    background-color: transparent;
    background-image: linear-gradient(var(--color-accent), var(--color-accent));
    background-repeat: no-repeat;
    background-position: 0 88%;             /* sit low, like a real highlighter */
    background-size: 100% 42%;             /* only the lower band is colored */
    padding-inline: 0;
    border-radius: 0;
  }
  @media (max-width: 768px) {
    .hl-hero__title { font-size: var(--text-4xl); }
  }
</style>

<header class="hl-hero">
  <h1 class="hl-hero__title">
    The retention engine behind
    <mark class="hl-hero__mark hl-hero__mark--swipe">irresistible</mark>
    games
  </h1>
</header>
```

> Note: `<mark>` carries semantic "marked/highlighted" meaning for AT; if the highlight is purely decorative, use a `<span>` instead so screen readers don't announce emphasis. Keep the accent↔ink pair at ≥4.5:1 — here dark ink on yellow passes comfortably.
