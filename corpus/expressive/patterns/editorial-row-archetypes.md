---
pattern: editorial-row-archetypes
from: ssense
corpus: expressive
safety: production-safe
tags: [editorial, layout, content-grid, homepage, listing, ecommerce]
---

## What it is

A long editorial index built by stacking a **closed vocabulary of row types** — full-bleed feature, fifty-fifty, three-thirds, hairline-divided dense rail — rather than by laying out one grid and pouring content into it. Each row is a negative-margin gutter grid; each image tile reserves its own crop ratio before it loads; the dense rail uses 1px rules instead of cards.

## Why it works

**Sequencing beats bespoke layout.** Five row archetypes composed in arbitrary order produce a page that feels art-directed while remaining fully authorable — an editor picks a row type, drops in tiles, and cannot produce an ugly page. Give a CMS a free-form grid and it will eventually produce one.

**Crop ratio is the rhythm instrument.** Uniform tiles turn a long index into wallpaper. Letting the ratio vary per tile (portrait beside landscape beside a wide strip) gives the scroll a cadence for free — as long as each ratio is *reserved* with `aspect-ratio` before the image resolves, so the variety costs zero layout shift. The variety is aesthetic; the reservation is the engineering.

**Gutters as negative margin, not `gap`.** The row pulls out by half a gutter, each cell pushes in by half a gutter. Unlike `gap`, this makes the outermost cells align flush with the page's text margin while inner gutters stay even — which is the whole reason editorial grids look typeset. Step the gutter at breakpoints (10 → 20 → 30 → 40px) and the page's density scales with the viewport instead of stretching.

**Hairlines, not cards, for dense lists.** A rule + whitespace separates as well as a card and costs a third the vertical space, so four stories fit where two would. Use `border-block-start` on every item plus `border-block-end` on the last — the borders never double up, and the rail reads as a single continuous list rather than a stack of objects.

## Reference implementation

```html
<main class="page">
  <!-- Row archetype A: fifty-fifty -->
  <section class="row row--fifty">
    <article class="cell"><a class="tile" href="#">
      <img class="tile__img tile__img--portrait" src="a.jpg" alt="…" loading="lazy" decoding="async">
      <h3 class="tile__headline">The Weird Prophetic Dreams of Aydan Nix</h3>
    </a></article>
    <article class="cell"><a class="tile" href="#">
      <img class="tile__img tile__img--landscape" src="b.jpg" alt="…" loading="lazy" decoding="async">
      <h3 class="tile__headline">Brutalismus 3000 Dreamt in American</h3>
    </a></article>
  </section>

  <!-- Row archetype B: three-thirds -->
  <section class="row row--thirds">
    <article class="cell"><a class="tile" href="#">…</a></article>
    <article class="cell"><a class="tile" href="#">…</a></article>
    <article class="cell"><a class="tile" href="#">…</a></article>
  </section>

  <!-- Row archetype C: hairline dense rail -->
  <section class="row row--rail">
    <ul class="rail">
      <li class="rail__item"><a href="#">
        <img src="c.jpg" alt="…" width="60" height="60" loading="lazy" decoding="async">
        <h4 class="rail__headline">Creating Space with Erika de Casier</h4>
        <span class="rail__meta">Music</span>
      </a></li>
      <li class="rail__item">…</li>
    </ul>
  </section>
</main>

<style>
  .page {
    --gutter: var(--space-2);        /* half-gutter lives on the cell, full pull on the row */
    padding-inline: var(--space-3);
    background: var(--color-bg);
    color: var(--color-fg);
  }
  @media (min-width: 48rem)  { .page { --gutter: var(--space-3); } }
  @media (min-width: 64rem)  { .page { --gutter: var(--space-4); padding-inline: var(--space-8); } }
  @media (min-width: 90rem)  { .page { --gutter: var(--space-5); padding-inline: var(--space-9); } }

  /* Negative-margin gutter grid: outer cells stay flush with the page margin. */
  .row {
    display: flex;
    flex-wrap: wrap;
    margin-inline: calc(-1 * var(--gutter));
    margin-block-end: var(--space-8);
  }
  .cell { padding-inline: var(--gutter); flex: 0 0 100%; min-width: 0; }

  @media (min-width: 48rem) {
    .row--fifty  .cell { flex-basis: 50%; }
    .row--thirds .cell { flex-basis: 33.3333%; }
  }

  /* Crop ratio reserved before the image resolves → variety with zero CLS. */
  .tile__img {
    display: block;
    width: 100%;
    object-fit: cover;
    background: var(--color-surface);
  }
  .tile__img--portrait  { aspect-ratio: 3 / 4; }
  .tile__img--landscape { aspect-ratio: 7 / 5; }
  .tile__img--strip     { aspect-ratio: 8 / 1; }

  .tile { display: block; color: inherit; text-decoration: none; }
  .tile__headline {
    margin: var(--space-3) 0 0;
    font-family: var(--font-sans);
    font-weight: var(--weight-light, 300);
    font-size: var(--text-xl);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-heading);
    text-transform: uppercase;
  }
  .tile:hover .tile__headline { text-decoration: underline; text-underline-offset: 0.2em; }

  /* Hairline rail: rules and whitespace, no cards, no shadow, no radius. */
  .rail { list-style: none; margin: 0; padding: 0; flex: 0 0 100%; }
  .rail__item { border-block-start: 1px solid var(--color-hairline); }
  .rail__item:last-child { border-block-end: 1px solid var(--color-hairline); }
  .rail__item > a {
    display: flex;
    gap: var(--space-3);
    align-items: flex-start;
    padding-block: var(--space-3);
    color: inherit;
    text-decoration: none;
  }
  .rail__item img { flex: 0 0 auto; aspect-ratio: 1; object-fit: cover; background: var(--color-surface); }
  .rail__headline {
    margin: 0;
    font-family: var(--font-sans);
    font-weight: var(--weight-light, 300);
    font-size: var(--text-sm);
    line-height: var(--leading-snug);
    letter-spacing: var(--tracking-heading);
    text-transform: uppercase;
  }
  .rail__meta {
    font-family: var(--font-serif-editorial, "Times New Roman", Georgia, serif);
    font-size: var(--text-xs);
    color: var(--color-muted);
  }

  /* The site itself ships no focus ring — do not copy that. A 1px offset ring
     costs nothing in this design language. */
  .tile:focus-visible,
  .rail__item > a:focus-visible {
    outline: 1px solid var(--color-focus);
    outline-offset: 2px;
  }
</style>
```

Porting notes:
- Keep hairline weight (`--weight-light`) off anything below ~`--text-sm` on a photographic ground; drop to `--weight-regular` there or the type disappears.
- The archetype list is the product. Adding a sixth row type is a design decision, not a content decision — that constraint is what the pattern buys you.
- No motion is required and none is implied: this pattern's entire behavior is a hover underline and lazy image decode, so there is nothing for `prefers-reduced-motion` to disable. If you add entrance reveals on top, gate them.
