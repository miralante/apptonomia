#!/usr/bin/env node
// scripts/sync-suite-chrome.js
//
// Keeps the shared header and footer identical in every suite app. Canonical
// sources live in scripts/suite/:
//
//   suite-chrome.js   -> the app's js/ file        (whole file, copied as is)
//   suite-chrome.css  -> the app's shared stylesheet (marked block, between the
//                        "suite:suite-chrome:begin" and "suite:suite-chrome:end" markers)
//
// Nothing outside the CSS markers is touched. A missing CSS block is appended
// at the end of the stylesheet, which must already exist. A missing JS file is
// created.
//
//   node scripts/sync-suite-chrome.js            # --check (default): report drift, change nothing
//   node scripts/sync-suite-chrome.js --apply    # copy the canonical sources where they differ
//
// Node only, no dependencies. Exit code 1 when any copy differs (check mode).
//
// Scope: every suite app takes the shared footer. Each page keeps its own extra
// elements (teclatlon's clear-progress button, sinonimia's ARASAAC credits) inside
// the footer, next to the shared mount. The mount is the element that carries
// data-suite-footer; it is filled only while empty.

'use strict';

const fs = require('fs');
const path = require('path');

const SUITE_ROOT = path.resolve(__dirname, '..', '..');
const SUITE_DIR = path.join(__dirname, 'suite');
const NAME = 'suite-chrome';

const TARGETS = [
  { app: 'apptonomia/doc/templates', js: 'js/suite-chrome.js', css: 'assets/css/styles.css' },
  { app: 'calculia', js: 'assets/js/suite-chrome.js', css: 'assets/css/components.css' },
  { app: 'routime', js: 'assets/js/suite-chrome.js', css: 'assets/css/components.css' },
  { app: 'memofun', js: 'assets/js/suite-chrome.js', css: 'assets/css/componentes.css' },
  { app: 'okeymoney', js: 'assets/js/suite-chrome.js', css: 'assets/css/componentes.css' },
  { app: 'teclatlon', js: 'assets/js/suite-chrome.js', css: 'assets/css/components.css' },
  { app: 'ludia', js: 'assets/js/suite-chrome.js', css: 'assets/css/styles.css' },
  { app: 'apptonomia', js: 'js/suite-chrome.js', css: 'css/styles.css' },
  { app: 'sinonimia', js: 'js/suite-chrome.js', css: 'css/styles.css' }
];

function beginMarker() { return '/* suite:' + NAME + ':begin'; }
function endMarker() { return '/* suite:' + NAME + ':end */'; }

function canonicalJs() {
  return fs.readFileSync(path.join(SUITE_DIR, 'suite-chrome.js'), 'utf8');
}

function canonicalCssBlock() {
  return fs.readFileSync(path.join(SUITE_DIR, 'suite-chrome.css'), 'utf8').replace(/\s+$/, '') + '\n';
}

// { start, end } (end exclusive) of the CSS block in `text`, or null.
function locate(text) {
  const marker = text.indexOf(beginMarker());
  if (marker === -1) return null;
  const endAt = text.indexOf(endMarker(), marker);
  if (endAt === -1) return null;
  const lineStart = text.lastIndexOf('\n', marker) + 1;
  const lineEnd = text.indexOf('\n', endAt);
  return { start: lineStart, end: lineEnd === -1 ? text.length : lineEnd + 1 };
}

// Replaces the block, or appends it. The block takes the line endings of the file.
function placeCss(text, lfContent) {
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const content = lfContent.replace(/\n/g, eol);
  const at = locate(text);
  if (at) return text.slice(0, at.start) + content + text.slice(at.end);
  return text.replace(/\s*$/, '') + eol + eol + content;
}

function readOr(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
}

// --only <app>[,<app>...] limits the run to those targets (e.g. --only apptonomia/doc/templates),
// so the canonical source can reach the template without touching the sibling repos.
function onlyFilter() {
  const at = process.argv.indexOf('--only');
  if (at === -1) return () => true;
  const names = String(process.argv[at + 1] || '').split(',').filter(Boolean);
  return (app) => names.includes(app);
}

function main() {
  const doApply = process.argv.includes('--apply');
  const wanted = onlyFilter();
  const expectedJs = canonicalJs();
  const expectedCss = canonicalCssBlock();
  let drift = 0;

  for (const t of TARGETS) {
    if (!wanted(t.app)) continue;
    // JS: the whole file is the block.
    const jsRel = path.join(t.app, t.js);
    const jsDest = path.join(SUITE_ROOT, t.app, t.js);
    const jsCurrent = readOr(jsDest);
    if (jsCurrent === expectedJs) {
      console.log(`ok       ${jsRel}  [${NAME} (js)]`);
    } else {
      drift += 1;
      if (doApply) {
        fs.mkdirSync(path.dirname(jsDest), { recursive: true });
        fs.writeFileSync(jsDest, expectedJs, 'utf8');
        console.log(`${jsCurrent === null ? 'created ' : 'updated '} ${jsRel}  [${NAME} (js)]`);
      } else {
        console.log(`${jsCurrent === null ? 'missing ' : 'drift   '} ${jsRel}  [${NAME} (js)]`);
      }
    }

    // CSS: only the marked block is owned here; the rest of the stylesheet is the app's.
    const cssRel = path.join(t.app, t.css);
    const cssDest = path.join(SUITE_ROOT, t.app, t.css);
    const cssText = readOr(cssDest);
    if (cssText === null) {
      drift += 1;
      console.log(`missing  ${cssRel}  [${NAME} (css), the stylesheet must exist]`);
      continue;
    }
    const at = locate(cssText);
    const current = at ? cssText.slice(at.start, at.end).replace(/\r\n/g, '\n').replace(/\s+$/, '') + '\n' : null;
    if (current === expectedCss) {
      console.log(`ok       ${cssRel}  [${NAME} (css)]`);
      continue;
    }
    drift += 1;
    if (doApply) {
      fs.writeFileSync(cssDest, placeCss(cssText, expectedCss), 'utf8');
      console.log(`${at ? 'updated ' : 'inserted'} ${cssRel}  [${NAME} (css)]`);
    } else {
      console.log(`${at ? 'drift   ' : 'no block'} ${cssRel}  [${NAME} (css)]`);
    }
  }

  drift += syncMarkupCheck(doApply);
  if (!doApply && drift > 0) {
    console.log(`\n${drift} copy(ies) differ from scripts/suite/. Run with --apply.`);
    process.exitCode = 1;
  }

  const markupProblems = auditMarkup();
  if (markupProblems > 0) process.exitCode = 1;
}

/* Every HTML page of every app must mount the shared header and footer as the component
   expects. The rules live in scripts/suite/suite-markup.js. Each app carries a copy of
   that file at scripts/checks/suite-markup.js, kept identical by this script, so the app's
   own CI runs the same check on every push and PR. */
// apptonomia/doc/templates is the scaffold of every new app: its pages must pass too.
const AUDIT_APPS = ['apptonomia', 'apptonomia/doc/templates', 'calculia', 'ludia', 'memofun', 'okeymoney', 'routime', 'sinonimia', 'teclatlon'];
const { auditApp } = require('./suite/suite-markup.js');
const MARKUP_CHECK = path.join('scripts', 'checks', 'suite-markup.js');

// Each app's copy of the markup check must equal the canonical file. Returns the drifted copies.
function syncMarkupCheck(doApply) {
  const expected = fs.readFileSync(path.join(SUITE_DIR, 'suite-markup.js'), 'utf8');
  let drift = 0;
  const wanted = onlyFilter();
  for (const app of AUDIT_APPS) {
    if (!wanted(app)) continue;
    const rel = path.join(app, MARKUP_CHECK);
    const dest = path.join(SUITE_ROOT, rel);
    const current = readOr(dest);
    if (current === expected) {
      console.log(`ok       ${rel}  [suite-markup (check)]`);
      continue;
    }
    drift += 1;
    if (doApply) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, expected, 'utf8');
      console.log(`${current === null ? 'created ' : 'updated '} ${rel}  [suite-markup (check)]`);
    } else {
      console.log(`${current === null ? 'missing ' : 'drift   '} ${rel}  [suite-markup (check)]`);
    }
  }
  return drift;
}

// Returns the number of problems across the suite. Prints one line per page that fails.
function auditMarkup() {
  let problems = 0;
  let pages = 0;
  const wanted = onlyFilter();
  for (const app of AUDIT_APPS) {
    if (!wanted(app)) continue;
    const result = auditApp(path.join(SUITE_ROOT, app), app);
    pages += result.pages;
    for (const p of result.problems) {
      problems += 1;
      console.log(`✗ ${app}/${p.rel}: ${p.why}`);
    }
  }
  console.log(problems === 0
    ? `ok       markup: ${pages} page(s) mount the shared header and footer as the component expects`
    : `\n${problems} page(s) without the shared header/footer rules. Fix the page, or add it to EXEMPT in scripts/suite/suite-markup.js with a reason.`);
  return problems;
}

main();
