---
pattern: painterly-illustrated-hero
from: railway
corpus: production
safety: production-safe
tags: [hero, hero-spectacle, brand-experience, landing, product-marketing]
---

## What it is

A hero whose mood is carried by a single full-bleed **painterly illustration** — here a hand-painted dusk landscape (mountains, layered clouds, a star field) in cool blues with warm pink/orange highlights — rather than by a CSS gradient or a product screenshot. A serif display headline and a short sub-line sit over the artwork, the image fades into the dark page below via a bottom-to-transparent scrim, and the product UI is dropped in *underneath* the words as a separate dark panel. On mobile the same artwork is re-cropped into a **rounded hero card** (large radius) with the headline overlaid, so the illustration becomes a contained panel instead of an edge-to-edge wash.

## Why it works

A bespoke painting does what a gradient can't: it sets a specific *emotion* ("ship software peacefully" → a calm twilight) and reads as craft, instantly differentiating from the sea of gradient-on-dark dev-tool heroes. The mechanism that keeps it usable is the **scrim + text-zone separation**: text never sits on the busy part of the image — it lives in the calmer upper sky, and a `linear-gradient` overlay (transparent → page-bg) both guarantees contrast under the type and dissolves the seam where art meets page, so the illustration feels like it *becomes* the page rather than being pasted on. Using a serif for the display line leans into the editorial, human tone the artwork promises. Transfers to any brand that wants an emotional, premium first impression — launch pages, brand sites, product marketing where the feeling is the pitch — provided you (a) keep a deliberate low-detail region for the headline, (b) fade the image into the page color, and (c) ship the art responsively. The re-cropped rounded-card treatment on mobile is the safe way to keep an art-led hero from cropping its subject awkwardly on narrow screens.

## Reference implementation

```html
<!-- framework-neutral; uses var(--token) names from /tokens, no magic numbers -->
<section class="phero">
  <picture class="phero__art">
    <!-- art-directed crops: a calmer/taller crop for narrow screens -->
    <source media="(max-width: 640px)" srcset="hero-portrait.avif" type="image/avif">
    <source srcset="hero-wide.avif" type="image/avif">
    <img src="hero-wide.jpg" alt="" decoding="async" fetchpriority="high" aria-hidden="true">
  </picture>

  <div class="phero__copy">
    <h1 class="phero__title">Ship software peacefully</h1>
    <p class="phero__lede">
      With the all-in-one <a class="phero__link" href="/intelligent">intelligent</a> cloud provider
    </p>
    <div class="phero__cta">
      <a class="btn btn--primary" href="/new">Deploy</a>
      <a class="btn btn--ghost" href="/agents">Agents</a>
    </div>
  </div>

  <!-- product UI sits BELOW the words, as its own dark panel -->
  <figure class="phero__product">
    <img src="canvas.avif" alt="Railway project canvas" loading="lazy" decoding="async">
  </figure>
</section>

<style>
  .phero {
    position: relative;
    background: var(--color-bg);
    padding-block: var(--space-9) var(--space-8);
    text-align: center;
    isolation: isolate;            /* keep the scrim z-context local */
  }
  /* full-bleed artwork pinned to the top of the section */
  .phero__art {
    position: absolute;
    inset-block-start: 0;
    inset-inline: 0;
    z-index: -1;
    display: block;
    height: 60%;                   /* art occupies the upper zone only */
  }
  .phero__art img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 35%;      /* bias to the calm sky for text contrast */
  }
  /* scrim: guarantees headline contrast AND dissolves the art→page seam */
  .phero__art::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      color-mix(in srgb, var(--color-bg) 35%, transparent) 0%,
      color-mix(in srgb, var(--color-bg) 10%, transparent) 45%,
      var(--color-bg) 100%
    );
  }

  .phero__copy { max-width: var(--container-md); margin-inline: auto; }
  .phero__title {
    font-family: var(--font-serif);            /* editorial voice matches the art */
    font-size: var(--text-display);
    font-weight: var(--weight-regular);        /* scale carries it, not weight */
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--color-fg);
    margin: 0;
    text-wrap: balance;
  }
  .phero__lede {
    font-family: var(--font-sans);
    font-size: var(--text-lg);
    line-height: var(--leading-normal);
    color: var(--color-muted);
    margin-block: var(--space-4) var(--space-6);
  }
  .phero__link { color: var(--color-accent); text-decoration: underline; }

  .phero__cta { display: flex; gap: var(--space-3); justify-content: center; }
  .btn {
    font: inherit; font-size: var(--text-base);
    padding: var(--space-3) var(--space-5);
    border-radius: var(--radius-md);
    cursor: pointer; text-decoration: none;
  }
  .btn--primary { background: var(--color-accent); color: var(--color-accent-fg); border: 0; }
  .btn--ghost   { background: transparent; color: var(--color-fg);
                  box-shadow: inset 0 0 0 1px var(--color-border); }

  .phero__product {
    margin: var(--space-8) auto 0;
    max-width: var(--container-xl);
    border-radius: var(--radius-lg);
    background: var(--color-surface-2);                  /* its own tinted dark panel */
    box-shadow: inset 0 0 0 1px var(--color-border);
    overflow: hidden;
  }
  .phero__product img { display: block; width: 100%; height: auto; }

  /* mobile: artwork becomes a contained rounded card, not full-bleed */
  @media (max-width: 640px) {
    .phero { padding-block: var(--space-7) var(--space-6); }
    .phero__art {
      position: static;
      height: auto;
      margin: 0 var(--space-4) var(--space-5);
      border-radius: var(--radius-xl);
      overflow: hidden;
    }
    .phero__art img { aspect-ratio: 3 / 4; }            /* taller crop keeps the subject */
    .phero__title { font-size: var(--text-3xl); }
  }
</style>
```

Ship the illustration as responsive `srcset`/AVIF with art-directed crops (a portrait crop for mobile), set `fetchpriority="high"` on the above-the-fold image and `loading="lazy"` on the product panel below it — a single oversized hero painting is the main payload risk on an otherwise light page. The scrim is decorative, so the `<img alt="">`/`aria-hidden` is correct; keep all meaning in the real `<h1>`. Verify the headline still clears 4.5:1 against the lightest pixels under it after the scrim (tune the gradient's top stop, not the image). Requires a `--font-serif` token and `color-mix()` (or precompute the scrim stops if you must support older engines).
