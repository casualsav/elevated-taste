---
pattern: radial-fan-nav
from: awwwards
corpus: expressive
safety: production-safe
trigger: hover
tags: [navigation, footer, minimal]
---

## What it is
A small set of nav labels arranged in a shallow arc at the bottom-center of the viewport, with a short "clock-hand" pointer line aiming at the active item. State is encoded purely in **opacity** — the active room sits at full ink, the rest recede to ~40%. No pill, no underline, no box; the menu reads as a quiet dial rather than a toolbar.

## Why it works
Opacity-as-state is the cheapest possible active indicator — same color, same size, one property — so the menu stays calm and never competes with content. The arc + pointer borrows the mental model of a dial/compass, which suits a *spatial* site (switching rooms) better than a linear tab bar implies a sequence. Anchoring it bottom-center keeps the top and the optical center free for the work. Because everything is text + one rotated line, it scales, prints sharp, and needs no images.

## Reference implementation
```html
<nav class="fan" aria-label="Sections">
  <ul class="fan__items">
    <li style="--a:-26deg"><a href="#photo">Photo</a></li>
    <li style="--a:-10deg"><a href="#video">Video</a></li>
    <li style="--a:0deg"><a href="#home" aria-current="page">Home</a></li>
    <li style="--a:10deg"><a href="#about">About</a></li>
    <li style="--a:26deg"><a href="#book">Book</a></li>
  </ul>
  <span class="fan__needle" aria-hidden="true"></span>

  <style>
    .fan{
      position: fixed; left: 50%; bottom: var(--space-4, 32px);
      transform: translateX(-50%);
      font-family: var(--font-ui, "articulat-cf", sans-serif);
      letter-spacing: -0.02em;
    }
    .fan__items{
      list-style: none; margin: 0; padding: 0;
      display: flex; gap: var(--space-3, 24px); align-items: flex-end;
    }
    .fan__items li{ transform: translateY(calc(var(--a) * 0.4)); } /* fan curve */
    .fan__items a{
      text-decoration: none; text-transform: uppercase;
      font-size: var(--text-lg, 1.4rem);
      color: var(--color-fg, #141212);
      opacity: .4;                                   /* resting / inactive */
      transition: opacity var(--dur-1, 200ms) var(--ease, ease);
    }
    .fan__items a:hover,
    .fan__items a:focus-visible{ opacity: .7; }
    .fan__items a[aria-current="page"]{ opacity: 1; } /* active room */
    .fan__items a:focus-visible{ outline: 1px solid var(--color-fg, #141212); outline-offset: 3px; }

    /* the clock-hand pointer under the active item */
    .fan__needle{
      position: absolute; left: 50%; bottom: 100%;
      width: 1px; height: 28px; transform-origin: bottom center;
      transform: translateX(-50%) rotate(-18deg);
      background: var(--color-fg, #141212); opacity: .5;
      transition: transform var(--dur-2, 240ms) var(--ease, ease);
    }
    @media (prefers-reduced-motion: reduce){
      .fan__items a, .fan__needle{ transition: none; }
    }
  </style>
</nav>
```
Notes: drive `--a` per item to widen/flatten the arc; point the needle at the active item by setting its `rotate()` (in a real app, update it on route change). State lives in `aria-current="page"` so it's announced to assistive tech, not just shown. Reduced-motion only removes the easing — the opacity hierarchy still communicates state instantly.
