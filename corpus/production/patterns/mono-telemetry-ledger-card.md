---
pattern: mono-telemetry-ledger-card
from: router
corpus: production
safety: production-safe
trigger: in-view
tags: [feature-section, data-viz, motion]
---

## What it is

A near-black product panel that renders the product's own structured data — a request/cost ledger — as the marketing art. Each row has a monospace header with a status chip (`Cache hit · 100%` / `Cache miss`), a right-aligned tabular-figure cost, a model/provenance line, and a single horizontal **proportion bar** split into labelled segments (cached / new / output). It reveals on scroll with a quiet fade+rise, and inner rows cascade a beat after the panel. Ideal for observability, billing/usage, routing, or any "we measured it" credibility section.

## Why it works

Showing real, legible telemetry is more persuasive than an abstract illustration for an infra/data product — it *is* the demo and reads as proof. The monospace + tabular numerals make columns of figures align and signal "measured fact"; the proportion bar turns a number into an instantly-scannable shape; the status chip color-codes outcome without a legend. The reveal is cheap and safe: `opacity` + `transform: translateY()` gated by one `IntersectionObserver`, with a short stagger between the panel and its rows so it "assembles" rather than popping. The data palette is scoped to the panel, so it never competes with the page's restrained neutrals.

## Reference implementation

```html
<article class="ledger" data-reveal>
  <header class="ledger__head">
    <span class="ledger__turn">Turn 58</span>
    <span class="ledger__chip ledger__chip--ok">Cache hit · 100%</span>
    <span class="ledger__cost">$0.003094</span>
  </header>
  <p class="ledger__meta">GPT-5.6 Luna · OpenAI <span>Follows Turn 57</span></p>

  <div class="ledger__bar" role="img"
       aria-label="269,753 cached, 405 new, 117 output tokens">
    <span class="ledger__seg" style="flex: 269753" data-kind="cached"></span>
    <span class="ledger__seg" style="flex: 405"    data-kind="new"></span>
    <span class="ledger__seg" style="flex: 117"    data-kind="output"></span>
  </div>
  <ul class="ledger__legend">
    <li data-kind="cached">Cached input <b>269,753</b></li>
    <li data-kind="new">New input <b>405</b></li>
    <li data-kind="output">Output <b>117</b></li>
  </ul>
</article>

<style>
  .ledger {
    background: var(--color-panel, #0d0e0d);
    color: var(--color-fg-on-dark, #f5f7fa);
    border-radius: var(--radius-lg, 12px);
    padding: var(--space-5, 1.5rem);
    box-shadow: var(--ledger-shadow, 0 18px 44px rgba(29,27,25,0.18));
    font-family: var(--font-mono);
    font-variant-numeric: tabular-nums;
    display: grid;
    gap: var(--space-3, 0.75rem);
  }

  .ledger__head { display: flex; align-items: center; gap: var(--space-3, 0.75rem); }
  .ledger__turn { font-family: var(--font-sans); font-size: var(--text-lg, 1.25rem); }
  .ledger__cost { margin-left: auto; color: var(--color-muted-on-dark, rgba(245,247,250,0.64)); }

  .ledger__chip {
    font-size: var(--text-xs, 0.75rem);
    padding: 2px var(--space-2, 0.5rem);
    border-radius: var(--radius-sm, 4px);
  }
  .ledger__chip--ok   { background: color-mix(in oklab, var(--status-ok, #a9c3a2) 24%, transparent); color: var(--status-ok, #a9c3a2); }
  .ledger__chip--miss { background: color-mix(in oklab, var(--status-miss, #e0aebc) 24%, transparent); color: var(--status-miss, #e0aebc); }

  .ledger__meta { font-size: var(--text-sm, 0.875rem); color: var(--color-muted-on-dark, rgba(245,247,250,0.64)); }
  .ledger__meta span { font-style: italic; opacity: 0.7; margin-left: var(--space-3, 0.75rem); }

  /* proportion bar: flex-weighted segments, no magic widths */
  .ledger__bar { display: flex; height: 8px; border-radius: var(--radius-full, 9999px); overflow: hidden; }
  .ledger__seg[data-kind="cached"] { background: var(--data-cached, #7b8fd6); }
  .ledger__seg[data-kind="new"]    { background: var(--data-new, #e4f222); }
  .ledger__seg[data-kind="output"] { background: var(--data-output, #8b6f9e); }

  .ledger__legend { display: flex; flex-wrap: wrap; gap: var(--space-4, 1rem); font-size: var(--text-sm, 0.875rem); list-style: none; padding: 0; margin: 0; }
  .ledger__legend li { display: inline-flex; align-items: center; gap: var(--space-2, 0.5rem); color: var(--color-muted-on-dark, rgba(245,247,250,0.64)); }
  .ledger__legend li::before { content: ""; width: 8px; height: 8px; border-radius: var(--radius-sm, 4px); }
  .ledger__legend li[data-kind="cached"]::before { background: var(--data-cached, #7b8fd6); }
  .ledger__legend li[data-kind="new"]::before    { background: var(--data-new, #e4f222); }
  .ledger__legend li[data-kind="output"]::before { background: var(--data-output, #8b6f9e); }

  /* in-view reveal: panel rises, children cascade a beat later */
  [data-reveal] { opacity: 0; transform: translateY(18px); transition: opacity var(--duration-slow, 320ms) var(--ease-entrance, cubic-bezier(0,0,0,1)), transform var(--duration-slow, 320ms) var(--ease-entrance, cubic-bezier(0,0,0,1)); }
  [data-reveal].is-in { opacity: 1; transform: none; }
  [data-reveal] > * { opacity: 0; transform: translateY(7px); transition: opacity var(--duration-base, 200ms) var(--ease-standard, cubic-bezier(0.2,0,0,1)), transform var(--duration-base, 200ms) var(--ease-standard, cubic-bezier(0.2,0,0,1)); }
  [data-reveal].is-in > * { opacity: 1; transform: none; }
  [data-reveal].is-in > *:nth-child(2) { transition-delay: 60ms; }
  [data-reveal].is-in > *:nth-child(3) { transition-delay: 120ms; }
  [data-reveal].is-in > *:nth-child(4) { transition-delay: 180ms; }

  @media (prefers-reduced-motion: reduce) {
    [data-reveal], [data-reveal] > * { opacity: 1; transform: none; transition: none; }
  }
</style>

<script>
  // Cheap: one observer, fires once, no scroll handler.
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    }
  }, { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
</script>
```
