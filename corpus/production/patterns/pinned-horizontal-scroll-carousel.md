---
pattern: pinned-horizontal-scroll-carousel
from: clarionhealth
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [feature-section, motion, scroll-theater]
---

## What it is
A full-viewport band that **pins** (holds still) while its row of tall cards slides horizontally as the user scrolls vertically. It turns a multi-step story ("Implementation made easy" → four process cards) into a short guided, cinematic walk instead of a static grid. Crucially, it must degrade to an ordinary readable list on small screens and under reduced motion — the source ships exactly that (`carousel-pin` becomes `position: static` below the desktop breakpoint).

## Why it works
`position: sticky; top: 0; height: 100vh` pins the band for the duration of a tall spacer; mapping the scrolled distance to a `translateX` on the track means one input (vertical scroll) drives one cheap, GPU-composited property (`transform`). No scroll-event handler recalculating layout, no animating width/left. The effect reads as "effortless, continuous progress," which suits process/onboarding narratives. Because only `transform` moves and everything else is normal flow, it's inexpensive — the risk is purely UX (scroll-jacking), which you bound by keeping the pinned distance short.

## Reference implementation
```html
<!-- Uses CSS scroll-driven animations (animation-timeline) — no JS, no GSAP.
     Falls back to a normal horizontal-scroll strip where unsupported. -->
<section class="pin-track">
  <div class="pin-track__sticky">
    <ul class="pin-track__row">
      <li class="pin-card">You only pay when a call is handled.</li>
      <li class="pin-card">We set it all up for you.</li>
      <li class="pin-card">One platform, not just a phone bot.</li>
      <li class="pin-card">We stay with you.</li>
    </ul>
  </div>
</section>

<style>
  .pin-track {
    /* the tall spacer: total scroll distance = this height minus one viewport */
    height: 300vh;
    background: var(--color-ground-brown, #3c210c);
    position: relative;
  }
  .pin-track__sticky {
    position: sticky;
    top: 0;
    height: 100vh;
    display: flex;
    align-items: center;
    overflow: clip;
  }
  .pin-track__row {
    list-style: none; margin: 0; padding-inline: var(--space-8);
    display: flex; gap: var(--space-6);
    will-change: transform;

    /* scroll-progress driven translate — only transform moves */
    animation: pin-scroll linear both;
    animation-timeline: view();
    animation-range: contain 0% contain 100%;
  }
  @keyframes pin-scroll {
    /* end value = (total row width - viewport). Tune per card count, or set via JS. */
    to { transform: translateX(calc(-100% + 90vw)); }
  }

  .pin-card {
    flex: 0 0 clamp(280px, 34vw, 460px);
    aspect-ratio: 3 / 4;
    border-radius: var(--radius-xl);
    background: var(--color-surface-dark, #151922);
    color: var(--color-fg-on-dark);
    padding: var(--space-6);
    display: flex; align-items: flex-end;
    font-family: var(--font-serif, "Moderat Serif Trial", Georgia, serif);
    font-size: var(--text-2xl);
  }

  /* FALLBACK 1 — small screens: no pin, just a swipeable strip */
  @media (max-width: 991px) {
    .pin-track { height: auto; }
    .pin-track__sticky { position: static; height: auto; overflow-x: auto; scroll-snap-type: x mandatory; }
    .pin-track__row { animation: none; }
    .pin-card { scroll-snap-align: start; }
  }

  /* FALLBACK 2 — reduced motion: kill the scroll animation entirely */
  @media (prefers-reduced-motion: reduce) {
    .pin-track { height: auto; }
    .pin-track__sticky { position: static; height: auto; overflow-x: auto; }
    .pin-track__row { animation: none; }
  }
</style>
```

Notes:
- **Prefer CSS scroll-driven animation** (`animation-timeline: view()/scroll()`) as above — it runs off the main thread. Where you need precise pin control across browsers, a JS lib (GSAP ScrollTrigger, as the source uses) is the fallback; either way animate only `transform`.
- Keep the spacer height modest (≈1 viewport of pin per 2–3 cards) so you don't strand the user in a long scroll-jack.
- The two `@media` blocks are **mandatory**, not optional: below the breakpoint and under reduced motion the band must become a plain, fully-readable strip.
