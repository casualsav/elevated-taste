---
pattern: alternating-canvas-bento
from: vanta
corpus: production
safety: production-safe
tags: [feature-section, bento, platform, brand-experience]
---

## What it is
A feature/platform section built as a **full-bleed colored band** that wraps a uniform-shelled bento grid. Every tile shares one radius, padding, and surface, but each tile's *contents* are a different mini-UI (a status card, a heat-map matrix, a vendor table, a framework grid). Stacking several of these bands in different canvas colors (light → dark → tinted) "chapters" a long page without any dividers.

## Why it works
Two mechanisms working together. (1) **Uniform frame, heterogeneous fill:** the eye learns the tile shell once and then reads wildly different contents as a single coherent "set" — so a platform can show breadth (six different capabilities, six different UIs) without looking chaotic. The discipline is that only the *contents* vary; the frame tokens are locked. (2) **Canvas-as-chapter-marker:** wrapping each section in its own full-bleed background color (and switching light/dark between sections) signals "new chapter" with zero ornament, letting whitespace + color do the sectioning that dividers and shadows usually do. Transfers to any "all-in-one platform" pitch and to any long landing page that needs rhythm. The dark-band variant doubles as an enterprise/security block.

## Reference implementation
```html
<!-- Band 1: light canvas -->
<section class="band band--light">
  <header class="band__head">
    <h2 class="band__title">It's all here</h2>
    <p class="band__lede">Compliance, risk, and proof. All in one platform.</p>
  </header>

  <div class="bento">
    <article class="tile">
      <h3 class="tile__title">Compliance</h3>
      <p class="tile__body">Get and stay compliant with continuous monitoring.</p>
      <div class="tile__ui" aria-hidden="true"><!-- distinct mini-UI per tile --></div>
    </article>
    <article class="tile">
      <h3 class="tile__title">Risk</h3>
      <p class="tile__body">See and manage risk in one place.</p>
      <div class="tile__ui" aria-hidden="true"></div>
    </article>
    <article class="tile">
      <h3 class="tile__title">Third-Party Risk</h3>
      <p class="tile__body">Stay on top of vendor risk.</p>
      <div class="tile__ui" aria-hidden="true"></div>
    </article>
  </div>
</section>

<!-- Band 2: dark canvas — same shell, different chapter -->
<section class="band band--dark">
  <header class="band__head">
    <h2 class="band__title">Built for you</h2>
  </header>
  <!-- reuse .bento / .tile here -->
</section>

<style>
  .band {
    /* full-bleed colored band = the chapter marker; switch this per section */
    width: 100%;
    padding-block: var(--space-9);
    padding-inline: var(--space-5);
  }
  .band--light { background: var(--color-surface-2); color: var(--color-fg); }
  .band--dark  { background: var(--color-fg);        color: var(--color-bg); } /* invert: dark chapter */

  .band__head { max-width: var(--container-md); margin: 0 auto var(--space-7); text-align: center; }
  .band__title {
    font-family: var(--font-serif);              /* serif display ties bands to the hero */
    font-size: var(--text-2xl);
    font-weight: var(--weight-regular);
    line-height: var(--leading-snug);
    letter-spacing: var(--tracking-tight);
    margin: 0 0 var(--space-3);
  }
  .band__lede {
    font-family: var(--font-sans);
    font-size: var(--text-base);
    line-height: var(--leading-normal);
    color: var(--color-muted);
    margin: 0;
  }

  .bento {
    display: grid;
    grid-template-columns: repeat(3, 1fr);       /* equal cols = "set", not "list" */
    gap: var(--space-5);
    max-width: var(--container-xl);
    margin-inline: auto;
  }
  .tile {
    /* LOCKED frame — only the contents below should vary tile to tile */
    background: var(--color-bg);
    border: 1px solid var(--color-border);       /* hairline; separation is canvas color, not shadow */
    border-radius: var(--radius-lg);
    padding: var(--space-5);
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }
  .tile__title {
    font-family: var(--font-sans);
    font-size: var(--text-md);
    font-weight: var(--weight-semibold);
    color: var(--color-fg);
    margin: 0;
  }
  .tile__body {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    line-height: var(--leading-normal);
    color: var(--color-muted);
    margin: 0;
  }
  .tile__ui {
    margin-top: var(--space-2);
    min-height: var(--space-10);
    border-radius: var(--radius-md);
    background: var(--color-surface);            /* swap for a real per-tile mini-UI */
  }

  @media (max-width: 1024px) { .bento { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 640px)  { .bento { grid-template-columns: 1fr; } }
</style>
```
Keep every `.tile` frame token identical — the "scan once, read many" effect breaks the moment radius/padding/surface drift per card. For the dark band, the `.tile` interior stays light here (cards float on the dark canvas); if you instead want dark tiles, remap `--color-bg`→dark surface and `--color-fg`→on-dark inside `.band--dark` and re-check that muted text holds 4.5:1. Alternate `band--light`/`band--dark`/tinted down the page to chapter it without dividers.
