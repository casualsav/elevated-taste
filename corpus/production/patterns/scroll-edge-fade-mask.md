---
pattern: scroll-edge-fade-mask
from: shadcn
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [motion, scroll-area, overflow]
---

## What it is

A gradient `mask-image` on the edges of a scroll container that **fades content out where it overflows and pulls it back to solid as you reach the edge** — the top fade disappears when you're scrolled to the top, the bottom fade disappears when you reach the bottom. shadcn uses it both as a scroll-area edge shadow and as the bottom-of-page dissolve where the component masonry melts into the background, signalling "there's more past this edge" without a hard cut or a heavy "see all" button. (Named after its `scroll-fade-reveal-{t,b,s,e}` keyframes.)

## Why it works

A hard edge says "this is the end"; a fade says "this continues." Tying the fade's *presence* to scroll position adds the missing affordance — the top edge is only soft when there's hidden content above it, so the fade itself communicates "you can scroll up." Done with `mask-image` (and a CSS scroll-driven `animation-timeline`), it animates only the mask/clip — compositor-friendly, no scroll-event handler, no layout thrash. It degrades cleanly: where scroll-driven animation isn't supported (or motion is reduced), a static always-on edge fade still reads correctly.

## Reference implementation

```html
<div class="scroll-fade">
  <div class="scroll-fade__viewport">
    <!-- long list / overflowing gallery / tall masonry -->
    <article>…</article><article>…</article><article>…</article>
  </div>
</div>

<style>
  .scroll-fade { position: relative; }

  .scroll-fade__viewport {
    max-height: 70vh;
    overflow-y: auto;
    /* STATIC fallback: always-on top+bottom edge fade (mask = compositor-cheap) */
    --fade: 48px;
    -webkit-mask-image: linear-gradient(to bottom,
      transparent 0, #000 var(--fade), #000 calc(100% - var(--fade)), transparent 100%);
            mask-image: linear-gradient(to bottom,
      transparent 0, #000 var(--fade), #000 calc(100% - var(--fade)), transparent 100%);
  }

  /* PROGRESSIVE ENHANCEMENT: drive each edge's fade by scroll position.
     Top edge solid at top, bottom edge solid at bottom — fades only where content is hidden. */
  @supports (animation-timeline: scroll()) {
    @keyframes scroll-fade-top    { 0% { -webkit-mask-position: 0 0; } 5% { -webkit-mask-position: 0 0; } 100% {} }

    .scroll-fade__viewport {
      /* two stacked masks: a top edge and a bottom edge, each animated by scroll progress */
      animation: edge-top linear both, edge-bottom linear both;
      animation-timeline: scroll(self), scroll(self);
      animation-range: 0 var(--fade), calc(100% - var(--fade)) 100%;
    }
    /* near the top, kill the top fade (mask fully opaque at the top edge) */
    @keyframes edge-top {
      from { -webkit-mask-image: linear-gradient(to bottom, #000 0, #000 100%); }
      to   { -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 var(--fade)); }
    }
    /* near the bottom, kill the bottom fade */
    @keyframes edge-bottom {
      from { mask-image: linear-gradient(to top, transparent 0, #000 var(--fade)); }
      to   { mask-image: linear-gradient(to top, #000 0, #000 100%); }
    }
  }

  /* MANDATORY reduced-motion: drop to the static symmetric fade, no scroll-linking */
  @media (prefers-reduced-motion: reduce) {
    .scroll-fade__viewport { animation: none; }
  }
</style>
```

For a **page-bottom dissolve** (the masonry melting into the background, not a scroll container), use the same idea as a fixed overlay instead:

```html
<div class="page-fade" aria-hidden="true"></div>
<style>
  .page-fade {                       /* sits over the bottom of a tall section */
    position: absolute; left: 0; right: 0; bottom: 0; height: 160px;
    pointer-events: none;
    background: linear-gradient(to bottom, transparent, var(--color-bg));
  }
</style>
```

> The scroll-driven variant is genuinely fiddly across engines — ship the **static symmetric mask** as the baseline (it's already correct and cheap), and treat the per-edge scroll-linking as enhancement behind `@supports`. Animate only `mask`/`mask-position`/`opacity`; never animate height or re-run scroll handlers per frame.
