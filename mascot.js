/* ==========================================================
   PIXEL — la mascota de miguelposada.dev
   Una ventanita de navegador dibujada 100% en canvas que
   acompaña al usuario mientras baja por las secciones.
   ========================================================== */
(() => {
  'use strict';

  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const C = { lime: '#cbff00', line: '#cbff00', panel: '#131410', panel2: '#1f2119', dark: '#0b0c09' };
  const EN = document.documentElement.lang === 'en';
  const paused = () => document.documentElement.classList.contains('motion-off');
  const inkTheme = () => {
    const light = document.documentElement.dataset.theme === 'light';
    C.line = light ? '#587400' : C.lime;
    C.dust = light ? '23,24,15' : '240,237,230';
  };
  inkTheme();
  const CONFETTI = ['#cbff00', '#f0ede6', '#a78bfa', '#ff6b4a', '#4fd8eb'];

  // Qué hace Pixel en cada sección
  // Cada página puede definir sus propias frases con window.PIXEL_SECTIONS (ver build.mjs)
  const SECTIONS = window.PIXEL_SECTIONS || [
    { sel: '.hero', x: .9, pose: 'wave', mood: 'happy', say: '¡Hola! Soy Pixel, el asistente de Miguel. Baja conmigo ↓' },
    { sel: '#trabajo', x: .1, pose: 'point', mood: 'excited', say: 'Estos sitios ya están en línea, y Marea Rizada viene en camino.' },
    { sel: '#servicios', x: .9, pose: 'type', mood: 'happy', say: 'Diseño, código, tiendas online y soporte. Todo en un solo lugar.' },
    { sel: '#sobre-mi', x: .1, pose: 'think', mood: 'curious', say: '¿Código limpio y escalable? Así trabaja Miguel.' },
    { sel: '.process', x: .9, pose: 'idle', mood: 'happy', say: 'Cuatro pasos y tu página queda en línea.' },
    { sel: '#preguntas', x: .1, pose: 'think', mood: 'curious', say: '¿Dudas sobre precios o tiempos? Aquí están las respuestas.' },
    { sel: '#contacto', x: .86, pose: 'wave', mood: 'excited', say: 'Pagas 50% al empezar y 50% al entregar. ¡Escríbele a Miguel!', party: true },
  ];
  const TAPS = EN ? [
    'Haha, that tickles!',
    'I’m drawn with pure JavaScript. Not a single image.',
    'Miguel’s websites load fast, even on a phone.',
    'Optimized for Google and for any phone.',
    'Does your business have a website yet?',
    'Landing pages, online stores, web apps and technical SEO.',
  ] : [
    '¡Jaja, eso hace cosquillas!',
    'Me dibujaron con JavaScript puro. Ni una sola imagen.',
    'Las páginas de Miguel cargan rápido, hasta en celular.',
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
  // Sprite pequeño que se mueve con transform (GPU), en vez de un canvas de pantalla completa
  const SPRITE = { w: 360, h: 270, ox: 180, oy: 215 };
  const IDLE_MS = 66;      // quieto: ~15 cuadros por segundo
  const cv = document.createElement('canvas');
  cv.className = 'pixel-canvas';
  cv.setAttribute('aria-hidden', 'true');
  const ctx = cv.getContext('2d');

  const shadow = document.createElement('div');
  shadow.className = 'pixel-shadow';
  shadow.setAttribute('aria-hidden', 'true');

  const hit = document.createElement('button');
  hit.className = 'pixel-hit';
  hit.type = 'button';
  hit.setAttribute('aria-label', EN ? 'Pixel, the site mascot. Tap to hear from Pixel' : 'Pixel, la mascota de la página. Tócalo para que hable');

  const bubble = document.createElement('div');
  bubble.className = 'pixel-bubble';
  bubble.innerHTML = '<span class="pixel-name">Pixel</span><span class="pixel-text" aria-hidden="true"></span><span class="pixel-sr" role="status" aria-live="polite"></span><button type="button" class="pixel-close" aria-label="' + (EN ? 'Hide Pixel' : 'Ocultar a Pixel') + '">×</button>';
  const bubbleText = bubble.querySelector('.pixel-text');
  const bubbleSr = bubble.querySelector('.pixel-sr');
  const bubbleSize = { w: 0, h: 0 };
  new ResizeObserver(([e]) => {
    const b = e.borderBoxSize && e.borderBoxSize[0];
    bubbleSize.w = b ? b.inlineSize : bubble.offsetWidth;
    bubbleSize.h = b ? b.blockSize : bubble.offsetHeight;
  }).observe(bubble);

  document.body.append(shadow, cv, hit, bubble);

  /* ---------- estado ---------- */
  let W = 0, H = 0, S = .58, D = 1;
  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  const seen = store.get('pixel-seen') === '1';
  store.set('pixel-seen', '1');

  const st = {
    x: innerWidth * .9, facing: -1, walk: 0, walking: false,
    jz: 0, jv: 0,               // salto
    squash: 1, squashV: 0,      // aplastamiento al aterrizar
    fall: 0,                    // -1 trepando … 1 deslizándose
    peek: store.get('pixel-peek') === '1', peekAmt: 0,
    excitedUntil: 0, tapMoodUntil: 0,
  };
  st.peekAmt = st.peek ? 1 : 0;
  let current = -1, pending = -1, pendingSince = 0, lastScroll = scrollY, sv = 0;
  let introStart = 0, introDone = REDUCED || seen || st.peek || paused(); // la caída solo se ve una vez por visita
  const partied = new Set();
  let confetti = [], dust = [];

  /* ---------- planificador: 60 fps en movimiento, 15 quieto, 0 dormido ---------- */
  let raf = 0, idleTimer = 0, asleep = false, awakeUntil = 0, last = 0;
  function wake(ms = 6000) {
    if (paused()) { if (!raf) raf = requestAnimationFrame(frame); return; } // solo un cuadro, sin movimiento
    awakeUntil = Math.max(awakeUntil, performance.now() + ms);
    if (idleTimer) { clearTimeout(idleTimer); idleTimer = 0; }
    if (asleep) { asleep = false; last = performance.now(); }
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function resize() {
    W = innerWidth; H = innerHeight;
    S = W < 640 ? .42 : W < 1100 ? .5 : .58;
    D = Math.min(devicePixelRatio || 1, 2);
    const w = SPRITE.w * S, h = SPRITE.h * S;
    cv.width = Math.round(w * D); cv.height = Math.round(h * D);
    cv.style.width = `${w}px`; cv.style.height = `${h}px`;
    shadow.style.width = `${110 * S}px`; shadow.style.height = `${18 * S}px`;
    hit.style.width = `${180 * S}px`;
    if (fx && !fx.hidden) { fx.width = W; fx.height = H; }
    wake(1500);
  }

  addEventListener('pointermove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    if (asleep) wake(); else awakeUntil = Math.max(awakeUntil, performance.now() + 4000);
  }, { passive: true });
  addEventListener('scroll', () => wake(3000), { passive: true });

  /* ---------- globo de diálogo ---------- */
  let hideTimer = 0, typeTimer = 0;
  function say(text) {
    if (st.peek) return;
    clearTimeout(hideTimer); clearInterval(typeTimer);
    bubble.classList.add('show');
    bubbleSr.textContent = text;
    const visible = 4200 + text.length * 45;
    wake(visible);
    if (REDUCED) bubbleText.textContent = text;
    else {
      // el texto completo reserva su espacio (invisible) → el globo no cambia de tamaño
      let i = 0;
      bubbleText.innerHTML = '<span class="t"></span><span class="g"></span>';
      const tEl = bubbleText.firstChild, gEl = bubbleText.lastChild;
      gEl.textContent = text;
      typeTimer = setInterval(() => {
        i = Math.min(text.length, i + 2);
        tEl.textContent = text.slice(0, i); gEl.textContent = text.slice(i);
        if (i >= text.length) clearInterval(typeTimer);
      }, 40);
    }
    hideTimer = setTimeout(() => bubble.classList.remove('show'), visible);
  }
  function hush() { clearTimeout(hideTimer); clearInterval(typeTimer); bubble.classList.remove('show'); }

  bubble.querySelector('.pixel-close').addEventListener('click', () => {
    st.peek = true; store.set('pixel-peek', '1'); hush(); wake(1500);
  });

  let tapIdx = 0;
  hit.addEventListener('click', () => {
    if (st.peek) {
      st.peek = false; store.set('pixel-peek', '0'); wake();
      setTimeout(() => say(EN ? 'I’m back! Shall we continue?' : '¡Volví! ¿Seguimos?'), 350);
      return;
    }
    if (!REDUCED && !paused() && st.jz === 0) st.jv = 520;
    st.tapMoodUntil = performance.now() / 1000 + 1.6;
    say(TAPS[tapIdx++ % TAPS.length]);
  });

  // se emociona al pasar por un proyecto
  document.addEventListener('pointerover', e => {
    if (e.target.closest && e.target.closest('.project-shot')) { st.excitedUntil = performance.now() / 1000 + 1.4; wake(2500); }
  }, { passive: true });

  /* ---------- efectos: su canvas solo existe mientras hay partículas ---------- */
  let fx = null, fctx = null;
  function fxOn() {
    if (!fx) {
      fx = document.createElement('canvas');
      fx.className = 'pixel-fx'; fx.setAttribute('aria-hidden', 'true');
      fctx = fx.getContext('2d');
      document.body.append(fx);
    }
    if (fx.hidden || !fx.width) { fx.hidden = false; fx.width = W; fx.height = H; }
  }
  function fxOff() { if (fx && !fx.hidden) { fx.width = fx.height = 0; fx.hidden = true; } }
  function burst(x, y) {
    if (REDUCED || paused()) return;
    fxOn();
    const n = W < 640 ? 30 : 54;
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (Math.random() - .5) * 2.2, v = 300 + Math.random() * 520;
      confetti.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: 3 + Math.random() * 4, rot: Math.random() * 6, vr: (Math.random() - .5) * 12, c: CONFETTI[i % CONFETTI.length], life: 2.6 });
    }
    wake(3000);
  }
  function puff(x, y) {
    if (REDUCED || paused()) return;
    fxOn();
    for (let i = 0; i < 7; i++) dust.push({ x: x + (Math.random() - .5) * 60 * S, y, vx: (Math.random() - .5) * 120, vy: -Math.random() * 60, r: 3 + Math.random() * 5, life: .6 });
  }

  /* ---------- sección activa (sin medir el layout) ---------- */
  const els = SECTIONS.map(s => document.querySelector(s.sel));
  const crossing = new Set();
  let activeIdx = 0;
  const sectionIO = new IntersectionObserver(entries => {
    for (const e of entries) {
      const i = els.indexOf(e.target);
      if (e.isIntersecting) crossing.add(i); else crossing.delete(i);
    }
    if (crossing.size) activeIdx = Math.max(...crossing);
    wake(3000);
  }, { rootMargin: '-55% 0px -44% 0px' });
  els.forEach(el => el && sectionIO.observe(el));

  /* ---------- dibujo de Pixel (coordenadas locales, mira a la derecha) ---------- */
  function rr(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function drawPixel(t, o) {
    const { pose, mood } = o;
    ctx.strokeStyle = C.line; ctx.fillStyle = C.line;
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
    ctx.lineWidth = 5; ctx.strokeStyle = C.line; ctx.stroke();
    ctx.fillStyle = C.panel2; rr(-69, -122, 138, 22, 17); ctx.fill();
    ['#ff6b5e', '#ffc93d', C.lime].forEach((c, i) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(-52 + i * 14, -111, 4.5, 0, 7); ctx.fill(); });

    // pantalla-cara
    rr(-58, -94, 116, 76, 12); ctx.fillStyle = C.lime; ctx.fill();
    const blink = o.sleep || (t % 3.3) < .12;
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
    ctx.fillStyle = C.line;
    for (const p of [L[1], R[1]]) { ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, 7); ctx.fill(); }
  }

  /* ---------- bucle ---------- */
  const placed = new Map();
  function place(el, css) { if (placed.get(el) !== css) { placed.set(el, css); el.style.transform = css; } }

  function frame(now) {
    raf = 0;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    const t = now / 1000;
    if (!introStart) introStart = t;

    // velocidad de scroll → deslizarse / trepar
    const rawV = (scrollY - lastScroll) / Math.max(dt, .001);
    lastScroll = scrollY;
    sv = lerp(sv, rawV, .12);
    const prevFall = st.fall;
    st.fall = REDUCED ? 0 : lerp(st.fall, clamp(sv / 1100, -1, 1), .15);

    // sección activa (se confirma tras 0.45 s para no hablar mientras pasa rápido)
    if (activeIdx !== pending) { pending = activeIdx; pendingSince = t; }
    if (pending !== current && t - pendingSince > .45 && introDone) {
      current = pending;
      const c = SECTIONS[current];
      say(c.say);
      if (c.party && !partied.has(current)) {
        partied.add(current);
        if (!REDUCED && !paused()) st.jv = 560;
        setTimeout(() => burst(st.x, H - 120 * S), 200);
      }
    }
    const cfg = SECTIONS[current < 0 ? 0 : current];

    // caminar hacia su lugar
    const half = 100 * S;
    const tx = clamp(cfg.x * W, half + 10, W - half - 10);
    let dx = tx - st.x;
    if (paused()) { dx = 0; st.walking = false; }
    else if (REDUCED || Math.abs(dx) < 1) { st.x = tx; dx = 0; st.walking = false; }
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
    const peekTarget = st.peek ? 1 : 0;
    st.peekAmt = lerp(st.peekAmt, peekTarget, REDUCED ? 1 : .12);

    // entrada: cae desde arriba
    let introY = 0;
    if (!introDone) {
      const p = clamp((t - introStart) / 1.1, 0, 1);
      introY = -(1 - eBounce(p)) * (H + 200);
      if (p >= 1) { introDone = true; puff(st.x, H - 14); }
    }

    // ¿hay algo moviéndose?
    const busy = !paused() && (!introDone || pending !== current || dx !== 0 || st.jz > 0 || st.jv !== 0
      || (!REDUCED && (Math.abs(st.fall) > .015 || Math.abs(sv) > 5 || Math.abs(st.squash - 1) > .004 || Math.abs(st.squashV) > .02))
      || Math.abs(st.peekAmt - peekTarget) > .004 || confetti.length > 0 || dust.length > 0);
    const sleeping = paused() || (!busy && !REDUCED && performance.now() > awakeUntil);

    // pose y ánimo
    let pose = cfg.pose, mood = cfg.mood;
    if (st.fall > .35) pose = 'fall';
    else if (st.fall < -.35) pose = 'climb';
    else if (st.walking) pose = 'idle';
    if (t < st.excitedUntil || t < st.tapMoodUntil || st.jz > 0) mood = 'excited';
    if (!introDone) pose = 'fall';
    if (sleeping) { pose = 'idle'; mood = 'happy'; }

    // hacia dónde mira (ojos siguen al cursor)
    const groundY = H - 16;
    const bob = st.walking ? -Math.abs(Math.sin(st.walk)) * 5 : sleeping ? 0 : Math.sin(t * 3) * 3;
    const lift = Math.max(0, st.fall) * 26 * S * (1 + Math.sin(t * 6) * .15);
    const sink = st.peekAmt * 105 * S;
    const baseY = groundY - 20 * S - st.jz + introY - lift + sink + bob * S;
    const look = sleeping ? { x: 0, y: 0 } : {
      x: clamp((mouse.x - st.x) / 260, -1, 1) * st.facing,
      y: clamp((mouse.y - (baseY - 56 * S)) / 260, -1, 1),
    };

    // sombra (elemento CSS)
    const shadowK = clamp(1 - (st.jz + lift) / (160 * S), .3, 1);
    place(shadow, `translate3d(${(st.x - 55 * S).toFixed(1)}px,${(groundY + 4 - 9 * S).toFixed(1)}px,0) scale(${shadowK.toFixed(2)})`);
    const op = (shadowK * (1 - st.peekAmt)).toFixed(2);
    if (placed.get('op') !== op) { placed.set('op', op); shadow.style.opacity = op; }

    // Pixel (dibujado en su sprite, movido con transform)
    place(cv, `translate3d(${(st.x - SPRITE.ox * S).toFixed(1)}px,${(baseY - SPRITE.oy * S).toFixed(1)}px,0)`);
    const k = D * S;
    ctx.setTransform(k, 0, 0, k, SPRITE.ox * k, SPRITE.oy * k);
    ctx.clearRect(-SPRITE.ox, -SPRITE.oy, SPRITE.w, SPRITE.h);
    ctx.rotate(st.walking ? Math.sin(st.walk) * .04 : st.fall * .08 * Math.sin(t * 5));
    ctx.scale(st.facing * (2 - st.squash), st.squash);
    drawPixel(t, { pose, mood, walk: st.walk, walking: st.walking, look, sleep: sleeping });

    // globo de pensamiento
    if (pose === 'think' && !st.peek) {
      ctx.setTransform(k, 0, 0, k, SPRITE.ox * k, SPRITE.oy * k);
      ctx.fillStyle = 'rgba(240,237,230,.85)';
      for (let i = 0; i < 3; i++) {
        const b = (Math.sin(t * 3 - i) + 1) / 2;
        ctx.beginPath(); ctx.arc(st.facing * (40 + i * 16), -(140 + i * 22), (3 + i * 2) * (.8 + b * .4), 0, 7); ctx.fill();
      }
    }

    // partículas
    if (confetti.length || dust.length) {
      fctx.clearRect(0, 0, W, H);
      dust = dust.filter(d => (d.life -= dt) > 0);
      for (const d of dust) {
        d.x += d.vx * dt; d.y += d.vy * dt;
        fctx.fillStyle = `rgba(${C.dust},${d.life * .35})`;
        fctx.beginPath(); fctx.arc(d.x, d.y, d.r * (1.6 - d.life), 0, 7); fctx.fill();
      }
      confetti = confetti.filter(c => (c.life -= dt) > 0 && c.y < H + 40);
      for (const c of confetti) {
        c.vy += 900 * dt; c.vx *= .99; c.x += c.vx * dt; c.y += c.vy * dt; c.rot += c.vr * dt;
        fctx.save(); fctx.translate(c.x, c.y); fctx.rotate(c.rot);
        fctx.globalAlpha = Math.min(1, c.life);
        fctx.fillStyle = c.c; fctx.fillRect(-c.r, -c.r / 2, c.r * 2, c.r);
        fctx.restore();
      }
      if (!confetti.length && !dust.length) fxOff();
    }

    // zona clicable y globo siguen a Pixel
    const top = baseY - 135 * S, hw = 90 * S;
    place(hit, `translate3d(${(st.x - hw).toFixed(1)}px,${top.toFixed(1)}px,0)`);
    const hh = `${Math.max(24, (groundY - top) - (st.peek ? sink : 0)).toFixed(0)}px`;
    if (placed.get('hh') !== hh) { placed.set('hh', hh); hit.style.height = hh; }
    if (bubble.classList.contains('show')) {
      const bw = bubbleSize.w, bh = bubbleSize.h;
      const left = clamp(st.x - bw / 2, 12, W - bw - 12);
      place(bubble, `translate3d(${left.toFixed(1)}px,${(top - bh - 14).toFixed(1)}px,0)`);
      const tail = `${clamp(st.x - left, 18, bw - 18).toFixed(0)}px`;
      if (placed.get('tail') !== tail) { placed.set('tail', tail); bubble.style.setProperty('--tail', tail); }
    }

    // siguiente cuadro
    if (busy) raf = requestAnimationFrame(frame);
    else if (sleeping || REDUCED) asleep = true;
    else idleTimer = setTimeout(() => { idleTimer = 0; raf = requestAnimationFrame(frame); }, IDLE_MS);
  }

  // arranque
  addEventListener('themechange', () => { inkTheme(); wake(1500); });
  addEventListener('motionchange', e => {
    if (e.detail) { confetti = []; dust = []; fxOff(); st.jz = st.jv = st.squashV = st.fall = sv = 0; st.squash = 1; }
    wake(3000);
  });
  addEventListener('resize', resize, { passive: true });
  last = performance.now();
  resize();
})();
