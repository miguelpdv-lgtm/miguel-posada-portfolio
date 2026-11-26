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
    if (v && key !== 'oppref') attribution[key] = v.slice(0, 250);
  }
  const niche = form.dataset.niche;
  const original = form.dataset.message;
  const consent = form.elements.namedItem('measurement_consent');
  const sent = new Set();
  const measure = (name, standard = false) => {
    if (!consent?.checked || typeof window.oaiq !== 'function' || sent.has(name)) return;
    try {
      if (standard) window.oaiq('measure', name, { type: 'contents' });
      else window.oaiq('measure', 'custom', { type: 'custom' }, { custom_event_name: name, opt_out: true });
      sent.add(name);
    } catch (_) { /* Measurement must not block contact. */ }
  };
  consent?.addEventListener('change', () => {
    if (typeof window.oaiq !== 'function') return;
    window.oaiq('consent', consent.checked);
    if (consent.checked) measure('page_viewed', true);
  });
  const emit = (event, data = {}) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, { sector: niche, ...data });
    }
    // Local event for integrations; no personal information.
    document.dispatchEvent(new CustomEvent('mp:conversion', { detail: { event, sector: niche, ...data } }));
  };
  form.elements.namedItem('phone').addEventListener('input', e => e.target.setCustomValidity(''));
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const values = Object.fromEntries(['business', 'service', 'budget', 'name', 'phone'].map(k => [k, String(data.get(k) || '').trim()]));
    if (Object.values(values).some(v => !v)) return;
    const digits = values.phone.replace(/\D/g, '');
    if (digits.length < 8 || digits.length > 15 || !/^[+\d\s().-]+$/.test(values.phone)) {
      const phone = form.elements.namedItem('phone');
      phone.setCustomValidity('Introduce un número de WhatsApp válido.');
      phone.reportValidity();
      return;
    }
    if (consent?.checked) {
      measure('qualified_form_completed');
    }
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
    measure('lead_whatsapp_intent');
    emit('lead_whatsapp_intent', { servicio: values.service, presupuesto: values.budget, fuente: attribution.utm_source || 'direct', ubicacion: 'landing-' + niche });
    const note = form.querySelector('.form-note');
    if (note) note.textContent = 'WhatsApp se abrió con tu solicitud. Para completar el contacto, envía el mensaje desde allí.';
  });
})();