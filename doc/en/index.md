# Apptonomia documentation

> Navigation map for the metaproject's own docs. For the **suite as a
> whole**, the cross-project plumbing and the AI agent workflow, see
> [`../../CLAUDE.md`](../../CLAUDE.md); for the canonical Cloudflare
> Workers deploy guide that covers all seven apps of the suite, see
> [`../../CLOUDFLARE.md`](../../CLOUDFLARE.md).
>
> **Landing**: [apptonomia.uk](https://apptonomia.uk) · **Other language**: [Español](../es/indice.md)

---

## 📂 Documentation structure

This repository's `doc/` tree covers the **landing page itself** plus
the **suite-wide docs** that govern every app of the Miralante suite
and the recipe for adding new ones. The cross-project plumbing, the
meta-graph and the operational handbook live in `../../CLAUDE.md`. Each
of the seven apps of the suite has its own repo and its own `doc/` tree.

```
doc/
├── en/
│   ├── index.md                  ← This file (entry point, EN)
│   ├── README.md                 ← Easy-read intro (audience-first)
│   ├── spec.md                   ← Product definition (landing + plumbing)
│   ├── roles.md                  ← The three project roles
│   ├── team.md                   ← Guide for families and support professionals
│   ├── technical.md              ← Architecture, structure, scripts, deploy
│   ├── i18n.md                   ← How the es/en landing UI works
│   ├── contents.md               ← Table of contents (this doc tree)
│   ├── activities.md             ← What the metaproject ships
│   ├── guia-rapida.md            ← Step-by-step how to use Apptonomia
│   ├── guia-de-cumplimiento.md   ← Suite compliance checklist
│   └── crear-app.md              ← Recipe for adding a new sibling
└── es/
    ├── indice.md                 ← Entry point (ES)
    ├── readme.md
    ├── spec.md
    ├── roles.md
    ├── equipo.md
    ├── tecnico.md
    ├── i18n.md
    ├── contenidos.md
    ├── actividades.md
    ├── guia-rapida.md
    ├── guia-de-cumplimiento.md
    └── crear-app.md
```

Plus the file templates folder:

```
doc/
└── templates/                     ← Copy-paste scaffolds for new siblings
    ├── TEMPLATES.md / TEMPLATES.es.md  ← (this folder's intro)
    ├── CLAUDE.md
    ├── README.md / README.es.md
    ├── CONTRIBUTING.md / CONTRIBUTING.es.md
    ├── CODE_OF_CONDUCT.md / CODE_OF_CONDUCT.es.md
    ├── SECURITY.md / SECURITY.es.md
    ├── CLOUDFLARE.md
    ├── LICENSE
    ├── _headers
    ├── wrangler.toml
    ├── 404.html
    ├── sw.js                     ← (PWA only)
    ├── manifest.json             ← (PWA only)
    ├── scripts/
    │   ├── check.js
    │   └── check-version-bump.js ← (PWA only)
    ├── doc/en/readme.md
    └── .github/
        ├── ISSUE_TEMPLATE/bug.md / bug.es.md
        └── workflows/validate.yml
```

---

How to contribute and other repository-root documents (`CLAUDE.md`,
`CONTRIBUTING.md`, `LICENSE`…) live at the repository root.

---

## 🧭 Where to start

| If you want to… | Start with |
|---|---|
| 👤 End user or family member (what the landing is, how to use it) | [`README.md`](README.md) |
| Understand the metaproject, the cross-project plumbing and the agent workflow | [`../../CLAUDE.md`](../../CLAUDE.md) |
| Understand what Apptonomia ships (landing + plumbing) | [`spec.md`](spec.md) |
| Find out about the three project roles | [`roles.md`](roles.md) |
| Help a family member / therapist use an app of the suite | [`team.md`](team.md) |
| Understand the architecture, scripts and deploy of the metaproject | [`technical.md`](technical.md) |
| Add a third locale to the landing | [`i18n.md`](i18n.md) |
| Browse the table of contents | [`contents.md`](contents.md) |
| See what the metaproject ships (seven cards + plumbing + templates) | [`activities.md`](activities.md) |
| Step-by-step how to use Apptonomia | [`guia-rapida.md`](guia-rapida.md) |
| **Suite compliance checklist** (UNE 153101, WCAG AAA, public-facing wording, no telemetry, settings/data-reset, landing typography, cache contract) | [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) |
| **Add a new sibling to the suite** (recipe + file templates) | [`crear-app.md`](crear-app.md) + [`templates/`](templates/) |
| Deploy the landing or any of the seven apps of the suite | [`../../CLOUDFLARE.md`](../../CLOUDFLARE.md) |
| Contribute to this repo | [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md) |
| Browse the metaproject landing | [apptonomia.uk](https://apptonomia.uk) |

---

## See also

- [`../../CLAUDE.md`](../../CLAUDE.md) §A.1 — canonical-source
  table (this repo's canonical sources for each topic).
- The metaproject's `graphify-out-meta/` — visual cross-project
  index (one node per sibling + similarity / hierarchy edges).

## Enroca

[Chess lessons, exercises and play](../../../enroca/README.md). [Project guidance](../../../enroca/CLAUDE.md).
