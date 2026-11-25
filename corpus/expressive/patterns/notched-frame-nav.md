---
pattern: notched-frame-nav
from: urbit
corpus: expressive
safety: production-safe
tags: [navigation, chrome, layout, footer, brand-experience]
---

## What it is
The page sits inside a rounded inset **border**, and the fixed nav bars (top utility/nav, bottom wordmark/footer) are built *into* that border rather than stacked on top of the content. Where a bar meets the frame, the corner curves **inward** (an inverse / "notch" radius) so the bar and the rim read as one continuous shell — a device bezel or an OS window you're looking *into*. On Urbit the top bar carries the primary nav + a "Get Urbit" pill and the bottom bar carries the wordmark, mono footer links, and an email field; both float against a paper ground framed by a single hairline.

## Why it works
Most site chrome announces itself as a band bolted to the top of a document. Folding the bars into a continuous rounded frame reframes the surface as a *contained object* — which is exactly the right metaphor for a "personal computer / OS" brand, and it makes the chrome feel intentional rather than appended. The inverse-corner notch is the whole trick: it removes the visual seam between the floating bar and the frame so they read as one rim. Because it's pure positioning + radius (no shadow, no image), it's cheap and crisp at any DPI, and the framed inset gives content a calm, measured margin without a hero gradient.

## Reference implementation
```html
<div class="shell">
  <header class="bar bar--top">
    <a class="bar__brand" href="/">urbit</a>
    <nav class="bar__nav">
      <a href="#">Overview</a><a href="#">Ecosystem</a><a href="#">Blog</a>
    </nav>
    <a class="bar__cta" href="#">Get Urbit</a>
  </header>

  <main class="shell__content"><!-- page content scrolls here --></main>

  <footer class="bar bar--bottom">
    <a class="bar__brand" href="/">urbit</a>
    <nav class="bar__nav">
      <a href="#">Docs</a><a href="#">Bridge</a><a href="#">Whitepaper</a>
    </nav>
    <input class="bar__input" placeholder="Get email updates" />
  </footer>
</div>

<style>
  :root {
    --frame-inset: var(--space-3, 12px);
    --frame-radius: var(--radius-lg, 16px);
    --bar-h: 56px;
  }

  /* the rounded inset frame that wraps everything */
  .shell {
    position: fixed; inset: 0;
    margin: var(--frame-inset);
    border: 1px solid var(--border-hairline, #e5e7eb);
    border-radius: var(--frame-radius);
    background: var(--bg, #ffffff);
    overflow: hidden;
  }
  .shell__content { position: absolute; inset: var(--bar-h) 0; overflow-y: auto; padding: var(--space-6, 24px); }

  /* bars pinned to the frame's top/bottom edge, sharing its rounding */
  .bar {
    position: absolute; left: 0; right: 0; height: var(--bar-h);
    display: flex; align-items: center; gap: var(--space-4, 16px);
    padding-inline: var(--space-6, 24px);
    background: var(--bg, #ffffff);
    font-family: var(--font-label, "Space Mono", monospace);
    font-size: var(--text-sm, 0.875rem);
  }
  .bar--top    { top: 0;    border-bottom: 1px solid var(--border-hairline, #e5e7eb); border-radius: var(--frame-radius) var(--frame-radius) 0 0; }
  .bar--bottom { bottom: 0; border-top:    1px solid var(--border-hairline, #e5e7eb); border-radius: 0 0 var(--frame-radius) var(--frame-radius); }

  .bar__nav { display: flex; gap: var(--space-4, 16px); margin-inline-start: auto; }
  .bar__nav a, .bar__brand { color: var(--fg, #3f3f3f); text-decoration: none; }
  .bar__cta {
    padding: var(--space-2, 8px) var(--space-3, 12px);
    border-radius: var(--radius, 6px);
    background: var(--accent, #5e604c); color: var(--on-accent, #fff); text-decoration: none;
  }

  /* the inverse "notch": a pseudo-element bridges bar→frame with an inward
     curve, so the seam between floating bar and rim disappears. Tune the
     radius to --frame-radius; uses a radial mask so it works on any bg. */
  .bar--top::after, .bar--bottom::after {
    content: ""; position: absolute; right: calc(-1 * var(--frame-radius)); width: var(--frame-radius); height: var(--frame-radius);
    background: var(--bg, #fff);
    -webkit-mask: radial-gradient(var(--frame-radius) at 100% var(--mask-y), transparent 98%, #000 100%);
            mask: radial-gradient(var(--frame-radius) at 100% var(--mask-y), transparent 98%, #000 100%);
  }
  .bar--top::after    { top: 0;    --mask-y: 0%; }
  .bar--bottom::after { bottom: 0; --mask-y: 100%; }

  /* on short / mobile viewports two fixed bars steal scroll height —
     keep the top bar fixed, let the footer scroll with content */
  @media (max-width: 40rem) {
    .bar--bottom { position: static; }
    .shell__content { inset: var(--bar-h) 0 0; }
    .bar__nav { font-size: var(--text-xs, 0.75rem); }
  }
</style>
```
