---
pattern: app-shell-scroll-frame
from: grafana-play
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [app-shell, dashboard, navigation, layout]
---

## What it is
The canonical console/dashboard skeleton: a **fixed left nav rail**, a **fixed top bar** (breadcrumbs · search · actions), and an optional **sticky sub-toolbar**, wrapped around a single **scrolling content well**. Only the content moves; every piece of chrome stays pinned, so the user's spatial model of "where nav is / where search is" never changes with scroll depth. This is the layout Grafana's dashboard app uses, and it generalizes to any tool that must hold a lot of navigation next to a lot of content.

## Why it works
Pinning the chrome is done with native `position: fixed` / `position: sticky` and CSS grid — **no scroll listeners, no JS**, so it's compositor-cheap and jank-free. Depth is a clean z-order (rail < header < sticky toolbar < popovers/toasts) layered by *surface-tint step* (ground → panel → raised control) rather than by shadow. The content well is the only scroll container, which keeps focus order sane and lets the grid inside it be anything — a dashboard of panels, a table, a form. Reduced-motion needs no special handling because nothing animates on scroll.

## Reference implementation
```html
<!-- framework-neutral; tokens from /tokens, Grafana-specific darks as inline fallbacks -->
<style>
  .shell {
    --rail-w: 240px;
    --header-h: 3rem;
    min-height: 100dvh;
    background: var(--color-bg-dark, #111217);
    color: var(--color-fg-on-dark, #ccccdc);
    font: var(--weight-regular) var(--text-sm)/1.57 Inter, system-ui, sans-serif;
  }

  /* Fixed left nav rail — its own darker ground, own scroll */
  .shell__rail {
    position: fixed; inset: 0 auto 0 0; width: var(--rail-w);
    z-index: 2; overflow-y: auto;
    background: var(--color-surface-dark, #181b1f);
    border-right: 1px solid var(--color-border-on-dark, rgba(204,204,220,0.08));
    padding: var(--space-3);
  }

  /* Fixed top bar — breadcrumbs · search · actions */
  .shell__header {
    position: fixed; top: 0; right: 0; left: var(--rail-w);
    z-index: 1000; height: var(--header-h);
    display: flex; align-items: center; gap: var(--space-3);
    padding-inline: var(--space-4);
    background: var(--color-surface-dark, #181b1f);
    border-bottom: 1px solid var(--color-border-on-dark, rgba(204,204,220,0.08));
  }

  /* The ONLY scrolling region */
  .shell__main {
    margin-left: var(--rail-w); padding-top: var(--header-h);
    min-height: 100dvh;
  }

  /* Sticky sub-toolbar — rides just under the fixed header */
  .shell__toolbar {
    position: sticky; top: var(--header-h); z-index: 1020;
    display: flex; align-items: center; gap: var(--space-2);
    padding: var(--space-2) var(--space-4);
    background: var(--color-bg-dark, #111217);
    border-bottom: 1px solid var(--color-border-on-dark, rgba(204,204,220,0.08));
  }

  .shell__content { padding: var(--space-4); }

  /* Collapse the rail to an off-canvas drawer on small screens */
  @media (max-width: 768px) {
    .shell__rail { transform: translateX(-100%); transition: transform var(--duration-base) var(--ease-standard); }
    .shell__rail[data-open] { transform: none; }
    .shell__header, .shell__main { left: 0; margin-left: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .shell__rail { transition: none; }
  }
</style>

<div class="shell">
  <nav class="shell__rail" aria-label="Primary">…nav items…</nav>
  <header class="shell__header">…breadcrumbs · search · actions…</header>
  <main class="shell__main">
    <div class="shell__toolbar" role="toolbar" aria-label="Dashboard actions">…</div>
    <div class="shell__content"><!-- panels / table / form --></div>
  </main>
</div>
```
Note the tap-target caveat from the exemplar: the rail/toolbar icon buttons should be ≥44px on touch — pad the hit-area even if the glyph is small.
