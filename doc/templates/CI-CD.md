# CI/CD and Cloudflare deployment — {{DISPLAY}}

> **Deploy:** {{DEPLOY_MODE}}. The Cloudflare dashboard is the source of truth for project settings. This is a Worker with static assets, not classic Pages. {{LIVE_URL_NOTE}}

## Configuration

| Setting | Value |
|---|---|
| Worker | `{{SLUG}}` |
| Production branch | `{{PRODUCTION_BRANCH}}` |
| Framework preset | None |
| Build command | {{BUILD_COMMAND}} |
| Output / root | `.` / repository root |
| GitHub workflow | [`{{WORKFLOW}}`]({{WORKFLOW}}) — {{CHECKS}} |

`wrangler.toml` is the deploy configuration: it pins the Worker name, serves `[assets] directory = "."` without a `main` script, and sets `not_found_handling = "404-page"`. Keep it; do not convert this project to classic Pages (`pages_build_output_dir` or `wrangler pages deploy`). Workers Builds reads it directly. {{BUILD_DETAIL}}

`_headers` applies security and cache headers at deploy time; no dashboard rules are needed. No environment variables or Cloudflare service-account keys are required. {{FILES_DETAIL}}

## Routing and Workers.dev

Cloudflare serves static Worker assets through an active `workers.dev` subdomain or custom domain. A deployment can succeed yet serve nothing without an active route. If a Worker shows **No active routes**, enable its Workers.dev subdomain under **Workers & Pages → `{{SLUG}}` → Settings → Triggers**. If only a route table is available, add `*/*` on the account's `workers.dev` zone for Worker `{{SLUG}}`. Routes are dashboard settings, not `wrangler.toml`; enabling one needs no rebuild. If a deployment is not active afterward, retry or promote the latest successful deployment.

{{ROUTING_DETAIL}}

## Cache and service worker

{{CACHE_DETAIL}}

## Deploy, rollback, and domains

{{OPS_DETAIL}}

To add a custom domain, use **Workers & Pages → `{{SLUG}}` → Custom domains → Set up a custom domain**. Cloudflare configures DNS for a zone in the account; otherwise follow the wizard's DNS instructions. Current setup: {{DOMAIN_DETAIL}}

There are no API tokens or secrets to rotate. The GitHub integration uses OAuth; revoke access at [github.com/settings/applications](https://github.com/settings/applications).

## Project-specific notes

{{PROJECT_NOTES}}

## References

- [`wrangler.toml`](wrangler.toml) — Worker and asset configuration.
- [`_headers`](_headers) — security and cache policy.
- [`{{WORKFLOW}}`]({{WORKFLOW}}) — validation; it does not deploy unless stated above.
- [`CLAUDE.md`](CLAUDE.md) — agent workflow and, where applicable, the canonical service-worker cache contract (§B.1).
- [Miralante's shared Cloudflare runbook](https://github.com/miralante/apptonomia/blob/main/CI-CD.md) — common setup and recovery steps.
