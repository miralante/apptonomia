#!/usr/bin/env node
// scripts/sync-suite-crawler.js
//
// Keeps the UI crawler of the suite identical in every app that has one.
// The canonical source lives in scripts/suite/:
//
//   ui-smoke.js   -> <app>/scripts/ui-smoke.js   (whole file, copied as is)
//
// The crawler is one file for the whole suite: it discovers the app it runs
// in from the name of its own folder (`path.basename(ROOT)`), so the same
// bytes serve every app and the per-app differences live in the `APP ===`
// branches inside it.
//
//   node scripts/sync-suite-crawler.js            # --check (default): report drift, change nothing
//   node scripts/sync-suite-crawler.js --apply    # write the copies that differ
//   node scripts/sync-suite-crawler.js --only calculia,ludia
//
// Node only, no dependencies. Exit code 1 when any copy differs (check mode).
//
// Scope: the apps that own scripts/ui-smoke.js. Teclatlon keeps its own
// crawler (a different, much shorter one) and Apptonomia has none, so
// neither takes part.

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SUITE_ROOT = path.resolve(__dirname, '..', '..');
const SUITE_DIR = path.join(__dirname, 'suite');
const CANONICAL = 'ui-smoke.js';
const REL = path.join('scripts', 'ui-smoke.js');

/* Every app with the shared crawler. Teclatlon has its own (much shorter)
   crawler and Apptonomia has none: neither is listed here. */
const APPS = ['calculia', 'ludia', 'memofun', 'okeymoney', 'sinonimia', 'routime'];

function readOr(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
}

function sha256(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex').slice(0, 12);
}

/* The suite stores text with LF (every .gitattributes of the suite says
   `* text=auto eol=lf`). Ludia has no .gitattributes, so a Windows checkout
   can bring its copy back with CRLF: the comparison ignores the line
   endings, the content still has to match byte for byte. */
function normalized(text) {
  return text.replace(/\r\n/g, '\n');
}

// --only <app>[,<app>...] limits the run to those apps.
function onlyFilter() {
  const at = process.argv.indexOf('--only');
  if (at === -1) return () => true;
  const names = String(process.argv[at + 1] || '').split(',').filter(Boolean);
  return (app) => names.includes(app);
}

function main() {
  const doApply = process.argv.includes('--apply');
  const wanted = onlyFilter();
  const canonicalFile = path.join(SUITE_DIR, CANONICAL);
  const canonical = readOr(canonicalFile);
  if (canonical === null) {
    console.error(`missing  scripts/suite/${CANONICAL}: the canonical crawler is not there.`);
    process.exitCode = 1;
    return;
  }
  const expected = normalized(canonical);
  let drift = 0;

  console.log(`canonical scripts/suite/${CANONICAL}  (sha256 ${sha256(expected)})`);

  for (const app of APPS) {
    if (!wanted(app)) continue;

    const rel = path.join(app, REL);
    const dest = path.join(SUITE_ROOT, rel);
    const current = readOr(dest);
    if (current === null) {
      drift += 1;
      if (doApply) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, canonical, 'utf8');
        console.log(`created  ${rel}`);
      } else {
        console.log(`missing  ${rel}`);
      }
      continue;
    }

    if (current === canonical) {
      console.log(`ok       ${rel}`);
      continue;
    }

    /* Same content, different line endings: the file is in sync as far as
       the suite is concerned, so it is not drift. */
    if (normalized(current) === expected) {
      console.log(`ok       ${rel}  (same content, CRLF line endings)`);
      if (doApply) {
        fs.writeFileSync(dest, canonical, 'utf8');
        console.log(`updated  ${rel}  (line endings normalised to LF)`);
      }
      continue;
    }

    drift += 1;
    if (doApply) {
      fs.writeFileSync(dest, canonical, 'utf8');
      console.log(`updated  ${rel}`);
    } else {
      console.log(`drift    ${rel}  (sha256 ${sha256(normalized(current))} != ${sha256(expected)})`);
    }
  }

  if (!doApply && drift > 0) {
    console.log(`\n${drift} file(s) differ from scripts/suite/${CANONICAL}. Run with --apply.`);
    process.exitCode = 1;
  }
}

main();
