---
pattern: statement-blur-dissolve-stage
from: olsonkundig
corpus: expressive
safety: spectacle-only
trigger: scroll-progress
tags: [scroll-theater, hero, video, statement, blur, crossfade, motion, brand-experience]
---

## What it is
A sequence of full-viewport statements — one sentence each, the closing clause acting as the only link — scrolling over a **stack of `position: fixed` media layers that never move**. Each statement owns one layer. As you scroll past a statement, its copy dissolves into a heavy blur while the layer beneath it crossfades to the next. Nothing translates, nothing is scrubbed against `scrollY`: scroll only decides *which index is active*, and CSS transitions do the rest.

It is the honest structure behind most "scroll-cinema" pages, minus the scrub library. Use it for a brand manifesto, a studio homepage, or any chapter sequence where the naïve build is six stacked full-bleed heroes.

## Why it works
Two mechanisms, both worth separating from the aesthetic:

**Scroll picks a state, not a value.** The expensive part of scroll-theater is interpolating a property against scroll position on every frame. Here an `IntersectionObserver` fires once per chapter and toggles a class; the browser then runs a normal CSS transition on its own schedule. You get the choreography of a timeline with the cost profile of a hover effect — and it degrades cleanly, because a class either is or isn't applied.

**The exit is a rack focus, not a slide.** `filter: blur()` on the outgoing copy reads as the sentence *losing focus* so the image can take it, which is the opposite message from "slide up and fade" (the element leaving the room). Because the media stack is fixed while the text scrolls, the page feels like a camera holding still on a changing set — the reason architectural and film work choose this over parallax.

The contrast problem is solved before it appears: media rests at `opacity: 0.875` against a warm near-black ground, and a **directional** gradient darkens only the corner the copy occupies. A flat scrim would kill the image everywhere to fix legibility in one place.

**The cost, stated plainly.** `filter: blur()` is a raster operation, not a compositor property — a full-viewport blurred text layer repaints every frame of its transition. That is affordable *only* because it fires once per chapter as a discrete transition. Never scrub a blur against scroll, never blur an element that stays on screen, and drop `will-change` the moment the transition ends. Live video per layer is the other cost: decode one, poster the rest.

## Reference implementation
```html
<!-- The stage: fixed, never scrolls. One layer per statement. -->
<div class="stage" aria-hidden="true">
  <figure class="stage__layer is-active" data-layer="1">
    <img src="/media/1.jpg" alt="">
  </figure>
  <figure class="stage__layer" data-layer="2">
    <img src="/media/2.jpg" alt="">
  </figure>
</div>

<!-- The teleprompter: transparent sections sliding over the stage. -->
<main class="screens">
  <section class="screen" data-screen="1">
    <div class="screen__copy">
      <h2>A collaborative practice whose work expands the context of built and natural landscapes.</h2>
    </div>
  </section>
  <section class="screen" data-screen="2">
    <div class="screen__copy">
      <h2>We design for people, place, and experience. <a href="/projects">View our projects.</a></h2>
    </div>
  </section>
</main>

<style>
  /* Timings the house scale can't express — the dissolve is deliberately long. */
  .stage, .screens {
    --stage-dissolve: 800ms;
    --stage-crossfade: 400ms;
    --stage-blur: 3rem;
  }

  .stage {
    position: fixed; inset: 0; z-index: 0;
    background: var(--color-bg-dark);
    pointer-events: none;
  }
  .stage__layer {
    position: absolute; inset: 0; margin: 0;
    opacity: 0; visibility: hidden;
    /* Fade out, THEN leave hit-testing and the a11y tree. */
    transition: visibility 0s linear var(--stage-crossfade),
                opacity var(--stage-crossfade) linear;
  }
  .stage__layer.is-active {
    opacity: 1; visibility: visible;
    transition-delay: 0s;
  }
  .stage__layer img {
    width: 100%; height: 100%; object-fit: cover;
    /* Dim the media once, globally — not a scrim over the whole frame. */
    opacity: 0.875;
  }
  /* Directional scrim: dark only where the copy lands (bottom-left). */
  .stage__layer::after {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(to bottom left,
      transparent 0%,
      var(--stage-scrim, rgba(24, 18, 19, 0.618)) 100%);
  }

  /* The content plane has no background of its own. */
  .screen {
    position: relative; z-index: 1;
    min-height: 100lvh; max-height: 100svh;
    display: grid; grid-template-columns: minmax(0, 1fr); align-items: end;
    padding: var(--space-7);
    background: transparent;
  }
  .screen__copy {
    max-width: min(60ch, 100%);
    transition: filter var(--stage-dissolve) linear,
                opacity var(--stage-crossfade) linear;
  }
  .screen__copy.is-out {
    opacity: 0;
    filter: blur(var(--stage-blur));
    will-change: filter, opacity;   /* only while leaving */
  }
  .screen h2 {
    margin: 0;
    font-family: var(--font-sans);
    font-weight: var(--weight-regular);
    font-size: clamp(var(--text-4xl), 8vw, var(--text-display));
    line-height: var(--leading-tight);
    color: var(--color-fg-on-dark);
    /* Optically align the ink, not the box, to the gutter. */
    margin-left: -0.0618em;
  }
  .screen h2 a {
    color: inherit;
    text-decoration-line: underline;
    text-decoration-thickness: 0.075em;
    text-underline-offset: 0.1em;
  }

  /* Reduced motion: no blur, no dissolve. Layers still swap — instantly. */
  @media (prefers-reduced-motion: reduce) {
    .stage__layer, .screen__copy { transition: none; }
    .screen__copy.is-out { opacity: 1; filter: none; will-change: auto; }
  }
</style>

<script>
  // Scroll picks an INDEX. CSS does the animating. No scroll listener, no scrub.
  const layers  = document.querySelectorAll('.stage__layer');
  const screens = document.querySelectorAll('.screen');
  const calm    = matchMedia('(prefers-reduced-motion: reduce)');

  const activate = (index) => {
    layers.forEach((l) => l.classList.toggle('is-active', l.dataset.layer === index));
    screens.forEach((s) => {
      const leaving = s.dataset.screen !== index;
      s.querySelector('.screen__copy').classList.toggle('is-out', leaving && !calm.matches);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && activate(e.target.dataset.screen)),
    { threshold: 0.5 }   // a screen owns the stage once it holds half the viewport
  );
  screens.forEach((s) => observer.observe(s));

  // Drop will-change as soon as the dissolve finishes — never leave it on.
  screens.forEach((s) => {
    const copy = s.querySelector('.screen__copy');
    copy.addEventListener('transitionend', () => {
      if (!copy.classList.contains('is-out')) copy.style.willChange = 'auto';
    });
  });
</script>
```

Notes: `threshold: 0.5` is the whole tuning surface — lower it and chapters swap before you've read them, raise it and the last screen never activates on short viewports. Use `100lvh` with a `100svh` cap so a mobile URL bar can't push the copy off-screen. If the layers are video rather than stills, `play()` only the active one and `pause()` the rest on every `activate()` — six simultaneously-decoding videos is what makes this **spectacle-only**, not the CSS. Cap the sequence at 5–7 statements: past that the fixed stage stops reading as a held camera and starts reading as a broken scroll.
