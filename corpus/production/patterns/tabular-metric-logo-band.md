---
pattern: tabular-metric-logo-band
from: gumloop
corpus: production
safety: production-safe
tags: [feature-section, social-proof, landing, product-marketing]
---

## What it is

A flat, monochrome "social proof" band that sits just below the hero: a one-line claim on the left, a pair of oversized headline metrics set in **`tabular-nums`** on the right (Gumloop's `18+` / `339K+`), and under both a row of customer logos rendered in a single muted ink — all on plain white, separated from the rest of the page by whitespace and at most one hairline. No cards, no gradient, no color.

Reach for it as the first "trust" beat on a B2B landing. It answers "who uses this and how much" in one quiet strip without competing with the hero above or the feature demos below.

## Why it works

Proof should read as *fact*, not *marketing*, and the quickest way to signal that is to strip the styling: monochrome, one weight, generous air. The restraint is the credibility.

The metrics do the lifting, and two small craft choices make them land. **`tabular-nums`** gives every digit the same advance width, so numbers sit in tidy columns and don't twitch if you later count them up — the difference between "engineered" and "decorative" numerals. And the figures earn their size through **scale, not weight**: a 3rem number in regular/medium against muted body copy already dominates, so you never need bold, and the band stays calm.

Logos belong in one ink. Real-brand colors turn a proof row into a ransom note and pull focus off your own page; recoloring every logo to a single muted tone (via `filter` or monochrome assets) makes them read as one texture — "many customers" — instead of a dozen competing marks.

Two construction rules: give the band real vertical breathing room (section padding in the 64–128px range) so it feels like a pause, not a row; and cap the claim/metrics on a reading-width column so the logos, not the text, define the band's full width.

## Reference implementation

```html
<style>
  .proof {
    background: var(--color-bg);
    padding-block: var(--space-9);
    border-block-start: 1px solid var(--color-hairline);
  }
  .proof__inner {
    max-width: var(--container-xl);
    margin-inline: auto;
    padding-inline: var(--space-5);
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    justify-content: space-between;
    gap: var(--space-6);
  }

  .proof__claim {
    max-width: 28ch;
    font-size: var(--text-xl);
    font-weight: var(--weight-regular);
    line-height: var(--leading-snug);
    letter-spacing: var(--tracking-heading);
    color: var(--color-fg);
    margin: 0;
  }

  .proof__metrics { display: flex; gap: var(--space-8); }
  .proof__metric { display: flex; flex-direction: column; gap: var(--space-1); }
  .proof__value {
    font-size: var(--text-4xl);
    font-weight: var(--weight-medium);           /* scale, not weight */
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-display);
    font-variant-numeric: tabular-nums;          /* digits line up + don't jitter */
    color: var(--color-fg);
  }
  .proof__label {
    font-size: var(--text-sm);
    color: var(--color-muted);
  }

  /* One ink for every mark — logos read as texture, not a color clash. */
  .proof__logos {
    margin-top: var(--space-7);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-7);
    max-width: var(--container-xl);
    margin-inline: auto;
    padding-inline: var(--space-5);
  }
  .proof__logos img {
    height: 1.5rem;
    width: auto;
    opacity: 0.55;
    filter: grayscale(1) brightness(0) opacity(0.55);  /* monochrome ink */
  }

  @media (max-width: 640px) {
    .proof__inner { flex-direction: column; align-items: start; }
    .proof__metrics { gap: var(--space-6); }
  }
</style>

<section class="proof" aria-label="Customer proof">
  <div class="proof__inner">
    <p class="proof__claim">The agent infrastructure powering the world's most AI-native companies</p>
    <div class="proof__metrics">
      <div class="proof__metric">
        <span class="proof__value">18+</span>
        <span class="proof__label">Fortune 500 teams</span>
      </div>
      <div class="proof__metric">
        <span class="proof__value">339K+</span>
        <span class="proof__label">Agents deployed</span>
      </div>
    </div>
  </div>
  <div class="proof__logos">
    <img src="/logos/acme.svg" alt="Acme">
    <img src="/logos/globex.svg" alt="Globex">
    <img src="/logos/initech.svg" alt="Initech">
    <img src="/logos/umbrella.svg" alt="Umbrella">
    <img src="/logos/hooli.svg" alt="Hooli">
  </div>
</section>
```
