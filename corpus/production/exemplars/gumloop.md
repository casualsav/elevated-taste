---
slug: gumloop
url: https://www.gumloop.com
source: landbook
corpus: production
surface: site
captured: 2026-10-26
award_type: Gallery
score: null
tags: [ai, b2b, saas, agents, enterprise, product-marketing, light]
when_to_use: [landing, product-marketing, feature-section, hero, interactive-showcase]
directions: [minimalist, soft]
layout: [bento, scroll-theater]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high]
provenance:
  gallery_url: https://land-book.com/websites/101533-gumloop-build-ai-agents-for-work
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [sticky-narrative-channel-list, tabular-metric-logo-band]
tokens_snapshot: ../tokens/gumloop.json
screenshots: ../screenshots/gumloop/
---

## What works
- **Monochrome shell, saturated accents quarantined to the product.** The page chrome is near-pure white (#fff), ink-black text (`--brand-ink`, lab 8.7), and a single faint hairline (lab 93.3) repeated 4,900+ times — one border value does all the dividing. Every strong hue (blue #0190ff, indigo, pink, amber, green) lives *inside* the product-demo illustrations, category chips, and charts, never in the layout frame. The effect: a calm, trustworthy B2B surface that still feels alive, because color reads as "the software" rather than "the marketing." Transfers to any product-led landing that wants energy without a candy-colored page.
- **Hierarchy from scale + color, almost never weight.** 4,300 of ~5,000 text nodes are weight 400; 500 handles emphasis; 600 is nearly unused. The 48px/16px display-to-body jump (3×) and ink-vs-muted color contrast carry the whole ladder. Dropping weight as a variable keeps headings from shouting and makes dense feature copy read as one even surface. Reusable anywhere you're tempted to reach for bold.
- **Size-proportional negative tracking.** Tracking tightens as type grows — `-1.2px` at 48px, `-0.9px` at 36px, `-0.45px` at 18px, `-0.3px` at 12px — so large headings stay optically tight while body stays open. A measured ramp, not one global letter-spacing. Transfers to any type system with a wide size range.
- **`tabular-nums` everywhere numbers matter.** 95 nodes opt into tabular figures — the proof stats (18+, 339K+), pricing, dashboard counters, chart labels. Numbers line up in columns and don't jitter when they animate. Cheap, invisible-until-you-notice craft that makes data-dense marketing feel engineered.
- **"Living diagram" product demos instead of static screenshots.** Nearly every feature is illustrated by a small self-animating UI (orbiting connector rings, a radar sweep, dash-flowing trace lines, a breathing agent glow, a cursor that moves itself). 68 `@keyframes` and 1,290+ rAF callbacks, but each loop is tiny and contained inside its card. The page argues "this product is in motion" without a single video. Transfers to any tool whose value is a process, not a surface.
- **One dark band to punctuate a long light page.** A single near-black section (`#control`, `bg-brand-ink`) with blur-backed glass chips interrupts ~12,000px of white to stage the "enterprise controls" moment. Depth and gravity exactly where the pitch turns serious; everywhere else stays flat and fast.

## Design-system read
- **Type:** GeistSans throughout (GeistMono for figures, Caveat for a few handwritten annotations, Gellix for a handful of display lines). Scale ~1.2–1.25 ratio, display 48px→mobile 36px, body 16px/24px (1.5). Hierarchy = scale + color; weight held at 400/500. Fluid type with a size-proportional tracking ramp.
- **Color:** White bg; `--brand-ink` lab(8.7) ink text; `--brand-neutral-muted` lab(59) for secondary; a single hairline border lab(93.3). Accent is a cool blue (`#0190ff`) in chrome, but the real palette is a wide, highly-saturated multi-hue set (pink/purple/indigo/amber/green) reserved for category tags, demo UI, and data-viz. Roles are strict: layout is monochrome, "product" is colorful.
- **Spacing rhythm:** 8px base (gaps cluster at 4/6/8/12/16). Section padding steps 64→80→128px (`py-8/py-10/py-16`) responsively. Whitespace, not rules, separates sections.
- **Layout system:** flex-dominant (1,340 flex vs 157 grid), 1–4 column grids, max container 1440 with 56–60rem reading columns inside. Dominant archetype is an asymmetric **bento** of product-demo cards + split text/demo rows, with one long **scroll-theater** (sticky narrative) stretch. Breakpoints ~468/640/1024; nav collapses to a hamburger on mobile.
- **Layering / page architecture:** single flat white scroll — `has_static_backdrop:false`, `has_blend_overlay:false`. Depth comes from four deliberate sticky/fixed pieces, not a parallax world: a transparent pinned nav (z-50), a sticky narrative text column (`top-[16vh]`), one dark inset band, and a bottom fixed CTA strip (z-100, pointer-events-none gradient fade + floating button). Glass is minimal: `backdrop-filter: blur(8px)` on two chips over the dark band only.
- **Motion / easing intent:** base durations 150/200/300/500ms; easings favor `cubic-bezier(0,0,0.2,1)` (decel entrance) and a dramatic `cubic-bezier(0.625,0.05,0,1)` for signature sweeps. Motion communicates "the software is working" — ambient, looping, contained. `prefers-reduced-motion` respected (10 PRM rules, `motion-reduce:` utilities).
- **Density:** high — long page, many feature cards, dense dashboards — kept legible by the monochrome frame, generous section padding, and reading columns capped well below full width.
- **Hierarchy:** scale first, color second, position third; weight is deliberately *not* a hierarchy lever.
- **Restraint:** no page-level gradient wash, no colored chrome, no hero video, one border value, one accent in the shell. All the visual richness is pushed into the product illustrations.

## Interaction & motion
- **Sticky-pinned narrative with sequential in-view highlight** — *Trigger:* in-view (IO, threshold ~0.3–0.4, `rootMargin` biased with `-10%/-15%/-20%` bottom). *Mechanism:* a heading column pins (`position:sticky; top:16vh`) while a tall list of channel rows (Slack / Email / Text Message) scrolls past; the row entering a center band gains a tinted background + ink text while the others sit muted — `background` and `color` crossfade per row. *Reads as:* a guided tour; one idea lit at a time. *Transfers to:* any "works where you work" / multi-surface feature list. *Safety:* **production-safe** (opacity/color only, IO-gated). See `patterns/sticky-narrative-channel-list.md`.
- **In-view fade-rise entrance** — *Trigger:* in-view. *Mechanism:* 47 IntersectionObservers over 166 targets reveal cards with a short `opacity 0→1` + `translateY` settle as they cross a bottom-margined root. *Reads as:* the page assembling just ahead of the reader. *Transfers to:* any sectioned landing. *Safety:* **production-safe**; animate transform/opacity only.
- **Ambient "living diagram" loops** — *Trigger:* load/in-view, then infinite. *Mechanism:* bespoke CSS `@keyframes` inside demo cards — `orbit-spin`/`orbit-ring-expand`, `radarSpin`, `trace-dash-flow`, `comet-sweep`, `browser-window-agent-glow-breathe`, `move-along-path`. Each is small and clipped to its card. *Reads as:* the product running by itself. *Transfers to:* process/automation products. *Safety:* **production-safe when contained + reduced-motion-gated**; becomes spectacle (and battery/main-thread cost) if many run full-bleed at once — here 1,290+ rAF calls is the ceiling to watch.
- **Scroll-progress sweeps & rotation** — *Trigger:* scroll-progress. *Mechanism:* a few elements map scroll position to `transform` — a `137°` SVG rotation, `shimmer-sweep-band`/`shimmer-sweep-text` translating, destructive-badge opacity fade. *Reads as:* subtle depth tied to reading pace. *Transfers to:* a single hero accent; use sparingly. *Safety:* **production-safe** at this dosage (transform/opacity); scroll-linked work is spectacle-risk if overused.
- **Cursor-follower dots** — *Trigger:* mousemove. *Mechanism:* three `size-8 rounded-full` elements lag the pointer inside a demo (16 mousemove listeners). *Reads as:* playful "multiplayer presence." *Transfers to:* collaboration demos only. *Safety:* **spectacle-only** — main-thread mousemove; gate behind reduced-motion and keep it inside one card.

## Production-safety note
- The resting design is fully production-safe: flat white, one accent, IO-gated reveals, reduced-motion respected. The risk surface is *quantity* of ambient loops — 68 keyframes and 1,290+ rAF calls is a lot of concurrent animation; contained per-card and reduced-motion-gated here, but a lighter hand is safer when porting. Cursor-followers and scroll-linked sweeps are the only genuinely spectacle-tier pieces. One a11y caveat: 123 small tap targets flagged — the dense chip/icon UI needs larger hit areas when reused.

## Extracted patterns
- sticky-narrative-channel-list — pinned heading beside a scrolling list whose centered item lights up; for "works everywhere you do" feature tours.
- tabular-metric-logo-band — oversized `tabular-nums` proof metrics over a greyscale logo wall in a flat monochrome band; for B2B social proof.
