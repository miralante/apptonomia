#!/usr/bin/env node
// scripts/rename-doc-lowercase.js
//
// One-time lowercasing pass for `doc/<lang>/*.md` filenames across the
// Miralante suite. Designed for the cross-project plumbing in this
// metaproject: from `apptonomia/` you can target one sibling, several,
// or all six PWA-shipping siblings at once.
//
// What it does, in order, per target project:
//
//   1. Rename every `doc/<lang>/<File>.md` whose name starts with an
//      uppercase letter to its lowercase equivalent (`SPEC.md` ->
//      `spec.md`, `CONTENTS.md` -> `contents.md`, `CONTENIDOS.md` ->
//      `contenidos.md`, `I18N.md` -> `i18n.md`, `README.md` under
//      `doc/` -> `readme.md`, `RENAME_MAP.md` -> `rename_map.md`).
//      Directory names (`en`, `es`, `curriculum`, ...) are never touched.
//      Files that are already lowercase are left alone.
//
//   2. Update every text reference to those old names anywhere under the
//      project root EXCEPT:
//        - `.git/`
//        - `node_modules/`
//        - `graphify-out/` (derived graph data; references there are
//          index noise, not real links — they get regenerated next time
//          `graphify update .` runs)
//        - `.graphifyignore`, `.graphify_*` runtime files
//        - Binary files (matched by extension: png/jpg/jpeg/gif/webp/
//          svg/ico/pdf/woff/woff2/ttf/otf/mp4/mp3/mp4/webm/zip/tar/
//          gz/br/ogg/wav)
//      Text and code files (md, html, js, css, json, yml, yaml, toml,
//      txt, xml, sh, env) are scanned with a per-extension allow-list
//      to avoid the cost of opening every binary on disk.
//
//   3. In projects that ship a `sw.js` (sinonimia, okeymoney, calculia,
//      memofun, routime, teclatlon — apptonomia has none), bump the
//      `VERSION` literal by 1.
//      Apptonomia is skipped by default — pass `--include-meta` to also
//      bump anything it might gain later. (No-op today.)
//
// Idempotent. If the rename already happened, the second run is a no-op:
// every old filename is gone, every reference has already been migrated,
// every `VERSION` bump is a one-step increment (still safe to re-run —
// it just bumps again).
//
// Usage:
//
//   node scripts/rename-doc-lowercase.js                    # default: check mode on all siblings
//   node scripts/rename-doc-lowercase.js --apply            # actually rename + update refs + bump VERSION
//   node scripts/rename-doc-lowercase.js --target ../<proj> # restrict to one sibling (repeatable)
//   node scripts/rename-doc-lowercase.js --dry-run          # show what would change without touching anything
//                                                            #   (uses `git mv` for renames so the diff is visible)
//
// Flags:
//
//   --check           Default mode. Report-only: list every rename, every
//                     reference update, every VERSION bump that the apply
//                     pass would do, but do not write anything. Exits 0
//                     when nothing needs to change, 1 otherwise.
//   --apply           Apply the rename + reference updates + VERSION bump.
//                     Always exits 0 unless an unexpected I/O error occurs.
//   --dry-run         Like --check but uses `git mv` for renames so the
//                     proposed change is visible in `git status`. References
//                     and VERSION are NOT touched in --dry-run.
//   --target <dir>    Restrict to a specific project directory (one per flag,
//                     repeatable). Path is resolved relative to CWD. May be
//                     an absolute path or a `../sibling` style path.
//                     Without this flag, all six PWA-shipping siblings of
//                     apptonomia are targeted.
//   --include-meta    Also process apptonomia itself (no-op today: it has
//                     no `doc/` and no `sw.js`, but `--apply` will still
//                     update any cross-sibling reference tables in
//                     apptonomia/CLAUDE.md pointing at the OLD names).
//                     Without this flag, apptonomia is skipped to keep the
//                     pass focused on siblings that actually ship a `doc/`.
//
// Exit codes:
//
//   0  success (in --check: nothing to do, or all changes done under
//               --apply).
//   1  (--check only) there is work to do; the user has not passed --apply.
//   2  a fatal I/O error happened (filesystem permission, missing file, ...).
//
// Style: vanilla Node, no dependencies. Mirrors the no-build, no-deps
// tooling rule documented in `CLAUDE.md` §A.2.

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

// --- 1. Rename map ---------------------------------------------------------
//
// Hardcoded on purpose. There are six mappings; keeping the table inline
// makes it trivial to read and audit, and a future renamer doesn't have to
// parse Markdown to learn the rules.
//
// Mappings apply per (old -> new). The script also accepts the same name
// as both left and right (no-op), so re-running is safe.

const RENAME_MAP = [
  { from: 'SPEC.md',       to: 'spec.md' },
  { from: 'I18N.md',       to: 'i18n.md' },
  { from: 'CONTENTS.md',   to: 'contents.md' },
  { from: 'CONTENIDOS.md', to: 'contenidos.md' },
  { from: 'README.md',     to: 'readme.md' },     // applies only to doc/<lang>/README.md
  { from: 'RENAME_MAP.md', to: 'rename_map.md' },
];

// Case-insensitive lookup: the regex we use to find old filenames runs
// with the `i` flag so the captured filename comes back lowercased
// (`spec.md`, `i18n.md`, ...). Mapping back to the canonical `from`
// requires a lowercase key. We build it once at module load.
const RENAME_MAP_LOOKUP = Object.fromEntries(
  RENAME_MAP.map((m) => [m.from.toLowerCase(), m]),
);

// --- 2. Targets ------------------------------------------------------------

const SUITE_SLUGS = [
  'calculia', 'memofun', 'okeymoney',
  'sinonimia', 'teclatlon', 'routime',
];

function discoverSuiteDir() {
  // this script lives at apptonomia/scripts/rename-doc-lowercase.js
  return path.resolve(__dirname, '..', '..');
}

function defaultTargets(suiteDir, includeMeta) {
  const out = [];
  for (const slug of SUITE_SLUGS) {
    out.push(path.join(suiteDir, slug));
  }
  if (includeMeta) out.push(path.join(suiteDir, 'apptonomia'));
  return out;
}

function parseArgs(argv) {
  const args = { check: false, apply: false, dryRun: false, targets: [], includeMeta: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--check')         args.check = true;
    else if (a === '--apply')    args.apply = true;
    else if (a === '--dry-run')  args.dryRun = true;
    else if (a === '--include-meta') args.includeMeta = true;
    else if (a === '--target') {
      const v = argv[++i];
      if (!v) throw new Error('--target requires a path');
      args.targets.push(path.resolve(v));
    }
    else if (a === '--help' || a === '-h') {
      printUsage();
      process.exit(0);
    }
    else throw new Error(`Unknown flag: ${a}`);
  }
  if (args.check && args.apply) throw new Error('Pick one of --check or --apply.');
  if (args.apply && args.dryRun) throw new Error('Pick one of --apply or --dry-run.');
  if (!args.check && !args.apply && !args.dryRun) args.check = true;
  return args;
}

function printUsage() {
  console.log([
    'Usage:',
    '  node scripts/rename-doc-lowercase.js [--check | --apply | --dry-run]',
    '                                       [--target <dir> ...] [--include-meta]',
    '',
    'Default is --check. See the script header for the full reference.',
  ].join('\n'));
}

// --- 3. File enumeration --------------------------------------------------

// Extensions we'll scan for text references. Keep this small and
// specific; the goal is to catch Markdown links, code comments, and
// shipped config — not to interpret every file that happens to be
// text-shaped.
const TEXT_EXTS = new Set([
  '.md', '.markdown', '.html', '.htm',
  '.js', '.mjs', '.cjs',
  '.css',
  '.json', '.jsonc', '.json5',
  '.yml', '.yaml', '.toml',
  '.txt', '.xml',
  '.sh', '.bash', '.zsh',
  '.ps1', '.bat', '.cmd',
  '.env', '.cfg', '.ini',
  '.cjs.snap',  // jest snapshots
]);

// Directories we never recurse into. Matched by full path segment
// (joined with `/`, normalised), so `.claude/worktrees` is a single
// entry and matches the agents' in-flight workspaces without also
// excluding other `.claude/` directories (e.g. `.claude/skills/`).
const SKIP_DIRS = new Set([
  '.git',
  'node_modules',
  'graphify-out',
  '.graphify_runtime',
  '.cache',
  'dist',
  'build',
  '.next',
  '.nuxt',
  '.claude/worktrees', // each agent's in-flight workspace; leaves alone
]);

const SKIP_FILES = new Set([
  '.graphifyignore',
  '.graphify_detect.json',
]);

// Normalise a directory path so the SKIP_DIRS lookup is path-separator
// independent (Windows uses `\`, POSIX uses `/`). Always returns a
// forward-slash form for matching.
function normalizeDirPath(p) {
  return p.split(path.sep).join('/').replace(/\/+$/, '');
}

function isSkippedDir(dirPath) {
  // Match by the full relative path from projectDir, but since we
  // don't track that here, we walk up the path and check each ancestor.
  // This keeps SKIP_DIRS entries like `.claude/worktrees` working
  // without forcing us to track parent state at call sites.
  let cur = dirPath;
  while (true) {
    const norm = normalizeDirPath(cur);
    if (SKIP_DIRS.has(norm)) return true;
    const parent = path.dirname(cur);
    if (parent === cur) return false;
    cur = parent;
  }
}

// --- 4. Helpers ------------------------------------------------------------

function listFiles(root, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(root, { withFileTypes: true });
  } catch (_) {
    return out; // unreadable dir — skip silently
  }
  for (const e of entries) {
    const full = path.join(root, e.name);
    if (e.isDirectory()) {
      if (isSkippedDir(full)) continue;
      listFiles(full, out);
    } else if (e.isFile()) {
      out.push(full);
    }
  }
  return out;
}

function isTextLike(file) {
  const base = path.basename(file);
  if (SKIP_FILES.has(base)) return false;
  const ext = path.extname(base).toLowerCase();
  if (!ext) return false; // skip extensionless files unless they have a known extension
  return TEXT_EXTS.has(ext);
}

// Files where we'll both scan for references AND consider renaming
// (the rename happens only if the file lives under doc/<lang>/ with a
// matching uppercase name).
function isDocMdFile(file, projectDir) {
  const rel = path.relative(projectDir, file).split(path.sep).join('/');
  return /^doc\/[a-z]{2}\/[^/]+\.md$/.test(rel);
}

// --- 5. Plan a project's rename + ref-update set ---------------------------

function planForProject(projectDir, args) {
  const plan = { projectDir, renames: [], refUpdates: [], swBump: null, errors: [] };
  const files = listFiles(projectDir);

  // 5a. Plan the file renames (only those that actually exist on disk).
  const docMds = files.filter((f) => isDocMdFile(f, projectDir));
  for (const f of docMds) {
    const base = path.basename(f);
    const mapping = RENAME_MAP.find((m) => m.from === base);
    if (!mapping) continue; // already lowercase, skip
    const rel = path.relative(projectDir, f).split(path.sep).join('/');
    plan.renames.push({
      from: rel,
      to:   rel.replace(base, mapping.to),
    });
  }

  // 5b. Plan the text reference updates.
  //
  //     We ONLY replace a bare token like `SPEC.md` when it sits inside a
  //     `doc/<lang>/` path in the source text. That bounds the replacement
  //     to the filenames we actually renamed, and avoids rewriting every
  //     README.md, I18N.md, etc. that happens to occur in unrelated
  //     contexts (third-party skill docs at `.claude/skills/cloudflare/
  //     references/**/*.md`, URLs of the form
  //     `https://github.com/.../README.md`, etc.).
  //
  //     The pattern matches the path component only when it lives
  //     between a `doc/<lang>/` prefix and a path separator / terminator
  //     (space, `)`, `"`, `'`, `]`, end of line, etc.). A leading `../`/
  //     `./`/`<base>/` is allowed because the existing references cross
  //     project roots (`../calculia/doc/en/SPEC.md`, `https://.../routime/
  //     blob/main/doc/en/SPEC.md`).
// (first-of-two; the apply-phase duplicate below reuses the same regex)
// Match a `doc/<lang>/<file>.md` segment only when it is preceded by a
// path separator (`/`), whitespace (e.g. prose "see doc/en/SPEC.md"),
// a line boundary, an opening paren (Markdown link target), or an
// opening backtick (inline-code). Allowed pre-contexts:
//
//   - `/`        : relative paths, sibling-project refs, URL path segments
//   - whitespace : prose references inline (`ver doc/en/SPEC.md §5`)
//   - `^` / `\n` : line-anchored references (`m` flag enables this)
//   - `(`        : Markdown-link target bracket after a previous segment
//   - `` ` ``    : inline code fences in technical.md body
//
// We deliberately do NOT consume the leading context; we just find
// every `doc/<lang>/<file>.md` boundary that sits there and update the
// `<file>.md` part in place. This avoids rewriting `README.md`,
// `I18N.md` etc. that appear in unrelated third-party contexts (skill
// docs at `.claude/skills/cloudflare/references/**/*.md`, URLs of the
// form `https://github.com/.../README.md`, etc.).
  const DOC_PATH_RE = /(?<=^|[\s/`\n(])doc\/(en|es)\/([^\s"'`)\]<>,;]*?\.md)/gmi;
  for (const f of files) {
    if (!isTextLike(f)) continue;
    let content;
    try {
      content = fs.readFileSync(f, 'utf8');
    } catch (_) {
      continue;
    }

    const counts = {}; // { 'doc/en/spec.md': { from: 'SPEC.md', to: 'spec.md', n: N }, ... }
    let replaced = content.replace(DOC_PATH_RE, (full, lang, fname) => {
      // The regex captures the final segment as `fname`; with the `i`
      // flag, `fname` is whatever case the source used (`SPEC.md`,
      // `Spec.md`, `spec.md`, ...). Look up the lowercase form so we
      // catch every variant.
      const mapping = RENAME_MAP_LOOKUP[fname.toLowerCase()];
      if (!mapping) return full; // already lowercased by an earlier pass, or not in the rename set
      // Record a key in the original-case form (`doc/en/SPEC.md`) for
      // human-readable plan output.
      const originalKey = `doc/${lang}/${mapping.from}`;
      if (!counts[originalKey]) counts[originalKey] = { from: mapping.from, to: mapping.to, count: 0 };
      counts[originalKey].count++;
      // Rewrite `full` (which is `doc/<lang>/<file>.md`) by replacing
      // the trailing segment, which `fname` (possibly lowercased) is a
      // substring of. Replace only the substring that was captured so we
      // never touch anything outside the match.
      return full.slice(0, full.length - fname.length) + mapping.to;
    });

    if (replaced !== content) {
      const rel = path.relative(projectDir, f).split(path.sep).join('/');
      const matches = Object.entries(counts).map(([key, v]) => ({
        from: v.from,
        to: v.to,
        count: v.count,
        path: key,
      }));
      plan.refUpdates.push({ file: rel, matches });
      // also stash the new content so applyRefUpdates can reuse it
      // without re-scanning.
      plan.refUpdates[plan.refUpdates.length - 1].newContent = replaced;
    }
  }

  // 5c. Plan the sw.js VERSION bump, if any.
  const swPath = path.join(projectDir, 'sw.js');
  if (fs.existsSync(swPath)) {
    try {
      const sw = fs.readFileSync(swPath, 'utf8');
      const m = sw.match(/^var\s+VERSION\s*=\s*['"]([^'"]+)['"]\s*;/m);
      if (m) {
        const next = bumpVersion(m[1]);
        plan.swBump = { from: m[1], to: next };
      } else {
        plan.errors.push('sw.js found but VERSION literal not in expected form (var VERSION = "x";). Skipping bump.');
      }
    } catch (e) {
      plan.errors.push('sw.js unreadable: ' + e.message);
    }
  }

  return plan;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Bump a `slug-vN` style version by 1. Falls back to `v2` if the
// existing value doesn't match the convention (e.g. someone changed
// the literal by hand and we still want a sensible bump).
function bumpVersion(v) {
  const m = v.match(/^(.*?)(\d+)$/);
  if (!m) return v + '-v2';
  return m[1] + (parseInt(m[2], 10) + 1);
}

// --- 6. Print plan ---------------------------------------------------------

function summarizePlan(plan) {
  const lines = [];
  lines.push(`[${path.basename(plan.projectDir)}]`);
  if (plan.renames.length === 0 && plan.refUpdates.length === 0 && !plan.swBump) {
    lines.push('  no changes needed');
    lines.push('');
    return lines.join('\n');
  }
  for (const r of plan.renames) {
    lines.push(`  RENAME  ${r.from}  ->  ${r.to}`);
  }
  for (const u of plan.refUpdates) {
    const counts = u.matches.map((m) => `${m.path}  ${m.from}->${m.to}x${m.count}`).join(', ');
    lines.push(`  REFS    ${u.file}  (${counts})`);
  }
  if (plan.swBump) {
    lines.push(`  SW      sw.js  VERSION ${plan.swBump.from} -> ${plan.swBump.to}`);
  }
  for (const e of plan.errors) {
    lines.push(`  ! ${e}`);
  }
  lines.push('');
  return lines.join('\n');
}

// --- 7. Apply --------------------------------------------------------------

function applyRenames(plan, args) {
  for (const r of plan.renames) {
    const fromFull = path.join(plan.projectDir, r.from);
    const toFull = path.join(plan.projectDir, r.to);
    if (!fs.existsSync(fromFull)) continue;
    // Note: we deliberately do NOT pre-check `fs.existsSync(toFull)`.
    // On case-insensitive filesystems (NTFS / default Windows) the
    // source and destination resolve to the same path, and the only
    // thing that differs is the case used in the filename. Letting
    // `fs.renameSync` run is what flips the case; pre-checking would
    // falsely report "destination already exists" and skip the rename.
    if (args.dryRun) {
      // Show the would-be rename via git so the user can review it in `git status`.
      // `git mv` refuses to operate on files with uncommitted changes; in
      // that case we silently skip (the file will be moved under --apply).
      try {
        execFileSync('git', ['mv', '--', r.from, r.to], { cwd: plan.projectDir, stdio: 'pipe' });
      } catch (_) {
        // Either the file is dirty or untracked; --dry-run will still
        // report the proposed rename in the plan, but won't move the
        // file. The user re-runs with --apply once the working tree is
        // settled.
      }
    } else {
      fs.renameSync(fromFull, toFull);
    }
  }
}

function applyRefUpdates(plan) {
  // Replan refUpdates because the on-disk filenames changed during
  // applyRenames; the plan from before is now stale.
  const files = listFiles(plan.projectDir);

  // (second-of-two; mirrors the regex above. Same pattern, `m` flag so
  //  `^` matches at every line start — leading `doc/` on its own line
  //  is picked up too. The trailing `i` makes the filename portion
  //  case-insensitive so references to `SPEC.md`, `I18N.md`, etc. match
  //  the RENAME_MAP entries.)
  const DOC_PATH_RE = /(?<=^|[\s/`\n(])doc\/(en|es)\/([^\s"'`)\]<>,;]*?\.md)/gmi;

  for (const f of files) {
    if (!isTextLike(f)) continue;
    let content;
    try {
      content = fs.readFileSync(f, 'utf8');
    } catch (_) {
      continue;
    }
    const replaced = content.replace(DOC_PATH_RE, (full, lang, fname) => {
      const mapping = RENAME_MAP_LOOKUP[fname.toLowerCase()];
      if (!mapping) return full;
      return full.slice(0, full.length - fname.length) + mapping.to;
    });
    if (replaced !== content) fs.writeFileSync(f, replaced, 'utf8');
  }
}

function applySwBump(plan) {
  if (!plan.swBump) return;
  const swPath = path.join(plan.projectDir, 'sw.js');
  if (!fs.existsSync(swPath)) return;
  const cur = fs.readFileSync(swPath, 'utf8');
  // Replace only the first occurrence (there should be exactly one).
  const re = new RegExp("^var\\s+VERSION\\s*=\\s*['\"]" + escapeRegExp(plan.swBump.from) + "['\"]\\s*;", 'm');
  if (!re.test(cur)) return;
  const next = cur.replace(re, "var VERSION = '" + plan.swBump.to + "';");
  fs.writeFileSync(swPath, next, 'utf8');
}

// --- 8. Driver -------------------------------------------------------------

function main() {
  const args = parseArgs(process.argv.slice(2));
  const suiteDir = discoverSuiteDir();
  const targets = args.targets.length > 0
    ? args.targets
    : defaultTargets(suiteDir, args.includeMeta);

  console.log(`Suite root: ${suiteDir}`);
  console.log(`Mode: ${args.apply ? 'apply' : args.dryRun ? 'dry-run' : 'check'}  Targets: ${targets.length}${args.includeMeta ? '  (including apptonomia)' : ''}`);
  console.log('');

  let anyWork = false;

  for (const t of targets) {
    if (!fs.existsSync(t) || !fs.statSync(t).isDirectory()) {
      console.log(`[${path.basename(t)}] SKIP    (not a directory: ${t})`);
      continue;
    }
    const plan = planForProject(t, args);
    if (plan.renames.length === 0 && plan.refUpdates.length === 0 && !plan.swBump && plan.errors.length === 0) {
      console.log(`[${path.basename(t)}] NOOP`);
      console.log('');
      continue;
    }
    anyWork = true;
    if (args.apply) {
      applyRenames(plan, args);
      applyRefUpdates(plan);
      applySwBump(plan);
      console.log(summarizePlan(plan).replace(/^/gm, '  '));
      console.log(`[${path.basename(t)}] OK`);
      console.log('');
    } else if (args.dryRun) {
      // only run the rename through git mv; references and VERSION shown but untouched.
      applyRenames(plan, args);
      console.log(summarizePlan(plan).replace(/^/gm, '  '));
      console.log(`[${path.basename(t)}] DRY-RUN  (git mv applied; references + VERSION not changed; re-run --apply to commit)`);
      console.log('');
    } else {
      console.log(summarizePlan(plan));
    }
  }

  if (args.check && anyWork) process.exit(1);
}

if (require.main === module) {
  try {
    main();
  } catch (e) {
    console.error(e.stack || e.message || String(e));
    process.exit(2);
  }
}

module.exports = { RENAME_MAP, RENAME_MAP_LOOKUP, planForProject, bumpVersion };
