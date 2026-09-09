#!/usr/bin/env node
/*
 * scripts/check.js — new-sibling structural check.
 *
 * Purpose: one plain-Node script (no dependencies) that every
 * sibling of the Miralante suite ships in `scripts/check.js` and
 * runs in CI. It enforces the file anatomy and i18n parity that
 * the metaproject requires for every sibling.
 *
 * Usage:
 *   node scripts/check.js
 *
 * The script intentionally has zero npm dependencies. Run it
 * directly with Node — no `npm install` needed.
 *
 * === What this template checks (the "minimum viable" set) ===
 *
 * 1. JS syntax: every .js file in the shipped tree parses.
 *    Catches a syntax regression before it lands.
 *
 * 2. Required files exist at the repo root:
 *    - CLAUDE.md, README.md, README.es.md, LICENSE
 *    - CONTRIBUTING.md, CONTRIBUTING.es.md
 *    - CODE_OF_CONDUCT.md, CODE_OF_CONDUCT.es.md
 *    - SECURITY.md, SECURITY.es.md
 *    - CLOUDFLARE.md, _headers, wrangler.toml, 404.html
 *    - index.html, app.js (or tools/<slug>/app.js for catalogues)
 *    - strings.es.js, strings.en.js
 *    - scripts/check.js, scripts/check-version-bump.js (PWA only)
 *    - sw.js, manifest.json (PWA only)
 *    - doc/en/index.md, doc/es/indice.md
 *    - .claude/skills/graphify/SKILL.md, .graphifyignore
 *
 * 3. es/en key parity between strings.es.js and strings.en.js.
 *    Every key registered in es must also be registered in en and
 *    vice versa. (If the sibling uses data-i18n* attributes instead
 *    of an App.i18n.t() lookup, port this check to walk the
 *    HTML pages — see Apptonomia's check.js for the HTML walker.)
 *
 * 4. sw.js ↔ disk parity (PWA only): every file listed in sw.js's
 *    ARCHIVOS exists on disk, and every shipped file the SW
 *    pre-caches is in ARCHIVOS.
 *
 * 5. _headers stays within Cloudflare's per-file limit of 100
 *    header rules per file.
 *
 * 6. No shipped file exceeds Cloudflare's 25 MB per-file limit.
 *
 * === What to add per-sibling ===
 *
 * - **Activity catalogue**: if the sibling has activities under
 *   tools/<slug>/, add a check that every tools/<slug>/ has the
 *   six canonical files (index.html, app.js, data.js,
 *   strings.es.js, strings.en.js, styles.css). See Routime's
 *   check.js for the canonical version.
 *
 * - **i18n HTML walker**: if the sibling uses data-i18n*
 *   attributes in HTML, port the walker from Apptonomia's
 *   check.js — it walks every HTML page and reports
 *   data-i18n keys missing from strings.<locale>.js.
 *
 * - **Forbidden terms**: if the sibling ships user-facing copy,
 *   port the forbidden-terms check from Apptonomia's
 *   check-forbidden-terms.js — it fails the build when
 *   "discapacidad" / "occupational therapy" / "minor" appears in
 *   the user-facing tree (see B.5 above).
 *
 * Output: list of failures with the exact file. Exit code 1 if
 * there are any, "OK (N checks)" otherwise.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var execFileSync = require('child_process').execFileSync;

var ROOT = path.join(__dirname, '..');
var failures = [];
var checks = 0;

function rel(p) {
  return path.relative(ROOT, p).split(path.sep).join('/');
}

/* -------------------------------------------------------------------------
 * 1. JS syntax: every .js file in the shipped tree parses.
 * ----------------------------------------------------------------------- */

function listJsFiles(dir) {
  var out = [];
  (function walk(current) {
    var entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch (e) { return; }
    entries.forEach(function (entry) {
      var full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        // Skip build / dependency / metadata dirs.
        if (['node_modules', '.git', 'graphify-out', 'graphify-out-meta',
             '.claude', 'dist', 'build'].indexOf(entry.name) !== -1) return;
        walk(full);
      } else if (entry.isFile() && entry.name.endsWith('.js')) {
        out.push(full);
      }
    });
  }(dir));
  return out;
}

listJsFiles(ROOT).forEach(function (file) {
  checks++;
  try {
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  } catch (e) {
    failures.push(rel(file) + ': node --check failed — ' + e.stderr.toString().trim());
  }
});

/* -------------------------------------------------------------------------
 * 2. Required files exist.
 * ----------------------------------------------------------------------- */

var REQUIRED_FILES = [
  'CLAUDE.md',
  'README.md', 'README.es.md',
  'LICENSE',
  'CONTRIBUTING.md', 'CONTRIBUTING.es.md',
  'CODE_OF_CONDUCT.md', 'CODE_OF_CONDUCT.es.md',
  'SECURITY.md', 'SECURITY.es.md',
  'CLOUDFLARE.md',
  '_headers', 'wrangler.toml', '404.html',
  'index.html',
  'strings.es.js', 'strings.en.js',
  'scripts/check.js',
  'doc/en/index.md', 'doc/es/indice.md',
  '.claude/skills/graphify/SKILL.md',
  '.graphifyignore'
];

// The sibling might be a PWA — those files are required for PWAs.
var IS_PWA = fs.existsSync(path.join(ROOT, 'manifest.json'));
if (IS_PWA) {
  Array.prototype.push.apply(REQUIRED_FILES, [
    'sw.js', 'manifest.json',
    'scripts/check-version-bump.js'
  ]);
}

REQUIRED_FILES.forEach(function (f) {
  checks++;
  if (!fs.existsSync(path.join(ROOT, f))) {
    failures.push('missing required file: ' + f);
  }
});

/* -------------------------------------------------------------------------
 * 3. es/en key parity between strings.es.js and strings.en.js.
 *    Assumes the canonical `App.i18n.register()` shape used by
 *    every sibling of the suite: a top-level I18N object per file
 *    with locale-tagged keys. Adjust to the sibling's shape if it
 *    differs.
 * ----------------------------------------------------------------------- */

function extractKeys(file) {
  try {
    var src = fs.readFileSync(file, 'utf8');
    var sandbox = { I18N: {}, window: {}, console: console };
    vm.runInContext(src + '\nthis.__EXTRACTED__ = I18N;', sandbox, { filename: file });
    var dict = sandbox.__EXTRACTED__;
    var out = [];
    Object.keys(dict).forEach(function (locale) {
      Object.keys(dict[locale]).forEach(function (key) {
        out.push(locale + ':' + key);
      });
    });
    return out;
  } catch (e) {
    failures.push(rel(file) + ': could not extract I18N keys — ' + e.message);
    return [];
  }
}

var vm = require('vm');
var esKeys = extractKeys(path.join(ROOT, 'strings.es.js'));
var enKeys = extractKeys(path.join(ROOT, 'strings.en.js'));
checks++;
var soloEs = esKeys.filter(function (k) { return enKeys.indexOf(k) === -1; });
var soloEn = enKeys.filter(function (k) { return esKeys.indexOf(k) === -1; });
if (soloEs.length || soloEn.length) {
  var detail = [];
  if (soloEs.length) detail.push('only in es: ' + soloEs.join(', '));
  if (soloEn.length) detail.push('only in en: ' + soloEn.join(', '));
  failures.push('i18n key parity: ' + detail.join(' | '));
}

/* -------------------------------------------------------------------------
 * 4. sw.js ↔ disk parity (PWA only).
 * ----------------------------------------------------------------------- */

if (IS_PWA) {
  checks++;
  var swPath = path.join(ROOT, 'sw.js');
  var swSrc = fs.readFileSync(swPath, 'utf8');
  var versionMatch = swSrc.match(/VERSION\s*=\s*['"]([^'"]+)['"]/);
  var listMatch = swSrc.match(/var\s+(?:ARCHIVOS|FILES)\s*=\s*\[([\s\S]*?)\];/);
  var archivos = listMatch
    ? Array.from(listMatch[1].matchAll(/['"]\.\/([^'"]+)['"]/g)).map(function (m) { return m[1]; })
    : [];
  if (!versionMatch || !archivos.length) {
    failures.push('sw.js: could not parse VERSION or ARCHIVOS');
  } else {
    archivos.forEach(function (a) {
      checks++;
      if (!fs.existsSync(path.join(ROOT, a))) {
        failures.push('sw.js: ARCHIVOS lists ' + a + ' but it does not exist on disk');
      }
    });
  }
}

/* -------------------------------------------------------------------------
 * 5. _headers stays within Cloudflare's per-file limit.
 * ----------------------------------------------------------------------- */

var HEADERS_FILE = path.join(ROOT, '_headers');
if (fs.existsSync(HEADERS_FILE)) {
  checks++;
  var headerLines = fs.readFileSync(HEADERS_FILE, 'utf8')
    .split('\n').filter(function (l) { return l.trim() !== ''; }).length;
  if (headerLines > 100) {
    failures.push('_headers has ' + headerLines + ' non-blank lines; Cloudflare\'s per-file limit is 100');
  }
}

/* -------------------------------------------------------------------------
 * 6. No shipped file exceeds 25 MB (Cloudflare's per-file limit).
 * ----------------------------------------------------------------------- */

function walkForSize(dir) {
  var out = [];
  (function walk(current) {
    var entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch (e) { return; }
    entries.forEach(function (entry) {
      var full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (['.git', 'node_modules', 'graphify-out', 'graphify-out-meta',
             '.claude'].indexOf(entry.name) !== -1) return;
        walk(full);
      } else if (entry.isFile()) {
        out.push(full);
      }
    });
  }(dir));
  return out;
}

walkForSize(ROOT).forEach(function (file) {
  checks++;
  var stat = fs.statSync(file);
  if (stat.size > 25 * 1024 * 1024) {
    failures.push(rel(file) + ' is ' + (stat.size / 1024 / 1024).toFixed(2) +
                 ' MB; Cloudflare Pages rejects files over 25 MB');
  }
});

/* -------------------------------------------------------------------------
 * Output.
 * ----------------------------------------------------------------------- */

if (failures.length) {
  console.error('check.js: ' + failures.length + ' problem(s) found');
  failures.forEach(function (f) { console.error('  ✗ ' + f); });
  process.exit(1);
} else {
  console.log('OK (' + checks + ' checks)');
}
