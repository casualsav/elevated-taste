---
pattern: annotated-blueprint-hero
from: tailwindcss
corpus: production
safety: production-safe
tags: [hero, docs, product-marketing, typography, dev-tool]
---

## What it is

A hero built like a draftsman's sheet: an oversized headline and its supporting copy sit on a faint hairline grid, the dead space outside the content frame is filled with diagonal hatching, and each type block carries a small monospace annotation naming the exact styles applied to it (`text-8xl · tracking-tighter · text-balance`). Tailwind's homepage runs a 96px headline against 16px body — a 6× jump in a single 400-weight family — with the annotations rendered at 13px mono in muted grey, so they read as spec marks rather than copy.

## Why it works

Two mechanisms, both cheap.

**The annotation makes the page evidence for its own claim.** A label naming the styles applied to the very element it labels is *verifiable on sight* — the reader confirms the system works by looking, not by reading a testimonial. This transfers past utility CSS to any product whose value is a vocabulary: component libraries, design tokens, API schemas, query languages. The rule is that the annotation must be true of the thing it annotates; a decorative fake code label is worse than nothing.

**The hairline grid plus hatched gutters make the container visible.** Layout edges are normally invisible — the eye infers them. Drawing them turns "centered content" into "measured content," which is the entire mood a technical brand wants, at the cost of two CSS backgrounds and no DOM. The hatching also solves the perennial ultrawide problem: instead of an expanse of empty white beside a 1440px frame, the margins become deliberate material.

The restraint that makes it work: the grid is at ~4% alpha, the annotations never exceed 13px, and hierarchy comes entirely from the 6× scale contrast — no second weight, no color, no gradient.

## Reference implementation

```html
<style>
  .abh {
    /* hatched gutters behind the whole band … */
    background-image: repeating-linear-gradient(
      45deg,
      transparent 0 6px,
      var(--color-hairline) 6px 7px
    );
    padding-block: var(--space-9);
  }
  .abh-frame {
    /* … and a hairline blueprint grid inside the content frame */
    max-width: var(--container-xl);
    margin-inline: auto;
    padding: var(--space-6) var(--space-5);
    background-color: var(--color-bg);
    background-image:
      linear-gradient(to right, var(--color-hairline) 1px, transparent 1px),
      linear-gradient(to bottom, var(--color-hairline) 1px, transparent 1px);
    background-size: var(--space-8) var(--space-8);
    border-inline: 1px solid var(--color-border);
  }

  /* the spec mark — must name styles that are actually applied below it */
  .abh-annotation {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    line-height: var(--leading-normal);
    color: var(--color-muted);
    margin-bottom: var(--space-2);
  }

  .abh-title {
    font-family: var(--font-sans);
    font-size: var(--text-display);        /* the 6× end of the scale */
    font-weight: var(--weight-regular);    /* scale carries hierarchy, not weight */
    letter-spacing: var(--tracking-display);
    line-height: var(--leading-tight);
    color: var(--color-fg);
    text-wrap: balance;
    margin: 0 0 var(--space-6);
  }
  .abh-lede {
    font-family: var(--font-sans);
    font-size: var(--text-lg);
    font-weight: var(--weight-medium);
    line-height: var(--leading-normal);
    color: var(--color-fg);
    max-width: var(--container-content);
    margin: 0 0 var(--space-6);
  }
  .abh-lede code {
    font-family: var(--font-mono);
    font-size: 0.9em;
    color: var(--color-accent);
  }

  .abh-actions { display: flex; gap: var(--space-3); align-items: center; }
  .abh-cta {
    font-size: var(--text-sm);
    font-weight: var(--weight-medium);
    color: var(--color-accent-fg);
    background: var(--color-fg);
    border-radius: var(--radius-full);
    padding: var(--space-3) var(--space-5);
    text-decoration: none;
    transition: background var(--duration-fast) var(--ease-standard);
  }
  .abh-cta:hover { background: var(--color-muted); }   /* hover = tint only, no lift */

  @media (max-width: 64rem) {
    .abh-title { font-size: var(--text-4xl); }
    .abh-frame { background-size: var(--space-6) var(--space-6); }
  }
</style>

<section class="abh">
  <div class="abh-frame">
    <p class="abh-annotation" aria-hidden="true">text-display · tracking-display · text-balance</p>
    <h1 class="abh-title">Rapidly build modern websites without ever leaving your HTML.</h1>

    <p class="abh-annotation" aria-hidden="true">text-lg · weight-medium</p>
    <p class="abh-lede">
      A utility-first CSS framework packed with classes like <code>flex</code>,
      <code>pt-4</code> and <code>rotate-90</code> that can be composed to build any
      design, directly in your markup.
    </p>

    <div class="abh-actions">
      <a class="abh-cta" href="/docs">Get started</a>
    </div>
  </div>
</section>
```

Notes for reuse: mark the annotations `aria-hidden="true"` — they are visual spec marks, and a screen reader reading `text-display · tracking-display` before every heading is noise. If the grid competes with your content, drop the vertical rules and keep only the horizontal baseline lines.
