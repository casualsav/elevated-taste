---
pattern: two-tone-headline
from: stripe
corpus: production
safety: production-safe
tags: [hero, heading, feature-blurb, typography]
---

## What it is

A single block of running text (a headline or a short paragraph) split into two colors at a clause boundary: a high-contrast **ink lead** that states the claim and a **muted (or accent) continuation** that elaborates. No size change, no weight change, no line break is required to create the hierarchy — the color shift alone front-loads the message. On Stripe it appears both as ink+accent in the hero ("Financial **infrastructure** to grow your **revenue**.") and as ink+slate in feature blurbs ("**Flexible solutions for every business model.** Grow your business with…").

## Why it works

Reading is linear, so the eye hits the colored lead first and parses it as the headline; the muted tail is recognized as supporting detail and can be skimmed. This compresses a claim-plus-explanation into one type size, which is what lets a dense page stay calm: you get two levels of hierarchy without spending a second font size or weight. It is the typographic equivalent of bolding the topic sentence, but quieter. The mechanism transfers to any claim-then-detail copy — hero subheads, feature cards, pricing descriptions. Keep the muted tone above AA contrast and never let color be the *only* carrier of meaning (the sentence must still parse in one color for screen readers).

## Reference implementation

```html
<style>
  .tt-headline {
    max-width: var(--container-content);
    font-family: var(--font-sans);
    font-weight: var(--weight-regular);          /* hierarchy is color, not weight */
    /* fluid: full 5xl on desktop, shrinks so the longest word fits small viewports */
    font-size: clamp(var(--text-4xl), 12vw, var(--text-5xl));
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--color-fg);                        /* ink lead */
  }
  .tt-headline .accent { color: var(--color-accent); }   /* inline emphasis */

  .tt-blurb {
    max-width: var(--container-content);
    font-family: var(--font-sans);
    font-size: var(--text-md);
    line-height: var(--leading-normal);
    color: var(--color-fg);                        /* claim */
  }
  .tt-blurb .detail { color: var(--color-muted); } /* demoted continuation */

  @media (prefers-reduced-motion: no-preference) {
    .tt-headline .accent { transition: color var(--duration-base) var(--ease-standard); }
  }
</style>

<h1 class="tt-headline">
  Financial <span class="accent">infrastructure</span>
  to grow your <span class="accent">revenue</span>.
</h1>

<p class="tt-blurb">
  <strong>Flexible solutions for every business model.</strong>
  <span class="detail">Grow your business with the most comprehensive set of
  payments and financial tools — designed to work individually or together.</span>
</p>
```
