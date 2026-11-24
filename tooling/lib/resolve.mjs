/**
 * resolve.mjs — best-effort resolution of a gallery DETAIL-page URL to the real exemplar site
 * (Phase 3). Many galleries (Land-book, Awwwards, The FWA) list a detail page, not the external
 * site; harvest tags those `needs_resolve`. This opens the detail page and picks the most
 * prominent outbound external link. Robots-aware. Returns the site origin or null (caller skips).
 *
 * Live/network only — exercised in real cron runs, bypassed in dry-run.
 */
import { chromium } from 'playwright';
import { fetchRobots, isAllowed } from './robots.mjs';

const UA = 'web-design-taste-bot/0.1 (+https://localhost; respects robots.txt; private design reference)';
const NON_SITE = [
  'twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'linkedin.com', 'youtube.com',
  'github.com', 'dribbble.com', 'behance.net', 'pinterest.com', 't.me', 'medium.com',
  'land-book.com', 'awwwards.com', 'thefwa.com', 'godly.website', 'cssdesignawards.com', 'lapa.ninja',
];

export async function resolveExternalUrl(detailUrl, { timeout = 30000 } = {}) {
  let browser;
  try {
    const u = new URL(/^[a-z]+:\/\//.test(detailUrl) ? detailUrl : 'https://' + detailUrl);
    const robots = await fetchRobots(u.origin, UA);
    if (!isAllowed(robots, u.pathname + u.search, UA)) return null;
    browser = await chromium.launch();
    const ctx = await browser.newContext({ userAgent: UA });
    const page = await ctx.newPage();
    await page.goto(u.href, { waitUntil: 'domcontentloaded', timeout });
    await page.waitForTimeout(1500);
    const host = u.hostname.replace(/^www\./, '');
    const links = await page.evaluate(({ host, deny }) => {
      const res = [];
      for (const a of document.querySelectorAll('a[href]')) {
        let x; try { x = new URL(a.getAttribute('href'), location.href); } catch { continue; }
        if (!/^https?:$/.test(x.protocol)) continue;
        const h = x.host.replace(/^www\./, '');
        if (h === host || deny.some((s) => h.includes(s))) continue;
        const txt = (a.textContent || '').toLowerCase();
        const score = (a.target === '_blank' ? 2 : 0)
          + (/visit|website|live site|view site|launch|open site/.test(txt) ? 3 : 0)
          + (/(external|noopener)/i.test(a.rel || '') ? 1 : 0);
        res.push({ url: x.origin, score });
      }
      return res;
    }, { host, deny: NON_SITE });
    if (!links.length) return null;
    links.sort((a, b) => b.score - a.score);
    return links[0].url;
  } catch {
    return null;
  } finally {
    try { await browser?.close(); } catch { /* ignore */ }
  }
}
