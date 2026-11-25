---
pattern: cta-text-wash-hover
from: colmez
corpus: production
safety: production-safe
trigger: hover
tags: [cta, button, motion]
---

## What it is
A primary CTA (or nav link) whose label sweeps a gradient — base ink → a flash of accent → a translucent trail — left-to-right on hover, like the text is "charging up." Nothing in the layout moves and no second element fades in; the animation is a single custom property driving a `background-clip: text` gradient.

## Why it works
A registered `@property` (`<percentage>`) is animatable, so transitioning `--cfill` from off-screen to past-the-end slides the gradient's color stops across the glyphs. Clipping that gradient to the text (`background-clip: text; color: transparent`) means the characters *are* the window onto the moving gradient — you get a precise wipe with no overlay, no reflow, and no layout thrash (only paint of a clipped gradient). Driving one property keeps it cheap and trivially reversible, and because the effect is purely decorative it degrades to a plain static label when `@property` is unsupported or motion is reduced. Reuse it to make a single CTA feel crafted without adding a glow, a shadow, or a moving icon.

## Reference implementation
```html
<!-- framework-neutral; var(--token) names resolve from /tokens -->
<a class="cta" href="#book"><span class="cta__label" data-cta-label>Book a meeting</span></a>

<style>
  /* animatable custom property: the gradient's leading edge, in % */
  @property --cfill {
    syntax: "<percentage>";
    inherits: false;
    initial-value: 124%;
  }

  .cta__label {
    --cfill: 124%; /* at rest: fully filled with ink, no accent visible */
    color: transparent;
    -webkit-text-fill-color: transparent;
    background-image: linear-gradient(
      90deg,
      var(--color-fg, #121212) 0%,
      var(--color-fg, #121212) var(--cfill),
      var(--color-accent, #ae9a29) calc(var(--cfill) + 12%),
      color-mix(in srgb, var(--color-fg, #121212) 22%, transparent) calc(var(--cfill) + 30%),
      color-mix(in srgb, var(--color-fg, #121212) 22%, transparent) 100%
    );
    background-repeat: no-repeat;
    background-clip: text;
    -webkit-background-clip: text;
  }

  /* hover drives the leading edge from before the text to past it */
  .cta:hover > .cta__label {
    animation: cta-wash var(--duration-base, 550ms)
               cubic-bezier(0.33, 0, 0.2, 1) 1 forwards;
  }

  @keyframes cta-wash {
    from { --cfill: -24%; }
    to   { --cfill: 124%; }
  }

  /* mandatory: no sweep when motion is reduced — label stays solid */
  @media (prefers-reduced-motion: reduce) {
    .cta:hover > .cta__label { animation: none; }
  }

  /* graceful fallback: browsers without @property animation just show solid ink */
  @supports not (background-clip: text) {
    .cta__label { color: var(--color-fg, #121212); -webkit-text-fill-color: currentColor; background: none; }
  }
</style>
```
