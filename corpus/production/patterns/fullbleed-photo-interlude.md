---
pattern: fullbleed-photo-interlude
from: societies
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [feature-section, editorial, full-bleed, motion]
---

## What it is
An edge-to-edge photographic band dropped between centered content blocks on a long editorial page, carrying nothing but a single quiet overline caption anchored at one corner over a soft bottom gradient. It is a *pacing* device, not a content section: it resets the reader's attention and gives a dense pitch a magazine cadence. Artificial Societies uses stone-colonnade and tree-lined-allée photographs this way, each with a one-line caption like "Technology in service of human understanding," and lets the image drift gently (parallax) as it passes.

## Why it works
On a long page, uninterrupted feature stacks flatten into monotony; a full-bleed image is a hard rhythm break that signals "new chapter" without a heading. Breaking out of the centered measure to true edge-to-edge is what makes it read as an interlude rather than just a big picture — the change of width *is* the punctuation. Anchoring the caption to a bottom-up gradient keeps text legible over any photo without a card or scrim box, so the image stays the hero. The optional slow parallax adds cinematic depth while touching only `transform` (GPU-cheap, no reflow); it degrades to a plain static band under reduced-motion with no loss of meaning.

## Reference implementation
```html
<style>
  .interlude {
    position: relative;
    width: 100vw; margin-inline: calc(50% - 50vw);   /* break the centered measure to full-bleed */
    height: clamp(420px, 60vh, 720px);
    overflow: clip; isolation: isolate;
    display: flex; align-items: flex-end;
    color: var(--color-fg-on-dark, #ffffff);
  }
  .interlude__img {
    position: absolute; inset: -12% 0;               /* overscan so parallax never reveals an edge */
    width: 100%; height: 124%; object-fit: cover;
    will-change: transform;
  }
  /* bottom-up gradient anchors the caption without a box */
  .interlude::after {
    content: ""; position: absolute; inset: 0; z-index: 1;
    background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 45%);
    pointer-events: none;
  }
  .interlude__caption {
    position: relative; z-index: 2;
    padding: var(--space-6, 40px) var(--grid-margin, calc(5vw + 6px));
    font-size: var(--text-sm, 0.875rem);
    letter-spacing: var(--tracking-wide, 0.025em);
    color: var(--color-muted-on-dark, rgba(255,255,255,0.72));
  }

  /* Scroll-driven parallax via CSS scroll-driven animations (no JS). */
  @media (prefers-reduced-motion: no-preference) {
    @supports (animation-timeline: view()) {
      .interlude__img {
        animation: interlude-drift linear both;
        animation-timeline: view();
        animation-range: cover 0% cover 100%;
      }
      @keyframes interlude-drift {
        from { transform: translateY(-6%); }
        to   { transform: translateY(6%);  }
      }
    }
  }
  /* reduced-motion (and no view-timeline support): static, centered, no drift */
  @media (prefers-reduced-motion: reduce) {
    .interlude__img { inset: 0; height: 100%; animation: none; transform: none; }
  }
</style>

<figure class="interlude">
  <img class="interlude__img" src="/img/colonnade.webp" alt="Stone colonnade of a civic building" loading="lazy" />
  <figcaption class="interlude__caption">Technology in service of human understanding</figcaption>
</figure>
```
