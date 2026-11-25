---
pattern: notched-section-transition
from: clerk
corpus: production
safety: production-safe
tags: [navigation, feature-section, brand-experience, layout]
---

## What it is

A way to join two full-bleed page bands of contrasting background (here a light `#f7f7f8` section meeting a dark `#131316` one) where the seam is not a straight horizontal line but an **angled "ticket-stub" notch** — a slim diagonal that bites a corner out of one band so the other appears to slot underneath it. Clerk uses the same cut at every light↔dark transition down a 7600px page, so the device becomes the page's structural signature. It is a pure `clip-path` on the band; no extra elements, no images, no JS.

## Why it works

On a long page made of stacked sections, the *transitions* are the only place left to express brand without spending color, type, or illustration budget — and a repeated geometric cut reads instantly as intentional craft rather than a default stack. The diagonal also creates a subtle directional pull into the next section (the eye follows the slope), which keeps a tall page feeling like it's moving. Because it's one declaration on the section background, it costs nothing at runtime, animates nothing, and falls back to a clean straight edge where `clip-path` is unsupported. Transferable to any multi-section marketing page that alternates background tone and wants a recognizable, low-cost rhythm.

## Reference implementation

```html
<style>
  :root {
    /* notch geometry expressed in tokens, not raw numbers */
    --notch-depth: var(--space-7);   /* how far the diagonal drops */
    --notch-inset: var(--space-9);   /* how wide the angled bite is  */
  }

  .band {
    padding-block: var(--space-10) var(--space-9);
    padding-inline: var(--space-6);
  }
  .band--light { background: var(--color-surface); color: var(--color-fg); }
  .band--dark  { background: var(--color-bg-dark); color: var(--color-fg-on-dark); }

  .band__inner {
    max-width: var(--container-xl);
    margin-inline: auto;
  }

  /* A dark band that notches its TOP-RIGHT corner, revealing the band above.
     The light band above is a plain rectangle; the dark one is clipped so the
     light shows through the cut — the "ticket stub" read. */
  .band--notch-top {
    /* points: TL -> start of cut -> bottom of cut -> TR-down -> BR -> BL */
    clip-path: polygon(
      0 0,
      calc(100% - var(--notch-inset)) 0,
      100% var(--notch-depth),
      100% 100%,
      0 100%
    );
    /* pull the next band up under the cut so there is no transparent gap */
    margin-top: calc(var(--notch-depth) * -1);
    padding-top: calc(var(--space-10) + var(--notch-depth));
  }

  /* keep all interactive content clear of the diagonal at narrow widths */
  @media (max-width: 40rem) {
    :root { --notch-inset: var(--space-7); --notch-depth: var(--space-6); }
  }

  /* graceful degradation: no clip-path -> straight edge, still correct colors */
  @supports not (clip-path: polygon(0 0)) {
    .band--notch-top { margin-top: 0; padding-top: var(--space-10); }
  }
</style>

<section class="band band--light">
  <div class="band__inner">
    <!-- light content … -->
  </div>
</section>

<section class="band band--dark band--notch-top">
  <div class="band__inner">
    <!-- dark content slots under the angled cut … -->
  </div>
</section>
```
