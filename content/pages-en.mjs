// English version of the inner pages. Each entry points to its Spanish page through esSlug.
import { SITE, SLUGS, block, cards, shotsGrid, shot, wipShot, plansHtml, PLANS_EN, PROJECTS, setLang } from './layout.mjs';

setLang('en');
const TODAY = '2026-11-21';
const L = 'var(--lime)', CY = 'var(--cyan)', VI = 'var(--violet)', CO = 'var(--coral)';
const en = s => `/en/${SLUGS[s]}/`;
const P = { pricing: en('precios'), baq: en('diseno-paginas-web-barranquilla'), stores: en('tiendas-online'), landing: en('landing-pages'), food: en('paginas-web-para-restaurantes'), beauty: en('paginas-web-para-salones-de-belleza'), consult: en('paginas-web-para-consultoras'), projects: en('proyectos'), blog: en('blog'), includes: en('blog/que-incluye-una-pagina-web-profesional'), upkeep: en('blog/cuanto-cuesta-mantener-una-pagina-web'), domain: en('blog/dominio-com-o-com-co') };
const service = (name, path, desc, price) => ({
  '@type': 'Service', name, serviceType: name, url: SITE + path, description: desc,
  provider: { '@id': `${SITE}/#business` }, areaServed: 'Worldwide',
  ...(price ? { offers: { '@type': 'Offer', priceCurrency: 'COP', price, description: 'Starting price' } } : {}),
});
const article = (path, headline, description) => ({
  '@type': 'BlogPosting', headline, description, url: SITE + path, inLanguage: 'en',
  datePublished: TODAY, dateModified: TODAY, image: `${SITE}/og-image.jpg`,
  author: { '@id': `${SITE}/#person` }, publisher: { '@id': `${SITE}/#business` }, mainEntityOfPage: SITE + path,
});
const prose = html => `<div class="prose reveal">${html}</div>`;
const hero = key => shot(key, { lazy: false, sizes: '(max-width: 900px) 92vw, 540px' });

const FAQ_PRICE = ['How much does a website cost?', 'It depends on the type of site. A landing page starts at <strong>COP 720,000</strong>, a business website with up to 5 pages at <strong>COP 1,000,000</strong> including domain and hosting for one year, and an online store at <strong>COP 1,800,000</strong>. Web apps are quoted per project.'];
const FAQ_PAY = ['How does payment work?', 'You pay 50% to get started and the remaining 50% when the site is finished and published.'];
const FAQ_REMOTE = ['Do you work with clients outside Barranquilla?', 'Yes. I work 100% online with clients worldwide. The whole process runs over WhatsApp and video calls.'];
const BLOG_PARENT = ['Blog', `${SITE}${P.blog}`];
const BY = 'By Miguel Posada · November 21, 2026';

export const PAGES_EN = [
  {
    lang: 'en', esSlug: 'precios', crumb: 'Pricing',
    title: 'Website Design Pricing | Miguel Posada',
    description: 'Clear website pricing in Colombian pesos: landing pages from COP 720,000, business sites from COP 1,000,000 and online stores from COP 1,800,000.',
    kicker: '2026 pricing · Colombian pesos (COP)',
    h1: 'How much does a website cost?',
    lead: 'Clear prices with no fine print. Pick the type of site your business needs: every plan includes custom design, a mobile version, WhatsApp and technical SEO to show up on Google.',
    metaLine: '50% to start, 50% on delivery · Updated: November 2026',
    waMsg: 'Hi Miguel, I saw your pricing and would like a quote for my website',
    pixelHello: 'Here are Miguel’s prices. No surprises.',
    body:
      block('01', 'Plans', plansHtml()) +
      block('02', 'What affects the price', prose(`
        <h2>Why does one website cost more than another?</h2>
        <p>The price of a website mostly depends on how much work goes into it. These are the factors that matter most:</p>
        <ul>
          <li><strong>Number of pages.</strong> A landing page is a single page focused on one action. A business website has several: home, about, services, case studies and contact.</li>
          <li><strong>Features.</strong> A catalog with a cart and online payments, appointment booking or an admin panel all add development time.</li>
          <li><strong>Custom design or template.</strong> All my sites are designed from scratch around your brand. I don’t use purchased templates.</li>
          <li><strong>Content.</strong> If you already have copy, a logo and photos, the project moves faster. Help with those is quoted separately.</li>
          <li><strong>Domain and hosting.</strong> The business plan includes them for the first year. If you already have them, the price goes down.</li>
        </ul>
        <div class="callout">Prices are in Colombian pesos (COP). USD amounts are approximate. If you’re outside Colombia, message me and I’ll send your final quote in USD.</div>`)) +
      block('03', 'What’s included', cards([
        ['Custom design', 'Your site is designed from scratch with your brand’s colors, logo and tone.', L],
        ['Built for mobile', 'Most visits come from phones. Every page is tested on phone, tablet and desktop.', CY],
        ['WhatsApp and forms', 'Buttons that open WhatsApp with a ready-to-send message, plus contact forms that reach your inbox.', VI],
        ['Technical SEO', 'Titles, descriptions, structured data, sitemap and Google Search Console setup.', CO],
        ['Speed', 'Optimized images and clean code so your site loads in seconds.', L],
        ['Analytics', 'Google Analytics set up to measure visits and how many people contact you.', CY],
      ])) +
      block('04', 'Costs after delivery', prose(`
        <h2>Are there monthly fees?</h2>
        <p>Not necessarily. After delivery there are only two possible costs:</p>
        <ul>
          <li><strong>Domain and hosting renewal</strong> from the second year, paid once a year.</li>
          <li><strong>Optional maintenance</strong> if you want me to handle updates, changes and improvements each month.</li>
        </ul>
        <p>The first 30 days after delivery include support for adjustments and questions. To learn more, read <a href="${P.upkeep}">how much it costs to maintain a website</a>.</p>`)),
    faq: [
      FAQ_PRICE,
      ['Does the price include domain and hosting?', 'The business website plan includes a .com domain and hosting for the first year. If you already have them, the same site costs <strong>COP 800,000</strong>.'],
      FAQ_PAY,
      ['How long does it take?', 'A landing page or a site with up to 5 pages takes 5 to 7 business days. An online store takes 7 to 14 business days, counted from the deposit and receipt of your content.'],
      ['What if I need more pages?', 'Each extra page is quoted based on its content. Message me with what you need and I’ll give you an exact price.'],
      ['Does the payment gateway have a cost?', 'Gateways like Wompi or Bold charge a fee on each sale, paid directly to them. Integrating them into your store is included in the online store plan.'],
    ],
    schema: [{ '@type': 'OfferCatalog', name: 'Website plans', itemListElement: PLANS_EN.filter(p => /\d/.test(p.price)).map(p => ({ '@type': 'Offer', name: p.name, priceCurrency: 'COP', price: p.price.replace(/\D/g, ''), description: p.for, seller: { '@id': `${SITE}/#business` } })) }],
    related: [['Web design in Barranquilla', P.baq], ['Online stores', P.stores], ['Landing pages', P.landing], ['What should a professional website include?', P.includes]],
  },
  {
    lang: 'en', esSlug: 'diseno-paginas-web-barranquilla', crumb: 'Web design in Barranquilla',
    title: 'Web Design in Barranquilla, Colombia | Miguel Posada',
    description: 'Web design in Barranquilla for businesses and companies: fast, custom websites optimized for Google. Starting at COP 720,000.',
    kicker: 'Barranquilla · Colombia · Clients worldwide',
    h1: 'Web design in Barranquilla',
    lead: 'I’m Miguel Posada, a Systems Engineer based in Barranquilla. I design and build custom websites for clients worldwide: fast, easy to use on a phone and made to get your visitors to reach out.',
    heroShot: 'ratio', heroHtml: hero('ratio'), metaLine: 'From COP 720,000 · Delivered in 5 to 7 business days',
    waMsg: 'Hi Miguel, I’d like a quote for a website',
    pixelHello: 'Hi there! Miguel is based right here in Barranquilla.',
    body:
      block('01', 'Why work with me', cards([
        ['Direct contact', 'You always talk to me, with no middlemen or account managers. I reply on WhatsApp.', L],
        ['Original design', 'Every site is designed from scratch for your business. No generic templates.', CY],
        ['Fast and mobile-ready', 'Optimized code that loads in seconds and looks right on any phone.', VI],
        ['Ready for Google', 'Technical SEO included: titles, structured data, sitemap and Search Console.', CO],
        ['Payments and WhatsApp', 'I integrate WhatsApp, forms and online payments with Wompi or Bold.', L],
        ['Clear pricing', 'Plans from COP 720,000, with 50% to start and 50% on delivery.', CY, ['See pricing', P.pricing]],
      ])) +
      block('02', 'Barranquilla businesses', `${prose(`
        <h2>Websites made in Barranquilla</h2>
        <p>These are some of the local businesses that already have their website with me. They’re all live, so you can visit them:</p>`)}
        <div style="margin-top:24px">${shotsGrid(['ema', 'ami', 'ratio', 'lusarte'])}</div>`) +
      block('03', 'Services', cards([
        ['Business website', 'Up to 5 pages to present your company, services and case studies.', L, ['See price', P.pricing]],
        ['Online store', 'Catalog, cart and online payments to sell your products.', VI, ['Online stores', P.stores]],
        ['Landing page', 'One page focused on one action, ideal for Google or social media campaigns.', CY, ['Landing pages', P.landing]],
      ])) +
      block('04', 'How we work', prose(`
        <h2>From idea to published website</h2>
        <ol>
          <li><strong>Discover.</strong> We talk about your business, your customers and what you want the site to achieve.</li>
          <li><strong>Design.</strong> I show you the visual proposal and we refine it until you love it.</li>
          <li><strong>Build.</strong> I develop the site, test it on phone and desktop, and optimize it for Google.</li>
          <li><strong>Launch.</strong> I publish it on your domain, set up Google Analytics and show you how it works.</li>
        </ol>
        <p>If you’re in Barranquilla and prefer to meet in person, we can arrange it. From anywhere else, everything works just as well over video call.</p>`)),
    faq: [FAQ_PRICE,
      ['How long does a website take?', '5 to 7 business days for a landing page or a site with up to 5 pages, and 7 to 14 for an online store.'],
      ['Can you help with domain and hosting?', 'Yes. The business plan includes a .com domain and hosting for the first year, and I take care of buying and configuring them.'],
      FAQ_PAY, FAQ_REMOTE],
    schema: [service('Web design in Barranquilla', P.baq, 'Custom website design and development for clients in Barranquilla and worldwide.', '720000')],
    related: [['Pricing', P.pricing], ['Online stores', P.stores], ['Websites for restaurants', P.food], ['Projects', P.projects]],
  },
  {
    lang: 'en', esSlug: 'tiendas-online', crumb: 'Online stores',
    title: 'Online Stores with Wompi and Bold | Miguel Posada',
    description: 'I build online stores for Colombia with catalog, cart and payments through Wompi or Bold. Custom, fast and ready to sell. From COP 1,800,000.',
    kicker: 'E-commerce · Online payments',
    h1: 'Online stores ready to sell in Colombia',
    lead: 'Your online store with catalog, cart, admin panel and payments through Wompi or Bold. Designed for your brand, fast on mobile and connected to WhatsApp so you never miss a sale.',
    heroShot: 'ema', heroHtml: hero('ema'), metaLine: 'From COP 1,800,000 · Delivered in 7 to 14 business days',
    waMsg: 'Hi Miguel, I’d like a quote for an online store',
    pixelHello: 'Want to sell online? Check out these stores.',
    body:
      block('01', 'What your store includes', cards([
        ['Product catalog', 'Photos, prices, variants and categories you can update yourself.', L],
        ['Cart and payments', 'Card, PSE and Nequi payments through Colombian gateways like Wompi or Bold.', VI],
        ['Admin panel', 'Manage orders, inventory, coupons and discounts from one place.', CY],
        ['WhatsApp built in', 'Customers can ask you questions before buying without leaving the store.', CO],
        ['Fast and secure', 'Loads in seconds, with a security certificate (HTTPS) and optimized code.', L],
        ['Ready for Google', 'Every product with its own title, description and structured data.', CY],
      ])) +
      block('02', 'Stores already selling', `${prose('<h2>Online stores I’ve designed</h2><p>These stores are already selling in Colombia. Each has its own design, based on its brand and how it sells.</p>')}<div style="margin-top:24px">${shotsGrid(['ema', 'luminni', 'lusarte', 'ordenio'])}</div>`) +
      block('03', 'Online store or WhatsApp catalog', prose(`
        <h2>Which one fits you best?</h2>
        <table>
          <thead><tr><th>Option</th><th>Best for</th><th>How you get paid</th></tr></thead>
          <tbody>
            <tr><td>Full online store</td><td>Brands with many products that want to charge online</td><td>Payment gateway (Wompi or Bold)</td></tr>
            <tr><td>Catalog with WhatsApp orders</td><td>Restaurants and businesses that already sell over chat</td><td>WhatsApp or online payment with <a href="${PROJECTS.ordenio.url}" target="_blank" rel="noopener">Ordenio</a></td></tr>
          </tbody>
        </table>
        <p>Not sure which you need? Message me and I’ll recommend the best option for your business.</p>`)),
    faq: [
      ['How much does an online store cost?', 'From <strong>COP 1,800,000</strong> as a one-time payment. The fee on each sale is charged directly by the payment gateway.'],
      ['Which payment gateways do you use?', 'I work with Colombian gateways like Wompi and Bold, which accept cards, PSE and other local payment methods.'],
      ['Can I add and edit my products?', 'Yes. Your store includes an admin panel to add products, change prices and see orders.'],
      ['How long does it take?', '7 to 14 business days, depending on the number of products and features.'],
      FAQ_PAY],
    schema: [service('Online store development', P.stores, 'Custom online stores with catalog, cart, admin panel and payments through Wompi or Bold.', '1800000')],
    related: [['Pricing', P.pricing], ['Websites for beauty salons', P.beauty], ['Websites for restaurants', P.food], ['Projects', P.projects]],
  },
  {
    lang: 'en', esSlug: 'landing-pages', crumb: 'Landing pages',
    title: 'Landing Pages for Businesses | Miguel Posada',
    description: 'Landing pages that turn visits into WhatsApp messages: fast, custom and ready for your Google and social media campaigns. From COP 720,000.',
    kicker: 'Landing pages · Campaigns',
    h1: 'Landing pages that turn visitors into customers',
    lead: 'A landing page is a single page with a single goal: getting someone to message you, call you or buy. It’s the fastest, most affordable way to get online and the best destination for your ads.',
    heroShot: 'fly', heroHtml: hero('fly'), metaLine: 'From COP 720,000 · Delivered in 5 to 7 business days',
    waMsg: 'Hi Miguel, I’d like a quote for a landing page',
    pixelHello: 'One page, one goal: getting people to reach out.',
    body:
      block('01', 'What it’s for', prose(`
        <h2>When do you need a landing page?</h2>
        <ul>
          <li><strong>You’re advertising on Google or social media</strong> and need a page that turns clicks into contacts.</li>
          <li><strong>You offer one service</strong> and don’t need a multi-page site.</li>
          <li><strong>You’re launching a product or promotion</strong> and want to measure how many people respond.</li>
          <li><strong>You want to start fast</strong> with a professional page and grow later.</li>
        </ul>`)) +
      block('02', 'What makes a good landing page', cards([
        ['A clear message', 'In seconds, people understand what you offer and why it matters to them.', L],
        ['One main button', 'Everything leads to one action: message you on WhatsApp, call or buy.', CY],
        ['Proof you can trust', 'Clients, results, real photos and answers to common questions.', VI],
        ['Speed', 'A slow page loses visitors before it even loads. Mine load in seconds.', CO],
        ['Measurement', 'Google Analytics tracks how many visits turn into contacts.', L],
        ['Ready for ads', 'Prepared to connect your Google Ads and social media campaigns.', CY],
      ])) +
      block('03', 'Example', `${prose('<h2>A landing page in action</h2><p>FlyLatam Plus uses its main page to turn visits into travel quotes over WhatsApp.</p>')}<div style="margin-top:24px;max-width:760px">${shot('fly')}</div>`),
    faq: [
      ['How much does a landing page cost?', 'From <strong>COP 720,000</strong> as a one-time payment.'],
      ['How is it different from a website?', 'A landing page is one page with one goal. A website has several pages to present your whole company. If you need more pages later, your landing page can be expanded.'],
      ['Does it work for Google Ads?', 'Yes. It’s the ideal page type for ads, because it measures how many people contact you from each campaign.'],
      FAQ_PAY],
    schema: [service('Landing page design', P.landing, 'Landing pages focused on turning visits into WhatsApp messages.', '720000')],
    related: [['Pricing', P.pricing], ['Web design in Barranquilla', P.baq], ['Online stores', P.stores]],
  },
  {
    lang: 'en', esSlug: 'paginas-web-para-restaurantes', crumb: 'Websites for restaurants',
    title: 'Websites for Restaurants and Cafés | Miguel Posada',
    description: 'Websites for restaurants and cafés: online menu, WhatsApp orders, delivery and payments with Wompi. Custom-built for your brand.',
    kicker: 'Restaurants · Cafés · Delivery',
    h1: 'Websites for restaurants and cafés',
    lead: 'Your menu online, orders arriving ready on WhatsApp and payments through Wompi. A website where customers can see your menu, order delivery and find you on Google.',
    heroShot: 'ratio', heroHtml: hero('ratio'), metaLine: 'Online menu · WhatsApp orders · Online payments',
    waMsg: 'Hi Miguel, I own a restaurant and would like a website',
    pixelHello: 'Own a restaurant? See what Miguel did for Ratio.',
    body:
      block('01', 'What your restaurant needs', cards([
        ['Online menu', 'Your menu with photos and prices, easy to read on a phone and easy to update.', L],
        ['WhatsApp orders', 'Customers build their order and it reaches your WhatsApp complete and error-free.', CY],
        ['Online payments', 'Charge by card, PSE or Nequi through Wompi before dispatching.', VI],
        ['Hours and delivery', 'Show whether you’re open, your hours and delivery areas.', CO],
        ['Show up on Google', 'Optimized for searches like “specialty coffee near me”.', L],
        ['Your own brand', 'A design with your identity, not just another profile in a delivery app.', CY],
      ])) +
      block('02', 'Real case', `<div class="case" style="--c:${PROJECTS.ratio.c};border-top:0;padding-top:0">${shot('ratio')}<div class="prose">
        <h2>Ratio Coffee Baq</h2>
        <p>A specialty coffee shop in Barranquilla. Its site shows the menu, hours, delivery and payment methods, and lets customers buy online with Wompi.</p>
        <p>It’s built on <a href="${PROJECTS.ordenio.url}" target="_blank" rel="noopener">Ordenio</a>, my platform for turning a business’s WhatsApp into a store.</p>
        <p><a href="${PROJECTS.ratio.url}" target="_blank" rel="noopener">See Ratio’s website →</a></p></div></div>`),
    faq: [
      ['How much does a restaurant website cost?', 'A site with a menu and WhatsApp orders starts at <strong>COP 720,000</strong>. With a cart and online payments, from <strong>COP 1,800,000</strong>. Message me and I’ll recommend the best option.'],
      ['Can I change the menu myself?', 'Yes. You can update products, prices and photos whenever you want.'],
      ['Do I pay a commission per order?', 'Not for the website. If you charge online, the payment gateway takes its fee per transaction.'],
      FAQ_REMOTE],
    schema: [service('Websites for restaurants', P.food, 'Websites for restaurants and cafés with online menu, WhatsApp orders and Wompi payments.', '720000')],
    related: [['Online stores', P.stores], ['Pricing', P.pricing], ['Projects', P.projects]],
  },
  {
    lang: 'en', esSlug: 'paginas-web-para-salones-de-belleza', crumb: 'Websites for beauty salons',
    title: 'Websites for Beauty Salons | Miguel Posada',
    description: 'Websites for beauty and hair salons: online appointment booking, product store and WhatsApp. Real case studies from Barranquilla.',
    kicker: 'Salons · Hair · Beauty',
    h1: 'Websites for beauty salons',
    lead: 'Let your clients book appointments, buy your products and see your work from their phone. I design salon websites with online booking, a store and WhatsApp built in.',
    heroShot: 'ami', heroHtml: hero('ami'), metaLine: 'Appointment booking · Product store · WhatsApp',
    waMsg: 'Hi Miguel, I own a beauty salon and would like a website',
    pixelHello: 'Miguel has already built sites for two curly hair salons.',
    body:
      block('01', 'What your salon needs', cards([
        ['Online booking', 'Clients choose the service, day and time without having to message you.', L],
        ['Product store', 'Sell your products with a cart and online payments.', VI],
        ['Services and prices', 'Every service explained with photos of your work.', CY],
        ['WhatsApp at hand', 'For quick questions before booking.', CO],
        ['Multiple locations', 'Show each salon with its address and schedule.', L],
        ['Educational content', 'Care tips that bring visitors from Google.', CY],
      ])) +
      block('02', 'Real cases', `${prose('<h2>Salons that already have their website</h2><p>Two salons specialized in curly, coily and afro hair, with appointment booking and a product store.</p>')}<div style="margin-top:24px">${shotsGrid(['ema', 'ami'])}</div>`),
    faq: [
      ['How much does a salon website cost?', 'A site with up to 5 pages starts at <strong>COP 1,000,000</strong> with domain and hosting. With a product store and online payments, from <strong>COP 1,800,000</strong>.'],
      ['Can it connect to my booking system?', 'Yes. I can integrate scheduling tools like AgendaPro or build a custom booking system.'],
      FAQ_PAY, FAQ_REMOTE],
    schema: [service('Websites for beauty salons', P.beauty, 'Websites for beauty salons with online booking, product store and WhatsApp.', '1000000')],
    related: [['Online stores', P.stores], ['Pricing', P.pricing], ['Projects', P.projects]],
  },
  {
    lang: 'en', esSlug: 'paginas-web-para-consultoras', crumb: 'Websites for consulting firms',
    title: 'Websites for Consulting Firms | Miguel Posada',
    description: 'Websites for consulting and professional service firms: 5 pages with services, case studies, form and WhatsApp. From COP 1,000,000 with domain.',
    kicker: 'Consulting · Professional services',
    h1: 'Websites for consulting firms',
    lead: 'A business website that builds trust, explains your services clearly and turns visits into meetings. Made for consultancies, firms and professional service companies.',
    heroShot: 'fly', heroHtml: hero('fly'), metaLine: '5 pages · From COP 1,000,000 with domain and hosting · COP 800,000 if you have them',
    waMsg: 'Hi Miguel, I run a consulting firm and would like a quote for a website',
    pixelHello: 'For consultants, trust is everything.',
    body:
      block('01', 'The 5 pages', cards([
        ['Home', 'Your value proposition and a clear invitation to book a meeting.', L],
        ['About', 'Your story, team and what sets you apart from other firms.', CY],
        ['Services', 'Each service explained with its scope and benefits.', VI],
        ['Clients and cases', 'Logos, testimonials and results that build trust.', CO],
        ['Contact', 'Form, WhatsApp, email and map.', L],
      ])) +
      block('02', 'Why it matters', prose(`
        <h2>Your website is your first meeting</h2>
        <p>Before contacting you, a potential client checks your website. A slow, outdated or confusing page hurts your credibility, even if your work is excellent.</p>
        <ul>
          <li><strong>One page per service</strong> helps people find you on Google for each thing you do.</li>
          <li><strong>Real case studies</strong> persuade more than any sales copy.</li>
          <li><strong>Frictionless contact</strong> (form and WhatsApp) turns interest into meetings.</li>
        </ul>
        <p>If you’d like to publish articles to attract clients from Google, I can add a blog too.</p>`)),
    faq: [
      ['How much does a consulting firm website cost?', 'A 5-page site costs <strong>COP 1,000,000</strong> with a .com domain and hosting for one year, or <strong>COP 800,000</strong> if you already have them.'],
      ['What if I need more pages?', 'I can add a page for each service or a blog. It’s quoted based on the content.'],
      ['Who writes the copy?', 'Your company provides the copy. If you need help writing it, that’s quoted separately.'],
      FAQ_PAY],
    schema: [service('Websites for consulting firms', P.consult, 'Five-page business websites for consulting and professional service firms.', '1000000')],
    related: [['Pricing', P.pricing], ['Web design in Barranquilla', P.baq], ['What should a professional website include?', P.includes]],
  },
  {
    lang: 'en', esSlug: 'proyectos', crumb: 'Projects',
    title: 'Projects: Websites and Online Stores | Miguel Posada',
    description: 'Portfolio of live websites and online stores: Ema Rizos, AmicrespA, FlyLatam Plus, Ordenio, Luminni, Lusarte and Ratio Coffee Baq.',
    kicker: 'Portfolio · 7 live · 1 in development',
    h1: 'Websites already at work',
    lead: 'Each project was designed from scratch for its brand and the way it sells. The live ones are yours to visit and try.',
    waMsg: 'Hi Miguel, I saw your projects and would like a website like these',
    pixelHello: 'Welcome to Miguel’s portfolio!',
    body: [
      ['ema', 'E-commerce and bookings', 'Store and bookings for a salon specialized in curly, coily and afro hair in Barranquilla. It includes a catalog with a featured product, appointment booking, mentoring and a section to meet the team.', ['React', 'Supabase', 'AgendaPro', 'Online payments']],
      ['ami', 'Salon + store', 'Website for a curly hair salon with locations in Barranquilla and Cali. It presents services, products, salons and educational content, with personalized recommendations for each curl type and appointment booking.', ['React', 'Supabase', 'Bold']],
      ['fly', 'Travel agency', 'Business website for a corporate and leisure travel agency. It organizes six service lines (vacation plans, corporate travel, groups and events, cruises, charter flights and full-service management) and turns visits into WhatsApp quotes.', ['Custom design', 'WhatsApp', 'SEO']],
      ['ordenio', 'SaaS', 'My own platform that lets any business turn its WhatsApp into a store: catalog, cart and payments in a single link, with custom subdomains and Wompi payments.', ['SaaS', 'Subdomains', 'Wompi']],
      ['luminni', 'Editorial e-commerce', 'Store for a house of candles and scented objects, with collections told as stories, a brand manifesto and a shopping bag.', ['E-commerce', 'Editorial design']],
      ['lusarte', 'E-commerce', 'Online store for candle-making supplies (waxes, paraffins, fragrances, molds and containers) and handmade candles from Barranquilla, with local delivery and shipping across Colombia.', ['E-commerce', 'Online payments', 'National shipping']],
      ['ratio', 'Café · Online orders', 'Website for a specialty coffee shop in Barranquilla, built on Ordenio: menu, hours, delivery and online purchases with Wompi.', ['Ordenio', 'Wompi', 'Delivery']],
    ].map(([k, type, desc, tags], i) => `<article class="case reveal" style="--c:${PROJECTS[k].c}">${shot(k, i === 0 ? { lazy: false } : {})}<div>
        <span class="p-idx">P/0${i + 1}</span>
        <h2>${PROJECTS[k].name}</h2><p class="type">${type}</p>
        <div class="prose"><p>${desc}</p><p><a href="${PROJECTS[k].url}" target="_blank" rel="noopener">Visit ${PROJECTS[k].dom} →</a></p></div>
        <div class="tags">${tags.map(t => `<span>${t}</span>`).join('')}</div></div></article>`).join('') + `<article class="case reveal" style="--c:#6fd6d6">${wipShot('marea', 'Marea Rizada')}<div>
        <span class="p-idx">P/08</span>
        <h2>Marea Rizada</h2><p class="type">Curly hair salon · In development</p>
        <div class="prose"><p>Website for a salon specialized in curly hair, with diagnosis, curl-by-curl cuts, routines for each pattern from 2A to 4C, bookings and a store. I’m building it right now and it isn’t published yet.</p></div>
        <p class="project-status"><i></i>In development · Coming soon</p></div></article>`,
    schema: [{ '@type': 'ItemList', name: 'Projects by Miguel Posada', itemListElement: Object.values(PROJECTS).map((p, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'CreativeWork', name: p.name, url: p.url, image: `${SITE}/assets/${p.img}.webp`, creator: { '@id': `${SITE}/#person` } } })) }],
    related: [['Pricing', P.pricing], ['Online stores', P.stores], ['Web design in Barranquilla', P.baq]],
  },
  {
    lang: 'en', esSlug: 'blog', crumb: 'Blog',
    title: 'Blog: Website Guides for Businesses | Miguel Posada',
    description: 'Clear guides for business owners: what a website should include, how much it costs to maintain and which domain to choose.',
    kicker: 'Blog · Guides for businesses',
    h1: 'Website guides for your business',
    lead: 'Clear answers to the questions clients ask me most before building their website.',
    pixelHello: 'Here Miguel answers the most common questions.',
    body: block('01', 'Articles', `<div class="posts">${[
      [P.includes, 'What should a professional website include?', 'What your site should come with to win customers, and what you shouldn’t be charged extra for.', L],
      [P.upkeep, 'How much does it cost to maintain a website?', 'Domain, hosting, maintenance and the costs nobody mentions up front.', CY],
      [P.domain, '.com or .com.co: which domain should you choose?', 'The pros of each for a business in Colombia and how to decide.', VI],
    ].map(([h, t, d, c]) => `<article class="card" style="--c:${c}"><h3><a href="${h}">${t}</a></h3><p>${d}</p><p class="post-meta">Nov 21, 2026 · Miguel Posada</p><a class="more" href="${h}">Read →</a></article>`).join('')}</div>`),
    schema: [{ '@type': 'Blog', name: 'Miguel Posada’s blog', url: `${SITE}${P.blog}`, publisher: { '@id': `${SITE}/#business` } }],
    related: [['Pricing', P.pricing], ['Projects', P.projects]],
  },
  {
    lang: 'en', esSlug: 'blog/que-incluye-una-pagina-web-profesional', crumb: 'What should a professional website include?', parent: BLOG_PARENT,
    title: 'What Should a Professional Website Include? (2026)',
    description: 'A checklist of what a professional business website should include: design, mobile, WhatsApp, SEO, speed, security and analytics.',
    kicker: 'Guide · 6 min read', ogType: 'article', dateModified: TODAY,
    h1: 'What should a professional website include?',
    lead: 'Before asking for quotes, it helps to know what a professional website should come with. That way you can compare proposals with the same scope and avoid surprise charges.',
    metaLine: BY, waMsg: 'Hi Miguel, I read your guide and would like a quote for my website',
    body: block('01', 'Full checklist', prose(`
      <h2>1. Custom, mobile-friendly design</h2>
      <p>Most of your visitors arrive on a phone. A professional site is designed for mobile first and tested on different screen sizes. It should also reflect your brand: your own colors, logo and tone, not a template that looks like hundreds of others.</p>
      <h2>2. A clear path to contact</h2>
      <p>Every page should lead to an action: message you on WhatsApp, fill out a form or buy. If people have to hunt for how to reach you, they leave.</p>
      <h2>3. Technical SEO from day one</h2>
      <p>For Google to understand your site you need, at minimum:</p>
      <ul>
        <li>A unique title and description for each page.</li>
        <li>Organized headings using the words your customers use.</li>
        <li>Structured data telling Google what your business is.</li>
        <li>A sitemap and Google Search Console setup.</li>
      </ul>
      <h2>4. Speed</h2>
      <p>A slow page loses visitors before it appears. Optimized images, clean code and good hosting make the difference.</p>
      <h2>5. Security (HTTPS)</h2>
      <p>The padlock in the browser is a must. Without a security certificate, browsers flag your site as “not secure”.</p>
      <h2>6. Analytics</h2>
      <p>Google Analytics tells you how many people visit your site and how many contact you. Without measuring, you can’t know whether it’s working.</p>
      <h2>7. Domain, hosting and support</h2>
      <p>Always ask whether the proposal includes domain and hosting, for how long, and what support you get after delivery.</p>
      <h2>What’s usually charged separately</h2>
      <ul>
        <li>Copywriting and photo shoots.</li>
        <li>Logo design or brand guidelines.</li>
        <li>Special features: bookings, online store or integrations.</li>
        <li>Domain and hosting renewal from the second year.</li>
      </ul>
      <div class="callout">Every site I build includes points 1 to 7. See the details on my <a href="${P.pricing}">pricing page</a>.</div>`)),
    schema: [article(P.includes, 'What should a professional website include?', 'A checklist of what a professional business website should include.')],
    related: [['Pricing', P.pricing], ['How much does it cost to maintain a website?', P.upkeep], ['.com or .com.co', P.domain]],
  },
  {
    lang: 'en', esSlug: 'blog/cuanto-cuesta-mantener-una-pagina-web', crumb: 'How much does it cost to maintain a website?', parent: BLOG_PARENT,
    title: 'How Much Does It Cost to Maintain a Website?',
    description: 'The costs of keeping a website running in Colombia: domain, hosting, security certificate and maintenance. What’s required and what’s optional.',
    kicker: 'Guide · 5 min read', ogType: 'article', dateModified: TODAY,
    h1: 'How much does it cost to maintain a website?',
    lead: 'Building the site is only the first step. These are the costs that come after, which ones are required and which ones you can avoid.',
    metaLine: BY, waMsg: 'Hi Miguel, I read your maintenance guide and have a question',
    body: block('01', 'Costs', prose(`
      <h2>Required costs</h2>
      <h3>Domain</h3>
      <p>Your site’s address (for example, yourbusiness.com). It renews every year. The price depends on the extension (.com, .com.co, .co) and the provider; in Colombia it’s usually around COP 40,000 to COP 150,000 per year.</p>
      <h3>Hosting</h3>
      <p>The server where your site lives. For a small or medium business site, good-quality shared hosting is enough, paid yearly or monthly. Very cheap hosting usually means a slow website.</p>
      <h3>Security certificate (HTTPS)</h3>
      <p>Most hosting plans include it for free today. If you’re charged separately, ask why.</p>
      <h2>Optional costs</h2>
      <ul>
        <li><strong>Monthly maintenance:</strong> updates, backups and content changes without doing them yourself.</li>
        <li><strong>Payment gateway:</strong> if you sell online, Wompi or Bold charge a fee per sale, not a monthly fee.</li>
        <li><strong>Improvements:</strong> new pages, sections or features as your business grows.</li>
      </ul>
      <h2>How to pay less without putting your site at risk</h2>
      <ul>
        <li>Register the domain in your name, not the developer’s.</li>
        <li>Pay for domain and hosting for several years if the provider offers a discount.</li>
        <li>Ask for a site you can update yourself for simple changes.</li>
      </ul>
      <div class="callout">In my plans, the business website includes domain and hosting for the first year plus 30 days of support. Maintenance after that is optional. <a href="${P.pricing}">See pricing</a>.</div>`)),
    schema: [article(P.upkeep, 'How much does it cost to maintain a website?', 'The costs of keeping a website running in Colombia.')],
    related: [['Pricing', P.pricing], ['What should a professional website include?', P.includes], ['.com or .com.co', P.domain]],
  },
  {
    lang: 'en', esSlug: 'blog/dominio-com-o-com-co', crumb: '.com or .com.co', parent: BLOG_PARENT,
    title: '.com or .com.co: Which Domain Should You Choose?',
    description: '.com or .com.co for your website? The pros of each domain for a business in Colombia and how to pick the best one for your brand.',
    kicker: 'Guide · 4 min read', ogType: 'article', dateModified: TODAY,
    h1: '.com or .com.co: which should you choose?',
    lead: 'It’s one of the first decisions when creating your website. There’s no single answer: it depends on who you sell to and which names are available.',
    metaLine: BY, waMsg: 'Hi Miguel, I need help choosing my domain',
    body: block('01', 'Comparison', prose(`
      <h2>The differences</h2>
      <table>
        <thead><tr><th>Domain</th><th>The good</th><th>Keep in mind</th></tr></thead>
        <tbody>
          <tr><td>.com</td><td>The best known worldwide. People type it out of habit.</td><td>Short names are usually taken.</td></tr>
          <tr><td>.com.co</td><td>Tells customers you’re a Colombian business. More names tend to be available.</td><td>Some people forget the final “.co” and type just “.com”.</td></tr>
          <tr><td>.co</td><td>Short and modern.</td><td>Easily confused with .com.</td></tr>
        </tbody>
      </table>
      <h2>How to decide</h2>
      <ul>
        <li><strong>If you only sell in Colombia</strong>, a .com.co reinforces that you’re local and is a very good option.</li>
        <li><strong>If you have or plan to have clients abroad</strong>, .com is more universal.</li>
        <li><strong>If the name is free on both</strong>, consider buying both and redirecting one to the other so nobody else takes your name.</li>
      </ul>
      <h2>More important than the extension</h2>
      <ul>
        <li>Keep it short, easy to say and easy to type.</li>
        <li>Avoid hyphens or numbers that cause confusion.</li>
        <li>Make sure it’s registered in your name.</li>
      </ul>
      <p>For Google, the extension doesn’t decide your ranking: your content and the quality of your site matter far more.</p>
      <div class="callout">The business website plan includes a .com domain for the first year, and I help you choose and register the name. <a href="${P.pricing}">See pricing</a>.</div>`)),
    schema: [article(P.domain, '.com or .com.co: which domain should you choose?', '.com or .com.co for your website?')],
    related: [['How much does it cost to maintain a website?', P.upkeep], ['Pricing', P.pricing]],
  },
];
setLang('es');
