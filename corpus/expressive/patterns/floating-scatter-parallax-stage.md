---
pattern: floating-scatter-parallax-stage
from: awwwards
corpus: expressive
safety: spectacle-only
trigger: hover
tags: [hero, gallery, brand-experience, motion, parallax]
---

## What it is
A full-viewport, fixed (non-scrolling) "stage" holding a small set of image cards placed by hand — varied scale, partial overlap, each rotated a few degrees off-axis like prints scattered on a light table. As the cursor moves, the cards drift on a depth field (nearer/larger cards move more), giving a parallax sense of layered glass without WebGL or a scroll axis. One artifact owns the optical center; the rest sit in the margins, partly cropped by the viewport edge.

## Why it works
The effect is entirely `transform` on a handful of absolutely-positioned nodes, so it's GPU-cheap and never reflows. The *art-direction* comes from breaking the grid: rotation (±2–8°) + irregular scale + overlap is what reads as curated rather than templated — a neat 3-column grid of the same images would read as stock. Parallax depth is created by multiplying one shared pointer delta by a per-card depth factor, so "closer" cards (bigger, higher z) respond more. Because it's pointer-driven, not scroll-driven, the whole composition can stay pinned and be *inhabited* — ideal when you want one thing seen, not a long page fallen through.

## Reference implementation
```html
<div class="stage" id="stage">
  <figure class="card" style="--x:50%; --y:34%; --rot:-1deg; --scale:1;    --depth:26" data-card>
    <img src="cover.jpg" alt="Featured editorial cover">
  </figure>
  <figure class="card" style="--x:20%; --y:58%; --rot:-7deg; --scale:.66;  --depth:14" data-card>
    <img src="work-a.jpg" alt="Portrait — Flaunt film">
  </figure>
  <figure class="card" style="--x:80%; --y:40%; --rot:6deg;  --scale:.8;   --depth:20" data-card>
    <img src="work-b.jpg" alt="Editorial — fashion portrait">
  </figure>

  <style>
    .stage{
      position: fixed; inset: 0;            /* the stage IS the page — no scroll */
      background: var(--color-bg, #F5F4F1);
      overflow: hidden;
    }
    .card{
      position: absolute; left: var(--x); top: var(--y);
      margin: 0; width: clamp(180px, 22vw, 360px);
      transform:
        translate(-50%, -50%)
        translate3d(var(--px, 0), var(--py, 0), 0)   /* parallax offset, set by JS */
        rotate(var(--rot)) scale(var(--scale));
      transition: transform var(--dur-3, 320ms) var(--ease, ease);
      will-change: transform;
    }
    .card img{
      display: block; width: 100%; height: auto;
      box-shadow: var(--shadow-ring, rgba(20,18,18,.18) 0 0 0 .4px);
    }
    /* Mandatory: freeze the drift + remove the lag when motion is unwelcome */
    @media (prefers-reduced-motion: reduce){
      .card{ transition: none; --px:0 !important; --py:0 !important; }
    }
  </style>

  <script>
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const cards = [...document.querySelectorAll('[data-card]')];
    let tx = 0, ty = 0, raf = 0;

    addEventListener('pointermove', e => {
      if (reduce.matches) return;
      // pointer delta from screen center, normalized to [-1, 1]
      tx = (e.clientX / innerWidth  - .5) * 2;
      ty = (e.clientY / innerHeight - .5) * 2;
      if (!raf) raf = requestAnimationFrame(apply);
    }, { passive: true });

    function apply(){
      raf = 0;
      for (const c of cards){
        const d = Number(c.style.getPropertyValue('--depth')) || 16; // px of travel
        c.style.setProperty('--px', (-tx * d).toFixed(1) + 'px');
        c.style.setProperty('--py', (-ty * d).toFixed(1) + 'px');
      }
    }
  </script>
</div>
```
Notes: only `transform`/`opacity` are touched, and the rAF is scheduled per pointer event (not a free-running loop), so it idles when the mouse is still. Reduced-motion users get the resting scatter with no drift. For touch devices the effect simply never fires (no `pointermove` over the surface) — that's the intended graceful no-op.
