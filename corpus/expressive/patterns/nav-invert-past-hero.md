---
pattern: nav-invert-past-hero
from: odesza
corpus: expressive
safety: production-safe
trigger: in-view
tags: [navigation, hero, motion]
---

## What it is

A fixed header that has no background while a full-bleed hero is passing beneath it — its logo and links are drawn in the light color so they read against the image — and that flips to a solid background with inverted content the moment the hero clears the header. The flip is not a fade tied to scroll distance; it is a single threshold crossing, transitioned over ~150ms so it doesn't read as a jump cut.

## Why it works

The naive version hard-codes the threshold (`if (scrollY > 600)`), which desynchronizes the instant the hero's height changes — a different viewport, a longer headline, a mobile breakpoint. The correct threshold is a *relationship*: invert when the bottom of the hero reaches the bottom of the header. Expressed that way it needs no numbers and no breakpoint tuning.

Two implementation notes carry most of the value:

- **Observe a sentinel, don't listen to scroll.** Place a zero-height element at the hero's bottom edge and give the observer a `rootMargin` equal to the header's height. The browser reports the crossing; you never read layout on the main thread. (The original does `hero.offsetHeight` inside a scroll handler, forcing a synchronous reflow on every scroll tick.)
- **Recolor with `currentColor`.** If the logo is an inline `<svg>` filled with `currentColor`, setting one `color` on the header inverts the wordmark, the links, and the hamburger bars together. An `<img>` logo cannot do this and forces you to swap two files.

Transitioning `background-color` and `color` is cheap — neither reflows. Because the end state is a legal, fully-contrasting header, disabling the transition under reduced motion costs nothing: the header still inverts, it just does so instantly.

## Reference implementation

```html
<header class="site-nav" id="nav">
  <a class="site-nav__logo" href="/">
    <svg viewBox="0 0 100 32" aria-label="Home" role="img">
      <!-- paths use fill="currentColor" so the logo inverts with the header -->
      <path fill="currentColor" d="M0 0h100v32H0z" />
    </svg>
  </a>
  <nav class="site-nav__links">
    <a href="/store">Store</a>
    <a href="/music">Music</a>
  </nav>
</header>

<section class="hero">
  <!-- full-bleed image or video; content centered -->
  <span class="hero__sentinel" aria-hidden="true"></span>
</section>

<style>
  .site-nav {
    position: fixed;
    inset-block-start: 0;
    inset-inline: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    block-size: var(--nav-h, 80px);
    padding-inline: var(--space-4);
    background-color: transparent;
    /* over the hero: light content on the image */
    color: var(--color-fg-on-dark);
    transition:
      background-color var(--duration-fast) var(--ease-standard),
      color var(--duration-fast) var(--ease-standard);
  }

  /* past the hero: solid ground, inverted content */
  .site-nav[data-scrolled] {
    background-color: var(--color-paper, #eeeeee);
    color: var(--color-ink, #262744);
  }

  .site-nav a { color: inherit; text-decoration: none; }
  .site-nav__logo svg { display: block; inline-size: 100px; height: auto; }

  .hero {
    position: relative;
    /* raised above any pinned footer so it occludes it while on screen */
    z-index: 2;
    min-block-size: 100svh;
    background: center / cover no-repeat var(--hero-image, url("/hero.jpg"));
  }

  /* zero-height marker pinned to the hero's bottom edge */
  .hero__sentinel {
    position: absolute;
    inset-block-end: 0;
    inset-inline-start: 0;
    block-size: 1px;
    inline-size: 100%;
  }

  @media (prefers-reduced-motion: reduce) {
    .site-nav { transition: none; }
  }
</style>

<script>
  const nav = document.getElementById('nav');
  const sentinel = document.querySelector('.hero__sentinel');
  const navHeight = nav.offsetHeight; // read once, not per scroll tick

  // Shrink the viewport by the header's height: the sentinel leaves the
  // observed box exactly when the hero's bottom edge meets the header's.
  const observer = new IntersectionObserver(
    ([entry]) => nav.toggleAttribute('data-scrolled', !entry.isIntersecting),
    { rootMargin: `-${navHeight}px 0px 0px 0px`, threshold: 0 }
  );
  observer.observe(sentinel);
</script>
```
