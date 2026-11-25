---
pattern: outlined-app-icon-grid
from: posthog
corpus: production
safety: production-safe
tags: [feature-section, product-marketing, navigation]
---

## What it is
A dense, scannable grid of small cells — each a colored icon plus a short label — used to show the breadth of a multi-product platform, an integration list, or a feature suite at a glance. Every cell wears the *same* heavy outline on a warm off-white canvas, and color is used to *category-code* the icons (one hue per group), never to signal emphasis. PostHog uses it for its ~16-product directory ("Product OS"), four across on desktop, collapsing to fewer columns on mobile.

## Why it works
When a product genuinely does many things, a tiled directory communicates "broad platform" instantly and invites scanning, where prose would bury the breadth in paragraphs. Three mechanisms keep high density legible: (1) a single uniform outline weight/color groups and separates every cell, doing the job whitespace does on sparse layouts, so the grid can be tight without feeling crowded; (2) icon color is reserved for *categorization*, so the eye never confuses "this is a different kind of thing" with "this is the important thing"; (3) one type family + one label weight keeps the repeated cells calm. The warm tinted canvas (not pure white) lets the bright icons read as deliberate rather than like a loud prototype. Transferable to any "everything we offer / everything we integrate with" section — keep emphasis (a primary CTA) in a separate, single accent color outside the grid.

## Reference implementation
```html
<style>
  .app-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-3);
    max-width: var(--container-lg);
    margin-inline: auto;
    background: var(--color-bg);          /* warm off-white canvas, not #fff */
    padding: var(--space-5);
  }
  .app-grid__cell {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-3);
    border: 1px solid var(--color-border);  /* one uniform outline = the structure */
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    color: var(--color-fg);
    text-decoration: none;
    font-size: var(--text-sm);
    font-weight: 600;
  }
  .app-grid__cell:hover { background: var(--color-surface-2); }
  /* color codes the CATEGORY, not importance */
  .app-grid__icon {
    flex: none;
    width: 1.75rem; height: 1.75rem;
    display: grid; place-items: center;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--cat, var(--color-surface-2));
  }
  @media (max-width: 768px) { .app-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 480px) { .app-grid { grid-template-columns: 1fr; } }
</style>

<nav class="app-grid" aria-label="Products">
  <a class="app-grid__cell" href="/analytics">
    <span class="app-grid__icon" style="--cat: var(--color-cat-cyan, #30abc6)" aria-hidden="true">📊</span>
    Product analytics
  </a>
  <a class="app-grid__cell" href="/replay">
    <span class="app-grid__icon" style="--cat: var(--color-cat-magenta, #b62ad9)" aria-hidden="true">🎬</span>
    Session replay
  </a>
  <a class="app-grid__cell" href="/flags">
    <span class="app-grid__icon" style="--cat: var(--color-cat-green, #6aa84f)" aria-hidden="true">🚩</span>
    Feature flags
  </a>
  <a class="app-grid__cell" href="/warehouse">
    <span class="app-grid__icon" style="--cat: var(--color-cat-amber, #eb9d2a)" aria-hidden="true">🗄️</span>
    Data warehouse
  </a>
  <!-- …repeat for the full catalog -->
</nav>
```

Safety: production-safe. The category hues (`--color-cat-*`) are decorative tints behind labeled links, so the *text* carries meaning — icons are `aria-hidden` and the label is always present (icon-alone is not an accessible name). Verify each `--cat` fill clears contrast for any text placed *on* it (here text sits beside, not on, the icon, which sidesteps the issue). The grid must collapse columns cleanly on small screens; don't let cells shrink below a tappable size.
