#!/usr/bin/env bash
# Manage the always-on daemons (control bot + weekly scheduler) on a box WITHOUT systemd/cron,
# e.g. a container. On a real systemd host, use tooling/systemd/ instead.
#   bash tooling/daemons.sh start|stop|status
# They run detached and survive your shell, but NOT a container restart (no init) - re-run `start`
# after a restart, or add it to your container's entrypoint.
set -euo pipefail
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
mkdir -p "$REPO/.cache"
up() { pgrep -f "$1" >/dev/null 2>&1; }
start_one() { # name match command
  if up "$2"; then echo "$1: already running"; else
    setsid bash -c "exec $3" >"$REPO/.cache/$1.log" 2>&1 </dev/null & disown 2>/dev/null || true
    echo "$1: started"
  fi
}
case "${1:-status}" in
  start)
    start_one bot       control-bot.mjs "bash '$REPO/tooling/bot.sh'"
    start_one scheduler scheduler.mjs   "node '$REPO/tooling/scheduler.mjs'"
    ;;
  stop) pkill -f control-bot.mjs 2>/dev/null || true; pkill -f scheduler.mjs 2>/dev/null || true; echo "stopped";;
  status) for p in control-bot.mjs scheduler.mjs; do up "$p" && echo "$p: up" || echo "$p: down"; done;;
  *) echo "usage: daemons.sh start|stop|status"; exit 1;;
esac
