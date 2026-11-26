#!/usr/bin/env node
/*
 * scripts/check.js — structural check of {{DISPLAY_EN}}.
 *
 *   node scripts/check.js
 *
 * Plain Node, no dependencies, no `npm install`. CI runs it on every push/PR.
 *
 * Checks:
 *   1. Every .js file parses (node --check).
 *   2. The required files exist (REQUIRED below).
 *   3. strings.es.js and strings.en.js register the same keys (App.i18n.register).
 *   4. Every data-i18n* key used in an HTML page exists in strings.es.js.
 *   5. sw.js ↔ disk, both ways: every FILES entry exists, and every shipped
 *      file (SHIPPED_EXT, outside the internal folders) is in FILES.
 *   6. .assetsignore keeps the internal folders out of the deploy.
 *   7. _headers stays within Cloudflare's 100-rule limit.
 *   8. No shipped file exceeds Cloudflare's 25 MiB per-file limit.
 *   9. No bootstrap placeholder (an upper-case name in double braces) is left.
 *
 * Add the app's own checks at the end (catalogue anatomy, forbidden terms,
 * etc.; see Routime's and Apptonomia's check.js for examples).
 *
 * Output: one line per failure. Exit 1 when there is any, "OK (N checks)" otherwise.
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const { readSwFiles, entryToFile } = require('./sw-files.js');

const ROOT = path.join(__dirname, '..');
const failures = [];
const warnings = [];
let checks = 0;

/* Folders that are never part of the deployed app. */
const INTERNAL_DIRS = new Set(['.git', '.github', '.claude', '.wrangler', '.dev', 'node_modules',
  'graphify-out', 'doc', 'scripts', 'tests', 'test-results', 'playwright-report']);

function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join('/');
}

function walk(dir, skipDir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!skipDir(entry.name)) walk(full, skipDir, out);
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

const allFiles = walk(ROOT, (name) => ['.git', 'node_modules', 'graphify-out', 'test-results', 'playwright-report', '.wrangler'].includes(name));
const shippedFiles = walk(ROOT, (name) => INTERNAL_DIRS.has(name));

/* 1. JS syntax ------------------------------------------------------------ */
for (const file of allFiles.filter((f) => f.endsWith('.js') && !rel(f).startsWith('.claude/'))) {
  checks++;
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  } catch (e) {
    failures.push(`${rel(file)}: node --check failed — ${String(e.stderr).trim()}`);
  }
}

/* 2. Required files ------------------------------------------------------- */
const REQUIRED = [
  'CLAUDE.md', 'README.md', 'README.es.md', 'LICENSE',
  'CONTRIBUTING.md', 'CONTRIBUTING.es.md', 'CODE_OF_CONDUCT.md', 'CODE_OF_CONDUCT.es.md',
  'SECURITY.md', 'SECURITY.es.md', 'CI-CD.md',
  '_headers', '.assetsignore', 'wrangler.toml', '404.html', 'index.html',
  'strings.es.js', 'strings.en.js', 'js/i18n.js', 'js/suite-chrome.js',
  'about/index.html', 'legal/index.html',
  'doc/en/index.md', 'doc/es/indice.md', '.graphifyignore'
];
const IS_PWA = fs.existsSync(path.join(ROOT, 'manifest.json'));
if (IS_PWA) REQUIRED.push('sw.js', 'manifest.json', 'scripts/check-version-bump.js', 'scripts/smoke-sw.js');
for (const file of REQUIRED) {
  checks++;
  if (!fs.existsSync(path.join(ROOT, file))) failures.push(`missing required file: ${file}`);
}
/* The graphify skill is copied in by apptonomia/scripts/sync-graphify-skill.js
   after the repo exists, so its absence is a reminder, not a failure. */
if (!fs.existsSync(path.join(ROOT, '.claude/skills/graphify/SKILL.md'))) {
  warnings.push('no .claude/skills/graphify/SKILL.md: run `node ../apptonomia/scripts/sync-graphify-skill.js sync --apply`');
}

/* 3. es/en key parity ----------------------------------------------------- */
/* Runs a strings file in a sandbox with a fake App.i18n and returns the dotted
   keys it registers for `locale`. */
function registeredKeys(file, locale) {
  const tables = [];
  const sandbox = { console };
  sandbox.window = sandbox;
  sandbox.App = { i18n: { register(table, loc) { if (loc === locale) tables.push(table); } } };
  vm.createContext(sandbox);
  try {
    vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file });
  } catch (e) {
    failures.push(`${rel(file)}: could not run it to read its keys — ${e.message}`);
    return null;
  }
  if (!tables.length) {
    failures.push(`${rel(file)}: registers no '${locale}' strings (App.i18n.register(table, '${locale}'))`);
    return null;
  }
  const keys = new Set();
  (function flatten(node, prefix) {
    for (const [key, value] of Object.entries(node)) {
      const name = prefix ? `${prefix}.${key}` : key;
      if (value && typeof value === 'object' && !Array.isArray(value)) flatten(value, name);
      else keys.add(name);
    }
  })(Object.assign({}, ...tables), '');
  return keys;
}

checks++;
const esKeys = registeredKeys(path.join(ROOT, 'strings.es.js'), 'es');
const enKeys = registeredKeys(path.join(ROOT, 'strings.en.js'), 'en');
if (esKeys && enKeys) {
  const onlyEs = [...esKeys].filter((k) => !enKeys.has(k));
  const onlyEn = [...enKeys].filter((k) => !esKeys.has(k));
  if (onlyEs.length) failures.push(`i18n parity: only in es: ${onlyEs.join(', ')}`);
  if (onlyEn.length) failures.push(`i18n parity: only in en: ${onlyEn.join(', ')}`);
}

/* 4. Keys used in the pages exist ------------------------------------------ */
if (esKeys) {
  for (const page of shippedFiles.filter((f) => f.endsWith('.html'))) {
    const html = fs.readFileSync(page, 'utf8');
    for (const m of html.matchAll(/\bdata-i18n(?:-aria|-meta|-title)?="([^"]+)"/g)) {
      checks++;
      if (!esKeys.has(m[1])) failures.push(`${rel(page)}: data-i18n key "${m[1]}" is not in strings.es.js`);
    }
  }
}

/* 5. sw.js ↔ disk, both ways ---------------------------------------------- */
const SHIPPED_EXT = /\.(html|css|js|json|svg|png|webp|jpg|woff2|mp3|ogg)$/i;
const NOT_PRECACHED = new Set(['sw.js', 'package.json', 'package-lock.json', 'playwright.config.js']);
if (IS_PWA) {
  checks++;
  const sw = readSwFiles(ROOT);
  if (!sw) {
    failures.push('sw.js: could not read VERSION and FILES');
  } else {
    const listed = new Set();
    for (const entry of sw.files) {
      checks++;
      const file = entryToFile(ROOT, entry);
      listed.add(rel(file));
      if (!fs.existsSync(file)) failures.push(`sw.js: FILES lists ${entry}, which is not on disk`);
    }
    for (const file of shippedFiles) {
      const name = rel(file);
      if (!SHIPPED_EXT.test(name) || NOT_PRECACHED.has(name)) continue;
      checks++;
      if (!listed.has(name)) failures.push(`sw.js: ${name} is shipped but not in FILES (offline it would be missing)`);
    }
  }
}

/* 6. .assetsignore -------------------------------------------------------- */
const ASSETSIGNORE = path.join(ROOT, '.assetsignore');
if (fs.existsSync(ASSETSIGNORE)) {
  const ignored = fs.readFileSync(ASSETSIGNORE, 'utf8').split(/\r?\n/).map((l) => l.trim());
  for (const needed of ['.git/', 'doc/', 'scripts/', 'tests/', '/*.md']) {
    checks++;
    if (!ignored.includes(needed)) failures.push(`.assetsignore must list ${needed} (otherwise Cloudflare publishes it)`);
  }
  checks++;
  if (ignored.includes('_headers')) failures.push('.assetsignore must NOT list _headers (wrangler would skip it)');
}

/* 7. _headers rule count -------------------------------------------------- */
const HEADERS = path.join(ROOT, '_headers');
if (fs.existsSync(HEADERS)) {
  checks++;
  const rules = fs.readFileSync(HEADERS, 'utf8').split(/\r?\n/)
    .filter((l) => l.trim() !== '' && !l.trim().startsWith('#')).length;
  if (rules > 100) failures.push(`_headers has ${rules} rule lines; Cloudflare's limit is 100`);
}

/* 8. File size ------------------------------------------------------------ */
for (const file of shippedFiles) {
  checks++;
  const size = fs.statSync(file).size;
  if (size > 25 * 1024 * 1024) {
    failures.push(`${rel(file)} is ${(size / 1048576).toFixed(2)} MiB; Cloudflare rejects files over 25 MiB`);
  }
}

/* 9. Leftover placeholders ------------------------------------------------ */
const TEXT_EXT = /\.(md|html|css|js|json|toml|yml|yaml|txt|svg)$|^(_headers|\.assetsignore|\.graphifyignore|LICENSE)$/;
for (const file of allFiles) {
  const name = rel(file);
  if (name.startsWith('.claude/') || !TEXT_EXT.test(path.basename(name))) continue;
  checks++;
  const left = fs.readFileSync(file, 'utf8').match(/\{\{[#/]?[A-Z][A-Z0-9_]*\}\}/);
  if (left) failures.push(`${name}: bootstrap placeholder ${left[0]} left unresolved`);
}

/* Output ------------------------------------------------------------------ */
for (const w of warnings) console.warn(`  ! ${w}`);
if (failures.length) {
  console.error(`check.js: ${failures.length} problem(s) found`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`OK (${checks} checks)`);
