---
pattern: semantic-ramp-theming
from: arena
corpus: production
safety: production-safe
tags: [design-system, theming, dark-mode, tokens]
---

## What it is

A whole-site theming system built from **one numbered neutral ramp** (`gray0 … gray7`) plus a thin layer of **semantic aliases** (`background`, `foreground`, `link`, `muted`, `border`, `focus`). Components are forbidden from naming a gray; they only ever name a role. A single class on `<html>` re-points the ramp, and the entire product becomes light, dark, warm-paper, or cool-ink — with no component-level dark-mode overrides anywhere.

The move that makes it work: the ramp **inverts** rather than shifts. `gray0` is always "furthest from the ink" and `gray7` is always "the ink," so on dark `gray0` is `#000` and `gray7` is `#FFF`. Every alias keeps its meaning across every theme.

## Why it works

**Roles survive theme changes; values don't.** The failure mode of hand-written dark mode is a component that says `background: #f7f7f7` and then needs a `.dark &` override — one per component, forever. Naming the *position on the ramp* rather than the color means a theme is a data change, not a code change. Adding "dawn" costs eight hex values and zero component edits.

**Anything direction-dependent becomes a token too.** Two non-obvious cases the exemplar solves:

- **Blend mode.** An inline-code chip tinted with `mix-blend-mode: multiply` on white must use `screen` on black. Carrying `--blend: multiply | screen` as a themed token keeps one rule correct in both directions instead of duplicating the rule per theme.
- **Optical weight.** Light text on a dark ground looks *bolder* than the same text inverted (halation). If your typeface is variable with a dark-mode axis, drive it from a themed `font-variation-settings` token on `<html>` and every glyph on the page compensates for free. Without such an axis the equivalent lever is a themed `--font-weight-body` (e.g. `400` light / `380` dark, or a small negative `wght` delta).

**Reserve one accent for meaning.** In the source, chroma appears in exactly two places — the focus ring and the footer ground. Because the ramp handles all structure, the accent never has to do decorative work, so it stays legible as a *signal*.

**Pair it with a real motion switch.** Themes and motion preferences are the same kind of thing: user-level, global, and cheap to honor. Expose motion as an in-app preference *in addition to* the OS media query, so a user can quiet an interface without changing their operating system.

## Reference implementation

```html
<!-- framework-neutral; the ramp values are this exemplar's own, carried as inline fallbacks -->
<style>
  /* 1. the ramp — the only place a raw color is ever written */
  :root,
  .theme-light {
    --ramp-0: var(--color-ramp-0, #ffffff);
    --ramp-1: var(--color-ramp-1, #f7f7f7);
    --ramp-2: var(--color-ramp-2, #ededed);
    --ramp-3: var(--color-ramp-3, #dedede);
    --ramp-4: var(--color-ramp-4, #999999);
    --ramp-5: var(--color-ramp-5, #696969);
    --ramp-6: var(--color-ramp-6, #333333);
    --ramp-7: var(--color-ramp-7, #000000);
    --brand: var(--color-brand-dark, #00075f);
    --accent: var(--color-focus);
    --blend: multiply;
    --dark-axis: "DRKM" 0;   /* variable-font dark-mode axis, if your face has one */
  }

  /* 2. a theme is eight values + two direction-dependent tokens. No component knows. */
  .theme-dark {
    --ramp-0: #000000;  --ramp-1: #1a1a1a;  --ramp-2: #333333;  --ramp-3: #4f4f4f;
    --ramp-4: #696969;  --ramp-5: #b2b2b2;  --ramp-6: #e5e5e5;  --ramp-7: #ffffff;
    --brand: var(--color-brand-dark-inverse, #c1c4ea);
    --accent: var(--color-accent-on-dark, #5e6dee);
    --blend: screen;
    --dark-axis: "DRKM" 1;
  }

  .theme-dawn {  /* warm paper — same ramp positions, different hue family */
    --ramp-0: #f5f1f0;  --ramp-1: #eae6e5;  --ramp-2: #e0dbda;  --ramp-3: #cac5c4;
    --ramp-4: #aaa4a3;  --ramp-5: #7f7977;  --ramp-6: #4a4240;  --ramp-7: #342c2a;
  }

  /* 3. semantic aliases — the ONLY names components are allowed to use */
  :root, .theme-light, .theme-dark, .theme-dawn {
    --bg:      var(--ramp-0);
    --surface: var(--ramp-1);
    --raised:  var(--ramp-2);
    --border:  var(--ramp-3);
    --subtle:  var(--ramp-4);
    --muted:   var(--ramp-5);
    --ink:     var(--ramp-6);   /* body text sits one step off the extreme… */
    --ink-max: var(--ramp-7);   /* …so hover has somewhere to go */
  }

  html {
    background: var(--bg);
    color: var(--ink);
    font-variation-settings: var(--dark-axis);
    color-scheme: light;
  }
  .theme-dark { color-scheme: dark; }

  /* 4. components name roles only — this rule is theme-agnostic and never overridden */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: var(--space-4);
  }
  .card__meta { color: var(--muted); }

  /* hover = more ink, not another hue; the border is reserved so nothing reflows */
  .card a {
    color: inherit;
    border-bottom: 1px solid transparent;
    transition: color var(--duration-fast) var(--ease-standard),
                border-color var(--duration-fast) var(--ease-standard);
  }
  .card a:hover { color: var(--ink-max); border-bottom-color: var(--border); }
  :focus-visible { outline: 1px solid var(--accent); }

  /* the one rule that needs a themed blend mode — correct in every theme, written once */
  code {
    background: var(--raised);
    mix-blend-mode: var(--blend);
    border-radius: var(--radius-sm);
    padding: 0 var(--space-1);
  }

  /* 5. motion is a user preference, not only an OS setting */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { transition: none !important; animation: none !important; }
  }
  html[data-reduced-motion="true"] *,
  html[data-reduced-motion="true"] *::before,
  html[data-reduced-motion="true"] *::after { transition: none !important; animation: none !important; }
</style>

<html lang="en" class="theme-light">
  <!-- switching themes is one class swap; no component re-renders, no override sheet -->
  <script>
    // localStorage throws in sandboxed iframes / privacy modes — degrade to session-only.
    const storageGet = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
    const storageSet = (key, val) => { try { localStorage.setItem(key, val); } catch {} };

    const setTheme = (name) => {
      document.documentElement.className = `theme-${name}`;
      storageSet("theme", name);
    };
    setTheme(storageGet("theme") ?? "light");
    // honor an explicit in-app motion preference independent of the OS
    document.documentElement.dataset.reducedMotion = storageGet("reducedMotion") ?? "false";
  </script>
</html>
```

**Where it breaks.** The ramp only inverts cleanly for *neutrals*. Semantic colors (success/danger) need their own per-theme values — a `#238020` green that reads well on white is too dark on black, so give each semantic hue three ramp steps of its own rather than trying to derive it. And `mix-blend-mode` on text is safe only for background tints; never blend the glyphs themselves.
