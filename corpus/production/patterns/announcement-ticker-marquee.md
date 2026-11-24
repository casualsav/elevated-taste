---
pattern: announcement-ticker-marquee
from: outerbloc
corpus: production
safety: production-safe
tags: [navigation, marquee, ticker, social-proof, header, agency]
---

## What it is
A thin full-width strip pinned at the very top of the page that **scrolls a continuous loop of short news items** sideways — client wins, press mentions, launches ("RLTY Co. raises $20M Series A", "Featured by Landbook") separated by a small dot glyph. The items are tiny, low-contrast, and set in the UI sans; the strip sits above the masthead and runs forever. It reads like a stock/news ticker repurposed as ambient social proof. Distinct from a static announcement bar (one dismissible message) and from a logo wall: it's *motion-driven*, multi-item, and never asks for a click.

## Why it works
A slow horizontal crawl drip-feeds proof the visitor would never read as a static paragraph: motion captures peripheral attention, but because the items are small and muted it stays ambient — credibility you absorb rather than study. Looping a finite list (duplicated back-to-back) gives the impression of *more* activity than there is, and the ticker form borrows a learned "live / current / in-demand" connotation from finance and newsrooms. It costs almost no vertical space and no color, so it layers social proof onto the top of the page without competing with the hero. Transfers to any site that accumulates small proof points: agency client news, changelog/release feeds, "now playing / recently shipped" strips, event line-ups. Tag **production-safe** with strict conditions: it is decorative, so it must (1) honor `prefers-reduced-motion` by stopping, (2) `pause` on hover/focus so anyone can read an item, (3) use `aria-hidden` on the duplicated copy and keep the content reachable as plain text — never trap real information *only* inside an autoscrolling element. Translate-based animation only (GPU-cheap); avoid if items are long enough to read, since fast-moving long text is an accessibility and motion-sickness hazard.

## Reference implementation
```html
<!-- framework-neutral; uses var(--token) names from /tokens, no magic numbers -->
<div class="ticker" role="marquee" aria-label="Latest news">
  <!-- track holds the list TWICE so the loop is seamless; 2nd copy is decorative -->
  <ul class="ticker__track">
    <li class="ticker__item">RLTY Co. raises $20M Series&nbsp;A</li>
    <li class="ticker__sep" aria-hidden="true">•</li>
    <li class="ticker__item">New website featured by Landbook</li>
    <li class="ticker__sep" aria-hidden="true">•</li>
  </ul>
  <ul class="ticker__track" aria-hidden="true">
    <li class="ticker__item">RLTY Co. raises $20M Series&nbsp;A</li>
    <li class="ticker__sep">•</li>
    <li class="ticker__item">New website featured by Landbook</li>
    <li class="ticker__sep">•</li>
  </ul>
</div>

<style>
  .ticker {
    display: flex;
    overflow: hidden;               /* clip the off-strip items */
    width: 100%;
    padding-block: var(--space-2);
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
    white-space: nowrap;
  }
  .ticker__track {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    margin: 0;
    padding-inline: var(--space-4) 0;
    list-style: none;
    flex: 0 0 auto;                 /* each copy keeps natural width */
    animation: ticker-scroll var(--duration-slow) linear infinite;
    /* duration is illustrative; a real strip uses a longer custom loop time */
  }
  .ticker__item {
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    color: var(--color-muted);      /* ambient, not shouting */
  }
  .ticker__sep { color: var(--color-subtle); }

  @keyframes ticker-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-100%); }  /* one full copy-width */
  }

  /* let people actually read an item */
  .ticker:hover .ticker__track,
  .ticker:focus-within .ticker__track { animation-play-state: paused; }

  /* never auto-scroll for motion-sensitive users */
  @media (prefers-reduced-motion: reduce) {
    .ticker__track { animation: none; }
    .ticker { overflow-x: auto; }   /* fall back to manual scroll */
  }
</style>
```
