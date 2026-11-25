---
pattern: soft-elevation-surface
from: stripe-checkout
corpus: production
safety: production-safe
tags: [card, surface, elevation]
---

## What it is
The Stripe-signature "floating white panel" surface: a white card on a light-neutral (or textured) ground whose depth comes from a *stack* of low-alpha shadow layers plus a 1px inner-ring shadow — never a single blurry drop shadow. A hairline border and a small radius keep the edge crisp. Reuse for cards, modals, popovers, and menus that must read as premium on a light background.

## Why it works
One diffuse shadow reads as "default CSS." Real elevation is three separable cues stacked: a **hairline ring** (`0 0 0 1px`) that defines a sharp edge at any zoom, a **wide ambient** layer for the soft ground shadow, and a **tight key** layer for contact. Because each layer is near-transparent, none is individually visible — the eye just reads "this object sits above the page." Pair it with a small radius (6–12px) and a thin border so the surface looks like an instrument, not a balloon. Hover simply adds one more ambient layer — depth increases without anything moving.

## Reference implementation
```html
<article class="surface">
  <h3 class="surface__title">Full page</h3>
  <p class="surface__body">Launch payments out-of-the-box.</p>
</article>

<style>
  .surface {
    background: var(--color-surface, #ffffff);
    border: 1px solid var(--color-hairline, #d8dee4);
    border-radius: var(--radius-lg, 12px);
    padding: var(--space-5, 24px);
    /* stacked low-alpha elevation: ring + ambient + key */
    box-shadow:
      0 0 0 1px rgba(136, 152, 170, 0.10),
      0 15px 35px rgba(129, 129, 136, 0.10),
      0 5px 15px rgba(0, 0, 0, 0.08);
    transition: box-shadow var(--duration-base, 200ms) linear;
  }
  .surface:hover {
    /* add depth by adding a layer — no transform, no reflow */
    box-shadow:
      0 0 0 1px rgba(136, 152, 170, 0.10),
      0 3px 6px rgba(0, 0, 0, 0.12),
      0 7px 14px rgba(48, 49, 61, 0.08);
  }
  .surface__title {
    margin: 0 0 var(--space-2, 8px);
    font: var(--weight-semibold, 600) var(--text-md, 1.125rem)/1.4 var(--font-sans, Inter, system-ui, sans-serif);
    color: var(--color-fg, #353a44);
  }
  .surface__body {
    margin: 0;
    font-size: var(--text-sm, 0.875rem);
    line-height: 1.45;
    color: var(--color-muted, #596171);
  }
</style>
```
