#!/usr/bin/env node
/**
 * control-bot.mjs — Phase 3.5 non-agentic Telegram control + approval bot.
 *
 * A deterministic long-poll bot (NO LLM) that drives the self-evolving loop by editing
 * evolve.config.json and shelling out to evolve / gh. The config file is the source of truth;
 * this bot is an optional front-end. Strictly gated to one chat id (the owner).
 *
 * Commands: /status /run /pause /resume /set <key> <value> /approve [pr#] /reject [pr#] /help
 *   /approve merges the draft PR (your approval gate); /reject closes it. Nothing else can merge.
 *
 *   TELEGRAM_BOT_TOKEN=… TELEGRAM_CHAT_ID=… npm run bot
 *   node tooling/control-bot.mjs --check     # offline: validate config + show parsed commands, no network
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const CONFIG = join(ROOT, 'evolve.config.json');

const loadCfg = () => { try { return JSON.parse(readFileSync(CONFIG, 'utf8')); } catch { return {}; } };
const saveCfg = (c) => writeFileSync(CONFIG, JSON.stringify(c, null, 2) + '\n');

// Secrets come from the environment ONLY (~/.config/taste/evolve.env via bot.sh / systemd).
// No evolve.config.json fallback: that file is committed, so reading secrets from it is a
// designed-in path to leaking the bot token into git history.
const TOKEN = () => process.env.TELEGRAM_BOT_TOKEN;
const CHAT = () => String(process.env.TELEGRAM_CHAT_ID || '');

// keys the bot may edit, with coercion + validation
const EDITABLE = {
  candidates_per_run: (v) => { const n = parseInt(v, 10); if (!(n >= 1 && n <= 20)) throw new Error('1-20'); return n; },
  capture_settle_ms: (v) => { const n = parseInt(v, 10); if (!(n >= 0 && n <= 60000)) throw new Error('0-60000'); return n; },
  cadence: (v) => { if (!['weekly', 'daily', 'manual'].includes(v)) throw new Error('weekly|daily|manual'); return v; },
  directions_bias: (v) => v.split(',').map((s) => s.trim()).filter(Boolean),
  paused: (v) => v === 'true' || v === '1' || v === 'on',
};

const fmtCfg = (c) => [
  `paused: ${!!c.paused}`,
  `cadence: ${c.cadence || 'weekly'}`,
  `candidates_per_run: ${c.candidates_per_run ?? 4}`,
  `directions_bias: ${(c.directions_bias || []).join(', ') || '(none)'}`,
  `last_run: ${c.last_run || 'never'}`,
].join('\n');

/**
 * Pure command parser. Returns { reply, cfg, action, arg }.
 *   action: 'none' | 'persist' | 'status' | 'run' | 'approve' | 'reject'
 * Side effects (write config, run evolve, gh) are performed by the caller based on `action`.
 */
export function applyCommand(text, cfgIn) {
  const cfg = { ...cfgIn };
  const [cmd, ...rest] = String(text).trim().split(/\s+/);
  switch ((cmd || '').toLowerCase()) {
    case '/help':
    case '/start':
      return { action: 'none', cfg, reply: 'Commands:\n/status\n/run\n/pause\n/resume\n/set <key> <value>\n/approve [pr#|all]  (no #: all open)\n/reject [pr#|all]  (no #: the latest)\n\nEditable keys: ' + Object.keys(EDITABLE).join(', ') };
    case '/status':
      return { action: 'status', cfg, reply: `evolve config:\n${fmtCfg(cfg)}` };
    case '/pause':
      cfg.paused = true; return { action: 'persist', cfg, reply: 'Paused. Weekly runs are suppressed (manual /run still works).' };
    case '/resume':
      cfg.paused = false; return { action: 'persist', cfg, reply: 'Resumed. Weekly runs are active.' };
    case '/run':
      return { action: 'run', cfg, reply: 'Starting an evolve run now. You will get a report when it finishes.' };
    case '/approve':
      return { action: 'approve', cfg, arg: rest[0] || null, reply: '' };
    case '/reject':
      return { action: 'reject', cfg, arg: rest[0] || null, reply: '' };
    case '/set': {
      const [key, ...valParts] = rest; const val = valParts.join(' ');
      if (!key || !(key in EDITABLE)) return { action: 'none', cfg, reply: `Unknown key. Editable: ${Object.keys(EDITABLE).join(', ')}` };
      try { cfg[key] = EDITABLE[key](val); }
      catch (e) { return { action: 'none', cfg, reply: `Invalid value for ${key} (expected ${e.message}).` }; }
      return { action: 'persist', cfg, reply: `Set ${key} = ${JSON.stringify(cfg[key])}.` };
    }
    default:
      return { action: 'none', cfg, reply: cmd?.startsWith('/') ? `Unknown command ${cmd}. /help for the list.` : '' };
  }
}

// ── gh helpers (PR ops) ──────────────────────────────────────────────────────
function listEvolvePRs() {
  const r = spawnSync('gh', ['pr', 'list', '--state', 'open', '--json', 'number,headRefName,title,url,isDraft', '--limit', '30'], { cwd: ROOT, encoding: 'utf8' });
  if (r.status !== 0) return { error: r.stderr || 'gh pr list failed' };
  try { return { prs: JSON.parse(r.stdout || '[]').filter((p) => p.headRefName?.startsWith('evolve/')) }; }
  catch { return { error: 'could not parse gh output' }; }
}
function mergePR(n) {
  spawnSync('gh', ['pr', 'ready', String(n)], { cwd: ROOT, encoding: 'utf8' }); // evolve PRs are drafts; must be marked ready before merge
  return spawnSync('gh', ['pr', 'merge', String(n), '--squash', '--delete-branch'], { cwd: ROOT, encoding: 'utf8' });
}
function closePR(n) { return spawnSync('gh', ['pr', 'close', String(n), '--delete-branch'], { cwd: ROOT, encoding: 'utf8' }); }

/** A numbered /approve or /reject may only touch an OPEN evolve/* PR — never arbitrary PRs. */
function evolvePrOnly(arg) {
  const num = parseInt(String(arg).replace('#', ''), 10);
  if (!Number.isInteger(num)) return { error: `"${arg}" is not a PR number` };
  const { prs, error } = listEvolvePRs();
  if (error) return { error };
  const pr = prs.find((p) => p.number === num);
  if (!pr) return { error: `#${num} is not an open evolve/* PR (this bot only operates on evolve branches)` };
  return { number: num, title: pr.title };
}

function resolvePr(arg) {
  if (arg) return evolvePrOnly(arg);
  const { prs, error } = listEvolvePRs();
  if (error) return { error };
  if (!prs.length) return { error: 'no open evolve/* PRs' };
  prs.sort((a, b) => b.number - a.number);
  return { number: prs[0].number, title: prs[0].title };
}

/** Apply fn (mergePR/closePR) to every open evolve PR; report which succeeded/failed. */
function batchOp(verb, fn) {
  const { prs, error } = listEvolvePRs();
  if (error) return `Cannot ${verb}: ${error}.`;
  if (!prs.length) return `No open evolve PRs to ${verb}.`;
  const ok = [], bad = [];
  for (const p of prs.sort((a, b) => a.number - b.number)) (fn(p.number).status === 0 ? ok : bad).push(p.number);
  const past = verb === 'approve' ? 'Merged' : 'Closed';
  let msg = ok.length ? `${past} ${ok.length} PR(s): #${ok.join(', #')}.` : `No PRs ${verb === 'approve' ? 'merged' : 'closed'}.`;
  if (ok.length && verb === 'approve') msg += ' Folded into the corpus.';
  if (bad.length) msg += ` Failed: #${bad.join(', #')}.`;
  return msg;
}

// ── side-effect runner (called by the long-poll loop) ────────────────────────
function perform(result) {
  if (result.action === 'persist') { saveCfg(result.cfg); return result.reply; }
  if (result.action === 'status') {
    const { prs, error } = listEvolvePRs();
    if (error) return result.reply + `\n\nopen PRs: (gh error: ${error})`;
    const lines = prs.length ? prs.map((p) => `#${p.number} ${p.isDraft ? '[draft] ' : ''}${p.title}\n${p.url}`).join('\n') : '(no open evolve PRs)';
    return result.reply + `\n\nopen evolve PRs:\n${lines}`;
  }
  if (result.action === 'run') {
    const child = spawn('bash', [join(ROOT, 'tooling', 'evolve.sh')], { cwd: ROOT, detached: true, stdio: 'ignore' });
    child.unref();
    return result.reply;
  }
  if (result.action === 'approve') {
    if (result.arg && !/^all$/i.test(result.arg)) { // single PR — must be an open evolve/* PR
      const { number, error } = evolvePrOnly(result.arg);
      if (error) return `Cannot approve: ${error}.`;
      const r = mergePR(number);
      return r.status === 0 ? `Merged PR #${number}. Folded into the corpus.` : `Approve of #${number} failed: ${(r.stderr || '').slice(0, 200)}`;
    }
    return batchOp('approve', mergePR); // bare /approve or /approve all
  }
  if (result.action === 'reject') {
    if (/^all$/i.test(result.arg || '')) return batchOp('reject', closePR); // /reject all
    const { number, error } = resolvePr(result.arg); // single (latest if no number)
    if (error) return `Cannot reject: ${error}.`;
    const r = closePR(number);
    return r.status === 0 ? `Closed PR #${number}.` : `Reject of #${number} failed: ${(r.stderr || '').slice(0, 200)}`;
  }
  return result.reply;
}

// ── Telegram long-poll ───────────────────────────────────────────────────────
async function tg(method, body) {
  const res = await fetch(`https://api.telegram.org/bot${TOKEN()}/${method}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  return res.json();
}
const send = (text) => text && tg('sendMessage', { chat_id: CHAT(), text });

async function loop() {
  if (!TOKEN() || !CHAT()) { console.error('control-bot: set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID'); process.exit(1); }
  console.log('control-bot: listening (allowlisted chat only)…');
  await send('Control bot online. /help for commands.');
  let offset = 0;
  for (;;) {
    let updates;
    try { updates = await tg('getUpdates', { offset, timeout: 30, allowed_updates: ['message'] }); }
    catch (e) { console.error('getUpdates error:', e.message); await new Promise((r) => setTimeout(r, 3000)); continue; }
    for (const u of updates.result || []) {
      offset = u.update_id + 1;
      const msg = u.message; if (!msg?.text) continue;
      if (String(msg.chat?.id) !== CHAT()) continue; // strict allowlist — ignore everyone else
      try {
        const result = applyCommand(msg.text, loadCfg());
        const reply = perform(result);
        if (reply) await send(reply);
      } catch (e) { await send(`error: ${e.message}`); }
    }
  }
}

// ── CLI ──────────────────────────────────────────────────────────────────────
if (resolve(process.argv[1] || '') === resolve(fileURLToPath(import.meta.url))) {
  if (process.argv.includes('--check')) {
    const cfg = loadCfg();
    console.log('control-bot --check');
    console.log('  TELEGRAM_BOT_TOKEN:', TOKEN() ? 'set' : 'MISSING');
    console.log('  TELEGRAM_CHAT_ID:', CHAT() || 'MISSING');
    console.log('  config:\n' + fmtCfg(cfg).split('\n').map((l) => '    ' + l).join('\n'));
    for (const t of ['/status', '/pause', '/set candidates_per_run 6', '/set candidates_per_run 99', '/approve', '/approve all', '/approve 7', '/reject all', '/bogus']) {
      const r = applyCommand(t, cfg);
      console.log(`  "${t}" -> action=${r.action}${r.arg ? ` arg=${r.arg}` : ''} :: ${(r.reply || '').split('\n')[0]}`);
    }
    process.exit(0);
  }
  loop();
}
