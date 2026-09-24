#!/usr/bin/env node
/**
 * One-off: prepare a sibling for the `master` -> `main` migration, locally.
 *
 * Run from apptonomia/ (any cwd):
 *
 *   # dry-run (default; safe; does not touch anything)
 *   node scripts/one-off/rename-branch-to-main.js ../<slug>
 *
 *   # apply the workflow edit (single commit) + rename local branch; no push
 *   node scripts/one-off/rename-branch-to-main.js ../<slug> --apply
 *
 *   # also push the new branch (still no delete of the remote `master`)
 *   node scripts/one-off/rename-branch-to-main.js ../<slug> --apply --push
 *
 *   # for routime (no remote configured) and dirty working trees
 *   node scripts/one-off/rename-branch-to-main.js ../routime --apply --no-remote --allow-dirty --allow-tags
 *
 *   # skip the workflow commit (you'll commit it yourself)
 *   node scripts/one-off/rename-branch-to-main.js ../<slug> --apply --no-commit
 *
 * The script is **local-only by default**. It edits the GitHub Actions
 * workflow(s) that gate on `master` to add `main`, commits *just those*
 * files, renames the local branch to `main`, and writes an operator
 * checklist (GitHub + Cloudflare steps you must run by hand).
 *
 * It never deletes `master` from the remote and never touches Cloudflare.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

function parseArgs() {
  const out = { positional: [], flags: {} };
  for (let i = 2; i < process.argv.length; i++) {
    const a = process.argv[i];
    if (a.startsWith('--')) out.flags[a.slice(2)] = true;
    else out.positional.push(a);
  }
  return out;
}
const flags = parseArgs().flags;
const apply = !!flags.apply;
const push = !!flags.push;
const allowDirty = !!flags['allow-dirty'];
const allowTags = !!flags['allow-tags'];
const allowHostnameBranch = !!flags['allow-hostname-branch'];
const noRemote = !!flags['no-remote'];
const noCommit = !!flags['no-commit'];
const debug = !!flags.debug;
const target = parseArgs().positional[0];
if (!target) {
  console.error('Usage: node rename-branch-to-main.js <path-to-repo> [--apply] [--push] [--allow-dirty] [--allow-tags] [--allow-hostname-branch] [--no-remote] [--no-commit] [--debug]');
  process.exit(2);
}

const REPO = path.resolve(target);
const SLUG = path.basename(REPO);
if (!fs.existsSync(path.join(REPO, '.git'))) {
  console.error('Not a git repo:', REPO);
  process.exit(2);
}

function sh(cmd, args2, opts) {
  return execFileSync(cmd, args2, Object.assign({ cwd: REPO, encoding: 'utf8' }, opts || {})).trim();
}
function shOut(cmd, args2, opts) {
  return sh(cmd, args2, Object.assign({ stdio: ['ignore', 'pipe', 'pipe'] }, opts || {}));
}

function log(mode, msg) {
  const tags = {
    APPLY: '[APPLY] ', OK: '[OK]   ', NOTE: '[NOTE] ', SKIP: '[SKIP] ', DRY: '[DRY]  ',
    REFUSE: '[REFUSE]', DEBUG: '[DEBUG]',
  };
  console.log((tags[mode] || '[?]') + ' ' + msg);
}
function step(label, fn) {
  try { log('APPLY', label); fn(); return true; }
  catch (e) {
    log('REFUSE', label + ' -- ' + (e && e.stderr ? e.stderr.toString().trim() : (e && e.message || String(e))));
    return false;
  }
}

// --- Preflight ---
let HEAD = '';
try { HEAD = sh('git', ['symbolic-ref', '--short', 'HEAD']); } catch { HEAD = '(detached)'; }
function readDefaultBranch() {
  try {
    const out = sh('git', ['remote', 'show', 'origin'], { stdio: ['ignore', 'pipe', 'pipe'] });
    const line = out.split(/\r?\n/).find((l) => l.includes('HEAD branch'));
    if (line) return line.replace(/.*HEAD branch:\s*/, '').trim();
  } catch {}
  return '(unknown)';
}
const defaultBranch = readDefaultBranch();
const allLocal = sh('git', ['for-each-ref', '--format=%(refname:short)', 'refs/heads/']).split(/\r?\n/).filter(Boolean);
const tags = sh('git', ['tag', '-l']).split(/\r?\n/).filter(Boolean);
const dirty = sh('git', ['status', '--porcelain']);
const dirtyCount = dirty ? dirty.split(/\r?\n/).filter(Boolean).length : 0;
const hasOrigin = (() => { try { return !!sh('git', ['remote', 'get-url', 'origin']); } catch { return false; } })();
const hasMainBranch = allLocal.includes('main');
const hasMasterBranch = allLocal.includes('master');
const hostname = (process.env.COMPUTERNAME || process.env.HOSTNAME || '').toUpperCase();
const hostnameJunk = allLocal.filter((b) => b.startsWith('master-') && b.toUpperCase().endsWith('-' + hostname));

console.log('');
console.log('===== preflight =====');
console.log('  repo:               ' + REPO);
console.log('  HEAD:               ' + HEAD);
console.log('  default branch:     ' + defaultBranch);
console.log('  local branches:     ' + (allLocal.join(', ') || '(none)'));
console.log('  has origin remote:  ' + hasOrigin);
console.log('  tags:               ' + (tags.length ? tags.join(', ') : '(none)'));
console.log('  dirty files:        ' + dirtyCount);
console.log('  hostname junk:      ' + (hostnameJunk.length ? hostnameJunk.join(', ') : '(none)'));
console.log('  mode:               ' + (apply ? 'APPLY' : 'DRY-RUN'));

// --- Hard refuses (only when --apply) ---
function refuseIf(condition, code, msg) {
  if (apply && condition) { console.error('[REFUSE] ' + msg); process.exit(code); }
}
if (debug) console.log('[DEBUG] flags=', JSON.stringify(flags), 'allowDirty=', allowDirty, 'apply=', apply);
refuseIf(!allowDirty, 3, 'Working tree is dirty in ' + REPO + '. Pass --allow-dirty to proceed, or commit/stash first.');
refuseIf(!allowTags && tags.length, 4, 'Repo has tags (' + tags.join(', ') + '). Pass --allow-tags to keep them pointed at `master` for now.');
if (hostnameJunk.length) refuseIf(!allowHostnameBranch, 5, 'Found stale hostname branch(es): ' + hostnameJunk.join(', ') + '. Pass --allow-hostname-branch to delete them.');
refuseIf(!hasOrigin && !noRemote, 6, 'No `origin` remote in ' + REPO + '. Pass --no-remote to migrate locally only.');

// --- Find workflow edits regardless of HEAD ---
const ghDir = path.join(REPO, '.github', 'workflows');
const workflowEdits = [];
if (fs.existsSync(ghDir)) {
  for (const f of fs.readdirSync(ghDir)) {
    if (!f.endsWith('.yml') && !f.endsWith('.yaml')) continue;
    const p = path.join(ghDir, f);
    const txt = fs.readFileSync(p, 'utf8');
    if (!/\bmaster\b/.test(txt)) continue;
    const edited = txt
      .replace(/branches:\s*\[master\]/g, 'branches: [master, main]')
      .replace(/branches:\s*\[\s*"master"\s*\]/g, 'branches: [ "master", "main" ]')
      .replace(/github\.ref\s*==\s*'refs\/heads\/master'/g,
               "github.ref == 'refs/heads/master' || github.ref == 'refs/heads/main'")
      .replace(/\$\{\{\s*github\.ref\s*==\s*'refs\/heads\/master'\s*&&\s*'([^']+)'\s*\|\|\s*'([^']+)'\s*\}\}/g,
               "${{ (github.ref == 'refs/heads/master' || github.ref == 'refs/heads/main') && '$1' || '$2' }}");
    if (debug) console.log('[DEBUG]', f, 'changed=', edited !== txt, 'len=', txt.length, '->', edited.length);
    if (edited !== txt) workflowEdits.push({ path: p, after: edited, name: f, before: txt });
  }
}
if (apply && dirty && !allowDirty) { console.error('[REFUSE] working tree dirty mid-run'); process.exit(3); }

const plan = [];
plan.push({ step: 'edit_workflows', count: workflowEdits.length, files: workflowEdits.map((w) => path.relative(REPO, w.path)) });
if (apply && workflowEdits.length && !noCommit) plan.push({ step: 'commit_workflows', note: 'single commit on the current branch' });
else if (apply && workflowEdits.length && noCommit) plan.push({ step: 'skip_commit', reason: '--no-commit' });
if (hasMasterBranch && hasMainBranch) plan.push({ step: 'branch_rename', note: 'both branches exist locally; nothing to rename', from: 'master', to: 'main' });
else if (hasMasterBranch && !hasMainBranch) plan.push({ step: 'branch_rename', from: 'master', to: 'main', willPush: !!(apply && push && hasOrigin && !noRemote) });
else if (!hasMasterBranch && hasMainBranch) plan.push({ step: 'branch_rename', note: 'already on main; nothing to rename' });
if (hostnameJunk.length && apply && allowHostnameBranch) plan.push({ step: 'delete_hostname_branch', branches: hostnameJunk });
if (apply && !push) plan.push({ step: 'skip_push', reason: '--apply without --push' });
if (apply && push && (!hasOrigin || noRemote)) plan.push({ step: 'skip_push', reason: noRemote ? '--no-remote' : 'no origin configured' });

console.log('');
console.log('===== plan =====');
for (const p of plan) console.log('  - ' + JSON.stringify(p));
console.log('');

if (!apply) { log('DRY', 're-run with --apply to execute.'); process.exit(0); }

// --- APPLY phase ---
let allOk = true;

for (const we of workflowEdits) {
  allOk = step('edit workflow ' + path.relative(REPO, we.path),
    () => fs.writeFileSync(we.path, we.after)
  ) && allOk;
}

if (workflowEdits.length && !noCommit) {
  // Add only the edited workflow files (safe even with unrelated dirty files).
  allOk = step('git add -- <workflow files>',
    () => shOut('git', ['add', '--'].concat(workflowEdits.map((w) => path.relative(REPO, w.path))))
  ) && allOk;
  allOk = step('git commit (workflows only)',
    () => shOut('git', ['commit', '-m', 'chore(ci): run CI on both master and main',
      '-m', 'Prepare for migration to main. The new main branch will also pass the existing CI gates during the transition window.'])
  ) && allOk;
}

if (hostnameJunk.length && allowHostnameBranch) {
  for (const b of hostnameJunk) {
    allOk = step('git branch -D ' + b, () => shOut('git', ['branch', '-D', b])) && allOk;
  }
}

if (hasMasterBranch && !hasMainBranch) {
  allOk = step('git branch -m master main',
    () => shOut('git', ['branch', '-m', 'master', 'main'])
  ) && allOk;
  if (push && hasOrigin && !noRemote) {
    allOk = step('git push -u origin main',
      () => shOut('git', ['push', '-u', 'origin', 'main'])
    ) && allOk;
  } else {
    log('NOTE', 'push skipped -- operator does it after the GitHub steps below.');
  }
} else if (hasMasterBranch && hasMainBranch) {
  log('NOTE', 'both master and main exist locally; skipping rename. Resolve manually if needed.');
} else if (!hasMasterBranch && hasMainBranch) {
  log('NOTE', 'already on main; nothing to rename.');
}

const checklist = buildChecklist({ willPush: push && hasOrigin && !noRemote, hasMasterBranch, hasMainBranch });
fs.writeFileSync(path.join(REPO, SLUG + '-migrate-branch-checklist.md'), checklist, 'utf8');
log('OK', 'wrote operator checklist to ' + SLUG + '-migrate-branch-checklist.md');

process.exit(allOk ? 0 : 1);

function buildChecklist(opts) {
  const lines = [];
  const pushHint = opts.willPush
    ? '- The local push was already done by the script.'
    : '- From the local clone (the script already committed the workflow edit and renamed the local branch):\n' +
      '    git push -u origin main\n\n' +
      '- Or, if you prefer to do the steps in order, skip this until after the GitHub-side changes below.';
  const branchState = opts.hasMainBranch && !opts.hasMasterBranch
    ? '- Local branch is on `main`.'
    : (opts.hasMasterBranch && !opts.hasMainBranch ? '- Local branch is on `master` still.' : '- Both `master` and `main` exist locally.');
  lines.push('# ' + SLUG + ' -- `master` -> `main` operator checklist', '',
    'The local-side preparation (workflow edits + branch rename) was applied by `rename-branch-to-main.js`.',
    'The steps below must be done in the GitHub web UI and the Cloudflare dashboard,',
    'because the script does not have credentials for either.',
    '',
    '## 0. Local state', '',
    branchState,
    '',
    '## 1. Push the new `main` branch to `origin` (only if --push was not passed)', '',
    pushHint, '',
    '## 2. GitHub', '',
    '- Open https://github.com/miralante/' + SLUG + '/settings/branches',
    '- If `master` has branch-protection rules, replicate them on `main` FIRST.',
    '- Under "Default branch", switch from `master` to `main`.',
    '  - GitHub will offer to redirect existing refs -- accept.',
    '- (Optional, after 24-48 h of clean production deploys):',
    '  `git push --delete origin master` from a local clone.',
    '',
    '## 3. Cloudflare Pages', '',
    '- Open the Cloudflare dashboard, project `' + SLUG + '`.',
    '- Settings -> Builds -> Production branch: change from `master` to `main`.',
    '- (If using the Cloudflare Git connector) reconnect the integration and select',
    '  the `main` branch as the production source.',
    '- Push a `chore: smoke after rename` commit to `main` and confirm the new',
    '  deploy is the **production** environment, not a preview.',
    '',
    '## 4. After both are done', '',
    '- Update `apptonomia/scripts/one-off/write-security-md.js`: change this repo\'s',
    '  `branch: \'master\'` (or whatever it is today) to `branch: \'main\'`, then re-run the script.',
    '- Update `' + SLUG + '/CLOUDFLARE.md` "Production branch" cell.',
    '- Run `node scripts/check.js` (per-sibling validator) -- make sure it still passes.',
    '',
  );
  return lines.join('\n');
}
