---
pattern: arch-portrait-flanked-hero
from: tend
corpus: production
safety: production-safe
tags: [hero, layout, imagery, landing, editorial]
---

## What it is
A centered headline stack — display line, one-sentence subhead, CTA pair — with a human portrait bled off each side of the viewport. The portraits are cropped to a very large border-radius (an arch/lozenge, not a circle and not a rectangle) and are deliberately allowed to run past the left and right edges so only the inner two-thirds of each face is on screen. Tend uses it for the hero and then repeats it, unchanged, on its clinical-team band.

## Why it works
It solves the problem the split-hero creates. In a split hero, image and message occupy equal, competing halves and the eye has to choose. Here the portraits are *framing devices*: they sit in the periphery, they are cropped (so incomplete, so not a destination), and the only complete, centered object on screen is the sentence you are meant to read. You get the emotional payload of faces without spending the focal point on them.

Three details do the actual work:
- **Crop, don't contain.** Bleeding past the viewport edge is what signals "frame" rather than "content". A portrait that fits inside the margin becomes a card and starts competing again.
- **Derive the arch from the system's own radius.** The arch is not a new shape — it is the button's pill radius pushed to an extreme. That is why the photography reads as designed-in rather than pasted on. Pick the radius as a large multiple of your existing one, not an arbitrary number.
- **The center column must survive alone.** The arches are decoration; below the layout's breakpoint they leave entirely (or drop under the fold) and the hero is still a complete center-stack. This makes the whole pattern one `display: none` away from safe on mobile, and it is why the responsive story needs no second design.

Vertically offsetting the two portraits by a small amount (one higher, one lower) keeps the composition from reading as a symmetrical logo lockup.

## Reference implementation
```html
<style>
  .arch-hero {
    position: relative;
    display: grid;
    place-items: center;
    padding-block: var(--space-9);
    padding-inline: var(--space-5);
    background: var(--color-bg);
    overflow-x: clip;               /* portraits leave the page, not the layout */
  }

  .arch-hero__stack {
    max-width: var(--container-content);
    text-align: center;
    display: grid;
    gap: var(--space-5);
    position: relative;
    z-index: 1;
  }

  .arch-hero__title {
    font-family: var(--font-display, Georgia, serif);
    font-size: clamp(var(--text-3xl), 5vw - 0.5rem, var(--text-5xl));
    font-weight: var(--weight-bold);
    line-height: var(--leading-tight);
    /* softer than the body copy on purpose: family + hue carry the hierarchy */
    color: var(--color-heading, #698680);
    margin: 0;
  }

  .arch-hero__lede {
    font-size: var(--text-md);
    line-height: var(--leading-normal);
    color: var(--color-fg);
    margin: 0 auto;
    max-width: 46ch;
  }

  .arch-hero__actions { display: flex; gap: var(--space-3); justify-content: center; flex-wrap: wrap; }

  /* --- the frame --------------------------------------------------------- */
  .arch-hero__portrait {
    position: absolute;
    top: 50%;
    inline-size: clamp(14rem, 22vw, 20rem);
    aspect-ratio: 85 / 132;
    object-fit: cover;
    /* the system's pill radius, taken to its limit */
    border-radius: var(--radius-arch, 12.875rem);
    z-index: 0;
    pointer-events: none;
  }
  /* crop past the edge; the offsets break the symmetry */
  .arch-hero__portrait--start { inset-inline-start: 0;  translate: -22% -55%; }
  .arch-hero__portrait--end   { inset-inline-end: 0;    translate:  22% -45%; }

  /* Below the breakpoint the frame is dropped and the center stack stands alone. */
  @media (max-width: 60rem) {
    .arch-hero__portrait { display: none; }
  }
</style>

<section class="arch-hero">
  <img class="arch-hero__portrait arch-hero__portrait--start" src="/img/patient-a.jpg" alt="">
  <img class="arch-hero__portrait arch-hero__portrait--end"   src="/img/patient-b.jpg" alt="">

  <div class="arch-hero__stack">
    <h1 class="arch-hero__title">Look forward to going to the dentist</h1>
    <p class="arch-hero__lede">Whether it's been 6 months or 6 years, we make it easy to get back — with no judgment, ever.</p>
    <div class="arch-hero__actions">
      <a class="btn btn--primary" href="/book">Book now</a>
      <a class="btn btn--ghost" href="tel:+12126863686">(212) 686-3686</a>
    </div>
  </div>
</section>
```

Decorative portraits take `alt=""` and `pointer-events: none` — they carry no information the headline doesn't. `overflow-x: clip` (not `hidden`) keeps the bleed from creating a scrollbar without making the section a scroll container.
