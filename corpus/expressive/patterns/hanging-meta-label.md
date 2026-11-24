---
pattern: hanging-meta-label
from: ssense
corpus: expressive
safety: production-safe
tags: [editorial, typography, article-tile, blog, listing]
---

## What it is

An article tile whose category label (`Fashion`, `Music`, `Art`) sits **outside** the text column, hanging in the left margin beside the headline instead of stacked above it. On narrow viewports the label folds back inline above the headline. The headline's left edge never moves.

## Why it works

Metadata is secondary information competing for the primary alignment. Stack it above the headline and it becomes a false first line — the eye reads it before the thing it's labeling, and the headline's optical starting point drops. Hang it in the margin and the label becomes what it actually is: an annotation the eye picks up peripherally, on a column of its own, while the headline owns the text column's edge.

The mechanism is one line of print typography — a fixed-width box pulled left by exactly its own width (`width: W; margin-left: -W`) so it occupies no inline space. It costs nothing, requires no grid, and degrades to inline flow by simply dropping the negative margin at the breakpoint where the margin no longer exists.

Two rules make it hold up:
- **Reserve the gutter.** The hang only works if the column has margin to hang into — apply it at the breakpoint where your page margin exceeds the label width, not before.
- **Make the label a label.** Small, uppercase, muted, on the baseline of the headline's first line — not a badge, not a pill, no fill. A filled chip in the margin reads as an interface control; unfilled type reads as an annotation.

Transfers to blog indexes, changelog entries (hang the version), data tables (hang the row status), and docs sidenotes.

## Reference implementation

```html
<article class="tile">
  <a class="tile__link" href="#">
    <img class="tile__img" src="story.jpg" alt="Aydan Nix photographed in her bedroom" loading="lazy" decoding="async">
    <div class="tile__text">
      <span class="tile__label">Fashion</span>
      <h3 class="tile__headline">The Weird Prophetic Dreams of Aydan Nix</h3>
      <p class="tile__dek">Her life was upended last year when the tabloids revealed she was a half-sister to Gigi and Bella Hadid.</p>
    </div>
  </a>
</article>

<style>
  .tile__link { display: block; color: var(--color-fg); text-decoration: none; }

  .tile__img {
    width: 100%;
    aspect-ratio: 3 / 4;
    object-fit: cover;
    background: var(--color-surface);   /* holds the crop before the image resolves */
    display: block;
  }

  .tile__text { margin-top: var(--space-3); }

  /* Label: an annotation, not a badge. Serif + muted, so it reads as print marginalia. */
  .tile__label {
    display: block;
    font-family: var(--font-serif-editorial, "Times New Roman", Georgia, serif);
    font-size: var(--text-xs);
    line-height: var(--leading-snug);
    color: var(--color-muted);
    margin-bottom: var(--space-1);
  }

  .tile__headline {
    margin: 0;
    font-family: var(--font-sans);
    font-weight: var(--weight-light, 300);   /* hairline grotesque — only safe at this size and up */
    font-size: var(--text-2xl);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-heading);
    text-transform: uppercase;
  }

  .tile__dek {
    margin: var(--space-2) 0 0;
    font-family: var(--font-serif-editorial, "Times New Roman", Georgia, serif);
    font-size: var(--text-md);
    line-height: var(--leading-normal);
    color: var(--color-fg);
  }

  /* The hang. Only once the page margin is wide enough to receive it. */
  @media (min-width: 64rem) {
    .tile__label {
      --label-width: var(--space-9, 4.25rem);
      float: left;                       /* keeps the headline's first line on the same baseline */
      width: var(--label-width);
      margin-left: calc(-1 * var(--label-width));
      margin-bottom: 0;
      /* nudge onto the headline's cap-height baseline */
      padding-top: 0.35em;
    }
    .tile__headline { clear: none; }
  }
</style>
```

Two notes on porting:
- `float` is the right tool here, not absolute positioning: the label participates in the line box, so it aligns to the headline's first baseline automatically even when the headline wraps to three lines.
- If the tile can sit flush against the viewport edge (a full-bleed row), suppress the hang for that row — a label bleeding off-screen is worse than a stacked one.
