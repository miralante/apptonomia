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

- **Mounts.** Every page mounts the shared header with `data-suite-header` and the
  shared footer with `data-suite-footer`. A mount that already has children is
  skipped. The page's own content is not part of the block: it sits next to the
  mount, inside the same `<header>` or `<footer>` (the tool's back link, title and
  stars; teclatlon's "clear my progress" button; sinonimia's ARASAAC credits).
- **Header.** Draws the brand (`core.chrome.appName`) and the locale picker, which
  is the ⚙️ drawer with language, theme, text size and high contrast. Pages whose own
  markup already names the app use `data-suite-brand="off"`, so the mount draws only
  the picker in the control block the page already had.
- **Footer.** Links to the portal, `about/`, `legal/` and, with
  `data-suite-settings`, `config/`. `data-suite-base` sets the relative path to
  the app root; `data-suite-contact` adds a mailto link.
- **Labels.** The header needs one string, `core.chrome.appName`, in the app's
  locale files. The footer labels (`core.chrome.portal`, `about`, `legal`,
  `settings`) have built-in es and en defaults, so an app needs no strings for them.
  An app may still word them itself; its value wins over the default. The footer
  labels carry `data-suite-label`, not `data-i18n`: an app's own translation pass
  rewrites every `data-i18n` node it has no key for (calculia does), so the labels
  are drawn by the block and redrawn when `<html lang>` or `data-lang` changes.
- **Order.** `suite-chrome.js` must run before `locale-picker.js`. Both are usually
  deferred, so the block goes first in the document: the picker looks for
  `#locale-picker` when it runs, and the header mount draws it.
- **Timing.** The script renders as soon as it runs, which must happen after the
  mounts it fills. It also renders again on `DOMContentLoaded`, so it works from
  `<head>` too.
- **Markup audit.** `scripts/sync-suite-chrome.js` checks every HTML page of the
  suite for both mounts and for both scripts (`suite-chrome.js`, `locale-picker.js`),
  and fails on the old `data-pie-app` marker. A page that cannot carry them is listed
  in `AUDIT_EXEMPT` with its reason.

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

- **sinonimia** keeps its own i18n (not `App.i18n`). Its footer carries the ARASAAC
  credits and the offline controls, next to the footer mount.
- **teclatlon `index.html`** keeps its "clear my progress" button next to the footer
  mount, and its header mount sits in its own tool header.
- **Tool pages** (`tools/`): the shared header mount comes first; the back link,
  the title and the star counter stay in the tool's own `tool-header`, which is a
  function of the activity.
- **`doc/templates/app-template/index.html`** is an example of the markup. Its i18n
  core is the app's own.
- **Stubs**: `apptonomia/project/index.html` (the slide deck, with its own footer)
  and `ludia/refresh.html` and `ludia/legal/index.html` (redirect stubs) are not
  audited.
- **404 pages** mount the header and the footer like any page. Some of them, for
  example calculia's, also redirect to the home page with `meta refresh`, so the
  visitor may not see them for long.

## Related

- [`../../scripts/suite/`](../../scripts/suite/) — the canonical sources.
- [`crear-app.md`](crear-app.md) — the recipe for a new sibling, which runs the
  sync scripts as part of the bootstrap.
- [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) — the suite compliance
  checklist.
