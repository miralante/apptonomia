#!/usr/bin/env node
// scripts/sync-achievements-engine.js
//
// Keeps the achievements engine identical in every suite app that gives
// achievements. Canonical source: scripts/suite/achievements-engine.js.
//
//   node scripts/sync-achievements-engine.js            # --check (default): report drift, change nothing
//   node scripts/sync-achievements-engine.js --apply    # copy the canonical file where it differs
//
// Node only, no dependencies. Exit code 1 when any copy differs (check mode).

'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SUITE_ROOT = path.resolve(__dirname, '..', '..');
const CANONICAL = path.join(__dirname, 'suite', 'achievements-engine.js');

// Apps that give achievements. Apps without rewards (sinonimia)
// have none; the template is the scaffold every new sibling starts from.
const TARGETS = [
  { app: 'calculia', dest: 'assets/js/achievements-engine.js' },
  { app: 'okeymoney', dest: 'assets/js/achievements-engine.js' },
  { app: 'memofun', dest: 'assets/js/achievements-engine.js' },
  { app: 'routime', dest: 'assets/js/achievements-engine.js' },
  { app: 'teclatlon', dest: 'assets/js/achievements-engine.js' },
  { app: 'apptonomia/doc/templates', dest: 'js/achievements-engine.js' }
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
