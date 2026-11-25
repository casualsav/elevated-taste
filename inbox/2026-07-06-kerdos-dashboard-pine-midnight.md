# Kerdos owner dashboard — proven system beat fresh taste-guided build

> Promoted: taste/owner.md (owner taste profile). This note keeps the full context.

**Context:** 2026-07-06, the owner dashboard for Kerdos (the back-office money
agent), shipped as a Telegram Mini App the owner uses from his phone. Two
versions built the same day, same data, same author-agent.

**Result:** v1 — a fresh phone-first page built from this repo's patterns
(dark-bento-grid surface cards, inline-metric-chip, rationed accent) — got
"It's okay, but the dashboard from atrium is way better." v2 — atrium's
Pine/Midnight design system ported verbatim (serif display greeting,
Tile/Surface/Oculus primitives, bottom-tab mobile-app shell, tabs:
Today/Money/Monitor/Kerdos/More) — got "Beautiful. It's working great." and
was locked in.

**Why it worked (hypothesis):** the Pine/Midnight system is judgment the owner
already shaped over a real product (atrium), so it encodes his taste directly;
a corpus-guided fresh build converges on competent-but-generic. Two mechanisms
seem separable: (a) the visual system itself (palette, serif display type,
surface primitives), and (b) the *shape* — a real app shell with bottom-nav
tabs read as "a product" while a single scrolling page read as "a report".

**Steal this:** for owner-facing dashboards/app UIs, start from the vendored
Pine/Midnight system (`backoffice/apps/dashboard/src/brand.css` +
`lib/primitives.tsx`) and a bottom-tab app shell — don't design fresh from
generic patterns when a proven owner-shaped system exists.

---

Artifact: `casualsav/back-office` `apps/dashboard/` (React/Vite Mini App;
commit f9f576a + naming in P5). v1 (rejected) was the single-file page at
`chief-agent/tools/templates/dashboard.html`, since deleted — visible in git
history at commit f9f576a^.
