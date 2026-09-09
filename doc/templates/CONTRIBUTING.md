# Contributing to {{DISPLAY_EN}}

> 🌐 **Other languages:** [Español](CONTRIBUTING.es.md)

Thanks for your interest in contributing to {{DISPLAY_EN}}. This
guide covers the workflow, the project roles, and the small set of
recipes that keep the app consistent across the Miralante suite.

---

## 🔀 GitHub workflow

```text
1. 🔍 Search or create an issue (in Spanish or English)
2. 💬 Comment and agree on scope
3. 🌿 Create a branch (fork if you don't have push access)
4. ✏️  Make changes following the recipes below
5. 📤 Open a Pull Request (PR) referencing the issue
6. 👀 Wait for review
7. ✅ Merge when approved
```

**Issue labels** (used to classify incoming work):

| Label | Meaning |
|---|---|
| `UX` | Usability or experience improvement |
| `content` | Texts, translations, accessibility copy |
| `bug` | Reproducible error in behaviour |
| `tech` | Technical implementation, refactor |
| `docs` | Documentation changes |
| `good first issue` | Suitable for a first contribution |

### Branch conventions

- `feat/<slug>` — new features
- `fix/<slug>` — bug fixes
- `docs/<slug>` — documentation-only changes
- `i18n/<code>` — translation to a language (e.g. `i18n/ca`, `i18n/gl`)

---

## 🤝 Roles in the project

| Role | Who they are | How they participate |
|---|---|---|
| 👤 **End user** | Uses the app | Doesn't read or write code; reports issues |
| ❤️ **Support** | Family, therapist, teacher | Proposes content, wording fixes, difficulty levels |
| 💻 **Build** | Developer | Implements code, maintains architecture, reviews PRs, deploys |

See [`doc/en/roles.md`](doc/en/roles.md) for the full role
description.

---

## 📏 What we expect from a PR

Before opening a PR:

- [ ] `node scripts/check.js` passes locally.
- [ ] If this is a PWA: `node scripts/check-version-bump.js`
      passes, and you bumped `VERSION` in `sw.js` for any cached
      file change.
- [ ] If you touched UI copy, the change exists in **both**
      `strings.es.js` and `strings.en.js`.
- [ ] You tested the change in a real desktop browser (and on
      mobile if the app is a PWA).
- [ ] You did not introduce a third-party runtime (Google Fonts,
      analytics, remote AI).
- [ ] You did not edit another sibling of the suite from this PR.

If you are a new contributor, comment on the issue first so the
maintainer can agree on scope before you start writing code.

---

## 🌐 Translations

To add a new language:

1. Add the locale to `strings.<locale>.js` with the same key set
   as `strings.es.js` + `strings.en.js`.
2. Update the language picker in `index.html` and
   `js/i18n.js`'s `SUPPORTED` list.
3. Add a badge row to `README.md` (the `i18n` badge).
4. Update the metaproject's `apptonomia/js/strings.<locale>.js`
   to add your app's name to the landing's card.

Full recipe: see [`doc/en/i18n.md`](doc/en/i18n.md).

---

## 🤖 Working with AI coding agents

If you use an AI coding agent to help you, point it at the
project's [`CLAUDE.md`](CLAUDE.md) (or equivalent) before it
starts. The agent's workflow is documented there: canonical
sources, mandatory session-start checks, the cache-bump rule,
external / destructive ops policy, and the suite-wide policies
(easy-read, WCAG AAA, public-facing wording, no telemetry).

---

## ⚖️ Code of conduct

All participants are expected to follow
[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

## 🛡️ Security

See [`SECURITY.md`](SECURITY.md) for how to report a suspected
vulnerability privately.

---

## 📄 License

By contributing, you agree that your contributions will be
licensed under the [MIT License](LICENSE).
