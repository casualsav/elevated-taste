#!/usr/bin/env bash
# push-captures.sh — one-time seed (and ad-hoc sync) of the local screenshot corpus
# to the orphan `captures` branch that CI reads (deploy-site.yml; evolve.yml appends
# to the same branch on every run).
#
# Run ON THE CAPTURE BOX, from the repo root:
#   bash tooling/push-captures.sh
#
# Additive: never deletes captures already on the branch. raw/ is NOT pushed —
# only corpus/*/screenshots/ (the site build's input).
set -euo pipefail
cd "$(dirname "$0")/.."

shopt -s nullglob
have=(corpus/*/screenshots/*/)
if [ ${#have[@]} -eq 0 ]; then echo "no local screenshots under corpus/*/screenshots/ — nothing to push"; exit 1; fi
echo "found ${#have[@]} capture dir(s) locally"

git fetch origin captures 2>/dev/null || true
wt=$(mktemp -d)
cleanup() { git worktree remove --force "$wt" 2>/dev/null || true; rm -rf "$wt"; }
trap cleanup EXIT

if git show-ref --verify --quiet refs/remotes/origin/captures; then
  git worktree add "$wt" -B captures origin/captures
else
  git worktree add --detach "$wt"
  git -C "$wt" checkout --orphan captures
  git -C "$wt" rm -rf --quiet . 2>/dev/null || true
  echo "Capture store — screenshots for the taste corpus. Seeded from the capture box; appended by the evolve workflow." > "$wt/README.md"
fi

for d in "${have[@]}"; do
  mkdir -p "$wt/$(dirname "$d")"
  cp -r "$d" "$wt/$(dirname "$d")/"
done

git -C "$wt" add -A
if git -C "$wt" diff --cached --quiet; then echo "captures branch already up to date"; exit 0; fi
git -C "$wt" commit -m "captures: seed/sync from capture box $(date -u +%Y-%m-%d)"
git -C "$wt" push -u origin captures
echo "pushed. CI can now build the directory site (deploy-site.yml)."
