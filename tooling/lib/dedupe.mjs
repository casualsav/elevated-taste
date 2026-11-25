/**
 * Dedupe harvested candidates against what's already in the corpus (Phase 3).
 *
 * The corpus carries stable identity in two places — `slug` and `url` — across both
 * `corpus/<corpus>/sources.json` logs. A candidate is "new" only if neither its slug nor its
 * normalized URL already exists (in either corpus) and it isn't a duplicate within the batch.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/** host+path, lowercased, protocol/www/query/hash/trailing-slash stripped — so
 *  https://www.Linear.app/ and http://linear.app match. */
export function normalizeUrl(u) {
  if (!u) return '';
  let s = String(u).trim().toLowerCase();
  if (!/^[a-z]+:\/\//.test(s)) s = 'https://' + s;
  try {
    const url = new URL(s);
    const host = url.hostname.replace(/^www\./, '');
    const path = url.pathname.replace(/\/+$/, '');
    return host + path;
  } catch {
    return s.replace(/^[a-z]+:\/\//, '').replace(/^www\./, '').split(/[?#]/)[0].replace(/\/+$/, '');
  }
}

/** Pull a scalar frontmatter field from an exemplar .md (first `---` block). */
function frontmatterField(md, key) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const line = m[1].split('\n').find((l) => l.trim().startsWith(key + ':'));
  return line ? line.slice(line.indexOf(':') + 1).trim().replace(/^["']|["']$/g, '') : null;
}

/**
 * Gather existing { slugs, urls } from the actual exemplar files (the source of truth), not the
 * derived sources.json — so a freshly-merged exemplar is deduped immediately, even per-website PR.
 */
export function loadExistingKeys(root, corpora = ['production', 'expressive']) {
  const slugs = new Set();
  const urls = new Set();
  for (const c of corpora) {
    let files = [];
    try { files = readdirSync(join(root, 'corpus', c, 'exemplars')).filter((f) => f.endsWith('.md')); } catch { /* none yet */ }
    for (const f of files) {
      let md = ''; try { md = readFileSync(join(root, 'corpus', c, 'exemplars', f), 'utf8'); } catch { continue; }
      const slug = frontmatterField(md, 'slug') || f.replace(/\.md$/, '');
      const url = frontmatterField(md, 'url');
      if (slug) slugs.add(slug.toLowerCase());
      if (url) urls.add(normalizeUrl(url));
    }
  }
  return { slugs, urls };
}

/**
 * Split candidates into { fresh, skipped }. Each skipped item carries a `reason`.
 * `keys` is the output of loadExistingKeys (pass it in so callers can reuse it).
 */
export function filterNew(candidates, keys) {
  const fresh = [];
  const skipped = [];
  const batchSlugs = new Set();
  const batchUrls = new Set();
  for (const cand of candidates || []) {
    const slug = String(cand.slug || '').toLowerCase();
    const nurl = normalizeUrl(cand.url);
    let reason = null;
    if (slug && keys.slugs.has(slug)) reason = `slug "${slug}" already in corpus`;
    else if (nurl && keys.urls.has(nurl)) reason = `url ${nurl} already in corpus`;
    else if (slug && batchSlugs.has(slug)) reason = `slug "${slug}" duplicated in this batch`;
    else if (nurl && batchUrls.has(nurl)) reason = `url ${nurl} duplicated in this batch`;
    if (reason) { skipped.push({ ...cand, reason }); continue; }
    if (slug) batchSlugs.add(slug);
    if (nurl) batchUrls.add(nurl);
    fresh.push(cand);
  }
  return { fresh, skipped };
}
