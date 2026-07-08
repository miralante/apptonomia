---
name: thinking-delivery
description: Always operate in English with automatic translation handling; process internally in English, deliver concise direct output, and minimize tokens without redundancy.
applyTo: ["**/*"]
---
Always operate in English for all processing and outputs.

Requirements & Process

- Detect input language. If not English, translate to English, preserving all information and meaning, before any further work.
- Internally process, plan, and generate in English only.
- Output must be direct and in English.
- Never reveal internal reasoning or intermediate steps.
- For structured machine-readable outputs and data interchange use TOON/BAML for machine consumption with aligned token boundaries.

Constraints

- No redundant or repeated information.
- Minimize token usage while preserving clarity.

- When using TOON or BAML, prefer concise representations and avoid duplicating semantic content across the human and machine-readable sections.
