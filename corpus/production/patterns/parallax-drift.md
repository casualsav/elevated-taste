---
pattern: parallax-drift
from: teak
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [motion, scroll, parallax, depth, feature-section]
---

## What it is
Two or more stacked layers translate vertically at different rates as their section scrolls through the viewport, so nearer layers move more than farther ones. The differential speed reads as depth without any 3D. Teak drifts foreground product cards over a slower background field (echoed on lusion's depth-staged hero and Framer's layered section art), turning a flat composition into something that feels physically layered as you scroll past it.

## Why it works
Depth perception keys off relative motion (motion parallax): the brain reads whatever moves faster as closer. Binding each layer's `translateY` to *scroll progress* (0 to 1 as the section crosses the viewport) makes that depth feel authored and reversible, and it rewinds when you scroll back up. The **CSS scroll-driven animation** API (`animation-timeline: view()`) runs the whole thing on the compositor with no main-thread cost; browsers without it just render the resting layout, so there is never a scroll-event handler (the corpus bans those for their continuous reflows). Animate `transform` only, never layout, so it stays GPU-composited. Per-layer speed is one custom property (`--speed`), so the effect scales to any number of layers from one rule.

**Safety:** production-safe when the drift is *subtle*: a small translate range (tens of pixels) reads as quiet polish. Large ranges turn it into a fairground ride: they cause motion sickness for sensitive users and amplify any jank, so big drift is spectacle-only and must stay behind `prefers-reduced-motion`. The resting state (no transform) is always the real layout, so the reduced-motion path and unsupported browsers both land on a correct, legible page.

## Reference implementation
```html
<style>
  .parallax { position: relative; }

  /* Each layer drifts by its own --speed. Primary path: CSS scroll-driven
     animation. Progress-driven, runs on the compositor, no scroll listener.
     The resting transform IS the layout, so unsupported browsers are fine. */
  .parallax__layer {
    transform: translateY(0);
    will-change: transform;
    animation: parallax-drift linear both;
    animation-timeline: view();
    animation-range: entry 0% exit 100%;
  }
  @keyframes parallax-drift {
    /* --speed (px) is the per-layer travel; intrinsic to the effect.
       Keep it small for production; large values become spectacle-only. */
    from { transform: translateY(calc(var(--speed, 0px) * -1)); }
    to   { transform: translateY(var(--speed, 0px)); }
  }

  @media (prefers-reduced-motion: reduce) {
    .parallax__layer { animation: none; transform: none; }
  }
</style>

<div class="parallax">
  <div class="parallax__layer" style="--speed: 48px"><!-- background field (slow) --></div>
  <div class="parallax__layer" style="--speed: 16px"><!-- mid layer --></div>
  <div class="parallax__layer" style="--speed: 8px"><!-- foreground cards (subtle) --></div>
</div>

<script>
  // Fallback ONLY for browsers without animation-timeline. No scroll listener:
  // an IntersectionObserver gates a rAF loop that runs only while the section is
  // on screen, and reads scroll position via getBoundingClientRect each frame.
  const supportsTimeline = CSS.supports('animation-timeline: view()');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!supportsTimeline && !reduce) {
    const clamp = (v) => Math.min(1, Math.max(0, v));
    document.querySelectorAll('.parallax').forEach((section) => {
      const layers = [...section.querySelectorAll('.parallax__layer')];
      let running = false;
      const tick = () => {
        const r = section.getBoundingClientRect();
        // progress 0..1 as the section travels through the viewport
        const p = clamp(1 - r.top / (innerHeight + r.height));
        for (const layer of layers) {
          const speed = parseFloat(layer.style.getPropertyValue('--speed')) || 0;
          layer.style.transform = 'translateY(' + ((p * 2 - 1) * speed).toFixed(1) + 'px)';
        }
        if (running) requestAnimationFrame(tick);
      };
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !running) { running = true; requestAnimationFrame(tick); }
        else if (!e.isIntersecting) running = false;
      }, { threshold: 0 }).observe(section);
    });
  }
</script>
```
