---
pattern: editorial-masthead
from: corentinbernadou
corpus: expressive
safety: production-safe
tags: [hero, header, portfolio, chrome, about]
---

## What it is

A corner-anchored "magazine masthead" wrapped around a hero. Instead of one centered logo + tagline, the page edges carry print apparatus: identity (name / role) top-left, an issue/edition/reference line, a primary nav top-center with the active item brightened, an availability or status note top-right, and a small technical readout (here a `1440px × 900px` dimension) in a far corner. All of it is tiny, tight-tracked, neutral-grey text on a dark canvas, leaving the optical center free for the hero object.

## Why it works

Editorial framing borrows the authority of print: issue numbers, edition codes, and a "published" voice signal craft and intent *before* the visitor reads any content, and they make a one-page site feel like a considered artifact rather than a template. Mechanically it is also a clean **separation of chrome from content** — pushing identity, navigation, and metadata to the margins lets the center stay open for spectacle while the page still carries dense information. It is nearly free (pure text), recolors the entire tone, and is fully responsive because each corner block can collapse independently. Active-state-by-brightness keeps the nav decoration-free on a monochrome system.

## Reference implementation

```html
<style>
  .masthead {
    position: relative;
    min-height: 100vh;
    background: var(--color-bg);
    color: var(--color-muted);
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-tight);
    line-height: var(--leading-snug);
  }
  /* corner rails */
  .masthead__rail {
    position: absolute;
    top: var(--space-5);
    display: flex;
    gap: var(--space-2);
  }
  .masthead__rail--tl { left: var(--space-5); flex-direction: column; }
  .masthead__rail--tc { left: 50%; transform: translateX(-50%); gap: var(--space-4); }
  .masthead__rail--tr { right: var(--space-5); }
  .masthead__dims    { position: absolute; top: var(--space-2); left: var(--space-5); }

  .masthead__edition { color: var(--color-muted); }       /* issue / ref codes */
  .masthead__id      { color: var(--color-muted); }

  /* nav: active = brightness, not decoration */
  .masthead__nav a              { color: var(--color-muted); text-decoration: none; }
  .masthead__nav a[aria-current="page"] { color: var(--color-fg); }
  .masthead__nav a:focus-visible { outline: 2px solid var(--color-accent); outline-offset: var(--space-1); }

  .masthead__status { color: var(--color-muted); }

  /* center stage left free for the hero object */
  .masthead__stage { position: absolute; inset: 0; display: grid; place-items: center; pointer-events: none; }

  @media (max-width: 640px) {
    .masthead__rail--tc { position: static; transform: none; }
    .masthead__rail, .masthead__dims { position: static; }
    .masthead { display: flex; flex-direction: column; gap: var(--space-4); padding: var(--space-5); }
  }
</style>

<header class="masthead">
  <span class="masthead__dims">1440px × 900px</span>

  <div class="masthead__rail masthead__rail--tl">
    <span class="masthead__id">Corentin Bernadou — Freelance Developer</span>
    <span class="masthead__edition">Issue N°003 / Coll. 2026 · Ref. EDI-032026-R02</span>
  </div>

  <nav class="masthead__rail masthead__rail--tc masthead__nav" aria-label="Primary">
    <a href="#work" aria-current="page">Featured Works</a>
    <a href="#archive">Archive</a>
    <a href="#about">About</a>
  </nav>

  <div class="masthead__rail masthead__rail--tr">
    <span class="masthead__status">Available July 2026</span>
  </div>

  <div class="masthead__stage" aria-hidden="true">
    <!-- hero object (image, 3D canvas, or display wordmark) goes here -->
  </div>
</header>
```
