---
pattern: hairline-banded-sections
from: fillout
corpus: production
safety: production-safe
tags: [feature-section, layout, landing, product-marketing]
---

## What it is
A long marketing page paced entirely by **full-bleed tonal bands** that alternate between two very close neutrals (white and a barely-off-white) and are separated by nothing but a **single 1px hairline `border-top`**. Each band carries a centered *icon-kicker → display heading → one muted sub-line* unit, then its content (usually a card grid). There are no illustrated dividers, no big gradients between sections, no shadows on the seams — just the tonal flip and the hairline.

## Why it works
Section separation is a *contrast problem*, and this solves it with the smallest possible contrast: a ~2% lightness step plus a hairline reads as "new section" without adding visual weight, so a page with six dense sections still feels calm and continuous. Because every band shares one header signature (kicker + display heading + sub-line), the sections feel like one system rather than six pasted blocks. The alternation also gives free macro-rhythm — the eye tracks the light/less-light beat down the page. Transfers to any content-heavy landing or docs marketing page where you want structure without decoration. The rules that keep it clean: keep the two grounds *within a few percent* of each other (a big jump turns quiet into stripes), seam with a true hairline token (not a shadow), and never let a band's inner cards touch the seam.

## Reference implementation
```html
<!-- framework-neutral; alternate .band / .band--alt down the page -->
<section class="band">
  <header class="band__head">
    <p class="kicker"><span aria-hidden="true">✦</span> Features</p>
    <h2 class="band__title">It all starts with a form</h2>
    <p class="band__sub">Build the exact form you need, in minutes.</p>
  </header>
  <div class="band__grid">
    <!-- feature cards; each is a title + one muted line + a product-UI slice -->
    <article class="card">…</article>
    <article class="card">…</article>
  </div>
</section>

<section class="band band--alt"> … </section>
```
```css
.band {
  border-top: 1px solid var(--color-hairline, #ebebeb); /* the only seam */
  background: var(--color-bg, #fff);
  padding-block: var(--space-10, 96px);
}
.band--alt { background: var(--color-surface, #fbfbfb); } /* ~2% off-white, not a stripe */

.band__head {
  max-width: var(--container-md, 625px);
  margin-inline: auto;
  padding-inline: var(--space-4, 16px);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--space-3, 12px);
}
.kicker {
  display: inline-flex; gap: var(--space-2, 8px); justify-content: center;
  font-size: var(--text-sm, .875rem);
  color: var(--color-muted, #737373);
}
.band__title {
  font-family: var(--font-display, "blMelody"), var(--font-sans, Inter, system-ui, sans-serif);
  font-size: var(--text-4xl, 2.5rem);
  font-weight: var(--weight-semibold, 600);
  line-height: var(--leading-tight, 1.1);
  letter-spacing: var(--tracking-tight, -0.02em);
  color: var(--color-fg, #171717);
  margin: 0;
}
.band__sub { color: var(--color-muted, #737373); margin: 0; }

.band__grid {
  max-width: var(--container-content, 1240px);
  margin: var(--space-8, 48px) auto 0;
  padding-inline: var(--space-4, 16px);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-5, 20px);
}
@media (max-width: 767px) { .band__grid { grid-template-columns: 1fr; } }
```
