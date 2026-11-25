---
pattern: viewport-frame-ticks
from: lusion
corpus: expressive
safety: production-safe
tags: [navigation, chrome, hero, layout, interactive-showcase]
---

## What it is
A media stage (canvas, video, or 3D scene) is dressed like a **camera viewfinder**: small registration ticks or icons sit in the corners of the frame, tiny labels run along its edges, and a single bottom-centered cue — `SCROLL TO EXPLORE` with a chevron, or a pulsing dot — invites the next move. There is no separate "scroll down" band and no boxy toolbar; the framing marks float at the rectangle's edges so the stage itself becomes an instrument you're looking *into*. On Lusion the corner marks and the scroll cue bracket the dark hero viewport; the technique generalizes to any embedded player or demo panel.

## Why it works
The viewfinder language signals "this is live capture / an instrument," which primes the user to interact rather than read — exactly the right cue for a canvas or video. Pinning the marks to the *frame's* corners (not the page's) ties the chrome to the content, so the stage feels self-contained even on a busy page. Folding the scroll affordance into the bottom edge of the same frame removes a whole redundant section: one element carries both "this is the focal object" and "keep going." Because the marks are tiny, monochrome, and evenly weighted, they add structure without competing with the scene inside.

## Reference implementation
```html
<figure class="viewfinder">
  <canvas class="vf-scene" aria-hidden="true"></canvas>

  <span class="vf-tick vf-tl" aria-hidden="true"></span>
  <span class="vf-tick vf-tr" aria-hidden="true"></span>
  <span class="vf-tick vf-bl" aria-hidden="true"></span>
  <span class="vf-tick vf-br" aria-hidden="true"></span>

  <a class="vf-cue" href="#next">
    Scroll to explore
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M8 2v12M3 9l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.5"/>
    </svg>
  </a>
</figure>

<style>
  .viewfinder {
    position: relative;
    margin: 0;
    aspect-ratio: 16 / 10;
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: var(--color-stage-bg, #2b2e3a);
    color: var(--color-fg-inverse);
  }
  .vf-scene { position: absolute; inset: 0; width: 100%; height: 100%; }

  /* corner registration ticks — two hairlines forming an L at each corner */
  .vf-tick {
    --tick: var(--space-5);              /* arm length */
    position: absolute;
    width: var(--tick);
    height: var(--tick);
    opacity: 0.7;
    pointer-events: none;
  }
  .vf-tick::before,
  .vf-tick::after {
    content: "";
    position: absolute;
    background: currentColor;
  }
  .vf-tick::before { inset-block-start: 0; width: 100%; height: 1px; }  /* horizontal arm */
  .vf-tick::after  { inset-inline-start: 0; height: 100%; width: 1px; } /* vertical arm */

  .vf-tl { inset: var(--space-4) auto auto var(--space-4); }
  .vf-tr { inset: var(--space-4) var(--space-4) auto auto; rotate: 90deg; }
  .vf-bl { inset: auto auto var(--space-4) var(--space-4); rotate: -90deg; }
  .vf-br { inset: auto var(--space-4) var(--space-4) auto; rotate: 180deg; }

  /* bottom-centered scroll cue, folded into the frame's lower edge */
  .vf-cue {
    position: absolute;
    inset-block-end: var(--space-4);
    inset-inline: 0;
    margin-inline: auto;
    width: max-content;
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: currentColor;
    text-decoration: none;
  }
  .vf-cue svg { animation: vf-bob var(--duration-slow) var(--ease-standard) infinite alternate; }

  @keyframes vf-bob { to { transform: translateY(var(--space-1)); } }
  @media (prefers-reduced-motion: reduce) {
    .vf-cue svg { animation: none; }
  }
</style>
```

Notes: ticks are pure CSS pseudo-elements (one rotated unit, four placements) so there are no magic offsets — corner inset and arm length both come from the space scale. The cue's bob is decorative and disabled under reduced motion. Keep the marks at one low opacity and one color so they frame without shouting.
