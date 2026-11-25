---
pattern: torn-paper-viewport-frame
from: monogrid
corpus: expressive
safety: production-safe
tags: [brand-experience, hero, illustrated, frame, layering]
---

## What it is
A full-viewport, `position: fixed` overlay that draws a hand-torn / deckled paper border around all four edges of the screen, sitting *above* an edge-to-edge illustrated or photographic scene but with `pointer-events: none` so it never intercepts clicks. The frame stays pixel-locked while the scene and content scroll inside it, turning the page from "a browser window" into "an aperture looking into a world." The interface — a title card, a primary CTA, a small sound/menu toggle — floats as a few sparse absolutely-positioned plates over the scene, not in document flow.

## Why it works
The trick is separating three concerns onto three layers: an immersive backdrop that owns all the color and atmosphere, a *static* decorative frame that provides containment and tactile craft, and a thin layer of floating chrome. Because the frame is a single fixed element with `pointer-events: none`, it costs nothing (no JS, no reflow, no hit-testing) yet does heavy perceptual work: the irregular torn edge destroys the rectangular-screen read and signals "handmade / illustrated," while the containment makes the scene feel like a page in a book rather than a scroll region. Keeping the frame in a fixed layer (not per-section borders) means it holds still as everything travels — that stillness is the "you are looking *through* something" cue. Sampling the chrome colors from the scene's own palette keeps the floating UI feeling painted-in rather than pasted-on.

## Reference implementation
```html
<div class="world">
  <!-- Layer 1: the immersive scene (illustration / photo / <video> / <canvas>) -->
  <img class="world__scene" src="compartment.webp"
       alt="Illustrated vintage train compartment: window, bench seats, a suitcase and the product bag" />

  <!-- Layer 3: sparse floating chrome, sampled from the scene palette -->
  <div class="world__panel">
    <p class="eyebrow">The</p>
    <h1 class="display">Tuscan<br>Journey</h1>
    <p class="eyebrow">Begins</p>
    <p class="lede">Explore every chapter and receive a special gift.</p>
  </div>
  <button class="sticker">Start now</button>
  <button class="toggle" aria-pressed="false" aria-label="Toggle sound">♪</button>

  <!-- Layer 2 (painted LAST so it sits on top, but click-through): the torn frame -->
  <div class="world__frame" aria-hidden="true"></div>
</div>

<style>
  .world { position: relative; min-height: 100svh; overflow: hidden;
           background: var(--color-world-ground, #6b4a28); }
  .world__scene { position: fixed; inset: 0; width: 100%; height: 100%;
                  object-fit: cover; z-index: 0; }

  /* The pinned frame: a decorative torn-paper border image, click-through, on top */
  .world__frame {
    position: fixed; inset: 0; z-index: 3; pointer-events: none;
    /* deckled edge as a bordered image; swap for your own torn-paper PNG/SVG */
    border-image: url("torn-paper-frame.png") 120 fill / 60px / 0 stretch;
  }

  /* Floating title card — colors pulled from the scene */
  .world__panel {
    position: relative; z-index: 1;
    max-width: var(--container-content, 720px); margin-inline: auto;
    padding: var(--space-8, 4rem) var(--space-7, 3rem);
    background: var(--color-panel-olive, #465016);
    color: var(--color-parchment, #dfddcb);
    text-align: center;
  }
  .eyebrow { font-family: var(--font-sans); text-transform: uppercase;
             letter-spacing: var(--tracking-eyebrow, 0.25em); /* wide, engraved-caption feel */
             font-size: var(--text-sm, .875rem); margin: 0; }
  .display { font-family: var(--font-sans); font-weight: 700;
             line-height: var(--leading-tight, 0.93);
             letter-spacing: var(--tracking-display, -0.022em);
             font-size: clamp(3rem, 9vw, 5.75rem); margin: .1em 0; }
  .lede { color: var(--color-parchment-2, #d9cdad); }

  /* Sticker CTA: organic edge + HARD offset shadow (blur 0) = die-cut paper */
  .sticker {
    position: fixed; z-index: 2; bottom: var(--space-8, 4rem); left: 50%;
    transform: translateX(-50%);
    padding: var(--space-3, .75rem) var(--space-6, 2rem);
    background: var(--color-sticker-fill, #dfddcb);
    color: var(--color-sticker-ink, #232809);
    border: 0; border-radius: 40% 60% 55% 45% / 60% 45% 55% 40%;
    box-shadow: 2.4px 3.6px 0 0 var(--color-sticker-shadow, rgba(66,38,1,0.25));
    font: 700 var(--text-md, 1.125rem)/1 var(--font-sans);
  }
  .toggle { position: fixed; z-index: 2; bottom: var(--space-5, 1.5rem);
            left: var(--space-5, 1.5rem); width: 3rem; height: 3rem;
            border-radius: var(--radius-full, 9999px); border: 0;
            background: var(--color-parchment-2, #d9cdad); }
  .sticker:focus-visible, .toggle:focus-visible {
    outline: 2px solid var(--color-focus, #101010); outline-offset: 2px;
  }
</style>
```
Notes: the frame is `aria-hidden` decoration and `pointer-events: none`, so it never blocks the CTA or hits the a11y tree. Ship the scene as a compressed `webp`/poster and mark it the LCP; keep the title as real text (selectable, translatable, focusable) rather than baking it into the picture. The frame `border-image` slice values depend on your artwork — the point is the *fixed, click-through, on-top* layering, not these numbers.
