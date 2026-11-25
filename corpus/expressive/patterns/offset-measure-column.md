---
pattern: offset-measure-column
from: noma
corpus: expressive
safety: production-safe
tags: [editorial, long-form, layout, grid, hero]
---

## What it is

A long piece of prose — a letter, a manifesto, an About page — set at a **narrow measure (~45ch) with very loose leading (1.8)**, and placed **off-center** on a wide grid, with photography breaking full-bleed above and below it. It is the opposite of the centered `max-width: 720px` article: the column occupies 4 of 14 tracks starting at track 6, so the empty space to its left is a compositional element, not a leftover margin.

The odd column count is the whole trick. On a 12-column grid every "interesting" offset lands on a half, third or quarter and reads as a stock layout. **14 (or 13, or 11)** has no clean subdivisions, so `6 / span 4` sits somewhere the eye cannot name — which is exactly why it looks placed by a person.

## Why it works

Three mechanisms compound:

1. **Short measure + loose leading buys reading stamina.** ~45 characters and a 1.8 line box means the eye's return sweep is short and unambiguous; 900 words stop looking like a wall. The cost — a very tall column — is paid in scroll, which is free.
2. **Asymmetry converts whitespace into composition.** A centered column with equal gutters reads as "the text is as wide as it can be." An offset column reads as "the text was put here," and the void beside it becomes a deliberate pause rather than an accident of `max-width`.
3. **Full-bleed images reset the rhythm.** Alternating a hairline-free, edge-to-edge photograph with the narrow column gives the page a wide/narrow cadence, so the reader gets a breath without a decorative divider.

Collapse honestly at small viewports: the offset is meaningless below the point where the column would touch both edges, so drop to a single full-width track and let the measure be enforced by `max-width` alone.

## Reference implementation

```html
<main class="editorial">
  <figure class="bleed">
    <img src="/plate.jpg" alt="Wild artichokes and sea buckthorn on a ceramic plate" />
  </figure>

  <div class="letter">
    <h2 class="letter-title">Copenhagen 2026:<br />We're coming home</h2>
    <p>Friends,</p>
    <p>We're approaching the end of our time in Los Angeles.</p>
    <p>For the past few months, the team has been focused on sharing what we created here.</p>
  </div>

  <figure class="bleed">
    <img src="/team.jpg" alt="The full kitchen and floor team gathered around a courtyard pool" />
  </figure>
</main>

<style>
  .editorial {
    --site-grid: repeat(14, 1fr);
    display: grid;
    grid-template-columns: var(--site-grid);
    gap: var(--space-5);
    max-width: var(--page-max, 120rem);
    margin-inline: auto;
    padding-inline: var(--space-6);
    background-color: var(--color-bg);
    color: var(--color-fg);
  }

  /* Off-center by construction: track 6 of 14, four tracks wide. */
  .letter {
    grid-column: 6 / span 4;
    padding-block: var(--space-9);
  }

  .letter-title {
    font-size: clamp(var(--text-xl), 0.25rem + 3.2vw, var(--text-3xl));
    font-weight: var(--weight-regular);
    letter-spacing: var(--tracking-heading);
    line-height: var(--leading-snug);
    margin: 0 0 var(--space-6);
  }

  .letter p {
    max-width: var(--measure, 45ch);   /* the measure, not the track, governs */
    font-size: var(--text-md);
    line-height: var(--leading-loose, 1.8);
    letter-spacing: var(--tracking-body);
    margin: 0 0 var(--space-5);
  }

  /* Break the grid: edge to edge, fixed frame, no card. */
  .bleed {
    grid-column: 1 / -1;
    margin-inline: calc(var(--space-6) * -1);
    margin-block: var(--space-8);
  }

  .bleed img {
    display: block;
    width: 100%;
    aspect-ratio: 3 / 2;
    object-fit: cover;
    border-radius: 0;   /* a plate, not a component */
  }

  /* Fewer tracks, then none — the offset stops meaning anything when narrow. */
  @media (max-width: 75em) {
    .letter { grid-column: 3 / span 8; }
  }

  @media (max-width: 45em) {
    .editorial { --site-grid: repeat(6, 1fr); gap: var(--space-4); padding-inline: var(--space-4); }
    .letter { grid-column: 1 / -1; padding-block: var(--space-7); }
    .letter p { line-height: var(--leading-relaxed); }  /* 1.8 is too airy on a phone */
    .bleed { margin-inline: calc(var(--space-4) * -1); }
  }
</style>
```

**Tuning:** if 45ch feels cramped for your typeface, move the measure before you move the leading — the two trade off, and a wide measure at 1.8 leading loses the line more easily than a narrow one at 1.6. Keep the image's `aspect-ratio` declared so the full-bleed frames never shift layout while loading.
