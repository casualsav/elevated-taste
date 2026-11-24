---
pattern: sticky-stacking-cards
from: appcues
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [feature-section, motion]
---

## What it is
A vertical column of feature cards that pin one after another as the reader scrolls, each new card sliding up and overlapping the one before it to build a physical "deck." It reads as a paced 1-2-3 walkthrough with real depth, and it's driven entirely by native CSS `position: sticky` — no scroll-event handler, no animation library.

## Why it works
Each card sticks at a slightly larger `top` offset than the previous one, so as the section scrolls past, cards stop in a staircase and stack instead of scrolling away. Because it's compositor-native sticky positioning, there is zero main-thread scroll work and nothing to reflow — the effect is free. Give each card a distinct surface tint so the overlap is legible, and an opaque background so lower cards are fully hidden behind higher ones. The whole effect degrades gracefully: with reduced motion (or in a browser without sticky) the cards simply render as a normal stacked list.

## Reference implementation
```html
<section class="stack">
  <article class="stack__card" style="--i:0; background: var(--color-surface-lilac, #f6ebf8)">
    <p class="stack__eyebrow">Meet the moment</p>
    <h3 class="stack__h">Send the right message, to the right person.</h3>
  </article>
  <article class="stack__card" style="--i:1; background: var(--color-surface-cream, #fffcef)">
    <p class="stack__eyebrow">Move faster</p>
    <h3 class="stack__h">Get from idea to insight faster than ever.</h3>
  </article>
  <article class="stack__card" style="--i:2; background: var(--color-surface-teal, #ecfbff)">
    <p class="stack__eyebrow">Get sharper</p>
    <h3 class="stack__h">Build, target, and refine the most impactful campaign.</h3>
  </article>

  <style>
    .stack { display: flex; flex-direction: column; gap: var(--space-10, 60px); }
    .stack__card {
      position: sticky;
      /* stepped offset: each card pins a little lower than the last (clears a sticky header) */
      top: calc(var(--space-9, 40px) + var(--i, 0) * var(--space-6, 24px));
      border-radius: var(--radius-lg, 20px);
      padding: var(--space-9, 40px);
      color: var(--color-fg, #291a3d);
      box-shadow: var(--shadow-md, 0 4px 40px rgba(0,0,0,0.10));
    }
    .stack__eyebrow {
      font-family: var(--font-mono, "Basel Grotesk Mono", monospace);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-size: var(--text-eyebrow, 0.84rem);
      margin: 0 0 var(--space-3, 12px);
    }
    .stack__h {
      font-family: var(--font-display, "Martinaplantijn", Georgia, serif);
      font-weight: 400;
      font-size: var(--text-2xl, 1.75rem);
      line-height: 1.2;
      letter-spacing: -0.02em;
      margin: 0;
    }

    /* Sticky stacking is safe, but avoid surprise on users who opt out */
    @media (prefers-reduced-motion: reduce) {
      .stack__card { position: static; }
    }
    /* Short viewports: don't let deep cards pin off-screen */
    @media (max-height: 640px) {
      .stack__card { position: static; }
    }
  </style>
</section>
```
