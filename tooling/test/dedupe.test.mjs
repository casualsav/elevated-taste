import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeUrl, filterNew } from '../lib/dedupe.mjs';

test('URLs normalize to host + path, without scheme, www, case or trailing slash', () => {
  assert.equal(normalizeUrl('https://www.Linear.app/'), 'linear.app');
  assert.equal(normalizeUrl('linear.app/pricing/'), 'linear.app/pricing');
  assert.equal(normalizeUrl('http://stripe.com/payments?ref=x#top'), 'stripe.com/payments');
  assert.equal(normalizeUrl(''), '');
});

test('candidates already in the corpus, or repeated in the batch, are skipped', () => {
  const keys = { slugs: new Set(['linear']), urls: new Set(['stripe.com']) };
  const { fresh, skipped } = filterNew([
    { slug: 'linear', url: 'https://example.com' },
    { slug: 'stripe-new', url: 'https://www.stripe.com/' },
    { slug: 'vercel', url: 'https://vercel.com' },
    { slug: 'vercel', url: 'https://vercel.com/home' },
  ], keys);
  assert.deepEqual(fresh.map((c) => c.slug), ['vercel']);
  assert.equal(skipped.length, 3);
});
