---
pattern: duplicated-track-marquee
from: maven
corpus: production
safety: production-safe
trigger: load
tags: [motion, rail, marquee, logo-wall, social-proof]
---

## What it is

A horizontal rail that scrolls forever without a seam, without JavaScript, and without a scroll listener: render the track's children **twice**, then animate the track `transform: translateX(0 → -50%)` on a `linear infinite` loop. When the animation reaches −50% the second copy sits exactly where the first began, so the reset is invisible. Pauses on hover and on keyboard focus; under `prefers-reduced-motion` it stops dead and becomes an ordinary scrollable row.

## Why it works

The mechanism is entirely compositor-side — one `transform` on one element, no layout, no paint, no main-thread work, no `requestAnimationFrame`. Contrast the usual implementations: a scroll-event handler (jank under load), or an item-recycling loop in JS (a state machine you now maintain). Here the seamlessness is a *geometric property* of duplicating the content, not something the code has to enforce.

What it communicates matters more than how it moves. A rail that overflows and keeps going says **"there are more of these than fit"** — which is exactly the claim a logo wall, an instructor roster, or an author list is trying to make. A static row of six logos says "we have six." Use it where the *size of the set* is the message; never use it as decoration beside body copy, because perpetual motion in peripheral vision is a reading tax you charge every visitor.

Three obligations come with it: the duplicate must be `aria-hidden` (or the screen reader hears everything twice), it must pause on hover *and* focus (or a keyboard user chases a moving target), and it must have a reduced-motion end state.

## Reference implementation

```html
<section class="rail" aria-label="Instructors">
  <ul class="rail__track">
    <!-- copy 1: the real content -->
    <li class="rail__item"><img src="/p1.avif" alt="Marily Nika" width="180" height="220"></li>
    <li class="rail__item"><img src="/p2.avif" alt="Rohan Varma" width="180" height="220"></li>
    <li class="rail__item"><img src="/p3.avif" alt="Kiriti Badam" width="180" height="220"></li>

    <!-- copy 2: identical, hidden from AT. Duplicate in markup or clone once on mount. -->
    <li class="rail__item" aria-hidden="true"><img src="/p1.avif" alt="" width="180" height="220"></li>
    <li class="rail__item" aria-hidden="true"><img src="/p2.avif" alt="" width="180" height="220"></li>
    <li class="rail__item" aria-hidden="true"><img src="/p3.avif" alt="" width="180" height="220"></li>
  </ul>
</section>

<style>
  .rail {
    overflow: hidden;
    /* Soften the cut at both ends so items enter and leave rather than pop. */
    mask-image: linear-gradient(to right, transparent, #000 var(--space-8), #000 calc(100% - var(--space-8)), transparent);
  }

  .rail__track {
    display: flex;
    gap: var(--space-4);
    width: max-content;               /* the track is as wide as its two copies */
    margin: 0;
    padding: 0;
    list-style: none;
    animation: rail-scroll var(--rail-duration, 60s) linear infinite;
  }

  /* Pause when the user wants to look at something, or is tabbing through it. */
  .rail:hover .rail__track,
  .rail:focus-within .rail__track { animation-play-state: paused; }

  .rail__item { flex: 0 0 auto; }

  @keyframes rail-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }   /* exactly one copy's width */
  }

  /* Mandatory: no perpetual motion. The rail becomes a plain scrollable row,
     so every item stays reachable — never just `display: none` the overflow. */
  @media (prefers-reduced-motion: reduce) {
    .rail { overflow-x: auto; mask-image: none; }
    .rail__track { animation: none; }
    .rail__item[aria-hidden="true"] { display: none; }
  }
</style>
```

**Notes on reuse.** `--rail-duration` should scale with content width, not be a fixed constant — a 6-logo rail at 60s looks frozen, a 40-logo rail at 60s is unreadable; aim for roughly 40–60px/s and set the property per instance. Reverse direction with `animation-direction: reverse` (never a second keyframe block). Two rails moving opposite ways is one idea; three is a slot machine. If the items are links or buttons, pausing on `:focus-within` is not optional — and give them a `:focus-visible` ring that survives the `overflow: hidden` clip by insetting it (`box-shadow: inset 0 0 0 2px var(--color-focus)`).
