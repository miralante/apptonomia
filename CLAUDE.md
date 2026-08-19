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

`apptonomia/` is the **metaproject root**: the only sibling without a
shipped product of its own (it IS the suite's flagship PWA — a
multi-activity occupational-therapy app whose exact catalogue evolves
during development — but it also carries the cross-project plumbing
such as the graphify skill sync script and the meta-graph index).

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
  only.
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
