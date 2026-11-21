// Traducción de la portada: build.mjs aplica cada par sobre index.html y falla si alguno ya no existe.
import { SLUGS, waLink } from './layout.mjs';

export const HOME_PAIRS = [
  ['<title>Diseño de Páginas Web en Colombia | Miguel Posada</title>', '<title>Web Design &amp; Development | Miguel Posada</title>'],
  ['content="Diseño de páginas web, tiendas online y landing pages rápidas y optimizadas para Google. Desde Barranquilla para clientes en todo el mundo."', 'content="Fast, custom websites, online stores and landing pages optimized for Google. Systems Engineer in Colombia working with clients worldwide."'],
  ['<meta property="og:locale" content="es_CO">', '<meta property="og:locale" content="en_US">'],
  ['<meta property="og:url" content="https://www.miguelposada.dev/">', '<meta property="og:url" content="https://www.miguelposada.dev/en/">'],
  ['<link rel="canonical" href="https://www.miguelposada.dev/">', '<link rel="canonical" href="https://www.miguelposada.dev/en/">'],
  ['content="Diseño de Páginas Web en Colombia | Miguel Posada"', 'content="Web Design &amp; Development | Miguel Posada"'],
  ['content="Sitios web, tiendas online y web apps que trabajan tan duro como tu negocio. Rápidos, modernos y optimizados para Google."', 'content="Websites, online stores and web apps that work as hard as your business. Fast, modern and optimized for Google."'],
  ['content="Sitios web, tiendas online y web apps que trabajan tan duro como tu negocio."', 'content="Websites, online stores and web apps that work as hard as your business."'],
  ['content="Miguel Posada — Creo sitios web que trabajan tan duro como tu negocio"', 'content="Miguel Posada — I build websites that work as hard as your business"'],
  ['>Saltar al contenido<', '>Skip to content<'],
  ['alt="Logo de Miguel Posada"', 'alt="Miguel Posada logo"'],
  ['aria-label="Abrir menú"', 'aria-label="Open menu"'],
  ['<a href="#trabajo">Trabajo</a>', '<a href="#trabajo">Work</a>'],
  ['<a href="#servicios">Servicios</a>', '<a href="#servicios">Services</a>'],
  ['<a href="#sobre-mi">Sobre mí</a>', '<a href="#sobre-mi">About</a>'],
  ['>Precios</a>\n      <a href="/blog/">', '>Pricing</a>\n      <a href="/blog/">'],
  ['<a href="#contacto">Contacto</a>', '<a href="#contacto">Contact</a>'],
  ['<p class="header-role">Ingeniero de Sistemas <i>·</i> Desarrollador Web</p>', '<p class="header-role">Systems Engineer <i>·</i> Web Developer</p>'],
  ['aria-label="Diseño de páginas web en Colombia: creo sitios web que trabajan tan duro como tu negocio."', 'aria-label="Web design and development: I build websites that work as hard as your business."'],
  ['<span class="h1-kicker">Diseño de páginas web en Colombia</span>', '<span class="h1-kicker">Web design and development</span>'],
  ['<span>CREO SITIOS WEB</span>', '<span>I BUILD WEBSITES</span>'],
  ['<span>QUE TRABAJAN TAN</span>', '<span>THAT WORK AS HARD</span>'],
  ['<span>DURO COMO TU NEGOCIO.</span>', '<span>AS YOUR BUSINESS.</span>'],
  ['Ingeniero de Sistemas en Barranquilla <span class="dot d-violet"></span>Páginas web y tiendas online <span class="dot d-coral"></span>Clientes en todo el mundo', 'Systems Engineer in Colombia <span class="dot d-violet"></span>Websites and online stores <span class="dot d-coral"></span>Clients worldwide'],
  ['Ver proyectos <svg', 'See projects <svg'],
  ['magnetic">Hablemos</a>', 'magnetic">Let’s talk</a>'],
  ['Disponible para proyectos', 'Available for projects'],
  ['ver el sitio de Ratio Coffee Baq', 'see the Ratio Coffee Baq website'],
  ['alt="Sitio web de Ratio Coffee Baq, cafetería de especialidad en Barranquilla"', 'alt="Ratio Coffee Baq website, a specialty coffee shop in Barranquilla"'],
  ['data-label="BASE DATOS"', 'data-label="DATABASE"'],
  ['Proyectos <i>/</i> Páginas web en producción', 'Projects <i>/</i> Live websites'],
  ['07 en producción · 01 en desarrollo', '07 live · 01 in development'],
  ['— visitar ', '— visit '],
  ['Visitar sitio', 'Visit site'],
  ['alt="Página de inicio de Lusarte, tienda de velas e insumos"', 'alt="Lusarte home page, a store for candles and candle-making supplies"'],
  ['alt="Página de inicio de Ema Rizos"', 'alt="Ema Rizos home page"'],
  ['alt="Página de inicio de FlyLatam Plus"', 'alt="FlyLatam Plus home page"'],
  ['alt="Página de inicio de AmicrespA"', 'alt="AmicrespA home page"'],
  ['alt="Página de inicio de Ordenio"', 'alt="Ordenio home page"'],
  ['alt="Página de inicio de Luminni"', 'alt="Luminni home page"'],
  ['<small>Agencia de viajes</small>', '<small>Travel agency</small>'],
  ['<small>Salón + tienda</small>', '<small>Salon + store</small>'],
  ['<small>E-commerce editorial</small>', '<small>Editorial e-commerce</small>'],
  ['<small>Salón de rizos</small>', '<small>Curly hair salon</small>'],
  ['Tienda y reservas para un salón especialista en rizos, crespos y afros. React + Supabase + AgendaPro + pagos.', 'Store and bookings for a salon specialized in curly, coily and afro hair. React + Supabase + AgendaPro + payments.'],
  ['Sitio corporativo para viajes empresariales y vacacionales, con servicios, destinos y cotización directa por WhatsApp.', 'Business site for corporate and leisure travel, with services, destinations and direct quotes over WhatsApp.'],
  ['Tienda online con recomendación personalizada para cabello rizado y agenda de citas. React + Supabase + Bold.', 'Online store with personalized recommendations for curly hair and appointment booking. React + Supabase + Bold.'],
  ['Convierte el WhatsApp de cualquier negocio en una tienda: catálogo, carrito y pagos en un solo link. Subdominios personalizados + pagos con Wompi.', 'Turns any business’s WhatsApp into a store: catalog, cart and payments in a single link. Custom subdomains + Wompi payments.'],
  ['Tienda editorial para una casa de velas y objetos aromáticos, con colecciones contadas como historias.', 'Editorial store for a house of candles and scented objects, with collections told as stories.'],
  ['Tienda online de insumos para hacer velas (ceras, fragancias, moldes y recipientes) y velas artesanales hechas a mano en Barranquilla, con envíos a toda Colombia.', 'Online store for candle-making supplies (waxes, fragrances, molds and containers) and handmade candles from Barranquilla, shipping across Colombia.'],
  ['<span>Próximamente</span>', '<span>Coming soon</span>'],
  ['</i>En desarrollo</span>', '</i>In development</span>'],
  ['alt="Avance del sitio web de Marea Rizada, salón especializado en rizos, en desarrollo"', 'alt="Preview of the Marea Rizada website, a curly hair salon, in development"'],
  ['Sitio para un salón especializado en rizos, con diagnóstico, corte rizo a rizo y rutinas para cada patrón, del 2A al 4C. Lo estoy construyendo ahora mismo.', 'Website for a salon specialized in curly hair, with diagnosis, curl-by-curl cuts and routines for each pattern, from 2A to 4C. I’m building it right now.'],
  ['En desarrollo · Próximamente', 'In development · Coming soon'],
  ['Servicios <i>/</i> Páginas web y tiendas online', 'Services <i>/</i> Websites and online stores'],
  ['<h3>Diseño web</h3>', '<h3>Web design</h3>'],
  ['Páginas web corporativas y landing pages modernas, rápidas y pensadas para que tus visitas te escriban.', 'Modern, fast business websites and landing pages built to get your visitors to reach out.'],
  ['>Diseño de páginas web →<', '>Web design →<'],
  ['<h3>Desarrollo</h3>', '<h3>Development</h3>'],
  ['Frontend y backend con tecnologías modernas: reservas, catálogos, paneles y web apps a la medida.', 'Frontend and backend with modern technology: bookings, catalogs, dashboards and custom web apps.'],
  ['Tiendas online con carrito, inventario y pagos en línea con Wompi o Bold, listas para vender en Colombia.', 'Online stores with cart, inventory and online payments through Wompi or Bold, ready to sell.'],
  ['>Tiendas online →<', '>Online stores →<'],
  ['<h3>Mantenimiento</h3>', '<h3>Maintenance</h3>'],
  ['Soporte, actualizaciones, dominio y hosting para que tu página web siempre funcione.', 'Support, updates, domain and hosting to keep your website running.'],
  ['>Ver precios →<', '>See pricing →<'],
  ['Ingeniería <i>/</i> Stack y proceso', 'Engineering <i>/</i> Stack and process'],
  ['<h2>BASES <br>TÉCNICAS <br><em>SÓLIDAS.</em></h2>', '<h2>SOLID <br>TECHNICAL <br><em>FOUNDATIONS.</em></h2>'],
  ['Código limpio, stack moderno y arquitectura escalable. Hecho para durar.', 'Clean code, modern stack and scalable architecture. Built to last.'],
  ['--c:var(--lime)">Negocio<', '--c:var(--lime)">Business<'],
  ['--c:var(--violet)">Código<', '--c:var(--violet)">Code<'],
  ['--c:var(--coral)">Despliegue<', '--c:var(--coral)">Deployment<'],
  ['<span class="c-cyan">Pagos</span>', '<span class="c-cyan">Payments</span>'],
  ['src/lib/sitio.ts', 'src/lib/site.ts'],
  ['Stack moderno.<br>Arquitectura limpia.<br>Resultados reales.', 'Modern stack.<br>Clean architecture.<br>Real results.'],
  ['Proceso <i>/</i> Cómo creo tu página web', 'Process <i>/</i> How I build your website'],
  ['<h3>Descubrir</h3><p>Hablamos de tus objetivos, tu público y lo que necesitas.</p>', '<h3>Discover</h3><p>We talk about your goals, audience and requirements.</p>'],
  ['<h3>Diseñar</h3><p>Creo el plan visual y el flujo de experiencia de usuario.</p>', '<h3>Design</h3><p>I create a visual plan and user experience flow.</p>'],
  ['<h3>Construir</h3><p>Desarrollo, pruebo y optimizo tu sitio.</p>', '<h3>Build</h3><p>I develop, test and optimize your website.</p>'],
  ['<h3>Lanzar</h3><p>Salimos en vivo y me aseguro de que todo funcione perfecto.</p>', '<h3>Launch</h3><p>We go live and I make sure everything runs perfectly.</p>'],
  ['Preguntas frecuentes <i>/</i> Páginas web', 'FAQ <i>/</i> Websites'],
  ['<h2 class="cta-title reveal">¿TIENES UN <br>PROYECTO <br>EN MENTE?</h2>', '<h2 class="cta-title reveal">HAVE A <br>PROJECT <br>IN MIND?</h2>'],
  ['data-scramble>CONSTRUYÁMOSLO.<', 'data-scramble>LET’S BUILD IT.<'],
  ['<p>Cuéntame tu idea y te respondo pronto.</p>', '<p>Tell me about your idea and I’ll get back to you soon.</p>'],
  ['Trabajo 100% en línea con clientes en todo el mundo.', 'I work 100% online with clients worldwide.'],
  ['Escríbeme <svg', 'Message me <svg'],
  ['<li>Sitios web</li><li>E-commerce</li><li>Web apps</li><li>Soluciones a medida</li>', '<li>Websites</li><li>E-commerce</li><li>Web apps</li><li>Custom solutions</li>'],
  ['aria-label="Páginas del sitio"', 'aria-label="Site pages"'],
  ['<b>Servicios</b><a href="/diseno-paginas-web-barranquilla/">Diseño de páginas web en Barranquilla</a><a href="/tiendas-online/">Tiendas online</a><a href="/landing-pages/">Landing pages</a><a href="/precios/">Precios</a>', '<b>Services</b><a href="/diseno-paginas-web-barranquilla/">Web design in Barranquilla</a><a href="/tiendas-online/">Online stores</a><a href="/landing-pages/">Landing pages</a><a href="/precios/">Pricing</a>'],
  ['<b>Por negocio</b><a href="/paginas-web-para-restaurantes/">Restaurantes y cafés</a><a href="/paginas-web-para-salones-de-belleza/">Salones de belleza</a><a href="/paginas-web-para-consultoras/">Consultoras</a>', '<b>By business</b><a href="/paginas-web-para-restaurantes/">Restaurants and cafés</a><a href="/paginas-web-para-salones-de-belleza/">Beauty salons</a><a href="/paginas-web-para-consultoras/">Consulting firms</a>'],
  ['<b>Recursos</b><a href="/proyectos/">Proyectos</a><a href="/blog/">Blog</a><a href="/blog/que-incluye-una-pagina-web-profesional/">¿Qué incluye una página web?</a><a href="/blog/dominio-com-o-com-co/">¿.com o .com.co?</a>', '<b>Resources</b><a href="/proyectos/">Projects</a><a href="/blog/">Blog</a><a href="/blog/que-incluye-una-pagina-web-profesional/">What should a website include?</a><a href="/blog/dominio-com-o-com-co/">.com or .com.co?</a>'],
  ['— Ingeniero de Sistemas &amp; Desarrollador Web', '— Systems Engineer &amp; Web Developer'],
];

export const HOME_FAQ_EN = [
  ['How much does a website cost?', 'A landing page starts at <strong>COP 720,000</strong>. A business website with up to 5 pages starts at <strong>COP 1,000,000</strong> including a .com domain and hosting for one year, or <strong>COP 800,000</strong> if you already have them. An online store starts at <strong>COP 1,800,000</strong>. Web apps are quoted per project. <a href="/en/pricing/">See all pricing</a>.'],
  ['How long does it take?', 'A landing page or a site with up to 5 pages is ready in 5 to 7 business days. An online store takes 7 to 14 business days. The time counts from when I receive the deposit and your content (copy, logo and images).'],
  ['Are domain and hosting included?', 'Yes. Plans with a domain include a .com and hosting for the first year, and I handle the purchase and setup. From the second year, renewal is paid separately.'],
  ['How does payment work?', 'You pay 50% to get started and the remaining 50% when the site is finished and published.'],
  ['Do you only work in Barranquilla?', 'I’m based in Barranquilla, Colombia, but I work 100% online with clients worldwide. The whole process runs over WhatsApp and video calls.'],
  ['Will my site show up on Google?', 'Every site ships with technical SEO: fast loading, optimized titles and descriptions, structured data, a sitemap and Google Search Console setup. Reaching the top results for competitive searches takes time and content, and I’ll explain how to get there.'],
  ['What happens after delivery?', 'You get 30 days of support for adjustments and questions. After that you can hire optional monthly maintenance for updates and improvements.'],
];

export const HOME_PIXEL_EN = [
  { sel: '.hero', x: .9, pose: 'wave', mood: 'happy', say: 'Hi! I’m Pixel, Miguel’s assistant. Scroll with me ↓' },
  { sel: '#trabajo', x: .1, pose: 'point', mood: 'excited', say: 'These sites are already live, and Marea Rizada is on the way.' },
  { sel: '#servicios', x: .9, pose: 'type', mood: 'happy', say: 'Design, code, online stores and support. All in one place.' },
  { sel: '#sobre-mi', x: .1, pose: 'think', mood: 'curious', say: 'Clean, scalable code? That’s how Miguel works.' },
  { sel: '.process', x: .9, pose: 'idle', mood: 'happy', say: 'Four steps and your website is live.' },
  { sel: '#preguntas', x: .1, pose: 'think', mood: 'curious', say: 'Questions about price or timing? Answers are right here.' },
  { sel: '#contacto', x: .86, pose: 'wave', mood: 'excited', say: '50% to start, 50% on delivery. Message Miguel!', party: true },
];

export function homeToEnglish(source, assertPair) {
  let h = source;
  for (const [es, en] of HOME_PAIRS) { assertPair(h.includes(es), es); h = h.split(es).join(en); }

  // preguntas frecuentes
  const faq = HOME_FAQ_EN.map(([q, a]) => `<details class="faq-item reveal"><summary>${q}</summary><div class="faq-a"><p>${a}</p></div></details>`).join('\n');
  h = h.replace(/(<div class="faq-list">)[\s\S]*?(<\/div>\s*<span class="rule rule-bottom"><\/span>\s*<\/section>\s*<!-- =+ 07 CTA)/, `$1${faq}$2`);

  // enlaces y recursos
  for (const es of Object.keys(SLUGS).sort((a, b) => b.length - a.length)) h = h.split(`href="/${es}/"`).join(`href="/en/${SLUGS[es]}/"`);
  h = h.replace(/href="#top" class="logo"/, 'href="/en/" class="logo"');
  h = h.replace(/(["\s,])assets\//g, '$1/assets/');
  h = h.replace(/https:\/\/wa\.me\/573003117197\?text=[^"]+/g, waLink('Hi Miguel, I saw your website and would like a quote'));
  h = h.replace('lang="es" data-alt="/en/"', 'lang="en" data-alt="/"');
  h = h.replace(/(class="lang-switch" href=")\/en\/(" hreflang=")en(" lang=")en(" aria-label=")[^"]*(" data-lang-switch=")en(">)EN/, '$1/$2es$3es$4Ver esta página en español$5es$6ES');

  // datos estructurados
  h = h.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, (_, a, json, b) => {
    const d = JSON.parse(json);
    for (const n of d['@graph']) {
      if (n['@type'] === 'WebSite') n.inLanguage = 'en';
      if (n['@type'] === 'Person') { n.jobTitle = 'Systems Engineer and Web Developer'; n.knowsAbout = ['Web design', 'Web development', 'E-commerce', 'Technical SEO', 'React', 'TypeScript', 'Supabase']; }
      if (n['@type'] === 'ProfessionalService') {
        n.name = 'Miguel Posada — Web Design and Development';
        n.description = 'Website, online store and web app design and development for businesses.';
        n.hasOfferCatalog = { '@type': 'OfferCatalog', name: 'Web development services', itemListElement: [
          ['Website design', 'web-design-barranquilla', 'Fast, custom business websites optimized for Google.'],
          ['Landing pages', 'landing-pages', 'Landing pages focused on turning visits into WhatsApp messages.'],
          ['Online stores (E-commerce)', 'online-stores', 'Stores integrated with payment gateways like Wompi and Bold, with inventory management.'],
        ].map(([name, s, description]) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name, url: `https://www.miguelposada.dev/en/${s}/`, description } })) };
      }
      if (n['@type'] === 'ItemList') n.name = 'Selected projects';
      if (n['@type'] === 'FAQPage') {
        n['@id'] = 'https://www.miguelposada.dev/en/#faq';
        n.mainEntity = HOME_FAQ_EN.map(([q, x]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: x.replace(/<[^>]+>/g, '') } }));
      }
    }
    return a + JSON.stringify(d) + b;
  });
  return h.replace('</head>', `<script>window.PIXEL_SECTIONS=${JSON.stringify(HOME_PIXEL_EN)}</script>\n</head>`);
}
