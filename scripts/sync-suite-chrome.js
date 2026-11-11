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
// Scope: the scaffold and the five siblings that take the footer (approved).
// sinonimia is not listed: its footer carries the ARASAAC credits and its own
// offline controls, and its i18n is not App.i18n. Add a sibling here (one line in
// TARGETS) only after the maintainer approves that app's rollout.

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
  { app: 'teclatlon', js: 'assets/js/suite-chrome.js', css: 'assets/css/components.css' }
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

function main() {
  const doApply = process.argv.includes('--apply');
  const expectedJs = canonicalJs();
  const expectedCss = canonicalCssBlock();
  let drift = 0;

  for (const t of TARGETS) {
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

  if (!doApply && drift > 0) {
    console.log(`\n${drift} copy(ies) differ from scripts/suite/. Run with --apply.`);
    process.exitCode = 1;
  }
}

main();
