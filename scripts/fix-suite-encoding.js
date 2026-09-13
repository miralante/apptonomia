#!/usr/bin/env node
/* Repair UTF-8 text that was decoded/encoded repeatedly as Windows-1252.
 * Usage: node scripts/fix-suite-encoding.js [--check] [repo ...]
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const repos = process.argv.slice(2).filter(a => a !== '--check');
const check = process.argv.includes('--check');
const targets = repos.length ? repos : ['apptonomia', 'calculia', 'memofun', 'okeymoney', 'sinonimia', 'teclatlon', 'routime'];
const bad = /(?:Ã.|Â.|â.|ðŸ|ï¿½)/g;
const binary = new Set(['.png','.jpg','.jpeg','.gif','.webp','.ico','.woff','.woff2','.ttf','.eot','.pdf','.zip','.gz','.mp3','.mp4','.wasm','.avif','.mov']);
const textExt = new Set(['.md','.html','.htm','.css','.js','.json','.txt','.xml','.svg','.csv','.yml','.yaml']);
const ignoredDirs = new Set(['.git','node_modules','graphify-out','graphify-out-meta','_mojibake_test']);
const self = path.resolve(__filename);
const known = new Map([
  ['§', '§'], ['©', '©'], ['·', '·'], ['', ''],
  ['…', '…'], ['–', '–'], ['—', '—'], ['’', '’'],
  ['“', '“'], ['”', '”'], ['→', '→'], ['≥', '≥'],
  ['—', '—'], ['Ãƒâ€š§', '§'], ['§', '§'], ['·', '·']
]);

function score(s) { bad.lastIndex = 0; return (s.match(bad) || []).length * 4 + (s.match(/�/g) || []).length * 8; }
const cp1252 = new Map([['€',0x80],['‚',0x82],['ƒ',0x83],['„',0x84],['…',0x85],['†',0x86],['‡',0x87],['ˆ',0x88],['‰',0x89],['Š',0x8a],['‹',0x8b],['Œ',0x8c],['Ž',0x8e],['‘',0x91],['’',0x92],['“',0x93],['”',0x94],['•',0x95],['–',0x96],['—',0x97],['˜',0x98],['™',0x99],['š',0x9a],['›',0x9b],['œ',0x9c],['ž',0x9e],['Ÿ',0x9f]]);
function decode1252(text) {
  const bytes = [];
  for (const ch of text) {
    const code = cp1252.get(ch) ?? ch.codePointAt(0);
    if (code > 255) return null;
    bytes.push(code);
  }
  return Buffer.from(bytes).toString('utf8');
}
function repair(text) {
  let current = text;
  current = current.replace(/cross-project table in [^\r\n]*7\.4/g, 'cross-project table in §7.4');
  for (const [from, to] of known) current = current.split(from).join(to);
  for (let i = 0; i < 4; i++) {
    bad.lastIndex = 0;
    if (!bad.test(current)) break;
    bad.lastIndex = 0;
    const next = decode1252(current);
    if (next === null) break;
    if (next === current || next.includes('�') || score(next) >= score(current)) break;
    current = next;
  }
  return current;
}
function walk(dir, out = []) {
  let entries;
  try { entries = fs.readdirSync(dir, {withFileTypes:true}); }
  catch (error) { console.error(`Cannot scan ${dir}: ${error.message}`); return out; }
  for (const ent of entries) {
    if (ignoredDirs.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out); else if (ent.isFile() && path.resolve(p) !== self && fs.statSync(p).size <= 2 * 1024 * 1024 && !binary.has(path.extname(ent.name).toLowerCase()) && textExt.has(path.extname(ent.name).toLowerCase())) out.push(p);
  }
  return out;
}
let changed = 0;
console.log(`Scanning ${targets.length} repo(s) under ${root}`);
for (const repo of targets) {
  const dir = path.join(root, repo);
  if (!fs.existsSync(dir)) { console.error(`Missing repo: ${repo}`); process.exitCode = 1; continue; }
  for (const file of walk(dir)) {
    let original;
    try { original = fs.readFileSync(file); } catch (error) { console.error(`Skipped ${file}: ${error.message}`); continue; }
    if (original.includes(0)) continue;
    const text = original.toString('utf8');
    if (text.includes('�') && !original.toString('utf8').includes('ï¿½')) continue;
    const fixed = repair(text);
    if (fixed !== text) {
      changed++;
      console.log(`${check ? 'Would fix' : 'Fixed'} ${path.relative(root, file)}`);
      if (!check) {
        try { fs.writeFileSync(file, fixed, 'utf8'); }
        catch (error) { console.error(`Could not write ${file}: ${error.message}`); }
      }
    }
  }
}
console.log(`${check ? 'Candidates' : 'Files changed'}: ${changed}`);
