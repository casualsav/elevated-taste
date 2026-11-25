---
pattern: full-bleed-message-band
from: liquiddeath
corpus: expressive
safety: production-safe
tags: [feature-section, brand-experience, mission, editorial]
---

## What it is
A full-bleed horizontal band that breaks a neutral page: a photographic background (here, crushed plastic bottles) carries a short, hard-hitting condensed-caps headline and a single outline CTA, optionally anchored by a small emblem/badge. Used to stage a *value or mission statement* in the brand's own loud register instead of demoting it to a footer link.

## Why it works
Contrast and commitment. The page around it is calm white/black editorial, so a full-width image band reads as a deliberate beat — the message gets weight by *occupying the whole viewport width*, not by shouting in copy. A tinted scrim guarantees text contrast over any photo, the condensed caps match the brand's display voice, and limiting the band to one headline + one action keeps it from becoming a second hero. It's framework-neutral and cheap: no JS, no motion required. The same band can carry sustainability claims, manifestos, founder notes, or a campaign line — anywhere a statement deserves a full-bleed moment rather than a quiet paragraph.

## Reference implementation
```html
<section class="band" role="region" aria-label="Our stance on plastic">
  <div class="band__inner">
    <img class="band__badge" src="/seal.svg" alt="" aria-hidden="true">
    <h2 class="band__title">
      PLASTIC RECYCLING IS A MYTH.<br>
      ALUMINUM IS INFINITELY RECYCLABLE.
    </h2>
    <a class="btn-outline" href="/mission">LEARN MORE</a>
  </div>
</section>

<style>
  .band {
    /* photo + dark scrim for guaranteed text contrast over any image */
    background:
      linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)),
      url('/crushed-bottles.jpg') center / cover no-repeat;
    color: var(--on-dark, #fff);
    padding: var(--space-12, 150px) var(--space-6, 24px);
    text-align: center;
  }
  .band__inner {
    max-width: var(--container, 1312px);
    margin-inline: auto;
    display: grid;
    justify-items: center;
    gap: var(--space-6, 24px);
  }
  .band__badge { width: 96px; height: auto; }
  .band__title {
    font-family: var(--font-display);
    text-transform: uppercase;
    font-size: clamp(1.5rem, 3vw, 2.5rem);
    line-height: 1.1;
    letter-spacing: 1px;
    margin: 0;
    text-wrap: balance;
  }
  .btn-outline {
    font-family: var(--font-display); text-transform: uppercase; letter-spacing: 1px;
    color: var(--on-dark, #fff); text-decoration: none;
    border: 1px solid currentColor; border-radius: var(--radius-1, 5px);
    padding: var(--space-3, 12px) var(--space-6, 24px);
    transition: background var(--dur-fast, 200ms) ease, color var(--dur-fast, 200ms) ease;
  }
  .btn-outline:hover { background: var(--on-dark, #fff); color: var(--fg, #151515); }
</style>
```
> **Safety:** production-safe — static, no JS, no motion. Keep the scrim opacity high enough for ≥4.5:1 text contrast, give the background `<img>` an empty `alt` (decorative) while the headline carries the meaning, and set `loading="lazy"` on heavy band imagery if it's below the fold.
