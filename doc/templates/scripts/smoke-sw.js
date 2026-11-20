#!/usr/bin/env node
/*
 * scripts/smoke-sw.js — service-worker precache smoke.
 *
 *   node scripts/smoke-sw.js
 *
 * The service worker installs with cache.addAll(FILES), which is atomic: ONE
 * entry that does not answer 200 makes the whole install fail, and then no
 * update ever reaches the readers. This smoke serves the app the way
 * Cloudflare does (scripts/serve.js) and requests every FILES entry, exactly
 * as the install would. It also checks that an unknown deep path answers 404
 * with 404.html, and that 404.html does not redirect or use relative links
 * (Cloudflare serves it at the requested URL, so "./" would be another 404).
 *
 * It does not run the worker itself: tests/smoke.spec.js does that in a browser.
 */
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { startServer, ROOT } = require('./serve.js');
const { readSwFiles, entryToFile } = require('./sw-files.js');

async function main() {
  const sw = readSwFiles(ROOT);
  assert.ok(sw, 'sw.js must declare VERSION and a FILES (or ARCHIVOS) list');
  assert.ok(sw.files.length > 0, 'the FILES list of sw.js is empty');
  for (const entry of sw.files) {
    assert.ok(fs.existsSync(entryToFile(ROOT, entry)), `FILES lists ${entry}, which is not on disk`);
  }

  const html404 = fs.readFileSync(path.join(ROOT, '404.html'), 'utf8');
  assert.ok(!/http-equiv=["']refresh/i.test(html404), '404.html must not redirect with meta refresh');
  const relative = html404.match(/\b(?:href|src)="(?!\/|https?:|mailto:|#)[^"]*"/);
  assert.ok(!relative, `404.html uses a relative URL (${relative && relative[0]}); use a root-absolute one`);

  const server = await startServer(0);
  const base = `http://127.0.0.1:${server.address().port}/`;
  try {
    for (const entry of sw.files) {
      const response = await fetch(new URL(entry, base));
      assert.equal(response.status, 200, `precache entry ${entry} answers ${response.status}; the SW install would fail`);
    }
    const missing = await fetch(new URL('/no/such/page', base));
    assert.equal(missing.status, 404, 'an unknown path must answer 404');
    assert.match(await missing.text(), /<html/i, 'an unknown path must serve 404.html');
    console.log(`SW smoke PASS (${sw.version}, ${sw.files.length} precache entries)`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

main().catch((error) => {
  console.error(`SW smoke FAIL: ${error.message}`);
  process.exitCode = 1;
});
