---
pattern: scalloped-band-edge
from: arc
corpus: production
safety: production-safe
tags: [feature-section, brand-experience, navigation, footer, layout]
---

## What it is
A way to join stacked full-bleed page bands where the seam is a **repeating scalloped wave** — a continuous row of small identical semicircle bites cut along the band's top and/or bottom edge — instead of a straight horizontal rule. Arc cuts this same wave at every transition between its saturated-blue bands and the cream/pastel sections (top of the hero canvas, both edges of the quote band, the footer top), so the decorative edge becomes the page's structural signature. It is a CSS `mask` driven by a single tiling `radial-gradient`; no SVG asset, no extra DOM, no JS, and the wave's pitch and depth are the only two variables.

## Why it works
On a long marketing page assembled from stacked sections, the *transitions* are the one surface left to express brand without spending type, color, or illustration budget — and a repeated geometric cut reads instantly as deliberate craft rather than a default rectangle stack. A scallop specifically reads as soft/friendly/analog (torn-paper, postage-stamp, ric-rac trim), which is exactly the "calmer, more personal" tone Arc is selling; the same hook done as a hard diagonal would read technical instead. Because the wave tiles from one gradient sized in tokens, its pitch stays constant regardless of viewport width, so it never looks stretched, and it costs nothing at runtime. Decorative-only, so it degrades to a clean straight edge wherever `mask` is unsupported. Transfers to any multi-section page that alternates background tone and wants a recognizable, low-cost rhythm with a soft/consumer personality — swap the scallop for a triangle zig-zag and the same engine yields a "ticket" edge.

## Reference implementation
```html
<style>
  :root {
    /* the wave is fully described by two tokens: how wide each bump is,
       and how deep it bites into the band. Keep depth <= half the pitch. */
    --scallop-pitch: var(--space-5);              /* width of one semicircle */
    --scallop-depth: var(--space-3);              /* how far it cuts in      */
  }

  .band {
    padding-block: var(--space-9);
    padding-inline: var(--space-6);
  }
  .band--brand { background: var(--color-bg); color: var(--color-accent-fg); }
  .band--canvas { background: var(--color-surface); color: var(--color-fg); }

  .band__inner { max-width: var(--container-xl); margin-inline: auto; }

  /* Scallop the TOP edge: a row of transparent semicircles is masked out of
     the band, so the (differently coloured) band ABOVE shows through the bites.
     One radial-gradient, tiled horizontally, is the whole effect. */
  .band--scallop-top {
    /* lift up so the carved edge overlaps the previous band, no seam gap */
    margin-top: calc(var(--scallop-depth) * -1);
    padding-top: calc(var(--space-9) + var(--scallop-depth));

    -webkit-mask:
      radial-gradient(
        var(--scallop-pitch) var(--scallop-pitch) at 50% 0,
        transparent 99%, #000 100%
      ) top left / var(--scallop-pitch) 100% repeat-x;
            mask:
      radial-gradient(
        var(--scallop-pitch) var(--scallop-pitch) at 50% 0,
        transparent 99%, #000 100%
      ) top left / var(--scallop-pitch) 100% repeat-x;
  }

  /* keep headings clear of the carved edge at narrow widths (smaller wave) */
  @media (max-width: 40rem) {
    :root { --scallop-pitch: var(--space-4); --scallop-depth: var(--space-2); }
  }

  /* graceful degradation: no mask support -> clean straight edge, real colours */
  @supports not ((-webkit-mask: radial-gradient(#000, #000)) or (mask: radial-gradient(#000, #000))) {
    .band--scallop-top { margin-top: 0; padding-top: var(--space-9); -webkit-mask: none; mask: none; }
  }
</style>

<section class="band band--canvas">
  <div class="band__inner"><!-- light content … --></div>
</section>

<section class="band band--brand band--scallop-top">
  <div class="band__inner"><!-- brand-coloured content; canvas above peeks through the scallops --></div>
</section>
```

Safety: the mask is purely decorative — never carve interactive controls or text out of the edge; the `padding-top` reserve keeps content below the bite line. Mark the carved element `aria-hidden`-irrelevant (it carries no semantics; structure stays in the real `<section>`s). Because it's a `mask` on the band's own background, it adds zero nodes and no paint cost beyond one gradient. The `@supports` fallback is load-bearing: without it, unsupported browsers would still get correct colors and a straight seam rather than a broken edge.
