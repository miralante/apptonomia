# Cloudflare Workers (static assets) — Apptonomia

> **Production branch & automatic deploy.** Apptonomia deploys
> **automatically on every push to `main`** via the **Cloudflare
> Git connector**. The GitHub Actions workflow
> [`.github/workflows/validate.yml`](.github/workflows/validate.yml)
> runs `node scripts/check.js` on every push and PR but does **not**
> deploy. The Cloudflare dashboard is the source of truth for
> project settings.
>
> **This project is deployed as a Cloudflare Worker (static assets),
> not classic Cloudflare Pages.**
>
> **Part of the Miralante suite.** Apptonomia is **one of the seven
> siblings** (Apptonomia, Calculia, Memofun, Okeymoney, Routime,
> Sinonimia, Teclatlon) that share the same author, the same
> accessibility-first / no-backend philosophy, and the same Cloudflare
> deploy story. The canonical group-wide guide lives in
> [Apptonomia's `CLOUDFLARE.md`](https://github.com/miralante/apptonomia/blob/master/CLOUDFLARE.md)
> (the metaproject root, this very file); the per-sibling
> `CLOUDFLARE.md` documents only the project-specific bits
> (custom domain, build command, CI workflow name).

## How it works

1. The repo is connected to a Cloudflare Workers project named
   `apptonomia` (Workers & Pages → Connect to Git).
2. Every push to `main` triggers a build in Cloudflare's
   infrastructure via Workers Builds, which reads
   [`wrangler.toml`](wrangler.toml) to deploy the repo root as a
   static-assets Worker (no `main` script).
3. The build is otherwise a no-op: no `output directory` other than
   `.`, so the static files are served as-is.
4. The `validate.yml` GitHub Action still runs on every push and PR
   to gate content, but it does not deploy.

[`wrangler.toml`](wrangler.toml) is the actual deploy configuration
Workers Builds reads — not just a convenience for local CLI use. It
pins the project name (`name = "apptonomia"`) and declares
`[assets] directory = "."` (no `main` script), plus
`not_found_handling = "404-page"` so Cloudflare serves this repo's
own `404.html` for an unmatched path instead of a bare empty 404.

> **Do not "fix" by deleting `wrangler.toml`** or by switching to
> the legacy `pages_build_output_dir` Pages shape. Apptonomia's
> Cloudflare dashboard project is already a Worker with "Workers
> Builds", and Cloudflare's own current guidance is to prefer
> Workers + static assets over classic Pages for new static sites.
> `wrangler pages deploy` and the Pages shape do not apply here —
> use `wrangler deploy` if you ever need to push from a dev
> machine.

## Files in this repository

| File | Purpose |
|---|---|
| `_headers` | Cache and security headers |
| `wrangler.toml` | Pins the project name + the `[assets]` binding + `not_found_handling = "404-page"` |
| `.github/workflows/validate.yml` | `node scripts/check.js` and friends on every push/PR (does **not** deploy) |

No `_redirects`, no `functions/`, no `package.json`, no Cloudflare
service-account keys.

## Configuration in Cloudflare

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | *(empty)* |
| Build output directory | `.` |
| Production branch | `main` |
| Root directory | *(empty — repo root)* |

No environment variables are required: the portal makes no
server-side calls and the apps of the suite it links out to are
fully client-side too.

## Required Cloudflare headers

The site uses a [`_headers`](_headers) file at the repo root to set
security headers (CSP, X-Frame-Options, Referrer-Policy,
Permissions-Policy) and a cache policy: a one-year immutable
cache for JS/CSS/SVG/PNG assets. Cloudflare reads this file on
every deploy and applies the rules automatically — no dashboard
configuration needed.

The CSP is intentionally tight: `default-src 'self'`, no
third-party CDN, no inline scripts, system fonts only. Emoji
pictograms on the landing are Unicode glyphs in the page, not
images, so `img-src` can stay at `'self' data:`.

## `*.workers.dev` subdomain — Triggers

For a static-assets Worker, Cloudflare only serves requests over a
**route** (a `*.workers.dev` subdomain or a custom domain). Without
one, the project deploys fine — the build succeeds, files are
uploaded, "Deployments" lists the commit — but the dashboard shows
**"No active routes"** and every URL returns empty.

**Fix — one click in the dashboard:**

1. Workers & Pages → `apptonomia` → **Settings** → **Triggers** (or
   **Routes**, depending on the dashboard version).
2. Under **Workers.dev subdomain**, click **Enable** (or **Add**).
   Cloudflare assigns the URL immediately; no rebuild needed.
3. If the dashboard only shows a routes table, add a route
   manually:
   - **Route pattern**: `*/*`
   - **Zone**: `workers.dev` (the account's free `*.workers.dev` zone)
   - **Worker**: `apptonomia`
4. Once the route is active, if the latest commit isn't already
   showing as the **Active** deployment, go to **Deployments** →
   click the most recent successful build → **Retry deployment** (or
   **Promote to deploy**).

> **Cannot be set in `wrangler.toml`.** The `workers.dev` binding is
> a per-project dashboard setting; it is not declared anywhere in
> the repo. `wrangler deploy` from the CLI does not apply here
> either — Workers Builds owns the deploy, and the dashboard owns
> the routes.

## Service worker cache

This project ships **no `sw.js`** (Apptonomia is a plain landing
page, not an installable PWA — see the `_headers` `worker-src
'none'` directive that backs this up). The cache contract described
in `CLAUDE.md` §B.1 does not apply here; the rest of the suite's
PWA siblings (`calculia`, `memofun`, `okeymoney`, `routime`,
`sinonimia`, `teclatlon`) carry the full `VERSION` rule.

## CI — pre-deploy gate

Every push to `main` and every PR against `main` runs
[`.github/workflows/validate.yml`](.github/workflows/validate.yml),
which gates content before the Cloudflare Git connector ever sees
the commit. The CI workflow does **not** deploy — deploy is
exclusively the Cloudflare dashboard reading `wrangler.toml` and
`_headers`. No GitHub secret is required, no `wrangler login` is
needed locally.

## Custom domain

Apptonomia is served at **<https://apptonomia.uk>** — the apex of
a custom domain, not the default `*.workers.dev` route. The DNS
zone for `apptonomia.uk` lives in the same Cloudflare account, so
the Workers Custom Domains wizard set the CNAME automatically.
There is no `www.` subdomain; `https://www.apptonomia.uk`
308-redirects to the apex (configured in the Cloudflare dashboard,
not in any file in this repo).

## How to redeploy

Nothing to do. Push to `main` and Cloudflare rebuilds.

For a manual rebuild (e.g. after Cloudflare itself had an
incident), go to the Cloudflare dashboard → Workers & Pages →
`apptonomia` → **Create deployment** → choose a branch or upload a
directory.

For a one-off preview outside the Git connector (e.g. to test a
dirty worktree without pushing):

```bash
npx wrangler deploy
```

## How to roll back

Cloudflare dashboard → Workers & Pages → `apptonomia` →
**Deployments**. Each successful build is listed with a timestamp.
Click any of them and select **"Retry deployment"** or **"Rollback
to this deployment"**.

## How to add a custom domain

Cloudflare dashboard → Workers & Pages → `apptonomia` → **Custom
domains** → **Set up a custom domain** → follow the wizard. DNS is
configured automatically if the domain is already on Cloudflare, or
by CNAME if it is on another provider. The current domain
(`apptonomia.uk`) was set up exactly this way.

## Rotating credentials

There are no API tokens or secrets to rotate. The GitHub
integration is a one-time OAuth authorisation; revoking it is a
matter of removing the app's access on
[github.com/settings/applications](https://github.com/settings/applications).

## See also

- [`CLAUDE.md`](CLAUDE.md) — the per-sibling AI agent workflow; the
  cache contract in §B.1 is the source of truth for the SW
  `VERSION` rule.
- `wrangler.toml` — the actual deploy configuration Workers Builds
  reads.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — the human contribution
  flow that produces the commits that Git connector picks up.
- Apptonomia's `CLOUDFLARE.md` — the metaproject root, this very
  template, but with `{{DISPLAY}} = Apptonomia`.
