---
pattern: feature-card-grid
from: stripe
corpus: production
safety: production-safe
tags: [feature-section, case-studies, bento, card-grid, solutions]
---

## What it is

A responsive grid of equal-radius "bento" tiles used to present many parallel items — product features, solutions, or customer case studies. Each tile has a **full-bleed media region on top** (product screenshot, illustration, or brand gradient) and a **fixed text plinth on the bottom**: a short ink title, a line or two of muted description, and a colored "Read X story ›" / "Learn more ›" link. Stripe runs a 4-up row of case-study tiles, then breaks rhythm with an asymmetric 2-up row of promo tiles — all sharing the same radius and gap so the variation reads as intentional, not broken.

## Why it works

A uniform tile shell turns a heterogeneous list (different logos, different copy lengths, different art) into a single calm visual system; the eye scans titles and links, not chrome. Putting the link at a consistent bottom position gives every card the same affordance anchor, so users learn the interaction once. Mixing column spans within one grid (4-up → 2-up) creates editorial rhythm and lets you spotlight promos without escaping the layout — far better than stacking visually distinct one-off sections. Flat cards (tiny radius, no/low shadow) keep attention on the media and copy. The pattern transfers to any "grid of offerings" surface: features, integrations, blog indexes, pricing add-ons.

## Reference implementation

```html
<style>
  .fcg {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-5);
    max-width: var(--container-xl);
    margin-inline: auto;
  }
  .fcg-card {
    display: flex;
    flex-direction: column;
    border-radius: var(--radius-md);
    background: var(--color-surface);
    overflow: hidden;
  }
  .fcg-media {
    aspect-ratio: 4 / 3;
    background: var(--color-surface-2);            /* swap for img / gradient */
    background-size: cover;
    background-position: center;
  }
  .fcg-body {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    padding: var(--space-5);
  }
  .fcg-title {
    font-family: var(--font-sans);
    font-size: var(--text-md);
    line-height: var(--leading-snug);
    color: var(--color-fg);
  }
  .fcg-desc {
    font-size: var(--text-sm);
    line-height: var(--leading-normal);
    color: var(--color-muted);
  }
  .fcg-link {
    margin-top: auto;                               /* pin link to bottom */
    font-size: var(--text-sm);
    color: var(--color-accent);
    text-decoration: none;
  }
  .fcg-link::after { content: " \203A"; }           /* › */

  /* asymmetric promo row: two wide tiles */
  .fcg-card--wide { grid-column: span 2; }

  @media (prefers-reduced-motion: no-preference) {
    .fcg-card { transition: transform var(--duration-base) var(--ease-standard); }
    .fcg-card:hover { transform: translateY(calc(var(--space-1) * -1)); }
  }
  @media (max-width: 64rem)  { .fcg { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 40rem)  {
    .fcg { grid-template-columns: 1fr; }
    .fcg-card--wide { grid-column: span 1; }
  }
</style>

<section class="fcg">
  <article class="fcg-card">
    <div class="fcg-media" style="background-image:url(/img/lovable.png)"></div>
    <div class="fcg-body">
      <h3 class="fcg-title">Lovable grows into a vibe-coding juggernaut with Stripe.</h3>
      <a class="fcg-link" href="/customers/lovable">Read Lovable's story</a>
    </div>
  </article>
  <!-- repeat .fcg-card ×3 for the 4-up row -->

  <article class="fcg-card fcg-card--wide">
    <div class="fcg-body">
      <h3 class="fcg-title">Stripe Startups program.</h3>
      <p class="fcg-desc">Access financial benefits, a focused community, and expert resources to help you grow your business.</p>
      <a class="fcg-link" href="/startups">Apply now</a>
    </div>
  </article>
  <!-- second .fcg-card--wide completes the asymmetric promo row -->
</section>
```
