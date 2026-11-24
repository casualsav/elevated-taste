---
pattern: floating-glass-capsule-nav
from: phantom
corpus: expressive
safety: production-safe
tags: [navigation, chrome, overlay, footer, brand-experience]
---

## What it is

A primary navigation rendered as a small **frosted-glass capsule that floats over the canvas**, pinned to the bottom-center of the viewport rather than sitting in the document flow. The capsule is a translucent white fill (`rgba(white,0.15)`) with a thin hairline border, a `backdrop-filter: blur`, and a large pill radius; inside it are a few plain text links (Work · About · Careers). The *same* glass material is reused at chip scale for metadata overlaid on content and for floating side controls (e.g. a SOUND toggle), so every floating element shares one "material." It reads as a piece of translucent hardware resting on top of a dark, image-dense page — always reachable, never occupying layout.

## Why it works

On a black or photographic background, **shadow-based elevation collapses** — a drop-shadow is invisible against black and muddy against photography. Translucency + blur solves elevation by a different physics: the floating object lets the canvas show through, dimmed and blurred, which the eye reads unambiguously as "this is in front." Pinning it to the viewport (not the flow) makes it persistent and thumb-reachable on mobile with zero layout cost, and decoupling it from scroll signals "control surface" rather than "page content." Because one glass recipe is reused at every scale (capsule, chip, toggle), the interface gains a coherent material grammar for free — the user learns "frosted = floating control" once. The transferable rule: **on dark/photographic UIs, build elevation from a translucency-and-blur material instead of shadow, define it once as a role, and reuse it at every scale.** Reusable for persistent nav, command bars, overlay metadata, media controls, and toasts on any dark canvas.

## Reference implementation

```html
<!-- Frosted capsule pinned to the viewport. All values from /tokens; no magic numbers. -->
<style>
  /* The reusable glass material — define once, apply everywhere that "floats". */
  .glass {
    background: var(--color-surface);              /* rgba(white,0.15) translucent fill */
    border: 1px solid var(--color-border);         /* rgba(white,0.2) hairline */
    -webkit-backdrop-filter: blur(var(--space-3)); /* ~12px blur from the space scale */
    backdrop-filter: blur(var(--space-3));
    color: var(--color-fg);
  }

  .capsule-nav {
    position: fixed;
    inset-block-end: var(--space-5);
    inset-inline-start: 50%;
    transform: translateX(-50%);
    z-index: 10;

    display: flex;
    align-items: center;
    gap: var(--space-6);

    padding: var(--space-3) var(--space-6);
    border-radius: var(--radius-full);             /* big pill */
    font-family: var(--font-sans);
    font-size: var(--text-base);
    font-weight: var(--weight-medium);
  }
  .capsule-nav a {
    color: inherit;
    text-decoration: none;
    opacity: 0.7;                                  /* recessive until hovered */
    transition: opacity var(--duration-base) var(--ease-standard);
  }
  .capsule-nav a:hover,
  .capsule-nav a[aria-current="page"] { opacity: 1; }
  .capsule-nav a:focus-visible {
    outline: 2px solid var(--color-fg);            /* color can't carry focus here */
    outline-offset: var(--space-2);
    opacity: 1;
  }

  /* Fallback: if backdrop-filter is unsupported, fall back to a more opaque fill
     so text stays legible (never rely on the blur for contrast). */
  @supports not (backdrop-filter: blur(1px)) {
    .glass { background: var(--color-surface-2); }
  }

  /* Springy entrance — the single signature gesture, gated for reduced motion. */
  @keyframes capsule-rise {
    from { transform: translate(-50%, var(--space-7)); opacity: 0; }
    to   { transform: translate(-50%, 0);              opacity: 1; }
  }
  .capsule-nav { animation: capsule-rise var(--duration-slow) var(--ease-entrance) both; }
  @media (prefers-reduced-motion: reduce) {
    .capsule-nav { animation: none; }
    .capsule-nav a { transition: none; }
  }
</style>

<nav class="capsule-nav glass" aria-label="Primary">
  <a href="/work" aria-current="page">Work</a>
  <a href="/about">About</a>
  <a href="/careers">Careers</a>
</nav>
```
