---
pattern: rack-focus-image-load
from: a24
corpus: expressive
safety: spectacle-only
trigger: load
tags: [motion, media, image-reveal, cinematic]
---

## What it is
An image arrives **out of focus and slightly oversized**, then resolves: a heavy blur plus a small scale-up settles to rest over roughly 600ms while the bitmap itself fades in. It reads as a camera pulling focus rather than a picture popping into a slot — which is why a film studio uses it and a data table should not.

## Why it works
The usual image-in reveal is `opacity: 0 → 1` or a fade-and-rise. Both announce *a thing loaded*. Blur-to-sharp announces *a thing came into view*, because defocus is the one image transform every viewer already reads as optical rather than digital. Pairing it with a `scale(1.04) → scale(1)` settle supplies the second half of the cue: focal length changing, not a card sliding.

The mechanism is two independent transitions on two elements — `filter` + `transform` on the wrapper, `opacity` on the `<img>` — so the blur can start before the bitmap has decoded and the sharpening lands exactly as the pixels do. The reveal is fired by a class toggle after `img.decode()`, gated behind an `IntersectionObserver` so below-fold media doesn't pay the cost until it's near the viewport. It runs **once** per image and is never re-driven by scroll.

**Cost, honestly:** blur radius × painted area. A 28px blur across a viewport-filling photograph is a real GPU and paint bill, it re-rasterises on resize, and a blur that *animates* on the compositor is not free the way `transform`/`opacity` are. That is why this is tagged spectacle-only: budget it for hero and portfolio media, cap the radius on large surfaces, keep `will-change` scoped to the transition window, and drop to a plain opacity fade under reduced motion — a defocus-to-focus sweep is exactly the kind of pseudo-optical movement vestibular users ask you to turn off.

## Reference implementation
```html
<!-- framework-neutral; IntersectionObserver + CSS transitions, reduced-motion aware -->
<style>
  .rack-focus {
    position: relative;
    overflow: hidden;                       /* contain the blur bleed */
    background: var(--color-plate, #eeeeee);/* the ground the blur resolves onto */
  }

  /* Resting (revealed) state is the DEFAULT — if JS never runs, the image is simply correct. */
  .rack-focus__frame {
    filter: none;
    transform: none;
    transition: filter var(--duration-media-reveal, 600ms) ease-in,
                transform var(--duration-media-reveal, 600ms) ease-in;
  }
  .rack-focus__frame img {
    display: block;
    width: 100%;
    height: auto;
    opacity: 1;
    transition: opacity var(--duration-fast) linear;
  }

  /* Pre-reveal state, applied by JS only when it intends to animate. */
  .rack-focus.is-defocused .rack-focus__frame {
    filter: blur(var(--blur-defocus, 28px)) saturate(110%);
    transform: scale(var(--defocus-scale, 1.04));
    will-change: filter, transform;
  }
  .rack-focus.is-defocused .rack-focus__frame img { opacity: 0; }

  /* Once settled, stop paying for the compositor hint. */
  .rack-focus.is-settled .rack-focus__frame { will-change: auto; }

  @media (prefers-reduced-motion: reduce) {
    /* No defocus, no scale — a plain opacity fade, or nothing at all. */
    .rack-focus.is-defocused .rack-focus__frame { filter: none; transform: none; }
    .rack-focus__frame { transition: none; }
  }
</style>

<figure class="rack-focus">
  <div class="rack-focus__frame">
    <img src="/media/still.jpg" alt="Two characters facing each other at a wedding reception" decoding="async">
  </div>
</figure>

<script>
  const wantsMotion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;

  const reveal = (figure) => {
    const img = figure.querySelector('img');
    const settle = () => {
      figure.classList.remove('is-defocused');
      figure.addEventListener('transitionend', () => figure.classList.add('is-settled'), { once: true });
    };
    // Sharpen exactly when the bitmap is ready, not when the network says so.
    (img.decode ? img.decode().catch(() => {}) : Promise.resolve()).then(() => {
      requestAnimationFrame(settle);
    });
  };

  const io = new IntersectionObserver((entries, obs) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      obs.unobserve(entry.target);            // once per image, ever
      if (wantsMotion) entry.target.classList.add('is-defocused');
      reveal(entry.target);
    }
  }, { threshold: 0.1, rootMargin: '25% 0px' });

  document.querySelectorAll('.rack-focus').forEach((f) => io.observe(f));
</script>
```

Notes: the revealed state is the CSS default and `is-defocused` is added by JS — so a failed script, a blocked bundle, or a reduced-motion user all get a correct, sharp image instead of a permanently blurred one. Never drive `filter` from a scroll handler; this is a one-shot load reveal. On very large surfaces halve `--blur-defocus` (a 28px blur on a 1440×900 still is roughly 4× the paint cost of 14px) and consider skipping the effect entirely below a viewport-width threshold.
