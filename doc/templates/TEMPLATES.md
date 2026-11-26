# New-app template

This folder is the **canonical scaffold** of every new app of the
Miralante suite. It is one tree: what you see here is what the new
repository gets, minus this file and its Spanish mirror.

> 🌐 **Other language:** [Español](TEMPLATES.es.md)

---

## How to use

Do not copy it by hand. From the metaproject:

```bash
cd apptonomia
node scripts/new-app.js --slug mi-app --es "Mi App" --en "My App"
```

[`scripts/new-app.js`](../../scripts/new-app.js) copies this folder to
`../mi-app`, fills every placeholder (reading and writing UTF-8, so
accents and emoji survive), resolves the optional
`{{#FLAG}}…{{/FLAG}}` sections, and stops — removing what it wrote —
if any placeholder is left without a value. It never runs git, never
pushes and never deploys. Then follow
[`../en/crear-app.md`](../en/crear-app.md) §3.

| Option | Default | Placeholder(s) |
|---|---|---|
| `--slug` (required) | — | `SLUG`, `REPO` |
| `--es` (required) | — | `DISPLAY_ES` |
| `--en` | the `--es` value | `DISPLAY_EN`, `DISPLAY`, `DISPLAY_NAME` |
| `--domain` | `<slug>.apptonomia.uk` | `DOMAIN` |
| `--email` | `hello@apptonomia.uk` | `SUPPORT_EMAIL` |
| `--shape` | `single-purpose` | `SHAPE` |
| `--branch` | `main` | `PRODUCTION_BRANCH`, `DEFAULT_BRANCH` |
| `--with A,B` | none | keeps the `{{#A}}…{{/A}}` sections (`HAS_CONTENT_CC_BY_SA`, `HAS_THIRD_PARTY_IMAGES`) |
| `--set KEY=value` | — | any placeholder; the rest of the CI-CD.md / SECURITY.md ones have neutral defaults in `new-app.js` |

**The template is tested.** `node scripts/check-template.js --ui`
generates a throw-away app and runs its `check.js`, `smoke-sw.js`,
`suite-markup.js`, `scan-secrets.js` and Playwright suite. The
metaproject CI runs it on every push, so a change here that breaks a
new app fails the build.

---

## What's in this folder

```
doc/templates/
├── TEMPLATES.md / .es.md      ← this file (not copied)
├── index.html                 ← home: shared header/footer mounts, stars counter
├── 404.html                   ← root-absolute links (served at the asked URL)
├── about/ legal/             ← the pages the shared footer links to
│                                 (settings and data reset live in the gear drawer, §B.5)
├── strings.es.js / .en.js     ← UI strings; es is the source of truth
├── js/
│   ├── i18n.js                ← App.i18n core (the app owns it)
│   ├── app.js                 ← home page logic (the app owns it)
│   ├── sw-register.js         ← registers sw.js from any page depth
│   ├── locale-picker*.js      ← language/settings drawer (same file as the siblings)
│   ├── suite-chrome.js        ← synced: shared header and footer
│   ├── stars-engine.js        ← synced: star goals
│   ├── achievements-engine.js ← synced: achievements board
│   └── feedback.js            ← synced blocks (answer round, reward, celebration) + app hooks
├── assets/
│   ├── css/suite-base.css     ← synced: design tokens (canonical copy lives here)
│   ├── css/brand.css          ← the app's accent colours
│   ├── css/styles.css         ← synced suite-chrome block + the app's own rules
│   ├── css/locale-picker.css
│   ├── fonts/                 ← Atkinson Hyperlegible, Nunito (OFL)
│   └── icons/icon.svg         ← placeholder logo / PWA icon
├── sw.js / manifest.json      ← PWA: network-first pages, cache-first files
├── _headers / wrangler.toml / .assetsignore   ← Cloudflare
├── package.json               ← commands only, no dependencies
│                                 (lint, lint:markup, serve, test:sw, test:ui)
├── playwright.config.js / tests/   ← canonical suite (machine-wide
│                                 Playwright): canonical smoke + app specs
├── scripts/
│   ├── check.js               ← structure, i18n, sw.js ↔ disk, placeholders
│   ├── smoke-sw.js            ← every precache entry loads; 404 behaviour
│   ├── check-version-bump.js  ← VERSION bump gate
│   ├── sw-files.js            ← the one sw.js parser the three above share
│   ├── serve.js               ← local server that behaves like Cloudflare
│   ├── scan-secrets.js
│   └── checks/suite-markup.js ← synced: shared header/footer audit
├── .github/                   ← CI workflow and issue templates
└── CLAUDE.md, README*, CONTRIBUTING*, CODE_OF_CONDUCT*, SECURITY*,
    CI-CD.md, LICENSE, THIRD_PARTY_LICENSES.md, doc/
```

**Synced files** are copies of `apptonomia/scripts/suite/`. Never edit
them here: edit the canonical source and run its sync script; with
`--only apptonomia/doc/templates` the sync reaches this folder without
touching the sibling repos.

**The gates of the test contract.** The template is born with
`npm run lint`, `npm run lint:markup`, `npm run test:ui` (the Playwright
specs in `tests/`) and `npm run test:sw`, plus `npm run serve` (the
canonical server, for manual use). The template ships **no** crawler
(`scripts/ui-smoke.js`), so it does **not** declare `test:crawl`: a gate
pointing at a missing file is worse than no gate at all. If the app
adopts the canonical crawler, the gate is `node scripts/ui-smoke.js`.
Playwright is not a project dependency: it never goes into
`devDependencies`; locally it comes from the machine-wide install and in
CI it is installed on the fly.

---

## Conventions every template follows

- **English technical code**; bilingual (es/en) UI and docs.
- **Every localStorage key starts with `<slug>:`**, so the gear drawer's reset can
  clear the app's data without `localStorage.clear()`.
- **No third-party runtime** — no CDN, no analytics, no remote AI.
- **No build step** — plain HTML/CSS/JS served as Cloudflare static
  assets.
- **No placeholders in committed files** — `check.js` fails on any.

---

## See also

- [`../en/crear-app.md`](../en/crear-app.md) — the full recipe.
- [`../en/shared-blocks.md`](../en/shared-blocks.md) — the synced blocks.
- [`../en/guia-de-cumplimiento.md`](../en/guia-de-cumplimiento.md) —
  the compliance checklist every new app must pass.
