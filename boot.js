/* Se ejecuta antes de pintar: elige idioma (por ubicación) y tema (por sistema).
   La elección manual del visitante siempre tiene prioridad. */
(function () {
  var d = document.documentElement;
  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  // Las animaciones de entrada solo se activan con JS; si main.js no llega, el contenido se muestra igual
  d.classList.add('js');
  if (get('motion') === 'off') d.classList.add('motion-off');
  setTimeout(function () { if (!d.classList.contains('app')) d.classList.remove('js'); }, 3000);

  // Idioma: los buscadores nunca se redirigen, para que indexen cada versión
  var alt = d.getAttribute('data-alt'), lang = d.lang, want = get('lang');
  // Un clic de anuncio nunca se redirige: así Google Ads no pierde la atribución de la conversión
  var adClick = /[?&](gclid|gbraid|wbraid)=/.test(location.search);
  if (alt && !adClick) {
    var ua = navigator.userAgent || '';
    var bot = /bot|crawl|spider|slurp|lighthouse|headless|facebookexternalhit|whatsapp|preview/i.test(ua);
    if (!want && lang === 'es' && !bot) {
      var tz = '';
      try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
      var browser = ((navigator.languages && navigator.languages[0]) || navigator.language || '').toLowerCase();
      var hispanic = /^(America\/(Bogota|Mexico_City|Cancun|Merida|Monterrey|Matamoros|Mazatlan|Chihuahua|Ciudad_Juarez|Ojinaga|Hermosillo|Tijuana|Bahia_Banderas|Caracas|Lima|Guayaquil|Santiago|Punta_Arenas|La_Paz|Asuncion|Montevideo|Argentina\/.*|Buenos_Aires|Cordoba|Mendoza|Panama|Costa_Rica|Guatemala|El_Salvador|Tegucigalpa|Managua|Havana|Santo_Domingo|Puerto_Rico)|Pacific\/(Galapagos|Easter)|Europe\/Madrid|Atlantic\/Canary|Africa\/(Ceuta|Malabo))$/;
      if (!hispanic.test(tz) && browser.indexOf('es') !== 0) want = 'en';
    }
    if ((want === 'es' || want === 'en') && want !== lang) {
      location.replace(alt + location.search + location.hash);
      return;
    }
  }

  // Tema
  var theme = get('theme');
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  d.setAttribute('data-theme', theme);
  d.style.colorScheme = theme;
})();
