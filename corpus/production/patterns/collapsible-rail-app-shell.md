---
pattern: collapsible-rail-app-shell
from: shadcn-dashboard
corpus: production
safety: production-safe
trigger: hover
tags: [app-shell, navigation, dashboard, sidebar, container-query]
---

## What it is
The dashboard frame: a fixed off-white left rail that collapses from a full label-width sidebar to a narrow icon strip, a sticky top bar, and a single scrolling canvas wrapped as a container so its content reflows to whatever width the rail leaves behind. The chrome stays put; only the canvas scrolls.

## Why it works
Two ideas transfer. (1) **Chrome is structural, not scrolled** — the rail and header are `position: fixed`/`sticky`, so navigation and context never scroll away; the reader keeps their place in a long table. (2) **Collapse couples to content via container queries** — the rail animates a single CSS variable (`--rail`), and because the canvas is `container-type: inline-size`, its grids re-pack to the reclaimed space automatically. No width math on the content, no resize listener. Animating `width` is normally a reflow cost, but here it fires once per user toggle — never on scroll or a hot path — so it's safe. A 2% off-white rail (`#fafafa`) reads as "chrome" against the white canvas with zero hue.

## Reference implementation
```html
<style>
  .shell {
    --rail: var(--sidebar-width, 18rem);
    --rail-icon: 3rem;
    --header-h: 3.5rem;
  }
  .shell[data-collapsed="true"] { --rail: var(--rail-icon); }

  .rail {
    position: fixed; inset-block: 0; left: 0; z-index: 10;
    width: var(--rail);
    background: var(--color-surface, #fafafa);          /* off-white chrome vs white canvas */
    border-right: 1px solid var(--color-border, #e5e5e5);
    overflow: hidden;
    transition: width var(--duration-base, 200ms) linear; /* one-shot layout anim, user-triggered */
  }
  .rail .label { transition: opacity var(--duration-fast, 150ms) var(--ease-standard, cubic-bezier(0.4,0,0.2,1)); }
  .shell[data-collapsed="true"] .rail .label { opacity: 0; }

  .topbar {
    position: sticky; top: 0; z-index: 10;
    height: var(--header-h);
    display: flex; align-items: center; gap: var(--space-2, 0.5rem);
    padding-inline: var(--space-5, 1.5rem);
    background: var(--color-bg, #fff);
    border-bottom: 1px solid var(--color-border, #e5e5e5);
  }

  .canvas {
    margin-left: var(--rail);
    transition: margin-left var(--duration-base, 200ms) linear;
    container-type: inline-size;                        /* content queries THIS width */
    padding: var(--space-5, 1.5rem);
  }
  .nav-item {
    display: flex; align-items: center; gap: var(--space-2, 0.5rem);
    padding: var(--space-2, 0.5rem) var(--space-3, 0.75rem);
    border-radius: var(--radius-md, 8px);
    color: var(--color-fg, #000);
    transition: background-color var(--duration-fast, 150ms) var(--ease-standard, cubic-bezier(0.4,0,0.2,1));
  }
  .nav-item:hover { background: var(--color-surface-2, #f5f5f5); } /* hover tint, paint-only */
  .nav-item:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-ring, #a1a1a1) 50%, transparent);
  }

  @media (prefers-reduced-motion: reduce) {
    .rail, .canvas, .rail .label, .nav-item { transition: none; }
  }
</style>

<div class="shell" data-collapsed="false">
  <aside class="rail">
    <button class="nav-item"><svg width="16" height="16" aria-hidden="true"><!--icon--></svg><span class="label">Dashboard</span></button>
    <!-- more nav-items -->
  </aside>
  <header class="topbar">
    <button onclick="this.closest('.shell').dataset.collapsed = this.closest('.shell').dataset.collapsed === 'true' ? 'false' : 'true'" aria-label="Toggle sidebar">☰</button>
    <strong>Documents</strong>
  </header>
  <main class="canvas"><!-- KPI grid, chart, table reflow to the freed width --></main>
</div>
```
