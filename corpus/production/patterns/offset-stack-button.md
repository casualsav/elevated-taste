---
pattern: offset-stack-button
from: gumroad
corpus: production
safety: production-safe
trigger: hover
tags: [motion, hero, cta, forms, navigation, button]
---

## What it is
A primary call-to-action built from **three coincident planes** rather than one box with a shadow. Two solid, bordered rectangles sit at `inset: 0` behind the clickable face; at rest all three are perfectly stacked, so the control reads as a plain outlined button. On hover or keyboard focus the face slides up-left and the middle plane slides down-right, and the button *opens* into a three-colour sticker with a hard, unblurred edge on every layer.

## Why it works
Blurred shadows model a light source. Once you have one, you owe the whole system a consistent one — `sm/md/lg` elevations, a defensible blur-to-offset ratio, and a story for what happens over a coloured ground (usually: it goes muddy). A **zero-blur offset** models displacement instead. Depth becomes "the same shape, shifted," which is unambiguous at any size, on any ground, in dark mode, and printed.

The stack turns that static idea into an interaction. Because the layers are already there at rest and merely coincide, the hover state costs one `transform` on two elements — no reflow, no repaint of a shadow, no `box-shadow` transition (which is expensive and jitters on subpixels). And because the resting state is the *complete, correct* button, the effect can be removed entirely for reduced-motion users without losing any affordance: what they lose is a flourish, not a signal.

Two rules keep it from becoming a novelty. **Offset small** — 8px on a 56px control; the layers should peel, not explode. **Colour the understack from the brand's secondary hues, never from a semantic palette** — those planes are decoration and must never be confused with a success/danger state. Gumroad puts yellow and red back there, colours that appear nowhere else on the page as meaning.

The natural companion move: hold the accent hue in reserve for this hover. If the resting face is ink and the hovered face is the brand colour, the page stays quiet and the one thing you want clicked announces itself only when reached.

## Reference implementation
```html
<style>
  .stack-btn {
    position: relative;
    display: inline-block;
    isolation: isolate;
    --stack-offset: var(--space-2);            /* 8px — peel, don't explode */
  }

  /* The two understack planes: decoration only, never semantic colour. */
  .stack-btn__plane {
    position: absolute;
    inset: 0;
    z-index: 1;
    border: 1px solid var(--color-fg);
    border-radius: var(--radius-sm);
    transition: transform var(--duration-fast) var(--ease-standard);
  }
  .stack-btn__plane--near { z-index: 2; background: var(--color-stack-yellow, #f1f333); }
  .stack-btn__plane--far  { z-index: 1; background: var(--color-stack-red, #dc341e); }

  /* The face. Complete and correct on its own — the planes are invisible at rest. */
  .stack-btn__face {
    position: relative;
    z-index: 3;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 3.5rem;                         /* 56px — clears the 44px tap target */
    padding-inline: var(--space-6);
    border: 1px solid var(--color-fg);
    border-radius: var(--radius-sm);
    background: var(--color-fg);
    color: var(--color-bg);
    font-size: var(--text-lg);
    text-decoration: none;
    white-space: nowrap;
    transition:
      transform var(--duration-fast) var(--ease-standard),
      background-color var(--duration-fast) var(--ease-standard),
      color var(--duration-fast) var(--ease-standard);
  }

  /* Open the sticker. :focus-within covers keyboards; the far plane travels the
     opposite way so all three edges stay visible. */
  .stack-btn:hover .stack-btn__face,
  .stack-btn:focus-within .stack-btn__face {
    transform: translate(calc(-1 * var(--stack-offset)), calc(-1 * var(--stack-offset)));
    background: var(--color-accent);            /* the hue you saved for exactly this */
    color: var(--color-fg);
  }
  .stack-btn:hover .stack-btn__plane--far,
  .stack-btn:focus-within .stack-btn__plane--far {
    transform: translate(var(--stack-offset), var(--stack-offset));
  }

  .stack-btn__face:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: var(--space-1);
  }

  /* Mandatory. The resting button is the content; the peel is not.
     Hover still recolours, so the affordance survives intact. */
  @media (prefers-reduced-motion: reduce) {
    .stack-btn__face,
    .stack-btn__plane { transition: none; }
    .stack-btn:hover .stack-btn__face,
    .stack-btn:focus-within .stack-btn__face,
    .stack-btn:hover .stack-btn__plane--far,
    .stack-btn:focus-within .stack-btn__plane--far { transform: none; }
  }
</style>

<span class="stack-btn">
  <span class="stack-btn__plane stack-btn__plane--near" aria-hidden="true"></span>
  <span class="stack-btn__plane stack-btn__plane--far" aria-hidden="true"></span>
  <a class="stack-btn__face" href="/signup">Start selling</a>
</span>
```

The same three-plane construction scales down to a chip and up to a card. On a card, skip the second plane and let the card itself translate while a single hard `box-shadow: var(--space-1) var(--space-1) 0 var(--color-fg)` appears beneath it — the shadow then reads as the hole the card just left.
