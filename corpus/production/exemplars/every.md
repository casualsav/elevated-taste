---
slug: every
url: https://every.to
source: refresh
corpus: production
surface: site
captured: 2026-08-05
award_type: null
score: null
tags: [ai, media, publishing, editorial, dark, subscription, b2b, serif]
when_to_use: [editorial, blog, landing, product-marketing, footer]
directions: [editorial, minimalist]
layout: [content-grid, editorial-columns]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [dark-broadsheet-rule-grid, mono-page-accent-band]
tokens_snapshot: ../tokens/every.json
screenshots: ../screenshots/every/
---

## What works

- **Two superfamilies, split by job — not one family scaled.** A warm transitional serif (`Signifier`) owns every headline and does all the expressive work, including italic letter-swaps on emphasis words ("Think Like a *Designer*", "Start *Executing* It"); a neutral grotesque (`Switzer`) owns kickers, bylines, nav, and buttons. Hierarchy is created by the **serif↔sans role contrast plus scale**, so weight can stay almost flat — the page is 400/500 throughout (600/700 appear ~14 times total). Transfers to any content product that wants a magazine's editorial voice without a single bold anywhere: assign voice to the serif and machinery to the sans, and let the register switch do the ranking work.

- **Dashed hairlines replace cards as the entire structural system.** Sections and rows are divided by 1px *dashed* rules in a low-contrast gray (`#3c3c3c` on near-black) — no fills, no radii, no shadows on any content block (`transparent_height_pct: 94`). A card bundles four decisions (fill, border, radius, shadow) to say one thing, "separate"; a dashed rule says exactly that and nothing more, so the eye parses headlines instead of containers. It's what lets the homepage carry ~50 articles across a dozen sections and still read as a printed broadsheet rather than a feed. Transfers to any dense index, changelog, or listing. → `dark-broadsheet-rule-grid`.

- **All chroma is quarantined into the cover art; the chrome stays austere.** The UI is strictly black / white / warm-gray. Every drop of color on the page comes from the article cover illustrations — vivid painterly collages — and from exactly one brand band. Because the frame is monochrome, the art pops without competing, and the page never looks like a rainbow of UI accents. Transfers to any media/publisher grid: hold the chrome to neutrals and let the content images be the palette.

- **One saturated interruption in an otherwise monochrome page.** The single pale-cyan ("everyblue" `#c0f0fb`) full-bleed subscribe band is the lone color *event* on the whole site, so the conversion moment lands with maximum contrast and zero button-shouting — no gradient CTA, no glow. Reserve your one brand color for your one conversion moment; spending it everywhere is what makes CTAs need to shout. → `mono-page-accent-band`.

- **Small-caps sans kicker as navigational scaffolding.** Each section opens with a tiny tracked all-caps sans rubric ("DISPATCHES FROM THE FRONTIERS OF AI", "THE NEW RULES OF WRITING") and each card repeats a category tag in the same style. The kickers are the table of contents of a magazine — they let a reader skim a very long index by department. Transfers to blog indexes, docs landings, changelogs: a repeated caps label per group is cheaper and clearer than section dividers with headings.

- **Density made legible by leading and column discipline, not by shrinking.** Body sits at 15px — below the 16px default — but with 1.5 leading and multi-column grids (4-up and 3-up) at real 12–24px gutters, so the page is information-dense without feeling cramped. The restraint is the point: no shadows, no content gradients, one accent used once. Reach for it when the content volume is high and the reader has opted in.

## Design-system read

- **Type:** Two superfamilies by role. `Signifier` (serif) for all headlines — a ~9-step px scale, 12/14/15/18/20/24/32/42/48, roughly a 1.2 ratio at the small end widening to a 3× display jump; `Switzer` (variable grotesque, 100–900) for body/UI at 15px. A bespoke `Every` logotype face renders the reversed-E wordmark. Hierarchy = register (serif vs sans) + scale + italic emphasis, **not** weight; nearly everything is 400–500. Caps kickers carry positive tracking (~+0.6px); display carries negative tracking (−2% to −8%). Numeric OpenType features (`onum`, `pnum`) are on — old-style figures, an editorial tell.
- **Color:** Near-black ground `#020202`; primary text pure `#ffffff`, secondary a warm gray `#d6d3d1`, tertiary `#8c8d91`. Surfaces for product tiles `#1a1a1a`/`#212121`. Borders: a dashed hairline `#3c3c3c`. Exactly one brand hue — everyblue `#c0f0fb` — used only on the subscribe band; a utility link-blue `#2563eb` appears rarely. Product-tile cover gradients (`to top`, warm brown / teal / slate) are per-image, not system tokens.
- **Spacing rhythm:** 4px base. Section rhythm from `mt-5`/`mt-6` (20/24px) plus dashed-rule + padding; card gutters cluster at 12px (dominant), then 8/16/24/32. Whitespace + the rules do the separating, so blocks need no chrome.
- **Layout system:** Max content width 1280px (reading measure 800px). CSS Grid for the card fields (4-col and 3-col), flex for everything else (233 flex vs 12 grid nodes). Grids collapse to 1-col on mobile; a genuine multi-section content grid, not a hero-and-cards template. ~20 breakpoints — heavily fluid.
- **Layering / page architecture:** Single flat scroll over one black ground — `has_static_backdrop: false`, `has_blend_overlay: false`. The only fixed/sticky layers are the pinned masthead (z 100000) and consent / onboarding / reCAPTCHA chrome; no parallax world, no blend curtains. Depth is deliberately absent so long-form reading stays calm.
- **Motion / easing intent:** House timing tokens `--dur-fast .12s / --dur-base .2s / --dur-slow .3s`, easings `--ease-out-soft cubic-bezier(.16,1,.3,1)` and `--ease-swift cubic-bezier(.2,0,0,1)`. Motion is reveal-and-affordance only: in-view fade-rise on entry, a sticky masthead, hover opacity dims. Reduced motion respected (5 PRM rules).
- **Density:** High — dozens of articles per screen-height on desktop — kept legible by generous leading, capped measures, and total absence of decorative chrome.
- **Hierarchy:** Dominant ordering device is **typographic register** (serif headline vs sans kicker/byline) reinforced by scale; color and weight are almost never used to rank.
- **Restraint:** No content shadows, no content gradients, no second accent, no bold display weights, no hero mockup. One color, used once.

## Interaction & motion

- **In-view fade-rise** — *Trigger:* in-view. *Mechanism:* an IntersectionObserver (34 observers, ~148 targets, `threshold 0.5`, `rootMargin 200px`) adds a class that runs a `fade-up` keyframe — opacity 0→1 with a small `translateY` — as each block scrolls in. *Reads as:* content settling into place; the page feels alive without moving anything already read. *Transfers to:* any long index or article feed. *Safety:* **production-safe** (only `transform`/`opacity`; observer, not scroll handler). Reduced motion respected. → house pattern `in-view-fade-rise`.
- **Sticky masthead** — *Trigger:* scroll-progress. *Mechanism:* the header is `position: sticky; top: 0` at z 100000 on an opaque black bar (~14% viewport height). *Reads as:* persistent wayfinding on a very tall page. *Transfers to:* any long editorial/app shell. *Safety:* **production-safe** (compositor-only, no size animation).
- **Hover opacity dim** — *Trigger:* hover. *Mechanism:* product tiles drop to `opacity: 0.9` on hover instead of lifting or scaling. *Reads as:* a quiet "this is live" without motion or reflow. *Transfers to:* any restrained card grid that wants affordance without a shadow-lift. *Safety:* **production-safe**.
- **Accent-band icon marquee** — *Trigger:* load (looping). *Mechanism:* the everyblue subscribe band scrolls a horizontal track of app icons via a `subscribe-marquee` keyframe (transform translate), duplicated for a seamless loop. *Reads as:* an energetic ribbon breaking up the austere page at the CTA. *Transfers to:* logo/app strips, announcement bands. *Safety:* **production-safe** if `prefers-reduced-motion` pauses it (an infinite animation otherwise holds a compositor layer forever). → `mono-page-accent-band`.

## Production-safety note

Every notable technique here is **production-safe** and gated by `prefers-reduced-motion`. The only cost to watch is the infinite marquee — pause it under reduced-motion and keep the track `transform`-only so it never triggers layout.

## Extracted patterns

- `dark-broadsheet-rule-grid` — a dark editorial index where dashed hairlines (not cards) separate serif-headline / sans-kicker articles and all color lives in the cover art. Reuse for dense blog/changelog/publisher indexes that must stay calm.
- `mono-page-accent-band` — a single full-bleed saturated band, the lone color on a monochrome page, carrying the conversion CTA with an optional reduced-motion-aware icon marquee.
