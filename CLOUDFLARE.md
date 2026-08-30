# Cloudflare Workers (static assets) — Apptonomia

> **Production branch & automatic deploy.** Apptonomia deploys
> **automatically on every push to `main`** via the **Cloudflare
> Git connector** configured in the Cloudflare dashboard. There is no
> GitHub Actions workflow that deploys — the only workflow in
> `.github/workflows/validate.yml` runs `node scripts/check.js` on
> every push and PR to gate content, but it does **not** deploy. The
> Cloudflare dashboard is the source of truth for project settings.
>
> **Part of a group of sibling projects.** Apptonomia is the **portal
> and main project** of the group; six sibling apps share the same
> author, the same accessibility-first / no-backend philosophy, and
> the same Cloudflare deploy story:
> **Calculia**, **Routime**, **Okeymoney**, **Sinonimia**, **Memofun**
> and **Teclatlon**. Their own `CLOUDFLARE.md` files describe the
> per-sibling specifics; this document describes only what is unique
> to the Apptonomia portal (custom domain, the index page that
> links out to the six siblings, the absence of i18n bundles in
> `assets/js/`).
>
> Apptonomia uses the **Workers + static assets** model (`wrangler.toml`
> + `[assets]`) rather than the classic Pages model — the same model
> the other siblings use. That is intentional: Cloudflare's current
> recommendation for static sites is Workers + static assets, and the
> existing Cloudflare dashboard project for `apptonomia` is a Worker
> with "Workers Builds", not a Pages project. Do not "fix" this by
> deleting `wrangler.toml` — it would break the deploy.

Apptonomia is deployed as a **Cloudflare Worker (static assets)**,
using its built-in GitHub integration — reachable at
<https://apptonomia.uk>. There is no custom GitHub Actions
workflow — the Cloudflare dashboard owns the build and deploy.

## How it works

1. The repo `miralante/apptonomia` is connected to a Cloudflare
   Workers project named `apptonomia`.
2. Every push to `main` triggers a build in Cloudflare's
   infrastructure via Workers Builds, which reads `wrangler.toml` to
   deploy the repo root as a static-assets Worker (no `main` script).
3. The build is a no-op: no `build command`, no `output directory` other
   than `.`, so the static files are served as-is.
4. The `validate.yml` GitHub Action still runs on every push and PR
   to gate content, but it does not deploy.

`wrangler.toml` is the actual deploy configuration Workers Builds
reads — not just a convenience for local CLI use:
- It pins the project name (`name = "apptonomia"`).
- Its `[assets] directory = "."` and `not_found_handling =
  "404-page"` are what make Cloudflare serve this repo's own
  `404.html` for an unmatched path instead of a bare empty 404.

## Configuration in Cloudflare

When the project is set up in the Cloudflare dashboard:

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | *(empty)* |
| Build output directory | `.` |
| Production branch | `main` |
| Root directory | *(empty — repo root)* |

No environment variables are required: the portal makes no
server-side calls and the sibling apps it links out to are fully
client-side too.

## Custom domain

The portal is served at **<https://apptonomia.uk>** — a custom
domain, not the default `*.workers.dev`. The DNS zone for
`apptonomia.uk` lives in the same Cloudflare account, so the
Workers Custom Domains wizard set the CNAME automatically. There
is no `www.` subdomain at the moment; the apex `apptonomia.uk` is
the only entry point and `https://www.apptonomia.uk` 308-redirects
to it (configured in the Cloudflare dashboard, not in any file in
this repo).

## Required Cloudflare headers

The site uses a `_headers` file at the repo root to set
security headers (CSP, X-Frame-Options, Referrer-Policy,
Permissions-Policy, etc.) and a one-year immutable cache for
JS/CSS/SVG/PNG assets. Cloudflare reads this file on every
deploy and applies the rules automatically — no dashboard
configuration needed.

The CSP is intentionally tight: `default-src 'self'`, no third-party
CDN, no inline scripts, system fonts only. Emoji pictograms on
the landing are Unicode glyphs in the page, not images, so
`img-src` can stay at `'self' data:`.

## What is NOT in this repo

- **No PWA service worker.** Unlike the sibling apps (Calculia,
  Routime, etc.) Apptonomia is a plain landing page, not an
  installable PWA — there is no `sw.js`, no `manifest.json`,
  no `assets/img/` of app icons. The `_headers` policy therefore
  sets `worker-src 'none'`; if a sibling ever wants to be embedded
  on the portal via an iframe that registers its own service
  worker against `apptonomia.uk`, that directive must be relaxed in
  the same commit that adds the embed.
- **No i18n bundles.** The portal ships only `assets/js/script.js`
  and `assets/js/bootstrap.js`; there is no `strings.<locale>.js`
  pair because the visible copy on the landing is just the project
  names, taglines, and a short description, all embedded in
  `index.html` and `404.html` directly (with `lang="es"` /
  `lang="en"` toggling via the `?lang=` query param the same way
  the siblings do). This keeps the deploy artefact tiny and the
  cache strategy simple — a year-long `immutable` cache on the
  JS is safe because there is no `strings.*.js` to keep in
  lock-step with `index.html`.

## How to redeploy

Nothing to do. Push to `main` and Cloudflare rebuilds.

For a manual rebuild (e.g. after Cloudflare itself had an incident),
go to the Cloudflare dashboard → Workers & Pages → apptonomia →
"Create deployment" → choose a branch or upload a directory.

## How to roll back

Cloudflare dashboard → Workers & Pages → apptonomia → **Deployments**.
Each successful build is listed with a timestamp. Click any of them
and select **"Retry deployment"** or **"Rollback to this deployment"**.

## How to add a custom domain

Cloudflare dashboard → Workers & Pages → apptonomia → **Custom
domains** → **Set up a custom domain** → follow the wizard. The DNS
will be configured automatically if the domain is already on
Cloudflare, or by CNAME if it is on another provider. The current
domain (`apptonomia.uk`) was set up exactly this way.

## Rotating credentials

There are no API tokens or secrets to rotate. The GitHub integration
is a one-time OAuth authorisation; revoking it is a matter of
removing the app's access on
[github.com/settings/applications](https://github.com/settings/applications).

## Do not migrate to Pages

The earlier Cloudflare guidance (the classic "Pages" product with
`pages_build_output_dir`) does **not** apply here. The live site
(<https://apptonomia.uk>) is a Worker with static-assets, `wrangler.toml`
is committed and live, and Cloudflare's own current guidance is to
prefer Workers + static assets over classic Pages for new static
sites. Treat "Pages" as the legacy option here, not the target. If a
future migration is ever genuinely wanted, verify against Cloudflare's
current docs rather than reusing the old steps.