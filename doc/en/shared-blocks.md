# Shared blocks

A **shared block** is code that every suite app uses and that is defined
once, in the metaproject, then copied into each app. The copy is byte for
byte, so a block never drifts between apps. This page lists the blocks, where
each one is copied, and how to change or extend them. The rule behind it is
in [`../../CLAUDE.md`](../../CLAUDE.md) (§ "Shared components: one definition").

> 🌐 **Other language:** [Español](../es/bloques-compartidos.md)

## The rule

- The canonical source lives in `apptonomia/scripts/suite/`.
- Never edit a copy inside an app. The next `--apply` overwrites it, and the
  `--check` mode reports the drift as a failure.
- Change the canonical file, run the sync script with `--apply`, then refresh
  the asset tokens and bump the service-worker `VERSION` of every app that
  changed (see below).

## The blocks

| Block | Canonical source | Copied into | Sync script |
|---|---|---|---|
| **suite-chrome** (shared header and footer) | `scripts/suite/suite-chrome.js` (whole file) and `scripts/suite/suite-chrome.css` (marked block) | JS: `assets/js/suite-chrome.js`. CSS: the app's shared stylesheet. Targets: the scaffold, calculia, routime, memofun, okeymoney, teclatlon | `scripts/sync-suite-chrome.js` |
| **answer-round** (right and wrong answer, hint) | `scripts/suite/answer-round.js` and `.css` (marked blocks) | `assets/js/feedback.js` and the shared stylesheet. Targets: calculia, memofun, okeymoney, routime, teclatlon, the scaffold (JS only) | `scripts/sync-answer-round.js` |
| **reward-screen** (closing screen with stars) | `scripts/suite/reward-screen.js` and `.css` (marked blocks) | same as answer-round | `scripts/sync-answer-round.js` |
| **celebrate** | `scripts/suite/celebrate.js` and `.css` (marked blocks) | same as answer-round | `scripts/sync-answer-round.js` |
| **stars-engine** (`window.MiralanteStars`) | `scripts/suite/stars-engine.js` (whole file) | `assets/js/stars-engine.js` (sinonimia: `js/stars-engine.js`). Targets: calculia, memofun, routime, sinonimia, teclatlon, the scaffold | `scripts/sync-stars-engine.js` |
| **achievements-engine** (`window.ApptonomiaAchievements`) | `scripts/suite/achievements-engine.js` (whole file) | `assets/js/achievements-engine.js`. Targets: calculia, okeymoney, memofun, routime, teclatlon, the scaffold | `scripts/sync-achievements-engine.js` |

Two kinds of copy exist:

- **Whole file** (suite-chrome.js, stars-engine.js, achievements-engine.js): the
  app's file is the canonical file. The sync creates it when it is missing.
- **Marked block** (answer-round, reward-screen, celebrate, suite-chrome.css):
  only the text between `/* suite:<name>:begin` and `/* suite:<name>:end */` is
  owned by the block. The rest of the file belongs to the app. A missing block
  is inserted (JS: before the IIFE's last `})();`; CSS: at the end of the file).

## Commands

Run from `apptonomia/`:

```bash
node scripts/sync-suite-chrome.js            # --check (default): report drift, change nothing
node scripts/sync-suite-chrome.js --apply    # copy the canonical sources where they differ
```

The other sync scripts take the same two modes. Check mode exits with code 1
when any copy differs, so it can run in a gate.

After `--apply` on an app:

```bash
cd ../calculia                              # any sibling; the scaffold is apptonomia/doc/templates
node ../scripts/asset-tokens.js calculia    # refresh ?v= tokens of the changed files
node scripts/check.js                       # the app's structural gate
```

Never type a `?v=` value by hand (see [`../../scripts/ASSET-TOKENS.md`](../../scripts/ASSET-TOKENS.md)).

## suite-chrome in detail

The header and footer block is the one most often changed, so it has its own
contract. The full usage comment is at the top of `scripts/suite/suite-chrome.js`.

- **Mounts.** A page declares `<header data-suite-header>` and/or
  `<footer data-suite-footer>`. A mount that already has children is skipped.
- **Header.** Draws the locale picker, and the brand (`core.chrome.appName`)
  unless the mount has `data-suite-brand="off"`. Pages whose own title already
  names the app use the picker-only form, so the existing control block is
  replaced in place.
- **Footer.** Links to the portal, `about/`, `legal/` and, with
  `data-suite-settings`, `config/`. `data-suite-base` sets the relative path to
  the app root; `data-suite-contact` adds a mailto link.
- **Labels.** Written with `data-i18n` keys `core.chrome.appName`,
  `core.chrome.portal`, `core.chrome.about`, `core.chrome.legal` and
  `core.chrome.settings`. They live in the `core` namespace of each app's core
  dictionary (`assets/js/i18n.js`, es and en). An app whose `strings.<locale>.js`
  redefines `core` must repeat the `chrome` block there too, because the later
  `register()` replaces the whole namespace.
- **Timing.** The script renders as soon as it runs, which must happen after the
  mounts it fills. It also renders again on `DOMContentLoaded`, so it works from
  `<head>` too. The locale picker is deferred, so it finds its container
  already drawn.

## Adding an app

1. Get the maintainer's approval for the rollout. The rule for cross-project
   changes is in [`../../CLAUDE.md`](../../CLAUDE.md) § A.2.2.
2. Add one line to the list of targets (`TARGETS` or `APPS`, depending on the
   script) of the sync script of each block the app will take.
3. Run the sync with `--apply`, then the asset tokens, then the app's
   `scripts/check.js`.
4. For a PWA, add the new file to the service worker's cache list and bump its
   `VERSION` in the same change.

## Known exceptions

- **sinonimia** takes the stars and achievements engines, but not suite-chrome.
  Its footer carries the ARASAAC credits and the offline controls, and its i18n
  is not `App.i18n`.
- **teclatlon `index.html`** keeps its own footer: it holds the "clear my
  progress" button, which the shared footer does not provide.
- **Activity pages** (`tools/`) keep their own header. The back link and the
  star counter are functions of the activity, not of the suite.
- **The scaffold's `doc/templates/app-template/index.html`** is an example of the
  markup. Its i18n core is the app's own.
- **`404.html` and `offline.html` pages** are standalone: their texts are written
  by hand and they load neither i18n nor the suite scripts, so they do not mount
  the footer. The 404 pages of calculia, routime, okeymoney and teclatlon redirect
  to the home page with `meta refresh`, so the footer would never be seen.
- **The apptonomia portal** (`index.html`, `about/`, `legal/`, `project/`, `dev/`)
  does not mount the shared footer: it is the suite's front page, not a sibling app,
  and the shared footer's "back to the portal" link would point at the page itself.
  `team/index.html` has no footer.

## Related

- [`../../scripts/suite/`](../../scripts/suite/) — the canonical sources.
- [`crear-app.md`](crear-app.md) — the recipe for a new sibling, which runs the
  sync scripts as part of the bootstrap.
- [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) — the suite compliance
  checklist.
