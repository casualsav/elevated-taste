#!/usr/bin/env bash
# ingest.sh — run the full exemplar ingestion pipeline for one site, in the
# order that keeps CI green. Screenshots stay local: never pushed anywhere.
#
#   bash tooling/ingest.sh <url> <slug> <production|expressive> [--settle 6000]
#
# Prereq: the slug's entry already exists in corpus/<corpus>/sources.json
# (picking tags/when_to_use/directions is owner/agent judgment, not automation).
# Stops at the review point: prints the files to commit; does NOT push main.
set -euo pipefail
cd "$(dirname "$0")/.."

url=${1:?usage: ingest.sh <url> <slug> <corpus> [--settle ms]}
slug=${2:?missing slug}
corpus=${3:?missing corpus (production|expressive)}
shift 3
settle=6000
[ "${1:-}" = "--settle" ] && settle=$2

grep -q "\"slug\": \"$slug\"" "corpus/$corpus/sources.json" \
  || { echo "✗ add the $slug entry to corpus/$corpus/sources.json first (see tooling/distill-prompt.md vocabulary)"; exit 1; }

node tooling/capture.mjs --url "$url" --slug "$slug" --corpus "$corpus" --settle "$settle"
# bot-wall guard: a real desktop capture is never tiny
size=$(stat -c%s "corpus/$corpus/screenshots/$slug/desktop.png")
[ "$size" -gt 200000 ] || { echo "✗ desktop.png is only ${size}B — likely a bot wall/blank; inspect it and retry with a realistic UA"; exit 1; }

node tooling/distill.mjs --slug "$slug" --corpus "$corpus" --url "$url"
npm run validate
npm run index:build

echo
echo "✓ $slug ingested. Review the distilled exemplar, then commit + push:"
git status --short -- corpus/ | sed 's/^/    /'
