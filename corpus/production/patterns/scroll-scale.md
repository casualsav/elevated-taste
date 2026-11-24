---
pattern: scroll-scale
from: mintlify
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [motion, scroll, scale, zoom, media, feature-section]
---

## What it is
A single element (a screenshot, media card, or hero panel) scales up subtly as it enters and travels through the viewport, settling at full size around the center. Not a one-shot in-view pop but a continuous zoom tied to scroll position. Mintlify grows its product screenshot from slightly inset to flush as you arrive on it (the same move appears on Round's hero media and Teak's feature stills), so the artwork feels like it steps forward to meet you.

## Why it works
A scale tied to *scroll progress* (0 to 1 as the element crosses the viewport) gives a reveal a second beat without any extra element moving, and it reverses when you scroll back. A small delta is the whole trick: easing from about `0.94` to `1` reads as the media "settling in" rather than punching the screen, which keeps it calm enough for product UI. The **CSS scroll-driven animation** API (`animation-timeline: view()`) runs it on the compositor with no main-thread cost, and browsers without it simply render the element at rest scale, so there is no scroll-event handler (the corpus bans those for their continuous reflows). Animating `transform: scale()` never touches layout, so it stays GPU-composited and crisp; pair it with a clipping/rounded wrapper so the growth never overflows its slot.

**Safety:** production-safe. The small scale delta is the guardrail. Keep the floor near `0.94` and the ceiling at `1` (a subtle grow-in, not a `0.6` to `1` slam) so it never feels like a zoom-bomb. The resting state is full scale, so both the reduced-motion path and unsupported browsers land on the correct final composition.

## Reference implementation
```html
<style>
  /* Wrapper clips so the growth stays inside its slot. */
  .scroll-scale { overflow: hidden; border-radius: var(--radius-lg); }

  /* Primary path: CSS scroll-driven animation. Progress-driven, on the
     compositor, no scroll listener. Rest scale (1) IS the layout, so
     unsupported browsers render the correct final state. */
  .scroll-scale__media {
    transform: scale(1);
    will-change: transform;
    animation: scroll-scale linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 50%;   /* grow in as it enters → settle at center */
  }
  @keyframes scroll-scale {
    /* small delta is intrinsic to the effect; keep it subtle for production */
    from { transform: scale(0.94); }
    to   { transform: scale(1); }
  }

  @media (prefers-reduced-motion: reduce) {
    .scroll-scale__media { animation: none; transform: none; }
  }
</style>

<figure class="scroll-scale">
  <div class="scroll-scale__media"><!-- screenshot / media / card --></div>
</figure>

<script>
  // Fallback ONLY for browsers without animation-timeline. No scroll listener:
  // an IntersectionObserver gates a rAF loop that runs only while the element is
  // on screen and reads scroll position via getBoundingClientRect each frame.
  const supportsTimeline = CSS.supports('animation-timeline: view()');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!supportsTimeline && !reduce) {
    const clamp = (v) => Math.min(1, Math.max(0, v));
    const MIN = 0.94, MAX = 1;   // match the keyframe range above
    document.querySelectorAll('.scroll-scale__media').forEach((media) => {
      let running = false;
      const tick = () => {
        const r = media.getBoundingClientRect();
        // 0 when entering from the bottom, 1 once centered in the viewport
        const p = clamp(1 - (r.top + r.height / 2 - innerHeight / 2) / (innerHeight / 2 + r.height / 2));
        media.style.transform = 'scale(' + (MIN + (MAX - MIN) * p).toFixed(3) + ')';
        if (running) requestAnimationFrame(tick);
      };
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !running) { running = true; requestAnimationFrame(tick); }
        else if (!e.isIntersecting) running = false;
      }, { threshold: 0 }).observe(media);
    });
  }
</script>
```
