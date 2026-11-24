---
pattern: in-view-reveal-blur-rise
from: enode
corpus: production
safety: production-safe
trigger: in-view
tags: [motion, entrance, section-reveal]
---

## What it is
A calm entrance animation: as an element scrolls into view it fades up from near-zero opacity while a slight blur sharpens and it rises a few pixels into place, on an expo-out curve. Siblings stagger by a small per-item delay so a row of cards resolves in sequence. The effect is driven by CSS keyframes that are *armed* only when an IntersectionObserver adds a marker attribute, plus a no-JS safety timeout that force-completes the reveal if hydration never runs — so content is never stuck invisible.

## Why it works
It animates only compositor-friendly properties (`opacity`, `filter`, `transform`), so there is no layout thrash. The blur-to-sharp adds a sense of "coming into focus" that feels expensive without moving the scroll or hijacking input, and the expo-out easing (`cubic-bezier(0.16,1,0.3,1)`) decelerates hard at the end so things *settle* rather than bounce. Gating on IntersectionObserver (not a scroll handler) keeps it cheap; the safety keyframe is the production-grade detail that guarantees readable content even if JS fails. Reduced-motion fully disables it to the end state.

## Reference implementation
```html
<!-- framework-neutral vanilla JS + CSS. Items reveal once, staggered, cheap. -->
<section class="reveal-group">
  <article data-reveal style="--reveal-i:0">…</article>
  <article data-reveal style="--reveal-i:1">…</article>
  <article data-reveal style="--reveal-i:2">…</article>
</section>

<style>
  @keyframes reveal-enter {
    0% { opacity: 0.01; filter: blur(8px); transform: translateY(12px); }
  }
  /* no-JS / pre-hydration safety: force the end state after a beat so content
     is never stranded invisible if the observer never fires */
  @keyframes reveal-safety {
    100% { opacity: 1; filter: none; transform: none; }
  }

  [data-reveal] {
    /* start hidden ONLY when motion is allowed (see reduced-motion reset) */
    animation: reveal-safety 0s linear 4s 1 forwards;
  }
  /* armed by the observer: plays the real entrance, honoring a per-item stagger */
  [data-reveal].is-in {
    animation-name: reveal-enter;
    animation-duration: var(--duration-slow, 700ms);
    animation-timing-function: var(--ease-entrance, cubic-bezier(0.16, 1, 0.3, 1));
    animation-fill-mode: backwards;                      /* hold the 0% state until start */
    animation-delay: calc(var(--reveal-i, 0) * 120ms);   /* stagger siblings */
  }

  /* mandatory: no motion → jump straight to the end state, never hidden */
  @media (prefers-reduced-motion: reduce) {
    [data-reveal],
    [data-reveal].is-in {
      animation: none !important;
      opacity: 1 !important;
      filter: none !important;
      transform: none !important;
    }
  }
</style>

<script>
  const motionOK = !matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (motionOK && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');   // arm the real entrance
        obs.unobserve(e.target);            // reveal once, then stop watching
      }
    }, { rootMargin: '0px 0px -15% 0px', threshold: 0 });
    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
  } else {
    // no observer support → show everything immediately
    document.querySelectorAll('[data-reveal]')
      .forEach(el => el.classList.add('is-in'));
  }
</script>
```
