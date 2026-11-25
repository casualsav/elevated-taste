---
pattern: mono-bracket-section-labels
from: lapa
corpus: production
safety: production-safe
tags: [navigation, editorial, kicker, typography]
---

## What it is
Section kickers set in a **monospace companion face inside literal brackets** — `[ NAV ]`, `[ ABOUT ]`, `[ OUR APPS ]`. A tiny, all-uppercase, wide-tracked label that marks each region of the page instead of a heavyweight heading. Pair it against a round display grotesque so the mono/geometric contrast does visible work.

## Why it works
It buys structure and *voice* for almost nothing. The brackets + monospace read as a technical document or engineering log, which gives a brand a precise, made-by-people register without adding type sizes or color. Because the label is small and constant, it becomes a rhythm the eye learns — wayfinding by repetition. The mechanism is **typeface-contrast hierarchy**: a second face used only for micro-labels separates "signpost" from "content" more cleanly than a size or weight step in a single family. Transfers to any editorial, dev-tool, agency, or portfolio layout.

## Reference implementation
```html
<section>
  <p class="kicker">[ Our apps ]</p>
  <h2 class="section-title">Software for creativity, culture and commerce.</h2>
  <!-- … section content … -->
</section>

<style>
  .kicker {
    font-family: var(--font-mono);          /* e.g. "Suisse Intl Mono", ui-monospace */
    font-size: var(--text-sm);               /* ~0.875rem */
    font-weight: 400;
    letter-spacing: var(--tracking-wide);    /* mono labels read better slightly opened */
    text-transform: uppercase;
    color: var(--color-fg);
    margin: 0 0 var(--space-3);
  }
  /* Brackets as generated content so the label text stays clean/translatable */
  .kicker::before { content: "[ "; }
  .kicker::after  { content: " ]"; }

  .section-title {
    font-family: var(--font-sans);           /* the display grotesque */
    font-size: var(--text-3xl);
    font-weight: 400;                         /* hierarchy from scale, not weight */
    letter-spacing: var(--tracking-tight);    /* tighten as size grows */
    line-height: 1.05;
    color: var(--color-fg);
    margin: 0;
  }
</style>
```
