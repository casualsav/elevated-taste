---
pattern: dimmed-color-case-stack
from: dogstudio
corpus: expressive
safety: production-safe
tags: [portfolio-index, gallery, feed, case-study, cards]
---

## What it is

A vertical stack of **full-bleed case panels**, each flooded with **its own saturated brand color** laid over a *dimmed* project image, and headed by a tiny **color-coded category eyebrow** (e.g. `WEB`, `STRATEGY`, `DESIGN`) in that project's accent. Inside each panel: eyebrow → large display-serif title → short sans description. On a monochrome shell, this is how chromatic variety enters the page — the *content* carries the color, not the chrome. (On dogstudio it is the mobile expression of the desktop ghost index; it also stands alone as a case feed.)

## Why it works

It lets a strict, near-black system stay disciplined while the work still feels colorful and distinct: each project owns a hue, so the feed becomes a sequence of identities rather than a uniform list — adjacent panels read as separate worlds purely through their flood color. Dimming the photo (a dark scrim or low-opacity image under the color) does double duty: it guarantees text contrast over arbitrary imagery and unifies wildly different source photos into one tonal family. The tiny color-keyed eyebrow is the cheapest possible categorization signal — it labels *and* sets the panel's accent in one mark. The serif/sans split inside each panel keeps "title vs. blurb" legible without extra weights or rules. It is fully responsive and cheap (no per-card chrome, shadows, or borders), and degrades gracefully if an image fails — the flood color still carries the panel.

**Safety:** **production-safe**, with one rule — keep the text on the *darkened* layer, not raw imagery, so contrast holds for every project color/photo combination. Per-project accent should meet contrast against the panel flood for the eyebrow.

## Reference implementation

```html
<style>
  .case-stack { display: flex; flex-direction: column; }

  .case {
    /* each instance sets --case-flood and --case-accent inline */
    position: relative;
    isolation: isolate;
    min-height: 100svh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: var(--space-4);
    padding: var(--space-8) var(--space-6);
    background-color: var(--case-flood, var(--color-bg));
    color: var(--color-fg);
    overflow: clip;
  }

  /* dimmed project image sits behind the flood; scrim guarantees contrast */
  .case__media {
    position: absolute;
    inset: 0;
    z-index: -1;
    object-fit: cover;
    width: 100%;
    height: 100%;
    opacity: 0.45;                              /* the "dimmed" part */
    mix-blend-mode: luminosity;                 /* let the flood color win */
  }
  .case::after {                                /* extra readability scrim */
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: linear-gradient(
      to bottom,
      color-mix(in srgb, var(--case-flood, var(--color-bg)) 55%, transparent),
      color-mix(in srgb, var(--case-flood, var(--color-bg)) 85%, transparent)
    );
  }

  .case__eyebrow {
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    font-weight: var(--weight-bold);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--case-accent, var(--color-accent));
  }

  .case__title {
    margin: 0;
    font-family: var(--font-serif, var(--font-sans));  /* display serif if self-hosted */
    font-size: clamp(var(--text-3xl), 8vw, var(--text-5xl));
    font-weight: var(--weight-regular);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--color-fg);
  }

  .case__dek {
    max-width: var(--container-content);
    margin: 0;
    font-family: var(--font-sans);
    font-size: var(--text-lg);
    line-height: var(--leading-normal);
    color: var(--color-fg);
  }

  @media (min-width: 48rem) {
    .case { padding: var(--space-9) var(--space-8); }
  }
</style>

<div class="case-stack">
  <a class="case" href="/work/tomorrowland"
     style="--case-flood:#1b2f9e; --case-accent:#d79a21;">
    <img class="case__media" src="/img/tomorrowland.jpg" alt="" />
    <span class="case__eyebrow">Web</span>
    <h2 class="case__title">Tomorrowland</h2>
    <p class="case__dek">Building a new kind of immersive experience for the famous music festival.</p>
  </a>

  <a class="case" href="/work/navy-pier"
     style="--case-flood:#0e2a35; --case-accent:#5fc4aa;">
    <img class="case__media" src="/img/navy-pier.jpg" alt="" />
    <span class="case__eyebrow">Strategy</span>
    <h2 class="case__title">Navy Pier</h2>
    <p class="case__dek">“Enchanted Waters” is an immersive reflection on Chicago’s relationship with Lake Michigan.</p>
  </a>

  <a class="case" href="/work/royal-opera"
     style="--case-flood:#7a0f12; --case-accent:#ff4940;">
    <img class="case__media" src="/img/royal-opera.jpg" alt="" />
    <span class="case__eyebrow">Design</span>
    <h2 class="case__title">Royal Opera of Wallonia</h2>
    <p class="case__dek">A bold new identity for a historic opera house.</p>
  </a>
</div>
```
