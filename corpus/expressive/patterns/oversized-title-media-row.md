---
pattern: oversized-title-media-row
from: a24
corpus: expressive
safety: production-safe
trigger: hover
tags: [catalog, feature-section, ecommerce, editorial, typographic]
---

## What it is
A catalogue row built from three parts: an object photographed on a flat grey **plate**, a tiny uppercase **eyebrow** naming the category (`SHOP` / `PODCAST` / `WATCH NOW`), and the item's title set at the page's **display size** — the same size as the hero. Beneath it, one link with an arrow that slides on hover. Rows alternate the media left/right down the page. Nothing is a card: no border, no radius, no elevation on the row itself.

## Why it works
Two mechanisms do the work.

**The title uses the display register, not a heading register.** Most catalogues shrink item titles into an `h3` and then rebuild importance with weight, borders, and shadows. Setting every item at display scale (~4.5rem, weight 500, `line-height: 0.92`, tight negative tracking) makes each row a poster and each item a peer — the scroll becomes a reel. It only works if the page really has *two* type sizes: display, and one 15px workhorse for everything else. A middle heading size collapses the effect.

**The plate is a system surface, not a card.** A flat neutral panel with a layered, very low-alpha shadow under the cut-out object gives a vinyl sleeve, a cap, and a mug the same studio backdrop, so heterogeneous product photography reads as one collection. The shadow is three stacked offsets at 2–4% alpha — a soft falloff, never a single hard drop.

The row itself is a plain wrapping flex with a negative-margin gutter, so it collapses to a stack on narrow viewports without a grid definition. Reuse for merch grids, episode/podcast indexes, release lists, and any "our work" section whose items deserve equal billing.

## Reference implementation
```html
<!-- framework-neutral; uses house tokens with inline fallbacks for signature values -->
<style>
  .media-row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--space-3);
    padding: var(--space-9) var(--space-5);
    background: var(--color-bg);
  }
  .media-row__media { flex: 1 1 55%; min-width: 18rem; }
  .media-row__body  { flex: 1 1 35%; min-width: 16rem; }
  /* alternate the media side down the page */
  .media-row--flip .media-row__media { order: 2; }

  /* The plate: a flat system surface, never a card. */
  .plate {
    background: var(--color-plate, #eeeeee);
    display: grid;
    place-items: center;
    aspect-ratio: 4 / 3;
    padding: var(--space-8);
    border-radius: 0;
  }
  .plate img {
    max-width: 72%;
    height: auto;
    /* layered low-alpha falloff — the object sits on the plate, it does not float above it */
    filter: drop-shadow(var(--shadow-object-1, 2.8px 2.8px 2.2px rgba(0, 0, 0, 0.02)))
            drop-shadow(var(--shadow-object-2, 6.7px 6.7px 5.3px rgba(0, 0, 0, 0.027)))
            drop-shadow(var(--shadow-object-3, 12.5px 12.5px 9.9px rgba(0, 0, 0, 0.035)));
  }

  .media-row__eyebrow {
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-caps);
    font-feature-settings: "cpsp";       /* capital spacing — small caps need the air */
    color: var(--color-muted);
  }

  /* The whole point: item titles live in the DISPLAY register. */
  .media-row__title {
    margin: var(--space-4) 0 var(--space-6);
    font-size: var(--text-display);
    font-weight: var(--weight-medium);
    line-height: var(--leading-display, 0.92);
    letter-spacing: var(--tracking-display-tight, -0.04em);
    color: var(--color-fg);
    text-wrap: balance;
  }
  @media (max-width: 1024px) {
    .media-row__title { font-size: var(--text-4xl); line-height: var(--leading-tight); }
  }

  /* Sliding arrow link: arrow leads, label follows a beat later. Transform only. */
  .arrow-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-4);
    font-size: var(--text-sm);
    text-transform: uppercase;
    letter-spacing: var(--tracking-caps);
    color: var(--color-fg);
    text-decoration: none;
    padding-block: var(--space-2);        /* hit area, not glyph size */
  }
  .arrow-link__arrow,
  .arrow-link__label {
    transition: transform var(--duration-base) var(--ease-standard);
  }
  .arrow-link__label { transition-delay: 25ms; }
  .arrow-link:hover .arrow-link__arrow,
  .arrow-link:focus-visible .arrow-link__arrow { transform: translate3d(var(--arrow-travel, 0.5rem), 0, 0); }
  .arrow-link:hover .arrow-link__label,
  .arrow-link:focus-visible .arrow-link__label { transform: translate3d(var(--arrow-travel, 0.5rem), 0, 0); }
  .arrow-link:focus-visible { outline: 1px solid var(--color-focus); outline-offset: var(--space-1); }

  @media (prefers-reduced-motion: reduce) {
    .arrow-link__arrow,
    .arrow-link__label { transition: none; }
  }
</style>

<article class="media-row">
  <div class="media-row__media">
    <figure class="plate">
      <img src="/media/soundtrack.png" alt="Backrooms original motion picture soundtrack, vinyl edition">
    </figure>
  </div>

  <div class="media-row__body">
    <p class="media-row__eyebrow">Shop</p>
    <h2 class="media-row__title">Backrooms Original Motion Picture Soundtrack</h2>
    <a class="arrow-link" href="/shop/backrooms-ost">
      <svg class="arrow-link__arrow" width="40" height="12" viewBox="0 0 40 12" aria-hidden="true" focusable="false">
        <path d="M0 6h37M32 1l6 5-6 5" fill="none" stroke="currentColor" stroke-width="1"/>
      </svg>
      <span class="arrow-link__label">Shop now</span>
    </a>
  </div>
</article>

<article class="media-row media-row--flip"> … next item, media on the right … </article>
```

Notes: the display size is load-bearing — if your page also uses an `h2` and `h3` between display and body, this row will read as a card grid instead of a reel. Keep the plate colour in your token set (`--color-plate`) so every product shot lands on the same backdrop. The arrow link animates `transform` only, so it never reflows; the `25ms` delay is what makes the arrow feel like it's pulling the label. Reduced motion disables the slide, not the link.
