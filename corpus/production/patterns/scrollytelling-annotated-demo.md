---
pattern: scrollytelling-annotated-demo
from: shopify-checkout
corpus: production
safety: production-safe
trigger: in-view
tags: [feature-section, interactive-showcase, motion]
---

## What it is
A tall section that pins ONE real product artifact (a screenshot, a UI, a device) in the center of the viewport while labeled "capability pills" reveal around it as the reader scrolls. Instead of a grid of feature cards describing the product, the reader watches a single concrete object accrue annotations — a guided tour driven purely by scroll position.

## Why it works
Concreteness beats enumeration: showing the actual thing once and narrating it in place is more persuasive and less generic than N padded cards. The mechanics are cheap and robust — the artifact is `position: sticky` (no scroll math), and each pill is toggled by an `IntersectionObserver` whose asymmetric `rootMargin` turns a band in the middle of the viewport into an "active step" detector. Only `opacity`/`transform` animate, so it stays on the compositor; with reduced motion every pill is simply shown at once, losing nothing but the choreography.

## Reference implementation
```html
<section class="demo">
  <div class="demo__stage">
    <!-- the ONE artifact: pins while the track scrolls past -->
    <figure class="demo__artifact">
      <img src="checkout.png" alt="Product checkout screen" />
    </figure>

    <!-- one step per capability; each fades in when it enters the active band -->
    <ol class="demo__steps">
      <li class="demo__step" style="--side:left">  <span>Enable Shop Pay</span></li>
      <li class="demo__step" style="--side:right"> <span>Add express checkout</span></li>
      <li class="demo__step" style="--side:left">  <span>Enable local delivery</span></li>
      <li class="demo__step" style="--side:right"> <span>Add discounts &amp; gift cards</span></li>
    </ol>
  </div>
</section>

<style>
  .demo__stage { position: relative; max-width: var(--container-content, 600px); margin-inline: auto; }
  .demo__artifact {
    position: sticky; top: 12vh;               /* pins center-ish while steps scroll */
    border-radius: var(--radius-lg);
    box-shadow: 0 30px 40px -15px rgba(0,0,0,0.2);
  }
  .demo__steps { margin: 0; padding: 0; list-style: none; }
  .demo__step {
    min-height: 60vh;                          /* give each step scroll room */
    display: flex; align-items: center;
    justify-content: var(--side, left) == right ? flex-end : flex-start;
  }
  .demo__step span {
    padding: var(--space-3, 0.75rem) var(--space-4, 1rem);
    border-radius: var(--radius-full);
    background: var(--color-accent, #6639f6);
    color: var(--color-accent-fg, #fff);
    /* resting = dimmed; JS promotes the active one */
    opacity: 0.2; transform: translateY(8px);
    transition: opacity var(--duration-slow) var(--ease-entrance),
                transform var(--duration-slow) var(--ease-entrance);
  }
  .demo__step.is-active span { opacity: 1; transform: none; }

  @media (prefers-reduced-motion: reduce) {
    .demo__step span { opacity: 1; transform: none; transition: none; }
  }
</style>

<script>
  const steps = document.querySelectorAll('.demo__step');
  // rootMargin quarantines a band in the middle of the viewport as the "active zone"
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) e.target.classList.toggle('is-active', e.isIntersecting);
  }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });
  steps.forEach((s) => io.observe(s));
</script>
```
Notes: the `justify-content` ternary above is pseudocode for clarity — in real markup give `--side:left`/`right` two classes (`.demo__step--left`/`--right`) that set `justify-content: flex-start`/`flex-end`. Tune the `-40%/-40%` band tighter (e.g. `-45% 0px -45%`) for a single crisp active step, looser for overlap. Keep the artifact a real screenshot, not a stylized mock.
