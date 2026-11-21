#!/usr/bin/env node
// scripts/sync-suite-test-kit.js
//
// Keeps the test kit of the suite identical in every app. Canonical sources
// live in scripts/suite/:
//
//   serve.js           -> <app>/scripts/serve.js         (whole file, copied as is)
//   tests-playwright.js-> <app>/tests/playwright.js       (whole file, copied as is)
//   smoke.spec.js      -> <app>/tests/smoke.spec.js       (whole file, copied as is)
//   404-page.html      -> <app>/404.html                  (rendered with the app's values)
//
// The 404 page is rendered, not copied: every app has its own stylesheets,
// its own scripts and its own name, and those live in the table below.
//
//   node scripts/sync-suite-test-kit.js            # --check (default): report drift, change nothing
//   node scripts/sync-suite-test-kit.js --apply    # write the copies that differ
//   node scripts/sync-suite-test-kit.js --only app1,app2
//
// Node only, no dependencies. Exit code 1 when any copy differs (check mode).

'use strict';

const fs = require('fs');
const path = require('path');

const SUITE_ROOT = path.resolve(__dirname, '..', '..');
const SUITE_DIR = path.join(__dirname, 'suite');
const PORTAL = 'https://apptonomia.uk/';

/* Each app: its name, its own stylesheets and scripts, and the mounts of the
   shared chrome. The paths are root-absolute on purpose (see 404-page.html). */
const APPS = [
  {
    app: 'apptonomia',
    name: 'Apptonomia',
    css: ['/css/styles.css', '/assets/css/locale-picker.css'],
    scripts: ['/js/suite-chrome.js', '/assets/js/locale-picker-config.js', '/assets/js/locale-picker.js'],
    header: ' data-suite-mark="🌱" data-suite-name="Apptonomia"',
    footer: ` data-suite-base="/" data-suite-portal="${PORTAL}" data-suite-contact="hello@apptonomia.uk"`,
    back: 'Volver al portal'
  },
  {
    app: 'calculia',
    name: 'Calculia',
    css: ['/assets/css/brand.css', '/assets/css/components.css', '/assets/css/locale-picker.css'],
    scripts: ['/assets/js/sw-register.js', '/assets/js/suite-chrome.js', '/assets/js/locale-picker-config.js', '/assets/js/locale-picker.js'],
    header: ' data-suite-logo="/assets/img/icono.svg" data-suite-byline',
    footer: ` data-suite-base="/" data-suite-portal="${PORTAL}"`,
    back: 'Volver a Calculia'
  },
  {
    app: 'ludia',
    name: 'Ludia',
    css: ['/assets/css/styles.css', '/assets/css/locale-picker.css'],
    scripts: ['/assets/js/sw-register.js', '/assets/js/suite-chrome.js', '/assets/js/locale-picker-config.js', '/assets/js/locale-picker.js'],
    header: ' data-suite-logo="/assets/img/icon.svg" data-suite-byline',
    footer: ` data-suite-base="/" data-suite-portal="${PORTAL}"`,
    back: 'Volver a Ludia'
  },
  {
    app: 'memofun',
    name: 'Memofun',
    css: ['/assets/css/suite-base.css', '/assets/css/brand.css', '/assets/css/tokens.css',
      '/assets/css/base.css', '/assets/css/componentes.css', '/assets/css/locale-picker.css'],
    scripts: ['/assets/js/suite-chrome.js', '/assets/js/locale-picker-config.js', '/assets/js/locale-picker.js'],
    header: ' data-suite-logo="/assets/img/icono.svg" data-suite-byline',
    footer: ` data-suite-base="/" data-suite-portal="${PORTAL}"`,
    back: 'Volver a Memofun'
  },
  {
    app: 'okeymoney',
    name: 'Okeymoney',
    css: ['/assets/css/componentes.css', '/assets/css/locale-picker.css'],
    scripts: ['/assets/js/sw-register.js', '/assets/js/suite-chrome.js', '/assets/js/locale-picker-config.js', '/assets/js/locale-picker.js'],
    header: ' data-suite-logo="/assets/img/icono-euro.svg" data-suite-byline',
    footer: ` data-suite-base="/" data-suite-portal="${PORTAL}"`,
    back: 'Volver a Okeymoney'
  },
  {
    app: 'routime',
    name: 'Routime',
    css: ['/assets/css/brand.css', '/assets/css/components.css', '/assets/css/locale-picker.css'],
    scripts: ['/assets/js/sw-update.js', '/assets/js/suite-chrome.js', '/assets/js/locale-picker-config.js', '/assets/js/locale-picker.js'],
    header: ' data-suite-logo="/assets/img/icono.svg" data-suite-byline',
    footer: ` data-suite-base="/" data-suite-portal="${PORTAL}"`,
    back: 'Volver a Routime'
  },
  {
    app: 'sinonimia',
    name: 'Sinonimia',
    css: ['/css/styles.css', '/css/locale-picker.css'],
    scripts: ['/js/sw-register.js', '/js/suite-chrome.js', '/js/locale-picker-config.js', '/js/locale-picker.js'],
    header: ' data-suite-logo="/img/logo.svg" data-suite-byline',
    footer: ` data-suite-base="/" data-suite-portal="${PORTAL}"`,
    back: 'Volver a Sinonimia'
  },
  {
    app: 'teclatlon',
    name: 'Teclatlon',
    css: ['/assets/css/componentes.css', '/assets/css/locale-picker.css'],
    scripts: ['/assets/js/register-sw.js', '/assets/js/suite-chrome.js', '/assets/js/locale-picker-config.js', '/assets/js/locale-picker.js'],
    header: ' data-suite-logo="/assets/img/icono.svg" data-suite-byline',
    footer: ` data-suite-base="/" data-suite-portal="${PORTAL}"`,
    back: 'Volver a Teclatlon'
  },
  {
    /* The scaffold of every new app. The placeholders that new-app.js knows
       ({{DISPLAY_ES}}) stay in the rendered file: it fills them when the app
       is created, and fails if one is left empty. */
    app: 'apptonomia/doc/templates',
    name: '{{DISPLAY_ES}}',
    css: ['/assets/css/suite-base.css', '/assets/css/brand.css', '/assets/css/styles.css', '/assets/css/locale-picker.css'],
    scripts: ['/js/i18n.js', '/js/strings.es.js', '/js/strings.en.js', '/js/suite-chrome.js',
      '/js/locale-picker-config.js', '/js/locale-picker.js'],
    header: ' data-suite-logo="/assets/icons/icon.svg" data-suite-byline data-suite-name="{{DISPLAY_ES}}"',
    footer: ' data-suite-base="/"',
    back: 'Ir a la página principal'
  }
];

function readOr(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
}

/* The 404 page of one app, rendered from the canonical page. The canonical's
   own comment (the explanation of the rules) is dropped: only what comes
   after the doctype reaches the reader. */
function render404(spec) {
  const canonical = readOr(path.join(SUITE_DIR, '404-page.html'));
  const body = canonical.slice(canonical.indexOf('<!doctype html>'));
  const css = spec.css.map((href) => `  <link rel="stylesheet" href="${href}">`).join('\n');
  const scripts = spec.scripts.map((src) => {
    const defer = /suite-chrome\.js$|locale-picker\.js$/.test(src) ? ' defer' : '';
    return `  <script src="${src}"${defer}></script>`;
  }).join('\n');
  return body
    .replace('{{APP_NAME}}', spec.name)
    .replace('{{CSS_LINKS}}', css)
    .replace('{{HEADER_ATTRS}}', spec.header)
    .replace('{{FOOTER_ATTRS}}', spec.footer)
    .replace('{{HEADING}}', 'Página no encontrada')
    .replace('{{MESSAGE}}', `La ruta que has visitado no existe. La página principal de ${spec.name} sigue disponible.`)
    .replace('{{HOME}}', '/')
    .replace('{{BACK_LABEL}}', spec.back)
    .replace('{{SCRIPTS}}', scripts);
}

/* The files this script owns in every app: the copied ones and the rendered one. */
function targetsOf(app) {
  return [
    { rel: path.join(app, 'scripts', 'serve.js'), canonical: 'serve.js' },
    { rel: path.join(app, 'tests', 'playwright.js'), canonical: 'tests-playwright.js' },
    { rel: path.join(app, 'tests', 'smoke.spec.js'), canonical: 'smoke.spec.js' }
  ];
}

function onlyFilter() {
  const at = process.argv.indexOf('--only');
  if (at === -1) return () => true;
  const names = String(process.argv[at + 1] || '').split(',').filter(Boolean);
  return (app) => names.includes(app);
}

function main() {
  const doApply = process.argv.includes('--apply');
  const wanted = onlyFilter();
  let drift = 0;

  for (const spec of APPS) {
    if (!wanted(spec.app)) continue;

    for (const target of targetsOf(spec.app)) {
      const dest = path.join(SUITE_ROOT, target.rel);
      const expected = readOr(path.join(SUITE_DIR, target.canonical));
      const current = readOr(dest);
      if (current === expected) {
        console.log(`ok       ${target.rel}`);
        continue;
      }
      drift += 1;
      if (doApply) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, expected, 'utf8');
        console.log(`${current === null ? 'created ' : 'updated '} ${target.rel}`);
      } else {
        console.log(`${current === null ? 'missing ' : 'drift   '} ${target.rel}`);
      }
    }

    /* The 404 page: rendered with this app's values. */
    const rel = path.join(spec.app, '404.html');
    const dest = path.join(SUITE_ROOT, rel);
    const expected = render404(spec);
    const current = readOr(dest);
    if (current === expected) {
      console.log(`ok       ${rel}  [404]`);
      continue;
    }
    drift += 1;
    if (doApply) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, expected, 'utf8');
      console.log(`${current === null ? 'created ' : 'updated '} ${rel}  [404]`);
    } else {
      console.log(`${current === null ? 'missing ' : 'drift   '} ${rel}  [404]`);
    }
  }

  if (!doApply && drift > 0) {
    console.log(`\n${drift} file(s) differ from scripts/suite/. Run with --apply.`);
    process.exitCode = 1;
  }
}

main();
