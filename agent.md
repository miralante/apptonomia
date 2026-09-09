# agent.md — compatibility pointer (alternate filename)

> **This file is a compatibility pointer, not a source of truth.** It
> mirrors [`AGENTS.md`](AGENTS.md) for AI agents and tools that look up
> an `agent.md` file by name. The authoritative AI agent workflow for
> this repository is [`CLAUDE.md`](CLAUDE.md); the canonical suite-wide
> docs are in [`doc/`](doc/) — see the entry point at
> [`doc/en/index.md`](doc/en/index.md) (English) or
> [`doc/es/indice.md`](doc/es/indice.md) (Spanish).

If you are an AI agent working on this repository:

1. Read [`CLAUDE.md`](CLAUDE.md) first — operational handbook +
   suite-wide policies (Block A.1 canonical-source table).
2. Use the canonical-sources table inside `doc/` to pick the
   source of truth for the topic:
   - **Suite compliance** (UNE 153101, WCAG AAA, public-facing
     wording, no telemetry, settings/data-reset, landing
     typography, cache contract) →
     [`doc/en/guia-de-cumplimiento.md`](doc/en/guia-de-cumplimiento.md)
     ↔
     [`doc/es/guia-de-cumplimiento.md`](doc/es/guia-de-cumplimiento.md)
   - **Creating a new sibling** (recipe + file templates) →
     [`doc/en/crear-app.md`](doc/en/crear-app.md) ↔
     [`doc/es/crear-app.md`](doc/es/crear-app.md) +
     [`doc/templates/`](doc/templates/)
   - **File templates for new siblings** (CLAUDE.md, README.md,
     sw.js, scripts/check.js, doc tree) →
     [`doc/templates/`](doc/templates/)
3. Do not duplicate `CLAUDE.md` or `doc/` content here. Keep
   `agent.md` as a pointer.
