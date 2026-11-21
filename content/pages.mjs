// Contenido de las páginas internas. Cada objeto genera /<slug>/index.html (ver build.mjs).
import { SITE, block, cards, shotsGrid, shot, plansHtml, PLANS, PROJECTS } from './layout.mjs';

const TODAY = '2026-11-20';
const L = 'var(--lime)', CY = 'var(--cyan)', VI = 'var(--violet)', CO = 'var(--coral)';
const service = (name, slug, desc, price) => ({
  '@type': 'Service', name, serviceType: name, url: `${SITE}/${slug}/`, description: desc,
  provider: { '@id': `${SITE}/#business` }, areaServed: { '@type': 'Country', name: 'Colombia' },
  ...(price ? { offers: { '@type': 'Offer', priceCurrency: 'COP', price, description: 'Precio desde' } } : {}),
});
const article = (slug, headline, description) => ({
  '@type': 'BlogPosting', headline, description, url: `${SITE}/blog/${slug}/`, inLanguage: 'es-CO',
  datePublished: TODAY, dateModified: TODAY, image: `${SITE}/og-image.jpg`,
  author: { '@id': `${SITE}/#person` }, publisher: { '@id': `${SITE}/#business` }, mainEntityOfPage: `${SITE}/blog/${slug}/`,
});
const prose = html => `<div class="prose reveal">${html}</div>`;

const FAQ_PRECIO = ['¿Cuánto cuesta una página web en Colombia?', 'Depende del tipo de página. Conmigo, una landing page está desde <strong>$720.000</strong>, un sitio web corporativo de hasta 5 páginas desde <strong>$1.000.000</strong> con dominio y hosting por un año, y una tienda online desde <strong>$1.800.000</strong>. Las web apps se cotizan según el proyecto.'];
const FAQ_PAGO = ['¿Cómo se paga?', 'Pagas el 50% para empezar y el 50% restante cuando la página está terminada y publicada.'];
const FAQ_REMOTO = ['¿Trabajas con negocios fuera de Barranquilla?', 'Sí. Trabajo 100% en línea con negocios de toda Colombia. Todo el proceso se hace por WhatsApp y videollamada.'];

export const PAGES = [
  /* ======================================================= PRECIOS */
  {
    slug: 'precios', crumb: 'Precios',
    title: 'Precios de Páginas Web en Colombia (2026) | Miguel Posada',
    description: 'Cuánto cuesta una página web en Colombia: landing pages desde $720.000, sitios corporativos desde $1.000.000 y tiendas online desde $1.800.000.',
    kicker: 'Precios 2026 · Pesos colombianos',
    h1: '¿Cuánto cuesta una página web en Colombia?',
    lead: 'Precios claros, en pesos y sin letra pequeña. Elige el tipo de página que necesita tu negocio: todos los planes incluyen diseño a la medida, versión para celular, WhatsApp y SEO técnico para aparecer en Google.',
    metaLine: 'Pago 50% al empezar y 50% al entregar · Actualizado: noviembre de 2026',
    waMsg: 'Hola Miguel, vi tus precios y quiero cotizar mi página web',
    pixelHello: 'Estos son los precios de Miguel. Sin sorpresas.',
    body:
      block('01', 'Planes', plansHtml()) +
      block('02', 'Qué influye en el precio', prose(`
        <h2>¿Por qué una página web cuesta más que otra?</h2>
        <p>El precio de una página web depende sobre todo de cuánto trabajo hay detrás. Estos son los factores que más pesan:</p>
        <ul>
          <li><strong>Número de páginas.</strong> Una landing page es una sola página enfocada en una acción. Un sitio corporativo tiene varias: inicio, nosotros, servicios, casos y contacto.</li>
          <li><strong>Funciones.</strong> Un catálogo con carrito y pagos en línea, reservas de citas o un panel de administración suman horas de desarrollo.</li>
          <li><strong>Diseño a la medida o plantilla.</strong> Todas mis páginas se diseñan desde cero con tu marca. No uso plantillas compradas.</li>
          <li><strong>Contenido.</strong> Si ya tienes textos, logo y fotos, el proyecto avanza más rápido. Si necesitas ayuda con eso, se cotiza aparte.</li>
          <li><strong>Dominio y hosting.</strong> El plan corporativo los incluye el primer año. Si ya los tienes, el precio baja.</li>
        </ul>
        <div class="callout">Las agencias en Colombia suelen cobrar varios millones de pesos por un sitio corporativo. Al trabajar directamente conmigo, sin intermediarios, pagas por el trabajo y no por la estructura de una agencia.</div>`)) +
      block('03', 'Qué incluye', cards([
        ['Diseño a la medida', 'Tu página se diseña desde cero con los colores, el logo y el tono de tu marca.', L],
        ['Listo para celular', 'La mayoría de las visitas llegan desde el teléfono. Cada página se prueba en celular, tableta y computador.', CY],
        ['WhatsApp y formularios', 'Botones que abren WhatsApp con un mensaje listo y formularios de contacto que llegan a tu correo.', VI],
        ['SEO técnico', 'Títulos, descripciones, datos estructurados, sitemap y registro en Google Search Console.', CO],
        ['Velocidad', 'Imágenes optimizadas y código limpio para que la página cargue en segundos.', L],
        ['Analítica', 'Google Analytics configurado para medir visitas y cuántas personas te escriben.', CY],
      ])) +
      block('04', 'Costos después de la entrega', prose(`
        <h2>¿Hay costos mensuales?</h2>
        <p>No es obligatorio. Después de la entrega solo existen dos costos posibles:</p>
        <ul>
          <li><strong>Renovación de dominio y hosting</strong> desde el segundo año, que se paga una vez al año.</li>
          <li><strong>Mantenimiento opcional</strong> si quieres que me encargue de actualizaciones, cambios y mejoras cada mes.</li>
        </ul>
        <p>Los primeros 30 días después de la entrega tienes soporte incluido para ajustes y dudas. Si quieres saber más, lee <a href="/blog/cuanto-cuesta-mantener-una-pagina-web/">cuánto cuesta mantener una página web</a>.</p>`)),
    faq: [
      FAQ_PRECIO,
      ['¿El precio incluye dominio y hosting?', 'El plan de sitio web corporativo incluye dominio .com y hosting durante el primer año. Si ya tienes dominio y hosting, el mismo sitio cuesta <strong>$800.000</strong>.'],
      FAQ_PAGO,
      ['¿Cuánto tiempo tarda?', 'Una landing page o un sitio de hasta 5 páginas toma de 5 a 7 días hábiles. Una tienda online, de 7 a 14 días hábiles, contados desde el anticipo y la entrega del contenido.'],
      ['¿Qué pasa si necesito más páginas?', 'Se cotiza cada página adicional según su contenido. Escríbeme con lo que necesitas y te doy el precio exacto.'],
      ['¿La pasarela de pagos tiene costo?', 'Pasarelas como Wompi o Bold cobran una comisión por cada venta, que pagas directamente a ellas. La integración en tu tienda está incluida en el plan de tienda online.'],
    ],
    schema: [{ '@type': 'OfferCatalog', name: 'Planes de páginas web', itemListElement: PLANS.filter(p => p.price.startsWith('$')).map(p => ({ '@type': 'Offer', name: p.name, priceCurrency: 'COP', price: p.price.replace(/\D/g, ''), description: p.for, seller: { '@id': `${SITE}/#business` } })) }],
    related: [['Diseño de páginas web en Barranquilla', '/diseno-paginas-web-barranquilla/'], ['Tiendas online', '/tiendas-online/'], ['Landing pages', '/landing-pages/'], ['¿Qué incluye una página web profesional?', '/blog/que-incluye-una-pagina-web-profesional/']],
  },

  /* ======================================================= BARRANQUILLA */
  {
    slug: 'diseno-paginas-web-barranquilla', crumb: 'Diseño de páginas web en Barranquilla',
    title: 'Diseño de Páginas Web en Barranquilla | Miguel Posada',
    description: 'Diseño de páginas web en Barranquilla para negocios y empresas: sitios rápidos, a la medida y optimizados para Google. Desde $720.000.',
    kicker: 'Barranquilla · Atlántico · Toda Colombia',
    h1: 'Diseño de páginas web en Barranquilla',
    lead: 'Soy Miguel Posada, Ingeniero de Sistemas en Barranquilla. Diseño y desarrollo páginas web a la medida para negocios de la ciudad y de toda Colombia: rápidas, fáciles de usar desde el celular y pensadas para que tus visitas te escriban.',
    heroShot: 'ratio', metaLine: 'Desde $720.000 · Entrega en 5 a 7 días hábiles',
    waMsg: 'Hola Miguel, soy de Barranquilla y quiero cotizar una página web',
    pixelHello: '¡Hola, vecino! Miguel también es de Barranquilla.',
    body:
      block('01', 'Por qué trabajar conmigo', cards([
        ['Trato directo', 'Hablas siempre conmigo, sin intermediarios ni cuentas de agencia. Respondo por WhatsApp.', L],
        ['Diseño propio', 'Cada página se diseña desde cero para tu negocio. Nada de plantillas genéricas.', CY],
        ['Rápida y para celular', 'Código optimizado que carga en segundos y se ve perfecto en cualquier teléfono.', VI],
        ['Lista para Google', 'SEO técnico incluido: títulos, datos estructurados, sitemap y Search Console.', CO],
        ['Pagos y WhatsApp', 'Integro WhatsApp, formularios y pagos en línea con Wompi o Bold.', L],
        ['Precio claro', 'Planes desde $720.000 y pago 50% al empezar, 50% al entregar.', CY, ['Ver precios', '/precios/']],
      ])) +
      block('02', 'Negocios de Barranquilla', `${prose(`
        <h2>Páginas web hechas en Barranquilla</h2>
        <p>Estos son algunos de los negocios de la ciudad que ya tienen su página web conmigo. Todos están en línea y puedes visitarlos:</p>`)}
        <div style="margin-top:24px">${shotsGrid(['ema', 'ami', 'ratio', 'fly'])}</div>`) +
      block('03', 'Servicios', cards([
        ['Sitio web corporativo', 'Hasta 5 páginas para presentar tu empresa, tus servicios y tus casos de éxito.', L, ['Ver precio', '/precios/']],
        ['Tienda online', 'Catálogo, carrito y pagos en línea para vender tus productos en todo el país.', VI, ['Tiendas online', '/tiendas-online/']],
        ['Landing page', 'Una página enfocada en una sola acción, ideal para campañas en Google o redes.', CY, ['Landing pages', '/landing-pages/']],
      ])) +
      block('04', 'Cómo trabajamos', prose(`
        <h2>De la idea a tu página publicada</h2>
        <ol>
          <li><strong>Descubrir.</strong> Hablamos de tu negocio, tus clientes y lo que quieres lograr con la página.</li>
          <li><strong>Diseñar.</strong> Te muestro la propuesta visual y la ajustamos hasta que te guste.</li>
          <li><strong>Construir.</strong> Desarrollo la página, la pruebo en celular y computador y la optimizo para Google.</li>
          <li><strong>Lanzar.</strong> La publico en tu dominio, configuro Google Analytics y te explico cómo funciona.</li>
        </ol>
        <p>Si estás en Barranquilla y prefieres conocernos en persona, lo coordinamos. Si estás en otra ciudad, todo funciona igual de bien por videollamada.</p>`)),
    faq: [
      FAQ_PRECIO,
      ['¿Cuánto tarda una página web?', 'Entre 5 y 7 días hábiles para una landing page o un sitio de hasta 5 páginas, y entre 7 y 14 para una tienda online.'],
      ['¿Me ayudas con el dominio y el hosting?', 'Sí. El plan corporativo incluye dominio .com y hosting el primer año, y yo me encargo de comprarlos y configurarlos.'],
      FAQ_PAGO, FAQ_REMOTO,
    ],
    schema: [service('Diseño de páginas web en Barranquilla', 'diseno-paginas-web-barranquilla', 'Diseño y desarrollo de páginas web a la medida para negocios de Barranquilla y toda Colombia.', '720000')],
    related: [['Precios', '/precios/'], ['Tiendas online', '/tiendas-online/'], ['Páginas web para restaurantes', '/paginas-web-para-restaurantes/'], ['Proyectos', '/proyectos/']],
  },

  /* ======================================================= TIENDAS ONLINE */
  {
    slug: 'tiendas-online', crumb: 'Tiendas online',
    title: 'Tiendas Online en Colombia con Wompi y Bold | Miguel Posada',
    description: 'Creo tiendas online en Colombia con catálogo, carrito y pagos con Wompi o Bold. A la medida, rápidas y listas para vender. Desde $1.800.000.',
    kicker: 'E-commerce · Pagos en línea',
    h1: 'Tiendas online listas para vender en Colombia',
    lead: 'Tu tienda online con catálogo, carrito, panel de administración y pagos en línea con Wompi o Bold. Diseñada para tu marca, rápida en el celular y conectada a WhatsApp para que no pierdas ninguna venta.',
    heroShot: 'ema', metaLine: 'Desde $1.800.000 · Entrega en 7 a 14 días hábiles',
    waMsg: 'Hola Miguel, quiero cotizar una tienda online',
    pixelHello: '¿Quieres vender en línea? Mira estas tiendas.',
    body:
      block('01', 'Qué incluye tu tienda', cards([
        ['Catálogo de productos', 'Fotos, precios, variantes y categorías que tú mismo puedes actualizar.', L],
        ['Carrito y pagos', 'Pago con tarjeta, PSE y Nequi a través de pasarelas colombianas como Wompi o Bold.', VI],
        ['Panel de administración', 'Gestiona pedidos, inventario, cupones y descuentos desde un solo lugar.', CY],
        ['WhatsApp integrado', 'Tus clientes pueden preguntarte antes de comprar sin salir de la tienda.', CO],
        ['Rápida y segura', 'Carga en segundos, con certificado de seguridad (HTTPS) y código optimizado.', L],
        ['Lista para Google', 'Cada producto con su título, descripción y datos estructurados.', CY],
      ])) +
      block('02', 'Tiendas que ya venden', `${prose(`<h2>Tiendas online que diseñé</h2><p>Estas tiendas ya están vendiendo en Colombia. Cada una tiene un diseño propio según su marca y su forma de vender.</p>`)}<div style="margin-top:24px">${shotsGrid(['ema', 'luminni', 'ami', 'ordenio'])}</div>`) +
      block('03', 'Tienda online o catálogo por WhatsApp', prose(`
        <h2>¿Qué te conviene más?</h2>
        <table>
          <thead><tr><th>Opción</th><th>Ideal para</th><th>Cómo cobras</th></tr></thead>
          <tbody>
            <tr><td>Tienda online completa</td><td>Marcas con muchos productos que quieren cobrar en línea</td><td>Pasarela de pagos (Wompi o Bold)</td></tr>
            <tr><td>Catálogo con pedido por WhatsApp</td><td>Restaurantes y negocios que ya venden por chat</td><td>WhatsApp o pago en línea con <a href="${PROJECTS.ordenio.url}" target="_blank" rel="noopener">Ordenio</a></td></tr>
          </tbody>
        </table>
        <p>Si no tienes claro cuál necesitas, escríbeme y te recomiendo la opción que más te conviene según tu negocio.</p>`)),
    faq: [
      ['¿Cuánto cuesta una tienda online?', 'Desde <strong>$1.800.000</strong> en pago único. La comisión por cada venta la cobra la pasarela de pagos directamente.'],
      ['¿Qué pasarelas de pago usan?', 'Trabajo con pasarelas colombianas como Wompi y Bold, que aceptan tarjetas, PSE y otros medios de pago locales.'],
      ['¿Puedo subir y editar mis productos?', 'Sí. Tu tienda incluye un panel de administración para agregar productos, cambiar precios y ver pedidos.'],
      ['¿Cuánto tarda?', 'Entre 7 y 14 días hábiles, según la cantidad de productos y funciones.'],
      FAQ_PAGO,
    ],
    schema: [service('Desarrollo de tiendas online', 'tiendas-online', 'Tiendas online a la medida con catálogo, carrito, panel de administración y pagos con Wompi o Bold.', '1800000')],
    related: [['Precios', '/precios/'], ['Páginas web para salones de belleza', '/paginas-web-para-salones-de-belleza/'], ['Páginas web para restaurantes', '/paginas-web-para-restaurantes/'], ['Proyectos', '/proyectos/']],
  },

  /* ======================================================= LANDING PAGES */
  {
    slug: 'landing-pages', crumb: 'Landing pages',
    title: 'Landing Pages para Negocios en Colombia | Miguel Posada',
    description: 'Landing pages que convierten visitas en mensajes de WhatsApp: rápidas, a la medida y listas para tus campañas de Google y redes. Desde $720.000.',
    kicker: 'Páginas de aterrizaje · Campañas',
    h1: 'Landing pages que convierten visitas en clientes',
    lead: 'Una landing page es una sola página con un solo objetivo: que la persona te escriba, te llame o compre. Es la forma más rápida y económica de tener presencia en internet y la mejor página de destino para tus anuncios.',
    heroShot: 'fly', metaLine: 'Desde $720.000 · Entrega en 5 a 7 días hábiles',
    waMsg: 'Hola Miguel, quiero cotizar una landing page',
    pixelHello: 'Una página, un objetivo: que te escriban.',
    body:
      block('01', 'Para qué sirve', prose(`
        <h2>¿Cuándo necesitas una landing page?</h2>
        <ul>
          <li><strong>Vas a pautar en Google o redes</strong> y necesitas una página que convierta los clics en contactos.</li>
          <li><strong>Ofreces un solo servicio</strong> y no necesitas un sitio de varias páginas.</li>
          <li><strong>Lanzas un producto o una promoción</strong> y quieres medir cuántas personas responden.</li>
          <li><strong>Quieres empezar rápido</strong> con una página profesional y crecer después.</li>
        </ul>`)) +
      block('02', 'Qué tiene una buena landing page', cards([
        ['Un mensaje claro', 'En segundos la persona entiende qué ofreces y por qué le conviene.', L],
        ['Un botón principal', 'Todo lleva a una sola acción: escribirte por WhatsApp, llamar o comprar.', CY],
        ['Pruebas de confianza', 'Clientes, resultados, fotos reales y respuestas a las dudas más comunes.', VI],
        ['Velocidad', 'Una página lenta pierde visitas antes de cargar. Las mías cargan en segundos.', CO],
        ['Medición', 'Google Analytics mide cuántas visitas se convierten en contactos.', L],
        ['Lista para anuncios', 'Preparada para conectar tus campañas de Google Ads y redes sociales.', CY],
      ])) +
      block('03', 'Ejemplo', `${prose('<h2>Una landing page en acción</h2><p>FlyLatam Plus usa su página principal para convertir visitas en cotizaciones de viaje por WhatsApp.</p>')}<div style="margin-top:24px;max-width:760px">${shot('fly')}</div>`),
    faq: [
      ['¿Cuánto cuesta una landing page?', 'Desde <strong>$720.000</strong> en pago único.'],
      ['¿Qué diferencia hay con un sitio web?', 'Una landing page es una sola página con un objetivo. Un sitio web tiene varias páginas para presentar toda tu empresa. Si después necesitas más páginas, tu landing se puede ampliar.'],
      ['¿Sirve para Google Ads?', 'Sí. Es el tipo de página ideal para anuncios, porque mide cuántas personas te contactan desde cada campaña.'],
      FAQ_PAGO,
    ],
    schema: [service('Diseño de landing pages', 'landing-pages', 'Landing pages enfocadas en convertir visitas en mensajes de WhatsApp para negocios en Colombia.', '720000')],
    related: [['Precios', '/precios/'], ['Diseño de páginas web en Barranquilla', '/diseno-paginas-web-barranquilla/'], ['Tiendas online', '/tiendas-online/']],
  },

  /* ======================================================= RESTAURANTES */
  {
    slug: 'paginas-web-para-restaurantes', crumb: 'Páginas web para restaurantes',
    title: 'Páginas Web para Restaurantes y Cafés | Miguel Posada',
    description: 'Páginas web para restaurantes y cafeterías en Colombia: menú en línea, pedidos por WhatsApp, domicilios y pagos con Wompi. Hechas a la medida.',
    kicker: 'Restaurantes · Cafés · Domicilios',
    h1: 'Páginas web para restaurantes y cafés',
    lead: 'Tu menú en línea, pedidos que llegan listos a tu WhatsApp y pagos con Wompi. Una página web para que tus clientes vean tu carta, pidan a domicilio y te encuentren en Google.',
    heroShot: 'ratio', metaLine: 'Menú en línea · Pedidos por WhatsApp · Pagos en línea',
    waMsg: 'Hola Miguel, tengo un restaurante y quiero una página web',
    pixelHello: '¿Tienes un restaurante? Mira lo que hizo Miguel con Ratio.',
    body:
      block('01', 'Qué necesita tu restaurante', cards([
        ['Menú en línea', 'Tu carta con fotos y precios, fácil de leer en el celular y de actualizar.', L],
        ['Pedidos por WhatsApp', 'El cliente arma su pedido y te llega completo a WhatsApp, sin errores.', CY],
        ['Pagos en línea', 'Cobra con tarjeta, PSE o Nequi a través de Wompi antes de despachar.', VI],
        ['Horarios y domicilios', 'Muestra si estás abierto, tus horarios y las zonas de domicilio.', CO],
        ['Aparecer en Google', 'Optimizada para búsquedas como "café de especialidad cerca de mí".', L],
        ['Tu propia marca', 'Diseño con tu identidad, no un perfil más dentro de una app de domicilios.', CY],
      ])) +
      block('02', 'Caso real', `<div class="case" style="--c:${PROJECTS.ratio.c};border-top:0;padding-top:0">${shot('ratio')}<div class="prose">
        <h2>Ratio Coffee Baq</h2>
        <p>Cafetería de especialidad en Barranquilla. Su página muestra el menú, el horario, los domicilios y los medios de pago, y permite comprar en línea con Wompi.</p>
        <p>Está hecha sobre <a href="${PROJECTS.ordenio.url}" target="_blank" rel="noopener">Ordenio</a>, mi plataforma para convertir el WhatsApp de un negocio en una tienda.</p>
        <p><a href="${PROJECTS.ratio.url}" target="_blank" rel="noopener">Ver la página de Ratio →</a></p></div></div>`),
    faq: [
      ['¿Cuánto cuesta la página de un restaurante?', 'Una página con menú y pedidos por WhatsApp está desde <strong>$720.000</strong>. Con carrito y pagos en línea, desde <strong>$1.800.000</strong>. Escríbeme y te recomiendo la mejor opción.'],
      ['¿Puedo cambiar el menú yo mismo?', 'Sí. Puedes actualizar productos, precios y fotos cuando quieras.'],
      ['¿Tengo que pagar comisión por pedido?', 'No por la página. Si cobras en línea, la pasarela de pagos cobra su comisión por transacción.'],
      FAQ_REMOTO,
    ],
    schema: [service('Páginas web para restaurantes', 'paginas-web-para-restaurantes', 'Páginas web para restaurantes y cafés con menú en línea, pedidos por WhatsApp y pagos con Wompi.', '720000')],
    related: [['Tiendas online', '/tiendas-online/'], ['Precios', '/precios/'], ['Proyectos', '/proyectos/']],
  },

  /* ======================================================= SALONES */
  {
    slug: 'paginas-web-para-salones-de-belleza', crumb: 'Páginas web para salones de belleza',
    title: 'Páginas Web para Salones de Belleza | Miguel Posada',
    description: 'Páginas web para salones de belleza y peluquerías: agenda de citas en línea, tienda de productos y WhatsApp. Casos reales en Barranquilla.',
    kicker: 'Salones · Peluquerías · Belleza',
    h1: 'Páginas web para salones de belleza',
    lead: 'Que tus clientas agenden su cita, compren tus productos y vean tu trabajo desde el celular. Diseño páginas web para salones con agenda en línea, tienda y WhatsApp integrados.',
    heroShot: 'ami', metaLine: 'Agenda de citas · Tienda de productos · WhatsApp',
    waMsg: 'Hola Miguel, tengo un salón de belleza y quiero una página web',
    pixelHello: 'Miguel ya hizo páginas para dos salones de rizos.',
    body:
      block('01', 'Qué necesita tu salón', cards([
        ['Agenda de citas en línea', 'Tus clientas eligen servicio, día y hora sin tener que escribirte.', L],
        ['Tienda de productos', 'Vende tus productos con carrito y pagos en línea.', VI],
        ['Tus servicios y precios', 'Cada servicio explicado con fotos de tu trabajo.', CY],
        ['WhatsApp siempre a mano', 'Para preguntas rápidas antes de reservar.', CO],
        ['Varias sedes', 'Muestra cada salón con su dirección y su agenda.', L],
        ['Contenido educativo', 'Consejos de cuidado que traen visitas desde Google.', CY],
      ])) +
      block('02', 'Casos reales', `${prose('<h2>Salones que ya tienen su página</h2><p>Dos salones especialistas en cabello rizado, crespo y afro, con agenda de citas y tienda de productos.</p>')}<div style="margin-top:24px">${shotsGrid(['ema', 'ami'])}</div>`),
    faq: [
      ['¿Cuánto cuesta la página de un salón?', 'Un sitio de hasta 5 páginas está desde <strong>$1.000.000</strong> con dominio y hosting. Con tienda de productos y pagos en línea, desde <strong>$1.800.000</strong>.'],
      ['¿Se puede conectar con mi sistema de citas?', 'Sí. Puedo integrar herramientas de agenda como AgendaPro o crear un sistema de reservas a la medida.'],
      FAQ_PAGO, FAQ_REMOTO,
    ],
    schema: [service('Páginas web para salones de belleza', 'paginas-web-para-salones-de-belleza', 'Páginas web para salones de belleza con agenda de citas en línea, tienda de productos y WhatsApp.', '1000000')],
    related: [['Tiendas online', '/tiendas-online/'], ['Precios', '/precios/'], ['Proyectos', '/proyectos/']],
  },

  /* ======================================================= CONSULTORAS */
  {
    slug: 'paginas-web-para-consultoras', crumb: 'Páginas web para consultoras',
    title: 'Páginas Web para Consultoras y Empresas de Servicios | Miguel Posada',
    description: 'Páginas web para consultoras y empresas de servicios: sitio de 5 páginas con servicios, casos, formulario y WhatsApp. Desde $1.000.000 con dominio.',
    kicker: 'Consultoras · Empresas de servicios',
    h1: 'Páginas web para consultoras',
    lead: 'Un sitio web corporativo que transmite confianza, explica tus servicios con claridad y convierte visitas en reuniones. Pensado para consultoras, firmas y empresas de servicios profesionales.',
    heroShot: 'fly', metaLine: '5 páginas · Desde $1.000.000 con dominio y hosting · $800.000 si ya los tienes',
    waMsg: 'Hola Miguel, tengo una consultora y quiero cotizar una página web',
    pixelHello: 'Para consultoras, la confianza lo es todo.',
    body:
      block('01', 'Las 5 páginas', cards([
        ['Inicio', 'Tu propuesta de valor y una invitación clara a agendar una reunión.', L],
        ['Nosotros', 'Historia, equipo y lo que te diferencia de otras firmas.', CY],
        ['Servicios', 'Cada servicio explicado con su alcance y sus beneficios.', VI],
        ['Casos y clientes', 'Logos, testimonios y resultados que generan confianza.', CO],
        ['Contacto', 'Formulario, WhatsApp, correo y mapa.', L],
      ])) +
      block('02', 'Por qué importa', prose(`
        <h2>Tu página web es tu primera reunión</h2>
        <p>Antes de contactarte, un cliente potencial revisa tu página. Una página lenta, desactualizada o confusa resta credibilidad, aunque tu trabajo sea excelente.</p>
        <ul>
          <li><strong>Una página por servicio</strong> ayuda a que te encuentren en Google por cada cosa que haces.</li>
          <li><strong>Los casos reales</strong> convencen más que cualquier texto de ventas.</li>
          <li><strong>Un contacto sin fricción</strong> (formulario y WhatsApp) convierte el interés en reuniones.</li>
        </ul>
        <p>Si quieres publicar artículos para atraer clientes desde Google, también puedo agregar un blog.</p>`)),
    faq: [
      ['¿Cuánto cuesta la página de una consultora?', 'Un sitio de 5 páginas cuesta <strong>$1.000.000</strong> con dominio .com y hosting por un año, o <strong>$800.000</strong> si ya los tienes.'],
      ['¿Y si necesito más páginas?', 'Puedo agregar una página por cada servicio o un blog. Se cotiza según el contenido.'],
      ['¿Quién escribe los textos?', 'Los textos los aporta tu empresa. Si necesitas ayuda con la redacción, se cotiza aparte.'],
      FAQ_PAGO,
    ],
    schema: [service('Páginas web para consultoras', 'paginas-web-para-consultoras', 'Sitios web corporativos de 5 páginas para consultoras y empresas de servicios.', '1000000')],
    related: [['Precios', '/precios/'], ['Diseño de páginas web en Barranquilla', '/diseno-paginas-web-barranquilla/'], ['¿Qué incluye una página web profesional?', '/blog/que-incluye-una-pagina-web-profesional/']],
  },

  /* ======================================================= PROYECTOS */
  {
    slug: 'proyectos', crumb: 'Proyectos',
    title: 'Proyectos: Páginas Web y Tiendas Online | Miguel Posada',
    description: 'Portafolio de páginas web, tiendas online y web apps en producción: Ema Rizos, AmicrespA, FlyLatam Plus, Ordenio, Luminni y Ratio Coffee Baq.',
    kicker: 'Portafolio · 6 proyectos en producción',
    h1: 'Páginas web que ya están trabajando',
    lead: 'Cada proyecto se diseñó desde cero para su marca y su forma de vender. Todos están en línea: puedes visitarlos y probarlos.',
    waMsg: 'Hola Miguel, vi tus proyectos y quiero una página así',
    pixelHello: '¡Bienvenido al portafolio de Miguel!',
    body: [
      ['ema', 'E-commerce y reservas', 'Tienda y reservas para un salón especialista en rizos, crespos y afros en Barranquilla. Incluye catálogo con producto destacado, agenda de citas, mentoría y una sección para conocer al equipo.', ['React', 'Supabase', 'AgendaPro', 'Pagos en línea']],
      ['ami', 'Salón + tienda', 'Sitio de un salón especialista en cabello rizado con sedes en Barranquilla y Cali. Presenta servicios, productos, salones y contenido educativo, con recomendación personalizada para cada tipo de rizo y agenda de citas.', ['React', 'Supabase', 'Bold']],
      ['fly', 'Agencia de viajes', 'Sitio corporativo para una agencia de viajes empresariales y vacacionales. Organiza seis líneas de servicio (planes vacacionales, viajes corporativos, grupos y eventos, cruceros, vuelos chárter y gestión integral) y convierte visitas en cotizaciones por WhatsApp.', ['Diseño a la medida', 'WhatsApp', 'SEO']],
      ['ordenio', 'SaaS', 'Mi propia plataforma para que cualquier negocio convierta su WhatsApp en una tienda: catálogo, carrito y pagos en un solo link, con subdominios personalizados y pagos con Wompi.', ['SaaS', 'Subdominios', 'Wompi']],
      ['luminni', 'E-commerce editorial', 'Tienda de una casa de velas y objetos aromáticos, con colecciones presentadas como historias, manifiesto de marca y bolsa de compras.', ['E-commerce', 'Diseño editorial']],
      ['ratio', 'Cafetería · Pedidos en línea', 'Página de una cafetería de especialidad en Barranquilla, construida sobre Ordenio: menú, horarios, domicilios y compra en línea con Wompi.', ['Ordenio', 'Wompi', 'Domicilios']],
    ].map(([k, type, desc, tags], i) => `<article class="case reveal" style="--c:${PROJECTS[k].c}">${shot(k, i === 0 ? { lazy: false } : {})}<div>
        <span class="p-idx">P/0${i + 1}</span>
        <h2>${PROJECTS[k].name}</h2><p class="type">${type}</p>
        <div class="prose"><p>${desc}</p><p><a href="${PROJECTS[k].url}" target="_blank" rel="noopener">Visitar ${PROJECTS[k].dom} →</a></p></div>
        <div class="tags">${tags.map(t => `<span>${t}</span>`).join('')}</div></div></article>`).join(''),
    schema: [{ '@type': 'ItemList', name: 'Proyectos de Miguel Posada', itemListElement: Object.values(PROJECTS).map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'CreativeWork', name: p.name, url: p.url, image: `${SITE}/assets/${p.img}.webp`, creator: { '@id': `${SITE}/#person` } } })) }],
    related: [['Precios', '/precios/'], ['Tiendas online', '/tiendas-online/'], ['Diseño de páginas web en Barranquilla', '/diseno-paginas-web-barranquilla/']],
  },

  /* ======================================================= BLOG (índice) */
  {
    slug: 'blog', crumb: 'Blog',
    title: 'Blog: Guías sobre Páginas Web para Negocios | Miguel Posada',
    description: 'Guías claras para dueños de negocio: qué incluye una página web, cuánto cuesta mantenerla y qué dominio elegir.',
    kicker: 'Blog · Guías para negocios',
    h1: 'Guías sobre páginas web para tu negocio',
    lead: 'Respuestas claras a las preguntas que más me hacen los clientes antes de crear su página web.',
    pixelHello: 'Aquí Miguel responde las dudas más comunes.',
    body: block('01', 'Artículos', `<div class="posts">${[
      ['que-incluye-una-pagina-web-profesional', '¿Qué incluye una página web profesional?', 'Lo que debería traer tu página para conseguir clientes, y lo que no te deberían cobrar aparte.', L],
      ['cuanto-cuesta-mantener-una-pagina-web', '¿Cuánto cuesta mantener una página web?', 'Dominio, hosting, mantenimiento y los costos que nadie te cuenta antes de empezar.', CY],
      ['dominio-com-o-com-co', 'Dominio .com o .com.co: ¿cuál elegir?', 'Ventajas de cada uno para un negocio en Colombia y cómo decidir.', VI],
    ].map(([s, t, d, c]) => `<article class="card" style="--c:${c}"><h3><a href="/blog/${s}/">${t}</a></h3><p>${d}</p><p class="post-meta">20 nov 2026 · Miguel Posada</p><a class="more" href="/blog/${s}/">Leer →</a></article>`).join('')}</div>`),
    schema: [{ '@type': 'Blog', name: 'Blog de Miguel Posada', url: `${SITE}/blog/`, publisher: { '@id': `${SITE}/#business` } }],
    related: [['Precios', '/precios/'], ['Proyectos', '/proyectos/']],
  },

  /* ======================================================= ARTÍCULO 1 */
  {
    slug: 'blog/que-incluye-una-pagina-web-profesional', crumb: '¿Qué incluye una página web profesional?', parent: ['Blog', `${SITE}/blog/`],
    title: '¿Qué Incluye una Página Web Profesional? (Guía 2026)',
    description: 'Lista de lo que debe incluir una página web profesional para tu negocio: diseño, celular, WhatsApp, SEO, velocidad, seguridad y analítica.',
    kicker: 'Guía · 6 min de lectura', ogType: 'article', dateModified: TODAY,
    h1: '¿Qué incluye una página web profesional?',
    lead: 'Antes de pedir cotizaciones, conviene saber qué debería traer una página web profesional. Así puedes comparar propuestas con el mismo alcance y evitar cobros sorpresa.',
    metaLine: 'Por Miguel Posada · 20 de noviembre de 2026',
    waMsg: 'Hola Miguel, leí tu guía y quiero cotizar mi página web',
    body: block('01', 'Lista completa', prose(`
      <h2>1. Diseño a la medida y adaptado al celular</h2>
      <p>La mayoría de tus visitas llegan desde el teléfono. Una página profesional se diseña primero para celular y se prueba en distintos tamaños de pantalla. Además, debe reflejar tu marca: colores, logo y tono propios, no una plantilla que se ve igual a cientos de páginas.</p>
      <h2>2. Un camino claro hacia el contacto</h2>
      <p>Cada página debe llevar a una acción: escribirte por WhatsApp, llenar un formulario o comprar. Si la persona tiene que buscar cómo contactarte, se va.</p>
      <h2>3. SEO técnico desde el primer día</h2>
      <p>Para que Google entienda tu página necesitas, como mínimo:</p>
      <ul>
        <li>Un título y una descripción únicos para cada página.</li>
        <li>Encabezados ordenados con las palabras que usan tus clientes.</li>
        <li>Datos estructurados que le digan a Google qué es tu negocio.</li>
        <li>Un sitemap y el registro en Google Search Console.</li>
      </ul>
      <h2>4. Velocidad</h2>
      <p>Una página que tarda en cargar pierde visitas antes de mostrarse. Imágenes optimizadas, código limpio y un buen hosting hacen la diferencia.</p>
      <h2>5. Seguridad (HTTPS)</h2>
      <p>El candado en el navegador es obligatorio. Sin certificado de seguridad, los navegadores marcan tu página como "no segura".</p>
      <h2>6. Analítica</h2>
      <p>Google Analytics te dice cuántas personas visitan tu página y cuántas te contactan. Sin medir, no sabes si tu página está funcionando.</p>
      <h2>7. Dominio, hosting y soporte</h2>
      <p>Pregunta siempre si la propuesta incluye el dominio y el hosting, por cuánto tiempo y qué soporte recibes después de la entrega.</p>
      <h2>Lo que normalmente se cobra aparte</h2>
      <ul>
        <li>Redacción de textos y sesiones de fotos.</li>
        <li>Diseño de logo o manual de marca.</li>
        <li>Funciones especiales: reservas, tienda online o integraciones.</li>
        <li>Renovación de dominio y hosting desde el segundo año.</li>
      </ul>
      <div class="callout">Todas las páginas que hago incluyen los puntos 1 a 7. Puedes ver el detalle en mis <a href="/precios/">precios</a>.</div>`)),
    schema: [article('que-incluye-una-pagina-web-profesional', '¿Qué incluye una página web profesional?', 'Lista de lo que debe incluir una página web profesional para tu negocio.')],
    related: [['Precios', '/precios/'], ['¿Cuánto cuesta mantener una página web?', '/blog/cuanto-cuesta-mantener-una-pagina-web/'], ['Dominio .com o .com.co', '/blog/dominio-com-o-com-co/']],
  },

  /* ======================================================= ARTÍCULO 2 */
  {
    slug: 'blog/cuanto-cuesta-mantener-una-pagina-web', crumb: '¿Cuánto cuesta mantener una página web?', parent: ['Blog', `${SITE}/blog/`],
    title: '¿Cuánto Cuesta Mantener una Página Web en Colombia?',
    description: 'Los costos de mantener una página web en Colombia: dominio, hosting, certificado de seguridad y mantenimiento. Qué es obligatorio y qué es opcional.',
    kicker: 'Guía · 5 min de lectura', ogType: 'article', dateModified: TODAY,
    h1: '¿Cuánto cuesta mantener una página web?',
    lead: 'Crear la página es solo el primer paso. Estos son los costos que vienen después, cuáles son obligatorios y cuáles puedes evitar.',
    metaLine: 'Por Miguel Posada · 20 de noviembre de 2026',
    waMsg: 'Hola Miguel, leí tu guía sobre mantenimiento y tengo una pregunta',
    body: block('01', 'Costos', prose(`
      <h2>Costos obligatorios</h2>
      <h3>Dominio</h3>
      <p>Es la dirección de tu página (por ejemplo, tunegocio.com). Se renueva cada año. El precio depende de la terminación (.com, .com.co, .co) y del proveedor; en Colombia suele estar entre unos $40.000 y $150.000 al año.</p>
      <h3>Hosting</h3>
      <p>Es el servidor donde vive tu página. Para un sitio de negocio pequeño o mediano basta con un hosting compartido de buena calidad, que se paga anual o mensualmente. Un hosting muy barato suele traducirse en una página lenta.</p>
      <h3>Certificado de seguridad (HTTPS)</h3>
      <p>Hoy la mayoría de los hostings lo incluyen gratis. Si te lo cobran aparte, pregunta por qué.</p>
      <h2>Costos opcionales</h2>
      <ul>
        <li><strong>Mantenimiento mensual:</strong> actualizaciones, copias de seguridad y cambios de contenido sin tener que hacerlos tú.</li>
        <li><strong>Pasarela de pagos:</strong> si vendes en línea, Wompi o Bold cobran una comisión por cada venta, no una mensualidad.</li>
        <li><strong>Mejoras:</strong> nuevas páginas, secciones o funciones cuando tu negocio crezca.</li>
      </ul>
      <h2>¿Cómo pagar menos sin arriesgar tu página?</h2>
      <ul>
        <li>Registra el dominio a tu nombre, no al del desarrollador.</li>
        <li>Paga el dominio y el hosting por varios años si el proveedor ofrece descuento.</li>
        <li>Pide una página que puedas actualizar tú mismo para cambios simples.</li>
      </ul>
      <div class="callout">En mis planes, el sitio corporativo incluye dominio y hosting durante el primer año y 30 días de soporte. El mantenimiento después es opcional. <a href="/precios/">Ver precios</a>.</div>`)),
    schema: [article('cuanto-cuesta-mantener-una-pagina-web', '¿Cuánto cuesta mantener una página web?', 'Los costos de mantener una página web en Colombia.')],
    related: [['Precios', '/precios/'], ['¿Qué incluye una página web profesional?', '/blog/que-incluye-una-pagina-web-profesional/'], ['Dominio .com o .com.co', '/blog/dominio-com-o-com-co/']],
  },

  /* ======================================================= ARTÍCULO 3 */
  {
    slug: 'blog/dominio-com-o-com-co', crumb: 'Dominio .com o .com.co', parent: ['Blog', `${SITE}/blog/`],
    title: 'Dominio .com o .com.co: ¿Cuál Elegir para tu Negocio?',
    description: '¿.com o .com.co para tu página web? Ventajas de cada dominio para un negocio en Colombia y cómo elegir el mejor para tu marca.',
    kicker: 'Guía · 4 min de lectura', ogType: 'article', dateModified: TODAY,
    h1: 'Dominio .com o .com.co: ¿cuál elegir?',
    lead: 'Es una de las primeras decisiones al crear tu página web. No hay una respuesta única: depende de a quién le vendes y de qué nombres están disponibles.',
    metaLine: 'Por Miguel Posada · 20 de noviembre de 2026',
    waMsg: 'Hola Miguel, necesito ayuda para elegir mi dominio',
    body: block('01', 'Comparación', prose(`
      <h2>Las diferencias</h2>
      <table>
        <thead><tr><th>Dominio</th><th>Lo bueno</th><th>A tener en cuenta</th></tr></thead>
        <tbody>
          <tr><td>.com</td><td>Es el más conocido en el mundo. La gente lo escribe por costumbre.</td><td>Los nombres cortos suelen estar ocupados.</td></tr>
          <tr><td>.com.co</td><td>Le dice al cliente que eres un negocio colombiano. Suele haber más nombres disponibles.</td><td>Algunas personas olvidan el ".co" final y escriben solo ".com".</td></tr>
          <tr><td>.co</td><td>Corto y moderno.</td><td>Se confunde fácilmente con .com.</td></tr>
        </tbody>
      </table>
      <h2>Cómo decidir</h2>
      <ul>
        <li><strong>Si vendes solo en Colombia</strong>, un .com.co refuerza que eres local y es una muy buena opción.</li>
        <li><strong>Si tienes o planeas clientes en otros países</strong>, el .com es más universal.</li>
        <li><strong>Si el nombre que quieres está libre en ambos</strong>, considera comprar los dos y redirigir uno al otro, para que nadie se quede con tu nombre.</li>
      </ul>
      <h2>Más importante que la terminación</h2>
      <ul>
        <li>Que sea corto, fácil de decir y de escribir.</li>
        <li>Que no tenga guiones ni números que confundan.</li>
        <li>Que quede registrado a tu nombre.</li>
      </ul>
      <p>Para Google, la terminación no define tu posición: pesan mucho más el contenido y la calidad de tu página.</p>
      <div class="callout">En el plan de sitio corporativo el dominio .com del primer año está incluido, y te ayudo a elegir y registrar el nombre. <a href="/precios/">Ver precios</a>.</div>`)),
    schema: [article('dominio-com-o-com-co', 'Dominio .com o .com.co: ¿cuál elegir?', '¿.com o .com.co para tu página web?')],
    related: [['¿Cuánto cuesta mantener una página web?', '/blog/cuanto-cuesta-mantener-una-pagina-web/'], ['Precios', '/precios/']],
  },
];
