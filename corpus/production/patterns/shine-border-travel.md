---
pattern: shine-border-travel
from: fillout
corpus: production
safety: production-safe
trigger: load
tags: [motion, hero, forms]
---

## What it is
A soft glow that travels continuously around the rounded border of an element — a primary input, an AI entry point, or a featured card — as if a light were orbiting its edge. It's a "premium liveness" flourish that spotlights one element without a heavy shadow or a saturated gradient.

## Why it works
The glow rides a CSS **motion path** (`offset-path: inset(0 round <radius>)`) and animates only `offset-distance` 0→100%. That's a single compositor-friendly property — no reflow, no repaint of the element itself, no scroll or `requestAnimationFrame` handler. The glow is clipped to the border ring by an overlay whose fill is masked out (`content-box exclude`), so the glow only shows on the 2px frame, never over the content. Because it degrades cleanly (`@supports`-gated, reduced-motion-off), it costs nothing where unsupported and never becomes a motion-sickness liability.

## Reference implementation
```html
<div class="shine">
  <input class="shine__field" placeholder="Describe the form you want to create…" />
  <span class="shine__ring" aria-hidden="true"><span class="shine__glow"></span></span>
</div>

<style>
  .shine {
    position: relative;
    border-radius: var(--radius-lg);
    background: var(--color-surface, #fff);
    box-shadow: var(--shadow-md, 0 4px 32px rgba(0, 0, 0, 0.1));
  }
  .shine__field {
    width: 100%;
    padding: var(--space-4) var(--space-5);
    border: 1px solid var(--color-hairline);
    border-radius: inherit;
    background: transparent;
    color: var(--color-fg);
    font: inherit;
  }

  /* the ring overlay: shows only the border frame, clips the glow to it */
  .shine__ring {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: 2px;
    overflow: hidden;
    pointer-events: none;
    /* punch out the interior so the glow only paints on the 2px frame */
    -webkit-mask: linear-gradient(#000, #000) content-box, linear-gradient(#000, #000);
    -webkit-mask-composite: xor;
            mask: linear-gradient(#000, #000) content-box exclude, linear-gradient(#000, #000);
  }

  .shine__glow {
    position: absolute;
    top: 0;
    left: 0;
    height: 32px;
    width: 150px;
    opacity: 0;
    /* soft warm light; swap the hue to taste */
    background: radial-gradient(75px 16px,
      var(--color-shine-core, rgba(255, 255, 255, 0.95)) 0%,
      var(--color-shine-mid, rgba(255, 255, 255, 0.5)) 22%,
      transparent 58%);
  }

  /* only run where motion-path is supported */
  @supports (offset-path: inset(0 round 9px)) {
    .shine__glow {
      opacity: 1;
      offset-path: inset(0 round var(--radius-lg, 9999px));
      offset-distance: 0%;
      animation: shine-border-travel 3500ms linear infinite;
    }
  }
  @keyframes shine-border-travel {
    to { offset-distance: 100%; }
  }

  @media (prefers-reduced-motion: reduce) {
    .shine__glow { animation: none; opacity: 0; }  /* fall back to the resting border */
  }
</style>
```
