---
pattern: split-wordmark-emblem-hero
from: northkingdom
corpus: expressive
safety: production-safe
tags: [hero, branding, typography, navigation, agency]
---

## What it is
A hero where the display **wordmark is split into its two words and pushed to the left and right viewport edges**, with the brand glyph (here a hexagonal shield) — or a small centerpiece object — seated **between** the words on a single shared baseline. "North ⬡ Kingdom" reads as one lockup, but the logo is the punctuation in the middle rather than a separate mark off in a corner. The two words bleed toward the gutters, the emblem owns the optical center, and the negative space between them frames whatever sits there (a static glyph, a 3D render, or a play target). On narrow viewports the inline split folds into a stacked wordmark and the centerpiece moves above it, so the identity survives the breakpoint instead of overlapping.

## Why it works
It **fuses the identity into the headline**: because the brand mark is the center of the wordmark, the logo and the type can't be perceived separately, so the hero *is* the brand instead of "a logo plus a tagline." Splitting the words to the edges does two jobs at once — it establishes a strong central axis for the object/play affordance to occupy, and it converts the headline into a layout where the empty middle is the active region (the gap is doing the composition, the same way an editorial spread uses the gutter). Hierarchy comes purely from **scale and position**: one family, one weight, giant size, negative tracking — no bold, no color, no chrome — which is why it reads as a composed studio mark rather than a loud banner. The transferable rule: when a brand mark can act as a glyph, set it *inside* the wordmark on the baseline and let the words bleed outward; you get a centered focal slot and an inseparable identity for free.

## Reference implementation
```html
<!-- framework-neutral; var(--token) names from /tokens, no magic numbers -->
<style>
  .swh {
    --swh-track: var(--tracking-tight);   /* pull glyphs optically tight at display size */
    min-height: 100svh;
    display: grid;
    grid-template-rows: auto 1fr;
    background: var(--color-bg);
    color: var(--color-fg);
  }

  /* top chrome: mark flush-left, text nav flush-right */
  .swh__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-5) var(--space-5);
  }
  .swh__nav { display: flex; gap: var(--space-5); }
  .swh__nav a {
    color: var(--color-fg);
    text-decoration: none;
    font-size: var(--text-sm);
    transition: opacity var(--duration-base) var(--ease-standard);
  }
  .swh__nav a:hover { opacity: 0.6; }

  /* the split wordmark: word — emblem — word, one baseline, words to the edges */
  .swh__mark {
    place-self: center stretch;
    display: flex;
    align-items: center;
    justify-content: space-between;   /* pushes the two words to the gutters */
    gap: var(--space-5);
    padding-inline: var(--space-5);
    margin: 0;
    font-family: var(--font-display, var(--font-sans));
    font-weight: var(--weight-regular);
    font-size: var(--text-display);
    line-height: var(--leading-tight);
    letter-spacing: var(--swh-track);
  }
  .swh__emblem {
    flex: 0 0 auto;
    width: var(--space-8);            /* centerpiece sits between the words */
    height: var(--space-8);
    color: var(--color-fg);
  }

  /* fold to a stacked wordmark when the inline split would collide */
  @media (max-width: 48rem) {
    .swh__mark {
      flex-direction: column;
      justify-content: center;
      text-align: center;
      gap: var(--space-4);
      font-size: var(--text-5xl);
    }
    .swh__emblem { order: -1; }       /* object/glyph moves above the stacked words */
  }
</style>

<header class="swh">
  <div class="swh__bar">
    <a href="/" aria-label="Home">
      <svg class="swh__emblem" width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><!-- mark --></svg>
    </a>
    <nav class="swh__nav">
      <a href="/work">Work</a>
      <a href="/about">About</a>
      <a href="/contact">Contact</a>
    </nav>
  </div>

  <!-- one accessible heading; emblem is decorative punctuation inside it -->
  <h1 class="swh__mark">
    <span>North</span>
    <svg class="swh__emblem" viewBox="0 0 24 24" aria-hidden="true"><!-- shield glyph / play target --></svg>
    <span>Kingdom</span>
  </h1>
</header>
```
