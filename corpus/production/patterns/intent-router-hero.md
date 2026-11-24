---
pattern: intent-router-hero
from: headspace
corpus: production
safety: production-safe
tags: [hero, landing, navigation, product-marketing, feature-section]
---

## What it is
A fold that disambiguates instead of pitching. A short shared promise line, then **two equal offer cards** side by side — each naming a distinct product with its own primary and secondary action — and directly beneath them a grid of **goal-shaped entry links** ("Sleep soundly", "Manage anxiety", "Start therapy") that route a visitor by the outcome they came for rather than by the org chart. Headspace uses it to separate a subscription app from an insurance-billed therapy service without picking a favorite.

## Why it works
When one company sells two genuinely different things to overlapping audiences, the single-headline hero forces a compromise sentence that describes neither. Worse, the visitor who *is* qualified has to read the whole page to discover which half is theirs. Splitting the fold makes self-selection the first interaction: everyone below the fold is now a qualified reader of one story, and the page underneath gets to be specific.

Three constraints make it work rather than look indecisive:

1. **The cards must be equal.** Same width, same radius, same button hierarchy. The moment one is visually primary you have a hero with a footnote, and you've reintroduced the choice you were trying to remove.
2. **The goal grid speaks the visitor's language, not the product's.** "Manage anxiety" is a symptom; "Guided meditation library" is a feature. Symptoms route; features filter. Six to eight cells — enough that most visitors see themselves, few enough to scan without reading.
3. **Ground color, not borders, separates the two zones.** Cards on a warm surface, grid on the page ground. Sub-dividing the fold with rules turns disambiguation into bureaucracy.

The row of goal links doubles as the page's real navigation on mobile, where the nav collapses to a hamburger — which is why they are `<a>` elements with a chevron affordance and not tabs, buttons, or a `<select>`.

## Reference implementation
```html
<style>
  .router {
    background: var(--color-bg);
    padding-block: var(--space-7) var(--space-9);
  }
  .router__inner {
    max-width: var(--container-xl);
    margin-inline: auto;
    padding-inline: var(--space-5);
  }

  /* The shared promise: small, because the cards carry the message. */
  .router__promise {
    margin: 0 auto var(--space-5);
    max-width: 20ch;
    text-align: center;
    font-family: var(--font-sans);
    font-size: var(--text-3xl);
    font-weight: var(--weight-bold);
    line-height: var(--leading-tight);
    letter-spacing: var(--tracking-display);
    color: var(--color-fg);
    text-wrap: balance;
  }
  .router__trust {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--space-2) var(--space-5);
    margin: 0 0 var(--space-6);
    padding: 0;
    list-style: none;
    font-size: var(--text-sm);
    color: var(--color-muted);
  }

  /* Two equal offers. Equality is the pattern — do not promote one. */
  .router__offers {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-4);
  }
  @media (min-width: 48rem) {
    .router__offers { grid-template-columns: 1fr 1fr; }
  }

  .offer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-6) var(--space-5);
    border-radius: var(--radius-card, 1.5rem);
    background: var(--color-surface);
    text-align: center;
    min-width: 0;   /* grid item default is content-based; the art's intrinsic size must not force the track wide */
  }
  .offer__title {
    margin: 0;
    max-width: 22ch;
    font-size: var(--text-xl);
    font-weight: var(--weight-bold);
    line-height: var(--leading-snug);
    letter-spacing: var(--tracking-heading);
    color: var(--color-fg);
  }
  .offer__art { margin-top: auto; max-width: 100%; min-width: 0; height: auto; }

  /* One pill shape for every action; the tier is carried by fill, not size. */
  .pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 3rem;                 /* 48px — above the 44px tap-target floor */
    padding-inline: var(--space-5);
    border: 1px solid transparent;
    border-radius: var(--radius-full);
    font: inherit;
    font-weight: var(--weight-bold);
    letter-spacing: var(--tracking-ui);
    text-decoration: none;
    cursor: pointer;
    /* Enumerate the properties. `transition: all` is how a page grows three easings. */
    transition:
      color var(--duration-fast) var(--ease-standard),
      background-color var(--duration-fast) var(--ease-standard),
      border-color var(--duration-fast) var(--ease-standard);
  }
  .pill--solid {
    background: var(--color-fg);
    color: var(--color-bg);
  }
  .pill--solid:hover { background: var(--color-ink-hover, #141313); }
  .pill--quiet {
    background: transparent;
    border-color: var(--color-border);
    color: var(--color-fg);
  }
  .pill--quiet:hover { border-color: var(--color-border-strong); }
  .pill:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }

  /* Goals, not features. Six cells; each is a link, so it works as mobile navigation. */
  .goals { margin-top: var(--space-8); }
  .goals__title {
    margin: 0 0 var(--space-5);
    text-align: center;
    font-size: var(--text-xl);
    font-weight: var(--weight-bold);
    letter-spacing: var(--tracking-heading);
    color: var(--color-fg);
  }
  .goals__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }
  @media (min-width: 48rem) { .goals__grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 64rem) { .goals__grid { grid-template-columns: repeat(3, 1fr); } }

  .goal {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    min-height: 3.5rem;
    padding: var(--space-3) var(--space-4);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    background: var(--color-bg);
    color: var(--color-fg);
    font-weight: var(--weight-medium);
    text-decoration: none;
    transition:
      border-color var(--duration-fast) var(--ease-standard),
      background-color var(--duration-fast) var(--ease-standard);
  }
  .goal:hover { border-color: var(--color-border-strong); background: var(--color-surface); }
  .goal:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }
  .goal__chevron { flex: none; color: var(--color-muted); }
</style>

<section class="router" aria-labelledby="router-promise">
  <div class="router__inner">
    <h1 class="router__promise" id="router-promise">Sleep better, all in one place</h1>

    <ul class="router__trust">
      <li>1,000+ expert-led exercises</li>
      <li>Therapy that accepts insurance</li>
      <li>100M+ downloads</li>
    </ul>

    <div class="router__offers">
      <article class="offer">
        <h2 class="offer__title">The app, with expert-led meditations and tools</h2>
        <a class="pill pill--solid" href="/app">Try for free</a>
        <a class="pill pill--quiet" href="/plans">See the plans</a>
        <img class="offer__art" src="/art/app.png" alt="The app showing a guided session for managing anxiety" width="480" height="320">
      </article>

      <article class="offer">
        <h2 class="offer__title">Online therapy that accepts insurance</h2>
        <a class="pill pill--solid" href="/therapy">Check your coverage</a>
        <a class="pill pill--quiet" href="/therapy/eligibility">See if you're eligible</a>
        <img class="offer__art" src="/art/therapy.png" alt="A therapist speaking with a client over video" width="480" height="320">
      </article>
    </div>

    <nav class="goals" aria-labelledby="goals-title">
      <h2 class="goals__title" id="goals-title">What are you looking for?</h2>
      <div class="goals__grid">
        <a class="goal" href="/stress">Stress less <span class="goal__chevron" aria-hidden="true">→</span></a>
        <a class="goal" href="/sleep">Sleep soundly <span class="goal__chevron" aria-hidden="true">→</span></a>
        <a class="goal" href="/anxiety">Manage anxiety <span class="goal__chevron" aria-hidden="true">→</span></a>
        <a class="goal" href="/journaling">Process thoughts <span class="goal__chevron" aria-hidden="true">→</span></a>
        <a class="goal" href="/meditation">Practice meditation <span class="goal__chevron" aria-hidden="true">→</span></a>
        <a class="goal" href="/therapy">Start therapy <span class="goal__chevron" aria-hidden="true">→</span></a>
      </div>
    </nav>
  </div>
</section>
```
