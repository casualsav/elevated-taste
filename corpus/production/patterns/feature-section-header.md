---
pattern: feature-section-header
from: linear
corpus: production
safety: production-safe
tags: [feature-section, marketing, product-page]
---

## What it is
A two-column section header that repeats above every feature block on a long landing page: an oversized heading on the left, and on the right a short (1–3 line) muted description followed by a tiny numbered/labelled link. Below it sits the section's visual (typically a full-bleed product screenshot). On narrow viewports the two columns stack to one.

## Why it works
Reusing a single header geometry down the whole page converts a stack of unrelated sections into a perceivable *system* — the eye learns the rhythm and trusts the page. The hierarchy is built from **scale contrast in one weight** (big heading vs small body) plus **value contrast** (bright fg vs muted description), not from bolding or color, so each header stays calm even when the heading is large. The numbered link gives a consistent, low-emphasis "go deeper" affordance without competing with the heading.

## Reference implementation
```html
<style>
  .feature-header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-6);
    align-items: start;
    max-width: var(--container-lg);
    margin-inline: auto;
    padding-block: var(--space-9) var(--space-6); /* big top break, smaller before visual */
    padding-inline: var(--space-6);
  }
  .feature-header__title {
    font-family: var(--font-sans);
    font-size: var(--text-4xl);          /* the scale jump does the work */
    font-weight: var(--weight-medium);   /* NOT bold — emphasis is from size */
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight); /* tighten only at display sizes */
    color: var(--color-fg);
    margin: 0;
  }
  .feature-header__aside {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
    padding-top: var(--space-2);         /* optically align with cap height */
  }
  .feature-header__desc {
    font-size: var(--text-base);
    line-height: var(--leading-normal);
    color: var(--color-muted);          /* muted = recedes behind the title */
    margin: 0;
    max-width: 42ch;
  }
  .feature-header__link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    color: var(--color-fg);
    text-decoration: none;
  }
  .feature-header__link::before {       /* the small ordinal label */
    content: attr(data-index);
    font-family: var(--font-mono);
    color: var(--color-subtle);
  }
  @media (max-width: 768px) {
    .feature-header { grid-template-columns: 1fr; gap: var(--space-4); }
  }
</style>

<header class="feature-header">
  <h2 class="feature-header__title">Define the product direction</h2>
  <div class="feature-header__aside">
    <p class="feature-header__desc">
      Plan and navigate from idea to launch. Align your team with product
      initiatives, strategic roadmaps, and clear, up-to-date docs.
    </p>
    <a class="feature-header__link" data-index="2.0" href="#plan">Plan &rarr;</a>
  </div>
</header>
<!-- The section's full-bleed product visual follows here -->
```
