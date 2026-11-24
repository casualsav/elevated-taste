---
pattern: scroll-progress-rotate
from: attio
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [motion, scroll, rotate, parallax, feature-section]
---

## What it is
A visual element rotates (and/or scales) continuously as a function of how far its section has scrolled through the viewport — not a single in-view snap. Attio uses it on a reporting chart and an "AI hero" gradient (capture surfaced keyframes `rotate-reporting`, `rotate`, `spin`, `ai-hero-box-gradient-spin`), so the data viz feels alive and tied to the reader's scroll.

## Why it works
Binding a transform to *scroll progress* (0→1 as the section crosses the viewport) makes the motion feel authored and reversible — scroll up and it rewinds. Using the **CSS scroll-driven animation** API (`animation-timeline`) keeps it off the main thread entirely; browsers without it simply render the rest state, so there's no scroll-event handler (the corpus bans those — continuous reflows). Animate `transform` (rotate/scale), never layout, so it stays GPU-composited. Keep rotation modest (a partial turn) so it reads as polish, not a fairground ride.

## Reference implementation
```html
<style>
  .spin-on-scroll {
    transform: rotate(0deg) scale(1);       /* rest state where view() is unsupported */
    animation: scroll-rotate linear both;   /* progress-driven; runs on the compositor */
    animation-timeline: view();
    animation-range: entry 0% exit 100%;
  }
  @keyframes scroll-rotate {
    from { transform: rotate(-8deg) scale(0.96); }
    to   { transform: rotate(8deg)  scale(1); }
  }
  @media (prefers-reduced-motion: reduce) {
    .spin-on-scroll { animation: none; transform: none; }
  }
</style>

<div class="spin-on-scroll"><!-- reporting chart / gradient box --></div>
```
