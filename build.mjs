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
import { PAGES_EN } from './content/pages-en.mjs';
import { homeToEnglish } from './content/home-en.mjs';
import { renderPage, SITE, SLUGS, enPath, addUsd } from './content/layout.mjs';

const OUT = 'dist';
const read = f => readFileSync(f, 'utf8');
const kb = n => (n / 1024).toFixed(1) + ' KB';

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);

// ---------- CSS ----------
const css = (await transform(read('styles.css'), { loader: 'css', minify: true })).code.trim();

// ---------- JS ----------
const jsSrc = read('main.js');
const js = (await transform(jsSrc, { loader: 'js', minify: true, target: 'es2020', legalComments: 'none' })).code;
const jsName = `app.${createHash('sha256').update(js).digest('hex').slice(0, 10)}.js`;
writeFileSync(join(OUT, jsName), js);
// Pixel va aparte: main.js lo carga cuando la página ya está lista
const pixelJs = (await transform(read('mascot.js'), { loader: 'js', minify: true, target: 'es2020', legalComments: 'none' })).code;
const pixelName = `pixel.${createHash('sha256').update(pixelJs).digest('hex').slice(0, 10)}.js`;
writeFileSync(join(OUT, pixelName), pixelJs);
const withPixel = h => h.replace(/<html lang="(es|en)"/, `<html data-pixel="/${pixelName}" lang="$1"`);

// ---------- arranque (idioma y tema antes de pintar) ----------
const bootJs = (await transform(read('boot.js'), { loader: 'js', minify: true, target: 'es2015', legalComments: 'none' })).code.trim();

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
html = withPixel(html.replace(/<script src="main\.js[^"]*" defer><\/script>/, `<script src="/${jsName}" defer></script>`));
html = html.replace('<script src="boot.js"></script>', () => `<script>${bootJs}</script>`);
if (html.includes('boot.js') || html.includes('styles.css') || html.includes('main.js') || html.includes('mascot.js')) {
  throw new Error('No se pudieron reemplazar las referencias a CSS/JS en index.html');
}
writeFileSync(join(OUT, 'index.html'), minifyHtml(addUsd(html)));
const missing = [];
const htmlEn = homeToEnglish(html, (ok, s) => { if (!ok) missing.push(s.slice(0, 70)); });
if (missing.length) throw new Error('Traducción de portada desactualizada:\n' + missing.join('\n'));
mkdirSync(join(OUT, 'en'));
writeFileSync(join(OUT, 'en', 'index.html'), minifyHtml(addUsd(htmlEn)));
writeFileSync(join(OUT, '404.html'), minifyHtml(read('404.html')));

// ---------- páginas internas (content/pages.mjs) ----------
const gaSnippet = (html.match(/<script>\s*window\.dataLayer[\s\S]*?<\/script>/) || [''])[0];
if (!gaSnippet) throw new Error('No se encontró el fragmento de Google Analytics en index.html');
for (const pg of [...PAGES, ...PAGES_EN]) {
  const file = pg.lang === 'en' ? join(OUT, enPath(pg.esSlug), 'index.html') : join(OUT, pg.slug, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, minifyHtml(addUsd(withPixel(renderPage(pg, { css, jsName, gaSnippet, bootJs })))));
}

// ---------- sitemap.xml (generado) ----------
const today = new Date().toISOString().slice(0, 10);
const img = (f, t) => `<image:image><image:loc>${SITE}/assets/${f}</image:loc><image:title>${t}</image:title></image:image>`;
const alts = (es, en) => `<xhtml:link rel="alternate" hreflang="es" href="${SITE}${es}"/><xhtml:link rel="alternate" hreflang="en" href="${SITE}${en}"/><xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${es}"/>`;
const homeImgs = `${img('ratio.webp', 'Ratio Coffee Baq')}${img('ema.webp', 'Ema Rizos')}${img('ami.webp', 'AmicrespA')}${img('flylatam.webp', 'FlyLatam Plus')}${img('ordenio.webp', 'Ordenio')}${img('luminni.webp', 'Luminni')}${img('lusarte.webp', 'Lusarte')}`;
const urls = [
  `<url><loc>${SITE}/</loc><lastmod>${today}</lastmod><priority>1.0</priority>${alts('/', '/en/')}${homeImgs}</url>`,
  `<url><loc>${SITE}/en/</loc><lastmod>${today}</lastmod><priority>0.9</priority>${alts('/', '/en/')}</url>`,
  ...Object.keys(SLUGS).flatMap(s => {
    const es = `/${s}/`, en = enPath(s), pr = s.startsWith('blog/') ? '0.6' : '0.8';
    return [es, en].map(u => `<url><loc>${SITE}${u}</loc><lastmod>${today}</lastmod><priority>${pr}</priority>${alts(es, en)}</url>`);
  }),
];
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`);

// ---------- archivos estáticos ----------
for (const f of ['robots.txt', 'site.webmanifest', 'og-image.jpg', 'favicon.ico']) cpSync(f, join(OUT, f));
cpSync('fonts', join(OUT, 'fonts'), { recursive: true });
mkdirSync(join(OUT, 'assets'));
// solo WebP e íconos; las capturas PNG originales no se publican
const keep = f => f.endsWith('.webp') || /^(favicon|apple-touch-icon|icon-)/.test(f);
for (const f of readdirSync('assets').filter(keep)) cpSync(join('assets', f), join(OUT, 'assets', f));

// ---------- resumen ----------
const size = p => statSync(p).size;
const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const total = walk(OUT).reduce((s, p) => s + size(p), 0);
console.log(`index.html  ${kb(size(join(OUT, 'index.html')))}  (CSS incrustado: ${kb(css.length)})`);
console.log(`${jsName}  ${kb(js.length)}  ·  ${pixelName}  ${kb(pixelJs.length)} (diferido)`);
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
const noPixel = walk(OUT).filter(p => p.endsWith('index.html') && !read(p).includes(`data-pixel="/${pixelName}"`));
if (noPixel.length) throw new Error('Páginas sin Pixel:\n' + noPixel.join('\n'));
console.log(`${PAGES.length + PAGES_EN.length + 2} páginas (ES + EN) + sitemap con ${urls.length} URL · sin enlaces rotos`);
