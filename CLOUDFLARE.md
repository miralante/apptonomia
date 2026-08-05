# Cloudflare Pages — Apptonomia

> **Production branch & automatic deploy.** Apptonomia deploys
> **automatically on every push to `master`** via the **Cloudflare
> Git connector** configured in the Cloudflare dashboard. The CI
> workflow (`.github/workflows/ci.yml`) runs structural, i18n and
> secrets checks on every push and PR but does **not** deploy. An
> **optional** deploy workflow (`.github/workflows/pages-deploy.yml`)
> exists as a self-hosted fallback: it only runs if the
> `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` GitHub secrets
> are set; otherwise it is a no-op. The recommended path is the
> Cloudflare Git connector, which needs no GitHub secrets.

**Canonical URL:** https://apptonomia.pages.dev

Apptonomia is deployed on **Cloudflare Pages**, using its built-in
GitHub integration. There is no custom GitHub Actions workflow and no
`wrangler.toml` in the repo — the Cloudflare dashboard owns the build
and deploy, and project configuration lives entirely there.

## How it works

1. The repo `miralante/apptonomia` is connected to a Cloudflare Pages
   project named `apptonomia`.
2. Every push to `master` triggers a Pages build in Cloudflare's
   infrastructure.
3. The build is a no-op: no `build command`, no `output directory` other
   than `.`, so the static files are served as-is.
4. The `ci.yml` GitHub Action still runs on every push and PR to gate
   structural, i18n and secrets checks, but it does not deploy.

The `apptonomia.pages.dev` subdomain is assigned by Cloudflare from the
project name `apptonomia` declared in the Cloudflare dashboard. The
project name is **not** declared in the repo — that mirrors the working
setup of the sibling `sinonimia` project and avoids the "project type
misdetected as Worker" failure mode that `wrangler.toml` introduces
(see "Why no `wrangler.toml`?" below).

## Files in this repository

| File | Purpose |
|---|---|
| `_headers` | Cache and security headers, replaces the old `firebase.json` `headers` |
| `.github/workflows/ci.yml` | `node scripts/check.js`, i18n smoke and secrets scan on every push/PR (does **not** deploy) |

No deploy-side configuration is committed: no `wrangler.toml`, no
`_redirects`, no `functions/`, no `_routes.json`, no Cloudflare
service-account keys. The dashboard is the source of truth for project
settings; the repo holds the static assets and the CI that gates them.

## Why no `_redirects`?

Cloudflare Pages serves every static file in the repo automatically,
including the implicit `index.html` lookup for any directory: visiting
`/tools/pairs/` resolves to `tools/pairs/index.html`, `/team/` to
`team/index.html`, and so on, without any rewrite rule. Every section
of Apptonomia (`site/`, `tools/<slug>/` for all 69 activities,
`team/`, `about/`, `settings/`, `legal/`) ships its own real
`index.html`, so a catch-all rewrite is unnecessary and would in fact
break: the previous version had `/* /index.html 200` (Firebase-era
SPA rewrite) and Cloudflare rejected it with *"Infinite loop detected
in this rule"* because `/index.html` itself matches `/*` and would
re-trigger the rule indefinitely.

The root `/index.html` keeps its `<meta http-equiv="refresh">` to
`site/index.html` as a client-side entry pointer, the same way it did
under Firebase Hosting — that has nothing to do with the server-side
routing and does not cause a loop.

## Why no `wrangler.toml`?

A `wrangler.toml` containing `name = "apptonomia"` and
`pages_build_output_dir = "."` looks correct, but in practice the
Cloudflare Pages Git connector can mis-detect the project type when
that file is present: it falls back to `wrangler deploy` (the **Worker**
deploy command), which then fails with *"Missing entry-point to Worker
script or to assets directory"* because the file declares neither a
`main` entry-point nor an `[assets]` binding. Removing `wrangler.toml`
and letting the dashboard drive the deploy with `pages_build_output_dir`
implicit (= repo root) sidesteps the issue entirely. This is the same
pattern the sibling `sinonimia` repo uses and is what makes that
project's deploys succeed end-to-end.

If the project ever needs a manual CLI deploy (for example, to attach
preview channels during a local debugging session), Wrangler can be
installed transiently via `npx wrangler pages deploy . --project-name apptonomia`
without committing a `wrangler.toml` or a `wrangler` devDependency.

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
security headers. Cloudflare Pages reads it on every deploy and
applies the rules automatically — no dashboard configuration needed.

## One-time setup

In the Cloudflare dashboard, **Workers & Pages → Create application →
Pages → Connect to Git**:

1. Select the Apptonomia repository.
2. Set the **production branch** to `master`.
3. Leave **build command** and **build output directory** empty — the
   repository root already is the build output.
4. (Optional) In **Settings → Build**, confirm the framework preset is
   "None" and the output directory is `.`.

If a Pages or Worker project named `apptonomia` already exists from a
previous attempt, delete it before creating the Pages project. Pages
and Workers share the project name namespace, so a stale Worker named
`apptonomia` will block Pages from taking the same name and will also
be the source of the deploy failure described in "Why no
`wrangler.toml`?" — deleting it is the first thing to try if the
dashboard still mis-detects the project type.

Cloudflare then builds and deploys every push to `master` (production)
and every pull request (preview channel, URL posted on the PR). No
GitHub secret is required, no `wrangler login` is needed locally.

The production URL is **https://apptonomia.pages.dev** — it follows the
pattern `<project-name>.pages.dev` for the project named `apptonomia`
in the dashboard, connected to the `master` branch.

## Day-to-day deploys

Pushes to `master` and pull requests are picked up automatically by the
Cloudflare Git connector. The CI workflow (`.github/workflows/ci.yml`)
runs the structural, i18n and secrets checks on every PR but does **not**
deploy.

For a one-off preview outside the Git connector (e.g. to test a dirty
worktree without pushing), Wrangler can be invoked directly without any
project-side configuration file:

```bash
npx wrangler pages deploy . --project-name apptonomia
```

## Rollback

Cloudflare dashboard → Workers & Pages → `apptonomia` → **Deployments**.
Each successful build is listed with a timestamp. Click any of them
and select **"Retry deployment"** or **"Rollback to this deployment"**.

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
- Deep links such as `https://apptonomia.pages.dev/tools/pairs/` resolve
  to the real `tools/pairs/index.html` automatically (Cloudflare's
  implicit `index.html` lookup per directory), so no rewrite rule is
  needed for them.
- Long-lived cache for fingerprinted JS/CSS/images is safe; the HTML
  entry points and `sw.js` are forced to `must-revalidate` so the PWA
  shell can update.
