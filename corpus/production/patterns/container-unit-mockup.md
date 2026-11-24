---
pattern: container-unit-mockup
from: aloud
corpus: production
safety: production-safe
tags: [mockup, product, layout, container-query, responsive]
---

## What it is
A technique for building a pixel-accurate replica of an app / device UI — a window, a command bar, a note card, a terminal — that stays perfectly proportioned at *any* width without a single media query. The mockup element declares itself a query container (`container-type: inline-size`) and publishes one proportional unit: `--u: calc(100cqw / <designWidth>)`, where `<designWidth>` is the width you designed against (e.g. 1200). Every internal dimension is then authored in *design pixels* — `calc(28 * var(--u))`, `calc(6 * var(--u))` — so the whole scene scales as one rigid object as its container grows or shrinks.

## Why it works
Fluid mockups usually fail one of two ways: `%`-everything drifts (each child resolves against a different parent, so gaps and radii don't scale together), or fixed `px` breaks proportion (a 12px radius on a mockup shrunk to 60% width looks huge). The container-unit trick fixes both. `100cqw` is exactly the container's own inline size, so `--u` is "one design-pixel, scaled to current width." Multiply every number in the comp by `--u` and *all* of them — offsets, sizes, font-sizes, border-radii, even shadow spreads — scale by the identical factor, locking the design's proportions. Because it's container-relative (not viewport-relative like `vw`), the same mockup drops into a full-bleed hero, a two-up split, or a narrow sidebar and each instance sizes itself to *its* slot.

Three notes that make it robust: (1) put `container-type: inline-size` on the mockup root, and read `cqw` on descendants — a container can't query itself. (2) For absolutely-positioned children, position with `%` (relative to the mockup) but *size* borders/radii/fonts with `--u`, so placement is proportional and detail is crisp. (3) Clamp the unit on tiny screens (`--u: min(1px, calc((100vw - 32px) / <designWidth>)))`) so the mockup never renders larger than its design size on phones.

## Reference implementation
```html
<!-- framework-neutral; a fake "command bar" mockup designed at 528px wide -->
<div class="mock" style="max-width: 528px;">
  <div class="mock__bar">
    <span class="mock__key">⌘</span>
    <span class="mock__field">Add a note…</span>
    <span class="mock__chip">Save</span>
  </div>
</div>

<style>
  .mock {
    container-type: inline-size;           /* publishes cqw to descendants */
    width: 100%;
    margin-inline: auto;
  }
  .mock__bar {
    /* one design-pixel, scaled to current container width (design = 528px) */
    --u: calc(100cqw / 528);
    display: flex; align-items: center; gap: calc(10 * var(--u));
    height: calc(56 * var(--u)); padding: 0 calc(12 * var(--u));
    border: 1px solid var(--color-border-on-dark);
    border-radius: calc(14 * var(--u));
    background: linear-gradient(rgba(255,255,255,0.04) 0%, rgba(255,255,255,0) 56%),
                var(--color-surface-dark-2, #181818);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.055),
                0 calc(8 * var(--u)) calc(24 * var(--u)) rgba(0,0,0,0.55);
    color: var(--color-fg-on-dark);
    font-size: calc(13 * var(--u));
  }
  .mock__key {
    display: flex; align-items: center; justify-content: center;
    width: calc(28 * var(--u)); height: calc(28 * var(--u));
    border: 1px solid var(--color-hairline, rgba(255,255,255,0.075));
    border-radius: calc(6 * var(--u));
    background: rgba(255,255,255,0.03);
  }
  .mock__field { flex: 1 1 0; min-width: 0; color: var(--color-muted-on-dark); }
  .mock__chip {
    display: flex; align-items: center; height: calc(28 * var(--u));
    padding: 0 calc(8 * var(--u)); border-radius: calc(6 * var(--u));
    border: 1px solid var(--color-hairline, rgba(255,255,255,0.075));
    font-size: calc(12 * var(--u));
  }

  /* Clamp on phones so the mockup never exceeds its design size. */
  @media (max-width: 720px) {
    .mock__bar { --u: min(1px, calc((100vw - 2 * var(--space-4)) / 528)); }
  }
  /* Older engines without container queries: fall back to a fixed base unit. */
  @supports not (container-type: inline-size) {
    .mock__bar { --u: 1px; }
  }
</style>
```
