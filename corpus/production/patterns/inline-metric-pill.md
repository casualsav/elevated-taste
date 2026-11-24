---
pattern: inline-metric-pill
from: ramp
corpus: production
safety: production-safe
tags: [hero, feature-section, social-proof]
---

## What it is
A line of running label text in which the *quantitative* token — a dollar figure, a percentage, a live-updating counter — is wrapped in a small rounded **accent pill** set flush inside the sentence ("US CORPORATE PAYMENTS PROCESSED BY RAMP: `$0.749…` `153%`"). The surrounding label is small, uppercase, muted; the pill is the one spot of brand color on the line. Ramp uses it for a live payments ticker and for stat callouts, so the proof number is the thing that's colored, not the prose around it.

## Why it works
Numbers are the actual proof in B2B marketing, but inside a sentence they read at the same visual rank as the words. Wrapping only the figure in a filled accent pill promotes it on a *separate channel* (background fill + rounding) without changing type size or weight, so the eye is pulled to the metric and the copy stays quiet. The pill shape also reads as "value/token/data," which suits live or computed figures (a ticker, a counter) — it signals "this is a real number" rather than headline puffery. Because the accent is spent only here and on the CTA, the page's two loud elements are exactly *the proof* and *the action*. Transfers to any stat strip, social-proof ticker, or inline KPI callout. It is also the natural home for an animated counter: animate the text node, the pill stays put.

## Reference implementation
```html
<style>
  .metric-line {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    flex-wrap: wrap;
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--color-muted);                 /* label is demoted */
  }
  .metric-pill {
    display: inline-flex;
    align-items: center;
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-full);          /* pill = "this is a value" */
    background: var(--color-accent);
    color: var(--color-accent-fg);              /* dark text: accent is light */
    font-variant-numeric: tabular-nums;         /* steady width while it counts */
    letter-spacing: var(--tracking-normal);
    white-space: nowrap;
  }
</style>

<p class="metric-line">
  <span>US corporate payments processed by Ramp</span>
  <span class="metric-pill" aria-label="747 billion dollars">$0.747B</span>
  <span class="metric-pill">+153%</span>
</p>
```

**Safety:** production-safe. The accent is a light hue, so the pill text must be dark (`--color-accent-fg`) to pass contrast — never white-on-accent. Use `tabular-nums` so a live/animated counter doesn't jitter the pill width, and expose the value via `aria-label` (or pause the counter for `prefers-reduced-motion`) so the figure is announced cleanly.
