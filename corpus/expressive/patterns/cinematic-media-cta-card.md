---
pattern: cinematic-media-cta-card
from: saronic
corpus: expressive
safety: production-safe
tags: [hero, feature-section, brand-experience]
---

## What it is
A full-bleed media section (a product render, photo, or video filling the viewport) with copy held inside a **small, solid, corner-anchored card** rather than floating centered over the imagery. The card is either the brand's loud accent (acid-green) or a flat surface tint; it carries a mono eyebrow label, a short humanist headline, and one CTA. It reads like a spec callout stamped onto a film still.

## Why it works
Centered text over busy media forces a full-frame scrim that mutes the image. A small opaque card instead **sacrifices one corner** to guarantee contrast while leaving 70%+ of the render uncompromised — the photography stays the hero. The card is a fixed, repeatable content slot, so several cinematic sections share one rhythm. Pairing a tracked **mono label** (technical register) with a **humanist headline** (human register) inside the same block is what makes it feel engineered rather than decorative. No magic: a CSS grid places the card in any corner.

## Reference implementation
```html
<section class="cine">
  <img class="cine__media" src="vessel.jpg" alt="Autonomous surface vessel underway" />
  <article class="cine__card">
    <p class="cine__eyebrow">VESSELS</p>
    <h2 class="cine__title">View our hardware and software specifications.</h2>
    <a class="cine__cta" href="/specs">SPECIFICATIONS →</a>
  </article>
</section>

<style>
  .cine {
    position: relative;
    min-height: 100svh;
    display: grid;
    /* card lands bottom-right; swap areas to move it */
    grid-template-columns: 1fr minmax(20rem, 28rem);
    grid-template-rows: 1fr auto;
    padding: var(--space-4);
    background: var(--color-bg);
  }
  .cine__media {
    position: absolute; inset: 0;
    width: 100%; height: 100%; object-fit: cover;
    z-index: 0;
  }
  .cine__card {
    grid-column: 2; grid-row: 2; align-self: end;
    z-index: 1;
    background: var(--accent-action, #ACFF24);   /* or var(--color-surface) for a quiet card */
    color: var(--color-fg);
    padding: var(--space-3);
    border-radius: var(--radius-sm);     /* 4px — sharp, not pill */
    display: grid; gap: var(--space-3);
  }
  .cine__eyebrow {
    font-family: var(--font-mono);
    font-size: var(--text-xs);       /* 0.75rem */
    letter-spacing: 0.08em; text-transform: uppercase;
    margin: 0;
  }
  .cine__title {
    font-family: var(--font-sans);
    font-size: var(--text-xl);          /* ~1.76rem */
    font-weight: 400; line-height: 1.2; margin: 0;
  }
  .cine__cta {
    justify-self: start;
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    letter-spacing: 0.06em; text-transform: uppercase;
    padding: var(--space-2) var(--space-3);
    border: 1px solid currentColor; border-radius: var(--radius-sm);
    text-decoration: none; color: inherit;
    transition: transform var(--duration-fast) var(--ease-standard);
  }
  .cine__cta:hover { transform: scale(1.02); }   /* restrained micro-lift */

  @media (max-width: 48rem) {
    .cine { grid-template-columns: 1fr; }
    .cine__card { grid-column: 1; }
  }
  @media (prefers-reduced-motion: reduce) {
    .cine__cta { transition: none; }
  }
</style>
```
