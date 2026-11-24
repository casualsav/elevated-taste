#!/usr/bin/env node
/**
 * report.mjs — Phase 3 Telegram run digest.
 *
 * After a weekly evolve run, send the user a digest: each site that passed the gate and landed on
 * main (source link + commit), and each one held in a PR labelled `hold` because it failed.
 * Fails open: no secrets / dry mode → prints instead.
 *
 * Secrets (environment ONLY — evolve.config.json is committed, never read for secrets):
 * TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID.
 */
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');

export function buildSummary({ results = [], skipped = [], coverage = [], degraded = [] } = {}) {
  const landed = results.filter((r) => r.landed);
  const held = results.filter((r) => r.pr?.url);
  const failed = results.filter((r) => r.error);
  const lines = ['Web Design Taste - weekly evolve'];
  if (landed.length) {
    lines.push(`${landed.length} new exemplar(s) passed the gate and landed on main:`);
    for (const r of landed) lines.push('', `${r.slug} (${r.corpus})`, `  site: ${r.url}`, ...(r.landed.url ? [`  commit (revert to drop it): ${r.landed.url}`] : []));
  }
  if (held.length) {
    lines.push('', `${held.length} failed the gate and wait for you (PR labelled hold - fix and merge, or close):`);
    for (const r of held) lines.push('', `${r.slug} (${r.corpus})`, `  site: ${r.url}`, `  PR: ${r.pr.url}`);
  }
  if (!landed.length && !held.length) lines.push('No new exemplars this run.');
  if (failed.length) lines.push(`\n${failed.length} candidate(s) could not be landed or held - check the run log.`);
  if (skipped.length) lines.push(`Skipped ${skipped.length} already in the corpus.`);
  if (degraded.length) lines.push(`\n${degraded.length} capture(s) distilled on reduced evidence: ${degraded.join('; ')}.`);
  if (coverage.length) {
    const worst = coverage.slice(0, 5).map((g) => `${g.category} ${g.have}/${g.target}`).join(', ');
    lines.push(`\nCoverage gaps (production app UI): ${worst}. Galleries can't fill these - queue sites in tooling/manual-sources.json.`);
  }
  return lines.join('\n');
}

export async function sendReport(payload, { cfg = {}, dry = false } = {}) {
  const text = buildSummary(payload);
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  const wantTelegram = cfg.report?.telegram !== false;
  const blocked = dry || process.env.EVOLVE_REPORT_DRY === '1' || !wantTelegram || !token || !chat;

  if (blocked) {
    const why = !token || !chat ? ' (no TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID set - printed only)' : '';
    console.log(`--- evolve digest (not sent)${why} ---\n${text}`);
    return { sent: false, text };
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true }),
    });
    if (!res.ok) { console.error('telegram sendMessage failed:', res.status, (await res.text()).slice(0, 200)); return { sent: false, text }; }
    return { sent: true, text };
  } catch (e) {
    console.error('report send error:', e.message);
    return { sent: false, text };
  }
}

if (resolve(process.argv[1] || '') === resolve(fileURLToPath(import.meta.url))) {
  const sample = {
    results: [
      { slug: 'attio', corpus: 'production', url: 'https://attio.com', landed: { sha: 'abc1234', url: 'https://github.com/casualsav/taste/commit/abc1234' } },
      { slug: 'auralite', corpus: 'expressive', url: 'https://auralite.io', pr: { url: 'https://github.com/casualsav/taste/pull/3' } },
    ],
    skipped: [{}, {}],
  };
  sendReport(sample, { dry: true });
}
