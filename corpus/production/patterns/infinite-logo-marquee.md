---
pattern: infinite-logo-marquee
from: fillout
corpus: production
safety: production-safe
trigger: load
tags: [logo-wall, integrations, social-proof, motion]
---

## What it is

A horizontally auto-scrolling strip of logos (trust bar) or integration tiles that loops forever, with its left/right edges softened by a gradient mask so items fade in and out instead of hard-clipping at the container edge. Fillout runs 9 such rows — a customer logo wall and several integration-app reels — to say "works with everything, always moving."

## Why it works

Duplicating the track and translating it by exactly `-50%` makes the loop seamless: when the first copy scrolls out, the second copy is pixel-identical in its place. Animating only `transform` keeps it on the compositor (no layout/paint per frame), so even several rows stay cheap. The `mask-image` edge-fade is what separates a polished marquee from a cheap one — content dissolves into the page rather than popping at a seam. Pausing on hover and under reduced-motion keeps it respectful.

## Reference implementation

```html
<div class="marquee" role="list" aria-label="Trusted by">
  <div class="marquee__track">
    <!-- group A -->
    <img class="marquee__item" src="logo1.svg" alt="Acme">
    <img class="marquee__item" src="logo2.svg" alt="Globex">
    <img class="marquee__item" src="logo3.svg" alt="Umbrella">
    <!-- group B: exact duplicate of group A, aria-hidden -->
    <img class="marquee__item" src="logo1.svg" alt="" aria-hidden="true">
    <img class="marquee__item" src="logo2.svg" alt="" aria-hidden="true">
    <img class="marquee__item" src="logo3.svg" alt="" aria-hidden="true">
  </div>
</div>

<style>
  .marquee {
    overflow: hidden;
    /* edge fade — logos dissolve into the page instead of clipping */
    -webkit-mask: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
            mask: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  }
  .marquee__track {
    display: flex;
    gap: var(--space-8);            /* space between logos */
    width: max-content;
    animation: marquee-scroll var(--marquee-duration, 40s) linear infinite;
  }
  .marquee:hover .marquee__track { animation-play-state: paused; }
  .marquee__item {
    height: var(--space-6, 2rem);
    flex: none;
    object-fit: contain;
    opacity: .7;
    filter: grayscale(1);          /* calm the logo wall to one tone */
  }

  @keyframes marquee-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }   /* one full group width */
  }

  @media (prefers-reduced-motion: reduce) {
    .marquee__track { animation: none; }     /* static, no motion */
    .marquee { -webkit-mask: none; mask: none; overflow-x: auto; }
  }
</style>
```

## Merged in
`pause-on-hover-logo-marquee` (a second write-up of the same Fillout strip) was folded in here. The point it stressed: the hover pause is what lets a visitor stop and read one logo, so keep it, and the strip replaces a static wall of 30 logos with a compact one that implies "too many to fit".
