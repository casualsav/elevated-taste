---
pattern: glossy-gradient-pill-button
from: rainbow
corpus: production
safety: production-safe
trigger: hover
tags: [cta, navigation, button, motion]
---

## What it is
A large primary CTA shaped as a full-radius pill with a **dual-tone gradient fill** and a stack of *inset white-highlight* box-shadows that make it read as a glossy, convex, tappable surface. On hover the button does not move or scale — its inner highlight **swells** (and the outer drop-shadow softens) over a single 300ms ease, so it appears to light up rather than lift. Often paired (e.g. an orange and a pink pill side by side) as the page's repeating download/primary action.

## Why it works
The affordance is the polish itself: the inset highlights simulate a lit, rounded plastic surface, which consumer audiences read as "press me" without any label coaching. Animating only `box-shadow` keeps the hot path off layout (no reflow), and swelling-in-place avoids the jitter of translate/scale hovers on big elements. Tokenized gradient + radius means every CTA on the site is the same physical object in different colors. Transfers to any consumer app's primary/download CTA.

## Why it works in motion
Hovering a large element with transform can feel twitchy; intensifying the existing inset highlight communicates "active" while the button stays rock-still — calmer and more premium. Because it's pure shadow, it's cheap and safe to run on every CTA.

## Reference implementation
```html
<style>
  .pill-cta {
    --grad-a: var(--cta-pink, #ff54bb);
    --grad-b: var(--cta-pink-2, #ff7ccb);
    display: inline-flex; align-items: center; gap: var(--space-10, 10px);
    padding: var(--space-16, 16px) var(--space-32, 32px);
    border: 0; border-radius: var(--radius-pill, 9999px);
    font: 700 1.125rem/1 var(--font-rounded, system-ui);
    color: #fff; cursor: pointer;
    background: linear-gradient(180deg, var(--grad-a), var(--grad-b));
    box-shadow:
      rgba(255,255,255,0.59) 0 0.5px 0.9px -1px inset,
      rgba(255,255,255,0.40) 0 8px 14.4px -3px inset,
      rgba(255,255,255,0.58) 0 -3px 1.8px -1px inset,
      rgba(15,16,26,0.18) 0 8px 18px -6px;             /* soft outer lift */
    transition: box-shadow var(--dur, 300ms) var(--ease, cubic-bezier(0.44,0,0.56,1));
  }
  .pill-cta--orange { --grad-a: var(--cta-orange, #ff8a00); --grad-b: var(--cta-orange-2, #ffa733); }

  .pill-cta:hover {
    box-shadow:
      rgba(255,255,255,0.66) 0 0.5px 1.2px -0.6px inset,
      rgba(255,255,255,0.66) 0 8px 20px -1.7px inset,   /* highlight swells */
      rgba(255,255,255,0.58) 0 -3px 1.8px -1px inset,
      rgba(15,16,26,0.12) 0 6px 14px -6px;
  }
  .pill-cta:focus-visible { outline: 2px solid var(--fg, #0f101a); outline-offset: 2px; }

  /* Honor the user's setting the source omits */
  @media (prefers-reduced-motion: reduce) {
    .pill-cta { transition: none; }
  }
</style>

<a class="pill-cta pill-cta--orange" href="#">Download Extension</a>
<a class="pill-cta" href="#">Download Mobile</a>
```
