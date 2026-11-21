// Servidor de vista previa para dist/ que se comporta como un hosting real:
// compresión brotli/gzip, cabeceras de caché y página 404.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { brotliCompressSync, gzipSync, constants } from 'node:zlib';

const ROOT = process.argv[2] || 'dist';
const PORT = Number(process.argv[3] || 4173);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.svg': 'image/svg+xml',
};
const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.webmanifest', '.xml', '.txt', '.svg']);
const cacheFor = p =>
  /^\/(app|pixel)\.[\w]+\.js$/.test(p) || p.startsWith('/fonts/') ? 'public, max-age=31536000, immutable'
  : p.startsWith('/assets/') ? 'public, max-age=2592000, stale-while-revalidate=86400'
  : 'public, max-age=0, must-revalidate';

createServer(async (req, res) => {
  let path;
  try { path = decodeURIComponent(new URL(req.url.replace(/^\/+/, '/'), 'http://x').pathname); } catch { path = '/'; }
  if (path.endsWith('/')) path += 'index.html';
  let file = normalize(join(ROOT, path));
  let status = 200, body, ext = extname(file);
  try {
    if (!file.startsWith(normalize(ROOT))) throw new Error('fuera de raíz');
    if ((await stat(file)).isDirectory()) { file = join(file, 'index.html'); ext = '.html'; }
    body = await readFile(file);
  } catch {
    status = 404; ext = '.html'; body = await readFile(join(ROOT, '404.html'));
  }
  const headers = {
    'Content-Type': TYPES[ext] || 'application/octet-stream',
    'Cache-Control': status === 404 ? 'no-cache' : cacheFor(path),
    'X-Content-Type-Options': 'nosniff',
    'Vary': 'Accept-Encoding',
  };
  const accept = req.headers['accept-encoding'] || '';
  if (COMPRESSIBLE.has(ext)) {
    if (accept.includes('br')) { body = brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }); headers['Content-Encoding'] = 'br'; }
    else if (accept.includes('gzip')) { body = gzipSync(body, { level: 9 }); headers['Content-Encoding'] = 'gzip'; }
  }
  res.writeHead(status, headers).end(body);
}).listen(PORT, () => console.log(`dist/ en http://localhost:${PORT}`));
