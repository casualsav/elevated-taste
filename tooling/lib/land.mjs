/**
 * land.mjs — lands each distilled site on main in the same run, or sets it aside for a human.
 *
 * Per site: a throwaway worktree off the live base branch gets only that site's files
 * (exemplars/<slug>.md + tokens/<slug>.json + the patterns named in its frontmatter) as one
 * commit, so a bad site is one `git revert` away. The gate the old daily auto-merge job ran
 * then checks that exact post-merge state:
 *
 *   node tooling/reconcile-sources.mjs && npm run validate && node tooling/render-patterns.mjs --check
 *
 * Pass → the commit is pushed straight to the base branch. Fail → the commit goes to a
 * <kind>/<date>-<slug> branch and a PR labelled `hold` carries the failing output, so the only
 * PRs that ever open are ones that need a person. Sites are gated one at a time, each on top of
 * the ones landed before it, and in isolation from the rest of the batch.
 *
 * Derived files (sources.json, corpus/index.json, tokens.css) are never committed here: the
 * reconcile step only feeds the gate, and post-merge-derivations rebuilds them after the run.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync, mkdtempSync, mkdirSync, copyFileSync, symlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');

export const GATE = 'node tooling/reconcile-sources.mjs && npm run validate && node tooling/render-patterns.mjs --check';

function git(args, cwd = ROOT) {
  return spawnSync('git', args, { cwd, encoding: 'utf8' });
}

/** that exemplar's files: exemplar + tokens + the patterns named in its frontmatter. */
function exemplarFiles(corpus, slug) {
  const files = [`corpus/${corpus}/exemplars/${slug}.md`, `corpus/${corpus}/tokens/${slug}.json`];
  try {
    const md = readFileSync(join(ROOT, files[0]), 'utf8');
    const m = md.match(/^patterns:\s*\[([^\]]*)\]/m);
    if (m) for (const p of m[1].split(',').map((s) => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean)) files.push(`corpus/${corpus}/patterns/${p}.md`);
  } catch { /* exemplar not on disk */ }
  return files.filter((f) => existsSync(join(ROOT, f)));
}

function tail(s, n = 60) {
  return (s || '').trim().split('\n').slice(-n).join('\n');
}

/**
 * Land or hold each distilled candidate. Returns the input array, each augmented with
 * `landed: { sha, url }`, `pr: { url, branch, reason }` (held), or `error`.
 */
export async function landOrHold(distilled, { cfg = {}, dry = false, kind = 'evolve' } = {}) {
  dry = dry || process.env.EVOLVE_PR_DRY === '1';
  if (!distilled?.length) return [];
  if (!/^(evolve|refresh)$/.test(kind)) throw new Error(`unknown kind "${kind}"`);
  const verb = kind === 'refresh' ? 'Refresh' : 'Evolve';
  const base = cfg.pr_base || 'main';
  const date = new Date().toISOString().slice(0, 10);
  const repoSlug = process.env.GITHUB_REPOSITORY || null;
  const out = [];
  // Log at the point of failure so every caller sees it, not only the one that prints `.error`.
  const fail = (c, msg) => { console.error(`  land: ${c.slug} — ${msg}`); out.push({ ...c, error: msg }); };

  if (dry) {
    for (const c of distilled) {
      console.log(`  ${c.slug}: commit "${verb}: ${c.slug} (${c.corpus})" on ${base} → ${GATE} → push ${base}, else PR ${kind}/${date}-${c.slug} labelled hold`);
      out.push({ ...c, landed: { sha: 'DRY', url: null } });
    }
    return out;
  }

  for (const c of distilled) {
    const files = exemplarFiles(c.corpus, c.slug);
    if (files.length < 2) { fail(c, 'distilled files missing on disk'); continue; }
    const title = `${verb}: ${c.slug} (${c.corpus})`;

    // Re-fetch per site: each one is gated on top of whatever the previous site landed.
    let r = git(['fetch', '-q', 'origin', base]);
    if (r.status !== 0) { fail(c, `fetch ${base} failed: ${tail(r.stderr, 3)}`); continue; }
    const wt = mkdtempSync(join(tmpdir(), `land-${c.slug}-`));
    rmSync(wt, { recursive: true, force: true }); // git worktree add wants a fresh path
    r = git(['worktree', 'add', '-q', '--detach', wt, `origin/${base}`]);
    if (r.status !== 0) { fail(c, `worktree add failed: ${tail(r.stderr, 3)}`); continue; }
    try {
      for (const f of files) { mkdirSync(dirname(join(wt, f)), { recursive: true }); copyFileSync(join(ROOT, f), join(wt, f)); }
      const deps = join(wt, 'node_modules');
      if (existsSync(join(ROOT, 'node_modules')) && !existsSync(deps)) {
        try { symlinkSync(join(ROOT, 'node_modules'), deps, 'dir'); } catch (e) { fail(c, `linking node_modules failed: ${e.message}`); continue; }
      }
      r = git(['add', '--', ...files], wt);
      if (r.status !== 0) { fail(c, `git add failed: ${tail(r.stderr, 3)}`); continue; }
      r = git(['commit', '-q', '-m', title], wt);
      if (r.status !== 0) { fail(c, `commit failed (no change vs ${base}?): ${tail(r.stdout + r.stderr, 3)}`); continue; }
      const sha = git(['rev-parse', 'HEAD'], wt).stdout.trim();

      console.log(`  ${c.slug}: gating ${sha.slice(0, 7)}…`);
      const g = spawnSync('sh', ['-c', GATE], { cwd: wt, encoding: 'utf8' });
      let reason = null;
      if (g.status === 0) {
        r = git(['push', '-q', 'origin', `HEAD:refs/heads/${base}`], wt);
        if (r.status === 0) {
          console.log(`  ${c.slug}: landed on ${base} as ${sha.slice(0, 7)}`);
          out.push({ ...c, landed: { sha, url: repoSlug ? `https://github.com/${repoSlug}/commit/${sha}` : null } });
          continue;
        }
        reason = `The gate passed, but pushing to \`${base}\` was refused (it moved during the run?):\n\n\`\`\`\n${tail(r.stderr, 20)}\n\`\`\``;
      } else {
        reason = `\`${GATE}\` failed on this change merged onto \`${base}\`:\n\n\`\`\`\n${tail(`${g.stdout || ''}\n${g.stderr || ''}`)}\n\`\`\``;
      }

      // Held: the commit goes to its own branch and a PR labelled `hold` asks for a person.
      // Never force: a same-day re-run must not overwrite fixes a person pushed to an earlier hold branch.
      let branch = `${kind}/${date}-${c.slug}`;
      r = git(['push', '-q', 'origin', `HEAD:refs/heads/${branch}`], wt);
      if (r.status !== 0) {
        branch = `${branch}-${sha.slice(0, 7)}`;
        r = git(['push', '-q', 'origin', `HEAD:refs/heads/${branch}`], wt);
      }
      if (r.status !== 0) { fail(c, `not landed, and pushing ${branch} for a hold PR failed: ${tail(r.stderr, 3)}`); continue; }
      const body = [
        `Distilled from ${c.url} — **not landed**: it needs a person.`, '',
        `**Source site:** ${c.url}`,
        '', reason, '',
        'Fix the branch and merge it, or close this PR to skip the site. Nothing merges it automatically.', '',
        `Generated by tooling/${kind}.mjs`,
      ].join('\n');
      const gh = (args) => spawnSync('gh', args, { cwd: ROOT, encoding: 'utf8' });
      // `--label` fails the whole create when the label is missing, so make sure it exists first.
      gh(['label', 'create', 'hold', '--color', 'B60205', '--description', 'Failed the evolve gate; needs a person']);
      r = gh(['pr', 'create', '--base', base, '--head', branch, '--title', title, '--body', body, '--label', 'hold']);
      if (r.status !== 0) { fail(c, `not landed; branch ${branch} pushed, but gh pr create failed: ${tail(r.stderr, 3)}`); continue; }
      const url = (r.stdout || '').trim().split('\n').filter(Boolean).pop() || null;
      console.log(`  ${c.slug}: held — ${url}`);
      out.push({ ...c, pr: { url, branch, reason } });
    } finally {
      git(['worktree', 'remove', '--force', wt]);
      rmSync(wt, { recursive: true, force: true });
    }
  }
  return out;
}

if (resolve(process.argv[1] || '') === resolve(fileURLToPath(import.meta.url))) {
  landOrHold([{ slug: 'linear', corpus: 'production', url: 'https://linear.app' }, { slug: 'auralite', corpus: 'expressive', url: 'https://auralite.io' }], { dry: true })
    .then((rs) => console.log(`would gate ${rs.length} site(s), landing each that passes`));
}
