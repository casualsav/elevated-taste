---
slug: catalyst
url: https://catalyst-demo.tailwindui.com
source: manual
corpus: production
surface: app
captured: 2026-11-25
award_type: Curated
score: null
tags: [saas, dashboard, b2b, analytics, data-table, tailwind, zinc, light, dark]
when_to_use: [dashboard, data-table, navigation, settings]
directions: [minimalist, soft]
layout: [app-shell, dense-grid]
a11y: [focus-visible, alt-coverage-high]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [inset-app-panel, kpi-stat-row]
tokens_snapshot: ../tokens/catalyst.json
screenshots: ../screenshots/catalyst/
---

## What works (transferable principles)
- **The work surface is a floating panel, not the page.** The viewport ground is a faint tinted neutral (zinc-100); the actual content sits in a white panel with a hairline ring (`ring-1 ring-zinc-950/5`), a barely-there shadow (`shadow-xs`) and a `lg:rounded-lg`. That one inset gives the application screen a card identity distinct from the chrome around it — the eye reads "this is the document, that is the frame" — at almost zero visual cost. Transfers to any app shell, settings screen, or console that wants depth without heavy borders or drop shadows.
- **Two inks carry the whole page.** Essentially everything is either near-black (`zinc-950`, ~286 uses) for primary text or one mid-gray (`zinc-500`, ~33 uses) for secondary/muted — labels, dates, column headers, metadata. No third gray, no colored body text. Deciding "primary vs muted" per string, and nothing else, is what keeps a data-dense screen calm. Reuse the two-ink rule anywhere density threatens legibility.
- **Quiet hierarchy: scale contrast is deliberately small.** The biggest type on the page (the KPI numbers at `text-2xl`/24px semibold) is only ~1.3× the page heading (20px) and ~1.7× body (14px). Dashboards don't need a display jump; emphasis comes from *weight + whitespace + position*, not size. The reader's eye is steered by generous blank space and hairline rules, not by shouting numerals. Transfers to admin tools, tables, and any UI where many numbers must coexist peacefully.
- **Hairlines do the sectioning that cards would elsewhere.** The four KPIs aren't boxed — each column is topped by a full-width top rule (`border-b border-zinc-950/5`) under the "Overview" header, and table rows are divided only by a bottom hairline. Replacing card borders/shadows with single 1px rules at ~5% ink removes an enormous amount of visual weight while preserving structure. Reuse for stat strips and borderless tables.
- **Semantic delta badges = tinted fill + saturated text.** Each metric carries a tiny pill: a very light accent wash behind (lime at ~20% alpha for positive, pink at ~15% for negative) with a dark, saturated label of the same hue (`text-lime-700`). Low-alpha background + high-chroma text is the reliable recipe for a legible status chip that still reads as color-coded. Transfers to any trend/status indicator.
- **One navigation column, three stacked jobs.** The 256px fixed sidebar groups primary nav (Home/Events/Orders/Settings), then a muted-labelled "Upcoming Events" list, then utility links (Support/Changelog) pinned low, then an account menu at the very bottom. Vertical zoning inside a single rail — primary, contextual, utility, identity — scales to real products without a second bar.

## Design-system read
- **Type:** Single family — Inter (via rsms.me, with `cv11` feature + InterDisplay for large sizes). Restrained scale: body `text-sm` (14px / 20px lh) dominates, `text-base` (16px) secondary, KPI numbers `text-2xl` (24px / 32px lh), page `h1` 20px (24px on mobile). Three weights only: 400 regular, 500 medium (labels/nav/headers), 600 semibold (numbers, headings). Hierarchy = weight + whitespace, not a big ratio.
- **Color:** Neutral-forward zinc ramp. Ground `zinc-100` canvas, `white` surface. Text `zinc-950` primary / `zinc-500` muted. Borders are alpha-ink hairlines (`zinc-950/5`, `/10`) rather than solid grays. Accent color appears only as semantic status (lime = up, pink = down) in badges and as small event avatars — the UI itself is chromatically silent. Full Tailwind v4 color palette is present in tokens but the screen uses almost none of it, by design.
- **Spacing rhythm:** 4px base (`--spacing: .25rem`). Dominant paddings 16px (`py-4` row/cell rhythm, 53 uses) and 8px; panel insets `p-6` mobile → `p-10` desktop. Gaps 12/8/6. Whitespace is the primary separator — rows breathe at 16px block padding, the KPI grid uses wide column gaps.
- **Layout system:** App shell — `fixed inset-y-0 left-0 w-64` sidebar (256px) + scrolling main capped at a 1152px content container. Overview KPIs are a responsive grid: 1 col → `sm:grid-cols-2` → `xl:grid-cols-4`. Below `lg` the sidebar is hidden (`max-lg:hidden`) and collapses to a hamburger + top bar; the stat grid stacks to one column. 14 grid / 38 flex contexts — flex for the many small rows, grid for the metric strip.
- **Layering / page architecture:** Near-flat, but a subtle 2-plane depth. Plane 1 = the fixed sidebar + tinted canvas (chrome that stays put). Plane 2 = the white content panel that scrolls, lifted off the canvas by ring + `shadow-xs`. `has_static_backdrop: false`, no blend/glass layers, single `position: fixed` element (the sidebar — pinned chrome, not a parallax backdrop). Depth is communicated by surface + hairline + faint shadow, nothing more.
- **Motion / easing intent:** Utilitarian. House transition is 150ms / `cubic-bezier(.4,0,.2,1)` applied to interactive-state changes only. Motion communicates affordance (this is clickable), never spectacle.
- **Density:** High — a 10-row table, a 4-up KPI strip, and a multi-section nav on one screen — kept legible by the two-ink rule, 16px row rhythm, muting of secondary columns, and right-aligned numerics.
- **Hierarchy:** Dominant ordering device is **weight + position + whitespace**, with color reserved for semantics. Scale is a minor contributor.
- **Restraint:** No gradients, no decorative shadows, no borders where a hairline works, no colored chrome, no hero. A full rainbow token set ships unused. The design's confidence is in what it withholds.

## Interaction & motion (mostly static — honest read)
Catalyst is a resting application screen; the capture found **0 entrance reveals, 0 keyframes, 0 animation libraries**. The probe's single `position: fixed` "scroll effect" is just the pinned sidebar, and the IntersectionObserver with ~60 targets (rootMargin 200px) is Next.js link **prefetch**, not reveal animation — do not read it as choreography.

- **Interactive-row tint** — *Trigger:* hover/focus. *Mechanism:* background crossfades from transparent to `zinc-950/5` (~5% ink) on every nav link, menu button, and account row over the 150ms house transition. *Reads as:* "this whole row is one target." *Transfers to:* nav rails, list items, menu options. *Safety:* **production-safe** (compositor-friendly color change, no layout).
- **Disclosure menus** — *Trigger:* click/tap. *Mechanism:* 3 Headless UI menu/popover disclosures (team switcher, account menu, the "Last week" range select). Open/close is state-driven, not scroll-driven. *Reads as:* standard overlay affordance. *Transfers to:* any app header control. *Safety:* **production-safe**.
- **Focus ring** — *Trigger:* keyboard focus. *Mechanism:* a 1px solid outline (`rgb(16,16,16)`) appears on focusable nav items. *Reads as:* clear keyboard wayfinding. *Safety:* **production-safe**; keep it — it's the a11y backbone of a chrome-light UI.

Reduced-motion: no `prefers-reduced-motion` rule ships, but there is effectively nothing to reduce (no transforms, no autoplay, no parallax), so the risk is nil. Any motion you *add* to a screen like this should still carry the PRM fallback.

## Production-safety note
Every technique here is production-safe; there is no spectacle. The lesson is the restraint itself — an app surface that earns "premium" from hairlines, two inks, and a floating panel rather than from animation or color.

## Extracted patterns
- `inset-app-panel` — tinted canvas + fixed nav rail + floating white content panel (ring + shadow-xs + rounded); the app-shell skeleton.
- `kpi-stat-row` — responsive 1→2→4 metric strip: hairline-topped cells of label → big semibold number → semantic delta badge.
