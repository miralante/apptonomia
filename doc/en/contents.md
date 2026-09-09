# Contents — Apptonomia documentation

> 🌐 **Other language:** [Español](../es/contenidos.md)

This is the **table of contents** for the Apptonomia metaproject
documentation. The entry point is [`index.md`](index.md) (English)
or [`indice.md`](../es/indice.md) (Spanish).

---

## Block A — Workflow

| # | Document | Audience |
|---|---|---|
| A.1 | [`index.md`](index.md) — this folder's entry point (you are here) | Everyone |
| A.2 | [`roles.md`](roles.md) — the three project roles | Support professionals, developers |
| A.3 | [`spec.md`](spec.md) — what Apptonomia is, who it's for, the non-negotiables | New contributors |
| A.4 | [`team.md`](team.md) — guide for families and support professionals | Families, therapists, teachers |
| A.5 | [`technical.md`](technical.md) — architecture, structure, scripts, deploy | Developers |
| A.6 | [`i18n.md`](i18n.md) — how the es/en landing UI works, recipe to add a locale | Translators, developers |

## Block B — Suite-wide policies and recipes

| # | Document | Audience |
|---|---|---|
| B.1 | [`guia-de-cumplimiento.md`](guia-de-cumplimiento.md) — suite compliance checklist (UNE 153101, WCAG AAA, public-facing wording, no telemetry, settings / data-reset, landing typography, cache contract) | Everyone |
| B.2 | [`crear-app.md`](crear-app.md) — recipe for adding a new sibling | Developers of new apps |
| B.3 | [`activities.md`](activities.md) — what the metaproject ships (six cards + plumbing + templates) | New contributors |

## Block C — File templates

| # | Document / folder | Audience |
|---|---|---|
| C.1 | [`templates/`](templates/) — copy-paste scaffolds for new siblings | Developers of new apps |

---

## Other repo documents (not in `doc/`)

These live at the repo root, not under `doc/`:

| Document | Audience |
|---|---|
| [`../../README.md`](../../README.md) | Public intro (English) — what the landing is |
| [`../../README.es.md`](../../README.es.md) | Public intro (Spanish) |
| [`../../CLAUDE.md`](../../CLAUDE.md) | Operational handbook for AI agents + canonical-source table |
| [`../../CLOUDFLARE.md`](../../CLOUDFLARE.md) | Cloudflare deploy runbook |
| [`../../CONTRIBUTING.md`](../../CONTRIBUTING.md) | Contribution workflow |
| [`../../CONTRIBUTING.es.md`](../../CONTRIBUTING.es.md) | Contribution workflow (Spanish) |
| [`../../CODE_OF_CONDUCT.md`](../../CODE_OF_CONDUCT.md) | Contributor Covenant |
| [`../../CODE_OF_CONDUCT.es.md`](../../CODE_OF_CONDUCT.es.md) | Contributor Covenant (Spanish) |
| [`../../SECURITY.md`](../../SECURITY.md) | How to report a vulnerability |
| [`../../SECURITY.es.md`](../../SECURITY.es.md) | Cómo reportar una vulnerabilidad |
| [`../../LICENSE`](../../LICENSE) | MIT licence |

Each sibling of the suite (Calculia, Memofun, Okeymoney, Sinonimia,
Teclatlon, Routime) has its own `doc/<lang>/` tree with the same
shape. They are the canonical product / support / technical docs
for each sibling — this `doc/` only covers the metaproject +
landing.
