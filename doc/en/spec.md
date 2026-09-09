# SPEC — Apptonomia (metaproject + landing portal)

> 🌐 **Other language:** [Español](../es/spec.md)

This document is the **product definition** for the Apptonomia
metaproject: what the landing ships, what the cross-project
plumbing does, and the non-negotiable principles both have to
follow. For per-sibling product definitions, read each sibling's
own `doc/<lang>/spec.md`.

---

## 1. What is Apptonomia?

Apptonomia is the **metaproject root** of the Miralante suite. It
hosts two things in one repo:

1. **The public landing** at `https://apptonomia.uk/` — one card per
   sibling app, linking out to that sibling's own domain. SEO
   metadata, Open Graph, JSON-LD `ItemList`, multilingual copy
   (`js/strings.es.js`, `js/strings.en.js`) and the HTTP security
   headers live alongside the cross-project plumbing.
2. **The cross-project plumbing** — the meta-graph at
   `graphify-out-meta/`, the sync script
   (`scripts/sync-graphify-skill.js`), this `CLAUDE.md` operational
   handbook, and the `docs/` tree that defines the suite-wide
   policies every sibling has to honour.

It does not ship a product of its own — its scope is the suite as
a whole.

### 1.1 The seven siblings

| Project | What it ships | Shape |
|---|---|---|
| `apptonomia/` | Occupational-therapy activity suite (the original flagship) | multi-activity catalogue |
| `calculia/` | Math & logical-reasoning practice | multi-activity catalogue |
| `memofun/` | Card-based study/recall trainer | deck-driven |
| `okeymoney/` | Personal-finance & everyday-autonomy trainer | single shared-state app |
| `sinonimia/` | Plain-language dictionary | single-page app |
| `teclatlon/` | Touch-typing trainer (physical keyboard only) | single-activity app |
| `routime/` | Life-skills & routines activity suite | multi-activity catalogue |

Each sibling has its own repo, its own domain, its own
`CLAUDE.md` and its own `doc/<lang>/` tree.

---

## 2. Non-negotiable principles

### 2.1 Easy-read always (UNE 153101)

All user-facing copy on the landing follows
**UNE 153101:2018 EX** (Spanish easy-read standard) and Inclusion
Europe's European easy-read guidelines: short sentences, one idea
per sentence, everyday vocabulary, no clinical or technical jargon.
Adding a new language or a new piece of UI copy means following
UNE 153101 — not paraphrasing it.

### 2.2 WCAG AA minimum, AAA whenever possible

The landing conforms to WCAG 2.1 at **AA minimum** and adopts the
**AAA criteria that apply to the suite's audience** whenever
feasible. Full conformance at AAA is not realistic for a whole web
application; the metaproject's
[`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) §2 lists the
AAA criteria that ARE applicable and that the suite honours.

### 2.3 No telemetry, no accounts, no remote storage

The landing is one static HTML page with a tiny i18n bootstrap and
two language bundles. No backend, no database, no telemetry, no
third-party runtime, no accounts, no cookies, no analytics.
Everything runs in the browser.

### 2.4 Public-facing wording: "usuario/a tipo" euphemism

The suite's real objective lives in internal documentation; the
landing uses **"usuario/a tipo"** in any copy that describes the
audience. The full rule — including where each term is and is not
allowed — is in
[`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) §3.

### 2.5 Zero build, zero dependencies

No `npm install`, no bundler, no transpiler. The landing is plain
HTML/CSS/JS served as Cloudflare static assets. Adding a build
step is a one-way door that breaks every sibling and the landing
in one go.

---

## 3. Landing structure

### 3.1 Visual shape

The landing has **six cards** — one per app of the suite. Each
card has:

- The app's display name (in the active locale).
- A one-line tagline (in the active locale).
- An `Open` button that launches the app on its own domain in a new
  tab.
- An `aria-label` that describes the same content for screen
  readers.

Cards are arranged in a responsive grid: one column on phones,
two on tablets, three on desktops. There is no carousel, no
animation that fires automatically, and no marketing copy.

### 3.2 SEO + accessibility

The landing ships:

- `<title>` + `<meta name="description">` per locale.
- Open Graph + Twitter Card metadata per locale.
- JSON-LD `ItemList` of the six products, in `@context:
  ItemList` with one `ListItem` per app.
- Canonical `<link rel="canonical">` to `https://apptonomia.uk/`.
- `<html lang="es">` (or `en`) set by the i18n bootstrap on first
  paint.
- Atkinson Hyperlegible + Nunito as the only typefaces, bundled
  under `assets/fonts/` (see
  [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) §6).

### 3.3 i18n

- Two locales: `es` (default) and `en`.
- Detected from `navigator.languages` on first paint, with a manual
  selector as fallback.
- The active locale is mirrored into `<html lang>` for screen
  readers.
- UI copy lives in `js/strings.<locale>.js`; **never** hardcoded in
  `index.html` or `app.js`.
- See [`i18n.md`](i18n.md) for the recipe to add a third locale.

---

## 4. Cross-project plumbing

### 4.1 The sync script

`scripts/sync-graphify-skill.js` is the only sanctioned
cross-project mutation tool. It copies `~/.claude/skills/graphify/`
into each sibling's `.claude/skills/graphify/`, sha256-comparing
`SKILL.md` first. It can also refresh stale per-project graphs
and rebuild the meta-graph at `graphify-out-meta/`. Read its
header comment for the full surface.

### 4.2 The meta-graph

`graphify-out-meta/graph.json` holds a thin cross-project index:

- **One node per sibling project**, with the project's display
  name, slug and domain.
- **Similarity edges** (undirected): pairs of siblings that share
  ≥2 normalised community names across their per-project graphs.
- **Hierarchy edges** (directed, `parent_of`): `apptonomia →
  <sibling>`, reflecting that the metaproject root carries the
  cross-project plumbing.

`graph.html` is the visual rendering.

### 4.3 Per-sibling deep graphs

Each sibling owns its own deep graph at
`<sibling>/graphify-out/graph.json`, built by `graphify update .`
inside that sibling's repo. The metaproject's
[`../../CLAUDE.md`](../../CLAUDE.md) §B.5.2 documents when to query
a sibling's deep graph (default) vs. the meta-graph (for
cross-project comparison).

---

## 5. Deployment

The landing deploys to **Cloudflare Workers + static assets** via
the Cloudflare Git connector — automatic on every push to `main`.
HTTP security headers live in `_headers`; project metadata in
`wrangler.toml`. See [`../../CLOUDFLARE.md`](../../CLOUDFLARE.md)
for the full runbook.

> Apptonomia does not ship a `sw.js` (no service worker, no
> install-to-home-screen). The `?v=` content-hash on the i18n /
> strings bundles is enough to bust the immutable cache when
> their content changes; see `scripts/build-head.js` and the
> per-locale `?<hash>` query strings on the `<script src="...">`
> tags in `index.html`.

---

## 6. What this repo is **not**

- **Not a runtime app.** The landing doesn't ship activities, it
  ships links to the apps.
- **Not the source of truth for any sibling.** Each sibling's
  `doc/<lang>/spec.md` is the source of truth for that sibling's
  product. This document is the source of truth for the landing
  + plumbing only.
- **Not a fork of any sibling.** Siblings may copy from
  [`templates/`](../templates/) but they don't `git submodule` or
  workspace-link to this repo.

---

## See also

- [`../../CLAUDE.md`](../../CLAUDE.md) — operational handbook for
  AI agents and humans working across the suite.
- [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) — suite
  compliance checklist (UNE 153101, WCAG AAA, public-facing
  wording, no telemetry, settings / data-reset, landing
  typography, cache contract).
- [`crear-app.md`](crear-app.md) — recipe for adding a new
  sibling, including the file templates under
  [`templates/`](../templates/).
- [`tecnico.md`](tecnico.md) — how the metaproject plumbing
  works under the hood.
- Each sibling's `doc/<lang>/spec.md` for per-sibling product
  definitions.
