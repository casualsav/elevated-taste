---
pattern: sticky-narrative-channel-list
from: gumloop
corpus: production
safety: production-safe
trigger: in-view
tags: [feature-section, motion, scrollytelling, landing]
---

## What it is

A two-column "works everywhere you do" section: a heading column that **pins** while a tall list of surface rows (Slack, Email, Text Message, …) scrolls past it. Exactly one row — the one currently crossing a center band of the viewport — is "active": it gets a tinted background and ink-black text, while every other row sits quiet and muted. As you scroll, the highlight walks down the list, turning a flat feature list into a guided, one-idea-at-a-time tour. Gumloop uses it for the channels an agent can live in.

Reach for it when you have 3–6 peer items that each deserve a beat of attention but share one headline. It's the honest middle ground between a static bullet list (no focus) and a full scroll-jacked slideshow (too heavy): the reader keeps native scroll, and the page just decides what's lit.

## Why it works

Pinning the heading separates the *claim* (stable, always on screen) from the *evidence* (the rows, which advance). That's the scrollytelling contract — one fixed thing, one moving thing — and it costs nothing but a `position: sticky`.

The single-active-row rule is the real work. A list where everything is equally styled gives the eye no path; a list where the centered item is emphasized creates an automatic reading order tied to scroll position, so attention and scroll agree. Because only `background-color` and `color` change — never layout — the highlight is free to animate every frame with zero reflow.

Three construction rules:

**Drive it with one IntersectionObserver, not a scroll handler.** Observe the rows with a `rootMargin` that collapses the viewport to a thin horizontal band near the middle (large negative top *and* bottom margins); a row is "active" exactly while it intersects that band. One callback per row crossing — no `scroll` listener, no rAF, nothing on the main thread while scrolling.

**Animate color, never size.** The active state is a background tint + text-color shift. Don't grow the row, add borders that change box size, or animate height — those reflow the list under the sticky element on every frame.

**Keep the sticky column shorter than the list.** `top` offset plus the column's own height must leave room for the list to travel; if the heading column is as tall as the list, nothing scrolls past it and the effect dies.

Under `prefers-reduced-motion`, keep the highlight (it's information — which item is in focus) but drop the transition so it snaps instead of fades, and the sticky pin still holds.

## Reference implementation

```html
<style>
  .surfaces {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-8);
    max-width: var(--container-xl);
    margin-inline: auto;
    padding-block: var(--space-9);
  }
  @media (max-width: 640px) { .surfaces { grid-template-columns: 1fr; gap: var(--space-6); } }

  /* The claim: pinned while the evidence scrolls. */
  .surfaces__head {
    position: sticky;
    top: 16vh;                      /* leaves a center band for the active row */
    align-self: start;
    height: max-content;
  }
  .surfaces__head h2 {
    font-size: var(--text-4xl);
    font-weight: var(--weight-medium);     /* scale carries it, not weight */
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-display);
    color: var(--color-fg);
    margin: 0;
  }

  .surfaces__list { display: flex; flex-direction: column; gap: var(--space-4); }

  /* Only background + color transition — zero layout change on the hot path. */
  .surface-row {
    display: flex;
    gap: var(--space-4);
    padding: var(--space-5);
    border-radius: var(--radius-lg);
    background: transparent;
    color: var(--color-muted);
    transition:
      background-color var(--duration-base) var(--ease-standard),
      color            var(--duration-base) var(--ease-standard);
  }
  .surface-row__name { font-weight: var(--weight-medium); }
  .surface-row__desc { font-size: var(--text-sm); line-height: var(--leading-normal); }

  .surface-row[data-active="true"] {
    background: var(--color-channel-active, #eff0f4);
    color: var(--color-fg);
  }

  @media (prefers-reduced-motion: reduce) {
    .surface-row { transition: none; }
    .surfaces__head { position: static; }   /* no pin when motion is off */
  }
</style>

<section class="surfaces">
  <div class="surfaces__head">
    <h2>Meet your team<br>where they work</h2>
  </div>
  <div class="surfaces__list">
    <div class="surface-row"><div><p class="surface-row__name">Slack</p><p class="surface-row__desc">@mention an agent in any channel or thread.</p></div></div>
    <div class="surface-row"><div><p class="surface-row__name">Email</p><p class="surface-row__desc">Let agents draft and triage right in your inbox.</p></div></div>
    <div class="surface-row"><div><p class="surface-row__name">Text Message</p><p class="surface-row__desc">Text your agents over iMessage, anytime.</p></div></div>
  </div>
</section>

<script>
  (function () {
    const rows = document.querySelectorAll('.surface-row');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      rows[0]?.setAttribute('data-active', 'true');     // static focus, no scroll tracking
      return;
    }
    // Collapse the viewport to a ~20%-tall band near the middle: a row is
    // active only while it crosses that band. One observer, no scroll listener.
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          rows.forEach((r) => r.setAttribute('data-active', 'false'));
          e.target.setAttribute('data-active', 'true');
        }
      });
    }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
    rows.forEach((r) => io.observe(r));
  })();
</script>
```
