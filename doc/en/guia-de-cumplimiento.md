# Suite compliance checklist

This is the canonical compliance guide for every app of the
Miralante suite — Apptonomia, Calculia, Memofun, Okeymoney, Sinonimia,
Teclatlon, Routime — and for any new app that joins it. It mirrors
and complements the suite-wide policies in the metaproject's
[`../../CLAUDE.md`](../../CLAUDE.md) §B; whenever the two disagree
the rule here is more detailed, the rule in `CLAUDE.md` is the
authoritative pointer.

> 🌐 **Other language:** [Español](../es/guia-de-cumplimiento.md)

---

## Contents

1. [Easy-read always (UNE 153101)](#1-easy-read-always-une-153101)
2. [WCAG AA minimum, AAA whenever possible](#2-wcag-aa-minimum-aaa-whenever-possible)
3. [Public-facing wording: "usuario/a tipo"](#3-public-facing-wording-usuarioa-tipo-euphemism)
4. [No telemetry, no accounts, no remote storage](#4-no-telemetry-no-accounts-no-remote-storage)
5. [Settings / data-reset pattern](#5-settings--data-reset-pattern)
6. [Landing typography](#6-landing-typography)
7. [GEO, AEO and LLMO (search-, answer-engine- and LLM-visibility)](#7-geo-aeo-and-llmo-search--answer-engine--and-llm-visibility)
8. [Service worker cache contract](#8-service-worker-cache-contract)
9. [Required file anatomy per sibling](#9-required-file-anatomy-per-sibling)
10. [Compliance self-check before opening a PR](#10-compliance-self-check-before-opening-a-pr)

---

## 1. Easy-read always (UNE 153101)

All user-facing copy (UI strings, instructions, examples, error
messages, onboarding flows, settings copy) follows
**UNE 153101:2018 EX** (Spanish easy-read standard) and Inclusion
Europe's European easy-read guidelines. Operative rules:

- **One idea per sentence.** If you find yourself writing a
  semicolon or a long subordinate clause, split the sentence.
- **Everyday vocabulary.** No clinical, technical, regulatory or
  jargon terms in the UI. If a word has a simpler synonym, use it.
  (When the user-facing copy is *content* — e.g. a Sinonimia
  dictionary entry about a real bureaucratic term — that is
  content, not labelling; the rule below about clinical terms
  doesn't apply.)
- **Short sentences.** A soft ceiling of ~15 words per sentence is a
  good default; below 12 is better.
- **Active voice.** "The app shows a celebration" beats "A
  celebration is shown".
- **Direct address.** Talk to the user ("you can tap…"), not at
  them ("the user may tap…").
- **No acronyms or initialisms** unless the user has seen them
  expanded before in the same screen.
- **No sarcasm, irony, wordplay or double meanings.** They break
  literal comprehension and Easy Read.

Each sibling's `doc/<lang>/spec.md` §3 cites this standard and may
add project-specific easy-read rules on top.

---

## 2. WCAG AA minimum, AAA whenever possible

The whole suite conforms to WCAG 2.1 at **AA minimum** and adopts
the **AAA criteria that apply to the suite's audience** whenever
feasible. Full AAA conformance is not realistic for a whole web
application (the W3C itself states AAA is meant for specific
contexts); the rule below lists the AAA criteria that ARE
applicable and that this suite honours.

### 2.1 Adopted AAA criteria

- **1.4.6 Contrast (Enhanced)** — text contrast ≥ 7:1 (large text
  ≥ 4.5:1). WCAG AA (4.5:1) is the legal floor; AAA is the design
  target. Verified pairs in Okeymoney:
  `#F2F4F8` on `#161A21` = 14.6:1, `#B7BDC9` on `#161A21` = 8.4:1.
  The other siblings aim at the same ratio when their token palette
  is next touched.
- **3.1.5 Reading Level** — when content is for the general public
  it does not require advanced reading ability. Already covered by
  UNE 153101 (§1) and Inclusion Europe's easy-read guidelines.
- **1.4.1 Use of Color** — color is never the only channel. Every
  feedback state (success / hint / error / lock) also uses shape,
  icon, text or sound. `App.feedback.success()`,
  `App.feedback.encourage()` and `App.feedback.lockUntilAck()` in
  the shared core encode this; siblings should reuse them, not
  reinvent their own feedback channels.

### 2.2 Per-project wording

Every sibling's `doc/<lang>/spec.md` §3.5/§5/§6 references this
baseline using the literal phrase **"WCAG AA minimum, AAA
whenever possible"**. Mirroring that phrase in every sibling's
`spec.md` is what lets the rule survive a single project's docs
going out of sync.

---

## 3. Public-facing wording: "usuario/a tipo" euphemism

The suite ships products whose real objective is
occupational-therapy support for people with intellectual disability,
but **that framing is not used in public surfaces** — only in
internal documentation.

### 3.1 Where each term is allowed

- **"Discapacidad intelectual" / "intellectual disability"** is
  the canonical term and **may only appear in internal
  documentation** (`CLAUDE.md`, `doc/<lang>/spec.md`,
  `technical.md` / `tecnico.md`, `roles.md`, `CONTRIBUTING.md`,
  `CONTRIBUTING.es.md`, the `_test_*.js` and other tooling files in
  `scripts/`). It is explicitly **forbidden** in public-facing
  surfaces, the metaproject landing, READMEs that anyone can read
  without authentication, public talks, social media copy, press
  notes, and marketing material.
- **"Usuario/a tipo"** (plural "usuarios/as tipo") is the accepted
  euphemism for the audience in public-facing surfaces. It is used
  as a generic profile marker, not as a label for any real person.
  - Applies to `README.md` / `README.es.md`, the public landing
    (`apptonomia.uk/`), public talks, social media copy, press
    notes, marketing material, and any contributor-facing document
    that also doubles as a public description of the project (e.g.
    `CONTRIBUTING.md`).
  - Does **not** apply to the UI of the apps themselves: each
    project's own "Mandatory rule: zero mentions in the
    user-facing product" (see every sibling's `spec.md` §4)
    continues to forbid **any** mention, including "usuario/a
    tipo", in `index.html`, `app.js`, `strings.<locale>.js`,
    `js/i18n.js`, `about/privacidad.html` and any other
    user-facing surface. The euphemism is for the outside world,
    not for what the visitor reads on the site.
  - Does **not** apply to project content that names a clinical
    concept by its real-world name (e.g. a Sinonimia dictionary
    entry about a disability certificate in `sinonimia/js/data.es.js`,
    or a Routime activity case study about a real bureaucratic
    procedure): that is content, not labelling of an audience.

### 3.2 Rationale

Presenting the project's real objective in maintainer docs is
useful and necessary for whoever maintains and contributes to the
suite. Presenting it in marketing or landing surfaces is neither
necessary nor respectful of the audience — "usuario/a tipo" lets
public material describe what the apps are for (who the typical
profile is) without publicly naming a clinical group.

---

## 4. No telemetry, no accounts, no remote storage

Every app of the suite is a **fully client-side static site** — no
backend, no database, no telemetry, no third-party runtime, no
accounts, no cookies, no analytics, no remote backup.

- **What ships to the visitor is plain HTML/CSS/JS** served as
  static files from Cloudflare Workers + static assets (or any
  equivalent static host).
- **User data lives only in the visitor's browser** (`localStorage`
  for state, optionally IndexedDB for larger data). The visitor can
  wipe it at any time via the in-app **Settings** route or the
  browser's site-data controls.
- **No `fetch` to external hosts at runtime.** The page may load
  static assets from the same origin; it must not call a third
  party. This includes but is not limited to: AI APIs (Gemini,
  OpenAI, Anthropic, …), analytics (Google Analytics, Plausible,
  …), error reporting (Sentry, …), fonts (Google Fonts, …).
- **Self-hosted typefaces only.** The two fonts the suite uses are
  Atkinson Hyperlegible (400/700) and Nunito (variable 400–900),
  bundled as `.woff2` files under `assets/fonts/`. No CDN, no
  `@import` from `fonts.googleapis.com`.

This rule mirrors itself in the metaproject's
[`../../CLAUDE.md`](../../CLAUDE.md) §A.2.2 (rule "Do not introduce
cross-project dependencies") and §B.5 (graphify sync, the only
sanctioned cross-project tool). The rationale is the same as in
§B.7 below: the threat model of an offline static site is
"whatever a malicious offline page on the same origin could do",
which the browser already sandboxes.

---

## 5. Settings / data-reset pattern

Every PWA-shipping sibling exposes a way for the device's support
person (family, teacher, therapist) to **see and clear what the
local browser stores for that app**. The shape differs per project
but the contract is the same, so contributors don't reinvent it
per app.

### 5.1 Canonical reference

- **Routime** is the canonical implementation. Read
  [`../../../routime/settings/`](../../../routime/settings/) (an
  *out-of-menu* hidden route: `index.html` + `app.js` +
  `strings.<locale>.js` + `styles.css`) and the comments in
  [`../../../routime/settings/app.js`](../../../routime/settings/app.js)
  for the full rationale: two-step confirmation, no analytics, no
  network. Routime also ships a JSON export/import backup because
  its catalogue has 69 activities and the effort is justified
  there.
- **Calculia** has its own `settings/` folder
  ([`../../../calculia/settings/app.js`](../../../calculia/settings/app.js)).
  When touching it, align it with the Routime reference, do not
  duplicate it.

### 5.2 Convention every PWA-shipping sibling follows

1. **One `localStorage` prefix per app.** Declare it as a constant
   near the top of the *root* `app.js` and use it for every key —
   do not invent ad-hoc prefixes. Verified prefixes:

   | Project | Prefix | Evidence |
   |---|---|---|
   | `routime` | `routime:` | canonical, see [`../../../routime/settings/app.js`](../../../routime/settings/app.js) |
   | `calculia` | `calculia:` | [`../../../calculia/settings/app.js`](../../../calculia/settings/app.js) |
   | `memofun` | *TBD — keys seen: `prefs.cursoFijado` (no project prefix)* | needs per-key audit |
   | `okeymoney` | `okeymoney:` (single shared ledger `okeymoney:data`) | [`../../../okeymoney/app.js`](../../../okeymoney/app.js) |
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
     [`routime/tools/piano-keys/`](../../../routime/tools/piano-keys/)'s
     "Delete my progress"). Acceptable for siblings whose catalogue
     is small (1–5 activities) and where a dedicated route would be
     a near-empty shell.

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

### 5.3 Where to apply this pattern

- New sibling: copy the convention table, pick a prefix, add a
  hidden `settings/` route or a main-menu button, and reference
  this section.
- Existing sibling that lacks a reset path: open a per-project PR
  that reads the sibling's own `CLAUDE.md`, follows its rules, and
  lands the minimum viable wipe UI. Do **not** bundle it with
  unrelated work.

---

## 6. Landing typography

The landing uses the same two self-hosted typefaces as the rest of
the suite — **Atkinson Hyperlegible** (weights 400 and 700) and
**Nunito** (variable, 400–900) — bundled as `.woff2` files under
`assets/fonts/` and exposed through the `--font` custom property in
`css/styles.css`. No CDN, no `@import` from `fonts.googleapis.com`.

Apptonomia does not ship a `sw.js`, so there is no `VERSION` to
bump when these files change; the immutable Cloudflare cache
(`_headers`) is what controls freshness for the landing assets.

### 6.1 Implementation detail

`css/styles.css` declares the `--font` custom property pointing at
the local `.woff2` files; every selector that wants the body font
uses `font-family: var(--font)`. The two fonts are bundled once
under `assets/fonts/` and never referenced from a CDN.

### 6.2 Adding a new font

Don't, unless you have a specific reason. The pair was chosen for
legibility (Atkinson Hyperlegible is designed for low vision) and
personality (Nunito for headings). Adding a third font for a
specific landing card is a one-way door that compounds across the
suite — every sibling eventually adopts the same set, and the
total `.woff2` budget starts to matter.

---

### 6.3 Compact main headers

Memofun is the visual reference for the main headers in Calculia, Routime,
Okeymoney, Teclatlon, Ludia and the Apptonomia portal. Use a 44px app mark,
a 28px Nunito title, 8px vertical padding and a 6px row gap. Below 650px,
the mark is 32px and the title is 22px. Supporting text uses regular weight;
utility controls stay aligned and at least 44px high. Language buttons show
full names on desktop and ES/EN on mobile, with full accessible names.
Keep each app's navigation and settings. The portal shows its name once,
with its tagline below. Sinonimia retains its own header. Each app owns its
styles and cache version; no runtime imports from a sibling are needed.

## 7. GEO, AEO and LLMO (search-, answer-engine- and LLM-visibility)

Classic SEO (titles, descriptions, Open Graph, Twitter Card,
hreflang, JSON-LD `SoftwareApplication` / `BreadcrumbList`,
sitemap, robots.txt) is already covered by **`app.config.json` +
`scripts/build-head.js`** in every sibling and by
[`../../scripts/sync-graphify-skill.js`](../../scripts/sync-graphify-skill.js)
at the metaproject level. This section documents the three
additional layers the team has decided to adopt for the metaproject
and all six siblings — **GEO** (Generative Engine Optimization),
**AEO** (Answer Engine Optimization) and **LLMO** (Large Language
Model Optimization) — and the canonical source for each.

> **Status (2026-09-05)**: gaps audited before adding the three
> layers. All seven projects had solid basic SEO and **no**
> `<meta name="geo.*">`, **`FAQPage`/`QAPage`/`SpeakableSpecification`
> JSON-LD**, no RSS/Atom feed, no `/llms.txt`, and no AI-crawler
> directives in `robots.txt`. This §7 documents the pattern that
> will be applied from now on to close those gaps.

### 7.1 GEO — semantic only (Dublin Core)

The suite is global and bilingual (es/en today; open to more),
so pinning `geo.region` / `geo.placename` to a single country
contradicts the scope. The GEO layer adopted here is **semantic
GEO / Dublin Core** — geography-agnostic, understood by modern
crawlers, focused on describing the resource rather than fixing
a coordinate:

- **`DC.title`** = the project's `<title>`.
- **`DC.creator`** = the project's own name (Routime, Calculia…).
  For the Apptonomia portal, `DC.creator = "Apptonomia"`.
- **`DC.subject`** = one-to-three sentences describing the project's
  domain, with no mention of the clinical audience (§3 rule). The
  same sentences as `meta.description`.
- **`DC.description`** = the long description that already lives in
  `app.config.json`.
- **`DC.language`** = `es` or `en` per the current variant; the
  HTML exposes `x-default` for the hreflang convention.
- **`DC.type`** = `InteractiveResource` for a sibling app, or
  `Collection` for the portal (which aggregates the six siblings).
- **`DC.rights`** = a short note about content licensing (e.g.
  "MIT — content CC BY 4.0, see LICENSE").

They are rendered as `<meta name="DC.*">` in the block that
`scripts/build-head.js` inserts between the
`<!-- build:head:start -->` and `<!-- build:head:end -->` markers.
The fields live in `app.config.json` with `dc*` names (`dcCreator`,
`dcSubject`, `dcRights`, …).

### 7.2 AEO — `FAQPage` JSON-LD only (no visible FAQ block)

The AEO layer adopted here is **`FAQPage` JSON-LD, with no visible
"Preguntas frecuentes" block on the landing**, for two reasons
already covered by the suite's broader policy:

- **§3 rule** forbids exposing clinical language in public
  surfaces, and a visible FAQ naturally forces that terrain ("Who
  is this app for?"). An FAQ as JSON-LD can be declared in a
  **machine-readable form only** without publishing the text on
  screen, and still appear as a rich result in search engines that
  support it.
- **§3 rule** also forbids duplicating copy between the landing and
  `doc/` (drift risk between the public surface and the docs).
  Keeping the FAQ as JSON-LD only avoids having two surfaces
  maintained in parallel.

Each project declares 3–5 `{question, answer}` pairs in
`app.config.json > faq[]`, worded literally from the project's
`meta.description` (no clinical language), and `scripts/build-head.js`
injects them into the existing JSON-LD block as an additional
`@type: FAQPage` node in the `@graph` (it does not replace the
existing `SoftwareApplication` or `BreadcrumbList` nodes). If a
visible FAQ ever becomes necessary, that is decided case-by-case
and documented in this same §7.

`QAPage` is **not** adopted (we have no real Q&A threads) and
`SpeakableSpecification` is **not** adopted (the on-site TTS is
designed for the user to hear their own input back, not for
read-aloud assistance). **No** RSS / Atom / JSON Feed is added
yet: the suite is a static site with no meaningful change feed,
and an empty feed would be dead surface.

### 7.3 LLMO — `/llms.txt` and AI-crawler allowances

The LLMO layer covers two things:

1. **`/llms.txt`** at each project's root, following the format
   proposed by [`llmstxt.org`](https://llmstxt.org) (short Markdown
   at the root, optionally complemented by `/llms-full.txt` with
   the full detail). The portal and each sibling expose:

   ```markdown
   # <Project name>

   > One-sentence summary (derived from `meta.description`).

   ## What it is
   - 2-4 short bullets, no clinical language (§3 rule).

   ## What it is NOT
   - 2-4 bullets spelling out explicit exclusions (no backend, no
     accounts, no telemetry, …) that help a model not get the
     summary wrong.

   ## Resources
   - [Calculia](https://calculia.apptonomia.uk/) — short tagline.
   - ...

   ## License
   MIT — code. CC BY 4.0 — content (dictionary entries, decks,
     etc., where applicable).
   ```

   The `<head>` declares `<link rel="alternate" type="text/markdown"
   href="/llms.txt">` so crawlers discover it unambiguously.
   `scripts/build-llms-txt.js` generates it from `app.config.json
   > llms*`.

2. **`robots.txt` allows the known AI crawlers** rather than
   blocking them. A free, no-signup, no-telemetry, open educational
   suite only benefits when the models that cite it can summarise
   it correctly. By default this set is accepted (aligned with
   `User-agent: *` already used in the siblings that have a
   `robots.txt`):

   ```text
   User-agent: GPTBot
   Allow: /

   User-agent: ClaudeBot
   Allow: /

   User-agent: Claude-Web
   Allow: /

   User-agent: anthropic-ai
   Allow: /

   User-agent: cohere-ai
   Allow: /

   User-agent: PerplexityBot
   Allow: /

   User-agent: CCBot
   Allow: /

   User-agent: Google-Extended
   Allow: /

   User-agent: Applebot-Extended
   Allow: /

   Sitemap: https://<domain>/sitemap.xml
   ```

   If a future reason to block a specific crawler arises (e.g.
   someone discovers it ignores `nofollow` or doesn't respect
   licences), a specific `User-agent: <X> / Disallow: /` block is
   added — the global `User-agent: * / Allow: /` is **not**
   changed. That decision is documented here.

### 7.4 Who implements what and where

| Layer | Who emits it | Where it lives | Who verifies it |
|---|---|---|---|
| Classic SEO | `scripts/build-head.js` from `app.config.json` | `index.html` / `site/index.html` | `scripts/check.js` + browser |
| GEO (Dublin Core) | `scripts/build-head.js` from `app.config.json` | `index.html` | `scripts/check.js` (asserts the 7 `<meta name="DC.*">` tags exist) |
| AEO (`FAQPage`) | `scripts/build-head.js` from `app.config.json` | JSON-LD block in `index.html` | `scripts/check.js` (validates `@type FAQPage` + Q/A count ≥ 3) |
| LLMO (`/llms.txt`) | `scripts/build-llms-txt.js` from `app.config.json` | `llms.txt` at the root | `scripts/check.js` (existence + parse + section count) |
| LLMO (AI crawlers) | `scripts/build-robots.js` (or equivalent) | `robots.txt` at the root | `scripts/check.js` (UA-list presence, non-exhaustive) |

`scripts/check.js` will grow in each sibling to apply the new
gates (self-check rows 11–14 in §10 below). The metaproject's
`apptonomia/scripts/check.js` exposes the same four gates adapted
to the portal.

---

## 8. Service worker cache contract

Every PWA-shipping sibling exposes `sw.js` with a `VERSION` string
(e.g. `routime-v3`, `calculia-v22`, `teclatlon-v30`, `sinonimia-v1`, …).
A change to any file listed in that sibling's `ARCHIVOS` /
`FILES` requires bumping `VERSION` in that same sibling.

### 7.1 Why the bump matters

The service worker's `install` handler compares its `VERSION`
against the active cache name and only re-fetches + activates when
they differ. A bump that doesn't land is silent: end users keep
seeing the old cached files until the SW unregisters.

- **Cache-first SWs** (Calculia, Memofun, Okeymoney, Routime,
  Sinonimia): the bump matters in **both online and offline**
  (their `fetch` returns the cached response before trying the
  network).
- **Network-first SWs** (Teclatlon): the bump only affects offline
  — but the same rule is kept in all siblings to keep the directive
  homogeneous and avoid case-by-case reasoning in CI.

The cost of bumping is one integer; the cost of not bumping is
"the user thinks the fix didn't land". Bump liberally rather than
conservatively. See each sibling's own `CLOUDFLARE.md` for the
per-app deploy contract.

### 7.2 The rule, in one line

> Any commit that touches a file listed in the sibling's
> `sw.js` `ARCHIVOS` / `FILES` MUST bump `VERSION` in the same
> commit.

`scripts/check-version-bump.js` enforces this in CI by diffing
against the previous commit and failing when a cached file changed
but `VERSION` did not.

---

## 9. Required file anatomy per sibling

Every sibling (Calculia, Memofun, Okeymoney, Sinonimia, Teclatlon,
Routime) ships the same baseline set of files. New siblings must
follow the same anatomy, and existing siblings are welcome to grow
on top of it but not to deviate. See [`crear-app.md`](crear-app.md)
for the full creation recipe and [`templates/`](../templates/) for
copy-paste file scaffolds.

| File / folder | Required? | Purpose |
|---|---|---|
| `CLAUDE.md` | yes | Operational handbook for AI agents + canonical-source table. |
| `README.md` + `README.es.md` | yes | Public-facing intro (es + en), badges, quickstart. |
| `LICENSE` | yes | MIT. |
| `CONTRIBUTING.md` + `CONTRIBUTING.es.md` | yes | Contribution workflow (es + en). |
| `CODE_OF_CONDUCT.md` + `CODE_OF_CONDUCT.es.md` | yes | Contributor covenant (es + en). |
| `SECURITY.md` + `SECURITY.es.md` | yes | How to report a vulnerability privately. |
| `CLOUDFLARE.md` | yes | Canonical deploy runbook (Cloudflare Workers + static assets). |
| `_headers`, `wrangler.toml`, `404.html` | yes | Cloudflare static-asset host config. |
| `manifest.json` (PWA) | yes (if PWA) | PWA install metadata. |
| `sw.js` (PWA) | yes (if PWA) | Service worker with `VERSION` + `ARCHIVOS`. |
| `index.html` | yes | The app itself (or a landing that links to `tools/`). |
| `app.js` (or `tools/<slug>/app.js`) | yes | Application code (English identifiers, `App.*` core). |
| `strings.es.js` + `strings.en.js` | yes | UI copy (es + en parity enforced). |
| `assets/js/{utils,i18n,tts,storage,feedback}.js` | yes (if reusing shared core) | The shared core. Trimmable per project. |
| `assets/css/styles.css` (or `css/styles.css`) | yes | Design tokens + components. |
| `assets/fonts/*.woff2` | yes | Atkinson Hyperlegible + Nunito, self-hosted. |
| `scripts/check.js` | yes | Plain-Node structural lint + i18n parity check. |
| `scripts/check-version-bump.js` | yes (if PWA) | CI gate for `sw.js` cache bump. |
| `doc/<lang>/{index,spec,roles,team,i18n,technical,quick-guide,readme}.md` | yes | Bilingual docs. |
| `doc/<lang>/activities.md` | yes (if catalogue > 1) | Activity catalogue. |
| `doc/<lang>/creating-elements-guide.md` | yes (if catalogue > 1) | Didactic + gamification + neuromarketing recipes for the audience. |
| `.claude/skills/graphify/` | yes | Per-project knowledge-graph source (synced from `~/.claude/skills/graphify/`). |
| `.graphifyignore` | yes | Per-project exclusions for the graphify skill. |
| `graphify-out/` | yes (regenerated) | Build artifact (gitignored). |
| `settings/` | recommended (PWA) | Hidden reset route, see §5. |
| `llms.txt` | yes | Markdown file at the project root so LLM crawlers can summarise the project correctly (see §7.3). |
| `_redirects` | optional | Static or dynamic redirects (Cloudflare's per-file limit: 2 100). |

---

## 10. Compliance self-check before opening a PR

Open the PR only after every row in this list passes. Each row
points at the doc that explains the rule.

| # | Self-check | Where to look |
|---|---|---|
| 1 | I have not added any clinical term (e.g. "discapacidad intelectual") to a public surface (README, landing, talks, social copy). | §3 above |
| 2 | I have not added the term "usuario/a tipo" to the user-facing UI of any app. | §3 above + each `spec.md` §4 |
| 3 | Every UI string I touched exists in **both** `strings.es.js` and `strings.en.js`. | each `spec.md` + `scripts/check.js` (es/en parity gate) |
| 4 | My UI copy follows UNE 153101 (short sentences, one idea per screen, everyday vocabulary). | §1 above + each `spec.md` §3 |
| 5 | I have not added any third-party runtime call (`fetch` to an external API, Google Fonts, an analytics beacon). | §4 above |
| 6 | If I changed a file listed in the sibling's `sw.js` `ARCHIVOS`, I bumped `VERSION` in the same commit. | §8 above + `scripts/check-version-bump.js` |
| 7 | I have not bundled a `localStorage.clear()` call anywhere; any wipe I added is scoped to the sibling's own prefix. | §5 above |
| 8 | I ran the sibling's `node scripts/check.js` and it passed. | §9 above |
| 9 | I have not edited another sibling from this PR. | metaproject `CLAUDE.md` §A.2.2 |
| 10 | I have not run a deploy. | metaproject `CLAUDE.md` §A.3 |
| 11 | I added (or did not touch) the six `<meta name="DC.*">` in the project's `<head>`, sourced from `app.config.json`. | §7.1 above |
| 12 | I added (or did not touch) the `FAQPage` node in the JSON-LD, with 3–5 `{question, answer}` pairs worded without clinical language (§3). | §7.2 above |
| 13 | I generated (or did not touch) `/llms.txt` at the project root from `app.config.json`, and the head links to it via `<link rel="alternate" type="text/markdown">`. | §7.3 above |
| 14 | The project's `robots.txt` (if it exists or I added it) allows the AI crawlers listed in §7.3 without blocking them. | §7.3 above |

---

## See also

- [`crear-app.md`](crear-app.md) — full recipe for adding a new app
  to the suite, including the file templates under
  [`templates/`](../templates/).
- [`tecnico.md`](tecnico.md) — how the metaproject plumbing works
  (`scripts/sync-graphify-skill.js`, `scripts/check.js`, the
  meta-graph).
- [`i18n.md`](i18n.md) — how to add a new language to the Apptonomia
  landing (es/en are the only locales shipped today).
- [`guia-rapida.md`](guia-rapida.md) — step-by-step for a new
  contributor who just cloned the metaproject.
- The metaproject [`../../CLAUDE.md`](../../CLAUDE.md) §B — the
  suite-wide policies that this guide mirrors in narrative form.
