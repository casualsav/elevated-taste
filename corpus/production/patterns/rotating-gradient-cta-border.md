---
pattern: rotating-gradient-cta-border
from: public
corpus: production
safety: production-safe
trigger: load
tags: [motion, cta, button, border, gradient, premium]
---

## What it is
A primary call-to-action whose border is a slowly *rotating* band of light — a conic gradient that turns continuously around the button's edge, so the highlight sweeps the perimeter like a watch bezel. On Public this is the single decorative flourish on an otherwise flat, shadow-free page (the `borderTurn` / `glowing-wrapper` keyframes), and it's rationed to one element: the sign-up CTA. The button face stays solid; only the rim moves.

## Why it works
On a deliberately restrained page (no shadows, near-monochrome, one weight per family) there is no ambient motion to pull the eye, so a single continuously-animating element becomes the unambiguous focal point without shouting. The effect is purely decorative and lives in a pseudo-element *behind* the button, so it never touches the button's own box, text, or hit area — content and accessibility are untouched whether it runs or not. It animates only `transform: rotate()` on a conic-gradient layer (compositor-friendly, no reflow, no repaint of text), and the gradient is masked to a thin ring so it reads as a glowing border rather than a spinning disc. Ration it to one CTA: two rotating borders on a page cancel each other's focus.

## Why it works (mechanism)
A wrapper holds the real button plus a `::before` pseudo-layer that is larger than the button and painted with a `conic-gradient`. The pseudo-layer spins via a `rotate` keyframe; a same-sized solid-background inset (the button face) covers the center, leaving only a thin animated rim visible. No JS, no scroll/pointer listeners. Under `prefers-reduced-motion`, the spin is removed and the rim falls back to a static gradient (or a plain border), so the CTA is fully styled at rest.

## Reference implementation
```html
<style>
  @property --cta-angle { syntax: "<angle>"; inherits: false; initial-value: 0deg; }

  .cta-glow {
    position: relative;
    display: inline-block;
    border-radius: var(--radius-full);        /* 999px */
    padding: 2px;                              /* thickness of the glowing rim */
    isolation: isolate;
  }
  /* the rotating conic-gradient ring sits behind the button face */
  .cta-glow::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    background: conic-gradient(
      from var(--cta-angle),
      var(--color-border) 0deg,
      var(--color-fg) 90deg,
      var(--color-border) 180deg,
      var(--color-fg) 270deg,
      var(--color-border) 360deg
    );
    animation: cta-border-turn 4s linear infinite;
  }
  @keyframes cta-border-turn { to { --cta-angle: 360deg; } }

  /* the solid button face masks the center, leaving only the animated rim */
  .cta-glow__btn {
    display: block;
    border-radius: inherit;
    padding: var(--space-3) var(--space-6);   /* 12px 24px */
    background: var(--color-fg);              /* black action fill */
    color: var(--color-fg-inverse);
    font-family: var(--font-sans);
    border: none;
    cursor: pointer;
  }

  /* No motion: stop the spin, keep a static styled rim. */
  @media (prefers-reduced-motion: reduce) {
    .cta-glow::before { animation: none; }
  }
</style>

<span class="cta-glow">
  <button class="cta-glow__btn" type="button">Get started</button>
</span>
```

> Fallback note: `@property --cta-angle` lets the conic angle animate smoothly where supported. Where it isn't, swap the keyframe for `transform: rotate()` on an oversized `::before` (sized ~150% and centered) — same look, broader support, still transform-only.
