# Technical reference — Apptonomia metaproject

> 🌐 **Other language:** [Español](../es/tecnico.md)

This document is the **technical reference** for the Apptonomia
metaproject: the file-by-file breakdown of the landing, the
architecture of the cross-project plumbing, the i18n system, and
the deploy contract. For per-sibling architecture, read each
sibling's own `doc/<lang>/technical.md`.

---

## 1. Repository layout

```
apptonomia/
├── index.html                       ← The landing itself (six cards)
├── _headers                         ← Cloudflare HTTP security headers
├── wrangler.toml                    ← Cloudflare Workers + static-assets config
├── 404.html                         ← Cloudflare fallback for unmatched paths
├── js/
│   ├── bootstrap.js                 ← Pre-paint lang detect, <html lang>
│   ├── prepaint.js                  ← Inline script before stylesheets
│   ├── script.js                    ← Main landing behaviour
│   ├── strings.es.js                ← es UI copy
│   └── strings.en.js                ← en UI copy
├── css/
│   └── styles.css                   ← Design tokens + components
├── assets/
│   ├── fonts/                       ← Atkinson Hyperlegible + Nunito (woff2)
│   ├── icons/                       ← Favicon, PWA icons
│   └── og-image.svg                 ← Open Graph image
├── about/                           ← "About this project" sub-page
├── legal/                           ← Legal sub-page
├── team/                            ← "Team" sub-page
├── project/                         ← "Project" sub-page
├── doc/                             ← This folder (bilingual docs + templates)
├── graphify-out-meta/               ← Cross-project knowledge graph
│   ├── graph.json                   ← Thin index (one node per sibling)
│   └── graph.html                   ← Visual rendering
├── scripts/
│   ├── check.js                     ← Structural lint + i18n parity
│   ├── check-forbidden-terms.js     ← Blocklist scan for "discapacidad" / etc.
│   ├── sync-graphify-skill.js       ← Cross-project graphify sync
│   ├── build-meta-graph.js          ← Rebuild graphify-out-meta from sibling graphs
│   ├── build-head.js                ← Idempotent SEO/OG/Twitter regeneration
│   ├── sync-cloudflare-skills.js     ← Sync Cloudflare-related skills into a sibling
│   └── rename-doc-lowercase.js      ← One-off doc filename lowercaser
├── CLAUDE.md                        ← Operational handbook + suite policies
├── CLOUDFLARE.md                    ← Deploy runbook (the canonical one)
├── README.md, README.es.md          ← Public intro (es + en)
├── CONTRIBUTING.md, .es.md          ← Contribution workflow
├── CODE_OF_CONDUCT.md, .es.md       ← Contributor Covenant
├── SECURITY.md, .es.md              ← Vulnerability disclosure
├── LICENSE                          ← MIT
└── og-image.svg                     ← Open Graph image
```

---

## 2. The landing (`index.html`)

`index.html` is a single static HTML file. It contains:

- The `<head>` with the SEO metadata, Open Graph, Twitter Card,
  JSON-LD `ItemList`, canonical URL and the `<html lang>` tag.
- The pre-paint `<script>` (`js/prepaint.js`) that sets the
  active language before any CSS is parsed.
- The bootstrap `<script>` (`js/bootstrap.js`) that detects the
  preferred locale from `navigator.languages` and falls back to
  Spanish.
- The main `<script>` (`js/script.js`) that wires the language
  picker, the card click handlers and the Open Graph meta tag
  updates.
- The `<body>` with the six cards, each rendered from a data
  attribute that maps to the active locale's `strings.<locale>.js`.

The landing does **not** render content from a database. Every
piece of UI text lives in `js/strings.<locale>.js`, and the
landing is a pure static file.

### 2.1 i18n bootstrap

The bootstrap script (`js/bootstrap.js`) is intentionally tiny:

```js
// Pseudo-code, see js/bootstrap.js for the canonical version.
function detectLocale(navigatorLanguages, supported) {
  for (const lang of navigatorLanguages || []) {
    const base = lang.toLowerCase().split('-')[0];
    if (supported.indexOf(base) !== -1) return base;
  }
  return 'es'; // default
}
```

The active locale is mirrored into `<html lang>`, written to
`<title>`, `<meta name="description">`, `<meta property="og:*">`
and the JSON-LD `ItemList`. No `localStorage` is written — the
landing is stateless on purpose.

---

## 3. The cross-project plumbing

### 3.1 `scripts/sync-graphify-skill.js`

The single sanctioned cross-project mutation tool. It has four
sub-commands:

| Sub-command | What it does |
|---|---|
| `sync --check` (default) | Reports which siblings are drifted from `~/.claude/skills/graphify/`, without changing anything. |
| `sync --apply` | Copies `SKILL.md` + `references/` into each sibling's `.claude/skills/graphify/`. Never overwrites `.graphifyignore` or `.graphify_*` runtime state files. |
| `update --check` | Reports stale per-project graphs (HEAD != `Built from commit:` field of `GRAPH_REPORT.md`). |
| `update --apply` | Refreshes stale per-project graphs and rebuilds `graphify-out-meta/graph.json` + `graph.html`. Pass `--all` to include the metaproject itself; pass `--target <slug>` to scope to one sibling. |
| `ask <slug> <question>` | Runs `python -m graphify query <question> --graph <slug>/graphify-out/graph.json` from the metaproject root. Sets `cwd` to the sibling so `.graphifyignore` still applies. |

The script is intentionally minimal: no npm dependencies,
sha256-compares `SKILL.md`, fail-loud on any cross-project edit
that's not on the whitelist (`SKILL.md` + `references/` only —
never the siblings' own `sw.js`).

### 3.2 The meta-graph (`graphify-out-meta/`)

`graph.json` holds one node per sibling plus two edge kinds:

- **Similarity edges (undirected)**: pairs of siblings that share
  ≥2 normalised community names across their per-project graphs.
- **Hierarchy edges (directed, `parent_of`)**: `apptonomia →
  <sibling>`, reflecting that the metaproject carries the
  cross-project plumbing.

The meta-graph is regenerated by `scripts/build-meta-graph.js`
after each `update --apply` run. It is not the source of truth
for any sibling — each sibling's own `graphify-out/graph.json` is.

### 3.3 Per-sibling deep graphs

Each sibling's repo has its own `graphify-out/graph.json`,
built by running `graphify update .` inside that sibling. The
metaproject's `scripts/sync-graphify-skill.js ask` is the
orchestrated way to query those graphs from the metaproject root
without `cd`-ing into the sibling.

---

## 4. i18n

### 4.1 `js/strings.<locale>.js`

Each locale has its own file:

```js
// js/strings.es.js (canonical shape)
window.STRINGS = {
  es: {
    'meta.title': 'Apptonomia — suite de actividades',
    'meta.description': '…',
    'cards.calculia.name': 'Calculia',
    'cards.calculia.tagline': '…',
    // …
  }
};
```

The main script (`js/script.js`) reads from
`window.STRINGS[currentLocale]`; if a key is missing, it falls
back to the `es` block (which is the source of truth for every
key).

### 4.2 Adding a new locale

Recipe:

1. Create `js/strings.<locale>.js` with the same key set as
   `js/strings.es.js`, translated.
2. Add the locale to the `SUPPORTED` list in
   `js/bootstrap.js`.
3. Add a button to the language picker in `index.html`.
4. Update `scripts/check.js` to include the new locale in the
   parity check.
5. Update `README.md` + `README.es.md` badges (the `i18n`
   badge) to list the new locale.

Full recipe: see [`i18n.md`](i18n.md).

---

## 5. Deploy

Apptonomia deploys to **Cloudflare Workers + static assets** via
the Cloudflare Git connector — automatic on every push to `main`.

### 5.1 Wrangler config (`wrangler.toml`)

The metaproject's `wrangler.toml` pins the project name
(`name = "apptonomia"`), the static-assets directory
(`directory = "."`), and the not-found handling
(`not_found_handling = "404-page"`, which makes Cloudflare
serve this repo's own `404.html`).

### 5.2 HTTP security headers (`_headers`)

The `_headers` file is read by Cloudflare at the edge. It sets
the standard suite-wide headers (HSTS, X-Content-Type-Options,
X-Frame-Options, Referrer-Policy, Permissions-Policy,
Cross-Origin-Opener-Policy, Content-Security-Policy) plus
per-path cache controls.

The `Content-Security-Policy` is intentionally strict:
`default-src 'self'; script-src 'self'; style-src 'self'
'unsafe-inline'; img-src 'self' data:; font-src 'self';
connect-src 'self'; frame-ancestors 'none'; base-uri 'self';
form-action 'self'`. The `style-src` includes `'unsafe-inline'`
because the landing inlines a few critical styles for first paint
(font, focus ring). Inline scripts are not allowed.

### 5.3 Cache control

Apptonomia does not ship a `sw.js`. Cache freshness is controlled
purely by HTTP headers + `?v=` content-hash on the
`<script src="js/...">` tags:

- `js/strings.<locale>.js`, `js/bootstrap.js`, `js/script.js` —
  `?v=<sha256>` on the `<script>` tag in `index.html`. The hash is
  regenerated by `scripts/build-head.js` after a content change.
- `assets/fonts/*`, `assets/icons/*` — `Cache-Control:
  public, max-age=31536000, immutable`. These files change only
  when the maintainer changes the typefaces or icons; the
  immutable cache survives a deploy.
- `index.html`, `404.html` — `Cache-Control: public, max-age=0,
  must-revalidate`. Always re-fetched; the `?v=` on the scripts
  inside is what invalidates the bundled JS.

### 5.4 First deploy

The first deploy of a brand-new project follows
[`../../CLOUDFLARE.md`](../../CLOUDFLARE.md). The metaproject's
`CLOUDFLARE.md` is the canonical runbook for the whole suite;
per-sibling `CLOUDFLARE.md` files describe per-app specifics.

---

## 6. Testing

There is no `npm test` in this repo. The structural check is
`node scripts/check.js`, which:

1. Verifies that every `.js` file in the shipped tree parses.
2. Verifies that `_redirects` stays within Cloudflare's per-file
   limits.
3. Verifies that `_headers` stays within Cloudflare's per-file
   limit of 100 header rules.
4. Verifies that no shipped file exceeds 25 MB (Cloudflare Pages'
   per-file limit).

The `check-forbidden-terms.js` script scans the landing tree for
clinical terms that should not appear on public surfaces (see
[`../../CLAUDE.md`](../../CLAUDE.md) §B.4 for the rule).

---

## 7. Housekeeping scripts

The `scripts/` folder holds one-off Node scripts that have proven
useful during development. They are plain Node, no dependencies:

- `build-head.js` — idempotent SEO/OG/Twitter regeneration.
  Run after changing the SEO copy or the JSON-LD `ItemList`.
- `build-meta-graph.js` — rebuilds `graphify-out-meta/` from each
  sibling's `graphify-out/`. Usually invoked by
  `sync-graphify-skill.js update --apply`.
- `rename-doc-lowercase.js` — one-off helper used by the in-flight
  rename refactor in some siblings. Idempotent.

None of these scripts run automatically in CI. Each one is
explicit.

---

## See also

- [`spec.md`](spec.md) — product definition (non-technical).
- [`i18n.md`](i18n.md) — how the es/en landing UI works.
- [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) — suite
  compliance checklist.
- [`../../CLOUDFLARE.md`](../../CLOUDFLARE.md) — canonical
  deploy runbook for the whole suite.
- [`../../CLAUDE.md`](../../CLAUDE.md) §A — operational
  handbook.
