# Contributing to Apptonomia

> 🌐 **Other languages:** [Español](CONTRIBUTING.es.md)

Thanks for your interest in contributing to Apptonomia. This guide
covers the workflow, the project roles, and the small set of recipes
that keep the portal consistent.

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

Examples:

- `fix/lang-switch-flash`
- `i18n/ca-catalan`
- `docs/improve-readme`

### Commits

- Message in **English** (repo convention), summary in imperative
- One thing per commit — large commits can be asked to be split
- If you close an issue, include `Closes #123` at the end

---

## 📝 What you can contribute

This repo is the **portal landing** of the Apptonomia suite, so most
contributions will be one of:

- **Copy fixes** — typos, clearer wording, accessibility tweaks in
  `strings.es.js` / `strings.en.js`
- **New language** — see [`doc/en/I18N.md`](doc/en/I18N.md) §5
- **Accessibility** — contrast, focus order, focus visibility, reduced
  motion, ARIA labels
- **SEO / metadata** — `<meta>` tags, JSON-LD, `og:` / `twitter:` cards
- **Bug fixes** — anything that breaks in any supported browser
- **Security headers / CSP** — tightening the policy in [`_headers`](_headers)

Each of those is small enough that the recipes below should cover it
without a separate architecture review.

---

## 🌐 Recipes

### Copy fix

1. Edit `strings.es.js` (Spanish is the source of truth per the
   project's language policy).
2. Mirror the change in `strings.en.js`.
3. If the change touches visible HTML structure, run
   `node scripts/check.js` to verify key parity.
4. Open a PR with a one-line description.

### New language

See [`doc/en/I18N.md`](doc/en/I18N.md) §5 for the full step-by-step
(register the locale in `bootstrap.js`, add a `strings.<locale>.js`,
add a language button to `index.html`, mirror in both strings files).
The architecture is multi-locale-ready from the start: the page goes
through `App.i18n.t()` and `data-i18n` attributes, so adding a
language requires **no changes** to the bootstrap or `script.js`.

### Accessibility fix

Read [`SPEC.md`](SPEC.md) (or `doc/en/SPEC.md`) §3 first — the
non-negotiable product constraints are buttons ≥ 64×64 px, WCAG AA
contrast, easy-read copy, and no-pressure feedback. Anything that
breaks them will be rejected.

### Adding or tightening a security header

Headers live in [`_headers`](_headers). The CSP is intentionally tight
(`script-src 'self'`, no inline scripts; the JSON-LD block is parsed
as data and does not require `unsafe-inline`). Tightening is welcome;
loosening almost never is — open an issue first.

---

## ✅ Checklist before opening a PR

- [ ] `node scripts/check.js` passes locally (the project ships one).
- [ ] If you added UI strings, `es` and `en` are in sync.
- [ ] You tested in at least one real desktop browser (Chrome /
      Firefox / Safari).
- [ ] You did not add any new runtime dependency (vanilla HTML/CSS/JS
      only — see [`doc/en/technical.md`](doc/en/technical.md) §1).
- [ ] You did not loosen the CSP in `_headers` without an issue.

---

## 🚫 What this repo does NOT accept

- **Loosening the CSP** (`script-src 'self'` stays strict — inline
  scripts are not allowed; the JSON-LD block is fine because it is
  data, not code).
- **New runtime dependencies** — vanilla HTML/CSS/JS only, no npm, no
  CDNs, no build step.
- **Adding analytics / telemetry / third-party calls of any kind.**
- **Personal data** of any kind — the portal is a public landing; it
  does not collect anything.
- **A SPA, a router, or a build step.** The portal is one page; if
  you find yourself reaching for a router, you're solving the wrong
  problem.

---

## 📞 Communication

- **Issues** → main channel for proposals, bugs, questions
- **Pull Request reviews** → for review of specific changes

---

## 📜 Code of conduct

This project follows [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).
Participating means accepting it.

---

## 🙏 Thanks

Thanks for devoting time to a tool that helps people learn at their own
pace.