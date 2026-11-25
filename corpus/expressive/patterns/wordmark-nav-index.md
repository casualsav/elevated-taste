---
pattern: wordmark-nav-index
from: basement
corpus: expressive
safety: production-safe
tags: [footer, navigation, branding, agency]
---

## What it is
A footer (or full-screen menu) where an oversized brand wordmark is the spatial anchor and a stacked navigation list sits beside or beneath it, with each nav item carrying a small superscript count badge — `Showcase (25)`, `Blog (28)` — that previews how much lives behind the link. Basement renders "BSMNT" at display scale (one heavy grotesque cut, off-white on black), drops a hairline under it, then a large-type vertical menu (Home / Services / Showcase⁽²⁵⁾ / People / Blog⁽²⁸⁾ / Contact Us), social links, and a copyright line. The footer doubles as the sitemap and the page's sign-off in one block.

## Why it works
Two mechanisms. First, the giant wordmark turns the footer into a *deliberate ending* rather than a forgotten strip — value-reversed display type is the strongest closing anchor a page has, and reusing the brand mark large bookends the experience. Second, the count badges convert navigation into information scent: a number next to "Showcase" tells the visitor there are 25 projects before they click, which raises click intent and sets expectations (the same trick as an inbox unread count). Setting the nav itself at large type — not the usual 13px footer links — signals these are primary destinations, not legal boilerplate, and the single hairline + monochrome palette keep it from competing with the wordmark. Transferable to any site's footer or hamburger overlay, especially content-rich ones (docs, blogs, portfolios) where the counts are meaningful.

## Reference implementation

```html
<footer class="fmark" role="contentinfo">
  <a class="fmark__wordmark" href="/" aria-label="Basement home">BSMNT</a>
  <hr class="fmark__rule" />

  <nav class="fmark__nav" aria-label="Footer">
    <a href="/">Home</a>
    <a href="/services">Services</a>
    <a href="/showcase">Showcase<sup>(25)</sup></a>
    <a href="/people">People</a>
    <a href="/blog">Blog<sup>(28)</sup></a>
    <a href="/contact">Contact Us</a>
  </nav>

  <div class="fmark__foot">
    <p class="fmark__social">
      <a href="#">X (Twitter)</a> ,
      <a href="#">Instagram</a> ,
      <a href="#">GitHub</a> ,
      <a href="#">LinkedIn</a>
    </p>
    <p class="fmark__copy">© basement.studio LLC 2026 all rights reserved</p>
  </div>
</footer>

<style>
  .fmark {
    background: var(--color-bg);
    color: var(--color-fg);
    padding: var(--space-7) var(--space-5) var(--space-5);
  }

  .fmark__wordmark {
    display: block;
    font-family: var(--font-sans);
    font-weight: var(--weight-bold);
    font-size: clamp(var(--text-5xl), 18vw, 12rem); /* fluid display anchor */
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    color: var(--color-fg-strong, #fff);
    text-decoration: none;
    text-transform: uppercase;
  }

  .fmark__rule {
    border: 0;
    border-top: 1px solid var(--color-border);
    margin: var(--space-4) 0 var(--space-6);
  }

  .fmark__nav {
    display: grid;
    gap: var(--space-2);
  }
  .fmark__nav a {
    font-family: var(--font-sans);
    font-size: var(--text-3xl);          /* primary destinations, not 13px boilerplate */
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-tight);
    color: var(--color-fg-strong, #fff);
    text-decoration: none;
    width: max-content;
    transition: color var(--duration-fast) linear;
  }
  .fmark__nav a:hover { color: var(--color-accent); }

  .fmark__nav sup {                       /* the count badge */
    font-size: var(--text-sm);
    font-weight: var(--weight-regular);
    color: var(--color-muted);
    vertical-align: super;
    margin-left: var(--space-1);
  }

  .fmark__foot {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: var(--space-3);
    margin-top: var(--space-7);
  }
  .fmark__social a { color: var(--color-fg); text-decoration: none; }
  .fmark__social a:hover { color: var(--color-accent); }
  .fmark__copy { color: var(--color-muted); font-size: var(--text-sm); margin: 0; }

  @media (max-width: 48rem) {
    .fmark__foot { flex-direction: column; }
  }
</style>
```
