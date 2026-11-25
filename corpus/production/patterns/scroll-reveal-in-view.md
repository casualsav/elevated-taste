---
pattern: scroll-reveal-in-view
from: attio
corpus: production
safety: production-safe
trigger: in-view
tags: [motion, reveal, section, hero, feature-section]
---

## What it is
Content fades and rises a few pixels into place the first time it scrolls into view. Attio applies this across the whole page — its capture showed 10 `IntersectionObserver`s watching 128 targets — so headlines, product frames and diagram nodes all "settle in" rather than pop. The move is small (≈16–24px rise, a single step) and fires once.

## Why it works
Entrance motion gives a long page rhythm and draws the eye to each section as it arrives — without the jank of scroll-event handlers. An `IntersectionObserver` flips one class and CSS does the rest, so the main thread stays free and the effect is GPU-cheap (only `opacity`/`transform`). Firing **once** (unobserve after reveal) avoids the cardinal sin of re-animating on every scroll-by. A small per-item delay turns a group into a deliberate sequence instead of a wave.

## Reference implementation
```html
<style>
  .reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity var(--duration-slow) var(--ease-entrance),
                transform var(--duration-slow) var(--ease-entrance);
    will-change: opacity, transform;
  }
  .reveal.is-in { opacity: 1; transform: none; }
  .reveal-group > * { transition-delay: calc(var(--i, 0) * 60ms); } /* stagger */

  @media (prefers-reduced-motion: reduce) {
    .reveal { opacity: 1; transform: none; transition: none; }
  }
</style>

<section class="reveal-group">
  <h2 class="reveal" style="--i:0">The intelligent system that never sleeps.</h2>
  <p  class="reveal" style="--i:1">Picks up leads at 2am. Catches renewals before they slip.</p>
  <div class="reveal" style="--i:2"><!-- product frame --></div>
</section>

<script>
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-in');
      io.unobserve(e.target);            // fire once
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
</script>
```
