---
pattern: ruled-article-card-grid
from: worksinprogress
corpus: production
safety: production-safe
tags: [editorial, blog, feature-section, card]
---

## What it is
A dense index of article cards laid out in a multi-column grid, where each card is defined entirely by **1px hairline rules** — no fills, no shadows. Inside a card: a serif headline, a monospace byline ("Words by …"), a ruled divider, a serif dek, a "Read more →" link, and a final ruled row holding a monospace tag "chip". Roles are coded by *typeface* (serif = content, mono = metadata), so the card reads cleanly with almost no size variation.

## Why it works
The hairline is the cheapest possible separator and the most print-like: it frames and divides without the visual weight of `box-shadow` or filled surfaces, so you can pack many cards per screen and keep them legible. Pairing a serif with a monospace removes the need for a tall type scale — the reader sorts headline from byline from tag by *font*, not size. The bottom ruled row turning the tag into a bordered chip gives every card an identical baseline anchor, so a ragged grid still scans as a tidy table.

## Reference implementation
```html
<style>
  .ruled-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-50, 50px);
    max-width: var(--container-max, 1472px);
    margin-inline: auto;
    background: var(--color-bg, #FFF7F4);
    color: var(--color-fg, #141414);
  }
  @media (max-width: 720px) { .ruled-grid { grid-template-columns: 1fr; } }

  .ruled-card {
    border: 1px solid var(--color-hairline, #141414);
    display: flex;
    flex-direction: column;
  }
  .ruled-card__body { padding: var(--space-30, 30px); }

  .ruled-card__title {
    font-family: var(--font-serif, "Editor", Georgia, serif);
    font-weight: 700;
    font-size: var(--type-24, 1.5rem);
    line-height: 1.3;
    margin: 0 0 var(--space-5, 5px);
  }
  .ruled-card__byline {
    font-family: var(--font-mono, "GT America Mono", ui-monospace, monospace);
    font-size: var(--type-12, 0.75rem);
  }
  .ruled-card__byline b { font-weight: 700; }

  /* hairline divider between meta and dek */
  .ruled-card__dek {
    font-family: var(--font-serif, "Editor", Georgia, serif);
    font-size: var(--type-16, 1rem);
    line-height: 1.5;
    border-top: 1px solid var(--color-hairline, #141414);
    padding-top: var(--space-20, 20px);
    margin-top: var(--space-20, 20px);
  }

  .ruled-card__more {
    align-self: flex-end;
    margin-top: var(--space-20, 20px);
    font-family: var(--font-mono, ui-monospace, monospace);
    font-weight: 700;
    font-size: var(--type-12, 0.75rem);
    text-decoration: none;
    color: inherit;
    transition: text-decoration var(--dur-fast, 150ms) ease-in-out;
  }
  .ruled-card__more:hover { text-decoration: underline; }

  /* bottom ruled row → mono tag chip */
  .ruled-card__tagrow {
    border-top: 1px solid var(--color-hairline, #141414);
    display: flex;
  }
  .ruled-card__tag {
    font-family: var(--font-mono, ui-monospace, monospace);
    font-size: var(--type-12, 0.75rem);
    padding: var(--space-5, 5px) var(--space-15, 15px);
    border-right: 1px solid var(--color-hairline, #141414);
  }
</style>

<div class="ruled-grid">
  <article class="ruled-card">
    <div class="ruled-card__body">
      <h3 class="ruled-card__title">The evolution of bacteria</h3>
      <p class="ruled-card__byline">Words by <b>Kevin Blake</b></p>
      <p class="ruled-card__dek">
        Generations of microbes evolve in hours, not millennia — scientists
        have watched natural selection happen in real time.
      </p>
      <a class="ruled-card__more" href="#">Read more →</a>
    </div>
    <div class="ruled-card__tagrow"><span class="ruled-card__tag">E. Coli</span></div>
  </article>
  <!-- repeat .ruled-card … -->
</div>
```
Only `text-decoration` animates on hover (150ms) — nothing transform-heavy, so there is no reduced-motion hazard. If you add a hover lift, wrap it in `@media (prefers-reduced-motion: no-preference)`.
