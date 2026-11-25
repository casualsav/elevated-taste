# Owner taste profile

The corpus is other people's taste. This file is the owner's: verdicts the owner gave on real
builds, distilled into rules. **Where a rule here and a corpus default disagree, the rule here
wins** inside its scope; say so when you apply one ("owner rule 3: kept the grid full width").

Every rule comes from something the owner said about a shipped or previewed build. The source
note in `inbox/` keeps the full context, quotes and artifacts. Rules change only when the owner
says so: add, edit or retire them by hand (or in a PR the owner merges), never from a guess.

Format, so the prompt-submit hook can inject the one-liners: each rule is a list item that
starts with `- **<rule in one sentence>**`, then `Scope:`, `Why:` and `Source:` lines.

## Rules

- **Microlabels: caps only in a designed display face, never in system or ui monospace; set mono labels in sentence case with tracking near .02em.**
  Scope: every build. Typed identifiers (EXT-0001) may stay in caps.
  Why: all-caps mono microlabels were rejected on sight ("it doesn't look good in all caps"); a 7-way board then picked caps in Space Grotesk, the display face. The voice comes from the font and tracking, not the case.
  Source: `inbox/2026-07-09-no-allcaps-microlabels.md`. design-lint warns on `owner-mono-caps`.

- **Personal-brand pages default to expressive-dark: one grotesk plus mono, black glass panels on a dark ground, one fixed generative figure the page scrolls over, and motion on everything behind prefers-reduced-motion.**
  Scope: the owner's own pages (personal site, guides, profile pages). Not product UI.
  Why: approved and shipped ("Approved"); the quiet-editorial version of the same page (serif, hairlines, warm cream) was reverted within minutes ("I liked it better before"). Premium-luxury cues (didone italic) were rejected; modern-tech type (Space Grotesk, tracking ramp) was accepted.
  Source: `inbox/2026-07-09-guide-expressive-dark-approved.md`.

- **Dark translucent ("black glass") panels only over a dark ground; over a light field they turn gray.**
  Scope: every build that uses glass or translucent panels.
  Why: rejected as "more gray than black" until the ground behind them was dark too.
  Source: `inbox/2026-07-09-guide-expressive-dark-approved.md`.

- **For owner-facing dashboards and app UIs, start from an existing owner-shaped design system when one exists, and use a real app shell (bottom tabs on phone) rather than one long scrolling page.**
  Scope: tools the owner uses day to day (back-office dashboards, Mini Apps, internal tools).
  Why: a fresh build from corpus patterns got "It's okay, but the dashboard from atrium is way better"; the atrium Pine/Midnight system ported as is, with a bottom-tab shell, got "Beautiful. It's working great." A tabbed shell reads as a product; a single page reads as a report.
  Source: `inbox/2026-07-06-kerdos-dashboard-pine-midnight.md`.

- **On data-dense operator dashboards, keep data grids full width; compact the chrome, not the grid.**
  Scope: working data grids the owner scans by column (trading, monitoring). Overrides the anti-patterns advice against stretched tables there; marketing tables still follow it.
  Why: the minimalist kit (scale hierarchy, sans chrome with mono data, one rationed accent, hairlines) was approved ("the new layout looks amazing"), but shrinking tables to content width was reversed: "If there's no concrete planned use, restore it."
  Source: `inbox/2026-07-24-webdash-dark-dashboard.md`.

- **Show a redesign of a live page as a self-contained HTML preview first, and replace the live file only after the owner signs off.**
  Scope: any change of direction to a page that is already published.
  Why: the approved guide redesign took nine preview rounds before going live; one same-day direction change was reverted.
  Source: `inbox/2026-07-09-guide-expressive-dark-approved.md`; also step 7 of the skill.

## Adding a rule

After a build, `/reflect` (or a capture note) lands in `inbox/`. When the owner has given a clear
verdict, add one rule here in the format above, link the note, and mark the note's first line
`Promoted: taste/owner.md`. One verdict on one build is enough for a rule scoped to that kind of
build; widen the scope only when the owner says it applies more broadly.
