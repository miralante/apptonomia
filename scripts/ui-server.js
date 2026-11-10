const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 4173);
const ROOT = path.join(__dirname, '..');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  // Without this the .svg pictograms (logo, sibling icons) come back as
  // text/plain and the browser paints a broken-image box instead — on the
  // portal and on /dev/ alike. Everything else that falls through the map
  // does the same.
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};

/* Production sends a strict CSP (see _headers). The preview must send the
   SAME one, otherwise anything that only breaks under CSP — every inline
   <script> — looks perfect here and ships broken. That is how the about/,
   legal/ and team/ language selectors were dead in production with a green
   local run. Read from _headers so the two can never drift. */
function productionCsp() {
  try {
    const raw = fs.readFileSync(path.join(ROOT, '_headers'), 'utf8');
    const match = raw.match(/^\s*Content-Security-Policy:\s*(.+)$/m);
    return match ? match[1].trim() : '';
  } catch (error) {
    return '';
  }
}

const CSP = productionCsp();

const server = http.createServer((req, res) => {
  // Strip query strings and hashes
  let url = req.url.split('?')[0].split('#')[0];
  // Serve index.html for bare project directory
  if (url === '/project' || url === '/project/') url = '/project/index.html';
  // Same for /dev/: production (Cloudflare) resolves a directory to its
  // index.html, so /dev/ has to work here too or the page is only reachable
  // by typing the full path.
  if (url === '/dev' || url === '/dev/') url = '/dev/index.html';
  if (url === '/') url = '/index.html';

  const filePath = path.join(ROOT, url);
  const ext = path.extname(filePath);
  const mime = MIME[ext] || 'text/plain';

  res.setHeader('Content-Type', mime);
  res.setHeader('Cache-Control', 'no-store');
  if (CSP) res.setHeader('Content-Security-Policy', CSP);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});

server.listen(PORT, () => console.log(`UI server running on http://127.0.0.1:${PORT}`));
