# Migration — replacing the installed taste skills

`web-design-taste` consolidates eight installed generative skills into one corpus-backed skill. This file records **what maps where** and the **reversible cutover**. The cutover runs **only on explicit approval, after the Phase 1 smoke test passes**.

## Scope

**Absorbed (retired after cutover):**

| Old skill | Durable value | New home |
|---|---|---|
| `taste-skill` / `design-taste-frontend` | AI-tells / forbidden patterns | `references/anti-patterns.md` |
| | design-system install appendices (Material 3, Fluent, Carbon, Radix, shadcn, Primer, GOV.UK, USWDS) | `references/design-systems.md` + `production` corpus anchors |
| | block library, reference vocabulary | `corpus/*/patterns/` |
| | redesign protocol (§11) | `references/redesign-audit.md` |
| `taste-skill-v1` | superseded older version | dropped (no unique value) |
| `soft-skill` | premium-agency aesthetic; motion choreography; haptic micro-aesthetics | `directions/soft.md`; `references/motion.md`; `references/components.md` |
| `minimalist-skill` | warm-monochrome utilitarian minimalism | `directions/minimalist.md` + `tokens/presets/minimalist.json` |
| `brutalist-skill` | industrial / tactical-telemetry aesthetic | `directions/brutalist.md` + `tokens/presets/brutalist.json` |
| `gpt-tasteskill` | GSAP motion physics, gapless bento, layout randomization, AIDA | `references/motion.md`; `corpus/expressive/patterns/` |
| `redesign-skill` | audit-first redesign workflow | `references/redesign-audit.md` |
| `stitch-skill` | emits a semantic `DESIGN.md` | a capability of the Skill (synthesize a project design system from corpus + direction) |

**Untouched:** `brandkit`, `imagegen-frontend-web`, `imagegen-frontend-mobile`, `image-to-code-skill` (image generation / image→code — complementary inputs), and `graphify`, `last30days`, `output-skill` (unrelated).

## Cutover (reversible; approval-gated)

1. **Install** — `node tooling/install.mjs --global` (vendors the skill to `~/.claude/skills/web-design-taste/` with `REPO_PATH.txt` resolved, wires the hooks, appends the bias block; per-project: `--project <dir>`). Manual equivalent: copy the skill dir yourself and write `REPO_PATH.txt` next to `SKILL.md`.
2. **Archive** — move each absorbed skill from `~/.claude/skills/<name>/` to `~/.claude/skills/_archived-taste-<YYYYMMDD>/<name>/`.
3. **Verify** — in a fresh session, a UI request loads `web-design-taste` and nothing from the archived set.

## Rollback

Move the archived skill folders back from `~/.claude/skills/_archived-taste-<YYYYMMDD>/` to `~/.claude/skills/`, and remove `~/.claude/skills/web-design-taste/`.
