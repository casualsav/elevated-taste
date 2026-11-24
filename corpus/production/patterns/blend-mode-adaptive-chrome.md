---
pattern: blend-mode-adaptive-chrome
from: noth
corpus: production
safety: production-safe
trigger: hover
tags: [navigation, chrome, overlay, monochrome]
---

## What it is
A single persistent chrome layer — fixed nav, a sticky section label, corner meta — that stays legible over sections of any luminance (white, black, photo, video) **without any scroll listener recoloring it**. The layer is transparent and painted in one ink; `mix-blend-mode: difference` inverts that ink against whatever pixels scroll underneath, so it reads dark over light grounds and light over dark grounds automatically.

## Why it works
`difference` composites `|backdrop − source|`. With a white (`#fff`) source, the result is `255 − backdrop`: pure white over black stays white, white over white becomes black. So one declaration replaces the usual JS that watches scroll position and swaps a `.is-light`/`.is-dark` class per section. It's compositor-only (no reflow, no main-thread work), degrades gracefully (browsers without support just show the base ink), and eliminates a whole class of "nav text disappeared over the hero image" bugs. The one caveat: over mid-gray or busy photographic mid-tones `difference` yields muddy mid-tones — reserve it for designs whose grounds are mostly near-black/near-white, and verify contrast on the noisiest section.

## Reference implementation
```html
<style>
  .adaptive-chrome {
    position: fixed;
    inset: 0 0 auto;            /* top bar; use a sticky child for section labels */
    z-index: 1001;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 4rem;
    padding: var(--space-4, 1.25rem);
    /* transparent layer: no background — it must let the page show through */
    background: transparent;
    color: var(--color-fg-on-dark, #fff);   /* white ink is the "source" difference inverts */
    mix-blend-mode: difference;
    /* let clicks fall through the bar; re-enable per interactive child */
    pointer-events: none;
    font-family: var(--font-mono, ui-monospace, monospace);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    font-size: var(--font-size-label, 0.75rem);
  }
  .adaptive-chrome a,
  .adaptive-chrome .menu-toggle { pointer-events: auto; transition: opacity var(--duration-base, 200ms) var(--ease-standard, ease); }
  .adaptive-chrome a:hover { opacity: 0.6; }
  .adaptive-chrome a:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }

  /* A section label that rides along and inverts the same way while pinned */
  .section-label {
    position: sticky;
    top: 3rem;
    z-index: 10;
    mix-blend-mode: difference;
    color: var(--color-fg-on-dark, #fff);
  }

  /* Fallback: if difference isn't supported, keep a solid legible bar */
  @supports not (mix-blend-mode: difference) {
    .adaptive-chrome { background: var(--color-bg-dark, #000); mix-blend-mode: normal; }
  }
</style>

<nav class="adaptive-chrome" aria-label="Primary">
  <a href="/" aria-label="Home">N’</a>
  <button class="menu-toggle" aria-expanded="false">MENU ::</button>
</nav>
```

Notes: keep the layer genuinely transparent (a semi-opaque background defeats the blend). Because `pointer-events:none` is set on the bar, re-enable it on every real control. `difference` also inverts *inside* interactive children, so test hover/focus states on both a light and a dark section.
