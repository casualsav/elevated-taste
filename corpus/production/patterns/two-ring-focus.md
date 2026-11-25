---
pattern: two-ring-focus
from: grafana-play
corpus: production
safety: production-safe
trigger: hover
tags: [a11y, focus, forms, navigation]
---

## What it is
An unmistakable keyboard-focus indicator that reads on *any* surface — light panel, dark canvas, colored button — built from a double `box-shadow`: an inner ring painted in the page/component background color to open a visible gap, then an outer ring in the accent color. It sits outside the element's own border, so it never shifts layout and never gets lost against a same-colored edge.

## Why it works
A single accent outline disappears when the control sits on a surface near the accent hue, and a plain `outline` can hug the border too tightly to notice. Stacking a **bg-colored gap ring** under the **accent ring** guarantees contrast on both sides of the accent line regardless of what's behind the control — the same trick as a "halo" stroke around text. Using `box-shadow` (not `outline`) lets the rings follow `border-radius` and animate cheaply, while `:focus-visible` scopes it to keyboard users so pointer clicks stay quiet. Because it only paints shadow, there is zero reflow.

## Reference implementation
```html
<style>
  .btn {
    padding: var(--space-2, .5rem) var(--space-4, 1rem);
    border-radius: var(--radius-sm, 6px);
    border: 1px solid var(--color-border-on-dark, rgba(204,204,220,.12));
    background: var(--color-surface-dark, #181b1f);
    color: var(--color-fg-on-dark, #ccccdc);
    outline: none;
    /* animate only the shadow — cheap, no layout shift */
    transition: box-shadow var(--duration-fast, 120ms) var(--ease-standard, cubic-bezier(.4,0,.2,1));
  }

  /* Two rings: inner gap in the page bg, outer in the accent */
  .btn:focus-visible {
    box-shadow:
      0 0 0 2px var(--color-bg-dark, #111217),          /* gap ring = page ground */
      0 0 0 4px var(--color-focus, #3d71d9);            /* accent ring */
    /* faint outline as a Windows-High-Contrast / forced-colors fallback */
    outline: 2px solid transparent;
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .btn { transition: none; }
  }
</style>

<button class="btn">Save dashboard</button>
```

Notes: match the first ring's color to the *surface the control sits on* (here the dark ground) — that's what creates the gap. On a light UI, swap it for `var(--color-bg, #fff)` and use `var(--color-focus)` for the accent. The transparent `outline` is intentional: in forced-colors mode `box-shadow` is dropped, so the outline becomes the visible focus ring.
