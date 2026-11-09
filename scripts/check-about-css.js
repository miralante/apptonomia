#!/usr/bin/env node
/* ============================================================
   check-about-css.js — guards the suite-wide About stylesheet.

   The canonical file is doc/templates/about/styles.css. Every app's
   about/styles.css must be byte-identical to it, and every about/index.html
   must use the standard class names (no legacy names, no data-hue).

   Usage (from the Miralante root or from apptonomia/):
     node apptonomia/scripts/check-about-css.js          # report only
     node apptonomia/scripts/check-about-css.js --apply  # copy canonical to drifted apps
   Exit code 1 when drift is found in check mode.
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');

const SUITE = path.resolve(__dirname, '..', '..');
const CANON = path.join(SUITE, 'apptonomia', 'doc', 'templates', 'about', 'styles.css');
const CANON_LEGAL = path.join(SUITE, 'apptonomia', 'doc', 'templates', 'legal', 'styles.css');
const APPS = ['apptonomia', 'calculia', 'memofun', 'routime', 'teclatlon', 'okeymoney', 'sinonimia'];
// Pages that follow the legal template (Protección de datos) instead of about/.
const LEGAL_PAGES = [['teclatlon', 'legal']];
const LEGACY = ['cabecera-about', 'entradilla', 'lema', 'pila', 'cabecera-about-app', 'about-app'];

const apply = process.argv.includes('--apply');
const canon = fs.readFileSync(CANON, 'utf8');
let problems = 0;

const PAGES = APPS.map(a => [a, 'about']).concat(LEGAL_PAGES);
for (const [app, folder] of PAGES) {
  const canonFile = folder === 'legal' ? CANON_LEGAL : CANON;
  const canonText = fs.readFileSync(canonFile, 'utf8');
  const dir = path.join(SUITE, app, folder);
  const cssFile = path.join(dir, 'styles.css');
  const htmlFile = path.join(dir, 'index.html');
  if (!fs.existsSync(htmlFile)) { console.log(`- ${app}/${folder}: no page`); continue; }

  const css = fs.existsSync(cssFile) ? fs.readFileSync(cssFile, 'utf8') : null;
  if (css !== canonText) {
    problems++;
    if (apply) {
      fs.writeFileSync(cssFile, canonText, 'utf8');
      console.log(`  copied canonical -> ${app}/about/styles.css`);
    } else {
      console.log(`✗ ${app}/about/styles.css differs from doc/templates/about/styles.css`);
    }
  }

  const html = fs.readFileSync(htmlFile, 'utf8');
  const classes = new Set();
  for (const m of html.matchAll(/class="([^"]*)"/g)) m[1].split(/\s+/).forEach(c => c && classes.add(c));
  const bad = [...classes].filter(c => LEGACY.includes(c));
  if (bad.length) { problems++; console.log(`✗ ${app}/about/index.html legacy classes: ${bad.join(', ')}`); }
  if (/data-hue=/.test(html)) { problems++; console.log(`✗ ${app}/about/index.html uses data-hue (use style="--acento: …")`); }
}

if (problems === 0) console.log('✓ about/ stylesheets and class names match the suite template');
process.exit(problems && !apply ? 1 : 0);
