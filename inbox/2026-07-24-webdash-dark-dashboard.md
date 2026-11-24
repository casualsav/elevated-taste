# capture: dark data-dense trading dashboard redesign (w.suchag.com webdash)

**Context:** 2026-07-24, owner's private weather-market trading dashboard
(server-rendered aiohttp page, inline CSS only, hard page-weight budget: zero
external requests). Audience: the owner, trading Kalshi temperature markets
from desktop + phone. Goal: better hierarchy/readability without slowing the
page. Redesign ran production/minimalist lane, Preserve mode.

**Result:** Owner verbatim: "the new layout looks amazing." Approved in two
review rounds. One reversal: page-level data tables had been shrunk to content
width (per the stretched-columns concern); owner asked for full page width
back — "was that to save room for more cities? If there's no concrete planned
use, restore it."

**Why it worked (hypothesis):** the validated moves were exactly the corpus
defaults — hierarchy from scale in one weight band with a sans-chrome /
mono-data role split, one rationed accent (existing orange), hairline borders,
CSS-variable palette with a cheap prefers-color-scheme light scheme. The
rejected move suggests a boundary: "don't stretch tables" (an anti-slop rule
tuned for marketing pages) reads differently on a working data grid the owner
scans by column — there, full-width utilization beat column tightness. Wide
gaps between right-aligned numeric columns were the original complaint, so the
real fix may be column-count-aware (compact only when columns are few), not
width:auto across the board.

**Steal this:** on data-dense operator dashboards, apply the minimalist kit
(scale hierarchy, role-split type, one accent, hairlines) but leave full-bleed
data grids full-bleed unless the owner asks; compactness is for chrome, not
for the grid they trade from.

---

Artifact: weatherbot/webdash.py `_PAGE_CSS` at commits dcbef87 + a644bc3
(casualsav/weather). Before/after renders:
weather repo `backups/webdash-pre-redesign-2026-07-24/` (rendered HTML) and
the agent-bus shared folder `webdash-redesign/` (dark/light/mobile PNGs).
