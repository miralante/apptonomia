#!/usr/bin/env node
// scripts/sync-cloudflare-skills.js
//
// Keep the per-project copy of every Cloudflare skill (cloudflare, wrangler,
// workers-best-practices, durable-objects, agents-sdk, web-perf, turnstile-spin,
// sandbox-stable, sandbox-next, sandbox-migrate-to-next, cloudflare-email-service,
// cloudflare-one, cloudflare-one-migrations) in sync with the single canonical
// source at ~/.copilot/skills/<skill>/. So every project in the Miralante
// suite ships the same skill version, no matter which folder the agent opens.
//
// Why a separate script (vs. extending sync-graphify-skill.js):
//   - graphify is its own one-skill sync with its own semantics
//     (.graphifyignore, .graphify_* state, the `ask`/`update` subcommands).
//     We don't want to silently change graphify's CLI surface for 14 other skills.
//   - Cloudflare skills are static (no .graphifyignore/state to skip, no
//     `ask`/`update` graphify commands). They just need SHA-based copy/refresh.
//
// Usage:
//   node scripts/sync-cloudflare-skills.js            # check (default)
//   node scripts/sync-cloudflare-skills.js --apply    # copy where drifted
//   node scripts/sync-cloudflare-skills.js --list     # show the canonical list
//   node scripts/sync-cloudflare-skills.js --target <dir>...     # restrict
//   node scripts/sync-cloudflare-skills.js --from <user-skills-dir>  # override source
//
// Exit codes:
//   0  success (no drift, or all drift fixed)
//   1  drift detected (check mode) or apply failures
//   2  bad arguments / source not found

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

// --- Skills to sync -----------------------------------------------------------
//
// Single source of truth. Add new Cloudflare skills here, then run
// `--apply` to replicate.  Each entry is a folder name under
// ~/.copilot/skills/. If a folder is missing on disk the script reports it
// (no implicit skip — be explicit, never auto-shrink).
const CLOUDFLARE_SKILLS = [
  'cloudflare',
  'cloudflare-email-service',
  'cloudflare-one',
  'cloudflare-one-migrations',
  'durable-objects',
  'wrangler',
  'workers-best-practices',
  'web-perf',
  'turnstile-spin',
  'sandbox-stable',
  'sandbox-next',
  'sandbox-migrate-to-next',
  'agents-sdk',
];

// --- Argument parsing ---------------------------------------------------------

function parseArgs(argv) {
  const args = {
    apply: false,
    check: false,
    list: false,
    from: null,
    targets: [],
    showHelp: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--apply') { args.apply = true; args.check = false; }
    else if (a === '--check') { args.check = true; args.apply = false; }
    else if (a === '--list') { args.list = true; }
    else if (a === '--from') { args.from = argv[++i]; }
    else if (a === '--target') { args.targets.push(argv[++i]); }
    else if (a === '-h' || a === '--help') { args.showHelp = true; }
    else {
      console.error(`Unknown argument: ${a}`);
      printHelp();
      process.exit(2);
    }
  }
  if (!args.apply && !args.check) args.check = true;
  return args;
}

function printHelp() {
  console.log('Usage: node scripts/sync-cloudflare-skills.js [(--check)|--apply] [--list] [--from <dir>] [--target <dir>...]');
  console.log('');
  console.log('Syncs the 13 Cloudflare skills from a single canonical source to every');
  console.log('Miralante suite project\'s .claude/skills/ folder.');
  console.log('');
  console.log('Defaults:');
  console.log('  Source   ~/.copilot/skills/   (override with --from <dir>)');
  console.log('  Targets  7 sibling projects   (override with --target <dir>...)');
  console.log('');
  console.log('Flags:');
  console.log('  --check   (default)  print SHA256 of every SKILL.md, compare to source');
  console.log('  --apply             copy SKILL.md + references/ where drifted/missing');
  console.log('  --list              print the canonical list of skill names');
  console.log('');
  console.log('Exit codes: 0=ok  1=drift or failure  2=bad args / missing source');
}

// --- Filesystem helpers -------------------------------------------------------

const DEFAULT_PROJECTS = [
  'apptonomia',
  'calculia',
  'memofun',
  'okeymoney',
  'sinonimia',
  'teclatlon',
  'routime',
];

function sha256(filePath) {
  const buf = fs.readFileSync(filePath);
  return require('crypto').createHash('sha256').update(buf).digest('hex');
}
function shortSha(s) { return s ? s.slice(0, 12) : '(missing)'; }

function copyDirRecursive(srcDir, dstDir) {
  // Cloudflare skills have no .graphify_* state — copy the whole tree.
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  fs.mkdirSync(dstDir, { recursive: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const dstPath = path.join(dstDir, entry.name);
    if (entry.isDirectory()) copyDirRecursive(srcPath, dstPath);
    else fs.copyFileSync(srcPath, dstPath);
  }
}

function copySkillFiles(srcRoot, dstRoot) {
  fs.mkdirSync(dstRoot, { recursive: true });
  fs.copyFileSync(path.join(srcRoot, 'SKILL.md'), path.join(dstRoot, 'SKILL.md'));
  const refsSrc = path.join(srcRoot, 'references');
  const refsDst = path.join(dstRoot, 'references');
  if (fs.existsSync(refsSrc)) copyDirRecursive(refsSrc, refsDst);
}

function discoverSuiteDir() {
  // <suite>/<project>/scripts/sync-cloudflare-skills.js — suite is two levels up.
  return path.resolve(__dirname, '..', '..');
}

function resolveSource(args) {
  return path.resolve(args.from || path.join(os.homedir(), '.copilot', 'skills'));
}

function resolveTargets(args) {
  if (args.targets.length > 0) return args.targets.map(t => path.resolve(t));
  const suite = discoverSuiteDir();
  return DEFAULT_PROJECTS.map(p => path.join(suite, p));
}

// --- Main ---------------------------------------------------------------------

function main() {
  const args = parseArgs(process.argv);

  if (args.showHelp) { printHelp(); process.exit(0); }
  if (args.list) {
    console.log(CLOUDFLARE_SKILLS.join('\n'));
    process.exit(0);
  }

  const source = resolveSource(args);
  if (!fs.existsSync(source)) {
    console.error(`Source directory not found: ${source}`);
    console.error('Pass --from <dir> to point to a different canonical copy.');
    process.exit(2);
  }

  // First, validate the canonical list: every skill must exist in the source.
  // (If you want to add a new skill, edit CLOUDFLARE_SKILLS in this script and
  // drop the folder under ~/.copilot/skills/ — then re-run with --apply.)
  const missingInSource = [];
  for (const skill of CLOUDFLARE_SKILLS) {
    const skillSrc = path.join(source, skill, 'SKILL.md');
    if (!fs.existsSync(skillSrc)) missingInSource.push(skill);
  }
  if (missingInSource.length > 0) {
    console.error(`Missing canonical SKILL.md for: ${missingInSource.join(', ')}`);
    console.error(`Expected under: ${source}`);
    process.exit(2);
  }

  const targets = resolveTargets(args);
  console.log(`Source: ${source}`);
  console.log(`Skills: ${CLOUDFLARE_SKILLS.length}`);
  console.log(`Mode:   ${args.apply ? 'apply' : 'check'}  Targets: ${targets.length}`);
  console.log('');

  // Pre-compute source SHAs.
  const sourceShas = {};
  for (const skill of CLOUDFLARE_SKILLS) {
    sourceShas[skill] = sha256(path.join(source, skill, 'SKILL.md'));
  }

  let totalDrifted = 0;
  let totalMissing = 0;
  let totalCopied = 0;

  for (const t of targets) {
    const name = path.basename(t);
    const skillsBase = path.join(t, '.claude', 'skills');

    // Quick sanity: project dir must exist (otherwise the suite root moved).
    if (!fs.existsSync(skillsBase) && !fs.existsSync(t)) {
      console.log(`[${name}] SKIP    (target does not exist: ${t})`);
      continue;
    }
    if (!fs.existsSync(skillsBase)) fs.mkdirSync(skillsBase, { recursive: true });

    let projDrifted = 0;
    let projMissing = 0;
    let projCopied = 0;

    for (const skill of CLOUDFLARE_SKILLS) {
      const dstSkill = path.join(skillsBase, skill, 'SKILL.md');
      const dstDir = path.join(skillsBase, skill);
      const srcDir = path.join(source, skill);
      if (!fs.existsSync(dstSkill)) {
        projMissing++;
        if (args.apply) {
          copySkillFiles(srcDir, dstDir);
          projCopied++;
        }
        continue;
      }
      const targetSha = sha256(dstSkill);
      if (targetSha !== sourceShas[skill]) {
        projDrifted++;
        if (args.apply) {
          copySkillFiles(srcDir, dstDir);
          projCopied++;
        }
      }
    }

    if (projMissing === 0 && projDrifted === 0) {
      console.log(`[${name}] OK       (${CLOUDFLARE_SKILLS.length}/${CLOUDFLARE_SKILLS.length} skills match)`);
    } else if (args.apply) {
      console.log(`[${name}] FIXED    copied=${projCopied}  (was missing=${projMissing} drifted=${projDrifted})`);
      totalCopied += projCopied;
    } else {
      const parts = [];
      if (projMissing) parts.push(`missing=${projMissing}`);
      if (projDrifted) parts.push(`drifted=${projDrifted}`);
      console.log(`[${name}] DRIFT    ${parts.join(' ')}`);
    }
    totalDrifted += projDrifted;
    totalMissing += projMissing;
  }

  console.log('');
  if (args.apply) {
    console.log(`Done. Copied: ${totalCopied} (was missing: ${totalMissing}, drifted: ${totalDrifted}).`);
    process.exit((totalMissing + totalDrifted - totalCopied) === 0 ? 0 : 1);
  } else {
    const totalIssues = totalMissing + totalDrifted;
    console.log(`Drifted or missing: ${totalIssues} skill-instance(s) across ${targets.length} project(s). Run with --apply to fix.`);
    process.exit(totalIssues === 0 ? 0 : 1);
  }
}

main();