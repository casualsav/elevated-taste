---
description: Reflect on the UI just built and propose corpus edits (to proposals/, never auto-applied)
---

Run **post-build reflection** for the Web Design Taste system on the work from this session
(or the path in `$ARGUMENTS`, if given).

1. Identify the UI just built/edited. Optionally run `node tooling/design-lint.mjs <files>` for the
   mechanical read.
2. Compare it against the corpus you used: `corpus/<corpus>/principles.md`, the relevant
   `corpus/<corpus>/patterns/`, and `.claude/skills/web-design-taste/references/anti-patterns.md`.
3. Decide what — if anything — the corpus should learn: a genuinely reusable section pattern it
   lacks, a principle to refine, or a new anti-pattern you hit. Each must be **transferable**, not
   specific to this one build. If nothing is worth changing, say so.
4. Write a single dated proposal to `proposals/YYYY-MM-DD-<slug>.md`, each item as:
   *what → why it generalizes → the concrete corpus edit (which file, what change)*.

**Propose only — do NOT edit anything under `corpus/`, `tokens/`, `directions/`, or `references/`.**
A human folds approved items in. State which exemplars/principles this session actually drew from.
