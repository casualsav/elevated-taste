---
pattern: pause-on-hover-logo-marquee
from: fillout
corpus: production
safety: production-safe
trigger: load
tags: [motion, trust-strip, logo-wall, integrations]
---

## What it is
An infinite horizontal ribbon of logos (or integration chips / testimonials) that drifts at a slow constant speed and **pauses while the pointer is over it**, so a visitor can stop and read any one item. It replaces a static wall of 30 logos with a compact, living strip that implies "too many to fit" and invites scanning.

## Why it works
The motion is a single CSS keyframe translating one track by exactly `-50%`, with the item set duplicated so the loop is seamless — no scroll listeners, no JS animation loop, no layout thrash. Only `transform` is animated, so it stays on the GPU and off the main thread. `animation-play-state` toggled on `:hover` gives pause-on-hover for free. Because the effect is decorative and self-contained, it can be fully disabled under reduced-motion by simply stopping the animation and letting the (already-rendered) first set sit still.

## Reference implementation
```html
<style>
  .marquee { overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
  .marquee__track {
    display: flex; width: max-content; gap: var(--space-8);
    /* long, constant drift; the house scale doesn't reach 70s, so use an inline fallback */
    animation: marquee-drift var(--duration-marquee, 70s) linear infinite;
    will-change: transform;
  }
  .marquee:hover .marquee__track { animation-play-state: paused; }
  .marquee__item { flex: 0 0 auto; display: grid; place-items: center; min-height: 44px; padding-inline: var(--space-4); }

  @keyframes marquee-drift {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }   /* -50% because the set is duplicated once */
  }

  /* MANDATORY: freeze the ribbon for motion-sensitive users */
  @media (prefers-reduced-motion: reduce) {
    .marquee__track { animation: none; }
    .marquee { -webkit-mask-image: none; overflow-x: auto; }  /* let them scroll it manually */
  }
</style>

<div class="marquee" aria-label="Trusted by leading teams">
  <ul class="marquee__track" role="list">
    <!-- set A -->
    <li class="marquee__item"><img src="/logos/wayfair.svg"  alt="Wayfair"  height="24"></li>
    <li class="marquee__item"><img src="/logos/athletic.svg" alt="The Athletic" height="24"></li>
    <li class="marquee__item"><img src="/logos/harvard.svg"  alt="Harvard"   height="24"></li>
    <!-- set B: exact duplicate of set A, aria-hidden so SR reads logos once -->
    <li class="marquee__item" aria-hidden="true"><img src="/logos/wayfair.svg"  alt="" height="24"></li>
    <li class="marquee__item" aria-hidden="true"><img src="/logos/athletic.svg" alt="" height="24"></li>
    <li class="marquee__item" aria-hidden="true"><img src="/logos/harvard.svg"  alt="" height="24"></li>
  </ul>
</div>
```
