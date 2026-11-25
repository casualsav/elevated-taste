---
pattern: clip-reveal
from: house
corpus: production
safety: production-safe
trigger: in-view
tags: [motion, in-view, headline, type, reveal, hero, feature-section]
---

## What it is
A headline (or any short multi-line text block) reveals itself line by line as it scrolls into view: each line sits in an overflow-hidden box, and the inner text slides up from below its own clip edge into place. Lines fire in sequence with a small stagger, so the phrase assembles top to bottom instead of fading in as one flat block. It runs once, the first time the heading enters the viewport.

## Why it works
The overflow-hidden line box turns a plain `translateY` into a clean mask wipe with no extra DOM or pseudo-elements: the text starts pushed fully below its box (110%+ so descenders never peek) and the box crops everything until it lands at 0. Only `transform` and `opacity` move, so the whole reveal stays GPU-composited with zero layout cost. Gating on a single IntersectionObserver (no scroll handler) means the animation triggers at the right moment and only once, and a per-line `transition-delay` derived from a `--i` index gives the staggered cascade for free, no JS timeline. The entrance easing (fast out, gentle settle) reads as confident rather than bouncy.

## Reference implementation
```html
<style>
  /* each line clips its own inner span; the span starts below the clip edge */
  .cr-line { overflow: hidden; }
  .cr-line > span {
    display: block;
    transform: translateY(115%);                 /* fully below the box (covers descenders) */
    transition: transform var(--duration-slow) var(--ease-entrance);
    transition-delay: calc(var(--i, 0) * 90ms);  /* per-line stagger via --i index */
  }
  .cr.is-in .cr-line > span { transform: none; } /* class toggled by the observer */

  @media (prefers-reduced-motion: reduce) {
    .cr-line > span { transform: none; transition: none; }
  }
</style>

<h2 class="cr">
  <span class="cr-line"><span style="--i:0">Pipeline that compounds.</span></span>
  <span class="cr-line"><span style="--i:1">Every signal becomes revenue data.</span></span>
</h2>

<script>
  // Fire once when the heading enters view. No scroll listener.
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.cr').forEach((el) => io.observe(el));
</script>
```
