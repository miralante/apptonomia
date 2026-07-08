# Agent Configuration

> **This file is a pointer, not a source of truth.**
> The original content described a design (dark neon theme, Inter font, 3 tools)
> that was replaced in 2025–2026 by an accessible light theme and 28 activities.

If you are an AI coding agent working on this repository, read in this order:

1. **`CLAUDE.md`** — mandatory rules (accessibility, conventions, what NOT to do)
   and current project status. These rules override everything else.
2. **`SPEC.md`** — current technical specification: architecture, modular design,
   shared core APIs (`window.App.*`), and step-by-step recipes for developing
   new activities and new therapeutic modules.
3. **`I18N.md`** — multilingual (ES/EN) architecture: how `App.i18n` works, the
   `strings.js`/`data.js` text patterns, and the step-by-step recipe for adding a
   new language.
4. **`PLAN.md`** — roadmap, activity catalog and therapeutic taxonomy.

Quick facts:

- **UI language:** Spanish (Spain), Easy-Read (Lectura Fácil). Code in English.
- **Stack:** HTML5 + CSS3 + vanilla JS. No frameworks, no build step, no backend,
  no runtime npm dependencies. `localStorage` only.
- **Theme:** light, high-contrast, accessible (WCAG AA). Never dark/neon.
- **When touching cached files:** update the `ARCHIVOS` list and bump `VERSION` in `sw.js`.
