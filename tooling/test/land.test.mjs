import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GATE } from '../lib/land.mjs';

// The gate is what lets a site land on main with no human in the loop: every check that
// keeps main healthy has to be in it, in an order where each step sees the one before.
test('the land gate runs every check, ending with the search test on a fresh index', () => {
  const steps = GATE.split('&&').map((s) => s.trim());
  for (const s of ['reconcile-sources.mjs', 'npm run validate', 'render-patterns.mjs --check', 'build-index.mjs', 'eval-retrieval.mjs']) {
    assert.ok(steps.some((x) => x.includes(s)), `gate is missing ${s}`);
  }
  assert.ok(steps.findIndex((x) => x.includes('build-index')) < steps.findIndex((x) => x.includes('eval-retrieval')));
});
