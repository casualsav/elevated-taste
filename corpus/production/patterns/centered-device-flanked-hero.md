---
pattern: centered-device-flanked-hero
from: cashapp
corpus: production
safety: production-safe
tags: [hero, app-marketing, layout]
---

## What it is
A three-zone hero on a full-bleed brand-color ground: oversized headline on the left, the real product (a photographic device running the actual app) in the center, supporting copy + a single CTA on the right. The product is the hero asset, not an abstract illustration or a fake dashboard.

## Why it works
Splitting the message into *claim (left) · proof (center) · next-step (right)* gives the eye three jobs in reading order without stacking everything into one tall column. Floating the brand's single saturated color across the whole ground (rather than dabbing it on a button) makes identity instant and keeps the palette to brand + black + white. Hierarchy comes from scale — a ~3.5× display-to-body jump in one weight — so nothing needs bolding or a second accent to stand out. This is the deliberate anti-template: it replaces "oversized hero + vague headline + three feature cards + gradient" with one concrete product shot.

## Reference implementation
```html
<section class="hero">
  <h1 class="hero__lead">The way money should work</h1>

  <figure class="hero__device">
    <img src="/app-screen.png" alt="Cash App showing a live balance, card, and offers" />
  </figure>

  <div class="hero__support">
    <p>From getting paid to growing what you've got — managing your money,
       effortless and instant, without all the fees.</p>
    <a class="pill" href="#start">Get started →</a>
  </div>
</section>

<style>
  .hero {
    display: grid;
    grid-template-columns: 1fr minmax(300px, 460px) 1fr;
    align-items: center;
    gap: var(--space-40, 40px);
    min-height: 92vh;
    padding-inline: var(--space-32, 32px);
    background: var(--color-brand-field, #00E013);   /* brand hue as the GROUND */
    color: var(--color-ink, #000);
  }

  .hero__lead {
    font-family: var(--font-display, "Cash Sans", "Helvetica Neue", sans-serif);
    font-weight: 400;                                  /* scale, not weight, makes it loud */
    font-size: clamp(2.6rem, 5vw, 3.5rem);
    line-height: 0.95;                                 /* tight display leading */
    letter-spacing: -0.03em;                           /* tight display tracking */
    margin: 0;
  }

  .hero__device img { width: 100%; height: auto; display: block; border-radius: var(--radius-card, 20px); }

  .hero__support p { font-size: 1rem; line-height: 1.5; max-width: 32ch; color: var(--color-ink, #000); }

  .pill {                                              /* signature fully-rounded action */
    display: inline-flex; align-items: center; gap: var(--space-8, 8px);
    padding: var(--space-12, 12px) var(--space-24, 24px);
    border-radius: var(--radius-pill, 999px);
    background: var(--color-ink-inverse, #fff);
    color: var(--color-ink, #000);
    transition: background var(--dur-200, 200ms) var(--ease, ease),
                color var(--dur-200, 200ms) var(--ease, ease);
  }
  .pill:hover { background: var(--color-ink, #080808); color: var(--color-ink-inverse, #f7f7f7); }

  @media (max-width: 720px) {
    .hero { grid-template-columns: 1fr; text-align: left; min-height: auto; padding-block: var(--space-40, 40px); }
  }
</style>
```
