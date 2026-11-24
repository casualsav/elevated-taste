---
pattern: route-cover-transition
from: oatly
corpus: expressive
safety: spectacle-only
trigger: load
tags: [motion, navigation, page-transition]
---

## What it is
A full-screen flat-color panel that sweeps up to cover the viewport when the user navigates, then shrinks/reveals to expose the next page. It turns a route change into a deliberate "page turn", reinforcing a print/zine brand metaphor (Oatly's keyframes: `PageTransition_fillScreen`, `_shrink`, `_darken`). One opaque panel, two transform phases — no per-element choreography.

## Why it works
The cover masks the inbound page's load/layout shift, so the transition reads as intentional craft rather than a flash of unstyled content. It animates only `transform` (`scaleY`/`translateY`) on a single fixed layer, so it stays off the layout/paint hot path. It is **spectacle-only**: it adds perceived navigation latency and a full-viewport repaint, so keep it short (≤400ms), use a flat brand color (no gradient/blur), and *always* ship the reduced-motion fallback that swaps instantly.

## Reference implementation
```html
<!-- framework-neutral vanilla JS + CSS; tokens from /tokens (oatly.json) -->
<style>
  .route-cover {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: var(--color-amber, #fdcf85);   /* flat brand swatch, no gradient */
    transform: scaleY(0);
    transform-origin: bottom;
    pointer-events: none;
    will-change: transform;
  }
  .route-cover.is-covering {                    /* phase 1: fill the screen */
    transform: scaleY(1);
    transform-origin: bottom;
    transition: transform var(--dur-2, 400ms) var(--ease-inout, ease-in-out);
  }
  .route-cover.is-revealing {                   /* phase 2: shrink away, reveal new page */
    transform: scaleY(0);
    transform-origin: top;
    transition: transform var(--dur-2, 400ms) var(--ease-inout, ease-in-out);
  }
  @media (prefers-reduced-motion: reduce) {
    .route-cover { transition: none !important; }   /* navigate with no cover at all */
  }
</style>

<div class="route-cover" id="routeCover" aria-hidden="true"></div>

<script>
  const cover = document.getElementById('routeCover');
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Intercept same-origin link clicks; cover, then navigate.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.origin !== location.origin) return;
    if (prefersReduced) return;                  // let the browser navigate normally
    e.preventDefault();
    cover.classList.add('is-covering');
    cover.addEventListener('transitionend', () => { location.href = a.href; }, { once: true });
  });

  // On the inbound page: start covered, then reveal (call on DOMContentLoaded).
  function revealInbound() {
    if (prefersReduced) return;
    cover.classList.add('is-covering');          // start fully covered (no transition jump)
    requestAnimationFrame(() => {
      cover.classList.remove('is-covering');
      cover.classList.add('is-revealing');
    });
  }
  // window.addEventListener('pageshow', revealInbound);  // wire up per your router/MPA setup
</script>
```
