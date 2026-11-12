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

  const markupProblems = auditMarkup();
  if (markupProblems > 0) process.exitCode = 1;
}

/* Every HTML page of every app must mount the shared footer and load its script.
   Pages that cannot carry the footer are listed here, with the reason. */
const AUDIT_APPS = ['apptonomia', 'calculia', 'ludia', 'memofun', 'okeymoney', 'routime', 'sinonimia', 'teclatlon'];
const AUDIT_EXEMPT = {
  'apptonomia/project/index.html': 'slide deck: its footer is the slide footer',
  'ludia/refresh.html': 'redirect stub',
  'ludia/legal/index.html': 'redirect stub to ../#privacy',
};
const AUDIT_SKIP_DIRS = new Set(['node_modules', '.git', '.wrangler', '.claude', '.github', 'test-results', 'graphify-out', 'graphify-out-meta', 'doc', 'tests', 'scripts']);

function htmlPages(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (AUDIT_SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) htmlPages(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

// Returns the number of problems. Prints one line per page that fails.
function auditMarkup() {
  let problems = 0;
  let pages = 0;
  for (const app of AUDIT_APPS) {
    for (const file of htmlPages(path.join(SUITE_ROOT, app))) {
      const rel = path.relative(SUITE_ROOT, file).split(path.sep).join('/');
      if (AUDIT_EXEMPT[rel]) continue;
      pages += 1;
      const html = fs.readFileSync(file, 'utf8');
      const footerMount = /<[a-z]+\b[^>]*\bdata-suite-footer\b/.test(html);
      const headerMount = /<[a-z]+\b[^>]*\bdata-suite-header\b/.test(html);
      const loads = /<script\b[^>]*\bsuite-chrome\.js/.test(html);
      const picker = /<script\b[^>]*\blocale-picker\.js/.test(html);
      const oldPie = /\bdata-pie-app\b/.test(html);
      if (!footerMount || !headerMount || !loads || !picker || oldPie) {
        problems += 1;
        const why = [
          !headerMount && 'no data-suite-header mount',
          !footerMount && 'no data-suite-footer mount',
          !loads && 'no suite-chrome.js script',
          !picker && 'no locale-picker.js script',
          oldPie && 'still uses data-pie-app',
        ].filter(Boolean).join(', ');
        console.log(`✗ ${rel}: ${why}`);
      }
    }
  }
  console.log(problems === 0
    ? `ok       markup: ${pages} page(s) mount the shared header and footer and load their scripts`
    : `\n${problems} page(s) without the shared header/footer. Fix the page or add it to AUDIT_EXEMPT with a reason.`);
  return problems;
}

main();
