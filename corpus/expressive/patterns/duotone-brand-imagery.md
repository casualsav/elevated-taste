---
pattern: duotone-brand-imagery
from: varda
corpus: expressive
safety: production-safe
tags: [imagery, brand, color, hero, feature-section]
---

## What it is
Every photograph on the site is recolored into the *same two brand colors* — shadows map to one hue, highlights to the other — so satellite terrain, product footage, and a factory floor all read as one identity. Cohesion comes from the constraint, not from art-directing each shot.

## Why it works
Heterogeneous imagery (press photos, stock, screenshots) is the single biggest threat to a tightly-branded look. Forcing every image through a fixed duotone removes the source's own palette as a variable: the only colors on the page are the two brand colors, so nothing can clash. It's a *system* — drop in any new photo and it inherits the brand automatically. The cheapest, most portable mechanism is an SVG `feColorMatrix`/`feComponentTransfer` filter (works on `<img>` and `<video>`); a `mix-blend-mode` sandwich is a CSS-only alternative.

## Reference implementation
```html
<!-- Two-tone duotone via an inline SVG filter. Maps luminance to a
     gradient between --duo-shadow and --duo-highlight.
     Tokens: --duo-shadow = var(--color-bg) navy, --duo-highlight = var(--color-accent) orange -->
<svg width="0" height="0" aria-hidden="true" style="position:absolute">
  <filter id="brand-duotone" color-interpolation-filters="sRGB">
    <!-- 1. flatten to luminance -->
    <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0
                                          0.33 0.33 0.33 0 0
                                          0.33 0.33 0.33 0 0
                                          0    0    0    1 0"/>
    <!-- 2. remap black->shadow, white->highlight (channel ramps below) -->
    <feComponentTransfer color-interpolation-filters="sRGB">
      <feFuncR type="table" tableValues="0.039 0.902"/> <!-- 0x0A -> 0xE6 -->
      <feFuncG type="table" tableValues="0.188 0.506"/> <!-- 0x30 -> 0x81 -->
      <feFuncB type="table" tableValues="0.396 0.231"/> <!-- 0x65 -> 0x3B -->
    </feComponentTransfer>
  </filter>
</svg>

<figure class="duo">
  <img src="terrain.jpg" alt="Satellite view of arid terrain" />
</figure>

<style>
  .duo { margin: 0; }
  .duo > img,
  .duo > video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: url(#brand-duotone);
  }
  /* CSS-only fallback if you can't ship the SVG filter: a blend sandwich.
     .duo { position: relative; background: var(--color-bg); }
     .duo > img { mix-blend-mode: luminosity; }
     .duo::after { content:""; position:absolute; inset:0;
                   background: var(--color-accent); mix-blend-mode: lighten; } */
</style>
```

Notes: keep the two ramp endpoints = your real brand tokens so new imagery always matches. Watch contrast — text over a duotoned photo must clear WCAG against the *duotoned* result, not the flat brand color; reserve the high-contrast member of the pair for any overlaid type. This is a static treatment, so no reduced-motion concern.
