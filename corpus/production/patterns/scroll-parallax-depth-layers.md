---
pattern: scroll-parallax-depth-layers
from: grida
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [showcase, scroll-theater, motion]
---

## What it is
A pinned stage in which a flat illustration visibly separates into depth: absolutely-stacked layers (`Sky`, `Hills`, `Trees`, `Ground`, `Foreground`) translate at different rates as the section scrolls through its own height, while a "source artwork" preview fades and scales down to hand off to the exploded layers. Grida uses it to dramatize the product itself — a looping game-background builder — so the technique *is* the demo.

## Why it works
Depth is read from **differential motion**: the eye infers that slower-moving layers are farther away, so varying one multiplier per layer turns a single picture into a parallax world with no 3D and no assets beyond flat PNGs. Pinning the stage (`position: sticky; top: 0`) gives the effect a held frame and ties "progress through the layers" to "progress through the section." Animating only `transform` keeps it on the compositor. Prefer CSS scroll-driven animation (`animation-timeline: view()`) so the browser runs it off the main thread; fall back to a throttled `requestAnimationFrame` reader where unsupported, and collapse to the assembled end-state under reduced motion.

## Reference implementation
```html
<section class="depth">
  <div class="depth__stage">            <!-- pinned 100vh frame -->
    <div class="layer" style="--depth: 0.1" data-layer>…sky…</div>
    <div class="layer" style="--depth: 0.3" data-layer>…hills…</div>
    <div class="layer" style="--depth: 0.6" data-layer>…trees…</div>
    <div class="layer" style="--depth: 0.9" data-layer>…ground…</div>
    <div class="layer" style="--depth: 1.3" data-layer>…foreground…</div>
  </div>
</section>

<style>
  .depth        { height: 300vh; }                 /* scroll travel = travel budget */
  .depth__stage { position: sticky; top: 0; height: 100vh; overflow: hidden;
                  border-radius: var(--radius-xl); }
  .layer        { position: absolute; inset: 0; will-change: transform; }

  /* Preferred path: CSS scroll-driven animation, off the main thread.
     Each layer moves proportional to its --depth. */
  @supports (animation-timeline: view()) {
    .layer {
      animation: layer-rise linear both;
      animation-timeline: view();
      animation-range: entry 0% exit 100%;
      translate: 0 calc(var(--depth) * 40px);        /* start offset */
    }
    @keyframes layer-rise {
      to { translate: 0 calc(var(--depth) * -40px); } /* nearer layers travel more */
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .layer { animation: none; translate: 0 0; }       /* show the assembled world */
  }
</style>

<script>
  // Fallback for browsers without scroll-driven animations.
  if (!CSS.supports('animation-timeline: view()')) {
    const stage = document.querySelector('.depth');
    const layers = [...document.querySelectorAll('[data-layer]')];
    let ticking = false;
    const update = () => {
      const r = stage.getBoundingClientRect();
      // progress 0→1 across the section's scroll range
      const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
      for (const el of layers) {
        const d = parseFloat(el.style.getPropertyValue('--depth')) || 0;
        el.style.transform = `translate3d(0, ${(0.5 - p) * d * 80}px, 0)`;
      }
      ticking = false;
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      addEventListener('scroll', onScroll, { passive: true });
      update();
    }
  }
</script>
```
