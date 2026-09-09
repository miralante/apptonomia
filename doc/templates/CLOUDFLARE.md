# Cloudflare Workers (static assets) — {{DISPLAY_EN}}

> **Production branch & automatic deploy.** {{DISPLAY_EN}} deploys
> **automatically on every push to `main`** via the **Cloudflare
> Git connector** configured in the Cloudflare dashboard. There is
> no GitHub Actions workflow that deploys — the only workflow in
> `.github/workflows/validate.yml` runs `node scripts/check.js` on
> every push and PR to gate content, but it does **not** deploy.
> The Cloudflare dashboard is the source of truth for project
> settings.
>
> **Part of the Miralante suite.** {{DISPLAY_EN}} is one of the
> six apps of the suite, alongside **Calculia**, **Memofun**,
> **Okeymoney**, **Sinonimia**, **Teclatlon** and **Routime**.
> They share the same author, the same accessibility-first /
> no-backend philosophy, and the same Cloudflare deploy story.
> The metaproject root at `miralante/apptonomia` is the public
> landing that links out to all seven apps; it has its own
> `CLOUDFLARE.md` describing what is unique to the landing. This
> document describes only what is unique to {{DISPLAY_EN}}.

{{DISPLAY_EN}} is deployed as a **Cloudflare Worker (static
assets)**, using its built-in GitHub integration — reachable at
<https://{{DOMAIN}}>. There is no custom GitHub Actions workflow —
the Cloudflare dashboard owns the build and deploy.

## How it works

1. The repo `{{GIT_ORG}}/{{REPO}}` is connected to a Cloudflare
   Workers project named `{{SLUG}}`.
2. Every push to `main` triggers a build in Cloudflare's
   infrastructure via Workers Builds, which reads `wrangler.toml`
   to deploy the repo root as a static-assets Worker (no `main`
   script).
3. The build is a no-op: no `build command`, no `output directory`
   other than `.`, so the static files are served as-is.
4. The `validate.yml` GitHub Action still runs on every push and
   PR to gate content, but it does not deploy.

`wrangler.toml` is the actual deploy configuration Workers Builds
reads — not just a convenience for local CLI use:

- It pins the project name (`name = "{{SLUG}}"`).
- Its `[assets] directory = "."` and `not_found_handling =
  "404-page"` are what make Cloudflare serve this repo's own
  `404.html` for an unmatched path instead of a bare empty 404.

## Cache contract

**Every PWA sibling of the suite has the same cache contract**:

- `sw.js` declares a `VERSION` string (e.g. `{{SLUG}}-v3`).
- `sw.js` declares an `ARCHIVOS` (or `FILES`) array listing every
  file the SW pre-caches on install.
- A change to any file in `ARCHIVOS` requires bumping `VERSION` in
  the same commit.
- `scripts/check-version-bump.js` is the CI gate that fails the
  build when a cached file changed but `VERSION` didn't.

The cost of bumping is one integer; the cost of not bumping is
"the user thinks the fix didn't land". Bump liberally rather than
conservatively. See `CLAUDE.md` §B.1 for the canonical rule.

## Configuration in Cloudflare

When the project is set up in the Cloudflare dashboard:

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | (empty) |
| Build output directory | `.` |
| Root directory | (empty) |
| Environment variables | (none) |
| Custom domain | `{{DOMAIN}}` |

The custom domain's DNS is a CNAME from `{{DOMAIN}}` to
`{{SLUG}}.<account-subdomain>.workers.dev` — set in the Cloudflare
DNS tab, not in Workers settings.

## Local preview

```bash
# Option A — open the file directly. Some browsers restrict
# things from file:// URLs (service worker registration fails),
# but the basic content renders fine.
open index.html        # macOS
xdg-open index.html    # Linux

# Option B — any static server. The simplest is Python's:
python -m http.server 8080
# Then visit http://localhost:8080/

# Option C — node's serve:
npx serve .
```

For the **full PWA experience** (service worker, "Add to home
screen", offline mode), use option B or C — `file://` URLs
disable the SW in most browsers.

## Rollback

Cloudflare Pages keeps every deployment. To roll back:

1. Open the Cloudflare dashboard → Workers & Pages → `{{SLUG}}` →
   **Deployments**.
2. Find the last good deployment, click **...** → **Rollback to
   this deploy**.
3. Cloudflare redeploys the previous commit in seconds; the SW
   uninstalls the current cache on next visit because the rolled-
   back `sw.js` has the older `VERSION`.

No data is lost: rolling back is just a redeploy of an older
commit. `localStorage` on the visitor's device is not touched.

## See also

- `CLAUDE.md` §B.1 — service worker cache rule (per-sibling).
- `CONTRIBUTING.md` — the workflow that produces the deploys.
- The metaproject's `apptonomia/CLOUDFLARE.md` — the cross-suite
  Cloudflare runbook (rebuild, rollback, custom domain,
  credential rotation).
