# New-sibling file templates

This folder is the **canonical source** for the file scaffolds that
every new sibling of the Miralante suite ships on day one. Copy
them into the new repo's root, then run a project-wide find /
replace on the placeholders.

> 🌐 **Other language:** [Español](README.es.md)

---

## How to use

```bash
# 1. Create the new repo on GitHub under miralante/<slug>.
# 2. Clone it locally.
git clone git@github.com:miralante/<slug>.git
cd <slug>

# 3. Copy every file from this folder into the new repo's root.
cp -R ../apptonomia/doc/templates/. .

# 4. Replace placeholders. Every file in this folder uses the
#    same handful of placeholders:
#      {{SLUG}}        — lowercase, hyphens, ASCII, e.g. "mi-app"
#      {{DISPLAY_ES}}  — display name in Spanish, e.g. "Mi App"
#      {{DISPLAY_EN}}  — display name in English, e.g. "My App"
#      {{DOMAIN}}      — full domain, e.g. "mi-app.apptonomia.uk"
#      {{SHAPE}}       — multi-activity / single-purpose / deck-driven / shared-state / single-page
#      {{GIT_ORG}}     — "miralante"
#      {{REPO}}        — same as {{SLUG}} by default
#      {{YEAR}}        — current year (e.g. 2026)
#      {{AUTHOR}}      — maintainer's display name (default: the GitHub org)
#
#    A quick sed works on macOS / Linux:
#      find . -type f \( -name '*.md' -o -name '*.js' -o -name '*.html' \
#                          -o -name '*.yml' -o -name '*.toml' -o -name '*.json' \) \
#        -exec sed -i '' \
#          -e 's/{{SLUG}}/mi-app/g' \
#          -e 's/{{DISPLAY_ES}}/Mi App/g' \
#          -e 's/{{DISPLAY_EN}}/My App/g' \
#          -e 's/{{DOMAIN}}/mi-app.apptonomia.uk/g' \
#          -e 's/{{SHAPE}}/single-purpose/g' \
#          -e 's/{{GIT_ORG}}/miralante/g' \
#          -e 's/{{REPO}}/mi-app/g' \
#          -e 's/{{YEAR}}/2026/g' \
#          -e 's/{{AUTHOR}}/miralante/g' \
#          {} +
#
#    On Windows (PowerShell):
#      Get-ChildItem -Recurse -File -Include *.md,*.js,*.html,*.yml,*.toml,*.json |
#        ForEach-Object { (Get-Content $_ -Raw) `
#          -replace '{{SLUG}}', 'mi-app' `
#          -replace '{{DISPLAY_ES}}', 'Mi App' `
#          -replace '{{DISPLAY_EN}}', 'My App' `
#          -replace '{{DOMAIN}}', 'mi-app.apptonomia.uk' `
#          -replace '{{SHAPE}}', 'single-purpose' `
#          -replace '{{GIT_ORG}}', 'miralante' `
#          -replace '{{REPO}}', 'mi-app' `
#          -replace '{{YEAR}}', '2026' `
#          -replace '{{AUTHOR}}', 'miralante' `
#          | Set-Content $_ -NoNewline }

# 5. Trim CLAUDE.md to the sibling's scope (delete Block A.2
#    commands that don't apply, delete Block B's metaproject-only
#    sections, etc.). The template ships with the full suite-
#    wide defaults; you trim down to what your sibling needs.

# 6. Run the sibling's `node scripts/check.js` and `node scripts/
#    check-version-bump.js`. Both should pass.

# 7. Open the first PR titled "feat: bootstrap <slug> from
#    apptonomia/doc/templates". CI will run the four gates.
```

---

## What's in this folder

```
doc/templates/
├── README.md                     ← this file (English)
├── README.es.md                  ← this file (Spanish)
├── CLAUDE.md                     ← AI agent handbook template
├── README.md                     ← (overwrites the one above, intentional)
├── README.es.md
├── CONTRIBUTING.md
├── CONTRIBUTING.es.md
├── CODE_OF_CONDUCT.md
├── CODE_OF_CONDUCT.es.md
├── SECURITY.md
├── SECURITY.es.md
├── CLOUDFLARE.md
├── LICENSE                       ← MIT, 1 line
├── _headers                      ← Cloudflare cache headers
├── wrangler.toml                 ← Cloudflare Workers config
├── 404.html
├── sw.js                         ← (only if the sibling is a PWA)
├── manifest.json                 ← (only if the sibling is a PWA)
├── scripts/
│   ├── check.js                  ← structural lint + i18n parity
│   └── check-version-bump.js     ← (only if the sibling is a PWA)
└── doc/
    └── en/
        └── readme.md             ← easy-read intro template
```

Each file below this one has its own `README` and is a
copy-paste scaffold.

---

## Conventions every template follows

- **English technical code** — variables, function names,
  identifiers, comments, commit messages. See each sibling's
  `CLAUDE.md` §B.2 for the full language policy.
- **Bilingual UI / docs** — every UI string and every doc lives
  in **both** `es` and `en`. The English technical content
  (changelog, commit messages, identifiers) stays English.
- **No placeholders in committed files** — the placeholder is a
  tool for the *bootstrap* step; the committed file must have all
  `{{...}}` occurrences resolved.
- **No third-party runtime** — no Google Fonts, no analytics, no
  remote AI. See [`../doc/en/guia-de-cumplimiento.md` §4](../en/guia-de-cumplimiento.md#4-no-telemetry-no-accounts-no-remote-storage).
- **Self-hosted typefaces only** — Atkinson Hyperlegible (400/700)
  + Nunito (variable 400–900), bundled under `assets/fonts/`.
- **No build step** — plain HTML/CSS/JS served as Cloudflare
  static assets. No webpack, vite, parcel, esbuild, rollup.

---

## What this folder is **not**

- **Not a one-size-fits-all starter.** Each sibling still trims
  `CLAUDE.md` and `scripts/check.js` to its scope. The templates
  ship the full suite-wide defaults; trim, don't expand.
- **Not a fork.** New siblings copy from this folder; they do not
  `git submodule` or `pnpm workspace` link to it. The metaproject
  rule is: no cross-project dependencies.
- **Not the source of truth for product decisions.** This folder
  ships scaffolds. The product decisions (audience, scope,
  activities) come from the maintainer, written into
  `doc/<lang>/spec.md` §1.

---

## See also

- [`../doc/en/crear-app.md`](../en/crear-app.md) — full recipe for
  adding a new sibling.
- [`../doc/en/guia-de-cumplimiento.md`](../en/guia-de-cumplimiento.md) —
  suite compliance checklist that every new sibling must pass.
- Each existing sibling's `CLAUDE.md` — the canonical reference
  for how a mature sibling organises itself.
