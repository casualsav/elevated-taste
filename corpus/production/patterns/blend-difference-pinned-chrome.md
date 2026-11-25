---
pattern: blend-difference-pinned-chrome
from: colmez
corpus: production
safety: production-safe
tags: [navigation, header, layering]
---

## What it is
A fixed top-of-page chrome (wordmark + a primary CTA) that stays legible over *any* background — a near-black hero, full-bleed photography, a white team section — without a solid bar, a scroll listener, or section-aware class toggling. It renders in a single full-viewport layer set to `mix-blend-mode: difference`, so its pixels are computed against whatever scrolls beneath: white over dark regions, black over light ones, automatically.

## Why it works
Difference-blend inverts the layer's color relative to the backdrop, and pure white (`#fff`) over a backdrop of luminance L yields `|255 − L|` — so white chrome reads white on black and flips toward black on white, always landing on the high-contrast side. That removes the whole class of bugs where a transparent nav becomes invisible over a mid-section. Because it is a passive composite, there is no JS, no reflow, and no "flash of wrong color" at a section boundary. The trade: you get *inversion*, not arbitrary brand color — so it suits a monochrome wordmark + outline CTA, and you must sanity-check mid-grey (~L128) sections where contrast is weakest. Put the visual layer at `pointer-events:none` and re-enable clicks on just the interactive children, so the full-viewport overlay never eats the page's hover/scroll.

## Reference implementation
```html
<!-- framework-neutral; var(--token) names resolve from /tokens -->
<div class="chrome" aria-hidden="false">
  <a class="chrome__mark" href="#top">COLMEZ</a>
  <a class="chrome__cta" href="#book">Book a meeting →</a>
</div>

<style>
  .chrome {
    position: fixed;
    inset: 0;
    z-index: 50;
    /* the whole layer inverts against the page beneath it */
    mix-blend-mode: difference;
    /* full-viewport overlay must not intercept the page's pointer events */
    pointer-events: none;

    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: var(--space-5) var(--space-6);
    /* chrome is monochrome white so difference-blend keeps it legible everywhere */
    color: var(--color-fg-on-dark, #ffffff);
  }

  /* re-enable interaction only on the actual controls */
  .chrome__mark,
  .chrome__cta {
    pointer-events: auto;
    color: inherit;
    text-decoration: none;
  }

  .chrome__mark {
    font-weight: 900;
    letter-spacing: -0.02em;
    font-size: var(--text-xl);
  }

  .chrome__cta {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-5);
    font-size: var(--text-sm);
    /* outline, not fill — a filled accent chip would also invert and shift hue */
    border: 1px solid currentColor;
    border-radius: var(--radius-sm);
  }

  /* Accessibility: difference-blend can underperform on mid-grey backdrops.
     If a section's backdrop is near L128, give the chrome a solid scrim there
     via a per-section class instead of relying on the blend. */
  @supports not (mix-blend-mode: difference) {
    .chrome { mix-blend-mode: normal; background: var(--color-bg-dark, #121212); }
  }
</style>
```
