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
// Default subcommand (no first non-flag arg) is `sync --check`, so the
// legacy invocation `node scripts/sync-graphify-skill.js` still works.
//
// Examples:
//   node scripts/sync-graphify-skill.js                          # sync --check
//   node scripts/sync-graphify-skill.js sync --apply             # fix skill drift
//   node scripts/sync-graphify-skill.js update --check           # report stale graphs
//   node scripts/sync-graphify-skill.js update --apply           # update + meta
//   node scripts/sync-graphify-skill.js update --apply --all     # include apptonomia
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
  };
  let i = 2;
  // Optional subcommand (sync | update) before any flags.
  if (i < argv.length && !argv[i].startsWith('-')) {
    const sub = argv[i];
    if (sub !== 'sync' && sub !== 'update') {
      console.error(`Unknown subcommand: ${sub}`);
      printHelp(); process.exit(2);
    }
    args.subcommand = sub;
    i++;
  }
  for (; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--apply') { args.apply = true; args.check = false; }
    else if (a === '--check') { args.check = true; args.apply = false; }
    else if (a === '--from') { args.from = argv[++i]; }
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
  console.log('Usage: node scripts/sync-graphify-skill.js [sync|update] [options]');
  console.log('');
  console.log('Subcommands:');
  console.log('  sync    [(--check)|--apply] [--from <dir>] [--target <dir>...] [--targets-file <file>]');
  console.log('  update  [(--check)|--apply] [--all] [--target <dir>...] [--targets-file <file>]');
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

function runGraphifyUpdate(projectDir, interpreter) {
  // Returns { code, stdout, stderr }; never throws.
  const r = spawnSync(interpreter, ['-m', 'graphify', 'update', '.'], {
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

// --- Main ---------------------------------------------------------------------

function main() {
  const args = parseArgs(process.argv);

  if (args.subcommand === 'update') {
    cmdUpdate(args);
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

