---
pattern: serif-display-on-tinted-canvas
from: vanta
corpus: production
safety: production-safe
tags: [hero, landing, brand-experience, editorial]
---

## What it is
A centered hero that sits on a softly **tinted** brand canvas (not white): an oversized **serif** display headline, a one-line sans subhead, and an inline "email + button" capture pill on a single rounded row. A live product mock usually sits directly below. The differentiator from a plain serif-display header is the chromatic background + the single-row inline-CTA control.

## Why it works
Two independent mechanisms stack. First, the **tinted canvas** means brand color is present before any accent is spent — the page feels owned the instant it loads, and the lone saturated CTA still reads as the one thing to click because everything around it is a soft, low-chroma tint. Second, **serif display over sans body** creates hierarchy by typeface + scale, not weight, so the headline can stay near-regular and feel editorial/trustworthy rather than loud. The inline email+button collapses "interest → action" into one gesture above the fold. Transfers to any B2B/SaaS hero that wants warmth and immediate brand presence without a busy graphic.

## Reference implementation
```html
<section class="hero">
  <h1 class="hero__title">Trust is everything</h1>
  <p class="hero__sub">Earn and prove it with Vanta.</p>

  <form class="hero__capture" action="#" method="post">
    <label class="hero__sr" for="hero-email">Work email</label>
    <input class="hero__input" id="hero-email" type="email"
           name="email" placeholder="you@company.com" autocomplete="email" />
    <button class="hero__cta" type="submit">Get a demo</button>
  </form>
</section>

<style>
  .hero {
    /* tinted brand canvas — the key move; a soft lavender, not white */
    background: var(--color-surface-2);
    text-align: center;
    padding-block: var(--space-9) var(--space-8);
    padding-inline: var(--space-5);
  }
  .hero__title {
    font-family: var(--font-serif);            /* serif = warmth/gravitas */
    font-size: var(--text-display);
    font-weight: var(--weight-regular);        /* scale carries it, not weight */
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);     /* tighten big serif so it reads engineered */
    color: var(--color-fg);
    max-width: var(--container-md);
    margin: 0 auto var(--space-4);
    text-wrap: balance;
  }
  .hero__sub {
    font-family: var(--font-sans);
    font-size: var(--text-md);
    line-height: var(--leading-normal);
    color: var(--color-muted);
    margin: 0 auto var(--space-6);
  }
  /* inline email + button as one pill on a single row */
  .hero__capture {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    width: min(28rem, 100%);
    margin-inline: auto;
    padding: var(--space-1) var(--space-1) var(--space-1) var(--space-4);
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-full);
    box-shadow: var(--shadow-sm);
  }
  .hero__input {
    flex: 1 1 auto;
    min-width: 0;
    border: 0;
    background: transparent;
    font-family: var(--font-sans);
    font-size: var(--text-base);
    color: var(--color-fg);
  }
  .hero__input::placeholder { color: var(--color-subtle); }
  .hero__input:focus-visible { outline: none; }
  .hero__capture:focus-within {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 2px var(--color-accent);   /* ring moves to the pill, not the bare input */
  }
  .hero__cta {
    flex: 0 0 auto;
    border: 0;
    border-radius: var(--radius-full);
    background: var(--color-accent);             /* the only saturated element */
    color: var(--color-accent-fg);
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    padding: var(--space-3) var(--space-5);
    cursor: pointer;
    transition: filter var(--duration-base) var(--ease-standard);
  }
  .hero__cta:hover { filter: brightness(1.08); }
  .hero__sr {
    position: absolute; width: 1px; height: 1px;
    padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap;
  }
  @media (max-width: 640px) {
    .hero__title { font-size: var(--text-4xl); }
    /* pill can wrap the button below on very narrow screens; keep both full-width */
    .hero__capture { flex-wrap: wrap; border-radius: var(--radius-lg); }
    .hero__cta { width: 100%; }
  }
</style>
```
Requires a `--font-serif` display token; subset it (used on few large strings) and load with `font-display: swap` to avoid hero CLS. The tint should be a low-chroma step toward the brand hue (here mapped to `--color-surface-2`); keep it light enough that `--color-fg` body text holds 4.5:1. The capture pill is a real `<form>` with a labelled input and a visible `:focus-within` ring for a11y.
