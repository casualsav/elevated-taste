---
pattern: ascii-halftone-canvas-footer
from: lapa
corpus: production
safety: spectacle-only
trigger: load
tags: [footer, brand-experience, canvas, motion, generative]
---

## What it is
A `<canvas>` that renders text (a wordmark or gradient) as a **field of ASCII / glyph "ink"** — characters like `· + ○ □ ▲` chosen by local brightness so their density forms a halftone/dither gradient. The field animates continuously and/or reacts to the pointer, so the wordmark looks like it's dissolving into texture. A closing brand flourish, parked below the fold where its cost is harmless.

## Why it works
Halftone maps a continuous value (brightness, distance, time) to a *discrete* glyph, so simple math reads as crafted texture. Driving glyph choice by distance-to-cursor or a time wave makes the field feel alive without any per-element DOM. The mechanism transfers to any brand moment that wants generative character — footers, 404s, hero backgrounds — as long as you respect the cost: continuous `requestAnimationFrame` holds the main thread, so gate it (visibility, reduced motion, pointer type) rather than letting it run always.

## Reference implementation
```html
<footer class="ascii-footer">
  <canvas id="ascii" aria-hidden="true"></canvas>
  <h2 class="ascii-label">foundation labs, inc.</h2>
</footer>

<style>
  .ascii-footer { position: relative; background: var(--color-bg); overflow: hidden; }
  .ascii-footer #ascii { display: block; width: 100%; height: 60vh; }
  .ascii-label {            /* real, readable text on top for a11y + SEO */
    position: absolute; inset: auto 0 var(--space-6) var(--space-6);
    font-family: var(--font-sans); font-weight: 400;
    letter-spacing: var(--tracking-tight); color: var(--color-fg); margin: 0;
  }
  /* Reduced motion: freeze to a single static render, no rAF loop */
  @media (prefers-reduced-motion: reduce) { .ascii-footer #ascii { /* still painted once below */ } }
</style>

<script>
  const canvas = document.getElementById('ascii');
  const ctx = canvas.getContext('2d');
  const GLYPHS = [' ', '·', '+', '○', '□', '▲', '█'];   // sparse → dense "ink"
  const CELL = 12;                                       // px per glyph cell
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(pointer: fine)');
  let cols, rows, mx = 0.5, my = 0.5, raf = 0;

  function size() {
    const r = canvas.getBoundingClientRect();
    canvas.width = r.width; canvas.height = r.height;
    cols = Math.ceil(r.width / CELL); rows = Math.ceil(r.height / CELL);
    ctx.font = `${CELL}px var(--font-mono, monospace)`;
    ctx.textBaseline = 'top'; ctx.fillStyle = getComputedStyle(canvas).color || '#000';
  }

  function draw(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // density from a slow diagonal wave + distance to the cursor
        const wave = (Math.sin((x + y) * 0.18 + t * 0.0012) + 1) / 2;
        const dx = x / cols - mx, dy = y / rows - my;
        const near = 1 - Math.min(1, Math.hypot(dx, dy) * 1.6);
        const v = Math.max(0, Math.min(1, wave * 0.65 + near * 0.6));
        const g = GLYPHS[Math.floor(v * (GLYPHS.length - 1))];
        if (g !== ' ') ctx.fillText(g, x * CELL, y * CELL);
      }
    }
  }

  function loop(t) { draw(t); raf = requestAnimationFrame(loop); }

  function start() {
    if (raf) return;
    if (reduce.matches) { size(); draw(0); return; }   // one static frame, no loop
    raf = requestAnimationFrame(loop);
  }
  function stop() { cancelAnimationFrame(raf); raf = 0; }

  if (finePointer.matches && !reduce.matches) {
    addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width; my = (e.clientY - r.top) / r.height;
    }, { passive: true });
  }

  // Only animate while the footer is on-screen — never burn the main thread off-view.
  new IntersectionObserver(([e]) => e.isIntersecting ? start() : stop(), { threshold: 0 })
    .observe(canvas);
  addEventListener('resize', size, { passive: true });
  size(); draw(0);   // initial static paint so it's never blank
</script>
```
