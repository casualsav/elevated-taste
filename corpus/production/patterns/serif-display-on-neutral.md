---
pattern: serif-display-on-neutral
from: round
corpus: production
safety: production-safe
tags: [section-header, hero, editorial]
---

## What it is
A section/hero header built from three stacked elements on an achromatic page: a tiny tracked uppercase eyebrow in the accent color, a large **serif** display headline whose lead clause is full-strength `fg` and trailing clause drops to `muted`, and a short sans body line. The two-tone serif sentence is the signature move.

## Why it works
Hierarchy is created by **typeface and color within one line**, not by stacking multiple sizes/weights. The serif against an otherwise all-sans, all-grayscale page reads as "editorial / considered," letting the headline stay near-regular weight and calm. Greying the trailing clause encodes a primary idea + a secondary qualifier in a single typographic gesture — cheaper and quieter than a sub-headline. The accent eyebrow is the only color, so it reliably signals brand/section without competing. Transfers to any content-led B2B or product section intro.

## Reference implementation
```html
<section class="sds">
  <p class="sds__eyebrow">Tools &amp; Integrations</p>
  <h2 class="sds__title">
    Connect with tools, just by asking.
    <span class="sds__title--soft">No more API key copying.</span>
  </h2>
  <p class="sds__lede">
    Round integrates with the tools and data across your enterprise —
    so workflows can span teams, systems, and handoffs end to end.
  </p>
</section>

<style>
  .sds {
    max-width: var(--container-md);
    margin-inline: auto;
    padding-block: var(--space-9);
    text-align: center;
  }
  .sds__eyebrow {
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--color-accent);
    margin: 0 0 var(--space-4);
  }
  .sds__title {
    font-family: var(--font-serif);          /* serif display is the hierarchy device */
    font-size: var(--text-4xl);
    font-weight: var(--weight-regular);       /* size carries it; weight stays calm */
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--color-fg);
    margin: 0 auto;
    max-width: var(--container-content);
    text-wrap: balance;
  }
  .sds__title--soft { color: var(--color-muted); }   /* trailing clause = secondary idea */
  .sds__lede {
    font-family: var(--font-sans);
    font-size: var(--text-base);
    line-height: var(--leading-normal);
    color: var(--color-muted);
    max-width: var(--container-content);
    margin: var(--space-5) auto 0;
  }
  @media (max-width: 640px) {
    .sds__title { font-size: var(--text-3xl); }
  }
</style>
```
Requires a `--font-serif` token (a transitional/old-style serif). Subset the serif to display weights + latin to keep the extra font cheap. Add a scrim if placed over a photographic background to hold contrast.
