---
pattern: in-view-scale-rise
from: lassie
corpus: production
safety: production-safe
trigger: in-view
tags: [motion, testimonial, feature-card, reveal]
---

## What it is
Proof elements — testimonial cards, stats, feature tiles — that **scale up and fade in** as they cross into the viewport, instead of appearing fully formed. On a calm, whitespace-heavy page this gives each item a small moment of arrival so it lands on its own. Lassie drives testimonial cards `scale(0.5→1)` and a thumbnail `scale(2→1)` this way.

## Why it works
A long, low-density page risks reading as inert. Gating a cheap `transform: scale()` + `opacity` transition on an IntersectionObserver makes each block announce itself exactly once, when it matters, with zero scroll-handler cost. Because only compositor properties animate, it stays at 60fps; because it's one-shot (`unobserve` after firing), it never re-triggers or jank-loops. The spring easing (`cubic-bezier(0.22,1,0.36,1)`) gives a confident "pop into place" rather than a slide. Scale-from-small reads as *emergence*; keep the start scale gentle (0.85–0.95) for body content and reserve dramatic 0.5 starts for hero proof.

## Reference implementation
```html
<div class="rise">…testimonial / stat / card…</div>
<div class="rise">…</div>

<style>
  .rise {
    opacity: 0;
    transform: scale(0.92);
    transition:
      opacity var(--dur-500, 500ms) var(--ease-out, cubic-bezier(0,0,0.2,1)),
      transform var(--dur-500, 500ms) var(--ease-spring, cubic-bezier(0.22,1,0.36,1));
    will-change: transform, opacity;
  }
  .rise.is-in {
    opacity: 1;
    transform: scale(1);
  }
  /* MANDATORY: no motion -> jump straight to the end state */
  @media (prefers-reduced-motion: reduce) {
    .rise { opacity: 1; transform: none; transition: none; }
  }
</style>

<script>
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('.rise');
  if (reduce) {
    items.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);            // one-shot
          e.target.style.willChange = 'auto'; // release after firing
        }
      }
    }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
    items.forEach(el => io.observe(el));
  }
</script>
```

Notes: animate only `transform`/`opacity` (never width/height/top); drop `will-change` once the element has animated; stagger a row by adding `transition-delay` per index if you want a cascade. Reduced-motion is not optional — Lassie's own implementation omits it, which is the one thing to fix when borrowing this.
