---
pattern: oversized-display-headline
from: pitch
corpus: production
safety: production-safe
tags: [type, hero]
---

## What it is
One display tier set enormous (roughly 90-180px) with NO mid-size step between it and body text, so the raw scale jump from body to head *is* the hierarchy. Pitch's hero "Create slides that win." renders near 180px with tight negative tracking and ~0.8 line-height, while body sits at a tiny 12-16px; the gap is a ~10-15× leap, and the frame shows the headline physically dwarfing every other element on the page. On a deck tool the page itself performs "a stunning slide." This is the extreme single-giant-tier variant, distinct from a two-cluster type scale.

## Why it works
When there is no comfortable middle register, the eye has nowhere to rest between "biggest" and "smallest," so a single line carries the whole composition and the page reads as confident rather than busy. The move depends on one detail: tracking must tighten as the type grows. Default letter-spacing looks slack and amateur at display sizes, so bind a negative `letter-spacing` per scale step - roughly flat in the body and mid range, then tighter still at the very top - so huge type stays optically dense and engineered. Pair it with snug line-height; at 180px, generous leading would shatter the line into floating words. Use `clamp()` so the giant downscales on small viewports instead of overflowing (Pitch drops its hero to ~82px on mobile). This is a type-only pattern with no motion, so there is no resting-state concern beyond shipping legible text.

## Reference implementation
```html
<style>
  /* The one giant tier. clamp() floors it on phones and caps it on desktop,
     so it never overflows. The fluid middle term is intrinsic to the effect. */
  .display-hero {
    font-family: var(--font-sans);
    font-size: clamp(var(--text-4xl), 12vw, 11.25rem);  /* ~48px → ~180px */
    line-height: var(--leading-tight);
    letter-spacing: -0.045em;        /* tighter than var(--tracking-tight) at the extreme */
    font-weight: var(--weight-bold);
    color: var(--color-fg);
    text-wrap: balance;
    margin: 0;
  }

  /* Body sits tiny and quiet; the void between the two IS the hierarchy.
     No mid-size heading tier competes for attention. */
  .display-lede {
    font-size: var(--text-base);
    line-height: var(--leading-normal);
    letter-spacing: var(--tracking-tight);   /* hold ~flat through the mid range */
    color: var(--color-muted);
    max-width: var(--container-content);
  }
</style>

<header>
  <h1 class="display-hero">Create slides that win.</h1>
  <p class="display-lede">From prompt to presentation, fast-moving teams build and deliver winning slides together.</p>
</header>
```
