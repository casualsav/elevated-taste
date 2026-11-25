#!/usr/bin/env bash
# ingest-watchdog.sh — page the owner when a taste repo's weekly `ingest`
# workflow breaks or stops running.
#
# The ingest runs live in GitHub Actions on the subscription OAuth token. A
# failing scheduled run is invisible there: nobody opens the Actions tab, so
# launch-taste rotted for four weeks (2026-07-20 → 2026-08-11) before anyone
# noticed. This is the loud channel — it reaches Telegram.
#
# A green conclusion is not proof of output, so the inbox/ artifact is watched
# too: launch-taste's 2026-07-13 run reported success while the SDK returned
# is_error with a $0, one-turn 401, and later runs researched fine but could not
# open their PR. Both modes look healthy from the conclusion alone.
#
#   bash tooling/ingest-watchdog.sh [--dry-run]
#
# Cron (daily 09:20 local):
#   20 9 * * * /home/ubuntu/projects/taste/tooling/ingest-watchdog.sh >> /home/ubuntu/projects/taste/.cache/ingest-watchdog.log 2>&1
#
# Repos are discovered, not hardcoded: any casualsav repo carrying
# .github/workflows/ingest.yml is watched, so a new taste repo needs no edit here.
set -uo pipefail

# cron's default PATH is /usr/bin:/bin, which has no `tg` — without this the
# watchdog would run, find problems, and fail silently at the paging step.
export PATH="/usr/local/bin:/home/ubuntu/.local/bin:$PATH"
command -v tg >/dev/null || { echo "$(date -uIs) FATAL: tg not on PATH — cannot page"; exit 1; }

OWNER=casualsav
STALE_DAYS=9          # weekly cron + GitHub's scheduling jitter; 9d means a run was genuinely missed
INBOX_STALE_DAYS=21   # three weekly runs: one may legitimately find nothing worth filing,
                      # and a clean run's PR can sit unmerged for days (copywriting-taste
                      # was 13d dry on 2026-08-17 with a healthy pipeline and PR #6 open)
REPAGE_DAYS=6         # while an unchanged problem persists, re-page at most this often
STATE_DIR="${HOME}/.local/state/taste-ingest-watchdog"
STATE="${STATE_DIR}/last-alert"
DRY_RUN=false
[ "${1:-}" = "--dry-run" ] && DRY_RUN=true

mkdir -p "$STATE_DIR"
now=$(date -u +%s)
alerts=""

repos=$(gh repo list "$OWNER" --limit 200 --json name -q '.[].name') || {
  echo "$(date -uIs) FATAL: gh repo list failed"; exit 1; }

for r in $repos; do
  gh api "repos/$OWNER/$r/contents/.github/workflows/ingest.yml" >/dev/null 2>&1 || continue

  # Newest run of the ingest workflow, and the newest SUCCESSFUL one.
  last=$(gh run list -R "$OWNER/$r" --workflow=ingest.yml --limit 1 \
           --json conclusion,status,createdAt,url -q '.[0] | "\(.conclusion // .status)\t\(.createdAt)\t\(.url)"' 2>/dev/null)
  if [ -z "$last" ]; then
    alerts+="${r}: ingest.yml exists but has never run"$'\n'
    continue
  fi
  concl=$(cut -f1 <<<"$last"); when=$(cut -f2 <<<"$last"); url=$(cut -f3 <<<"$last")

  if [ "$concl" = "failure" ] || [ "$concl" = "cancelled" ] || [ "$concl" = "timed_out" ]; then
    alerts+="${r}: last ingest run ${concl} (${when%T*}) — ${url}"$'\n'
    continue
  fi
  if [ "$concl" = "in_progress" ] || [ "$concl" = "queued" ]; then continue; fi

  ok_at=$(gh run list -R "$OWNER/$r" --workflow=ingest.yml --limit 20 \
            --json conclusion,createdAt -q '[.[]|select(.conclusion=="success")][0].createdAt' 2>/dev/null)
  if [ -z "$ok_at" ] || [ "$ok_at" = "null" ]; then
    alerts+="${r}: no successful ingest run in the last 20 runs"$'\n'
    continue
  fi
  age=$(( (now - $(date -u -d "$ok_at" +%s)) / 86400 ))
  if [ "$age" -gt "$STALE_DAYS" ]; then
    alerts+="${r}: no successful ingest in ${age}d (weekly schedule has stopped firing)"$'\n'
    continue
  fi

  # The runs are green — did any of them actually produce anything? Commits, not
  # files: promoting an item out of inbox/ is a commit too, so a curated-clean
  # inbox still reads as alive.
  inbox_at=$(gh api "repos/$OWNER/$r/commits?path=inbox&per_page=1" \
               -q '.[0].commit.committer.date' 2>/dev/null)
  if [ -z "$inbox_at" ] || [ "$inbox_at" = "null" ]; then
    alerts+="${r}: nothing has ever been committed under inbox/"$'\n'
    continue
  fi
  inbox_age=$(( (now - $(date -u -d "$inbox_at" +%s)) / 86400 ))
  [ "$inbox_age" -gt "$INBOX_STALE_DAYS" ] && \
    alerts+="${r}: ingest runs green but nothing has landed in inbox/ for ${inbox_age}d (auth, PR creation, or an unmerged PR — check the newest run's steps)"$'\n'
done

if [ -z "$alerts" ]; then
  echo "$(date -uIs) OK — all ingest workflows healthy"
  rm -f "$STATE"
  exit 0
fi

echo "$(date -uIs) ALERT"; printf '%s' "$alerts"

# Page on a changed problem set, or once every REPAGE_DAYS while it is unchanged.
fingerprint=$(printf '%s' "$alerts" | md5sum | cut -d' ' -f1)
prev_fp=""; prev_at=0
[ -f "$STATE" ] && { prev_fp=$(sed -n 1p "$STATE"); prev_at=$(sed -n 2p "$STATE"); }
if [ "$fingerprint" = "$prev_fp" ] && [ $(( (now - prev_at) / 86400 )) -lt "$REPAGE_DAYS" ]; then
  echo "$(date -uIs) (same problem as last page, within ${REPAGE_DAYS}d — not re-paging)"
  exit 0
fi

if [ "$DRY_RUN" = true ]; then
  echo "--- would page: ---"; printf '%s' "$alerts"; exit 0
fi

{
  printf 'Taste-suite ingest watchdog — %d repo(s) need attention:\n\n' "$(printf '%s' "$alerts" | grep -c .)"
  printf '%s\n' "$alerts"
  printf 'Fix or silence: /home/ubuntu/projects/taste/tooling/ingest-watchdog.sh\n'
} | tg ack @owner - && printf '%s\n%s\n' "$fingerprint" "$now" > "$STATE"
