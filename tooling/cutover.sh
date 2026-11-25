#!/usr/bin/env bash
# Cutover — install web-design-taste globally and ARCHIVE the legacy taste skills.
# REVERSIBLE and APPROVAL-GATED: run manually only after the smoke test passes and
# the user approves. Nothing here runs automatically.
#
#   bash tooling/cutover.sh                     # install globally + archive legacy
#   bash tooling/cutover.sh --restore <YYYYMMDD>   # roll back to a given archive
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
SKILLS="$HOME/.claude/skills"
STAMP="$(date +%Y%m%d)"
LEGACY=(taste-skill taste-skill-v1 soft-skill redesign-skill minimalist-skill brutalist-skill gpt-tasteskill stitch-skill)

if [[ "${1:-}" == "--restore" ]]; then
  stamp="${2:?usage: --restore <YYYYMMDD>}"
  src="$SKILLS/_archived-taste-$stamp"
  [ -d "$src" ] || { echo "no archive at $src"; exit 1; }
  echo "Restoring legacy skills from $src ..."
  for s in "${LEGACY[@]}"; do
    [ -d "$src/$s" ] && mv "$src/$s" "$SKILLS/$s" && echo "  restored $s"
  done
  rm -rf "$SKILLS/web-design-taste"
  echo "Removed global web-design-taste. Rollback complete."
  exit 0
fi

echo "Cutover — taste repo: $REPO"
ARCHIVE="$SKILLS/_archived-taste-$STAMP"
mkdir -p "$ARCHIVE"

# 1) Archive legacy skills (reversible move, never delete)
for s in "${LEGACY[@]}"; do
  if [ -d "$SKILLS/$s" ]; then mv "$SKILLS/$s" "$ARCHIVE/$s" && echo "  archived $s -> $ARCHIVE/$s"; fi
done

# 2) Install the skill globally
rm -rf "$SKILLS/web-design-taste"
cp -R "$REPO/.claude/skills/web-design-taste" "$SKILLS/web-design-taste"
# Point the installed skill at this repo's corpus (paths in SKILL.md resolve here)
echo "$REPO" > "$SKILLS/web-design-taste/REPO_PATH.txt"
echo "  installed web-design-taste -> $SKILLS/web-design-taste (corpus at $REPO, see REPO_PATH.txt)"

cat <<EOF

Done. Next:
  - Verify in a FRESH session that a UI request loads web-design-taste and nothing from the archived set.
  - (Optional) add the bias rules from $REPO/CLAUDE.md to ~/.claude/CLAUDE.md so they apply globally.
Rollback anytime:  bash tooling/cutover.sh --restore $STAMP
EOF
