---
pattern: webgl-thumbnail-sphere
from: cubiflow
corpus: expressive
safety: spectacle-only
tags: [hero, portfolio, gallery, 3d, navigation]
---

## What it is
The entire hero is a single floating 3D sphere built from project thumbnails distributed evenly over its surface (a Fibonacci / golden-spiral point layout), set against a near-empty canvas with a faint particle field. The sphere auto-rotates slowly; the user can drag to spin it and click a thumbnail to open a case. Browsing the work *is* the landing page — there is no headline, no copy, no scroll narrative. It is "spectacle-only": the visual lives in WebGL and is invisible to crawlers, keyboards, and reduced-motion users, so it must be layered on top of a real DOM gallery rather than replacing one.

## Why it works
Concentrating 100% of attention on one moving object over a silent off-white field makes the sphere unmistakably the subject — there is nothing to compete with, so even ~50 items read as a single calm focal point instead of a busy grid. The even spherical distribution gives a sense of abundance ("look how much work there is") while the slow rotation invites interaction without demanding it. The transferable mechanism is *latent density*: instead of stacking many items in a 2D grid (high visual density), you pack them into one navigable object (low visual density, high information density) — premium because the page feels empty yet rewards exploration. Critically, it only works if the surrounding UI is aggressively quiet.

## Reference implementation
```html
<!--
  Framework-neutral progressive-enhancement skeleton.
  Baseline = a real, crawlable, focusable DOM gallery (always present).
  Enhancement = WebGL sphere mounted over it ONLY when the device can
  handle it and the user hasn't asked to reduce motion. Tokens from /tokens.
  The 3D rendering itself (three.js / regl / raw WebGL) is intentionally
  out of scope — the point is the enhancement *contract*, not the renderer.
-->
<section class="stage" aria-label="Selected work">
  <!-- 1. SEO + a11y baseline: real links, real images, real text -->
  <ul class="work-fallback" id="work">
    <li><a href="/work/aurora">
      <img src="/thumbs/aurora.jpg" alt="Aurora — brand & site" loading="lazy">
      <span>Aurora</span>
    </a></li>
    <li><a href="/work/monsoon">
      <img src="/thumbs/monsoon.jpg" alt="Monsoon — product UI" loading="lazy">
      <span>Monsoon</span>
    </a></li>
    <!-- …one <li><a> per project: the canonical, indexable list… -->
  </ul>

  <!-- 2. WebGL mount target, empty until JS decides it's safe -->
  <canvas class="stage__gl" aria-hidden="true"></canvas>
</section>

<style>
  .stage {
    position: relative;
    min-block-size: 100svh;
    background: var(--color-bg);          /* off-white instrument canvas */
    color: var(--color-fg);
  }
  /* Baseline gallery: simple, accessible grid that ships to everyone. */
  .work-fallback {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: var(--space-5);
    margin: 0;
    padding: var(--space-8) var(--space-6);
    list-style: none;
    font-family: var(--font-mono);
    font-size: var(--text-xs);
  }
  .work-fallback a { color: inherit; text-decoration: none; }
  .work-fallback img {
    inline-size: 100%;
    aspect-ratio: 16 / 10;
    object-fit: cover;
    border: 1px solid var(--color-fg);    /* hairline ink frame */
    border-radius: var(--radius-sm);
  }

  .stage__gl {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    display: none;                        /* off until enhanced */
  }

  /* When JS confirms capability + motion-OK, swap baseline for spectacle. */
  .stage[data-enhanced="true"] .stage__gl      { display: block; }
  .stage[data-enhanced="true"] .work-fallback  {
    position: absolute;                   /* keep in DOM for crawlers/SR… */
    clip-path: inset(50%);                /* …but visually hidden */
    white-space: nowrap;
  }

  @media (prefers-reduced-motion: reduce) {
    /* Never auto-spin; the DOM grid is the experience. */
    .stage[data-enhanced="true"] .stage__gl     { display: none; }
    .stage[data-enhanced="true"] .work-fallback { position: static; clip-path: none; }
  }
</style>

<script type="module">
  const stage = document.querySelector('.stage');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canEnhance =
    !reduceMotion &&
    matchMedia('(pointer: fine)').matches &&          // desktop-style input
    !!document.createElement('canvas').getContext('webgl');

  if (canEnhance) {
    // mountSphere() reads the same <a><img> nodes, places them on a
    // Fibonacci sphere, and uses the house easing for spin/settle:
    //   ease = var(--ease-entrance) equivalent, duration var(--duration-slow)+.
    // Each 3D thumbnail must mirror its <a> href + alt for parity.
    // '/sphere.js' is the consuming site's own renderer module (it must
    // export { mountSphere }); it does NOT ship with this recipe. The import
    // is fully guarded: if the module is missing or fails for any reason,
    // data-enhanced is never set and the DOM gallery stays the experience.
    try {
      const { mountSphere } = await import('/sphere.js');
      mountSphere(stage.querySelector('.stage__gl'), stage.querySelector('#work'));
      stage.dataset.enhanced = 'true';
    } catch {
      /* no renderer available — baseline grid remains visible */
    }
  }
</script>
```
