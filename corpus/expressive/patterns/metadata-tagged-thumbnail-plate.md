---
pattern: metadata-tagged-thumbnail-plate
from: phantom
corpus: expressive
safety: production-safe
tags: [portfolio-index, gallery, feed, agency, interactive-showcase]
---

## What it is

A work/portfolio tile that is **just a borderless image plate with its taxonomy riding on top of the media as tiny monospace chips** — no card, no shadow, no title block. Each plate carries a short row of discipline labels (WEBSITE, BRAND, MOTION) and a bracketed index number (`[01]`) rendered in a small tracked mono face, set as translucent "glass" chips laid over the image. Because the metadata is structured taxonomy rather than a headline, the whole feed becomes a *filterable index*: a FILTER control elsewhere on the page maps directly onto these same labels. It differs from a titled portfolio cell (see `staggered-masonry-feed`, which puts a serif title *below* the plate) — here there is no human-language title at all; the discipline tags and the image *are* the entry.

## Why it works

Putting taxonomy *on* the media instead of a title *under* it does two jobs at once. First, it keeps the plate edge-to-edge and uninterrupted, so a dense masonry stays image-first and reads as "studio output," not "list of articles." Second, it makes the gallery **machine-shaped**: every tile is self-describing with the same vocabulary the filter uses, so filtering, sorting, and "related work" fall out of the data the eye is already reading. Mono + bracketed numerals read as "system metadata / catalog entry," which signals these tags are a controlled taxonomy, not prose — the user infers a complete, filterable set. Keeping the chips as the shared translucent "glass" material means they sit legibly over any thumbnail without a solid card. The transferable rule: **when content is the hero and the collection is filterable, attach the controlling taxonomy to the item as on-media mono chips rather than giving each item a prose title** — the labels do wayfinding, filtering, and hierarchy in one move. Reusable for portfolios, case-study indexes, asset/catalog grids, and any feed with a faceted filter.

## Reference implementation

```html
<!-- Borderless plate with on-media taxonomy chips. All values from /tokens. -->
<style>
  .plate {
    position: relative;
    display: block;
    aspect-ratio: 1 / 1;                      /* mix --tall items for masonry stagger */
    overflow: clip;
    background: var(--color-surface);         /* placeholder while the image loads */
    text-decoration: none;
    color: var(--color-fg);
  }
  .plate--tall { aspect-ratio: 3 / 4; }

  .plate__img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
    transition: transform var(--duration-slow) var(--ease-standard);
  }
  .plate:hover .plate__img { transform: scale(1.03); }

  /* Taxonomy row, pinned over the media. */
  .plate__meta {
    position: absolute;
    inset-block-start: var(--space-3);
    inset-inline: var(--space-3);
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
  }
  /* Each tag is the shared "glass" chip so it reads over any thumbnail. */
  .plate__tag {
    padding: var(--space-1) var(--space-3);    /* flat, ticker-like proportion */
    border-radius: var(--radius-lg);
    background: var(--color-surface);          /* rgba(white,0.15) translucent fill */
    border: 1px solid var(--color-border);     /* rgba(white,0.2) hairline */
    -webkit-backdrop-filter: blur(var(--space-2));
    backdrop-filter: blur(var(--space-2));
    color: var(--color-fg);
    white-space: nowrap;
  }
  .plate__index { margin-inline-start: auto; opacity: 0.7; }  /* [01], right-aligned */

  /* Never trust the blur for contrast — fall back to a more opaque chip. */
  @supports not (backdrop-filter: blur(1px)) {
    .plate__tag { background: var(--color-surface-2); }
  }

  .plate:focus-visible {
    outline: 2px solid var(--color-fg);
    outline-offset: calc(-1 * var(--space-1));
  }
  @media (prefers-reduced-motion: reduce) {
    .plate__img { transition: none; }
    .plate:hover .plate__img { transform: none; }
  }
</style>

<a class="plate plate--tall" href="/work/google-play">
  <img class="plate__img" src="/work/google-play.jpg"
       alt="Google Play — brand experience" loading="lazy">
  <p class="plate__meta">
    <span class="plate__tag">Website</span>
    <span class="plate__tag">Brand</span>
    <span class="plate__index" aria-hidden="true">[01]</span>
  </p>
</a>
<!-- repeat plates with mixed aspect ratios inside a masonry/grid container -->
```
