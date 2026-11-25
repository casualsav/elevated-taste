// Tiny on-disk JSON cache under .cache/. Used to avoid re-fetching robots.txt
// and gallery listing HTML during a harvest run. No external deps.
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const DIR = join(process.cwd(), '.cache');

function pathFor(key) {
  const h = createHash('sha1').update(key).digest('hex');
  return join(DIR, `${h}.json`);
}

export function cacheGet(key) {
  try {
    const p = pathFor(key);
    if (!existsSync(p)) return null;
    const o = JSON.parse(readFileSync(p, 'utf8'));
    if (o.exp && Date.now() > o.exp) return null;
    return o.val;
  } catch {
    return null;
  }
}

export function cachePut(key, val, ttlMs = 24 * 60 * 60 * 1000) {
  mkdirSync(DIR, { recursive: true });
  writeFileSync(pathFor(key), JSON.stringify({ key, val, exp: ttlMs ? Date.now() + ttlMs : 0 }));
}
