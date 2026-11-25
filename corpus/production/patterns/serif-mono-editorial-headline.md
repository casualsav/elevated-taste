---
pattern: serif-mono-editorial-headline
from: appcues
corpus: production
safety: production-safe
tags: [hero, feature-section]
---

## What it is
A hero/section headline block that gets its editorial warmth from a three-role font system rather than color or weight: a small all-caps **mono** eyebrow label, a large display **serif** headline, and a neutral **grotesque** subhead — with one word of the headline set in the serif's *italic* to carry the emphasis. Sits on a warm non-white canvas with a single saturated pill CTA.

## Why it works
Hierarchy comes from three sources the reader can feel instantly — a change of *typeface voice* per level and a ~4.75× scale jump from body to display — so nothing needs to be bolded (the whole ramp lives at weight 400). The italic emphasis word reads as human intonation, not markup, which is why it feels editorial instead of "marketing bold." Keeping the accent color exclusively on the CTA means the eye lands on the one action by scarcity. The recipe is fully static and accessible: real text, real headings, no image-baked type.

## Reference implementation
```html
<header class="ed-hero">
  <p class="ed-hero__eyebrow">In-app customer engagement</p>
  <h1 class="ed-hero__h">Launch products that <em>land</em></h1>
  <p class="ed-hero__sub">Close the gap between shipped and adopted with a platform built to drive real value from your product.</p>
  <a class="ed-hero__cta" href="#">Book a call</a>

  <style>
    .ed-hero {
      display: flex; flex-direction: column; align-items: center; text-align: center;
      gap: var(--space-6, 24px);
      max-width: var(--container-md, 768px); margin-inline: auto;
      padding: var(--space-12, 100px) var(--space-9, 40px);
      background: var(--color-surface, #fffcef);
      color: var(--color-fg, #291a3d);
    }
    .ed-hero__eyebrow {
      font-family: var(--font-mono, "Basel Grotesk Mono", monospace);
      text-transform: uppercase; letter-spacing: 0.06em;
      font-size: var(--text-eyebrow, 0.84rem);
      background: var(--color-eyebrow-bg, #e9e9bf);
      border-radius: var(--radius-lg, 20px);
      padding: var(--space-2, 8px) var(--space-3, 12px);
      margin: 0;
    }
    .ed-hero__h {
      font-family: var(--font-display, "Martinaplantijn", Georgia, serif);
      font-weight: 400;
      font-size: clamp(2.5rem, 6vw, 4.75rem);
      line-height: 1.0; letter-spacing: -0.04em;
      margin: 0;
    }
    .ed-hero__h em { font-style: italic; } /* one word carries the emphasis */
    .ed-hero__sub {
      font-family: var(--font-display, "Martinaplantijn", Georgia, serif);
      font-size: var(--text-xl, 1.375rem); line-height: 1.4; letter-spacing: -0.01em;
      max-width: var(--container-content, 720px); margin: 0;
    }
    .ed-hero__cta {
      font-family: var(--font-display, "Martinaplantijn", Georgia, serif);
      font-weight: 500; text-decoration: none;
      color: var(--color-fg, #291a3d);
      background: var(--color-accent, #f0fe52);   /* the ONLY saturated color on screen */
      border-radius: var(--radius-pill, 100px);
      padding: var(--space-3, 12px) var(--space-6, 26px);
    }
    .ed-hero__cta:focus-visible { outline: 2px solid var(--color-fg, #291a3d); outline-offset: 2px; }
  </style>
</header>
```
