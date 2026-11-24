---
pattern: phase-offset-instrument-row
from: semafor
corpus: production
safety: production-safe
trigger: load
tags: [motion, navigation, brand-experience, editorial]
---

## What it is
A row of identical small instruments — clock dials, status rings, activity sweeps — that all run the **same** looping animation, desynchronized from each other by a negative `animation-delay` so each one is seeded at a different point in the cycle. Semafor puts six of these beside its wordmark, one per bureau (D.C., Brussels, Lagos, Riyadh, Beijing, Singapore); it is the only motion the site authors, and across an eleven-frame scroll capture the dials are the only pixels that change.

## Why it works
The claim "we are live in six places" is expensive to make in prose and free to make with an instrument. But an instrument only reads as *live* if the units disagree: six hands pointing the same direction read as a decoration, six hands at six angles read as six places. The mechanism that produces that — one keyframe, N phase offsets — is worth naming because the obvious implementations are both worse. Bespoke keyframes per dial (`@keyframes dial-1 { from { rotate: 40deg } … }`) multiply the CSS by N. A JS ticker puts a permanent timer on the main thread to move six transforms.

`animation-delay: -38s` on a 60s loop starts the animation *already 38 seconds in*, at load, with no timer and no extra rule. One custom property per instance is the entire API. It generalizes past clocks: staggered ambient loops, a row of spinners that shouldn't pulse in lockstep, a set of progress rings at different points, anything where N copies of one loop should look like N independent things.

Two rules keep it cheap and kind:

**Animate only `transform` (or `rotate`), on the smallest possible element.** The hand, not the dial; six 20px elements compositing off the main thread cost nothing. Never animate `width`, `background-position`, or an SVG attribute here.

**Under `prefers-reduced-motion`, freeze each instrument at a *meaningful* angle — don't just stop it.** Killing the animation mid-loop leaves a hand pointing somewhere arbitrary, which is worse than no instrument. Give each instance a static angle it means something at (the actual local hour, the actual progress value) and let the reduced-motion branch fall back to that. The instrument survives; only the sweep dies. That's the difference between an accessibility fallback and an accessibility casualty.

## Reference implementation
```html
<style>
  .dials {
    display: flex;
    gap: var(--space-4);
    align-items: flex-end;
    color: var(--color-ink, #1f1d1a);
    font-family: var(--font-sans);
  }

  .dial { display: grid; justify-items: center; gap: var(--space-1); }

  .dial__label {
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
    color: var(--color-ink-soft, #4b4a47);
  }

  .dial__face {
    position: relative;
    inline-size: 2rem;
    block-size: 2rem;
    border: 1px solid var(--color-rule-soft, #c3c1ae);
    border-radius: var(--radius-full);
    background: var(--color-paper, #f8f5d7);
  }

  .dial__hand {
    position: absolute;
    inset-block-start: 12.5%;
    inset-inline-start: calc(50% - 0.5px);
    inline-size: 1px;
    block-size: 37.5%;
    transform-origin: 50% 100%;
    background: var(--color-live, #af1f1b);

    /* The static, meaningful state. Every instance sets --angle. */
    rotate: var(--angle, 0deg);

    /* The loop. --phase seeds it: a negative delay starts it mid-cycle. */
    animation: dial-sweep var(--duration-orbit, 60s) linear infinite;
    animation-delay: calc(var(--phase, 0) * -1s);
    will-change: rotate;
  }

  @keyframes dial-sweep {
    from { rotate: 0deg; }
    to   { rotate: 360deg; }
  }

  /* Freeze at the angle that MEANS something — not wherever the loop stopped. */
  @media (prefers-reduced-motion: reduce) {
    .dial__hand {
      animation: none;
      rotate: var(--angle, 0deg);
    }
  }
</style>

<!-- --angle: the real local-time angle, rendered server-side. --phase: seconds into the loop. -->
<div class="dials" role="img" aria-label="Local time in six bureaus: Washington 11:36pm, Brussels 5:36am, Lagos 5:36am, Riyadh 7:36am, Beijing 12:36pm, Singapore 12:36pm">
  <div class="dial" aria-hidden="true">
    <span class="dial__label">D.C.</span>
    <span class="dial__face"><span class="dial__hand" style="--angle: 348deg; --phase: 58"></span></span>
  </div>
  <div class="dial" aria-hidden="true">
    <span class="dial__label">BXL</span>
    <span class="dial__face"><span class="dial__hand" style="--angle: 168deg; --phase: 28"></span></span>
  </div>
  <div class="dial" aria-hidden="true">
    <span class="dial__label">SG</span>
    <span class="dial__face"><span class="dial__hand" style="--angle: 18deg; --phase: 3"></span></span>
  </div>
</div>
```

The dials are decorative once the row carries an `aria-label` that states the same facts in words — hence `role="img"` on the container and `aria-hidden` on each face. An animated element that a screen reader has to narrate is a bug; an animated element that *illustrates* a sentence is an instrument.
