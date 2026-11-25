---
pattern: fixed-viewport-bezel
from: theresonance
corpus: production
safety: production-safe
trigger: load
tags: [hero, brand-experience, navigation, motion]
---

## What it is
A single fixed, rounded-rectangle frame that surrounds the *entire* page like a window bezel: a bright inner + outer ring plus a matte that darkens everything outside the frame, so all page content reads as living "inside" the product's viewport. Optionally it morphs from the logo mark's size up to full-screen on load, tying the identity, the loader, and the page shell into one object. Ideal when the product itself is a container/canvas/frame (a recorder, editor, browser, camera, preview tool).

## Why it works
The masking is done with one property, not a wrapper hack: a huge `box-shadow` spread (`0 0 0 100vmax`) paints the area *outside* the fixed frame a solid color, and inset shadows draw the glowing bezel. Because it's a fixed, `pointer-events:none` overlay with no per-frame JS, it costs almost nothing and never traps clicks. The frame restates the value proposition wordlessly — the whole site becomes a demonstration of the product's frame. The load morph reuses the same element, so the brand mark and the page are literally the same shape at two scales.

## Reference implementation
```html
<div class="vp-bezel" aria-hidden="true"></div>
<!-- normal page content flows underneath; the bezel is a fixed, click-through overlay -->

<style>
  .vp-bezel {
    position: fixed;
    top: 50%;
    left: 50%;
    width: calc(100vw - clamp(1.5rem, 3vw, 3rem));
    height: calc(100svh - clamp(1.5rem, 3vw, 3rem));
    transform: translate(-50%, -50%);
    border-radius: var(--radius-xl, clamp(1.5rem, 3vw, 2.5rem));
    pointer-events: none;
    z-index: 40;
    box-shadow:
      /* inner light bevel + subtle top/bottom shading */
      inset 0 12px 14px -12px rgba(255,255,255,0.35),
      inset 0 -12px 14px -12px rgba(0,0,0,0.45),
      /* the glowing double ring (brand hues) */
      inset 0 0 0 4px var(--color-accent-bevel, #a7caff),
      0 0 0 4px var(--color-accent-stroke, #2888ff),
      /* the matte: everything OUTSIDE the frame goes solid */
      0 0 0 100vmax var(--color-bg, #090d14);
  }

  /* Load morph: start at the logo mark's size, expand to the frame.
     Same element = identity → page-shell continuity. */
  @keyframes vp-frame-open {
    from {
      width: 64px; height: 39px;
      border-radius: var(--radius-md, 6px);
      transform: translate(calc(-50% - 66px), -50%);
    }
    to { /* declared values above */ }
  }
  .vp-bezel {
    animation: vp-frame-open var(--duration-slow, 820ms) var(--ease-entrance, cubic-bezier(0.16,1,0.3,1)) both;
  }

  @media (prefers-reduced-motion: reduce) {
    .vp-bezel { animation: none; } /* jump straight to the full frame */
  }
</style>
```

Notes: keep real interactive chrome (nav, buttons) at a higher `z-index` than the bezel so the ring never overlaps them. Because the matte is drawn with the page `--color-bg`, the frame reads as a window onto the same background rather than a hole. Use `svh`/`vmax` so it survives mobile URL-bar resize.
