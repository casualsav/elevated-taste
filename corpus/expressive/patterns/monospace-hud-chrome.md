---
pattern: monospace-hud-chrome
from: cubiflow
corpus: expressive
safety: production-safe
tags: [navigation, chrome, layout, header, footer]
---

## What it is
A minimal "heads-up display" frame: tiny monospace labels pinned to the edges and corners of the viewport — wordmark top-center, an icon top-left, a "+"/menu top-right, cryptic mode hints (`[G]`, `[R]`) in the lower corners, social/section links along the bottom, and a centered action pill. The middle of the screen is left empty for content (here, a 3D scene). Everything is one font, one size, one weight, with a single rationed accent color.

## Why it works
Corner-anchored micro-labels read as *chrome wrapping a viewport*, so the brain infers there is a live, interactive system in the empty center — the frame does the work of saying "this is an interface, not a static page" before anything animates. Using monospace at a single small size signals "instrument / system readout," and anchoring to the four edges creates a stable, balanced composition with zero grid and zero decoration. The transferable mechanism: **hierarchy by position, not by size or weight.** When you remove scale and weight from the toolkit, the eye orders elements by *where* they sit (center = subject, corners = controls), which reads as deliberate and calm. Reusable for tools, maps, editors, canvases, and any product that wants a precise, technical character.

## Reference implementation
```html
<!-- Edge-anchored monospace HUD. All values from /tokens; no magic numbers. -->
<div class="hud">
  <header class="hud__bar hud__bar--top">
    <button class="hud__icon" aria-label="Toggle view">▢</button>
    <a class="hud__brand" href="/">CUBIFLOW</a>
    <button class="hud__icon" aria-label="Open menu">+</button>
  </header>

  <!-- content / canvas lives here, in the empty center -->
  <main class="hud__stage"><!-- … --></main>

  <footer class="hud__bar hud__bar--bottom">
    <span class="hud__hint" aria-label="Grid view (shortcut G)">[G]</span>
    <nav class="hud__links" aria-label="Social">
      <a href="#">FB</a><a href="#">IG</a><a href="#">IN</a>
    </nav>
    <a class="hud__cta" href="#contact">CONTACT</a>
    <nav class="hud__links" aria-label="Sections">
      <a href="#">SERVICE</a><a class="hud__accent" href="#">APP</a>
    </nav>
    <span class="hud__hint" aria-label="Rotate (shortcut R)">[R]</span>
  </footer>
</div>

<style>
  .hud {
    position: relative;
    min-block-size: 100svh;
    background: var(--color-bg);
    color: var(--color-fg);
    font-family: var(--font-mono);
    font-size: var(--text-xs);            /* one size everywhere */
    font-weight: var(--weight-regular);   /* one weight everywhere */
    line-height: var(--leading-tight);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide); /* tracking carries the "label" feel */
  }

  .hud__bar {
    position: absolute;
    inset-inline: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-4) var(--space-6);
  }
  .hud__bar--top    { inset-block-start: 0; }
  .hud__bar--bottom { inset-block-end: 0; gap: var(--space-4); }

  /* Center the wordmark independent of the flanking icons. */
  .hud__brand {
    position: absolute;
    inset-inline-start: 50%;
    transform: translateX(-50%);
    color: inherit;
    text-decoration: underline;           /* the only typographic emphasis */
    text-underline-offset: 0.25em;
  }

  .hud__icon {
    background: none;
    border: 0;
    color: inherit;
    font: inherit;
    cursor: pointer;
    line-height: 1;
  }

  .hud__links { display: flex; gap: var(--space-3); }
  .hud__links a, .hud__cta { color: inherit; text-decoration: none; }

  /* Centered pill action — full radius for the "token" / chip look. */
  .hud__cta {
    position: absolute;
    inset-inline-start: 50%;
    transform: translateX(-50%);
    padding: var(--space-2) var(--space-5);
    border: 1px solid var(--color-fg);
    border-radius: var(--radius-full);
  }

  .hud__hint { opacity: 0.7; }            /* mode affordances, slightly recessive */

  /* The single rationed accent — used on ~1% of marks, here one word. */
  .hud__accent { color: var(--color-accent); }

  /* Stack the bottom bar on small screens so labels never collide. */
  @media (max-width: 600px) {
    .hud__bar--bottom { flex-wrap: wrap; justify-content: center; }
  }
</style>
```
