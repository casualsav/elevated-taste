---
pattern: color-band-illustration-feature
from: worksinprogress
corpus: production
safety: production-safe
tags: [editorial, hero, feature-section]
---

## What it is
A featured-article block built from two stacked zones: a full-bleed commissioned **illustration** on top, and directly beneath (slightly overlapping, no gap) a **solid-color caption band** carrying a serif title and a monospace byline, with a hairline rule and a "Read more →". The band color is drawn from a small fixed editorial palette and **rotated per feature** down the page (indigo → red → yellow → mint …), so a long index gets its pacing from color rhythm rather than from whitespace or size jumps.

## Why it works
Keeping the interface chrome monochrome and pushing all saturation into these bands makes each feature read as a distinct magazine "spread" — the eye chunks the page by color. Anchoring the title in a flat color block (instead of overlaid on the image) guarantees text contrast without scrims or text-shadows, and lets the illustration stay uncropped. Because the band is a solid fill, a single component handles every feature; you only swap one custom property (`--band`) and the per-section identity falls out for free.

## Reference implementation
```html
<style>
  .feature {
    max-width: var(--container-max, 1472px);
    margin-inline: auto;
    /* band color is the only per-instance change */
    --band: var(--color-band-indigo, #363B8F);
    --on-band: var(--color-on-band, #FFFFFF);
  }
  .feature__img {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 10;
    object-fit: cover;
    /* calm progressive paint as it decodes */
    opacity: 0;
    transition: opacity var(--dur-slow, 500ms) ease;
  }
  .feature__img.is-loaded { opacity: 1; }

  .feature__band {
    background: var(--band);
    color: var(--on-band);
    padding: var(--space-30, 30px);
  }
  .feature__title {
    font-family: var(--font-serif, "Editor", Georgia, serif);
    font-weight: 700;
    font-size: var(--type-48, 3rem);
    line-height: 1.3;
    margin: 0;
  }
  @media (max-width: 720px) { .feature__title { font-size: var(--type-24, 1.5rem); } }

  .feature__byline {
    font-family: var(--font-mono, "GT America Mono", ui-monospace, monospace);
    font-size: var(--type-12, 0.75rem);
    margin: var(--space-5, 5px) 0 var(--space-20, 20px);
  }
  .feature__byline b { font-weight: 700; }

  .feature__foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid currentColor;   /* hairline tinted to band text */
    padding-top: var(--space-15, 15px);
  }
  .feature__more {
    font-family: var(--font-mono, ui-monospace, monospace);
    font-weight: 700;
    font-size: var(--type-12, 0.75rem);
    color: inherit;
    text-decoration: none;
    transition: text-decoration var(--dur-fast, 150ms) ease-in-out;
  }
  .feature__more:hover { text-decoration: underline; }

  /* honor reduced motion — skip the fade, paint opaque immediately */
  @media (prefers-reduced-motion: reduce) {
    .feature__img { opacity: 1; transition: none; }
  }
</style>

<article class="feature" style="--band: var(--color-band-red, #E20A39);">
  <img class="feature__img" src="ozone.jpg" alt="Editorial illustration"
       loading="lazy" onload="this.classList.add('is-loaded')" />
  <div class="feature__band">
    <h2 class="feature__title">How we fixed the ozone layer</h2>
    <p class="feature__byline">Words by <b>Hannah Ritchie</b></p>
    <div class="feature__foot">
      <span></span>
      <a class="feature__more" href="#">Read more →</a>
    </div>
  </div>
</article>
```
Rotate `--band` per feature (indigo / red / yellow / mint / lavender) to pace the page. The only motion is an opacity fade on image load, explicitly disabled under `prefers-reduced-motion`.
