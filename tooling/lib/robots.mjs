// Minimal, dependency-free robots.txt fetch + parse + allow-check.
// Honors User-agent groups, Disallow/Allow with longest-match-wins
// (Allow breaks ties), `*` wildcards and `$` end-anchors, and Crawl-delay.
// Conservative failure policy: a missing robots.txt (404/410) means unrestricted,
// but a network error or any other status (401/403/5xx) means we CANNOT know the
// policy — fetchRobots returns null, isAllowed(null, …) is false, and the failure
// is never cached, so the harvester fails closed and retries next run.
import { cacheGet, cachePut } from './cache.mjs';

export function parseRobots(text) {
  const groups = {}; // ua -> { rules: [{type, path}], crawlDelay }
  let active = []; // current user-agents accumulating rules
  let sawRuleSinceUA = false;

  const ensure = (ua) => (groups[ua] ||= { rules: [], crawlDelay: null });

  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) continue;
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const field = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();

    if (field === 'user-agent') {
      // consecutive User-agent lines (with no rules between) share one group
      if (sawRuleSinceUA) { active = []; sawRuleSinceUA = false; }
      active.push(value.toLowerCase());
      ensure(value.toLowerCase());
    } else if (field === 'disallow' || field === 'allow') {
      sawRuleSinceUA = true;
      if (active.length === 0) active = ['*'], ensure('*');
      for (const ua of active) ensure(ua).rules.push({ type: field, path: value });
    } else if (field === 'crawl-delay') {
      sawRuleSinceUA = true;
      const n = parseFloat(value);
      for (const ua of active) ensure(ua).crawlDelay = Number.isFinite(n) ? n : null;
    }
  }
  return { groups };
}

export async function fetchRobots(origin, ua = '*') {
  const url = new URL('/robots.txt', origin).href;
  const key = `robots:${url}`;
  let text = cacheGet(key);
  if (text == null) {
    try {
      const res = await fetch(url, { headers: { 'user-agent': ua }, redirect: 'follow' });
      if (res.ok) text = await res.text();
      else if (res.status === 404 || res.status === 410) text = ''; // no robots.txt => unrestricted
      else return null; // 401/403/5xx: policy unknowable — fail closed, do NOT cache
    } catch {
      return null; // network failure — fail closed, do NOT cache
    }
    cachePut(key, text);
  }
  return parseRobots(text);
}

function pickGroup(robots, ua) {
  const lc = ua.toLowerCase();
  // exact-ish: longest matching token in our UA string, else '*'
  let best = null;
  for (const key of Object.keys(robots.groups)) {
    if (key === '*') continue;
    if (lc.includes(key)) { if (!best || key.length > best.length) best = key; }
  }
  return robots.groups[best] || robots.groups['*'] || null;
}

function ruleToRegex(path) {
  // escape regex chars except our wildcards * and end-anchor $
  let re = '';
  for (let i = 0; i < path.length; i++) {
    const c = path[i];
    if (c === '*') re += '.*';
    else if (c === '$' && i === path.length - 1) re += '$';
    else re += c.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp('^' + re);
}

export function isAllowed(robots, pathname, ua = '*') {
  if (!robots) return false; // fetchRobots failed — policy unknowable, fail closed
  const group = pickGroup(robots, ua);
  if (!group || group.rules.length === 0) return true; // nothing said => allowed
  let best = { len: -1, allow: true };
  for (const rule of group.rules) {
    if (rule.path === '') continue; // empty Disallow = allow all (no constraint)
    if (ruleToRegex(rule.path).test(pathname)) {
      const len = rule.path.length;
      const isAllow = rule.type === 'allow';
      if (len > best.len || (len === best.len && isAllow)) best = { len, allow: isAllow };
    }
  }
  return best.allow;
}

// Convenience: fetch robots for a URL's origin and check that exact URL.
export async function urlAllowed(url, ua = '*') {
  try {
    const u = new URL(url);
    const robots = await fetchRobots(u.origin, ua);
    return isAllowed(robots, u.pathname + u.search, ua);
  } catch {
    return false; // fail closed
  }
}
