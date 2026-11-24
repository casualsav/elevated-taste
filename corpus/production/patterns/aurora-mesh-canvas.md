---
pattern: aurora-mesh-canvas
from: arc
corpus: production
safety: production-safe
tags: [hero, brand-experience, landing, feature-section]
---

## What it is
A full-bleed section background that is a soft **multi-point mesh gradient** — several large, blurred radial color blooms (pink, peach, lavender) seeded at the edges and corners, fading to a warm near-cream center — so the canvas glows like an aurora without any image. Arc lays this under its serif hero so the headline and product mock sit on living color rather than flat white or a single flat tint. It is built from stacked `radial-gradient()`s over a base fill; no raster asset, no canvas/WebGL, no JS.

## Why it works
A *mesh* of low-chroma blooms reads as crafted atmosphere where a single flat tint reads as a swatch and a hard linear gradient reads as a button. The blooms are kept pale and pushed to the edges, so the center stays light enough to hold dark body text at full contrast — you get brand warmth and depth without sacrificing legibility, the trap that kills most colored heroes. Seeding the strong color at the corners also frames the composition inward toward the centered headline. Because it's pure CSS gradients, it ships as a few hundred bytes, scales to any viewport crisply (gradients are resolution-independent), and degrades to the base fill if a stop is unsupported. Transfers to any hero or brand band that wants an expensive, owned-feeling backdrop without an art-directed image or the CLS/perf cost of one — and it can animate (slow `background-position` drift) for an ambient version, though static is the production-safe default.

## Why it works (mechanism recap)
Keep total saturation low and put the chroma at the perimeter; the eye reads the colored frame as mood and the calm center as the place to look. That contrast — busy edges, quiet middle — is what makes it feel intentional rather than noisy.

## Reference implementation
```html
<style>
  .aurora {
    position: relative;
    /* base 'paper' fill the blooms sit on; everything stays warm + light */
    background-color: var(--color-surface);
    /* stacked blurry blooms: each is a soft radial seeded off-canvas/at a corner.
       Earlier layers paint on top, so order = front-to-back. All low-chroma. */
    background-image:
      radial-gradient(60% 50% at 12% 0%,  var(--color-aurora-pink, #f8dee6)   0%, transparent 60%),
      radial-gradient(55% 55% at 90% 8%,  var(--color-aurora-lavender, #e7dcf5)0%, transparent 60%),
      radial-gradient(70% 60% at 100% 100%, var(--color-aurora-peach, #fdeccf) 0%, transparent 65%),
      radial-gradient(65% 55% at 0% 100%, var(--color-aurora-lavender, #e7dcf5)0%, transparent 65%);
    background-repeat: no-repeat;

    text-align: center;
    padding-block: var(--space-9) var(--space-8);
    padding-inline: var(--space-5);
  }

  /* content sits above the painted background with no extra stacking work */
  .aurora__title {
    font-family: var(--font-serif);
    /* fluid: display size on desktop, shrinks so the headline fits small viewports */
    font-size: clamp(var(--text-4xl), 12vw, var(--text-display));
    font-weight: var(--weight-bold);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--color-fg);             /* stays 4.5:1 because center is pale */
    max-width: var(--container-md);
    margin: 0 auto var(--space-4);
    text-wrap: balance;
  }
  .aurora__sub {
    font-size: var(--text-md);
    color: var(--color-muted);
    max-width: var(--container-content);
    margin: 0 auto;
  }

  /* optional ambient drift — opt-in, and disabled for reduced-motion */
  @media (prefers-reduced-motion: no-preference) {
    .aurora--animated {
      background-size: 140% 140%, 140% 140%, 140% 140%, 140% 140%;
      animation: aurora-drift var(--duration-slow) ease-in-out infinite alternate;
      /* slow it right down for ambience; 0.32s token is a floor, scale it up */
      animation-duration: 18s;
    }
    @keyframes aurora-drift {
      from { background-position: 0% 0%, 100% 0%, 100% 100%, 0% 100%; }
      to   { background-position: 10% 5%, 90% 10%, 95% 95%, 5% 95%; }
    }
  }
</style>

<section class="aurora">
  <h1 class="aurora__title">Meet the next evolution</h1>
  <p class="aurora__sub">One warm canvas, brand colour before a single accent is spent.</p>
</section>
```

Safety: production-safe as a **static** background. The single non-negotiable is contrast — verify `--color-fg` body/headline holds 4.5:1 against the *lightest* center region (the blooms must stay pale and edge-weighted; if you darken or center them, switch to light text). The animated variant is gated behind `prefers-reduced-motion: no-preference`; even then keep it an 15–20s near-imperceptible drift, never a fast cycle (motion-sickness + needless GPU churn). No image means no CLS and a few hundred bytes of CSS versus a hero JPG.
