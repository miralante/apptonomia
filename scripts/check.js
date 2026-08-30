#!/usr/bin/env node
/* ============================================================
   Apptonomia — scripts/check.js
   Structural check with no dependencies (plain Node only).
   Usage: node scripts/check.js

   Why a second check script: the sibling projects (Calculia,
   Memofun, Okeymoney, Sinonimia, Teclatlon, Routime) all ship a
   `scripts/check.js` as the canonical structural gate. Apptonomia
   historically only shipped `scripts/check-forbidden-terms.js`,
   which enforces the zero-disability/OT/minors rule on the
   landing. That one stays in place — this file complements it
   with the rest of the suite's standard structural checks, so
   an agent opening any one of the seven siblings sees the same
   ``node scripts/check.js`` entry point.

   Checks:
   1. JS syntax: every js/*.js parses (equivalent to `node --check`).
      Apptonomia's landing ships bootstrap/prepaint/script/strings
      bundles under js/; this catches a syntax regression early.
   2. _redirects stays within Cloudflare's per-file limits
      (https://developers.cloudflare.com/pages/configuration/redirects/):
      a maximum of 2 000 static redirects and 100 dynamic
      (placeholder) redirects per file — 2 100 in total. If the
      file is absent (apptonomia's current state: no _redirects)
      the check is skipped: zero is valid.
   3. _headers stays within Cloudflare's per-file limit of 100
      header rules per file
      (https://developers.cloudflare.com/pages/configuration/headers/).
      Both path-glob lines and individual Key: value lines are
      counted, because Cloudflare's published limit of 100
      applies to the total number of lines in `_headers`, per
      the wording at the URL above.
   4. No shipped file exceeds Cloudflare Pages' 25 MB per-file
      limit (https://developers.cloudflare.com/pages/limits/).
      Walks the repo recursively, excluding .git/, node_modules/,
      .claude/ (graphify skill + agent settings, never uploaded),
      and graphify-out* (build artifacts). Warns at 20 MB (still
      legal but worth a nudge) and fails at 25 MB (Cloudflare
      will reject the deploy). This is the load-bearing check of
      the three: any single image or video edit can silently push
      a shipping asset past 25 MB, while a hand-curated giant
      _redirects/_headers is rare.

   Output: list of failures with the exact file. Exit code 1 if
   there are any, "OK (N checks)" otherwise. Image-size warnings
   are non-blocking (printed above the OK line) so borderline
   cases don't turn CI red without an actionable next step.
   ============================================================ */
'use strict';

var fs = require('fs');
var path = require('path');
var execFileSync = require('child_process').execFileSync;

var ROOT = path.join(__dirname, '..');
var failures = [];
var warnings = [];
var checks = 0;

function rel(p) {
  return path.relative(ROOT, p).split(path.sep).join('/');
}

/* --- 1. JS syntax on js/*.js --- */
var jsDir = path.join(ROOT, 'js');
if (fs.existsSync(jsDir)) {
  fs.readdirSync(jsDir, { withFileTypes: true })
    .filter(function (entry) { return entry.isFile() && entry.name.endsWith('.js'); })
    .forEach(function (entry) {
      checks += 1;
      var file = path.join(jsDir, entry.name);
      try {
        execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
      } catch (e) {
        var stderr = e.stderr ? e.stderr.toString().trim().split('\n')[0] : e.message;
        failures.push(rel(file) + ': does not parse (node --check) — ' + stderr);
      }
    });
}

/* --- 2. _redirects stays within Cloudflare's per-file limits
   (https://developers.cloudflare.com/pages/configuration/redirects/):
   a maximum of 2 000 static redirects and 100 dynamic (placeholder)
   redirects per file — 2 100 in total. If the file is absent (the
   common case for the apptonomia landing) the check is skipped:
   zero is valid. Cloudflare parses the file line-by-line and counts
   entries, not bytes, so the check counts entries.

   - Static: a non-comment, non-blank line with a redirect code
     (301/302/303/307/308) at the end OR a proxy entry (`200`).
   - Dynamic: a redirect line containing a `:placeholder$` token
     (e.g. `/news/:slug$ /blog/:slug 301`), per the Cloudflare docs'
     "Dynamic redirects" section. Plain colons are not placeholders;
     only the `:name$` syntax counts. */
var REDIRECTS_FILE = path.join(ROOT, '_redirects');
if (fs.existsSync(REDIRECTS_FILE)) {
  checks += 1;
  var redirLines = fs.readFileSync(REDIRECTS_FILE, 'utf8').split('\n');
  var staticCount = 0;
  var dynamicCount = 0;
  redirLines.forEach(function (line) {
    var trimmed = line.trim();
    if (!trimmed || trimmed.charAt(0) === '#') return;
    var isStatic = /\s(?:200|301|302|303|307|308)\s*$/.test(trimmed) && !/:\w+\$/.test(trimmed);
    var isDynamic = /:\w+\$/.test(trimmed);
    if (isStatic) staticCount += 1;
    else if (isDynamic) dynamicCount += 1;
  });
  var REDIR_STATIC_LIMIT = 2000;
  var REDIR_DYNAMIC_LIMIT = 100;
  if (staticCount > REDIR_STATIC_LIMIT) {
    failures.push('_redirects: ' + staticCount + ' static redirects, max is ' + REDIR_STATIC_LIMIT +
      ' (Cloudflare Pages rejects the file)');
  }
  if (dynamicCount > REDIR_DYNAMIC_LIMIT) {
    failures.push('_redirects: ' + dynamicCount + ' dynamic redirects, max is ' + REDIR_DYNAMIC_LIMIT +
      ' (Cloudflare Pages rejects the file)');
  }
}

/* --- 3. _headers stays within Cloudflare's per-file limit of 100
   header rules per file
   (https://developers.cloudflare.com/pages/configuration/headers/).
   A "rule" is one path-glob block: the glob line plus the indented
   header lines that follow it (e.g. `Cache-Control: …`,
   `X-Frame-Options: …`, a `Content-Security-Policy:` line). The
   wildcards `/assets/*` plus its two Cache-Control lines therefore
   count as one rule, not three.

   Detection: we count both the path-glob line AND the header lines
   individually because Cloudflare's published limit of 100 applies
   to the total number of lines in `_headers` (path-glob lines +
   header lines), per the wording at
   https://developers.cloudflare.com/pages/configuration/headers/.
   The 7 currently shipped suites all stay well under 100 either way. */
var HEADERS_FILE = path.join(ROOT, '_headers');
if (fs.existsSync(HEADERS_FILE)) {
  checks += 1;
  var headersLines = fs.readFileSync(HEADERS_FILE, 'utf8').split('\n');
  var ruleCount = 0;
  for (var i = 0; i < headersLines.length; i++) {
    var hLine = headersLines[i];
    var hTrim = hLine.trim();
    if (!hTrim || hTrim.charAt(0) === '#') continue;
    if (hLine.charAt(0) === '/' && !/^\/.*:/.test(hLine)) {
      ruleCount += 1;
      continue;
    }
    if (/^[A-Za-z][\w-]*:\s/.test(hLine)) ruleCount += 1;
  }
  var HEADERS_RULE_LIMIT = 100;
  if (ruleCount > HEADERS_RULE_LIMIT) {
    failures.push('_headers: ' + ruleCount + ' rule lines (path-globs + headers), max is ' +
      HEADERS_RULE_LIMIT + ' (Cloudflare Pages rejects the file)');
  }
}

/* --- 4. No shipped file exceeds Cloudflare Pages' 25 MB per-file
   limit (https://developers.cloudflare.com/pages/limits/). Warns at
   20 MB (legal but worth a nudge before the next content commit
   pushes it over) and fails at 25 MB (Cloudflare will reject the
   deploy). Only walks files that actually deploy: `.git/`, `node_modules/`,
   `.claude/` (graphify skill + agent settings, never uploaded), and
   `graphify-out*` (build artifacts) are excluded. The walk is
   intentionally not recursive into symlinks (which Node's
   readdirSync already protects against — `withFileTypes: true`
   returns `isSymbolicLink()` separately, but `entry.isDirectory()`
   for our purposes is reliable on this codebase since the suite
   has no symlinks in the tree by design). */
var FILE_SIZE_WARN_MB = 20;
var FILE_SIZE_FAIL_MB = 25;
var fileSizeExcluded = ['.git', 'node_modules', '.claude', 'graphify-out', 'graphify-out-meta'];
(function walkForLargeFiles(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir, { withFileTypes: true }).forEach(function (entry) {
    if (fileSizeExcluded.indexOf(entry.name) !== -1) return;
    var full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkForLargeFiles(full);
    } else if (entry.isFile()) {
      checks += 1;
      var size = fs.statSync(full).size;
      var sizeMb = size / (1024 * 1024);
      if (sizeMb >= FILE_SIZE_FAIL_MB) {
        failures.push(rel(full) + ': weighs ' + sizeMb.toFixed(2) + ' MB, max per file is ' +
          FILE_SIZE_FAIL_MB + ' MB (Cloudflare Pages rejects the deploy)');
      } else if (sizeMb >= FILE_SIZE_WARN_MB) {
        warnings.push(rel(full) + ': weighs ' + sizeMb.toFixed(2) + ' MB, max per file is ' +
          FILE_SIZE_FAIL_MB + ' MB (warning: still legal, getting close)');
      }
    }
  });
})(ROOT);

/* --- Result --- */
if (warnings.length) {
  console.log('WARNINGS (' + warnings.length + ') - non-blocking, see https://developers.cloudflare.com/pages/limits/ (25 MB per-file limit):');
  warnings.forEach(function (w) { console.log('  - ' + w); });
  console.log('');
}
if (failures.length) {
  console.log('FAILURES (' + failures.length + '):');
  failures.forEach(function (f) { console.log('  - ' + f); });
  process.exitCode = 1;
} else {
  console.log('OK (' + checks + ' checks)');
}
