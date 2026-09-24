# Suite-wide `master` -> `main` migration — operator checklist

**Status**: local-side preparation DONE on 2026-09-23.
The script [`scripts/one-off/rename-branch-to-main.js`](./rename-branch-to-main.js)
ran against the four siblings with `master`. Every repo's local branch is now
`main`. The four `*.github/workflows/*.yml` files that gate on `master` now
also accept `main`. The `SECURITY.{md,es.md}` files were re-rendered to
declare `main`. The remaining work is **operator-driven on GitHub and Cloudflare**.

> This document is a checklist. Each step is **required** in the listed
> order to keep the cached PWA / Cloudflare pipeline serving the new code.
> Skipping the Cloudflare step will not break the GitHub side, but it
> **will keep shipping the old version** until that step is run.

## What already happened (do not redo)

For each of `calculia`, `teclatlon`, `okeymoney`, `routime`:

- The local branch `master` was renamed to `main` (`git branch -m master main`).
- `.github/workflows/validate.yml` was updated to `branches: [master, main]`
  (so `main` already passes CI during the transition window).
- `.github/workflows/pages-deploy.yml` (routime only) had the
  `github.ref == 'refs/heads/master'` conditional widened to also
  accept `refs/heads/main` (it sets `production` for either).
- One commit, `chore(ci): run CI on both master and main`, was added
  on top of the previous HEAD.
- The script wrote a per-repo `<slug>-migrate-branch-checklist.md`
  in the repo root (the steps in this file mirror it).
- `apptonomia/scripts/one-off/write-security-md.js` was updated so
  each of the four siblings is declared with `branch: 'main'` and the
  rendered `SECURITY.{md,es.md}` says "Only the `main` branch...".
- Routime's tags (`backup/pre-cleanup-...`, `backup/pre-rebase-...`,
  `v1.7.0`) were left pointing at the previous `master`. Migrating tags
  is a separate decision (operator's call below).

## What the script + API already did

Done by the agent on 2026-09-23 (no further action from you):

1. **`git push -u origin main`** for calculia, teclatlon, okeymoney;
   **`git push -u miralante main`** for routime (its remote is named
   `miralante`). All four pushed clean (exit 0) using the HTTPS
   credentials already on the machine. Confirmed remote branches:

   | Repo | Branches on `origin`/`miralante` | Default branch |
   |---|---|---|
   | calculia   | `main`, `master` | `main` |
   | teclatlon  | `main`, `master` | `main` |
   | okeymoney  | `main`, `master` | `main` |
   | routime    | `cloudflare/workers-autoconfig`, `main`, `master` | `main` |

2. **`gh api -X PATCH /repos/miralante/<slug>` with `default_branch: "main"`**
   — flipped the default branch on all four repos to `main`. Verified
   with `gh api /repos/miralante/<slug>` afterwards.

3. **No branch protection rules** existed on `master` in any of the
   four (`gh api /repos/miralante/<slug>/branches/master/protection`
   returned 404). Nothing to replicate before the swap.

The remote `master` branches are still present in all four repos on
purpose: deleting them too early can break Cloudflare deploys if its
Production-branch switch hasn't been applied yet. **Delete them only
after 24-48 h of clean production deploys from `main`** (Step 5 below).

## What you must do, per repo, in this exact order

Only one step is left: re-point each Cloudflare Pages project to the
new `main` branch. GitHub is already on `main` (default branch flipped
by the agent).

### Step 1. Cloudflare Pages: change the production branch

For each repo, in order:

1. Cloudflare dashboard → Workers & Pages → project `<slug>`.
2. **Settings → Builds → Production branch** — change from `master` to `main`.
3. If the repo uses the Cloudflare Git connector (the README and
   `CLOUDFLARE.md` tell you), open the **connected Git repo** panel
   and re-select the production source branch as `main`. The
   connector's "Production branch" is a separate setting from the
   GitHub default branch — both have to agree.
4. From your local clone, push a tiny smoke commit to trigger a
   build:

```bash
cd <repo> && git commit --allow-empty -m "chore: smoke after rename to main" && git push origin main
```

5. In the Cloudflare dashboard **Deployments** tab, confirm the new
   build is the **production** environment. The name of the
   environment comes from the `pages-deploy.yml` workflow in routime
   or from the Cloudflare Git connector in the others. If it shows
   "preview" instead of "production", your Step 1.3 was missed — do
   not skip and re-read the docs.

### Step 2. Update the textual docs in each repo

For each repo:

- Edit `<slug>/CLOUDFLARE.md`:
  - Replace `master` → `main` in:
    - L4 (`automatically on every push to \`master\``)
    - L29 (`Every push to \`master\` triggers`)
    - L84/L79/L87/L90 (`Production branch | \`master\``)
    - L152/L146/L155/L161 (`Every push to \`master\` and every PR`)
    - L169/L163/L178/L179 (`Push to \`master\` and Cloudflare`)
  - Leave the L20 link to `apptonomia/blob/master/CLOUDFLARE.md` alone
    for now (apptonomia is already on `main`, but the cross-link is
    cosmetic; it gets cleaned up the next time we sweep `master` across
    the suite in plain text).
- Edit `<slug>/README.md` and `<slug>/README.es.md` if they mention
  the production branch explicitly (most don't — they only mention
  `SECURITY.md`).

### Step 3. After 24-48 h of clean production deploys

For each repo, after confirming Cloudflare is publishing the new
`main` builds:

```bash
git push -d <remote> master          # remote = "origin" except routime = "miralante"
```

This is the one truly destructive step. After it, GitHub's UI shows
only `main` as the default and `master` is gone from the repository.
Can also be done from the GitHub UI: Settings → Branches → delete
the rule on `master`, then "View all branches" → Delete `master`.

### Step 4. Tags (routime only)

Routime has three tags pointing at the previous `master`:

- `backup/pre-cleanup-20260719-152438`
- `backup/pre-rebase-20260719-145119`
- `v1.7.0`

None are signed. The migration leaves them on `master`. After you
delete the remote `master` (Step 3), the tags stay alive on the
_commit_ that was the head of `master` because GitHub stores tags
immutably. **Do not** move them to `main` automatically — semantic
releases should be re-tagged from the new HEAD manually if at all.

## Order to attack the four repos

Recommendation based on the local preflight (`scripts/rename-branch-to-main.js`
dry-run reports) — start with the cleanest, finish with the messiest:

1. **calculia** — workflow was single-branch, so it gained a commit;
   cleanest state going into GitHub.
2. **teclatlon** — workflow was already dual, no new commit needed.
3. **okeymoney** — workflow was already dual, no new commit needed.
4. **routime** — no remote configured locally, has a Pages-deploy
   conditional, and 3 tags. Touch this one last.

After all four are done, the CLOUDFLARE.md and README cross-links that
still say `master` in `apptonomia/` (the metaproject) can be cleaned
up — they don't block anything.

## Verification, after all four

- `git -C <repo> log --oneline -3` should show the workflow commit
  on top, all on `main`.
- The GitHub "Insights -> Traffic" view should still report requests.
- `git push --delete origin master` should succeed on each repo
  (after the 24–48 h wait) and remove the old branch cleanly.

## If something goes wrong

- `git checkout master && git reset --hard <last-known-good-sha>`
  on the original branch is always available — the migration did
  not touch history, only branch labels.
- Workflow failures on the dual `branches: [master, main]` list will
  show `main` builds in red; redeploy by pushing an empty commit
  to `master` (or vice versa).
- Cloudflare keeps serving the cached version until its cache TTL
  expires. The cache TTL comes from the `_headers` file in each
  sibling — see [`apptonomia/doc/en/crear-app.md`](../en/crear-app.md)
  §6 for the typical pattern.

## Files touched in this migration (local-only)

| Path | What changed |
|---|---|
| `apptonomia/scripts/one-off/rename-branch-to-main.js` | New script: idempotent, dry-run by default, refuses on dirty / tags / stale hostname-branches / missing remote. |
| `apptonomia/scripts/one-off/write-security-md.js` | 4 entries: `branch: 'master'` -> `branch: 'main'` for calculia, okeymoney, teclatlon, routime. |
| `<slug>/.github/workflows/validate.yml` | `branches: [master]` -> `branches: [master, main]` (calculia only — the others were already dual). |
| `<slug>/.github/workflows/pages-deploy.yml` | routime only: the `github.ref == 'refs/heads/master'` conditional widened to accept either `master` or `main`. |
| `<slug>/SECURITY.md`, `<slug>/SECURITY.es.md` | Re-rendered. Now say "Only the `main` branch...". |
| `<slug>/<slug>-migrate-branch-checklist.md` | Per-repo operator checklist (mirror of this file). |
