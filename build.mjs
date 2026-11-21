// Compila la versión optimizada del sitio en dist/
//   - CSS minificado e incrustado en el HTML (sin petición bloqueante)
//   - main.js + mascot.js unidos, minificados y con hash para caché inmutable
//   - HTML sin comentarios ni sangrías, JSON-LD compacto
//   - Solo se copian los archivos que el sitio usa
import { transform } from 'esbuild';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { PAGES } from './content/pages.mjs';
import { renderPage, SITE } from './content/layout.mjs';

const OUT = 'dist';
const read = f => readFileSync(f, 'utf8');
const kb = n => (n / 1024).toFixed(1) + ' KB';

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);

// ---------- CSS ----------
const css = (await transform(read('styles.css'), { loader: 'css', minify: true })).code.trim();

// ---------- JS ----------
const jsSrc = read('main.js') + '\n;\n' + read('mascot.js');
const js = (await transform(jsSrc, { loader: 'js', minify: true, target: 'es2020', legalComments: 'none' })).code;
const jsName = `app.${createHash('sha256').update(js).digest('hex').slice(0, 10)}.js`;
writeFileSync(join(OUT, jsName), js);

// ---------- HTML ----------
function minifyHtml(html) {
  return html
    .replace(/<!--(?!\[if)[\s\S]*?-->/g, '')                                   // comentarios
    .replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,   // JSON-LD compacto
      (_, a, json, b) => a + JSON.stringify(JSON.parse(json)) + b)
    .split('\n').map(l => l.trim()).filter(Boolean).join('\n');               // sangrías y líneas vacías
}

let html = read('index.html');
html = html.replace(/<link rel="stylesheet" href="styles\.css[^"]*">/, `<style>${css}</style>`);
html = html.replace(/<script src="main\.js[^"]*" defer><\/script>\s*<script src="mascot\.js[^"]*" defer><\/script>/,
  `<script src="/${jsName}" defer></script>`);
if (html.includes('styles.css') || html.includes('main.js') || html.includes('mascot.js')) {
  throw new Error('No se pudieron reemplazar las referencias a CSS/JS en index.html');
}
writeFileSync(join(OUT, 'index.html'), minifyHtml(html));
writeFileSync(join(OUT, '404.html'), minifyHtml(read('404.html')));

// ---------- páginas internas (content/pages.mjs) ----------
const gaSnippet = (html.match(/<script>\s*window\.dataLayer[\s\S]*?<\/script>/) || [''])[0];
if (!gaSnippet) throw new Error('No se encontró el fragmento de Google Analytics en index.html');
for (const pg of PAGES) {
  const file = join(OUT, pg.slug, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, minifyHtml(renderPage(pg, { css, jsName, gaSnippet })));
}

// ---------- sitemap.xml (generado) ----------
const today = new Date().toISOString().slice(0, 10);
const img = (f, t) => `<image:image><image:loc>${SITE}/assets/${f}</image:loc><image:title>${t}</image:title></image:image>`;
const urls = [
  `<url><loc>${SITE}/</loc><lastmod>${today}</lastmod><priority>1.0</priority>${img('ratio.webp', 'Ratio Coffee Baq — página web')}${img('ema.webp', 'Ema Rizos — tienda online')}${img('ami.webp', 'AmicrespA — salón y tienda')}${img('flylatam.webp', 'FlyLatam Plus — agencia de viajes')}${img('ordenio.webp', 'Ordenio — tienda por WhatsApp')}${img('luminni.webp', 'Luminni — e-commerce editorial')}</url>`,
  ...PAGES.map(pg => `<url><loc>${SITE}/${pg.slug}/</loc><lastmod>${today}</lastmod><priority>${pg.slug.startsWith('blog/') ? '0.6' : '0.8'}</priority></url>`),
];
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.join('\n')}
</urlset>
`);

// ---------- archivos estáticos ----------
for (const f of ['robots.txt', 'site.webmanifest', 'og-image.jpg', 'favicon.ico', '.htaccess']) cpSync(f, join(OUT, f));
cpSync('fonts', join(OUT, 'fonts'), { recursive: true });
mkdirSync(join(OUT, 'assets'));
// solo WebP e íconos; las capturas PNG originales no se publican
const keep = f => f.endsWith('.webp') || /^(favicon|apple-touch-icon|icon-)/.test(f);
for (const f of readdirSync('assets').filter(keep)) cpSync(join('assets', f), join(OUT, 'assets', f));

// ---------- cabeceras (Netlify / Cloudflare Pages) ----------
writeFileSync(join(OUT, '_headers'), `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: SAMEORIGIN

/app.*.js
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/assets/*
  Cache-Control: public, max-age=2592000, stale-while-revalidate=86400

/og-image.jpg
  Cache-Control: public, max-age=2592000

/
  Cache-Control: public, max-age=0, must-revalidate
`);

// ---------- resumen ----------
const size = p => statSync(p).size;
const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const total = walk(OUT).reduce((s, p) => s + size(p), 0);
console.log(`index.html  ${kb(size(join(OUT, 'index.html')))}  (CSS incrustado: ${kb(css.length)})`);
console.log(`${jsName}  ${kb(js.length)}  (fuente: ${kb(jsSrc.length)})`);
console.log(`dist/ total ${kb(total)} en ${walk(OUT).length} archivos`);
if (!existsSync(join(OUT, 'assets', 'ratio-800.webp'))) throw new Error('Falta assets/ratio-800.webp');

// ---------- verificación: enlaces internos rotos ----------
const broken = [];
for (const f of walk(OUT).filter(p => p.endsWith('.html'))) {
  for (const [, href] of read(f).matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const t = join(OUT, decodeURIComponent(href));
    if (!existsSync(t) || (statSync(t).isDirectory() && !existsSync(join(t, 'index.html')))) broken.push(`${f} → ${href}`);
  }
}
if (broken.length) throw new Error('Enlaces internos rotos:\n' + [...new Set(broken)].join('\n'));
console.log(`${PAGES.length} páginas internas + sitemap con ${urls.length} URL · sin enlaces rotos`);
