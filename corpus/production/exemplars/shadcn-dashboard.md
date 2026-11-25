---
slug: shadcn-dashboard
url: https://ui.shadcn.com/view/new-york-v4/dashboard-01
source: manual
corpus: production
surface: app
captured: 2026-11-25
award_type: null
score: null
tags: [dashboard, saas, b2b, data-table, admin, app-shell, neutral, light, dark]
when_to_use: [dashboard, data-table, navigation, settings]
directions: [minimalist]
layout: [app-shell, dense-grid]
a11y: [reduced-motion-respected, focus-visible, alt-coverage-high, tap-targets-risky]
provenance:
  gallery_url: null
  robots_ok: true
  license_note: "private reference; not redistributed"
patterns: [kpi-stat-card-grid, collapsible-rail-app-shell]
tokens_snapshot: ../tokens/shadcn-dashboard.json
screenshots: ../screenshots/shadcn-dashboard/
---

## What works (transferable principles)
- **Content responds to its container, not the window.** The KPI row is `grid-cols-1 @xl/main:grid-cols-2 @5xl/main:grid-cols-4` on a `@container/main`, and each KPI number scales on the *card's* own width (`@[250px]/card:text-3xl`). Because the breakpoints are container-queries, the grid reflows correctly the instant the collapsible left rail steals or returns ~288px — no window resize, no JS. This is the single most important lesson for any app shell: a panel next to a resizable sidebar must size to the space it actually has, so use container queries, not viewport media queries.
- **Elevation is a hairline, not a shadow stack.** Every card, the chart frame, the toolbar and the data table are defined by one 1px border (`#e5e5e5`) on a near-equal background; the measured card shadow is literally all-zero. Drop-shadows are spent only on *transient* layers — dropdowns, popovers, the focus ring. The result is a flat, print-calm surface that stays legible at high density where layered shadows would turn to mud. Transfers to any information-dense tool.
- **Two neutral surfaces, ~2% apart, do all the figure/ground work.** Off-white chrome (`sidebar #fafafa`), pure-white content cards (`#ffffff`), and a faint muted fill (`#f5f5f5`) separate "navigation" from "work" from "well" with *zero hue* and a lightness step you can barely name. Grouping by a tiny value difference instead of borders-everywhere or color keeps the UI quiet. Transfers to any monochrome admin surface.
- **Hierarchy comes from weight + color at a deliberately tiny type scale.** Almost the entire screen is 12 / 14 / 16px; 30px appears only on the four headline KPI numbers — a ~2× range, not the 4–6× of a marketing page. Labels are 14px muted (`#737373`), values are foreground semibold. Density reads as calm precisely *because* scale isn't shouting; the ordering device is weight and the muted/foreground color pair, not size.
- **Tabular figures everywhere numbers live.** `tabular-nums` is set on the KPI values and on numeric table cells so every digit shares a fixed advance — columns of numbers align and don't jitter when a value updates. Non-negotiable for dashboards and tables; a proportional font makes live numbers twitch.
- **Deltas are directional, not chromatic.** The `+12.5%` / `−20%` change indicators are neutral *outline* pills carrying an up/down arrow glyph — the sign is encoded by the arrow, not by a red/green fill. This keeps the near-monochrome palette intact and stays colorblind-safe; saturated color is saved for genuine status (a single green "Done" dot). A good default when a KPI's "good vs bad" direction is ambiguous or you want a restrained board.
- **Status is a low-chroma dot + label, not a loud chip.** Table status cells pair an 8px colored dot (or spinner) with plain text inside a borderless badge — semantic color is a tiny glyph, the rest is neutral. Reads at a glance without turning the table into a traffic light.

## Design-system read
- **Type:** Geist (UI) + Geist Mono (numeric/code). A very compressed scale: 12px labels/badges, 14px body + table (dominant, ~586 uses), 16px section/header titles, 30px for the four KPI values only. ~2.1× range. Hierarchy is carried by weight (400 / 500, 600 rare) and the foreground↔muted color pair, never by size. Line-heights tuned per size (20/14 ≈ 1.43 body, 16/12 labels, 24/16 titles, 36/30 ≈ 1.2 display). `tabular-nums` on all figures.
- **Color:** near-monochrome neutral. Light: bg `#fff`, content card `#fff`, off-white chrome/sidebar `#fafafa`, muted well `#f5f5f5`, border/input `#e5e5e5`, muted text `#737373`, foreground `#000`, primary action black `#000` on `#fafafa` text. Functional color is rationed: destructive `#e40014`, a green status dot, and a `chart-1…5` blue ramp (blue-300→800) — though the dashboard's own area chart renders as a neutral black→transparent gradient. Re-themes to dark (`bg #0a0a0a`, card `#171717`, muted `#262626`, muted text `#a1a1a1`, border `rgba(255,255,255,.1)`, primary `#e5e5e5`).
- **Spacing rhythm:** 4px base (`--spacing: .25rem`). Dominant gap and padding is 8px (`gap-2`, `p-2` — >100 uses each), then 4px (`gap-1`), 12px (`px-3`), with 24px (`gap-6`, card padding) opening up the major sections. Tight and consistent — appropriate for a tool.
- **Layout system:** CSS grid/flex app-shell. Fixed left rail `--sidebar-width: 18rem` (spacing×72) collapsing to a `3rem` icon rail; sticky top bar `--header-height: 3–4rem`; a single scrolling `main` wrapped as `@container/main`. Content uses container-queries (`@xl` / `@5xl` / `@[250px]/card`) rather than viewport breakpoints; raw viewport breakpoints exist only at 600 / 1024 for the shell itself. KPI grid collapses 4→2→1 by container width.
- **Layering / page architecture:** flat, honest z-story — `has_static_backdrop:false`, no `backdrop-filter`, no `mix-blend-mode`. Three `fixed` + one `sticky`: the left rail (z10), the table's sticky `thead` (z10, `bg-muted`), a pointer-events-none toast layer (z50). The canvas simply scrolls under the chrome. Depth = fixed frames + hairline borders, not parallax or glass.
- **Motion / easing intent:** near-static and utilitarian. 150–200ms, Material-standard `cubic-bezier(0.4,0,0.2,1)`; the only layout motion is the rail collapse (`transition-[width] … ease-linear 200ms`). Interactive elements animate only cheap properties (`transition-[color,box-shadow]`). 29 `@keyframes` exist but are accordion/spinner/toast utilities, not scene-setting. `prefers-reduced-motion` respected (2 PRM rules).
- **Density:** high — 73 buttons, 72 inline SVG icons, 90 table cells, a 10-item sidebar — kept legible by the 4/8px grid, the tiny type range, and reserving color for signal.
- **Hierarchy:** dominant device is **weight + color** (foreground vs `#737373` muted), with position second; scale participates only at the four KPI numbers.
- **Restraint:** no card shadows, no gradients in chrome, no color-coded deltas, no decorative illustration, no oversized hero. Borders and a 2% surface step carry the whole structure.

## Interaction & motion (largely static UI)
- **Collapsible icon-rail** — *Trigger:* click/toggle. *Mechanism:* the fixed rail animates `width` from `--sidebar-width` (18rem) to `--sidebar-width-icon` (3rem) via `transition-[width] duration-200 ease-linear`; labels fade and the content `@container` reflows its grid to the reclaimed width. *Reads as:* the workspace breathing, not a drawer slamming. *Transfers to:* any app shell with a persistent nav. *Safety:* **production-safe** — animating `width` is a layout property, but it fires once per user toggle, never on a hot path. See `patterns/collapsible-rail-app-shell.md`.
- **Hover tint on rows and nav** — *Trigger:* hover. *Mechanism:* `transition-[color,box-shadow]` (and bg) from transparent → `muted`; table rows go `hover:bg-muted/50`. *Reads as:* "this is clickable." *Transfers to:* lists, menus, table rows. *Safety:* **production-safe** — only paint properties move.
- **Two-layer focus ring** — *Trigger:* `:focus-visible`. *Mechanism:* a `3px` ring at `ring/50` plus the element's own border shift — keyboard-only, never shown on mouse. *Reads as:* precise keyboard location. *Transfers to:* every interactive control. *Safety:* **production-safe**, a11y-positive.
- **Accordion / disclosure** — *Trigger:* click. *Mechanism:* `accordion-down/up` keyframes animate `height` to `--radix-collapsible-content-height`. *Reads as:* content expanding in place. *Safety:* **production-safe**, reduced-motion disables it.

## Production-safety note
Everything here is production-safe. The one layout-animating effect (rail width collapse) is user-triggered and one-shot; all other motion is confined to `color`/`box-shadow`/`opacity`. Reduced-motion is respected. The only a11y caution is tap-target size: ~98 of 101 interactive elements are small (dense table controls, icon buttons) — fine on pointer devices, tighten for touch.

## Extracted patterns
- kpi-stat-card-grid — container-query-responsive KPI card row with tabular-nums value, muted label, and a directional (not chromatic) delta badge; elevation by hairline.
- collapsible-rail-app-shell — fixed off-white rail that collapses to an icon strip + sticky header + container-queried scrolling canvas.
