---
pattern: labeled-editorial-feed
from: every
corpus: production
safety: production-safe
tags: [editorial, blog, feed, card-grid, content, navigation]
---

## What it is
A publication's homepage body built as a stack of independently *named* content rivers. Each river is a small tracked-uppercase section label (`RECENT ESSAYS`, `FROM OUR COLUMNISTS`, `PODCAST`) followed by a responsive grid of article cards that all share one rigid anatomy: a media thumbnail on top, a **serif** title, a one-line sans dek, and a tracked sans byline/dateline footer (author · publication · date). The label is the wayfinding device — you scan eyebrows down the page instead of using a nav menu — and the repeated card recipe lets a very dense page stay scannable.

## Why it works
Two mechanisms do the heavy lifting. First, **typeface register creates the in-card hierarchy** instead of size escalation: the serif title, plain-sans dek, and tracked-caps byline are visually ranked by *family and treatment*, so titles can stay near-regular weight and the grid reads calm even when packed. Reuse the same three registers in every card and the eye learns the unit once, then sweeps a 40-item page effortlessly. Second, the **section label is structure, not decoration** — chunking an endless river into named verticals gives a high-volume content page browsability without a heavier nav, and each label silently announces the editorial theme of the block beneath it. Whitespace is spent between sections (generous) while cards stay tight (compact metadata), so density and breathing coexist. Transfers to blogs, news, docs indexes, changelogs, or any catalog page that must surface many parallel items while staying readable.

## Reference implementation
```html
<!-- framework-neutral; var(--token) names from /tokens, no magic numbers -->
<style>
  .feed { max-width: var(--container-xl); margin-inline: auto; }
  .feed__section + .feed__section { margin-block-start: var(--space-9); }

  /* the wayfinding label: tracked uppercase sans, muted */
  .feed__label {
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    font-weight: var(--weight-medium);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--color-subtle);
    padding-block-end: var(--space-4);
    border-block-end: 1px solid var(--color-border);  /* single hairline, the only chrome */
    margin-block-end: var(--space-6);
  }

  .feed__grid {
    display: grid;
    gap: var(--space-6);
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
  }

  .card { display: flex; flex-direction: column; gap: var(--space-3); }
  .card__media {
    aspect-ratio: 16 / 10;
    border-radius: var(--radius-lg);
    object-fit: cover;
    width: 100%;
    background: var(--color-surface-2);   /* placeholder tint before image loads */
  }
  /* register 1 — serif title carries the content */
  .card__title {
    font-family: var(--font-serif);
    font-size: var(--text-xl);
    font-weight: var(--weight-regular);
    line-height: var(--leading-snug);
    color: var(--color-fg);
  }
  /* register 2 — plain sans dek */
  .card__dek {
    font-family: var(--font-sans);
    font-size: var(--text-sm);
    line-height: var(--leading-normal);
    color: var(--color-muted);
  }
  /* register 3 — tracked sans byline/dateline */
  .card__meta {
    margin-block-start: auto;
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--color-subtle);
  }
</style>

<div class="feed">
  <section class="feed__section" aria-labelledby="sec-essays">
    <h2 class="feed__label" id="sec-essays">Recent essays</h2>
    <div class="feed__grid" role="list">

      <article class="card" role="listitem">
        <a href="/p/asked-an-ai-to-audit-my-career">
          <img class="card__media" src="/art/audit.webp" alt="">
        </a>
        <h3 class="card__title">
          <a href="/p/asked-an-ai-to-audit-my-career">I Asked an AI to Audit My Own Career</a>
        </h3>
        <p class="card__dek">What a frontier model sees when it reads your résumé back to you.</p>
        <p class="card__meta">Dan Shipper · Chain of Thought · Jun 18</p>
      </article>

      <!-- repeat .card; identical anatomy keeps the dense grid scannable -->

    </div>
  </section>
</div>
```

Requires a `--font-serif` token (a high-contrast old-style/transitional serif) for the card title, consistent with the other serif patterns in this corpus. Safety: production-safe. Cards are real links with live text (good for SEO and screen readers); decorative thumbnails take `alt=""`. Each section is a labelled landmark (`aria-labelledby`) so the named rivers are navigable assistively, mirroring how they work visually. The `auto-fill` grid reflows from 4-up to 1-up with no breakpoint code. Keep the byline as the *only* uppercase-tracked run in the card — never the dek or title — or legibility drops.
