# Cloudflare Pages — Apptonomia

Apptonomia is now deployed on **Cloudflare Pages** instead of Firebase Hosting.
The site is fully static (no build step, no backend), so the only files Pages
needs to know about live at the repository root.

## Files added in this migration

| File | Purpose |
|---|---|
| `wrangler.toml` | Project name and `pages_build_output_dir = "."` |
| `_headers` | Cache and security headers, replaces `firebase.json` `headers` |
| `_redirects` | `/* → /index.html 200` SPA rewrite, replaces `firebase.json` `rewrites` |
| `.github/workflows/ci.yml` | `node scripts/check.js`, i18n smoke and secrets scan on every push/PR |
| `.github/workflows/pages-deploy.yml` | Deploy to Cloudflare Pages via `cloudflare/pages-action` |

## Files removed

| File | Reason |
|---|---|
| `firebase.json` | Hosting config — superseded by `_headers` + `_redirects` |
| `.firebaserc` | Project alias — no longer needed |

`.firebase/` (local CLI cache) is still ignored via `.gitignore`.

## One-time setup

Two equally valid paths. Pick **one** and skip the other.

### Path A — Cloudflare Git connector (recommended)

1. In the Cloudflare dashboard, **Workers & Pages → Create application →
   Pages → Connect to Git**.
2. Select the Apptonomia repository, set the production branch to `master`
   and the build command to an empty string (the repo root **is** the build
   output).
3. Cloudflare then builds and deploys every push to `master` and every PR
   (preview channel). No GitHub secret is required, and `wrangler login` is
   not needed locally.
4. Local `wrangler` is only used for one-off previews or rollbacks.

### Path B — Self-hosted via GitHub Actions + Wrangler

1. Install the Wrangler CLI locally:
   ```bash
   npm install
   ```
2. Authenticate against Cloudflare (opens a browser):
   ```bash
   npm run cf:login
   ```
3. Create the Pages project from the command line (only the first time):
   ```bash
   npx wrangler pages project create apptonomia --production-branch master
   ```
4. In the GitHub repository settings, add two secrets under
   **Settings → Secrets and variables → Actions**:
   - `CLOUDFLARE_API_TOKEN` — create at
     <https://dash.cloudflare.com/profile/api-tokens> with the
     "Edit Cloudflare Pages" template.
   - `CLOUDFLARE_ACCOUNT_ID` — copy from the right sidebar of any zone in
     the Cloudflare dashboard.
5. The workflow `.github/workflows/pages-deploy.yml` deploys automatically
   on every push to `master` (production) and on every PR (preview channel,
   URL posted as a PR comment).

## Day-to-day deploys

### Via npm (Path B, or manual rollbacks under Path A)

```bash
# Preview channel (URL like https://<hash>.apptonomia.pages.dev)
npm run cf:preview

# Production
npm run cf:deploy
```

Both scripts wrap `wrangler pages deploy .` (`.` because the repo root is the
build output). The deploy is a **network operation** — request explicit
approval from the user before running it, per `CLAUDE.md` §3.

### Via GitHub Actions

Once the secrets from Path B step 4 are set (or Path A is configured in the
dashboard), pushes to `master` and pull requests trigger an automatic
deployment. The required secrets are documented in the workflow file.

## Custom domain

The custom domain (formerly on Firebase) must be moved in the Cloudflare
dashboard once `apptonomia.pages.dev` is live:

1. Add the domain to the Pages project.
2. Update DNS at the registrar to the Cloudflare nameservers.
3. Remove the Firebase Hosting custom domain mapping **only after** the
   Cloudflare deployment is verified end-to-end (do not run the two at the
   same time).

## Compatibility notes

- `manifest.json` and `sw.js` use relative paths, so they work on any host
  without changes.
- The SPA rewrite in `_redirects` preserves deep links such as
  `https://apptonomia.pages.dev/tools/clock/`.
- Long-lived cache for fingerprinted JS/CSS/images is safe; the HTML
  entry points and `sw.js` are forced to `must-revalidate` so the PWA shell
  can update.
