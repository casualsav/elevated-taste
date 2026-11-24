---
direction: expressive
axis: aesthetic-flavor
one_liner: "Spectacle and motion — large display scale, dark drama, WebGL/3D, immersive scroll-driven motion, one rationed accent against a near-monochrome shell."
preset: ../tokens/presets/expressive.json
composes_with: [production, expressive]
exemplars:
  expressive: [lusion, exoape, dogstudio, basement, locomotive, obys, phantom, adoratorio, northkingdom, studiofreight, doronsupply, aristide, cuberto, hellomonday]
  production: [arc, framer, retool, posthog, sentry, railway]
---

# Expressive

> Spend the entire spectacle budget on **one** surface; pay flat everywhere else.

A flavor for brand experiences, product launches, and agency showcases that want to *feel* like an event — large scale, dark drama, motion that reads as craft. It is **orthogonal to corpus**, but it is the flavor most entangled with the corpus axis: its loudest moves (WebGL, scroll hijack, 3D) are the exact reasons `expressive` exists as a separate, quarantined corpus. Layer it on the **`expressive` corpus** for a real brand-experience; layer it sparingly on **`production`** only for a marketing/landing hero (`arc`, `framer`, `railway`), and keep the body of the page sober.

This is the one direction with a non-trivial **cost**. The signature below separates the cheap, transferable moves from the spectacle-only ones; the production-safety section is mandatory reading before you ship any of it.

## Signature (what makes something read "expressive")

1. **Extreme display scale, hierarchy from size not weight.** The defining move is a deliberate scale *gap*: body (~16–21px) jumps straight to a 100–250px display word, with the mid-scale empty and the whole thing in one near-single weight. Drama comes from the ratio and the whitespace.
   - `exoape`: 16px body → ~250px display (a ~9–16× jump) in one light sans; `lusion`/`basement`/`14islands`: bimodal "body vs huge, nothing between."
   - Tracking goes **negative as size grows** (display ~−0.04 to −0.05em) so giant glyphs stay optically set, not loose. *(Production caveat: cap the ratio nearer 4–6× in product UI and `clamp()` the display so it never overflows narrow viewports.)*

2. **Dark drama — but a *family* of darks, and off-white body.** The canvas is near-black; body copy is **off-white (~#e6e6e6), not pure white**, with `#fff` reserved for emphasis — true black + pure-white body vibrates and fatigues (and smears on OLED scroll). "Dark mode" is several low-chroma tints of the base, assigned per zone (`railway`: plum-black bg, blue-grey/teal/plum panels), not one flat `#0a0a0a`. *(Expressive ≠ always dark: `adoratorio`/`14islands`/`lusion` prove a light or lavender canvas is a valid expressive register — the **system** (one hue family, rationed accent, scale-driven hierarchy) is what makes it expressive, not the value.)*

3. **One rationed accent against an achromatic shell — color comes from content.** The chrome is monochrome; a single saturated hue touches <2–5% of pixels (often only as **edge + glow**, never a fill — `basement`'s #ff4d00 on hairlines only) — or there is *no* accent at all and every saturated pixel comes from the project thumbnails / one cinematic photo (`phantom`, `exoape`, `14islands`).

4. **The spectacle is one focal object, quarantined.** The expensive moment — a tumbling 3D cluster, a WebGL hero scene, a cinematic photo — lives in screen one (or in *one framed rectangle*); everything below is near-flat. `lusion`'s key decision: the 3D lives **inset in a rounded dark "viewport"** on a light page, so it reads as a deliberate object with a legible, crawlable DOM shell rather than a full-bleed WebGL gate. Concentrating the GPU/wow budget in one viewport buys "premium" cheaply and keeps scroll and legibility intact.

5. **Chrome as a thin HUD; content as the event.** Wordmark, menu, and a single CTA pill sit as small, edge-pinned, evenly-weighted labels (corner metadata, a live clock, registration ticks, a floating glass capsule); the optical center is reserved for the one moving thing. Restraint in the frame is what lets the spectacle land.

6. **Immersive, motion-led — one signature curve, long durations.** Pick **one** house easing and vary only duration (`14islands`: everything on `cubic-bezier(0.25,0.46,0.45,0.94)`; `adoratorio`: one ease-out-cubic). Reveals are slow and filmic (often 1–1.2s scroll-ins); micro-feedback stays snappy (60–300ms). Depth on dark/photographic backgrounds is built from **translucency + blur, never shadow** (`phantom`'s frosted-glass capsules — shadows vanish against black and photos).

## How to apply

```bash
node tokens/build.mjs --preset=expressive   # base + presets/expressive.json -> tokens.css
```

The preset (`tokens/presets/expressive.json`) overrides only the keys that carry the expressive signature: it inverts color to a **family of near-blacks with off-white body**, swaps the accent for a saturated electric hue, **squares the radii** (zero/near-zero), trades soft shadows for a single accent **glow**, pushes the display scale up and display tracking tight, lengthens reveal durations, and opens the macro spacing. Everything else inherits from the base. **Pair with the `expressive` corpus** (read `corpus/expressive/principles.md` + the named exemplars) for brand work; on `production`, apply only to a hero and keep the rest calm.

## Production-safety note (REQUIRED — most spectacle moves have real cost)

Every expressive technique is tagged **production-safe** or **spectacle-only**. Spectacle-only moves are invisible to crawlers/keyboards/reduced-motion users and carry GPU/CPU/payload cost; they must layer over a real DOM with a static fallback and a `prefers-reduced-motion` gate, and must never hold content or navigation *inside* the effect.

### Spectacle-only — gate, fall back, never load-bear
- **WebGL / 3D hero scene** (`lusion` tumbling cluster, `basement` wireframe room, `dogstudio` 3D render over a nebula) — *cost: high.* Persistent GPU/CPU load + battery drain on mobile, large asset payload, invisible to crawlers/screen-readers, ignores `prefers-reduced-motion` unless explicitly gated, and an **LCP/SEO hit** if the headline is canvas-bound. **Safe path:** ship a static poster image as the LCP element, lazy-init the canvas after load, gate on a capability + reduced-motion check; treat it as decoration over a real DOM hero.
- **Continuous ambient motion** (a never-stopping tumble/parallax) — *cost: high.* Same GPU/battery profile even with no interaction; gate and provide a still fallback.
- **Scroll-driven parallax / smooth-scroll inertia** (`exoape`, Locomotive Scroll) — *cost: medium-high.* Hijacks native scroll (breaks scrollbars, find-in-page, keyboard paging; motion-sickness/a11y concern), janks on low-end devices, invisible to reduced-motion users. **The page must read perfectly as a normal-scroll static layout without it**; always provide a reduced-motion path back to native scroll.
- **Long (>1s) reveal/assembly timings** — *cost: perceived latency.* Second-plus animations delay content settle and hurt INP/perceived performance; fine on a studio splash, costly where users have a task. Keep skippable; never block first paint or critical content behind the reveal. *(The discipline — one curve everywhere — is fully transferable; the **length** is the indulgence: consider ~0.6s in production.)*
- **Dormant-until-hover "ghost" index** (`dogstudio`, `14islands` opacity-decay) — *cost: a11y.* Resting contrast (~10–15%) fails WCAG, hides links from low-vision/touch users, and hover-only reveal is invisible on touch. **Safe version:** keep the giant scale + reveal-*delight*, but set the resting state to a legible muted token and surface imagery on **focus** too; never fade the only path to a page.
- **Animated text-built marks** (`adoratorio` per-glyph ASCII ring) — *cost: dozens of animating nodes, no semantic payload.* Gate behind reduced-motion; render the underlying phrase as readable text so it degrades to content. *(The **static** ring/mark is safe; the **motion** is show.)*
- **Glyph-encoded footer** (`locomotive` dingbats as characters) — *cost: a11y.* Decorative glyphs standing in for real digits/letters risk screen-reader gibberish, copy-paste breakage, contrast traps. **Render real semantic text; keep glyphs as `aria-hidden` ornament around it** — never let a clover *be* the comma.
- **Springy overshoot easing** (negative-control-point cubic-bezier) — *spectacle-only-ish.* One reveal gesture = character; applied to every transition it reads toy-like and adds latency. Ration to a single signature moment, gate behind reduced-motion.

### Production-safe — the transferable wins
- **Scale-only hierarchy with a fixed body size** — *safe, recommended* (cap the ratio in product UI).
- **Size-scaled negative letter-spacing** on display — *safe* (verify legibility at the tightest setting).
- **One rationed accent on an achromatic field** (<5% coverage, or accent as border/glow only) — *safe, recommended* — but don't let color be the *only* signifier of an interactive/focus state.
- **Off-white (#e6e6e6) body on dark; a family-of-darks per zone** — *safe, recommended* over pure-white-on-#000 (prefer `#0a0a0a` to true `#000` as the default ground).
- **Inset framed canvas shell** (the rounded dark viewport *frame*, `lusion`) — *safe*: the framing is plain CSS; only the contents are WebGL, so you can lazy-mount and swap a poster. This is the **safe way to ship "3D hero" energy**.
- **Frosted-glass elevation** (`backdrop-filter: blur`, `phantom`) — *safe with a perf + a11y caveat*: it's the right elevation model on dark/photographic backgrounds, but `backdrop-filter` is a real compositing expense (keep blurred surfaces few and mostly static), and text on a translucent fill over arbitrary media can fail contrast — back critical text with a minimum-opacity scrim.
- **Full-bleed photographic hero with type on the image's dark zone** (`exoape`, `locomotive`) — *safe with discipline*: legibility depends on the *actual* art; pair with a gradient scrim / `text-shadow` fallback, set a solid bg behind the image for slow connections, and `fetchpriority="high"` the LCP image. Spend zero color budget on the UI so the photo themes the page for free.
- **Edge-pinned HUD chrome, corner metadata, live clock, registration ticks** — *safe*: cheap text that sets tone; keep edge labels in logical DOM order, sized for zoom/contrast, 44px tap targets; mark the ambient clock `aria-hidden`.
- **Persistent floating capsule nav** — *safe*: thumb-reachable and layout-free; ensure it doesn't occlude the bottom edge and is keyboard-reachable in a sensible tab order.
