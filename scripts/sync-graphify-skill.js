#!/usr/bin/env node
// scripts/sync-graphify-skill.js
//
// Two subcommands (driven by the first non-flag argument):
//
//   sync [options]    Keep the per-project copy of the graphify skill in sync
//                    with a single canonical source, so every project in the
//                    Miralante suite uses the same skill version.
//                    Canonical source (default): user-level installation at
//                      ~/.claude/skills/graphify/   (resolved via os.homedir()).
//                    Override with --from <dir>.
//                    Targets (default): the seven Miralante suite projects,
//                      resolved as siblings of this script's parent dir.
//                      Override with --target <dir> (repeatable) or
//                      --targets-file <file>.
//                    Flags:
//                      --check         print SHA256 of every target's
//                                      SKILL.md, compare to the canonical
//                                      one. Does not modify anything.
//                      --apply         copy SKILL.md + references/ where
//                                      missing or SHA mismatches. Never
//                                      overwrites .graphifyignore or
//                                      .graphify_* runtime state.
//
//   update [options]  Detect which sibling projects have changed since their
//                    last graph build, run `graphify update` in each, then
//                    rebuild the meta-graph at graphify-out-meta/.
//                    Flags:
//                      --check         like --check for sync; report only.
//                      --apply         run graphify update where stale, then
//                                      rebuild meta-graph.
//                      --all           include apptonomia/ (the meta-project
//                                      root); by default it is skipped because
//                                      it has no per-project graph yet.
//                      --target <dir>  restrict to a single project (repeatable).
//
//   ask <slug> "..." Delegate a question to a sibling's deep per-project graph
//                    instead of the cross-project meta-graph. This is the
//                    "use the sibling's own graph" path: the agent stays in
//                    apptonomia (no `cd ../<sibling>` needed) and we route the
//                    call to graphify query on that sibling's graphify-out/
//                    graph.json, with cwd set to the sibling so .graphifyignore
//                    and other defaults still apply.
//                    Positional:
//                      <slug>          one of the seven siblings
//                      "<question>"    the natural-language query
//                    Flags:
//                      --graph <path>    override the graph.json location
//                      --type            query|explain   (default: query;
//                                         path/path_query need two labels A B,
//                                         run those from inside the sibling)
//                      --budget <N>      cap output tokens (default: 2000)
//                      --raw             use DFS instead of BFS
//                      --refresh         force `graphify update .` in the
//                                        sibling before answering, even when
//                                        the graph is already fresh
//                      --refresh-force   same as --refresh but passes
//                                        `--force` to the underlying
//                                        `graphify update .`, overriding
//                                        graphify's safety guard that
//                                        refuses to overwrite a smaller
//                                        graph (e.g. 435 nodes) with an
//                                        older one (e.g. 500 nodes). Use
//                                        when the corpus has shrunk and you
//                                        know the new size is correct.
//                      --refresh-if-stale  same, but only when the graph is
//                                        stale (HEAD != GRAPH_REPORT commit);
//                                        the recommended agent-driven path:
//                                        always pass this so answers reflect
//                                        the latest code without manual
//                                        `update --apply` calls.
//                      --refresh-if-stale-force  combine --refresh-if-stale
//                                        with the --force passthrough.
//                    Default behavior (no refresh flag): if the per-project
//                    graph is stale, print a one-line WARNING before answering
//                    so the agent knows the answer may be outdated; the query
//                    still runs against whatever graph is on disk.
//
// Default subcommand (no first non-flag arg) is `sync --check`, so the
// legacy invocation `node scripts/sync-graphify-skill.js` still works.
//
// Examples:
//   node scripts/sync-graphify-skill.js                          # sync --check
//   node scripts/sync-graphify-skill.js sync --apply             # fix skill drift
//   node scripts/sync-graphify-skill.js update --check           # report stale graphs
//   node scripts/sync-graphify-skill.js update --apply           # update + meta
//   node scripts/sync-graphify-skill.js update --apply --all     # include apptonomia
//   node scripts/sync-graphify-skill.js ask calculia "how does the Wallet activity render its money keypad?"
//   node scripts/sync-graphify-skill.js ask memofun --type explain "App.decks"
//   node scripts/sync-graphify-skill.js ask --refresh-if-stale calculia "what changed in the Wallet since last build?"
//   node scripts/sync-graphify-skill.js ask --refresh okeymoney "rebuild from scratch then query the dashboard layout"
//   node scripts/sync-graphify-skill.js ask --refresh-force sinonimia "what are the main CSS files in the app?"
//
// Exit codes:
//   0  success (no drift, or all updates applied, or skip when nothing to do)
//   1  drift detected (check mode) or update failures (apply mode)
//   2  bad arguments / source not found

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');
const { execSync, spawnSync } = require('child_process');

// --- Argument parsing ---------------------------------------------------------

function parseArgs(argv) {
  // First non-flag token is the subcommand (default: 'sync').
  const args = {
    subcommand: 'sync',
    apply: false,
    check: false,
    from: null,
    targets: [],
    targetsFile: null,
    all: false,
    askSlug: null,
    askQuery: null,
    askGraph: null,
    askType: null,
    askBudget: null,
    askRaw: false,
    askRefresh: false,
    askRefreshIfStale: false,
    askRefreshForce: false,
    askRefreshIfStaleForce: false,
  };
  let i = 2;
  // Optional subcommand (sync | update | ask) before any flags.
  if (i < argv.length && !argv[i].startsWith('-')) {
    const sub = argv[i];
    if (sub !== 'sync' && sub !== 'update' && sub !== 'ask') {
      console.error(`Unknown subcommand: ${sub}`);
      printHelp(); process.exit(2);
    }
    args.subcommand = sub;
    i++;
  }
  // For `ask`, separate flags from positional args without assuming order.
  // The slug is the single non-flag token; everything else non-flag is the
  // query. Flags may appear before, after, or around the positional args.
  if (args.subcommand === 'ask') {
    const remaining = argv.slice(i);
    function isFlag(tok) { return tok && tok.startsWith('-'); }
    function applyFlag(idx) {
      // Consumes one token (and a value if the flag is not a boolean).
      // Returns the new index.
      if (idx >= remaining.length) return idx;
      const tok = remaining[idx];
      if (tok === '--help' || tok === '-h') { printHelp(); process.exit(0); }
      else if (tok === '--raw') { args.askRaw = true; return idx + 1; }
      else if (tok === '--refresh') { args.askRefresh = true; return idx + 1; }
      else if (tok === '--refresh-force') { args.askRefresh = true; args.askRefreshForce = true; return idx + 1; }
      else if (tok === '--refresh-if-stale') { args.askRefreshIfStale = true; return idx + 1; }
      else if (tok === '--refresh-if-stale-force') { args.askRefreshIfStale = true; args.askRefreshForce = true; return idx + 1; }
      else if (tok === '--graph') { if (idx + 1 >= remaining.length) { console.error('--graph requires a value'); process.exit(2); } args.askGraph = remaining[idx + 1]; return idx + 2; }
      else if (tok === '--type') { if (idx + 1 >= remaining.length) { console.error('--type requires a value'); process.exit(2); } args.askType = remaining[idx + 1]; return idx + 2; }
      else if (tok === '--budget') { if (idx + 1 >= remaining.length) { console.error('--budget requires a value'); process.exit(2); } args.askBudget = remaining[idx + 1]; return idx + 2; }
      else { console.error(`Unknown argument for ask: ${tok}`); printHelp(); process.exit(2); }
    }
    // Single linear pass. First non-flag is the slug; everything after that is
    // either query tokens or flags. A flag interrupts the query, and the next
    // non-flag token resumes it.
    let k = 0;
    // Optional leading flag group (e.g. `ask --type query slug "q"`).
    while (k < remaining.length && isFlag(remaining[k])) k = applyFlag(k);
    if (k >= remaining.length || isFlag(remaining[k])) {
      console.error('Usage: ask <slug> "<question>"');
      process.exit(2);
    }
    args.askSlug = remaining[k];
    k++;
    // Now alternate: consume query tokens until a flag, then handle the flag,
    // then resume query tokens. This handles `ask slug --type X q1 q2 --raw q3`.
    const queryTokens = [];
    while (k < remaining.length) {
      if (isFlag(remaining[k])) {
        k = applyFlag(k);
      } else {
        queryTokens.push(remaining[k]);
        k++;
      }
    }
    args.askQuery = queryTokens.join(' ');
    if (!args.askQuery) {
      console.error('Usage: ask <slug> "<question>"');
      process.exit(2);
    }
    // Skip the rest of argv; we already parsed everything.
    i = argv.length;
  }
  for (; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--apply') { args.apply = true; args.check = false; }
    else if (a === '--check') { args.check = true; args.apply = false; }
    else if (a === '--from') { args.from = argv[++i]; }
    else if (a === '--graph') { args.askGraph = argv[++i]; }
    else if (a === '--type') { args.askType = argv[++i]; }
    else if (a === '--budget') { args.askBudget = argv[++i]; }
    else if (a === '--raw') { args.askRaw = true; }
    else if (a === '--target') { args.targets.push(argv[++i]); }
    else if (a === '--targets-file') { args.targetsFile = argv[++i]; }
    else if (a === '--all') { args.all = true; }
    else if (a === '-h' || a === '--help') { printHelp(); process.exit(0); }
    else { console.error(`Unknown argument: ${a}`); printHelp(); process.exit(2); }
  }
  if (args.subcommand === 'sync' && !args.apply && !args.check) args.check = true;
  if (args.subcommand === 'update' && !args.apply && !args.check) args.check = true;
  return args;
}

function printHelp() {
  console.log('Usage: node scripts/sync-graphify-skill.js [sync|update|ask] [options]');
  console.log('');
  console.log('Subcommands:');
  console.log('  sync    [(--check)|--apply] [--from <dir>] [--target <dir>...] [--targets-file <file>]');
  console.log('  update  [(--check)|--apply] [--all] [--target <d      override the graph.json location');
  console.log('                                --type query|explain    (default: query; path/path_query need A B labels)');
  console.log('                                --budget <N>            cap output tokens (default: 2000)');
  console.log('                                --raw                   use DFS instead of BFS');
  console.log('                                --refresh               force graphify update . in the sibling before answering');
  console.log('                                --refresh-force         same as --refresh but passes --force to graphify update');
  console.log('                                                       (overrides "refuse to overwrite smaller graph")');
  console.log('                                --refresh-if-stale      same, but only when the graph is stale (recommended)');
  console.log('                                --refresh-if-stale-force  combine --refresh-if-stale with --force passthrough');
  console.log('');
  console.log('Default (no subcommand): sync --check');
}

// --- Filesystem helpers -------------------------------------------------------

function sha256(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function shortSha(s) { return s ? s.slice(0, 12) : '(missing)'; }

function copyDirRecursive(srcDir, dstDir) {
  // Filter out .graphify_* state files: those are runtime cache per project
  // and would couple the copy to a specific Python interpreter / scan root.
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  fs.mkdirSync(dstDir, { recursive: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.graphify_')) continue; // skip state
    const srcPath = path.join(srcDir, entry.name);
    const dstPath = path.join(dstDir, entry.name);
    if (entry.isDirectory()) copyDirRecursive(srcPath, dstPath);
    else fs.copyFileSync(srcPath, dstPath);
  }
}

function copySkillFiles(srcRoot, dstRoot) {
  // Copy SKILL.md + references/. Preserve .graphifyignore of the target
  // (graphify reads .gitignore + .graphifyignore together; the per-project
  // ignore file is project-specific and must never be overwritten).
  fs.mkdirSync(dstRoot, { recursive: true });
  fs.copyFileSync(path.join(srcRoot, 'SKILL.md'), path.join(dstRoot, 'SKILL.md'));
  const refsSrc = path.join(srcRoot, 'references');
  const refsDst = path.join(dstRoot, 'references');
  if (fs.existsSync(refsSrc)) copyDirRecursive(refsSrc, refsDst);
}

// --- Project list -------------------------------------------------------------

const DEFAULT_PROJECTS = [
  'apptonomia',
  'calculia',
  'memofun',
  'okeymoney',
  'sinonimia',
  'teclatlon',
  'routime',
  'enroca',
];

function discoverSuiteDir() {
  // This script lives at <suite>/<project>/scripts/sync-graphify-skill.js.
  // The suite root is two levels up from this file.
  return path.resolve(__dirname, '..', '..');
}

function resolveTargets(args) {
  const explicit = args.targets.length > 0;
  if (args.targetsFile) {
    const lines = fs.readFileSync(args.targetsFile, 'utf8').split(/\r?\n/)
      .map(l => l.trim()).filter(Boolean);
    return lines.map(l => path.resolve(l));
  }
  if (explicit) return args.targets.map(t => path.resolve(t));
  const suite = discoverSuiteDir();
  return DEFAULT_PROJECTS.map(p => path.join(suite, p));
}

function resolveSource(args) {
  if (args.from) return path.resolve(args.from);
  return path.join(os.homedir(), '.claude', 'skills', 'graphify');
}

// --- Graph-update subcommand: stale detection + update + meta-graph rebuild ----

function runCapture(cmd, args, opts) {
  // Thin wrapper around spawnSync that returns { code, stdout, stderr }.
  const r = spawnSync(cmd, args, { encoding: 'utf8', ...opts });
  return {
    code: r.status === null ? -1 : r.status,
    stdout: (r.stdout || '').trim(),
    stderr: (r.stderr || '').trim(),
  };
}

function resolveGraphifyInterpreter() {
  // graphify is shipped via `uv tool install graphifyy`. The canonical path on
  // Windows is %APPDATA%\uv\tools\graphifyy\Scripts\python.exe. We trust that
  // (no Graphify interpreter-less execution here) and fail loudly otherwise.
  const candidate = path.join(
    process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'),
    'uv', 'tools', 'graphifyy', 'Scripts', 'python.exe');
  if (fs.existsSync(candidate)) return candidate;
  // Fallback: assume graphifyy is on PATH.
  const which = runCapture('where', ['graphify']);
  if (which.code === 0 && which.stdout) return which.stdout.split(/\r?\n/)[0].trim();
  return null;
}

function gitHead(projectDir) {
  // Returns the short HEAD hash of a project, or null if not a git repo.
  const r = runCapture('git', ['rev-parse', '--short', 'HEAD'], { cwd: projectDir });
  return r.code === 0 ? r.stdout : null;
}

function gitCommitDate(projectDir, commit) {
  // Returns the ISO date string of <commit> in <projectDir>, or null.
  const r = runCapture('git', ['log', '-1', '--format=%cI', commit], { cwd: projectDir });
  return r.code === 0 ? r.stdout : null;
}

function gitCommitsSince(projectDir, sinceIso) {
  // Returns the count of commits in <projectDir> since <sinceIso> (exclusive).
  // Empty stdout means zero commits.
  const r = runCapture('git', ['rev-list', '--count', `HEAD`, `--not`, `--since=${sinceIso}`], { cwd: projectDir });
  if (r.code !== 0) return null;
  const n = parseInt(r.stdout, 10);
  return Number.isFinite(n) ? n : 0;
}

function readReportCommit(projectDir) {
  // Reads the `Built from commit: \`<hash>\`` line from GRAPH_REPORT.md.
  // Returns the hash or null when the field is missing.
  const reportPath = path.join(projectDir, 'graphify-out', 'GRAPH_REPORT.md');
  if (!fs.existsSync(reportPath)) return null;
  const txt = fs.readFileSync(reportPath, 'utf8');
  const m = txt.match(/Built from commit:\s*`([0-9a-f]+)`/);
  return m ? m[1] : null;
}

function inspectProjectGraph(projectDir) {
  // Returns { status, reason, sinceCommit, sinceDate, commitsSince } where
  // status is one of: 'fresh', 'no-commit-metadata', 'commits-since-build',
  // 'built-but-stale', 'no-graph', 'git-error'.
  const graphJson = path.join(projectDir, 'graphify-out', 'graph.json');
  const result = { status: 'no-graph', reason: 'graph.json missing', sinceCommit: null, sinceDate: null, commitsSince: null };

  if (!fs.existsSync(graphJson)) {
    return result;
  }

  const head = gitHead(projectDir);
  if (!head) {
    return { ...result, status: 'git-error', reason: 'no git HEAD (not a git repo?)' };
  }

  const buildCommit = readReportCommit(projectDir);
  if (!buildCommit) {
    return { ...result, status: 'no-commit-metadata', reason: 'GRAPH_REPORT.md has no Built from commit field; assuming stale', sinceCommit: head };
  }

  // Hashes may have different lengths (short vs full). Resolve both to full
  // SHA via git rev-parse, then compare. If either is unresolvable, fall back
  // to prefix match on the build commit.
  const headResolved = runCapture('git', ['rev-parse', head], { cwd: projectDir }).stdout;
  const buildResolved = runCapture('git', ['rev-parse', buildCommit], { cwd: projectDir }).stdout;
  if (headResolved && buildResolved && headResolved === buildResolved) {
    return { ...result, status: 'fresh', reason: `HEAD=${headResolved.slice(0, 12)} matches build commit`, sinceCommit: buildCommit };
  }

  // Fallback: prefix match on the storage form of the build commit.
  const shortBuild = buildCommit.slice(0, 12);
  if (head.startsWith(shortBuild)) {
    return { ...result, status: 'fresh', reason: `HEAD=${head} matches build commit ${shortBuild} (prefix)`, sinceCommit: buildCommit };
  }

  const buildDate = gitCommitDate(projectDir, buildCommit);
  if (!buildDate) {
    return { ...result, status: 'built-but-stale', reason: `HEAD=${head} != build=${buildCommit}; build commit no longer resolvable`, sinceCommit: buildCommit };
  }
  const since = gitCommitsSince(projectDir, buildDate);
  return {
    ...result,
    status: 'commits-since-build',
    reason: `HEAD=${head} != build=${buildCommit}; ${since ?? '?'} commits since ${buildDate}`,
    sinceCommit: buildCommit,
    sinceDate: buildDate,
    commitsSince: since,
  };
}

function runGraphifyUpdate(projectDir, interpreter, opts) {
  // opts.force — pass `--force` to `graphify update .` so it overrides the
  // safety guard that refuses to overwrite a smaller graph with an older
  // (and larger) one. Use only when the agent knows the new size is
  // correct (e.g. the corpus shrank because entries/files were deleted).
  // Returns { code, stdout, stderr }; never throws.
  opts = opts || {};
  const args = ['-m', 'graphify', 'update', '.'];
  if (opts.force) args.push('--force');
  const r = spawnSync(interpreter, args, {
    cwd: projectDir,
    encoding: 'utf8',
    env: process.env,
  });
  return {
    code: r.status === null ? -1 : r.status,
    stdout: (r.stdout || '').trim(),
    stderr: (r.stderr || '').trim(),
  };
}

function rebuildMetaGraph(suiteDir) {
  const script = path.join(suiteDir, 'apptonomia', 'scripts', 'build-meta-graph.js');
  if (!fs.existsSync(script)) {
    console.log(`Meta-graph builder not found at ${script} (skipping).`);
    return { code: -1, stdout: '', stderr: 'no build-meta-graph.js' };
  }
  const r = spawnSync(process.execPath, [script], { encoding: 'utf8' });
  return {
    code: r.status === null ? -1 : r.status,
    stdout: (r.stdout || '').trim(),
    stderr: (r.stderr || '').trim(),
  };
}

function cmdUpdate(args) {
  const suiteDir = discoverSuiteDir();
  console.log(`Suite root: ${suiteDir}`);
  const targets = resolveTargets(args);
  console.log(`Mode: ${args.apply ? 'apply' : 'check'}  Targets: ${targets.length}${args.all ? '  (including apptonomia)' : '  (apptonomia skipped)'}`);
  console.log('');

  const stale = []; // [{ name, projectDir, inspection, interpreter }]
  const fresh = [];

  for (const t of targets) {
    const name = path.basename(t);
    if (name === 'apptonomia' && !args.all) {
      console.log(`[${name}] SKIP    (metaproject root; pass --all to include)`);
      continue;
    }
    const inspection = inspectProjectGraph(t);
    if (inspection.status === 'fresh') {
      fresh.push(name);
      console.log(`[${name}] FRESH   ${inspection.reason}`);
    } else {
      stale.push({ name, projectDir: t, inspection });
      console.log(`[${name}] STALE   [${inspection.status}] ${inspection.reason}`);
    }
  }

  console.log('');
  if (stale.length === 0) {
    console.log(`Nothing to update. ${fresh.length} project(s) fresh.`);
    if (args.apply) rebuildMetaGraph(suiteDir); // always rebuild meta on apply even if nothing changed
    process.exit(0);
  }

  if (!args.apply) {
    console.log(`Stale: ${stale.length} of ${targets.length}. Run with --apply to update.`);
    process.exit(1);
  }

  // Apply mode: resolve interpreter once, then update each stale project.
  const interpreter = resolveGraphifyInterpreter();
  if (!interpreter) {
    console.error('Could not locate a graphifyy Python interpreter. Install with:');
    console.error('  uv tool install --upgrade graphifyy');
    process.exit(2);
  }
  console.log(`Graphify interpreter: ${interpreter}`);
  console.log('');

  let updated = 0;
  let failed = 0;
  for (const s of stale) {
    console.log(`[${s.name}] updating (${s.inspection.status})...`);
    const r = runGraphifyUpdate(s.projectDir, interpreter);
    if (r.code === 0) {
      updated++;
      console.log(`[${s.name}] OK       (graphify update exit 0)`);
    } else {
      failed++;
      console.log(`[${s.name}] FAILED   (graphify update exit ${r.code})`);
      if (r.stderr) {
        for (const line of r.stderr.split(/\r?\n/).slice(0, 8)) console.log(`  ${line}`);
      }
    }
  }

  console.log('');
  console.log(`Update pass: ${updated} succeeded, ${failed} failed (continue-on-error: ${failed > 0 ? 'kept going' : 'n/a'}).`);

  // Rebuild meta-graph only if at least one project updated successfully.
  if (updated > 0) {
    console.log('Rebuilding meta-graph...');
    const m = rebuildMetaGraph(suiteDir);
    if (m.code === 0) {
      const summary = (m.stdout || '').split(/\r?\n/).filter(Boolean).slice(0, 12).join('\n');
      console.log(summary);
    } else {
      console.log(`Meta-graph rebuild failed (exit ${m.code}).`);
      if (m.stderr) console.log(m.stderr.split(/\r?\n/).slice(0, 8).join('\n'));
    }
  } else {
    console.log('Skipping meta-graph rebuild (no projects updated).');
  }

  process.exit(failed === 0 ? 0 : 1);
}

// --- ask subcommand: delegate a question to a sibling's graphify graph ------
// Purpose: from apptonomia (the metaproject root) run a `graphify query` against
// a sibling's own `graphify-out/graph.json`, so questions about a specific
// project use the deep per-project graph rather than the cross-project index
// at graphify-out-meta/. This is the "fast path — existing graph" rule from
// the graphify skill, applied across project boundaries without forcing the
// agent to `cd` into the sibling first.

const ALLOWED_ASK_TYPES = new Set(['query', 'explain']);

function resolveAskTarget(args) {
  // Resolves the absolute graph.json path to query against.
  // --graph, when given, wins. Otherwise <slug>/graphify-out/graph.json next to
  // the suite root.
  if (args.askGraph) {
    const abs = path.resolve(args.askGraph);
    if (!fs.existsSync(abs)) {
      console.error(`--graph points to a non-existent file: ${abs}`);
      process.exit(2);
    }
    return abs;
  }
  const suiteDir = discoverSuiteDir();
  const candidate = path.join(suiteDir, args.askSlug, 'graphify-out', 'graph.json');
  if (!fs.existsSync(candidate)) {
    console.error(`No graph found for slug "${args.askSlug}" at ${candidate}.`);
    console.error('Did you mean one of:', DEFAULT_PROJECTS.join(', '), '?');
    console.error('Or pass --graph <path-to-graph.json> explicitly.');
    process.exit(2);
  }
  return candidate;
}

function cmdAsk(args) {
  const slug = args.askSlug;
  const query = args.askQuery;
  if (!slug || !query) {
    console.error('Usage: ask <slug> "<question>"');
    process.exit(2);
  }
  if (!DEFAULT_PROJECTS.includes(slug)) {
    console.error(`Unknown slug: "${slug}". Expected one of: ${DEFAULT_PROJECTS.join(', ')}.`);
    process.exit(2);
  }

  const askType = args.askType || 'query';
  if (!ALLOWED_ASK_TYPES.has(askType)) {
    console.error(`--type must be one of: ${[...ALLOWED_ASK_TYPES].join(', ')} (or path/path_query with two labels).`);
    process.exit(2);
  }

  const interpreter = resolveGraphifyInterpreter();
  if (!interpreter) {
    console.error('Could not locate a graphifyy Python interpreter. Install with:');
    console.error('  uv tool install --upgrade graphifyy');
    process.exit(2);
  }

  // Refresh handling: by default, warn (don't block) if the per-project graph
  // is stale. --refresh forces a rebuild even when fresh. --refresh-if-stale
  // silently rebuilds only when stale (the agent-driven happy path). Add
  // `-force` to either to pass `--force` through to graphify update (overrides
  // its "refuse to overwrite smaller graph" guard).
  if (args.askRefresh && args.askRefreshIfStale) {
    console.error('Pass only one of --refresh / --refresh-if-stale (with or without -force).');
    process.exit(2);
  }
  const suiteDir = discoverSuiteDir();
  const siblingRoot = path.join(suiteDir, slug);
  if (args.askRefresh || args.askRefreshIfStale) {
    if (!fs.existsSync(siblingRoot)) {
      console.error(`Cannot refresh: sibling directory not found at ${siblingRoot}`);
      process.exit(2);
    }
    if (args.askRefreshIfStale) {
      const inspection = inspectProjectGraph(siblingRoot);
      if (inspection.status === 'fresh') {
        console.log(`[${slug}] graph is FRESH (${inspection.reason}); skipping rebuild.`);
      } else if (inspection.status === 'no-graph') {
        console.log(`[${slug}] no graph.json yet; running initial build...`);
        const r = runGraphifyUpdate(siblingRoot, interpreter, { force: args.askRefreshForce });
        if (r.code !== 0) {
          console.error(`[${slug}] graphify update failed (exit ${r.code}). Continuing without the refresh.`);
          if (r.stderr) console.error(r.stderr.split(/\r?\n/).slice(0, 8).join('\n'));
        } else {
          console.log(`[${slug}] initial graph built successfully.`);
        }
      } else {
        console.log(`[${slug}] graph is STALE [${inspection.status}]: ${inspection.reason}`);
        console.log(`[${slug}] running graphify update . ${args.askRefreshForce ? '(with --force)' : ''}...`);
        const r = runGraphifyUpdate(siblingRoot, interpreter, { force: args.askRefreshForce });
        if (r.code !== 0) {
          console.error(`[${slug}] graphify update failed (exit ${r.code}). Falling back to stale graph for the query.`);
          if (r.stderr) console.error(r.stderr.split(/\r?\n/).slice(0, 8).join('\n'));
        } else {
          console.log(`[${slug}] graph rebuilt successfully.`);
        }
      }
    } else {
      console.log(`[${slug}] --refresh${args.askRefreshForce ? ' --force' : ''}: forcing graphify update . ${args.askRefreshForce ? '(with --force)' : ''}...`);
      const r = runGraphifyUpdate(siblingRoot, interpreter, { force: args.askRefreshForce });
      if (r.code !== 0) {
        console.error(`[${slug}] graphify update failed (exit ${r.code}). Continuing with stale graph.`);
        if (r.stderr) console.error(r.stderr.split(/\r?\n/).slice(0, 8).join('\n'));
      } else {
        console.log(`[${slug}] graph rebuilt successfully.`);
      }
    }
  } else {
    // Default: warn if stale, don't block. Agent may re-run with --refresh.
    if (fs.existsSync(siblingRoot)) {
      const inspection = inspectProjectGraph(siblingRoot);
      if (inspection.status !== 'fresh') {
        console.log(`[${slug}] NOTE: graph is ${inspection.status.toUpperCase()} (${inspection.reason}).`);
        console.log(`         Pass --refresh-if-stale to rebuild automatically, or --refresh to force.`);
        console.log(`         Add -force (e.g. --refresh-if-stale-force) when the rebuild refuses to overwrite`);
        console.log('');
      }
    }
  }

  const graphPath = resolveAskTarget(args);

  // `path` / `path_query` need two positional labels (A and B), which we don't
  // have here. Reject early with a clear message instead of building a broken
  // invocation.
  if (args.askType === 'path_query' || args.askType === 'path') {
    console.error(`--type ${args.askType} requires two node labels (A and B).`);
    console.error('Run graphify path "A" "B" from inside the sibling directory,');
    console.error('or call this script with --type query for BFS traversal.');
    process.exit(2);
  }

  // Build the graphify CLI invocation. Use the sibling's directory as cwd so
  // graphify's defaults (graphify-out/graph.json, .graphifyignore) resolve
  // correctly even when --graph isn't passed.
  const siblingDir = path.dirname(path.dirname(graphPath)); // strip /graphify-out/graph.json
  const argv2 = ['-m', 'graphify', askType, query, '--graph', graphPath];
  if (args.askBudget) argv2.push('--budget', String(args.askBudget));
  if (args.askRaw) argv2.push('--dfs');

  console.log(`[${slug}] graphify ${askType} (cwd=${siblingDir})`);
  console.log(`         graph=${graphPath}`);
  console.log(`         query="${query}"`);
  console.log('');

  const r = spawnSync(interpreter, argv2, {
    cwd: siblingDir,
    encoding: 'utf8',
    env: process.env,
    stdio: 'inherit',
  });
  process.exit(r.status === null ? -1 : r.status);
}

// --- Main ---------------------------------------------------------------------

function main() {
  const args = parseArgs(process.argv);

  if (args.subcommand === 'update') {
    cmdUpdate(args);
    return;
  }

  if (args.subcommand === 'ask') {
    cmdAsk(args);
    return;
  }

  // sync subcommand (default)
  const source = resolveSource(args);
  if (!fs.existsSync(path.join(source, 'SKILL.md'))) {
    console.error(`Source SKILL.md not found at ${source}`);
    console.error('Pass --from <dir> to point to a different canonical copy.');
    process.exit(2);
  }
  const sourceSha = sha256(path.join(source, 'SKILL.md'));
  const targets = resolveTargets(args);
  console.log(`Source: ${source}`);
  console.log(`SKILL.md sha256: ${sourceSha}`);
  console.log(`Mode: ${args.apply ? 'apply' : 'check'}  Targets: ${targets.length}`);
  console.log('');

  let drifted = 0;
  let copied = 0;
  let missing = 0;

  for (const t of targets) {
    const name = path.basename(t);
    const dstSkill = path.join(t, '.claude', 'skills', 'graphify', 'SKILL.md');
    if (!fs.existsSync(dstSkill)) {
      missing++;
      if (args.apply) {
        copySkillFiles(source, path.join(t, '.claude', 'skills', 'graphify'));
        console.log(`[${name}] MISSING -> copied (${shortSha(sourceSha)})`);
        copied++;
      } else {
        console.log(`[${name}] MISSING (target has no .claude/skills/graphify/SKILL.md)`);
        drifted++;
      }
      continue;
    }
    const targetSha = sha256(dstSkill);
    if (targetSha === sourceSha) {
      console.log(`[${name}] OK       (${shortSha(targetSha)})`);
    } else {
      drifted++;
      if (args.apply) {
        copySkillFiles(source, path.join(t, '.claude', 'skills', 'graphify'));
        const newSha = sha256(dstSkill);
        console.log(`[${name}] DRIFT    ${shortSha(targetSha)} -> ${shortSha(newSha)} (copied)`);
        copied++;
      } else {
        console.log(`[${name}] DRIFT    target=${shortSha(targetSha)} source=${shortSha(sourceSha)}`);
      }
    }
  }

  console.log('');
  if (args.apply) {
    console.log(`Done. Copied: ${copied}, missing-before: ${missing}, still-drifted: ${drifted - copied}.`);
    process.exit(drifted - copied === 0 ? 0 : 1);
  } else {
    console.log(`Drifted or missing: ${drifted} of ${targets.length}. Run with --apply to fix.`);
    process.exit(drifted === 0 ? 0 : 1);
  }
}

main();

