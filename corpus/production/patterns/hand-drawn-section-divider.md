---
pattern: hand-drawn-section-divider
from: sentry
corpus: production
safety: production-safe
tags: [footer, navigation, brand-experience, layout, divider]
---

## What it is
A horizontal rule that separates two stacked blocks (here the footer link grid from the legal/social row) drawn as a hand-wobbled **squiggle** — a low-amplitude, slightly irregular sine/zig-zag — instead of a 1px straight line. It is a single tiling SVG stroke spanning the full content width, in a muted on-surface color, on an otherwise rigorously gridded dark UI. No fill, no box, no JS.

## Why it works
On a systematic page (8px grid, geometric sans, hairline borders) the *imperfection* is the signal: one organic line tells the eye a human made this and licenses the playful mascot illustrations elsewhere, all without spending color, type, or layout budget. It is the same "express brand in the structural furniture" move as a notched section seam, but tuned to a warmer, friendlier register — a straight `<hr>` reads neutral/corporate; a wobble reads crafted/indie. Because it is one inline SVG with `preserveAspectRatio="none"` it stretches to any width, costs nothing at runtime, scales with text zoom, and degrades to nothing meaningful if styles fail (it is decorative, so `aria-hidden`). Transferable to any footer, section break, or card seam that wants personality where a rule would otherwise be — best used *once or twice* per page so it stays a signature, not a texture.

## Why it's safe
Purely decorative and `aria-hidden`, so it adds no a11y burden; it carries no meaning a screen reader needs. One small inline SVG = negligible payload and no layout shift. The wobble is geometry, not animation, so there is no motion/perf cost and nothing for `prefers-reduced-motion` to suppress. The one caution: keep amplitude low and stroke thin so it never competes with real content — restraint is what keeps it tasteful rather than gimmicky.

## Reference implementation
```html
<!-- framework-neutral; var(--token) names from /tokens/tokens.json, no magic numbers -->
<style>
  .footer {
    background: var(--color-surface);
    color: var(--color-fg);
    padding-block: var(--space-8);
  }
  .footer__inner {
    max-width: var(--container-xl);
    margin-inline: auto;
    padding-inline: var(--space-6);
  }

  /* the divider: a full-width, fixed-height band that holds the squiggle */
  .squiggle-rule {
    display: block;
    width: 100%;
    height: var(--space-3);          /* total vertical room for the wobble */
    margin-block: var(--space-7);
    color: var(--color-subtle);      /* stroke inherits currentColor */
    overflow: visible;
  }
  .squiggle-rule path {
    fill: none;
    stroke: currentColor;
    stroke-width: 2;                  /* in the SVG's own viewBox units */
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;/* stroke stays thin when stretched wide */
  }
</style>

<footer class="footer">
  <div class="footer__inner">
    <!-- … footer link columns above … -->

    <!-- viewBox is one repeating wave; preserveAspectRatio="none" lets it
         stretch horizontally to any container width. -->
    <svg class="squiggle-rule" viewBox="0 0 24 8"
         preserveAspectRatio="none" role="presentation" aria-hidden="true">
      <path d="M0 4 Q 3 0 6 4 T 12 4 T 18 4 T 24 4" />
    </svg>

    <!-- … legal / social row below … -->
  </div>
</footer>
```
