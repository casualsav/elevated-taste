---
pattern: intent-quiz-hero
from: masterclass
corpus: expressive
safety: production-safe
trigger: load
tags: [hero, onboarding, landing, conversion, marquee, motion]
---

## What it is
A split hero for products with many different kinds of buyer. The left column is a condensed all-caps display line and — where a "Get started" button would normally sit — a one-tap intent checklist: *"What brings you here today?"* followed by six to eight plain-language goals. The right column is a continuously drifting wall of faces or artifacts, feathered at its edges, with a real pause control.

## Why it works
Two independent mechanisms, both transferable on their own.

**The checklist replaces a CTA with a declaration.** A generic hero button asks the visitor to commit before the product has said anything specific to them. A checklist inverts that: the first click *is* the segmentation, so the next screen can be about one audience instead of all of them, and the visitor has already invested an action — the commitment effect does the work a second paragraph of copy could not. The button still exists; it now knows something. Keep the options in the visitor's vocabulary ("Become a better chef"), never in yours ("Culinary vertical"), and make the whole row the target, not just the box. Six to eight options is the working range: below six you have not segmented anything, above eight you have built a form.

**The media wall says "inexhaustible" without saying anything.** Motion is a duplicated track translated by exactly `-50%` on a `linear infinite` loop — because the content is doubled, the halfway point is pixel-identical to the start, so the reset is invisible and there is no JS. The edges are dissolved with `mask-image` rather than clipped by a hard box edge, which is what makes it read as *a window onto something larger* instead of *a box of images*. Both details are cheap: `transform` only, no reflow, no scroll handler.

The wall is the pattern's one liability. A `linear infinite` animation never idles, so it keeps the compositor awake for the life of the page — a real battery cost. Ship all three guards: a visible pause control, a `prefers-reduced-motion` stop, and an `IntersectionObserver` that pauses the track when it scrolls out of view.

## Reference implementation
```html
<section class="ihero">
  <div class="ihero__copy">
    <h1 class="ihero__title">Learn from the best,<br>be your best.</h1>
    <p class="ihero__sub">Get unlimited access to thousands of bite-sized lessons.</p>

    <form class="quiz" action="/start" method="get">
      <fieldset>
        <legend class="quiz__legend">What brings you here today?</legend>
        <label class="quiz__row">
          <input type="checkbox" name="intent" value="career">
          <span>Develop my career or leadership skills</span>
        </label>
        <label class="quiz__row">
          <input type="checkbox" name="intent" value="ai">
          <span>Learn about AI and how to leverage it</span>
        </label>
        <label class="quiz__row">
          <input type="checkbox" name="intent" value="craft">
          <span>Become a better actor, musician, or writer</span>
        </label>
        <label class="quiz__row">
          <input type="checkbox" name="intent" value="other">
          <span>Something else</span>
        </label>
      </fieldset>
      <button class="quiz__submit" type="submit">Continue</button>
    </form>
  </div>

  <div class="ihero__wall">
    <div class="wall__track" id="wall-track">
      <!-- Author the set once, then duplicate it verbatim. The -50% loop depends on it. -->
      <figure><img src="/f1.jpg" alt="Chef plating a dish in a studio kitchen"></figure>
      <figure><img src="/f2.jpg" alt="Novelist at a writing desk"></figure>
      <figure><img src="/f3.jpg" alt="Director reviewing a shot list"></figure>
      <figure aria-hidden="true"><img src="/f1.jpg" alt=""></figure>
      <figure aria-hidden="true"><img src="/f2.jpg" alt=""></figure>
      <figure aria-hidden="true"><img src="/f3.jpg" alt=""></figure>
    </div>
    <button class="wall__pause" id="wall-pause" aria-pressed="false" aria-controls="wall-track">
      Pause the moving gallery
    </button>
  </div>
</section>

<style>
  .ihero {
    display: flex;
    gap: var(--space-8);
    align-items: center;
    max-inline-size: var(--container-xl);
    margin-inline: auto;
    padding: var(--space-8) var(--space-6);
    background: var(--color-bg-dark);
    color: var(--color-fg-on-dark);
  }
  .ihero__copy { flex: 1 1 50%; }
  .ihero__wall { flex: 1 1 50%; position: relative; overflow: hidden; }

  /* Condensed + uppercase wants sub-1 leading and POSITIVE tracking —
     the letterforms collide with themselves otherwise. */
  .ihero__title {
    margin: 0;
    font-family: var(--font-condensed, "Oswald", Impact, Helvetica, sans-serif);
    font-size: var(--text-5xl);
    font-weight: var(--weight-bold);
    text-transform: uppercase;
    line-height: var(--leading-display, 0.85);
    letter-spacing: var(--tracking-condensed-caps, 0.01em);
  }
  .ihero__sub {
    margin: var(--space-5) 0 var(--space-6);
    font-size: var(--text-base);
    line-height: var(--leading-normal);
    color: var(--color-muted-on-dark);
  }

  .quiz fieldset { border: 0; margin: 0; padding: 0; }
  .quiz__legend {
    padding: 0 0 var(--space-4);
    font-size: var(--text-md);
    font-weight: var(--weight-semibold);
  }
  /* The whole row is the target — never just the 16px box. */
  .quiz__row {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    min-block-size: var(--tap-target-min, 44px);
    margin-block-end: var(--space-1);
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-md);
    background: var(--color-surface-dark);
    cursor: pointer;
    /* Elevation on a dark ground is a lightness step, not a shadow. */
    transition: background var(--duration-base) var(--ease-standard);
  }
  .quiz__row:hover { background: var(--color-surface-dark-2); }
  .quiz__row:focus-within { outline: 2px solid var(--color-fg-on-dark); outline-offset: 2px; }
  .quiz__row input { inline-size: var(--space-4); block-size: var(--space-4); accent-color: var(--color-brand-accent, #e32652); }

  .quiz__submit {
    min-block-size: var(--tap-target-min, 44px);
    margin-block-start: var(--space-5);
    padding-inline: var(--space-6);
    border: 0;
    border-radius: var(--radius-md);
    background: var(--color-brand-accent, #e32652);
    color: var(--color-accent-fg);
    font-weight: var(--weight-semibold);
    cursor: pointer;
    transition: background var(--duration-base) var(--ease-standard);
  }
  .quiz__submit:hover { background: var(--color-brand-accent-pressed, #c71a42); }

  .wall__track {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    animation: wall-drift var(--duration-marquee, 40s) linear infinite;
  }
  .wall__track figure { margin: 0; }
  .wall__track img {
    display: block;
    inline-size: 100%;
    border-radius: var(--radius-lg);
    object-fit: cover;
  }

  /* The track is doubled, so -50% lands exactly on the start frame. */
  @keyframes wall-drift {
    from { transform: translateY(0); }
    to   { transform: translateY(-50%); }
  }

  /* Feather the edges instead of clipping them: a window, not a box. */
  .ihero__wall {
    --mask-edge: transparent;
    --mask-inner: #000;
    --mask-feather: var(--space-9);
    -webkit-mask-image: linear-gradient(to bottom,
      var(--mask-edge, transparent) 0,
      var(--mask-inner, #000) var(--mask-feather, 6rem),
      var(--mask-inner, #000) calc(100% - var(--mask-feather, 6rem)),
      var(--mask-edge, transparent) 100%);
            mask-image: linear-gradient(to bottom,
      var(--mask-edge, transparent) 0,
      var(--mask-inner, #000) var(--mask-feather, 6rem),
      var(--mask-inner, #000) calc(100% - var(--mask-feather, 6rem)),
      var(--mask-edge, transparent) 100%);
  }

  .wall__pause {
    position: absolute;
    inset-block-end: var(--space-4);
    inset-inline-end: var(--space-4);
    min-inline-size: var(--tap-target-min, 44px);
    min-block-size: var(--tap-target-min, 44px);
    border: 1px solid var(--color-border-on-dark);
    border-radius: var(--radius-full);
    background: var(--color-surface-dark);
    color: var(--color-fg-on-dark);
    cursor: pointer;
  }
  .wall__track.is-paused { animation-play-state: paused; }

  @media (max-width: 768px) {
    .ihero { flex-direction: column; }
    .ihero__title { font-size: var(--text-4xl); }
  }

  /* MANDATORY: a perpetual marquee is exactly what this query exists for. */
  @media (prefers-reduced-motion: reduce) {
    .wall__track { animation: none; transform: none; }
  }
</style>

<script>
  const track = document.getElementById('wall-track');
  const pause = document.getElementById('wall-pause');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  const setPaused = (paused) => {
    track.classList.toggle('is-paused', paused);
    pause.setAttribute('aria-pressed', String(paused));
    pause.textContent = paused ? 'Play the moving gallery' : 'Pause the moving gallery';
  };

  pause.addEventListener('click', () => setPaused(!track.classList.contains('is-paused')));

  // A `linear infinite` animation never idles — stop paying for it once it is off-screen.
  new IntersectionObserver(
    ([entry]) => { if (!pause.matches('[aria-pressed="true"]')) track.classList.toggle('is-paused', !entry.isIntersecting); },
    { threshold: 0 }
  ).observe(track);

  if (reduced.matches) setPaused(true);
</script>
```
> **Safety: production-safe, with one caveat.** The checklist is pure form UI — it costs nothing and improves both conversion and analytics. The marquee is `transform`-only and GPU-cheap, but it never idles: without the pause button, the reduced-motion stop, and the off-screen `IntersectionObserver` (all three above), it drains battery for the entire session. The duplicated half of the track must be `aria-hidden` with empty `alt`, or a screen reader reads your whole gallery twice. Keep every row ≥44px — the source site ships 76 sub-44px targets and this hero is where they start.
