---
pattern: inset-canvas-stage
from: lusion
corpus: expressive
safety: production-safe
tags: [hero, hero-spectacle, interactive-showcase, 3d, layout]
---

## What it is
A hero where the spectacle is **contained, not full-bleed**: a single dark, rounded-corner "viewport" is inset into a calm light page with a uniform margin on all sides, and an interactive scene (here a tumbling 3D cluster, but equally a video, a product viewer, or a canvas demo) lives *inside* that rectangle. Page chrome and a short headline sit on the light field around it. The result reads as a deliberate object on a website rather than a WebGL gate that has swallowed the window — the DOM, copy, and navigation stay outside the canvas and fully legible.

## Why it works
Two-surface figure/ground does the work: a near-black stage embedded in a near-white page gives the scene maximum contrast while keeping all *text* on the readable light surface, so you get "3D hero" drama without committing the whole UI to dark mode. Because the heavy content is one element, it's also the safe way to ship spectacle: you can lazy-mount the canvas, gate it behind `prefers-reduced-motion`, and drop in a static poster image as a fallback — the surrounding page never depends on it. The dark is *rationed* to exactly one rectangle, which is why the page still feels calm and minimalist despite the motion.

## Reference implementation
```html
<section class="stage-hero">
  <header class="stage-chrome">
    <span class="wordmark">LUSION</span>
    <p class="lead">We create 3D visual storytelling and interactive web experiences.</p>
  </header>

  <figure class="stage">
    <!-- swap <video>/<model-viewer>/<canvas> in; poster shows for no-JS / reduced-motion -->
    <img class="stage-poster" src="/hero-poster.jpg" alt="3D type sculpture" />
    <canvas class="stage-canvas" aria-hidden="true"></canvas>
  </figure>
</section>

<style>
  .stage-hero {
    min-height: 100svh;
    background: var(--color-bg);          /* lavender-white page */
    padding: var(--space-5);              /* uniform inset margin around the stage */
    display: grid;
    grid-template-rows: auto 1fr;
    gap: var(--space-5);
  }

  .stage-chrome {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--space-6);
    padding-inline: var(--space-4);
  }
  .wordmark {
    font-family: var(--font-sans);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-wide);
  }
  .lead {
    max-width: 40ch;
    font-size: var(--text-lg);
    line-height: var(--leading-snug);
    color: var(--color-fg);
  }

  /* the contained dark viewport — the only dark surface on the page */
  .stage {
    position: relative;
    margin: 0;
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: var(--color-stage-bg, #2b2e3a);    /* dark slate, rationed to this box */
    isolation: isolate;
  }
  .stage-poster,
  .stage-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .stage-canvas { opacity: 0; transition: opacity var(--duration-slow) var(--ease-standard); }
  /* JS adds .is-live once the scene is mounted */
  .stage.is-live .stage-canvas { opacity: 1; }
  .stage.is-live .stage-poster { opacity: 0; }

  /* honour reduced motion: never mount the live canvas, keep the poster */
  @media (prefers-reduced-motion: reduce) {
    .stage-canvas { display: none; }
  }
</style>
```

Notes: the only dark color (`--color-stage-bg`) is confined to `.stage`; everything else uses the page surfaces. Keep the inset margin equal on all sides so the stage reads as a centered object. Gate the canvas behind a mount flag and reduced-motion so the poster covers no-JS, crawler, and accessibility cases for free.
