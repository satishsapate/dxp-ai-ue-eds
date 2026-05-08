const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const rootDir = path.resolve(__dirname, '..');
const defaultRoot = path.join(rootDir, 'html-kit', 'dxp-ai');
const port = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

function sendResponse(res, filePath) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Server error: ${err.message}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

function serveFile(req, res) {
  const parsed = url.parse(req.url);
  let pathname = decodeURIComponent(parsed.pathname);
  if (pathname === '/') {
    pathname = '/index.html';
  }

  const filePath = path.join(defaultRoot, pathname);
  const safePath = path.normalize(filePath);
  if (!safePath.startsWith(defaultRoot)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access denied');
    return;
  }

  fs.stat(safePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end(`Not found: ${pathname}`);
      return;
    }

    if (stats.isDirectory()) {
      sendResponse(res, path.join(safePath, 'index.html'));
      return;
    }

    sendResponse(res, safePath);
  });
}

const server = http.createServer((req, res) => {
  serveFile(req, res);
});

server.listen(port, () => {
  console.log(`Static server running at http://localhost:${port}`);
  console.log(`Serving files from ${defaultRoot}`);
  console.log('Open your browser to view html-kit/dxp-ai content.');
});
