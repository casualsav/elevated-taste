import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lintText, errorCount } from '../design-lint.mjs';

const rules = (f) => f.map((x) => `${x.level}:${x.rule}`);

test('token-only CSS is clean', () => {
  assert.deepEqual(lintText('a.css', '.card { color: var(--color-fg); padding: var(--space-4); border-radius: var(--radius-md); }'), []);
});

test('default Tailwind palette classes are errors', () => {
  const f = lintText('a.html', '<div class="text-purple-500">Hi</div>');
  assert.ok(rules(f).includes('error:tw-default-palette'));
  assert.ok(errorCount(f) > 0);
});

test('the owner rule against mono caps is a warning, not an error', () => {
  const f = lintText('a.css', '.eyebrow { font-family: var(--font-mono); text-transform: uppercase; }');
  assert.deepEqual(rules(f), ['warn:owner-mono-caps']);
  assert.equal(errorCount(f), 0);
});
