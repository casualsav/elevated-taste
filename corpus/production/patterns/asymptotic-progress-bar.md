---
pattern: asymptotic-progress-bar
from: arena
corpus: production
safety: production-safe
trigger: load
tags: [motion, loading, feedback, navigation]
---

## What it is

A thin bar pinned to the top of the viewport that, on any indeterminate wait (route change, upload, slow query), leaps most of the way across almost immediately and then crawls — approaching a finish line it is designed never to reach. When the real work completes, the bar snaps to full and fades out.

The whole effect is one element, one keyframe, and one easing curve: `translateX(-100% → 99%)` over **60 seconds** on `cubic-bezier(0, 1, 1, 1)`. That curve has both control points pinned at the top, so progress is nearly complete within the first fraction of a second and asymptotically flat thereafter.

## Why it works

**It tells the truth about an unknown duration.** A percentage bar on an indeterminate operation is a lie — it either invents a number or stalls at a value the user learns to distrust. A spinner is honest but says nothing about progress. This says the one true thing available: *something started, it is still going, and I don't know when it ends.* Because the curve is asymptotic, the bar never contradicts itself by sitting at 100% while you wait.

**The perceived-performance trick is in the front of the curve, not the back.** The near-instant leap to ~90% is what makes a route change feel fast; the crawl is what keeps that feeling from becoming a broken promise. Reverse the easing and you get the opposite — a bar that feels slow and then jumps, which reads as a stall.

**It costs nothing.** One `transform` on one absolutely-positioned element: no layout, no paint, compositor-only. Contrast with a shimmer or spinner, which repaint continuously for as long as the wait lasts.

**Retire it asymmetrically.** On completion, transform snaps forward fast (`--duration-base`) while opacity fades on a *delayed* shorter curve — so the eye registers "done" before the bar disappears, rather than watching it vanish mid-travel.

## Reference implementation

```html
<!-- framework-neutral; drop-in, reduced-motion-aware -->
<style>
  .progress {
    position: fixed;
    inset: 0 0 auto 0;
    height: 2px;
    z-index: 200;
    background: var(--color-subtle);
    transform: translateX(-100%);
    opacity: 0;
    pointer-events: none;
    will-change: transform;
  }

  /* running: leap, then crawl toward a 99% it never passes */
  .progress[data-state="loading"] {
    opacity: 1;
    animation: progress-creep
               var(--duration-progress-creep, 60s)
               var(--ease-asymptotic, cubic-bezier(0, 1, 1, 1))
               forwards;
  }

  /* done: snap forward, then fade — the fade is delayed so "complete" registers first */
  .progress[data-state="done"] {
    animation: none;
    transform: translateX(0);
    opacity: 0;
    transition: transform var(--duration-base) var(--ease-exit),
                opacity   var(--duration-fast) var(--ease-standard) var(--duration-fast);
  }

  @keyframes progress-creep {
    to { transform: translateX(99%); }
  }

  /* MANDATORY: no creep, no animation — the bar simply exists while work is pending */
  @media (prefers-reduced-motion: reduce) {
    .progress[data-state="loading"] { animation: none; transform: translateX(0); opacity: 1; }
    .progress[data-state="done"]    { transition: opacity var(--duration-fast) var(--ease-standard); }
  }
</style>

<div class="progress" role="progressbar" aria-hidden="true"></div>

<script>
  const bar = document.querySelector(".progress");

  const start = () => {
    bar.removeAttribute("data-state");
    void bar.offsetWidth;              // restart the animation from -100%
    bar.dataset.state = "loading";
    bar.setAttribute("aria-hidden", "false");
    bar.setAttribute("aria-busy", "true");
  };

  const done = () => {
    if (bar.dataset.state !== "loading") return;
    bar.dataset.state = "done";
    bar.setAttribute("aria-busy", "false");
    bar.setAttribute("aria-hidden", "true");
  };

  // wire to whatever signals a wait: router events, fetch wrappers, form submits
  window.addEventListener("beforeunload", start);
  document.addEventListener("routechange:start", start);
  document.addEventListener("routechange:end", done);
</script>
```

**Pair it with a real error state.** The bar's honesty depends on the operation eventually ending. If a request can fail or hang, the failure must clear the bar and surface a message — otherwise a user watches a 60-second crawl toward a finish that will never come, which converts the pattern's one virtue into its worst lie. Set a timeout that calls `done()` and raises an error.

**Accessibility.** The bar is decorative reinforcement, not the announcement: it is `aria-hidden` at rest and carries `aria-busy` while running, so assistive tech hears the state change from the live region that owns the actual content, not from a bar with no meaningful value to read. Don't give it `aria-valuenow` — you don't have one, which is the whole point.
