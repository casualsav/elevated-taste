---
pattern: input-as-hero-composer
from: v0
corpus: production
safety: production-safe
tags: [hero, empty-state, ai, forms, navigation]
---

## What it is
A landing hero where the product's actual input — a prompt composer / search box — replaces the conventional "big headline + product screenshot." A single short question sits directly above a real, bordered composer (textarea with an inline control row: model picker, mic/submit), and a row of one-tap **suggestion chips** with a shuffle button sits below to seed first use. The composer is the largest, most central interactive object on the page.

## Why it works
For any product whose first user action is "type something," promoting the real input above the fold turns intent straight into action and demonstrates the product instead of describing it. Suggestion chips defeat the blank-page problem and hint at range without a feature list. Because the chrome is monochrome and border-defined, the composer reads as a precise tool, not a marketing prop — and the page feels continuous with the app behind it. Reuse for AI tools, search products, and command-style onboarding/empty states.

## Reference implementation
```html
<section class="hero">
  <h1 class="hero-q">What do you want to create?</h1>

  <form class="composer" role="search">
    <textarea class="composer-input" rows="2" placeholder="Ask to build…" aria-label="Prompt"></textarea>
    <div class="composer-bar">
      <button type="button" class="composer-model">◉ Model <span aria-hidden="true">▾</span></button>
      <button type="submit" class="composer-submit" aria-label="Submit">⏎</button>
    </div>
  </form>

  <ul class="chips" aria-label="Try an example">
    <li><button class="chip">Contact Form</button></li>
    <li><button class="chip">Image Editor</button></li>
    <li><button class="chip">Mini Game</button></li>
    <li><button class="chip">Finance Calculator</button></li>
    <li><button class="chip chip-icon" aria-label="Shuffle suggestions">⟳</button></li>
  </ul>
</section>

<style>
  .hero {
    max-width: 690px;        /* composer container */
    margin-inline: auto;
    padding-block: 96px 32px;
    text-align: center;
  }
  .hero-q {
    font-family: var(--font-sans);            /* Geist Sans */
    font-size: 2rem;                          /* compact, product-grade — not a marketing giant */
    line-height: 1.25;
    letter-spacing: -0.04em;                  /* negative tracking only on the large line */
    color: var(--color-fg);                   /* #1f1f1f */
    margin-bottom: 24px;
  }

  /* Border + one soft shadow define the composer — no fill, no accent color */
  .composer {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    border: 1px solid var(--color-border);    /* #e6e6e6 hairline */
    border-radius: 12px;
    background: var(--color-surface);         /* #fff */
    box-shadow: var(--shadow-sm);              /* the page's lone elevation */
    text-align: left;
  }
  .composer-input {
    border: 0; resize: none; outline: 0;
    font: inherit; font-size: 1rem;
    color: var(--color-fg);
    background: transparent;
  }
  .composer-input::placeholder { color: var(--color-muted); }   /* #757575 */
  .composer-bar { display: flex; align-items: center; justify-content: space-between; }
  .composer-model {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 8px; border-radius: 8px;
    font-size: 0.875rem; color: var(--color-muted);
    background: transparent; border: 0; cursor: pointer;
    transition: background var(--duration-fast) var(--ease-standard),
                color var(--duration-fast) var(--ease-standard);   /* 150ms cubic-bezier(.4,0,.2,1) */
  }
  .composer-model:hover { background: var(--color-hover-fill, #f5f5f5); color: var(--color-fg); }
  .composer-submit {
    width: 36px; height: 36px; border-radius: 8px; border: 0; cursor: pointer;
    background: var(--color-cta-bg, #1f1f1f); color: var(--color-cta-fg, #ffffff);   /* black ink fill */
  }

  /* Suggestion chips — one-tap seeds + a shuffle control */
  .chips {
    display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;
    margin: 16px 0 0; padding: 0; list-style: none;
  }
  .chip {
    min-height: 44px;                          /* touch target — site flagged some too small */
    padding: 6px 12px; border-radius: 9999px;
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    font-size: 0.875rem; color: var(--color-fg); cursor: pointer;
    transition: background var(--duration-fast) var(--ease-standard);
  }
  .chip:hover { background: var(--color-hover-fill, #f5f5f5); }
  .chip-icon { aspect-ratio: 1; padding: 6px; }

  /* Visible focus rings — the chrome relies on them since there's no color accent */
  .composer :focus-visible,
  .chip:focus-visible { outline: 2px solid var(--color-fg); outline-offset: 2px; }
</style>
```
The shuffle button reorders/regenerates the chip set client-side; keep 3–5 chips so the row stays a single scannable line. No reduced-motion concern here — all transitions are sub-200ms color/background changes.
