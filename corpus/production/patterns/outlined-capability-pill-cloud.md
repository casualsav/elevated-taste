---
pattern: outlined-capability-pill-cloud
from: public
corpus: production
safety: production-safe
tags: [feature-section, hero, taxonomy, pills, breadth]
---

## What it is
A centered, horizontally-wrapping cloud of hairline-bordered chips that enumerates a product's full range — every asset class, integration, capability, or supported item — as one calm, scannable block. No icons, no descriptions, no grid lines: just short labels in pills, flowing across the available width and stacking naturally on narrow viewports. Public uses it directly under the hero to say "you can trade/hold all of this here" (Stocks · Bonds · Treasuries · Options · Crypto · ETFs · IRAs · Agents · API …).

## Why it works
Breadth is hard to communicate without a wall of copy or a sprawling feature grid. A pill cloud turns "we support N things" into a single visual whose *size and density* is the message — the reader doesn't count the chips, they feel the range. Hairline borders (not fills, not shadows) keep it quiet enough to sit right under a headline without competing, and the flow layout means it's intrinsically responsive: the same markup reads as 4 rows on desktop and 8 on mobile with zero breakpoints. Because each chip is just text in a bordered box, it scales to any count and any content domain — assets, file formats, languages, integrations, locations.

## Why it works (mechanism)
`display:flex; flex-wrap:wrap; justify-content:center` does all the layout; the chips never need fixed widths or columns. Affordance and rhythm come from one shared pill shape (`border-radius: var(--radius-pill)`) and one border token, so a heterogeneous list looks like a single system. Optionally a few chips carry a trailing micro-label (e.g. a yield "5.58%") in the muted/data role to add signal without breaking the shape language.

## Reference implementation
```html
<style>
  .pill-cloud {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-3);                 /* 12px */
    max-width: 56rem;
    margin-inline: auto;
    padding-block: var(--space-7);       /* ~56px */
  }
  .pill-cloud__chip {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);                 /* 8px */
    padding: var(--space-2) var(--space-4);   /* 8px 16px */
    border: 1px solid var(--color-border);    /* hairline, not a fill/shadow */
    border-radius: var(--radius-full);        /* 999px */
    font-family: var(--font-sans);
    font-size: 1rem;
    color: var(--color-fg);
    white-space: nowrap;                 /* a chip never wraps mid-label */
    transition: border-color var(--duration-fast) var(--ease-standard),
                color var(--duration-fast) var(--ease-standard);
  }
  /* optional trailing figure uses the data/numeral role */
  .pill-cloud__chip small {
    font-family: var(--font-mono);
    color: var(--color-muted);
  }
  .pill-cloud__chip:hover { border-color: var(--color-fg); }
  @media (prefers-reduced-motion: reduce) {
    .pill-cloud__chip { transition: none; }
  }
</style>

<ul class="pill-cloud">
  <li class="pill-cloud__chip">Stocks</li>
  <li class="pill-cloud__chip">Bonds</li>
  <li class="pill-cloud__chip">Treasuries</li>
  <li class="pill-cloud__chip">Options</li>
  <li class="pill-cloud__chip">Crypto</li>
  <li class="pill-cloud__chip">ETFs</li>
  <li class="pill-cloud__chip">High-Yield Cash <small>3.30% APY</small></li>
  <li class="pill-cloud__chip">IRAs</li>
  <li class="pill-cloud__chip">Agents</li>
  <li class="pill-cloud__chip">API</li>
</ul>
```
