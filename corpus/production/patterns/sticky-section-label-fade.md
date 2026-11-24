---
pattern: sticky-section-label-fade
from: domaineworldwide
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [navigation, feature-section, editorial, layout, motion]
---

## What it is
A long section laid out as an **asymmetric two-column editorial grid** — a narrow label/meta rail on the left, a wide content column on the right. The left label (`SERVICES`, `INSIGHTS`, a kicker, a filter) is `position: sticky` so it stays pinned beside the content as you scroll through the block, then releases at the section's bottom edge. A background-colored gradient sits over the sticky label so it **dissolves into the page at its own top seam** instead of hard-clipping against whatever scrolls underneath it. The result is persistent, in-place wayfinding that needs no extra nav chrome.

## Why it works
Two mechanisms. First, the **asymmetric grid** (`1fr 2fr`, or more extreme `.25fr 1.5fr 2.75fr`) gives the label a column of its own without stealing width from the content — the eye reads "this whole river is *Services*" once and then just scans the content. Second, `position: sticky` is the cheapest possible pin: no JS, no scroll listener, no layout thrash — the browser keeps the label in view for exactly the span of its grid cell and drops it automatically. The **gradient fade** is the craft detail that sells it: a raw sticky element collides visually with content passing behind it; masking the label with `linear-gradient(bg 80%, transparent)` makes it read as part of the page surface, not a floating sticker. Transfers to docs sidebars, case-study chapters, pricing feature groups, any long block that benefits from a label staying put. Because it's pure CSS, it degrades perfectly and costs nothing on the main thread.

## Reference implementation
```html
<!-- framework-neutral; var(--token) names from /tokens, no magic numbers -->
<style>
  .editorial-block {
    display: grid;
    grid-template-columns: 1fr 2fr;   /* narrow label rail + wide content */
    gap: var(--space-6);
    max-width: var(--container-xl);
    margin-inline: auto;
    padding-inline: var(--space-5);
    align-items: start;               /* critical: lets the label cell be taller than content so sticky has room to travel */
  }

  .editorial-block__label {
    position: sticky;
    top: 0;
    z-index: 1;
    /* fade the label into the page at its sticky seam */
    background: linear-gradient(180deg, var(--color-bg) 80%, transparent);
    padding-block: var(--space-4);
    /* tracked mono eyebrow, in the house's label register */
    font-family: var(--font-mono, "Suisse Intl Mono", monospace);
    font-size: var(--text-sm);
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
    color: var(--color-fg);
  }

  .editorial-block__content { min-width: 0; }  /* allow the wide column to shrink below content size */

  @media (max-width: 768px) {
    .editorial-block { grid-template-columns: 1fr; gap: var(--space-4); }
    .editorial-block__label { position: static; }  /* no room to pin on one column — just a heading */
  }
</style>

<section class="editorial-block">
  <div class="editorial-block__label">Services</div>
  <div class="editorial-block__content">
    <!-- long content: paragraphs, a card grid, an index — the label rides alongside it -->
  </div>
</section>
```

Notes: the pin requires the label's grid cell to be *taller* than the label itself — that's what `align-items: start` + a tall content column provides. No `prefers-reduced-motion` guard is needed because sticky is positional, not animated; if you add a transition on the label (e.g. a size change at the seam), wrap it in `@media (prefers-reduced-motion: reduce) { transition: none; }`.
