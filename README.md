# Apptonomia

> 🌐 **Other languages:** [Español](README.es.md)
>
> 🚀 **Try it live:** [apptonomia.uk](https://apptonomia.uk/)

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![No dependencies](https://img.shields.io/badge/dependencies-none-success.svg)](#-features)
[![Static site](https://img.shields.io/badge/build-none-informational.svg)](#-features)
[![No PWA](https://img.shields.io/badge/PWA-none-lightgrey.svg)](#-features)
[![i18n](https://img.shields.io/badge/i18n-es%20%7C%20en-yellow.svg)](#-project-documentation-bilingual)
[![CI](https://img.shields.io/badge/CI-node%20scripts%2Fsync--graphify--skill.js-blue.svg)](.github/workflows/validate.yml)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-2.1-4baaaa.svg)](CODE_OF_CONDUCT.md)

**Portal page for the Apptonomia suite** — a free, static, dependency-free
landing that links out to the seven apps of the suite, all designed to
help our typical user profile learn at their own pace, in the browser,
free of charge, without accounts and without personal data.

- 🌐 **App**: [apptonomia.uk](https://apptonomia.uk/)
- 📦 **Repository**: [github.com/miralante/apptonomia](https://github.com/miralante/apptonomia)
- 💻 **Run locally**: open `index.html` directly in a browser, or serve
  the folder with any static server (`npx serve .` /
  `python -m http.server 8080`).

---

## 🚀 Try it live

The landing is deployed at **[apptonomia.uk](https://apptonomia.uk/)** —
open it in a browser to see the full suite.

---

## ✨ Features

This repository hosts the **landing portal** of the Apptonomia suite:
a single static page that introduces the seven apps of the suite and links to
each one. It is intentionally tiny — a single `index.html`, an i18n
bootstrap (`bootstrap.js` + `script.js`), the two `strings.<locale>.js`
bundles, and a `_headers` file for HTTP security headers.

- 🌐 **Single static page** — no SPA framework, no build step.
- 🪶 **Zero runtime dependencies** — pure HTML/CSS/JS.
- 🌍 **Bilingual** — Spanish (default) and English, switched by
  
navigator.languages` or by a manual selector.
- 🔒 **Privacy by default** — no backend, no database, no telemetry,
  no third-party runtime.
- 📦 **SEO-ready** — full Open Graph, Twitter Card, JSON-LD
  `ItemList` of the seven products for search and AI retrieval.
- ☁️ **Cloudflare Workers** — deployed via the static-assets binding.

---

## 👥 Roles in the project

| Role | Who they are | How they participate | Where they look first |
|---|---|---|---|
| 👤 **End user** (typical user profile) | Visits the landing to pick an app of the suite | Opens the page in a browser; doesn't read or write code | The app — nothing else to read |
| ❤️ **Support / family** | Helps an end user navigate the suite | Picks the right app of the suite for a need; helps install it on the device | Each suite app's `README.md` |
| 💻 **Build / developer** | Maintains the landing and the cross-project plumbing | Edits `index.html`, `js/`, `_headers`, `wrangler.toml`; runs 
ode scripts/sync-graphify-skill.js` | [`CLAUDE.md`](CLAUDE.md) |

See [`doc/en/roles.md`](doc/en/roles.md) for the full role description
and the trio-vs-pair-vs-sole patterns across the apps of the suite.

---

## 📚 Project documentation (bilingual)

All project documentation lives in the `doc/` folder plus a few files
at the repository root:

| Language | Entry point |
|---|---|
| 🇬🇧 English (this file) | [`README.md`](README.md) |
| 🇪🇸 Español | [`README.es.md`](README.es.md) |

| Topic | Document |
|---|---|
| Product, audience, accessibility rules | [`doc/en/SPEC.md`](doc/en/SPEC.md) · [`doc/es/SPEC.md`](doc/es/SPEC.md) |
| Architecture and technical reference | [`doc/en/technical.md`](doc/en/technical.md) · [`doc/es/tecnico.md`](doc/es/tecnico.md) |
| Internationalization (add a language) | [`doc/en/I18N.md`](doc/en/I18N.md) · [`doc/es/I18N.md`](doc/es/I18N.md) |
| Deploy runbook (Cloudflare Workers) | [`CLOUDFLARE.md`](CLOUDFLARE.md) |
| AI agent operational workflow | [`CLAUDE.md`](CLAUDE.md) |

### 📄 Other repo documents

| Document | Audience |
|---|---|
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Anyone who wants to contribute (family, therapists, devs) |
| [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) | Contributor covenant (Contributor Covenant 2.1) |
| `CLAUDE.md` | AI agents: operational workflow, coordination and approvals |
| [`CLOUDFLARE.md`](CLOUDFLARE.md) | Canonical Cloudflare Workers deploy guide for the suite (Apptonomia + Calculia, Memofun, Okeymoney, Sinonimia, Teclatlon) |
| Project history | Lives in `git log`; no external roadmap is maintained |
| `doc/en/I18N.md` / `doc/es/I18N.md` | Details of the ES/EN multilanguage system |

---

## 🛠️ Preparing / Expanding content

The landing is intentionally tiny, so "preparing content" means adding
or updating the cards of the suite on the home page:

1. Edit `index.html` to add or update a card (one `<a class="card">`
   per app of the suite, with `data-i18n` attributes for the bilingual
   strings).
2. Add the matching keys in **both** `js/strings.es.js` and
   `js/strings.en.js` (`es` is the source of truth, `en` must keep
   parity).
3. Update the JSON-LD `ItemList` block in `index.html` if you're adding
   a new app of the suite (and add the entry to each suite repo's
   `README.md` "The Miralante suite" table — see the suite-wide
   convention below).

To add a new app to the suite:

1. Create a new suite repo following the same conventions
   (`index.html`, `app.js`, `strings.<locale>.js`, `sw.js` with a
   cache-first `VERSION`, `CLOUDFLARE.md`, `CLAUDE.md`, the
   `persona tipo` euphemism directive).
2. Add the app here, in `index.html`, and in every suite repo's
   `README.md` "The Miralante suite" table.
3. Add the app to the cross-project index in
   [`graphify-out-meta/graph.json`](graphify-out-meta/graph.json) by
   running `node scripts/sync-graphify-skill.js update --apply --target ../<project>`.

---

## ✅ Validating changes

```bash
node scripts/sync-graphify-skill.js              # check graphify skill sync (canonical: ~/.claude/skills/graphify/)
node scripts/sync-graphify-skill.js sync --apply # copy where SHA drifts
node scripts/sync-graphify-skill.js update --apply # rebuild stale per-project graphs and the meta-graph
```

No 
pm install` needed — the scripts only use Node's standard library.
There is no `scripts/check.js` for this repo (the landing itself is a
single static page with no build step); the other suite repos have
their own checks. As a lighter equivalent, `scripts/check-forbidden-terms.js`
runs in CI and scans the public landing (`index.html`, `js/*.js`,
`about/privacidad.html`) for the suite-wide blocklist (disability /
occupational therapy / minors) — see the `forbidden-terms` job in
[`.github/workflows/validate.yml`](.github/workflows/validate.yml).

---

## ☁️ Deploying

Apptonomia is a fully static site (HTML/CSS/JS, no build step), so it
ships directly to **[Cloudflare Workers (static assets)](https://developers.cloudflare.com/workers/static-assets/)**
through its built-in GitHub integration. The HTTP security headers
live in [`_headers`](_headers), and the project metadata in
[`wrangler.toml`](wrangler.toml). See [`CLOUDFLARE.md`](CLOUDFLARE.md)
for the full runbook (rebuild, rollback, custom domain, credential
rotation).

Pull requests automatically get a preview URL on
`apptonomia-<branch>.<account-subdomain>.workers.dev` — no extra
workflow is needed.

---

## 🛡️ Security

Apptonomia is a fully client-side static site: no backend, no
database, no telemetry, no third-party runtime. The threat model is
essentially "what a hostile offline page could do to the same origin",
which the browser already sandboxes. See [`SECURITY.md`](SECURITY.md)
(or [`SECURITY.es.md`](SECURITY.es.md)) for how to report a suspected
issue privately.

---

## 📄 License

MIT — see [`LICENSE`](LICENSE).

---

## Contributing

Issues and pull requests are welcome. See [`CONTRIBUTING.md`](CONTRIBUTING.md)
for the workflow (and [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) for the
Spanish version). All participants are expected to follow
[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

---

## 🧹 Housekeeping

There is no `node_modules`, no build artifacts, and no cache directory
in this repo. The `graphify-out-meta/` directory is regenerated by
`node scripts/sync-graphify-skill.js update --apply`; to force a clean
rebuild of the meta-graph from scratch:

```bash
rm -rf graphify-out-meta/   # the next update --apply rebuilds it
```

The `.claude/skills/graphify/SKILL.md` copy in this repo is overwritten
by `sync --apply` from the canonical source at
`~/.claude/skills/graphify/` — never edit the per-project copy
directly.

---

## 🌐 The Miralante suite — projects in the suite

This repository is the **landing portal** for the Apptonomia suite.
The actual apps live in their own repositories:

| Project | What it is | Repository |
|---|---|---|
| **Apptonomia** *(this repo — portal)* | Landing page that introduces the suite | [github.com/miralante/apptonomia](https://github.com/miralante/apptonomia) |
| [Routime](https://routime.apptonomia.uk/) | Activities for routines and daily-life skills (designed for our typical user profile) | [github.com/miralante/routime](https://github.com/miralante/routime) |
| [Calculia](https://calculia.apptonomia.uk/) | Math and logical reasoning | [github.com/miralante/calculia](https://github.com/miralante/calculia) |
| [Memofun](https://memofun.apptonomia.uk/) | Flashcards built around meaningful learning | [github.com/miralante/memofun](https://github.com/miralante/memofun) |
| [Okeymoney](https://okeymoney.apptonomia.uk/) | Personal finance and everyday autonomy | [github.com/miralante/okeymoney](https://github.com/miralante/okeymoney) |
| [Sinonimia](https://sinonimia.apptonomia.uk/) | Easy-read dictionary | [github.com/miralante/sinonimia](https://github.com/miralante/sinonimia) |
| [Teclatlon](https://teclatlon.apptonomia.uk/) | Touch-typing with a physical keyboard | [github.com/miralante/teclatlon](https://github.com/miralante/teclatlon) |
| [Ludia](https://ludia.apptonomia.uk/) | Chess lessons, exercises and supported play | [github.com/miralante/ludia](https://github.com/miralante/ludia) |

This repo's [`CLOUDFLARE.md`](CLOUDFLARE.md) is the canonical deploy
guide for the whole suite; each suite repo has its own
project-specific doc that links back here.


