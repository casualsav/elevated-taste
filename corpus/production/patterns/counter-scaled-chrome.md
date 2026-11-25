---
pattern: counter-scaled-chrome
from: rauno
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [motion, canvas, zoom, navigation, labels, dashboard]
---

## What it is

Any UI that sits *on* a zoomable surface — a caption above a frame, a map pin, a node label, a crop handle, a selection outline — but must not zoom *with* it. The surface publishes its current scale as a custom property (`--zoom`); the chrome applies the exact reciprocal, `scale(calc(1 / var(--zoom)))`, and divides every offset and stroke by the same value. The result: the world scales continuously while the label renders at a constant optical size and a constant optical distance from its anchor.

## Why it works

Zooming a canvas by scaling one ancestor is the cheap, correct implementation — one composited transform, no layout, no re-measure. The problem it creates is that text and controls scale too, so at 0.6× your 14px caption is an illegible 8.4px and at 2× it's a shouting 28px. Recomputing font sizes per zoom level means writing `font-size` from JS on every frame: style recalc, reflow, jank, and a fuzzy relationship between "how far out am I" and "how big is the label."

The reciprocal is exact and free. `scale(1 / z)` on a child of a `scale(z)` parent composes to identity — the browser does the multiplication in the compositor, not the layout engine. Because it derives from one custom property, *every* piece of chrome stays in lockstep with zero coordination, and adding a new marker costs one class.

Two details make it right rather than merely working:

- **`transform-origin` must be the anchor point.** Counter-scaling from `center` moves the label away from whatever it labels; counter-scale from the corner or edge that touches the anchor (`left bottom` for a caption sitting above a frame's top-left, `bottom center` for a map pin standing on a coordinate).
- **Offsets and hairlines are in world units, so divide them too.** A `28px` gap above the frame is a `28px` *world* gap, which renders as `16.8px` at `z = 0.6`. Write `calc(-28px / var(--zoom))` and the gap stays 28 optical pixels. Same for `1px` borders: `calc(1px / var(--zoom))`.

Transfers to maps, canvas editors, node graphs, image annotators, timeline scrubbers, zoomable diagrams, print-preview surfaces — anywhere the user manipulates a scale and the interface must remain the interface.

## Reference implementation

```html
<!-- framework-neutral; --zoom is published by whatever drives the camera
     (see scroll-camera-rail, a pinch handler, or a zoom slider) -->
<style>
  .canvas-root {
    --zoom: 1;                       /* single source of truth, written once per frame */
    --chrome-gap: var(--space-5, 1.5rem);
  }

  .world {
    transform: scale(var(--zoom, 1));   /* the surface that actually zooms */
    transform-origin: 0 0;
    will-change: transform;
  }

  /* Chrome lives inside .world so it tracks its anchor's position,
     then undoes the scale so it does not track its anchor's SIZE. */
  .chrome {
    position: absolute;
    scale: calc(1 / var(--zoom, 1));    /* the reciprocal — composes to identity */
    font-size: var(--text-sm);
    color: var(--color-muted);
    white-space: nowrap;
    pointer-events: auto;
  }

  /* A caption above a frame's top-left corner. */
  .chrome--caption {
    left: 0;
    top: calc(var(--chrome-gap) * -1 / var(--zoom, 1));  /* world offset ÷ zoom */
    transform-origin: left bottom;                       /* pin to the anchor, not the center */
  }

  /* A pin standing on a point. */
  .chrome--pin {
    transform-origin: bottom center;
    outline: calc(1px / var(--zoom, 1)) solid var(--color-hairline);  /* hairlines too */
  }

  .chrome:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }

  /* Reduced motion: the camera never animates, so --zoom stays 1 and every
     calc() above collapses to its resting value. Nothing else to disable —
     but pin it explicitly so a stray inline --zoom can't leak in. */
  @media (prefers-reduced-motion: reduce) {
    .canvas-root { --zoom: 1 !important; }
    .world, .chrome { transition: none; }
  }
</style>

<div class="canvas-root">
  <div class="world">
    <div class="frame">
      <span class="chrome chrome--caption">Devouring Details</span>
      <!-- frame content -->
    </div>
  </div>
</div>

<script>
  // Whoever owns the camera writes ONE property. Chrome needs no JS at all.
  const root = document.querySelector('.canvas-root');
  const setZoom = (z) => root.style.setProperty('--zoom', z);
</script>
```

Sanity check the reciprocal against the source it came from: the exemplar's camera runs `0.882 → 0.6` and its captions run `1.133 → 1.667` — precisely `1/0.882` and `1/0.6`. If your measured pairs don't multiply to 1, your `transform-origin` or your offset division is wrong, not your scale.
