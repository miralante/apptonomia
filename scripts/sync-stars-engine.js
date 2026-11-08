#!/usr/bin/env node
// scripts/sync-stars-engine.js
//
// Keeps the stars engine identical in every suite app that shows stars.
// Canonical source: scripts/suite/stars-engine.js (this folder's parent).
//
//   node scripts/sync-stars-engine.js            # --check (default): report drift, change nothing
//   node scripts/sync-stars-engine.js --apply    # copy the canonical file where it differs
//
// Node only, no dependencies. Exit code 1 when any copy differs (check mode).

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SUITE_ROOT = path.resolve(__dirname, '..', '..');
const CANONICAL = path.join(__dirname, 'suite', 'stars-engine.js');

// Apps that show a star counter. ludia, okeymoney and apptonomia have none.
const TARGETS = [
  { app: 'calculia', dest: 'assets/js/stars-engine.js' },
  { app: 'memofun', dest: 'assets/js/stars-engine.js' },
  { app: 'routime', dest: 'assets/js/stars-engine.js' },
  { app: 'sinonimia', dest: 'js/stars-engine.js' },
  { app: 'teclatlon', dest: 'assets/js/stars-engine.js' },
  // The file-template app every new sibling is scaffolded from (doc/templates/).
  { app: 'apptonomia/doc/templates', dest: 'js/stars-engine.js' }
];

function sha256(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function main() {
  const apply = process.argv.includes('--apply');
  const canonicalHash = sha256(CANONICAL);
  let drift = 0;

  for (const t of TARGETS) {
    const dest = path.join(SUITE_ROOT, t.app, t.dest);
    const rel = path.join(t.app, t.dest);
    const exists = fs.existsSync(dest);
    const same = exists && sha256(dest) === canonicalHash;
    if (same) {
      console.log(`ok       ${rel}`);
      continue;
    }
    drift += 1;
    if (apply) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(CANONICAL, dest);
      console.log(`${exists ? 'updated ' : 'created '}  ${rel}`);
    } else {
      console.log(`${exists ? 'drift   ' : 'missing '}  ${rel}`);
    }
  }

  if (!apply && drift > 0) {
    console.log(`\n${drift} copy(ies) differ from ${path.relative(SUITE_ROOT, CANONICAL)}. Run with --apply.`);
    process.exitCode = 1;
  }
}

main();
