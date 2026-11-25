---
pattern: labeled-color-block-mosaic
from: varda
corpus: expressive
safety: production-safe
trigger: hover
tags: [feature-section, layout, navigation, grid, motion]
---

## What it is
The page body is a grid of edge-to-edge, full-bleed colored tiles that butt against each other with no gaps and no dividers. Each tile is one idea, color-blocked (navy / accent / light / duotone-photo) so the color *is* the section break. Every tile carries the same affordance: a small-caps eyebrow label top-left and a ↗ corner arrow top-right, with the whole tile acting as one link that inverts its colors on hover.

## Why it works
Color-blocking does three jobs at once — it separates sections (no rules or shadows needed), establishes hierarchy (the eye parses one quarantined field at a time), and carries the brand (only brand hues appear). The repeated eyebrow+arrow becomes a learned "labeled destination" convention, so a dense grid stays self-navigating without buttons. Because each tile is a single anchor, it's keyboard-accessible and the hover/focus inversion gives a clear interactive signal. It scales: add a tile, span it across more columns, pick a palette member — the system absorbs it.

## Reference implementation
```html
<!-- 6-col mosaic; tiles span varying cols/rows. Tokens from /tokens. -->
<section class="mosaic" aria-label="Explore Varda">
  <a class="tile tile--accent" style="--cols:2; --rows:2" href="/platform">
    <span class="tile__eyebrow">Varda's Platform</span>
    <svg class="tile__arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" stroke="currentColor" stroke-width="2" fill="none"/></svg>
    <h3 class="tile__title">Built entirely in-house for orbital material processing and reentry</h3>
  </a>
  <a class="tile tile--ink" style="--cols:2; --rows:2" href="/mission"> … </a>
  <a class="tile tile--light" style="--cols:2" href="/government"> … </a>
</section>

<style>
  .mosaic {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 0;                              /* tiles butt edge-to-edge */
    max-width: 1120px; margin-inline: auto;
  }
  @media (max-width: 720px) { .mosaic { grid-template-columns: repeat(2, 1fr); } }

  .tile {
    grid-column: span var(--cols, 2);
    grid-row: span var(--rows, 1);
    position: relative;
    display: flex; flex-direction: column; justify-content: space-between;
    min-height: 16rem;
    padding: var(--space-4, 21px);
    text-decoration: none;
    transition: background var(--dur-2, 500ms) var(--ease, cubic-bezier(0.165,0.84,0.44,1)),
                color      var(--dur-2, 500ms) var(--ease, cubic-bezier(0.165,0.84,0.44,1));
  }
  .tile--ink    { background: var(--color-bg, #0A3065);    color: var(--color-accent, #E6813B); }
  .tile--accent { background: var(--color-accent, #E6813B); color: var(--color-bg, #0A3065); }
  .tile--light  { background: var(--color-surface, #EAECEE); color: var(--color-bg, #0A3065); }

  .tile__eyebrow { font-size: .82rem; font-weight: 500; letter-spacing: .04em; }
  .tile__arrow   { position: absolute; top: var(--space-4,21px); right: var(--space-4,21px); width: 1.1rem; height: 1.1rem; }
  .tile__title   { margin: 0; font-size: clamp(1.6rem, 3vw, 2.6rem); font-weight: 400; line-height: 1.05; letter-spacing: -.01em; }

  /* hover/focus = color inversion toward a lighter fill */
  .tile--ink:hover, .tile--ink:focus-visible       { background: #194480; }
  .tile--accent:hover, .tile--accent:focus-visible { background: #f0944f; }
  .tile--light:hover, .tile--light:focus-visible   { background: #ffffff; }
  .tile:focus-visible { outline: 2px solid var(--color-fg, #FAFCFF); outline-offset: -4px; }

  @media (prefers-reduced-motion: reduce) {
    .tile { transition: none; }       /* color still changes, just instantly */
  }
</style>
```

Notes: keep tile fills to brand-palette members only; the hover hue is a lightened sibling of the same color, never a new color. The whole tile is the link — don't nest separate `<a>`s inside. Verify each fg/bg pair clears WCAG AA (accent-on-navy headlines are large enough to pass at AA-large; small eyebrow text should ride the high-contrast member).
