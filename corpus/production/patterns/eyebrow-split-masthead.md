---
pattern: eyebrow-split-masthead
from: thrad
corpus: production
safety: production-safe
tags: [feature-section, hero, header]
---

## What it is
A section masthead built as a two-column split over a warm tinted band: a tiny eyebrow (a filled accent square + an uppercase caption label) sits above a large, *light-weight* display headline on the left, while the supporting lede is pushed to a separate far-right column that starts around the 60% line. No card, no divider, no shadow — the band's background value separates it from its neighbors. It's the repeating header Thrad uses for "What we do", "Platform", "Testimonials".

## Why it works
Splitting headline and lede into left/right columns (rather than stacking them centered) gives the eye two fixed landing zones and lets the headline grow huge without shoving the body copy down — the whitespace gutter between them does the separating. Hierarchy comes from the ~3× scale jump and tight negative tracking on a 300–400 weight, so the headline is dominant without being heavy. The accent square is a 4px wayfinding mark that ties every section header to the brand's single accent at near-zero cost. Swapping the section's background tint (page / secondary / sunken) instead of adding rules keeps a long page calm.

## Reference implementation
```html
<style>
  .masthead {
    background: var(--color-surface, #f2ede9);     /* swap tint per section: page / secondary / sunken */
    padding-block: var(--space-9);
  }
  .masthead__inner {
    inline-size: min(100% - 2 * var(--space-7), var(--container-xl));
    margin-inline: auto;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: var(--space-6);
  }
  @media (min-width: 810px) {
    .masthead__inner {
      grid-template-columns: 57fr 29fr;            /* headline left, lede pushed right */
      column-gap: var(--space-8);
      align-items: start;
    }
    .masthead__lede { grid-column: 2; align-self: end; }
  }

  .eyebrow {
    display: inline-flex; align-items: center; gap: var(--space-2);
    font: var(--weight-medium) var(--text-sm) / var(--leading-normal) var(--font-sans);
    letter-spacing: 0.04em; text-transform: uppercase; color: var(--color-fg);
    margin-block-end: var(--space-5);
  }
  .eyebrow::before {
    content: ""; inline-size: 10px; block-size: 10px;
    background: var(--color-accent); border-radius: 2px;
  }

  .masthead__title {
    font: var(--weight-regular) clamp(2rem, 4vw, 2.5rem) / 1.05 var(--font-sans);
    letter-spacing: -0.06em;                       /* tighten optically at display size */
    color: var(--color-fg);
    text-wrap: balance;
    max-inline-size: 18ch;
  }
  .masthead__lede {
    font: var(--weight-regular) var(--text-lg) / var(--leading-normal) var(--font-sans);
    letter-spacing: -0.03em;
    color: var(--color-muted);
    max-inline-size: 42ch;
  }
</style>

<section class="masthead">
  <div class="masthead__inner">
    <div>
      <span class="eyebrow">What we do</span>
      <h2 class="masthead__title">We build the infrastructure for conversational advertising</h2>
    </div>
    <p class="masthead__lede">
      Thrad connects advertisers and AI publishers through a high-performance engine
      that monitors prompts, evaluates intent, and deploys the most relevant ads in milliseconds.
    </p>
  </div>
</section>
```
