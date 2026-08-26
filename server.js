
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT = 'd:/Download/qingqingzhiboke';

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.mp3': 'audio/mpeg',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0];
    // 解码 URL（%20 -> 空格等），避免带空格/中文的文件名 404
    try { urlPath = decodeURIComponent(urlPath); } catch (e) { /* 保留原样 */ }
    if (urlPath === '/') urlPath = '/index.html';
    const fp = path.join(ROOT, urlPath);
    const ext = path.extname(fp).toLowerCase();
    fs.readFile(fp, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not found: ' + urlPath);
            return;
        }
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
    });
});

server.listen(PORT, '127.0.0.1', () => {
    console.log('Server running at http://127.0.0.1:' + PORT);
});