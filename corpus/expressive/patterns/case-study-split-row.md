---
pattern: case-study-split-row
from: basement
corpus: expressive
safety: production-safe
tags: [portfolio, agency, case-study, list, feature-section]
---

## What it is
A featured-work section built as a vertical stack of full-bleed media rows instead of a uniform card grid. Each row pairs a large project visual (image/video, often edge-to-edge) with a terse text column: a right-aligned project title, a small muted meta line (the disciplines, e.g. "Websites & Features"), and a single one-line outcome ("sold out inventory in hours"). The chrome stays monochrome; each project's own artwork supplies all the colour and variety. Basement uses it for Vercel Ship, Daylight, KidSuper, and MrBeast — four rows, four palettes, one calm frame.

## Why it works
The asymmetry is the mechanism. A card grid forces every project into the same box, so a loud project and a quiet one read as equals and the eye skims. A split row gives the *media* dominant area and demotes text to a narrow rail, so the work itself does the talking and each row's distinct colour becomes the rhythm — the surrounding UI can stay strictly neutral (here, black + off-white) without feeling monotonous. Right-aligning the title against the text rail creates a clean interior margin that lines up down the page, giving an editorial "contents" feel. Because hierarchy comes from area and position rather than weight or accent colour, it survives any palette and reads instantly as "selected work." Transfers to portfolios, customer/logo stories, changelogs with screenshots, and any list where each item owns a strong image.

## Reference implementation

```html
<section class="cases" aria-labelledby="cases-h">
  <h2 id="cases-h" class="cases__heading">Featured Projects</h2>

  <article class="case">
    <a class="case__media" href="/work/daylight" aria-label="Daylight case study">
      <img src="/work/daylight.jpg" alt="" loading="lazy" decoding="async" />
    </a>
    <div class="case__info">
      <h3 class="case__title">Daylight</h3>
      <p class="case__meta">Websites &amp; Features · Marketing Execution</p>
      <p class="case__blurb">
        A bold vision needs a strong launch — we cut through the noise and
        sold out inventory in hours.
      </p>
    </div>
  </article>
  <!-- repeat .case per project -->
</section>

<style>
  .cases {
    background: var(--color-bg);
    color: var(--color-fg);
    padding-block: var(--space-9);
    display: grid;
    gap: var(--space-8);
  }

  .cases__heading {
    font-family: var(--font-sans);
    font-size: var(--text-4xl);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-tight);
    line-height: var(--leading-tight);
    margin: 0;
  }

  .case {
    display: grid;
    grid-template-columns: 1fr minmax(16rem, 22rem); /* media dominant, text rail */
    gap: var(--space-6);
    align-items: end;
  }

  .case__media {
    display: block;
    aspect-ratio: 16 / 9;
    overflow: clip;
    border-radius: var(--radius-none, 0);
  }
  .case__media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform var(--duration-slow) var(--ease-standard);
  }
  .case:hover .case__media img { transform: scale(1.03); }

  .case__info { text-align: right; }

  .case__title {
    font-family: var(--font-sans);
    font-size: var(--text-2xl);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-tight);
    line-height: var(--leading-tight);
    margin: 0 0 var(--space-3);
  }
  .case__meta {
    font-size: var(--text-sm);
    color: var(--color-muted);
    margin: 0 0 var(--space-3);
  }
  .case__blurb {
    font-size: var(--text-base);
    line-height: var(--leading-normal);
    color: var(--color-subtle);
    margin: 0;
  }

  /* Mobile: media stacks above left-aligned text */
  @media (max-width: 48rem) {
    .case { grid-template-columns: 1fr; align-items: start; }
    .case__info { text-align: left; }
  }
</style>
```
