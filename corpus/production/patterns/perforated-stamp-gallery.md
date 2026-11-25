---
pattern: perforated-stamp-gallery
from: every
corpus: production
safety: production-safe
tags: [hero, brand-experience, editorial, illustration, showcase]
---

## What it is
A horizontal row of "postage stamp" cards used as a hero/feature centerpiece instead of a product screenshot. Each card is a piece of bespoke art (engraving, portrait, icon) framed by a white stamp border with a *perforated edge* — the scalloped notch pattern down all four sides — and an overlaid short serif/sans label (Speak, Listen, Write). On desktop the stamps sit in a centered row beneath the headline; on mobile the row becomes a touch scroller. It replaces generic hero media with one strong, ownable visual metaphor.

## Why it works
Distinctive illustration carries brand identity more cheaply and durably than gradients or scroll motion — it is memorable on first glance and costs nothing at runtime. The metaphor (stamps = dispatches/issues) does semantic work: it tells you "this is a publication" before any copy is read, reinforcing the serif-driven editorial voice. The perforation is the entire trick — it's a pure CSS radial-gradient mask, so the effect is resolution-independent, themeable, and zero-JS. Built as a flex row that overflows to a scroller, the same markup serves desktop and mobile without a breakpoint rewrite. Transfers to any brand willing to commit to a single recurring illustration system (tickets, trading cards, polaroids, file folders) as its hero device.

## Reference implementation
```html
<!-- framework-neutral; var(--token) names from /tokens, no magic numbers -->
<style>
  .stamp-row {
    display: flex;
    gap: var(--space-5);
    justify-content: center;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-block: var(--space-6);
    -webkit-overflow-scrolling: touch;
  }
  .stamp {
    position: relative;
    flex: 0 0 auto;
    width: 13rem;
    aspect-ratio: 4 / 5;
    background: var(--color-bg);          /* stamp paper = page color shows through perforation */
    padding: var(--space-2);
    scroll-snap-align: center;
    /* The perforation: dots are punched OUT of the white frame so the bg shows.
       One radial-gradient repeated along each edge, used as a mask. */
    --perf: 7px;                          /* notch radius lives here, referenced not repeated */
    -webkit-mask:
      radial-gradient(circle var(--perf) at center, transparent 98%, #000 100%) 0 0 / calc(var(--perf) * 2.4) calc(var(--perf) * 2.4);
    mask:
      radial-gradient(circle var(--perf) at center, transparent 98%, #000 100%) 0 0 / calc(var(--perf) * 2.4) calc(var(--perf) * 2.4);
  }
  /* white stamp body sits inside, inset from the perforated mask edge */
  .stamp__paper {
    position: relative;
    height: 100%;
    background: var(--color-fg);          /* white stamp paper on the dark page */
    border-radius: var(--radius-sm);
    overflow: hidden;
  }
  .stamp__art { width: 100%; height: 100%; object-fit: cover; display: block; }
  .stamp__label {
    position: absolute;
    inset-block-start: var(--space-3);
    inset-inline-start: var(--space-3);
    font-family: var(--font-serif);
    font-size: var(--text-lg);
    color: var(--color-bg);               /* dark label reads on light art; flip per-stamp if art is dark */
    text-shadow: 0 1px 2px rgba(0,0,0,.25);
  }
  @media (min-width: 64rem) { .stamp-row { overflow: visible; } }
</style>

<section class="hero" aria-labelledby="hero-h">
  <h1 id="hero-h" class="hero__title">The only subscription you need</h1>
  <ul class="stamp-row" role="list">
    <li class="stamp">
      <div class="stamp__paper">
        <img class="stamp__art" src="/art/speak.webp" alt="" aria-hidden="true">
        <span class="stamp__label">Speak</span>
      </div>
    </li>
    <li class="stamp">
      <div class="stamp__paper">
        <img class="stamp__art" src="/art/listen.webp" alt="" aria-hidden="true">
        <span class="stamp__label">Listen</span>
      </div>
    </li>
    <li class="stamp">
      <div class="stamp__paper">
        <img class="stamp__art" src="/art/write.webp" alt="" aria-hidden="true">
        <span class="stamp__label">Write</span>
      </div>
    </li>
  </ul>
</section>
```

Requires a `--font-serif` token (a high-contrast old-style/transitional serif) for the stamp label, consistent with the other serif patterns in this corpus. Safety: production-safe. The perforation is a CSS mask (no JS, scales crisply). Keep the label as live text — it is the accessible name — and mark purely decorative art `aria-hidden`/`alt=""`. The scroller is keyboard- and touch-accessible by default; on desktop it falls back to a static centered row. If the art tiles can be dark, set `.stamp__label` color per-stamp to preserve contrast.
