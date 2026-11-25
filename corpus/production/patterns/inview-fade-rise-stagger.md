---
pattern: inview-fade-rise-stagger
from: plaid
corpus: production
safety: production-safe
trigger: in-view
tags: [feature-section, motion]
---

## What it is
As each section scrolls into view, its items reveal with a small fade + upward rise, and siblings within the group are delayed in sequence so content arrives in reading order rather than all at once. Gated by `IntersectionObserver` (fires once), animating only `opacity` and `transform`, and fully disabled under `prefers-reduced-motion`.

## Why it works
The reveal is driven by an observer, not a scroll listener, so there's no per-frame work on the main thread — the browser tells you when an element is visible and CSS handles the tween. Animating only `transform`/`opacity` keeps the effect on the compositor (no layout/paint). The per-item stagger (a CSS variable multiplied by index) turns a static grid into a directed sequence — the eye is led through the content — while a `once` unobserve prevents re-triggering as the user scrolls back and forth. It communicates "this content is arriving / this product is live" with almost no cost.

## Reference implementation
```html
<div class="reveal-group">
  <article class="reveal">Card one</article>
  <article class="reveal">Card two</article>
  <article class="reveal">Card three</article>
</div>

<style>
  .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition:
      opacity var(--duration-slow, 500ms) var(--ease-entrance, ease-out),
      transform var(--duration-slow, 500ms) var(--ease-entrance, ease-out);
    /* per-item stagger: index set inline via style="--i:0|1|2..." */
    transition-delay: calc(var(--i, 0) * 90ms);
    will-change: opacity, transform;
  }
  .reveal.is-visible {
    opacity: 1;
    transform: none;
  }

  /* Mandatory reduced-motion fallback: show everything, no movement */
  @media (prefers-reduced-motion: reduce) {
    .reveal {
      opacity: 1;
      transform: none;
      transition: none;
      transition-delay: 0s;
    }
  }
</style>

<script>
  (function () {
    // Respect reduced motion: reveal immediately, skip the observer.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }
    document.querySelectorAll('.reveal-group').forEach(group => {
      // assign stagger index per child
      group.querySelectorAll('.reveal').forEach((el, i) => el.style.setProperty('--i', i));
    });
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target); // fire once
        }
      }
    }, { threshold: 0.2, rootMargin: '0px 0px 0px 0px' });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  })();
</script>
```

**Notes.** Thresholds `0.2` (and `0.01` for large blocks) match the exemplar's observed configs. Keep `will-change` scoped to the animating elements and drop it after reveal on very long pages if you have thousands of nodes. Prefer this observer approach over scroll-event handlers; for pure scroll-progress effects, CSS `animation-timeline: view()` is the newer alternative with the same reduced-motion guard.
