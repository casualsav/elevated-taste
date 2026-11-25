---
pattern: numbered-section-index
from: attio
corpus: production
safety: production-safe
tags: [feature-section, navigation, landing, docs]
---

## What it is
A long marketing or docs page is chaptered by giving each major section a small bracketed numeric eyebrow — `[01] Powerful platform`, `[02] Adaptive model`, `[03] Data enrichment`, `[04] Built for scale` — sitting above the section's heading. The index is a consistent, monospaced-feeling, muted micro-label; the number and the label share one line, with the number visually distinguished (bracketed, often the accent or a slightly bolder tone). Repeated down the page, the `[0X]` series reads as a table of contents the visitor is scrolling through.

## Why it works
A tall single-column scroll has no inherent sense of structure or progress — every section looks like "another section." A running ordinal turns the page into a *sequence*: the reader subconsciously tracks `01 → 02 → 03` and gets a felt sense of "how much story is left," the same wayfinding a chapter number gives a book. Because the device is tiny and muted, it adds structure without competing with the headline — hierarchy stays scale-driven. Bracketing (or zero-padding to `01`) signals "this is an index token, not body copy," which is why it reads as system rather than decoration. It also gives every section header a consistent skeleton, so a dense multi-feature page feels designed rather than accreted. Transfers to any feature tour, pricing tier walk-through, onboarding step list, or docs landing. Distinct from a two-column feature header (which is about layout) — this is purely the numeric spine, and the two compose well together.

## Reference implementation
```html
<style>
  .section-index {
    display: flex;
    align-items: baseline;
    gap: var(--space-3);
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);   /* small caps eyebrow tracks OPEN */
    text-transform: uppercase;
    color: var(--color-muted);
  }
  .section-index__num {
    color: var(--color-accent);             /* the ordinal is the one bit of color */
    font-variant-numeric: tabular-nums;     /* 01..09 stay aligned down the page */
  }
  .section-heading {
    margin-top: var(--space-4);
    font-size: var(--text-4xl);             /* display cluster: wide jump from eyebrow */
    font-weight: var(--weight-medium);      /* base weight is medium, not bold */
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);  /* tighten only at display size */
    color: var(--color-fg);
  }
</style>

<section>
  <p class="section-index">
    <span class="section-index__num">[01]</span>
    <span>Powerful platform</span>
  </p>
  <h2 class="section-heading">The revenue platform engineered for scale.</h2>
  <!-- section body / product visual follows -->
</section>

<section>
  <p class="section-index">
    <span class="section-index__num">[02]</span>
    <span>Adaptive model</span>
  </p>
  <h2 class="section-heading">A data model that bends to your business.</h2>
</section>
```

**Safety:** production-safe. Keep the index purely decorative-structural — never the *only* label for a section (the heading still carries the meaning), and don't wire scroll behavior to it without a real nav. Use `tabular-nums` so `01…09…10` stay aligned. For a11y the `[0X]` is ornamental; if it duplicates a real "step N of M" semantic, expose that with text or `aria-label` rather than relying on the bracket glyphs.
