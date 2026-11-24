---
pattern: alternating-polarity-name-index
from: cssdesignawards
corpus: expressive
safety: production-safe
tags: [portfolio, agency, index, editorial]
---

## What it is
A long index (projects, case studies, chapters) where every entry is the *same* three-zone row — a small left kicker label, a giant lowercase name with a hairline rule, and a right-aligned one-line blurb — and the page **flips its light/dark polarity** between movements instead of using dividers or cards. The repetition makes a long list scannable; the polarity flip punctuates sections without adding chrome.

## Why it works
Hierarchy comes entirely from **scale contrast in one weight** (an ~8× jump from the kicker/blurb to the name), so the page stays calm while each name reads as a loud graphic object. Setting the giant name in a single weight with **tight negative tracking** fuses the letters into one shape. The flanking small labels create an editorial "column of meaning" (category on the left, value on the right) around the hero word. Because there are no shadows, gradients, or cards, the only structural signals are *scale, position, and polarity* — which is what makes it feel like a designed publication rather than a template. Reuse for agency work-indexes, portfolio landings, manifesto sections, or any list that wants presence over density.

## Reference implementation
```html
<!-- framework-neutral; tokens from /tokens/tokens.json, local aliases declared once -->
<style>
  .index {
    --name-size: clamp(2.5rem, 12vw, 8rem);   /* giant display, fluid */
    --name-track: -0.05em;                     /* tight only on display */
    background: var(--color-bg);
    color: var(--color-fg);
    transition: background var(--duration-slow) var(--ease-standard),
                color var(--duration-slow) var(--ease-standard);
  }
  /* Polarity flip: alternate entries (or mark sections) invert the page */
  .index.is-inverse {
    background: var(--color-surface-inverse);
    color: var(--color-fg-inverse);
  }

  .entry {
    display: grid;
    grid-template-columns: 1fr minmax(0, 8fr) 3fr;
    align-items: end;
    column-gap: var(--space-7);
    padding-block: var(--space-9);              /* generous vertical air */
    max-width: var(--container-xl);
    margin-inline: auto;
  }
  .entry__kicker {
    font-size: var(--text-md);
    letter-spacing: var(--tracking-tight);
    align-self: start;
  }
  .entry__name {
    grid-column: 2;
    margin: 0;
    font-weight: var(--weight-regular);         /* one weight — scale does the work */
    font-size: var(--name-size);
    line-height: 0.9;                            /* crushed display leading */
    letter-spacing: var(--name-track);
    text-transform: lowercase;
    border-bottom: 1px solid currentColor;       /* hairline rule under the name */
    padding-bottom: var(--space-5);
  }
  .entry__blurb {
    grid-column: 3;
    align-self: end;
    font-size: var(--text-md);
    line-height: var(--leading-normal);
    max-width: 28ch;
  }
  .entry__name .accent { color: var(--color-accent); }  /* spend red sparingly */

  @media (max-width: 768px) {
    .entry { grid-template-columns: 1fr; row-gap: var(--space-4); }
    .entry__name { grid-column: 1; }
    .entry__blurb { grid-column: 1; }
  }
</style>

<section class="index">
  <article class="entry">
    <span class="entry__kicker">gaming</span>
    <h2 class="entry__name">belka games</h2>
    <p class="entry__blurb">Vibrant overhaul for the corporate site of a prominent game publisher.</p>
  </article>
</section>

<section class="index is-inverse">  <!-- next movement flips polarity -->
  <article class="entry">
    <span class="entry__kicker">interior design</span>
    <h2 class="entry__name">leviev group</h2>
    <p class="entry__blurb">A technologically advanced site for an interior-design company.</p>
  </article>
</section>
```

Notes: keep the name in **one weight** and let `--name-size` carry hierarchy; the hairline `currentColor` rule and the `.is-inverse` flip both ride the same fg/bg tokens so the polarity swap is one class. No shadows or gradients by design.
