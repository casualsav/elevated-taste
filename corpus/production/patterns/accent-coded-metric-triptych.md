---
pattern: accent-coded-metric-triptych
from: baremetrics
corpus: production
safety: production-safe
tags: [feature-section, marketing, dashboard, product-page]
---

## What it is
A feature/metric section built as a **split heading** (oversized H2 left, short muted paragraph right) sitting above a **row of three neutral cards**, where each card is a product screenshot topped by a small icon + label in a distinct accent hue drawn from a fixed house set. Baremetrics repeats this block down the page for "Revenue Churn / Sales / Trial Conversion" and for cancellation/failed-charge features, cycling blue · purple · teal · yellow · green · pink through the tiny labels while the cards themselves stay white.

## Why it works
It lets a data-dense analytics page use *rainbow color* without looking like a toy. The discipline is: **color is a per-item index, never a fill.** The cards are neutral (white, one soft ink-tinted shadow, 16px radius); the only saturated color is a ~30px monogram/icon and its label. Because the hues are tiny and consistent, they scan as a *wayfinding system* — "green = trial, purple = revenue" — that the reader carries into the product, instead of as decoration competing with the content.

Two reinforcing moves:
- **The split header repeats identically down the page** — big H2 (max-width ~500px) left, one muted sentence (max-width ~520px) right, `justify-content: space-between`. Reusing one geometry turns a stack of unrelated sections into a perceivable system; the eye learns the rhythm.
- **Hierarchy is scale + value, not weight.** The H2 is large; the description is separated by *lightening the same ink hue to a muted tint*, not by bolding. The accent appears once per card, at small size, so the eye still lands on the heading first, then the action.

Cards carry a cheap `transform`-only hover-lift (`transition: 125ms ease-out; will-change: transform`). On narrow viewports the header stacks to one column and the three cards stack vertically.

## Reference implementation
```html
<style>
  .metric-section {
    max-width: var(--container-max, 1200px);
    margin-inline: auto;
    padding-block: var(--space-9, 80px);
  }
  /* Split header: heading left, muted blurb right. */
  .metric-section__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-8, 50px);
    flex-wrap: wrap;
  }
  .metric-section__head h2 {
    font-family: var(--font-sans, "Inter", system-ui, sans-serif);
    font-size: var(--text-5xl, 2.5rem);
    font-weight: 800;
    letter-spacing: -0.021em;
    line-height: 1.1;
    color: var(--color-fg, #33334f);
    max-width: 500px;
    margin: 0;
  }
  .metric-section__head p {
    font-size: var(--text-xl, 1.25rem);
    line-height: 1.45;
    letter-spacing: -0.017em;
    color: var(--color-muted, #767ead);   /* value contrast does the separating */
    max-width: 520px;
    margin: 0;
  }

  .metric-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6, 30px);
    margin-top: var(--space-10, 100px);
  }
  .metric-card {
    display: flex;
    flex-direction: column;
    background: var(--color-bg, #fff);
    border-radius: var(--radius-lg, 16px);
    transition: transform var(--duration-fast, 125ms) var(--ease-standard, cubic-bezier(0.2,0,0,1));
    will-change: transform;
  }
  .metric-card:hover { transform: translateY(-6px); }

  /* The only saturated color: a small icon + label, hue set per card from the house set. */
  .metric-card__label {
    display: flex;
    align-items: center;
    gap: var(--space-2, 10px);
    margin-bottom: var(--space-6, 30px);
    font-weight: 700;
    letter-spacing: -0.014em;
    color: var(--cat, var(--color-accent, #6078ff));
  }
  .metric-card__label img { width: 30px; height: 30px; border-radius: var(--radius, 8px); }

  .metric-card__shot {
    width: 100%;
    border-radius: var(--radius-lg, 16px);
    box-shadow: 0 10px 40px 10px rgba(51,51,79,0.06);  /* soft, ink-tinted elevation */
  }

  @media (max-width: 900px) {
    .metric-row { grid-template-columns: 1fr; }
  }
  @media (prefers-reduced-motion: reduce) {
    .metric-card { transition: none; }
    .metric-card:hover { transform: none; }
  }
</style>

<section class="metric-section">
  <div class="metric-section__head">
    <h2>Make more by knowing what drives growth of your business.</h2>
    <p>Every feature is as easy to use as it is pleasing to the eye — pick a metric and drill in.</p>
  </div>

  <div class="metric-row">
    <article class="metric-card" style="--cat:#6078ff">
      <div class="metric-card__label"><img src="/i/churn.svg" alt=""> Revenue Churn</div>
      <img class="metric-card__shot" src="/shots/churn.png" alt="Revenue churn chart at 5.8%">
    </article>
    <article class="metric-card" style="--cat:#12c457">
      <div class="metric-card__label"><img src="/i/sales.svg" alt=""> Sales</div>
      <img class="metric-card__shot" src="/shots/sales.png" alt="Net MRR growth chart">
    </article>
    <article class="metric-card" style="--cat:#724ce9">
      <div class="metric-card__label"><img src="/i/trial.svg" alt=""> Trial Conversion</div>
      <img class="metric-card__shot" src="/shots/trial.png" alt="Trial conversion rate at 6.4%">
    </article>
  </div>
</section>
```

Adopt the color rule strictly: assign each card a hue from a fixed 4–6 color set and reuse the *same* hue for that concept everywhere it appears (section label, product chip, docs). The moment a hue becomes a background fill, the system reads as decoration and the wayfinding value is lost.
