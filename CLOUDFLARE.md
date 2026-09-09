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
> not classic Cloudflare Pages.** The same model Sinonimia,
> Calculia, Okeymoney, Memofun, Teclatlon and Routime use.
>
> **Part of the Miralante suite.** Apptonomia is the **landing
> portal of the suite, not a runtime app**; the six apps of the
> suite (Calculia, Memofun, Okeymoney, Routime, Sinonimia,
> Teclatlon) share the same author, the same accessibility-first /
> no-backend philosophy, and the same Cloudflare deploy story.
> Their own `CLOUDFLARE.md` files describe the per-app specifics;
> this document describes only what is unique to the Apptonomia
> portal (custom domain, the index page that links out to the six
> apps of the suite, the absence of a PWA shell, the absence of i18n
> bundles). The canonical group-wide guide lives in
> [Apptonomia's `CLOUDFLARE.md`](https://github.com/miralante/apptonomia/blob/master/CLOUDFLARE.md)
> (this file).

## How it works

1. The repo is connected to a Cloudflare Workers project named
   `apptonomia` (Workers & Pages → Connect to Git).
2. Every push to `main` triggers a build in Cloudflare's
   infrastructure via Workers Builds, which reads [`wrangler.toml`](wrangler.toml)
   to deploy the repo root as a static-assets Worker (no `main`
   script).
3. The build is a no-op: no `build command`, no `output directory`
   other than `.`, so the static files are served as-is.
4. The `validate.yml` GitHub Action still runs on every push and PR
   to gate content, but it does not deploy.

[`wrangler.toml`](wrangler.toml) is the actual deploy configuration
Workers Builds reads — not just a convenience for local CLI use. It
pins the project name (`name = "apptonomia"`), declares
`[assets] directory = "."` (no `main` script), and
`not_found_handling = "404-page"` so Cloudflare serves this repo's
own `404.html` for an unmatched path instead of a bare empty 404.

> **Do not "fix" by deleting `wrangler.toml`** or by switching to
> the legacy `pages_build_output_dir` Pages shape. The Cloudflare
> dashboard project for `apptonomia` is already a Worker with
> "Workers Builds", and Cloudflare's own current guidance is to
> prefer Workers + static assets over classic Pages for new static
> sites.

## Files in this repository

| File | Purpose |
|---|---|
| `_headers` | Cache and security headers (tight CSP with `worker-src 'none'` — see "What is NOT in this repo" below) |
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

## Custom domain

The portal is served at **<https://apptonomia.uk>** — a custom
domain, not the default `*.workers.dev`. The DNS zone for
`apptonomia.uk` lives in the same Cloudflare account, so the
Workers Custom Domains wizard set the CNAME automatically. There
is no `www.` subdomain at the moment; the apex `apptonomia.uk` is
the only entry point and `https://www.apptonomia.uk` 308-redirects
to it (configured in the Cloudflare dashboard, not in any file in
this repo).

## How to add a custom domain

Cloudflare dashboard → Workers & Pages → `apptonomia` → **Custom
domains** → **Set up a custom domain** → follow the wizard. DNS is
configured automatically if the domain is already on Cloudflare, or
by CNAME if it is on another provider. The current domain
(`apptonomia.uk`) was set up exactly this way.

## Required Cloudflare headers

The site uses a [`_headers`](_headers) file at the repo root to set
security headers (CSP, X-Frame-Options, Referrer-Policy,
Permissions-Policy) and a one-year immutable cache for JS/CSS/SVG/
PNG assets. Cloudflare reads this file on every deploy and applies
the rules automatically — no dashboard configuration needed.

The CSP is intentionally tight: `default-src 'self'`, no third-party
CDN, no inline scripts, system fonts only. Emoji pictograms on the
landing are Unicode glyphs in the page, not images, so `img-src` can
stay at `'self' data:`.

## What is NOT in this repo

- **No PWA service worker.** Unlike the other apps of the suite
  (Calculia, Routime, etc.) Apptonomia is a plain landing page, not
  an installable PWA — there is no `sw.js`, no `manifest.json`, no
  `assets/img/` of app icons. The `_headers` policy therefore sets
  `worker-src 'none'`; if another app of the suite ever wants to be
  embedded on the portal via an iframe that registers its own
  service worker against `apptonomia.uk`, that directive must be
  relaxed in the same commit that adds the embed.
- **No i18n bundles.** The portal ships only `assets/js/script.js`
  and `assets/js/bootstrap.js`; there is no `strings.<locale>.js`
  pair because the visible copy on the landing is just the project
  names, taglines, and a short description, all embedded in
  `index.html` and `404.html` directly (with `lang="es"` /
  `lang="en"` toggling via the `?lang=` query param the same way
  the other apps of the suite do). This keeps the deploy artefact
  tiny and the cache strategy simple — a year-long `immutable`
  cache on the JS is safe because there is no `strings.*.js` to
  keep in lock-step with `index.html`.

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

## Rotating credentials

There are no API tokens or secrets to rotate. The GitHub
integration is a one-time OAuth authorisation; revoking it is a
matter of removing the app's access on
[github.com/settings/applications](https://github.com/settings/applications).

## Do not migrate to Pages

The earlier Cloudflare guidance (the classic "Pages" product with
`pages_build_output_dir`) does **not** apply here. The live site
(<https://apptonomia.uk>) is a Worker with static-assets,
`wrangler.toml` is committed and live, and Cloudflare's own current
guidance is to prefer Workers + static assets over classic Pages
for new static sites. Treat "Pages" as the legacy option here, not
the target. If a future migration is ever genuinely wanted,
verify against Cloudflare's current docs rather than reusing the
old steps.
