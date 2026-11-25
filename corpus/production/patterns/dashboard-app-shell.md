---
pattern: dashboard-app-shell
from: grafana-play
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [app-shell, dashboard, navigation, layout]
---

## What it is
The workspace skeleton for a data/admin tool: a full-height left navigation rail, a top command bar, and a *sticky* per-object control strip, all persistent, bracketing a single scrolling content canvas. Navigation and context never scroll away; only the data moves. In the exemplar the canvas holds a responsive grid of viz panels — most transparent so the dark ground shows through, a few given a solid surface to group prose.

## Why it works
Separating *chrome* from *content* is the core move. The rail and header are `position:fixed` and the control strip is `position:sticky`, so pinning them costs nothing — no scroll listener, no reflow — while `main` scrolls under them. The content column is simply inset by the rail width and header height. Because the shell is one flat, near-monochrome field, saturated color is free to mean *data*. Panels default to transparent (`background:none`) and only opt into a surface + hairline when they hold text, so backgrounds group meaning instead of boxing everything.

## Reference implementation
```html
<style>
  .app {
    --rail: 250px;
    --header-h: 3.5rem;
    --controls-h: 3rem;
    min-height: 100vh;
    background: var(--color-bg-dark, #111217);
    color: var(--color-fg-on-dark, #ccccdc);
    font-family: var(--font-sans);
    font-size: var(--text-sm, .875rem);
    line-height: var(--leading-normal, 1.57);
  }

  /* Left rail — fixed, full height */
  .app__rail {
    position: fixed; inset: 0 auto 0 0; width: var(--rail);
    background: var(--color-surface-dark, #181b1f);
    border-right: 1px solid var(--color-border-on-dark, rgba(204,204,220,.12));
    overflow-y: auto; z-index: 2;
  }
  .app__nav a {
    display: flex; gap: var(--space-2, .5rem); align-items: center;
    padding: var(--space-2, .5rem) var(--space-4, 1rem);
    color: color-mix(in srgb, var(--color-fg-on-dark, #ccccdc) 65%, transparent);
    text-decoration: none; border-radius: var(--radius-sm, 6px);
    transition: color var(--duration-fast, 120ms) var(--ease-standard, cubic-bezier(.4,0,.2,1)),
                background var(--duration-fast, 120ms) var(--ease-standard, cubic-bezier(.4,0,.2,1));
  }
  .app__nav a:hover {           /* opacity-lift: muted -> full, whisper of fill */
    color: var(--color-fg-on-dark, #ccccdc);
    background: var(--color-hairline, rgba(204,204,220,.08));
  }

  /* Top command bar — fixed, offset by the rail */
  .app__header {
    position: fixed; top: 0; left: var(--rail); right: 0; height: var(--header-h);
    display: flex; align-items: center; gap: var(--space-4, 1rem);
    padding-inline: var(--space-4, 1rem);
    background: var(--color-surface-dark, #181b1f);
    border-bottom: 1px solid var(--color-border-on-dark, rgba(204,204,220,.12));
    z-index: 1000;
  }

  /* Scrolling content column */
  .app__main {
    margin-left: var(--rail); padding-top: var(--header-h);
  }

  /* Per-object control strip — sticky, rides just under the header */
  .app__controls {
    position: sticky; top: var(--header-h);
    display: flex; justify-content: flex-end; gap: var(--space-2, .5rem);
    padding: var(--space-2, .5rem) var(--space-4, 1rem);
    background: var(--color-bg-dark, #111217);
    z-index: 1020;
  }

  /* Panel grid — transparent by default; opt into a surface for prose */
  .app__grid {
    display: grid; grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4, 1rem); padding: var(--space-4, 1rem);
  }
  .panel { border-radius: var(--radius-sm, 6px); padding: var(--space-3, .75rem); }
  .panel--surface {             /* only text-heavy panels get a background */
    background: var(--color-surface-dark, #181b1f);
    border: 1px solid var(--color-border-on-dark, rgba(204,204,220,.12));
    box-shadow: 0 1px 2px rgba(1,4,9,.75);
  }

  @media (max-width: 768px) {
    .app { --rail: 0px; }
    .app__rail { transform: translateX(-100%); }   /* becomes a hamburger drawer */
    .app__header { left: 0; }
    .app__grid { grid-template-columns: 1fr; }
  }
</style>

<div class="app">
  <aside class="app__rail">
    <nav class="app__nav">
      <a href="#">Dashboards</a>
      <a href="#">Explore</a>
      <a href="#">Alerts</a>
    </nav>
  </aside>

  <header class="app__header"><!-- breadcrumbs · search · actions --></header>

  <main class="app__main">
    <div class="app__controls"><!-- edit · share · time range --></div>
    <div class="app__grid">
      <section class="panel"><!-- transparent viz on the canvas --></section>
      <section class="panel panel--surface"><!-- prose panel, solid --></section>
    </div>
  </main>
</div>
```

## Merged in
`app-shell-scroll-frame` (a second write-up of the same Grafana shell) was folded in here. What it added:
- The top bar's usual contents are breadcrumbs, search and actions; the sticky strip under it is optional and per object.
- Depth comes from a z-order (rail < header < sticky toolbar < popovers and toasts) carried by surface-tint steps, not shadows.
- Because the content well is the only scroll container, focus order stays sane and the well can hold anything: a panel grid, a table or a form.
