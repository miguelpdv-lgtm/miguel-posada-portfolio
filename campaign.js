// Captación por nichos. No inventar conversiones: un enlace a WhatsApp es intención de contacto, no un lead confirmado.
(() => {
  'use strict';
  const form = document.querySelector('#lead-form');
  if (!form) return;
  const ALLOWED = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'oppref'];
  const params = new URLSearchParams(location.search);
  const attribution = {};
  for (const key of ALLOWED) {
    const v = params.get(key);
    if (v) attribution[key] = v.slice(0, 250);
  }
  const niche = form.dataset.niche;
  const original = form.dataset.message;
  const emit = (event, data = {}) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, { sector: niche, ...data });
    }
    // Hook para integrar el código oficial de OpenAI Ads una vez creado el pixel.
    // No se envían PII ni llamadas inventadas a endpoints externos.
    document.dispatchEvent(new CustomEvent('mp:conversion', { detail: { event, sector: niche, ...data } }));
  };
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const values = Object.fromEntries(['business', 'service', 'budget', 'name', 'phone'].map(k => [k, String(data.get(k) || '').trim()]));
    if (Object.values(values).some(v => !v)) return;
    // El envío real sucede en WhatsApp; el navegador no puede confirmar que el mensaje se envió.
    const lines = [
      original, '',
      'Negocio: ' + values.business,
      'Necesito: ' + values.service,
      'Presupuesto: ' + values.budget,
      'Mi nombre: ' + values.name,
      'Mi WhatsApp: ' + values.phone
    ];
    for (const [key,val] of Object.entries(attribution)) lines.push(key + ': ' + val);
    const href = 'https://wa.me/573003117197?text=' + encodeURIComponent(lines.join('\n'));
    const a = document.createElement('a');
    a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer';
    a.click();
    emit('lead_whatsapp_intent', { servicio: values.service, presupuesto: values.budget, fuente: attribution.utm_source || 'direct', ubicacion: 'landing-' + niche });
    const note = form.querySelector('.form-note');
    if (note) note.textContent = 'WhatsApp se abrió con tu solicitud. Para completar el contacto, envía el mensaje desde allí.';
  });
})();