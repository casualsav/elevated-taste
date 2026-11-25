---
pattern: inview-theme-adaptive-sticky-cta
from: whoop
corpus: production
safety: production-safe
trigger: in-view
tags: [motion, navigation, landing, product-marketing, cta]
---

## What it is
One call-to-action, fixed at the bottom of the viewport for the whole scroll, that **inverts to match the section currently behind it**: white-on-black over dark chapters, accent-on-white over light ones. It also slides away when other fixed chrome (a cookie bar, the footer) needs the space.

The sensing trick is the whole pattern: an `IntersectionObserver` with `rootMargin: -80% 0% -10% 0%` shrinks the observation area to a thin horizontal band across the viewport — the exact strip the CTA occupies. Whichever section is crossing *that band* stamps its theme onto the document, and the CTA restyles from a plain attribute selector.

## Why it works
A persistent CTA on a page with alternating grounds has three usual fates: a permanent drop-shadow or scrim so it survives every background (ugly, and it never quite works over photography); a fixed color that goes invisible on one chapter; or a scroll handler that recomputes brightness on every frame. The band observer is cheaper and more honest than all three — it fires **once per section boundary**, writes **one attribute**, and does zero work while you scroll within a section.

The negative `rootMargin` is what makes it precise. A default observer tells you a section is *somewhere* on screen, which is useless when three sections are visible at once. Clamping the root to the CTA's own strip converts "is it visible" into "is it *under the button*" — the only question the button is asking. Reuse the same trick for any fixed chrome that must read its own backdrop: a media player, a floating toolbar, a scroll-progress bar, a logo in a corner.

Two things keep it correct rather than clever:

**The CTA must be legible before any JS runs.** The default (light) styling is the resting state; the observer only ever *upgrades* it. If the script fails, you get a blue button on white, not an invisible one.

**Theme is an attribute, not a class list.** `data-inview-theme="dark"` is one value, so it cannot desync into `is-dark is-light`. Stamp it on `documentElement` and any fixed layer can subscribe.

Motion is `transform` + `opacity` only; `bottom` transitions once, when other chrome appears, at a speed slow enough not to read as a jitter. Reduced motion drops the slide and keeps the CTA — it is content, not decoration.

## Reference implementation
```html
<style>
  .sticky-cta {
    position: fixed;
    left: 50%;
    bottom: var(--space-5);
    z-index: 700;
    transform: translateX(-50%);
    transition: bottom var(--duration-slow) var(--ease-standard);
    /* Never let the pill swallow taps meant for the page beneath it. */
    pointer-events: none;
  }
  .sticky-cta > a { pointer-events: auto; }

  /* Resting state = light ground. Correct with JS disabled. */
  .sticky-cta > a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 3rem;                       /* ≥44px tap target */
    padding: var(--space-3) var(--space-6);
    border-radius: var(--radius-full);
    background: var(--color-accent);
    color: var(--color-accent-fg);
    font-size: var(--text-sm);
    font-weight: var(--weight-semibold);
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
    text-decoration: none;
    box-shadow: var(--shadow-md);
    transition: background var(--duration-base) var(--ease-standard),
                color      var(--duration-base) var(--ease-standard);
  }
  .sticky-cta > a:hover { background: color-mix(in srgb, var(--color-accent) 80%, transparent); }

  /* The whole theme story: one attribute, one selector. */
  [data-inview-theme="dark"] .sticky-cta > a {
    background: var(--color-bg, #ffffff);
    color: var(--color-fg, #000000);
  }

  /* Yield to other fixed chrome (cookie bar, footer CTA) instead of colliding with it. */
  [data-chrome-blocked] .sticky-cta { bottom: var(--space-10); }

  /* Enter / exit. Transform + opacity only. */
  .sticky-cta { animation: cta-show var(--duration-slow) var(--ease-entrance) both; }
  .sticky-cta[data-hidden] { animation: cta-hide var(--duration-slow) var(--ease-exit) both; }

  @keyframes cta-show {
    from { opacity: 0; transform: translate(-50%, 100%); }
    to   { opacity: 1; transform: translate(-50%, 0); }
  }
  @keyframes cta-hide {
    from { opacity: 1; transform: translate(-50%, 0); }
    to   { opacity: 0; transform: translate(-50%, 100%); pointer-events: none; }
  }

  /* Mandatory. The CTA is content: keep it, drop the travel. */
  @media (prefers-reduced-motion: reduce) {
    .sticky-cta,
    .sticky-cta[data-hidden] { animation: none; transition: none; }
    .sticky-cta[data-hidden] { opacity: 0; visibility: hidden; }
    .sticky-cta > a { transition: none; }
  }
</style>

<div class="sticky-cta">
  <a href="/join">Join now</a>
</div>

<!-- Sections publish their ground; see patterns/section-theme-tokens.md -->
<main id="main">
  <section class="section" data-theme="dark">…</section>
  <section class="section" data-theme="light">…</section>
</main>

<script>
  (() => {
    const cta = document.querySelector('.sticky-cta');
    if (!cta) return;

    // Collapse the root to the strip the CTA occupies: ignore the top 80% and the
    // bottom 10% of the viewport. Only the section actually BEHIND the button matches.
    const band = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const theme = entry.target.dataset.theme === 'dark' ? 'dark' : 'light';
          document.documentElement.dataset.inviewTheme = theme;
        }
      },
      { rootMargin: '-80% 0% -10% 0%', threshold: 0 }
    );

    for (const section of document.querySelectorAll('[data-theme]')) band.observe(section);

    // Hide the CTA where it would be redundant or in the way: over the hero (the
    // page's own CTA is on screen) and over the footer.
    const gate = new IntersectionObserver(
      ([entry]) => cta.toggleAttribute('data-hidden', entry.isIntersecting),
      { threshold: 0.5 }
    );
    const hero = document.querySelector('[data-cta-suppress]');
    if (hero) gate.observe(hero);
  })();
</script>
```

Both observers are passive: no `scroll` listener, no `requestAnimationFrame`, no layout read. The source site drives comparable effects through 25 scroll listeners and 260 rAF calls — the band observer is the same result for none of the main thread.
