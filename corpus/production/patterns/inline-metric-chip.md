---
pattern: inline-metric-chip
from: mintlify
corpus: production
safety: production-safe
tags: [hero, feature-section, navigation, data-table, changelog]
---

## What it is

A small label-plus-value pill where the **label is set in the body sans and the value in a monospace face tinted with the brand accent**, on a faint accent-at-low-alpha background (e.g. `Agent traffic  55.6262%`, the percentage in emerald mono). Mintlify scatters these as live-telemetry signals: a chip floating over the hero, and inline runs woven into section headers ("Agents at work today  342 · API requests  61.3k · …") and as the `300M+ / 2B+ / 99.99%` stat row. The monospace + tabular precision + green is the entire tell.

## Why it works

Monospace reads as "machine output," so a number set in mono and given the accent color is instantly parsed as *real, live, measured* data rather than marketing rounding — the typeface does rhetorical work that copy can't. Carrying the value in the accent hue (against an 8%-alpha wash of the same hue) ties every metric to the brand without a loud background, so dozens of them can pepper a page and still read as one calm system. Pinning the unit/precision in mono also keeps figures vertically aligned when stacked (tabular figures), which makes stat rows scannable. Pairing a humanist sans label with a mono value is a reusable two-face contrast that signals "human context : system value" — transferable to dashboards, pricing ("$0.001 / request"), changelogs, status pages, and any hero that wants to feel data-backed.

## Why it works (safety)

Production-safe and cheap. Use `font-variant-numeric: tabular-nums` (or a mono with tabular figures) so values don't jitter when they update. Color must not be the only signal — keep AA contrast (emerald `#199b5e` on near-white passes) and pair live values with a visible label for screen readers; if the number animates/counts up, gate it behind `prefers-reduced-motion` and expose the final value in the DOM.

## Reference implementation

```html
<style>
  .metric {
    display: inline-flex;
    align-items: baseline;
    gap: var(--space-2);
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-full);
    /* live-data wash = the accent token at low alpha, derived not hard-coded */
    background: color-mix(in srgb, var(--color-accent) 8%, transparent);
    font-size: var(--text-sm);
  }
  .metric-label { font-family: var(--font-sans); color: var(--color-muted); }
  .metric-value {
    font-family: var(--font-mono);
    color: var(--color-accent);
    font-variant-numeric: tabular-nums;              /* steady width on update */
  }

  /* inline stat row variant: big mono value + small caption, no pill */
  .statrow { display: flex; gap: var(--space-7); }
  .statrow dt { font-family: var(--font-mono); font-size: var(--text-2xl); color: var(--color-fg); font-variant-numeric: tabular-nums; }
  .statrow dd { margin: 0; font-size: var(--text-sm); color: var(--color-muted); }
</style>

<span class="metric">
  <span class="metric-label">Agent traffic</span>
  <span class="metric-value">55.6262%</span>
</span>

<dl class="statrow">
  <div><dt>300M+</dt><dd>visitors in the past year</dd></div>
  <div><dt>2B+</dt><dd>agents in the past year</dd></div>
  <div><dt>99.99%</dt><dd>uptime across all services</dd></div>
</dl>
```
