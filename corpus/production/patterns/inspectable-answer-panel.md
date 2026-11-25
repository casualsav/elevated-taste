---
pattern: inspectable-answer-panel
from: metabase
corpus: production
safety: production-safe
trigger: load
tags: [hero, ai, dashboard, data-table, feature-section]
---

## What it is
A product-demo panel in which an AI (or automated) answer is shown **next to the exact evidence it drew from** — the question, the plain-language answer, and a cited data source / query row with per-answer feedback (thumbs up/down). Metabase pairs it with real product surfaces (a KPI card and a multi-series chart) so the whole hero *is* the app: a question in plain English, an answer, and a one-click path to "see the source behind this."

## Why it works
For any AI/automation product the first objection is "can I trust the output." A testimonial claiming accuracy is weaker than showing the machine's work inline: putting the cited source and a feedback control immediately beside the answer converts the trust argument into layout, and it demonstrates the product instead of describing it. It also reads as calm and precise because the answer, the evidence, and the chart share one type family, one accent, and one soft elevation — the marketing panel is continuous with the real UI, not a decorative mockup. Reuse in heros and feature sections for analytics, agents, search, and any "explainable answer" product.

## Reference implementation
```html
<section class="answer-demo">
  <!-- left: real product surfaces -->
  <div class="ad-metrics">
    <article class="ad-card">
      <p class="ad-label">Total Accounts</p>
      <p class="ad-value">1,228</p>
      <p class="ad-delta">↑ 0.9% vs. previous month</p>
    </article>
    <article class="ad-card ad-chart"><!-- inline SVG/canvas chart --></article>
  </div>

  <!-- right: the inspectable answer thread -->
  <div class="ad-thread" aria-live="polite">
    <p class="ad-question">Which source added the most accounts in 2026?</p>
    <p class="ad-answer"><strong>Organic added the most in 2026:</strong> 62 accounts, ahead of the rest.</p>

    <!-- the evidence: the exact source the answer drew from -->
    <details class="ad-source" open>
      <summary>Data source</summary>
      <div class="ad-source-row">
        <span class="ad-source-name">Accounts · Data library</span>
        <span class="ad-feedback" role="group" aria-label="Was this answer helpful?">
          <button aria-label="Helpful">👍</button>
          <button aria-label="Not helpful">👎</button>
        </span>
      </div>
    </details>
  </div>
</section>

<style>
  .answer-demo {
    display: grid; grid-template-columns: 1.4fr 1fr; gap: var(--space-4);
    max-width: var(--container-xl); margin-inline: auto; padding: var(--space-6);
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    /* signature soft two-layer elevation */
    box-shadow: var(--shadow-md, rgba(16,24,40,0.1) 0 4px 8px -2px), rgba(16,24,40,0.06) 0 2px 4px -2px;
  }
  .ad-metrics { display: grid; gap: var(--space-4); }
  .ad-card {
    background: var(--color-bg); border: 1px solid var(--color-hairline);
    border-radius: var(--radius-lg); padding: var(--space-5);
  }
  .ad-label  { color: var(--color-muted); font-size: var(--text-sm); }
  .ad-value  { color: var(--color-fg); font-size: var(--text-4xl); font-weight: var(--weight-bold); letter-spacing: var(--tracking-heading); }
  .ad-delta  { color: var(--color-success); font-size: var(--text-sm); }

  .ad-thread { display: flex; flex-direction: column; gap: var(--space-3); }
  .ad-question {
    align-self: flex-end; max-width: 80%;
    background: var(--color-surface); border-radius: var(--radius-lg);
    padding: var(--space-3) var(--space-4); color: var(--color-fg);
  }
  .ad-answer { color: var(--color-fg); line-height: var(--leading-normal); }
  .ad-answer strong { font-weight: var(--weight-bold); }

  .ad-source {
    border: 1px solid var(--color-border); border-radius: var(--radius-lg);
    padding: var(--space-3) var(--space-4);
  }
  .ad-source summary { color: var(--color-muted); font-size: var(--text-sm); cursor: pointer; }
  .ad-source-row { display: flex; align-items: center; justify-content: space-between; margin-top: var(--space-2); }
  .ad-source-name { color: var(--color-fg); font-weight: var(--weight-semibold); }
  .ad-feedback button {
    background: none; border: 0; cursor: pointer; padding: var(--space-1);
    border-radius: var(--radius-sm); color: var(--color-subtle);
    transition: color var(--duration-fast) var(--ease-standard);
  }
  .ad-feedback button:hover,
  .ad-feedback button:focus-visible { color: var(--color-accent, #509ee3); }

  /* enter choreography — the answer + source rise in on load */
  .ad-answer, .ad-source { opacity: 0; transform: translateY(8px); animation: ad-rise var(--duration-slow) var(--ease-entrance) forwards; }
  .ad-source { animation-delay: var(--duration-base); }
  @keyframes ad-rise { to { opacity: 1; transform: none; } }

  @media (max-width: 768px) { .answer-demo { grid-template-columns: 1fr; } }

  @media (prefers-reduced-motion: reduce) {
    .ad-answer, .ad-source { animation: none; opacity: 1; transform: none; }
  }
</style>
```
