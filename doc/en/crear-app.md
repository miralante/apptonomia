# Adding a new app to the suite

This guide is the **recipe** for adding a new sibling to the
Miralante suite — the seventh app, or any future one. It is the
practical companion to [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md);
read both before starting, then use [`templates/`](../templates/)
as the file scaffolds.

> 🌐 **Other language:** [Español](../es/crear-app.md)

---

## Contents

1. [Before you start](#1-before-you-start)
2. [Decide the basics](#2-decide-the-basics)
3. [Set up the new repo](#3-set-up-the-new-repo)
4. [Required file anatomy](#4-required-file-anatomy)
5. [Wire the shared core](#5-wire-the-shared-core)
6. [Cache contract for PWA siblings](#6-cache-contract-for-pwa-siblings)
7. [Doc tree (bilingual)](#7-doc-tree-bilingual)
8. [Register the new sibling in apptonomia/](#8-register-the-new-sibling-in-apptonomia)
9. [CI gates](#9-ci-gates)
10. [First deploy](#10-first-deploy)
11. [Maintenance scripts](#11-maintenance-scripts)

---

## 1. Before you start

You need:

- **A scope one sentence long.** "An app that teaches X to Y". If
  you can't say it in one sentence, the scope is too big — split
  it.
- **The audience profile** the app is for (read
  [`guia-de-cumplimiento.md` §1](guia-de-cumplimiento.md#1-easy-read-always-une-153101)
  for the easy-read contract; §2 for the WCAG AAA target).
- **One existing sibling** as the closest architectural reference.
  Pick from `routime/` (multi-activity catalogue),
  `calculia/` (multi-activity catalogue with shared core),
  `memofun/` (deck-driven), `okeymoney/` (single shared-state
  app), `sinonimia/` (single-page app), `teclatlon/` (single-
  activity app). The closest match tells you which `app.js`
  skeleton to start from.
- **Permission to create a new repo** under the `miralante/`
  GitHub organisation, and to add a card to the Apptonomia
  landing. Both need explicit user approval before the first push
  (see metaproject `../../CLAUDE.md` §A.3).

If any of these is missing, stop and ask. Creating a new sibling
is not a one-person surprise.

---

## 2. Decide the basics

Before touching files, write these decisions down in a one-pager
(saved as `doc/<lang>/spec.md` §1 once the docs are written):

| Decision | What to choose | Where to look for guidance |
|---|---|---|
| **Display name** (Spanish) | "Mi App" / "Calculia" / … | Each sibling's `README.es.md` heading |
| **Display name** (English) | "My App" / "Calculia" / … | Each sibling's `README.md` heading |
| **Third-party assets?** | Optional. Default: no (vanilla code, CC0 fonts). "Yes — CC BY-SA lexicon content" (`THIRD_PARTY_LICENSES.md` ships), or "Yes — deck images from Openverse / Wikimedia Commons" (TASL per card; `THIRD_PARTY_LICENSES.md` ships documenting the source). | See [`THIRD_PARTY_LICENSES.md`](../templates/THIRD_PARTY_LICENSES.md) |
| **Slug** | `mi-app`, lowercase, hyphens, ASCII | The folder name; also used as `localStorage` prefix and JSON-LD id |
| **Domain** | `<slug>.apptonomia.uk` | Other siblings' `wrangler.toml` |
| **Shape** | multi-activity catalogue / single-purpose app / deck-driven | See §2.1 below |
| **PWA or not** | Yes if it ships activities the visitor revisits; no if it's a one-shot tool | Each sibling's `manifest.json` presence |
| **Layout** | Three-level (shared core + per-activity + landing) or single-file | See §2.2 below |
| **Shared core** | Reuse `assets/js/{utils,i18n,tts,storage,feedback}.js` from Apptonomia (port and trim), or write your own | See §5 below |

### 2.1 Shape

- **Multi-activity catalogue** — a landing that lists N activities,
  each with its own folder (`tools/<slug>/` or `site/tools/<slug>/`).
  Example: Routime (69 activities), Calculia (15), Apptonomia
  (variable).
- **Single-purpose app** — one app, one screen, but several practice
  modes declared in `data.js`. Example: Teclatlon.
- **Single shared-state app** — one app, one screen, one shared
  `localStorage` ledger that every flow reads and writes. Example:
  Okeymoney.
- **Deck-driven** — the unit of content is a deck (JSON file); the
  app is one render activity that knows how to play any deck.
  Example: Memofun.
- **Single-page app** — the unit of content is data (a dictionary);
  the app is one search/browse experience. Example: Sinonimia.

### 2.2 Layout

- **Three-level**: `assets/` (shared core) + `tools/<slug>/` (one
  folder per activity) + `site/` or root `index.html` (landing).
- **Single-file**: `index.html` + `app.js` + `data.js` +
  `strings.<locale>.js` + `styles.css` at the repo root.

The three-level layout is the suite default for catalogues > 3
activities. Single-file is appropriate for Sinonimia-style
dictionaries or Teclatlon-style trainers.

---

## 3. Set up the new repo

```
# 1. Create the repo on GitHub under miralante/<slug> (do it via
#    the web UI; org membership may be required).
# 2. Clone it locally.
git clone git@github.com:miralante/<slug>.git
cd <slug>

# 3. Copy the file templates from the metaproject.
#    They live in doc/templates/ relative to the metaproject root.
cp -R ../apptonomia/doc/templates/. .

# 4. Rename placeholders in the copied files.
#    Across the suite the templates use {{SLUG}}, {{DISPLAY_ES}},
#    {{DISPLAY_EN}}, {{DISPLAY_NAME}}, {{DOMAIN}}, {{SHAPE}},
#    plus, in the SECURITY template, {{GIT_ORG}}, {{REPO}},
#    {{DEFAULT_BRANCH}}, {{SUPPORT_EMAIL}}, and
#    {{SUITE_SPECIFIC_THREAT_MODEL}} (and its `_ES` counterpart).
#    Replace each occurrence. A quick sed (or your editor's
#    project-wide find/replace) does it.
```

The [`templates/`](../templates/) folder has a copy-paste scaffold
for every required file. After renaming placeholders, you'll have
the file anatomy in place without writing anything from scratch.

---

## 4. Required file anatomy

Every sibling ships this baseline. See
[`guia-de-cumplimiento.md` §8](guia-de-cumplimiento.md#8-required-file-anatomy-per-sibling)
for the canonical list with purpose and rationale. The minimum
viable subset you must have **before** the first deploy:

- `CLAUDE.md` (copied from `templates/CLAUDE.md`, then trimmed)
- `README.md` + `README.es.md`
- `LICENSE` (MIT)
- `CONTRIBUTING.md` + `CONTRIBUTING.es.md`
- `CODE_OF_CONDUCT.md` + `CODE_OF_CONDUCT.es.md`
- `SECURITY.md` + `SECURITY.es.md` (canonical template at
  [`doc/templates/SECURITY.md`](../templates/SECURITY.md) ↔
  [`doc/templates/SECURITY.es.md`](../templates/SECURITY.es.md);
  see §11 below — these are *not* edited by hand, they're
  rendered by `scripts/one-off/write-security-md.js`; the
  channel `{{SUPPORT_EMAIL}}` resolves to each repo's
  `app.config.json > supportEmail`, with a hard fallback in the
  script)
- `CLOUDFLARE.md` (deploy runbook)
- `_headers`, `wrangler.toml`, `404.html`
- `index.html` + `app.js` (or `tools/<slug>/app.js` for catalogues)
- `strings.es.js` + `strings.en.js`
- `assets/css/styles.css` (or `css/styles.css`)
- `assets/fonts/*.woff2` (Atkinson Hyperlegible + Nunito)
- `scripts/check.js` (port from `templates/scripts/check.js`)
- If PWA: `manifest.json` + `sw.js` + `scripts/check-version-bump.js`

### 4.1 What is the *minimum* minimum

If the app is a one-shot tool (not revisited) and ships no
progress data, you can skip PWA entirely: no `manifest.json`, no
`sw.js`. The rest of the file anatomy still applies.

### 4.2 Default branch convention

New siblings must default to `main`. The seven current siblings
are a mix of `main` (apptonomia, memofun, sinonimia) and
`master` (calculia, okeymoney, teclatlon, routime); the SECURITY
template is parametrized by `{{DEFAULT_BRANCH}}`, so each repo's
file stays truthful today. Migration to `main` is a one-line edit
in [`scripts/one-off/write-security-md.js`](../scripts/one-off/write-security-md.js)
after the rename is pushed.

---

## 5. Wire the shared core

The shared core is what makes a sibling feel like part of the
suite. It is **port-and-trim**, not "copy verbatim" — start from
Apptonomia's `assets/js/{utils,i18n,tts,storage,feedback}.js` and
remove functions the sibling doesn't use.

### 5.1 Port steps

1. **Copy** each core file from `apptonomia/assets/js/` into the
   sibling's own `assets/js/`.
2. **Rename the storage prefix.** In `storage.js`, find the
   `STORAGE_PREFIX` constant and change it from `apptonomia:` to
   `<slug>:`. This is the prefix every `localStorage` key in the
   sibling starts with (see
   [`guia-de-cumplimiento.md` §5.2 rule 1](guia-de-cumplimiento.md#5-settings--data-reset-pattern)).
3. **Trim**. `node scripts/check.js` reports `unused exports` per
   core module after it has been imported by the sibling's code.
   Remove what is unused; keep what is referenced.
4. **Run** the sibling's `scripts/check.js` — it asserts the
   storage prefix exists and that no key is written outside it.

### 5.2 Don't

- **Don't introduce a build step.** No webpack, vite, parcel, esbuild,
  rollup, or any bundler. The sibling ships plain HTML/CSS/JS that
  Cloudflare serves as static assets. Adding a build step is the
  most common rejection reason for new siblings.
- **Don't add npm/pip dependencies.** Plain Node for `scripts/`,
  vanilla JS for the browser. See metaproject `../../CLAUDE.md`
  §A.2.2.
- **Don't fork the core into the sibling.** A copy in
  `<sibling>/assets/js/` is fine (we trim it). A git fork is not.
- **Don't add `localStorage.clear()`.** See
  [`guia-de-cumplimiento.md` §5.2 rule 3](guia-de-cumplimiento.md#5-settings--data-reset-pattern).

---

## 6. Cache contract for PWA siblings

If the sibling is a PWA, ship a `sw.js` with a `VERSION` string
and an `ARCHIVOS` (or `FILES`) array listing every file the SW
pre-caches:

```js
// sw.js (canonical shape; see templates/sw.js)
var VERSION = '<slug>-v1';
var ARCHIVOS = [
  './',
  './index.html',
  './manifest.json',
  // ...one entry per file the visitor sees on first load
];
```

Then on **every** commit that touches a file listed in
`ARCHIVOS`:

1. Bump `VERSION` (e.g. `<slug>-v1` → `<slug>-v2`).
2. Add the new file to `ARCHIVOS` if it is a new file.
3. Run `node scripts/check-version-bump.js` — it fails CI when
   a cached file changed but `VERSION` didn't, so this is the
   automated gate that catches the "forgot to bump" mistake.

The full rule is in
[`guia-de-cumplimiento.md` §7](guia-de-cumplimiento.md#7-service-worker-cache-contract).

---

## 7. Doc tree (bilingual)

Every sibling ships `doc/<lang>/` with at least:

```
doc/
├── en/
│   ├── index.md          ← entry point, links to the others
│   ├── readme.md         ← easy-read intro for end users / families
│   ├── spec.md           ← product definition, audience, non-negotiables
│   ├── roles.md          ← the three project roles
│   ├── team.md           ← guide for families / therapists / teachers
│   ├── technical.md      ← architecture, structure, APIs, deploy
│   ├── i18n.md           ← how the es/en UI works, recipe to add a language
│   ├── activities.md     ← activity catalogue (if catalogue > 1)
│   ├── creating-elements-guide.md ← didactic + gamification + neuromarketing
│   └── quick-guide.md    ← how to open the app (4 methods)
└── es/
    ├── indice.md
    ├── readme.md
    ├── spec.md
    ├── roles.md
    ├── equipo.md
    ├── tecnico.md
    ├── i18n.md
    ├── actividades.md
    ├── guia-crear-elementos.md
    └── guia-rapida.md
```

The Spanish file names use `indice`, `equipo`, `tecnico`,
`guia-rapida`, `actividades`, `guia-crear-elementos` (no accents,
all lowercase, hyphens). The English file names use `index`,
`team`, `technical`, `quick-guide`, `activities`,
`creating-elements-guide`. This pattern is enforced by the
metaproject and is what `scripts/check.js` checks.

### 7.1 Per-language minimum

- `index.md` / `indice.md` — entry point with the directory tree
  and "where to start by profile" table.
- `readme.md` — easy-read intro mirroring the routime shape (see
  [`guia-de-cumplimiento.md` §1](guia-de-cumplimiento.md#1-easy-read-always-une-153101)).
- `spec.md` / `spec.md` — what the app is, who it's for, the
  non-negotiable principles.
- `roles.md` — the three project roles (end user / support / build).
- `team.md` / `equipo.md` — guide for families and support
  professionals (when, why, how).
- `technical.md` / `tecnico.md` — architecture, structure,
  activity anatomy, APIs, contracts, tests, deploy.
- `i18n.md` — how the es/en UI works, recipe to add a locale.
- `quick-guide.md` / `guia-rapida.md` — four ways to open the
  app (internet, ZIP, Python, Node).
- `activities.md` / `actividades.md` — only if the catalogue has
  more than one activity; otherwise `spec.md` §2 covers it.
- `creating-elements-guide.md` / `guia-crear-elementos.md` —
  didactic + gamification + neuromarketing recipes for the
  audience; only if the catalogue has more than one activity.

### 7.2 Why bilingual

The suite's audience reads Spanish first; the maintainer docs
default to es + en to match. Every product change to UI copy
**must** apply to both locales — see
[`guia-de-cumplimiento.md` §9 row 3](guia-de-cumplimiento.md#9-compliance-self-check-before-opening-a-pr).

---

## 8. Register the new sibling in apptonomia/

The Apptonomia landing is the public face of the suite. Adding a
new sibling means adding its card there. Files to touch in the
`apptonomia/` repo:

1. **`index.html`** — add a new card linking to `<slug>.apptonomia.uk`.
   Follow the existing card shape; do not invent a new design.
2. **`js/strings.es.js` + `js/strings.en.js`** — add the slug's
   name, tagline and `aria-label` in both languages. Match the
   existing entries' tone (one sentence per language, easy-read).
3. **`graphify-out-meta/graph.json`** — regenerated automatically
   by `node scripts/sync-graphify-skill.js update --apply`. Do not
   edit by hand.
4. **`CLAUDE.md` §A.1.1** — add a row to the sibling table so the
   metaproject's canonical-source table stays complete.
5. **`doc/en/index.md` + `doc/es/indice.md`** — add a "where to
   start" entry that points to the new sibling's own `CLAUDE.md`
   and `README.md`.

All five changes ride in the same PR; do not split them across
siblings (the metaproject rule "Edits to a sibling are scoped to
that sibling" is reversed for registration — registration IS
cross-cutting by design).

---

## 9. CI gates

A new sibling's first PR triggers:

| Gate | What it checks | Where to fix |
|---|---|---|
| `validate.yml` runs `node scripts/check.js` | JS syntax, file anatomy, sw ↔ disk parity, es/en key parity | `scripts/check.js` output |
| `cache-bump.yml` runs `node scripts/check-version-bump.js` (PWA only) | A cached file changed but `VERSION` didn't | Bump `VERSION` in `sw.js` |
| `i18n-smoke.yml` runs `node scripts/i18n-keys-smoke.js` (if shipped) | Every `data-i18n*` key is registered for every locale | Add the missing key to `strings.<locale>.js` |
| `secrets-scan.yml` runs `node scripts/scan-secrets.js` (if shipped) | No API key / token / PEM in the working tree | Move the secret out of the repo, rotate it |

A template for `.github/workflows/validate.yml` is in
[`templates/.github/workflows/validate.yml`](../templates/.github/workflows/validate.yml).
Copy it verbatim and adjust the `name:` field. Templates for the
optional CI jobs are in the same `templates/` tree.

---

## 10. First deploy

The suite deploys to **Cloudflare Workers + static assets** via the
Cloudflare Git connector — see each sibling's `CLOUDFLARE.md` for
the per-app contract, and the metaproject's `CLOUDFLARE.md` for the
shared runbook (rebuild, rollback, custom domain, credential
rotation).

A first-deploy checklist:

- [ ] Repo created under `miralante/<slug>` with admin rights for
      the maintainer.
- [ ] Cloudflare dashboard project created with framework preset
      "None", `wrangler.toml` pinned (project name), `[assets]
      directory = "."`, `not_found_handling = "404-page"`.
- [ ] Custom domain `<slug>.apptonomia.uk` set up in Cloudflare
      DNS (CNAME to the workers.dev subdomain).
- [ ] Git connector enabled in Cloudflare (or Workers Builds
      pointed at the repo).
- [ ] First push → Cloudflare builds → first preview URL.
- [ ] Smoke test the preview URL in a real browser (desktop +
      mobile if PWA).
- [ ] **Manual user approval** for the production deploy (this is
      a network operation — see metaproject `CLAUDE.md` §A.3).

---

## Responsive layout requirement

Every new sibling must follow the suite responsive design contract: declare
UTF-8 and the real mobile viewport, use fluid containers and flexible grids/stacks,
prevent horizontal overflow, collapse columns at narrow widths, preserve
usable touch targets, and avoid fixed heights or decorative gaps that create
excessive scrolling. Verify the layout at 320px, 375px, 768px and desktop,
checking both overflow and unused space.

The HTML must also declare UTF-8. Any immutable CSS/JS asset changed by the
new app requires a semantic cache version in the same change (`<slug>-vN`),
and the final check must be made against the deployed URL in a fresh session,
not only against a local preview.

## 11. Maintenance scripts

These are quality-of-life helpers run from
`scripts/one-off/`, modeled on the suite's manual housekeeping
pattern (build once, re-run when values change, never on every
commit).

### `write-security-md.js`

Idempotent re-render of `SECURITY.{md,es.md}` for every sibling
plus the two canonical templates at `doc/templates/`. Reads the
`REPOS` table at the top of the script — that's the only place to
edit when a value changes:

| Field | When to edit |
|---|---|
| `gitOrg` / `repo` | Repo is renamed or moved across orgs. |
| `branch` | Repo migrates from `master` to `main` (target convention). |
| `supportEmail` | Hard fallback only. The real value comes from the repo's `app.config.json > supportEmail` (printed by the script). Edit there, not here. |
| `extraThreat` / `extraThreatEs` | A new sibling has a project-specific threat-model addendum. |

```bash
# from apptonomia/ (any cwd):
node scripts/one-off/write-security-md.js
```

It writes `wrote <path>` for every file it produces (14 concrete
+ 2 templates = 16 lines of output) and exits non-zero if any
required token in the templates does not resolve. No side
effects: doesn't touch `git`, doesn't `npm install`, doesn't open
the browser.

## See also

- [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) — the
  cross-project compliance checklist that every new sibling must
  pass before merging.
- [`tecnico.md`](tecnico.md) — how the metaproject plumbing
  (`scripts/sync-graphify-skill.js`, the meta-graph) ties the
  siblings together.
- [`templates/`](../templates/) — copy-paste file scaffolds for
  every required file.
- The metaproject [`../../CLAUDE.md`](../../CLAUDE.md) §A.1.1 — the
  canonical table of existing siblings.
