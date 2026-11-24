---
pattern: split-stage-hero
from: buildinamsterdam
corpus: expressive
safety: production-safe
tags: [hero, hero-spectacle, agency, portfolio, brand-experience, layout]
---

## What it is

A hero that divides the viewport into two value-zones instead of laying content over one surface: a solid dark **stage** half held deliberately empty (a bay where work, a render, or a single accent object appears) and a light **speech** half that carries the wordmark, display headline, voice line, and CTAs. The split is created by *colour value*, not a rule line — black meets warm paper down the middle. A single accent object (here an ochre disc) lives near the seam and casts a soft shadow across it, stitching the halves. On narrow viewports the two zones do **not** collapse into one column: they restack vertically (speech on top, stage as a slab below), so the concept survives the breakpoint.

## Why it works

The split partitions the page into "performs" vs "speaks" *before a single word is read* — value contrast is the fastest hierarchy signal the eye has, faster than size or weight. Committing half the canvas to emptiness reads as confidence (only a brand sure of itself wastes a viewport half), which is exactly the register an agency/portfolio hero wants; the restraint *is* the spectacle. Keeping all text on the light half means contrast is never at risk over the dark void, so the dramatic black zone costs nothing in legibility. The lone accent object placed on the seam gives the eye one saturated, moving thing to land on while the type stays monochrome and calm — scarcity of colour is what makes that one object read as art-directed rather than decorative. Restacking (not collapsing) on mobile preserves both zones top/bottom, so the art direction reaches phones instead of degrading to a generic centred block. Transferable to any brand/agency/case-study hero that wants gravity from composition rather than ornament; the load-bearing rules are (1) zone by value, (2) hold one zone empty, (3) spend exactly one accent on a seam object, (4) restack rather than drop a zone.

## Reference implementation

```html
<style>
  .split-hero {
    display: grid;
    grid-template-columns: 1fr 1fr;   /* stage | speech */
    min-height: 100svh;
    background: var(--color-bg);       /* warm paper */
    color: var(--color-fg);
    font-family: var(--font-sans);
  }

  /* held-empty dark stage — a bay for work/objects, no text */
  .split-hero__stage {
    position: relative;
    background: var(--color-fg);        /* near-black void */
    overflow: visible;                  /* let the seam object spill across */
  }

  /* the one accent object, sitting on the seam, stitching the halves */
  .split-hero__object {
    position: absolute;
    right: calc(var(--space-7) * -1);   /* nudge past the seam onto paper */
    bottom: var(--space-9);
    width: var(--space-9);
    aspect-ratio: 1;
    border-radius: var(--radius-full);
    background: var(--color-accent);
    box-shadow: var(--shadow-lg);       /* soft cast onto the paper half */
  }

  /* light speech half — all type lives here */
  .split-hero__speech {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--space-6);
    padding: var(--space-8) var(--space-7);
  }

  .split-hero__display {
    font-weight: var(--weight-regular);          /* one weight; scale is the hierarchy */
    font-size: clamp(var(--text-4xl), 6vw, var(--text-display));
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);       /* negative; essential at display size */
    margin: 0;
    text-wrap: balance;
  }

  /* the single serif "voice" line — tone, not rank */
  .split-hero__lead {
    font-family: var(--font-serif, Georgia, serif);
    font-size: var(--text-lg);
    line-height: var(--leading-normal);
    max-width: var(--container-content);
    margin: 0;
  }

  .split-hero__actions { display: flex; gap: var(--space-3); }

  /* restack, don't collapse: keep both zones on mobile */
  @media (max-width: 768px) {
    .split-hero { grid-template-columns: 1fr; }
    .split-hero__speech { order: -1; padding: var(--space-7) var(--space-5); }
    .split-hero__stage { min-height: 40svh; }
    .split-hero__object {
      right: auto;
      left: 50%;
      top: calc(var(--space-7) * -1);   /* straddle the new horizontal seam */
      bottom: auto;
      transform: translateX(-50%);
    }
  }
</style>

<section class="split-hero">
  <div class="split-hero__stage">
    <span class="split-hero__object" aria-hidden="true"></span>
    <!-- real use: a video/render/work thumbnail lives here -->
  </div>
  <div class="split-hero__speech">
    <h1 class="split-hero__display">We build brands &amp; digital flagship stores</h1>
    <p class="split-hero__lead">
      We shape the future of commerce by delivering cohesive &amp; captivating
      omnichannel experiences that connect to convert.
    </p>
    <div class="split-hero__actions">
      <a class="btn" href="/work">Our work</a>
      <a class="btn" href="/contact">Contact us</a>
    </div>
  </div>
</section>
```

> Notes: zone by **value** (`--color-fg` void vs `--color-bg` paper), not a border. The accent object is the *only* saturated element — keep it to one. The seam shadow (`--shadow-lg`) is the one place this otherwise-shadowless design uses depth, to bind the halves. The empty stage is deliberate first-viewport cost — appropriate for brand/agency heroes, not for conversion landings where above-fold content must work harder.
