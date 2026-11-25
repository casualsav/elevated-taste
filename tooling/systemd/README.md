# Running the Telegram control bot on your own box

The weekly evolve run happens in GitHub Actions (`.github/workflows/evolve.yml`); nothing here
schedules it. What can still run on a box is the optional Telegram control bot
(`tooling/control-bot.mjs`), so `/status` `/run` `/pause` `/resume` `/set` `/approve <#>`
`/reject <#>` work any time, not only while `npm run bot` is open.

`/run` starts one evolve run on the box itself through `tooling/evolve.sh`, so the box needs
Playwright, an active `claude` login and `gh` auth for that command. The weekly digest, which
lists what landed and what is held, comes from the Actions run.

## Secrets: `~/.config/taste/evolve.env` (chmod 600)

Loaded by `bot.sh`, `evolve.sh` and the systemd unit:

```sh
TELEGRAM_BOT_TOKEN=123456:ABC...        # required for the bot
TELEGRAM_CHAT_ID=987654321              # your DM chat id; the bot answers only this chat
CLAUDE_BIN=/home/you/.local/bin/claude  # if `claude` isn't on the minimal systemd PATH (for /run)
# DISTILL_MODEL=...                     # optional override for /run
# DISTILL_EFFORT=high                   # high | xhigh | max
```

## systemd user service

```sh
mkdir -p ~/.config/systemd/user
ln -sf /projects/taste/tooling/systemd/taste-bot.service ~/.config/systemd/user/
loginctl enable-linger "$USER"                 # (once) keep it running when you're logged out
systemctl --user daemon-reload
systemctl --user enable --now taste-bot.service
journalctl --user -u taste-bot.service -f      # watch it
```

Adjust `WorkingDirectory` and `ExecStart` in the unit if the repo lives somewhere other than
`/projects/taste`. The bot long-polls, so it also picks up commands sent while it was down
(Telegram holds them about 24h). For a held PR, `/approve <pr#>` squash-merges it (after you fix
it) and `/reject <pr#>` closes it.

## No systemd? (containers)

```sh
bash tooling/daemons.sh start     # starts the bot detached (idempotent)
bash tooling/daemons.sh status
bash tooling/daemons.sh stop
```

Logs go to `.cache/bot.log`. The bot survives your shell but **not a container restart** (there is
no init to bring it back), so re-run `daemons.sh start` after a restart or add it to the
container's entrypoint.

## Upgrading from the old on-box schedule

Earlier versions also ran the weekly loop here, through `taste-evolve.timer` or
`tooling/scheduler.mjs`. Those are gone. If a box still has the timer enabled, turn it off so the
loop doesn't run twice:

```sh
systemctl --user disable --now taste-evolve.timer
rm -f ~/.config/systemd/user/taste-evolve.{service,timer} && systemctl --user daemon-reload
```

and remove any `tooling/evolve.sh` cron line.

## Do not protect `main` against pushes

The run lands passing sites by pushing straight to `main`. A rule requiring a pull request would
refuse that push, and every site would end up held in a PR instead.
