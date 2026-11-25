#!/usr/bin/env bash
# Always-on Telegram control bot runner (used by the taste-bot systemd service).
# Sets a login-like PATH so node/gh resolve, loads secrets, then execs the long-poll bot.
set -euo pipefail
export PATH="$HOME/.local/bin:/usr/local/bin:/usr/bin:/bin:${PATH:-}"
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO"
[ -f "$HOME/.config/taste/evolve.env" ] && set -a && . "$HOME/.config/taste/evolve.env" && set +a
exec node tooling/control-bot.mjs
