---
pattern: embedded-product-frame
from: mintlify
corpus: production
safety: production-safe
tags: [hero, product-marketing, feature-section, interactive-showcase]
---

## What it is

Instead of a flat marketing screenshot, the hero renders a **faithful, styled recreation of the actual product chrome** — here the Mintlify docs dashboard: a left sidebar of grouped nav items (active item highlighted, lower groups dimmed), a tabbed content header ("API Reference · Libraries · Changelog"), an eyebrow + H1 + sub, and a 2×2 grid of feature cards. The frame sits on a white surface inside a hairline border with a faint lift shadow, and it **overlaps the hero's right edge / bleeds off-canvas** so it reads as a window into a larger living app rather than a bounded image. The hero's decorative gradient lines cross its top corner, stitching it to the page.

## Why it works

Showing real product structure (sidebar, tabs, content hierarchy) does the selling that a hero sentence can't: the visitor sees the information architecture and infers competence and depth before reading a word. Building it from DOM/CSS instead of a PNG keeps it crisp at every density, lets the active state and copy be themed to the campaign, and costs nothing to localize or update. Dimming the lower nav groups and softening the card contents focuses attention on the one labelled row while still implying "there's much more here." Letting the frame bleed off the viewport edge signals scale and avoids the boxed-in, brochure feel of a centered screenshot. Transferable to any product whose value is legible *in its own UI* — dashboards, editors, consoles, docs tools.

## Why it works (safety)

Production-safe: it is plain markup, so it stays sharp on retina, is theme-able, and can be made accessible (real headings/landmarks, `aria-hidden` on purely decorative dimmed rows). Keep the gradient/line decoration `prefers-reduced-motion`-gated if animated, and ensure the framed copy is not the *only* place key information lives (it is illustrative, not the document outline).

## Reference implementation

```html
<style>
  .epf {
    display: grid;
    grid-template-columns: 1.05fr 1.35fr;          /* copy | product frame */
    gap: var(--space-7);
    align-items: center;
    max-width: var(--container-xl);
    margin-inline: auto;
    padding-inline: var(--space-5);
    overflow-x: clip;                              /* crop the bleed — no horizontal scroll */
  }
  /* the frame: real product chrome on a lifted white surface, bleeding right */
  .epf-frame {
    display: grid;
    grid-template-columns: max-content 1fr;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
    overflow: hidden;
    margin-right: calc(var(--space-9) * -1);       /* bleed off the right edge */
  }
  .epf-nav {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    padding: var(--space-5);
    border-right: 1px solid var(--color-border);
    font-family: var(--font-sans);
    font-size: var(--text-sm);
  }
  .epf-nav a { color: var(--color-muted); text-decoration: none; padding: var(--space-1) var(--space-2); border-radius: var(--radius-sm); }
  .epf-nav a[aria-current="page"] { color: var(--color-fg); background: var(--color-surface-2); }
  .epf-nav .epf-dim { opacity: 0.45; }              /* lower groups recede */
  .epf-main { padding: var(--space-6); }
  .epf-eyebrow { font-size: var(--text-sm); color: var(--color-accent); }
  .epf-h1 { font-size: var(--text-xl); color: var(--color-fg); margin-block: var(--space-2); }
  .epf-cards { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin-top: var(--space-5); }
  .epf-card { aspect-ratio: 16 / 9; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); }

  @media (max-width: 64rem) {
    .epf { grid-template-columns: 1fr; }
    .epf-frame { margin-right: 0; }                 /* no bleed on mobile */
  }
</style>

<section class="epf">
  <div class="epf-copy">
    <h1>The knowledge infrastructure agents build on</h1>
    <p>Self-updating documentation for startups, enterprises, and agents.</p>
  </div>

  <!-- real product chrome, not a screenshot -->
  <div class="epf-frame" role="img" aria-label="Mintlify documentation dashboard preview">
    <nav class="epf-nav">
      <a href="#" aria-current="page">Quickstart</a>
      <a href="#">Global Settings</a>
      <a href="#">AI optimization</a>
      <a href="#" class="epf-dim">Navigation</a>
      <a href="#" class="epf-dim">Versioning</a>
      <a href="#" class="epf-dim">Web Editor</a>
    </nav>
    <div class="epf-main">
      <span class="epf-eyebrow">Getting Started</span>
      <h2 class="epf-h1">Quickstart Guide</h2>
      <div class="epf-cards">
        <div class="epf-card"></div><div class="epf-card"></div>
        <div class="epf-card"></div><div class="epf-card"></div>
      </div>
    </div>
  </div>
</section>
```
