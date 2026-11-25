---
pattern: labeled-work-card-grid
from: haptic
corpus: production
safety: production-safe
tags: [grid, portfolio, bento, cards, case-study]
---

## What it is
A portfolio / case-study index built as a 3-column grid where most cells are 1-wide but a few span 2 columns (and some tiles go dark), each cell a full-bleed image or product shot with a small meta label — icon + project name + category — pinned to its bottom-left corner. The chrome is strictly monochrome so the client work inside each card supplies all the color; identical radius and label treatment across cells keeps the mixed sizes reading as one composed set rather than a ragged masonry.

## Why it works
Two moves do the heavy lifting. First, **size variation on a fixed column grid** (1-wide and 2-wide cells, occasional dark fill) gives the grid rhythm and lets you weight hero projects without breaking alignment — unlike free masonry, every card still snaps to the same columns. Second, **quarantining color to the content**: a colorless frame (white ground, near-black label text, one radius) means a wall of unrelated client brands reads as a calm catalog instead of a clash. The corner meta label is an overlay, so the image fills the whole cell edge-to-edge — more picture, less chrome.

## Reference implementation
```html
<style>
  .work-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: var(--space-3); max-width: var(--container-xl); margin-inline: auto;
    padding-inline: var(--space-5);
  }
  .work-card {
    position: relative; grid-column: span 1; aspect-ratio: 4 / 3;
    border-radius: var(--radius-md); overflow: hidden;
    background: var(--color-surface);
  }
  .work-card.is-wide { grid-column: span 2; aspect-ratio: 16 / 9; }
  .work-card.is-dark { background: var(--color-sticker-ink, #141414); }

  .work-card > img, .work-card > video {
    width: 100%; height: 100%; object-fit: cover; display: block;
  }
  /* corner meta label — glass pill so it sits on any image */
  .work-card .meta {
    position: absolute; left: var(--space-3); bottom: var(--space-3);
    display: inline-flex; align-items: center; gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-md);
    background: var(--color-glass-light, rgba(235,235,235,0.8));
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
    font-size: var(--text-xs); color: var(--color-fg);
  }
  .work-card.is-dark .meta {
    background: var(--color-glass-dark, rgba(0,0,0,0.2));
    color: var(--color-fg-on-dark);
  }
  .work-card .meta .ico { width: 1rem; height: 1rem; border-radius: var(--radius-sm); }
  .work-card .meta .cat { color: var(--color-muted); }

  @media (max-width: 810px) {
    .work-grid { grid-template-columns: 1fr; }
    .work-card, .work-card.is-wide { grid-column: span 1; aspect-ratio: 4 / 3; }
  }
</style>

<ul class="work-grid" role="list">
  <li class="work-card">
    <img src="/work/ornn.jpg" alt="Ornn AI brand identity — case study">
    <span class="meta"><img class="ico" src="/work/ornn-mark.svg" alt="">
      Ornn <span class="cat">Marketing &amp; engineering</span></span>
  </li>
  <li class="work-card is-wide is-dark">
    <video src="/work/fuse.mp4" autoplay muted loop playsinline></video>
    <span class="meta"><img class="ico" src="/work/fuse-mark.svg" alt="">
      Fuse <span class="cat">Scalable performance</span></span>
  </li>
  <li class="work-card">
    <img src="/work/subzero.jpg" alt="Subzero conversational AI agents — case study">
    <span class="meta"><img class="ico" src="/work/subzero-mark.svg" alt="">
      Subzero <span class="cat">Conversational AI agents</span></span>
  </li>
</ul>
```
