#!/usr/bin/env node
/*
 * scripts/check-version-bump.js — canonical cache-bump gate for the
 * Miralante suite.
 *
 * Fails if a file listed in sw.js's cache manifest changed in this
 * diff without VERSION also being bumped in the same diff.
 *
 * Why this exists: the SW's cache-first strategy makes a "forgot to
 * bump VERSION" mistake invisible to any live/post-deploy smoke test
 * — a returning visitor's Cache Storage is per-browser state that no
 * server-side script can observe. It has to be caught before it
 * ships, from the diff, not after. (Sibling project sinonimia hit
 * the closest analogue of this bug — a stale immutable HTTP cache,
 * not a SW — and it was only visible in production, days after the
 * change that caused it. This check exists so this project can't
 * have that kind of gap: it fails the PR/push itself.)
 *
 * Project shape detection: the script parses sw.js to find both
 * `var VERSION = '…'` and the cache manifest array. The manifest
 * is either `var FILES = […]` or `var ARCHIVOS = […]` (the suite
 * uses both names historically). If sw.js is absent the script
 * exits 0 with an informational message, so portal-only projects
 * (e.g. apptonomia) keep their validate.yml green without
 * conditional workflow logic.
 *
 * Diff base resolution: DIFF_BASE (set by the workflow) for pushes
 * and PRs; falls back to HEAD~1; skips (does not fail) if neither
 * exists, e.g. a single-commit shallow clone.
 *
 * Wired into the `cache-bump` job in .github/workflows/validate.yml
 * so every push and PR is checked with the exact same logic. Same
 * script (verbatim) lives in calculia/memofun/okeymoney/teclatlon/
 * routime; sinonimia is being migrated.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');

function git(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' });
}

function readSw(ref) {
  const swPath = path.join(ROOT, 'sw.js');
  if (!fs.existsSync(swPath)) {
    return { version: null, files: [], exists: false };
  }
  const src = ref
    ? git(['show', ref + ':sw.js'])
    : fs.readFileSync(swPath, 'utf8');
  const versionMatch = src.match(/VERSION\s*=\s*['"]([^'"]+)['"]/);
  const listMatch = src.match(
    /var\s+(?:ARCHIVOS|FILES)\s*=\s*\[([\s\S]*?)\];/
  );
  const files = listMatch
    ? Array.from(listMatch[1].matchAll(/['"]\.\/([^'"]+)['"]/g)).map(function (m) {
        return m[1];
      })
    : [];
  return {
    version: versionMatch ? versionMatch[1] : null,
    files: files,
    exists: true,
  };
}

function resolveBase() {
  const candidates = [process.env.DIFF_BASE, 'HEAD~1'].filter(Boolean);
  for (const ref of candidates) {
    try {
      git(['cat-file', '-e', ref]);
      return ref;
    } catch (e) {
      /* try next */
    }
  }
  return null;
}

let isGitRepo = true;
try {
  git(['rev-parse', '--is-inside-work-tree']);
} catch (e) {
  isGitRepo = false;
}
if (!isGitRepo) {
  console.log('~ skipping VERSION-bump check: not a git repository');
  process.exit(0);
}

/* --- Asset version tokens (?v=) ---------------------------------------
   Runs BEFORE the sw.js checks below, because this is a portal-only
   project: there is no sw.js here, so every VERSION path below exits 0
   early and a check appended at the end would never execute.

   _headers serves this project's immutable assets for a year, so a
   changed file only reaches a returning visitor if the URL that
   references it changes. The token is a hash of the file's own bytes,
   computed by the suite-wide tool, so it cannot drift silently the way
   a hand-typed serial did: the same asset used to be referenced with
   different tokens from different pages (locale-picker.js carried
   apptonomia-v5aca while locale-picker.css carried apptonomia-v5ab).

   Run `node ../scripts/asset-tokens.js apptonomia` to fix.
   ------------------------------------------------------------------- */
(function () {
  const suiteTool = require('path').join(__dirname, '..', '..', 'scripts', 'asset-tokens.js');
  if (!require('fs').existsSync(suiteTool)) {
    console.log('~ skipping asset-token check: ' + suiteTool + ' not found');
    return;
  }
  try {
    require('node:child_process').execFileSync(
      process.execPath, [suiteTool, '--check', 'apptonomia'],
      { cwd: require('path').join(__dirname, '..'), encoding: 'utf8', stdio: 'pipe' }
    );
    console.log('✓ asset-token check passed (apptonomia)');
  } catch (e) {
    console.error('✗ asset version tokens (?v=) are stale:\n' + String(e.stdout || e.message).trim());
    console.error('  Fix: node ../scripts/asset-tokens.js apptonomia');
    process.exit(1);
  }
})();

/* --- Redirect-free links, sanitised service-worker caches -------------
   Third cache-layer check, same slot as the one above. Cloudflare answers
   EVERY "/x.html" URL with a 307 to its extensionless form (verified on all
   eight sites). fetch() follows it before the worker sees it, so the response
   arrives with status 200 AND redirected === true, the Cache API preserves
   that flag across a store/load round trip, and Chrome then refuses to serve
   it to a top-level navigation: "Response served by service worker has
   redirections". Measured: online navigation survives, offline navigation
   (served from the cache) aborts with net::ERR_FAILED.

   This gate fails if a page links to a ".html" URL, or if sw.js can store a
   followed redirect (cache.addAll, or a cache.put without deRedirect).

   Fix links with: node ../scripts/one-off/fix-html-links.js --apply
   Prove the gate with: node ../scripts/one-off/test-check-sw-redirects.js
   ------------------------------------------------------------------- */
(function () {
  const suiteTool = require('path').join(__dirname, '..', '..', 'scripts', 'check-sw-redirects.js');
  if (!require('fs').existsSync(suiteTool)) {
    console.log('~ skipping SW-redirect check: ' + suiteTool + ' not found');
    return;
  }
  try {
    const out = require('node:child_process').execFileSync(
      process.execPath, [suiteTool, 'apptonomia'],
      { cwd: require('path').join(__dirname, '..'), encoding: 'utf8', stdio: 'pipe' }
    );
    console.log(String(out).trim());
  } catch (e) {
    console.error(String(e.stdout || e.message).trim());
    console.error('  Fix links with: node ../scripts/one-off/fix-html-links.js --apply');
    process.exitCode = 1;
  }
})();


const base = resolveBase();
if (!base) {
  console.log('~ skipping VERSION-bump check: no previous commit to diff against');
  process.exit(0);
}

const before = readSw(base);
const after = readSw(null);

if (!after.exists) {
  console.log('~ no sw.js found, skipping VERSION-bump check (portal-only project)');
  process.exit(0);
}

if (!after.version || !after.files.length) {
  console.error('✗ could not parse VERSION or the cache manifest from the current sw.js');
  process.exit(1);
}

let changed;
try {
  changed = git(['diff', '--name-only', base, 'HEAD']).split('\n').filter(Boolean);
} catch (e) {
  console.error('✗ could not diff against ' + base + ': ' + e.message);
  process.exit(1);
}

const cachedChanged = changed.filter(function (f) {
  return after.files.indexOf(f) !== -1;
});

if (cachedChanged.length && before.version === after.version) {
  console.error(
    '✗ these sw.js-cached files changed but VERSION (' +
      after.version +
      ') was not bumped:'
  );
  cachedChanged.forEach(function (f) {
    console.error('    ' + f);
  });
  console.error(
    "  Returning visitors with the PWA installed won't see this change until VERSION is bumped (see CLAUDE.md)."
  );
  process.exit(1);
}

console.log(
  '✓ sw.js VERSION bump check passed (' +
    cachedChanged.length +
    ' cached file(s) changed' +
    (cachedChanged.length
      ? ', VERSION correctly bumped: ' +
        before.version +
        ' -> ' +
        after.version
      : ', VERSION unchanged as expected') +
    ')'
);
