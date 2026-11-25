---
pattern: edge-bleed-wordmark-masthead
from: outerbloc
corpus: production
safety: production-safe
tags: [hero, brand-experience, typography, masthead, agency, footer]
---

## What it is
The studio name set as a single line of heavy grotesque type sized so large it **overflows the viewport on both sides** — the first and last glyphs are clipped by the screen edges, so you read "…uterblo…" of "outerbloc" rather than a tidy centered word. It is the literal first thing on the page (a hero masthead) and is reprised, identically clipped, as the footer sign-off. Below the hero instance sits a small mono eyebrow and the real serif headline; the wordmark itself carries no tagline. Distinct from a normal large hero headline: the type is the *brand name*, it is sized past the container deliberately, and the clipping is the point — not an accident to be fixed.

## Why it works
Letting the word run past both edges reframes the name as **architecture rather than label**: the viewport becomes a window onto something bigger than the screen, which reads as confidence and scale without a single adjective. The clipping forces the eye to complete the word, a small act of closure that makes the brand feel known/established (you're seeing a fragment of something you "already recognize"). It spends zero color and no imagery — pure type at extreme scale does all the work — so it pairs cleanly with an otherwise calm, restrained page and an editorial serif headline beneath. Reprising the same clipped wordmark in the footer bookends the page: the name is the first and last thing, no logo lockup required. The mechanism transfers to any brand-led surface with a short, recognizable name (agency/studio sites, portfolio splash, product launch hero, about-page header). Caveats: it only works when the name is **short and the silhouette is legible even when partly cut** — long names or low-contrast faces turn to mush; keep one weight, tight tracking, and let scale alone carry it. Tag **production-safe** with conditions: the overflow must be `clip`, never a horizontal scrollbar; the visible word must still convey the name (don't clip so hard it's unreadable); and an accessible full name must exist in the DOM for screen readers and SEO even though the glyphs are visually cropped.

## Reference implementation
```html
<!-- framework-neutral; uses var(--token) names from /tokens, no magic numbers -->
<header class="mast">
  <!-- aria-label carries the TRUE name; the visual span may be clipped -->
  <h1 class="mast__wordmark" aria-label="outerbloc">
    <span aria-hidden="true">outerbloc</span>
  </h1>

  <p class="mast__eyebrow">Cue the music</p>
  <p class="mast__headline">The last design studio you'll ever need.</p>
</header>

<style>
  /* the page must never gain a horizontal scrollbar from the bleed */
  .mast { overflow-x: clip; }

  .mast__wordmark {
    margin: 0;
    /* scale PAST the viewport so first/last glyphs clip at the edges.
       clamp keeps it bleeding across sizes without magic px. */
    font-family: var(--font-sans);          /* heavy grotesque */
    font-weight: var(--weight-bold);
    font-size: clamp(var(--text-5xl), 22vw, 30rem);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);  /* tight at extreme scale */
    color: var(--color-fg);                 /* warm near-black, not #000 */
    white-space: nowrap;                     /* never wrap — it must run off-edge */
    text-align: center;                      /* centers the overflow on both sides */
  }

  /* the real message lives below, in a calmer register */
  .mast__eyebrow {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: var(--tracking-wide);
    color: var(--color-muted);
  }
  .mast__headline {
    font-family: var(--font-serif);          /* editorial serif vs grotesque mark */
    font-size: var(--text-3xl);
    font-weight: var(--weight-regular);      /* scale/face carry it, not weight */
    color: var(--color-fg);
    max-width: var(--container-content);
  }

  /* reprise the identical clipped mark as a footer sign-off */
  .footer__wordmark { /* same rules as .mast__wordmark */ }
</style>
```
