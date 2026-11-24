---
pattern: bracketed-index-rail
from: doronsupply
corpus: expressive
safety: production-safe
tags: [navigation, index, ecommerce, list, footer]
---

## What it is

A horizontal rail of category cells, each a small tile with a thumbnail, a bracketed sequence number (`[01]`, `[02]`, … `[06]`), an uppercase mono label (MOCKUPS, TEXTURES, TOOLS…), and a trailing `→` arrow. The cells share a thin hairline frame and sit on a tinted band. On desktop the whole set reads as one continuous index strip; on mobile it reflows to a 2-column grid, keeping every cell's `[0n]` marker and arrow. It functions as a compact, enumerated table-of-contents for the catalog.

## Why it works

Numbering the cells turns a row of links into a *deliberate index* — the `[0n]` glyphs imply "this is the complete, ordered set," which makes navigation feel authored rather than incidental, and gives the eye fixed waypoints to scan. Because the marker is **type** (`[01]`), it costs no color, no fill, and no extra surface — a strict monochrome system can express enumeration and structure for free, and the numbers theme/scale/animate with the text. The trailing arrow encodes affordance ("go") without a button shape, keeping the cells quiet. Mechanically it's just a responsive grid, so the same component is the navigation at every width — `repeat(auto-fit/6, ...)` on desktop collapses to 2 columns on mobile with the identity intact (no separate mobile menu). The transferable rule: when you need wayfinding in a restrained system, **enumerate with bracketed numerals and let a grid carry the layout** — the numbering supplies hierarchy and "completeness," the brackets supply the technical character, and a `<nav><ol>` keeps it crawlable and accessible. Reusable for category bars, archive/section indexes, docs sidebars, footers, or any "table of contents" wanting a scannable, instrument-like feel.

## Reference implementation

```html
<style>
  .bir {
    background: var(--color-surface);
    padding: var(--space-4);
  }
  .bir__list {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: var(--space-3);
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .bir__cell {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-fg);
    text-decoration: none;
    font-family: var(--font-mono);
    transition: border-color var(--duration-fast) var(--ease-standard);
  }
  .bir__cell:hover,
  .bir__cell:focus-visible { border-color: var(--color-accent); }

  .bir__thumb {
    flex: 0 0 auto;
    width: var(--space-7);
    height: var(--space-7);
    object-fit: cover;
    border-radius: var(--radius-sm);
  }
  .bir__num {
    display: block;
    font-size: var(--text-xs);
    color: var(--color-muted);
    letter-spacing: var(--tracking-wide);
  }
  .bir__label {
    flex: 1;
    font-size: var(--text-sm);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
  }
  .bir__arrow {
    flex: 0 0 auto;
    color: var(--color-muted);
  }

  /* reflow to 2 columns on mobile — identity preserved, no separate menu */
  @media (max-width: 48rem) {
    .bir__list { grid-template-columns: repeat(2, 1fr); }
  }
</style>

<nav class="bir" aria-label="Shop by category">
  <ol class="bir__list">
    <li>
      <a class="bir__cell" href="/mockups">
        <img class="bir__thumb" src="mockups.png" alt="" aria-hidden="true" />
        <span class="bir__body">
          <span class="bir__num" aria-hidden="true">[01]</span>
          <span class="bir__label">Mockups</span>
        </span>
        <span class="bir__arrow" aria-hidden="true">&rarr;</span>
      </a>
    </li>
    <!-- repeat for [02] Textures, [03] Tools, [04] Bundles, [05] Fonts, [06] Freebies -->
  </ol>
</nav>
```
