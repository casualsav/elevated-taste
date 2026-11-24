---
pattern: section-palette-handoff
from: playdate
corpus: expressive
safety: production-safe
trigger: in-view
tags: [navigation, hero, feature-section, landing, theming, motion]
---

## What it is

A long page is cut into full-bleed color bands — no rules, no gradients, no diagonal dividers, just abrupt saturated grounds. Each band declares a palette by re-pointing a small set of **semantic role variables** (`--page-bg`, `--text`, `--button-bg`, `--button-text`, `--link`) rather than by restyling anything inside it. Components never name a pigment, so a button, a card, and a border all get correct contrast on every ground for free.

The fixed header then joins in: an `IntersectionObserver` mirrors the current band's `data-color` onto `<html>`, and the header — which has a transparent background and inherits the same roles — re-tints to match whatever it is floating over. Background, ink, logo fill and hairline rule all cross-fade together on one short transition.

## Why it works

Two mechanisms, both transferable independently.

**The role indirection.** Splitting tokens into a *pigment* layer (`--brand-yellow`) and a *role* layer (`--page-bg`) means a theme is a remap, not an override. Eight palettes cost eight five-line blocks and zero component CSS, contrast pairs are decided once per palette instead of once per component, and `prefers-color-scheme: dark` becomes the same mechanism pointed at different pigments — the reason dark mode is nearly free here.

**The handoff.** The usual fix for a transparent header over unpredictable content is a scrim or a `backdrop-filter` blur, which costs compositing and muddies both the header and the content. Adopting the section's own palette instead is free (a class + an attribute; no per-frame JS, no blur, no new stacking context) and it reads better: the header stops looking like a floating bar and starts looking like part of the chapter you are in. It also degrades honestly — with JS off, the header simply keeps its default palette.

Two cautions. Consistency is not legibility: the mechanism guarantees every component uses *a* correct role, but you must still check the contrast of each `(band, role)` pair you author. And gate the *transition*, never the color swap — under `prefers-reduced-motion` the palette must still change, it just must not animate.

## Reference implementation

```html
<style>
  /* 1 — PIGMENTS. Raw hues. Nothing outside this block may reference them. */
  :root {
    --pig-yellow:   var(--color-band-yellow, #ffc833);
    --pig-purple:   var(--color-band-purple, #6c00ff);
    --pig-aqua:     var(--color-band-aqua, #21c6a9);
    --pig-charcoal: var(--color-band-charcoal, #212223);
    --pig-ink:      var(--color-ink-screen, #312f28);  /* warm near-black, not #000 */
    --pig-white:    var(--color-bg);
  }

  /* 2 — ROLES. The only names components are allowed to use. Light default. */
  :root,
  [data-color="white"] {
    --page-bg:     var(--pig-white);
    --text:        var(--pig-ink);
    --button-bg:   var(--pig-purple);
    --button-text: var(--pig-white);
    --hairline:    var(--pig-ink);
  }
  [data-color="yellow"] {
    --page-bg:     var(--pig-yellow);
    --text:        var(--pig-ink);
    --button-bg:   var(--pig-purple);
    --button-text: var(--pig-white);
    --hairline:    var(--pig-ink);
  }
  [data-color="aqua"] {
    --page-bg:     var(--pig-aqua);
    --text:        var(--pig-ink);
    --button-bg:   var(--pig-ink);
    --button-text: var(--pig-white);
    --hairline:    var(--pig-ink);
  }
  [data-color="charcoal"] {
    --page-bg:     var(--pig-charcoal);
    --text:        var(--color-fg-on-dark);
    --button-bg:   var(--pig-yellow);      /* the accent inverts: ground on light, accent on dark */
    --button-text: var(--pig-ink);
    --hairline:    var(--color-border-on-dark);
  }

  /* 3 — COMPONENTS. Roles only. Written once, correct on every band. */
  .band {
    background: var(--page-bg);
    color: var(--text);
    padding-block: var(--space-9);
  }
  .band > .measure {
    max-width: var(--container-content);
    margin-inline: auto;
    padding-inline: var(--space-5);
  }
  .band h2 {
    font-family: var(--font-sans);
    font-weight: var(--weight-bold);
    line-height: var(--leading-tight);
    font-size: var(--text-4xl);
    margin: 0 0 var(--space-5);
  }
  .btn {
    display: inline-block;
    background: var(--button-bg);
    color: var(--button-text);
    border-radius: var(--radius-full);
    padding: var(--space-3) var(--space-5);
    font-weight: var(--weight-bold);
    text-decoration: none;
  }
  .card { border: 1px solid var(--hairline); border-radius: var(--radius-md); }

  /* 4 — THE HANDOFF. Transparent fixed header inheriting <html>'s roles. */
  .site-header {
    position: fixed;
    inset-block-start: 0;
    inset-inline: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-5);
    padding: var(--space-3) var(--space-5);
    background: var(--page-bg);
    color: var(--text);
    border-block-end: 2px solid transparent;
    transition: background-color var(--duration-slow) var(--ease-standard),
                color var(--duration-slow) var(--ease-standard),
                border-color var(--duration-slow) var(--ease-standard);
  }
  /* over the hero the header is invisible; once scrolled it wears the band's skin */
  .site-header:not(.is-scrolled) { background: transparent; }
  .site-header.is-scrolled { border-block-end-color: var(--hairline); }

  /* the logo is a mask, so it re-inks with the palette like everything else */
  .site-header .logo {
    inline-size: 7rem; block-size: 1.5rem;
    background: currentColor;
    mask: url("/logo.svg") no-repeat center / contain;
  }

  /* 5 — MANDATORY: swap the palette, never animate it, under reduce. */
  @media (prefers-reduced-motion: reduce) {
    .site-header { transition: none; }
  }
</style>

<header class="site-header">
  <a class="logo" href="/"><span class="visually-hidden">Home</span></a>
  <a class="btn" href="/buy">Buy now</a>
</header>

<main>
  <section class="band" data-color="yellow">
    <div class="measure"><h2>The System.</h2><a class="btn" href="#">Learn more</a></div>
  </section>
  <section class="band" data-color="charcoal">
    <div class="measure"><h2>The Specs.</h2><a class="btn" href="#">Read them</a></div>
  </section>
  <section class="band" data-color="aqua">
    <div class="measure"><h2>For Education.</h2><a class="btn" href="#">Get in touch</a></div>
  </section>
</main>

<script>
  const header = document.querySelector('.site-header');
  const root = document.documentElement;

  // Observe a thin line at the header's own height: whichever band crosses it owns the palette.
  const headerH = header.offsetHeight;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        root.dataset.color = e.target.dataset.color;   // one attribute drives the whole remap
      }
    },
    { rootMargin: `-${headerH}px 0px -${Math.max(0, innerHeight - headerH - 1)}px 0px` }
  );
  document.querySelectorAll('.band[data-color]').forEach((b) => io.observe(b));

  // Cheap scrolled flag; passive listener, no layout reads per frame.
  const sentinel = document.createElement('div');
  document.body.prepend(sentinel);
  new IntersectionObserver(
    ([e]) => header.classList.toggle('is-scrolled', !e.isIntersecting)
  ).observe(sentinel);
</script>
```
