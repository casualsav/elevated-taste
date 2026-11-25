---
pattern: inset-app-panel
from: catalyst
corpus: production
safety: production-safe
tags: [app-shell, dashboard, navigation, settings, layout]
---

## What it is
The skeleton of a modern application screen: a faint **tinted neutral canvas** fills the viewport, a **fixed navigation rail** holds the chrome on the left, and the actual content lives in a **floating white panel** lifted off the canvas by a 1px hairline ring, a whisper-soft shadow, and a rounded corner. On small screens the rail collapses to a hamburger + top bar and the panel goes edge-to-edge.

## Why it works
It separates "frame" from "document" with almost no visual weight. Instead of boxing content in heavy borders or dropping a big shadow, you change *two surfaces by one step of value* — the canvas is a half-shade darker than the panel — and let a 5%-ink ring draw the seam. The eye instantly reads the white area as the work surface and the tinted margin as structural chrome. Because the rail is `position: fixed` and the main column scrolls independently, long content never pushes navigation off-screen, and the panel's rounded top edge signals "scrollable document" on desktop while disappearing on mobile where corners would waste width. The whole effect survives in dark mode by inverting the same two-step relationship (near-black canvas, one-shade-lighter panel).

## Reference implementation
```html
<style>
  .app {
    min-height: 100svh;
    display: flex;
    background: var(--color-surface, #f4f4f5);   /* tinted canvas (1 step off white) */
    color: var(--color-fg, #09090b);
    font-family: var(--font-sans, Inter, system-ui, sans-serif);
  }

  /* Fixed left rail — chrome that stays put while the panel scrolls. */
  .app__rail {
    position: fixed;
    inset-block: 0;
    left: 0;
    width: 256px;
    display: flex;
    flex-direction: column;
    gap: var(--space-5, 1.5rem);
    padding: var(--space-4, 1rem);
    border-right: 1px solid var(--color-hairline, rgba(9,9,11,0.05));
  }

  /* Scrolling main column, offset by the rail width, capped for readability. */
  .app__main {
    margin-left: 256px;
    flex: 1;
    min-width: 0;
    padding: var(--space-6, 2rem);
  }
  .app__panel {
    max-width: 1152px;
    margin-inline: auto;
    padding: var(--space-7, 3rem);
    background: var(--color-bg, #ffffff);        /* the document surface */
    border-radius: var(--radius-lg, 8px);
    box-shadow:
      0 0 0 1px var(--color-hairline, rgba(9,9,11,0.05)),   /* ring, not border */
      var(--shadow-sm, 0 1px 2px rgba(9,13,18,0.05));       /* barely-there lift */
  }

  .app__hamburger { display: none; }

  /* Mobile: rail hides behind a toggle, panel goes full-bleed & flat. */
  @media (max-width: 1024px) {
    .app__rail { display: none; }
    .app__main { margin-left: 0; padding: var(--space-4, 1rem); }
    .app__panel { border-radius: 0; box-shadow: none; padding: var(--space-5, 1.5rem); }
    .app__hamburger { display: inline-flex; }
  }

  /* Dark mode keeps the same 2-step relationship, inverted. */
  @media (prefers-color-scheme: dark) {
    .app { background: var(--color-bg-dark, #18181b); color: var(--color-fg-on-dark, #f5f7fa); }
    .app__panel {
      background: var(--color-surface-dark, #27272a);
      box-shadow: 0 0 0 1px var(--color-border-on-dark, rgba(255,255,255,0.08));
    }
    .app__rail { border-color: var(--color-border-on-dark, rgba(255,255,255,0.08)); }
  }
</style>

<div class="app">
  <nav class="app__rail" aria-label="Primary">
    <!-- team switcher / primary links / contextual list / utility links / account menu -->
  </nav>
  <main class="app__main">
    <button class="app__hamburger" aria-label="Open navigation">☰</button>
    <section class="app__panel">
      <!-- the actual screen: heading, stat row, table … -->
    </section>
  </main>
</div>
```

Keep the ring at ~5% ink and the shadow near-invisible: the depth should be *felt*, not seen. If the canvas-to-panel value step is too large it reads as a card on a page; one shade is enough.
