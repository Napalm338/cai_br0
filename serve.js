// Dependency-free static file server for local testing (no python needed).
// Usage: node serve.js [port]

const http = require('http');
const fs = require('fs');
const path = require('path');

const port = Number(process.argv[2]) || 8000;
const root = process.cwd();

const types = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.mp3': 'audio/mpeg',
};

http
  .createServer((req, res) => {
    let filePath = path.join(root, decodeURIComponent(req.url.split('?')[0]));
    if (filePath.endsWith('/')) filePath = path.join(filePath, 'index.html');

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      res.writeHead(200, {
        'Content-Type': types[path.extname(filePath)] || 'application/octet-stream',
      });
      res.end(data);
    });
  })
  .listen(port, () => console.log(`http://localhost:${port}/`));
