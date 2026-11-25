---
pattern: multi-band-nav-retheme
from: mercury
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [navigation, motion]
---

## What it is

A sticky top nav that **re-themes per section** as the page scrolls through alternating full-bleed bands of different background color. Over the photographic hero it is transparent with light links; on a dark band it goes solid dark; on a light band it crossfades to solid light with dark links. Each band declares its own theme; the nav simply adopts whichever band it currently overlaps. (Probe: `nav background rgba(0,0,0,0)→rgb(23,23,33)`, `position: sticky/fixed`, per-link `color` targets.)

## Why it works

This generalizes the classic two-state "overlay nav inverts after the hero" (see `scroll-invert-overlay-nav`) into an **N-band** system for pages that flip background color several times. Instead of detecting contrast per-pixel or hard-coding one threshold, you drop a zero-height **sentinel** at the top of each band carrying that band's theme; an IntersectionObserver fires as each sentinel crosses the nav line and copies its theme onto the nav. The nav is therefore always legible against whatever it floats over, with **zero per-frame JS** — only `background-color`/`color` transitions on a single element. It degrades cleanly: with no JS (or reduced-motion) the nav defaults to a solid, always-legible theme.

## Reference implementation

```html
<!-- framework-neutral; tokens from /tokens/mercury.json -->
<header class="nav" id="nav" data-theme="onDark">
  <nav class="nav__inner">
    <a class="nav__brand" href="/">MERCURY</a>
    <ul class="nav__links">
      <li><a href="/products">Products</a></li>
      <li><a href="/pricing">Pricing</a></li>
    </ul>
    <a class="nav__cta" href="/open">Open account</a>
  </nav>
</header>

<!-- one sentinel per band, carrying that band's nav theme -->
<section class="band band--hero"><span class="nav-sentinel" data-nav-theme="overHero"></span> … </section>
<section class="band band--dark"><span class="nav-sentinel" data-nav-theme="onDark"></span> … </section>
<section class="band band--light"><span class="nav-sentinel" data-nav-theme="onLight"></span> … </section>

<style>
  .nav {
    position: sticky; top: 0; z-index: 50;
    transition: background-color var(--duration-slow) var(--ease-entrance), color var(--duration-slow) var(--ease-entrance);
  }
  .nav__links a, .nav__brand { color: inherit; transition: color var(--duration-slow) var(--ease-entrance); }

  /* Three themes the nav can adopt. Default (no-JS / reduced-motion) is a solid, safe one. */
  .nav[data-theme="overHero"] { background: transparent;               color: var(--color-fg); }
  .nav[data-theme="onDark"]   { background: var(--color-bg-dark);   color: var(--color-fg); }
  .nav[data-theme="onLight"]  { background: var(--color-surface);  color: var(--color-fg); }

  .nav__cta {
    background: var(--color-accent-iris, #5266eb); color: #fff;
    padding: var(--space-8) var(--space-4); border-radius: 9999px;
  }

  /* Reduced-motion: keep the re-theme (it's a legibility feature, not decoration) but make it instant */
  @media (prefers-reduced-motion: reduce) {
    .nav, .nav__links a, .nav__brand { transition: none; }
  }
</style>

<script>
  const nav = document.getElementById('nav');
  // Watch the nav line: fire when a sentinel crosses the top ~1px strip under the nav.
  const io = new IntersectionObserver((entries) => {
    // last sentinel currently intersecting the nav line wins
    for (const e of entries) {
      if (e.isIntersecting) nav.dataset.theme = e.target.dataset.navTheme;
    }
  }, { rootMargin: '-64px 0px -100% 0px', threshold: 0 });   // -64px ≈ nav height
  document.querySelectorAll('.nav-sentinel').forEach((s) => io.observe(s));
</script>
```

> Pure-CSS variant: if you can target modern browsers, replace the script with a scroll-driven `animation-timeline: scroll()` that swaps the nav's custom properties at each band boundary — same effect, no JS. Keep the `data-theme="onDark"` default so the nav is legible before any timeline resolves.
