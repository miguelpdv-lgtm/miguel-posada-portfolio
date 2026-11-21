// Plantilla compartida de las páginas internas (la portada es index.html).
export const SITE = 'https://miguelposada.dev';
export const WA = '573003117197';
export const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const arrow = '<svg viewBox="0 0 16 16"><path d="M1 8h13M9 3l5 5-5 5"/></svg>';

/* ---------- piezas reutilizables ---------- */
export const PROJECTS = {
  ema: { name: 'Ema Rizos', dom: 'emarizos.co', url: 'https://emarizos.co', img: 'ema', c: '#e0689a' },
  ami: { name: 'AmicrespA', dom: 'amicrespa.com', url: 'https://amicrespa.com', img: 'ami', c: '#f2cf5b' },
  fly: { name: 'FlyLatam Plus', dom: 'flylatamplus.com', url: 'https://flylatamplus.com', img: 'flylatam', c: '#ff9f1c' },
  ordenio: { name: 'Ordenio', dom: 'ordenio.shop', url: 'https://ordenio.shop', img: 'ordenio', c: '#ff5a2c' },
  luminni: { name: 'Luminni', dom: 'luminni.store', url: 'https://luminni.store', img: 'luminni', c: '#e8b27a' },
  ratio: { name: 'Ratio Coffee Baq', dom: 'ratio-cafe-baq.ordenio.shop', url: 'https://ratio-cafe-baq.ordenio.shop/', img: 'ratio', c: '#ffc83d' },
};
export function shot(key, { sizes = '(max-width: 900px) 92vw, 560px', lazy = true, link = true } = {}) {
  const p = PROJECTS[key];
  const img = `<img src="/assets/${p.img}-800.webp" srcset="/assets/${p.img}-480.webp 480w, /assets/${p.img}-800.webp 800w, /assets/${p.img}.webp 1200w" sizes="${sizes}" alt="Página web de ${esc(p.name)} (${p.dom})" width="1200" height="750"${lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"'}>`;
  const inner = `<div class="shot-bar"><i></i><i></i><i></i><span>${p.dom}</span></div>${img}`;
  return link
    ? `<a class="page-shot tilt" href="${p.url}" target="_blank" rel="noopener" aria-label="${p.dom} — visitar ${esc(p.name)}" style="--c:${p.c}">${inner}</a>`
    : `<div class="page-shot" style="--c:${p.c}">${inner}</div>`;
}
export const shotsGrid = keys => `<div class="shots">${keys.map(k => `<figure>${shot(k)}<figcaption><b>${PROJECTS[k].name}</b> · ${PROJECTS[k].dom}</figcaption></figure>`).join('')}</div>`;
export const cards = (items, cls = '') => `<div class="cards ${cls}">${items.map(([title, text, c = 'var(--lime)', more], i) =>
  `<article class="card" style="--c:${c}"><span class="num">${String(i + 1).padStart(2, '0')}</span><h3>${title}</h3><p>${text}</p>${more ? `<a class="more" href="${more[1]}">${more[0]} →</a>` : ''}</article>`).join('')}</div>`;
export const block = (num, label, html, id = '') => `<section class="block"${id ? ` id="${id}"` : ''}><div class="sec-head reveal"><span class="num">${num}</span><span class="dash"></span><h2 class="crumb">${label}</h2></div>${html}</section>`;
export const btnWa = (label, msg, where) => `<a href="${waLink(msg)}" class="btn btn-solid magnetic" target="_blank" rel="noopener" data-ubicacion="${where}">${label} ${arrow}</a>`;
export const btnLink = (label, href) => `<a href="${href}" class="btn btn-ghost magnetic">${label}</a>`;

/* ---------- planes (fuente única para precios) ---------- */
export const PLANS = [
  { name: 'Landing page', for: 'Una página para vender un servicio o campaña', price: '$720.000', note: 'pago único', c: 'var(--cyan)',
    items: ['1 página enfocada en conversión', 'Botón y mensaje de WhatsApp', 'Diseño adaptado a celular', 'SEO técnico y Google Analytics', 'Entrega en 5 a 7 días hábiles'] },
  { name: 'Sitio web corporativo', for: 'Para empresas y profesionales de servicios', price: '$1.000.000', note: 'con dominio .com y hosting por 1 año · $800.000 si ya los tienes', c: 'var(--lime)', featured: true,
    items: ['Hasta 5 páginas (Inicio, Nosotros, Servicios, Casos, Contacto)', 'Formulario de contacto y WhatsApp', 'Diseño a la medida con tu marca', 'SEO técnico, sitemap y Search Console', '30 días de soporte'] },
  { name: 'Tienda online', for: 'Para vender productos con pagos en línea', price: '$1.800.000', note: 'pago único · pasarela de pagos aparte', c: 'var(--violet)',
    items: ['Todo lo del sitio corporativo', 'Catálogo, carrito y panel de administración', 'Pagos en línea con Wompi o Bold', 'Cupones y descuentos', 'Entrega en 7 a 14 días hábiles'] },
  { name: 'Web app', for: 'Sistemas a la medida', price: 'Cotización', note: 'según el alcance del proyecto', c: 'var(--coral)',
    items: ['Reservas, CRM o paneles internos', 'Usuarios y base de datos', 'Integraciones con APIs', 'Automatizaciones', 'Soporte extendido'] },
];
export const plansHtml = (only = null) => `<div class="plans"${only ? ' style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))"' : ''}>${PLANS.filter((p, i) => !only || only.includes(i)).map(p => `
  <article class="plan${p.featured ? ' featured' : ''}" style="--c:${p.c}">
    ${p.featured ? '<span class="tag">Más pedido</span>' : ''}
    <h3>${p.name}</h3><p class="for">${p.for}</p>
    <p class="price">${p.price.startsWith('$') ? 'Desde ' : ''}${p.price}<small>${p.note}</small></p>
    <ul>${p.items.map(i => `<li>${i}</li>`).join('')}</ul>
    <a href="${waLink(`Hola Miguel, me interesa el plan ${p.name}`)}" class="btn ${p.featured ? 'btn-solid' : 'btn-ghost'}" target="_blank" rel="noopener" data-ubicacion="plan-${p.name.toLowerCase().replace(/\s+/g, '-')}">Cotizar ${arrow}</a>
  </article>`).join('')}</div>`;

/* ---------- cabecera y pie ---------- */
const header = `
  <header class="site-header">
    <a href="/" class="logo"><img src="/assets/logo-mark.webp" alt="Logo de Miguel Posada" width="30" height="29"><span data-scramble>MIGUEL POSADA</span></a>
    <nav class="nav" id="nav">
      <a href="/#trabajo">Trabajo</a>
      <a href="/#servicios">Servicios</a>
      <a href="/precios/">Precios</a>
      <a href="/blog/">Blog</a>
      <a href="/#contacto">Contacto</a>
    </nav>
    <p class="header-role">Ingeniero de Sistemas <i>·</i> Desarrollador Web</p>
    <button class="menu-btn" aria-label="Abrir menú" aria-expanded="false" aria-controls="nav"><span></span><span></span></button>
    <span class="rule rule-bottom"></span>
  </header>`;

const footer = `
  <nav class="footer-links" aria-label="Páginas del sitio">
    <div><b>Servicios</b><a href="/diseno-paginas-web-barranquilla/">Diseño de páginas web en Barranquilla</a><a href="/tiendas-online/">Tiendas online</a><a href="/landing-pages/">Landing pages</a><a href="/precios/">Precios</a></div>
    <div><b>Por negocio</b><a href="/paginas-web-para-restaurantes/">Restaurantes y cafés</a><a href="/paginas-web-para-salones-de-belleza/">Salones de belleza</a><a href="/paginas-web-para-consultoras/">Consultoras</a></div>
    <div><b>Recursos</b><a href="/proyectos/">Proyectos</a><a href="/blog/">Blog</a><a href="/blog/que-incluye-una-pagina-web-profesional/">¿Qué incluye una página web?</a><a href="/blog/dominio-com-o-com-co/">¿.com o .com.co?</a></div>
  </nav>
  <footer class="site-footer">
    <span class="rule rule-top"></span>
    <p><b>Miguel Posada</b> <span>— Ingeniero de Sistemas &amp; Desarrollador Web</span></p>
    <ul>
      <li><svg viewBox="0 0 16 16"><path d="M8 15s5-4.6 5-8.5A5 5 0 0 0 3 6.5C3 10.4 8 15 8 15z"/><circle cx="8" cy="6.5" r="1.8"/></svg>Barranquilla, Colombia</li>
      <li><a href="${waLink('Hola Miguel, vi tu página y quiero cotizar mi sitio web')}" target="_blank" rel="noopener" data-ubicacion="footer"><svg viewBox="0 0 16 16"><path d="M2 14l1-3.2A6 6 0 1 1 5.3 13z"/><path d="M6 5.5c0 2.5 2 4.5 4.5 4.5l.8-1.2-1.4-.7-.6.6a3 3 0 0 1-1.9-1.9l.6-.6-.7-1.4z"/></svg>+57 300 311 7197</a></li>
      <li><a href="https://github.com/miguelpdv-lgtm" target="_blank" rel="noopener"><svg viewBox="0 0 16 16" class="fill"><path d="M8 .5a7.5 7.5 0 0 0-2.4 14.6c.4.1.5-.2.5-.4v-1.3c-2.1.5-2.5-1-2.5-1-.3-.9-.8-1.1-.8-1.1-.7-.5 0-.5 0-.5.8.1 1.2.8 1.2.8.7 1.2 1.8.8 2.2.6.1-.5.3-.8.5-1-1.7-.2-3.4-.8-3.4-3.7 0-.8.3-1.5.8-2-.1-.2-.3-1 .1-2 0 0 .6-.2 2.1.8a7 7 0 0 1 3.8 0c1.4-1 2.1-.8 2.1-.8.4 1 .2 1.8.1 2 .5.5.8 1.2.8 2 0 2.9-1.8 3.5-3.4 3.7.3.2.5.7.5 1.4v2.1c0 .2.1.5.6.4A7.5 7.5 0 0 0 8 .5z"/></svg>GitHub</a></li>
    </ul>
  </footer>`;

const cta = (msg, where) => `
    <section class="section cta page-cta" id="contacto">
      <div class="cta-panel">
        <canvas id="cta-canvas" aria-hidden="true"></canvas>
        <div class="sec-label reveal"><span class="num">→</span><span class="dash"></span></div>
        <div class="cta-grid">
          <h2 class="cta-title reveal">¿TIENES UN <br>PROYECTO <br>EN MENTE?</h2>
          <div class="cta-mid reveal">
            <p class="cta-build" data-scramble>CONSTRUYÁMOSLO.</p>
            <p>Cuéntame tu idea y te respondo pronto.</p>
            <p class="cta-remote"><span class="pulse"></span>Trabajo 100% en línea con negocios de toda Colombia.</p>
            <a href="${waLink(msg)}" class="btn btn-dark magnetic" target="_blank" rel="noopener" data-ubicacion="${where}">Escríbeme ${arrow}</a>
          </div>
          <ul class="cta-list reveal">
            <li>Sitios web</li><li>E-commerce</li><li>Web apps</li><li>Soluciones a medida</li>
            <span class="plus p-top" aria-hidden="true"></span><span class="plus p-bot" aria-hidden="true"></span>
          </ul>
        </div>
      </div>
    </section>`;

/* ---------- página completa ---------- */
export function renderPage(pg, { css, jsName, gaSnippet }) {
  const url = `${SITE}/${pg.slug}/`;
  const crumbs = [['Inicio', `${SITE}/`], ...(pg.parent ? [pg.parent] : []), [pg.crumb, url]];
  const graph = [
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: pg.title, description: pg.description, inLanguage: 'es-CO',
      isPartOf: { '@id': `${SITE}/#website` }, about: { '@id': `${SITE}/#business` }, ...(pg.dateModified ? { dateModified: pg.dateModified } : {}) },
    { '@type': 'BreadcrumbList', itemListElement: crumbs.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) },
    ...(pg.schema || []),
  ];
  if (pg.faq?.length) graph.push({ '@type': 'FAQPage', mainEntity: pg.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) });
  const where = pg.slug.replace(/\//g, '-');
  const pixel = pg.pixel || [
    { sel: 'main', x: .9, pose: 'wave', mood: 'happy', say: pg.pixelHello || '¡Hola! Soy Pixel. Te cuento todo sobre esta página.' },
    ...(pg.faq?.length ? [{ sel: '#preguntas', x: .1, pose: 'think', mood: 'curious', say: '¿Tienes dudas? Aquí están las respuestas.' }] : []),
    { sel: '#contacto', x: .86, pose: 'wave', mood: 'excited', say: '¿Hablamos? Miguel responde rápido por WhatsApp.', party: true },
  ];
  const faqHtml = pg.faq?.length ? block('?', 'Preguntas frecuentes', `<div class="faq-list">${pg.faq.map(([q, a]) => `<details class="faq-item reveal"><summary>${q}</summary><div class="faq-a"><p>${a}</p></div></details>`).join('')}</div>`, 'preguntas') : '';
  const related = pg.related?.length ? block('+', 'Te puede interesar', `<nav class="related" aria-label="Páginas relacionadas">${pg.related.map(([t, h]) => `<a href="${h}">${t}</a>`).join('')}</nav>`) : '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(pg.title)}</title>
<meta name="description" content="${esc(pg.description)}">
<meta name="author" content="Miguel Posada">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="canonical" href="${url}">
<meta property="og:type" content="${pg.ogType || 'website'}">
<meta property="og:locale" content="es_CO">
<meta property="og:site_name" content="Miguel Posada">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(pg.title)}">
<meta property="og:description" content="${esc(pg.description)}">
<meta property="og:image" content="${SITE}/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(pg.title)}">
<meta name="twitter:description" content="${esc(pg.description)}">
<meta name="twitter:image" content="${SITE}/og-image.jpg">
<meta name="theme-color" content="#0b0c09">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" href="/assets/favicon.png">
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/fonts/archivo-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/jetbrains-mono-latin.woff2" as="font" type="font/woff2" crossorigin>
<style>${css}</style>
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>
${gaSnippet}
<script>window.PIXEL_SECTIONS=${JSON.stringify(pixel)}</script>
</head>
<body class="subpage">
<canvas id="bg-canvas" aria-hidden="true"></canvas>
<div class="cursor" aria-hidden="true"><span class="cursor-x"></span><span class="cursor-y"></span><span class="cursor-label"></span></div>
<div class="page">
${header}
  <main id="top">
    <nav class="crumbs" aria-label="Ruta de navegación">${crumbs.map(([n, h], i) => i < crumbs.length - 1 ? `<a href="${h.replace(SITE, '')}">${n}</a><span aria-hidden="true">/</span>` : `<span aria-current="page">${n}</span>`).join('')}</nav>
    <section class="page-hero${pg.heroShot ? '' : ' solo'}">
      <div>
        <p class="kicker reveal">${pg.kicker}</p>
        <h1 class="reveal">${pg.h1}</h1>
        <p class="lead reveal">${pg.lead}</p>
        <div class="hero-ctas reveal">${btnWa(pg.ctaLabel || 'Cotizar por WhatsApp', pg.waMsg || `Hola Miguel, vi tu página ${pg.crumb} y quiero cotizar`, where)}${pg.secondary ? btnLink(...pg.secondary) : ''}</div>
        ${pg.metaLine ? `<p class="meta-line reveal">${pg.metaLine}</p>` : ''}
      </div>
      ${pg.heroShot ? `<div class="reveal">${shot(pg.heroShot, { lazy: false, sizes: '(max-width: 900px) 92vw, 540px' })}</div>` : ''}
    </section>
${pg.body}
${faqHtml}
${related}
${cta(pg.waMsg || `Hola Miguel, vi tu página ${pg.crumb} y quiero cotizar`, `${where}-cta`)}
  </main>
${footer}
</div>
<script src="/${jsName}" defer></script>
</body>
</html>`;
}
