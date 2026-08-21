#!/usr/bin/env node
/*
 * scripts/check-forbidden-terms.js
 *
 * Apptonomia landing audit. Scans every user-facing HTML/JS file in this
 * repo and fails if any blocklisted term slips in. Runs as its own CI
 * job (`.github/workflows/validate.yml` -> `forbidden-terms`) so the
 * landing stays free of disability/clinical/minors labelling even
 * though the project intentionally has no `scripts/check.js`
 * (see README.md).
 *
 * Scope: the public landing page only.
 *   - index.html                       (the portal itself)
 *   - js/*.js                          (bootstrap, prepaint, script, strings)
 *   - about/privacidad.html            (linked from the landing footer)
 *
 * Out of scope (deliberately):
 *   - SPEC.md / CLAUDE.md / CONTRIBUTING.md / README*.md
 *     Internal docs may — and must — name the audience. That is exactly
 *     why this rule exists for the product surface.
 *   - graphs (graphify-out-meta/, scripts/sync-graphify-skill.js)
 *
 * Term list mirrors calculia / okeymoney / teclatlon: the suite-wide
 * blocklist that enforces SPEC.md §4 ("Mandatory rule: zero mentions
 * in the user-facing product"). Sinonimia has the same rule in
 * scripts/validar.js (with js/data.*.js excluded — dictionary entries
 * may legitimately name a real bureaucratic concept; apptonomia ships
 * no dictionary, so no such exception applies here).
 *
 * No npm dependencies: Node stdlib only (fs, path).
 */

'use strict';

var fs = require('fs');
var path = require('path');

var ROOT = path.resolve(__dirname, '..');

// --- 1. Term list ---
// `match` distinguishes substring terms (Spanish phrases and unambiguous
// English stems) from word-boundary terms (English words that would give
// false positives as substrings, e.g. "minor" inside "minor annoyance").
var FORBIDDEN_TERMS = [
  { term: 'discapacidad',        match: 'substring' },
  { term: 'disabilit',           match: 'substring' },
  { term: 'intelectual',         match: 'substring' },
  { term: 'intellectual',        match: 'substring' },
  { term: 'terapia ocupacional', match: 'substring' },
  { term: 'occupational therap', match: 'substring' },
  { term: 'dificultades cognitivas', match: 'substring' },
  { term: 'cognitive difficult', match: 'substring' },
  { term: 'necesidades especiales', match: 'substring' },
  { term: 'special needs',       match: 'substring' },
  { term: 'capacidades diferentes', match: 'substring' },
  { term: 'different abilities', match: 'substring' },
  { term: 'menor de edad',       match: 'substring' },
  { term: 'menores de edad',     match: 'substring' },
  { term: 'personas menores',    match: 'substring' },
  { term: 'menor que',           match: 'substring' },
  { term: 'menores que',         match: 'substring' },
  { term: 'minor',               match: 'word' },
  { term: 'underage',            match: 'word' },
  { term: 'children',            match: 'word' },
  { term: 'paciente',            match: 'word' },
  { term: 'patient',             match: 'word' }
];

// --- 2. File collection ---
function isUserFile(file) {
  var name = path.basename(file).toLowerCase();
  return /\.html?$/.test(name) || /\.js$/.test(name);
}
function listFiles(dir) {
  var out = [];
  if (!fs.existsSync(dir)) return out;
  fs.readdirSync(dir).forEach(function (f) {
    var full = path.join(dir, f);
    if (fs.statSync(full).isFile() && isUserFile(full)) out.push(full);
  });
  return out;
}

var targets = [path.join(ROOT, 'index.html')]
  .concat(listFiles(path.join(ROOT, 'js')));
var aboutPrivacidad = path.join(ROOT, 'about', 'privacidad.html');
if (fs.existsSync(aboutPrivacidad)) targets.push(aboutPrivacidad);

// --- 3. Scan ---
var failures = [];
var hits = 0;

targets.forEach(function (file) {
  var rel = path.relative(ROOT, file).replace(/\\/g, '/');
  var content;
  try {
    content = fs.readFileSync(file, 'utf8').toLowerCase();
  } catch (err) {
    failures.push(rel + ': cannot read (' + err.message + ')');
    return;
  }
  FORBIDDEN_TERMS.forEach(function (entry) {
    var term = entry.term;
    var hit;
    if (entry.match === 'word') {
      var re = new RegExp('\\b' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b');
      hit = re.test(content);
    } else {
      hit = content.indexOf(term.toLowerCase()) !== -1;
    }
    if (hit) {
      hits += 1;
      failures.push(
        rel + ': contains "' + term + '" \u2014 the public landing must not ' +
        'mention disability, occupational therapy or minors ' +
        '(see CLAUDE.md "Public-facing wording: usuario/a tipo euphemism")'
      );
    }
  });
});

// --- 4. Report ---
var scannedCount = targets.length;
if (failures.length === 0) {
  console.log(
    'OK  forbidden-terms: scanned ' + scannedCount + ' file(s), ' +
    FORBIDDEN_TERMS.length + ' terms, 0 hit(s)'
  );
  process.exit(0);
}

console.error('FAIL forbidden-terms: ' + failures.length + ' hit(s) in ' + scannedCount + ' file(s)');
failures.forEach(function (line) { console.error('  - ' + line); });
process.exit(1);
