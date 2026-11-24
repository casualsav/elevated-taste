# Motion — Transferable Technique

Framework-neutral principles first. GSAP / Motion (`motion/react`) noted as implementation options. This is about *how things move*, not which sections to build (see `corpus/` for sections).

Motion is gated by `MOTION_INTENSITY` (1 = static, 10 = cinematic/physics). Below ~4 the page is `:hover`/`:active` only and reduced-motion is effectively the default. Every animation must be **motivated** — communicate hierarchy, sequence/storytelling, feedback, or a state change. "It looked cool" is not a reason; if you can't name the reason in one sentence, cut it.

---

## 1. Easing & Duration Intent (use the tokens)

Map every transition to a **token**, never an ad-hoc number. Tokens (`tokens/tokens.json`):

| Token | Value | Use for |
|---|---|---|
| `var(--duration-fast)` | 120ms | Micro-feedback: hover tint, `:active` press, focus ring, checkbox/toggle. |
| `var(--duration-base)` | 200ms | Default UI state change: button, card hover lift, dropdown, tab switch. |
| `var(--duration-slow)` | 320ms | Larger moves: modal/nav reveal, accordion, scroll-entry, image scale. |
| `var(--ease-standard)` | `cubic-bezier(0.2,0,0,1)` | Anything that starts **and** ends on screen (hover, toggle, color, in-place transform). The everyday curve. |
| `var(--ease-entrance)` | `cubic-bezier(0,0,0,1)` | Things **entering** (scroll-reveal, modal open, items appearing). Decelerate-in: fast start, soft landing. |
| `var(--ease-exit)` | `cubic-bezier(0.3,0,1,1)` | Things **leaving** (dismiss, fade-out, modal close). Accelerate-out. |

**Intent rules**
- The bias for premium feel: enter slow + soft, exit quick. Asymmetric durations read as physical mass.
- Never `linear` and never `ease`/`ease-in-out` for UI — instant or generic curves are the #1 "cheap" tell. `linear` is allowed *only* for continuous loops (marquee, spinner, scrub `ease:"none"`).
- Bigger travel → longer duration. A 4px hover lift at `--duration-slow` feels sluggish; a full-screen overlay at `--duration-fast` feels janky. Match duration to distance.
- Spring physics (`type:"spring", stiffness:~100, damping:~20`) is the alternative to bezier for playful/agency briefs — pick one model per project, don't mix linear easing in.

```css
.btn { transition: transform var(--duration-fast) var(--ease-standard),
                   background-color var(--duration-fast) var(--ease-standard); }
.modal[data-open] { animation: rise var(--duration-slow) var(--ease-entrance); }
```

---

## 2. Scroll-Reveal

Default reach: lightweight **enter-on-view**, not scroll-hijack. Items fade-up as they cross the viewport, once.

- **Transform recipe:** `opacity 0 → 1` + `translateY(16–24px) → 0`. Optional `blur(8px) → 0` for a premium "focus-in" at higher motion dials. Duration `--duration-slow`, ease `--ease-entrance`.
- **Stagger:** sequence siblings by index — `delay: i * 60–100ms` (Motion `staggerChildren`, or CSS `animation-delay: calc(var(--index) * 80ms)`). Stagger only where order carries meaning (a list revealing top-to-bottom); a 2×2 grid popping in row-major is fine, random delays are not.
- **Implementation order:** CSS `animation-timeline: view()` (cheapest, no JS) → Motion `whileInView` with `viewport={{ once:true, amount:0.3 }}` → GSAP `ScrollTrigger` only when you need pin/scrub.
- **Fire once.** Re-animating every time an element re-enters is nauseating; use `once: true`.

**Banned for scroll work (hard):** `window.addEventListener("scroll", …)`, custom `window.scrollY` math in React state, and `requestAnimationFrame` loops that touch React state — all re-run every frame and jank on mobile. Use `useScroll()` / `useMotionValue` / ScrollTrigger / IntersectionObserver / CSS scroll-driven animations instead.

---

## 3. Hover & Press Physics

Every interactive element reacts; static clickables read as unfinished.

- **Cards/images:** lift + scale on hover — `translateY(-2 to -4px)`, image `scale(1.03–1.05)` inside an `overflow-hidden` frame so the image grows but the card edge stays crisp. `--duration-base` / `--ease-standard`.
- **Press feedback (tactile):** on `:active`, `scale(0.98)` or `translateY(1px)` — simulates a physical push. `--duration-fast`. Apply to every button.
- **Button-in-button kinetics:** a nested trailing-icon circle translates diagonally + scales slightly on `group-hover` while the whole button presses on `:active` — internal tension reads expensive (see `components.md`).
- **Magnetic / directional-aware / tilt:** spectacle-tier. Drive **outside React render** with motion values (`useMotionValue`/`useTransform`), never `useState` — per-frame state re-renders the tree and collapses on mobile. Reserve for `MOTION_INTENSITY > 5` premium/agency briefs.
- Animate **only `transform` and `opacity`**. Never animate `top/left/width/height` (layout thrash). `will-change: transform` only on elements actively animating.

---

## 4. Production-Safe vs Spectacle-Only

| Production-safe (ship widely) | Spectacle-only (one per page, premium briefs, motivated) |
|---|---|
| Hover lift / image scale / press | Scroll-pinned sticky-stack (cards pin & shrink) |
| Fade-up scroll-reveal + stagger | Horizontal scroll-hijack (vertical → horizontal pan) |
| Nav/dropdown/accordion reveal | Magnetic buttons, hover-aware fill, tilt cards |
| Skeleton shimmer, focus transitions | Kinetic-type, text scramble/mask, scroll-progress SVG draw |
| One marquee, slow + `linear` | WebGL / 3D / Locomotive sequence scroll |

**Rules of restraint**
- **Marquee: max one per page.** Two reads as lazy filler. `MARQUEE` text is decorative — `prefers-reduced-motion` pauses it.
- **Not every section needs motion.** Informational sections stay still; perpetual loops (pulse/float/shimmer) only where they signal something live (status, AI feel).
- **"Motion claimed, motion shown."** If the dial is >4, the hero/key sections must actually move. If you can't ship working motion in scope, drop the dial to 3 and ship clean static — never half-built motion (cut-off triggers, jumpy enters, missing cleanups).
- **Scroll-hijack canon:** pin with `start:"top top"` (not `"top center"`/`"top 80%"`) so the section is locked before it animates; `scrub` the inner track; `invalidateOnRefresh: true`. Always isolate GSAP/WebGL in a `'use client'` leaf with `useEffect`/`gsap.context` cleanup. Never mix GSAP or Three.js with Motion in the same component tree — they fight for frames.

---

## 5. `prefers-reduced-motion` (a11y — mandatory)

**Any motion above `MOTION_INTENSITY 3` must honor `prefers-reduced-motion`. Non-negotiable.** Vestibular users get sick from parallax, scroll-hijack, big translates, and infinite loops.

- **Collapse to static/instant**, don't merely speed up: disable parallax, scroll-hijack, magnetic physics, marquees, and infinite loops. Opacity-only fades are usually acceptable to keep; large positional moves are not.
- **Motion / React:** gate with `useReducedMotion()` — set `initial={reduce ? false : {…}}` and skip pins/scrubs entirely when reduced.
- **CSS:** wrap motion in `@media (prefers-reduced-motion: no-preference){ … }`, or add a kill-switch block:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- Related fallbacks: `prefers-reduced-transparency` → solid-fill instead of glass; reserve image/embed space so reveals don't cause CLS (target < 0.1).
