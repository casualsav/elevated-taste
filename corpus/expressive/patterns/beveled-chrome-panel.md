---
pattern: beveled-chrome-panel
from: poolsuite
corpus: expressive
safety: production-safe
tags: [control-surface, button, toolbar, media-player, retro, content-section]
---

## What it is

A depth system with no blur in it. Every panel and control is drawn with the same three-part `box-shadow`: a hard `0 0 0 1px` ink outline, a `1px 1px 0 inset` highlight in the top-left corner (the light source), and a `-1px -1px 0 inset` shade in the bottom-right (the cast shadow). On `:active` the highlight and shade swap corners, so the control visibly *goes down* — instantly, with no transition. Colors come in **triads** rather than single swatches: each interactive surface ships a fill, a derived shade, and a focus fill, which is what lets the whole surface re-theme from a handful of custom properties without the bevels falling apart. Content wells (inputs, tracks) get a 2px dither tile instead of a gradient, and the one element allowed a soft shadow is the floating container itself.

## Why it works

Soft `box-shadow` elevation is a poor signal at small sizes — a 12px toolbar button under `0 1px 2px rgba(0,0,0,.06)` is a rectangle with a smudge. A lit/shaded 1px bevel encodes the same z-information in the two pixels the eye actually lands on, stays legible at any density, and costs one paint with no layout and no compositing layer. The press state is free: swapping two inset shadows is a repaint of the same box, which is why it can be instantaneous — and instantaneous is what makes a control feel *mechanical* rather than gooey. Rationing blur to exactly one element (the floating window/card) turns that single soft shadow into an unambiguous "this floats above everything" signal instead of ambient noise.

The transferable rules: (1) **tokenize triads, not colors** — `fill` / `shade` / `focus` per role, with the shade derived from the fill, so theming is a value swap and never a bevel rewrite; (2) **quantize the ornament to the same unit as the spacing** — 1px borders, 1px bevels, 2px texture tiles, 2–4px radii; (3) **spend blur once.** Reusable well beyond retro pastiche: media transports, audio/video editors, dense data toolbars, terminal UIs, kiosk and hardware-adjacent interfaces.

## Reference implementation

```html
<style>
  .chrome {
    /* fill / shade / focus triads — swap these three lines to re-theme the whole surface */
    --chrome-fill: var(--color-panel-cream, #f9f0e9);
    --chrome-ink: var(--color-fg);
    --chrome-hi: var(--color-bevel-highlight, #ffffff);

    --btn-fill: var(--color-button-pink, #f6d5d5);
    --btn-shade: var(--color-button-pink-shade, #7b6b6b);
    --btn-focus: var(--color-button-pink-focus, #ddc1c0);

    --btn2-fill: var(--color-button-teal, #afe2e5);
    --btn2-shade: var(--color-button-teal-shade, #58736f);
    --btn2-focus: var(--color-button-teal-focus, #9ecec7);

    /* the one blurred shadow in the system: this panel floats, nothing else does */
    box-shadow: 0 50px 80px -50px var(--color-window-shadow, rgba(0, 0, 0, 0.3));
    background: var(--chrome-fill);
    border: 1px solid var(--chrome-ink);
    border-radius: var(--radius-sm);
    color: var(--chrome-ink);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    image-rendering: pixelated; /* apply at the root of the themed subtree, then exempt nothing */
  }

  .chrome__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    padding: var(--space-1) var(--space-2);
    border-bottom: 1px solid var(--chrome-ink);
  }

  /* the bevel: outline + top-left light + bottom-right shade. No blur, no radius drift. */
  .chrome__btn {
    --fill: var(--btn-fill);
    --shade: var(--btn-shade);
    --focus: var(--btn-focus);
    padding: var(--space-1) var(--space-3);
    min-height: 44px; /* the site ships sub-44px controls; don't copy that */
    min-width: 44px;
    background: var(--fill);
    color: var(--chrome-ink);
    border: 0;
    border-radius: 2px;
    font: inherit;
    box-shadow:
      0 0 0 1px var(--chrome-ink),
      1px 1px 0 0 var(--chrome-hi) inset,
      -1px -1px 0 0 var(--shade) inset;
  }
  .chrome__btn--primary { --fill: var(--btn2-fill); --shade: var(--btn2-shade); --focus: var(--btn2-focus); }

  /* press = the light source flips corners. Intentionally untransitioned. */
  .chrome__btn:active {
    box-shadow:
      0 0 0 1px var(--chrome-ink),
      -1px -1px 0 0 var(--chrome-hi) inset,
      1px 1px 0 0 var(--shade) inset;
  }

  /* focus: keep the real ring, add the period-correct fill change on top */
  .chrome__btn:focus-visible {
    background: var(--focus);
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }
  .chrome__btn[disabled] { opacity: 0.4; }

  /* content well: inset bevel + a 2px dither tile instead of a gradient */
  .chrome__well {
    padding: var(--space-2);
    background-color: var(--color-well, #ffffff);
    background-image: var(--texture-dither-2px, none);
    background-size: 2px 2px;
    border-radius: 2px;
    box-shadow:
      0 0 0 1px var(--chrome-ink),
      -1px -1px 0 0 var(--chrome-hi) inset,
      1px 1px 0 0 var(--shade, var(--btn-shade)) inset;
  }

  .chrome__status {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-1) var(--space-2);
    border-top: 1px solid var(--chrome-ink);
    color: var(--chrome-ink);
  }
  .chrome__led {
    inline-size: 6px;
    block-size: 6px;
    border-radius: var(--radius-full);
    background: var(--color-status-live, #ef4444);
    animation: chrome-blink 1s steps(1, end) infinite;
  }
  /* visibility (not opacity) gives the hard on/off of an LED */
  @keyframes chrome-blink { 50%, 100% { visibility: hidden; } }

  @media (prefers-reduced-motion: reduce) {
    .chrome__led { animation: none; visibility: visible; }
  }
</style>

<section class="chrome" aria-label="Radio player">
  <header class="chrome__bar">
    <span>Player</span>
    <span aria-hidden="true">×</span>
  </header>

  <div class="chrome__well">
    <p>Fouk — Coconuts</p>
  </div>

  <div class="chrome__bar">
    <button class="chrome__btn chrome__btn--primary" type="button">Play</button>
    <button class="chrome__btn" type="button">Stop</button>
    <button class="chrome__btn" type="button">Next</button>
  </div>

  <footer class="chrome__status">
    <!-- the blink is decoration; the word carries the state -->
    <span class="chrome__led" aria-hidden="true"></span>
    <span>ON AIR</span>
  </footer>
</section>
```
