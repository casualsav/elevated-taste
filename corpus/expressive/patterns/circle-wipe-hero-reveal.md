---
pattern: circle-wipe-hero-reveal
from: hellomonday
provenance: ingested-skill — video-to-website + frontend-design (2026-06-24)
corpus: expressive
safety: spectacle-only
trigger: scroll-progress
tags: [hero, scroll, clip-path, transition, reveal, motion]
---

## What it is
The hero is a **standalone 100svh section** on a solid background with a word-split headline; as it scrolls away, the canvas / media beneath is **revealed through an expanding `clip-path: circle()`** (≈0% → 75% radius from center) while the hero fades out. It is a *transition beat*, not a layout — the single hand-off gesture between "title card" and "the experience." Confined to the first ~6–8% of scroll, it makes the canvas feel **born from the hero** rather than abruptly swapped in. Provenance: ingested from the `video-to-website` + `frontend-design` skills; the corpus kin is the poster→reveal scroll-cinema lineage (hellomonday, northkingdom).

## Why it works
This is restraint §7 made literal: **spend almost all your warmth on one deliberate gesture.** A single circle wipe at the top of the page is worth more than a dozen scattered scroll effects, and because it lives in one element it stays trivially gateable. `clip-path` animates on the compositor (transform/opacity-class), so it's cheap; an expanding circle from center also reads as an *aperture opening* — a camera metaphor that primes "now you're inside the film." Crucially it can be driven entirely by a **scroll-driven CSS timeline** (`animation-timeline: scroll()` + `animation-range`) — no JS, no `scroll` listener, fully on the compositor — which is the corpus-preferred mechanism over a GSAP `onUpdate` scrubber.

The two failure modes: making the wipe *slow* (it should be over almost before the reader notices they've scrolled — a transition, not a scene), and forgetting that under reduced-motion there is **no wipe** — the canvas is simply present and the hero simply ends. Pairs with `canvas-frame-scrub-cinema` (what the circle reveals) and is a full-section sibling of the element-level `clip-reveal`.

## Reference implementation
```html
<!-- Hero is a real, selectable title card. The stage it reveals is fixed beneath it. -->
<section class="cover">
  <span class="cover__label">001 / Field Kit</span>
  <h1 class="cover__title"><span>Sealed</span> <span>against</span> <span>weather.</span></h1>
  <p class="cover__tag">Scroll to open.</p>
</section>
<figure class="reveal" aria-hidden="true"><!-- canvas-frame-scrub-cinema lives here --></figure>

<style>
  .cover {
    position: relative; z-index: 2;
    min-height: 100svh; display: grid; align-content: center;
    padding-inline: 5vw; background: var(--color-bg); color: var(--color-fg);
  }
  .cover__label { font-family: var(--font-mono); font-size: var(--text-xs);
                  letter-spacing: var(--tracking-wide); color: var(--color-muted);
                  text-transform: uppercase; }
  .cover__title { font-family: var(--font-sans); font-weight: var(--weight-bold);
                  font-size: clamp(var(--text-5xl), 11vw, var(--text-display));
                  line-height: var(--leading-tight); letter-spacing: var(--tracking-tight);
                  margin-block: var(--space-4); }
  .cover__tag  { color: var(--color-muted); }

  .reveal { position: fixed; inset: 0; margin: 0; z-index: 1;
            background: var(--color-surface-inverse); }

  /* Compositor-only scroll wipe, confined to the first slice of scroll. No JS. */
  @supports (animation-timeline: scroll()) {
    @media (prefers-reduced-motion: no-preference) {
      .cover  { animation: cover-out  linear both; }
      .reveal { animation: aperture   linear both; }
      .cover, .reveal { animation-timeline: scroll(root); animation-range: 0% 8%; }
    }
  }
  @keyframes cover-out { to { opacity: 0; transform: scale(1.04); } }
  @keyframes aperture {
    from { clip-path: circle(0%  at 50% 50%); }
    to   { clip-path: circle(75% at 50% 50%); }
  }

  /* Reduced motion / no support: no wipe — the cover ends, the stage is just there. */
  @media (prefers-reduced-motion: reduce) {
    .reveal { clip-path: none; }
  }
</style>
```

**Clip-path variations** (swap the keyframe `clip-path` pair):
- Aperture (default): `circle(0% at 50% 50%)` → `circle(75% at 50% 50%)`
- Wipe from left: `inset(0 100% 0 0)` → `inset(0 0% 0 0)`
- Rise from bottom: `inset(100% 0 0 0)` → `inset(0% 0 0 0)`
- Iris/diamond: `polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)` → `polygon(0 0, 100% 0, 100% 100%, 0 100%)`

Notes: keep the range tight (`0% 8%`) so it reads as a hand-off, not a scene. The hero must contain real `<h1>` text (word-split spans are fine — they stay selectable). Everything the circle reveals should already be in the DOM so the reduced-motion path is just "no clip."
