---
pattern: scroll-camera-rail
from: rauno
corpus: production
safety: spectacle-only
trigger: scroll-progress
tags: [motion, navigation, portfolio, canvas, horizontal-scroll, hero]
---

## What it is

A set of peer objects — portfolio pieces, chapters, product shots — laid out on one horizontal rail of fixed-aspect frames. Instead of scrolling the rail, the page treats scroll as a **camera**: an empty, invisible spacer element gives the document real scroll length, and a `position: fixed` stage reads that scroll offset every frame and writes a single `transform: translate(...) scale(...)`. Scrolling therefore *pans* along the rail and *pulls the camera back*, so the further you go the more of the whole collection you can see at once. Underneath it is a plain, natively-scrollable flex row — which is exactly what touch devices, keyboard users, and anyone with `prefers-reduced-motion: reduce` get instead.

## Why it works

The load-bearing idea is **not hijacking scroll**. Cancelling wheel events and driving position from a `wheel` handler destroys inertia, keyboard scrolling, find-on-page, and the scrollbar. Here the document is genuinely long — a `pointer-events: none` ghost div supplies the height/width — so every native input still works and you only ever *read* `scrollY` as a camera coordinate. One composited `transform` on one element does all the work: no layout, no paint, no per-frame style recalculation on the frames themselves.

Publishing the camera scale as a custom property (`--zoom`) is what makes the rest composable: captions, markers and handles subscribe to it and counter-scale themselves (see `counter-scaled-chrome`), so the world zooms while the UI does not.

The cost is real and this is why it's tagged spectacle-only: the scroll axis is remapped, the scrollbar is gone, and a scroll-linked zoom is a classic vestibular trigger. Build the native rail first and layer the camera on top of it, gated on both `prefers-reduced-motion: no-preference` and `(pointer: fine)`. Then a failure of the enhancement is just a horizontal scroller, not a broken page. Pair it with a visible position readout (`index-rail-scroll-progress`) since you have taken the scrollbar away.

## Reference implementation

```html
<!-- framework-neutral; house tokens + inline fallbacks for frame geometry -->
<style>
  .rail-root {
    --frame-w: 1200px;              /* the frame's authored width  */
    --gutter: 40px;                 /* rail gutter between frames  */
    --zoom: 1;                      /* published by JS; consumed by chrome */
    --zoom-near: 0.9;               /* camera scale at scroll start */
    --zoom-far: 0.6;                /* camera scale at scroll end   */
  }

  /* 1. BASE: a real horizontal scroller. This is the whole component without JS. */
  .rail {
    display: flex;
    gap: var(--gutter, 40px);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-inline: var(--space-6, 2rem);
    background: var(--color-bg);
  }
  .frame {
    flex: 0 0 auto;
    width: min(var(--frame-w, 1200px), 88vw);
    aspect-ratio: 5 / 3;            /* 1200 x 720 */
    background: var(--color-surface);
    scroll-snap-align: center;
    position: relative;
  }
  .frame:focus-visible {
    outline: 4px solid var(--color-focus);
    outline-offset: 4px;
  }

  /* 2. ENHANCED: JS sets data-camera="on" only when it is safe to do so. */
  .rail-root[data-camera="on"] .ghost {
    /* the scroll well: invisible, uninteractive, purely a source of scroll length */
    pointer-events: none;
    user-select: none;
    width: 1px;
    /* height = rail length + one viewport, set inline by JS */
  }
  .rail-root[data-camera="on"] .rail {
    position: fixed;
    top: 50%;
    left: 0;                        /* the camera's x lives in the transform, not here */
    overflow: visible;
    scroll-snap-type: none;
    padding-inline: 0;
    width: max-content;
    transform-origin: 0 50%;
    /* the ONE property scroll drives; translate is written inline by JS */
    will-change: transform;
  }

  /* 3. A fixed reticle that stays legible over any frame colour. */
  .reticle {
    position: fixed;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    width: 20px;
    height: 20px;
    mix-blend-mode: difference;     /* inverts against whatever is beneath */
    pointer-events: none;
  }

  /* 4. MANDATORY: reduced motion never gets the camera. */
  @media (prefers-reduced-motion: reduce) {
    .rail-root[data-camera="on"] .rail { position: static; transform: none; }
    .rail-root[data-camera="on"] .ghost { display: none; }
    .reticle { display: none; }
  }
</style>

<div class="rail-root">
  <div class="ghost" aria-hidden="true"></div>
  <div class="rail">
    <a class="frame" href="/work/one" aria-label="Project One">…</a>
    <a class="frame" href="/work/two" aria-label="Project Two">…</a>
    <!-- one frame per object -->
  </div>
  <svg class="reticle" aria-hidden="true" viewBox="0 0 20 20">
    <path d="M10 0v20M0 10h20" stroke="#fff" stroke-width="1.5" />
  </svg>
</div>

<script>
  const root  = document.querySelector('.rail-root');
  const rail  = root.querySelector('.rail');
  const ghost = root.querySelector('.ghost');

  const safe = matchMedia('(prefers-reduced-motion: no-preference)').matches
            && matchMedia('(pointer: fine)').matches;

  if (safe) {
    const css   = getComputedStyle(root);
    const near  = parseFloat(css.getPropertyValue('--zoom-near'));
    const far   = parseFloat(css.getPropertyValue('--zoom-far'));

    root.dataset.camera = 'on';

    // Give the document real scroll length: rail width (at the far zoom) + one viewport.
    // Native scrollbar, inertia, arrow keys and PageDown all keep working.
    const measure = () => {
      const travel = rail.scrollWidth * far - innerWidth;
      ghost.style.height = `${Math.max(travel, 0) + innerHeight}px`;
      draw();
    };

    let ticking = false;
    const draw = () => {
      ticking = false;
      const max = ghost.offsetHeight - innerHeight;
      const t   = max > 0 ? Math.min(scrollY / max, 1) : 0;   // 0 → 1 camera progress

      const zoom = near + (far - near) * t;                   // pull back as you go
      const x    = -(rail.scrollWidth * zoom - innerWidth) * t;

      root.style.setProperty('--zoom', zoom);                 // chrome subscribes to this
      rail.style.transform = `translate(${x}px, -50%) scale(${zoom})`;
    };

    addEventListener('scroll', () => {
      // read scrollY once, write once, next frame — never style-read inside the handler
      if (!ticking) { ticking = true; requestAnimationFrame(draw); }
    }, { passive: true });
    addEventListener('resize', measure);
    measure();
  }
</script>
```

Two rules the original site breaks and you should not: it never queries `prefers-reduced-motion`, and it ships `user-scalable=no` on the viewport meta. Keep pinch-zoom, and let reduced-motion users have the plain rail above — it loses nothing but the camera.
