---
pattern: pastel-bloom-backdrop
from: ardor
corpus: production
safety: production-safe
tags: [backdrop, layering, hero, landing]
---

## What it is
A single fixed, full-viewport layer sitting *behind* all content (`z:-10`, `pointer-events:none`) that paints the page's only atmosphere: a soft pastel bloom bleeding from the top over a very faint, blurred texture (here, a grid of app logos). Every content section keeps a transparent background, so the whole page scrolls over one still, calm "world." A translucent blurred scrim at the top edge keeps the fixed header legible where content passes under it.

## Why it works
Depth normally costs a shadow system and per-section background art. This buys the same layered feeling with one cheap element: because the backdrop is *fixed* and the foreground *scrolls*, you get parallax-by-stillness, and because content surfaces are translucent glass, the backdrop tints each one differently by position — a flat UI reads as dimensional with zero elevation shadows. The bloom is low-saturation, so it never competes with text; it sets mood, not hierarchy. Transfers to any airy, premium landing or marketing page.

## Reference implementation
```html
<style>
  .page { position: relative; background: var(--color-bg, #f2f3f1); color: var(--color-fg, #000); }

  /* The still world behind everything */
  .bloom-backdrop {
    position: fixed; inset: 0; z-index: -10; overflow: hidden; pointer-events: none;
    /* soft pastel bloom from the top + warm canvas underneath */
    background:
      radial-gradient(120% 80% at 50% -10%,
        var(--bloom-pink, #e8bedb) 0%,
        var(--bloom-lavender, #c3bef2) 22%,
        var(--bloom-peach, #f0d5be) 40%,
        transparent 70%),
      var(--color-bg, #f2f3f1);
  }
  /* faint blurred texture layer (logos/pattern), masked so it fades out */
  .bloom-backdrop::after {
    content: ""; position: absolute; inset: 0;
    background-image: var(--backdrop-texture, none);
    background-size: var(--space-10, 48px);
    opacity: 0.06; filter: blur(2px);
    -webkit-mask-image: linear-gradient(to bottom, #000, transparent 70%);
            mask-image: linear-gradient(to bottom, #000, transparent 70%);
  }

  /* Fixed header reads over scrolling content via a blurred scrim that fades out downward */
  .top-scrim {
    position: fixed; inset-inline: 0; top: 0; z-index: 40; height: 7rem; pointer-events: none;
    backdrop-filter: blur(12px);
    -webkit-mask-image: linear-gradient(to bottom, #000 30%, transparent);
            mask-image: linear-gradient(to bottom, #000 30%, transparent);
  }

  /* Content sections stay transparent so the backdrop shows through */
  .section { background: transparent; padding-block: var(--space-10, 180px); }

  /* Glass plates: translucent + blur → the bloom tints each one by position */
  .plate {
    background: var(--color-surface, rgba(255,255,255,0.75));
    backdrop-filter: blur(10px);
    border-radius: var(--radius-xl, 20px);
  }
</style>

<div class="bloom-backdrop" aria-hidden="true"></div>
<div class="top-scrim" aria-hidden="true"></div>
<main class="page">
  <section class="section"><div class="plate">…</div></section>
  <section class="section"><div class="plate">…</div></section>
</main>
```

Notes: nothing here animates, so no reduced-motion branch is required. If you add the backdrop parallax or a logo marquee on top, gate *those* with `@media (prefers-reduced-motion: reduce)`. Keep the bloom low-saturation and the texture opacity ≤ 0.08 so body text stays high-contrast over it; verify AA on the lightest bloom region.
