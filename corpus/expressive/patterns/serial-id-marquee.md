---
pattern: serial-id-marquee
from: machine-consciousness
corpus: expressive
safety: spectacle-only
trigger: load
tags: [motion, marquee, branding, hero, footer]
---

## What it is
A coined **identifier** — an edition or serial number (`MC0001`), SKU, version, or call sign — set large and scrolled horizontally in an infinite loop, with a repeating glyph separator (`✳`, `//`, `—`, `●`) between repeats. It substitutes a *numbered-edition* signal for a conventional logo or tagline, giving an event/drop/release an institutional, ticker-like identity at near-zero asset cost.

## Why it works
A repeated identifier reads as a system, not a slogan — like a catalogue number or a stock ticker, it implies there's an 0002 coming. The horizontal motion turns one short string into a continuous brand texture that fills a band without imagery. Because the loop is a single `translateX` on a duplicated track, it animates only `transform` (compositor-only, no reflow) and stays cheap even at large type.

## Reference implementation
```html
<div class="marquee" aria-hidden="true">
  <div class="marquee__track">
    <!-- duplicate the run once so the loop is seamless -->
    <span class="marquee__run">
      <span>MC0001</span><i class="marquee__sep">✳</i>
      <span>MC0001</span><i class="marquee__sep">✳</i>
      <span>MC0001</span><i class="marquee__sep">✳</i>
    </span>
    <span class="marquee__run">
      <span>MC0001</span><i class="marquee__sep">✳</i>
      <span>MC0001</span><i class="marquee__sep">✳</i>
      <span>MC0001</span><i class="marquee__sep">✳</i>
    </span>
  </div>
</div>

<style>
  .marquee {
    overflow: hidden;
    background: var(--inverse-bg, #1e1e1e);
    color: var(--inverse-fg, #f0f1f1);
    padding-block: var(--space-24, 24px);
    font-family: var(--font, "Questrial", sans-serif);
  }
  .marquee__track {
    display: flex;
    width: max-content;
    /* token-driven duration; one full run-width per cycle */
    animation: serial-scroll var(--dur-marquee, 28s) linear infinite;
  }
  .marquee__run {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    gap: var(--space-32, 32px);
    padding-right: var(--space-32, 32px);
    font-size: clamp(2.5rem, 8vw, 6rem);   /* display scale */
    letter-spacing: var(--track-display, -5px);
    font-weight: 400;
    white-space: nowrap;
  }
  .marquee__sep {
    font-style: normal;
    color: var(--muted, #999);
    font-size: 0.5em;
  }
  @keyframes serial-scroll {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); } /* exactly one duplicated run */
  }
  /* MANDATORY: the live site omitted this — never ship without it */
  @media (prefers-reduced-motion: reduce) {
    .marquee__track { animation: none; }
    .marquee { overflow-x: auto; }  /* let users read it by scrolling instead */
  }
</style>
```

Notes: duplicate the run **exactly once** and translate to `-50%` so the loop is seamless. Keep it `aria-hidden` (it's decorative repetition) and ensure the identifier appears once in real, readable text elsewhere (e.g. the footer wordmark) for assistive tech. The reduced-motion fallback is **required** — pause the loop and let the band scroll manually. Stay monochrome and one-typeface to keep it reading as a serial mark rather than a banner. Same recipe drives the venue-image strip; for image marquees prefer `mask-image` edge fades over hard cut-offs.
