---
pattern: receipt-ledger
from: tikhon
corpus: expressive
safety: production-safe
tags: [list, content-section, portfolio, changelog, specs]
---

## What it is

A content section formatted like a printed receipt / order line-items: a small uppercase section label, a column header row (`#`, NAME, meta), then numbered rows where the item sits left and a single meta value (year, qty, price) sits right, with a thin rule between rows. Monospace type makes the columns self-align. Tikhon uses it for Projects, Talks, Lectures, and Press — the same component repeated, which is what makes the page feel like one coherent document.

## Why it works

The receipt is a schema every reader already knows, so the structure itself communicates "this is a scannable, complete list" without any type-scale hierarchy. Monospace guarantees the right-hand meta column aligns optically with zero effort (no `tabular-nums`, no grid math), so density stays legible. Because emphasis lives in the *structure* (numbering, columns, rules) rather than in font size, you can stack many sections and the rhythm holds. It is also intrinsically responsive and printable — a narrow single column needs no breakpoint work.

## Reference implementation

```html
<section class="ledger" aria-label="Projects">
  <header class="ledger__head">
    <span class="ledger__col-num">#</span>
    <span class="ledger__col-name">Projects</span>
    <span class="ledger__col-meta">Year</span>
  </header>

  <ol class="ledger__rows">
    <li class="ledger__row">
      <span class="ledger__col-num">01</span>
      <a class="ledger__col-name" href="#">Grandlala</a>
      <span class="ledger__col-meta">2024&ndash;Now</span>
    </li>
    <li class="ledger__row">
      <span class="ledger__col-num">02</span>
      <a class="ledger__col-name" href="#">Career.io</a>
      <span class="ledger__col-meta">2021&ndash;22</span>
    </li>
    <!-- repeat rows -->
  </ol>
</section>

<style>
  .ledger {
    max-width: var(--container-content);
    margin-inline: auto;
    font-family: var(--font-mono);
    font-weight: var(--weight-bold);
    color: var(--color-fg);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }

  /* same 3-column track for header and every row -> columns line up */
  .ledger__head,
  .ledger__row {
    display: grid;
    grid-template-columns: var(--space-7) 1fr max-content;
    column-gap: var(--space-4);
    align-items: baseline;
    padding-block: var(--space-1);
    border-bottom: 1px solid var(--color-rule, var(--color-fg));
  }

  .ledger__head { font-size: var(--text-xs); }   /* column labels read as captions */
  .ledger__row  { font-size: var(--text-base); }

  .ledger__rows { list-style: none; margin: 0; padding: 0; }
  .ledger__col-meta { justify-self: end; }       /* meta hugs the right edge */
  .ledger__col-name { text-decoration: none; color: inherit; }
  .ledger__col-name:hover,
  .ledger__col-name:focus-visible { background: var(--color-fg); color: var(--color-bg); }
</style>
```
