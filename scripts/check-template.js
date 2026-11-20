#!/usr/bin/env node
/*
 * scripts/check-template.js — the new-app template must produce an app that
 * passes its own gates.
 *
 *   node scripts/check-template.js            # structural gates
 *   node scripts/check-template.js --ui       # also the Playwright smoke suite
 *   node scripts/check-template.js --keep     # keep the generated app and print its path
 *
 * It creates a throw-away app with scripts/new-app.js in the OS temp folder and
 * runs, inside it: scripts/check.js, scripts/smoke-sw.js,
 * scripts/checks/suite-markup.js and scripts/scan-secrets.js (and, with --ui,
 * `playwright test` from the machine-wide install). Any failure fails this script.
 * The template can no longer break without CI noticing.
 */
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { createApp } = require('./new-app.js');

const keep = process.argv.includes('--keep');
const ui = process.argv.includes('--ui');
const dest = fs.mkdtempSync(path.join(os.tmpdir(), 'apptonomia-template-'));
const app = path.join(dest, 'demo-app');

function run(label, command, args) {
  const result = spawnSync(command, args, { cwd: app, encoding: 'utf8', shell: process.platform === 'win32' && command !== process.execPath });
  const output = `${result.stdout || ''}${result.stderr || ''}`.trim();
  if (result.status !== 0) {
    console.error(`✗ ${label}\n${output.replace(/^/gm, '    ')}`);
    return false;
  }
  console.log(`ok       ${label}${output ? ' — ' + output.split('\n').pop() : ''}`);
  return true;
}

let ok = true;
try {
  createApp({ slug: 'demo-app', es: 'Demo Ñandú', en: 'Demo App', dest: app, set: {}, with: [] });
  const accents = fs.readFileSync(path.join(app, 'strings.es.js'), 'utf8').includes('Demo Ñandú');
  console.log(accents ? 'ok       UTF-8 names survive the bootstrap' : '✗ UTF-8 names were mangled');
  ok = accents;
  ok = run('scripts/check.js', process.execPath, ['scripts/check.js']) && ok;
  ok = run('scripts/smoke-sw.js', process.execPath, ['scripts/smoke-sw.js']) && ok;
  ok = run('scripts/checks/suite-markup.js', process.execPath, ['scripts/checks/suite-markup.js']) && ok;
  ok = run('scripts/scan-secrets.js', process.execPath, ['scripts/scan-secrets.js']) && ok;
  if (ui) ok = run('playwright test', 'playwright', ['test']) && ok;
} catch (e) {
  console.error(`✗ new-app.js: ${e.message}`);
  ok = false;
} finally {
  if (keep) console.log(`kept     ${app}`);
  else fs.rmSync(dest, { recursive: true, force: true });
}

if (!ok) {
  console.error('\nThe template does not produce a passing app. Fix doc/templates/.');
  process.exitCode = 1;
} else {
  console.log('\nThe template produces an app that passes its own gates.');
}
