#!/usr/bin/env bash
# Run the Telegram control bot detached on a box WITHOUT systemd (e.g. a container).
# On a systemd host, use tooling/systemd/taste-bot.service instead.
#   bash tooling/daemons.sh start|stop|status
# It survives your shell, but NOT a container restart (no init) - re-run `start` after a
# restart, or add it to your container's entrypoint. The weekly loop runs in GitHub Actions.
set -euo pipefail
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
mkdir -p "$REPO/.cache"
up() { pgrep -f control-bot.mjs >/dev/null 2>&1; }
case "${1:-status}" in
  start)
    if up; then echo "bot: already running"; else
      setsid bash -c "exec bash '$REPO/tooling/bot.sh'" >"$REPO/.cache/bot.log" 2>&1 </dev/null & disown 2>/dev/null || true
      echo "bot: started"
    fi
    ;;
  stop) pkill -f control-bot.mjs 2>/dev/null || true; echo "stopped";;
  status) if up; then echo "bot: up"; else echo "bot: down"; fi;;
  *) echo "usage: daemons.sh start|stop|status"; exit 1;;
esac
