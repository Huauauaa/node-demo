const http = require('http');
const path = require('path');
const fs = require('fs');
const users = require('./public/data/users.json');

const server = http.createServer((req, res) => {
  if (req.url === '/api/users') {
    // res.setHeader('Content-Type', 'application/binary-json');
    res.end(JSON.stringify(users));
  }
  let filePath = path.join(
    __dirname,
    'public',
    req.url === '/' ? 'index.html' : req.url,
  );
  let extname = path.extname(filePath);

  let contentType;
  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.png':
    case '.jpeg':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpg';
      break;
    default:
      contentType = 'text/html';
  }

  if (contentType == 'text/html' && extname == '') filePath += '.html';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code == 'ENOENT') {
        // Page not found
        fs.readFile(
          path.join(__dirname, 'public', '404.html'),
          (err, content) => {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content, 'utf8');
          },
        );
      } else {
        //  Some server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf8');
    }
  });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () =>
  console.log(`server is running on http://localhost:${PORT}`),
);
