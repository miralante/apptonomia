# CLAUDE.md — Miralante metaproject

## About this project

Apptonomia is the **metaproject root** of the Miralante suite: it hosts the public landing at `https://apptonomia.uk/` (one card per sibling app linking out to its own domain) and the cross-project plumbing that ties the seven siblings together — the meta-graph at `graphify-out-meta/`, the cross-repo sync scripts, and this operational handbook. It does not ship a product of its own; its scope is the suite as a whole.

For per-project guidance (Calculia, Routime, Okeymoney, Sinonimia, Memofun, Teclatlon), read each sibling's own `CLAUDE.md`.

## Other projects in the Apptonomia suite

The Apptonomia metaproject hosts six sibling apps, each with its own repository and its own domain:

- **Calculia** — math and logical reasoning with short, visual activities.
- **Memofun** — study flashcards for autonomous review, one idea per card.
- **Okeymoney** — personal finance and everyday financial autonomy, with a personal-finance simulator.
- **Sinonimia** — easy-read dictionary of difficult words, with synonyms and ARASAAC pictograms.
- **Teclatlon** — touch typing on the physical computer keyboard, finger by finger.
- **Routime** — everyday activities to train mind and daily-life skills between sessions.

This file provides guidance to Claude Code (claude.ai/code) when working
at the level of the **Miralante metaproject** — that is, when operating
across the seven sibling projects under `Miralante/`, not inside one
specific product. For per-project guidance, read each project's own
`CLAUDE.md`.

> **Workspace double role (apptonomia only).** This `apptonomia/`
> workspace plays two roles at once: (1) the **metaproject root** of
> the Miralante suite — it carries the cross-project plumbing
> (`scripts/sync-graphify-skill.js`, the `graphify-out-meta/` index,
> this `CLAUDE.md`); and (2) the **public landing** at
> `https://apptonomia.uk/` — `index.html` here is the portal page users
> see first, with one card per sibling linking out to its own domain.
> SEO metadata, Open Graph, JSON-LD `ItemList`, and the multilingual
> landing copy (`js/strings.es.js`, `js/strings.en.js`) live alongside
> the cross-project plumbing. Edits to this repo's landing
> (`index.html`, `js/strings.*.js`, SEO meta, the JSON-LD suite list)
> are in scope here, but they must not bleed into the siblings: the
> landing links out to each sibling's domain, it doesn't ship their
> code. If the user names a sibling project ("calculia", "memofun", …)
> or the task is product-level inside a sibling, switch to that
> sibling's own `CLAUDE.md` and treat edits as scoped to that sibling —
> never auto-edit other siblings.

This file is intentionally short and stable; anything that grows
beyond a short rule belongs in the canonical sources listed in §A.1
or in the sibling project's own `CLAUDE.md`.

The document is split in two blocks:

- **Block A — Workflow** (§A.1 … §A.4): rules that govern *how* an
  agent edits the metaproject (canonical sources, mandatory workflow,
  external/destructive operations, scope of the file).
- **Block B — Suite-wide policies** (§B.1 … §B.7): rules that govern
  *what* the suite does (cache contract across siblings, UNE 153101,
  WCAG, public-facing wording, meta-graph, settings/data-reset
  convention, landing typography).

If two sections disagree, the more specific one wins: per-project
rules in Block A override the suite-wide rules in Block B for the
project at hand, and a rule about a specific topic wins over a
general one on the same block.

---

## Block A — Workflow

### A.1 Canonical sources

The canonical source for each topic prevails on that topic. If two
documents conflict, do not turn `CLAUDE.md` into a copy of both:
cross-check the code and fix the outdated doc in its canonical
location.

| Topic | Canonical source |
|---|---|
| **Per-sibling product, audience, accessibility, architecture, i18n, catalogue, roadmap** | Each sibling's own `CLAUDE.md` (linked from §A.1.1 below) |
| Metaproject plumbing (sync script, meta-graph, landing) | This file + `scripts/sync-graphify-skill.js` |
| Public landing (SEO, Open Graph, JSON-LD `ItemList`, multilingual copy) | This repo's `index.html`, `js/strings.es.js`, `js/strings.en.js` |
| Cross-project convention: settings/data-reset pattern | §B.6 below (this file) |
| Cross-project convention: landing typography | §B.7 below (this file) |
| Human contribution flow | [`CONTRIBUTING.md`](CONTRIBUTING.md) ↔ [`CONTRIBUTING.es.md`](CONTRIBUTING.es.md) |
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
> channel — touching one is never automatic for the others.

#### A.1.2 Commands

There is no build step at the metaproject level — every project
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
   project's own `CLAUDE.md` §"Service worker cache" before editing.
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
  Commands are in `technical.md` §12.5.
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

## Block B — Suite-wide policies

### B.1 Service worker cache (cross-project contract)

The cache-bump rule is **not** owned here — it lives in each sibling's
own `CLAUDE.md` §B.1 (see `calculia` / `memofun` / `okeymoney` /
`routime` / `sinonimia` for the cache-first variant, and `teclatlon`
for the network-first variant). Operative summary:

- Every PWA-shipping sibling exposes `sw.js` with a `VERSION` string
  (e.g. `routime-v3`, `calculia-v22`, `teclatlon-v30`, `sinonimia-v1`, …).
- A change to any file listed in that sibling's `ARCHIVOS` /
  `FILES` requires bumping `VERSION` in that same sibling.
- A bump that doesn't land is silent: end users see the old cached
  files until the SW unregisters. The cost of bumping is one
  integer; the cost of not bumping is "the user thinks the fix
  didn't land".

When working across the suite (e.g. syncing a new graphify skill
that touches `<project>/.claude/skills/graphify/SKILL.md`), only the
`scripts/sync-graphify-skill.js sync --apply` step can edit siblings
in bulk — and even then, only the graphify skill files, never the
siblings' `sw.js`.

### B.2 UNE 153101 reference

All seven sibling projects follow **UNE 153101:2018 EX** (Spanish
easy-read standard) and Inclusion Europe's European easy-read
guidelines as the normative basis for the cognitive accessibility
principles that guide content and UI: short sentences, one idea per
sentence, everyday vocabulary, no clinical or technical jargon in
what the end user reads. This is the standard each `SPEC.md` cites
when it states the "easy read always" rule (see `doc/en/SPEC.md`
§3.3 or its mirror in `doc/es/SPEC.md` §3.3). Adding a new language
or a new piece of UI copy means following UNE 153101 — not
paraphrasing it.

### B.3 WCAG AAA baseline

The seven Miralante siblings conform to WCAG 2.1 at **AA minimum**
and adopt the **AAA criteria that apply to the suite's audience**
whenever feasible. Full conformance at AAA is not feasible for a
whole web application (the W3C itself states AAA is meant for
specific contexts); the rule below lists the AAA criteria that ARE
applicable and that this suite honours.

Adopted AAA criteria:

- **1.4.6 Contrast (Enhanced)** — text contrast ≥ 7:1 (large text
  ≥ 4.5:1). WCAG AA (4.5:1) is the legal floor; AAA is the design
  target. The current verified pairs in Okeymoney (`#F2F4F8` on
  `#161A21` = 14.6:1, `#B7BDC9` on `#161A21` = 8.4:1) already meet
  AAA; the other siblings aim at the same ratio when their token
  palette is next touched.
- **3.1.5 Reading Level** — when content is for the general public
  it does not require advanced reading ability. The suite already
  complies through UNE 153101 (§B.2) and Inclusion Europe's
  easy-read guidelines: short sentences, one idea per sentence,
  everyday vocabulary.
- **1.4.1 Use of Color** — color is never the only means of
  conveying information. Every feedback state (success / hint /
  error / lock) also uses shape, icon, text or sound, so users with
  color-vision deficiencies are not excluded. (`App.feedback.success()`
  / `App.feedback.encourage()` / `App.feedback.lockUntilAck()`
  already encode this.)

Per-project wording in `doc/<lang>/SPEC.md` §3.5 / §5 / §6
references this baseline using the literal phrase **"WCAG AA
minimum, AAA whenever possible"** (already present in Okeymoney and
Routime; mirrored in the other siblings' `SPEC.md` so the rule
survives a single project's docs going out of sync).

### B.4 Public-facing wording: "usuario/a tipo" euphemism (suite-wide)

This directive applies across all seven sibling projects (Apptonomia,
Calculia, Memofun, Okeymoney, Sinonimia, Teclatlon, Routime) and to
the metaproject landing at `apptonomia.uk`. The suite ships products
whose real objective is occupational-therapy support for people with
intellectual disability, but **that framing is not used in public
surfaces** — only in internal documentation.

#### B.4.1 Where each term is allowed

- **"Discapacidad intelectual" / "intellectual disability"** is the
  canonical term and **may only appear in internal documentation**
  (`CLAUDE.md`, `doc/<lang>/SPEC.md`, `technical.md` / `tecnico.md`,
  `roles.md`, `CONTRIBUTING.md`, `CONTRIBUTING.es.md`, the
  `_test_*.js` and other tooling files in `scripts/`). It is
  explicitly **forbidden** in public-facing surfaces, the
  metaproject landing, READMEs that anyone can read without
  authentication, public talks, social media copy, press notes, and
  marketing material.
- **"Usuario/a tipo"** (plural "usuarios/as tipo") is the accepted
  euphemism for the audience in public-facing surfaces. It is used
  as a generic profile marker, not as a label for any real person.
  - It applies to `README.md` / `README.es.md`, the public landing
    (`apptonomia.uk/`), public talks, social media copy, press
    notes, marketing material, and any contributor-facing document
    that also doubles as a public description of the project (e.g.
    `CONTRIBUTING.md`).
  - It does **not** apply to the UI of the apps themselves: each
    project's own "Mandatory rule: zero mentions in the
    user-facing product" (see every sibling's `SPEC.md` §4)
    continues to forbid **any** mention, including "usuario/a
    tipo", in `index.html`, `app.js`, `strings.<locale>.js`,
    `js/i18n.js`, `about/privacidad.html` and any other
    user-facing surface. The euphemism is for the outside world,
    not for what the visitor reads on the site.
  - It does **not** apply to project content that names a clinical
    concept by its real-world name (e.g. a dictionary entry about
    a disability certificate in `sinonimia/js/data.es.js`, or a
    Routime activity case study about a real bureaucratic
    procedure): that is content, not labelling of an audience.

#### B.4.2 Rationale

Presenting the project's real objective in maintainer docs is useful
and necessary for whoever maintains and contributes to the suite.
Presenting it in marketing or landing surfaces is neither necessary
nor respectful of the audience — "usuario/a tipo" lets public
material describe what the apps are for (who the typical profile
is) without publicly naming a clinical group. This is a
meta-project rule, mirrored verbatim in each sibling's own
`CLAUDE.md` and `SPEC.md` so the rule survives a single project's
docs going out of sync.

### B.5 graphify (cross-project)

Every project in the suite has a `graphify-out/` produced by the
`graphify` skill installed at `<project>/.claude/skills/graphify/`. A
canonical version of the skill is also installed at the user level
(`~/.claude/skills/graphify/`) and tracked in this repo via
`scripts/sync-graphify-skill.js`.

#### B.5.1 Meta-graph (cross-project index)

The file [graphify-out-meta/graph.json](graphify-out-meta/graph.json)
holds a thin index — one node per sibling project plus two kinds of
edges:

- **Similarity edges (undirected)**: pairs of siblings that share
  ≥2 normalised community names across their per-project graphs.
  Weight = number of shared hubs.
- **Hierarchy edges (directed, `parent_of`)**: `apptonomia →
  <sibling>`, reflecting that the metaproject root carries the
  cross-project plumbing (sync script, this CLAUDE.md, the
  meta-graph itself).

`meta.edge_kinds` reports the count of each kind. Open
[graphify-out-meta/graph.html](graphify-out-meta/graph.html) for the
visual.

#### B.5.2 Per-project deep graphs

For any codebase question about a single project, prefer the
per-project graph before reading source files. Two ways to invoke
it:

**From inside the sibling (the manual path — what each sibling's
own `CLAUDE.md` says):**

```
cd <project>
graphify query "<question>"
graphify path "<A>" "<B>"
graphify explain "<concept>"
```

**From apptonomia (the orchestrated path — what the metaproject
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

#### B.5.3 Refresh handling (auto-update the sibling graph)

The per-project graph is built by `graphify update .` and stays on
disk until rebuilt. By default `ask` will answer whatever the
current graph says; if the sibling's `HEAD` has moved past the
commit recorded in `graphify-out/GRAPH_REPORT.md`, the script
prints a one-line warning (`NOTE: graph is COMMITS-SINCE-BUILD`)
and proceeds. To avoid stale answers without a manual `update
--apply`, two flags are available:

- `--refresh-if-stale` — run `graphify update .` in the sibling
  first, but only when its graph is actually stale. Silently skips
  when fresh. **This is the recommended flag for agents** — combine
  it with every `ask` so the answer reflects the latest code.
- `--refresh` — always rebuild, even when the graph is fresh. Use
  after a non-git change (e.g. generated files, a `gitignore`
  tweak) or to force a clean baseline.
- `--refresh-force` and `--refresh-if-stale-force` — variants of
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

#### B.5.4 When to use which path

- A question **about a specific sibling** (`calculia`'s Wallet
  keypad, `memofun`'s `App.decks`, `routime`'s
  `tools/differences`, etc.) → **always use `ask <slug>` from
  apptonomia**, never the meta-graph. The meta-graph is one node
  per project; it can't tell you anything about a specific
  activity inside a project. The skill's "Fast path — existing
  graph" rule applies here too: if
  `<sibling>/graphify-out/graph.json` exists, the script jumps
  straight to `graphify query` and skips re-extraction.
- A **cross-project comparison** ("which siblings share the X
  community?", "how does `apptonomia` relate to `calculia`?") →
  use the meta-graph at
  [graphify-out-meta/graph.json](graphify-out-meta/graph.json) (or
  `graphify-out-meta/graph.html` for the visual).
- `graphify path "<A>" "<B>"` and `graphify --type path_query`
  need two positional labels, which `ask` doesn't take — run
  those from inside the sibling instead.

### B.6 Settings / data-reset pattern (suite-wide)

Every PWA-shipping sibling exposes a way for the device's support
person (family, teacher, therapist) to **see and clear what the
local browser stores for that app**. The shape differs per project
but the contract is the same, so contributors don't reinvent it per
app.

#### B.6.1 Canonical reference

- **Routime** is the canonical implementation. Read
  [`routime/settings/`](../routime/settings/) (an *out-of-menu*
  hidden route: `index.html` + `app.js` +
  `strings.<locale>.js` + `styles.css`) and the comments in
  [`routime/settings/app.js`](../routime/settings/app.js#L1-L40)
  for the full rationale: two-step confirmation, no analytics, no
  network. Routime also ships a JSON export/import backup because
  its catalogue has 69 activities and the effort is justified
  there.
- **Calculia** has its own `settings/` folder
  ([`calculia/settings/app.js`](../calculia/settings/app.js)). When
  touching it, align it with the Routime reference, do not
  duplicate it.

#### B.6.2 Convention every PWA-shipping sibling follows

1. **One `localStorage` prefix per app.** Declare it as a constant
   near the top of the *root* `app.js` and use it for every key —
   do not invent ad-hoc prefixes. Verified prefixes on 2026-08-30:

   | Project | Prefix (preliminary) | Evidence on 2026-08-30 |
   |---|---|---|
   | `routime` | `routime:` | canonical, see [`routime/settings/app.js`](../routime/settings/app.js) |
   | `calculia` | `calculia:` | `calculia/settings/app.js` — to verify |
   | `memofun` | *TBD — keys seen: `prefs.cursoFijado` (no project prefix)* | needs per-key audit |
   | `okeymoney` | *TBD — "single ledger in localStorage"* | needs per-key audit |
   | `sinonimia` | `sinonimia-` (hyphen) — seen: `sinonimia-idioma` | `sinonimia/js/bootstrap-i18n.js:43` |
   | `teclatlon` | *TBD — currently migrating legacy keys* | `teclatlon/app.js:30` (migration in flight) |

   *Apptonomia itself does not ship a PWA and stores no user data,
   so it does not have a prefix.*

   **Status**: the prefixes marked *TBD* were discovered during a
   quick `grep` pass on 2026-08-30 but **were not verified
   per-file**. Before adding a reset UI to any of those projects,
   the maintainer must confirm the prefix by reading the project's
   `app.js` and listing every key it writes.

2. **A way to clear all keys under that prefix**, reachable by the
   support person (not the end user). Two acceptable shapes:
   - A dedicated `settings/` hidden route (Routime, Calculia).
   - A "Borrar mis datos" button on the main menu, with a two-step
     confirmation (same pattern as
     [`piano-keys`](routime/tools/piano-keys/)'s "Delete my
     progress"). Acceptable for siblings whose catalogue is small
     (1–5 activities) and where a dedicated route would be a
     near-empty shell.

3. **No `localStorage.clear()`.** Always scope the wipe to the
   project's own prefix, so a shared browser that hosts several
   siblings is not wiped across apps.

4. **i18n parity.** Any UI string the support person sees lives in
   `strings.es.js` + `strings.en.js` (no literals in `app.js` /
   `index.html`). The hidden-route shape uses `data-i18n` exactly
   like the rest of the app; the menu-button shape uses
   `App.i18n.t('key')`.

5. **Cache contract.** If the new strings / button live in a file
   listed in `sw.js` `ARCHIVOS`, bump `VERSION` in the project's
   `sw.js`. Apptonomia does not ship a `sw.js` and is exempt;
   sinonimia ships one (cache-first) as of 2026-09-01.

6. **Never network.** No analytics, no telemetry, no remote backup.
   Local export/import (JSON file via `<a download>`) is acceptable
   when justified by catalogue size; otherwise omit it.

#### B.6.3 Where to apply this pattern

- New sibling: copy the convention table, pick a prefix, add a
  hidden `settings/` route or a main-menu button, and reference
  this section.
- Existing sibling that lacks a reset path: open a per-project PR
  that reads the sibling's own `CLAUDE.md`, follows its rules, and
  lands the minimum viable wipe UI. Do **not** bundle it with
  unrelated work.

### B.7 Landing typography

The landing uses the same two self-hosted typefaces as the rest of
the suite — **Atkinson Hyperlegible** (weights 400 and 700) and
**Nunito** (variable, 400–900) — bundled as `.woff2` files under
`assets/fonts/` and exposed through the `--font` custom property in
`css/styles.css`. No CDN, no `@import` from `fonts.googleapis.com`.
Apptonomia does not ship a `sw.js`, so there is no `VERSION` to bump
when these files change; the immutable Cloudflare cache
(`_headers`) is what controls freshness for the landing assets.
