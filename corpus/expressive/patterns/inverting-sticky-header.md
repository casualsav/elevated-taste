---
pattern: inverting-sticky-header
from: saronic
corpus: expressive
safety: production-safe
trigger: in-view
tags: [navigation, motion]
---

## What it is
A fixed/sticky header that **flips its own color scheme** as it crosses from a dark section into a light one (and back). Over the dark hero it's light-text-on-transparent; the moment it overlaps a near-white section it becomes dark-text-on-solid-light. The chrome always reads against whatever's currently behind it, so you never need a permanent scrim or a single compromise color.

## Why it works
The flip is driven by **IntersectionObserver sentinels** — invisible markers placed at the top of each "light" region — not by a scroll-position handler. That makes it cheap (no per-frame work), resolution-independent, and declarative: each section declares its own header theme. Only `color` and `background-color` transition, both compositor-friendly. The technique generalizes to any long page that alternates background temperature; the header becomes a function of section context rather than a fixed style.

## Reference implementation
```html
<header class="site-header" data-theme="on-dark">
  <a class="brand" href="/">SARONIC</a>
  <button class="menu">MENU</button>
</header>

<section class="band" data-header="on-dark"><!-- cinematic media --></section>
<section class="band" data-header="on-light"><!-- the document slab --></section>
<section class="band" data-header="on-dark"><!-- footer media --></section>

<style>
  .site-header {
    position: fixed; inset: 0 0 auto 0; z-index: 50;
    display: flex; justify-content: space-between; align-items: center;
    padding: var(--space-2) var(--space-3);
    transition: color var(--dur-2) var(--ease-standard),
                background-color var(--dur-2) var(--ease-standard);
  }
  .site-header[data-theme="on-dark"]  { color: var(--color-fg-on-dark);  background: transparent; }
  .site-header[data-theme="on-light"] { color: var(--color-fg); background: var(--color-bg); }
  /* hairline only appears on the solid (light) state */
  .site-header[data-theme="on-light"] { box-shadow: 0 1px 0 var(--color-hairline); }

  @media (prefers-reduced-motion: reduce) {
    .site-header { transition: none; }   /* instant flip, no easing */
  }
</style>

<script>
  // tokens: --dur-2: 500ms; --ease-base: cubic-bezier(0.25, 0.25, 0, 1)
  const header = document.querySelector('.site-header');
  // Fire when a band's TOP reaches the header band: a thin top-edge trip line.
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        header.dataset.theme = e.target.dataset.header; // "on-dark" | "on-light"
      }
    }
  }, { rootMargin: '0px 0px -92% 0px', threshold: 0 });
  // -92% bottom margin collapses the viewport to a sliver at the very top,
  // so a band "intersects" only while its leading edge sits under the header.

  document.querySelectorAll('.band[data-header]').forEach(b => io.observe(b));
</script>
```
