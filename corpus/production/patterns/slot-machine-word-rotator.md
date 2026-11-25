---
pattern: slot-machine-word-rotator
from: baremetrics
corpus: production
safety: production-safe
trigger: load
tags: [motion, hero, typography, product-marketing]
---

## What it is
The last word of a headline is a fixed-height slot that **rolls** vertically through a short list of terms — integration names, use-cases, verticals — like a slot-machine reel, and (optionally) recolors each incoming word to its own brand hue. Baremetrics rolls `+ Shopify`, `+ Stripe`, `+ Recurly`, … through the slot after *"Superior Dashboards and Analytics for Stripe"*, tinting `+ Shopify` green, the next its own accent, and so on. The rest of the headline never moves.

## Why it works
It solves the same "the value prop is *many things*" problem as a crossfade rotator, but the **vertical roll reads as a mechanism turning over** — one item clicks up and out, the next clicks in — which suits a *list/catalog* of concrete items (integrations, plans, platforms) better than a dissolve. Two details make it non-cheesy:

- **The slot is a clipped window, not a resizing inline.** Give the outer slot a fixed `height` equal to the line-height and `overflow: clip`, then translate a stacked column of words inside it. Because the window height is fixed and the words are pre-stacked, the sentence never reflows and the eye tracks the word, not a jump.
- **Recolor is category coding, not decoration.** Tinting each word to the brand color of the thing it names (`+ Shopify` green, a payments provider periwinkle) turns the animation into information — the visitor associates each name with a color they'll see again in the product. Keep the hues from the house category set; don't invent per-frame colors.

Every word ships in the DOM (crawlers/screen readers get the full list); only the presentation loops, so mark the slot `aria-live="off"` so it isn't announced on every tick. Cost is one `transform` + one `color` on a single element — cheap — but it's a **perpetual** animation next to a CTA, exactly the `prefers-reduced-motion` case. The source ships no such rule; the fallback below shows the first word statically, which is always a complete headline.

## Reference implementation
```html
<style>
  .headline {
    font-family: var(--font-sans, "Inter", system-ui, sans-serif);
    font-size: var(--text-6xl, 3.5rem);
    font-weight: 800;
    line-height: 1.18;
    letter-spacing: -0.064em;              /* the tight display track, scaled to size */
    color: var(--color-fg, #33334f);       /* ink, not black */
    margin: 0;
  }

  /* The clipped window: fixed to one line, hides everything but the current word. */
  .roller {
    display: inline-block;
    height: 1.18em;                        /* == headline line-height */
    overflow: clip;
    vertical-align: bottom;
  }
  /* The reel: a vertical stack of words stepped by a CSS variable. */
  .roller__reel {
    display: flex;
    flex-direction: column;
    transform: translateY(calc(var(--i, 0) * -1.18em));
    transition: transform var(--duration-slow, 500ms) var(--ease-standard, cubic-bezier(0.2,0,0,1));
  }
  .roller__word {
    height: 1.18em;
    white-space: nowrap;
    color: var(--word-color, var(--color-accent, #6078ff));  /* each word carries its own hue */
  }

  /* Mandatory: no roll for reduced-motion users. First word stands alone — a valid headline. */
  @media (prefers-reduced-motion: reduce) {
    .roller__reel { transition: none; transform: none; }
    .roller__word:not(:first-child) { display: none; }
  }
</style>

<h1 class="headline">
  Superior Dashboards and Analytics for Stripe
  <span class="roller" aria-live="off">
    <span class="roller__reel" id="reel">
      <span class="roller__word" style="--word-color:#12c457">+ Shopify</span>
      <span class="roller__word" style="--word-color:#6078ff">+ Braintree</span>
      <span class="roller__word" style="--word-color:#724ce9">+ Recurly</span>
      <span class="roller__word" style="--word-color:#36bedf">+ Chargebee</span>
    </span>
  </span>
</h1>

<script>
  // Advance one step per interval; wrap by resetting the index. Honor reduced-motion by not starting.
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reel = document.getElementById('reel');
  const n = reel.children.length;
  if (!mq.matches) {
    let i = 0;
    setInterval(() => { i = (i + 1) % n; reel.style.setProperty('--i', i); }, 2200);
  }
</script>
```

For a seamless infinite roll (no snap-back on wrap), duplicate the first word at the end of the reel and, when the index reaches `n`, disable the transition, reset `--i` to 0, then re-enable — the classic marquee-reset trick. The simpler modulo version above is fine for lists of 3–5 words.
