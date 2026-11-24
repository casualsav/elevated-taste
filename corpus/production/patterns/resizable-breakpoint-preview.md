---
pattern: resizable-breakpoint-preview
from: tailwindcss
corpus: production
safety: production-safe
trigger: drag
tags: [motion, docs, interactive-showcase, feature-section, dev-tool, responsive]
---

## What it is

A preview pane you can drag narrower and wider, with a monospace ruler above it marking where the layout will re-flow (`Mobile · sm · md · lg · xl`). The previewed component is laid out with **container queries**, not viewport media queries, so it genuinely re-lays-out as the pane shrinks — the demo is the real thing, not a set of before/after screenshots. Tailwind pairs it with a dark code panel whose edited line flashes a tinted wash the first time the tile scrolls into view (`in-view code flash`), pointing at the line that caused what you're looking at.

## Why it works

Responsive behavior is a *function of width*, and the only honest way to show a function is to let the reader move the input. Direct manipulation beats a captioned screenshot pair because the reader chooses the width — including the awkward one between your two screenshots — and sees the answer. The ruler converts a continuous drag into named landmarks, so the reader learns your breakpoint vocabulary while playing.

Two implementation choices carry the whole thing:

- **`@container`, not `@media`.** The component reads its *own* width, so the same markup works inside the demo pane, in a sidebar, and in a full-width row. Wiring the demo to viewport media queries would force you to fake it with an iframe or a transform-scale hack, and the demo would then be lying about how the component behaves in production.
- **Width writes go through `requestAnimationFrame`.** A pointermove handler that writes layout directly will run several times per frame and thrash. Coalescing into one rAF write per frame keeps a 1013-rAF page smooth.

The code flash is the cheapest possible emphasis device: it animates `background-color` on one line, fires once on intersect, and settles with `forwards`. Nothing moves, so nothing can make the reader seasick — but it must still be gated on `prefers-reduced-motion` (the source site ships no reduced-motion rules at all; do not copy that).

## Reference implementation

```html
<style>
  .rbp { display: grid; gap: var(--space-4); }

  /* --- ruler: named landmarks over a continuous drag --- */
  .rbp-ruler {
    display: grid;
    grid-template-columns: 22fr 8fr 16fr 16fr 20fr;      /* same ratio as 0 / 40 / 48 / 64 / 80rem, fluid */
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-muted);
    border-bottom: 1px solid var(--color-border);
  }
  .rbp-ruler span { padding: var(--space-2); border-left: 1px solid var(--color-border); }
  .rbp-ruler span:first-child { border-left: 0; }

  /* --- the resizable pane --- */
  .rbp-stage { position: relative; }
  .rbp-pane {
    container-type: inline-size;                          /* the component measures THIS */
    inline-size: var(--rbp-w, calc(100% - var(--space-3)));   /* leave room for the handle straddling the right edge */
    max-inline-size: calc(100% - var(--space-3));
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }
  .rbp-handle {
    position: absolute;
    inset-block: 0;
    inset-inline-start: calc(var(--rbp-w, calc(100% - var(--space-3))) - var(--space-3) / 2);   /* centred on the pane edge, not hanging off it */
    inline-size: var(--space-3);
    cursor: ew-resize;
    touch-action: none;
    background: var(--color-border-strong);
    border-radius: var(--radius-full);
  }
  .rbp-handle:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }

  /* --- the demo component: container queries, so the demo is the real thing --- */
  .rbp-card { display: grid; gap: var(--space-4); padding: var(--space-5); }
  .rbp-card img { inline-size: 100%; border-radius: var(--radius-md); }
  @container (min-width: 40rem) {
    .rbp-card { grid-template-columns: 1fr 1fr; align-items: center; }
  }

  /* --- companion: in-view code flash on the line that caused it --- */
  .rbp-code {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    background: var(--color-bg-dark);
    color: var(--color-fg-on-dark);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    overflow: auto;
    max-block-size: 20rem;
  }
  .rbp-code-title {                                      /* scrolls under its own titlebar */
    position: sticky;
    top: 0;
    padding: var(--space-2) var(--space-4);
    margin: calc(var(--space-4) * -1) calc(var(--space-4) * -1) var(--space-3);
    color: var(--color-muted-on-dark);
    background: var(--color-border-on-dark);
    backdrop-filter: blur(16px);                         /* safe: small element, not viewport */
  }
  .rbp-code .flash { display: block; border-radius: var(--radius-sm); }
  .rbp-code.is-in .flash {
    animation: rbp-flash 2s var(--ease-standard) forwards;
  }
  @keyframes rbp-flash {
    from { background-color: var(--color-code-flash, rgba(0, 166, 244, 0.10)); }
    to   { background-color: transparent; }
  }

  @media (prefers-reduced-motion: reduce) {
    .rbp-code.is-in .flash { animation: none; background-color: transparent; }
    .rbp-handle { transition: none; }
  }
  @media (max-width: 48rem) {
    .rbp-handle { display: none; }                       /* touch: ship a sensible fixed width */
    .rbp-pane  { inline-size: 100%; }
  }
</style>

<div class="rbp">
  <div class="rbp-ruler" aria-hidden="true">
    <span>Mobile</span><span>sm</span><span>md</span><span>lg</span><span>xl</span>
  </div>

  <div class="rbp-stage">
    <div class="rbp-pane">
      <article class="rbp-card">
        <img src="/img/house.jpg" alt="Clapboard beach house behind a flowering hedge">
        <div>
          <h3>Beach House on Lake Huron</h3>
          <p>Entire house · Bayfield, ON</p>
        </div>
      </article>
    </div>
    <!-- a real control: keyboard-resizable, labelled, announced -->
    <div class="rbp-handle" role="separator" tabindex="0"
         aria-label="Resize preview" aria-orientation="vertical"
         aria-valuemin="20" aria-valuemax="100" aria-valuenow="100"></div>
  </div>

  <pre class="rbp-code"><span class="rbp-code-title">card.html</span><code>&lt;article class="card"&gt;
<span class="flash">  &lt;!-- re-flows at the container's own 40rem mark --&gt;</span>
&lt;/article&gt;</code></pre>
</div>

<script>
  const stage  = document.querySelector('.rbp-stage');
  const pane   = stage.querySelector('.rbp-pane');
  const handle = stage.querySelector('.rbp-handle');

  let frame = 0;
  const setWidth = (px) => {
    const pct = Math.min(100, Math.max(20, (px / stage.clientWidth) * 100));
    if (frame) return;                       // coalesce pointermove into one write per frame
    frame = requestAnimationFrame(() => {
      frame = 0;
      pane.style.setProperty('--rbp-w', pct + '%');
      handle.style.setProperty('--rbp-w', pct + '%');
      handle.setAttribute('aria-valuenow', Math.round(pct));
    });
  };

  handle.addEventListener('pointerdown', (e) => {
    handle.setPointerCapture(e.pointerId);
    const move = (ev) => setWidth(ev.clientX - stage.getBoundingClientRect().left);
    const up = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', up);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', up);
  });

  handle.addEventListener('keydown', (e) => {           // keyboard parity, not decoration
    const step = e.shiftKey ? 10 : 2;
    const now = Number(handle.getAttribute('aria-valuenow'));
    if (e.key === 'ArrowLeft')  setWidth(stage.clientWidth * (now - step) / 100);
    if (e.key === 'ArrowRight') setWidth(stage.clientWidth * (now + step) / 100);
  });

  // in-view gate for the code flash — fires once, never on every scroll-by
  const code = document.querySelector('.rbp-code');
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }
  }, { threshold: 0.25, rootMargin: '200px' });
  io.observe(code);
</script>
```

Reuse notes: the drag handle is a real control — give it `role="separator"`, a label, and arrow-key steps, or you have shipped a mouse-only feature. On touch, hide the handle and pick one honest default width rather than exposing a drag target you can't grab. The flash color is the one pattern-specific value here; source it from your accent (`var(--color-code-flash, …)` falls back to the exemplar's cyan).
