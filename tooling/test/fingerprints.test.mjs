import { test } from 'node:test';
import assert from 'node:assert/strict';
import { distance, keyFor } from '../lib/fingerprints.mjs';

const zero = '0'.repeat(64);

test('distance counts differing bits between two 256-bit hashes', () => {
  assert.equal(distance(zero, zero), 0);
  assert.equal(distance(zero, `1${'0'.repeat(63)}`), 1);
  assert.equal(distance(zero, 'f'.repeat(64)), 256);
});

test('distance refuses anything that is not a 64-char lowercase hex hash', () => {
  assert.equal(distance(zero, null), null);
  assert.equal(distance(zero, 'abc'), null);
  assert.equal(distance('F'.repeat(64), zero), null);
});

test('fingerprints are keyed by corpus and slug', () => {
  assert.equal(keyFor('production', 'linear'), 'production/linear');
});
