---
pattern: headline-bracketed-object
from: creativeinc
corpus: expressive
safety: production-safe
tags: [hero, hero-spectacle, brand-experience, typography, 3d]
---

## What it is

A hero where a single display sentence is split into a **top cap** and a **bottom base** that sandwich a centered media object (a 3D render, product shot, or photo). Here the cap reads "We make hardware", the object — a matte claymorphic sculpture — sits beneath it on the same vertical axis, and the base "for human creativity." closes the sentence below the object. The two text halves are one continuous sentence; the reader scans *through* the object to assemble it, so the spectacle is threaded into the message instead of sitting beside it.

## Why it works

It fuses copy and image into one reading unit on a single centered spine, which is why it feels composed rather than like a split-screen "text left / image right" hero. Bracketing the object top-and-bottom (not left-and-right) means the layout is purely vertical — so it survives every breakpoint untouched: mobile is the same stack at a narrower width, the headline just wraps to more lines and the object scales down. Because hierarchy comes from the *order* (cap → object → base) and the display *scale*, it needs no color, weight contrast, or chrome, and it works with any centerpiece you can drop in the middle slot. The a11y key is keeping both text halves inside one heading in source order so the sentence reads correctly to a screen reader while the object is skipped.

## Reference implementation

```html
<style>
  .bracket-hero {
    background: var(--color-bg);
    color: var(--color-fg);
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-6);
    padding-block: var(--space-9);
    padding-inline: var(--space-5);
    text-align: center;
  }
  /* one heading, two visual halves bracketing the object */
  .bracket-hero__title {
    margin: 0;
    font-family: var(--font-serif);          /* single serif; same face as body */
    font-weight: var(--weight-regular);      /* light at display size; no bold */
    line-height: var(--leading-tight);       /* very tight: halves hug the object */
    letter-spacing: var(--tracking-tight);   /* negative; essential at display scale */
    font-size: clamp(var(--text-3xl), 9vw, var(--text-5xl));
  }
  .bracket-hero__cap,
  .bracket-hero__base { display: block; }

  /* the object lives between the two heading halves, same centered axis */
  .bracket-hero__object {
    display: block;
    width: min(100%, var(--container-sm));
    aspect-ratio: 1 / 1;
    margin-inline: auto;
    object-fit: contain;
  }

  @media (prefers-reduced-motion: reduce) {
    .bracket-hero__object { animation: none; }
  }
</style>

<header class="bracket-hero">
  <!-- one <h1>: cap, then object, then base — correct source order for SR -->
  <h1 class="bracket-hero__title">
    <span class="bracket-hero__cap">We make hardware</span>

    <img class="bracket-hero__object" src="/media/sculpture.webp"
         alt="" aria-hidden="true" width="640" height="640"
         loading="eager" decoding="async">
    <!-- swap <img> for a poster-backed <video> or a lazily-hydrated 3D canvas -->

    <span class="bracket-hero__base">for human creativity.</span>
  </h1>
</header>
```
