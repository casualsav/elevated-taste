---
pattern: skeleton-shimmer-loading
from: grafana-play
corpus: production
safety: production-safe
trigger: load
tags: [loading, empty-state, motion]
---

## What it is
A placeholder that occupies the exact footprint of the content it is fetching (a panel, a table row, a card) and sweeps a soft highlight band across itself to signal "data is on its way." It replaces spinners and layout-shifting blank space: the page keeps its shape while asynchronous panels resolve.

## Why it works
The shimmer is a single `linear-gradient(90deg, base, highlight, base)` moved with a `background-position` keyframe — it animates *paint position only*, never geometry, so it stays cheap and never triggers reflow. Because each skeleton block is sized like the real element, there is **zero cumulative layout shift** when data arrives. Reserving space also communicates *how much* is loading, which reads as faster and calmer than an indeterminate spinner. Crucially, the motion is opt-out: under `prefers-reduced-motion` the sweep stops and the block rests as a static tinted placeholder, which still conveys "loading" without animation.

## Reference implementation
```html
<div class="skeleton-panel" aria-hidden="true">
  <span class="sk sk--line" style="width: 40%"></span>
  <span class="sk sk--line" style="width: 90%"></span>
  <span class="sk sk--line" style="width: 75%"></span>
  <span class="sk sk--block"></span>
</div>

<style>
  .sk {
    display: block;
    border-radius: var(--radius-sm, 4px);
    /* base = resting tint; highlight = the moving band */
    background:
      linear-gradient(90deg,
        var(--sk-base, #22252B) 0%,
        var(--sk-highlight, #2f3339) 50%,
        var(--sk-base, #22252B) 100%);
    background-size: 200% 100%;
    animation: sk-sweep 1.2s ease-in-out infinite;
  }
  .sk--line  { height: 0.75rem; margin-block: var(--space-2, 0.5rem); }
  .sk--block { height: 8rem; margin-top: var(--space-3, 0.75rem); }

  .skeleton-panel {
    padding: var(--space-3, 0.75rem);
    background: var(--color-surface-dark, #181B1F);
    border: 1px solid var(--color-border-on-dark, #44464E);
    border-radius: var(--radius-md, 6px);
  }

  @keyframes sk-sweep {
    from { background-position: 200% 0; }
    to   { background-position: -200% 0; }
  }

  /* Mandatory: no sweep for reduced-motion — rest as a static placeholder */
  @media (prefers-reduced-motion: reduce) {
    .sk { animation: none; background: var(--sk-base, #22252B); }
  }
</style>
```
