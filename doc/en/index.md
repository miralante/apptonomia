# Apptonomia documentation

> Web application for occupational therapy activities for people with intellectual disability.
>
> **App**: [apptonomia.web.app](https://apptonomia.web.app) · **Repository**: [github.com/thenkdframe/apptonomia](https://github.com/thenkdframe/apptonomia)

---

## 👥 Roles in the project

Apptonomia has **three differentiated roles**. Each has its own space:

| Role | Who they are | How they participate | Where to look first |
|---|---|---|---|
| 👤 **End user** (person with intellectual disability) | The person who practices the activities | Uses the app autonomously. **Does not participate** in development. | The application |
| ❤️ **Support**: family, caregiver, therapist, teacher | Person close to the end user | Accompanies, supervises, and provides content (what activities are missing, if wording is clear, if difficulty is right). | [`team.md`](team.md) |
| 💻 **Construction**: developer | The person who programs the application | Implements code, maintains architecture, reviews PRs, deploys. | [`technical.md`](technical.md) |

> 💡 **The end user is always the center of the product**, but does not
> contribute to development nor read this technical documentation. Technical
> decisions are made by support people and developers on GitHub.

---

## 🤝 Multidisciplinary project

Apptonomia brings together **support people** (therapists, families, teachers)
and **developers**, coordinated on GitHub.

> 👉 **Want to participate?** Start with [`CONTRIBUTING.md`](../../CONTRIBUTING.md)
> (at the repo root). It explains the GitHub workflow, labels, branches and
> per-profile checklists.

---

## 🗺️ Documentation map

If you don't know where to start, here's the recommended reading order:

1. **`README.md`** — Quick intro: what it is, how to open it, what's there
2. **`SPEC.md`** — Product definition: what it's for, who it's for, which rules are never broken
3. **`technical.md`** — How the app is built (only if you're going to code)
4. The rest, depending on your role

| Document | What it contains | When to read it |
|---|---|---|
| `README.md` | Brief intro, how to open the app | First contact |
| `SPEC.md` | Product definition (what it is, who it's for, non-negotiable constraints) | To understand the project's philosophy |
| `quick-guide.md` | How to use the app step by step | For users and families |
| `activities.md` | Complete catalog of all 57 activities | To choose what to use |
| `team.md` | How to use Apptonomia in therapy | Occupational therapists and families |
| `technical.md` | Architecture, core APIs, development recipes | Developers |

---

## 🚦 Routes by profile

| If you are… | Your role in the project | You want… | Then… |
|---|---|---|---|
| 👤 End user or direct family member | End user / initial support | [`quick-guide.md`](quick-guide.md) (how to use it) | [`activities.md`](activities.md) (what's there) |
| ❤️ Therapist, family or support professional | Support (contributes content) | [`team.md`](team.md) (how to use Apptonomia) | [`activities.md`](activities.md) (what's there) · [`SPEC.md`](SPEC.md) §3 (rules your content must not break) |
| 👩‍🏫 Teacher | Educational support | [`quick-guide.md`](quick-guide.md) | [`activities.md`](activities.md) (filter by level) |
| 💻 Developer | Construction (implements) | [`technical.md`](technical.md) (architecture, recipes) | [`CONTRIBUTING.md`](../../CONTRIBUTING.md) (GitHub workflow, checklists) |
| 🌐 Translator | Construction (language parity) | [`I18N.md`](../I18N.md) (multilanguage system) | [`CONTRIBUTING.md`](../../CONTRIBUTING.md) (`i18n/*` labels) |
| 🤔 I just want to understand what this is | Curious | [`SPEC.md`](SPEC.md) (product definition) | — |

---

## 🇬🇧 English

### Product definition
- [SPEC](SPEC.md) — WHAT Apptonomia is, WHO it's for, and why

### For end users and families
- [README](README.md) — What is Apptonomia? Main features
- [Quick guide](quick-guide.md) — How to use the app step by step
- [Activities](activities.md) — Complete catalog of all 57 tools

### For professionals and families (support role)
- [Guide for professionals](team.md) — How to use Apptonomia in therapy

### For developers (construction role)
- [Technical information](technical.md) — Architecture, API, deployment

---

## 🇪🇸 Español

### Definición del producto
- [SPEC](../es/SPEC.md) — QUÉ es Apptonomia, PARA QUIÉN es y por qué

### Para personas usuarias y familias
- [README](../es/README.md)
- [Guía rápida](../es/guia-rapida.md)
- [Actividades](../es/actividades.md)

### Para profesionales y familias (rol de apoyo)
- [Guía para profesionales](../es/equipo.md)

### Para desarrolladores (rol de construcción)
- [Información técnica](../es/tecnico.md)

---

## 📂 Documentation structure

```
doc/
├── index.md           ← This file (entry point)
├── es/
│   ├── SPEC.md       ← Product definition
│   ├── README.md     ← For users
│   ├── guia-rapida.md
│   ├── actividades.md
│   ├── equipo.md     ← For professionals
│   └── tecnico.md    ← For developers
└── en/
    ├── SPEC.md       ← Product definition
    ├── README.md     ← For users
    ├── quick-guide.md
    ├── activities.md
    ├── team.md       ← For professionals
    └── technical.md  ← For developers
```

---

## 🔗 Repository root documents

| Document | What it contains |
|---|---|
| [`README.md`](../../README.md) | Quick presentation of the repo and project roles |
| [`CONTRIBUTING.md`](../../CONTRIBUTING.md) | How to contribute (therapists, families, devs) |
| `CLAUDE.md` | Operational workflow, coordination and approvals for AI agents |
| Project history | Lives in Git (`git log`); no external roadmap is maintained. |
| `doc/I18N.md` (and EN at `doc/en/I18N.md`) | Multilanguage architecture (ES/EN) and how to add a language |
| `agent.md` | Compatibility pointer that redirects to `CLAUDE.md` |

---

## ℹ️ Project info

| Fact | Value |
|------|-------|
| Current version | 4.0 |
| Last updated | 2026-07-15 |
| Languages | Spanish (Spain), English |
| Number of activities | 57 |
| Number of modules | 6 |
| License | MIT |
