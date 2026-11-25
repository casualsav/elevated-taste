---
pattern: dark-bento-grid
from: clerk
corpus: production
safety: production-safe
tags: [feature-section, bento, card-grid, dark, integrations]
---

## What it is

A grid of feature cells laid on a near-black band (`#131316`), where each cell is a slightly raised dark surface (`#212126`) and the dividers between cells are **near-invisible hairlines** (~5-6% white). Each cell pairs a short title + muted description with a small piece of product UI, an icon, or a monochrome logo. Clerk uses it for "Everything you need for authentication" (a mixed 3-up / wide layout) and for the "Build with SDKs / Integrate with the tools you love" logo grids. The defining choice is the *barely-there* borders: structure you feel more than see.

## Why it works

A dark band signals "this is a primary, weighty part of the page" via surface inversion alone (no heavier type needed). Inside it, a dense feature list would normally turn into a busy table if you drew solid borders — so dropping divider opacity to the 5-8% range keeps the whole band reading as one calm field while still chunking content into scannable cells. The faint raise on each cell (`surface-dark` over `bg-dark`) does the separating that the border deliberately won't. Holding product-UI snippets or monochrome logos in the cells keeps the proof concrete without color noise. Transferable to any dense feature, integration, or capability section that must stay legible and calm on a dark surface — pair the band with the notched-section-transition to enter and exit it.

## Reference implementation

```html
<style>
  .dbento {
    background: var(--color-bg-dark);
    color: var(--color-fg-on-dark);
    padding-block: var(--space-9);
    padding-inline: var(--space-6);
  }
  .dbento__inner {
    max-width: var(--container-xl);
    margin-inline: auto;
  }
  .dbento__grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-5);
  }
  .dbento__cell {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    padding: var(--space-6);
    border-radius: var(--radius-lg);
    background: var(--color-surface-dark);
    /* the hairline: felt, not seen */
    border: 1px solid var(--color-border-on-dark);
  }
  .dbento__cell--wide { grid-column: span 2; }

  .dbento__title {
    font-family: var(--font-sans);
    font-size: var(--text-md);
    color: var(--color-fg-on-dark);
  }
  .dbento__desc {
    font-size: var(--text-sm);
    line-height: var(--leading-normal);
    color: var(--color-muted-on-dark);
  }
  .dbento__media {                 /* product snippet / icon / logo lives here */
    margin-top: var(--space-2);
    aspect-ratio: 16 / 9;
    border-radius: var(--radius-md);
    background: var(--color-surface-dark-2);
  }

  @media (max-width: 64rem) { .dbento__grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 40rem) {
    .dbento__grid { grid-template-columns: 1fr; }
    .dbento__cell--wide { grid-column: span 1; }
  }
</style>

<section class="dbento">
  <div class="dbento__inner">
    <div class="dbento__grid">
      <article class="dbento__cell">
        <h3 class="dbento__title">Multi-factor auth</h3>
        <p class="dbento__desc">TOTP, SMS, and passkeys with zero extra wiring.</p>
        <div class="dbento__media"><!-- product UI snippet --></div>
      </article>
      <article class="dbento__cell dbento__cell--wide">
        <h3 class="dbento__title">Session management</h3>
        <p class="dbento__desc">Active devices, revocation, and refresh handled for you.</p>
        <div class="dbento__media"></div>
      </article>
      <!-- repeat .dbento__cell to fill the grid -->
    </div>
  </div>
</section>
```
