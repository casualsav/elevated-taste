---
pattern: no-preference-gated-reveal
from: cooley
corpus: production
safety: production-safe
trigger: in-view
tags: [motion, feature-section, editorial, blog, accessibility]
---

## What it is
The standard scroll reveal — items fade up in a stagger as their section enters the viewport — written with its **polarity inverted**. The hidden state (`opacity: 0`, a 100px offset, a 6px blur) is not declared globally and then cancelled for reduced-motion users. It is declared *inside* `@media (prefers-reduced-motion: no-preference)`, together with the animation that undoes it. Ask for less motion and there is nothing to cancel: the rule never matches, the item was never hidden, and it renders at rest on first paint.

Cooley applies it to every list on the page — the news carousel, the three resource tiles, the insights rows, the services tabs — with an 80ms step between siblings.

## Why it works
Almost every reveal on the web is written the other way round:

```css
.reveal { opacity: 0; transform: translateY(100px); }         /* everyone gets hidden */
.reveal.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1 !important; transform: none !important; }  /* … then un-hidden */
}
```

That shape has three failure modes, and the inverted gate closes all three at once. The `!important` override is load-bearing, so any later specificity accident re-hides the content. The hidden state paints before the media query is evaluated in some engines, producing a flash. And the accessibility fallback is an afterthought bolted on at the end of the stylesheet, which means the moment someone adds a fourth reveal variant and forgets the override, a reduced-motion user loses a section of the page permanently.

Under the inverted gate, **the animated build is the special case and the static page is the default**. The failure mode of forgetting something is a page that doesn't animate — not a page you can't read.

The remaining hazard is JS: if the "ready" flag never arrives, motion-tolerant users are left staring at `opacity: 0`. Cooley does not guard this. Guard it by requiring a `js` class on the root — set by the same script that will later flip the flag — so a JS failure lands everybody on the same static page a reduced-motion user already gets.

Three parameters carry the whole feel. **80ms** between siblings is enough to read as a sequence and short enough that a six-item list finishes in half a second. **`cubic-bezier(0.16, 1, 0.3, 1)`** is a hard expo-out: it covers 90% of the distance in the first third of the duration, so the item arrives immediately and only the settle is slow — the opposite of an `ease-in-out` reveal, which feels like the page is loading. And the **blur** is the expensive one: it forces a filter pass over the item's paint area, so cap it at 6px, never put it on a scroll-linked timeline, and drop it on small viewports where fill-rate is scarce.

Reveal only *below* the fold. Anything in the first viewport should be painted, not animated in — a hero that assembles itself costs the visitor a beat before they can read the one sentence you needed them to read.

## Reference implementation
```html
<style>
  /* Resting state = finished state. Nothing here hides anything. */
  .reveal-group > * { --reveal-index: 0; }

  @media (prefers-reduced-motion: no-preference) {
    /* Hidden ONLY when motion is welcome AND JS is alive AND the group hasn't fired. */
    html.js .reveal-group:not([data-revealed]) > * {
      opacity: 0;
      transform: translate3d(0, var(--reveal-rise, 100px), 0);
      filter: blur(var(--reveal-blur, 6px));
      visibility: hidden;
    }

    html.js .reveal-group[data-revealed="running"] > * {
      animation: reveal-rise var(--duration-reveal, 800ms) var(--ease-entrance) both;
      animation-delay: calc(var(--reveal-index, 0) * var(--reveal-step, 80ms));
      will-change: transform, opacity, filter;
    }

    /* Cleared on animationend: will-change is a cost, not a decoration. */
    html.js .reveal-group[data-revealed="done"] > * { will-change: auto; }

    @keyframes reveal-rise {
      from { opacity: 0; transform: translate3d(0, var(--reveal-rise, 100px), 0); filter: blur(var(--reveal-blur, 6px)); visibility: visible; }
      to   { opacity: 1; transform: none; filter: none; visibility: visible; }
    }

    /* Blur is the only expensive property here — skip the filter pass on phones. */
    @media (max-width: 800px) {
      .reveal-group { --reveal-blur: 0px; --reveal-rise: 40px; }
    }
  }
</style>

<section class="reveal-group" aria-label="Latest insights">
  <article style="--reveal-index: 0">…</article>
  <article style="--reveal-index: 1">…</article>
  <article style="--reveal-index: 2">…</article>
</section>

<script>
  // Set FIRST, synchronously, before first paint. If this script never runs,
  // the hidden state above never applies and the page renders complete.
  document.documentElement.classList.add('js');

  (() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const io = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        io.unobserve(target);                       // fire once; a re-hiding reveal is a bug
        target.dataset.revealed = 'running';
        const items = target.children.length;
        let done = 0;
        target.addEventListener('animationend', () => {
          if (++done === items) target.dataset.revealed = 'done';
        });
      }
    }, { rootMargin: '0px 0px -20% 0px' });        // fires when the group is 20% up the viewport

    for (const g of document.querySelectorAll('.reveal-group')) io.observe(g);
  })();
</script>
```

`--reveal-index` is the only per-item value, so the stagger survives server-rendered lists, virtualized rows, and filtered subsets — set it from the render loop and never touch the CSS again. Pair it with `monochrome-tone-triad`: the reveal moves nothing but `transform`/`opacity`/`filter`, so a toned section can animate without repainting its ground.
