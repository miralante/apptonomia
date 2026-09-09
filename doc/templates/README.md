# {{DISPLAY_EN}}

> 🌐 **Other languages:** [Español](README.es.md)
>
> 🚀 **Try it live:** [{{DOMAIN}}](https://{{DOMAIN}})

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![No dependencies](https://img.shields.io/badge/dependencies-none-success.svg)](#-features)
[![Static site](https://img.shields.io/badge/build-none-informational.svg)](#-features)
[![PWA](https://img.shields.io/badge/PWA-installable-5A0FC8.svg)](manifest.json)
[![i18n](https://img.shields.io/badge/i18n-es%20%7C%20en-yellow.svg)](#-project-documentation-bilingual)
[![CI](https://img.shields.io/badge/CI-node%20scripts%2Fcheck.js-blue.svg)](.github/workflows/validate.yml)

**{{DISPLAY_EN}}** is a **free, static, dependency-free web app**
that **<one-sentence description of what the app does>**.

No accounts, no cookies, no analytics: everything runs in the
browser and progress is saved only in `localStorage`, on your own
device.

- 🌐 **App**: [{{DOMAIN}}](https://{{DOMAIN}})
- 📦 **Repository**: [github.com/{{GIT_ORG}}/{{REPO}}](https://github.com/{{GIT_ORG}}/{{REPO}})
- 💻 **Run locally**: open `index.html` directly in a browser, or
  serve the folder with any static server (`npx serve .` /
  `python -m http.server 8080`) for the full offline-capable PWA
  experience.

---

## 🚀 Try it live

{{DISPLAY_EN}} is deployed at **[{{DOMAIN}}](https://{{DOMAIN}})** —
open it in a browser, install it to the home screen for offline
use, and start. No accounts, no telemetry.

---

## ✨ Features

{{DISPLAY_EN}} is **<one-line shape description>**: <two-to-five
short bullet points about what it actually does>.

- 🎯 **<Feature 1>** — <one-sentence description>.
- 🌐 **Bilingual** — Spanish (default) and English.
- 🪶 **Zero runtime dependencies** — pure HTML/CSS/JS, no build.
- 🔒 **Privacy by default** — no accounts, no cookies, no
  analytics: all data lives in `localStorage` on the user's device.
- 📦 **Offline-capable PWA** — installable, works without internet.
- 🖐️ **Accessibility** — large hit areas, high contrast, plain
  language, full keyboard navigation, `prefers-reduced-motion`.

---

## 👥 Roles in the project

| Role | Who they are | How they participate | Where they look first |
|---|---|---|---|
| 👤 **End user** | Uses the app | Opens it in a browser; doesn't read or write code | The app |
| ❤️ **Support** | Family, therapist, teacher | Accompanies, supervises, contributes content | [`CONTRIBUTING.md`](CONTRIBUTING.md) |
| 💻 **Build** | Developer | Implements, maintains, reviews PRs, deploys | [`technical.md`](doc/en/technical.md) |

See [`doc/en/roles.md`](doc/en/roles.md) for the full role
description.

---

## 📚 Project documentation (bilingual)

All project documentation lives in the `doc/` folder:

| Language | Entry point |
|---|---|
| 🇬🇧 English (this file) | [`doc/en/index.md`](doc/en/index.md) |
| 🇪🇸 Español | [`doc/es/indice.md`](doc/es/indice.md) |

By role and profile, the most relevant docs are:

| I am… | Start here |
|---|---|
| 👤 End user or family member | [`doc/en/readme.md`](doc/en/readme.md) |
| ❤️ Therapist, family, or support professional | [`doc/en/team.md`](doc/en/team.md) |
| 🤔 I want to understand what {{DISPLAY_EN}} is and why | [`doc/en/spec.md`](doc/en/spec.md) |
| 💻 Developer | [`doc/en/technical.md`](doc/en/technical.md) |

### 📄 Other repo documents

| Document | Audience |
|---|---|
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Anyone who wants to contribute |
| `CLAUDE.md` | AI agents: operational workflow, coordination and approvals |
| [`CLOUDFLARE.md`](CLOUDFLARE.md) | Canonical Cloudflare Workers deploy guide |
| Project history | Lives in `git log`; no external roadmap is maintained |
| `doc/en/i18n.md` / `doc/es/i18n.md` | Details of the ES/EN multilanguage system |

---

## 🛠️ Adding or expanding content

<If the sibling has a catalogue: describe the catalogue parity
rule that ties tools/<slug>/ on disk, the cards in
site/index.html, the rows in settings/index.html, and the
ARCHIVOS list in sw.js.>

To add a new activity:

1. Create `tools/<slug>/` with the six canonical files (use an
   existing activity as a template).
2. Register the activity: add its card to `site/index.html` (+
   both `site/strings.<locale>.js` keys), its progress row to
   `config/index.html` (+ both `config/strings.<locale>.js`
   keys), and its six files to `sw.js`'s `ARCHIVOS`.
3. Bump `VERSION` in `sw.js` (e.g. `{{SLUG}}-vN` → `{{SLUG}}-vN+1`).
4. Read `doc/en/creating-elements-guide.md` first — didactic,
   gamification, persuasion and neuromarketing techniques for our
   audience; if a guide rule conflicts with `technical.md`,
   `technical.md` wins.

<If the sibling has no catalogue (single-purpose), drop this
section entirely.>

---

## ✅ Validating changes

```bash
node scripts/check.js
```

No `npm install` needed — the script only uses Node's standard
library. It checks JS syntax, canonical file anatomy, sw.js ↔
disk parity, es/en key parity, and (if applicable) the
catalog-parity lock.

If the sibling is a PWA, also run:

```bash
node scripts/check-version-bump.js
```

to confirm any cached-file change came with a `VERSION` bump in
`sw.js` (the cache-bump gate).

---

## ☁️ Deploying

{{DISPLAY_EN}} is a fully static site (HTML/CSS/JS, no build
step), so it ships directly to **[Cloudflare Workers (static
assets)](https://developers.cloudflare.com/workers/static-assets/)**
through its built-in GitHub integration. The HTTP security
headers live in [`_headers`](_headers), and the project metadata
in [`wrangler.toml`](wrangler.toml). See
[`CLOUDFLARE.md`](CLOUDFLARE.md) for the full runbook (rebuild,
rollback, custom domain, credential rotation).

Pull requests automatically get a preview URL on
`{{SLUG}}-<branch>.<account-subdomain>.workers.dev` — no extra
workflow is needed.

---

## 🛡️ Security

{{DISPLAY_EN}} is a fully client-side static site: no backend,
no database, no telemetry, no third-party runtime. The threat
model is essentially "what a hostile offline page could do to
the same origin", which the browser already sandboxes. See
[`SECURITY.md`](SECURITY.md) (or [`SECURITY.es.md`](SECURITY.es.md))
for how to report a suspected issue privately.

---

## 📄 License

MIT — see [`LICENSE`](LICENSE).

---

## 🤝 Contributing

Issues and pull requests are welcome. See
[`CONTRIBUTING.md`](CONTRIBUTING.md) for the workflow (and
[`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) for the Spanish
version). All participants are expected to follow
[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

---

## 🌐 The Miralante suite — projects in the group

{{DISPLAY_EN}} is one of **seven apps** in the **Miralante** suite,
sharing the same author, the same accessibility-first / no-backend
philosophy and the same deploy story.

| Project | What it is | Repository |
|---|---|---|
| **Apptonomia** *(portal — landing only, no app)* | Landing page that introduces the Miralante suite | [github.com/{{GIT_ORG}}/apptonomia](https://github.com/{{GIT_ORG}}/apptonomia) |
| Calculia | Math and logical reasoning | [github.com/{{GIT_ORG}}/calculia](https://github.com/{{GIT_ORG}}/calculia) |
| Memofun | Flashcards built around meaningful learning | [github.com/{{GIT_ORG}}/memofun](https://github.com/{{GIT_ORG}}/memofun) |
| Okeymoney | Personal finance and everyday autonomy | [github.com/{{GIT_ORG}}/okeymoney](https://github.com/{{GIT_ORG}}/okeymoney) |
| Routime | Activities for routines and daily-life skills | [github.com/{{GIT_ORG}}/routime](https://github.com/{{GIT_ORG}}/routime) |
| Sinonimia | Easy-read dictionary | [github.com/{{GIT_ORG}}/sinonimia](https://github.com/{{GIT_ORG}}/sinonimia) |
| Teclatlon | Touch-typing with a physical keyboard | [github.com/{{GIT_ORG}}/teclatlon](https://github.com/{{GIT_ORG}}/teclatlon) |
| **{{DISPLAY_EN}}** *(this project)* | **<one-sentence description>** | [github.com/{{GIT_ORG}}/{{REPO}}](https://github.com/{{GIT_ORG}}/{{REPO}}) |

The metaproject's `apptonomia/CLOUDFLARE.md` is the canonical
deploy guide for the whole suite; each sibling has its own
project-specific doc that links back there.
