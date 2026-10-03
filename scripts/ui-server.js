const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4173;
const ROOT = path.join(__dirname, '..');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
};

const server = http.createServer((req, res) => {
  // Strip query strings and hashes
  let url = req.url.split('?')[0].split('#')[0];
  // Serve index.html for bare project directory
  if (url === '/project' || url === '/project/') url = '/project/index.html';
  if (url.endsWith('/')) url += 'index.html';

  const filePath = path.join(ROOT, url);
  const ext = path.extname(filePath);
  const mime = MIME[ext] || 'text/plain';

  res.setHeader('Content-Type', mime);
  res.setHeader('Cache-Control', 'no-store');

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
