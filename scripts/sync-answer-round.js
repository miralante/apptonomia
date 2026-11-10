#!/usr/bin/env node
// scripts/sync-answer-round.js
//
// Keeps the answer round and the closing reward screen identical in every suite
// app. Each block is defined once in scripts/suite/ and copied, byte for byte and
// between its own markers, into each app:
//
//   answer-round.js   -> assets/js/feedback.js           (right / wrong answer, hint, «Entendido»)
//   reward-screen.js  -> assets/js/feedback.js           (closing screen: stars and summary)
//   answer-round.css  -> the app's shared stylesheet     (styles of the answer round)
//   reward-screen.css -> the app's shared stylesheet     (styles of the closing screen)
//
// Markers: "suite:<name>:begin" ... "suite:<name>:end". Nothing outside the
// markers is touched. A missing block is inserted (JS: before the IIFE's last
// "})();"; CSS: at the end of the file).
//
//   node scripts/sync-answer-round.js            # --check (default): report drift, change nothing
//   node scripts/sync-answer-round.js --apply    # copy the canonical blocks where they differ
//
// Node only, no dependencies. Exit code 1 when any copy differs (check mode).

'use strict';

const fs = require('fs');
const path = require('path');

const SUITE_ROOT = path.resolve(__dirname, '..', '..');
const SUITE_DIR = path.join(__dirname, 'suite');

// Apps that carry the blocks, with the shared files each one holds.
const APPS = [
  { app: 'calculia', js: 'assets/js/feedback.js', css: 'assets/css/components.css' },
  { app: 'memofun', js: 'assets/js/feedback.js', css: 'assets/css/componentes.css' },
  { app: 'okeymoney', js: 'assets/js/feedback.js', css: 'assets/css/componentes.css' },
  { app: 'routime', js: 'assets/js/feedback.js', css: 'assets/css/components.css' },
  { app: 'teclatlon', js: 'assets/js/feedback.js', css: 'assets/css/components.css' },
  // The scaffold for new apps: JS only (it has no stylesheet of its own).
  { app: 'apptonomia/doc/templates', js: 'js/feedback.js', css: null }
];

// Canonical block files and the kind of file they are copied into.
const BLOCKS = [
  { name: 'answer-round', canonical: 'answer-round.js', kind: 'js' },
  { name: 'reward-screen', canonical: 'reward-screen.js', kind: 'js' },
  { name: 'celebrate', canonical: 'celebrate.js', kind: 'js' },
  { name: 'answer-round', canonical: 'answer-round.css', kind: 'css' },
  { name: 'reward-screen', canonical: 'reward-screen.css', kind: 'css' },
  { name: 'celebrate', canonical: 'celebrate.css', kind: 'css' }
];

function beginMarker(name) { return '/* suite:' + name + ':begin'; }
function endMarker(name) { return '/* suite:' + name + ':end */'; }

function canonicalBlock(block) {
  return fs.readFileSync(path.join(SUITE_DIR, block.canonical), 'utf8').replace(/\s+$/, '') + '\n';
}

// { start, end } (end exclusive) of the named block in `text`, or null.
function locate(text, name) {
  const marker = text.indexOf(beginMarker(name));
  if (marker === -1) return null;
  const endAt = text.indexOf(endMarker(name), marker);
  if (endAt === -1) return null;
  const lineStart = text.lastIndexOf('\n', marker) + 1; // the block includes its indentation
  const lineEnd = text.indexOf('\n', endAt);
  return { start: lineStart, end: lineEnd === -1 ? text.length : lineEnd + 1 };
}

// Replaces the block, or inserts it when absent. The block is written with the
// line endings of the file it goes into (the apps keep CRLF).
function place(text, block, lfContent) {
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  const content = lfContent.replace(/\n/g, eol);
  const at = locate(text, block.name);
  if (at) return text.slice(0, at.start) + content + text.slice(at.end);
  if (block.kind === 'css') {
    return text.replace(/\s*$/, '') + '\n\n' + content;
  }
  const closing = text.lastIndexOf('})();');
  if (closing === -1) throw new Error('no closing "})();" to insert "' + block.name + '" before');
  return text.slice(0, closing) + content + '\n' + text.slice(closing);
}

function targetFor(app, block) {
  return block.kind === 'js' ? app.js : app.css;
}

function main() {
  const doApply = process.argv.includes('--apply');
  let drift = 0;

  for (const app of APPS) {
    for (const block of BLOCKS) {
      const target = targetFor(app, block);
      if (!target) continue; // this target has no file of that kind
      const rel = path.join(app.app, target);
      const dest = path.join(SUITE_ROOT, app.app, target);
      const label = `${block.name} (${block.kind})`;
      if (!fs.existsSync(dest)) {
        console.log(`missing  ${rel}  [${label}]`);
        drift += 1;
        continue;
      }
      const expected = canonicalBlock(block);
      const text = fs.readFileSync(dest, 'utf8');
      const at = locate(text, block.name);
      const current = at ? text.slice(at.start, at.end).replace(/\r\n/g, '\n').replace(/\s+$/, '') + '\n' : null;
      if (current === expected) {
        console.log(`ok       ${rel}  [${label}]`);
        continue;
      }
      drift += 1;
      if (doApply) {
        fs.writeFileSync(dest, place(text, block, expected), 'utf8');
        console.log(`${at ? 'updated ' : 'inserted'}  ${rel}  [${label}]`);
      } else {
        console.log(`${at ? 'drift   ' : 'no block'}  ${rel}  [${label}]`);
      }
    }
  }

  if (!doApply && drift > 0) {
    console.log(`\n${drift} block(s) differ from scripts/suite/. Run with --apply.`);
    process.exitCode = 1;
  }
}

main();
