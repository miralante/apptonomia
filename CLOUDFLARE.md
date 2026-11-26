# Cloudflare Workers (static assets) — Apptonomia

> **Deploy:** automatic on every push to `main` through the Cloudflare Git connector; Workers Builds deploys the repo and GitHub Actions only validates. The Cloudflare dashboard is the source of truth for project settings. This is a Worker with static assets, not classic Pages. Live at <https://apptonomia.uk>.

## Configuration

| Setting | Value |
|---|---|
| Worker | `apptonomia` |
| Production branch | `main` |
| Framework preset | None |
| Build command | (empty) |
| Output / root | `.` / repository root |
| GitHub workflow | [`.github/workflows/validate.yml`](.github/workflows/validate.yml) — `npm run lint`, `npm run lint:markup`, and `npm run test:ui` on pushes and pull requests |

`wrangler.toml` is the deploy configuration: it pins the Worker name, serves `[assets] directory = "."` without a `main` script, and sets `not_found_handling = "404-page"`. Keep it; do not convert this project to classic Pages (`pages_build_output_dir` or `wrangler pages deploy`). Workers Builds reads it directly.

`_headers` applies security and cache headers at deploy time; no dashboard rules are needed. No environment variables or Cloudflare service-account keys are required. `package.json` defines the suite gate scripts. No `_redirects` or `functions/`.

## Routing and Workers.dev

Cloudflare serves static Worker assets through an active `workers.dev` subdomain or custom domain. A deployment can succeed yet serve nothing without an active route. If a Worker shows **No active routes**, enable its Workers.dev subdomain under **Workers & Pages → `apptonomia` → Settings → Triggers**. If only a route table is available, add `*/*` on the account's `workers.dev` zone for Worker `apptonomia`. Routes are dashboard settings, not `wrangler.toml`; enabling one needs no rebuild. If a deployment is not active afterward, retry or promote the latest successful deployment.

The landing is the apex domain. `www.apptonomia.uk` redirects to it with a dashboard-configured 308.

## Cache and service worker

No service worker: this is a landing page, not an installable PWA. `_headers` serves every asset as `no-cache, must-revalidate`. The CSP is strict (`default-src 'self'`, no third-party CDN or inline scripts, system fonts); pictograms are Unicode glyphs, so `img-src` can stay `'self' data:`.

## Deploy, rollback, and domains

Push to `main` to deploy automatically. Workers Builds handles production deploys, so no local `wrangler login` or GitHub deploy secret is needed. For a manual deployment or preview, run `npx wrangler deploy` (Wrangler reads `wrangler.toml`). To rebuild in the dashboard, open **Workers & Pages → apptonomia → Create deployment**. Roll back in **Deployments** by retrying or rolling back to a prior successful version.

To add a custom domain, use **Workers & Pages → `apptonomia` → Custom domains → Set up a custom domain**. Cloudflare configures DNS for a zone in the account; otherwise follow the wizard's DNS instructions. Current setup: `apptonomia.uk` is the apex custom domain; its DNS is in the same Cloudflare account.

There are no API tokens or secrets to rotate. The GitHub integration uses OAuth; revoke access at [github.com/settings/applications](https://github.com/settings/applications).

## Project-specific notes

The portal makes no server-side calls; linked suite apps are client-side too. The `www` redirect is configured in Cloudflare, not this repository.

## References

- [`wrangler.toml`](wrangler.toml) — Worker and asset configuration.
- [`_headers`](_headers) — security and cache policy.
- [`.github/workflows/validate.yml`](.github/workflows/validate.yml) — validation; it does not deploy unless stated above.
- [`CLAUDE.md`](CLAUDE.md) — agent workflow and, where applicable, the canonical service-worker cache contract (§B.1).
- [Miralante's shared Cloudflare runbook](https://github.com/miralante/apptonomia/blob/main/CLOUDFLARE.md) — common setup and recovery steps.
