---
pattern: currentcolor-ink-theme
from: noma
corpus: expressive
safety: production-safe
tags: [design-system, theming, color, button, brand-experience]
---

## What it is

A whole-page color system built from exactly **two** authored values — one *ink* and one *paper* — where every component draws its text, borders, rules, icons and button fills from `currentColor` rather than from its own color tokens. Because nothing downstream names a hex, re-theming the entire site is a single class on `<body>` that reassigns the pair. The source used it to encode a restaurant's seasons (`season-vegetable`, `season-forest`, `season-ocean`); the same mechanism is what light/dark mode already does, generalized past two states.

Two details make it look designed rather than defaulted: the ink is a **dark tint of the brand hue**, not `#000`, and the paper is warm, not `#fff`. And there is no separate border color — a hairline is the ink at full strength, which is why the page reads as typeset rather than as a stack of grey-bordered boxes.

## Why it works

`currentColor` inverts the usual dependency: instead of each component reaching *out* for a palette, the palette flows *down* through `color` inheritance. So a button's border, an icon's fill and a divider's rule are all provably the same value as the paragraph beside them — a consistency you'd otherwise have to enforce by review. Theming then reduces to setting two custom properties, and a new theme cannot desynchronize a component that was written after it.

The button state follows from the same idea: with only two values in scope, the only interesting hover is to **swap them**. It's an inversion, not an elevation — no shadow token, no transform, no reflow, and it reads like a stamp landing on paper.

## Reference implementation

```html
<article class="ink-theme season-vegetable">
  <h2 class="ink-heading">Copenhagen, 2026</h2>
  <p class="ink-body">We're approaching the end of our time here.</p>
  <hr class="ink-rule" />
  <a class="ink-button" href="#">
    Learn more
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.25" />
    </svg>
  </a>
</article>

<style>
  /* The ONLY authored colors. A theme = one class + two declarations. */
  .season-vegetable { --ink: #29382b; --paper: #f9f9f3; }   /* forest on warm paper */
  .season-forest    { --ink: #132c22; --paper: #eceedf; }
  .season-ocean     { --ink: #1b2b33; --paper: #f2f4f3; }

  /* Fall back to the house pair when no season class is present. */
  .ink-theme {
    background-color: var(--paper, var(--color-bg));
    color: var(--ink, var(--color-fg));   /* every child inherits the ink */
  }

  /* Nothing below this line names a color. */
  .ink-heading {
    font-size: clamp(var(--text-xl), 1rem + 3vw, var(--text-4xl));
    font-weight: var(--weight-regular);
    letter-spacing: var(--tracking-display);   /* bigger type tightens */
    line-height: var(--leading-tight);
    margin: 0 0 var(--space-4);
  }

  .ink-body {
    max-width: var(--measure, 45ch);
    font-size: var(--text-md);
    letter-spacing: var(--tracking-body);      /* body opens back up */
    line-height: var(--leading-loose, 1.8);
    margin: 0 0 var(--space-6);
  }

  .ink-rule {
    border: 0;
    border-top: 1px solid currentColor;        /* the hairline IS the ink */
    margin: var(--space-7) 0;
  }

  .ink-button {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    min-height: 44px;                          /* tap target, not decoration */
    padding: var(--space-2) var(--space-4);
    border: 1px solid currentColor;
    border-radius: 0;
    background-color: transparent;
    color: inherit;
    text-decoration: none;
    transition:
      background-color var(--duration-slow) var(--ease-standard),
      color var(--duration-slow) var(--ease-standard);
  }

  .ink-button svg { width: 1em; height: 1em; }  /* stroke: currentColor */

  /* The only hover worth having when two values are in scope: swap them. */
  .ink-button:hover,
  .ink-button:focus-visible {
    background-color: var(--ink, var(--color-fg));
    color: var(--paper, var(--color-bg));
  }

  .ink-button:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  /* Prose links keep a real underline — hover-only affordances fail on touch. */
  .ink-body a {
    color: inherit;
    text-decoration: underline;
    text-underline-offset: 0.2em;
    text-decoration-thickness: 1px;
    transition: opacity var(--duration-fast) var(--ease-standard);
  }
  .ink-body a:hover { opacity: 0.6; }

  @media (prefers-reduced-motion: reduce) {
    .ink-button,
    .ink-body a { transition: none; }   /* end state still reached, instantly */
  }
</style>
```

**Authoring a new theme:** pick the ink first (a dark tint of the brand hue at roughly 10:1 against the paper), then warm the paper toward it by 2–4%. Verify contrast in **both** directions — the button's hover state puts paper on ink, and a light season step that passes as a background will fail as text.
