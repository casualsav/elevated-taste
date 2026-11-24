---
pattern: cycling-word-headline
from: hellomonday
corpus: expressive
safety: production-safe
tags: [hero, typography, headline, agency, brand-experience]
---

## What it is

A hero statement where a **static lead-in line** set in the workhorse UI face is completed by **one large word, set in a contrasting display serif, that rotates through a list of categories** — "We make digital (and magical)…" followed by *Branding* swapping to the studio's other disciplines on a slow timer. The lead-in never moves; only the single noun changes, and only that noun gets the expressive typeface and the display size. The page sits in enormous whitespace with a small scroll-cue dot beneath, so the swapping word is the one moving thing above the fold.

## Why it works

It compresses a capabilities list into one sentence the visitor reads as a complete thought *and* as a slideshow — you learn the studio does branding, products, experiences, etc., without a bulleted list, and the motion is meaningful (each frame is a real claim) rather than decorative. Isolating the change to a single word keeps the layout stable and the cognitive load tiny: the eye parks on one position and watches content cycle through it. Reserving the display serif for exactly this rotating noun reinforces a two-axis type system — grotesque states the frame, serif names the thing — so the brand's typographic tension is demonstrated in the first line. The discipline that makes it feel premium instead of gimmicky: one word, one slow interval, generous space, and no other competing motion.

## Why it's production-safe (and the cost)

The rotating word must be **real text**, cross-faded, with width reserved so the line never reflows as word lengths change, and it must honour `prefers-reduced-motion` by freezing on a single meaningful word. Done that way it's accessible and cheap (no images, no heavy JS). The failure modes to avoid: baking words into an image (kills a11y/SEO), letting the container resize per word (layout jitter), or stacking it with other above-the-fold animation (turns signal into noise).

## Reference implementation

```html
<style>
  .cycle-hero {
    min-height: 80svh;
    display: grid;
    place-content: center;
    text-align: center;
    gap: var(--space-6);
    padding: var(--space-10) var(--space-4);
    background: var(--color-bg);
    color: var(--color-fg);
  }
  .cycle-hero__lead {
    font-family: var(--font-sans);          /* grotesque workhorse */
    font-weight: var(--weight-regular);
    font-size: var(--text-xl);
    letter-spacing: var(--tracking-tight);
  }
  .cycle-hero__word {
    font-family: var(--font-serif, Georgia, serif);   /* display serif accent */
    font-weight: var(--weight-regular);
    font-size: clamp(var(--text-4xl), 10vw, var(--text-display));
    line-height: var(--leading-tight);
    /* reserve a stable line so swapping words never reflows the layout */
    display: inline-grid;
  }
  .cycle-hero__word > span {
    grid-area: 1 / 1;                        /* all words stacked in one cell */
    opacity: 0;
    transition: opacity var(--duration-slow) var(--ease-standard);
  }
  .cycle-hero__word > span[aria-current="true"] { opacity: 1; }

  .cycle-hero__cue {
    inline-size: var(--space-2);
    block-size: var(--space-2);
    border-radius: var(--radius-full);
    background: var(--color-fg);
    margin-inline: auto;
  }

  @media (prefers-reduced-motion: reduce) {
    .cycle-hero__word > span { transition: none; }
  }
</style>

<section class="cycle-hero">
  <p class="cycle-hero__lead">We make digital (and magical)…</p>

  <h1 class="cycle-hero__word" aria-label="We make Branding, Products, and Experiences">
    <span aria-current="true">Branding</span>
    <span>Products</span>
    <span>Experiences</span>
  </h1>

  <span class="cycle-hero__cue" aria-hidden="true"></span>
</section>

<script>
  // progressive enhancement: cross-fade words on a slow timer, paused for reduced-motion
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) {
    const words = document.querySelectorAll('.cycle-hero__word > span');
    let i = 0;
    setInterval(() => {
      words[i].setAttribute('aria-current', 'false');
      i = (i + 1) % words.length;
      words[i].setAttribute('aria-current', 'true');
    }, 2200);   // slow: one claim at a time
  }
</script>
```
