---
pattern: scroll-scatter-headline
from: noth
corpus: production
safety: spectacle-only
trigger: scroll-progress
tags: [motion, hero, scroll-theater]
---

## What it is
A manifesto headline that dissolves as you scroll: the section pins to the viewport (`position: sticky; top: 0; min-height: 100vh`) over a video/photo backdrop, and each letter of the headline fades out and rotates a few degrees off-axis, tied to how far the section has scrolled through. Language visibly comes apart — a strong "beyond words / protean" beat used **once** per page.

## Why it works
Splitting the string into per-letter spans and driving each one's `opacity` and `transform: rotate()` from a single scroll-progress value (0→1) turns reading into an event. Pinning with sticky (not JS) keeps the backdrop still while the type animates, and animating only `opacity`/`transform` keeps it on the compositor. It is nonetheless **spectacle-only**: dozens of simultaneously transformed nodes cost layout/paint on weaker devices and the drifting motion can induce motion sickness — so it must be gated on `prefers-reduced-motion` and confined to one beat. The reference uses a CSS scroll-driven `animation-timeline` (no scroll handler) with a static fallback.

## Reference implementation
```html
<section class="scatter" aria-label="Studio manifesto">
  <video class="scatter__bg" autoplay muted loop playsinline poster="poster.jpg"></video>
  <h2 class="scatter__line" aria-label="We create brand experiences">
    <!-- split by JS or at build; aria-label carries the real reading order for AT -->
    <span aria-hidden="true">W</span><span aria-hidden="true">e</span>
    <!-- …one span per letter… -->
  </h2>
</section>

<style>
  .scatter { position: relative; }
  .scatter__pin {          /* wrapper the sticky rides in; give it height to scrub through */
    min-height: 200vh;
  }
  .scatter__bg {
    position: sticky; top: 0;
    width: 100%; height: 100vh; object-fit: cover; z-index: 0;
  }
  .scatter__line {
    position: sticky; top: 0;
    min-height: 100vh;
    display: flex; align-items: center; flex-wrap: wrap;
    z-index: 1;
    color: var(--color-fg-on-dark, #fff);
    font-weight: 500;
    letter-spacing: -0.01em;
  }
  .scatter__line span { display: inline-block; will-change: transform, opacity; }

  /* Scroll-driven: each letter fades + rotates as the section scrolls through view.
     Alternate rotation direction per letter via :nth-child for the scatter feel. */
  @supports (animation-timeline: view()) {
    .scatter__line span {
      animation: scatter-out linear both;
      animation-timeline: view();
      animation-range: cover 20% cover 70%;
    }
    .scatter__line span:nth-child(even) { animation-name: scatter-out-alt; }
  }
  @keyframes scatter-out {
    to { opacity: 0; transform: translateY(-0.15em) rotate(12deg); }
  }
  @keyframes scatter-out-alt {
    to { opacity: 0; transform: translateY(0.1em) rotate(-9deg); }
  }

  /* MANDATORY reduced-motion fallback: no scatter, headline simply legible. */
  @media (prefers-reduced-motion: reduce) {
    .scatter__line span { animation: none !important; opacity: 1; transform: none; }
    .scatter__bg { position: static; height: auto; }
  }
</style>
```

For browsers without `animation-timeline`, wrap the effect in an `IntersectionObserver` that toggles a class and let the same `@keyframes`/transition run once in-view (still transform/opacity only) — never attach a raw `scroll` handler that writes styles every frame. Keep the readable text in the `aria-label` so assistive tech and search never see the shredded per-letter spans.
