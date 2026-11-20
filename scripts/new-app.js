#!/usr/bin/env node
/*
 * scripts/new-app.js — creates a new suite app from doc/templates/.
 *
 *   node scripts/new-app.js --slug mi-app --es "Mi App" [--en "My App"] [options]
 *
 * Options:
 *   --dest <dir>        where to create it (default ../<slug>); must not exist or be empty
 *   --domain <host>     default <slug>.apptonomia.uk
 *   --email <address>   support address shown in the footer (default hello@apptonomia.uk)
 *   --shape <shape>     multi-activity | single-purpose | deck-driven | shared-state | single-page
 *   --branch <name>     production branch (default main)
 *   --with A,B          keep the optional {{#A}}…{{/A}} sections (e.g. HAS_CONTENT_CC_BY_SA)
 *   --set KEY=value     set any other placeholder (repeatable)
 *
 * What it does:
 *   1. Copies doc/templates/ to the destination, except the files that
 *      describe the template itself (TEMPLATES*.md).
 *   2. Replaces every {{PLACEHOLDER}} in text files, reading and writing UTF-8
 *      (never the system code page: accents and emoji must survive).
 *   3. Resolves the optional {{#FLAG}}…{{/FLAG}} sections.
 *   4. Fails, and removes what it created, if any placeholder is left without
 *      a value — a half-filled scaffold is worse than none.
 *
 * It never touches git, never pushes, never deploys. Plain Node, no dependencies.
 * scripts/check-template.js runs it into a temporary folder in CI.
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const TEMPLATE_DIR = path.join(__dirname, '..', 'doc', 'templates');
const SKIP = new Set(['TEMPLATES.md', 'TEMPLATES.es.md']);
const TEXT_EXT = /\.(md|html|css|js|json|toml|yml|yaml|txt|svg)$/i;
const TEXT_NAMES = new Set(['_headers', '.assetsignore', '.graphifyignore', 'LICENSE']);
const PLACEHOLDER = /\{\{([A-Z][A-Z0-9_]*)\}\}/g;
const SECTION = /\{\{#([A-Z][A-Z0-9_]*)\}\}\n?([\s\S]*?)\{\{\/\1\}\}\n?/g;

function parseArgs(argv) {
  const opts = { set: {}, with: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) throw new Error(`unexpected argument: ${arg}`);
    const name = arg.slice(2);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith('--')) throw new Error(`${arg} needs a value`);
    i++;
    if (name === 'set') {
      const eq = value.indexOf('=');
      if (eq < 1) throw new Error(`--set expects KEY=value, got ${value}`);
      opts.set[value.slice(0, eq)] = value.slice(eq + 1);
    } else if (name === 'with') {
      opts.with.push(...value.split(',').filter(Boolean));
    } else {
      opts[name] = value;
    }
  }
  return opts;
}

/* Every placeholder and its value. The doc-only ones get neutral defaults that
   read well as is; the maintainer edits them later in the docs if needed. */
function valuesFor(opts) {
  if (!/^[a-z][a-z0-9-]*$/.test(opts.slug || '')) {
    throw new Error('--slug is required: lowercase ASCII letters, digits and hyphens (e.g. mi-app)');
  }
  if (!opts.es) throw new Error('--es is required: the app name in Spanish');
  const slug = opts.slug;
  const en = opts.en || opts.es;
  const branch = opts.branch || 'main';
  const values = {
    SLUG: slug,
    REPO: slug,
    DISPLAY_ES: opts.es,
    DISPLAY_EN: en,
    DISPLAY: en,
    DISPLAY_NAME: en,
    DOMAIN: opts.domain || `${slug}.apptonomia.uk`,
    SHAPE: opts.shape || 'single-purpose',
    GIT_ORG: 'miralante',
    AUTHOR: 'miralante',
    YEAR: String(new Date().getFullYear()),
    SUPPORT_EMAIL: opts.email || 'hello@apptonomia.uk',
    PRODUCTION_BRANCH: branch,
    DEFAULT_BRANCH: branch,
    WORKFLOW: 'validate.yml',
    BUILD_COMMAND: '*(empty — no build step)*',
    SW_STRATEGY: 'network-first for page navigations and cache-first for every other file in `FILES`',
    SW_STRATEGY_LABEL: 'network-first / cache-first',
    CACHE_POLICY: 'fonts are `immutable` for a year; every other file revalidates on each request (`max-age=0, must-revalidate`), and the service worker serves them offline.\n',
    CUSTOM_DOMAIN_BODY: `The production domain is \`${opts.domain || `${slug}.apptonomia.uk`}\`, set up in the Cloudflare dashboard (see "How to add a custom domain" below).`,
    SUITE_SPECIFIC_THREAT_MODEL: '',
    SUITE_SPECIFIC_THREAT_MODEL_ES: '',
    LIVE_URL_NOTE: '',
    BUILD_COMMAND_NOTE: '',
    REDIRECTS_NOTE: '',
    REDIRECTS_ROW: '',
    EXTRA_FILES_ROWS: '',
    REPO_NARRATIVE: '',
    NO_ENV_NARRATIVE: 'No environment variables or secrets are needed.',
    EXTRA_HEADER_LIST: '',
    CI_EXTRA: '',
    CUSTOM_DOMAIN_NOTE: ''
  };
  return Object.assign(values, opts.set);
}

function isText(file) {
  return TEXT_EXT.test(file) || TEXT_NAMES.has(path.basename(file));
}

function listFiles(dir, base = dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(full, base, out);
    else if (!(dir === base && SKIP.has(entry.name))) out.push(path.relative(base, full));
  }
  return out;
}

function render(text, values, flags) {
  const sections = text.replace(SECTION, (_, flag, body) => (flags.has(flag) ? body : ''));
  return sections.replace(PLACEHOLDER, (whole, key) => (key in values ? values[key] : whole));
}

function createApp(opts) {
  const values = valuesFor(opts);
  const flags = new Set(opts.with);
  const dest = path.resolve(opts.dest || path.join(__dirname, '..', '..', values.SLUG));
  if (fs.existsSync(dest) && fs.readdirSync(dest).length) {
    throw new Error(`${dest} already exists and is not empty`);
  }

  const missing = new Map();
  const files = listFiles(TEMPLATE_DIR);
  fs.mkdirSync(dest, { recursive: true });
  try {
    for (const rel of files) {
      const from = path.join(TEMPLATE_DIR, rel);
      const to = path.join(dest, rel);
      fs.mkdirSync(path.dirname(to), { recursive: true });
      if (!isText(rel)) {
        fs.copyFileSync(from, to);
        continue;
      }
      const out = render(fs.readFileSync(from, 'utf8'), values, flags);
      for (const m of out.matchAll(/\{\{[#/]?([A-Z][A-Z0-9_]*)\}\}/g)) {
        if (!missing.has(m[1])) missing.set(m[1], rel);
      }
      fs.writeFileSync(to, out, 'utf8');
    }
    if (missing.size) {
      const list = [...missing].map(([key, rel]) => `${key} (${rel})`).join(', ');
      throw new Error(`placeholders without a value: ${list}. Pass them with --set KEY=value.`);
    }
  } catch (e) {
    fs.rmSync(dest, { recursive: true, force: true });
    throw e;
  }
  return { dest, files: files.length, values };
}

module.exports = { createApp, valuesFor, render };

if (require.main === module) {
  try {
    const result = createApp(parseArgs(process.argv.slice(2)));
    console.log(`Created ${result.values.DISPLAY_ES} (${result.values.SLUG}) in ${result.dest} — ${result.files} files.`);
    console.log('Next steps:');
    console.log(`  cd ${path.relative(process.cwd(), result.dest) || '.'}`);
    console.log('  git init -b main');
    console.log('  node ../apptonomia/scripts/sync-graphify-skill.js sync --apply   (adds the graphify skill)');
    console.log('  node scripts/check.js && node scripts/smoke-sw.js && npm run test:ui');
    console.log('Then add the app to the TARGETS of the apptonomia sync scripts (doc/en/crear-app.md).');
  } catch (e) {
    console.error(`new-app: ${e.message}`);
    process.exitCode = 1;
  }
}
