---
pattern: pointer-follow-preview
from: joinvoy
corpus: production
safety: production-safe
trigger: hover
tags: [interaction, portfolio, list, motion]
---

## What it is

A list of rows (principles, projects, glossary entries) where hovering a row surfaces a small preview thumbnail that tracks the cursor — floating just above the pointer, fading and scaling in on enter and out on leave. One shared, `position:fixed` preview element is reused for every row, so the DOM stays flat no matter how long the list is. It is a lightweight "peek" that rewards exploration without committing the reader to a click.

## Why it works

The preview is a single fixed node moved only with `transform: translate(x, y)` — a compositor-only update, so following a fast cursor never thrashes layout. Driving position by assigning `--px/--py` (set from `pointermove`) lets CSS own the actual transform and keeps JS to two number writes per frame. Fade/scale are separate `opacity`/`transform` transitions, so enter and exit feel soft rather than snapping. Because it is gated on `(hover: hover) and (pointer: fine)` and disabled under reduced motion, touch and keyboard users simply get the plain list — the interaction is pure enhancement, never a dependency.

## Reference implementation

```html
<ul class="peek-list" aria-label="Our work">
  <li><a href="/work/alpha" data-preview="/img/alpha.avif">A longevity supplement brand</a></li>
  <li><a href="/work/beta"  data-preview="/img/beta.avif">A roadside health campaign</a></li>
  <li><a href="/work/gamma" data-preview="/img/gamma.avif">A daily running companion app</a></li>
</ul>

<!-- One shared preview, reused for every row -->
<div class="peek-preview" aria-hidden="true">
  <img alt="" />
</div>

<style>
  .peek-list a {
    display: block;
    padding: var(--space-5) 0;
    border-bottom: 1px solid var(--color-hairline);
    font-size: var(--text-xl);
    color: var(--color-fg);
    transition: color var(--duration-fast) var(--ease-standard);
  }
  .peek-list a:hover { color: var(--color-accent); }

  .peek-preview {
    position: fixed;
    left: 0; top: 0;
    width: 240px;
    height: 180px;
    z-index: 30;
    pointer-events: none;
    border-radius: var(--radius-md);
    overflow: hidden;
    opacity: 0;
    /* translate owns position (--px/--py); scale owns the pop */
    transform: translate(var(--px, 0px), var(--py, 0px)) translate(-50%, -70%) scale(0.96);
    transition: opacity var(--duration-fast) var(--ease-standard),
                transform var(--duration-base) var(--ease-standard);
    will-change: transform, opacity;
  }
  .peek-preview.is-visible {
    opacity: 1;
    transform: translate(var(--px, 0px), var(--py, 0px)) translate(-50%, -70%) scale(1);
  }
  .peek-preview img { width: 100%; height: 100%; object-fit: cover; display: block; }

  /* Enhancement only: no fine pointer, or reduced motion → no preview */
  @media (prefers-reduced-motion: reduce) {
    .peek-preview { display: none; }
  }
</style>

<script>
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (fine && !reduce) {
    const preview = document.querySelector('.peek-preview');
    const img = preview.querySelector('img');
    const list = document.querySelector('.peek-list');
    let raf = 0, x = 0, y = 0;

    const render = () => { preview.style.setProperty('--px', x + 'px');
                           preview.style.setProperty('--py', y + 'px'); raf = 0; };

    list.addEventListener('pointermove', (e) => {
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(render);   // coalesce to one write per frame
    });
    list.addEventListener('pointerover', (e) => {
      const a = e.target.closest('[data-preview]');
      if (!a) return;
      img.src = a.dataset.preview;
      preview.classList.add('is-visible');
    });
    list.addEventListener('pointerout', (e) => {
      if (!e.relatedTarget || !e.relatedTarget.closest('[data-preview]')) {
        preview.classList.remove('is-visible');
      }
    });
  }
</script>
```

Notes: all timing/color/radius come from house tokens; `--px/--py` carry inline `0px` fallbacks. The preview is `aria-hidden` and the real link text still describes each item, so screen-reader and keyboard users lose nothing. Coalescing pointer moves into one `requestAnimationFrame` write keeps it cheap even on a long list.
