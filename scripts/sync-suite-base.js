#!/usr/bin/env node
// scripts/sync-suite-base.js
//
// Keeps the suite base stylesheet identical in every app that adopts it.
// The canonical source is the app template:
//
//   doc/templates/app-template/assets/css/suite-base.css
//     -> <app>/assets/css/suite-base.css   (whole file, copied byte for byte)
//
// Each app's brand (assets/css/brand.css) is NOT touched: it is owned by the app.
//
//   node scripts/sync-suite-base.js            # --check (default): report drift, change nothing
//   node scripts/sync-suite-base.js --apply    # copy the canonical file where it differs
//
// Node only, no dependencies. Exit code 1 when any copy differs (check mode).
// Apps are added to TARGETS when they adopt the template.

'use strict';

const fs = require('fs');
const path = require('path');

const SUITE_ROOT = path.resolve(__dirname, '..', '..');
const CANONICAL = path.join(SUITE_ROOT, 'apptonomia', 'doc', 'templates', 'app-template', 'assets', 'css', 'suite-base.css');
const DEST = 'assets/css/suite-base.css';

// Apps that have adopted the template. Add an app here when it adopts it.
const TARGETS = ['memofun'];

function readOr(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
}

function main() {
  const doApply = process.argv.includes('--apply');
  const expected = fs.readFileSync(CANONICAL, 'utf8');
  let drift = 0;

  for (const app of TARGETS) {
    const rel = path.join(app, DEST);
    const dest = path.join(SUITE_ROOT, app, DEST);
    const current = readOr(dest);
    if (current === expected) {
      console.log(`ok       ${rel}  [suite-base]`);
      continue;
    }
    drift += 1;
    if (doApply) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, expected, 'utf8');
      console.log(`${current === null ? 'created ' : 'updated '} ${rel}  [suite-base]`);
    } else {
      console.log(`${current === null ? 'missing ' : 'drift   '} ${rel}  [suite-base]`);
    }
  }

  if (!doApply && drift > 0) {
    console.log(`\n${drift} copy(ies) differ from the template. Run with --apply.`);
    process.exitCode = 1;
  }
}

main();
