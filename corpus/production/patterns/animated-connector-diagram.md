---
pattern: animated-connector-diagram
from: knock
corpus: production
safety: production-safe
trigger: in-view
tags: [motion, feature-section, product-demo, dev-tools]
---

## What it is

A node-and-connector diagram — a workflow, a data pipeline, an automation graph — where the **connector lines animate a flowing dash** so the static schematic appears to be *moving data* between nodes. Knock builds these across the page (keyframes literally named `dashToRight` / `dashToLeft` / `dashToBottom` / `dashToTop`, plus `dotPulse` at the endpoints and `workflowCellBorderSplit` / `branchBadgeBorderTrace` when a node lights up). It's how the marketing page shows "the platform is working right now" without a video or a canvas-heavy render.

Reach for it whenever you'd otherwise ship a flat diagram of boxes and arrows — an ETL flow, an event pipeline, an agent graph, a CI sequence. The motion converts a diagram-you-read into a system-you-watch.

## Why it works

Direction and liveness are the two things a static arrow can't convey. A traveling dash does both at once: the offset animates along the path, so the eye reads *flow from A to B* pre-attentively, and the never-ending loop reads *always on*. Because it's pure `stroke-dashoffset` on an SVG path (or a CSS gradient's `background-position`), it's GPU-cheap and reflow-free — unlike animating an arrowhead's position.

Construction rules:

**Animate `stroke-dashoffset`, nothing that reflows.** Give the path a dash pattern, then loop the offset. It composites on its own layer; the diagram's layout never recalculates. Vary `animation-direction` / sign of the offset per edge to point flow the right way (`dashToRight` vs `dashToLeft`).

**Only run what's on screen.** Diagrams are expensive in aggregate (Knock runs 16 canvases + 146 SVGs). Gate each with an `IntersectionObserver` (`rootMargin` ~50–200px) that adds a `.is-live` class on enter and removes it on exit, so off-screen loops don't burn the main thread or battery.

**Pulse the endpoints, don't blink them.** A slow opacity/scale `dotPulse` on the source/target nodes reinforces "live" without the flicker of a hard toggle.

**Reduced motion freezes at a legible resting frame** — the dashes stop mid-pattern (still clearly a connected path), endpoints hold steady. The diagram must be fully readable with zero animation; the motion is emphasis, not information.

## Reference implementation

```html
<style>
  .flow { max-inline-size: var(--container-md, 768px); margin-inline: auto; }
  .flow__svg { inline-size: 100%; height: auto; overflow: visible; }

  /* Static path: always renders as a connected line. */
  .flow__edge {
    fill: none;
    stroke: var(--color-hairline, #cdced6);
    stroke-width: 1.5;
    stroke-linecap: round;
  }

  /* Live path: a traveling dash. Only added when the diagram is on screen. */
  .flow.is-live .flow__edge {
    stroke: var(--color-accent, #ff6c52);
    stroke-dasharray: 6 10;
    animation: dashToRight var(--duration-flow, 1400ms) linear infinite;
  }
  .flow.is-live .flow__edge--reverse { animation-name: dashToLeft; }

  @keyframes dashToRight { to { stroke-dashoffset: -16; } }  /* 6 + 10 */
  @keyframes dashToLeft  { to { stroke-dashoffset:  16; } }

  /* Endpoints breathe rather than blink. */
  .flow__node {
    fill: var(--color-bg, #ffffff);
    stroke: var(--color-hairline, #cdced6);
    stroke-width: 1;
  }
  .flow.is-live .flow__node--source,
  .flow.is-live .flow__node--target {
    animation: dotPulse var(--duration-slow, 320ms) ease-in-out infinite alternate;
    transform-box: fill-box;
    transform-origin: center;
  }
  @keyframes dotPulse { to { opacity: .55; transform: scale(1.12); } }

  /* Mandatory: readable and still with zero motion. */
  @media (prefers-reduced-motion: reduce) {
    .flow.is-live .flow__edge,
    .flow.is-live .flow__node--source,
    .flow.is-live .flow__node--target { animation: none; }
    .flow.is-live .flow__edge { stroke-dasharray: 6 10; }  /* keep the dashed look, frozen */
  }
</style>

<figure class="flow" aria-label="New user sign-up triggers a welcome email, then a 24-hour delay">
  <svg class="flow__svg" viewBox="0 0 320 80" role="img">
    <path class="flow__edge"          d="M60 40 H150" />
    <path class="flow__edge flow__edge--reverse" d="M170 40 H260" />
    <circle class="flow__node flow__node--source" cx="40"  cy="40" r="16" />
    <circle class="flow__node"                     cx="160" cy="40" r="16" />
    <circle class="flow__node flow__node--target" cx="280" cy="40" r="16" />
  </svg>
</figure>

<script>
  // Run the loop only while the diagram is on screen.
  document.querySelectorAll('.flow').forEach((flow) => {
    new IntersectionObserver(
      ([e]) => flow.classList.toggle('is-live', e.isIntersecting),
      { rootMargin: '50px', threshold: 0 }
    ).observe(flow);
  });
</script>
```
