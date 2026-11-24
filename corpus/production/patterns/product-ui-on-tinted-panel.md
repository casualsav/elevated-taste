---
pattern: product-ui-on-tinted-panel
from: warp
corpus: production
safety: production-safe
tags: [feature-section, product-marketing, interactive-showcase, layout]
---

## What it is
A repeating feature section split into a fixed two-column contract: a *text rail* (short mono eyebrow → display heading → 2-line muted body → small mono pill button) and a *visual rail* holding a real product screenshot/UI card that **floats with soft elevation on a flat, pale-tint panel** (Warp uses #f6f1ff lavender). The same shape repeats down the whole page; only the copy and the image-side alternate. The tint panel is a calm, flat color (no gradient) whose only job is to lift the product card off the warm-white page and give every feature a consistent stage.

## Why it works
Locking each feature to one template turns the layout into invisible infrastructure: the reader learns the shape once and then spends all attention on the differentiating content, so a long multi-feature page scans fast and feels authored rather than assembled. Floating the *actual app* (not abstract art) on a quiet tint is the strongest possible proof for a product — it says "this is real and shippable" — while the flat tint + soft shadow supplies just enough figure/ground separation to read as "elevated screen" without the noise of a heavy card border or drop shadow on the body canvas. Alternating the image side keeps the repetition from feeling like a list. The mechanism transfers to any product-marketing page with several capabilities to show: pick one feature template, use a single flat tint family for the visual stage, always show real UI, and alternate sides for rhythm. Constraints: keep the tint subtle (a wash, not a brand block) so it doesn't compete with the screenshot; reserve elevation shadow for the floating card only; lazy-load the (often large) product images and give them an aspect-ratio box to protect CLS/LCP; the text rail's 2-line body is a discipline — if it needs more, the feature is two features.

## Reference implementation
```html
<section class="feat">
  <div class="feat__text">
    <p class="feat__eyebrow">Access any model</p>
    <h2 class="feat__title">Access any model with the Warp Agent</h2>
    <p class="feat__body">
      A state-of-the-art harness with multi-agent orchestration, model routing,
      and granular permission controls.
    </p>
    <a class="feat__cta" href="#">Meet Warp Agent</a>
  </div>

  <div class="feat__stage">
    <figure class="feat__card">
      <img src="/agent-ui.png" alt="Warp Agent run list" loading="lazy" width="1200" height="760">
    </figure>
  </div>
</section>

<style>
  .feat {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
    gap: var(--space-8);
    align-items: center;
    max-width: var(--container-xl);
    margin-inline: auto;
    padding-block: var(--space-9);            /* airy section rhythm */
  }
  /* alternate the image side every other section */
  .feat:nth-of-type(even) .feat__text  { order: 2; }
  .feat:nth-of-type(even) .feat__stage { order: 1; }

  .feat__eyebrow {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--color-subtle);
    margin: 0 0 var(--space-4);
  }
  .feat__title {
    font-family: var(--font-sans);
    font-weight: var(--weight-regular);       /* scale, not weight */
    font-size: var(--text-3xl);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--color-fg);
    margin: 0;
    text-wrap: balance;
  }
  .feat__body {
    font-family: var(--font-sans);
    font-size: var(--text-base);
    line-height: var(--leading-normal);
    color: var(--color-muted);
    max-width: var(--container-content);
    margin: var(--space-4) 0 var(--space-5);
  }
  .feat__cta {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-sm);
    background: var(--color-fg);
    color: var(--color-bg);
    text-decoration: none;
    transition: opacity var(--duration-fast) var(--ease-standard);
  }
  .feat__cta:hover { opacity: 0.88; }

  /* the flat pale-tint stage */
  .feat__stage {
    background: var(--color-surface);         /* a subtle wash; flat, no gradient */
    border-radius: var(--radius-lg);
    padding: var(--space-7);
  }
  /* the floating real-product card */
  .feat__card {
    margin: 0;
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-lg);             /* elevation lives only on the card */
  }
  .feat__card img { display: block; width: 100%; height: auto; aspect-ratio: 1200 / 760; }

  @media (max-width: 768px) {
    .feat { grid-template-columns: 1fr; gap: var(--space-6); }
    .feat:nth-of-type(even) .feat__text,
    .feat:nth-of-type(even) .feat__stage { order: initial; }   /* text-first stack */
    .feat__title { font-size: var(--text-2xl); }
  }
</style>
```
