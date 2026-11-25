---
pattern: perspective-screenshot-field-hero
from: retool
corpus: production
safety: production-safe
tags: [hero, product-marketing, interactive-showcase, dark, depth]
---

## What it is
A dark hero whose entire background is a **field of product screenshots tiled and raked back in 3D perspective** — a low-contrast "sea" of UI receding toward a horizon — with a single, sharp, high-elevation **focal card** floating above it (Retool floats its AI prompt-input box on a `0 68px 116px` shadow). The field is decorative and dimmed; the focal card is the only thing in full contrast and the only thing in the real interaction DOM. A cool→warm gradient and a vignette sink the field's far edges into the page color so the screenshots dissolve rather than end on a hard line.

## Why it works
Depth and "this builds *many* things" are communicated with the actual product instead of an illustration: a receding plane of real UI is more credible than abstract art and instantly says scale/variety. Putting one focal card in full contrast on an exaggerated shadow exploits the eye's depth cues (blur + size + shadow = "near"), so attention lands on the single CTA card with zero arrows or copy doing the pointing. Because the field is dimmed and pre-composited, the busy-ness reads as *atmosphere*, not clutter. Transferable to any product with a rich, screenshot-able UI and a "one place, many outputs" story; the mechanism (dim depth field + one sharp focal object) works with cards, code, or maps, not just screenshots.

## Reference implementation
```html
<section class="psf-hero">
  <!-- decorative depth field: a single composited image is cheapest & safest -->
  <div class="psf-field" aria-hidden="true">
    <img src="/screenshot-collage.png" alt="" />
    <!-- vignette/gradient that melts the field edges into the page -->
    <div class="psf-veil"></div>
  </div>

  <div class="psf-content">
    <h1 class="psf-title">Secure your vibe-coded apps</h1>

    <!-- the one sharp focal object, in real DOM -->
    <div class="psf-card" role="group" aria-label="App builder prompt">
      <p class="psf-prompt">Build an order management tool that tracks all orders…</p>
      <div class="psf-card-foot">
        <button class="psf-chip" type="button">Starter prompts</button>
        <button class="psf-send" type="button" aria-label="Generate app">→</button>
      </div>
    </div>
  </div>
</section>

<style>
  .psf-hero{
    position: relative;
    isolation: isolate;
    overflow: clip;
    min-height: 70vh;
    padding-block: var(--space-9);
    background:
      radial-gradient(120% 90% at 80% 30%, var(--color-hero-grad-warm, #461e15), transparent 60%),
      linear-gradient(180deg, var(--color-hero-grad-cool, #2c3748), var(--color-bg) 70%);
    color: var(--color-fg);
  }

  /* the raked-back screenshot field */
  .psf-field{
    position: absolute;
    inset: 0;
    z-index: -1;
    display: grid;
    place-items: center;
    perspective: 1200px;            /* depth cue */
    opacity: 0.5;                   /* dim → atmosphere, not clutter */
  }
  .psf-field > img{
    width: 140%;
    transform: rotateX(55deg) translateZ(calc(-1 * var(--space-8)));
    transform-origin: center 30%;
    filter: saturate(0.85) contrast(0.9);
  }
  /* melt the field edges into the page color */
  .psf-veil{
    position: absolute; inset: 0;
    background:
      radial-gradient(80% 60% at 50% 30%, transparent, var(--color-bg) 75%),
      linear-gradient(0deg, var(--color-bg), transparent 45%);
  }

  .psf-content{
    max-width: var(--container-xl);
    margin-inline: auto;
    display: grid;
    justify-items: center;
    gap: var(--space-7);
    text-align: center;
  }
  .psf-title{
    font-family: var(--font-sans);
    font-size: var(--text-5xl);
    font-weight: var(--weight-regular);   /* scale, not weight */
    letter-spacing: var(--tracking-tight);
    line-height: var(--leading-tight);
    margin: 0;
  }

  /* the focal card: inverse surface + extreme elevation */
  .psf-card{
    width: min(560px, 100%);
    background: var(--color-surface);     /* bone, NOT #fff */
    color: var(--color-fg);
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-xl);            /* large, soft */
    box-shadow: var(--shadow-focal, 0 68px 116px rgba(0,0,0,0.35));            /* 0 68px 116px rgba(0,0,0,.35) */
    padding: var(--space-5);
    display: grid;
    gap: var(--space-5);
    text-align: left;
  }
  .psf-prompt{ margin: 0; font-size: var(--text-md); line-height: var(--leading-normal); }
  .psf-card-foot{ display: flex; align-items: center; justify-content: space-between; }
  .psf-chip{
    font-size: var(--text-sm);
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-full);
    background: transparent;
  }
  .psf-send{
    inline-size: var(--space-6); block-size: var(--space-6);
    display: grid; place-items: center;
    border: 0; border-radius: var(--radius-full);
    background: var(--color-accent);            /* the one chroma */
    color: var(--color-accent-fg);
  }

  /* on small screens, drop the depth theatrics, keep the focal card */
  @media (max-width: 640px){
    .psf-field{ opacity: 0.35; }
    .psf-field > img{ transform: rotateX(60deg) scale(1.6); }
    .psf-title{ font-size: var(--text-3xl); }
  }
  @media (prefers-reduced-motion: reduce){
    .psf-field > img{ transform: none; opacity: .8; }
  }
</style>
```

> Safety: the field is `aria-hidden` decoration — prefer one pre-composited image (or a handful of `transform`ed nodes) over dozens of live, scroll-animated screenshots, which cost paint/layout and jank on low-end devices. Keep only the focal card in the accessible/interactive DOM. The inverse card uses the bone surface token, not pure white, and its dark text must clear AA contrast.
