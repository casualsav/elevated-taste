---
pattern: dual-direction-logo-marquee
from: typeform
corpus: production
safety: production-safe
trigger: load
tags: [logo-wall, integrations, footer, motion]
---

## What it is
An integrations / partners wall built as **two rows of logos scrolling in opposite directions** on a slow, seamless loop. Each row is its content duplicated once and translated by exactly −50%, so the wrap is invisible. It says "we connect to everything" with kinetic energy while staying calm — and it stops entirely under reduced motion.

## Why it works
A static logo grid is inert; a single marquee can read as a ticker. Two rows moving *against* each other create gentle parallax and life without demanding attention, and the opposing directions keep the eye from locking onto one row's speed. It's `transform`-only (compositor-friendly, no reflow), the loop is pure CSS `@keyframes` (no JS scroll handler), and duplicating the track means the animation can be infinite without a visible seam. Pausing on hover and on `prefers-reduced-motion` keeps it accessible.

## Reference implementation
```html
<section class="logo-wall" aria-label="Integrations">
  <h2 class="logo-wall__title">Integrate with your tech stack</h2>

  <div class="marquee">
    <ul class="marquee__track">
      <!-- render the logos, then repeat the SAME set once for a seamless wrap -->
      <li><img src="calendly.svg" alt="Calendly"></li>
      <li><img src="slack.svg" alt="Slack"></li>
      <li><img src="stripe.svg" alt="Stripe"></li>
      <li><img src="intercom.svg" alt="Intercom"></li>
      <li aria-hidden="true"><img src="calendly.svg" alt=""></li>
      <li aria-hidden="true"><img src="slack.svg" alt=""></li>
      <li aria-hidden="true"><img src="stripe.svg" alt=""></li>
      <li aria-hidden="true"><img src="intercom.svg" alt=""></li>
    </ul>
  </div>

  <div class="marquee">
    <ul class="marquee__track marquee__track--reverse">
      <li><img src="zapier.svg" alt="Zapier"></li>
      <li><img src="webflow.svg" alt="Webflow"></li>
      <li><img src="klaviyo.svg" alt="Klaviyo"></li>
      <li><img src="callrail.svg" alt="CallRail"></li>
      <li aria-hidden="true"><img src="zapier.svg" alt=""></li>
      <li aria-hidden="true"><img src="webflow.svg" alt=""></li>
      <li aria-hidden="true"><img src="klaviyo.svg" alt=""></li>
      <li aria-hidden="true"><img src="callrail.svg" alt=""></li>
    </ul>
  </div>
</section>

<style>
  .logo-wall {
    background: var(--color-bg, #faf9fb);
    padding: var(--space-9, 6rem) 0;
    border-radius: var(--radius-xl, 24px);
    overflow: hidden;
  }
  .logo-wall__title {
    text-align: center; margin: 0 0 var(--space-8, 4rem);
    font-size: clamp(1.875rem, 4vw, var(--text-4xl, 3rem));
    font-weight: var(--weight-regular, 400);
    letter-spacing: var(--tracking-heading, -0.015em);
  }

  .marquee { overflow: hidden; padding-block: var(--space-3, 0.75rem); }
  .marquee__track {
    display: flex; gap: var(--space-5, 1.5rem);
    width: max-content; margin: 0; padding: 0; list-style: none;
    will-change: transform;
    animation: logo-marquee 40s linear infinite;
  }
  .marquee__track--reverse { animation-direction: reverse; }
  .marquee:hover .marquee__track { animation-play-state: paused; }

  .marquee__track li {
    display: grid; place-items: center;
    min-width: 180px; height: 88px;
    background: var(--color-surface, #eeecee);
    border-radius: var(--radius-lg, 12px);
  }
  .marquee__track img { max-height: 28px; width: auto; }

  @keyframes logo-marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }  /* track is duplicated → seamless */
  }

  /* Reduced motion: stop the loop, show a static, wrapped row. */
  @media (prefers-reduced-motion: reduce) {
    .marquee__track { animation: none; flex-wrap: wrap; justify-content: center; width: auto; }
    .marquee__track li[aria-hidden="true"] { display: none; }  /* drop the duplicate set */
  }
</style>
```
