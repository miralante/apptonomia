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

## Files removed

| File | Reason |
|---|---|
| `firebase.json` | Hosting config — superseded by `_headers` + `_redirects` |
| `.firebaserc` | Project alias — no longer needed |

`.firebase/` (local CLI cache) is still ignored via `.gitignore`.

## One-time setup

1. Install the Wrangler CLI locally (preferred; matches the project's "no
   runtime npm deps" rule):
   ```bash
   npm install --save-dev wrangler
   ```
2. Authenticate against Cloudflare (opens a browser):
   ```bash
   npx wrangler login
   ```
3. Create the Pages project (only the first time — the dashboard also
   accepts a direct Git provider connection, which is the recommended path
   for production):
   ```bash
   npx wrangler pages project create apptonomia --production-branch master
   ```

## Day-to-day deploys

```bash
# Preview channel (URL like https://<hash>.apptonomia.pages.dev)
npm run cf:preview

# Production
npm run cf:deploy
```

Both scripts wrap `wrangler pages deploy .` (`.` because the repo root is the
build output). The deploy is a **network operation** — request explicit
approval from the user before running it, per `CLAUDE.md` §3.

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
