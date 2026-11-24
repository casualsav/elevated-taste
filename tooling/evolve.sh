#!/usr/bin/env bash
# Weekly evolve runner — invoked by the systemd user timer (or cron). Runs ON THIS BOX so the
# distillation uses the Claude Code SUBSCRIPTION (claude -p), not a paid API key.
#
# It sets a login-like PATH (systemd/cron start with a minimal PATH, so `claude`/`gh`/`node`
# under ~/.local/bin or /usr/local/bin won't resolve otherwise) and logs to .cache/ (gitignored).
set -euo pipefail

export PATH="$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin:${PATH:-}"

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO"

# Optional secrets/overrides (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, CLAUDE_BIN, DISTILL_MODEL…)
# Keep this file chmod 600. The systemd unit also loads it via EnvironmentFile.
[ -f "$HOME/.config/taste/evolve.env" ] && set -a && . "$HOME/.config/taste/evolve.env" && set +a

mkdir -p "$REPO/.cache"
LOG="$REPO/.cache/evolve-$(date +%F).log"
{
  echo "=== evolve run $(date -Iseconds) ==="
  node tooling/evolve.mjs
  echo "=== done $(date -Iseconds) ==="
} >>"$LOG" 2>&1
