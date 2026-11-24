---
pattern: motion-toggle-switch
from: olsonkundig
corpus: expressive
safety: production-safe
tags: [accessibility, reduced-motion, controls, footer, navigation, motion]
---

## What it is
A persistent, user-owned switch that turns the site's motion on and off, paired with a notice that appears when the OS reports `prefers-reduced-motion: reduce`. The notice does not apologise and does not silently strip the design — it says what it detected and offers an informed opt-in: *"Reduced Motion Detected. For an optimal site experience, we invite you to enable motion here. [Enable Motion] [No Thanks]"*. The switch itself is a 1em dot, muted when off, lit with a slow pulse ring when on, cloned wherever chrome already lives (menu and footer).

## Why it works
`prefers-reduced-motion` is a **one-way, machine-set flag**. It is set for reasons ranging from vestibular disorder to a laptop battery-saver default a user forgot about, and the site never learns which. Treating it as the final word means one class of user gets a page whose identity has been removed without being told, and another class gets a degraded experience they never asked for and cannot escape.

Making the preference *visible and reversible* fixes both. The OS preference becomes the **default**, not the verdict. The switch is the affordance that says: this page has motion, we noticed you may not want it, here is the control. That reframing is the whole pattern — it costs one checkbox and a class on `<body>`.

Two implementation rules make it correct rather than decorative:

1. **Both layers, always.** Ship the `@media (prefers-reduced-motion: reduce)` rules *and* the `body.reduced-motion` class rules. The media query governs the first paint, before any script runs; the class governs everything JS drives, plus the override. A class-only implementation (what the source site ships) animates for however long the bundle takes to boot.
2. **Native semantics.** A real `<input type="checkbox" role="switch">` with a `<label>` gets keyboard operation, focus, and screen-reader state announcement for free. A `<div>` with a click handler gets none of it.

The switch's own indicator must not be the thing it disables: when motion is off, the dot is a flat color change — no pulse, no transition.

## Reference implementation
```html
<!-- Shown only when the OS asks for reduced motion. Rendered hidden; JS reveals. -->
<aside class="rm-notice" id="rm-notice" hidden>
  <p class="rm-notice__title">Reduced Motion Detected</p>
  <p class="rm-notice__body">For an optimal site experience, we invite you to enable motion here.</p>
  <div class="rm-notice__actions">
    <button type="button" data-motion="on">Enable Motion</button>
    <button type="button" data-motion="dismiss">No Thanks</button>
  </div>
</aside>

<!-- The persistent control. Place it in the footer and/or the menu. -->
<div class="motion-toggle">
  <input type="checkbox" id="motion" role="switch" checked>
  <label for="motion"><span class="visually-hidden">Toggle motion</span></label>
</div>

<style>
  .motion-toggle input { position: absolute; opacity: 0; width: 1em; height: 1em; }
  .motion-toggle label {
    display: block; width: 1em; aspect-ratio: 1;
    border-radius: var(--radius-full);
    background: var(--color-muted-on-dark);
    cursor: pointer;
    /* Hit area ≥44px without changing the 1em dot. */
    padding: var(--space-4); margin: calc(var(--space-4) * -1);
    background-clip: content-box;
    transition: background-color var(--duration-base) var(--ease-standard);
  }
  .motion-toggle input:checked + label {
    background-color: var(--color-fg-on-dark);
    animation: motion-pulse var(--pulse-duration, 2000ms) infinite;
  }
  /* The switch's own indicator obeys the switch. */
  body.reduced-motion .motion-toggle label { animation: none; transition: none; }

  .motion-toggle input:focus-visible + label {
    outline: 2px solid var(--color-accent-warm, #cc953d);
    outline-offset: 2px;
  }

  @keyframes motion-pulse {
    0%   { box-shadow: 0 0 0 0   var(--pulse-ring, rgba(204, 149, 61, 0.7)); }
    100% { box-shadow: 0 0 0 8px transparent; }
  }

  .rm-notice {
    position: fixed; z-index: 999; inset-block-end: var(--space-5);
    inset-inline-end: var(--space-5); max-width: 28ch;
    padding: var(--space-5);
    background: var(--color-bg-dark);
    color: var(--color-fg-on-dark);
    font-family: var(--font-sans); font-size: var(--text-sm);
  }
  .rm-notice[hidden] { display: none; }
  .rm-notice__body { color: var(--color-muted-on-dark); }

  .visually-hidden {
    position: absolute; width: 1px; height: 1px;
    clip-path: inset(50%); overflow: hidden; white-space: nowrap;
  }

  /* LAYER 1 — governs the first paint, before any script runs. */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 1ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 1ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* LAYER 2 — governs JS-driven choreography and the user's override. */
  body.reduced-motion .stage__layer,
  body.reduced-motion .screen__copy { transition: none; filter: none; }
</style>

<script>
  // The OS preference is the DEFAULT. The switch is the verdict.
  const calm   = matchMedia('(prefers-reduced-motion: reduce)');
  const input  = document.getElementById('motion');
  const notice = document.getElementById('rm-notice');
  const STORE  = 'motion-preference';   // 'on' | 'off'

  // localStorage throws in sandboxed iframes / privacy modes — degrade to session-only.
  const storageGet = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
  const storageSet = (key, val) => { try { localStorage.setItem(key, val); } catch {} };

  const apply = (motionOn) => {
    document.body.classList.toggle('reduced-motion', !motionOn);
    input.checked = motionOn;
    // Media queries can't see the override, so re-assert it as an attribute
    // that layer-1 rules can be scoped against if you need a full escape hatch.
    document.documentElement.dataset.motion = motionOn ? 'on' : 'off';
  };

  const stored = storageGet(STORE);
  apply(stored ? stored === 'on' : !calm.matches);

  // Offer the opt-in only to users the OS flagged, and only once.
  if (calm.matches && !stored) notice.hidden = false;

  notice.addEventListener('click', (e) => {
    const action = e.target.dataset.motion;
    if (!action) return;
    if (action === 'on') { apply(true); storageSet(STORE, 'on'); }
    else                 { storageSet(STORE, 'off'); }
    notice.hidden = true;
  });

  input.addEventListener('change', () => {
    apply(input.checked);
    storageSet(STORE, input.checked ? 'on' : 'off');
  });

  // Respect a preference the user changes mid-session — unless they've overridden.
  calm.addEventListener('change', (e) => {
    if (!storageGet(STORE)) apply(!e.matches);
  });
</script>
```

Notes: persist the choice (`localStorage`) or the notice becomes nagware on every navigation. Never show the notice to users the OS did *not* flag — for them the switch alone is the affordance, discoverable in the footer. The source site ships the toggle at a bare `1em` (≈16px) hit target; the `padding` + negative `margin` + `background-clip: content-box` trick above keeps the dot 1em while giving it a ≥44px touch area. Finally, `animation-duration: 1ms` rather than `none` in the layer-1 reset: it lets `animationend` handlers still fire, so JS that waits on a transition to finish doesn't hang.
