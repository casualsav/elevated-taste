---
pattern: outline-pill-fill-button
from: cuberto
corpus: expressive
safety: production-safe
tags: [button, cta, navigation, hover, forms]
---

## What it is

A fully-rounded "stadium" button drawn as a **1px outline only** (transparent fill, `border-radius: 1000px`), which on hover **fills from the inside** — an inverted disc grows from center/bottom to cover the pill, and the label flips to the inverted color. Cuberto uses it for low-frequency CTAs ("What we do", the contact email/phone pills in the footer): at rest they're quiet hairline ovals that don't compete with the giant display type; on hover they become solid and confident. No shadow, no gradient, no size change.

## Why it works

The outline state keeps the button **visually subordinate** to the typographic hierarchy — an outline pill has almost no fill weight, so it sits below headings and imagery in the stacking order of attention, which is exactly right for a secondary action on a content-led page. The grow-from-inside fill gives a satisfying, directional hover (motion originates where the cursor is heading) without moving layout, so it never causes reflow or click-target shift. Because the fill is a pseudo-element clipped by the pill's `border-radius` and animated with `transform: scale()`, it is GPU-cheap and reduces cleanly: with motion disabled it becomes an instant background swap, and with no CSS at all it's still a bordered, legible button. The transferable rule: for secondary CTAs, encode the *resting* state as the lightest possible mark (a hairline) and spend the visual energy on the *hover* transition instead of on a permanent fill — the page stays calm and the interaction still feels expensive.

## Reference implementation

```html
<style>
  .pill {
    --pill-fill: var(--color-fg);          /* what grows on hover */
    --pill-ink: var(--color-fg);           /* resting label color */
    position: relative;
    isolation: isolate;                    /* keep the fill behind the label */
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-5);
    border: 1px solid currentColor;
    border-radius: var(--radius-full);     /* 9999px stadium */
    color: var(--pill-ink);
    background: transparent;
    font: var(--weight-regular) var(--text-base) / 1 var(--font-sans);
    text-decoration: none;
    overflow: hidden;                      /* clip the growing disc to the pill */
    cursor: pointer;
    transition: color var(--duration-base) var(--ease-standard);
  }

  .pill::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: var(--pill-fill);
    border-radius: inherit;
    transform: scale(0);                   /* hidden disc at rest */
    transform-origin: center;
    transition: transform var(--duration-slow) var(--ease-entrance);
  }

  .pill:hover,
  .pill:focus-visible {
    color: var(--color-bg);                /* label flips to inverted */
  }
  .pill:hover::before,
  .pill:focus-visible::before {
    transform: scale(1.05);                /* fill covers the pill */
  }

  /* on a dark stage, invert the role tokens */
  .stage .pill { --pill-fill: var(--color-bg); --pill-ink: var(--color-bg); }
  .stage .pill:hover { color: var(--color-surface); }

  @media (prefers-reduced-motion: reduce) {
    .pill, .pill::before { transition: none; }
    .pill:hover::before { transform: scale(1.05); }   /* instant fill, no grow */
  }
</style>

<a class="pill" href="/services">What we do</a>
```

> Token note: `--radius-full` (9999px) reproduces the stadium shape; the raw site used `1000px` which is equivalent at this size. Keep `:focus-visible` mirrored to `:hover` so keyboard users get the same affordance.
