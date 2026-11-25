---
pattern: mono-page-accent-band
from: every
corpus: production
safety: production-safe
trigger: load
tags: [cta, conversion, marquee, motion, editorial]
---

## What it is
A single full-bleed horizontal band, filled with the site's **one** saturated brand color, dropped into an otherwise strictly monochrome page as the lone color event. It carries the primary conversion message — a serif value proposition, a subscribe control — and, optionally, an infinitely looping marquee of product/app icons that gives the band energy. Every.to uses exactly one such band (pale-cyan "everyblue") on a black-and-white editorial page, so the subscribe moment lands with maximum contrast and needs no glowing button.

## Why it works
On a page where every UI accent is already colored, a CTA has to *shout* — bigger, brighter, a gradient, a shadow — to be seen against the noise. Withhold color everywhere else and the economics invert: a single saturated band is the highest-contrast object on the page by default, so the conversion moment reads as an event without any button theatrics. It's the typographic principle of restraint applied to hue — one accent, spent once, at the one place it should be spent.

The marquee is the cheap way to add life without adding a second idea: a horizontal `transform` translate on a duplicated track loops seamlessly on the compositor. Two rules keep it safe — animate **only `transform`** (never `left`/`margin`, which reflow), and **pause under `prefers-reduced-motion`** so it isn't an infinite motion source for vestibular-sensitive users. The band still works with the marquee frozen, because the color-contrast — not the motion — is what does the conversion work.

## Reference implementation
```html
<style>
  .accent-band {
    /* the one brand hue — inline fallback since it's a signature value, not a house token */
    background: var(--color-band-cyan, #c0f0fb);
    color: var(--color-fg);                 /* black ink on the band */
    border-radius: var(--radius-lg);
    padding: var(--space-7) var(--space-6);
    margin-block: var(--space-6);
    overflow: hidden;
    text-align: center;
  }
  .accent-band__headline {
    font-family: var(--font-serif, "Signifier", Georgia, serif);
    font-weight: var(--weight-regular);
    font-size: var(--text-3xl);
    line-height: var(--leading-snug);
    letter-spacing: var(--tracking-heading);
    max-width: var(--container-content);
    margin: 0 auto var(--space-5);
  }

  /* marquee: one track, duplicated inline, translated -50% for a seamless loop */
  .accent-band__marquee { display: flex; overflow: hidden; margin-bottom: var(--space-5); }
  .accent-band__track {
    display: flex;
    gap: var(--space-5);
    flex: 0 0 auto;
    will-change: transform;
    animation: band-marquee 24s linear infinite;
  }
  .accent-band__track img { height: 40px; width: auto; }

  @keyframes band-marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }   /* track holds two identical copies */
  }

  .accent-band__cta {
    display: inline-block;
    background: var(--color-fg);
    color: var(--color-bg);
    font-weight: var(--weight-medium);
    padding: var(--space-3) var(--space-5);
    border-radius: var(--radius-full);
    transition: opacity var(--duration-base) var(--ease-standard);
  }
  .accent-band__cta:hover { opacity: 0.9; }  /* dim, don't lift — house affordance */

  @media (prefers-reduced-motion: reduce) {
    .accent-band__track { animation: none; transform: none; }
  }
</style>

<section class="accent-band" aria-label="Subscribe">
  <div class="accent-band__marquee" aria-hidden="true">
    <div class="accent-band__track">
      <!-- N icons, then the SAME N again so -50% lands on an identical frame -->
      <img src="app-1.png" alt=""><img src="app-2.png" alt=""><!-- … -->
      <img src="app-1.png" alt=""><img src="app-2.png" alt=""><!-- … -->
    </div>
  </div>
  <h2 class="accent-band__headline">The Only Subscription You Need to Stay at the Edge of AI</h2>
  <a class="accent-band__cta" href="/subscribe">Subscribe</a>
</section>
```
