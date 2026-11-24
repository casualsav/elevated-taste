---
pattern: clear-color-canvas-shell
from: igloo
corpus: expressive
safety: production-safe
trigger: load
tags: [hero, canvas, webgl, shell, layout, a11y, motion]
---

## What it is

The page shell for a full-viewport canvas experience. Three decisions, one of which the source exemplar got exactly right and two of which it got exactly wrong:

1. **The renderer's clear color is hoisted into a CSS custom property** and used to paint `html`/`body`. The document paints that color instantly; the canvas later paints the same color. The handoff is invisible — no white flash, no skeleton, no letterbox. (Igloo declares exactly one meaningful custom property, `--bgColor: #A0A5B1`, and it is the scene's clear color.)
2. **A real, selectable DOM text layer sits above the canvas** — wordmark, one line of copy, real links. Igloo rasterizes all of its text into WebGL, which leaves screen readers, keyboard users, and crawlers an empty `<div>`.
3. **Gesture capture is gated, not global.** `overflow: hidden; touch-action: none` on the root deletes scrolling, find-in-page, and keyboard navigation for everyone. Apply it only when a canvas is actually mounted and running.

## Why it works

A canvas hero has one structural risk and one ethical one. The structural risk is the **flash**: the browser paints the document body before your module has compiled a shader, and any mismatch between the two backgrounds is a visible tear at exactly the moment the user forms their first impression. Naming the clear color once, in CSS, and reading it back in JS makes the tear impossible by construction — the two surfaces cannot drift apart because there is only one value.

The ethical risk is that a canvas is **opaque to everything that isn't an eyeball**. The fix is not to make the canvas accessible; it's to keep the canvas decorative (`aria-hidden`) and put the page's actual message in ordinary DOM stacked above it. Do that and the page degrades correctly at every failure point: no JS, no WebGL, `prefers-reduced-motion`, a crawler, a screen reader — all get a legible page over a still poster, which is precisely the resting frame of the animation they're missing. Pairs with `blueprint-assembly-preloader` (what the canvas does once it mounts) and `inset-canvas-stage` (the alternative posture: frame the spectacle instead of letting it own the viewport).

## Reference implementation

```html
<!-- Poster and copy are real DOM, present at first byte. The canvas is decoration, mounted last. -->
<div class="stage">
  <img class="stage__poster" src="/scene-poster.avif" alt="" aria-hidden="true" />
  <canvas class="stage__canvas" aria-hidden="true"></canvas>

  <div class="stage__hud">
    <a class="stage__mark" href="/">Field Kit</a>
    <p class="stage__copy">Sealed against weather. <a href="/about">Read the brief</a></p>
  </div>
</div>

<style>
  /* ONE value. The document paints it; the renderer clears to it. They cannot drift. */
  .stage { --stage-clear: var(--color-stage-clear, #a0a5b1); }
  html, body { margin: 0; background: var(--stage-clear, #a0a5b1); }

  .stage { position: relative; isolation: isolate; min-height: 100svh; background: var(--stage-clear); }
  .stage__poster,
  .stage__canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
  .stage__poster { object-fit: cover; z-index: 0; }
  .stage__canvas { z-index: 1; opacity: 0; transition: opacity var(--duration-slow) var(--ease-standard); }
  .stage__canvas[data-ready] { opacity: 1; }          /* cross-fade the live scene over its own poster */

  /* The message lives here, not in the shader. */
  .stage__hud {
    position: relative; z-index: 2; min-height: 100svh;
    display: grid; align-content: space-between;
    padding: var(--space-6); pointer-events: none;
    font-family: var(--font-mono); font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide); text-transform: uppercase;
    color: var(--color-ice-rim, #ffffff);
    text-shadow: 0 1px 3px var(--color-shadow, #5e6572);   /* luminance-only palettes fail AA silently */
  }
  .stage__hud a { pointer-events: auto; color: inherit; }
  .stage__hud a:focus-visible { outline: 2px solid currentColor; outline-offset: var(--space-1); }

  /* Gesture capture is a CLASS the script adds — never a bare rule on :root. */
  html.canvas-active, html.canvas-active body { height: 100%; overflow: hidden; touch-action: none; }

  /* No JS, no WebGL, or reduced motion: the poster IS the page, and it still scrolls. */
  @media (prefers-reduced-motion: reduce) {
    .stage__canvas { display: none; }
  }
</style>

<script type="module">
  const stage  = document.querySelector('.stage');
  const canvas = stage.querySelector('.stage__canvas');
  const still  = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gl     = still ? null : canvas.getContext('webgl2');
  if (!gl) throw new Error('poster stands in');   // page is already correct; nothing to undo

  // Read the clear color back OUT of CSS. The value is declared once, in the stylesheet.
  const [r, g, b] = getComputedStyle(stage).getPropertyValue('--stage-clear')
    .trim().match(/\w\w/g).map(h => parseInt(h, 16) / 255);
  gl.clearColor(r, g, b, 1);

  document.documentElement.classList.add('canvas-active');   // now, and only now, take the gestures
  canvas.toggleAttribute('data-ready', true);

  // Never let an offscreen or backgrounded canvas keep the GPU busy.
  let raf = 0;
  const frame = () => { /* draw */ raf = requestAnimationFrame(frame); };
  const run   = on => { cancelAnimationFrame(raf); if (on) raf = requestAnimationFrame(frame); };
  new IntersectionObserver(([e]) => run(e.isIntersecting)).observe(canvas);
  document.addEventListener('visibilitychange', () => run(!document.hidden));

  // Pointer parallax: fine pointers only, no-preference only, a few pixels at most.
  if (matchMedia('(pointer: fine)').matches && !still) {
    addEventListener('pointermove', e => {
      const x = (e.clientX / innerWidth - 0.5), y = (e.clientY / innerHeight - 0.5);
      stage.style.setProperty('--parallax', `translate3d(${x * -8}px, ${y * -8}px, 0)`);
    }, { passive: true });
  }
</script>
```

Notes: the `--stage-clear` round-trip (declared in CSS, read by `getComputedStyle`) is the load-bearing line — never hard-code the clear color twice. `throw` on no-WebGL is deliberate: the correct fallback is already rendered, so failure means *stop*, not *repair*. The `canvas-active` class is what makes gesture capture reversible; without it, a script error strands the user on an unscrollable page. Keep the HUD's `pointer-events: none` with `auto` on its links, or the transparent grid will swallow every drag the scene wants. And measure contrast on the text: a single-hue luminance palette will hand you 2.9:1 white-on-grey without complaint, which is why the `text-shadow` is not optional.
