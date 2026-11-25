---
slug: thepudding
url: https://pudding.cool
source: manual-pick
corpus: expressive
surface: site
captured: 2026-06-30
award_type: Manual (editorial/data-journalism)
score: null
tags: [editorial, data-journalism, publication, scrollytelling, interactive, visualization, playful]
when_to_use: [editorial, blog, portfolio, navigation, interactive-showcase, brand-experience]
directions: [editorial, expressive]
layout: [content-grid]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [neutral-chrome-color-grid, fade-to-white-load-more]
tokens_snapshot: ../tokens/thepudding.json
screenshots: ../screenshots/thepudding/
---

## What works (transferable principles)
- **Monochrome chrome, content supplies all the color.** The shell is deliberately desaturated — white page, near-black ink (#262626), grey deks, mono labels. Every saturated hue (orange, lime, magenta, cyan, purple…) comes from the per-story thumbnails. The result reads as a vivid, energetic rainbow grid *without* the UI competing with the work. Transfers to any index whose items carry their own artwork (galleries, portfolios, blog/issue archives, app stores): keep the frame neutral and let the catalog be the palette.
- **Three-voice type system, one job each.** A condensed serif (Gooper) owns display titles, a grotesque sans (Atlas Grotesk) owns body/deks, and a typewriter mono (Atlas Typewriter) owns *all metadata* — issue numbers, dates, nav labels, "GO BACK", "LOAD MORE". Hierarchy comes from **family contrast**, not a big scale jump (titles are only ~2× body). Transfers to any editorial UI that wants distinct registers (headline vs. prose vs. catalog data) without inventing six font sizes.
- **Card without a box.** Story modules have no border, no shadow, no rounded container — the colored thumbnail *is* the card; the serif title and grey dek simply hang below it on plain white. Whitespace and the color block do all the separating. At 60+ items per view this kills the visual noise a bordered/shadowed card grid would create. Transfers to any high-density feed.
- **Metadata as a typographic rail.** Each module is bracketed by a consistent top rail: a bordered mono pill (`#223`) flush-left, a mono date (`JUN 2026`) flush-right. The rail — not chrome — communicates "this is a catalog entry," giving an archive/zine feel and a scannable anchor for the eye. Cheap, reusable structure for any numbered/dated collection.
- **Editorial interruptions break the grid.** A staff-pick block (editor portrait + handwritten-voice "Some of my favorite projects…") drops into a grid cell where a card would be, deliberately breaking the rhythm with a human, curated voice. Transfers to content feeds that want a magazine's editorial presence instead of an undifferentiated stream.
- **Handmade brand marks against a rigid system.** Script logo, sticker-style DONATE/SUBSCRIBE badges, and drawn nav icons inject warmth and personality, while a strict 3-column grid keeps everything navigable. The tension (craft brand ⨯ orderly system) is the whole identity — expressive *and* usable.
- **Expressive ≠ inaccessible.** Despite the playful look: `img alt` ratio 1.0 across ~60 images, a visible focus ring (2px green #3ae660), reduced-motion respected, and a real dark theme. The personality is in the marks and color, not in sacrificing baseline craft.

## Design-system read
- **Type:** three families by role — *Gooper SemiCondensed* (serif, display titles, `-0.8px` tracking at 32px), *Atlas Grotesk* (sans, body 16px / deks), *Atlas Typewriter* (mono, all metadata). Sizes cluster at 16 (body) · 14 / 12.8 (meta) · 24 / 32 (titles); fluid type enabled. Weights 400/500/700, 900 reserved for the logo. OpenType tuned (`onum 0`, `tnum`, `liga 0`) so tabular figures line up in the data rails. Hierarchy = family + role contrast, **not** scale (title:body ≈ 2:1).
- **Color:** neutral chrome — bg `#fff`, surface `#f7f7f7`, ink `#262626`, muted `#6d6d6d`, hairline `#d6d6d6`; the only true accent is the focus green `#3ae660`. The "palette" is a rotating set of saturated thumbnail swatches (orange `#e68f33`, green `#63c34b`, cream `#f0e4a8`, blue `#4c82b8`, magenta `#b51670`, purple `#bba0ef`, teal `#41b8be`, pink `#f0d0d3`, cyan `#33b9de`, lime `#c2d932`, yellow `#fde300`). Dark theme: bg `#191919`, fg `#efefef`.
- **Spacing rhythm:** 8px base. Padding steps 4 / 8 / 12 / 16 / 32; column gaps 16 / 32 / 48; section padding 32 (and 64 at the largest). Whitespace, not dividers, separates modules.
- **Layout system:** flex grid, 3 columns desktop (flex-basis groups of 2/3/6), container max ~1280px, ~32–48px gutters. Collapses to a single column on mobile (390px) with a hamburger; the secondary icon-nav reflows above the cards.
- **Motion / easing intent:** minimal and utilitarian — single default transition `0.25s ease` (with 0.1s/0.2s variants) on link/hover states; one fixed-position nav pin on scroll; no keyframes, no animation libraries, no entrance reveals. Motion communicates "responsive controls," not spectacle. Reduced-motion respected.
- **Density:** high (60+ story modules in a scroll) yet legible — uniform module shape + boxless cards + generous whitespace + a fixed meta rail keep it a calm archive rather than a wall.
- **Hierarchy:** dominant ordering device is **typeface family** (serif title > sans dek > mono meta), with the colored block as the per-item visual anchor.
- **Restraint:** essentially no shadows (one 2px micro-shadow on sticker badges), no decorative gradients except a fade-to-white scroll mask, no parallax, no hover lift, no scroll-jacking on the index. The flamboyance is confined to the brand marks and the content art.

## Interaction & motion (the index is largely static — reported honestly)
The homepage is a near-static directory; the publication's famous scrollytelling lives inside individual stories, not here. Evidence: 0 `@keyframes`, 0 animation rules, 0 libraries, 0 entrance reveals, 0 rAF, 0 scroll listeners; 1 IntersectionObserver, 1 mousemove listener, 1 scroll-driven effect (a position pin). So this section is short by design.
- **Pinned secondary nav** — *Trigger:* scroll-progress. *Mechanism:* the search + icon-nav bar switches to `position: fixed` once scrolled past, staying reachable over the long index. *Reads as:* "navigation is always at hand in a long archive." *Transfers to:* any long paginated/feed page. *Safety:* **production-safe** (composited position change, no per-frame JS).
- **Fade-to-white "load more" mask** — *Trigger:* static (no JS). *Mechanism:* a `linear-gradient(transparent → white)` overlay at the foot of the grid fades the last row and seats the mono `LOAD MORE STORIES` button, signalling "there's more below." *Reads as:* a soft content boundary / pagination affordance. *Transfers to:* truncated lists, "show more" sections, infinite-scroll thresholds. *Safety:* **production-safe** (pure CSS, nothing to disable for reduced-motion). See `patterns/fade-to-white-load-more.md`.
- **Link/control hover transitions** — *Trigger:* hover. *Mechanism:* `0.25s ease` color/underline transitions on nav and footer links. *Reads as:* quiet responsiveness. *Safety:* **production-safe**.
- *(Probe also reported `marquee: 4` and 1 mousemove listener; the captured frames don't corroborate moving marquees on the index — they correspond to the circular sticker badges' curved text, not running motion. Not claimed as homepage motion.)*

## Production-safety note
- Every technique on this index is **production-safe** — there is no spectacle to gate. The expressive payload (sticker badges, script logo, rainbow thumbnails) is static imagery, so it costs nothing on the main thread and degrades gracefully. Reduced-motion is respected and a dark theme exists; this is a model for "expressive look, boring runtime."

## Extracted patterns
- `neutral-chrome-color-grid` — monochrome shell + boxless, color-bearing cards with a mono meta rail; the signature "let the content be the palette" index. Reuse for galleries, archives, portfolios, blog/issue lists.
- `fade-to-white-load-more` — CSS-only gradient mask that fades a truncated grid into a "load more" control; reuse as a soft pagination/overflow affordance.
