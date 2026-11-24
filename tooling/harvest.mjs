#!/usr/bin/env node
// Harvest winner URLs + public metadata from gallery listing pages into
// corpus/<corpus>/sources.json. Robots-aware, rate-limited, cached, graceful.
//
//   node tooling/harvest.mjs --gallery landbook --limit 8 --dry-run
//   node tooling/harvest.mjs --corpus production --limit 20
//   node tooling/harvest.mjs --all --limit 20
//
// Galleries are used ONLY to discover URLs + metadata — gallery markup is never
// treated as design. Paywalled sources (Mobbin/Refero) have no adapter; add them
// by hand to tooling/manual-sources.json.

import { chromium } from 'playwright';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fetchRobots, isAllowed } from './lib/robots.mjs';

import awwwards from './lib/adapters/awwwards.mjs';
import cssdesignawards from './lib/adapters/cssdesignawards.mjs';
import thefwa from './lib/adapters/thefwa.mjs';
import godly from './lib/adapters/godly.mjs';
import landbook from './lib/adapters/landbook.mjs';
import lapaninja from './lib/adapters/lapaninja.mjs';
import siteinspire from './lib/adapters/siteinspire.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const UA = 'web-design-taste-bot/0.1 (+https://localhost; respects robots.txt; private design reference)';
const ALL = [awwwards, cssdesignawards, thefwa, godly, landbook, lapaninja, siteinspire];

function parseArgs(argv) {
  const a = { limit: 12, dryRun: false };
  for (let i = 2; i < argv.length; i++) {
    const t = argv[i];
    if (t === '--dry-run') a.dryRun = true;
    else if (t === '--all') a.all = true;
    else if (t === '--gallery') a.gallery = argv[++i];
    else if (t === '--corpus') a.corpus = argv[++i];
    else if (t === '--limit') a.limit = parseInt(argv[++i], 10) || 12;
    else if (t === '--json') a.json = true; // emit candidates to stdout, do NOT touch sources.json (Phase 3)
  }
  return a;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function autoScroll(page, steps = 6, dy = 1400, pause = 400) {
  for (let i = 0; i < steps; i++) {
    await page.evaluate((y) => window.scrollBy(0, y), dy);
    await page.waitForTimeout(pause);
  }
}

// Runs in the browser. Only the serializable `cfg` crosses the boundary.
async function extract(page, cfg, limit) {
  return page.evaluate(({ cfg, limit }) => {
    const out = [];
    const seen = new Set();
    const host = location.host.replace(/^www\./, '');
    const social = ['twitter.com','x.com','facebook.com','instagram.com','linkedin.com','youtube.com','github.com','dribbble.com','behance.net','pinterest.com','t.me','medium.com'];
    const re = cfg.detailPattern ? new RegExp(cfg.detailPattern) : null;
    const anchors = Array.from(document.querySelectorAll(cfg.linkSelector || 'a[href]'));
    for (const a of anchors) {
      const raw = a.getAttribute('href');
      if (!raw) continue;
      let u;
      try { u = new URL(raw, location.href); } catch { continue; }
      if (!/^https?:$/.test(u.protocol)) continue;
      const uHost = u.host.replace(/^www\./, '');
      if (cfg.strategy === 'detail') {
        if (uHost !== host) continue;
        if (re && !re.test(u.pathname)) continue;
      } else { // external
        if (uHost === host) continue;
        if (social.some((s) => uHost.includes(s))) continue;
      }
      const key = (u.origin + u.pathname).replace(/\/$/, '');
      if (seen.has(key)) continue;
      seen.add(key);
      let title = (a.textContent || '').trim().replace(/\s+/g, ' ');
      if (!title) { const img = a.querySelector('img'); if (img) title = (img.getAttribute('alt') || '').trim(); }
      if (!title) title = (a.getAttribute('title') || '').trim();
      out.push({ url: cfg.strategy === 'detail' ? u.href : key, title: title.slice(0, 160) });
      if (out.length >= limit) break;
    }
    return out;
  }, { cfg, limit });
}

// A gallery that throws was warned about and then forgotten: harvest still exited 0, so a run
// where every gallery was down looked like a run where the galleries simply had nothing new.
let listingsAttempted = 0, listingsFailed = 0;

const cfgOf = (a) => ({ strategy: a.strategy, detailPattern: a.detailPattern || null, linkSelector: a.linkSelector || 'a[href]' });

async function harvestAdapter(browser, adapter, limit) {
  const robots = await fetchRobots(adapter.origin, UA);
  const ctx = await browser.newContext({ userAgent: UA });
  const page = await ctx.newPage();
  const found = [];
  for (const listing of adapter.listings) {
    const lu = new URL(listing);
    if (!isAllowed(robots, lu.pathname + lu.search, UA)) {
      console.warn(`  [robots] skipped (disallowed): ${listing}`);
      continue;
    }
    listingsAttempted++;
    try {
      await page.goto(listing, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(2000);
      await autoScroll(page);
      const items = await extract(page, cfgOf(adapter), limit);
      for (const it of items) {
        found.push({
          url: it.url,
          title: it.title || null,
          source: adapter.name,
          corpus: adapter.corpus,
          gallery_url: listing,
          award_type: adapter.award_type || null,
          score: null,
          tags: [],
          robots_ok: true,
          harvested_at: new Date().toISOString().slice(0, 10),
          needs_resolve: adapter.strategy === 'detail',
        });
      }
      console.log(`  ${adapter.name}: ${items.length} from ${listing}`);
    } catch (e) {
      listingsFailed++;
      console.warn(`  ${adapter.name}: FAILED ${listing} — ${e.message}`);
    }
    await sleep(adapter.rateMs || 2500);
  }
  await ctx.close();
  const seen = new Set();
  return found.filter((f) => (seen.has(f.url) ? false : seen.add(f.url)));
}

function mergeSources(corpus, entries) {
  const file = join(ROOT, 'corpus', corpus, 'sources.json');
  let existing = [];
  if (existsSync(file)) {
    // NEVER rebuild from an empty base. Swallowing the parse error here rewrote the whole
    // file from `[]`, silently dropping every existing entry — the one data-destroying path
    // in this pipeline. A corrupt sources.json is stop-and-fix, not overwrite.
    try { existing = JSON.parse(readFileSync(file, 'utf8')); }
    catch (e) { throw new Error(`refusing to rewrite ${file}: the existing file is unparseable (${e.message}) — fix or restore it first. Nothing was written.`); }
    if (!Array.isArray(existing)) throw new Error(`refusing to rewrite ${file}: expected a JSON array, got ${typeof existing}. Nothing was written.`);
  }
  const byUrl = new Map(existing.map((e) => [e.url, e]));
  for (const e of entries) byUrl.set(e.url, { ...byUrl.get(e.url), ...e });
  const merged = [...byUrl.values()];
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(merged, null, 2) + '\n');
  return merged.length;
}

async function main() {
  const args = parseArgs(process.argv);
  let adapters = ALL;
  if (args.gallery) adapters = ALL.filter((a) => a.name === args.gallery);
  else if (args.corpus) adapters = ALL.filter((a) => a.corpus === args.corpus);
  if (adapters.length === 0) { console.error('no matching adapter'); process.exit(1); }

  const browser = await chromium.launch();
  const byCorpus = { production: [], expressive: [] };
  try {
    for (const adapter of adapters) {
      console.log(`harvesting ${adapter.name} (${adapter.corpus})…`);
      const entries = await harvestAdapter(browser, adapter, args.limit);
      byCorpus[adapter.corpus].push(...entries);
    }
  } finally {
    await browser.close();
  }

  if (listingsAttempted && listingsFailed === listingsAttempted) {
    console.error(`harvest: ALL ${listingsAttempted} gallery listing(s) FAILED — no gallery candidates this run (see the FAILED lines above)`);
    process.exitCode = 1;
  } else if (listingsFailed) {
    console.warn(`harvest: ${listingsAttempted - listingsFailed}/${listingsAttempted} gallery listing(s) ok, ${listingsFailed} failed`);
  }

  if (args.json) {
    // Phase 3 emit mode: print candidates, never write the canonical sources.json.
    const all = [...byCorpus.production, ...byCorpus.expressive];
    process.stdout.write(JSON.stringify(all) + '\n');
    return;
  }

  for (const [corpus, entries] of Object.entries(byCorpus)) {
    if (entries.length === 0) continue;
    if (args.dryRun) {
      console.log(`\n[dry-run] ${corpus}: ${entries.length} entries`);
      for (const e of entries.slice(0, 25)) console.log(`  - ${e.title || '(no title)'} → ${e.url}`);
    } else {
      const total = mergeSources(corpus, entries);
      console.log(`\n${corpus}: wrote ${entries.length} new/updated → corpus/${corpus}/sources.json (${total} total)`);
    }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
