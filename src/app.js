import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const pages = path.join(here, 'pages');
const assets = path.join(here, 'static');
const pageRoutes = new Map([
  ['/', 'index.html'], ['/login', 'login.html'], ['/cadastro', 'cadastro.html'],
  ['/perfil', 'perfil.html'], ['/criar', 'criar.html'], ['/discussao', 'discussao.html']
]);
const mimeTypes = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.ico': 'image/x-icon',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.woff2': 'font/woff2'
};

export default async function handler(req, res) {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  let filePath;
  if (pageRoutes.has(url.pathname)) {
    filePath = path.join(pages, pageRoutes.get(url.pathname));
  } else if (url.pathname.startsWith('/css/') || url.pathname.startsWith('/js/') || url.pathname === '/favicon.ico') {
    const relative = path.normalize(url.pathname.replace(/^\/+/, ''));
    filePath = path.resolve(assets, relative);
    if (!filePath.startsWith(assets + path.sep)) {
      res.writeHead(403); res.end('Forbidden'); return;
    }
  } else {
    try {
      const body = await readFile(path.join(pages, 'not-found.html'));
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
      res.end(body);
    } catch {
      res.writeHead(404); res.end('Not found');
    }
    return;
  }

  try {
    const body = await readFile(filePath);
    res.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(filePath)] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Arquivo não encontrado');
  }
}

if (!process.env.VERCEL) {
  const port = Number(process.env.PORT || 3000);
  createServer(handler).listen(port, () => console.log(`Estuda Junto disponível em http://localhost:${port}`));
}
