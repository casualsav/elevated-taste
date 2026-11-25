---
pattern: pinned-scrub-list-focus
from: societies
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [motion, scroll, feature-section, editorial, list]
---

## What it is
A section pins to the viewport (`position: sticky`) while the page keeps scrolling, and scroll progress through that pinned span advances a single **active row** in a stacked, chrome-less list: the active item is at full ink, every other item is dimmed to one muted grey. No tabs, no pill, no accent fill — just which word is dark. Optionally the active index also swaps a paired visual (Artificial Societies uses it twice: a centered serif methodology word-list, and a left-rail Solutions menu paired with a framed artwork that crossfades per active row).

## Why it works
It turns the scrollbar into a dial. Mapping scroll offset to an active index means the reader *operates* the list at their own pace instead of watching an autoplay, and because emphasis is pure opacity/color on text that's already in the DOM, the resting (and reduced-motion / no-JS) state is a fully readable list — nothing is hidden behind the animation. Dimming the inactive rows gives the information scent of tabs with zero chrome, so the section stays calm and editorial. It animates only `color`/`opacity` (GPU-cheap, no reflow); the one real cost is the sticky stage + a scroll handler, so keep it to a couple of stages per page.

## Reference implementation
```html
<style>
  /* The pinned stage: holds the viewport while its scroll-span passes */
  .scrub-stage {
    position: sticky;
    top: var(--nav-height, 62px);
    min-height: calc(100svh - var(--nav-height, 62px));
    display: grid; place-items: center;
  }
  /* Give the stage a scroll-span taller than itself so there is travel to scrub */
  .scrub-track { height: 260vh; }        /* span ≈ (rows + 1) × viewport-ish */

  .scrub-list { display: grid; gap: var(--space-4, 8px);
    font-family: var(--font-serif, Georgia, serif);
    font-size: var(--text-4xl, 3rem); line-height: var(--leading-tight, 1.1);
    text-align: center; }
  .scrub-list li {
    color: var(--color-muted, #8c8880);           /* dimmed resting state */
    transition: color var(--duration-base, 200ms) var(--ease-standard, cubic-bezier(.2,0,0,1));
  }
  .scrub-list li[aria-current="true"] { color: var(--color-fg, #1c1a16); }  /* active row */

  @media (prefers-reduced-motion: reduce) { .scrub-list li { transition: none; } }
</style>

<div class="scrub-track">
  <section class="scrub-stage" aria-label="Our methodology">
    <ul class="scrub-list" id="scrub">
      <li>Mix-method surveys</li>
      <li>Interactive focus groups</li>
      <li aria-current="true">Follow-up interviews</li>
      <li>Multiverse experiments</li>
      <li>Conjoint analysis</li>
      <li>Scenario cascade</li>
    </ul>
  </section>
</div>

<script>
  // Map scroll progress through the track to an active index. Cheap: read in rAF,
  // only write when the index actually changes. CSS does the visual transition.
  const track = document.querySelector('.scrub-track');
  const rows  = [...document.querySelectorAll('#scrub li')];
  const prm   = matchMedia('(prefers-reduced-motion: reduce)');
  let active = -1, ticking = false;

  function update() {
    ticking = false;
    const r = track.getBoundingClientRect();
    const span = r.height - innerHeight;              // scrollable travel
    const p = Math.min(1, Math.max(0, -r.top / span)); // 0→1 progress
    const i = Math.min(rows.length - 1, Math.floor(p * rows.length));
    if (i === active) return;
    active = i;
    rows.forEach((li, n) => li.setAttribute('aria-current', n === i ? 'true' : 'false'));
    // Hook a paired-visual swap here, e.g. crossfade img[data-index="i"].
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  if (!prm.matches) addEventListener('scroll', onScroll, { passive: true });
  update(); // honest first paint (also the reduced-motion / no-JS end state)
</script>
```
