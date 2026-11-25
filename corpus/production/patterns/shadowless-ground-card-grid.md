---
pattern: shadowless-ground-card-grid
from: mercury
corpus: production
safety: production-safe
tags: [feature-section, cards, minimalist]
---

## What it is

A two-up (collapsing to one-up) grid of feature cards where each card is a rounded **media tile** (image / muted autoplay video / soft gradient) stacked above a short label and one-line description. Crucially there are **no drop shadows anywhere** — the cards read as layered objects purely through *ground contrast* (a light tile on a dark band, or a dark tile on a light band), a 1px hairline, and generous corner radius.

## Why it works

Drop shadows are the default way to say "this is a card," but they add visual noise and a faint "floating sticker" feeling that undercuts a precise, engineered brand. Replacing shadow-elevation with **background contrast + hairline + radius** keeps the surface flat and calm while still clearly bounding each card. It also scales perfectly across a dual-theme page: the exact same card markup sits on a dark or a light band and stays legible because its tile inverts against the ground. The media tile carries all the visual interest, so the text block can stay quiet (no bold, generous measure), and the eye reads tile → label → description in a clean vertical rhythm.

## Reference implementation

```html
<!-- framework-neutral; tokens from /tokens/mercury.json -->
<section class="ground"><!-- ground is either dark (#171721) or light (#f4f5f9) -->
  <ul class="card-grid">
    <li class="feature-card">
      <div class="feature-card__media">
        <video src="/demo.mp4" muted loop playsinline preload="none" aria-hidden="true"></video>
      </div>
      <h3 class="feature-card__title">Team management</h3>
      <p class="feature-card__desc">Curb team spend with card limits, spend controls, and granular user permissions.</p>
    </li>
    <li class="feature-card">
      <div class="feature-card__media feature-card__media--gradient"></div>
      <h3 class="feature-card__title">Guidance</h3>
      <p class="feature-card__desc">Chat support for all customers, plus dedicated account management for those who qualify.</p>
    </li>
  </ul>
</section>

<style>
  .ground {
    background: var(--color-bg-dark);   /* swap to --color-ground-light-2 per band */
    color: var(--color-fg);
    padding-block: var(--space-112, 7rem);
    padding-inline: var(--space-6);
  }
  .card-grid {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: var(--space-40, 2.5rem);
    max-width: 1376px; margin-inline: auto;
    list-style: none; padding: 0;
  }
  .feature-card { display: flex; flex-direction: column; gap: var(--space-3); }

  /* Depth WITHOUT shadow: radius + hairline + a tile that contrasts the ground */
  .feature-card__media {
    aspect-ratio: 16 / 11;
    border-radius: var(--radius-xl);
    border: 1px solid var(--color-hairline);
    background: var(--color-surface);       /* light tile on a dark band */
    overflow: hidden;
  }
  .feature-card__media--gradient {
    background: radial-gradient(120% 120% at 50% 30%, var(--color-surface-2), var(--color-bg));
  }
  .feature-card__media > video { width: 100%; height: 100%; object-fit: cover; display: block; }

  .feature-card__title { font: 480 var(--text-lg)/1.3 var(--font-display); margin: 0; letter-spacing: 0.07px; }
  .feature-card__desc  { font: 400 var(--text-base)/1.5 var(--font-sans); color: var(--color-muted); margin: 0; max-width: 38ch; }

  @media (max-width: 720px) {
    .card-grid { grid-template-columns: 1fr; gap: var(--space-6); }
    .ground { padding-block: var(--space-72, 4.5rem); }
  }

  /* Muted autoplay video is motion — let it rest under reduced-motion */
  @media (prefers-reduced-motion: reduce) {
    .feature-card__media > video { display: none; }
  }
</style>
```
