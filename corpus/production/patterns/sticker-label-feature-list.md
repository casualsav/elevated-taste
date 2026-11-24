---
pattern: sticker-label-feature-list
from: teak
corpus: production
safety: production-safe
tags: [feature-section, marketing, product-page]
---

## What it is
A compact vertical list of 3-5 capability rows, sitting beside (or below) an explanatory heading. Each row leads with a single short word set in **monospace inside a colored "sticker" block** (a tinted inline highlight), followed by a one- to two-line muted description. The rows are separated by hairline rules — a quiet bordered column, not a stack of shadowed cards. On Teak this is the `integrate / build / execute` trio.

## Why it works
The mono-word-in-a-tint does three jobs at once: monospace signals "this is a label / a step" (a different channel from the prose face), the color block gives each step its own identity and a playful, hand-made feel, and the short verb makes the row instantly scannable. Grouping with **hairline dividers instead of card elevation** keeps the cluster flat and calm, avoiding the cards-in-cards heaviness common to feature grids. Color stays decorative (on the label tint only), so it never competes with a real CTA. Reusable for "how it works" steps, capability lists, or any 3-5 item feature breakdown that needs personality without visual noise.

## Reference implementation
```html
<style>
  .sticker-list {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--color-border);   /* hairline frame, not a shadow card */
    border-radius: var(--radius-lg);
    background: var(--color-surface);
    max-width: var(--container-sm);
  }
  .sticker-list__row {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-5);
  }
  .sticker-list__row + .sticker-list__row {
    border-top: 1px solid var(--color-border); /* divider between rows */
  }
  .sticker-list__label {
    align-self: flex-start;                  /* tint hugs the word, not the row */
    font-family: var(--font-mono);
    font-size: var(--text-lg);
    font-weight: var(--weight-medium);
    line-height: 1;
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
    color: var(--color-fg);                  /* dark ink on the tint */
  }
  /* decorative-only tints — one per row, never used on interactive elements */
  .sticker-list__label[data-tint="a"] { background: var(--color-sticker-coral, #ffab8d); }
  .sticker-list__label[data-tint="b"] { background: var(--color-sticker-pink, #ffdcef); }
  .sticker-list__label[data-tint="c"] { background: var(--color-accent); }
  .sticker-list__desc {
    font-size: var(--text-base);
    line-height: var(--leading-normal);
    color: var(--color-muted);
    margin: 0;
    max-width: 46ch;
  }
</style>

<ul class="sticker-list">
  <li class="sticker-list__row">
    <span class="sticker-list__label" data-tint="a">integrate</span>
    <p class="sticker-list__desc">Our expert engineers help integrate a single SDK that does it all.</p>
  </li>
  <li class="sticker-list__row">
    <span class="sticker-list__label" data-tint="b">build</span>
    <p class="sticker-list__desc">Create audience segments, attach rewards, and craft branded messaging that resonates.</p>
  </li>
  <li class="sticker-list__row">
    <span class="sticker-list__label" data-tint="c">execute</span>
    <p class="sticker-list__desc">Send push and email campaigns that keep your players coming back for more.</p>
  </li>
</ul>
```

> The label tints are mapped to `--color-sticker-*` / `--color-accent` decorative roles, kept distinct from any CTA color. Confirm each tint↔ink pair meets 4.5:1; if a row's word must be read by assistive tech as a heading, promote the `<span>` to an appropriate heading element.
