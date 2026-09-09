# Activities and surfaces catalogue

> 🌐 **Other language:** [Español](../es/actividades.md)

Apptonomia is a **landing + plumbing project**, not a runtime app
with a fixed grid of activities. This document lists what it
actually ships — the six landing cards (the "activities" the
visitor interacts with) plus the cross-project plumbing surfaces
the maintainers maintain.

> The canonical product definition (audience, non-negotiable
> rules, i18n, SEO) lives in [`spec.md`](spec.md). The plumbing
> architecture is in [`technical.md`](technical.md).

---

## 1. The landing — the six cards

The landing at `https://apptonomia.uk/` exposes six cards, one
per app of the suite. Each card opens that app in a new tab on
its own domain.

| Card | Domain | What it does |
|---|---|---|
| **Calculia** | <https://calculia.apptonomia.uk> | Math and logical reasoning with short, visual activities. |
| **Memofun** | <https://memofun.apptonomia.uk> | Study flashcards for autonomous review, one idea per card. |
| **Okeymoney** | <https://okeymoney.apptonomia.uk> | Personal finance and everyday financial autonomy. |
| **Routime** | <https://routime.apptonomia.uk> | Everyday activities to train mind and daily-life skills between sessions. |
| **Sinonimia** | <https://sinonimia.apptonomia.uk> | Easy-read dictionary of difficult words. |
| **Teclatlon** | <https://teclatlon.apptonomia.uk> | Touch typing on the physical computer keyboard. |

The card shape is documented in [`spec.md`](spec.md) §3.1. Adding
a seventh card means following the recipe in
[`crear-app.md`](crear-app.md) §8.

### 1.1 What each card contains

Each card has:

- The app's display name in the active locale.
- A one-line tagline in the active locale.
- An `Open` button that launches the app in a new tab.
- An `aria-label` that mirrors the visible content for screen
  readers.

There is no carousel, no autoplaying animation, no marketing
copy. Cards are arranged in a 1 / 2 / 3 column responsive grid.

---

## 2. The plumbing — what the maintainers maintain

The Apptonomia repo is also the **cross-project plumbing** of the
suite. The plumbing surfaces are:

| Surface | What it does |
|---|---|
| `scripts/sync-graphify-skill.js` | Syncs `~/.claude/skills/graphify/` into each sibling's `.claude/skills/graphify/` (sha256-compares `SKILL.md` first). The only sanctioned cross-project mutation tool. |
| `scripts/sync-graphify-skill.js ask <slug> <question>` | Queries a sibling's deep graph from the metaproject root, without `cd`-ing into the sibling. |
| `scripts/sync-graphify-skill.js update --apply` | Refreshes stale per-project graphs and rebuilds `graphify-out-meta/graph.json`. |
| `graphify-out-meta/graph.json` | Thin cross-project index: one node per sibling + similarity / hierarchy edges. |
| `graphify-out-meta/graph.html` | Visual rendering of the meta-graph. |
| `CLAUDE.md` Block A + Block B | Operational handbook + suite-wide policies. |
| `doc/` | This folder: bilingual docs, suite compliance, new-app recipe, file templates. |
| `js/strings.<locale>.js` | Landing UI copy in es + en. |
| `index.html` | The landing itself. |
| `_headers` | HTTP security headers (CSP, HSTS, Permissions-Policy, immutable cache for fonts/CSS). |
| `wrangler.toml` | Cloudflare Workers + static assets config. |

### 2.1 Plumbing guarantees

- **No third-party runtime.** The landing and the plumbing
  scripts make no `fetch` to an external host at runtime.
- **No build step.** `node scripts/check.js`, `node scripts/
  sync-graphify-skill.js`, and `node scripts/
  build-meta-graph.js` are plain Node scripts — no `npm
  install` needed.
- **Bilingual docs.** Every doc ships in es + en (or a single
  bilingual file with both languages clearly marked).
- **Two-step destructive ops.** Every command that touches
  another sibling requires explicit user approval before running
  (see `CLAUDE.md` §A.3).

---

## 3. What the metaproject does **not** ship

- **No runtime activities.** The landing is one page; it doesn't
  run an app.
- **No user data.** No `localStorage`, no IndexedDB, no cookies.
  Apptonomia doesn't store anything on the visitor's device.
- **No PWA / service worker.** The landing is not installable;
  the `?v=` content-hash on the i18n bundles is enough to bust
  the immutable cache when their content changes.
- **No per-activity catalogue.** Activity catalogues live in
  each sibling's own `doc/<lang>/activities.md`. Apptonomia's
  "catalogue" is the six-card grid on the landing, listed in
  §1 above.

---

## See also

- [`spec.md`](spec.md) — the canonical product definition for the
  landing + plumbing.
- [`technical.md`](technical.md) — how the plumbing works under
  the hood.
- [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) — the
  suite compliance checklist that all seven siblings (and any
  future addition) must pass.
- [`crear-app.md`](crear-app.md) — the recipe for adding a
  seventh card (and a seventh sibling to back it).
