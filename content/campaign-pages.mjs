// Landing pages: real portfolio evidence, independent developer, existing Ads measurement.
const config = {
  salones: {
    title: 'Páginas web para salones de rizos | Miguel Posada',
    description: 'Diseño tiendas online y webs para salones de cabello rizado. Conoce Ema Rizos, AmicrespA y Marea Rizada. Solicita una demo gratis.',
    eyebrow: 'DISEÑO WEB PARA SALONES DE RIZOS',
    heading: 'Tu salón tiene identidad. <em>Tu web también debería.</em>',
    summary: 'Diseño páginas web para salones especializados en cabello rizado, crespo y afro: reservas, tiendas online y experiencias de compra pensadas para tus clientas.',
    proofLine: '2 proyectos en producción · 1 en desarrollo',
    workHeading: 'Ya conozco tu sector.',
    workIntro: 'No tienes que imaginar cómo sería trabajar conmigo. Estas son páginas que he desarrollado para negocios de cabello rizado, cada una con su propia identidad.',
    features: [
      ['01', 'Más fácil reservar', 'Presenta tus servicios y conecta tu agenda para que tus clientas encuentren cómo reservar sin depender de mensajes de ida y vuelta.'],
      ['02', 'Vende tus productos online', 'Crea una tienda con catálogo, pagos y recomendaciones adaptadas a las necesidades de cada tipo de cabello.'],
      ['03', 'Haz visible tu especialidad', 'Comunica tu enfoque, técnicas, equipo y tratamientos con un diseño que represente tu salón.']
    ],
    projects: [
      {name:'Ema Rizos', image:'ema', domain:'emarizos.co', url:'https://emarizos.co', color:'#e0689a', type:'Tienda online + reservas', desc:'Tienda y reservas para un salón especialista en rizos, crespos y afros, con recomendaciones capilares, catálogo y agenda integrada.', tags:['AgendaPro','E-commerce','Pagos en línea'], height:578},
      {name:'AmicrespA', image:'ami', domain:'amicrespa.com', url:'https://amicrespa.com', color:'#f2cf5b', type:'Salón + tienda', desc:'Experiencia digital para un salón con sedes en Barranquilla y Cali, con servicios, tienda, recomendación personalizada y citas.', tags:['Diagnóstico capilar','Agenda','Tienda online'], height:578},
      {name:'Marea Rizada', image:'marea', domain:'En desarrollo', color:'#6fd6d6', type:'Salón de rizos', desc:'Proyecto en desarrollo para un salón especializado en corte rizo a rizo, diagnóstico y rutinas para patrones del 2A al 4C.', tags:['Servicios','Diagnóstico','En desarrollo'], height:589}
    ],
    options: ['Reservas de citas', 'Tienda online', 'Reservas y tienda', 'Otra necesidad'],
    whatsapp: 'Hola Miguel, tengo un salón de cabello rizado y quiero una demo de mi página web.',
    niche: 'salones'
  },
  demo: {
    title: 'Páginas web a medida | Demo gratis | Miguel Posada',
    description: 'Diseño páginas web, tiendas online y aplicaciones para negocios. Conoce mi portafolio real y solicita una demo gratis antes de pagar.',
    eyebrow: 'DESARROLLO WEB A MEDIDA · COLOMBIA',
    heading: 'Páginas web para negocios que quieren <em>más clientes.</em>',
    summary: 'Diseño y desarrollo tu sitio web desde cero, con la identidad de tu negocio. Páginas corporativas, tiendas online y soluciones a medida. Te muestro una demo antes de que pagues.',
    proofLine: '7 proyectos en producción · 1 en desarrollo',
    workHeading: 'No te muestro plantillas. Te muestro proyectos reales.',
    workIntro: 'De tiendas online a plataformas de pedidos y sitios de servicios. Explora las páginas que he construido, visita las que ya están publicadas y descubre qué podemos hacer para tu negocio.',
    features: [
      ['01', 'Páginas web y landing pages', 'Una presencia profesional que explica lo que haces, muestra tus servicios y facilita que tus clientes te contacten.'],
      ['02', 'Tiendas online', 'Catálogo, carrito, pagos en línea y una experiencia de compra adaptada a tus productos.'],
      ['03', 'Web apps e integraciones', 'Reservas, pedidos, paneles y flujos a medida para simplificar la operación de tu negocio.']
    ],
    options: ['Landing page', 'Página web corporativa', 'Tienda online', 'Web app o integración', 'Rediseño de mi web', 'Otra necesidad'],
    whatsapp: 'Hola Miguel, quiero una demo gratis de una página web para mi negocio.',
    niche: 'general'
  }
};

const [ema, ami, marea] = config.salones.projects;
const fly = {name:'FlyLatam Plus', image:'flylatam', domain:'flylatamplus.com', url:'https://flylatamplus.com', color:'#ff9f1c', type:'Sitio corporativo', desc:'Página para una agencia de viajes empresariales y vacacionales, con servicios, destinos y cotizaciones por WhatsApp.', tags:['Servicios','Cotizaciones','WhatsApp'], height:578};
const ordenio = {name:'Ordenio', image:'ordenio', domain:'ordenio.shop', url:'https://ordenio.shop', color:'#ff5a2c', type:'SaaS propio', desc:'Mi plataforma de comercio digital: catálogo, carrito, pagos con Wompi y subdominios personalizados para negocios.', tags:['SaaS','Pagos','Catálogo'], height:578};
const luminni = {name:'Luminni', image:'luminni', domain:'luminni.store', url:'https://luminni.store', color:'#e8b27a', type:'E-commerce editorial', desc:'Tienda de velas y objetos aromáticos, con colecciones presentadas como historias y una identidad visual editorial.', tags:['Tienda online','Diseño editorial'], height:578};
const lusarte = {name:'Lusarte', image:'lusarte', domain:'lusarte.net', url:'https://lusarte.net', color:'#c9a7e0', type:'Tienda de insumos', desc:'E-commerce de insumos para velas y velas artesanales, con domicilio local en Barranquilla y envíos a toda Colombia.', tags:['Catálogo','Pagos en línea','Envíos'], height:571};
const ratio = {name:'Ratio Coffee Baq', image:'ratio', domain:'ratio-cafe-baq.ordenio.shop', url:'https://ratio-cafe-baq.ordenio.shop/', color:'#ffc83d', type:'Cafetería · Pedidos online', desc:'Menú digital, horarios, domicilios y compra en línea con Wompi sobre mi plataforma Ordenio.', tags:['Menú digital','Domicilios','Wompi'], height:578};
config.demo.projects = [ema, fly, ami, ordenio, luminni, lusarte, ratio, marea];
config.demo.featured = [fly, ema, ordenio];
const escape = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const shot = (p, eager = false) => `<div class="browser" style="--project:${p.color}"><div class="browser-bar"><span class="browser-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>${escape(p.domain)}</span><span aria-hidden="true">↗</span></div><img src="/assets/${p.image}-800.webp" srcset="/assets/${p.image}-480.webp 480w, /assets/${p.image}-800.webp 800w, /assets/${p.image}.webp 1200w" sizes="(max-width: 680px) 90vw, (max-width: 1000px) 48vw, 650px" width="1200" height="${p.height}" alt="Captura del sitio ${escape(p.name)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></div>`;
const card = p => `<article class="case-card" style="--project:${p.color}">${p.url ? `<a class="case-shot" href="${p.url}" target="_blank" rel="noopener noreferrer" aria-label="Visitar ${escape(p.name)}">${shot(p)}</a>` : shot(p)}<div class="case-info"><div class="case-status"><span class="status-dot"></span>${p.url ? 'En producción' : 'En desarrollo'}</div><h3>${escape(p.name)}</h3><span class="case-type">${escape(p.type)}</span><p>${escape(p.desc)}</p><div class="tags">${p.tags.map(t=>`<span>${escape(t)}</span>`).join('')}</div>${p.url ? `<a class="case-link" href="${p.url}" target="_blank" rel="noopener noreferrer">Visitar sitio <span aria-hidden="true">↗</span></a>` : '<span class="case-link muted">Próximamente</span>'}</div></article>`;
export const CAMPAIGN_PAGES = Object.entries(config).map(([slug, x]) => ({
  slug,
  title: x.title,
  description: x.description,
  html: `<!doctype html>
<html lang="es" data-niche="${x.niche}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#0b0c09">
<meta name="description" content="${escape(x.description)}">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://www.miguelposada.dev/${slug}/">
<link rel="icon" href="/favicon.ico">
<link rel="preload" href="/fonts/archivo-latin.woff2" as="font" type="font/woff2" crossorigin>
<title>${escape(x.title)}</title>
<link rel="stylesheet" href="/campaign.css">
<script>!function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f);}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");oaiq("consent",false);oaiq("init",{pixelId:"McVWcUNL32oFdfMxLG4brg",debug:false});</script>
</head>
<body>
<header class="nav shell"><a href="/" class="brand" aria-label="Miguel Posada, portafolio"><img src="/assets/logo-mark.webp" alt="" width="34" height="34"><span>miguel<span class="lime">posada</span>.dev</span></a><nav aria-label="Navegación"><a class="nav-work" href="#proyectos">Proyectos</a><a href="#demo" class="nav-cta">Demo gratis <span aria-hidden="true">↗</span></a></nav></header>
<main>
<section class="hero shell"><div class="hero-copy"><p class="eyebrow"><span class="dot"></span>${x.eyebrow}</p><h1>${x.heading}</h1><p class="lead">${x.summary}</p><div class="actions"><a href="#demo" class="cta">Quiero mi demo gratis <span aria-hidden="true">↗</span></a><a href="#proyectos" class="link">Ver proyectos <span aria-hidden="true">↓</span></a></div><p class="assurance">Demo antes de pagar <span>·</span> Trato directo conmigo</p></div><div class="hero-visual ${slug === "salones" ? "salon-mosaic" : "general-mosaic"}"><div class="visual-top"><span><i class="status-dot"></i> PORTAFOLIO REAL</span><span>${slug === "salones" ? "01 — 03" : "01 — 08"}</span></div><div class="visual-main">${shot((x.featured || x.projects)[0], true)}<div class="visual-caption"><strong>${(x.featured || x.projects)[0].name}</strong><span>${(x.featured || x.projects)[0].type}</span></div></div><div class="visual-pair">${(x.featured || x.projects).slice(1).map(p=>`<div>${shot(p,true)}<div class="visual-caption"><strong>${p.name}</strong><span>${slug === "salones" ? (p.url ? "En producción" : "En desarrollo") : p.type}</span></div></div>`).join("")}</div><div class="visual-bottom"><span>${x.proofLine}</span><a href="#proyectos">Ver casos ↓</a></div></div></section>
<section id="proyectos" class="work-section"><div class="shell"><div class="section-head"><div><p class="section-label">01 / TRABAJO REAL</p><h2>${x.workHeading}</h2></div><p>${x.workIntro}</p></div><div class="case-grid ${slug === "demo" ? "general-case-grid" : ""}">${x.projects.map(card).join("")}</div>${slug === "demo" ? `<a class="cta work-cta" href="#demo">Quiero una web para mi negocio <span aria-hidden="true">↗</span></a>` : `<a class="text-link" href="/proyectos/">Ver mi portafolio completo <span aria-hidden="true">↗</span></a>`}</div></section>
<section id="solucion" class="section shell"><div class="section-head"><div><p class="section-label">02 / LO QUE PUEDO HACER POR TI</p><h2>Una web que trabaja <em>para tu negocio.</em></h2></div><p>El diseño y las funciones se definen contigo. No tienes que adaptar tu negocio a una plantilla.</p></div><div class="features">${x.features.map(([n,t,d])=>`<article><span class="feature-tag">/${n}</span><h3>${escape(t)}</h3><p>${escape(d)}</p></article>`).join("")}</div></section>
${slug === "demo" ? `<section class="price-strip shell"><div><p class="section-label">PRECIOS TRANSPARENTES</p><h2>Proyectos desde $720.000 COP.</h2><p>El valor final depende de lo que necesite tu negocio. Primero puedes ver una demo sin pagar.</p></div><a class="text-link" href="/precios/">Consultar planes <span aria-hidden="true">↗</span></a></section>` : ""}
<section class="process shell"><div><p class="section-label">03 / SIN INTERMEDIARIOS</p><h2>Primero la demo.<br>Luego decides.</h2><p>Hablas directamente conmigo, la persona que diseña y desarrolla tu web.</p></div><ol><li><span>01</span><div><strong>Conozco tu negocio</strong><p>Me cuentas qué vendes, cómo trabajas y qué quieres mejorar.</p></div></li><li><span>02</span><div><strong>Te muestro una propuesta visual</strong><p>Preparo una demo para que puedas ver la dirección del diseño antes de pagar.</p></div></li><li><span>03</span><div><strong>Construimos tu web</strong><p>Si te gusta la propuesta, definimos alcance, precio y desarrollo.</p></div></li></ol></section>
<section id="demo" class="section shell demo"><div class="demo-copy"><p class="section-label">04 / HABLEMOS</p><h2>Tu próxima web <em>empieza aquí.</em></h2><p>Cuéntame qué necesita tu negocio. Revisaré tu caso y hablaremos por WhatsApp sobre una demo a medida, sin compromiso de contratar.</p><div class="demo-promise"><strong>Demo gratis</strong><span>Antes de hacer cualquier pago.</span></div><p class="small-print">Desarrollo web independiente · Barranquilla, Colombia</p></div><div class="form-panel"><div class="form-heading"><span>01 / SOLICITUD DE DEMO</span><h3>Cuéntame sobre tu proyecto</h3></div>
<form id="lead-form" data-niche="${x.niche}" data-message="${escape(x.whatsapp)}">
<label class="wide">Nombre de tu negocio <input name="business" required minlength="2" maxlength="100" autocomplete="organization" placeholder="Ej. Mi negocio"></label>
<label>¿Qué necesitas? <select name="service" required><option value="">Selecciona una opción</option>${x.options.map(v=>`<option value="${escape(v)}">${escape(v)}</option>`).join('')}</select></label>
<label>Presupuesto estimado <select name="budget" required><option value="">Selecciona un rango</option><option>Menos de $1.000.000 COP</option><option>$1.000.000 – $2.000.000 COP</option><option>Más de $2.000.000 COP</option><option>Por definir</option></select></label>
<label>Tu nombre <input name="name" required minlength="2" maxlength="80" autocomplete="name" placeholder="¿Cómo te llamas?"></label>
<label>WhatsApp de contacto <input name="phone" type="tel" required minlength="7" maxlength="25" inputmode="tel" autocomplete="tel" placeholder="+57 300 000 0000"></label>
<label class="consent wide"><input type="checkbox" name="consent" required> <span>Acepto que Miguel me contacte por WhatsApp para responder mi solicitud. <a href="mailto:hola@miguelposada.dev?subject=Tratamiento%20de%20datos">Consultar tratamiento de datos</a>.</span></label>
<label class="consent wide"><input type="checkbox" name="measurement_consent"> <span>Acepto la medición publicitaria de OpenAI mediante cookies. Es opcional y no afecta mi solicitud.</span></label>
<button class="wide" type="submit">Continuar a WhatsApp <span aria-hidden="true">↗</span></button>
<p class="form-note wide" role="status" aria-live="polite">Se abrirá WhatsApp con tu solicitud lista para enviar. No se registra una solicitud completada hasta recibir tu mensaje.</p>
</form></div></section></main>
<footer class="footer shell"><span>© Miguel Posada · Desarrollador web independiente</span><a href="/">Volver al portafolio ↗</a></footer>
<script src="/campaign.js" defer></script>
</body></html>`
}));
