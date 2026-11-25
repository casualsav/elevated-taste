---
pattern: ambient-wordmark-light-sweep
from: router
corpus: production
safety: production-safe
trigger: load
tags: [hero, motion]
---

## What it is

A hero whose background is an oversized, heavily-blurred brand wordmark (or any large glyph), over which a soft radial "light" blob drifts endlessly from one side to the other — as if a spotlight were raking a frosted sign. It gives the hero ambient life at rest without a gradient wash, a video, or any scroll hijacking. Foreground headline + CTAs sit on top at full contrast.

## Why it works

The motion is a single composited `transform` on one element (`translate3d` of a `radial-gradient` layer), looped with `@keyframes` — no JS, no scroll listener, no layout. `mix-blend-mode: plus-lighter` makes the light *add* to whatever it passes over, so it reads as illumination rather than a pasted shape, and the heavy `blur()` on the wordmark keeps it clearly a backdrop (never competing with the headline). Because it's slow (10–16s) and peripheral, it registers as "premium / alive" while staying ignorable — and it degrades cleanly: under reduced motion the light parks at center as a static glow.

## Reference implementation

```html
<section class="hero">
  <div class="hero__stage" aria-hidden="true">
    <span class="hero__wordmark">Router</span>
    <span class="hero__light"></span>
  </div>
  <div class="hero__content">
    <p class="hero__eyebrow">Router.com saves you time and money</p>
    <h1 class="hero__title">Cut inference costs in seconds</h1>
    <a class="hero__cta" href="#">Get the API Key</a>
  </div>
</section>

<style>
  .hero {
    position: relative;
    overflow: hidden;
    background: var(--color-bg, #fff);
    color: var(--color-fg, #1a1919);
    container-type: size;           /* cqw/cqh for resolution-independent sizing */
    min-height: 80vh;
    display: grid;
    place-items: center;
  }

  /* non-interactive backdrop */
  .hero__stage {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .hero__wordmark {
    position: absolute;
    left: 50%;
    bottom: -6%;
    transform: translateX(-50%);
    font-size: 40cqw;               /* tracks the container, not the viewport */
    font-weight: var(--weight-regular, 400);
    line-height: 1;
    letter-spacing: var(--tracking-display, -0.022em);
    color: var(--color-subtle, #86837e);
    opacity: 0.22;
    filter: blur(clamp(12px, 3.5cqw, 54px));
    user-select: none;
  }

  /* the sweeping light */
  .hero__light {
    position: absolute;
    top: 0;
    left: 0;
    width: 55cqw;
    aspect-ratio: 1;
    border-radius: var(--radius-full, 9999px);
    background: radial-gradient(
      55% 55% at 45% 50%,
      var(--hero-light, rgba(255,255,255,0.9)) 0%,
      rgba(255,255,255,0) 100%
    );
    mix-blend-mode: plus-lighter;
    will-change: transform;
    transform: translate3d(-40cqw, 55cqh, 0);
    animation: wordmark-light-sweep 14s cubic-bezier(0.42, 0, 0.58, 1) infinite;
  }

  @keyframes wordmark-light-sweep {
    0%        { transform: translate3d(-40cqw, 55cqh, 0); }
    56%, 100% { transform: translate3d(100cqw, 55cqh, 0); }
  }

  .hero__content { position: relative; z-index: 1; text-align: center; max-width: var(--container-content, 720px); }
  .hero__eyebrow { font-family: var(--font-mono); font-size: var(--text-xs, 0.75rem); letter-spacing: var(--tracking-caps, 0.06em); text-transform: uppercase; color: var(--color-muted, #6d6a65); }
  .hero__title   { font-size: clamp(2.5rem, 7cqw, 4rem); line-height: var(--leading-tight, 1.1); letter-spacing: var(--tracking-display, -0.022em); }

  /* MANDATORY: park the light as a static glow, drop the blur-heavy motion */
  @media (prefers-reduced-motion: reduce) {
    .hero__light { animation: none; transform: translate3d(30cqw, 55cqh, 0); }
  }
</style>
```
