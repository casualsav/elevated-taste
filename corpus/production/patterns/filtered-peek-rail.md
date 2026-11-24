---
pattern: filtered-peek-rail
from: hoxton
corpus: production
safety: production-safe
trigger: tap
tags: [catalog, ecommerce, feature-section, navigation, motion]
---

## What it is
A row of pill filter chips sitting on the section heading's baseline, above a horizontally-scrolling card rail that is deliberately **clipped by both viewport edges** — you can see a sliver of the card before the first one and a sliver after the last visible one. Tapping a chip re-populates the rail. The Hoxton uses it to filter thirty-odd hotels down to a region; the same shape serves store locators, plan pickers, and category browsers.

## Why it works
Two decisions carry it.

**Clipping on both edges is the affordance.** A rail that begins and ends flush inside the container reads as a finished set, and users don't scroll it. Cut it with the viewport and the set reads as unbounded — the arrows and the drag become obvious without an instructional label. The trick is that the rail's scroll container is full-bleed while its `scroll-padding-inline` matches the *content* gutter, so the first card still lines up with the heading above it when the rail is at scroll position zero. Bleed without alignment just looks broken.

**The pill is a state, not a style.** In a system where every other corner is square, roundness means "this is a toggle." That reads faster than a colour change, and it's the reason the active chip only needs an inverted fill — no checkmark, no underline, no second accent.

Two things to fix on reuse. The chips must be real `<button>`s carrying `aria-pressed`, not a `.active` class (colour alone is not a state announcement) — this is exactly what the source site gets wrong. And filtering must not silently strand a scrolled rail: reset `scrollLeft` to zero on change, or the visitor taps "USA" and stares at the empty tail of a shorter list.

Motion is a single 300ms opacity swap; the smooth scroll on the arrows is the only thing reduced-motion has to disable, and disabling it costs nothing — the rail still jumps to the right card.

## Reference implementation
```html
<style>
  .rail__head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;              /* chips sit on the heading's baseline, not centred to its box */
    justify-content: space-between;
    gap: var(--space-5);
    max-inline-size: var(--container-xl);
    margin-inline: auto;
    padding: var(--space-9) var(--space-6) var(--space-6);
  }
  .rail__title {
    margin: 0;
    font-size: var(--text-4xl);
    font-weight: var(--weight-regular);   /* size does the work; weight stays put */
    letter-spacing: var(--tracking-heading);
    color: var(--color-fg);
  }

  .rail__chips { display: flex; flex-wrap: wrap; gap: var(--space-2); }
  .rail__chip {
    min-block-size: var(--tap-target-min, 44px);
    padding-inline: var(--space-5);
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius-full);    /* the ONLY round thing in the section */
    background: transparent;
    color: var(--color-fg);
    font: inherit;
    font-size: var(--text-sm);
    letter-spacing: var(--tracking-caps);
    text-transform: uppercase;
    cursor: pointer;
    transition: background var(--duration-base) var(--ease-standard),
                color var(--duration-base) var(--ease-standard);
  }
  .rail__chip[aria-pressed="true"] {
    background: var(--color-fg);
    color: var(--color-bg);
  }

  /* Full-bleed scroller; content gutter preserved via scroll-padding + first/last spacers. */
  .rail__track {
    display: flex;
    gap: var(--space-4);
    overflow-x: auto;
    scroll-snap-type: x proximity;
    scroll-padding-inline: var(--rail-gutter, 5vw);
    padding-inline: var(--rail-gutter, 5vw);
    scrollbar-width: none;
  }
  .rail__track::-webkit-scrollbar { display: none; }

  .rail__card {
    flex: 0 0 clamp(240px, 22vw, 340px);   /* fractional cards at the edges are the point */
    scroll-snap-align: start;
    opacity: 1;
    transition: opacity var(--duration-slow) var(--ease-standard);
  }
  .rail__card[hidden] { display: none; }
  .rail__track.is-swapping .rail__card { opacity: 0; }

  .rail__card img {
    inline-size: 100%;
    aspect-ratio: 4 / 3;                   /* reserve the box so the lazy fade isn't a layout shift */
    object-fit: cover;
    border-radius: 0;                      /* square by default */
    display: block;
  }
  .rail__card h3 {
    margin: var(--space-4) 0 var(--space-2);
    font-size: var(--text-xl);
    font-weight: var(--weight-regular);
    color: var(--color-fg);
  }
  .rail__card p {
    margin: 0 0 var(--space-4);
    font-size: var(--text-base);
    line-height: var(--leading-normal);
    color: var(--color-fg);                /* no grey tier — de-emphasis is by size */
  }

  /* Underline drawn at rest, withdrawn on hover — discoverable without hovering. */
  .rail__link {
    position: relative;
    color: var(--color-fg);
    text-decoration: none;
  }
  .rail__link::after {
    content: "";
    position: absolute;
    inset-inline: 0;
    inset-block-end: -2px;
    block-size: 1px;
    background: currentColor;
    transform: scaleX(1);
    transform-origin: left;
    transition: transform var(--duration-slow) var(--ease-decel, cubic-bezier(0.165, 0.84, 0.44, 1));
  }
  .rail__link:hover::after { transform: scaleX(0); }

  @media (prefers-reduced-motion: reduce) {
    .rail__card, .rail__chip { transition: none; }
    .rail__link::after { transition: none; transform: scaleX(1); }  /* stays underlined, always */
  }
</style>

<section aria-labelledby="rail-title">
  <div class="rail__head">
    <h2 class="rail__title" id="rail-title">Our hotel locations</h2>
    <div class="rail__chips" role="group" aria-label="Filter locations by region">
      <button class="rail__chip" type="button" aria-pressed="true"  data-region="europe">Europe</button>
      <button class="rail__chip" type="button" aria-pressed="false" data-region="uk">UK &amp; Ireland</button>
      <button class="rail__chip" type="button" aria-pressed="false" data-region="usa">USA</button>
      <button class="rail__chip" type="button" aria-pressed="false" data-region="all">All</button>
    </div>
  </div>

  <!-- tabindex makes the overflow container keyboard-scrollable; without it the cards are reachable but the rail is not -->
  <div class="rail__track" tabindex="0" role="region" aria-label="Hotels, scrollable">
    <article class="rail__card" data-region="europe">
      <img src="/hotels/florence.jpg" alt="The lobby of The Hoxton Florence, with arched windows and potted ferns." loading="lazy">
      <h3>Florence</h3>
      <p>Near the Piazza della Liberta, across two spectacular buildings.</p>
      <a class="rail__link" href="/florence">View hotel</a>
    </article>
    <article class="rail__card" data-region="uk" hidden>
      <img src="/hotels/shoreditch.jpg" alt="A corner banquette in the ground-floor restaurant at The Hoxton Shoreditch." loading="lazy">
      <h3>Shoreditch</h3>
      <p>The original Hox, on the corner where it all started.</p>
      <a class="rail__link" href="/shoreditch">View hotel</a>
    </article>
  </div>
</section>

<script>
  const track = document.querySelector('.rail__track');
  const chips = document.querySelectorAll('.rail__chip');
  const cards = track.querySelectorAll('.rail__card');

  chips.forEach((chip) => chip.addEventListener('click', () => {
    chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));

    const region = chip.dataset.region;
    track.classList.add('is-swapping');

    // Swap under cover of the fade, then reveal. Reset scroll or the visitor lands past the new tail.
    setTimeout(() => {
      cards.forEach((card) => {
        card.hidden = region !== 'all' && card.dataset.region !== region;
      });
      track.scrollLeft = 0;
      track.classList.remove('is-swapping');
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 200);
  }));
</script>
```
