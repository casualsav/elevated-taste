---
pattern: dark-broadsheet-rule-grid
from: every
corpus: production
safety: production-safe
tags: [editorial, blog, dense-grid, content-grid, dark, navigation]
---

## What it is
A dark editorial index — a magazine front page on a near-black ground — where **no item is a card**. Sections stack, each opening with a tiny tracked all-caps sans kicker; inside each, articles sit in a multi-column grid separated only by **1px dashed hairlines** in a low-contrast gray. Every article is a serif headline over a sans byline, and *all* the color on the page comes from the cover illustrations, never from the chrome. Every.to runs ~50 articles across a dozen departments this way and it reads as a printed broadsheet, not a feed.

## Why it works
Three ideas compound:

**A rule, not a card.** A card bundles four decisions — fill, border, radius, shadow — to communicate one thing: "these are separate." On a page of homogeneous items a dashed rule communicates exactly that and nothing else, so the eye stops parsing containers and starts parsing headlines. On a dark ground this matters more, not less: shadows barely register on black, so the usual card-elevation cue is dead weight. Dash the rule (rather than solid) and tint it toward the background so it reads as *rhythm*, not as a graphic line.

**Register carries hierarchy, so weight stays flat.** Pair a serif for headlines with a grotesque for the kicker and byline. The switch between the two families ranks the content on its own — you never need bold. This is what keeps a dense page calm: one unambiguous ordering device (serif vs sans + scale), not three fighting ones.

**Quarantine chroma into the art.** Hold the chrome to black / white / one warm gray. Let the cover images be the entire palette. Because the frame is monochrome the art pops without competing, and the page never dissolves into a rainbow of UI accents.

Below the breakpoint the columns collapse to one and the vertical structure becomes the same dashed rules turned horizontal — the system survives the reflow because it was never about the columns, it was about the rules.

## Reference implementation
```html
<style>
  .broadsheet {
    background: var(--color-bg-dark);
    color: var(--color-fg-on-dark);
    font-family: var(--font-sans);
  }

  .broadsheet__section {
    max-width: var(--container-xl);
    margin-inline: auto;
    padding-block: var(--space-6);
    /* the whole system: a dashed rule between departments */
    border-top: 1px dashed var(--color-border-on-dark);
  }

  /* kicker — the department rubric, the page's table of contents */
  .broadsheet__kicker {
    font-size: var(--text-xs);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
    color: var(--color-muted-on-dark);
    margin-bottom: var(--space-5);
  }

  .broadsheet__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--space-5);
  }
  @media (max-width: 768px) {
    .broadsheet__grid { grid-template-columns: 1fr; }
    .broadsheet__card { border-top: 1px dashed var(--color-border-on-dark); padding-top: var(--space-4); }
  }

  /* a card is only an image + serif head + sans byline — no fill, no radius, no shadow */
  .broadsheet__cover {
    aspect-ratio: 4 / 3;
    width: 100%;
    object-fit: cover;
    border-radius: var(--radius-sm);   /* the ONLY radius; art, not chrome */
    margin-bottom: var(--space-3);
  }
  .broadsheet__tag {
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
    color: var(--color-muted-on-dark);
  }
  .broadsheet__title {
    font-family: var(--font-serif, "Signifier", Georgia, serif);
    font-weight: var(--weight-regular);
    font-size: var(--text-xl);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-heading);
    margin: var(--space-2) 0 var(--space-3);
  }
  .broadsheet__title em { font-style: italic; }   /* emphasis via italic, never bold */
  .broadsheet__byline {
    font-size: var(--text-sm);
    color: var(--color-muted-on-dark);
  }
</style>

<section class="broadsheet__section">
  <p class="broadsheet__kicker">Dispatches from the Frontiers of AI</p>
  <div class="broadsheet__grid">
    <article class="broadsheet__card">
      <img class="broadsheet__cover" src="cover-1.jpg" alt="Marble bust against a cobalt field">
      <p class="broadsheet__tag">Essay</p>
      <h3 class="broadsheet__title">To Stay Ahead in AI, Think Like a <em>Designer</em></h3>
      <p class="broadsheet__byline">Katie Parrott</p>
    </article>
    <!-- repeat cards -->
  </div>
</section>
```
