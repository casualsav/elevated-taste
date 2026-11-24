---
pattern: inview-media-reveal
from: anduril
corpus: expressive
safety: production-safe
trigger: in-view
tags: [motion, feature-section, gallery, reveal]
---

## What it is
A cheap, framework-neutral **in-view reveal**: as media tiles cross into the viewport they fade and rise into place, gated by an `IntersectionObserver` with a `rootMargin` *pre-trigger* so the animation has already begun before the tile is fully visible. Anduril runs ~88 of these observers (thresholds 0.05 / 0, several with `rootMargin: 250px`) over its product mosaic and editorial blocks, driven by a single `inView` keyframe — the catalogue appears to assemble itself as you descend. The reveal animates **only `transform` and `opacity`** (compositor-cheap), and ships a mandatory `prefers-reduced-motion` branch that jumps straight to the end state.

## Why it works
The mechanism is *gating, not scroll-scrubbing*. Tying an entrance to a one-shot IntersectionObserver (rather than a scroll-event handler or a per-frame scroll-progress calc) means the work happens once, off the main thread's hot path, and only for elements actually approaching the viewport. The `rootMargin` pre-trigger (a 250px outset) is the polish detail: it starts the reveal *before* the element edge reaches the fold, so content feels ready-on-arrival instead of popping in late after the user is already looking at it. Animating only `transform`/`opacity` keeps it on the compositor (no layout/paint), so it stays smooth on long media-heavy pages. And because the effect is additive — content is fully present and styled at rest, the animation only *delays* its appearance — disabling it under reduced-motion (or if JS fails) leaves a perfectly usable page. Transfers to any media grid, feature list, or long marketing page that wants life on scroll without a scroll-jacking library.

## Reference implementation

```html
<div class="reveal"><img src="/ghost.jpg" alt="Ghost" loading="lazy" decoding="async" /></div>
<div class="reveal"><img src="/fury.jpg" alt="Fury" loading="lazy" decoding="async" /></div>
<!-- mark any element .reveal; it animates once as it nears the viewport -->

<style>
  .reveal {
    /* rest = the END state, so no-JS / reduced-motion users see it fully */
    opacity: 1;
    transform: none;
  }
  /* JS adds .reveal--armed once observed, then removes it on intersect */
  .reveal--armed {
    opacity: 0;
    transform: translateY(var(--space-3));        /* small rise — no magic px */
    transition:
      opacity var(--duration-slow) var(--ease-expo-out, cubic-bezier(0.16, 1, 0.3, 1)),
      transform var(--duration-slow) var(--ease-expo-out, cubic-bezier(0.16, 1, 0.3, 1));
  }
  .reveal--in { opacity: 1; transform: none; }

  @media (prefers-reduced-motion: reduce) {
    /* never arm; even if JS armed it, force the end state */
    .reveal--armed { opacity: 1 !important; transform: none !important; transition: none !important; }
  }
</style>

<script>
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !reduce) {
    items.forEach(el => el.classList.add('reveal--armed'));   // arm only when we can animate
    const io = new IntersectionObserver((entries, obs) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('reveal--in');                 // play once
        obs.unobserve(e.target);
      }
    }, { threshold: 0.05, rootMargin: '250px 0px' });          // pre-trigger before the fold
    items.forEach(el => io.observe(el));
  }
  /* no IO support, or reduced-motion: leave the rest (end) state — content is already visible */
</script>
```

### Pure-CSS alternative (no JS)
Where scroll-driven animations are available, the same reveal can run without JS via `animation-timeline: view()` — and `prefers-reduced-motion` still disables it:

```css
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .reveal {
      animation: inView linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 60%;
    }
    @keyframes inView {
      from { opacity: 0; transform: translateY(var(--space-3)); }
      to   { opacity: 1; transform: none; }
    }
  }
}
```
