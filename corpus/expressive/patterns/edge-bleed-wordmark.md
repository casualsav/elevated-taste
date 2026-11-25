---
pattern: edge-bleed-wordmark
from: adoratorio
corpus: expressive
safety: production-safe
tags: [hero, footer, typography, branding, agency]
---

## What it is
A single-line studio wordmark (`Adoratorio® Studio`) set so large that it deliberately overflows the viewport — the glyphs run edge-to-edge and clip at both margins, anchored to the bottom of the hero so it reads as a ground line under the content. The type is one weight of a plain grotesque, near-black on a light canvas, with a small superscript registered-trademark `®` riding above the cap height as the only ornament. Hierarchy is pure scale: this wordmark is ~10–15× the body text, so it dominates without bold, color, or decoration. On mobile the same word stays oversized and still bleeds past the edge (it wraps/clips rather than shrinking to fit), so the "too big to contain" gesture survives the breakpoint instead of collapsing into a tidy centered logo.

## Why it works
Letting the wordmark exceed the frame signals confidence and scale — the name is *bigger than the page*, which reads as a brand statement, and the clipped edges imply continuation beyond the viewport (the eye fills in the rest), making a static word feel expansive. Mechanically this is **scale as the sole hierarchy device**: when one element is an order of magnitude larger than everything else, you never need weight or color to say "this is the title," so the rest of the system can stay flat and quiet. Bottom-anchoring turns the wordmark into a horizon that grounds the floating chrome and centerpiece above it, giving an otherwise sparse hero a clear base. The fluid `clamp()` sizing keyed to viewport width is what keeps the overflow intentional at every breakpoint rather than accidental. The superscript `®` is a cheap craft signal — a typographic detail that says "considered." Transfers to agency/portfolio heroes, footers, splash/loaders, and section dividers on any type-led brand. Production-safe with one rule: it must be a real, selectable heading in the DOM (not an image), with overflow handled so it never triggers a horizontal scrollbar.

## Reference implementation
```html
<header class="masthead">
  <h1 class="wordmark">
    Adoratorio<sup class="wordmark__r">&reg;</sup> Studio
  </h1>
</header>

<style>
  .masthead {
    display: flex;
    align-items: flex-end;          /* anchor wordmark to the bottom */
    min-block-size: 100svh;
    padding-block-end: var(--space-5);
    background: var(--color-bg);
    overflow-x: clip;               /* intentional bleed, never a scrollbar */
  }

  .wordmark {
    margin: 0;
    /* Fluid size that intentionally outgrows the viewport on wide screens:
       the upper clamp bound exceeds 1 line's fit, so the word bleeds + clips. */
    font-size: clamp(var(--text-5xl), 22vw, 18rem);
    font-family: var(--font-sans);
    font-weight: var(--weight-regular);   /* scale does the work, not weight */
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--color-fg);
    white-space: nowrap;            /* keep it one bleeding line on desktop */
    /* center the overflow so it clips symmetrically at both edges */
    margin-inline: calc(50% - 50vw);
    text-align: center;
  }

  .wordmark__r {
    font-size: 0.32em;              /* small superscript ® */
    vertical-align: super;
  }

  /* On narrow screens, allow the word to wrap but stay oversized + bleeding. */
  @media (max-width: 48rem) {
    .wordmark { white-space: normal; text-align: start; margin-inline: 0; padding-inline: var(--space-3); }
  }
</style>
```
