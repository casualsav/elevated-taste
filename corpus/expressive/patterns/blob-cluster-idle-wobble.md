---
pattern: blob-cluster-idle-wobble
from: playdate
corpus: expressive
safety: production-safe
trigger: load
tags: [motion, hero, brand-experience, illustration, empty-state]
---

## What it is

A soft organic shape — a thought-cloud, a blob backdrop, a mascot's silhouette — is built from N absolutely-positioned circles (`border-radius: 50%`) that overlap into one mass. Every circle runs **the same single keyframe**, but each gets a different `animation-duration` and `animation-delay`. Because the periods are mutually irrational-ish (3.5s / 4.5s / 5s) and the animations `alternate`, the circles never re-synchronise: the silhouette breathes and drifts forever without ever repeating a recognisable pose.

The keyframe itself is the other half of the trick: it walks a **non-uniform** scale — `scale(1.05, 0.97)` then `scale(0.99, 1.03)` — so each circle squashes and stretches like something with volume, instead of pulsing like something with a heartbeat.

## Why it works

Organic motion normally implies a simulation — noise fields, springs, a physics tick. This gets the same read for the cost of one CSS rule, because the *perceived* complexity comes from **phase offset, not from the animation**. N elements × one 4-step curve × N distinct periods produces an aperiodic composite; the eye reads aperiodic as alive. Add elements to add richness; you never write another keyframe.

It is also cheap by construction. Only `transform` is animated, so every frame is a compositor job — no layout, no paint, no main thread. There is no scroll listener, no `requestAnimationFrame`, nothing to observe.

The one thing to get right is the thing Playdate gets wrong: this is an **infinite** animation, which is exactly the category `prefers-reduced-motion` exists to stop. Gate it. The resting state is the shape at `scale(1)`, which is the shape you designed anyway — so the reduced-motion fallback costs you nothing but the breathing.

Scale the amplitude down, not up: 3–5% is "alive", 15% is "a lava lamp", and past that you are in vestibular-risk territory for a decorative element nobody asked to look at.

## Reference implementation

```html
<style>
  .blob-cluster {
    position: relative;
    display: grid;
    place-items: center;
    max-inline-size: var(--container-content);
    min-block-size: 18rem;
    margin-inline: auto;
    padding: var(--space-8) var(--space-7);
    /* the mass is meant to bleed past the quote's measure; clip it to the
       viewport instead of letting the page scroll horizontally for it */
    overflow-x: clip;
  }

  /* the quote sits above the mass and never moves */
  .blob-cluster > blockquote {
    position: relative;
    z-index: 1;
    margin: 0;
    max-inline-size: 34ch;
    text-align: center;
    font-family: var(--font-sans);
    font-size: var(--text-xl);
    line-height: var(--leading-snug);
    color: var(--color-fg);
  }

  .blob-cluster > .blob {
    position: absolute;
    border-radius: var(--radius-full);
    background: var(--color-blob, #bbbbbb);
    /* one shared animation; only duration + delay + position vary per blob */
    animation: blob-wobble 5s ease-in-out infinite alternate;
    will-change: transform;   /* sparingly: these are the only animated nodes */
  }

  /* Non-uniform scale is what makes it read as volume rather than a pulse.
     Keep the amplitude ≤ ~5%. */
  @keyframes blob-wobble {
      0% { transform: scale(1,    1);    }
     30% { transform: scale(1.05, 0.97); }
     70% { transform: scale(0.99, 1.03); }
    100% { transform: scale(1.03, 0.99); }
  }

  /* De-synchronise. The periods should not be small integer multiples of each other. */
  .blob:nth-child(3n)   { animation-duration: 3.5s; animation-delay: 0s;    }
  .blob:nth-child(3n+1) { animation-duration: 4.5s; animation-delay: 180ms; }
  .blob:nth-child(3n+2) { animation-duration: 5s;   animation-delay: 310ms; }

  /* Layout the mass. Sizes in rem so the whole cluster scales with the page. */
  .blob:nth-child(2) { inline-size: 20rem; block-size: 16rem; inset-block-start: -3rem; inset-inline-start: 2rem;  }
  .blob:nth-child(3) { inline-size: 16rem; block-size: 14rem; inset-block-end:  -2rem; inset-inline-start: 10rem; }
  .blob:nth-child(4) { inline-size: 22rem; block-size: 15rem; inset-block-start:  1rem; inset-inline-end:  4rem;  }
  .blob:nth-child(5) { inline-size: 14rem; block-size: 13rem; inset-block-end:  -1rem; inset-inline-end:  9rem;  }

  /* MANDATORY: an infinite decorative loop must have an off switch.
     The end state is the designed shape, so nothing is lost. */
  @media (prefers-reduced-motion: reduce) {
    .blob-cluster > .blob {
      animation: none;
      transform: none;
      will-change: auto;
    }
  }
</style>

<figure class="blob-cluster">
  <blockquote>“If we made hardware, and built a tiny little game system…”</blockquote>
  <div class="blob" aria-hidden="true"></div>
  <div class="blob" aria-hidden="true"></div>
  <div class="blob" aria-hidden="true"></div>
  <div class="blob" aria-hidden="true"></div>
</figure>
```
