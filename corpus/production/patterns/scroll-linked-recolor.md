---
pattern: scroll-linked-recolor
from: attio
corpus: production
safety: production-safe
trigger: in-view
tags: [motion, color, text, scroll, feature-section]
---

## What it is
Text (or a surface) shifts color as its section scrolls into view. Attio nudges muted captions to full-strength foreground and lifts near-white feature blocks to a solid surface on entry — the capture caught `rgb(113,122,136) → rgb(80,89,103)` on a "Segment events" caption, and its two-tone headlines crossfade muted→dark. It's the static two-tone heading made temporal: the muted half resolves to sharp as you arrive.

## Why it works
A color transition on entry adds a second beat to a reveal without extra movement — the eye registers "this just became important." Gating it on `IntersectionObserver` (not a scroll handler) keeps it cheap, and animating `color`/`background-color` is fine for a **one-shot** reveal because it's not on a continuous hot path. Pair it with the rise from `scroll-reveal-in-view` for a single cohesive entrance. Meaning never rides on hue alone (size, position and the words carry it), so it stays accessible.

## Reference implementation
```html
<style>
  .recolor {
    color: var(--color-muted);
    transition: color var(--duration-slow) var(--ease-standard);
  }
  .recolor.is-in { color: var(--color-fg); }

  .panel { background-color: var(--color-bg);
           transition: background-color var(--duration-slow) var(--ease-standard); }
  .panel.is-in { background-color: var(--color-surface); }

  @media (prefers-reduced-motion: reduce) {
    .recolor, .panel { transition: none; }
    .recolor { color: var(--color-fg); }   /* land on the end state */
  }
</style>

<p class="recolor">Segment events into the moments that move revenue.</p>

<script>
  const io = new IntersectionObserver((entries) => {
    for (const e of entries)
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
  }, { threshold: 0.4 });
  document.querySelectorAll('.recolor, .panel').forEach((el) => io.observe(el));
</script>
```
