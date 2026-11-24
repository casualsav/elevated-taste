---
pattern: pinned-hero-curtain-reveal
from: airtable
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [hero, full-bleed, motion]
---

## What it is
A full-viewport hero (usually a dark image or video with a headline) that stays put while the rest of the page scrolls up and *covers* it, like a curtain rising. There is no parallax and nothing on the hero transforms — the effect is pure z-axis occlusion. Airtable pins its dark hero behind the flow, reserves one viewport of scroll with a transparent spacer, then slides an opaque white content slab over it.

## Why it works
Depth is created by layering, not by moving pixels on the scroll hot path — so it is jank-free and cheap. The reserved spacer keeps the hero visible for exactly one screen, giving the headline a beat to land before the page "opens." Because the moving element is the ordinary document flow (opaque, higher z-index), it degrades perfectly with `prefers-reduced-motion` and on old browsers: worst case, the hero simply scrolls normally. Reuse it any time you want a cinematic opening without the reflow cost of a parallax rig.

## Reference implementation
```html
<!-- framework-neutral; tokens from /tokens -->
<div class="stage">
  <section class="hero" aria-label="Intro">
    <div class="hero__inner">
      <h1 class="hero__title">AI upgraded work.<br>We upgrade teamwork.</h1>
      <p class="hero__sub">One system of record for your workflows, data, and agents.</p>
      <a class="hero__cta" href="#">Start building free</a>
    </div>
  </section>
  <!-- reserves one screen of scroll so the pinned hero stays visible -->
  <div class="hero-spacer" aria-hidden="true"></div>
</div>

<main class="after-hero">
  <!-- opaque content that curtains up over the hero -->
  <section>…</section>
</main>

<style>
  .stage { position: relative; }

  /* Pinned stage layer: sticky is the safe, self-cleaning way to "fix" behind flow */
  .hero {
    position: sticky;
    top: 0;
    height: 100vh;
    z-index: 0;
    display: grid;
    align-items: center;
    background: var(--color-bg-dark, #0a0a0a);
    color: var(--color-fg-on-dark, #f5f7fa);
    overflow: clip;
  }
  .hero__inner { max-width: var(--container-xl); margin-inline: auto; padding-inline: var(--space-7); }
  .hero__title {
    font-family: var(--font-sans);
    font-size: clamp(2.5rem, 6vw, 4rem);   /* 40px → 64px, matches exemplar */
    line-height: var(--leading-tight);      /* ~1.0–1.1 display leading */
    letter-spacing: var(--tracking-display);
    margin: 0 0 var(--space-4);
  }
  .hero__sub { font-size: var(--text-lg); color: var(--color-muted-on-dark); max-width: 34ch; }

  /* Spacer occupies the scroll distance the pinned hero "eats" */
  .hero-spacer { height: 100vh; }

  /* The curtain: opaque, above the hero, lifts up over it as you scroll */
  .after-hero {
    position: relative;
    z-index: 1;
    background: var(--color-bg);      /* MUST be opaque to occlude the hero */
    border-top-left-radius: var(--radius-xl);
    border-top-right-radius: var(--radius-xl);
  }

  /* Optional: dim/scale the hero slightly as it is covered, using a
     CSS scroll-driven animation so nothing runs on the main thread. */
  @supports (animation-timeline: view()) {
    .hero__inner {
      animation: hero-recede linear both;
      animation-timeline: view(block);
      animation-range: exit 0% exit 100%;
    }
    @keyframes hero-recede { to { opacity: 0.55; transform: translateY(-4%); } }
  }

  /* Mandatory reduced-motion fallback: no recede, plain scroll */
  @media (prefers-reduced-motion: reduce) {
    .hero__inner { animation: none; opacity: 1; transform: none; }
  }
</style>
```
</content>
