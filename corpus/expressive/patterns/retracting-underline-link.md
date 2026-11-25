---
pattern: retracting-underline-link
from: therow
corpus: expressive
safety: production-safe
trigger: hover
tags: [navigation, footer, editorial, motion]
---

## What it is

A text link that wears its 1px underline **at rest**, and wipes it away on hover — a pseudo-element at `scaleX(1)` with `transform-origin: left`, animating to `scaleX(0)`. The inverse of the familiar draw-in underline.

## Why it works

- **Direction of change sets the register.** A rest state that is already complete, where interaction *removes* ornament, reads as editorial, curated, unhurried. Hover that *adds* ornament reads as product/app — it says "this is clickable," which a luxury catalog assumes you already knew. Same mechanism, one sign flipped, entirely different voice. Choose the sign deliberately.
- **The rest state is the accessible state.** Because the underline is present until you point at it, the link is never identified by color alone (WCAG 1.4.1) — the failure mode of "underline appears on hover." Nothing is taken away from a keyboard or touch user, who never triggers hover at all.
- **It's free.** Animating `transform` on a 1px pseudo-element is compositor-only: no reflow, no repaint of the text, no `text-decoration` thrash. Contrast with animating `width`, `background-size`, or `text-decoration-color`, all of which cost layout or paint.
- **`transform-origin` is the whole vocabulary.** `left` retracts (an erasure, trailing away from the reader). `right` retracts backwards (a rewind). Setting origin `right` on out and `left` on in gives the "swap" underline that appears to pass *through* the link. Pick one and use it everywhere; mixing origins in one nav reads as a bug.

**Caveats.** Gate the effect behind `@media (hover: hover)` so a touch tap doesn't leave the link permanently stripped. Keep the focus ring independent of the hover state — the retraction must never be a link's only focus feedback. And don't use this for links inside body copy: readers scan prose for underlines, and one vanishing under the cursor is disorienting rather than elegant.

## Reference implementation

```html
<nav class="nav" aria-label="Primary">
  <a class="link-retract" href="/women">Women</a>
  <a class="link-retract" href="/collections">Collections</a>
  <a class="link-retract" href="/stores" aria-current="page">Stores</a>
</nav>
```

```css
.nav {
  display: flex;
  gap: var(--space-5);
  font-size: var(--text-sm);
  font-weight: var(--weight-regular);
}

.link-retract {
  position: relative;
  display: inline-block;
  color: var(--color-fg);
  text-decoration: none;   /* replaced by the animatable rule below */
}

.link-retract::after {
  content: "";
  position: absolute;
  inset-inline: 0;
  inset-block-end: -0.15em;
  block-size: 1px;
  background: currentColor;
  transform: scaleX(1);
  transform-origin: left center;
  transition: transform var(--duration-base) var(--ease-standard);
}

/* Pointer devices only — a tap must not strip the underline for good. */
@media (hover: hover) {
  .link-retract:hover::after { transform: scaleX(0); }
}

/* Focus feedback never depends on the underline's presence. */
.link-retract:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 4px;
  border-radius: var(--radius-sm);
}

/* The current page keeps its rule at full strength and dims instead. */
.link-retract[aria-current="page"] { color: var(--color-muted); }

@media (prefers-reduced-motion: reduce) {
  .link-retract::after { transition: none; }
}
```

**Tokens.** All house: `--space-5`, `--text-sm`, `--weight-regular`, `--color-fg`, `--color-muted`, `--color-focus`, `--radius-sm`, `--duration-base`, `--ease-standard`.
