---
pattern: floating-pill-nav
from: copilot
corpus: production
safety: production-safe
trigger: load
tags: [navigation, header, sticky, dark, app-marketing]
---

## What it is
A top navigation that isn't a full-width bar but a **rounded "pill" island** floating a little inside the top edge, staying fixed as the page scrolls beneath it. Copilot splits it into two capsules — brand + section links on the left, auth actions on the right — over a dark frosted background, so the header reads like a piece of app chrome rather than a website banner. The same move suits any product-marketing site that wants its nav to feel like part of the product.

## Why it works
Detaching the nav from the page edges (margin on all sides + large radius) signals "floating layer," which the brain reads as UI/software, not document. Splitting it into a left and a right capsule with a gap in the middle keeps the centre of the screen clear for the hero headline behind it, and groups "wayfinding" apart from "action" so the primary CTA never competes with the section links. A translucent dark fill with `backdrop-filter: blur()` lets the page color tint through, so the bar belongs to the page instead of stamping a hard band across it. It's `position: fixed` — no scroll listener, no layout thrash — so it's cheap and the only state it has is hover.

## Reference implementation
```html
<style>
  .pillnav {
    position: fixed;
    top: var(--space-3);                /* float inside the edge, not flush */
    left: 50%;
    transform: translateX(-50%);
    z-index: 50;
    width: min(100% - var(--space-6), var(--container-max, 1200px));
    display: flex;
    justify-content: space-between;
    gap: var(--space-4);
    pointer-events: none;               /* let the gap between capsules click through */
  }
  .pillnav__group {
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: var(--space-5);
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-full);  /* 999px — fully rounded capsule */
    background: rgba(8, 27, 54, 0.6);   /* surface @ ~60% over the dark ground */
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  .pillnav__link {
    color: var(--color-fg);                   /* white @ 90% */
    font: 500 var(--text-sm) / 1 var(--font-ui, Jokker), sans-serif;
    text-decoration: none;
    transition: color var(--dur, 400ms) var(--ease, cubic-bezier(0.44, 0, 0.56, 1));
  }
  .pillnav__link:hover { color: var(--color-muted); }   /* desaturate, don't underline */
  .pillnav__cta {
    padding: var(--space-2) var(--space-4);
    border-radius: var(--radius-full);
    background: #fff;
    color: var(--color-bg);
    font: 500 var(--text-sm) / 1 var(--font-ui, Jokker), sans-serif;
  }
  /* Visible focus ring — the source site's was too thin; do better. */
  .pillnav__link:focus-visible,
  .pillnav__cta:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 3px; }

  /* On narrow screens the two capsules stack into one centered bar. */
  @media (max-width: 640px) {
    .pillnav { flex-direction: column; align-items: center; gap: var(--space-2); }
  }
</style>

<nav class="pillnav" aria-label="Primary">
  <div class="pillnav__group">
    <a class="pillnav__link" href="/" aria-label="Home">▲ Brand</a>
    <a class="pillnav__link" href="#features">Features</a>
    <a class="pillnav__link" href="#pricing">Pricing</a>
    <a class="pillnav__link" href="#reviews">Reviews</a>
  </div>
  <div class="pillnav__group">
    <a class="pillnav__link" href="/login">Log in</a>
    <a class="pillnav__cta" href="/start">Get started</a>
  </div>
</nav>
```
