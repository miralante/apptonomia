## Scope — read this first

This file is for **GitHub Copilot Chat** working inside the
`Miralante/apptonomia` workspace. That workspace plays **two roles
at once**:

1. **Metaproject root** of the Miralante suite (apptonomia + calculia
   + memofun + okeymoney + sinonimia + teclatlon + routime) — it
   carries the cross-project plumbing (`scripts/sync-graphify-skill.js`,
   the `graphify-out-meta/` index, the meta-`CLAUDE.md`).
2. **Public landing** of the suite at `https://apptonomia.uk/` — the
   `index.html` here is the portal page users see first, with one
   card per sibling (Calculia, Routime, Okeymoney, Sinonimia, Memofun,
   Teclatlon) linking out to their own domains. SEO metadata, Open
   Graph, JSON-LD `ItemList`, and the multilingual landing copy
   (`js/strings.es.js`, `js/strings.en.js`) all live here.

The **authoritative agent workflow for this workspace is
[`CLAUDE.md`](../CLAUDE.md)** (root of `apptonomia/`). Read it before
touching anything; this file only adds the GitHub-Copilot-Chat-specific
entry points and a short reminder of the metaproject rules. Per-leaf
rules (cache contract, i18n parity, `scripts/check.js`, activity
catalogues, accessibility, deploy) live in each sibling's own
`CLAUDE.md` and `doc/<lang>/*.md` — **never duplicate them here**.

If the user names a sibling project ("calculia", "memofun", …) or the
task is product-level inside a sibling (a UI string there, a `sw.js`
bump, an activity edit), switch to that sibling's own `CLAUDE.md`
and treat edits as scoped to that sibling — never auto-edit other
siblings. Edits to **this** repo's landing (`index.html`,
`js/strings.*.js`, SEO meta, the JSON-LD suite list) are in scope
here, but they still must not bleed into the siblings: the landing
links out to each sibling's domain, it doesn't ship their code.

## graphify

For any question about this metaproject's structure, components, or
how files relate across the suite, prefer the graph before raw
source browsing:

- **Cross-project questions** ("how do apptonomia and calculia
  relate?", "which siblings share hub X?", "what does the
  meta-graph say about Y?"): open
  [graphify-out-meta/graph.json](../graphify-out-meta/graph.json)
  or the visual at
  [graphify-out-meta/graph.html](../graphify-out-meta/graph.html).
  This is the thin cross-project index — one node per sibling plus
  similarity / `parent_of` edges. `meta.edge_kinds` reports the
  count of each edge kind.
- **Per-project questions** ("how do I add an activity in
  calculia?", "where is the cache list in teclatlon?"): use the
  graphify script's `ask` subcommand from this directory — it
  stays in apptonomia and queries the sibling's own graph
  without `cd`-ing:
  ```
  node scripts/sync-graphify-skill.js ask <slug> "<question>"
  ```
  The graphify skill is installed per-project at
  `<project>/.claude/skills/graphify/SKILL.md` and
  canonical-source-synced from `~/.claude/skills/graphify/` via
  `node scripts/sync-graphify-skill.js` (in this metaproject
  root).
- **In this workspace specifically** (`apptonomia/`), there is no
  per-project `graphify-out/graph.json` yet — by default
  `node scripts/sync-graphify-skill.js update --apply` skips this
  directory. Pass `--all` to include it once a per-project graph
  has been built. Until then, route questions either to the
  meta-graph or to the relevant sibling's own graph.

The "Fast path — existing graph" rule in the skill applies: if
`<project>/graphify-out/graph.json` exists, the skill jumps
straight to `graphify query` and skips re-extraction. Read source
files only when (a) modifying/debugging specific code, (b) the
graph lacks the needed detail, or (c) the graph is missing or
stale.

Type `/graphify` in Copilot Chat to build or update the graph.

## Metaproject commands

Run from `apptonomia/` (this workspace root):

```
# Sync the graphify skill (canonical: ~/.claude/skills/graphify/) into every sibling.
node scripts/sync-graphify-skill.js                  # sync --check (default)
node scripts/sync-graphify-skill.js sync --apply     # copy where SHA drifts

# Refresh stale per-project graphs and rebuild the meta-graph.
node scripts/sync-graphify-skill.js update --check   # report only
node scripts/sync-graphify-skill.js update --apply   # run updates + rebuild meta
node scripts/sync-graphify-skill.js update --apply --all          # include apptonomia
node scripts/sync-graphify-skill.js update --apply --target ../<project>   # one only

# Query a sibling's deep graph from this directory, no `cd` needed.
node scripts/sync-graphify-skill.js ask <slug> "<question>"
node scripts/sync-graphify-skill.js ask <slug> "<concept>" --type explain
node scripts/sync-graphify-skill.js ask <slug> "<question>" --budget 800 --raw
node scripts/sync-graphify-skill.js ask --refresh-if-stale <slug> "<question>"   # rebuild the sibling's graph first when stale
node scripts/sync-graphify-skill.js ask --refresh <slug> "<question>"             # force a rebuild even when fresh
node scripts/sync-graphify-skill.js ask --refresh-force <slug> "<question>"       # rebuild + pass --force to graphify (overrides "smaller graph" guard)
```

When you ask about a sibling whose code has changed since its last graph
build, pass `--refresh-if-stale` so the answer reflects the latest code
(no manual `update --apply` needed). Without the flag, `ask` will print
a one-line warning if the graph is stale but still answer against the
current graph on disk. The flag only refreshes the sibling's graph; the
meta-graph at `graphify-out-meta/` is rebuilt only by `update --apply`.

If `graphify update .` refuses to overwrite a smaller graph with an
older one (warning `new graph has N nodes but existing graph.json has M`),
add `-force` to the refresh flag: `--refresh-if-stale-force` or
`--refresh-force`. This passes `--force` through to `graphify update .`
and is safe when the corpus has legitimately shrunk (entries/files
deleted) and the new size is known to be correct.

Stale detection compares `git rev-parse HEAD` against the
`Built from commit:` field of each project's `GRAPH_REPORT.md`.
Failures in one project do not abort the rest.

## Metaproject agent rules — reminder

1. **Read the affected sibling's own `CLAUDE.md` before editing it.**
   The root `CLAUDE.md` (this workspace) is a navigation aid, not a
   substitute.
2. **Edits to a sibling are scoped to that sibling.** Editing
   `calculia/` never auto-edits `memofun/` even if the pattern looks
   the same.
3. **Cross-project changes** (a new graphify skill version, a new
   sibling, a global rename) need explicit user approval and a
   per-project check.
4. **No cross-project dependencies.** Each sibling stays
   dependency-free and shippable on its own. If two siblings want
   to share code, prefer a recipe over `git submodule` / workspaces.
5. **Cache contract**: every PWA-shipping sibling has a `sw.js`
   whose `VERSION` must be bumped on any change to a cached file —
   read the sibling's own `CLAUDE.md` §"Service worker cache"
   before editing. (This metaproject root does not ship a PWA and
   has no `VERSION` of its own.)
6. **Deploys are network operations.** A Cloudflare deploy (even to
   a preview channel) is never automatic — ask before running.
7. **The graphify skill sync script is the only cross-project
   mutation tool sanctioned here.** It is intentionally minimal
   (Node, no deps, sha256-compares `SKILL.md`) so a future
   maintainer can read it in five minutes.

## Out of scope here

Per-sibling product principles, accessibility rules, activity
catalogues, service-worker cache contracts, i18n parity, version
bump policy, and roadmaps live in each sibling's own `CLAUDE.md`
and `doc/<lang>/*.md`. This file documents only the **Copilot-Chat
entry points and the metaproject plumbing**.
