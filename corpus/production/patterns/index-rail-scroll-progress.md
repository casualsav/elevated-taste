---
pattern: index-rail-scroll-progress
from: stripepress
corpus: production
safety: production-safe
trigger: scroll-progress
tags: [navigation, motion, long-scroll]
---

## What it is
A slim, fixed column of tick marks pinned to the left edge that doubles as **scroll-progress meter** and **table-of-contents** for a very tall single-page scroll. Each tick maps to a section/item; the active one highlights as you pass it, and section-type glyphs (e.g. a film and a podcast icon on Stripe Press) flag the non-uniform sections. It never occupies content space and never animates loudly — it's the quiet map that keeps a 6000px page legible.

## Why it works
A long object-per-viewport scroll hides *where you are* — the index rail restores orientation without a heavy sticky header. Because it's `position: fixed` and animates only `opacity`/`transform` on the active tick, it costs nothing on the main thread. It reads as a control because it's clickable (jump to section) and as feedback because the active mark tracks scroll — one element serving navigation and progress at once. Transfers to docs, lookbooks, long-form editorial, any single-page narrative.

## Reference implementation
```html
<!-- framework-neutral; tokens from /tokens/stripepress.json -->
<style>
  :root { --fg-muted: #E2CAB0; --accent: #FFD943; --dur: 300ms; --ease: ease-out; }

  .index-rail {
    position: fixed;
    left: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 6px;
    z-index: 20;
  }
  .index-rail a {
    width: 14px;
    height: 2px;
    background: var(--fg-muted);
    opacity: 0.35;
    transition: opacity var(--dur) var(--ease), width var(--dur) var(--ease);
  }
  .index-rail a[aria-current="true"] { opacity: 1; width: 22px; background: var(--color-accent); }

  @media (prefers-reduced-motion: reduce) {
    .index-rail a { transition: none; }
  }
  @media (max-width: 700px) { .index-rail { display: none; } }  /* rail is a desktop affordance */
</style>

<nav class="index-rail" aria-label="Sections">
  <a href="#sec-1" aria-current="false"><span class="sr-only">Maintenance</span></a>
  <a href="#sec-2" aria-current="false"><span class="sr-only">The Origins of Efficiency</span></a>
  <a href="#sec-3" aria-current="false"><span class="sr-only">The Scaling Era</span></a>
  <!-- one tick per section -->
</nav>

<script>
  // Prefer IntersectionObserver over a scroll handler — cheaper, no rAF needed.
  const links = [...document.querySelectorAll('.index-rail a')];
  const byId = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        links.forEach(a => a.setAttribute('aria-current', 'false'));
        byId.get(e.target.id)?.setAttribute('aria-current', 'true');
      }
    }
  }, { rootMargin: '-50% 0px -50% 0px', threshold: 0 });  // fires when a section crosses mid-viewport

  document.querySelectorAll('[id^="sec-"]').forEach(s => io.observe(s));
</script>
```

The original drives this with scroll listeners + rAF and does not honor reduced-motion; the implementation above swaps to IntersectionObserver (no scroll handler) and degrades cleanly — port it this way, not the original way.
