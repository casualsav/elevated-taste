---
slug: noth
url: https://www.noth.in
source: landbook
corpus: production
captured: 2026-09-28
award_type: Gallery
score: null
tags: [portfolio, agency, creative-studio, monochrome, motion, gsap, webflow, dark]
when_to_use: [portfolio, agency, interactive-showcase, hero]
directions: [minimalist, editorial, expressive]
layout: [scroll-theater, editorial-columns]
a11y: [reduced-motion-ignored, alt-coverage-high, tap-targets-risky, focus-visible-missing]
provenance:
  gallery_url: https://land-book.com/websites/100445-nothin-home
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [blend-mode-adaptive-chrome, scroll-scatter-headline]
tokens_snapshot: ../tokens/noth.json
screenshots: ../screenshots/noth/
---

## What works (transferable principles)
- **Two-ink system (pure black + pure white) does all the heavy lifting; sections invert instead of tint.** There is no brand color at rest — the palette is `#000`/`#fff` with a single muted gray (`rgb(142,142,142)`) for meta labels. Hierarchy and rhythm come from *flipping the ground* section-to-section (white hero → black works → black studio) rather than adding hues. Transfers to any brand that wants maximum contrast and zero palette-maintenance: the "color system" is which side is ink.
- **One chrome layer stays legible over both grounds via `mix-blend-mode: difference`.** The fixed nav, the sticky "WORKS" word, and the fake-hero caption are all transparent layers with `mix-blend-mode: difference` — so a white glyph reads black over white sections and white over black/photo sections automatically, with no scroll listener recoloring anything. This is the single most reusable idea here (see `blend-mode-adaptive-chrome`).
- **Scale contrast, not weight, builds the hierarchy.** Body is a quiet 14px; section heads jump to 40–60px; the hero wordmark is a full-bleed SVG spanning the viewport. It's one grotesque (PP Neue Montreal) at essentially one weight (500) — the 5–6× size jump does the separating, so the page stays calm even while shouting. Reusable in any editorial/product surface.
- **Monospace as the "UI voice."** Every meta signal — project eyebrows, the cursor pill, index counters `(07)`, `© 24.26` — is set in IBM Plex Mono, uppercase, `0.03em` tracking, in gray. Pairing a humanist grotesk for content with a mono for system chrome cleanly separates "editorial" from "instrument" without a second display face. Transfers to dashboards, portfolios, docs.
- **Asymmetric two-column work list beats a card grid.** Projects are a staggered left/right editorial column — mono eyebrow + one-line tagline paired with a single large thumbnail that parallaxes — instead of a uniform 3-up card wall. It reads as a curated magazine spread and dodges the generic "three feature cards." Reusable for any small, high-craft portfolio or case-study index.
- **Cinematic full-bleed video as the emotional beat between text sections.** Rather than a fake dashboard mockup, the studio's "why" is carried by sound-on film (elevator, waiting room) that scales from full-bleed to a framed inset on scroll — the imagery is the argument, the copy is a caption. Transfers to brand/agency sites that have real motion assets.

## Design-system read
- **Type:** One grotesque (PP Neue Montreal, weights 400/500, 700 for mono-ish labels) + IBM Plex Mono for chrome. Scale is roughly a 1.5 ratio stepped hard: 14px body → 0.75rem mono labels → h3 2.5rem → h2 3.75rem → h1/hero 5rem, then a viewport-width SVG wordmark on top. Display tracking is negative (`-0.01em` to `-0.03em`); mono labels track positive (`0.03em`). No fluid `clamp()` — fixed rem steps with a mobile collapse.
- **Color:** Duotone. `bg #fff` / `fg #000` on the hero and studio-copy blocks; the ground inverts to `#000` for works, video, and glitch sections. Single muted `rgb(142,142,142)` for eyebrows/meta. Borders are `rgba(255,255,255,0.4)` hairlines on dark (the pill button). No gradients except a black bottom scrim over video. No dark-*mode* — it's a duotone that alternates, not a re-theme.
- **Spacing rhythm:** 8px-ish base expressed in rem; page padding `1.25rem`; component gaps cluster at 0.375–1rem; section blocks are tall (900–3151px) with generous vertical air. Whitespace, not dividers, separates ideas.
- **Layout system:** 12-column desktop grid (with 2- and 3-col meta rails) collapsing to 1-col under 768px; container max 1440px, text measure ~504px. Mostly flexbox (63 flex vs 11 grid) with a few explicit grids. Breakpoints 479/767/768/991/992 (Webflow defaults).
- **Layering / page architecture:** Not a single flat scroll. Three cooperating layers: (1) fixed/sticky **blend chrome** (`mix-blend-mode: difference`, z-1001 nav + z-10 sticky word) that recolors itself against whatever scrolls under it; (2) **pinned scroll-theater sections** — `glitch-text-sticky-w` is `position:sticky; top:0; min-height:100vh` holding a video while a headline's letters scatter, and video/musée backdrops scale on scroll-progress; (3) the normal content flow. `has_static_backdrop`/`has_blend_overlay` are false — depth comes from sticky pinning + blend, not a fixed world behind glass.
- **Motion / easing intent:** Base transitions are a restrained `0.3s/0.4s ease` for hover/opacity, but the scroll story is GSAP ScrollTrigger + Webflow IX2 driving parallax and per-letter transforms (rafCalls ~4200 — heavy). Motion communicates "protean / everything is in flux": letters fly apart, video collapses into frame, 3D objects drift. Reduced-motion is **not** respected — a production caveat.
- **Density:** Low text density, high spatial drama. Each screen commits to one idea (one headline, one film, one project) with lots of void around it.
- **Hierarchy:** Dominant device is **scale + position** (giant type, deliberate placement) reinforced by the ink flip; weight and color are nearly constant.
- **Restraint:** No accent color, no shadows, no rounded cards, no illustration system, no gradient mesh. Two inks, one type family + a mono, and motion.

## Interaction & motion (techniques)
- **Blend-mode adaptive chrome** — *Trigger:* none (passive, always-on). *Mechanism:* fixed/sticky nav + word layers are transparent with `mix-blend-mode: difference`, so their fill inverts against the section pixel behind them; no JS recolors on scroll. *Reads as:* one persistent frame that "knows" the background. *Transfers to:* any site with alternating light/dark or photographic sections that needs persistent, always-legible chrome. *Safety:* **production-safe** (compositor-only; caveat: `difference` over mid-gray/photo can produce muddy mid-tones — verify contrast). See `blend-mode-adaptive-chrome`.
- **Scroll-scatter headline** — *Trigger:* scroll-progress inside a sticky-pinned section. *Mechanism:* a headline is split into per-letter spans; each letter's `opacity` (1→0) and `transform: rotate()` (±2–20°, small drift) is tied to scroll progress while the section is pinned `top:0` over a video. *Reads as:* language dissolving / "beyond words." *Transfers to:* a single hero or manifesto beat — one per page. *Safety:* **spectacle-only** (many simultaneously animated nodes = main-thread + layout cost; motion-sickness risk; MUST gate on reduced-motion). See `scroll-scatter-headline`.
- **Full-bleed→framed video scale** — *Trigger:* scroll-progress. *Mechanism:* a `<video>` wrapper's `transform: scale()` is driven from ~1.4 (full-bleed) down to ~0.35 (a small framed inset) as the section scrolls, with a companion backdrop image scaling 1.8→1. *Reads as:* "stepping back" from an immersive scene into a gallery frame. *Transfers to:* brand/agency reveals with real film. *Safety:* **production-safe** if animating `transform` only (it does); heavy assets need lazy/poster handling.
- **Parallax project thumbnails + drifting 3D objects** — *Trigger:* scroll-progress. *Mechanism:* work images and decorative render objects (`chewing-gum`, `bonbon`, `etoile`) get differing `translate` rates for depth. *Reads as:* a physical, layered space. *Transfers to:* editorial galleries. *Safety:* **production-safe** in moderation (transform-only), but respect reduced-motion.
- **Cursor-follow "explore" pill** — *Trigger:* mousemove over work thumbnails (8 mousemove listeners). *Mechanism:* an absolutely-positioned mono pill tracks the pointer inside project media. *Reads as:* an affordance that the image is a link. *Transfers to:* portfolio/case-study hovers. *Safety:* **production-safe** (pointer-only; desktop enhancement, degrades to a normal link on touch).

## Production-safety note
- `blend-mode-adaptive-chrome`, `full-bleed→framed video scale`, parallax, and the cursor pill are **production-safe** (compositor/transform-only). The **scroll-scatter headline** is **spectacle-only**: dozens of concurrently transformed letter nodes plus rAF-heavy scroll driving (~4200 rAF calls) tax the main thread and can trigger motion sickness. Reduced-motion is **not** honored on the live site — any reuse MUST add the `prefers-reduced-motion` fallback the patterns include.

## Extracted patterns
- `blend-mode-adaptive-chrome` — a persistent nav/label layer that stays legible over light and dark sections using `mix-blend-mode: difference`, no scroll JS.
- `scroll-scatter-headline` — a sticky-pinned headline whose split letters fade + rotate away on scroll-progress over a video backdrop (reduced-motion aware).
