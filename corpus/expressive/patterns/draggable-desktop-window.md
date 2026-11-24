---
pattern: draggable-desktop-window
from: poolsuite
corpus: expressive
safety: production-safe
trigger: drag
tags: [motion, os-metaphor, brand-experience, workspace, window]
---

## What it is

A floating application window the user can pick up by its title bar and move around the page — plus a corner grip to resize it, a status strip that reports its own state, and close/zoom controls that are real buttons rather than decorative dots. The drag is pointer-driven and writes only to `transform`, so it never touches layout. On touch, the window abandons the metaphor gracefully: it goes near-full-bleed and the drag handle stops being a handle.

## Why it works

An OS metaphor is a claim the interface makes about itself, and *drag* is the only thing that makes the claim true. A window you cannot move is a card with a title bar — the ornament reads as costume. One directly manipulable element converts a static composition into an environment, and the payoff is disproportionate: users grab it, move it, and the page becomes a place. Mechanically the recipe is cheap and honest — a `pointerdown` captures the pointer, `pointermove` accumulates a delta, and a single `transform: translate()` moves the layer on the compositor. Because `transform` never reflows, dragging a window costs less than hovering a card with a soft-shadow transition.

The parts most implementations skip are the ones that make it shippable: **keyboard equivalence** (a focusable handle that arrow keys nudge, so the window isn't pointer-only), **`setPointerCapture`** (so a fast drag that leaves the window doesn't drop it), **`touch-action: none`** on the handle only (so the page still scrolls), and a **`prefers-reduced-motion`** branch that removes the lift transition while leaving the drag itself intact — moving a window on purpose is not motion the user needs protecting from; a springy animated lift is. Reusable for canvas and editor tools, floating inspectors and consoles, dashboard widgets, and brand experiences built as a desktop.

## Reference implementation

```html
<style>
  .dwin {
    position: absolute;
    inset-block-start: var(--space-6);
    inset-inline-start: var(--space-6);
    inline-size: min(calc(100vw - 2 * var(--space-6)), var(--container-content));
    background: var(--color-panel-cream, #f9f0e9);
    border: 1px solid var(--color-fg);
    border-radius: var(--radius-sm);
    color: var(--color-fg);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    /* one soft shadow in the whole system — it says "this floats" */
    box-shadow: 0 50px 80px -50px var(--color-window-shadow, rgba(0, 0, 0, 0.3));
    transition: box-shadow var(--duration-fast) var(--ease-standard);
  }
  .dwin[data-dragging] {
    box-shadow: 0 60px 90px -40px var(--color-window-shadow, rgba(0, 0, 0, 0.3));
    will-change: transform; /* set while dragging, dropped on release */
  }

  .dwin__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    padding: var(--space-2) var(--space-3);
    border-block-end: 1px solid var(--color-fg);
    cursor: grab;
    touch-action: none; /* only the handle opts out of panning */
    user-select: none;
  }
  .dwin__bar:active { cursor: grabbing; }
  .dwin__bar:focus-visible { outline: 2px solid var(--color-focus); outline-offset: -2px; }

  .dwin__ctl {
    min-inline-size: 44px;
    min-block-size: 44px;
    background: var(--color-button-pink, #f6d5d5);
    border: 0;
    border-radius: 2px;
    color: inherit;
    font: inherit;
    box-shadow:
      0 0 0 1px var(--color-fg),
      1px 1px 0 0 var(--color-bevel-highlight, #ffffff) inset,
      -1px -1px 0 0 var(--color-button-pink-shade, #7b6b6b) inset;
  }
  .dwin__ctl:active {
    box-shadow:
      0 0 0 1px var(--color-fg),
      -1px -1px 0 0 var(--color-bevel-highlight, #ffffff) inset,
      1px 1px 0 0 var(--color-button-pink-shade, #7b6b6b) inset;
  }

  .dwin__body { padding: var(--space-3); }

  .dwin__status {
    display: flex;
    justify-content: space-between;
    padding: var(--space-1) var(--space-2);
    border-block-start: 1px solid var(--color-fg);
  }

  .dwin__grip {
    position: absolute;
    inset-block-end: 0;
    inset-inline-end: 0;
    inline-size: 16px;
    block-size: 16px;
    cursor: nwse-resize;
    background-image: var(--texture-dither-2px, none);
    background-size: 2px 2px;
  }

  /* the drag is user intent, not decoration — keep it; drop the animated lift */
  @media (prefers-reduced-motion: reduce) {
    .dwin { transition: none; }
    .dwin[data-dragging] { box-shadow: 0 50px 80px -50px var(--color-window-shadow, rgba(0, 0, 0, 0.3)); }
  }

  /* touch: the metaphor folds down instead of breaking */
  @media (pointer: coarse) {
    .dwin { position: static; inline-size: 100%; }
    .dwin__bar { cursor: default; }
    .dwin__grip { display: none; }
  }
</style>

<section class="dwin" aria-label="Player window">
  <header class="dwin__bar" tabindex="0" role="button"
          aria-label="Move window — drag, or use arrow keys">
    <span>POOLSIDE FM</span>
    <button class="dwin__ctl" type="button" aria-label="Close window">×</button>
  </header>

  <div class="dwin__body">…</div>

  <footer class="dwin__status"><span>BIG-BOAT-ENERGY.mov</span><span>591×455</span></footer>
  <div class="dwin__grip" aria-hidden="true"></div>
</section>

<script>
  // Framework-neutral: transform-only, pointer-captured, keyboard-equivalent.
  const win = document.querySelector('.dwin');
  const bar = win.querySelector('.dwin__bar');
  const STEP = 8; // px per arrow key
  let x = 0, y = 0, startX = 0, startY = 0, dragging = false;

  const apply = () => { win.style.transform = `translate(${x}px, ${y}px)`; };

  bar.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button')) return;         // controls stay clickable
    if (matchMedia('(pointer: coarse)').matches) return;
    dragging = true;
    startX = e.clientX - x;
    startY = e.clientY - y;
    bar.setPointerCapture(e.pointerId);             // survives a fast drag off-window
    win.dataset.dragging = '';
  });

  bar.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    x = e.clientX - startX;
    y = e.clientY - startY;
    apply();                                        // pointermove is already rAF-aligned
  });

  const end = (e) => {
    if (!dragging) return;
    dragging = false;
    bar.releasePointerCapture(e.pointerId);
    delete win.dataset.dragging;                    // release will-change
  };
  bar.addEventListener('pointerup', end);
  bar.addEventListener('pointercancel', end);

  bar.addEventListener('keydown', (e) => {
    const move = { ArrowLeft: [-STEP, 0], ArrowRight: [STEP, 0], ArrowUp: [0, -STEP], ArrowDown: [0, STEP] }[e.key];
    if (!move) return;
    e.preventDefault();
    x += move[0];
    y += move[1];
    apply();
  });
</script>
```
