# CLAUDE.md — Miralante metaproject

This file provides guidance to Claude Code (claude.ai/code) when working at
the level of the **Miralante metaproject** — that is, when operating across
the seven sibling projects under `Miralante/`, not inside one specific
product. For per-project guidance, read each project's own `CLAUDE.md`.

## What this is

`Miralante/` is the parent directory of a static-PWA accessibility suite for
occupational therapy and learning support. Each child project ships
independently to its own Cloudflare Pages domain, but they share the same
author, the same design principles (deterministic, dependency-free,
multilingual, easy-read), the same service-worker/cache contract, and the
same graphify skill.

`apptonomia/` is the **metaproject root** **and** the **public
landing** of the suite served at `https://apptonomia.uk/`. The landing
itself is the product here: a single `index.html` that links out to
each sibling's own domain (Calculia, Routime, Okeymoney, Sinonimia,
Memofun, Teclatlon) with SEO metadata, Open Graph and a JSON-LD
`ItemList`. Beyond that landing page, this repo carries the
cross-project plumbing — the graphify skill sync script, the
`graphify-out-meta/` index, and this `CLAUDE.md` — and ships no
standalone PWA of its own.

## Sibling projects

Every project listed below has its own `CLAUDE.md`, its own `sw.js` (except
`sinonimia`), its own domain, and its own graph under `graphify-out/`.

| Project | What it ships | Shape | Language policy | Source of truth |
|---|---|---|---|---|
| `apptonomia/` | Occupational-therapy activity suite (flagship) | multi-activity catalogue | es/en | [doc/en/SPEC.md](doc/en/SPEC.md) |
| `calculia/` | Math & logical-reasoning practice | multi-activity catalogue | es/en | [doc/en/SPEC.md](../calculia/doc/en/SPEC.md) |
| `memofun/` | Card-based study/recall trainer | deck-driven (no fixed activity count) | UI es/en, decks language-agnostic | [doc/en/SPEC.md](../memofun/doc/en/SPEC.md) |
| `okeymoney/` | Personal-finance & everyday-autonomy trainer | single shared-state app | es/en | [doc/en/SPEC.md](../okeymoney/doc/en/SPEC.md) |
| `sinonimia/` | Plain-language dictionary (no PWA, no sw.js) | single-page app | es/en | [doc/en/SPEC.md](../sinonimia/doc/en/SPEC.md) |
| `teclatlon/` | Touch-typing trainer (physical keyboard only) | single-activity app | es/en | [doc/en/SPEC.md](../teclatlon/doc/en/SPEC.md) |
| `routime/` | Life-skills & routines activity suite | multi-activity catalogue | es/en | [doc/en/SPEC.md](../routime/doc/en/SPEC.md) |

> When the user says "the project", "este proyecto", "el repo" without naming
> one, ask which one before editing. Each sibling has its own version
> bumping, its own cache contract, and its own deploy channel — touching
> one is never automatic for the others.

## Commands

There is no build step at the metaproject level — every project ships
plain HTML/CSS/JS.

- **Sync the graphify skill across the suite** (canonical source is the
  user-level install at `~/.claude/skills/graphify/`; per-project copies
  live at `<project>/.claude/skills/graphify/`):
  ```
  cd apptonomia
  node scripts/sync-graphify-skill.js              # sync --check (default)
  node scripts/sync-graphify-skill.js sync --apply # copy where drifted
  ```
  The script never overwrites a project's `.graphifyignore` or its
  `.graphify_*` runtime state files; it copies `SKILL.md` + `references/`
  only.

- **Refresh stale per-project graphs and rebuild the meta-graph** from
  here:
  ```
  cd apptonomia
  node scripts/sync-graphify-skill.js update --check   # report only
  node scripts/sync-graphify-skill.js update --apply   # run updates + meta
  node scripts/sync-graphify-skill.js update --apply --all   # include apptonomia
  node scripts/sync-graphify-skill.js update --apply --target ../<project>   # one only
  ```
  Stale detection: for each sibling, the script compares `git rev-parse HEAD`
  against the `Built from commit:` field of the project's `GRAPH_REPORT.md`;
  if they don't match (or the field is missing), it runs `graphify update .`
  in that project. After a successful update it rebuilds
  `graphify-out-meta/graph.json` + `graph.html`. By default `apptonomia/` is
  skipped (it has no per-project graph yet); pass `--all` to include it.
  Failures in one project do not abort the rest.
- **Inspect the meta-graph index** at [graphify-out-meta/](graphify-out-meta/).
  This is the cross-project index (one node per project + similarity
  edges); the deep graphs live inside each project's own `graphify-out/`.
- **Per-project validation** (each project has its own `node scripts/check.js`):
  ```
  cd ../calculia && node scripts/check.js
  cd ../memofun   && node scripts/check.js
  cd ../okeymoney && node scripts/check.js
  cd ../sinonimia && node scripts/validar.js
  cd ../teclatlon && node scripts/check.js
  cd ../routime   && node scripts/check.js
  ```

## graphify

Every project in the suite has a `graphify-out/` produced by the
`graphify` skill installed at `<project>/.claude/skills/graphify/`. A
canonical version of the skill is also installed at the user level
(`~/.claude/skills/graphify/`) and tracked in this repo via
`scripts/sync-graphify-skill.js`.

### Meta-graph (cross-project index)

The file [graphify-out-meta/graph.json](graphify-out-meta/graph.json) holds
a thin index — one node per sibling project plus two kinds of edges:

- **Similarity edges (undirected)**: pairs of siblings that share ≥2
  normalised community names across their per-project graphs. Weight =
  number of shared hubs.
- **Hierarchy edges (directed, `parent_of`)**: `apptonomia → <sibling>`,
  reflecting that the metaproject root carries the cross-project plumbing
  (sync script, this CLAUDE.md, the meta-graph itself).

`meta.edge_kinds` reports the count of each kind. Open
[graphify-out-meta/graph.html](graphify-out-meta/graph.html) for the
visual.

### Per-project deep graphs

For any codebase question about a single project, prefer the per-project
graph before reading source files:

```
cd <project>
graphify query "<question>"
graphify path "<A>" "<B>"
graphify explain "<concept>"
```

The skill's "Fast path — existing graph" rule applies: if
`<project>/graphify-out/graph.json` exists, the skill jumps straight to
`graphify query` and skips re-extraction.

## Agent workflow — metaproject rules

1. **Read the affected project's own `CLAUDE.md`** before editing it. Each
   sibling has its own canonical-doc table, its own service-worker
   contract, and its own agent rules. The metaproject `CLAUDE.md` (this
   file) is a navigation aid, not a substitute.
2. **Edits to a sibling are scoped to that sibling.** Editing `calculia/`
   never auto-edits `memofun/` even if they share the same pattern.
3. **Cross-project changes** (e.g. a new graphify skill version, a new
   sibling) require explicit user approval and a per-project check.
4. **Cache contract**: each PWA-shipping project has a `sw.js` whose
   `VERSION` must be bumped on any change to a cached file. Read the
   project's own `CLAUDE.md` §"Service worker cache" before editing.
5. **Deploys are network operations**: a Cloudflare deploy (even to a
   preview channel) is never automatic. Ask before running.
6. **Do not introduce cross-project dependencies.** Each sibling stays
   dependency-free and shippable on its own. If two siblings want to
   share code, prefer a recipe over a `git submodule` / workspace.
7. **The graphify skill sync script is the only cross-project mutation
   tool sanctioned here.** It is intentionally minimal (Node, no deps,
   sha256-compares `SKILL.md`) so a future maintainer can read it in
   five minutes.

## Out of scope for this file

Per-project product principles, accessibility rules, activity catalogues,
service-worker cache contracts, version-bump policy, and roadmaps live in
each project's own `CLAUDE.md` and `doc/<lang>/*.md` files. This file
only documents the **metaproject plumbing**.

## Landing typography

The landing uses the same two self-hosted typefaces as the rest of the
suite — **Atkinson Hyperlegible** (weights 400 and 700) and **Nunito**
(variable, 400–900) — bundled as `.woff2` files under `assets/fonts/`
and exposed through the `--font` custom property in `css/styles.css`.
No CDN, no `@import` from `fonts.googleapis.com`. Apptonomia does not
ship a `sw.js`, so there is no `VERSION` to bump when these files
change; the immutable Cloudflare cache (`_headers`) is what controls
freshness for the landing assets.

## UNE 153101 reference (suite-wide)

All seven sibling projects follow **UNE 153101:2018 EX** (Spanish
easy-read standard) and Inclusion Europe's European easy-read
guidelines as the normative basis for the cognitive accessibility
principles that guide content and UI: short sentences, one idea per
sentence, everyday vocabulary, no clinical or technical jargon in
what the end user reads. This is the standard each `SPEC.md` cites
when it states the "easy read always" rule (see `doc/en/SPEC.md` §3.3
or its mirror in `doc/es/SPEC.md` §3.3). Adding a new language or a
new piece of UI copy means following UNE 153101 — not paraphrasing
it.

## WCAG AAA baseline (suite-wide)

The seven Miralante siblings conform to WCAG 2.1 at **AA minimum** and
adopt the **AAA criteria that apply to the suite's audience** whenever
feasible. Full conformance at AAA is not feasible for a whole web
application (the W3C itself states AAA is meant for specific contexts);
the rule below lists the AAA criteria that ARE applicable and that this
suite honours.

Adopted AAA criteria:

- **1.4.6 Contrast (Enhanced)** — text contrast ≥ 7:1 (large text
  ≥ 4.5:1). WCAG AA (4.5:1) is the legal floor; AAA is the design
  target. The current verified pairs in Okeymoney (`#F2F4F8` on
  `#161A21` = 14.6:1, `#B7BDC9` on `#161A21` = 8.4:1) already meet
  AAA; the other siblings aim at the same ratio when their token
  palette is next touched.
- **3.1.5 Reading Level** — when content is for the general public it
  does not require advanced reading ability. The suite already complies
  through UNE 153101 (see the section above) and Inclusion Europe's
  easy-read guidelines: short sentences, one idea per sentence,
  everyday vocabulary.
- **1.4.1 Use of Color** — color is never the only means of conveying
  information. Every feedback state (success / hint / error / lock)
  also uses shape, icon, text or sound, so users with color-vision
  deficiencies are not excluded. (`App.feedback.success()` /
  `App.feedback.encourage()` / `App.feedback.lockUntilAck()` already
  encode this.)

Per-project wording in `doc/<lang>/SPEC.md` §3.5 / §5 / §6 references
this baseline using the literal phrase **"WCAG AA minimum, AAA whenever
possible"** (already present in Okeymoney and Routime; mirrored in the
other siblings' `SPEC.md` so the rule survives a single project's docs
going out of sync).

## Public-facing wording: "usuario/a tipo" euphemism (suite-wide)

This directive applies across all seven sibling projects (Apptonomia,
Calculia, Memofun, Okeymoney, Sinonimia, Teclatlon, Routime) and to
the metaproject landing at `apptonomia.uk`. The suite ships products
whose real objective is occupational-therapy support for people with
intellectual disability, but **that framing is not used in public
surfaces** — only in internal documentation.

### Where each term is allowed

- **"Discapacidad intelectual" / "intellectual disability"** is the
  canonical term and **may only appear in internal documentation**
  (`CLAUDE.md`, `doc/<lang>/SPEC.md`, `technical.md` / `tecnico.md`,
  `roles.md`, `CONTRIBUTING.md`, `CONTRIBUTING.es.md`, the `_test_*.js`
  and other tooling files in `scripts/`). It is explicitly **forbidden**
  in public-facing surfaces, the metaproject landing, READMEs that
  anyone can read without authentication, public talks, social media
  copy, press notes, and marketing material.
- **"Usuario/a tipo"** (plural "usuarios/as tipo") is the accepted
  euphemism for the audience in public-facing surfaces. It is used as
  a generic profile marker, not as a label for any real person.
  - It applies to `README.md` / `README.es.md`, the public landing
    (`apptonomia.uk/`), public talks, social media copy, press notes,
    marketing material, and any contributor-facing document that also
    doubles as a public description of the project (e.g.
    `CONTRIBUTING.md`).
  - It does **not** apply to the UI of the apps themselves: each
    project's own "Mandatory rule: zero mentions in the user-facing
    product" (see every sibling's `SPEC.md` §4) continues to forbid
    **any** mention, including "usuario/a tipo", in `index.html`,
    `app.js`, `strings.<locale>.js`, `js/i18n.js`, `about/privacidad.html`
    and any other user-facing surface. The euphemism is for the outside
    world, not for what the visitor reads on the site.
  - It does **not** apply to project content that names a clinical
    concept by its real-world name (e.g. a dictionary entry about a
    disability certificate in `sinonimia/js/data.es.js`, or a Routime
    activity case study about a real bureaucratic procedure): that is
    content, not labelling of an audience.

### Rationale

Presenting the project's real objective in maintainer docs is useful
and necessary for whoever maintains and contributes to the suite.
Presenting it in marketing or landing surfaces is neither necessary nor
respectful of the audience — "usuario/a tipo" lets public material
describe what the apps are for (who the typical profile is) without
publicly naming a clinical group. This is a meta-project rule, mirrored
verbatim in each sibling's own `CLAUDE.md` and `SPEC.md` so the rule
survives a single project's docs going out of sync.
