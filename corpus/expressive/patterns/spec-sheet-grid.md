---
pattern: spec-sheet-grid
from: machine-consciousness
corpus: expressive
safety: production-safe
tags: [section, layout, brutalist, editorial, pricing, program]
---

## What it is
A content section framed like a page from a technical spec sheet or printed conference program: a small bracketed all-caps **machine label** (`[PROGRAM]`, `[TICKETING]`, `[THE VENUE]`) introduces the block, and the content sits in an explicit **hairline-ruled cell matrix** — no card fills, no shadows, no rounded corners. The visible 1px grid *is* the styling. Use it to organize dense, list-like content (program structure, pricing tiers, sponsor levels, schedules, spec tables) so it reads as a rigorous document rather than a marketing page.

## Why it works
Hierarchy and order come from structure, not decoration: the bracket label signals "section / field name" the way a form or datasheet does, and the shared grid lines visually bind heterogeneous content into one honest table. Because every cell is just a border + label + value, the pattern stays flat and legible at high density and costs almost nothing (no images, no color, one typeface). It's the opposite of the shadowed-card default — cheaper, calmer, and it scales to far more rows.

## Reference implementation
```html
<section class="spec">
  <p class="spec__label">[Program]</p>
  <div class="spec__grid">
    <article class="spec__cell">
      <span class="spec__idx">01.</span>
      <h3 class="spec__title">Foundational theory</h3>
      <p class="spec__body">What is consciousness, and can it be built?</p>
    </article>
    <article class="spec__cell">
      <span class="spec__idx">02.</span>
      <h3 class="spec__title">Technical implementation</h3>
      <p class="spec__body">How can conscious systems be built?</p>
    </article>
    <article class="spec__cell">
      <span class="spec__idx">03.</span>
      <h3 class="spec__title">Ethics &amp; society</h3>
      <p class="spec__body">What follows if machines can be conscious?</p>
    </article>
    <article class="spec__cell">
      <span class="spec__idx">04.</span>
      <h3 class="spec__title">Art &amp; experiences</h3>
      <p class="spec__body">How do we make artificial consciousness legible?</p>
    </article>
  </div>
</section>

<style>
  .spec {
    background: var(--bg, #f0f1f1);
    color: var(--fg, #1e1e1e);
    padding: var(--space-80, 80px) var(--page-inset, 64px);
    font-family: var(--font, "Questrial", sans-serif);
  }
  .spec__label {
    text-transform: uppercase;
    letter-spacing: var(--track-label, -0.5px);
    font-size: var(--text-sm, 0.875rem);
    color: var(--muted, #5f5e5e);
    margin: 0 0 var(--space-24, 24px);
  }
  /* The grid IS the design: a single hairline color, collapsed borders */
  .spec__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    border: var(--hairline-w, 1px) solid var(--hairline, #1e1e1e);
    /* gap left at 0 so cell borders share edges like a table */
  }
  .spec__cell {
    border: var(--hairline-w, 1px) solid var(--hairline, #1e1e1e);
    margin: calc(-1 * var(--hairline-w, 1px)); /* collapse shared edges */
    padding: var(--space-32, 32px);
    border-radius: 0;            /* sharp corners — structural radius is 0 */
    background: transparent;     /* no fill */
    box-shadow: none;            /* no elevation — borders only */
  }
  .spec__idx {
    display: block;
    font-size: var(--text-sm, 0.875rem);
    color: var(--muted, #5f5e5e);
    margin-bottom: var(--space-16, 16px);
  }
  .spec__title {
    font-size: var(--text-h4, 2.25rem);
    font-weight: 400;            /* scale, not weight, carries hierarchy */
    letter-spacing: var(--track-heading, -0.05em);
    line-height: 1.2;
    margin: 0 0 var(--space-8, 8px);
  }
  .spec__body {
    font-size: var(--text-base, 1rem);
    line-height: 1.5;
    color: var(--muted, #5f5e5e);
    max-width: 38ch;
    margin: 0;
  }
  @media (max-width: 640px) {
    .spec { padding: var(--space-48, 48px) var(--space-24, 24px); }
    .spec__grid { grid-template-columns: 1fr; }
  }
</style>
```

Notes: keep it to **one typeface** and let size do the work; use a **single hairline color** for every rule; never add a shadow or fill — the moment you do, it stops reading as a spec sheet. The negative-margin trick collapses shared cell edges into single 1px lines (a real table or `border-collapse` works too). Pairs naturally with `serial-id-marquee` and an in-view fade-rise reveal (IntersectionObserver + a `transform/opacity` transition, reduced-motion-guarded).
