import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tapTargets } from '../capture-craft.mjs';

const box = (x, y, w, h, inline = false) => ({ x, y, w, h, inline });

test('links inside a sentence are exempt, however small', () => {
  const r = tapTargets([box(10, 10, 30, 16, true), box(50, 10, 30, 16, true), box(200, 200, 120, 44)]);
  assert.equal(r.measured, 1);
  assert.equal(r.flag, 'tap-targets-ok');
});

test('a small target with nothing else within 24px passes (spacing exception)', () => {
  const r = tapTargets([box(10, 10, 16, 16), box(200, 10, 16, 16), box(400, 10, 120, 44)]);
  assert.equal(r.undersized, 2);
  assert.equal(r.failing, 0);
  assert.equal(r.flag, 'tap-targets-ok');
});

test('a crowded row of small icons is risky', () => {
  const icons = [0, 1, 2, 3, 4].map((i) => box(10 + i * 18, 10, 16, 16));
  const r = tapTargets([...icons, box(400, 400, 120, 44)]);
  assert.equal(r.failing, 5);
  assert.equal(r.flag, 'tap-targets-risky');
});

test('a few failures on a big page give no flag either way', () => {
  const big = Array.from({ length: 100 }, (_, i) => box(1000, i * 60, 120, 44));
  const r = tapTargets([...big, box(10, 10, 16, 16), box(20, 10, 16, 16)]);
  assert.equal(r.failing, 2);
  assert.equal(r.flag, null);
});

test('no measurable targets gives no flag', () => {
  assert.equal(tapTargets([]).flag, null);
});
