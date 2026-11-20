/*
 * scripts/sw-files.js — reads the precache list of sw.js. Shared by
 * scripts/check.js and scripts/smoke-sw.js so both parse it the same way.
 * No dependencies.
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

/* { version, files } from the source of sw.js. `files` keeps the entries as written ('./x').
   Only declarations count (`var|let|const VERSION = …` at the start of a line),
   so a comment that shows the syntax is never read as the value. Comments inside
   the list are dropped: one may quote text (`'self'`) that is not a file.
   Returns null when the file has no VERSION or no list. */
function parseSw(src) {
  const version = src.match(/^\s*(?:var|let|const)\s+VERSION\s*=\s*['"]([^'"]+)['"]/m);
  const list = src.match(/^\s*(?:var|let|const)\s+(?:FILES|ARCHIVOS)\s*=\s*\[([\s\S]*?)\]/m);
  if (!version || !list) return null;
  const body = list[1].replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
  const files = Array.from(body.matchAll(/['"]([^'"]+)['"]/g), (m) => m[1]);
  return { version: version[1], files };
}

function readSwFiles(root) {
  const swPath = path.join(root, 'sw.js');
  return fs.existsSync(swPath) ? parseSw(fs.readFileSync(swPath, 'utf8')) : null;
}

/* The repo-relative path ('about/index.html') an entry stands for, '/' separators. */
function entryToRel(entry) {
  const rel = entry.replace(/^\.\//, '');
  return rel === '' || rel.endsWith('/') ? rel + 'index.html' : rel;
}

/* The file on disk an entry stands for: './about/' -> about/index.html. */
function entryToFile(root, entry) {
  return path.join(root, entryToRel(entry));
}

module.exports = { parseSw, readSwFiles, entryToRel, entryToFile };
