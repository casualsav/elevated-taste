---
pattern: monochrome-tone-triad
from: cooley
corpus: production
safety: production-safe
tags: [color-system, design-tokens, feature-section, landing, editorial, theming]
---

## What it is
A whole site built from **one hue at three values** — a near-black tint of it (ink/dark), the saturated hue itself (mid), and a near-white tint of it (light) — plus a plain white ground. No section owns a color. Instead every band, card, and footer declares a *tone*, and the tone rotates those same three values through the `bg` / `text` / `accent` roles. Cooley runs maroon `#33040e` · red `#fd1434` · rose `#fff2f4` across a hero, a card row, a full-bleed insights list, a red video band and a red footer, and never reaches for a fourth color.

The system also ships a fourth *value* that is not a fourth *color*: a darkened twin of the mid hue, used only where the vivid one fails contrast.

## Why it works
A palette of six brand colors is six decisions per component. A triad with rotating roles is one: *which tone is this?* The page can then swing from white to saturated to near-black without any of the transitions reading as a different brand — the eye recognizes hue, not role assignment. It is why a wall of fire-engine red still reads as the same firm as the white hero above it.

Three constraints make it hold:

1. **The ink is a tint of the accent, not black.** `#33040e` is red with the light taken out. Pure black beside a saturated hue reads as a stock template; a hue-matched near-black reads as intentional. Same for the light tint — `#fff2f4` is white with red in it, so the "empty" surfaces belong to the brand too.
2. **The vivid hue almost never passes AA at body size.** `#fd1434` is 3.9:1 on white — legal at 24px+, illegal at 16px. Ship the compliant sibling as a *named token* (`--color-accent-text`) rather than as an exception someone remembers. Once the token exists, `font-size < 1.5rem → use the text variant` becomes a rule instead of an argument.
3. **Because there's no gray, secondary text must be demoted some other way.** Cooley drops meta lines to 0.75rem uppercase sans against serif headlines. Reaching for `opacity: 0.6` here would mud the hue; changing *size, case, and family* keeps the color pure and the hierarchy louder.

Do not extend this by adding hues. Extend it by adding tones (a `mid-deep`, a `light-warm`) or by defining a second complete triad behind a page-level attribute — Cooley carries a dormant royal/navy/sky one for sub-brands.

## Reference implementation
```html
<style>
  :root {
    /* The triad — one hue, three values. Swap these four lines to rebrand. */
    --brand-dark:  var(--color-brand-dark,  #33040e);   /* the accent with its light removed */
    --brand-mid:   var(--color-brand-mid,   #fd1434);   /* the saturated hue */
    --brand-light: var(--color-brand-light, #fff2f4);   /* the accent with white folded in */
    --brand-mid-aa: var(--color-brand-mid-aa, #de0220); /* same hue, >= 4.5:1 on white */

    /* Default (untoned) surface: the page ground. */
    --tone-bg: var(--color-bg);
    --tone-fg: var(--brand-dark, #33040e);
    --tone-accent: var(--brand-mid, #fd1434);
    --tone-text-accent: var(--brand-mid-aa, #de0220);   /* small red text, AA-safe */
    --tone-rule: var(--brand-mid, #fd1434);
  }

  /* The whole system is these three blocks. A component never names a color. */
  [data-tone="dark"] {
    --tone-bg: var(--brand-dark, #33040e);
    --tone-fg: var(--brand-mid, #fd1434);
    --tone-accent: var(--brand-mid, #fd1434);
    --tone-text-accent: var(--brand-mid, #fd1434);      /* vivid IS the AA choice on dark */
    --tone-rule: var(--brand-mid, #fd1434);
  }
  [data-tone="mid"] {
    --tone-bg: var(--brand-mid, #fd1434);
    --tone-fg: var(--brand-dark, #33040e);
    --tone-accent: var(--brand-dark, #33040e);
    --tone-text-accent: var(--brand-dark, #33040e);
    --tone-rule: var(--brand-dark, #33040e);
  }
  [data-tone="light"] {
    --tone-bg: var(--brand-light, #fff2f4);
    --tone-fg: var(--brand-dark, #33040e);
    --tone-accent: var(--brand-mid, #fd1434);
    --tone-text-accent: var(--brand-mid-aa, #de0220);
    --tone-rule: var(--brand-mid, #fd1434);
  }

  [data-tone] { background: var(--tone-bg, #fff); color: var(--tone-fg, #33040e); }

  .band {
    padding-block: var(--space-9);
    padding-inline: var(--space-6);
  }

  /* Eyebrow: 700 sans, uppercase, tracked open, with a short accent rule.
     This — not a smaller heading — is what labels a section. */
  .eyebrow {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin: 0 0 var(--space-6);
    font: var(--weight-bold) var(--text-xs) / var(--leading-tight) var(--font-sans);
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
    color: var(--tone-text-accent, #de0220);
  }
  .eyebrow::before {
    content: "";
    inline-size: 2px;
    block-size: 1em;
    background: var(--tone-rule, #fd1434);
  }

  /* Headings: serif, LIGHT weight, tight leading. Scale ranks the page, not weight. */
  .band h2 {
    margin: 0;
    font-family: var(--font-display, Georgia, "Times New Roman", serif);
    font-weight: var(--weight-display, 300);
    font-size: clamp(var(--text-4xl), 6vw, var(--text-display));
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-display);
    word-spacing: -0.05em;
    color: var(--tone-accent, #fd1434);
  }

  /* Secondary text is demoted by size + case + family — never by opacity or gray. */
  .meta {
    font: var(--weight-regular) var(--text-xs) / var(--leading-normal) var(--font-sans);
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
    color: var(--tone-text-accent, #de0220);
  }

  /* Rows separate with a hairline in the tone's own accent — no cards, no shadows. */
  .row {
    display: flex;
    justify-content: space-between;
    gap: var(--space-6);
    padding-block: var(--space-5);
    border-block-end: 1px solid var(--tone-rule, #fd1434);
  }

  /* A tile is just a toned box. Radius stays near-zero: on saturated ground,
     a rounded card reads as a UI widget rather than a surface. */
  .tile {
    padding: var(--space-6);
    border-radius: var(--radius-tight, 2px);
    min-block-size: 20rem;
  }

  :where(a, button):focus-visible {
    outline: 3px solid var(--tone-accent, #fd1434);
    outline-offset: 0.2rem;
  }
</style>

<section class="band" data-tone="light">
  <h2 class="eyebrow">Resources</h2>
  <div class="tiles">
    <article class="tile" data-tone="dark"><h3>Public Company Resource Hub</h3></article>
    <article class="tile" data-tone="mid"><h3>IPO GO</h3></article>
    <article class="tile" data-tone="light"><h3>Cooley GO</h3></article>
  </div>
</section>

<section class="band" data-tone="dark">
  <h2 class="eyebrow">Latest insights</h2>
  <a class="row" href="/insights/1">
    <h3>Pearl Health Raises $110 Million</h3>
    <p class="meta">Press release · July 8, 2026</p>
  </a>
</section>
```

Nesting works because the tones are custom properties: a `data-tone="dark"` tile inside a `data-tone="light"` band inherits nothing but the variables it overrides. Contrast-check every pair once, at build time, and the system is closed — there is no combination a future component can invent.
