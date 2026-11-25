// The plugin listing (.claude-plugin/) must point at files that exist, and the plugin's hook
// copies must stand aside when a clone already wires the same hook.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { test } from 'node:test';

const ROOT = resolve(import.meta.dirname, '..', '..');
const json = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));
const asList = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);

test('marketplace lists this repo as the web-design-taste plugin', () => {
  const m = json('.claude-plugin/marketplace.json');
  const p = json('.claude-plugin/plugin.json');
  assert.equal(m.name, 'elevated-taste');
  assert.ok(m.owner?.name);
  const entry = m.plugins.find((x) => x.name === p.name);
  assert.ok(entry, 'marketplace entry for the plugin');
  assert.equal(entry.source, './');
});

test('every path plugin.json names exists', () => {
  const p = json('.claude-plugin/plugin.json');
  assert.match(p.version, /^\d+\.\d+\.\d+$/);
  for (const key of ['skills', 'commands', 'agents', 'hooks']) {
    for (const rel of asList(p[key])) assert.ok(existsSync(join(ROOT, rel)), `${key}: ${rel}`);
  }
  for (const rel of asList(p.agents)) assert.match(rel, /\.md$/, 'agents take files, not directories');
});

test('plugin hooks run scripts that exist, via CLAUDE_PLUGIN_ROOT', () => {
  const { hooks } = json(json('.claude-plugin/plugin.json').hooks);
  const cmds = Object.values(hooks).flat().flatMap((g) => g.hooks.map((h) => h.command));
  assert.ok(cmds.length >= 3);
  for (const c of cmds) {
    const m = c.match(/"\$\{CLAUDE_PLUGIN_ROOT\}\/([^"]+)"/);
    assert.ok(m, `uses CLAUDE_PLUGIN_ROOT: ${c}`);
    assert.ok(existsSync(join(ROOT, m[1])), m[1]);
  }
});

function shadowed(projectDir, home) {
  const lib = join(ROOT, '.claude', 'hooks', 'lib', 'taste-repo.mjs');
  const code = `import(${JSON.stringify(lib)}).then((m) => process.stdout.write(String(m.pluginHookShadowed('stop-gate.mjs', ${JSON.stringify(projectDir)}))))`;
  return execFileSync(process.execPath, ['-e', code], {
    env: { ...process.env, CLAUDE_PLUGIN_ROOT: ROOT, HOME: home },
    encoding: 'utf8',
  });
}

test('plugin hook stands aside only when a clone wires the same hook', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'plugin-test-'));
  const home = join(tmp, 'home');
  const plain = join(tmp, 'plain');
  mkdirSync(join(home, '.claude'), { recursive: true });
  mkdirSync(plain);
  assert.equal(shadowed(plain, home), 'false');
  assert.equal(shadowed(ROOT, home), 'true', 'project has its own .claude/hooks copy');
  writeFileSync(join(home, '.claude', 'settings.json'), '{"hooks":{"Stop":[{"hooks":[{"command":"node /x/stop-gate.mjs"}]}]}}');
  assert.equal(shadowed(plain, home), 'true', 'global install wires it');
});
