---
pattern: glyph-encoded-footer
from: locomotive
corpus: expressive
safety: spectacle-only
tags: [footer, brand-experience, agency]
---

## What it is

A footer where the studio's address and contact details are composed as a **typographic illustration** — real text interleaved with custom dingbat glyphs (arrows, framed digits, a clover, a clock, brackets) so the line "1211 Jean-Talon Est, Montréal, Canada H2R 1W1 · info@locomotive.ca" reads as a designed object rather than a list. Above it sits a conventional, fully-semantic 3-column link matrix (Menu / Social / External); the glyph composition is the *finale*, not the navigation.

## Why it works

The footer is normally a dead zone; encoding the mundane (a postal code, a phone number) as a glyph collage turns it into a brand signature and rewards the user who scrolls all the way down — a "second-read" moment. The transferable principle is **treat the footer as a designed artefact, not a sitemap dump**: give it a distinct typographic voice that the rest of the page doesn't use. The danger is that decorative glyphs standing in for real characters break screen readers, copy-paste, search, and contrast — so the safe construction keeps machine-readable, selectable text as the source of truth and layers the ornament as `aria-hidden` decoration on top. Never let a clover *be* the comma.

## Reference implementation

```html
<style>
  .footer {
    background: var(--color-bg);
    color: var(--color-fg);
    font-family: var(--font-serif);
    padding-block: var(--space-9) var(--space-7);
    padding-inline: var(--space-6);
  }
  /* semantic link matrix — plain, accessible, in DOM order */
  .footer__cols {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6);
    margin-block-end: var(--space-9);
  }
  .footer__col h2 {
    font-size: var(--text-sm);
    font-weight: var(--weight-regular);
    border-bottom: 1px solid var(--color-hairline);
    padding-block-end: var(--space-2);
    margin-block-end: var(--space-3);
  }
  .footer__col a {
    display: block;
    color: var(--color-fg);
    text-decoration: none;
    font-size: var(--text-base);
    padding-block: var(--space-1);
  }
  .footer__col a:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }

  /* the glyph composition — large serif, real text is the source of truth */
  .footer__address {
    font-size: var(--text-4xl);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-tight);
    max-width: 60ch;
  }
  /* decorative dingbats: aria-hidden, never carry meaning */
  .footer__glyph {
    font-family: var(--font-mono);   /* the dingbat/symbol face */
    color: var(--color-accent);
    padding-inline: var(--space-1);
    user-select: none;               /* keeps copy-paste clean */
  }

  @media (max-width: 48rem) {
    .footer__cols { grid-template-columns: 1fr 1fr; }
    .footer__address { font-size: var(--text-2xl); }
  }
</style>

<footer class="footer">
  <div class="footer__cols">
    <nav class="footer__col" aria-label="Menu">
      <h2>Menu</h2>
      <a href="/work">Work</a>
      <a href="/agency">Agency</a>
      <a href="/careers">Careers</a>
    </nav>
    <nav class="footer__col" aria-label="Social">
      <h2>Social</h2>
      <a href="https://instagram.com/…">Instagram</a>
      <a href="https://linkedin.com/…">LinkedIn</a>
    </nav>
    <nav class="footer__col" aria-label="External">
      <h2>External</h2>
      <a href="/store">Store</a>
      <a href="/scroll">Locomotive Scroll</a>
    </nav>
  </div>

  <!-- Real, selectable address; glyphs are aria-hidden ornament between the real words -->
  <address class="footer__address">
    <span aria-hidden="true" class="footer__glyph">&#x2329;&#x232A;</span>1211<span aria-hidden="true" class="footer__glyph">&#x21B3;</span>Jean-Talon Est,
    Montréal, Canada H2R 1W1.
    <a href="mailto:info@locomotive.ca">info@locomotive.ca</a>
  </address>
</footer>
```
