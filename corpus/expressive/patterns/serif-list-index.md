---
pattern: serif-list-index
from: locomotive
corpus: expressive
safety: production-safe
tags: [portfolio-index, navigation, feature-section, agency]
---

## What it is

A portfolio or section index rendered as a stack of **full-width, rule-separated rows set in a display serif** — the project/item *names* are the gallery, not thumbnails. Each row is a horizontal band divided from its neighbours by a hairline rule; an optional hover swaps in a preview image (a floating cursor-follower or a full-bleed fill). The same row-with-rule system scales down to drive small "label | content" lists (articles, archive, store) elsewhere on the page, so one mechanism handles both the hero index and the dense secondary lists.

## Why it works

Blowing the index up to a reading-scale serif makes the *content* (the names) the loudest thing on the page while a single column carries the entire catalogue. Hierarchy comes from **scale + rules**, not from cards, fills, or shadows — so the page stays calm and editorial even when it is information-rich. It is also the cheapest layout to make responsive (one column reflows trivially) and the most accessible (real headings and links in DOM order, with the hover image as pure enhancement). The shared rule-row primitive means the giant work index and the tiny article list are the *same component at two scales*, which is what makes the page feel systematic rather than decorated.

## Reference implementation

```html
<style>
  .index {
    background: var(--color-bg);
    color: var(--color-fg);
    font-family: var(--font-serif);            /* a book/display serif is the whole personality */
    border-top: 1px solid var(--color-hairline);
  }
  .index__row {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: var(--space-5);
    padding-block: var(--space-3);
    border-bottom: 1px solid var(--color-hairline);
    text-decoration: none;
    color: inherit;
    position: relative;
    transition: color var(--duration-base) var(--ease-standard);
  }
  .index__name {
    font-size: var(--text-5xl);                /* display scale: the name IS the gallery */
    font-weight: var(--weight-regular);        /* one weight; scale does the ranking */
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
  }
  /* hover preview — pure enhancement, never the only affordance */
  .index__row .index__preview {
    position: absolute;
    inset-inline-end: var(--space-6);
    width: 9rem; height: auto;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--duration-base) var(--ease-standard);
  }
  .index__row:hover .index__preview,
  .index__row:focus-visible .index__preview { opacity: 1; }
  .index__row:hover .index__name { color: var(--color-accent); }
  .index__row:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: calc(-1 * var(--space-1));
  }

  /* same rule-row primitive, small scale: label | content lists */
  .index--compact .index__row { justify-content: space-between; padding-block: var(--space-2); }
  .index--compact .index__name { font-size: var(--text-base); }
  .index__meta { font-size: var(--text-sm); color: var(--color-muted); }

  @media (max-width: 48rem) {
    .index__name { font-size: var(--text-3xl); }
    .index__row .index__preview { display: none; }   /* touch/keyboard fallback: no hover image */
  }
  @media (prefers-reduced-motion: reduce) {
    .index__row, .index__preview, .index__name { transition: none; }
  }
</style>

<nav class="index" aria-label="Featured work">
  <a class="index__row" href="/work/scout-motors">
    <span class="index__name">Scout Motors</span>
    <img class="index__preview" src="/media/scout.jpg" alt="" aria-hidden="true">
  </a>
  <a class="index__row" href="/work/populous">
    <span class="index__name">Populous</span>
    <img class="index__preview" src="/media/populous.jpg" alt="" aria-hidden="true">
  </a>
  <a class="index__row" href="/work/mate-libre">
    <span class="index__name">Mate Libre</span>
    <img class="index__preview" src="/media/mate-libre.jpg" alt="" aria-hidden="true">
  </a>
</nav>

<!-- same primitive, compact: an articles / archive list -->
<nav class="index index--compact" aria-label="Articles">
  <a class="index__row" href="/articles/lightship">
    <span class="index__name">Locomotive x Lightship: Innovation Needs a Companion</span>
    <span class="index__meta">2024</span>
  </a>
</nav>
```
