---
pattern: spotlight-quote-card
from: linear
corpus: production
safety: production-safe
tags: [testimonial, social-proof, quote]
---

## What it is
A testimonial card whose entire surface is filled with one saturated brand color (e.g. chartreuse, or a soft blue wash) on an otherwise monochrome page. A large quote sits top-left; the attribution (avatar + name + role) anchors the bottom-left. Placed in a row of one to three such cards directly above the page's final CTA.

## Why it works
On a desaturated dark page, a single filled-color card becomes the loudest object on screen, so the eye lands on social proof exactly where conversion intent peaks. The effect is **scarcity-driven**: color works as punctuation only because the rest of the page withholds it — copy this fill onto many elements and it collapses into noise. Anchoring the quote top and attribution bottom uses the card's full height as deliberate whitespace, which reads as confidence rather than emptiness. Text color flips to near-black so it stays legible on the bright fill (don't keep light text on a light spotlight).

## Reference implementation
```html
<style>
  .spotlight-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
    max-width: var(--container-lg);
    margin-inline: auto;
    padding-inline: var(--space-6);
  }
  .spotlight-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;  /* quote top, attribution bottom */
    min-height: 20rem;              /* tall card = intentional whitespace */
    padding: var(--space-6);
    border-radius: var(--radius-lg);
    background: var(--color-spotlight); /* the ONE saturated fill, set per card */
    color: var(--color-accent-fg);      /* near-black text for contrast on bright fill */
  }
  .spotlight-card__quote {
    font-family: var(--font-sans);
    font-size: var(--text-xl);
    font-weight: var(--weight-medium);
    line-height: var(--leading-snug);
    letter-spacing: var(--tracking-tight);
    margin: 0;
    text-wrap: balance;
  }
  .spotlight-card__by {
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }
  .spotlight-card__avatar {
    width: var(--space-6);
    height: var(--space-6);
    border-radius: var(--radius-full);
    object-fit: cover;
  }
  .spotlight-card__name { font-size: var(--text-sm); font-weight: var(--weight-semibold); }
  .spotlight-card__role { font-size: var(--text-sm); opacity: 0.7; }
  @media (max-width: 768px) {
    .spotlight-row { grid-template-columns: 1fr; }
  }
</style>

<div class="spotlight-row">
  <!-- per-card fill via inline custom property; keep to 1–3 cards total -->
  <figure class="spotlight-card" style="--color-spotlight: var(--color-spotlight-blue-wash, #d3e6ff)">
    <blockquote class="spotlight-card__quote">
      "You'll probably build a better product, just because of the craft using Linear infuses on your brain."
    </blockquote>
    <figcaption class="spotlight-card__by">
      <img class="spotlight-card__avatar" src="/avatars/gp.jpg" alt="">
      <span>
        <span class="spotlight-card__name">Gabriel Peal</span><br>
        <span class="spotlight-card__role">Staff Software Engineer, OpenAI</span>
      </span>
    </figcaption>
  </figure>

  <figure class="spotlight-card" style="--color-spotlight: var(--color-spotlight-chartreuse, #e4f222)">
    <blockquote class="spotlight-card__quote">
      "Our speed is intense and Linear helps us be action biased."
    </blockquote>
    <figcaption class="spotlight-card__by">
      <img class="spotlight-card__avatar" src="/avatars/nk.jpg" alt="">
      <span>
        <span class="spotlight-card__name">Nik Koblov</span><br>
        <span class="spotlight-card__role">Head of Engineering, Ramp</span>
      </span>
    </figcaption>
  </figure>
</div>
```
