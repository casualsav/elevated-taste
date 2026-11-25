---
pattern: os-shell-window-frame
from: posthog
corpus: production
safety: production-safe
tags: [brand-experience, hero, navigation, product-marketing]
---

## What it is
A marketing page dressed as a desktop operating system. A fixed title/menu bar runs across the top with faux window controls (the three "traffic-light" dots) and an app/window title; an optional vertical rail of app icons sits down one side; and the main content sits in the middle reading as the focused "window." It is not a hero illustration — it is the page's *layout chrome*, the organizing conceit the rest of the design hangs on. PostHog uses it to frame its whole homepage as a friendly fake OS ("hedgehog.exe").

## Why it works
A single sustained metaphor buys personality far more cheaply and safely than scattered decoration. Because the conceit is structural — it defines the top bar, the side rail, and how sections are framed — every playful element afterward (illustrations, dense grids, bright accents) reads as part of one coherent world instead of noise. The chrome also does quiet UX work: the top bar is a natural home for the primary CTA, and the rail is a natural home for product/category nav. The discipline that keeps it from becoming kitsch is restraint elsewhere (one font, one accent for action, one border weight), so the *idea* is loud while the *kit* is small. Transfers to any product that wants a strong opinionated identity; swap the OS metaphor for whatever world fits the brand (terminal, notebook, game HUD) — the move is "commit one metaphor to the layout," not "add a mascot."

## Reference implementation
```html
<style>
  .os-shell {
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    overflow: hidden;
    max-width: var(--container-xl);
    margin-inline: auto;
  }
  /* title / menu bar with window controls */
  .os-shell__bar {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-2) var(--space-3);
    border-bottom: 1px solid var(--color-border);
    background: var(--color-surface);
    font-size: var(--text-sm);
  }
  .os-shell__lights { display: flex; gap: var(--space-2); }
  .os-shell__lights span {
    width: 0.75rem; height: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
  }
  .os-shell__title { font-weight: 600; }
  .os-shell__menu { display: flex; gap: var(--space-4); color: var(--color-muted); }
  .os-shell__cta { margin-inline-start: auto; }
  .os-shell__cta a {
    padding: var(--space-1) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    background: var(--color-accent);
    color: var(--color-accent-fg);
    font-weight: 600;
    text-decoration: none;
  }
  /* body = side rail + content "window" */
  .os-shell__body { display: grid; grid-template-columns: auto 1fr; }
  .os-shell__rail {
    display: flex; flex-direction: column; gap: var(--space-2);
    padding: var(--space-3);
    border-inline-end: 1px solid var(--color-border);
  }
  .os-shell__rail a {
    width: 2.5rem; height: 2.5rem;
    display: grid; place-items: center;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-sm);
    color: var(--color-fg);
    text-decoration: none;
  }
  .os-shell__content { padding: var(--space-6); }
  @media (max-width: 768px) {
    .os-shell__body { grid-template-columns: 1fr; }   /* rail collapses on mobile */
    .os-shell__rail { display: none; }
    .os-shell__menu { display: none; }
    .os-shell__content { padding: var(--space-4); }
  }
</style>

<section class="os-shell">
  <!-- decorative window chrome: controls are NOT real OS actions -->
  <div class="os-shell__bar">
    <div class="os-shell__lights" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>
    <span class="os-shell__title">acme.exe</span>
    <nav class="os-shell__menu" aria-label="Primary">
      <a href="/product">Product</a>
      <a href="/pricing">Pricing</a>
      <a href="/docs">Docs</a>
    </nav>
    <div class="os-shell__cta"><a href="/start">Get started</a></div>
  </div>

  <div class="os-shell__body">
    <!-- real, labeled nav links styled as an app dock -->
    <nav class="os-shell__rail" aria-label="Apps">
      <a href="/analytics" aria-label="Analytics">📊</a>
      <a href="/sessions" aria-label="Session replay">🎬</a>
      <a href="/flags" aria-label="Feature flags">🚩</a>
    </nav>

    <main class="os-shell__content">
      <h1>Your headline here</h1>
      <p>The chrome frames a normal document. Content keeps a natural reading order.</p>
    </main>
  </div>
</section>
```

Safety: the window controls are decoration — mark them `aria-hidden` and give them no behavior unless they genuinely act. Keep the rail items *real labeled links* (icon-only needs `aria-label`) or mark them decorative; never let the faux chrome trap focus or reorder the document. The central `<main>` must read normally for screen readers and reflow to a plain vertical scroll on mobile (rail + extra menu hidden).
