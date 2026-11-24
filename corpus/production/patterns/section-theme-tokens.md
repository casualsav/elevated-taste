---
pattern: section-theme-tokens
from: whoop
corpus: production
safety: production-safe
tags: [layout, feature-section, landing, design-system, theming]
---

## What it is
A long page alternates grounds — white chapter, grey chapter, black chapter. Instead of writing a dark variant for every component that might land in a dark chapter, the **section wrapper** declares its ground as a pair of custom properties (`--section-bg`, `--section-fg`) and everything inside reads them. Swapping one class on the wrapper rethemes the entire subtree, including components the section's author never anticipated.

## Why it works
The usual approach — `.section--dark .card { background: #191919 }` — makes theming an O(components × themes) problem, and it fails the moment someone drops a new component into a dark section. Custom properties invert the dependency: the section publishes its ground, the component subscribes. Cost is O(themes) once, and a component written years later still inherits correctly.

Three rules make it hold up:

**Publish a pair, not a color.** Ground and ink travel together. A component reading only `--section-bg` will eventually paint black text on black.

**Subscribe with a fallback.** `var(--section-bg, #fff)` means the component is also correct outside any section — in a modal, a Storybook story, an email. The fallback *is* the light theme.

**Derive nested surfaces, don't hard-code them.** A card sitting on the section ground needs to be one step off it. Publish a third property (`--section-surface`) rather than letting cards guess, or the card will pick `#f7f8fa` and glow on a black ground.

Keep the token count tiny — three, maybe four. The moment a section publishes `--section-button-hover-border`, the system has become a second stylesheet and you should write the dark variant by hand.

Note what this is *not*: a dark mode. Dark mode is a user preference applied to the whole document. This is content — the designer chose that this chapter is black — so it must survive `prefers-color-scheme: light` untouched. Wire them by having the `:root` dark-mode rule change the *light* section's published values, never by fighting the section class.

## Reference implementation
```html
<style>
  /* 1. The contract: every section publishes these three. Light is the default. */
  .section {
    --section-bg:      var(--color-bg);
    --section-fg:      var(--color-fg);
    --section-surface: var(--color-surface);

    background: var(--section-bg, #ffffff);
    color: var(--section-fg, #000000);
    padding-block: var(--space-9);
    position: relative;   /* sections are opaque and self-grounding — nothing shows through */
  }

  .section[data-theme="grey"] {
    --section-bg:      var(--color-surface);
    --section-fg:      var(--color-fg);
    --section-surface: var(--color-bg);
  }

  .section[data-theme="dark"] {
    --section-bg:      var(--color-bg-dark);
    --section-fg:      var(--color-fg-on-dark);
    --section-surface: var(--color-surface-dark);
  }

  /* 2. Components subscribe. No component knows a theme name. The fallback is the light theme. */
  .card {
    background: var(--section-surface, #f3f5f9);
    color: var(--section-fg, #000);
    border: 1px solid var(--section-border, var(--color-hairline));
    border-radius: var(--radius-xl);
    padding: var(--space-6);
  }

  .card__meta {
    /* Secondary ink is derived from the published ink, not hard-coded per theme. */
    color: color-mix(in srgb, var(--section-fg, #000) 60%, var(--section-bg, #fff));
    font-size: var(--text-sm);
  }

  .section[data-theme="dark"] { --section-border: var(--color-border-on-dark); }

  /* 3. Content-level themes are NOT dark mode. A user's dark preference retints the
        light/grey sections; the authored dark chapter stays exactly as designed. */
  @media (prefers-color-scheme: dark) {
    .section:not([data-theme="dark"]) {
      --section-bg:      var(--color-bg-dark);
      --section-fg:      var(--color-fg-on-dark);
      --section-surface: var(--color-surface-dark);
      --section-border:  var(--color-border-on-dark);
    }
  }

  .section__inner {
    max-width: var(--container-xl);
    margin-inline: auto;
    padding-inline: var(--space-5);
  }
  .section__title {
    font-size: clamp(2rem, 1.2rem + 3.4vw, var(--text-display));
    font-weight: var(--weight-regular);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-display);
    margin: 0 0 var(--space-5);
  }
</style>

<section class="section" data-theme="light">
  <div class="section__inner">
    <h2 class="section__title">Wear it daily, improve your health</h2>
    <article class="card">
      <h3>Recovery</h3>
      <p class="card__meta">Updated every morning</p>
    </article>
  </div>
</section>

<section class="section" data-theme="dark">
  <div class="section__inner">
    <h2 class="section__title">Built to be worn 24/7</h2>
    <!-- Identical markup. Identical CSS. Correct on black. -->
    <article class="card">
      <h3>Recovery</h3>
      <p class="card__meta">Updated every morning</p>
    </article>
  </div>
</section>
```
