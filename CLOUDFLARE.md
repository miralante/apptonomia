# Cloudflare Pages — Apptonomia

**Canonical URL:** https://apptonomia.pages.dev

Apptonomia is deployed on **Cloudflare Pages**, using its built-in
GitHub integration. There is no custom GitHub Actions workflow — the
Cloudflare dashboard owns the build and deploy.

## How it works

1. The repo `miralante/apptonomia` is connected to a Cloudflare Pages
   project named `apptonomia`.
2. Every push to `master` triggers a Pages build in Cloudflare's
   infrastructure.
3. The build is a no-op: no `build command`, no `output directory` other
   than `.`, so the static files are served as-is.
4. `wrangler.toml` pins the project name and the build output directory;
   the dashboard configuration is the source of truth at deploy time.
5. The `ci.yml` GitHub Action still runs on every push and PR to gate
   structural, i18n and secrets checks, but it does not deploy.

The `apptonomia.pages.dev` subdomain is assigned by Cloudflare from
the project name `apptonomia` declared in `wrangler.toml`. The URL
itself is not a setting in `wrangler.toml` — it lives in the Cloudflare
dashboard and is documented here only as a reference.

## Files in this repository

| File | Purpose |
|---|---|
| `wrangler.toml` | Project name (`apptonomia`) and `pages_build_output_dir = "."` only |
| `_headers` | Cache and security headers, replaces `firebase.json` `headers` |
| `_redirects` | `/* → /index.html 200` SPA rewrite, replaces `firebase.json` `rewrites` |
| `.github/workflows/ci.yml` | `node scripts/check.js`, i18n smoke and secrets scan on every push/PR (does **not** deploy) |

`wrangler.toml` is intentionally minimal: only `name` and
`pages_build_output_dir`. Workers-only keys (`production_branch`,
`compatibility_date`, `[build]`, `[env]`, `[vars]`, `main`,
`[[routes]]`) are not valid here — the connector will mis-detect the
project as a Worker and run `wrangler deploy` instead of
`wrangler pages deploy`, which fails with "Missing entry-point to
Worker script or to assets directory".

## Configuration in Cloudflare

When the project is set up in the Cloudflare dashboard:

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | *(empty)* |
| Build output directory | `.` |
| Production branch | `master` |
| Root directory | *(empty — repo root)* |

No environment variables are required: the app makes no server-side calls.

## Required Cloudflare headers

The site uses a `_headers` file at the repo root to set cache and
security headers, and `_redirects` for the SPA rewrite. Cloudflare
Pages reads these on every deploy and applies the rules
automatically — no dashboard configuration needed for them.

## One-time setup

In the Cloudflare dashboard, **Workers & Pages → Create application →
Pages → Connect to Git**:

1. Select the Apptonomia repository.
2. Set the **production branch** to `master`.
3. Leave **build command** and **build output directory** empty — the
   Cloudflare connector reads `pages_build_output_dir = "."` from
   `wrangler.toml`, and the repository root already is the build
   output.
4. (Optional) In **Settings → Build**, confirm the framework preset is
   "None" and the output directory is `.`.

If a Pages project named `apptonomia` already exists from a previous
Worker-style attempt, delete it before creating the Pages project.
Pages and Workers share the project name namespace, so a stale Worker
named `apptonomia` will block Pages from taking the same name.

Cloudflare then builds and deploys every push to `master` (production)
and every pull request (preview channel, URL posted on the PR). No
GitHub secret is required, no `wrangler login` is needed locally.
`wrangler.toml` stays in the repo so the dashboard has the project
contract; `wrangler` itself is no longer a dev dependency.

The production URL is **https://apptonomia.pages.dev** — it follows the
pattern `<project-name>.pages.dev` for the project declared in
`wrangler.toml` (`name = "apptonomia"`) connected to the `master`
branch (set in the dashboard, not in `wrangler.toml`).

## Day-to-day deploys

Pushes to `master` and pull requests are picked up automatically by the
Cloudflare Git connector. The CI workflow (`.github/workflows/ci.yml`)
runs the structural, i18n and secrets checks on every PR but does **not**
deploy.

Local rollbacks or one-off previews via the CLI are out of scope for this
repo. If you ever need them, install Wrangler directly (`npx wrangler`)
without adding it back to `devDependencies`.

## Custom domain

The custom domain (formerly on Firebase) must be moved in the Cloudflare
dashboard once `apptonomia.pages.dev` is live:

1. Add the domain to the Pages project.
2. Update DNS at the registrar to the Cloudflare nameservers.
3. Remove the Firebase Hosting custom domain mapping **only after** the
   Cloudflare deployment is verified end-to-end (do not run the two at
   the same time).

## Compatibility notes

- `manifest.json` and `sw.js` use relative paths, so they work on any host
  without changes.
- The SPA rewrite in `_redirects` preserves deep links such as
  `https://apptonomia.pages.dev/tools/clock/`.
- Long-lived cache for fingerprinted JS/CSS/images is safe; the HTML
  entry points and `sw.js` are forced to `must-revalidate` so the PWA
  shell can update.
