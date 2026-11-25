---
pattern: ascii-particle-ring
from: adoratorio
corpus: expressive
safety: spectacle-only
tags: [hero, branding, typography, motion, interactive-showcase]
---

## What it is
A circular brand mark built entirely from text: the studio's tagline words (here the letters of `SHINE` / `ENNI…`) are repeated and laid out as a ring of monospace-feeling glyphs in ghost-grey on the canvas, with a small piece of copy (`scroll down`) sitting at the dead center of the ring. It is not an image or an SVG — every character is a positioned DOM node, so the ring can assemble on load and scatter/recompose on scroll or pointer move (the mobile capture caught it mid-scatter, letters dispersed into a loose halo). One font, one tiny size, one faint value; the "logo" is typography arranged into a shape rather than a drawn symbol.

## Why it works
It turns the wordmark into a *field* instead of a label, which reads as craft because the brain registers "these are real letters, deliberately placed" before it resolves the circle — a second-read moment that a static logo can't buy. Mechanically it is **shape-from-repetition**: a ring (a strong, calm gestalt) emerges from many identical low-contrast units, so the mark feels rich yet stays quiet enough to share the canvas with a giant wordmark elsewhere. Centering live copy inside the ring uses the enclosed negative space as a frame, pointing the eye to the one actionable thing (`scroll down`) without a button. The transferable principle: **you can compose a focal graphic out of meaningful text** — letters double as both content (the brand words, crawler-readable) and ornament (the geometry) — which is cheaper and more on-brand than a bespoke illustration, and it animates per-glyph for free. Reuse for hero marks, loaders, section dividers, or any "logo moment" on a type-driven site. Spectacle-only as motion (see below), but the static ring degrades to a legible, accessible block.

## Reference implementation
```html
<!--
  Framework-neutral. The ring is generated from a phrase so the glyphs are real,
  readable text; geometry comes from CSS custom properties, never magic numbers.
  Progressive enhancement: server-render the phrase as plain words inside .ring;
  JS only adds the radial transforms. No JS / reduced-motion => readable list.
-->
<section class="ring-stage" aria-label="Adoratorio — Shine">
  <p class="ring" aria-hidden="true"><!-- glyph spans injected here --></p>
  <a class="ring__center" href="#work">scroll down</a>
</section>

<style>
  .ring-stage {
    position: relative;
    display: grid;
    place-items: center;
    min-block-size: 100svh;
    background: var(--color-bg);
    color: var(--color-fg);
    font-family: var(--font-mono);
  }

  /* Each glyph is absolutely placed on a circle of radius --r,
     at angle --a (turns). --i is its index; --n the total count. */
  .ring {
    --r: min(14rem, 38vw);      /* ring radius — fluid so the ring never exceeds the viewport */
    position: relative;
    inline-size: calc(var(--r) * 2);
    block-size: calc(var(--r) * 2);
    margin: 0;
  }
  .ring span {
    position: absolute;
    inset-block-start: 50%;
    inset-inline-start: 50%;
    font-size: var(--text-xs);
    line-height: var(--leading-tight);
    color: var(--color-muted);          /* ghost grey, low contrast */
    transform:
      rotate(var(--a))
      translateY(calc(var(--r) * -1))
      rotate(calc(var(--a) * -1));      /* keep glyph upright */
    transition: transform var(--duration-slow) var(--ease-standard),
                opacity   var(--duration-slow) var(--ease-standard);
  }

  .ring__center {
    position: absolute;
    inset: 50%;
    transform: translate(-50%, -50%);
    font-size: var(--text-sm);
    color: var(--color-fg);
    text-decoration: none;
  }

  /* SCATTER state (added on scroll / pointer): each glyph drifts out by a
     per-glyph random factor --d set in JS; recomposes when the class is removed. */
  .ring.is-scattered span {
    transform:
      rotate(var(--a))
      translateY(calc(var(--r) * -1 * var(--d, 1.6)))
      rotate(calc(var(--a) * -1));
    opacity: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .ring span { transition: none; }
    .ring.is-scattered span { transform: none; opacity: 1; } /* never hide content */
  }
</style>

<script>
  // Build the ring from a real phrase so the letters are meaningful + crawlable.
  const phrase = 'SHINE'.repeat(28);          // brand word -> ring of glyphs
  const ring = document.querySelector('.ring');
  const n = phrase.length;
  [...phrase].forEach((ch, i) => {
    const s = document.createElement('span');
    s.textContent = ch;
    s.style.setProperty('--a', (i / n) + 'turn'); // even angular spacing
    s.style.setProperty('--d', (1.4 + Math.random()).toFixed(2)); // scatter spread
    ring.appendChild(s);
  });
</script>
```
