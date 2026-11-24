---
pattern: organic-mask-alternating-rows
from: acorns
corpus: production
safety: production-safe
tags: [feature-section, landing, product-marketing, illustration, soft]
---

## What it is
A run of four to six feature claims, each one a 2-up row — copy on one side, imagery on the other — with the sides swapping every row. The move that makes it distinctive is that the imagery is **masked into an organic shape** (a circle, an ellipse, a fat squircle) rather than dropped into a rectangular card. Acorns runs five of these between its hero and its calculator: no borders, no shadows, no card chrome, just heading + paragraph facing an image whose silhouette is round.

## Why it works
A three-card feature grid asks the eye to compare three things at once, which is exactly wrong when the claims are *sequential* rather than parallel. Alternating rows force one claim into the viewport at a time and use the left/right flip to mark "next" without a divider — the zigzag is the rhythm.

Masking the image into a circle or squircle does two things a rectangle can't. It removes the image's edges as a competing alignment line, so the only strong verticals on the page are the text columns; and it lets illustration bleed to the mask boundary, so the artwork reads as an *object* on the page rather than a picture pasted onto it. Pair it with a soft, geometric type family and the whole page inherits the "no sharp corners" argument the brand is making.

Two rules keep it honest at small sizes. The mask must be applied with `clip-path`/`border-radius` on a wrapper the image `object-fit: cover`s into — never by exporting a pre-masked PNG, or the shape can't respond to the container. And on mobile the alternation must **stop**: the image always follows its heading, because a mirrored row would put an image before the heading it illustrates and break reading order for anyone linearizing the page.

## Reference implementation
```html
<style>
  .featurerows {
    display: flex;
    flex-direction: column;
    gap: var(--space-10);                       /* 8rem — rows are chapters, not list items */
    max-width: var(--container-xl);
    margin-inline: auto;
    padding: var(--space-9) var(--space-5);
  }

  .featurerow {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: var(--space-9);                        /* 6rem — the gutter IS the separator */
  }
  /* Zigzag: even rows put the figure first. Visual order only — DOM order stays copy → figure. */
  .featurerow:nth-child(even) .featurerow__figure { order: -1; }

  .featurerow__title {
    font-size: var(--text-3xl);
    font-weight: var(--weight-semibold);
    line-height: var(--leading-snug);
    letter-spacing: var(--tracking-heading);
    color: var(--color-fg);
    margin: 0 0 var(--space-4);
    max-width: 12ch;                            /* force the 2–3 line break; don't rely on the viewport */
  }
  .featurerow__body {
    font-size: var(--text-base);
    line-height: var(--leading-relaxed);
    color: var(--color-muted);
    max-width: 42ch;
    margin: 0;
  }

  /* The mask lives on the wrapper, so the shape is responsive and the art can be swapped freely. */
  .featurerow__figure {
    position: relative;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    background: var(--color-surface);           /* shows through where the art is transparent */
    border-radius: 50%;                         /* circle tier */
  }
  .featurerow__figure--squircle {
    border-radius: 28% / 24%;                   /* fat superellipse-ish; the second tier, used sparingly */
  }
  .featurerow__figure > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 768px) {
    .featurerows { gap: var(--space-8); }
    .featurerow {
      grid-template-columns: 1fr;
      gap: var(--space-6);
    }
    /* Reading order beats symmetry: heading, then its image, every time. */
    .featurerow:nth-child(even) .featurerow__figure { order: 0; }
    .featurerow__title { font-size: var(--text-2xl); max-width: none; }
  }
</style>

<section class="featurerows" aria-label="How it works">
  <article class="featurerow">
    <div class="featurerow__copy">
      <h3 class="featurerow__title">Money tools for every stage of life</h3>
      <p class="featurerow__body">Wherever you are on your money journey, the tools meet you there — not a tier above it.</p>
    </div>
    <figure class="featurerow__figure">
      <img src="/art/stages.svg" alt="Illustration of a character standing between a sapling and a full oak leaf">
    </figure>
  </article>

  <article class="featurerow">
    <div class="featurerow__copy">
      <h3 class="featurerow__title">Easy and automatic saving</h3>
      <p class="featurerow__body">Choose an amount, set a schedule, and it runs without you. No charts to read.</p>
    </div>
    <figure class="featurerow__figure featurerow__figure--squircle">
      <img src="/art/automatic.svg" alt="Illustration of a rising bar chart behind a character giving a thumbs up">
    </figure>
  </article>
</section>
```
