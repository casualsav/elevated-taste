---
pattern: typing-indicator-dots
from: metabase
corpus: production
safety: production-safe
trigger: load
tags: [ai, motion, empty-state, hero]
---

## What it is
Three small dots that pulse in a left-to-right wave to signal a live or "thinking" assistant. Metabase runs them inside its hero chat demo while an AI answer is composed — a tiny, universally-legible cue that the product is conversational and working, not a static screenshot.

## Why it works
The staggered pulse is the web's shared shorthand for "a response is coming," so it communicates liveness with zero copy and near-zero cost. It animates only `opacity` and `transform: scale` (compositor-only, no layout), the three dots are cheap DOM, and the loop reads as ambient rather than attention-grabbing because the amplitude is small and the rhythm slow. Reuse in any chat, agent, async-answer, or loading-into-content state — and pair it with the answer that follows so the wait feels intentional.

## Why the timing matters
Each dot shares one keyframe but is offset by a fixed delay (~0.18s), so the wave never syncs into a single blink. Keep the period slow (~1.2s) and the resting opacity above zero so a paused/reduced-motion state still looks like three deliberate dots, not a bug.

## Reference implementation
```html
<div class="typing" role="status" aria-label="Assistant is typing">
  <span></span><span></span><span></span>
</div>

<style>
  .typing { display: inline-flex; gap: var(--space-1); padding: var(--space-1) 0; }
  .typing span {
    width: 5px; height: 5px; border-radius: var(--radius-full);
    background: var(--color-subtle);
    animation: typing-pulse 1200ms var(--ease-standard) infinite;
  }
  .typing span:nth-child(2) { animation-delay: 180ms; }
  .typing span:nth-child(3) { animation-delay: 360ms; }

  @keyframes typing-pulse {
    0%, 60%, 100% { opacity: 0.35; transform: scale(0.62); }
    30%           { opacity: 1;    transform: scale(1); }
  }

  @media (prefers-reduced-motion: reduce) {
    .typing span { animation: none; opacity: 0.5; }
  }
</style>
```
