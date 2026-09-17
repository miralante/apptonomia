# CLAUDE.md  AI agent workflow

## About this project

{{DISPLAY_EN}} is a **free static web app** that **<one-sentence
description>**. It is one of the seven siblings of the Apptonomia
suite and inherits its accessibility-first, no-pressure, easy-read
design language.

## Other projects in the Apptonomia suite

This project is one of seven siblings. The rest of the suite (paths
relative to this folder, all under `Miralante/`):

- **Apptonomia**  the metaproject root and the public landing at https://apptonomia.uk/, linking out to each sibling app. Folder: [`../apptonomia/`](../apptonomia/) � CLAUDE.md: [`../apptonomia/CLAUDE.md`](../apptonomia/CLAUDE.md)
- **Calculia**  math and logical reasoning with short, visual activities. Folder: [`../calculia/`](../calculia/) � CLAUDE.md: [`../calculia/CLAUDE.md`](../calculia/CLAUDE.md)
- **Memofun**  study flashcards for autonomous review, one idea per card. Folder: [`../memofun/`](../memofun/) � CLAUDE.md: [`../memofun/CLAUDE.md`](../memofun/CLAUDE.md)
- **Okeymoney**  personal finance and everyday financial autonomy, with a personal-finance simulator. Folder: [`../okeymoney/`](../okeymoney/) � CLAUDE.md: [`../okeymoney/CLAUDE.md`](../okeymoney/CLAUDE.md)
- **Sinonimia**  easy-read dictionary of difficult words, with synonyms and ARASAAC pictograms. Folder: [`../sinonimia/`](../sinonimia/) � CLAUDE.md: [`../sinonimia/CLAUDE.md`](../sinonimia/CLAUDE.md)
- **Teclatlon**  touch typing on the physical computer keyboard, finger by finger. Folder: [`../teclatlon/`](../teclatlon/) � CLAUDE.md: [`../teclatlon/CLAUDE.md`](../teclatlon/CLAUDE.md)
- **Routime**  everyday activities to train mind and daily-life skills between sessions. Folder: [`../routime/`](../routime/) � CLAUDE.md: [`../routime/CLAUDE.md`](../routime/CLAUDE.md)
- **{{DISPLAY_EN}}** *(this project)*  **<one-sentence description of this sibling>**.

This file is the operational handbook for AI agents working in this
repository. It is intentionally short and stable; anything that grows
beyond a short rule belongs in the canonical sources listed in �A.1.

The document is split in two blocks:

- **Block A  Workflow** (�A.1 & �A.4): rules that govern *how* an
  agent edits this repo (canonical sources, mandatory workflow,
  external/destructive operations, scope of the file).
- **Block B  Suite-wide policies** (�B.1 & �B.5): inherited rules
  from the Miralante metaproject that also apply here (service worker
  cache, language policy, accessibility pointer to `spec.md`,
  graphify, GEO/AEO/LLMO).

If two sections disagree, the more specific one wins: per-project
rules in Block A override the suite-wide rules in Block B for the
project at hand, and a rule about a specific topic wins over a
general one on the same block.

---

## Block A  Workflow

### A.1 Canonical sources

The canonical source for each topic prevails on that topic. If two
documents conflict, do not turn `CLAUDE.md` into a copy of both:
cross-check the code and fix the outdated doc in its canonical
location.

| Topic | Canonical source |
|---|---|
| Product, audience, accessibility rules, non-negotiable principles | [`doc/en/spec.md`](doc/en/spec.md) � [`doc/es/spec.md`](doc/es/spec.md) |
| Project roles (user, support, build) and who reads what first | [`doc/en/roles.md`](doc/en/roles.md) � [`doc/es/roles.md`](doc/es/roles.md) |
| Architecture, structure, activity anatomy, APIs, contracts, tests, deploy | [`doc/en/technical.md`](doc/en/technical.md) � [`doc/es/tecnico.md`](doc/es/tecnico.md) |
| Internationalization | [`doc/en/i18n.md`](doc/en/i18n.md) � [`doc/es/i18n.md`](doc/es/i18n.md) |
| Activity catalog | [`doc/en/activities.md`](doc/en/activities.md) � [`doc/es/actividades.md`](doc/es/actividades.md) |
| Coverage and therapeutic guidance | [`doc/en/team.md`](doc/en/team.md) � [`doc/es/equipo.md`](doc/es/equipo.md) |
| Roadmap and closed product decisions | Git only: every PR leaves a message; reconstruct with `git log`. |
| Human contribution flow | [`CONTRIBUTING.md`](CONTRIBUTING.md) � [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) |
| AI agent operational flow | `CLAUDE.md` (this file) |
| Cloudflare deploy / cache contract (network-first vs cache-first SW) | [`CLOUDFLARE.md`](CLOUDFLARE.md) |
| Contents / TOC | [`doc/en/contents.md`](doc/en/contents.md) � [`doc/es/contenidos.md`](doc/es/contenidos.md) |
| Doc index | [`doc/en/index.md`](doc/en/index.md) � [`doc/es/indice.md`](doc/es/indice.md) |
| Quick guide | [`doc/en/quick-guide.md`](doc/en/quick-guide.md) � [`doc/es/guia-rapida.md`](doc/es/guia-rapida.md) |

> Note: the template lists only the docs that exist as files at
> `doc/<lang>/` in the sibling repo. Memofun adds three deck-creation
> guides (`ai-creating-decks-guide.md`, `internal-creating-decks-guide.md`,
> `chat-ai-creating-decks-guide.md` and their Spanish mirrors)  those
> are project-specific, not part of the cross-project pattern.

#### What this is

<one-paragraph description of the product, sibling-of paragraph,
audience, and one or two non-obvious design constraints. Tailor
this to the new sibling; mirror the wording other siblings use so
the suite's `doc/<lang>/index.md` pages stay consistent.>

Calculia/Memofun/Okeymoney/Sinonimia/Teclatlon/Routime is a sibling
of Apptonomia (a broader occupational-therapy activity suite) and
the rest of the Miralante suite. Read [`doc/en/spec.md`](doc/en/spec.md)
(or [`doc/es/spec.md`](doc/es/spec.md)) before touching the product;
it is the source of truth, not this file.

#### Commands

There is no build step, no package.json, and no test framework  it's
plain HTML/CSS/JS served as static files.

- **Preview**: open `index.html` directly in a browser, or serve the
  folder with any static server (e.g. `npx serve .`). Everything runs
  client-side.
- **Validate everything** (this repo's only "test" step, and what CI
  runs on every PR via `.github/workflows/validate.yml`):
  ```
  node scripts/check.js
  ```
  It checks JS syntax, es/en key parity, `sw.js` � disk parity, and
  the catalog-parity lock. Read the script before changing the file
  layout  it encodes the invariants that layout relies on.

#### Architecture

**See [`doc/en/technical.md`](doc/en/technical.md) for the full
technical reference**  file-by-file breakdown, the data schema, and
the reusable shared-core API. It also documents the project's
language policy and the PWA/service-worker contract.

Quick orientation: keep this paragraph to one short screen (58
lines). Copy the gist from the closest existing sibling's
`CLAUDE.md` �"Architecture" and replace the names with the new
sibling's. Sibling-specific notes (what was trimmed, what data
shape it uses, what shared-core APIs it depends on) belong here.

### A.2 Mandatory workflow

This repo may receive changes from the user and from several parallel
sessions. Read the affected source files before editing; never
overwrite in-flight work  re-read the file and reconcile if it
changed since your last read. Update the canonical source for the
topic, not a copy in `CLAUDE.md`. Keep `i18n` parity per the I18N
docs.

#### A.2.1 Session start

Run before any modification:

```bash
git status --short
git log --oneline -3
node scripts/check.js
```

Keep uncommitted changes that are not yours (A.3 covers destructive
ops). If `check.js` already fails, find out whether the failure
belongs to the in-flight work before adding new changes.

#### A.2.2 Before editing

1. Classify the task with the canonical-sources table in �A.1.
2. Read the relevant sections and the affected code files.
3. For UI, content, or activities, always check `SPEC.md` �3�4 and
   `technical.md` �5.
4. Closed project plan lives in `git log`. The canonical doc to use
   depends on the topic, not on an external roadmap.

#### A.2.3 Before finishing

1. Always run `node scripts/check.js`.
2. If this project ships a service worker (see �B.1): bump `VERSION`
   in `sw.js` whenever a cached file changes, and add any new file to
   `FILES`. Run `node scripts/check-version-bump.js` to verify the
   bump is consistent.
3. Report only verifications you actually ran; flag remaining manual
   tests (e.g. a real browser walk through a wizard, or a WebKit
   check).

### A.3 External and destructive operations

- A deploy (even to a temporary Cloudflare Pages preview) is a
  network operation: request explicit approval before running it.
  Commands are in `technical.md` �12.5.
- Never publish, push, or open/close external resources without an
  explicit request or authorization.
- Never delete or revert changes from the user or another session to
  simplify your task; integrate them or explain the conflict.

### A.4 Out of scope for this file

Do not add here: product principles, accessibility rules, project
structure, activity anatomy, APIs/recipes, taxonomy, roadmap or
changelogs. Those belong to the �A.1 sources. Detailed change
history lives in Git; `CLAUDE.md` must stay brief, operational,
and stable.

---

## Block B  Suite-wide policies

> These rules apply to every app of the Miralante suite. The full
> canonical version lives in the metaproject's
> [`apptonomia/CLAUDE.md`](../apptonomia/CLAUDE.md) and
> [`apptonomia/doc/en/guia-de-cumplimiento.md`](../apptonomia/doc/en/guia-de-cumplimiento.md).
> Mirror only the bullets that are non-obvious or that a new
> contributor would otherwise miss.

### B.1 Service worker cache

This project ships a service worker. **Behavior**: `sw.js` is
**cache-first** *(or "network-first, cache-fallback"  pick one and
document it here)*  every file in `FILES` is served from the
cache; the network is only consulted when the request is not in the
cache.

**The cache is silent and persistent**. The developer sees a
change on a hard refresh, but users with the PWA installed keep
seeing the old version until either the SW itself is refreshed or
the cache is purged. The only reliable way to refresh the
deployed app after a new deploy is to bump `VERSION` in `sw.js`,
because the SW's `install` handler compares its `VERSION` against
the active cache name and only re-fetches + activates when they
differ.

**Rule  bump `VERSION` on every commit that touches any cached
file** (i.e. anything in `FILES` / `ARCHIVOS`, or a new file that
should be cached):

- Edit `sw.js` and increment the `VERSION` literal (e.g.
  `{{SLUG}}-vN` � `{{SLUG}}-vN+1`).
- Add any new file to `FILES` / `ARCHIVOS` at the same time.
- Run `node scripts/check-version-bump.js` to verify the bump is
  consistent with the changes.

Bump liberally rather than conservatively. The cost of bumping is
one integer; the cost of not bumping is "the deployed app keeps
serving the old version after a deploy". Full contract:
[`CLOUDFLARE.md`](CLOUDFLARE.md) � "Cache contract".

### B.2 Language policy

- **UI**: multilingual. Default locales are **Spanish (`es`)** and
  **English (`en`)**; `es` is the default and fallback when a key is
  missing or the detected locale is unsupported.
- **Technical code**: **always English**  variables, functions,
  identifiers, comments, and commit messages. UI text lives in
  `strings.<locale>.js`, but dictionary **keys** are code and must be
  English.
- **Product changes apply to all locales by default**: any change to
  product content (UI strings, labels, copy, dates, activities,
  catalog entries, documentation aimed at end users or support staff,
  etc.) **must be applied to every supported locale**  at minimum
  `es` and `en`. Spanish (`es`) is the source of truth when not
  dictated otherwise; English (`en`) must keep parity. If a new locale
  is added, the same change applies there too. Never ship a product
  change that exists only in one language.
- Full policy (App.i18n core, number/time formatting, landing
  selector, recipe to add a locale):
  [`doc/en/i18n.md`](doc/en/i18n.md) �
  [`doc/es/i18n.md`](doc/es/i18n.md) and
  [`doc/en/technical.md`](doc/en/technical.md) �6.

### B.3 Accessibility & public-facing wording (pointer)

The canonical source for UNE 153101 / easy-read, WCAG AA + AAA
baseline, and the public-facing "persona tipo" euphemism is
[`doc/en/spec.md`](doc/en/spec.md) �3.3 / �3.4 / �3.6 / �5 (mirror
[`doc/es/spec.md`](doc/es/spec.md)). Per `�A.1`, those are the
authoritative documents for product, audience and accessibility
rules  `CLAUDE.md` does not duplicate them here. The cross-project
compliance checklist lives in
[`../apptonomia/doc/en/guia-de-cumplimiento.md`](../apptonomia/doc/en/guia-de-cumplimiento.md) �
[`../apptonomia/doc/es/guia-de-cumplimiento.md`](../apptonomia/doc/es/guia-de-cumplimiento.md).

### B.4 graphify

This project has a knowledge graph at `graphify-out/` with god nodes,
community structure, and cross-file relationships.

- For codebase questions, first run `graphify query "<question>"`
  when `graphify-out/graph.json` exists. Use `graphify path "<A>"
  "<B>"` for relationships and `graphify explain "<concept>"` for
  focused concepts. These return a scoped subgraph, usually much
  smaller than `GRAPH_REPORT.md` or raw grep output.
- If `graphify-out/wiki/index.md` exists, use it for broad
  navigation instead of raw source browsing.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture
  review or when `query`/`path`/`explain` do not surface enough
  context.
- After modifying code, run `graphify update .` to keep the graph
  current (AST-only, no API cost).

### B.5 GEO, AEO and LLMO (suite-wide reference)

This project follows the suite-wide GEO/AEO/LLMO layers defined in
[`../apptonomia/doc/en/guia-de-cumplimiento.md` �7](../apptonomia/doc/en/guia-de-cumplimiento.md#7-geo-aeo-and-llmo-search--answer-engine--and-llm-visibility)
� [`../apptonomia/doc/es/guia-de-cumplimiento.md` �7](../apptonomia/doc/es/guia-de-cumplimiento.md#7-geo-aeo-y-llmo-presencia-en-buscadores-answer-engines-y-llms)
and summarised in [`../apptonomia/CLAUDE.md` �B.6](../apptonomia/CLAUDE.md#b6-geo-aeo-and-llmo-search--answer-engine--and-llm-visibility):

- **GEO**  six `<meta name="DC.*">` rendered by `scripts/build-head.js`
  from `app.config.json > dc*` (geography-agnostic, Dublin Core).
- **AEO**  `FAQPage` JSON-LD injected into the existing `@graph` by
  `scripts/build-head.js`, with 35 `{question, answer}` pairs sourced
  from `app.config.json > faq[]`. No visible FAQ block on the landing.
- **LLMO**  `/llms.txt` at the project root, linked from `<head>`
  via `<link rel="alternate" type="text/markdown">`, generated by
  `scripts/build-llms-txt.js` from `app.config.json > llms*`. Plus a
  known-AI-crawler allowlist (GPTBot, ClaudeBot, CCBot, Google-Extended,
  Applebot-Extended, PerplexityBot, anthropic-ai, cohere-ai, Claude-Web)
  in `robots.txt`.

`scripts/check.js` enforces the four gates (Dublin Core count,
`FAQPage` node, `llms.txt` existence, AI-crawler UA list). The
canonical source for the policy is the metaproject's guide �7.
