---
pattern: alternating-hairline-band-bento
from: fillout
corpus: production
safety: production-safe
tags: [feature-section, landing, bento, layout]
---

## What it is
A long marketing page built from full-width **bands** that alternate between two barely-different surface tones (white / off-white) and are separated only by a single 1px hairline. Each band holds a centered intro (eyebrow pill + display headline + one-line subhead) above a 2-column bento of soft-shadow cards, each card pairing a short claim with a tilted product-UI fragment. It replaces heavy dividers and color-block sections with a "quiet document" rhythm.

## Why it works
Structure without noise: the ~2% tonal step between bands is felt, not seen, so the page reads calm at high section count, while the hairline does the actual dividing. All elevation is one shared soft-ring shadow (wide ambient blur + a 1px hairline ring), so cards float on white without their edges dissolving and the whole page looks like one system rather than per-section styling. Because the intro is centered and the demo is the only saturated thing on screen, attention lands on the product every time.

## Reference implementation
```html
<style>
  .band {
    /* alternating surface tones, split by a single hairline */
    border-top: 1px solid var(--color-hairline);
    padding-block: clamp(var(--space-9), 8vw, 128px);
    background: var(--color-bg);
  }
  .band:nth-of-type(even) { background: var(--color-surface, #fbfbfb); }

  .band__intro { max-width: var(--container-md); margin-inline: auto; text-align: center; }
  .eyebrow {
    display: inline-flex; align-items: center; gap: var(--space-2);
    padding: var(--space-1) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    font: var(--weight-medium) var(--text-sm)/1 var(--font-sans);
    color: var(--color-muted);
  }
  .band__title {
    margin: var(--space-4) 0 var(--space-2);
    font: var(--weight-semibold) var(--text-4xl)/1.05 var(--font-sans);
    letter-spacing: var(--tracking-display, -0.16px);
    color: var(--color-fg);
  }
  .band__sub { color: var(--color-muted); font-size: var(--text-lg); }

  .bento {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-5);
    max-width: var(--container-xl, 1240px); margin: var(--space-8) auto 0;
  }
  @media (max-width: 767px) { .bento { grid-template-columns: 1fr; } }

  .cell {
    /* the ONE shared elevation: wide ambient blur + 1px hairline ring */
    border-radius: var(--radius-xl, 16px);
    background: var(--color-bg);
    padding: var(--space-6);
    box-shadow: var(--shadow-soft-ring, 0 12px 32px -6px rgba(0,0,0,0.12), 0 0 0 1px rgba(111,107,107,0.1), 0 1px 3px 0 rgba(63,70,75,0.1));
  }
  .cell h3 { font: var(--weight-semibold) var(--text-xl)/1.2 var(--font-sans); color: var(--color-fg); }
  .cell p  { margin-top: var(--space-2); color: var(--color-muted); }
  /* the product fragment sits slightly tilted so the UI feels tangible, not a flat screenshot */
  .cell__demo { margin-top: var(--space-5); transform: rotate(-1.5deg); transform-origin: bottom left; }
</style>

<section class="band">
  <div class="band__intro">
    <span class="eyebrow">✦ Features</span>
    <h2 class="band__title">It all starts with a form</h2>
    <p class="band__sub">Build the exact form you need, in minutes.</p>
  </div>
  <div class="bento">
    <article class="cell">
      <h3>Create with drag-and-drop</h3>
      <p>Choose a pre-built theme or bring your own fonts, logo and CSS.</p>
      <div class="cell__demo"><!-- real UI fragment / mock --></div>
    </article>
    <article class="cell">
      <h3>Automate with smart forms</h3>
      <p>Reduce manual work with intelligent routing.</p>
      <div class="cell__demo"><!-- real UI fragment / mock --></div>
    </article>
  </div>
</section>
```
