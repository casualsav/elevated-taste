---
pattern: pause-on-hover-tag-marquee
from: gumroad
corpus: production
safety: production-safe
trigger: load
tags: [motion, feature-section, ecommerce, marquee, navigation, landing]
---

## What it is
Two rows of real, clickable category links scrolling horizontally in opposite directions, forever. Each row's track holds the same list **twice** and translates from `0` to `-50%` on a `linear infinite` loop, so the seam never lands where anyone can see it. Hovering or tabbing into a row freezes it, which is the difference between an inventory browser and a taunt.

## Why it works
A marquee is a **quantity claim**, and it is the only way to make that claim honestly in a fixed viewport. "20,000 categories" is a number nobody feels; a river of category names that never runs out is a number everyone feels. Trying to express the same thing with a static grid forces a lie of omission — you pick nine, and the visitor reads "nine."

Three constructional choices carry it:

**The content must be real.** These are anchors that navigate. A marquee of decorative labels is a screensaver; a marquee of links is a browser. If the row isn't clickable, cut it.

**Motion must be off by default.** Author the animation *inside* `@media (prefers-reduced-motion: no-preference)` rather than declaring it and then cancelling it under `reduce`. Same rendered result, opposite default — the still page is the base case and motion is the enhancement, so a missed `reduce` rule fails safe. This is a habit worth generalising to every ambient loop you ship.

**Pausing is an accessibility requirement, not a nicety.** Anything that moves for more than five seconds beside body copy needs a way to stop it (WCAG 2.2.2). Hover pause is the obvious half; `:focus-within` pause is the half that gets forgotten, and without it a keyboard user tabs into a link that is physically sliding away from where they can read it.

The duplicate half of the list must be `aria-hidden` with empty `alt` on its images. The source of this pattern ships eighty `<img alt=" icon">` and a screen reader announces "icon" eighty times — perfect alt *coverage*, zero alt *meaning*. Coverage metrics will not catch this; you have to listen.

Speed is a legibility budget: fast enough that the row obviously never ends, slow enough that a name can be read as it passes. Roughly 30–60s per full cycle on desktop, faster on mobile only because the track is shorter.

## Reference implementation
```html
<style>
  .marquee {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
    overflow: hidden;
    padding-block: var(--space-9);
    background: var(--color-bg);
    /* Fade the entry/exit so links don't get guillotined by the viewport edge. */
    mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
  }

  .marquee__row { display: flex; overflow: hidden; }

  .marquee__track {
    display: flex;
    flex: none;
    gap: var(--space-4);
    padding-inline: var(--space-2);            /* keeps hover-lift from clipping */
    width: max-content;
  }

  .marquee__pill {
    display: inline-flex;
    align-items: center;
    gap: var(--space-3);
    min-height: 2.75rem;                        /* 44px tap target, non-negotiable */
    padding: var(--space-2) var(--space-4);
    border: 1px solid var(--color-fg);
    border-radius: var(--radius-full);
    background: var(--color-surface);
    color: var(--color-fg);
    font-size: var(--text-lg);
    text-decoration: none;
    white-space: nowrap;
    transition:
      transform var(--duration-fast) var(--ease-standard),
      box-shadow var(--duration-fast) var(--ease-standard);
  }
  .marquee__pill img { width: var(--space-7); height: auto; }
  .marquee__pill:focus-visible { outline: 2px solid var(--color-focus); outline-offset: var(--space-1); }

  @keyframes marquee-drift { to { transform: translateX(-50%); } }

  /* Motion is the enhancement, not the default. A missed rule fails to "still". */
  @media (prefers-reduced-motion: no-preference) {
    .marquee__track {
      animation: marquee-drift var(--marquee-duration, 60s) linear infinite;
      will-change: transform;
    }
    .marquee__row--reverse .marquee__track { animation-direction: reverse; }

    /* WCAG 2.2.2 — hover for pointers, focus-within for keyboards. */
    .marquee__row:hover .marquee__track,
    .marquee__row:focus-within .marquee__track { animation-play-state: paused; }

    .marquee__pill:hover {
      transform: translate(calc(-1 * var(--space-1)), calc(-1 * var(--space-1)));
      box-shadow: var(--space-1) var(--space-1) 0 0 var(--color-fg);
    }

    @media (max-width: 768px) {
      .marquee__track { --marquee-duration: 24s; }   /* shorter track, same felt speed */
    }
  }
</style>

<section class="marquee" aria-label="Browse categories">
  <div class="marquee__row">
    <!-- Authored once… -->
    <div class="marquee__track">
      <a class="marquee__pill" href="/c/3d"><img src="/icons/3d.svg" alt=""> 3D</a>
      <a class="marquee__pill" href="/c/audio"><img src="/icons/audio.svg" alt=""> Audio</a>
      <a class="marquee__pill" href="/c/design"><img src="/icons/design.svg" alt=""> Design</a>
      <!-- …the rest of the row… -->

      <!-- …then repeated verbatim, hidden from the a11y tree. The duplicate is what
           makes translateX(-50%) seamless; it must never be announced twice. -->
      <span aria-hidden="true" style="display: contents;">
        <a class="marquee__pill" href="/c/3d" tabindex="-1"><img src="/icons/3d.svg" alt=""> 3D</a>
        <a class="marquee__pill" href="/c/audio" tabindex="-1"><img src="/icons/audio.svg" alt=""> Audio</a>
        <a class="marquee__pill" href="/c/design" tabindex="-1"><img src="/icons/design.svg" alt=""> Design</a>
      </span>
    </div>
  </div>

  <div class="marquee__row marquee__row--reverse">
    <div class="marquee__track" style="--marquee-duration: 48s;">
      <!-- second row, same construction, different categories -->
    </div>
  </div>
</section>
```

`tabindex="-1"` on the clones keeps the tab order honest — a keyboard user traverses the category list exactly once. Under `reduce`, the track renders static at `translateX(0)`, showing the first copy in full; the second is simply overflow, which is why the real content must be the *first* half.
