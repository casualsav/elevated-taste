---
pattern: rule-divided-metric-ledger
from: lightspark
corpus: production
safety: production-safe
tags: [stats, feature-section, editorial, metrics]
---

## What it is
A band of metrics (or short features) laid out as **tall columns separated by thin vertical hairlines**, where each column pins a small uppercase kicker to the *top* and the large number to the *baseline* — leaving a deliberate column of empty space between them. A tiny index (01–04) sits at the very bottom edge. It reads like a ruled ledger or spec sheet, not a row of cards. Lightspark uses it twice: the "65+ / 99.99% / 2–5 / 3–5x" stat band and the numbered "What we do" rows.

## Why it works
Boxing stats in cards adds borders, shadows, and padding that compete with the numbers. Here the structure is carried by **two cheap devices only**: a single hairline rule between columns, and **vertical alignment as hierarchy** — `justify-content: space-between` in each tall column pushes the kicker up and the figure down so the eye travels top-label → (whitespace) → big-number → caption in a fixed rhythm across all columns. Because every column shares that skeleton, wildly different values (a count, a percentage, a range, a multiplier) read as one coherent set. The number does the shouting (large, single-weight, tight tracking, `tabular-nums` so figures align); everything else is quiet grey. It degrades gracefully: the same markup stacks to one column on mobile by swapping the vertical rules for horizontal ones.

## Reference implementation
```html
<!-- framework-neutral; house tokens + inline fallbacks -->
<section class="ledger" aria-label="Key metrics">
  <article class="ledger__col">
    <p class="ledger__kicker">Reach</p>
    <div class="ledger__body">
      <p class="ledger__num">65+</p>
      <p class="ledger__caption">countries on local rails</p>
    </div>
    <span class="ledger__index">01</span>
  </article>

  <article class="ledger__col">
    <p class="ledger__kicker">Performance</p>
    <div class="ledger__body">
      <p class="ledger__num">99.99%</p>
      <p class="ledger__caption">historical uptime</p>
    </div>
    <span class="ledger__index">02</span>
  </article>

  <article class="ledger__col">
    <p class="ledger__kicker">Integration</p>
    <div class="ledger__body">
      <p class="ledger__num">2&ndash;5</p>
      <p class="ledger__caption">days to go live</p>
    </div>
    <span class="ledger__index">03</span>
  </article>

  <article class="ledger__col">
    <p class="ledger__kicker">Economics</p>
    <div class="ledger__body">
      <p class="ledger__num">3&ndash;5x</p>
      <p class="ledger__caption">more revenue per user</p>
    </div>
    <span class="ledger__index">04</span>
  </article>
</section>

<style>
  .ledger {
    display: grid; grid-template-columns: repeat(4, 1fr);
    max-width: 1098px; margin-inline: auto;
    padding: clamp(5.6rem, 4.16rem + 3vw, 8rem) var(--space-4, 2.4rem);
  }
  .ledger__col {
    display: flex; flex-direction: column; justify-content: space-between;
    min-height: 26rem;                     /* the tall cell is what creates the gap */
    padding-inline: var(--space-4, 2.4rem);
    border-left: 1px solid var(--color-hairline, rgba(38,38,35,0.1));
  }
  .ledger__col:last-child { border-right: 1px solid var(--color-hairline, rgba(38,38,35,0.1)); }

  .ledger__kicker {
    margin: 0; font-size: 0.99rem; letter-spacing: 0.02em;
    color: var(--color-muted, #7c7c7c);
  }
  .ledger__body { margin-top: auto; }      /* pin the number toward the baseline */
  .ledger__num {
    margin: 0; font-size: clamp(2.8rem, 2.2rem + 1.6vw, 3.6rem);
    font-weight: 400; letter-spacing: -0.03em; line-height: 1.05;
    font-variant-numeric: tabular-nums; color: var(--color-fg, #020202);
  }
  .ledger__caption { margin: 0.4rem 0 0; font-size: 1.3rem; color: var(--color-muted, #7c7c7c); }
  .ledger__index { font-size: 0.99rem; color: var(--color-muted, #7c7c7c); }

  /* stack to a single column, swap vertical rules for horizontal ones */
  @media (max-width: 48rem) {
    .ledger { grid-template-columns: 1fr; }
    .ledger__col {
      min-height: 0; border-left: 0; border-right: 0 !important;
      padding-block: var(--space-4, 2.4rem);
      border-top: 1px solid var(--color-hairline, rgba(38,38,35,0.1));
    }
  }
</style>
```
