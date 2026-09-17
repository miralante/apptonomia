�# CLAUDE.md ��� Miralante metaproject

## About this project

Apptonomia is the **metaproject root** of the Miralante suite: it hosts the public landing at `https://apptonomia.uk/` (one card per sibling app linking out to its own domain) and the cross-project plumbing that ties the seven siblings together ��� the meta-graph at `graphify-out-meta/`, the cross-repo sync scripts, and this operational handbook. It does not ship a product of its own; its scope is the suite as a whole.

For per-project guidance (Calculia, Routime, Okeymoney, Sinonimia, Memofun, Teclatlon), read each sibling's own `CLAUDE.md`.

This file provides guidance to Claude Code (claude.ai/code) when working
at the level of the **Miralante metaproject** ��� that is, when operating
across the seven sibling projects under `Miralante/`, not inside one
specific product. For per-project guidance, read each project's own
`CLAUDE.md`.

> **Workspace double role (apptonomia only).** This `apptonomia/`
> workspace plays two roles at once: (1) the **metaproject root** of
> the Miralante suite ��� it carries the cross-project plumbing
> (`scripts/sync-graphify-skill.js`, the `graphify-out-meta/` index,
> this `CLAUDE.md`); and (2) the **public landing** at
> `https://apptonomia.uk/` ��� `index.html` here is the portal page users
> see first, with one card per sibling linking out to its own domain.
> SEO metadata, Open Graph, JSON-LD `ItemList`, and the multilingual
> landing copy (`js/strings.es.js`, `js/strings.en.js`) live alongside
> the cross-project plumbing. Edits to this repo's landing
> (`index.html`, `js/strings.*.js`, SEO meta, the JSON-LD suite list)
> are in scope here, but they must not bleed into the siblings: the
> landing links out to each sibling's domain, it doesn't ship their
> code. If the user names a sibling project ("calculia", "memofun", ����)
> or the task is product-level inside a sibling, switch to that
> sibling's own `CLAUDE.md` and treat edits as scoped to that sibling ���
> never auto-edit other siblings.

This file is intentionally short and stable; anything that grows
beyond a short rule belongs in the canonical sources listed in ��A.1
or in the sibling project's own `CLAUDE.md`.

### Suite-wide responsive design contract

Every suite page, including this landing and every new sibling, must use
UTF-8 (`<meta charset="UTF-8">`) and the real viewport (`<meta name="viewport" content="width=device-width, initial-scale=1">`),
fluid containers and `box-sizing: border-box`. Layouts must use flexible
grids or stacks (`minmax(min(100%, ...), 1fr)`, flex wrapping) instead of
fixed desktop columns. At narrow widths, controls and cards must fit the
viewport without horizontal scrolling; collapse columns progressively,
keep touch targets usable, and reduce decorative vertical gaps so the
primary content appears without excessive scrolling. Validate at 320px,
375px, 768px and desktop widths, checking both overflow and wasted empty
space. Teclatlon may keep its explicit physical-keyboard mobile gate.

When changing an immutable CSS or JS asset, update its cache identity in the
same change. Apptonomia CSS uses a semantic suffix such as
`?v=apptonomia-vN` (never a date); sibling PWAs use their `<slug>-vN`
service-worker version. After deployment, verify the published asset URL and
hard-reload or use a fresh private session before judging the visual result.
Do not consider a local-only check sufficient.

The document is split in two blocks:

- **Block A ��� Workflow** (��A.1 ���� ��A.4): rules that govern *how* an
  agent edits the metaproject (canonical sources, mandatory workflow,
  external/destructive operations, scope of the file).
- **Block B Ң��a�" Suite-wide policies** (��a��B.1 Ң��a��� ��a��B.6): rules that govern
  *what* the suite does (cache contract across siblings, accessibility
  & public-facing wording, meta-graph, settings/data-reset,
  GEO/AEO/LLMO).

If two sections disagree, the more specific one wins: per-project
rules in Block A override the suite-wide rules in Block B for the
project at hand, and a rule about a specific topic wins over a
general one on the same block.

---

## Block A ��� Workflow

### A.1 Canonical sources

The canonical source for each topic prevails on that topic. If two
documents conflict, do not turn `CLAUDE.md` into a copy of both:
cross-check the code and fix the outdated doc in its canonical
location.

| Topic | Canonical source |
|---|---|
| **Per-sibling product, audience, accessibility, architecture, i18n, catalogue, roadmap** | Each sibling's own `CLAUDE.md` (linked from ��A.1.1 below) |
| Metaproject plumbing (sync script, meta-graph, landing) | This file + `scripts/sync-graphify-skill.js` |
| Public landing (SEO, Open Graph, JSON-LD `ItemList`, multilingual copy) | This repo's `index.html`, `js/strings.es.js`, `js/strings.en.js` |
| **Suite compliance checklist** (UNE 153101, WCAG AAA, public-facing wording "usuario/a tipo", settings/data-reset, landing typography) | [`doc/en/guia-de-cumplimiento.md`](doc/en/guia-de-cumplimiento.md) �  [`doc/es/guia-de-cumplimiento.md`](doc/es/guia-de-cumplimiento.md) |
| **Creating a new sibling** (required files, scripts, doc tree, sw.js cache contract) | [`doc/en/crear-app.md`](doc/en/crear-app.md) �  [`doc/es/crear-app.md`](doc/es/crear-app.md) |
| **File templates for new siblings** (CLAUDE.md, README.md, sw.js, scripts/check.js, doc tree) | [`doc/templates/`](doc/templates/) |
| Cross-project convention: settings/data-reset pattern | [`doc/en/guia-de-cumplimiento.md` �5](doc/en/guia-de-cumplimiento.md#5-settings--data-reset-pattern) �  [`doc/es/guia-de-cumplimiento.md` �5](doc/es/guia-de-cumplimiento.md#5-settings--data-reset-pattern) � also �B.5.1 below for the canonical reference (`crear-app.md` + `doc/templates/`) |
| Cross-project convention: landing typography | [`doc/en/guia-de-cumplimiento.md` ��6](doc/en/guia-de-cumplimiento.md#6-landing-typography) �  [`doc/es/guia-de-cumplimiento.md` ��6](doc/es/guia-de-cumplimiento.md#6-tipografҭa-del-portal) |
| Human contribution flow | [`CONTRIBUTING.md`](CONTRIBUTING.md) �  [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) |
| AI agent operational flow | `CLAUDE.md` (this file) |

#### A.1.1 Sibling projects (the seven)

Every project listed below has its own `CLAUDE.md`, its own `sw.js`
(except `sinonimia`), its own domain, and its own graph under
`graphify-out/`.

| Project | What it ships | Shape | Language policy | Source of truth |
|---|---|---|---|---|
| `apptonomia/` | Occupational-therapy activity suite (flagship) | multi-activity catalogue | es/en | [doc/en/SPEC.md](doc/en/SPEC.md) |
| `calculia/` | Math & logical-reasoning practice | multi-activity catalogue | es/en | [doc/en/SPEC.md](../calculia/doc/en/SPEC.md) |
| `memofun/` | Card-based study/recall trainer | deck-driven (no fixed activity count) | UI es/en, decks language-agnostic | [doc/en/SPEC.md](../memofun/doc/en/SPEC.md) |
| `okeymoney/` | Personal-finance & everyday-autonomy trainer | single shared-state app | es/en | [doc/en/SPEC.md](../okeymoney/doc/en/SPEC.md) |
| `sinonimia/` | Plain-language dictionary | single-page app | es/en | [doc/en/SPEC.md](../sinonimia/doc/en/SPEC.md) |
| `teclatlon/` | Touch-typing trainer (physical keyboard only) | single-activity app | es/en | [doc/en/SPEC.md](../teclatlon/doc/en/SPEC.md) |
| `routime/` | Life-skills & routines activity suite | multi-activity catalogue | es/en | [doc/en/SPEC.md](../routime/doc/en/SPEC.md) |

> When the user says "the project", "este proyecto", "el repo"
> without naming one, ask which one before editing. Each sibling has
> its own version bumping, its own cache contract, and its own deploy
> channel ��� touching one is never automatic for the others.

#### A.1.2 Commands

There is no build step at the metaproject level ��� every project
ships plain HTML/CSS/JS.

- **Sync the graphify skill across the suite** (canonical source is
  the user-level install at `~/.claude/skills/graphify/`; per-project
  copies live at `<project>/.claude/skills/graphify/`):
  ```
  cd apptonomia
  node scripts/sync-graphify-skill.js              # sync --check (default)
  node scripts/sync-graphify-skill.js sync --apply # copy where drifted
  ```
  The script never overwrites a project's `.graphifyignore` or its
  `.graphify_*` runtime state files; it copies `SKILL.md` +
  `references/` only.

- **Refresh stale per-project graphs and rebuild the meta-graph**
  from here:
  ```
  cd apptonomia
  node scripts/sync-graphify-skill.js update --check   # report only
  node scripts/sync-graphify-skill.js update --apply   # run updates + meta
  node scripts/sync-graphify-skill.js update --apply --all   # include apptonomia
  node scripts/sync-graphify-skill.js update --apply --target ../<project>   # one only
  ```
  Stale detection: for each sibling, the script compares
  `git rev-parse HEAD` against the `Built from commit:` field of the
  project's `GRAPH_REPORT.md`; if they don't match (or the field is
  missing), it runs `graphify update .` in that project. After a
  successful update it rebuilds `graphify-out-meta/graph.json` +
  `graph.html`. By default `apptonomia/` is skipped (it has no
  per-project graph yet); pass `--all` to include it. Failures in
  one project do not abort the rest.
- **Ask a codebase question about a sibling from this directory**
  without `cd`-ing into it:
  ```
  node scripts/sync-graphify-skill.js ask <slug> "<question>"          # default: BFS query
  node scripts/sync-graphify-skill.js ask <slug> "<concept>" --type explain
  node scripts/sync-graphify-skill.js ask <slug> "<question>" --budget 800 --raw
  node scripts/sync-graphify-skill.js ask --refresh-if-stale <slug> "<question>"   # rebuild the sibling's graph first if it's stale
  node scripts/sync-graphify-skill.js ask --refresh-force <slug> "<question>"       # rebuild + pass --force to graphify (overrides "refuse to overwrite smaller graph")
  ```
  Validates `<slug>` is one of the seven siblings, resolves
  `<sibling>/graphify-out/graph.json` (or the path passed via
  `--graph`), sets cwd to the sibling so `.graphifyignore` and the
  other defaults still apply, and runs
  `python -m graphify query "<question>" --graph <path>` inheriting
  stdout/stderr. Use it in preference to the meta-graph for any
  question that's about a specific sibling (a single activity, a
  specific function, a file layout in one project). See the
  "Per-project deep graphs" section below for the full rule.
- **Inspect the meta-graph index** at
  [graphify-out-meta/](graphify-out-meta/). This is the cross-project
  index (one node per project + similarity edges); the deep graphs
  live inside each project's own `graphify-out/`.
- **Per-project validation** (each project has its own
  `node scripts/check.js`):
  ```
  cd ../calculia && node scripts/check.js
  cd ../memofun   && node scripts/check.js
  cd ../okeymoney && node scripts/check.js
  cd ../sinonimia && node scripts/check.js
  cd ../teclatlon && node scripts/check.js
  cd ../routime   && node scripts/check.js
  ```

### A.2 Mandatory workflow

#### A.2.1 Session start

Run before any modification:

```bash
git status --short
git log --oneline -3
```

#### A.2.2 Metaproject rules

1. **Read the affected project's own `CLAUDE.md`** before editing it.
   Each sibling has its own canonical-doc table, its own
   service-worker contract, and its own agent rules. The metaproject
   `CLAUDE.md` (this file) is a navigation aid, not a substitute.
2. **Edits to a sibling are scoped to that sibling.** Editing
   `calculia/` never auto-edits `memofun/` even if they share the
   same pattern.
3. **Cross-project changes** (e.g. a new graphify skill version, a
   new sibling) require explicit user approval and a per-project
   check.
4. **Cache contract**: each PWA-shipping project has a `sw.js` whose
   `VERSION` must be bumped on any change to a cached file. Read the
     project's own doc/en/technical.md (mirror doc/es/tecnico.md) �PWA and service worker (or �'Cache contract' in CLOUDFLARE.md) before editing.
5. **Deploys are network operations**: a Cloudflare deploy (even to
   a preview channel) is never automatic. Ask before running.
6. **Do not introduce cross-project dependencies.** Each sibling
   stays dependency-free and shippable on its own. If two siblings
   want to share code, prefer a recipe over a `git submodule` /
   workspace.
7. **The graphify skill sync script is the only cross-project
   mutation tool sanctioned here.** It is intentionally minimal
   (Node, no deps, sha256-compares `SKILL.md`) so a future
   maintainer can read it in five minutes.

#### A.2.3 Before finishing

1. Run any relevant per-sibling `node scripts/check.js` (each
   sibling's only "test" step).
2. Report only verifications you actually ran; clearly flag any
   remaining manual tests.
3. If the change touched any file listed in a sibling's `sw.js`,
   confirm the sibling's `VERSION` was bumped.

### A.3 External and destructive operations

- A deploy (even to a temporary Cloudflare Pages preview) is a
  network operation: request explicit approval before running it.
  Commands are in `technical.md` ��12.5.
- Never publish, push, or open/close external resources without an
  explicit request or authorization.
- Never delete or revert changes from the user or another session to
  simplify your task; integrate them or explain the conflict.

### A.4 Out of scope for this file

Per-project product principles, accessibility rules, activity
catalogues, service-worker cache contracts, version-bump policy, and
roadmaps live in each project's own `CLAUDE.md` and `doc/<lang>/*.md`
files. This file only documents the **metaproject plumbing** and the
suite-wide conventions shared across siblings. Detailed change history
lives in Git; `CLAUDE.md` must stay brief, operational, and stable.

---

## Block B ��� Suite-wide policies

### B.1 Service worker cache (cross-project contract)

The cache-bump rule is **not** owned here ��� it lives in each sibling's
own `CLAUDE.md` ��B.1 (see `calculia` / `memofun` / `okeymoney` /
`routime` / `sinonimia` for the cache-first variant, and `teclatlon`
for the network-first variant). Operative summary:

- Every PWA-shipping sibling exposes `sw.js` with a `VERSION` string
  (e.g. `routime-v3`, `calculia-v22`, `teclatlon-v30`, `sinonimia-v1`, ����).
- A change to any file listed in that sibling's `ARCHIVOS` /
  `FILES` requires bumping `VERSION` in that same sibling.
- A bump that doesn't land is silent: end users see the old cached
  files until the SW unregisters. The cost of bumping is one
  integer; the cost of not bumping is "the user thinks the fix
  didn't land".

When working across the suite (e.g. syncing a new graphify skill
that touches `<project>/.claude/skills/graphify/SKILL.md`), only the
`scripts/sync-graphify-skill.js sync --apply` step can edit siblings
in bulk ��� and even then, only the graphify skill files, never the
siblings' `sw.js`.

### B.2 Accessibility & public-facing wording (pointer)

The canonical source for UNE 153101 (easy-read), WCAG AA + AAA
baseline, and the public-facing "usuario/a tipo" euphemism is
`doc/en/guia-de-cumplimiento.md` �1 / �2 / �3 (mirror
`doc/es/guia-de-cumplimiento.md`). Per `�A.1`, that guide is the
authoritative document for the suite's accessibility and public-
facing-wording rules � `CLAUDE.md` does not duplicate them here.
Per-sibling `CLAUDE.md` files expose the same pointer against their
own `doc/en/spec.md` (which mirrors the suite-wide rules at the
product level).

### B.3 Public-facing wording: "usuario/a tipo" euphemism (pointer)

The canonical source for the public-facing "usuario/a tipo" euphemism is
the same [`doc/en/guia-de-cumplimiento.md`](doc/en/guia-de-cumplimiento.md)
�3 (mirror `doc/es/guia-de-cumplimiento.md` �3) that �B.2 already cites for the
rest of the accessibility + public-facing-wording rules. The full rationale
(what is allowed in public surfaces, what is not, and why) lives in that
guide; this pointer exists so that an agent looking at the metaproject
`CLAUDE.md` sees the topic explicitly listed, not as a sub-clause of �B.2.

Per `�A.1`, that guide is the authoritative document for the suite-wide
euphemism rule  `CLAUDE.md` does not duplicate it here. Per-sibling
`CLAUDE.md` files mirror this as their own `B.3 Public-facing wording: persona
tipo` (the Spanish mirror; same policy, same source of truth).
### B.4 graphify (cross-project)

Every project in the suite has a `graphify-out/` produced by the
`graphify` skill installed at `<project>/.claude/skills/graphify/`. A
canonical version of the skill is also installed at the user level
(`~/.claude/skills/graphify/`) and tracked in this repo via
`scripts/sync-graphify-skill.js`.

#### B.4.1 Meta-graph (cross-project index)

The file [graphify-out-meta/graph.json](graphify-out-meta/graph.json)
holds a thin index ��� one node per sibling project plus two kinds of
edges:

- **Similarity edges (undirected)**: pairs of siblings that share
  �0�2 normalised community names across their per-project graphs.
  Weight = number of shared hubs.
- **Hierarchy edges (directed, `parent_of`)**: `apptonomia � �"
  <sibling>`, reflecting that the metaproject root carries the
  cross-project plumbing (sync script, this CLAUDE.md, the
  meta-graph itself).

`meta.edge_kinds` reports the count of each kind. Open
[graphify-out-meta/graph.html](graphify-out-meta/graph.html) for the
visual.

#### B.4.2 Per-project deep graphs

For any codebase question about a single project, prefer the
per-project graph before reading source files. Two ways to invoke
it:

**From inside the sibling (the manual path ��� what each sibling's
own `CLAUDE.md` says):**

```
cd <project>
graphify query "<question>"
graphify path "<A>" "<B>"
graphify explain "<concept>"
```

**From apptonomia (the orchestrated path ��� what the metaproject
root does on behalf of any agent working here):**

```
# Default: query the sibling's deep graph from apptonomia, no `cd` needed.
node scripts/sync-graphify-skill.js ask <slug> "<question>"

# Equivalent to graphify explain on that sibling's graph.
node scripts/sync-graphify-skill.js ask <slug> "<concept>" --type explain

# Cap output tokens or switch to DFS traversal.
node scripts/sync-graphify-skill.js ask <slug> "<question>" --budget 800 --raw

# Refresh the sibling's graph before answering (auto-rebuild only when stale).
# Recommended when the sibling code has changed since its last build.
node scripts/sync-graphify-skill.js ask --refresh-if-stale <slug> "<question>"
```

`ask` validates that `<slug>` is one of the seven siblings, resolves
`<sibling>/graphify-out/graph.json` (or `--graph <path>` if you
pass it explicitly), sets cwd to the sibling so `.graphifyignore`
and other defaults still apply, then runs
`python -m graphify query "<question>"` inheriting stdout/stderr.
It propagates graphify's exit code, so a non-zero answer still
surfaces as a failed command.

#### B.4.3 Refresh handling (auto-update the sibling graph)

The per-project graph is built by `graphify update .` and stays on
disk until rebuilt. By default `ask` will answer whatever the
current graph says; if the sibling's `HEAD` has moved past the
commit recorded in `graphify-out/GRAPH_REPORT.md`, the script
prints a one-line warning (`NOTE: graph is COMMITS-SINCE-BUILD`)
and proceeds. To avoid stale answers without a manual `update
--apply`, two flags are available:

- `--refresh-if-stale` ��� run `graphify update .` in the sibling
  first, but only when its graph is actually stale. Silently skips
  when fresh. **This is the recommended flag for agents** ��� combine
  it with every `ask` so the answer reflects the latest code.
- `--refresh` ��� always rebuild, even when the graph is fresh. Use
  after a non-git change (e.g. generated files, a `gitignore`
  tweak) or to force a clean baseline.
- `--refresh-force` and `--refresh-if-stale-force` ��� variants of
  the above that pass `--force` through to `graphify update .`,
  overriding graphify's safety guard that refuses to overwrite a
  smaller graph with an older (larger) one. Use when the corpus
  has legitimately shrunk (entries/files deleted) and the new
  size is known to be correct. Without `-force`, those rebuilds
  fail with the warning `new graph has N nodes but existing
  graph.json has M` and the script falls back to the stale graph
  for the query.

Both flags only touch the sibling's `graphify-out/`; the
meta-graph at `graphify-out-meta/` is **not** regenerated here. Run
`node scripts/sync-graphify-skill.js update --apply` separately
when the meta-graph needs an update (e.g. after several siblings
have been refreshed).

#### B.4.4 When to use which path

- A question **about a specific sibling** (`calculia`'s Wallet
  keypad, `memofun`'s `App.decks`, `routime`'s
  `tools/differences`, etc.) � �" **always use `ask <slug>` from
  apptonomia**, never the meta-graph. The meta-graph is one node
  per project; it can't tell you anything about a specific
  activity inside a project. The skill's "Fast path ��� existing
  graph" rule applies here too: if
  `<sibling>/graphify-out/graph.json` exists, the script jumps
  straight to `graphify query` and skips re-extraction.
- A **cross-project comparison** ("which siblings share the X
  community?", "how does `apptonomia` relate to `calculia`?") � �"
  use the meta-graph at
  [graphify-out-meta/graph.json](graphify-out-meta/graph.json) (or
  `graphify-out-meta/graph.html` for the visual).
- `graphify path "<A>" "<B>"` and `graphify --type path_query`
  need two positional labels, which `ask` doesn't take ��� run
  those from inside the sibling instead.

### B.5 Settings / data-reset pattern (suite-wide)

Every PWA-shipping sibling exposes a way for the device's support
person (family, teacher, therapist) to **see and clear what the
local browser stores for that app**. The shape differs per project
but the contract is the same, so contributors don't reinvent it per
app.

#### B.5.1 Canonical reference

The canonical source for the settings / data-reset pattern is
the metaproject's
[`doc/en/crear-app.md`](doc/en/crear-app.md) (mirror
[`doc/es/crear-app.md`](doc/es/crear-app.md)) plus the file
scaffolds under
[`doc/templates/`](doc/templates/) � `settings/index.html`,
`settings/app.js`, `settings/strings.<locale>.js`,
`settings/styles.css`, the `localStorage`-prefix convention, the
two-step confirmation, the no-analytics / no-network rule, the
"never `localStorage.clear()`" rule, and the i18n parity rule all
live in the canonical documentation. New siblings are expected
to follow the recipe; existing siblings are expected to converge
towards it.

Two existing siblings ship the pattern today, as **implementation
references** (not as the canon � the canon stays the
`crear-app.md` recipe and the templates):

- [`routime/settings/`](../routime/settings/) � an *out-of-menu*
  hidden route. The full rationale (two-step confirmation, no
  analytics, no network, JSON export/import backup) is documented
  in the comments at the top of
  [`routime/settings/app.js`](../routime/settings/app.js#L1-L40).
  Routime also ships the JSON export/import because its catalogue
  has 69 activities and the effort is justified there.
- [`calculia/settings/`](../calculia/settings/) � a similar
  hidden route, trimmed relative to Routime (no backup, no
  font-size/sound preferences, no personal-data form � Calculia's
  15 activities store no name or other personal field). When
  touching it, align it with the Routime reference **and** with
  `crear-app.md`, but do not duplicate either.


### B.6 GEO, AEO and LLMO (search-, answer-engine- and LLM-visibility)

Beyond the classic SEO carried by `app.config.json` +
`scripts/build-head.js` (title, description, Open Graph, Twitter
Card, hreflang, JSON-LD `SoftwareApplication` / `BreadcrumbList`,
sitemap, robots.txt), the metaproject and the six siblings adopt
three additional layers, all defined in
[`doc/en/guia-de-cumplimiento.md` ��7](doc/en/guia-de-cumplimiento.md#7-geo-aeo-and-llmo-search--answer-engine--and-llm-visibility)
� 
[`doc/es/guia-de-cumplimiento.md` ��7](doc/es/guia-de-cumplimiento.md#7-geo-aeo-y-llmo-presencia-en-buscadores-answer-engines-y-llms):

- **GEO** ��� semantic / Dublin Core only. Six `<meta name="DC.*">`
  (title, creator, subject, description, language, type) plus
  `DC.rights`, sourced from `app.config.json > dc*` and rendered by
  `scripts/build-head.js`. No `geo.region` / `geo.placename` since
  the suite is global and bilingual.
- **AEO** ��� `FAQPage` JSON-LD only, no visible FAQ block. 3����S5
  `{question, answer}` pairs per project in `app.config.json > faq`,
  injected as an extra `@type: FAQPage` node in the existing `@graph`
  by `scripts/build-head.js`. No `QAPage`, no `SpeakableSpecification`,
  no RSS/Atom feed (no real change surface).
- **LLMO** ��� `/llms.txt` per project (`scripts/build-llms-txt.js`),
  linked from `<head>` via `<link rel="alternate" type="text/markdown">`,
  plus a known-AI-crawler allowlist (GPTBot, ClaudeBot, Claude-Web,
  anthropic-ai, cohere-ai, PerplexityBot, CCBot, Google-Extended,
  Applebot-Extended) merged into the existing `robots.txt`.

The four gates (Dublin Core count, FAQPage node, `llms.txt`
existence, AI-crawler UA list) are enforced by `scripts/check.js`
in the metaproject and in every sibling that adopts them ��� see
the cross-project table in ��7.4 of either guide.
