// Plantilla compartida de las páginas internas en español e inglés (la portada es index.html).
export const SITE = 'https://www.miguelposada.dev';
export const WA = '573003117197';
export const waLink = msg => `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;

// Aproximado en dólares. Actualizar USD_RATE si la tasa cambia mucho (TRM 18-nov-2026: 3.309,55)
export const USD_RATE = 3300;
const toUsd = cop => Math.max(5, Math.round(cop / USD_RATE / 5) * 5);
export const addUsd = html => {
  const at = html.indexOf('<body');
  const body = html.slice(at).replace(/<span class="amt">((?:\$|COP )(\d{1,3}(?:[.,]\d{3})+))<\/span>|(?:\$|COP )(\d{1,3}(?:[.,]\d{3})+)/g, (m, amt, a, b) => {
    const cop = Number((a || b).replace(/\D/g, ''));
    return amt ? `${amt}<span class="usd">≈ USD ${toUsd(cop)}</span>` : `${m} (≈ USD ${toUsd(cop)})`;
  });
  return html.slice(0, at) + body;
};

// Equivalencias de URL entre idiomas
export const SLUGS = {
  'precios': 'pricing',
  'diseno-paginas-web-barranquilla': 'web-design-barranquilla',
  'tiendas-online': 'online-stores',
  'landing-pages': 'landing-pages',
  'paginas-web-para-restaurantes': 'websites-for-restaurants',
  'paginas-web-para-salones-de-belleza': 'websites-for-beauty-salons',
  'paginas-web-para-consultoras': 'websites-for-consulting-firms',
  'proyectos': 'projects',
  'blog': 'blog',
  'blog/que-incluye-una-pagina-web-profesional': 'blog/what-a-professional-website-includes',
  'blog/cuanto-cuesta-mantener-una-pagina-web': 'blog/website-maintenance-cost',
  'blog/dominio-com-o-com-co': 'blog/com-or-com-co-domain',
};
export const enPath = es => `/en/${SLUGS[es]}/`;

const T = {
  es: {
    skip: 'Saltar al contenido', home: 'Inicio', nav: [['/#trabajo', 'Trabajo'], ['/#servicios', 'Servicios'], ['/precios/', 'Precios'], ['/blog/', 'Blog'], ['/#contacto', 'Contacto']],
    role: 'Ingeniero de Sistemas <i>·</i> Desarrollador Web', menu: 'Abrir menú', logo: 'Logo de Miguel Posada',
    footNav: 'Páginas del sitio', footRole: 'Ingeniero de Sistemas &amp; Desarrollador Web', place: 'Barranquilla, Colombia',
    foot: [
      ['Servicios', [['/diseno-paginas-web-barranquilla/', 'Diseño de páginas web en Barranquilla'], ['/tiendas-online/', 'Tiendas online'], ['/landing-pages/', 'Landing pages'], ['/precios/', 'Precios']]],
      ['Por negocio', [['/paginas-web-para-restaurantes/', 'Restaurantes y cafés'], ['/paginas-web-para-salones-de-belleza/', 'Salones de belleza'], ['/paginas-web-para-consultoras/', 'Consultoras']]],
      ['Recursos', [['/proyectos/', 'Proyectos'], ['/blog/', 'Blog'], ['/blog/que-incluye-una-pagina-web-profesional/', '¿Qué incluye una página web?'], ['/blog/dominio-com-o-com-co/', '¿.com o .com.co?']]],
    ],
    waFoot: 'Hola Miguel, vi tu página y quiero cotizar mi sitio web', waPage: c => `Hola Miguel, vi tu página ${c} y quiero cotizar`,
    ctaTitle: '¿TIENES UN <br>PROYECTO <br>EN MENTE?', ctaBuild: 'CONSTRUYÁMOSLO.', ctaText: 'Cuéntame tu idea y te respondo pronto.',
    ctaRemote: 'Trabajo 100% en línea con clientes en todo el mundo.', ctaBtn: 'Escríbeme', ctaList: ['Sitios web', 'E-commerce', 'Web apps', 'Soluciones a medida'],
    quote: 'Cotizar por WhatsApp', faq: 'Preguntas frecuentes', related: 'Te puede interesar', relatedNav: 'Páginas relacionadas', crumbs: 'Ruta de navegación',
    pxHello: '¡Hola! Soy Pixel. Te cuento todo sobre esta página.', pxFaq: '¿Tienes dudas? Aquí están las respuestas.', pxCta: '¿Hablamos? Miguel responde rápido por WhatsApp.',
    plan: 'Cotizar', planTag: 'Más pedido', from: 'Desde ', planMsg: n => `Hola Miguel, me interesa el plan ${n}`,
    alt: n => `Página web de ${n}`, visit: 'visitar', wipAlt: n => `Avance del sitio web de ${n}, en desarrollo`, soon: 'Próximamente', wip: 'En desarrollo',
    usdNote: 'Valores en USD aproximados, según la tasa de cambio de noviembre de 2026.', switchLabel: 'View this page in English', switchText: 'EN', switchLang: 'en', locale: 'es_CO', inLanguage: 'es-CO',
  },
  en: {
    skip: 'Skip to content', home: 'Home', nav: [['/en/#trabajo', 'Work'], ['/en/#servicios', 'Services'], ['/en/pricing/', 'Pricing'], ['/en/blog/', 'Blog'], ['/en/#contacto', 'Contact']],
    role: 'Systems Engineer <i>·</i> Web Developer', menu: 'Open menu', logo: 'Miguel Posada logo',
    footNav: 'Site pages', footRole: 'Systems Engineer &amp; Web Developer', place: 'Barranquilla, Colombia',
    foot: [
      ['Services', [['/en/web-design-barranquilla/', 'Web design in Barranquilla'], ['/en/online-stores/', 'Online stores'], ['/en/landing-pages/', 'Landing pages'], ['/en/pricing/', 'Pricing']]],
      ['By business', [['/en/websites-for-restaurants/', 'Restaurants and cafés'], ['/en/websites-for-beauty-salons/', 'Beauty salons'], ['/en/websites-for-consulting-firms/', 'Consulting firms']]],
      ['Resources', [['/en/projects/', 'Projects'], ['/en/blog/', 'Blog'], ['/en/blog/what-a-professional-website-includes/', 'What should a website include?'], ['/en/blog/com-or-com-co-domain/', '.com or .com.co?']]],
    ],
    waFoot: 'Hi Miguel, I saw your website and would like a quote', waPage: c => `Hi Miguel, I saw your page "${c}" and would like a quote`,
    ctaTitle: 'HAVE A <br>PROJECT <br>IN MIND?', ctaBuild: 'LET’S BUILD IT.', ctaText: 'Tell me about your idea and I’ll get back to you soon.',
    ctaRemote: 'I work 100% online with clients worldwide.', ctaBtn: 'Message me', ctaList: ['Websites', 'E-commerce', 'Web apps', 'Custom solutions'],
    quote: 'Get a quote on WhatsApp', faq: 'Frequently asked questions', related: 'You might also like', relatedNav: 'Related pages', crumbs: 'Breadcrumb',
    pxHello: 'Hi! I’m Pixel. Let me walk you through this page.', pxFaq: 'Got questions? Here are the answers.', pxCta: 'Shall we talk? Miguel replies fast on WhatsApp.',
    plan: 'Get a quote', planTag: 'Most popular', from: 'From ', planMsg: n => `Hi Miguel, I’m interested in the ${n} plan`,
    alt: n => `${n} website`, visit: 'visit', wipAlt: n => `Preview of the ${n} website, in development`, soon: 'Coming soon', wip: 'In development',
    usdNote: 'USD amounts are approximate, based on the November 2026 exchange rate.', switchLabel: 'Ver esta página en español', switchText: 'ES', switchLang: 'es', locale: 'en_US', inLanguage: 'en',
  },
};

// Las piezas se generan al importar cada archivo de contenido, con el idioma activo
let LANG = 'es';
export const setLang = l => { LANG = l; };

const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const arrow = '<svg viewBox="0 0 16 16"><path d="M1 8h13M9 3l5 5-5 5"/></svg>';

export const siteTools = (lang, altHref) => {
  const t = T[lang];
  return `<div class="site-tools"><a class="lang-switch" href="${altHref}" hreflang="${t.switchLang}" lang="${t.switchLang}" aria-label="${t.switchLabel}" data-lang-switch="${t.switchLang}">${t.switchText}</a><button class="motion-toggle" type="button" data-motion-toggle><svg class="i-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5v14M15 5v14"/></svg><svg class="i-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg></button><button class="theme-toggle" type="button" data-theme-toggle><svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg><svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg></button></div>`;
};

/* ---------- piezas reutilizables ---------- */
export const PROJECTS = {
  ema: { name: 'Ema Rizos', dom: 'emarizos.co', url: 'https://emarizos.co', img: 'ema', c: '#e0689a' },
  ami: { name: 'AmicrespA', dom: 'amicrespa.com', url: 'https://amicrespa.com', img: 'ami', c: '#f2cf5b' },
  fly: { name: 'FlyLatam Plus', dom: 'flylatamplus.com', url: 'https://flylatamplus.com', img: 'flylatam', c: '#ff9f1c' },
  ordenio: { name: 'Ordenio', dom: 'ordenio.shop', url: 'https://ordenio.shop', img: 'ordenio', c: '#ff5a2c' },
  luminni: { name: 'Luminni', dom: 'luminni.store', url: 'https://luminni.store', img: 'luminni', c: '#e8b27a' },
  lusarte: { name: 'Lusarte', dom: 'lusarte.net', url: 'https://lusarte.net', img: 'lusarte', c: '#c9a7e0' },
  ratio: { name: 'Ratio Coffee Baq', dom: 'ratio-cafe-baq.ordenio.shop', url: 'https://ratio-cafe-baq.ordenio.shop/', img: 'ratio', c: '#ffc83d' },
};
export function shot(key, { sizes = '(max-width: 900px) 92vw, 560px', lazy = true, link = true } = {}) {
  const p = PROJECTS[key], t = T[LANG];
  const img = `<img src="/assets/${p.img}-800.webp" srcset="/assets/${p.img}-480.webp 480w, /assets/${p.img}-800.webp 800w, /assets/${p.img}.webp 1200w" sizes="${sizes}" alt="${esc(t.alt(p.name))} (${p.dom})" width="1200" height="750"${lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"'}>`;
  const inner = `<div class="shot-bar"><i></i><i></i><i></i><span>${p.dom}</span></div>${img}`;
  return link
    ? `<a class="page-shot tilt" href="${p.url}" target="_blank" rel="noopener" aria-label="${p.dom} — ${t.visit} ${esc(p.name)}" style="--c:${p.c}">${inner}</a>`
    : `<div class="page-shot" style="--c:${p.c}">${inner}</div>`;
}
// Proyecto en desarrollo: sin enlace ni dominio público
export const wipShot = (img, name) => {
  const t = T[LANG];
  return `<div class="page-shot is-wip"><div class="shot-bar"><i></i><i></i><i></i><span>${t.soon}</span></div><span class="wip-badge"><i></i>${t.wip}</span><img src="/assets/${img}-800.webp" srcset="/assets/${img}-480.webp 480w, /assets/${img}-800.webp 800w, /assets/${img}.webp 1200w" sizes="(max-width: 900px) 92vw, 560px" alt="${esc(t.wipAlt(name))}" width="1200" height="750" loading="lazy" decoding="async"></div>`;
};
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
export const PLANS_EN = [
  { name: 'Landing page', for: 'One page to sell a service or campaign', price: 'COP 720,000', note: 'one-time payment', c: 'var(--cyan)',
    items: ['1 conversion-focused page', 'WhatsApp button and message', 'Mobile-friendly design', 'Technical SEO and Google Analytics', 'Delivered in 5 to 7 business days'] },
  { name: 'Business website', for: 'For companies and service professionals', price: 'COP 1,000,000', note: 'with .com domain and hosting for 1 year · COP 800,000 if you already have them', c: 'var(--lime)', featured: true,
    items: ['Up to 5 pages (Home, About, Services, Case studies, Contact)', 'Contact form and WhatsApp', 'Custom design with your brand', 'Technical SEO, sitemap and Search Console', '30 days of support'] },
  { name: 'Online store', for: 'To sell products with online payments', price: 'COP 1,800,000', note: 'one-time payment · payment gateway fees apart', c: 'var(--violet)',
    items: ['Everything in the business website', 'Catalog, cart and admin panel', 'Online payments with Wompi or Bold', 'Coupons and discounts', 'Delivered in 7 to 14 business days'] },
  { name: 'Web app', for: 'Custom-built systems', price: 'Custom quote', note: 'based on project scope', c: 'var(--coral)',
    items: ['Bookings, CRM or internal dashboards', 'Users and database', 'API integrations', 'Automations', 'Extended support'] },
];
export const plansHtml = (only = null) => {
  const t = T[LANG], list = LANG === 'en' ? PLANS_EN : PLANS;
  return `<div class="plans"${only ? ' style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))"' : ''}>${list.filter((p, i) => !only || only.includes(i)).map(p => `
  <article class="plan${p.featured ? ' featured' : ''}" style="--c:${p.c}">
    ${p.featured ? `<span class="tag">${t.planTag}</span>` : ''}
    <h3>${p.name}</h3><p class="for">${p.for}</p>
    <p class="price">${/\d/.test(p.price) ? `${t.from}<span class="amt">${p.price}</span>` : p.price}<small>${p.note}</small></p>
    <ul>${p.items.map(i => `<li>${i}</li>`).join('')}</ul>
    <a href="${waLink(t.planMsg(p.name))}" class="btn ${p.featured ? 'btn-solid' : 'btn-ghost'}" target="_blank" rel="noopener" data-ubicacion="plan-${p.name.toLowerCase().replace(/\s+/g, '-')}">${t.plan} ${arrow}</a>
  </article>`).join('')}</div><p class="usd-note">${t.usdNote}</p>`;
};

/* ---------- cabecera y pie ---------- */
const header = (lang, altHref) => {
  const t = T[lang];
  return `
  <header class="site-header">
    <a href="${lang === 'en' ? '/en/' : '/'}" class="logo"><img src="/assets/logo-mark.webp" alt="${t.logo}" width="30" height="29"><span data-scramble>MIGUEL POSADA</span></a>
    <nav class="nav" id="nav">
      ${t.nav.map(([h, n]) => `<a href="${h}">${n}</a>`).join('\n      ')}
    </nav>
    <p class="header-role">${t.role}</p>
    ${siteTools(lang, altHref)}
    <button class="menu-btn" aria-label="${t.menu}" aria-expanded="false" aria-controls="nav"><span></span><span></span></button>
    <span class="rule rule-bottom"></span>
  </header>`;
};

const footer = lang => {
  const t = T[lang];
  return `
  <nav class="footer-links" aria-label="${t.footNav}">
    ${t.foot.map(([title, links]) => `<div><b>${title}</b>${links.map(([h, n]) => `<a href="${h}">${n}</a>`).join('')}</div>`).join('\n    ')}
  </nav>
  <footer class="site-footer">
    <span class="rule rule-top"></span>
    <p><b>Miguel Posada</b> <span>— ${t.footRole}</span></p>
    <ul>
      <li><svg viewBox="0 0 16 16"><path d="M8 15s5-4.6 5-8.5A5 5 0 0 0 3 6.5C3 10.4 8 15 8 15z"/><circle cx="8" cy="6.5" r="1.8"/></svg>${t.place}</li>
      <li><a href="${waLink(t.waFoot)}" target="_blank" rel="noopener" data-ubicacion="footer"><svg viewBox="0 0 16 16"><path d="M2 14l1-3.2A6 6 0 1 1 5.3 13z"/><path d="M6 5.5c0 2.5 2 4.5 4.5 4.5l.8-1.2-1.4-.7-.6.6a3 3 0 0 1-1.9-1.9l.6-.6-.7-1.4z"/></svg>+57 300 311 7197</a></li>
      <li><a href="https://github.com/miguelpdv-lgtm" target="_blank" rel="noopener"><svg viewBox="0 0 16 16" class="fill"><path d="M8 .5a7.5 7.5 0 0 0-2.4 14.6c.4.1.5-.2.5-.4v-1.3c-2.1.5-2.5-1-2.5-1-.3-.9-.8-1.1-.8-1.1-.7-.5 0-.5 0-.5.8.1 1.2.8 1.2.8.7 1.2 1.8.8 2.2.6.1-.5.3-.8.5-1-1.7-.2-3.4-.8-3.4-3.7 0-.8.3-1.5.8-2-.1-.2-.3-1 .1-2 0 0 .6-.2 2.1.8a7 7 0 0 1 3.8 0c1.4-1 2.1-.8 2.1-.8.4 1 .2 1.8.1 2 .5.5.8 1.2.8 2 0 2.9-1.8 3.5-3.4 3.7.3.2.5.7.5 1.4v2.1c0 .2.1.5.6.4A7.5 7.5 0 0 0 8 .5z"/></svg>GitHub</a></li>
    </ul>
  </footer>`;
};

const cta = (lang, msg, where) => {
  const t = T[lang];
  return `
    <section class="section cta page-cta" id="contacto">
      <div class="cta-panel">
        <canvas id="cta-canvas" aria-hidden="true"></canvas>
        <div class="sec-label reveal"><span class="num">→</span><span class="dash"></span></div>
        <div class="cta-grid">
          <h2 class="cta-title reveal">${t.ctaTitle}</h2>
          <div class="cta-mid reveal">
            <p class="cta-build" data-scramble>${t.ctaBuild}</p>
            <p>${t.ctaText}</p>
            <p class="cta-remote"><span class="pulse"></span>${t.ctaRemote}</p>
            <a href="${waLink(msg)}" class="btn btn-dark magnetic" target="_blank" rel="noopener" data-ubicacion="${where}">${t.ctaBtn} ${arrow}</a>
          </div>
          <ul class="cta-list reveal">
            ${t.ctaList.map(x => `<li>${x}</li>`).join('')}
          </ul>
        </div>
      </div>
    </section>`;
};

/* ---------- página completa ---------- */
export function renderPage(pg, { css, jsName, gaSnippet, bootJs }) {
  const lang = pg.lang || 'es', t = T[lang];
  const esSlug = lang === 'en' ? pg.esSlug : pg.slug;
  const esPath = `/${esSlug}/`, enHref = enPath(esSlug);
  const selfPath = lang === 'en' ? enHref : esPath, altHref = lang === 'en' ? esPath : enHref;
  const url = SITE + selfPath;
  const crumbs = [[t.home, `${SITE}${lang === 'en' ? '/en/' : '/'}`], ...(pg.parent ? [pg.parent] : []), [pg.crumb, url]];
  const graph = [
    { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: pg.title, description: pg.description, inLanguage: t.inLanguage,
      isPartOf: { '@id': `${SITE}/#website` }, about: { '@id': `${SITE}/#business` }, ...(pg.dateModified ? { dateModified: pg.dateModified } : {}) },
    { '@type': 'BreadcrumbList', itemListElement: crumbs.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })) },
    ...(pg.schema || []),
  ];
  if (pg.faq?.length) graph.push({ '@type': 'FAQPage', mainEntity: pg.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a.replace(/<[^>]+>/g, '') } })) });
  const where = selfPath.replace(/^\/|\/$/g, '').replace(/\//g, '-');
  const waMsg = pg.waMsg || t.waPage(pg.crumb);
  const pixel = pg.pixel || [
    { sel: 'main', x: .9, pose: 'wave', mood: 'happy', say: pg.pixelHello || t.pxHello },
    ...(pg.faq?.length ? [{ sel: '#preguntas', x: .1, pose: 'think', mood: 'curious', say: t.pxFaq }] : []),
    { sel: '#contacto', x: .86, pose: 'wave', mood: 'excited', say: t.pxCta, party: true },
  ];
  const faqHtml = pg.faq?.length ? block('?', t.faq, `<div class="faq-list">${pg.faq.map(([q, a]) => `<details class="faq-item reveal"><summary>${q}</summary><div class="faq-a"><p>${a}</p></div></details>`).join('')}</div>`, 'preguntas') : '';
  const related = pg.related?.length ? block('+', t.related, `<nav class="related" aria-label="${t.relatedNav}">${pg.related.map(([x, h]) => `<a href="${h}">${x}</a>`).join('')}</nav>`) : '';

  return `<!DOCTYPE html>
<html lang="${lang}" data-alt="${altHref}">
<head>
<meta charset="UTF-8">
<script>${bootJs}</script>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(pg.title)}</title>
<meta name="description" content="${esc(pg.description)}">
<meta name="author" content="Miguel Posada">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="es" href="${SITE}${esPath}">
<link rel="alternate" hreflang="en" href="${SITE}${enHref}">
<link rel="alternate" hreflang="x-default" href="${SITE}${esPath}">
<meta property="og:type" content="${pg.ogType || 'website'}">
<meta property="og:locale" content="${t.locale}">
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
<a class="skip-link" href="#top">${t.skip}</a>
<canvas id="bg-canvas" aria-hidden="true"></canvas>
<div class="cursor" aria-hidden="true"><span class="cursor-x"></span><span class="cursor-y"></span><span class="cursor-label"></span></div>
<div class="page">
${header(lang, altHref)}
  <main id="top" tabindex="-1">
    <nav class="crumbs" aria-label="${t.crumbs}">${crumbs.map(([n, h], i) => i < crumbs.length - 1 ? `<a href="${h.replace(SITE, '')}">${n}</a><span aria-hidden="true">/</span>` : `<span aria-current="page">${n}</span>`).join('')}</nav>
    <section class="page-hero${pg.heroShot ? '' : ' solo'}">
      <div>
        <p class="kicker reveal">${pg.kicker}</p>
        <h1 class="reveal">${pg.h1}</h1>
        <p class="lead reveal">${pg.lead}</p>
        <div class="hero-ctas reveal">${btnWa(pg.ctaLabel || t.quote, waMsg, where)}${pg.secondary ? btnLink(...pg.secondary) : ''}</div>
        ${pg.metaLine ? `<p class="meta-line reveal">${pg.metaLine}</p>` : ''}
      </div>
      ${pg.heroShot ? `<div class="reveal">${pg.heroHtml}</div>` : ''}
    </section>
${pg.body}
${faqHtml}
${related}
${cta(lang, waMsg, `${where}-cta`)}
  </main>
${footer(lang)}
</div>
<script src="/${jsName}" defer></script>
</body>
</html>`;
}
