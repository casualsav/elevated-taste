---
pattern: monospace-wordmark-bar
from: tikhon
corpus: expressive
safety: spectacle-only
tags: [header, footer, hero, branding]
---

## What it is

A full-bleed inverted bar (white text on a solid black ground) holding a large uppercase monospace wordmark, optionally with one signature distortion/liquid accent glyph. Tikhon uses it twice — as the top wordmark and again as the giant "THANK YOU FOR YOUR VISIT" footer — so the two inverted bars bookend an otherwise flat black-on-white page and create the page's only contrast register.

## Why it works

In a deliberately flat, monochrome layout there is no type-scale hierarchy to lean on, so a single inverted block becomes the strongest possible emphasis lever — it reads as the title/anchor purely through value reversal, not size. Reserving inversion for one or two moments (top + bottom) frames the calm middle and gives the page a beginning and an end. The one distortion accent supplies "expensive/intentional" personality cheaply; on a plain field a single warped element carries more weight than many. Mark it spectacle-only: the inverted bar is safe, but the distortion is a GPU/animation cost and an a11y hazard.

## Reference implementation

```html
<header class="wordmark" role="banner">
  <span class="wordmark__text" data-distort>Tikhon&nbsp;Belousko</span>
</header>

<style>
  .wordmark {
    /* full-bleed even inside a centered container */
    width: 100vw;
    margin-inline: calc(50% - 50vw);
    background: var(--color-accent-strong, var(--color-fg));
    color: var(--color-fg-invert, var(--color-bg));
    padding-block: var(--space-2);
    padding-inline: var(--space-4);
    overflow: clip;
  }

  .wordmark__text {
    display: block;
    font-family: var(--font-mono);
    font-weight: var(--weight-bold);
    font-size: var(--text-5xl);          /* the only display-scale moment */
    line-height: var(--leading-tight);
    text-transform: uppercase;
    letter-spacing: var(--tracking-tight);
    white-space: nowrap;
  }

  /* SPECTACLE-ONLY: liquid distortion accent. Gate behind motion preference. */
  @media (prefers-reduced-motion: no-preference) {
    .wordmark__text[data-distort] {
      filter: url(#liquid);              /* SVG <feTurbulence>/<feDisplacementMap> */
      animation: warp var(--duration-slow) var(--ease-standard) infinite alternate;
    }
  }
  @keyframes warp { to { letter-spacing: 0; } }
</style>
```
