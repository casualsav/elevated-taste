---
pattern: oversized-index-row-list
from: domaineworldwide
corpus: production
safety: production-safe
tags: [editorial, feature-section, data-table, footer, list]
---

## What it is
A short dataset — office locations, open roles, chapters, an awards list — rendered **not as a table or cards but as a stack of display-scale text rows**. Each row is one full-width line: a large name on the left (with a small tracked-mono superscript qualifier, e.g. a country code), and a right-aligned metadata column holding a secondary value (a live local clock, a count, a date, an arrow). Rows are divided only by hairline rules. The oversized type makes a plain list read as a confident editorial statement; the right rail keeps it informative.

## Why it works
The move is **promoting list items to display type and letting the baseline grid do the structuring**. At 40–80px, a seven-item list becomes a section-sized design element — no photos, no boxes, no color needed — which is exactly the economy a monochrome, one-weight system wants. The row stays legible because three cheap devices split the two data fields: horizontal justification (name left / meta right via `justify-content: space-between`), a **register shift** for secondary data (small tracked mono vs large grotesque name), and a single **hairline** between rows instead of a filled divider. The superscript qualifier adds a third data point without a third column. Because it's just flex rows, it reflows trivially and stays accessible as real text. Transfers to location/office lists, a careers index, a discography/filmography, an awards ledger, a sitemap footer — any small set where you want presence over density.

## Reference implementation
```html
<!-- framework-neutral; var(--token) names from /tokens, no magic numbers -->
<style>
  .index-list { max-width: var(--container-xl); margin-inline: auto; }

  .index-list__row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-4);
    padding-block: var(--space-4);
    border-top: 1px solid var(--color-hairline);
  }
  .index-list__row:last-child { border-bottom: 1px solid var(--color-hairline); }

  /* the loud half: display-scale name */
  .index-list__name {
    font-size: clamp(var(--text-3xl), 6vw, var(--text-5xl));
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-display);
    color: var(--color-fg);
  }
  /* small tracked-mono qualifier riding as a superscript */
  .index-list__name sup {
    font-family: var(--font-mono, "Suisse Intl Mono", monospace);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-caps);
    color: var(--color-muted);
    margin-inline-start: var(--space-1);
    vertical-align: super;
  }
  /* the quiet half: right-aligned metadata (clock / count / date) */
  .index-list__meta {
    font-family: var(--font-mono, "Suisse Intl Mono", monospace);
    font-size: var(--text-sm);
    letter-spacing: var(--tracking-caps);
    color: var(--color-muted);
    white-space: nowrap;
  }

  @media (max-width: 640px) {
    .index-list__name { font-size: var(--text-2xl); }
  }
</style>

<ul class="index-list" role="list">
  <li class="index-list__row">
    <span class="index-list__name">New York City <sup>US</sup></span>
    <span class="index-list__meta">10:45</span>
  </li>
  <li class="index-list__row">
    <span class="index-list__name">London <sup>UK</sup></span>
    <span class="index-list__meta">15:45</span>
  </li>
  <li class="index-list__row">
    <span class="index-list__name">Berlin <sup>DE</sup></span>
    <span class="index-list__meta">16:45</span>
  </li>
</ul>
```

Notes: a live clock in `.index-list__meta` is the only JS — update it with a per-row timezone (`Intl.DateTimeFormat('en', { timeZone, hour: '2-digit', minute: '2-digit' })`) on a 30s interval; everything else is static CSS. Keep each row's clickable target the full row height (≥44px) if rows are links — this pattern's big type makes that easy.
