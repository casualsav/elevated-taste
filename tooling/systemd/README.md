# Scheduling the weekly evolve run (this box)

The self-evolving loop runs **locally** so distillation uses your Claude Code **subscription**
(`claude -p`), not a paid API key. Pick systemd (recommended) or cron.

## systemd user timer (recommended)

```sh
# 1. (once) link the units into your user systemd dir
mkdir -p ~/.config/systemd/user
ln -sf /projects/taste/tooling/systemd/taste-evolve.service ~/.config/systemd/user/
ln -sf /projects/taste/tooling/systemd/taste-evolve.timer   ~/.config/systemd/user/

# 2. (once) let user services run without being logged in
loginctl enable-linger "$USER"

# 3. enable + start the weekly timer
systemctl --user daemon-reload
systemctl --user enable --now taste-evolve.timer

# inspect
systemctl --user list-timers taste-evolve.timer
systemctl --user start taste-evolve.service   # run once now (manual test)
journalctl --user -u taste-evolve.service -n 50
```

Run logs also go to `/<repo>/.cache/evolve-<date>.log` (gitignored).

## cron fallback

```cron
# Mondays 09:00 — runs the same wrapper
0 9 * * 1 /projects/taste/tooling/evolve.sh
```

## Secrets / overrides — `~/.config/taste/evolve.env` (chmod 600)

Loaded by both the wrapper and the systemd unit. All optional:

```sh
TELEGRAM_BOT_TOKEN=123456:ABC...      # reuse your existing bot; enables the run report
TELEGRAM_CHAT_ID=987654321            # your DM chat id
CLAUDE_BIN=/home/you/.local/bin/claude  # if `claude` isn't on the minimal cron/systemd PATH
# DISTILL_MODEL=claude-opus-4-8        # default; override if needed
# DISTILL_EFFORT=high                  # high | xhigh | max
```

Without the Telegram vars the run still works — it just prints the report to the log instead of
sending it. Each site that passes the gate (reconcile + `npm run validate` + render check) lands on
`main` as its own commit; one that fails opens a PR labelled `hold` for you to fix or close. Pause
anytime by setting `"paused": true` in `evolve.config.json` (or via the CP5 control bot).

## Always-on control bot (optional)

Runs the Telegram control/approval bot as a service so `/status` `/run` `/approve <#>` `/reject <#>`
work any time (not just while `npm run bot` is open). Needs `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`
in `~/.config/taste/evolve.env`.

```sh
ln -sf /projects/taste/tooling/systemd/taste-bot.service ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now taste-bot.service
journalctl --user -u taste-bot.service -f      # watch it
```

It long-polls, so it also picks up any commands you sent while it was down (Telegram holds them ~24h).
The weekly digest lists what landed and what is held; for a held PR, `/approve <pr#>` squash-merges
it (after you fix it) and `/reject <pr#>` closes it.

## No systemd or cron? (containers)

If the box has neither (e.g. a container whose PID 1 isn't an init system), use the detached
daemons instead - a tiny scheduler replaces the timer, and the bot runs as a background process:

```sh
bash tooling/daemons.sh start     # starts the control bot + weekly scheduler (idempotent)
bash tooling/daemons.sh status    # bot: up | scheduler: up
bash tooling/daemons.sh stop
node tooling/scheduler.mjs --once # print the next computed run time
```

`tooling/scheduler.mjs` reads `evolve.config.json` each cycle (so `paused`/`cadence` changes apply
live) and runs `tooling/evolve.sh` weekly (Mon 09:00) or daily. Logs: `.cache/{bot,scheduler}.log`.
These survive your shell but **not a container restart** (there's no init to bring them back) - re-run
`daemons.sh start` after a restart, or add it to the container's entrypoint.

## Do not protect `main` against pushes

The run lands passing sites by pushing straight to `main`. A rule requiring a pull request would
refuse that push, and every site would end up held in a PR instead.
