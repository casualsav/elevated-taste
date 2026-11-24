---
pattern: feature-card-quad-grid
from: round
corpus: production
safety: production-safe
tags: [feature-grid, capabilities, bento]
---

## What it is
A 4-up (desktop) row of feature cards with a strict, repeated anatomy: an optional faint UI thumbnail / icon area on top, then a bold sans title, then a one-sentence muted body. Cards share one radius and a single hairline border — no drop shadows. Collapses to one column on mobile.

## Why it works
The eye learns the card anatomy once (eyebrow/visual → title → body) and then scans the rest of the grid effortlessly — **consistency is the legibility mechanism**, not styling per card. Hairline borders (instead of shadows) keep the surface flat and let embedded product screenshots be the only visual texture, fitting an achromatic, restraint-first system. Equal columns + shared radius read as a coherent "capability set" rather than a list. Transfers to any feature/capability matrix, integration list, or enterprise-features block.

## Reference implementation
```html
<section class="fcg">
  <article class="fcg__card">
    <div class="fcg__media" aria-hidden="true"></div>
    <h3 class="fcg__title">Agent orchestration</h3>
    <p class="fcg__body">Chain agents to run multi-step tasks across your tools.</p>
  </article>
  <article class="fcg__card">
    <div class="fcg__media" aria-hidden="true"></div>
    <h3 class="fcg__title">Operational visibility</h3>
    <p class="fcg__body">View agent actions, changes, and obstacles to build trust in automation.</p>
  </article>
  <article class="fcg__card">
    <div class="fcg__media" aria-hidden="true"></div>
    <h3 class="fcg__title">Continuous automation</h3>
    <p class="fcg__body">Run agents on schedules, track runs, and see status.</p>
  </article>
  <article class="fcg__card">
    <div class="fcg__media" aria-hidden="true"></div>
    <h3 class="fcg__title">Create custom trigger</h3>
    <p class="fcg__body">Launch agents per customer, across your base — every day or ad-hoc.</p>
  </article>
</section>

<style>
  .fcg {
    display: grid;
    grid-template-columns: repeat(4, 1fr);   /* equal columns = "set", not "list" */
    gap: var(--space-5);
    max-width: var(--container-xl);
    margin-inline: auto;
    padding-block: var(--space-9);
  }
  .fcg__card {
    border: 1px solid var(--color-border);   /* hairline, not shadow */
    border-radius: var(--radius-lg);
    background: var(--color-bg);
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }
  .fcg__media {
    aspect-ratio: 16 / 10;
    border-radius: var(--radius-md);
    background: var(--color-surface);        /* faint tile; swap for a UI screenshot */
  }
  .fcg__title {
    font-family: var(--font-sans);
    font-size: var(--text-md);
    font-weight: var(--weight-semibold);
    line-height: var(--leading-snug);
    color: var(--color-fg);
    margin: 0;
  }
  .fcg__body {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    line-height: var(--leading-normal);
    color: var(--color-muted);
    margin: 0;
  }
  @media (max-width: 1024px) { .fcg { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 640px)  { .fcg { grid-template-columns: 1fr; } }
</style>
```
Anatomy must stay identical across cards for the scan-once effect. The same shell works as a 2-up or as a dark-section variant (swap `--color-bg`→dark, `--color-fg`→on-dark) for an enterprise/security block.
