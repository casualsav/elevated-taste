---
pattern: scrolling-trust-marquee
from: ourplace
corpus: production
safety: production-safe
trigger: load
tags: [announcement-bar, ecommerce, motion]
---

## What it is

A full-width brand-tinted band carrying a continuously looping row of short trust promises — "100-DAY TRIAL · FREE RETURNS · FREE SHIPPING OVER $135+" — that scrolls horizontally forever. It replaces a static, skimmable guarantee block with ambient reassurance that stays in motion in the reader's periphery.

## Why it works

Three short policies, looped, read as a single message — "this brand is low-risk" — without demanding that the reader stop and parse a list. The effect is cheap by construction: it animates only `transform: translateX`, so it never triggers layout, and a duplicated track makes the loop seamless (when the first copy has scrolled exactly its own width, the keyframe resets to 0 with the second copy already in place, so there's no visible jump). The mechanism is purely decorative, so it must be silenced under `prefers-reduced-motion`, where the band falls back to a static, centered row.

## Reference implementation

```html
<div class="marquee" role="region" aria-label="Shipping and returns guarantees">
  <!-- two identical tracks; the second fills the gap as the first scrolls out -->
  <ul class="marquee__track" aria-hidden="false">
    <li>100-Day Trial</li><li>Free Returns</li><li>Free Shipping Over $135+</li>
    <li>100-Day Trial</li><li>Free Returns</li><li>Free Shipping Over $135+</li>
  </ul>
  <ul class="marquee__track" aria-hidden="true">
    <li>100-Day Trial</li><li>Free Returns</li><li>Free Shipping Over $135+</li>
    <li>100-Day Trial</li><li>Free Returns</li><li>Free Shipping Over $135+</li>
  </ul>
</div>

<style>
  .marquee {
    display: flex;
    overflow: hidden;
    background: var(--band-promo, #6C674D);          /* olive #6C674D */
    color: var(--color-fg-inverse, #FFFFFF);
    padding-block: var(--space-3);          /* 16px */
    /* tracked uppercase sans — the "chrome" voice */
    font: 600 0.75rem/1 var(--font-sans);
    letter-spacing: var(--track-label-12, 0.08em);  /* ~0.08em */
    text-transform: uppercase;
    -webkit-user-select: none;
    user-select: none;
  }
  .marquee__track {
    display: flex;
    flex-shrink: 0;
    gap: var(--space-8);                     /* 40px between promises */
    margin: 0;
    padding-left: var(--space-8);
    list-style: none;
    white-space: nowrap;
    animation: marquee-scroll 28s linear infinite;
    will-change: transform;
  }
  @keyframes marquee-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-100%); }   /* one full track width */
  }
  .marquee:hover .marquee__track { animation-play-state: paused; }

  /* MANDATORY: no infinite motion for users who opt out */
  @media (prefers-reduced-motion: reduce) {
    .marquee { justify-content: center; }
    .marquee__track { animation: none; }
    .marquee__track[aria-hidden="true"] { display: none; }  /* show one static row */
  }
</style>
```

Notes: durations come from the brand's slow-linear band (`var(--dur-*)` are for UI transitions; a marquee loop is intentionally long ~25–30s so it reads as ambient, not frantic). Keep the two tracks byte-identical so the reset is invisible. The first track is the real, announced content; the duplicate is `aria-hidden`.
