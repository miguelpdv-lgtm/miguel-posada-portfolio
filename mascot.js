/* ==========================================================
   PIXEL — la mascota de miguelposada.dev
   Una ventanita de navegador dibujada 100% en canvas que
   acompaña al usuario mientras baja por las secciones.
   ========================================================== */
(() => {
  'use strict';

  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const C = { lime: '#cbff00', panel: '#131410', panel2: '#1f2119', dark: '#0b0c09' };
  const CONFETTI = ['#cbff00', '#f0ede6', '#a78bfa', '#ff6b4a', '#4fd8eb'];

  // Qué hace Pixel en cada sección
  // Cada página puede definir sus propias frases con window.PIXEL_SECTIONS (ver build.mjs)
  const SECTIONS = window.PIXEL_SECTIONS || [
    { sel: '.hero', x: .9, pose: 'wave', mood: 'happy', say: '¡Hola! Soy Pixel, el asistente de Miguel. Baja conmigo ↓' },
    { sel: '#trabajo', x: .1, pose: 'point', mood: 'excited', say: 'Estos 5 sitios ya están en producción. ¡Pasa el mouse por encima!' },
    { sel: '#servicios', x: .9, pose: 'type', mood: 'happy', say: 'Diseño, código, tiendas online y soporte. Todo en un solo lugar.' },
    { sel: '#sobre-mi', x: .1, pose: 'think', mood: 'curious', say: '¿Código limpio y escalable? Así trabaja Miguel.' },
    { sel: '.process', x: .9, pose: 'idle', mood: 'happy', say: 'Cuatro pasos y tu página queda en línea.' },
    { sel: '#preguntas', x: .1, pose: 'think', mood: 'curious', say: '¿Dudas sobre precios o tiempos? Aquí están las respuestas.' },
    { sel: '#contacto', x: .86, pose: 'wave', mood: 'excited', say: 'Pagas 50% al empezar y 50% al entregar. ¡Escríbele a Miguel!', party: true },
  ];
  const TAPS = [
    '¡Jaja, eso hace cosquillas!',
    'Me dibujaron con JavaScript puro. Ni una sola imagen.',
    'Las páginas de Miguel cargan en 1 segundo.',
    'Optimizadas para Google y para cualquier celular.',
    '¿Tu negocio todavía no tiene página web?',
    'Landing pages, tiendas online, web apps y SEO técnico.',
  ];

  /* ---------- utilidades ---------- */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  const eBounce = p => {
    const n = 7.5625, d = 2.75;
    if (p < 1 / d) return n * p * p;
    if (p < 2 / d) return n * (p -= 1.5 / d) * p + .75;
    if (p < 2.5 / d) return n * (p -= 2.25 / d) * p + .9375;
    return n * (p -= 2.625 / d) * p + .984375;
  };
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch { /* sin almacenamiento */ } },
  };

  /* ---------- DOM ---------- */
  const cv = document.createElement('canvas');
  cv.className = 'pixel-canvas';
  cv.setAttribute('aria-hidden', 'true');
  const ctx = cv.getContext('2d');

  const hit = document.createElement('button');
  hit.className = 'pixel-hit';
  hit.type = 'button';
  hit.setAttribute('aria-label', 'Pixel, la mascota de la página. Tócalo para que hable');

  const bubble = document.createElement('div');
  bubble.className = 'pixel-bubble';
  bubble.setAttribute('role', 'status');
  bubble.setAttribute('aria-live', 'polite');
  bubble.innerHTML = '<span class="pixel-name">Pixel</span><span class="pixel-text"></span><button type="button" class="pixel-close" aria-label="Ocultar a Pixel">×</button>';
  const bubbleText = bubble.querySelector('.pixel-text');
  const bubbleSize = { w: 0, h: 0 };
  new ResizeObserver(([e]) => {
    const b = e.borderBoxSize && e.borderBoxSize[0];
    bubbleSize.w = b ? b.inlineSize : bubble.offsetWidth;
    bubbleSize.h = b ? b.blockSize : bubble.offsetHeight;
  }).observe(bubble);

  document.body.append(cv, hit, bubble);

  /* ---------- estado ---------- */
  let W = 0, H = 0, S = .58;
  let dirty = null; // zona del canvas a borrar en el siguiente cuadro
  function resize() {
    const d = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = Math.round(W * d); cv.height = Math.round(H * d);
    ctx.setTransform(d, 0, 0, d, 0, 0);
    S = W < 640 ? .42 : W < 1100 ? .5 : .58;
    dirty = { x: 0, y: 0, w: W, h: H };
  }
  addEventListener('resize', resize);
  resize();

  const mouse = { x: W / 2, y: H / 2 };
  addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });

  const st = {
    x: W * .9, facing: -1, walk: 0, walking: false,
    jz: 0, jv: 0,               // salto
    squash: 1, squashV: 0,      // aplastamiento al aterrizar
    fall: 0,                    // -1 trepando … 1 deslizándose
    peek: store.get('pixel-peek') === '1', peekAmt: 0,
    excitedUntil: 0, tapMoodUntil: 0,
  };
  st.peekAmt = st.peek ? 1 : 0;
  let current = -1, pending = -1, pendingSince = 0, lastScroll = scrollY, sv = 0;
  let introStart = performance.now() / 1000, introDone = REDUCED;
  const partied = new Set();
  let confetti = [], dust = [];

  /* ---------- globo de diálogo ---------- */
  let hideTimer = 0, typeTimer = 0;
  function say(text) {
    if (st.peek) return;
    clearTimeout(hideTimer); clearInterval(typeTimer);
    bubble.classList.add('show');
    if (REDUCED) bubbleText.textContent = text;
    else {
      // el texto completo ocupa su espacio desde el inicio (invisible) → el globo no cambia de tamaño
      let i = 0;
      bubbleText.innerHTML = '<span class="t"></span><span class="g" aria-hidden="true"></span>';
      const tEl = bubbleText.firstChild, gEl = bubbleText.lastChild;
      gEl.textContent = text;
      typeTimer = setInterval(() => {
        i++; tEl.textContent = text.slice(0, i); gEl.textContent = text.slice(i);
        if (i >= text.length) clearInterval(typeTimer);
      }, 24);
    }
    hideTimer = setTimeout(() => bubble.classList.remove('show'), 4200 + text.length * 45);
  }
  function hush() { clearTimeout(hideTimer); clearInterval(typeTimer); bubble.classList.remove('show'); }

  bubble.querySelector('.pixel-close').addEventListener('click', () => {
    st.peek = true; store.set('pixel-peek', '1'); hush();
  });

  let tapIdx = 0;
  hit.addEventListener('click', () => {
    if (st.peek) {
      st.peek = false; store.set('pixel-peek', '0');
      setTimeout(() => say('¡Volví! ¿Seguimos?'), 350);
      return;
    }
    if (!REDUCED && st.jz === 0) st.jv = 520;
    st.tapMoodUntil = performance.now() / 1000 + 1.6;
    say(TAPS[tapIdx++ % TAPS.length]);
  });

  // se emociona al pasar por un proyecto
  document.addEventListener('pointerover', e => {
    if (e.target.closest && e.target.closest('.project-shot')) st.excitedUntil = performance.now() / 1000 + 1.4;
  });

  /* ---------- efectos ---------- */
  function burst(x, y) {
    if (REDUCED) return;
    for (let i = 0; i < 80; i++) {
      const a = -Math.PI / 2 + (Math.random() - .5) * 2.2, v = 300 + Math.random() * 520;
      confetti.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: 3 + Math.random() * 4, rot: Math.random() * 6, vr: (Math.random() - .5) * 12, c: CONFETTI[i % CONFETTI.length], life: 3 });
    }
  }
  function puff(x, y) {
    if (REDUCED) return;
    for (let i = 0; i < 10; i++) dust.push({ x: x + (Math.random() - .5) * 60 * S, y, vx: (Math.random() - .5) * 120, vy: -Math.random() * 60, r: 3 + Math.random() * 5, life: .6 });
  }

  /* ---------- sección activa ---------- */
  let tops = [];
  const measureSections = () => {
    tops = SECTIONS.map(s => {
      const el = document.querySelector(s.sel);
      return el ? el.getBoundingClientRect().top + scrollY : Infinity;
    });
  };
  let measureQueued = false;
  const queueMeasure = () => {
    if (measureQueued) return;
    measureQueued = true;
    requestAnimationFrame(() => { measureQueued = false; measureSections(); });
  };
  new ResizeObserver(queueMeasure).observe(document.body);
  addEventListener('load', queueMeasure);
  measureSections();
  function activeSection() {
    const line = scrollY + H * .55;
    let idx = 0;
    for (let i = 0; i < tops.length; i++) if (tops[i] <= line) idx = i;
    return idx;
  }

  /* ---------- dibujo de Pixel (coordenadas locales, mira a la derecha) ---------- */
  function rr(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function drawPixel(t, o) {
    const { pose, mood } = o;
    ctx.strokeStyle = C.lime; ctx.fillStyle = C.lime;
    ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    // piernas
    let l1x = -24, l2x = 24, l1y = 12, l2y = 12;
    if (pose === 'fall') {
      const sw = Math.sin(t * 10) * 5;
      l1x = -30 + sw; l2x = 30 - sw; l1y = l2y = 24;
    } else if (o.walking) {
      l1y = 12 - Math.max(0, Math.sin(o.walk)) * 9;
      l2y = 12 - Math.max(0, -Math.sin(o.walk)) * 9;
      l1x = -24 + Math.cos(o.walk) * 7; l2x = 24 - Math.cos(o.walk) * 7;
    }
    ctx.beginPath(); ctx.moveTo(-24, -8); ctx.lineTo(l1x, l1y); ctx.moveTo(24, -8); ctx.lineTo(l2x, l2y); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(l1x - 4, l1y + 2, 12, 6, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.ellipse(l2x + 4, l2y + 2, 12, 6, 0, 0, 7); ctx.fill();

    // brazos: [control, final] para cada hombro (-70,-60) y (70,-60)
    const sway = Math.sin(t * 2) * 2, sw = o.walking ? Math.sin(o.walk) * 7 : 0;
    let L = [[-92, -45], [-86, -24 + sway + sw]], R = [[92, -45], [86, -24 - sway - sw]];
    if (pose === 'wave') { const w = Math.sin(t * 9) * 14; R = [[95, -85], [92 + w, -118]]; }
    else if (pose === 'point') R = [[100, -66], [130, -80]];
    else if (pose === 'type') { const j = Math.sin(t * 22) * 4; L = [[-92, -38], [-40, -14 + j]]; R = [[92, -38], [40, -14 - j]]; }
    else if (pose === 'think') R = [[98, -26], [46, -12]];
    else if (pose === 'fall') { const f = Math.sin(t * 12) * 6; L = [[-100, -80], [-92 + f, -130]]; R = [[100, -80], [92 - f, -130]]; }
    else if (pose === 'climb') { const a = Math.sin(t * 10) * 20; L = [[-96, -90], [-86, -110 + a]]; R = [[96, -90], [86, -110 - a]]; }
    ctx.beginPath();
    ctx.moveTo(-70, -60); ctx.quadraticCurveTo(L[0][0], L[0][1], L[1][0], L[1][1]);
    ctx.moveTo(70, -60); ctx.quadraticCurveTo(R[0][0], R[0][1], R[1][0], R[1][1]);
    ctx.stroke();

    // cuerpo: ventana de navegador
    rr(-72, -125, 144, 118, 20); ctx.fillStyle = C.panel; ctx.fill();
    ctx.lineWidth = 5; ctx.strokeStyle = C.lime; ctx.stroke();
    ctx.fillStyle = C.panel2; rr(-69, -122, 138, 22, 17); ctx.fill();
    ['#ff6b5e', '#ffc93d', C.lime].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(-52 + i * 14, -111, 4.5, 0, 7); ctx.fill(); });

    // pantalla-cara
    rr(-58, -94, 116, 76, 12); ctx.fillStyle = C.lime; ctx.fill();
    const blink = (t % 3.3) < .12;
    const lx = o.look.x * 5, ly = o.look.y * 4;
    ctx.fillStyle = C.dark; ctx.strokeStyle = C.dark; ctx.lineWidth = 4;
    for (const s of [-1, 1]) {
      ctx.beginPath();
      if (blink) { ctx.rect(s * 22 - 9 + lx, -64, 18, 3); ctx.fill(); }
      else if (mood === 'excited') { ctx.moveTo(s * 22 - 9, -58); ctx.lineTo(s * 22, -68); ctx.lineTo(s * 22 + 9, -58); ctx.stroke(); }
      else if (pose === 'fall') { ctx.arc(s * 22 + lx * .4, -63, 9, 0, 7); ctx.fill(); }
      else { ctx.ellipse(s * 22 + lx, -62 + ly + (mood === 'curious' ? -4 : 0), 8, 10, 0, 0, 7); ctx.fill(); }
    }
    // mejillas
    ctx.fillStyle = 'rgba(255,120,150,.55)';
    ctx.beginPath(); ctx.ellipse(-40, -44, 7, 4, 0, 0, 7); ctx.fill();
    ctx.beginPath(); ctx.ellipse(40, -44, 7, 4, 0, 0, 7); ctx.fill();
    // boca
    ctx.fillStyle = C.dark; ctx.strokeStyle = C.dark; ctx.lineWidth = 4;
    ctx.beginPath();
    if (pose === 'fall') { ctx.ellipse(0, -38, 7, 8, 0, 0, 7); ctx.fill(); }
    else if (mood === 'curious') { ctx.ellipse(lx * .5, -38, 5, 6, 0, 0, 7); ctx.fill(); }
    else if (mood === 'excited') { ctx.arc(0, -46, 13, .1, Math.PI - .1); ctx.closePath(); ctx.fill(); }
    else { ctx.arc(0, -46, 10, .3, Math.PI - .3); ctx.stroke(); }

    // teclado al teclear
    if (pose === 'type') {
      rr(-54, -22, 108, 16, 5); ctx.fillStyle = C.panel2; ctx.fill();
      ctx.lineWidth = 2.5; ctx.strokeStyle = C.lime; ctx.stroke();
      ctx.fillStyle = C.lime;
      for (let i = 0; i < 6; i++) if (Math.sin(t * 18 + i * 2.1) > .4) ctx.fillRect(-44 + i * 15, -17, 9, 5);
    }
    // manos
    ctx.fillStyle = C.lime;
    for (const p of [L[1], R[1]]) { ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, 7); ctx.fill(); }
  }

  /* ---------- bucle ---------- */
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    const t = now / 1000;
    if (dirty) ctx.clearRect(dirty.x, dirty.y, dirty.w, dirty.h);

    // velocidad de scroll → deslizarse / trepar
    const rawV = (scrollY - lastScroll) / Math.max(dt, .001);
    lastScroll = scrollY;
    sv = lerp(sv, rawV, .12);
    const prevFall = st.fall;
    st.fall = REDUCED ? 0 : lerp(st.fall, clamp(sv / 1100, -1, 1), .15);

    // sección activa (se confirma tras 0.45 s para no hablar mientras pasa rápido)
    const idx = activeSection();
    if (idx !== pending) { pending = idx; pendingSince = t; }
    if (pending !== current && t - pendingSince > .45 && introDone) {
      current = pending;
      const cfg = SECTIONS[current];
      say(cfg.say);
      if (cfg.party && !partied.has(current)) {
        partied.add(current);
        if (!REDUCED) st.jv = 560;
        setTimeout(() => burst(st.x, H - 120 * S), 200);
      }
    }
    const cfg = SECTIONS[current < 0 ? 0 : current];

    // caminar hacia su lugar
    const half = 100 * S;
    const tx = clamp(cfg.x * W, half + 10, W - half - 10);
    const dx = tx - st.x;
    if (REDUCED) st.x = tx;
    else {
      const speed = clamp(dx * 3.2, -620, 620);
      st.x += speed * dt;
      st.walking = Math.abs(speed) > 25 && st.jz === 0;
      if (st.walking) { st.walk += dt * Math.abs(speed) * .05; st.facing = Math.sign(dx); }
    }
    if (!st.walking) st.facing = st.x > W / 2 ? -1 : 1;

    // salto
    if (st.jv !== 0 || st.jz > 0) {
      st.jv -= 1700 * dt; st.jz += st.jv * dt;
      if (st.jz <= 0) {
        if (st.jv < -250) { st.squashV = -3.2; puff(st.x, H - 14); }
        st.jz = 0; st.jv = 0;
      }
    }
    // aterrizaje tras deslizarse
    if (prevFall > .35 && st.fall <= .35) { st.squashV = -2.6; puff(st.x, H - 14); }
    // resorte del aplastamiento
    st.squashV += (1 - st.squash) * 180 * dt; st.squashV *= Math.pow(.02, dt); st.squash += st.squashV * dt;

    // ocultar / asomarse
    st.peekAmt = lerp(st.peekAmt, st.peek ? 1 : 0, REDUCED ? 1 : .12);

    // entrada: cae desde arriba
    let introY = 0;
    if (!introDone) {
      const p = clamp((t - introStart) / 1.1, 0, 1);
      introY = -(1 - eBounce(p)) * (H + 200);
      if (p >= 1) { introDone = true; puff(st.x, H - 14); }
    }

    // pose y ánimo
    let pose = cfg.pose, mood = cfg.mood;
    if (st.fall > .35) pose = 'fall';
    else if (st.fall < -.35) pose = 'climb';
    else if (st.walking) pose = 'idle';
    if (t < st.excitedUntil || t < st.tapMoodUntil || st.jz > 0) mood = 'excited';
    if (!introDone) { pose = 'fall'; }

    // hacia dónde mira (ojos siguen al cursor)
    const groundY = H - 16;
    const bob = st.walking ? -Math.abs(Math.sin(st.walk)) * 5 : Math.sin(t * 3) * 3;
    const lift = Math.max(0, st.fall) * 26 * S * (1 + Math.sin(t * 6) * .15);
    const sink = st.peekAmt * 105 * S;
    const baseY = groundY - 20 * S - st.jz + introY - lift + sink + bob * S;
    const faceX = st.x, faceY = baseY - 56 * S;
    const look = {
      x: clamp((mouse.x - faceX) / 260, -1, 1) * st.facing,
      y: clamp((mouse.y - faceY) / 260, -1, 1),
    };

    // sombra
    const shadowK = clamp(1 - (st.jz + lift) / (160 * S), .3, 1);
    ctx.fillStyle = `rgba(0,0,0,${.4 * shadowK * (1 - st.peekAmt)})`;
    ctx.beginPath(); ctx.ellipse(st.x, groundY + 4, 55 * S * shadowK, 9 * S * shadowK, 0, 0, 7); ctx.fill();

    // Pixel
    ctx.save();
    ctx.translate(st.x, baseY);
    const tilt = st.walking ? Math.sin(st.walk) * .04 : st.fall * .08 * Math.sin(t * 5);
    ctx.rotate(tilt);
    ctx.scale(S * st.facing * (2 - st.squash), S * st.squash);
    drawPixel(t, { pose, mood, walk: st.walk, walking: st.walking, look });
    ctx.restore();

    // globo de pensamiento
    if (pose === 'think' && !st.peek) {
      ctx.fillStyle = 'rgba(240,237,230,.85)';
      for (let i = 0; i < 3; i++) {
        const k = (Math.sin(t * 3 - i) + 1) / 2;
        ctx.beginPath(); ctx.arc(st.x + st.facing * (40 + i * 16) * S, baseY - (140 + i * 22) * S, (3 + i * 2) * S * (.8 + k * .4), 0, 7); ctx.fill();
      }
    }

    // polvo
    dust = dust.filter(d => (d.life -= dt) > 0);
    dust.forEach(d => {
      d.x += d.vx * dt; d.y += d.vy * dt;
      ctx.fillStyle = `rgba(240,237,230,${d.life * .35})`;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r * (1.6 - d.life), 0, 7); ctx.fill();
    });
    // confeti
    confetti = confetti.filter(c => (c.life -= dt) > 0 && c.y < H + 40);
    confetti.forEach(c => {
      c.vy += 900 * dt; c.vx *= .99; c.x += c.vx * dt; c.y += c.vy * dt; c.rot += c.vr * dt;
      ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.rot);
      ctx.globalAlpha = Math.min(1, c.life);
      ctx.fillStyle = c.c; ctx.fillRect(-c.r, -c.r / 2, c.r * 2, c.r);
      ctx.restore();
    });
    ctx.globalAlpha = 1;

    // zona a borrar en el próximo cuadro
    if (confetti.length || dust.length || !introDone) dirty = { x: 0, y: 0, w: W, h: H };
    else {
      const pad = 150 * S + 24, y0 = Math.max(0, baseY - 260 * S);
      dirty = { x: st.x - pad, y: y0, w: pad * 2, h: H - y0 };
    }

    // zona clicable y globo siguen a Pixel
    const top = baseY - 135 * S, hw = 90 * S;
    hit.style.transform = `translate(${st.x - hw}px,${top}px)`;
    hit.style.width = `${hw * 2}px`;
    hit.style.height = `${Math.max(24, (groundY - top) - (st.peek ? sink : 0))}px`;
    if (bubble.classList.contains('show')) {
      const bw = bubbleSize.w, bh = bubbleSize.h;
      const left = clamp(st.x - bw / 2, 12, W - bw - 12);
      bubble.style.transform = `translate(${left}px,${top - bh - 14}px)`;
      bubble.style.setProperty('--tail', `${clamp(st.x - left, 18, bw - 18)}px`);
    }

    requestAnimationFrame(frame);
  }

  // arranque: cae desde arriba; el saludo lo dispara el bucle al aterrizar
  requestAnimationFrame(t => { last = t; introStart = t / 1000; frame(t); });
})();
