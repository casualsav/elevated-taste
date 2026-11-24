---
pattern: scroll-invert-overlay-nav
from: quanta
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [navigation, motion, hero]
---

## What it is

A fixed top nav that rides **transparent over a full-bleed hero image** with white links and a soft gradient scrim for legibility, then **crossfades to a solid light bar with dark links** once the page scrolls past the hero. Quanta opens on a full-bleed science illustration; the nav belongs to the artwork at rest, then becomes a quiet utility bar for reading. The probe shows the mechanism plainly: a `background-shift` to white and 11 link `color` shifts from `rgb(255,255,255)`→`rgb(26,26,26)`, plus `position: fixed` pins and a `nav__gradient` scrim.

## Why it works

It resolves the perennial overlay-nav conflict — white text is legible over a dark image but invisible over the white content below. Instead of a permanently opaque bar (which crops the hero) or fragile per-pixel contrast detection, you define exactly **two states** and crossfade between them at one scroll threshold. The hero stays immersive; the nav stays legible everywhere. Driven by a CSS scroll-driven animation (or a one-line IntersectionObserver fallback) it costs **zero per-frame JS**, animates only `background-color`/`color`/`opacity`, and collapses cleanly under reduced-motion to the solid state.

## Reference implementation

```html
<!-- framework-neutral; tokens from /tokens/quanta.json -->
<header class="site-nav" id="nav">
  <div class="site-nav__scrim" aria-hidden="true"></div>
  <nav class="site-nav__inner">
    <a class="site-nav__brand" href="/">Quanta</a>
    <ul class="site-nav__links">
      <li><a href="/physics">Physics</a></li>
      <li><a href="/math">Mathematics</a></li>
      <li><a href="/biology">Biology</a></li>
    </ul>
  </nav>
</header>
<!-- a zero-height sentinel right after the hero marks the invert threshold -->
<section class="hero"><!-- full-bleed image --></section>
<span id="nav-sentinel" aria-hidden="true"></span>

<style>
  .site-nav {
    position: fixed; inset: 0 0 auto 0; z-index: 50;
    /* solid state values, applied by default for no-JS / reduced-motion safety */
    background: var(--bg, #ffffff);
    --nav-fg: var(--nav-solid-fg, #1a1a1a);
    transition: background var(--dur-5, 500ms) var(--ease-nav, cubic-bezier(0.09,0.47,0.18,0.99));
  }
  .site-nav__inner { display: flex; align-items: center; gap: var(--space-6, 24px);
    max-width: var(--container, 1160px); margin: 0 auto;
    padding: var(--space-2, 8px) var(--space-8, 32px); position: relative; z-index: 1; }
  .site-nav a { color: var(--nav-fg); text-decoration: none;
    transition: color var(--dur-5, 500ms) var(--ease-nav, cubic-bezier(0.09,0.47,0.18,0.99)); }
  .site-nav__brand { color: var(--accent, #ff8600); font-weight: 700; }
  /* gradient scrim: legibility for white text over a busy image, only in overlay state */
  .site-nav__scrim { position: absolute; inset: 0; opacity: 0;
    background: var(--nav-scrim, linear-gradient(#1a1a1a, rgba(26,26,26,0)));
    transition: opacity var(--dur-5, 500ms) var(--ease-nav, cubic-bezier(0.09,0.47,0.18,0.99)); }

  /* OVERLAY state: applied while the hero is still in view */
  .site-nav.is-overlay {
    background: transparent;
    --nav-fg: var(--nav-overlay-fg, #ffffff);
  }
  .site-nav.is-overlay .site-nav__scrim { opacity: 1; }
  .site-nav.is-overlay .site-nav__brand { color: var(--nav-overlay-fg, #ffffff); }

  @media (prefers-reduced-motion: reduce) {
    .site-nav, .site-nav a, .site-nav__scrim { transition: none; }
  }
</style>

<script>
  // Cheap, no per-frame work: one IntersectionObserver on a sentinel.
  // While the sentinel (placed just after the hero) is below the fold,
  // the hero fills the viewport top → nav is in overlay state.
  const nav = document.getElementById('nav');
  const sentinel = document.getElementById('nav-sentinel');
  const io = new IntersectionObserver(([e]) => {
    nav.classList.toggle('is-overlay', !e.isIntersecting && e.boundingClientRect.top > 0);
  }, { rootMargin: '-64px 0px 0px 0px' });  // ~nav height
  io.observe(sentinel);
  // Pure-CSS alternative (no JS): animation-timeline: scroll(); flip the
  // same custom props in @keyframes gated by prefers-reduced-motion.
</script>
```

**Note:** default the nav to its **solid** state in CSS so it is legible with JS disabled and under reduced-motion; the script only *adds* the overlay state while the hero is on screen. Crossfade `background-color`/`color`/`opacity` only — never toggle `display` or animate layout. The gradient scrim is what lets white links survive over a bright region of the hero image; keep it.
