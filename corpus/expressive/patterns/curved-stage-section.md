---
pattern: curved-stage-section
from: cuberto
corpus: expressive
safety: production-safe
tags: [section, content-section, portfolio, transition, theme-switch]
---

## What it is

A full-bleed dark "stage" panel that the light page appears to **curl up into**: the section has large top-corner radii (here ~72px) and a near-black ground (`#161616`) carrying inverted white text, so the transition from the white page above reads as the page lifting into a separate viewing room. Cuberto uses it to hold the entire "Featured projects" gallery and the footer — one continuous dark slab — while the hero and "what we do" copy stay on white. The corners round only at the *top* (the panel runs to the bottom of the document), so it looks like a sheet being peeled up at the seam.

## Why it works

It does a theme switch (light to dark) and a section boundary in a single move, with **no divider line, gradient, or shadow** — the curved seam plus the value flip is the boundary. Inverting to dark also serves the content: project thumbnails (bright UI screens, product renders) pop far harder against black than against white, so the stage both frames the work and isolates it from the editorial copy. Because it's just a background color + `border-radius` on a normal block, it is fully production-safe: crawlable, keyboard-neutral, zero JS, and degrades to a plain dark section if radius is unsupported. The transferable rule: when a content type needs a different mood from the surrounding page (gallery, pricing, testimonial wall), give it its own grounded panel and mark the seam with geometry (a large corner radius) rather than a rule line — geometry reads as intentional, a `<hr>` reads as default.

## Reference implementation

```html
<style>
  .page { background: var(--color-bg); color: var(--color-fg); }

  .stage {
    background: var(--color-surface);      /* near-black stage ground */
    color: var(--color-bg);                /* inverted text */
    /* curl the seam where the light page meets the stage */
    border-top-left-radius: var(--radius-2xl, 24px);   /* ~72px */
    border-top-right-radius: var(--radius-2xl, 24px);
    padding: var(--space-9) var(--space-7) var(--space-8); /* roomy interior */
    /* pull up slightly so the white page tucks behind the rounded lip */
    margin-top: calc(-1 * var(--space-5));
    position: relative;
  }

  .stage__title {
    font-family: var(--font-sans);
    font-size: var(--text-5xl);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-tight);
    line-height: var(--leading-tight);
    margin: 0 0 var(--space-7);
  }

  .stage__muted { color: var(--color-muted); }      /* #888 captions on dark */

  @media (max-width: 768px) {
    .stage {
      border-top-left-radius: var(--radius-xl);
      border-top-right-radius: var(--radius-xl);
      padding: var(--space-8) var(--space-5) var(--space-7);
    }
  }
</style>

<main class="page">
  <section class="intro"><!-- white editorial copy / hero --></section>

  <section class="stage">
    <h2 class="stage__title">Featured projects</h2>
    <!-- gallery cards live here, bright imagery against the dark ground -->
  </section>
</main>
```

> Token note: this pattern needs one radius larger than the house `--radius-xl` (16px). Add a `--radius-2xl: 72px` (or reuse the project's largest panel radius) rather than hard-coding `72px` in the rule.
