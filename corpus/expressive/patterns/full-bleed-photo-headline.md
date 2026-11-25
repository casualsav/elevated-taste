---
pattern: full-bleed-photo-headline
from: exoape
corpus: expressive
safety: production-safe
tags: [hero, photographic, layout, cinematic, branding]
---

## What it is

A full-bleed, art-directed photograph that *is* the hero background, with the display headline set in white **directly on the image** — no card, no box — using the photo's own naturally dark, low-detail region as the scrim. The interface chrome (wordmark, nav, intro copy) is edge-anchored over the same image and carries **no color of its own**: all chroma comes from the picture. On narrow viewports the hero opens on a solid dark color block and the photograph bleeds up from the bottom, so the stacked headline **straddles the color→image seam** ("Digital / Design" on the block, "Experience" on the photo), making the image feel like it's rising through the words.

## Why it works

Two mechanisms. (1) **Legibility from art direction, not overlays:** instead of darkening the whole image with a scrim that flattens it, you place the text where the image is already dark. The picture stays whole and "expensive," and type + image read as one plane. (2) **Tonal-seam alignment:** aligning a content edge (the headline block) to a tonal edge (solid color meeting photo) fuses two zones into one continuous surface, so a section transition reads as a single reveal. Keeping the UI achromatic means the photo never competes with buttons, and swapping the photo re-themes the page for free. The trade: it only works with images you control — guarantee a dark region behind the text, or fall back to a gradient.

## Reference implementation

```html
<style>
  .photo-hero {
    position: relative;
    min-height: 100svh;
    display: grid;
    /* mobile: solid block on top, image bleeds up from bottom */
    grid-template-rows: 1fr auto;
    background: var(--color-fg);          /* ink #0d0e13 — the seam color */
    color: var(--color-bg);               /* white text */
    overflow: clip;
  }

  .photo-hero__img {
    position: absolute;
    inset: auto 0 0 0;                     /* anchored to bottom */
    width: 100%;
    height: 70%;                           /* photo occupies lower zone on mobile */
    object-fit: cover;
    z-index: 0;
  }

  /* fallback scrim only where text sits, in case the art isn't dark enough */
  .photo-hero::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      color-mix(in srgb, var(--color-fg) 55%, transparent),
      transparent 45%
    );
    z-index: 1;
    pointer-events: none;
  }

  .photo-hero__chrome,
  .photo-hero__display { position: relative; z-index: 2; }

  .photo-hero__chrome {
    display: flex;
    justify-content: space-between;
    padding: var(--space-5);
  }

  .photo-hero__display {
    align-self: end;
    font-weight: var(--weight-regular);
    font-size: clamp(var(--text-4xl), 18vw, var(--text-display));
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    padding: var(--space-5) var(--space-5) var(--space-8);
    text-wrap: balance;
  }

  /* desktop: landscape image fills the whole hero, type overlays its dark side */
  @media (min-width: 1024px) {
    .photo-hero { background: var(--color-fg); }
    .photo-hero__img { inset: 0; height: 100%; }   /* full-bleed */
    .photo-hero__display { max-width: 60ch; }
  }

  @media (prefers-reduced-motion: no-preference) {
    /* optional: parallax handled in JS, gated here; static layout works without it */
  }
</style>

<section class="photo-hero">
  <img
    class="photo-hero__img"
    src="/hero.jpg"
    alt="Twilight cityscape, the studio's signature image"
    fetchpriority="high"
    decoding="async"
  >
  <div class="photo-hero__chrome">
    <a class="wordmark" href="/">exo<em>ape</em></a>
    <nav><a href="/work">Work</a> <a href="/studio">Studio</a></nav>
  </div>
  <h1 class="photo-hero__display">Digital Design Experience</h1>
</section>
```
