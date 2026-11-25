---
pattern: image-first-hero-under-transparent-header
from: therow
corpus: expressive
safety: production-safe
trigger: in-view
tags: [hero, navigation, ecommerce, brand-experience, motion]
---

## What it is

A full-bleed hero image sized by `aspect-ratio` (not `100vh`), pulled up underneath a sticky, transparent header by a negative margin exactly equal to the header height — so the chrome floats *on* the photograph. As the hero leaves the viewport, the header's background fades in and it becomes an ordinary opaque surface.

The whole thing is driven by two **boolean custom properties used as `calc()` multipliers**, not by a class matrix: `--hero-overlay` (0 or 1) decides layout, `--header-solid` (0 → 1) decides paint. One rule expresses both states.

## Why it works

- **Splitting layout from paint is the load-bearing decision.** The negative margin is computed once from a static flag and never changes. Only the numeric paint flag animates. If you instead toggle the header's `position` or margin at the scroll threshold, the page reflows and jumps under the user's finger — the classic sticky-header bug. Here the flip touches only `background-color` and a border alpha.
- **`aspect-ratio` beats viewport units.** A ratio-sized hero doesn't resize when mobile browser chrome collapses (the `100vh` jitter), and it reserves exact space before the image decodes, so the LCP element lands with zero layout shift. Swapping the *ratio* per breakpoint re-frames the composition for portrait instead of merely cropping one landscape file.
- **A 0/1 variable is a state machine you can do arithmetic on.** `calc(var(--flag) * -1 * var(--header-height))` collapses "overlay" and "normal" into one declaration. Keep an RGB *triplet* token beside every color (`255 255 255`) so alpha can be computed from the same flag — that is exactly why production themes carry `--color-bg-rgb` next to `--color-bg`.
- **The scroll-driven CSS version needs no JavaScript.** Registering the flag with `@property` makes a plain number animatable and transitionable; a `view()` timeline on the hero then drives it directly on the compositor. The IntersectionObserver path is a fallback, not the mechanism.

**Two costs you must price in.** (1) Dark ink on an unknown photograph is a contrast gamble — the source site only gets away with it because art direction guarantees a pale image. Either enforce that contract or set `--hero-scrim`. (2) A full-bleed image link needs an accessible name; `alt=""` under an empty `<a>` leaves your primary action unlabeled to a screen reader.

## Reference implementation

```html
<body class="page-hero">
  <header class="site-header">
    <nav class="site-nav" aria-label="Primary">
      <a class="site-nav__link" href="/women">Women</a>
      <a class="site-nav__link" href="/men">Men</a>
    </nav>
    <a class="site-wordmark" href="/">The Studio</a>
    <a class="site-nav__link" href="/bag">Bag (0)</a>
  </header>

  <main>
    <section class="hero">
      <picture>
        <source media="(max-width: 63.99rem)" srcset="/hero-portrait.avif" width="1080" height="1920">
        <source media="(min-width: 64rem)"    srcset="/hero-landscape.avif" width="1920" height="1080">
        <img class="hero__img" src="/hero-landscape.jpg" alt=""
             width="1920" height="1080" loading="eager" fetchpriority="high" decoding="async">
      </picture>
      <!-- The image is decorative (alt=""); the LINK carries the accessible name. -->
      <a class="hero__link" href="/collections/new">
        <span class="u-visually-hidden">Shop the new collection</span>
      </a>
    </section>
  </main>
</body>
```

```css
/* Registering the flag as a <number> is what makes it animatable + transitionable. */
@property --header-solid {
  syntax: "<number>";
  inherits: true;
  initial-value: 1;
}

:root {
  --header-height: 60px;
  --header-bg-rgb: 255 255 255;   /* triplet, so alpha can be computed from the flag */
  --header-rule-rgb: 221 221 221;
  --hero-aspect: 9 / 16;          /* portrait first */
  --hero-scrim: transparent;      /* set a gradient here if the imagery is unknown */
  --hero-overlay: 0;              /* LAYOUT flag: 1 = hero sits under the header */
}

@media (min-width: 64rem) {
  :root { --hero-aspect: 16 / 9; }
}

/* Pages that open on a hero opt in. Layout flag and paint flag are separate. */
.page-hero {
  --hero-overlay: 1;
  --header-solid: 0;
  timeline-scope: --hero;
}

.site-header {
  position: sticky;
  inset-block-start: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-5);
  block-size: var(--header-height, 60px);
  padding-inline: var(--space-5);
  color: var(--color-fg);
  background: rgb(var(--header-bg-rgb, 255 255 255) / var(--header-solid, 1));
  border-block-end: 1px solid
    rgb(var(--header-rule-rgb, 221 221 221) / var(--header-solid, 1));
  /* Paint only. Never transition the margin. */
  transition: --header-solid var(--duration-slow) var(--ease-standard);
}

.site-wordmark {
  font-size: var(--text-sm);
  letter-spacing: var(--tracking-caps);
  text-transform: uppercase;
  text-decoration: none;
  color: inherit;
}

.hero {
  position: relative;
  aspect-ratio: var(--hero-aspect, 16 / 9);
  view-timeline: --hero block;
  /* The one calc that does the work: 0 → normal flow, 1 → tucked under the header. */
  margin-block-start: calc(var(--hero-overlay, 0) * -1 * var(--header-height, 60px));
}

.hero__img {
  display: block;
  inline-size: 100%;
  block-size: 100%;
  object-fit: cover;
}

/* Contrast insurance for overlay chrome. Transparent by default. */
.hero::after {
  content: "";
  position: absolute;
  inset-block-start: 0;
  inset-inline: 0;
  block-size: calc(var(--header-height, 60px) * 2);
  background: var(--hero-scrim, transparent);
  pointer-events: none;
}

.hero__link { position: absolute; inset: 0; }
.hero__link:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: -4px;
}

.u-visually-hidden {
  position: absolute;
  inline-size: 1px; block-size: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

/* Preferred path: no JS. The hero's own view timeline drives the flag.
   `exit 0% → exit 10%` mirrors an IO rootMargin of "0px 0px -90% 0px". */
@supports (animation-timeline: view()) {
  .page-hero .site-header {
    animation: header-settle linear both;
    animation-timeline: --hero;
    animation-range: exit 0% exit 10%;
  }
  @keyframes header-settle {
    from { --header-solid: 0; }
    to   { --header-solid: 1; }
  }
}

/* Reduced motion: no crossfade, no overlay. The header is simply an opaque
   surface and the hero starts below it — which also retires the contrast risk. */
@media (prefers-reduced-motion: reduce) {
  .site-header { transition: none; }
  .page-hero { --header-solid: 1; --hero-overlay: 0; }

  @supports (animation-timeline: view()) {
    .page-hero .site-header { animation: none; }
  }
}
```

```js
// Fallback only — browsers without scroll-driven CSS animations.
// Mirrors the @supports block above; sets the flag on the same element that owns it.
if (!CSS.supports('animation-timeline', 'view()')) {
  const page = document.querySelector('.page-hero');
  const hero = page?.querySelector('.hero');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  if (hero && !reduce.matches) {
    new IntersectionObserver(
      ([entry]) => page.style.setProperty('--header-solid', entry.isIntersecting ? '0' : '1'),
      { rootMargin: '0px 0px -90% 0px', threshold: 0 }
    ).observe(hero);
  }
}
```

**Tokens.** House: `--space-5`, `--color-fg`, `--color-focus`, `--text-sm`, `--tracking-caps`, `--duration-slow`, `--ease-standard`. Pattern-local (defined above, with inline fallbacks): `--header-height`, `--header-bg-rgb`, `--header-rule-rgb`, `--hero-aspect`, `--hero-scrim`, `--hero-overlay`, `--header-solid`.
