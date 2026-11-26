// Landing pages enfocadas en prospectos de ChatGPT Ads.
// No hay pixel de OpenAI hasta contar con la configuración oficial de Ads Manager.
const config = {
  salones: {
    title: 'Páginas web para salones de cabello rizado | Miguel Posada',
    description: 'Crea una web a medida para tu salón de rizos: reservas, catálogo y tienda online. Solicita una demo gratis antes de pagar.',
    category: 'Salones de cabello rizado',
    eyebrow: 'PARA SALONES DE RIZOS · WEB A MEDIDA',
    heading: 'TU SALÓN MERECE UNA WEB QUE <em>TRABAJE POR TI.</em>',
    summary: 'Tus clientas buscan tratamientos, citas y productos. Muéstrales todo en un solo lugar con una web diseñada para tu salón.',
    features: [
      ['01 / CITAS', 'Haz que reservar sea sencillo', 'Una experiencia clara para mostrar servicios y conectar con tu sistema de agenda.'],
      ['02 / VENTAS', 'Lleva tus productos a internet', 'Catálogo o tienda online para tus líneas de cuidado capilar y rutinas.'],
      ['03 / MARCA', 'Una identidad propia', 'Diseño que refleje el estilo de tu salón; no una plantilla genérica.']
    ],
    proof: 'EXPERIENCIA REAL EN EL SECTOR',
    proofTitle: 'Ya he trabajado con una tienda para cabello rizado.',
    proofText: 'En Ema Rizos desarrollé una experiencia de compra personalizada con recomendaciones capilares. Puedes conocer el proyecto en mi portafolio.',
    proofHref: '/proyectos/',
    proofLink: 'Ver proyectos',
    options: ['Reservas de citas', 'Tienda online', 'Reservas y tienda', 'Otra necesidad'],
    whatsapp: 'Hola Miguel, tengo un salón de cabello rizado y quiero una demo de mi página web.',
    niche: 'salones'
  },
  surtidores: {
    title: 'Páginas web y catálogos para surtidores | Miguel Posada',
    description: 'Digitaliza tu distribuidora con catálogo, solicitudes de pedidos y soluciones web personalizadas. Solicita una demo gratuita.',
    category: 'Surtidores y distribuidores',
    eyebrow: 'PARA SURTIDORES · CATÁLOGOS Y PEDIDOS',
    heading: 'DEJA QUE TUS CLIENTES <em>ENCUENTREN Y PIDAN</em> MÁS FÁCIL.',
    summary: 'Si vendes productos al por mayor, un catálogo digital claro puede ayudar a tus compradores a consultar referencias y solicitar pedidos.',
    features: [
      ['01 / CATÁLOGO', 'Tus productos, siempre visibles', 'Organiza referencias, categorías y presentaciones para que tus clientes consulten desde el celular.'],
      ['02 / PEDIDOS', 'Menos mensajes desordenados', 'Centraliza solicitudes de pedido en un flujo diseñado alrededor de tu operación.'],
      ['03 / CONTROL', 'Crece sin perder claridad', 'Podemos evaluar inventario, cuentas empresariales e integraciones según tus necesidades.']
    ],
    proof: 'SOLUCIONES A LA MEDIDA',
    proofTitle: 'La web se adapta a tu forma de vender.',
    proofText: 'No necesitas adoptar una tienda genérica. Primero revisamos cómo cotizas, recibes pedidos y despachas; luego definimos qué automatizar.',
    proofHref: '/proyectos/',
    proofLink: 'Conoce mi trabajo',
    options: ['Catálogo digital', 'Pedidos online', 'Inventario e integraciones', 'Otra necesidad'],
    whatsapp: 'Hola Miguel, tengo una distribuidora y quiero una demo de catálogo y pedidos.',
    niche: 'surtidores'
  }
};
const escape = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
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
<script>!function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f);}(window,document,"script","https://bzrcdn.openai.com/sdk/oaiq.min.js");oaiq("init",{pixelId:"McVWcUNL32oFdfMxLG4brg",debug:false});</script>
</head>
<body>
<header class="nav"><a href="/" class="brand"><img src="/assets/logo-mark.webp" alt="" width="34" height="34"><span>miguel<span class="lime">posada</span>.dev</span></a><a href="#demo" class="nav-cta">Solicitar demo <span aria-hidden="true">↗</span></a></header>
<main>
<section class="hero shell">
<div class="hero-copy"><div class="eyebrow"><span class="dot"></span>${x.eyebrow}</div>
<h1>${x.heading}</h1>
<p class="lead">${x.summary}</p>
<div class="actions"><a href="#demo" class="cta">Quiero ver mi demo gratis <span aria-hidden="true">↗</span></a><a href="#solucion" class="link">Ver qué puedo desarrollar ↓</a></div>
<div class="assurance"><span>Demo gratis antes de pagar</span><span>Trato directo conmigo</span><span>Diseño a medida</span></div>
</div>
<div class="hero-art" role="img" aria-label="Vista de ${escape(x.category)} y herramientas digitales"><div class="art-frame"><span class="frame-label">/ ${slug} · DIGITAL EXPERIENCE</span><div class="art-icon">${slug === 'salones' ? '✳' : '▦'}</div><span class="frame-bottom">HECHO PARA TU NEGOCIO <b>↗</b></span></div></div>
</section>
<section id="solucion" class="section shell"><p class="section-label">01 — EL PROBLEMA, RESUELTO</p><h2>Una web pensada para <span class="lime">${escape(x.category.toLowerCase())}.</span></h2><div class="features">${x.features.map(([tag,title,desc])=>`<article><span class="feature-tag">${escape(tag)}</span><h3>${escape(title)}</h3><p>${escape(desc)}</p></article>`).join('')}</div></section>
<section class="proof shell"><div><p class="section-label">${x.proof}</p><h2>${x.proofTitle}</h2><p>${x.proofText}</p><a class="text-link" href="${x.proofHref}">${x.proofLink} ↗</a></div><div class="proof-panel"><span>DESARROLLO WEB SIN INTERMEDIARIOS</span><strong>01 <i>/</i> 01</strong><p>Hablas con la persona que diseña y desarrolla tu proyecto.</p></div></section>
<section id="demo" class="section shell demo"><div class="demo-copy"><p class="section-label">02 — SIGUIENTE PASO</p><h2>CUÉNTAME TU IDEA. <span class="lime">TE MUESTRO UNA DEMO.</span></h2><p>Solo necesito algunos datos para entender tu negocio. La demo es gratuita y no te compromete a contratar.</p><div class="demo-steps"><span>01. Me cuentas qué necesitas</span><span>02. Revisamos tu caso</span><span>03. Te propongo una demo</span></div></div>
<form id="lead-form" data-niche="${x.niche}" data-message="${escape(x.whatsapp)}">
<label>Nombre de tu negocio <input name="business" required minlength="2" maxlength="100" autocomplete="organization" placeholder="Ej. Mi negocio"></label>
<label>¿Qué necesitas? <select name="service" required><option value="">Selecciona una opción</option>${x.options.map(v=>`<option value="${escape(v)}">${escape(v)}</option>`).join('')}</select></label>
<label>Presupuesto estimado <select name="budget" required><option value="">Selecciona un rango</option><option>Menos de $1.000.000 COP</option><option>$1.000.000 – $2.000.000 COP</option><option>Más de $2.000.000 COP</option><option>Por definir</option></select></label>
<label>Tu nombre <input name="name" required minlength="2" maxlength="80" autocomplete="name" placeholder="¿Cómo te llamas?"></label>
<label>WhatsApp de contacto <input name="phone" type="tel" required minlength="7" maxlength="25" inputmode="tel" autocomplete="tel" placeholder="+57 300 000 0000"></label>
<label class="consent"><input type="checkbox" name="consent" required> Acepto que Miguel me contacte por WhatsApp para responder mi solicitud. <a href="mailto:hola@miguelposada.dev?subject=Tratamiento%20de%20datos">Consultar tratamiento de datos</a>.</label>
<button type="submit">Continuar a WhatsApp <span aria-hidden="true">↗</span></button>
<p class="form-note" role="status" aria-live="polite">Se abrirá WhatsApp con tu solicitud lista para enviar. No se registra una solicitud completada hasta recibir tu mensaje.</p>
</form></section>
</main>
<footer class="footer shell"><span>© Miguel Posada · Desarrollador web independiente</span><a href="/">Volver al portafolio ↗</a></footer>
<script src="/campaign.js" defer></script>
</body></html>`
}));
