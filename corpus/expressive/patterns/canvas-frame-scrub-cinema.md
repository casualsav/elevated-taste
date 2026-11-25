---
pattern: canvas-frame-scrub-cinema
from: studiofreight
provenance: ingested-skill — video-to-website + frontend-design (2026-06-24)
corpus: expressive
safety: spectacle-only
trigger: scroll-progress
tags: [hero, scroll, canvas, frame-sequence, scrollytelling, product-reveal, motion]
---

## What it is
A product or scene is pre-rendered to an **image sequence** (a video exported to ~150–300 frames) and the frames are painted one at a time onto a single fixed, full-viewport `<canvas>` whose frame index is bound to **scroll progress**. Scrolling *scrubs* the clip — the object rotates, assembles, or opens as you descend — while text sections animate in over and beside it. This is the Apple product-page lineage (AirPods / MacBook scroll reveals) generalized so the canvas is the stage for the *whole* page and the scrollbar is the transport. Frames draw in **padded cover** mode (`scale = max-fit × ~0.85`) over a canvas first flooded with a color **sampled from the frame's own edge pixels**, so the thin letterbox border is invisible and the product never clips into the header. Provenance: ingested from the `video-to-website` + `frontend-design` skills; the corpus kin is studiofreight (authors of the Lenis smooth-scroll library these recipes lean on) and the poster→reveal scroll-cinema studios already in the corpus (hellomonday, northkingdom).

## Why it works
A scrubbed frame sequence reads as *real footage you control* — more premium and more on-brand than any CSS/WebGL approximation, and **deterministic**: every frame is art-directed, so there's no runtime shader risk (this is §6 "pre-bake the spectacle into the art" taken to its logical end). It earns its weight only as **one quarantined surface** (§6): the canvas is the single loud thing and everything else stays flat text on a clean field.

Three reconciliations make it corpus-legal rather than slop:
- **Variety of direction, unity of hand.** The source recipe demands "4+ animation types, never repeat consecutively." Keep that variety of *entrance direction* so a long scroll never feels monotonous — but run every reveal on **one easing token and two registers** (§4). Vary the vector, not the curve.
- **The one honest exception to the scroll-listener ban.** A `<canvas>` cannot be driven by pure CSS — you must pick an integer frame and `drawImage` it. The safe shape is a **single `requestAnimationFrame` loop that *reads* a scroll-driven progress value** (a `ScrollTimeline`, or a cached scroll position sampled inside rAF) and redraws only when the integer frame changes — never a `scroll` event handler doing work on the hot path. Keep the draw transform-free and it stays cheap.
- **Never gate first paint** (§4 non-negotiable). Ship the hero + a **poster image as the LCP** immediately, decode the first ~10 frames eagerly for an instant scrub, stream the rest in the background, and only upgrade poster→canvas once enough frames exist. The source skills' "hide everything behind a loader bar until all frames load" is the one move to drop.

Like every scroll-jacked spectacle in the ledger, it must read perfectly as a normal-scroll static page (poster + real text) and gate behind reduced-motion + capability. On a product surface, reach for the production kin instead: `scroll-scale`, `clip-reveal`, `count-up-stat`, `sticky-pin-scrollytelling`.

## Producing the frames (authoring step)
```bash
# 150–300 frames is the sweet spot.  fps ≈ frames ÷ clip-seconds;  cap width at 1920.
ffmpeg -i product.mp4 -vf "fps=12,scale=1920:-1" -c:v libwebp -quality 80 frames/frame_%04d.webp
# short clip (<10s): native fps, cap ~300 · long (30s+): 5–10 fps · mobile: ≤150 frames @ ≤1280px
```

## Reference implementation
```html
<!-- Baseline ships to everyone: real headline + poster (the LCP) + real text sections.
     The canvas is layered on top ONLY after a capability + reduced-motion check. -->
<section class="hero">
  <h1 class="hero__title">Engineered to disappear.</h1>
  <p class="hero__lede">A scroll you operate, not just read.</p>
</section>

<figure class="stage" aria-hidden="true">
  <img class="stage__poster" src="/frames/frame_0001.webp" alt="" fetchpriority="high" />
  <canvas class="stage__canvas"></canvas>
</figure>

<main class="scroller">
  <section class="beat" data-enter="left"><h2>Cold, for 24 hours.</h2><p>…</p></section>
  <section class="beat" data-enter="right"><h2>One moving part.</h2><p>…</p></section>
  <section class="beat" data-enter="up"><h2>Sealed, then forgotten.</h2><p>…</p></section>
</main>

<style>
  .stage { position: fixed; inset: 0; margin: 0; background: var(--color-bg); }
  .stage__poster, .stage__canvas {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; display: block;
  }
  .stage__canvas { opacity: 0; transition: opacity var(--duration-slow) var(--ease-standard); }
  .stage.is-live .stage__canvas { opacity: 1; }
  .stage.is-live .stage__poster { opacity: 0; }

  .scroller { position: relative; z-index: 1; overflow-x: clip; } /* entrance offsets must never widen the page */
  /* Text lives in the outer side-zones so the product owns the optical center (§5). */
  .beat { min-height: 100svh; display: grid; align-items: center;
          padding-inline: 5vw 55vw; }                 /* enter="left" default */
  .beat[data-enter="right"] { padding-inline: 55vw 5vw; }
  .beat h2 { font-family: var(--font-sans); font-weight: var(--weight-bold);
             font-size: var(--text-5xl); line-height: var(--leading-tight);
             letter-spacing: var(--tracking-tight); }
  .beat p  { color: var(--color-muted); font-size: var(--text-lg); max-width: 32ch; }

  /* Narrow screens: the side-zone split leaves no measure — text takes the full stage. */
  @media (max-width: 40rem) {
    .beat, .beat[data-enter="right"] { padding-inline: 5vw; }
    .beat h2 { font-size: var(--text-4xl); }
  }

  /* ONE curve, varied direction — reveal each beat as it enters view (compositor only). */
  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
      .beat > * { animation: beat-in linear both; animation-timeline: view();
                  animation-range: entry 10% cover 35%; }
      .beat > :nth-child(2) { animation-delay: -0.08s; }   /* label → heading → body stagger */
      .beat[data-enter="left"]  > * { --from-x: -8%; }
      .beat[data-enter="right"] > * { --from-x:  8%; }
      .beat[data-enter="up"]    > * { --from-x:  0;  --from-y: 12%; }
    }
  }
  @keyframes beat-in {
    from { opacity: 0; transform: translate(var(--from-x,0), var(--from-y,8%)); }
    to   { opacity: 1; transform: none; }
  }

  /* Reduced motion / no JS: poster is the experience, text is static and present. */
  @media (prefers-reduced-motion: reduce) {
    .stage__canvas { display: none; }
    .beat > * { animation: none; opacity: 1; transform: none; }
  }
</style>

<script type="module">
  const stage  = document.querySelector('.stage');
  const canvas = stage.querySelector('.stage__canvas');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !canvas.getContext) { /* poster stays; we're done */ }
  else {
    const ctx = canvas.getContext('2d', { alpha: false });
    const COUNT = 240, SPEED = 1.8;           // SPEED>1 finishes the clip before the scroll ends
    const SCALE = 0.85;                        // padded cover: 0.82–0.90 sweet spot
    const url = i => `/frames/frame_${String(i + 1).padStart(4, '0')}.webp`;
    const frames = new Array(COUNT); let bg = '#000', cur = -1;

    const fit = () => {                         // crisp on HiDPI without a resize listener doing work
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
    };
    const sampleBg = img => { ctx.drawImage(img, 0, 0, 1, 1);
      const [r,g,b] = ctx.getImageData(0,0,1,1).data; return `rgb(${r},${g},${b})`; };
    const draw = i => { const img = frames[i]; if (!img) return;
      const cw = canvas.width, ch = canvas.height, iw = img.width, ih = img.height;
      const s = Math.max(cw/iw, ch/ih) * SCALE, dw = iw*s, dh = ih*s;
      ctx.fillStyle = bg; ctx.fillRect(0,0,cw,ch);            // flood first → seamless padded border
      ctx.drawImage(img, (cw-dw)/2, (ch-dh)/2, dw, dh); };

    const decode = async i => { try {
      const r = await fetch(url(i)); frames[i] = await createImageBitmap(await r.blob());
    } catch {} };

    // Two-phase load: first frames now (instant scrub), the rest in the background.
    (async () => { fit();
      for (let i = 0; i < 10; i++) await decode(i);
      if (frames[0]) { bg = sampleBg(frames[0]); draw(0); stage.classList.add('is-live'); }
      for (let i = 10; i < COUNT; i++) decode(i);
    })();

    // Progress on the compositor where available; read once per rAF, never a scroll handler.
    const tl = ('ScrollTimeline' in window) ? new ScrollTimeline({ source: document.documentElement }) : null;
    const progress = () => tl
      ? (tl.currentTime?.value ?? 0) / 100
      : scrollY / ((document.documentElement.scrollHeight - innerHeight) || 1);

    let raf;
    const tick = () => {
      const p = Math.min(progress() * SPEED, 1);
      const i = Math.min(COUNT - 1, Math.floor(p * COUNT));
      if (i !== cur && frames[i]) { cur = i; if (i % 20 === 0) bg = sampleBg(frames[i]); draw(i); }
      raf = requestAnimationFrame(tick);
    };
    addEventListener('resize', () => { fit(); cur = -1; }, { passive: true });
    raf = requestAnimationFrame(tick);
  }
</script>
```

Notes: the canvas is the only heavy surface — keep the page's color, type, and chrome flat around it (§6 quarantine, §7 restraint). Pair with `circle-wipe-hero-reveal` to hand the hero off to the canvas, and `scroll-bound-dark-interlude` for the one centered stats moment. Counters belong to `count-up-stat` — don't re-implement them here.
