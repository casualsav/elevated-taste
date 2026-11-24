---
pattern: in-view-reveal-stagger
from: joinvoy
corpus: production
safety: production-safe
trigger: in-view
tags: [entrance, scroll, motion]
---

## What it is

The house entrance animation: as a section scrolls into view, its elements settle up into place — fading in, rising a short distance, and de-blurring — with children staggered so the block arrives in sequence rather than all at once. An `IntersectionObserver` adds an `is-visible` class once; CSS does the rest. Everything collapses to the resting state with no JavaScript and under reduced-motion.

## Why it works

The animation only ever touches `transform`, `opacity`, and `filter` — compositor-friendly properties that never trigger layout — so it stays smooth on long pages. Gating on a one-shot `IntersectionObserver` (not a scroll handler) means work happens once per element, off the main thread. The long, expo-out easing (`cubic-bezier(.22,1,.36,1)`) and 0.8–1.2s durations read as unhurried and editorial; a per-child delay via a CSS custom property (`--i`) produces stagger without bespoke keyframes. Because the *resting* state is the default and the *hidden* state is applied only when JS is present (`.js` scope), the content is fully visible with scripts or motion disabled.

## Reference implementation

```html
<section class="reveal-group" aria-label="Our principles">
  <p class="eyebrow reveal" style="--i:0">Our principles</p>
  <h2 class="headline reveal" style="--i:1">We make the complex simple</h2>
  <p class="lede reveal" style="--i:2">A short supporting line that arrives a beat later.</p>
</section>

<style>
  /* Resting state is the default — visible with no JS / reduced motion */
  .reveal {
    --reveal-rise: 24px;
    --reveal-dur: 900ms;              /* longer than the house base — intentional, editorial */
    --reveal-stagger: 90ms;
  }

  /* Hidden state applied ONLY when JS is active and motion is allowed */
  .js .reveal {
    opacity: 0;
    transform: translateY(var(--reveal-rise));
    filter: blur(4px);
    transition:
      opacity   var(--reveal-dur) var(--ease-entrance) calc(var(--i, 0) * var(--reveal-stagger)),
      transform var(--reveal-dur) var(--ease-entrance) calc(var(--i, 0) * var(--reveal-stagger)),
      filter    var(--reveal-dur) var(--ease-entrance) calc(var(--i, 0) * var(--reveal-stagger));
    will-change: transform, opacity;
  }

  .js .reveal.is-visible {
    opacity: 1;
    transform: none;
    filter: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .js .reveal,
    .js .reveal.is-visible {
      opacity: 1;
      transform: none;
      filter: none;
      transition: none;
    }
  }
</style>

<script>
  // Mark JS present so the hidden state can apply (progressive enhancement).
  document.documentElement.classList.add('js');

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = document.querySelectorAll('.reveal');

  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-visible'); // one-shot
        obs.unobserve(e.target);
      }
    }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });
    items.forEach(el => io.observe(el));
  }
</script>
```

Notes: `--ease-entrance` is a house token; `--reveal-dur`/`--reveal-rise`/`--reveal-stagger` carry inline fallbacks and are overridable per section. Stagger is expressed as `calc(--i * step)` so a parent needs no extra markup — set `--i` on each child (or compute it from `:nth-child`). Drop `will-change` once the reveal has run if you have thousands of nodes.
