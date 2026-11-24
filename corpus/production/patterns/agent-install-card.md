---
pattern: agent-install-card
from: framer
corpus: production
safety: production-safe
tags: [feature-section, interactive-showcase, developer-tool, product-marketing, dark]
---

## What it is
A card styled as a **terminal / desktop window** — OS traffic-light dots in a title bar, a monospace body — whose job is not to show a code snippet but to present **getting started as the product's own native surface**. Across the top sits a **provider/tool tab-switcher** (Framer uses `claude · cursor · codex`, each a small icon-chip), and the footer is a **dual action row: "Copy install prompt" (one-click, with a copy glyph) next to a solid "Install" button**. The body shows a short, branded banner (`framer-agent · Claude Code v2.1.170 · Sonnet 4.6 · Claude Team · Framer`) rather than a long listing. It sits on the dark page as a flat near-black surface with a hairline border — the window chrome supplies all the texture.

## Why it works
For a tool that plugs into AI coding agents, the install step *is* a feature, and dressing it as a terminal makes the abstract ("works with your agent") concrete and credible — the visitor recognizes their own environment and infers "this drops straight into my workflow." The tab-switcher does ecosystem-breadth signalling with a single glance ("works with the agent *I* use") and gives one zero-stakes interaction inside the card. Splitting the action into **Copy prompt** + **Install** respects two real intents — power users copy a setup prompt to paste into their agent; everyone else clicks Install — so one card serves both without a fork in the page. Leaning on window chrome instead of borders/shadows for identity keeps it flat and on-brand for a dark, restrained system. This differs from a code-block hero (which leads with a *runnable syntax snippet* and language tabs): here the artifact is an **install affordance**, the tabs are *providers/integrations*, and the payload is a copy-able prompt + a button — reuse it for any CLI, plugin, MCP server, agent integration, or "add to your IDE" onboarding moment.

## Production-safety
**production-safe.** Build tabs as real `role="tablist"`/`role="tab"` with `aria-selected` and arrow-key navigation; the copy button must be a real `<button>` that writes to `navigator.clipboard` and announces success via an `aria-live` region (not just a visual checkmark). Provider logos need `alt` text. The monospace banner is decorative text — keep it at/above `--text-xs` and AA contrast (white-on-near-black is fine; avoid putting essential copy at 40% alpha). No perf cost beyond the small provider icons (lazy-load them).

## Reference implementation
```html
<div class="install-card">
  <div class="install-card__bar">
    <span class="install-card__lights" aria-hidden="true"><i></i><i></i><i></i></span>
    <span class="install-card__title">framer-agent</span>
  </div>

  <div class="install-card__tabs" role="tablist" aria-label="Choose your agent">
    <button role="tab" aria-selected="true"  class="install-card__tab is-active">◆ claude</button>
    <button role="tab" aria-selected="false" class="install-card__tab">⌘ cursor</button>
    <button role="tab" aria-selected="false" class="install-card__tab">⌥ codex</button>
  </div>

  <pre class="install-card__body" role="tabpanel"><span class="accent">Claude Code</span> v2.1.170
Sonnet 4.6 · Claude Team · Framer</pre>

  <div class="install-card__actions">
    <button class="install-card__copy" data-clip="npx framer-agent init">
      Copy install prompt <span aria-hidden="true">⧉</span>
    </button>
    <button class="install-card__install">Install</button>
    <span class="sr-only" role="status" aria-live="polite"></span>
  </div>
</div>

<style>
.install-card {
  width: min(92vw, var(--container-sm));
  background: var(--color-surface);                 /* flat near-black */
  border: 1px solid var(--color-border);            /* 10% white hairline */
  border-radius: var(--radius-lg);
  overflow: hidden;
  color: var(--color-fg);
  font-family: var(--font-mono);
}
.install-card__bar {
  display: flex; align-items: center; gap: var(--space-4);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
}
.install-card__lights { display: inline-flex; gap: var(--space-2); }
.install-card__lights i { width: .75em; height: .75em; border-radius: var(--radius-full);
  background: var(--color-subtle); }
.install-card__lights i:nth-child(1) { background: #ff5f57; }
.install-card__lights i:nth-child(2) { background: #febc2e; }
.install-card__lights i:nth-child(3) { background: var(--color-success); }
.install-card__title { color: var(--color-muted); font-size: var(--text-sm); }

.install-card__tabs { display: flex; gap: var(--space-2);
  padding: var(--space-3) var(--space-4) 0; }
.install-card__tab {
  font: inherit; font-size: var(--text-sm); cursor: pointer;
  color: var(--color-muted);
  background: transparent; border: 1px solid transparent;
  border-radius: var(--radius-full);
  padding: var(--space-2) var(--space-4);
}
.install-card__tab.is-active {
  color: var(--color-fg);
  background: var(--color-button-dark-bg, rgba(255,255,255,0.1));
  border-color: var(--color-border);
}
.install-card__tab:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }

.install-card__body {
  margin: 0; padding: var(--space-5) var(--space-4);
  font-size: var(--text-sm); line-height: var(--leading-normal);
  color: var(--color-muted); white-space: pre-wrap;
}
.install-card__body .accent { color: var(--color-accent); }

.install-card__actions {
  display: flex; gap: var(--space-3); align-items: center;
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid var(--color-border);
}
.install-card__copy {
  flex: 1; display: inline-flex; justify-content: space-between; align-items: center;
  font: inherit; font-size: var(--text-sm); cursor: pointer;
  color: var(--color-muted);
  background: var(--color-button-dark-bg, rgba(255,255,255,0.1));
  border: 0; border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
}
.install-card__install {
  font: inherit; font-size: var(--text-sm); font-weight: var(--weight-medium); cursor: pointer;
  color: var(--color-button-light-fg, #111111);
  background: var(--color-button-light-bg, #ffffff);          /* white primary */
  border: 0; border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-5);
}
.install-card__copy:focus-visible,
.install-card__install:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
</style>
```
