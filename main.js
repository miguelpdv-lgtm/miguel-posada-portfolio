/* ==========================================================
   MIGUEL POSADA — hand-drawn canvas animations (no libraries)
   ========================================================== */
(() => {
  'use strict';

  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const MINT = '202,255,0';
  const MINT_HI = '228,255,107';
  const CREAM = '240,237,230';
  const CYAN = '79,216,235';
  const VIOLET = '167,139,250';
  const CORAL = '255,107,74';
  const ACCENTS = [MINT, CYAN, VIOLET, CORAL];
  const pick = a => a[Math.random() * a.length | 0];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = t => 1 - Math.pow(1 - t, 3);
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  /* ---------- seeded rng + value noise ---------- */
  function rng(seed) {
    return () => {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  const hash = (x, y) => {
    const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return s - Math.floor(s);
  };
  function noise(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return lerp(lerp(a, b, u), lerp(c, d, u), v);
  }

  /* ---------- global pointer ---------- */
  const mouse = { x: -9999, y: -9999, active: false };
  addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true; }, { passive: true });
  document.addEventListener('pointerleave', () => { mouse.active = false; mouse.x = mouse.y = -9999; });

  /* ---------- canvas helper + render loop ---------- */
  const components = [];
  function fit(canvas, ctx) {
    const r = canvas.getBoundingClientRect();
    const d = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(r.width * d));
    canvas.height = Math.max(1, Math.round(r.height * d));
    ctx.setTransform(d, 0, 0, d, 0, 0);
    return { w: r.width, h: r.height };
  }
  /** register(canvas, {setup(w,h), draw(ctx, t, dt, w, h)}) — only draws while visible */
  const boxes = new WeakMap();
  const fixedEl = el => getComputedStyle(el).position === 'fixed';
  function measure(c) {
    const r = c.canvas.getBoundingClientRect();
    const fixed = c.fixed ?? (c.fixed = fixedEl(c.canvas));
    boxes.set(c.canvas, { l: r.left, t: r.top + (fixed ? 0 : scrollY), w: r.width, h: r.height, fixed });
  }
  function register(canvas, api) {
    if (!canvas) return null; // la página no tiene este canvas
    const ctx = canvas.getContext('2d');
    const c = { canvas, ctx, api, visible: false, w: 0, h: 0 };
    const resize = () => {
      const s = fit(canvas, ctx);
      c.w = s.w; c.h = s.h;
      measure(c);
      api.setup && api.setup(c.w, c.h, ctx);
      if (REDUCED) api.draw(ctx, 2, 0, c.w, c.h);
    };
    new ResizeObserver(resize).observe(canvas);
    new IntersectionObserver(([e]) => { c.visible = e.isIntersecting; }, { rootMargin: '80px' }).observe(canvas);
    components.push(c);
    return c;
  }
  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = now / 1000;
    for (const c of components) {
      if (!c.visible || !c.w) continue;
      c.ctx.clearRect(0, 0, c.w, c.h);
      c.api.draw(c.ctx, t, dt, c.w, c.h);
    }
    requestAnimationFrame(loop);
  }
  if (!REDUCED) requestAnimationFrame(loop);

  // re-medir cuando cambia el layout (fuentes, imágenes, resize)
  let remeasureQueued = false;
  const remeasure = () => {
    if (remeasureQueued) return;
    remeasureQueued = true;
    requestAnimationFrame(() => { remeasureQueued = false; components.forEach(measure); });
  };
  new ResizeObserver(remeasure).observe(document.body);
  addEventListener('load', remeasure);

  /* canvas-local mouse (usa las posiciones en caché) */
  const local = el => {
    const b = boxes.get(el);
    if (!b) return { x: -9999, y: -9999, inside: false };
    const top = b.fixed ? b.t : b.t - scrollY;
    const x = mouse.x - b.l, y = mouse.y - top;
    return { x, y, inside: x >= 0 && x <= b.w && y >= 0 && y <= b.h };
  };

  /* ==========================================================
     1. BACKGROUND — blueprint grid with circuit pulses
     ========================================================== */
  (() => {
    const canvas = $('#bg-canvas');
    const CELL = 64;
    let pulses = [];
    let spawn = 0;
    const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const grid = document.createElement('canvas');
    const c = register(canvas, {
      setup(w, h) {
        pulses = [];
        const d = Math.min(devicePixelRatio || 1, 2);
        grid.width = Math.round(w * d); grid.height = Math.round((h + CELL) * d);
        const g = grid.getContext('2d');
        g.setTransform(d, 0, 0, d, 0, 0);
        g.lineWidth = 1;
        g.strokeStyle = `rgba(${CREAM},.028)`;
        g.beginPath();
        for (let x = 0; x <= w + CELL; x += CELL) { g.moveTo(x + .5, 0); g.lineTo(x + .5, h + CELL); }
        for (let y = 0; y <= h + CELL; y += CELL) { g.moveTo(0, y + .5); g.lineTo(w, y + .5); }
        g.stroke();
      },
      draw(ctx, t, dt, w, h) {
        const oy = -(scrollY * 0.25) % CELL;
        const cols = Math.ceil(w / CELL) + 1, rows = Math.ceil(h / CELL) + 2;
        const gy0 = Math.floor(scrollY * 0.25 / CELL);

        ctx.drawImage(grid, 0, oy, w, h + CELL);

        // intersections light up around the cursor
        if (mouse.active) {
          const R = 190;
          for (let i = 0; i <= cols; i++) for (let j = 0; j <= rows; j++) {
            const x = i * CELL, y = j * CELL + oy;
            const d = Math.hypot(x - mouse.x, y - mouse.y);
            if (d > R) continue;
            const a = (1 - d / R) * .55, s = 2 + (1 - d / R) * 3;
            ctx.strokeStyle = `rgba(${MINT},${a})`;
            ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x + s, y); ctx.moveTo(x, y - s); ctx.lineTo(x, y + s); ctx.stroke();
          }
        }

        // circuit pulses travel along grid lines, living in grid space
        spawn -= dt;
        if (spawn <= 0 && pulses.length < 9) {
          spawn = .5 + Math.random() * .9;
          const d = DIRS[Math.random() * 4 | 0];
          pulses.push({ col: pick(ACCENTS), trail: [[Math.random() * cols | 0, gy0 + (Math.random() * rows | 0)]], d, p: 0, life: 3 + Math.random() * 3, speed: 3 + Math.random() * 3 });
        }
        pulses = pulses.filter(pl => (pl.life -= dt) > 0);
        for (const pl of pulses) {
          pl.p += dt * pl.speed;
          while (pl.p >= 1) {
            pl.p -= 1;
            const [x, y] = pl.trail[pl.trail.length - 1];
            pl.trail.push([x + pl.d[0], y + pl.d[1]]);
            if (pl.trail.length > 7) pl.trail.shift();
            if (Math.random() < .3) { const nd = DIRS[Math.random() * 4 | 0]; if (nd[0] !== -pl.d[0] || nd[1] !== -pl.d[1]) pl.d = nd; }
          }
          const fade = Math.min(1, pl.life);
          const pts = pl.trail.map(([x, y]) => [x * CELL, (y - gy0) * CELL + oy]);
          const [lx, ly] = pts[pts.length - 1];
          const head = [lx + pl.d[0] * CELL * pl.p, ly + pl.d[1] * CELL * pl.p];
          pts.push(head);
          for (let i = 1; i < pts.length; i++) {
            ctx.strokeStyle = `rgba(${pl.col},${(i / pts.length) * .32 * fade})`;
            ctx.beginPath(); ctx.moveTo(pts[i - 1][0] + .5, pts[i - 1][1] + .5); ctx.lineTo(pts[i][0] + .5, pts[i][1] + .5); ctx.stroke();
          }
          ctx.fillStyle = `rgba(${pl.col},${.85 * fade})`;
          ctx.fillRect(head[0] - 1.5, head[1] - 1.5, 3, 3);
        }
      }
    });
    c.visible = true;
  })();

  /* ==========================================================
     2. CURSOR — crosshair with live coordinates
     ========================================================== */
  (() => {
    if (!FINE || REDUCED) return;
    const cur = $('.cursor'), label = $('.cursor-label');
    document.body.classList.add('has-cursor');
    let x = 0, y = 0;
    const pad = n => String(Math.max(0, Math.round(n))).padStart(4, '0');
    (function tick() {
      x = lerp(x, mouse.x, .35); y = lerp(y, mouse.y, .35);
      cur.style.transform = `translate3d(${x}px,${y}px,0)`;
      cur.classList.toggle('on', mouse.active);
      label.textContent = `${pad(mouse.x)} · ${pad(mouse.y + scrollY)}`;
      requestAnimationFrame(tick);
    })();
    document.addEventListener('pointerover', e => cur.classList.toggle('hover', !!e.target.closest('a,button,.tilt')));
  })();

  /* ==========================================================
     3. TEXT SCRAMBLE
     ========================================================== */
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_#';
  function scramble(el, dur = 800) {
    if (REDUCED) return;
    const final = el.dataset.text || (el.dataset.text = el.textContent);
    const start = performance.now();
    cancelAnimationFrame(el._scr);
    const step = now => {
      const p = clamp((now - start) / dur, 0, 1);
      const reveal = Math.floor(p * final.length);
      let out = '';
      for (let i = 0; i < final.length; i++) {
        const ch = final[i];
        out += i < reveal || ch === ' ' ? ch : GLYPHS[Math.random() * GLYPHS.length | 0];
      }
      el.textContent = out;
      if (p < 1) el._scr = requestAnimationFrame(step);
    };
    el._scr = requestAnimationFrame(step);
  }
  $$('[data-scramble]').forEach(el => el.addEventListener('pointerenter', () => scramble(el, 600)));
  $$('.nav a').forEach(el => el.addEventListener('pointerenter', () => scramble(el, 420)));

  /* ==========================================================
     4. REVEAL ON SCROLL
     ========================================================== */
  const io = new IntersectionObserver(entries => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const el = e.target;
      el.classList.add(el.classList.contains('reveal') ? 'in' : 'in-view');
      if (el.matches('[data-scramble]')) scramble(el);
      el.dispatchEvent(new CustomEvent('revealed'));
      io.unobserve(el);
    }
  }, { threshold: .15, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal, .section, .hero, .site-header, .cta-build, .ide').forEach(el => io.observe(el));
  // stagger siblings in the same grid
  $$('.project-grid, .service-grid, .process-grid').forEach(g => $$('.reveal', g).forEach((el, i) => el.style.transitionDelay = `${i * .12}s`));

  requestAnimationFrame(() => {
    $('.hero-title')?.classList.add('in');
    scramble($('.logo span'), 900);
  });

  /* ---------- mobile menu ---------- */
  const menuBtn = $('.menu-btn'), nav = $('#nav');
  if (menuBtn && nav)
  menuBtn.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') !== 'true';
    menuBtn.setAttribute('aria-expanded', open);
    nav.classList.toggle('open', open);
  });
  $$('a', nav).forEach(a => a.addEventListener('click', () => { menuBtn.setAttribute('aria-expanded', 'false'); nav.classList.remove('open'); }));

  /* ==========================================================
     5. TYPEWRITER (token-coloured)
     ========================================================== */
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  async function type(el, tokens, speed = 28) {
    const caret = '<span class="caret"></span>';
    let html = '';
    for (const [text, cls] of tokens) {
      for (const ch of text) {
        const c = esc(ch);
        html += cls ? `<span class="${cls}">${c}</span>` : c;
        el.innerHTML = html + caret;
        if (!REDUCED) await sleep(ch === '\n' ? speed * 4 : speed + Math.random() * speed * .6);
      }
    }
    return html;
  }
  async function erase(el, speed = 8) {
    let text = el.textContent;
    while (text.length) {
      text = text.slice(0, -3);
      el.innerHTML = esc(text) + '<span class="caret"></span>';
      await sleep(speed);
    }
  }

  // hero config object — cycles through project types
  (async () => {
    const el = $('#hero-code');
    if (!el) return;
    const variants = [
      ['sitio web', 'true', 'tus clientes'],
      ['tienda online', 'true', 'más ventas'],
      ['web app', 'true', 'equipos felices'],
    ];
    let i = 0;
    await sleep(900);
    for (;;) {
      const [name, perf, users] = variants[i++ % variants.length];
      await type(el, [
        ['const ', 'tk-k'], ['app', 'tk-f'], [' = {\n'],
        ['  tipo: '], [`'${name}'`, 'tk-s'], [',\n'],
        ['  rendimiento: '], [perf, 'tk-n'], [',\n'],
        ['  usuarios: '], [`'${users}'`, 'tk-s'], ['\n}'],
      ], 34);
      if (REDUCED) return;
      await sleep(3800);
      await erase(el);
      await sleep(350);
    }
  })();

  // IDE — types once when visible
  $('.ide')?.addEventListener('revealed', () => {
    type($('#ide-code'), [
      ['export function ', 'tk-k'], ['crearSitioWeb', 'tk-f'], ['() {\n'],
      ['    return ', 'tk-k'], ['{\n'],
      ['      rendimiento: '], ['true', 'tk-n'], [',\n'],
      ['      seo: '], ['true', 'tk-n'], [',\n'],
      ['      resultados: '], ["'más clientes'", 'tk-s'], ['\n'],
      ['    }\n'], ['}'],
    ], 22);
  });

  /* ==========================================================
     6. HERO BLUEPRINT — construction lines, data packets
     ========================================================== */
  (() => {
    const canvas = $('#hero-canvas'), vis = $('#hero-visual');
    if (!canvas || !vis) return;
    const nodes = {};
    $$('[data-node]', vis).forEach(n => nodes[n.dataset.node] = n);
    let routes = [], marks = [], born = performance.now() / 1000, packets = [], spawnT = 0;

    function rectOf(el, base) {
      const r = el.getBoundingClientRect();
      return { l: r.left - base.left, t: r.top - base.top, r: r.right - base.left, b: r.bottom - base.top, cx: (r.left + r.right) / 2 - base.left, cy: (r.top + r.bottom) / 2 - base.top };
    }
    function pathLen(p) { let L = 0; for (let i = 1; i < p.length; i++) L += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return L; }
    function pointAt(p, t) {
      const L = pathLen(p) * clamp(t, 0, 1);
      let acc = 0;
      for (let i = 1; i < p.length; i++) {
        const s = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
        if (acc + s >= L) { const k = s ? (L - acc) / s : 0; return [lerp(p[i - 1][0], p[i][0], k), lerp(p[i - 1][1], p[i][1], k)]; }
        acc += s;
      }
      return p[p.length - 1];
    }
    function strokePartial(ctx, p, t) {
      if (t <= 0) return;
      const L = pathLen(p) * t;
      let acc = 0;
      ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]);
      for (let i = 1; i < p.length; i++) {
        const s = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]);
        if (acc + s >= L) { const k = (L - acc) / s; ctx.lineTo(lerp(p[i - 1][0], p[i][0], k), lerp(p[i - 1][1], p[i][1], k)); break; }
        ctx.lineTo(p[i][0], p[i][1]); acc += s;
      }
      ctx.stroke();
    }

    const c = register(canvas, {
      setup(w, h) {
        const base = canvas.getBoundingClientRect();
        const B = rectOf(nodes.browser, base), C = rectOf(nodes.code, base);
        const F = rectOf(nodes.front, base), A = rectOf(nodes.api, base), D = rectOf(nodes.db, base);
        const V = rectOf(vis, base);
        const xr = V.r - 2;
        routes = [
          { p: [[B.r, A.cy], [A.l, A.cy]], hit: 'api', solid: true },
          { p: [[A.cx, A.b], [A.cx, D.t]], hit: 'db', solid: true },
          { p: [[D.r, D.cy], [xr, D.cy], [xr, F.cy], [F.r, F.cy]], hit: 'front', solid: true },
          { p: [[F.cx, F.t], [F.cx, C.b]], hit: 'code', solid: true },
          { p: [[A.r, A.cy], [xr, A.cy]], solid: true },
          { p: [[F.cx, F.b], [A.cx, A.t]], hit: 'api', solid: true },
        ];
        // construction / dimension lines (dashed)
        const L = B.l - 16, bottom = V.b + 2;
        marks = [
          { p: [[L, V.t - 4], [L, bottom + 6]] },
          { p: [[L - 6, bottom], [V.r + 2, bottom]] },
          { p: [[B.l - 30, B.t], [B.l, B.t]] },
          { p: [[C.l, C.t - 12], [C.l, C.t]] },
          { p: [[B.r, B.t - 18], [B.r, B.t]] },
        ];
        c.geo = { B, C, V, L, bottom, xr };
        born = performance.now() / 1000;
      },
      draw(ctx, t, dt, w, h) {
        const g = c.geo; if (!g) return;
        const age = t - born;
        const k = REDUCED ? 1 : ease(clamp(age / 1.8, 0, 1));

        // micro-grid behind the top-left corner of the browser
        ctx.strokeStyle = `rgba(${VIOLET},.25)`; ctx.lineWidth = 1;
        const gx = g.B.l - 14, gy = g.B.t - 26, gs = 10;
        ctx.beginPath();
        for (let i = 0; i <= 7; i++) { ctx.moveTo(gx + i * gs, gy); ctx.lineTo(gx + i * gs, gy + gs * 2.4 * k); }
        for (let j = 0; j <= 2; j++) { ctx.moveTo(gx, gy + j * gs); ctx.lineTo(gx + 70 * k, gy + j * gs); }
        ctx.stroke();

        // dashed construction
        ctx.setLineDash([3, 4]); ctx.lineDashOffset = -t * 8;
        ctx.strokeStyle = `rgba(${CREAM},.3)`;
        marks.forEach(m => strokePartial(ctx, m.p, k));
        ctx.setLineDash([]);

        // crosshair marks
        const plus = (x, y, s = 6) => { ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x + s, y); ctx.moveTo(x, y - s); ctx.lineTo(x, y + s); ctx.stroke(); };
        ctx.strokeStyle = `rgba(${CORAL},${.9 * k})`;
        plus(g.L, g.V.t + 6); plus(g.L, g.bottom); plus(g.V.r + 2, g.bottom);

        // tiny dimension label
        ctx.font = '500 8px "JetBrains Mono", monospace';
        ctx.fillStyle = `rgba(${CREAM},${.4 * k})`;
        ctx.fillText(`FIG.01 — ${Math.round(g.B.r - g.B.l)} × ${Math.round(g.B.b - g.B.t)}`, g.L + 8, g.bottom - 6);

        // connector routes
        ctx.strokeStyle = `rgba(${CREAM},.38)`; ctx.lineWidth = 1;
        routes.forEach((r, i) => strokePartial(ctx, r.p, ease(clamp((age - .6 - i * .12) / 1, 0, 1))));

        // packets
        if (!REDUCED && age > 1.8) {
          spawnT -= dt;
          if (spawnT <= 0) {
            spawnT = .9 + Math.random() * .8;
            const chain = [0, 1, 2, 3];
            packets.push({ chain, i: 0, p: 0 });
            if (Math.random() < .5) packets.push({ chain: [5, 1], i: 0, p: 0, small: true });
          }
          packets = packets.filter(pk => {
            const r = routes[pk.chain[pk.i]];
            pk.p += dt * (220 / Math.max(20, pathLen(r.p)));
            if (pk.p >= 1) {
              if (r.hit && nodes[r.hit]) flash(nodes[r.hit]);
              pk.p = 0; pk.i++;
              if (pk.i >= pk.chain.length) return false;
            }
            const rr = routes[pk.chain[pk.i]];
            const pc = HIT_COL[rr.hit] || MINT;
            // glow trail
            for (let s = 0; s < 6; s++) {
              const [x, y] = pointAt(rr.p, pk.p - s * .035);
              ctx.fillStyle = `rgba(${pc},${(1 - s / 6) * (pk.small ? .5 : .95)})`;
              const sz = (pk.small ? 2.2 : 3.2) * (1 - s / 8);
              ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz);
            }
            return true;
          });
        }

        // blueprint guides follow the cursor
        const m = local(canvas);
        if (m.inside && !REDUCED) {
          ctx.setLineDash([2, 5]);
          ctx.strokeStyle = `rgba(${CREAM},.22)`;
          ctx.beginPath(); ctx.moveTo(m.x, 0); ctx.lineTo(m.x, h); ctx.moveTo(0, m.y); ctx.lineTo(w, m.y); ctx.stroke();
          ctx.setLineDash([]);
          ctx.strokeStyle = `rgba(${MINT},.9)`;
          ctx.strokeRect(m.x - 4, m.y - 4, 8, 8);
          ctx.fillStyle = `rgba(${MINT},.8)`;
          ctx.fillText(`x:${Math.round(m.x)} y:${Math.round(m.y)}`, m.x + 9, m.y - 8);
        }
      }
    });
    const HIT_COL = { api: VIOLET, db: CORAL, front: CYAN, code: MINT };
    function flash(el) {
      el.classList.add('hit');
      clearTimeout(el._hit);
      el._hit = setTimeout(() => el.classList.remove('hit'), 260);
      if (el.dataset.node === 'code' || el.dataset.node === 'browser') {
        el.style.borderColor = `rgb(${MINT})`;
        setTimeout(() => el.style.borderColor = '', 260);
      }
    }
  })();

  /* ==========================================================
     10. SERVICE GLYPHS — tiny living line icons
     ========================================================== */
  $$('canvas.service-glyph').forEach(canvas => {
    const kind = canvas.dataset.glyph;
    let col = MINT;
    register(canvas, {
      setup() { col = (getComputedStyle(canvas).color.match(/\d+/g) || [203, 255, 0]).slice(0, 3).join(','); },
      draw(ctx, t, dt, w, h) {
        ctx.strokeStyle = `rgba(${col},.95)`; ctx.fillStyle = `rgba(${col},.95)`;
        ctx.lineWidth = 1; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        const c = w / 2;
        if (kind === 'design') {
          const hx = c + Math.cos(t * 1.4) * 8, hy = 8 + Math.sin(t * 1.4) * 5;
          ctx.beginPath(); ctx.moveTo(5, h - 7); ctx.bezierCurveTo(hx, hy, hx, hy, w - 5, h - 7); ctx.stroke();
          ctx.strokeStyle = `rgba(${col},.45)`;
          ctx.beginPath(); ctx.moveTo(5, h - 7); ctx.lineTo(hx, hy); ctx.lineTo(w - 5, h - 7); ctx.stroke();
          ctx.strokeRect(2.5, h - 9.5, 5, 5); ctx.strokeRect(w - 7.5, h - 9.5, 5, 5);
          ctx.beginPath(); ctx.arc(hx, hy, 2, 0, 7); ctx.fill();
        } else if (kind === 'dev') {
          const s = 3 + Math.sin(t * 2) * 2.5;
          ctx.beginPath();
          ctx.moveTo(c - 6 - s, c - 7); ctx.lineTo(c - 12 - s, c); ctx.lineTo(c - 6 - s, c + 7);
          ctx.moveTo(c + 6 + s, c - 7); ctx.lineTo(c + 12 + s, c); ctx.lineTo(c + 6 + s, c + 7);
          ctx.stroke();
          if ((t * 2 | 0) % 2) ctx.fillRect(c - 1, c - 6, 2, 12);
        } else if (kind === 'shop') {
          ctx.beginPath(); ctx.moveTo(8, 13); ctx.lineTo(w - 8, 13); ctx.lineTo(w - 10, h - 5); ctx.lineTo(10, h - 5); ctx.closePath(); ctx.stroke();
          ctx.beginPath(); ctx.arc(c, 13, 5, Math.PI, 0); ctx.stroke();
          const p = (t * .8) % 1, y = lerp(-4, 20, ease(Math.min(1, p * 1.6)));
          ctx.globalAlpha = p > .75 ? (1 - p) * 4 : 1;
          ctx.beginPath(); ctx.arc(c, y, 2.5, 0, 7); ctx.fill();
          ctx.globalAlpha = 1;
        } else if (kind === 'care') {
          const teeth = 8, rO = 11, rI = 8.5, rot = t * .8;
          ctx.beginPath();
          for (let i = 0; i < teeth * 2; i++) {
            const a0 = rot + i * Math.PI / teeth, r = i % 2 ? rI : rO;
            ctx.lineTo(c + Math.cos(a0) * r, c + Math.sin(a0) * r);
            ctx.lineTo(c + Math.cos(a0 + Math.PI / teeth) * r, c + Math.sin(a0 + Math.PI / teeth) * r);
          }
          ctx.closePath(); ctx.stroke();
          ctx.beginPath(); ctx.arc(c, c, 3.5, 0, 7); ctx.stroke();
        }
      }
    });
  });

  /* ==========================================================
     11. PIPELINE — signal travels Business → Deployment
     ========================================================== */
  (async () => {
    const pipe = $('#pipeline');
    if (!pipe) return;
    const boxes = $$('.pipe-box', pipe), arrows = $$('.pipe-arrow', pipe);
    const sparks = arrows.map(a => { const s = document.createElement('span'); s.className = 'spark'; a.appendChild(s); return s; });
    let visible = false;
    new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(pipe);
    if (REDUCED) return;
    for (;;) {
      if (!visible) { await sleep(400); continue; }
      for (let i = 0; i < boxes.length; i++) {
        boxes[i].classList.add('hit');
        await sleep(380);
        boxes[i].classList.remove('hit');
        if (sparks[i] && sparks[i].offsetParent) {
          const s = sparks[i];
          s.animate([{ left: '10%', opacity: 0 }, { left: '30%', opacity: 1, offset: .2 }, { left: '75%', opacity: 1, offset: .8 }, { left: '85%', opacity: 0 }], { duration: 420, easing: 'ease-in-out' });
          await sleep(420);
        }
      }
      await sleep(1400);
    }
  })();

  /* ==========================================================
     12. COMPASS / RADAR (engineering)
     ========================================================== */
  (() => {
    const canvas = $('#compass-canvas');
    if (!canvas) return;
    let blips = [], lastA = 0;
    register(canvas, {
      draw(ctx, t, dt, w, h) {
        const cx = w * .5, cy = h * .47, R = w * .38;
        // grid
        ctx.strokeStyle = `rgba(${CREAM},.08)`; ctx.lineWidth = 1;
        ctx.beginPath();
        const n = 8;
        for (let i = 0; i <= n; i++) { const x = Math.round(i * w / n) + .5; ctx.moveTo(x, 0); ctx.lineTo(x, h); }
        for (let j = 0; j <= Math.round(n * h / w); j++) { const y = Math.round(j * w / n) + .5; ctx.moveTo(0, y); ctx.lineTo(w, y); }
        ctx.stroke();
        ctx.strokeStyle = `rgba(${CREAM},.25)`; ctx.strokeRect(.5, .5, w - 1, h - 1);
        // circles
        ctx.strokeStyle = `rgba(${MINT},.75)`;
        ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(cx, cy, R * .5, 0, Math.PI * 2); ctx.stroke();
        // rotating tick ring
        const rot = REDUCED ? 0 : -t * .15;
        ctx.strokeStyle = `rgba(${VIOLET},.7)`;
        ctx.beginPath();
        for (let i = 0; i < 48; i++) {
          const a = rot + i / 48 * Math.PI * 2, l = i % 4 ? 3 : 7;
          ctx.moveTo(cx + Math.cos(a) * (R + 3), cy + Math.sin(a) * (R + 3));
          ctx.lineTo(cx + Math.cos(a) * (R + 3 + l), cy + Math.sin(a) * (R + 3 + l));
        }
        ctx.stroke();
        // static diagonal (from the reference)
        ctx.strokeStyle = `rgba(${CORAL},.85)`;
        ctx.beginPath(); ctx.moveTo(cx - R * 1.15, cy + R * 1.15); ctx.lineTo(cx + R * 1.15, cy - R * 1.15); ctx.stroke();
        // sweep
        const a = REDUCED ? -.8 : t * 1.1;
        for (let i = 0; i < 24; i++) {
          const aa = a - i * .03;
          ctx.strokeStyle = `rgba(${CYAN},${(1 - i / 24) * .45})`;
          ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(aa) * R, cy + Math.sin(aa) * R); ctx.stroke();
        }
        // blips appear where the sweep passes
        if (!REDUCED && Math.floor(a / .9) !== Math.floor(lastA / .9) && Math.random() < .7) {
          const d = lerp(.25, .92, Math.random());
          blips.push({ col: pick([CORAL, VIOLET, MINT]), x: cx + Math.cos(a) * R * d, y: cy + Math.sin(a) * R * d, life: 1 });
        }
        lastA = a;
        blips = blips.filter(b => (b.life -= dt * .45) > 0);
        blips.forEach(b => {
          ctx.fillStyle = `rgba(${b.col},${b.life})`;
          ctx.fillRect(b.x - 1.5, b.y - 1.5, 3, 3);
          ctx.strokeStyle = `rgba(${b.col},${b.life * .6})`;
          ctx.beginPath(); ctx.arc(b.x, b.y, (1 - b.life) * 9 + 2, 0, 7); ctx.stroke();
        });
        ctx.fillStyle = `rgba(${MINT_HI},1)`; ctx.beginPath(); ctx.arc(cx, cy, 2, 0, 7); ctx.fill();
      }
    });
  })();

  /* ==========================================================
     13. CTA — topographic ridgelines that bulge under the cursor
     ========================================================== */
  register($('#cta-canvas'), {
    draw(ctx, t, dt, w, h) {
      const m = local(ctx.canvas);
      const lines = 16, step = 8;
      ctx.lineWidth = 1;
      for (let i = 0; i < lines; i++) {
        const base = h * .15 + i * (h * .8 / lines);
        ctx.strokeStyle = `rgba(11,12,9,${.06 + (i / lines) * .1})`;
        ctx.beginPath();
        for (let x = 0; x <= w + step; x += step) {
          let y = base - noise(x * .006 + i * .7, t * .15 + i * .2) * 38;
          if (m.inside) {
            const dx = x - m.x, dy = base - m.y;
            y -= Math.exp(-(dx * dx) / 9000 - (dy * dy) / 5000) * 30;
          }
          x ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
    }
  });

  /* ==========================================================
     14. MAGNETIC BUTTONS + 3D TILT CARDS
     ========================================================== */
  if (FINE && !REDUCED) {
    $$('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / r.width, y = (e.clientY - r.top - r.height / 2) / r.height;
        el.style.transform = `translate(${x * 8}px,${y * 6}px)`;
      });
      el.addEventListener('pointerleave', () => el.style.transform = '');
    });
    $$('.tilt').forEach(el => {
      el.style.transition = 'transform .5s cubic-bezier(.2,.7,.1,1), border-color .4s, box-shadow .4s';
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateZ(0)`;
      });
      el.addEventListener('pointerleave', () => el.style.transform = '');
    });
    // luz que sigue al cursor sobre las capturas
    $$('.shot-img').forEach(el => el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    }));
  }


  /* ==========================================================
     16. CONVERSIONES — clic en WhatsApp → evento de Google Analytics
     Marca "contacto_whatsapp" como evento clave en GA4 e impórtalo en Google Ads.
     ========================================================== */
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href*="wa.me/"]');
    if (!a || typeof window.gtag !== 'function') return;
    window.gtag('event', 'contacto_whatsapp', {
      ubicacion: a.dataset.ubicacion || 'otro',
      link_url: a.href.split('?')[0],
    });
  });
})();
