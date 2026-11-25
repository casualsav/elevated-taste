---
pattern: scroll-tilt-diorama
from: monogrid
corpus: expressive
safety: spectacle-only
trigger: scroll-progress
tags: [brand-experience, hero, illustrated, parallax, motion]
---

## What it is
A layered illustrated (or photographic cut-out) scene whose planes gently **rotate a few degrees as you scroll** and **translate on a depth field as the pointer moves** — so a still painting reads as a living diorama that sways and has depth. In the source, inline SVG object groups tilt +9°, +6°, −4° across the scroll, evoking the rocking of a moving train; nearer objects also drift more under the cursor than far ones. It's all `transform` on a handful of nodes — no WebGL, no scroll library.

## Why it works
Two cheap inputs are mapped to two cheap outputs. Scroll *progress* (position of the stage within the viewport, read once per frame) drives a small `rotate()` per layer, with alternating signs so the scene sways rather than shears uniformly — a few degrees is enough to suggest life without inducing nausea. The *pointer* delta, multiplied by a per-layer depth factor, drives `translate()` so front planes move more than back planes, manufacturing parallax depth from a flat image. Because only `transform` changes, it's GPU-composited and never reflows; because both effects share one rAF that's scheduled from events (not free-running), it idles when nothing moves. The result feels hand-crafted and alive while staying a single static painting for anyone who can't take the motion.

## Reference implementation
```html
<div class="diorama" data-diorama>
  <!-- each plane declares its sway range (deg) and parallax depth (px) -->
  <div class="plane" style="--sway:-4deg; --depth:8"><img src="wall.webp"     alt=""></div>
  <div class="plane" style="--sway: 6deg; --depth:18"><img src="seats.webp"   alt=""></div>
  <div class="plane" style="--sway:-9deg; --depth:34"><img src="suitcase.webp" alt="Suitcase with the product bag"></div>
</div>

<style>
  .diorama { position: relative; min-height: 100svh; overflow: hidden;
             perspective: 1200px; }
  .plane {
    position: absolute; inset: 0;
    transform-origin: 50% 70%;
    /* --p = scroll progress [-1..1]; --px/--py = pointer offset, set by JS */
    transform:
      translate3d(var(--px, 0px), var(--py, 0px), 0)
      rotate(calc(var(--sway) * var(--p, 0)));
    transition: transform var(--duration-slow, 320ms) var(--ease-standard, cubic-bezier(0.2,0,0,1));
    will-change: transform;
  }
  .plane img { width: 100%; height: 100%; object-fit: cover; }

  /* MANDATORY: rest as a still painting when motion is unwelcome */
  @media (prefers-reduced-motion: reduce) {
    .plane { transition: none;
             transform: none !important;
             --p: 0 !important; --px: 0 !important; --py: 0 !important; }
  }
</style>

<script>
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine   = matchMedia('(pointer: fine)');
  const stage  = document.querySelector('[data-diorama]');
  const planes = [...stage.querySelectorAll('.plane')];
  let px = 0, py = 0, prog = 0, raf = 0;

  function schedule(){ if (!raf && !reduce.matches) raf = requestAnimationFrame(apply); }

  // scroll progress: -1 (stage below) → 0 (centered) → +1 (stage above)
  addEventListener('scroll', () => {
    const r = stage.getBoundingClientRect();
    prog = Math.max(-1, Math.min(1, (r.top + r.height/2 - innerHeight/2) / (innerHeight)));
    schedule();
  }, { passive: true });

  // pointer parallax — fine pointers only; no-op on touch
  if (fine.matches) addEventListener('pointermove', (e) => {
    px = (e.clientX / innerWidth  - .5) * 2;
    py = (e.clientY / innerHeight - .5) * 2;
    schedule();
  }, { passive: true });

  function apply(){
    raf = 0;
    for (const el of planes){
      const d = Number(el.style.getPropertyValue('--depth')) || 12;
      el.style.setProperty('--p',  prog.toFixed(3));
      el.style.setProperty('--px', (-px * d).toFixed(1) + 'px');
      el.style.setProperty('--py', (-py * d).toFixed(1) + 'px');
    }
  }
</script>
```
Notes: prefer this event-scheduled rAF over a free-running loop so the CPU sleeps when the page is still. Keep sway small (≤ ~10°) and parallax depth in the tens of px — large ranges are the difference between "alive" and "motion sickness." The reduced-motion block is not optional: it must flatten every plane to its resting transform. For a scroll-only variant with no JS, the sway can instead be a CSS scroll-driven animation (`animation-timeline: view()`), keeping this script as the fallback. Decorative planes carry empty `alt`; the one meaningful image keeps a real description.
