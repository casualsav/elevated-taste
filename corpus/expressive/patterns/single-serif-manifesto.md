---
pattern: single-serif-manifesto
from: creativeinc
corpus: expressive
safety: production-safe
tags: [editorial, brand-experience, landing, typography, about]
---

## What it is

A long-form brand/manifesto page set entirely in **one serif family** — display headline and body copy both — laid out as a single centered narrow measure with large vertical voids between sections, each section introduced by a small bold centered label. There is no second typeface, no accent color, no cards or dividers, no surfaces: the only structural devices are *type scale* and *whitespace*. It reads like a printed essay rather than a web page, which is the whole point when the brand voice is literary or artisanal.

## Why it works

Hierarchy is decoupled from both weight and color and rests purely on **scale + measure width**: a ~3–4× jump from body to display, plus a column locked to ~50–60ch, is enough to order the page without a single bold or colored element. Refusing the reflexive serif-display/sans-body pairing is itself the signal — the restraint reads as considered and editorial, and it's a real performance win (one font family, fewer requests). The narrow centered measure and generous leading slow the reader to a magazine cadence, so dense copy stays calm and comprehensible. The small bold centered labels are the only orientation device, doing the job that rules or background bands would otherwise do, for free. It transfers to any essay, about page, or manifesto where tone and comprehension matter more than scannability. The one caveat is font choice: the chosen serif must hold up at *both* 16px body and display size, since it has to do every job alone.

## Reference implementation

```html
<style>
  /* --font-serif: introduce one self-hosted serif used for EVERYTHING here.
     Pick a face readable at body size, not a display-only serif. */
  .manifesto {
    background: var(--color-bg);
    color: var(--color-fg);
    font-family: var(--font-serif);
    padding-block: var(--space-9);
    padding-inline: var(--space-5);
  }
  .manifesto__inner {
    max-width: var(--container-content);   /* single narrow measure, ~50-60ch */
    margin-inline: auto;
    text-align: center;
  }

  /* display: same family, light weight, tight tracking, tight leading */
  .manifesto__display {
    margin: 0 0 var(--space-9);
    font-weight: var(--weight-regular);
    font-size: clamp(var(--text-3xl), 8vw, var(--text-5xl));
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
  }

  /* the ONLY section separator: a big void + a small bold centered label */
  .manifesto__section { margin-block-start: var(--space-9); }
  .manifesto__label {
    margin: 0 0 var(--space-5);
    font-weight: var(--weight-bold);       /* the page's lone bold use */
    font-size: var(--text-base);
  }
  .manifesto__body {
    margin: 0 0 var(--space-5);
    font-weight: var(--weight-regular);
    font-size: var(--text-base);
    line-height: var(--leading-normal);    /* generous; sets the slow cadence */
  }
  /* one optical bump for a lead paragraph — scale, not a new face */
  .manifesto__lead { font-size: var(--text-lg); }
</style>

<article class="manifesto">
  <div class="manifesto__inner">
    <h1 class="manifesto__display">We make hardware for human creativity.</h1>

    <section class="manifesto__section">
      <h2 class="manifesto__label">Why we're building this</h2>
      <p class="manifesto__body manifesto__lead">
        We're tired of the loop. We don't love what it does to us.
      </p>
      <p class="manifesto__body">
        We want today's technology folded into a life that feels more
        like an earlier one: quieter, slower, in the right places.
      </p>
    </section>

    <section class="manifesto__section">
      <h2 class="manifesto__label">What we make</h2>
      <p class="manifesto__body">
        Objects that help you create memories, not consume them.
      </p>
    </section>
  </div>
</article>
```
