#!/usr/bin/env node
/*
 * scripts/serve.js — tiny static server for local preview and tests.
 *
 *   node scripts/serve.js [port]        (default 8080)
 *
 * It mimics the Cloudflare static-assets behaviour the app relies on:
 *   - a folder URL serves its index.html;
 *   - an unknown path serves 404.html with status 404 at the URL that was
 *     asked for (so a relative link in 404.html would break here exactly as
 *     it would in production).
 * Used by scripts/smoke-sw.js and by playwright.config.js. No dependencies.
 */
'use strict';

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

/* The file a URL path maps to, or null when there is none. Never leaves ROOT. */
function resolveFile(root, urlPath) {
  let decoded;
  try { decoded = decodeURIComponent(urlPath.split('?')[0]); } catch (e) { return null; }
  let file = path.resolve(root, '.' + decoded);
  if (file !== root && !file.startsWith(root + path.sep)) return null;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
  return fs.existsSync(file) && fs.statSync(file).isFile() ? file : null;
}

function send(res, status, file) {
  res.writeHead(status, {
    'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store'
  });
  fs.createReadStream(file).pipe(res);
}

/* Starts the server; resolves with it once it listens. Port 0 picks a free one. */
function startServer(port = 0, root = ROOT) {
  const server = http.createServer((req, res) => {
    const file = resolveFile(root, req.url || '/');
    if (file) return send(res, 200, file);
    const notFound = path.join(root, '404.html');
    if (fs.existsSync(notFound)) return send(res, 404, notFound);
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

module.exports = { startServer, resolveFile, ROOT };

if (require.main === module) {
  const port = Number(process.argv[2]) || 8080;
  startServer(port).then(() => console.log(`Serving ${ROOT} at http://127.0.0.1:${port}/`));
}
