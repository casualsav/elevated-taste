---
pattern: bracket-focus-row
from: obys
corpus: expressive
safety: production-safe
tags: [list, active-state, hover, navigation]
---

## What it is

A list/row whose **active or hovered item is framed by two oversized bracket `[ ]` glyphs** and flanked by metadata (categories on one side, roles/index on the other), instead of being marked by a background fill, shadow, or color change. The frame appears on the focused item only; the rest of the list stays flat.

## Why it works

It signals selection by *adding a typographic frame* rather than *adding material* — so a strict monochrome, no-shadow, no-fill system can still express state. The brackets read instantly as "this one," and the flanking metadata gives the active row extra information density exactly when the user is attending to it. Because the marker is type, it scales, themes, and animates for free, and it never introduces a new color or surface into the palette.

## Reference implementation

```html
<style>
  .brow { list-style: none; margin: 0; padding: 0; font-family: var(--font-sans); }
  .brow__item {
    position: relative;
    display: grid;
    grid-template-columns: 1fr auto 1fr;     /* left meta | label | right meta */
    align-items: center;
    column-gap: var(--space-6);
    padding-block: var(--space-3);
    color: var(--color-muted);
    transition: color var(--duration-base) var(--ease-standard);
  }
  .brow__label {
    grid-column: 2;
    position: relative;                      /* anchor the brackets to the label, not the row */
    font-size: var(--text-2xl);              /* the one big size in the row */
    letter-spacing: var(--tracking-tight);
    color: inherit;
    text-decoration: none;
    white-space: nowrap;
  }
  .brow__meta { font-size: var(--text-xs); letter-spacing: var(--tracking-tight); }
  .brow__meta--left  { grid-column: 1; text-align: right; }
  .brow__meta--right { grid-column: 3; text-align: left; }

  /* bracket frame — hidden until active, no layout shift */
  .brow__label::before,
  .brow__label::after {
    content: "[";
    position: absolute;
    top: 50%;
    transform: translateY(-50%) scaleX(0.7);
    font-size: 1.6em;
    color: var(--color-fg);
    opacity: 0;
    transition: opacity var(--duration-base) var(--ease-standard);
  }
  .brow__label::before { left: calc(var(--space-6) * -1); }
  .brow__label::after  { content: "]"; right: calc(var(--space-6) * -1); }

  /* drive the frame from hover OR keyboard focus on the link */
  .brow__item:hover,
  .brow__item:focus-within { color: var(--color-fg); }
  .brow__item:hover .brow__label::before,
  .brow__item:hover .brow__label::after,
  .brow__item:focus-within .brow__label::before,
  .brow__item:focus-within .brow__label::after { opacity: 1; }

  /* keyboard users still get a real focus ring, not just brackets */
  .brow__label:focus-visible { outline: 2px solid var(--color-focus); outline-offset: var(--space-2); }

  @media (prefers-reduced-motion: reduce) {
    .brow__item, .brow__label::before, .brow__label::after { transition: none; }
  }
</style>

<ul class="brow">
  <li class="brow__item">
    <span class="brow__meta brow__meta--left">Fashion, Photography</span>
    <a class="brow__label" href="/work/eminente">Eminente</a>
    <span class="brow__meta brow__meta--right">Creative Direction, Web Design/Dev · 10</span>
  </li>
</ul>
```
