# Cloudflare Pages — Apptonomia

Apptonomia is deployed on **Cloudflare Pages** via the **Git connector**
(not GitHub Actions). The site is fully static (no build step, no backend),
so the only files Pages needs to know about live at the repository root.

## Files in this repository

| File | Purpose |
|---|---|
| `wrangler.toml` | Project name and `pages_build_output_dir = "."` |
| `_headers` | Cache and security headers, replaces `firebase.json` `headers` |
| `_redirects` | `/* → /index.html 200` SPA rewrite, replaces `firebase.json` `rewrites` |
| `.github/workflows/ci.yml` | `node scripts/check.js`, i18n smoke and secrets scan on every push/PR (does **not** deploy) |

`.github/workflows/pages-deploy.yml` and the `cf:*` npm scripts / `wrangler`
devDependency that shipped with the self-hosted Wrangler path have been
removed. Deploys go through the Cloudflare dashboard instead.

## One-time setup

In the Cloudflare dashboard, **Workers & Pages → Create application →
Pages → Connect to Git**:

1. Select the Apptonomia repository.
2. Set the **production branch** to `master`.
3. Leave the **build command** and **build output directory** empty — the
   Cloudflare connector reads `pages_build_output_dir = "."` from
   `wrangler.toml`, and the repository root already is the build output.
4. (Optional) In **Settings → Build**, confirm the framework preset is
   "None" and the output directory is `.`.

Cloudflare then builds and deploys every push to `master` (production) and
every pull request (preview channel, URL posted on the PR). No GitHub
secret is required, no `wrangler login` is needed locally. `wrangler.toml`
stays in the repo so the dashboard has the project contract; `wrangler`
itself is no longer a dev dependency.

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
