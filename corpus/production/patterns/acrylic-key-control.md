---
pattern: acrylic-key-control
from: theresonance
corpus: production
safety: production-safe
tags: [forms, pricing, navigation, buttons]
---

## What it is
A glossy, physically-beveled control surface — the look of a pressed macOS-native key or a molded acrylic button. A light inner highlight along the top, a dark inner shadow along the bottom, and a solid colored ring make a flat rectangle read as a tactile, slightly-raised object. Used here for the primary "Download / Buy" buttons and for the featured pricing card's border, so the most important action on the page feels like a real OS control rather than a web button.

## Why it works
Depth comes entirely from *inset* box-shadows simulating a top-lit bevel (bright top edge, shadowed bottom edge) — the same cue the human eye reads as "convex." A colored ring (`inset` + outer) frames it in the brand hue so it stands out in a near-monochrome dark UI without needing a fill gradient. Because it's all box-shadow, it animates cheaply on hover/focus (thicken the ring, deepen the bevel) and the focus state is a natural extension of the resting ring — accessible by construction. Pairs with a dark, restrained palette where a single accent must carry the primary action.

## Reference implementation
```html
<button class="key-control">Download for macOS</button>

<style>
  .key-control {
    /* fill + text */
    background: var(--color-accent, #4f8cff);
    color: var(--color-bg, #090d14);
    font: var(--weight-medium, 500) var(--text-base, 1rem)/1 var(--font-sans);
    padding: var(--space-3, 12px) var(--space-5, 20px);
    border: 0;
    border-radius: var(--radius-md, 8px);
    cursor: pointer;
    /* the acrylic key bevel: light top edge, dark bottom edge, brand ring */
    box-shadow:
      inset 0 8px 8px 0 rgba(255,255,255,0.25),
      inset 0 -8px 8px 0 rgba(0,0,0,0.25),
      inset 0 0 0 1px var(--color-accent-bevel, #a7caff);
    transition:
      box-shadow var(--duration-fast, 150ms) var(--ease-standard, cubic-bezier(0.4,0,0.2,1)),
      transform var(--duration-fast, 150ms) var(--ease-standard, cubic-bezier(0.4,0,0.2,1));
  }
  .key-control:hover {
    /* thicken the ring + add an outer glow: the key "presses in" */
    box-shadow:
      inset 0 3px 3px 0 rgba(255,255,255,0.18),
      inset 0 -3px 3px 0 rgba(0,0,0,0.22),
      inset 0 0 0 2px var(--color-accent-bevel, #a7caff),
      0 0 0 2px var(--color-accent-stroke, #2888ff);
  }
  .key-control:active { transform: translateY(1px); }
  .key-control:focus-visible {
    outline: none;
    box-shadow:
      inset 0 0 0 1px var(--color-accent-bevel, #a7caff),
      0 0 0 3px var(--color-focus, rgba(79,140,255,0.5));
  }

  @media (prefers-reduced-motion: reduce) {
    .key-control { transition: none; }
    .key-control:active { transform: none; }
  }
</style>
```

Notes: the same recipe scales up to a *card border* — drop the fill, keep the beveled ring on a container to make a "featured" pricing tile pop out of the grid (as this exemplar does with its founder-discount card). Source the highlight/ring hues from your accent so it stays on-brand; the numeric bevel offsets are pattern-specific (carry inline fallbacks).
