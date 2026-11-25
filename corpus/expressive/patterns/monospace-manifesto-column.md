---
pattern: monospace-manifesto-column
from: praxis
corpus: expressive
safety: production-safe
trigger: in-view
tags: [manifesto, hero, about-page, typography, motion]
---

## What it is

A narrow, centered column of **monospace running copy** that carries the page's message *instead of* a display headline. The type scale is near-flat — one body size — and hierarchy comes from **bolding the load-bearing phrases to 700** inside the otherwise-uniform line, plus uppercase tracked labels. Each statement sits alone on a tall band of whitespace, optionally fading up as it scrolls into view. It reads like a charter or redacted manifesto rather than marketing.

## Why it works

Removing the headline tier removes the "advertisement" register. When every word is the same size, the **bold keywords become the hierarchy** — the eye lands on `NEW CITY` and `HEROISM` first and reconstructs the sentence around them. Monospace adds a documentary, technical authority (it looks typed, not designed), and centering on one axis with cosmic vertical voids turns reading into a slow procession. The mechanism is transferable to any mission statement, legal/charter page, or about-page that wants gravitas without a shout — the discipline is "one idea per band, emphasis by weight, whitespace points the eye."

## Reference implementation

```html
<section class="manifesto">
  <p class="manifesto__line reveal">
    Praxis is an <b>online community</b> starting a <b>new city</b>.<br>
    The world's first digital nation.
  </p>

  <p class="manifesto__line reveal">
    Our purpose is to revitalize <b>western civilization</b> by creating
    a new culture focused on the pursuit of <b>heroism</b>, truth, and beauty.
  </p>
</section>

<style>
  .manifesto {
    max-width: var(--container-text, 800px);
    margin-inline: auto;
    padding-inline: var(--space-3, 24px);
    text-align: center;
  }
  .manifesto__line {
    font-family: var(--font-mono, "Chivo Mono", monospace);
    font-size: var(--text-body, 0.9375rem);   /* one flat size — no display tier */
    font-weight: 400;
    line-height: var(--leading-normal, 1.5);
    letter-spacing: var(--tracking-label, 0.04em);
    color: var(--fg, #101010);
    /* cosmic vertical rhythm: each statement gets its own band */
    margin-block: var(--space-section, 128px);
  }
  /* emphasis lives INSIDE the line — weight, not a separate headline */
  .manifesto__line b { font-weight: 700; }

  /* in-view fade-up, opacity/transform only */
  .reveal {
    opacity: 0;
    transform: translateY(12px);
    transition:
      opacity var(--dur, 600ms) var(--ease, cubic-bezier(0.4, 0, 0.2, 1)),
      transform var(--dur, 600ms) var(--ease, cubic-bezier(0.4, 0, 0.2, 1));
  }
  .reveal.is-visible { opacity: 1; transform: none; }

  /* MANDATORY reduced-motion fallback: jump to end state, no animation */
  @media (prefers-reduced-motion: reduce) {
    .reveal { opacity: 1; transform: none; transition: none; }
  }
</style>

<script>
  // Cheap IO-gated reveal (threshold/rootMargin mirror the exemplar: 0.3 / 200px)
  const io = new IntersectionObserver((entries, obs) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
    }
  }, { threshold: 0.3, rootMargin: '200px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
</script>
```

Notes: keep it to **one** body size (resist adding an `<h1>`); bold only the thesis words, never whole sentences. For a brand seal, break the all-mono rule with exactly one serif/italic glyph elsewhere (a wordmark) — the lone exception reads as a mark. The reveal is opacity/transform only and is fully disabled under `prefers-reduced-motion`; drop the script entirely and the copy still renders (progressive enhancement).
