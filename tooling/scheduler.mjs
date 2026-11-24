#!/usr/bin/env node
/**
 * scheduler.mjs — minimal persistent scheduler for boxes WITHOUT systemd or cron (e.g. containers).
 *
 * Runs tooling/evolve.sh on the configured cadence (weekly Mon 09:00 local, or daily 09:00). Reads
 * evolve.config.json every cycle, so `paused` and `cadence` changes (incl. from the control bot)
 * take effect without a restart. On a real systemd host use the timer in tooling/systemd/ instead.
 *
 *   node tooling/scheduler.mjs        # foreground; run detached to keep it alive (see systemd/README)
 *   node tooling/scheduler.mjs --once # compute + print the next run time and exit (test)
 */
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const cfg = () => { try { return JSON.parse(readFileSync(join(ROOT, 'evolve.config.json'), 'utf8')); } catch { return {}; } };
const log = (...a) => console.log(new Date().toISOString(), ...a);

/** Next 09:00 occurrence for the cadence (weekly = next Monday). */
export function nextRun(now, cadence) {
  const d = new Date(now);
  d.setHours(9, 0, 0, 0);
  if (cadence === 'daily') { if (d <= now) d.setDate(d.getDate() + 1); return d; }
  const add = (1 - d.getDay() + 7) % 7; // 1 = Monday
  d.setDate(d.getDate() + add);
  if (d <= now) d.setDate(d.getDate() + 7);
  return d;
}

function runEvolve() {
  const child = spawn('bash', [join(ROOT, 'tooling', 'evolve.sh')], { cwd: ROOT, detached: true, stdio: 'ignore' });
  child.unref();
}

const CAP = 24 * 3600_000; // re-evaluate config at least daily; also keeps timers sane

function tick() {
  const c = cfg();
  if ((c.cadence || 'weekly') === 'manual') { log('cadence=manual; idle, re-check in 1h'); return setTimeout(tick, 3600_000).unref?.(); }
  const now = new Date();
  const next = nextRun(now, c.cadence || 'weekly');
  const ms = next - now;
  log(`next run ${next.toISOString()} (in ${Math.round(ms / 3600000)}h)`);
  if (ms > CAP) { return setTimeout(tick, CAP); }
  setTimeout(() => {
    const c2 = cfg();
    if (c2.paused) log('paused; skipping this occurrence');
    else { log('triggering evolve run'); runEvolve(); }
    setTimeout(tick, 60_000); // re-arm past this occurrence
  }, Math.max(ms, 1000));
}

if (process.argv.includes('--once')) {
  const c = cfg();
  console.log('cadence:', c.cadence || 'weekly', '| paused:', !!c.paused, '| next:', nextRun(new Date(), c.cadence || 'weekly').toString());
  process.exit(0);
}
log('taste scheduler started');
tick();
