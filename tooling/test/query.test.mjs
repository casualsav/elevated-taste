import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tokenizeBrief, inferWhen, scoreEntry, rankEntries } from '../query.mjs';

const ex = (slug, o = {}) => ({ slug, corpus: 'production', surface: 'site', tags: [], when_to_use: [], directions: [], layout: [], a11y: [], summary: '', ...o });

test('"sign in" and "log in" survive the stopword list as one word', () => {
  assert.deepEqual(tokenizeBrief('Sign in page'), ['signin']);
  assert.deepEqual(tokenizeBrief('log-in screen'), ['signin', 'screen']);
  assert.deepEqual(tokenizeBrief('sign up form'), ['signup', 'form']);
});

test('plain words imply when_to_use categories', () => {
  assert.deepEqual(inferWhen(tokenizeBrief('admin dashboard')), ['dashboard', 'data-table']);
  assert.deepEqual(inferWhen(tokenizeBrief('sign in page')), ['auth']);
  assert.deepEqual(inferWhen(tokenizeBrief('a bakery')), []);
});

test('a real app screen outranks a marketing page for an app job', () => {
  const app = ex('app-screen', { surface: 'app', when_to_use: ['dashboard'] });
  const site = ex('marketing', { surface: 'site', when_to_use: ['dashboard'] });
  const briefTokens = tokenizeBrief('analytics dashboard');
  assert.ok(scoreEntry(app, { briefTokens }).s > scoreEntry(site, { briefTokens }).s);
  assert.deepEqual(rankEntries([site, app], { briefTokens }).map((r) => r.e.slug), ['app-screen', 'marketing']);
});

test('the surface boost only applies when the job matches the surface', () => {
  const docs = ex('docs-site', { surface: 'docs', when_to_use: ['dashboard'] });
  const site = ex('marketing', { when_to_use: ['dashboard'] });
  const briefTokens = tokenizeBrief('dashboard');
  assert.equal(scoreEntry(docs, { briefTokens }).s, scoreEntry(site, { briefTokens }).s);
});

test('an a11y risk lowers a score but never zeroes a match', () => {
  const risky = ex('risky', { when_to_use: ['pricing'], a11y: ['focus-visible-missing'] });
  const clean = ex('clean', { when_to_use: ['pricing'] });
  const briefTokens = tokenizeBrief('pricing');
  const r = scoreEntry(risky, { briefTokens }).s;
  assert.ok(r > 0 && r < scoreEntry(clean, { briefTokens }).s);
});

test('rankEntries keeps only the asked corpus and drops non-matches', () => {
  const items = [ex('a', { when_to_use: ['pricing'] }), ex('b', { corpus: 'expressive', when_to_use: ['pricing'] }), ex('c')];
  assert.deepEqual(rankEntries(items, { briefTokens: ['pricing'] }).map((r) => r.e.slug), ['a']);
  assert.equal(rankEntries(items, { corpus: 'both', briefTokens: ['pricing'] }).length, 2);
});
