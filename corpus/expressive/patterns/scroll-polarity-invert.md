---
pattern: scroll-polarity-invert
from: cssdesignawards
corpus: expressive
safety: production-safe
trigger: scroll-progress
tags: [motion, scroll, theme-invert]
---

## What it is
A persistent element — a fixed logo, a sticky heading, a custom cursor — whose **text color crossfades** from near-black to near-white (and back) as the page scrolls from a light section into a dark one. The element appears to "belong to the page" and read correctly against whichever band it overlaps, and the crossfade itself signals that the page has changed chapters. On Red Collar the sticky brand word inverts (`#0d0c0c → #fafafa`) exactly as the background flips behind it.

## Why it works
It animates only `color`/`opacity` — compositor-cheap, never reflows. Implemented with a **CSS scroll-driven animation** (`animation-timeline`), the browser does the work off the main thread, so it stays smooth without scroll listeners or rAF (the source did it the expensive hand-rolled way with 9 scroll listeners + 621 rAF calls — don't copy that). The effect is a structural cue, not decoration: it ties the floating element to the section beneath it so contrast is always legible and section changes feel authored. Reuse for any long page that alternates light/dark bands and carries a fixed logo, nav, or scroll-progress label.

## Reference implementation
```html
<!-- framework-neutral; CSS scroll-driven animation with a reduced-motion fallback -->
<style>
  /* The element that must stay readable over light AND dark bands */
  .brand {
    position: fixed;
    top: var(--space-5);
    left: var(--space-5);
    z-index: 10;
    font-weight: var(--weight-regular);
    letter-spacing: var(--tracking-tight);
    color: var(--color-fg);                     /* light-band default */
  }

  /* Mark the dark sections so the timeline knows where to invert */
  .band--dark { background: var(--color-surface-inverse); color: var(--color-fg-inverse); }
  .band--light { background: var(--color-bg); color: var(--color-fg); }

  @supports (animation-timeline: scroll()) {
    @media (prefers-reduced-motion: no-preference) {
      /* Drive the crossfade off a named timeline tied to the dark band's
         passage through the viewport — no JS, off the main thread. */
      .band--dark { view-timeline-name: --darkband; }

      .brand {
        animation: polarity-invert linear both;
        animation-timeline: --darkband;
        /* invert only while the dark band overlaps the brand's fixed spot */
        animation-range: entry 0% exit 100%;
      }
      @keyframes polarity-invert {
        0%, 100% { color: var(--color-fg); }
        20%, 80% { color: var(--color-fg-inverse); }
      }
    }
  }

  /* Fallback / reduced-motion: no crossfade. A mix-blend cursor-safe option
     is to let the element invert instantly per section instead of animating. */
  @media (prefers-reduced-motion: reduce) {
    .brand { animation: none; }
  }
</style>

<header class="brand">red collar</header>

<section class="band--light"> … light hero … </section>
<section class="band--dark">  … dark services / awards … </section>
<section class="band--light"> … light contact … </section>

<!--
  JS fallback (only if you must support browsers without scroll-driven CSS):
  use one IntersectionObserver per dark band to toggle a .brand.is-inverse
  class — still cheap, still off the scroll event. Never use a scroll handler.
-->
<script>
  if (!CSS.supports('animation-timeline: scroll()')
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const brand = document.querySelector('.brand');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        // invert when a dark band covers the brand's fixed position
        if (e.isIntersecting && e.intersectionRatio > 0.5) {
          brand.classList.add('is-inverse');
        } else {
          brand.classList.remove('is-inverse');
        }
      });
    }, { threshold: [0, 0.5, 1], rootMargin: '-10% 0px -80% 0px' });
    document.querySelectorAll('.band--dark').forEach(b => io.observe(b));
  }
</script>
<style>
  .brand.is-inverse { color: var(--color-fg-inverse);
    transition: color var(--duration-slow) var(--ease-standard); }
</style>
```

Notes: animate **only `color`** (or `opacity`); never width/height/top. The CSS-timeline path is the cheap default; the IntersectionObserver path is the fallback; a raw scroll handler (what the source used) is the thing to avoid. Reduced-motion disables the crossfade entirely.
