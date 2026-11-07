/* dot-hover.js — pointer effects for the dot-grid hero (Alice · Final).
   At rest the hero shows the plain CSS dots from variants/alice.css (.hero::before).
   While the pointer is over the hero, a canvas takes over, redraws the very same grid
   (same size, colour, drift and fade) and bends it around the cursor; once the dots have
   settled back, the canvas hands over to the CSS dots again.
   Effect is picked with data-dots on <html> (1–5, default 5, set from the dev panel in script.js):
     1 Repel     — dots shy away from the cursor, like a finger through sand
     2 Spotlight — dots near the cursor swell and light up in the accent blue
     3 Ripple    — moving or clicking drops rings that travel out through the grid
     4 Magnet    — dots are drawn in toward the cursor and darken
     5 Icons     — moving the cursor paints a trail where dots pop open into hand-drawn icons
                   (film camera, photo camera, vector pen tool, piano octave, Pakistan's crescent and star,
                   a clicking cursor, a paint palette, a paratha roll, headphones, a sticky note) in piano-key
                   colours, cool to gray, then shrink back to dots
   Off for touch / no-hover devices, prefers-reduced-motion and data-motion="off". */
(() => {
  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  if (!hero || !window.matchMedia) return;

  const TILE = 36;            // matches background-size in alice.css
  const DRIFT_MS = 50000;     // dots-drift duration
  const DRIFT = [360, 180];   // dots-drift distance per cycle
  const DOT_R = 1.7;          // radial-gradient(circle, #c9c9c6 1.5px, transparent 1.9px)
  const BASE = [201, 201, 198];

  const canHover = matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  const style = document.createElement('style');
  style.textContent = `
    .dot-hover-canvas { position: absolute; z-index: -1; inset: 0 calc(50% - 50vw); width: 100vw; height: 100%;
      pointer-events: none; opacity: 0; }
    .hero.dots-live .dot-hover-canvas { opacity: 1; }
    .hero.dots-live::before { background-image: none !important; }`;
  document.head.appendChild(style);

  const canvas = document.createElement('canvas');
  canvas.className = 'dot-hover-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  hero.prepend(canvas);
  const ctx = canvas.getContext('2d');

  let W = 0, H = 0, dpr = 1;
  let accent = [43, 89, 255], ink = [13, 13, 13];
  const pointer = { x: 0, y: 0, in: false, lastRingX: 0, lastRingY: 0 };
  const dots = new Map(); // "i,j" -> { dx, dy, s, t } eased per-dot state (absent = at rest)
  let rings = [];          // ripple rings: { x, y, born, power }
  let raf = 0;

  const effect = () => { const n = +root.dataset.dots; return n >= 1 && n <= 5 ? n : 5; };
  const isFinal = () => (root.dataset.v || document.getElementById('variant-css')?.getAttribute('href') || '').includes('alice');
  const enabled = () => canHover.matches && !reduced.matches && root.dataset.motion !== 'off' && isFinal();

  function parseColor(str, fallback) {
    const m = str && str.match(/^#([0-9a-f]{6})$/i);
    if (!m) return fallback;
    const n = parseInt(m[1], 16);
    return [n >> 16, (n >> 8) & 255, n & 255];
  }

  function measure() {
    const cs = getComputedStyle(root);
    accent = parseColor(cs.getPropertyValue('--accent').trim(), accent);
    ink = parseColor(cs.getPropertyValue('--ink').trim(), ink);
    W = canvas.offsetWidth; H = canvas.offsetHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    Object.assign(heroField, { W, H, dpr });
    measureText();
  }

  // Tight boxes around each line of hero text (and the portrait), in canvas coordinates,
  // so the Icons effect can fade out whatever lands underneath and keep the copy readable.
  let textRects = [];
  function measureText() {
    const c = canvas.getBoundingClientRect();
    const range = document.createRange();
    textRects = [];
    for (const el of hero.querySelectorAll('.hero-kicker, .hero-title, .hero-sub, .hero-portrait')) {
      if (!el.offsetWidth) continue;
      const rects = el.matches('.hero-portrait') ? [el.getBoundingClientRect()] : (range.selectNodeContents(el), [...range.getClientRects()]);
      for (const r of rects) if (r.width && r.height) textRects.push([r.left - c.left, r.top - c.top, r.right - c.left, r.bottom - c.top]);
    }
  }
  // 1 in the open, ~0.08 under text, with a soft 18px edge around each line.
  function textFade(x, y) {
    let d = Infinity;
    for (const [l, t, r, b] of textRects) {
      const dx = Math.max(l - x, 0, x - r), dy = Math.max(t - y, 0, y - b);
      d = Math.min(d, Math.hypot(dx, dy));
      if (d === 0) break;
    }
    return 0.08 + 0.92 * smooth(0, 18, d);
  }

  // Current drift of the CSS grid, read from its running animation so the canvas lines up exactly.
  function driftOffset(el = hero, name = 'dots-drift') {
    const a = el.getAnimations ? el.getAnimations({ subtree: true }).find((x) => x.animationName === name && x.effect && x.effect.target === el) : null;
    const t = a && a.currentTime != null ? a.currentTime : 0;
    return [(t / DRIFT_MS) * DRIFT[0], (t / DRIFT_MS) * DRIFT[1]];
  }

  // Target displacement / scale / tint for a dot at rest position (x, y), per effect.
  function target(x, y, now, fx) {
    let dx = 0, dy = 0, s = 1, t = 0;
    if (fx === 3) {
      for (const r of rings) {
        const age = (now - r.born) / 1000;
        const radius = age * 340;
        const vx = x - r.x, vy = y - r.y;
        const d = Math.hypot(vx, vy) || 1;
        const band = (d - radius) / 26;
        if (Math.abs(band) > 2.5) continue;
        const k = Math.exp(-band * band) * Math.max(0, 1 - age / 1.6) * r.power;
        dx += (vx / d) * k * 9; dy += (vy / d) * k * 9;
        s += k * 1.1; t = Math.max(t, k * 0.9);
      }
      return [dx, dy, s, t];
    }
    if (!pointer.in) return [0, 0, 1, 0];
    const vx = x - pointer.x, vy = y - pointer.y;
    const d = Math.hypot(vx, vy);
    if (fx === 1) {
      const R = 130;
      if (d >= R || d === 0) return [0, 0, 1, 0];
      const f = (1 - d / R) ** 2;
      return [(vx / d) * f * 30, (vy / d) * f * 30, 1 + f * 0.5, f * 0.35];
    }
    if (fx === 2) {
      const R = 170;
      if (d >= R) return [0, 0, 1, 0];
      const f = 1 - d / R;
      const e = f * f * (3 - 2 * f); // smoothstep
      return [0, 0, 1 + e * 2.1, e];
    }
    // fx === 4 magnet
    const R = 180;
    if (d >= R || d === 0) return [0, 0, 1, 0];
    const f = 1 - d / R;
    const pull = Math.min(d * 0.55, f * f * 48);
    return [(-vx / d) * pull, (-vy / d) * pull, 1 + f * 0.6, f * 0.6];
  }

  function frame(now) {
    raf = 0;
    if (!enabled()) { stop(); return; }
    const fx = effect();
    rings = rings.filter((r) => now - r.born < 2600);
    const [ox, oy] = driftOffset();
    if (fx === 5) {
      if (symbolsFrame(heroField, now, ox, oy) || pointer.in) raf = requestAnimationFrame(frame);
      else stop();
      return;
    }
    const ease = fx === 3 ? 0.35 : 0.16;
    const tint = fx === 2 ? accent : ink;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const i0 = Math.floor(-ox / TILE) - 2, i1 = Math.ceil((W - ox) / TILE) + 2;
    const j0 = Math.floor(-oy / TILE) - 2, j1 = Math.ceil((H - oy) / TILE) + 2;
    const buckets = new Map(); // quantised tint -> path
    let moving = false;

    for (let j = j0; j <= j1; j++) {
      const y = oy + j * TILE + TILE / 2;
      for (let i = i0; i <= i1; i++) {
        const x = ox + i * TILE + TILE / 2;
        const key = i + ',' + j;
        const [tx, ty, ts, tt] = target(x, y, now, fx);
        let d = dots.get(key);
        if (!d) {
          if (tx === 0 && ty === 0 && ts === 1 && tt === 0) { addDot(buckets, 0, x, y, DOT_R); continue; }
          d = { dx: 0, dy: 0, s: 1, t: 0 };
          dots.set(key, d);
        }
        d.dx += (tx - d.dx) * ease; d.dy += (ty - d.dy) * ease;
        d.s += (ts - d.s) * ease; d.t += (tt - d.t) * ease;
        if (Math.abs(d.dx) + Math.abs(d.dy) < 0.02 && Math.abs(d.s - 1) < 0.005 && d.t < 0.005 && tx === 0 && ty === 0 && ts === 1 && tt === 0) {
          dots.delete(key);
          addDot(buckets, 0, x, y, DOT_R);
          continue;
        }
        moving = true;
        addDot(buckets, Math.round(Math.min(1, d.t) * 12), x + d.dx, y + d.dy, DOT_R * d.s);
      }
    }

    for (const [q, path] of buckets) {
      const k = q / 12;
      ctx.fillStyle = `rgb(${BASE.map((c, n) => Math.round(c + (tint[n] - c) * k)).join(',')})`;
      ctx.fill(path);
    }

    if (moving || pointer.in || rings.length) raf = requestAnimationFrame(frame);
    else stop();
  }

  /* ---------- 5 · Symbols ---------- */
  // Each glyph lives in a unit box (about -1..1) and is scaled up around its dot.
  const P = (fn) => { const p = new Path2D(); fn(p); return p; };
  const rr = (p, x, y, w, h, r) => (p.roundRect ? p.roundRect(x, y, w, h, r) : p.rect(x, y, w, h));
  const poly = (p, pts) => { p.moveTo(pts[0], pts[1]); for (let k = 2; k < pts.length; k += 2) p.lineTo(pts[k], pts[k + 1]); p.closePath(); };
  const TAU = Math.PI * 2;
  // Hand-drawn icons: each one is a few pen strokes in a unit box (about -1..1). Every stroke is
  // re-traced with a little seeded wobble, closed shapes overshoot their start like a real pen,
  // and each icon gets 3 slightly different "takes" so neighbours never look copy-pasted.
  function mulberry(a) {
    return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const circ = (cx, cy, r, n = 18) => Array.from({ length: n }, (_, k) => [cx + Math.cos(k / n * TAU) * r, cy + Math.sin(k / n * TAU) * r]);
  const box = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  const cubic = (p0, p1, p2, p3, n = 10) => Array.from({ length: n + 1 }, (_, k) => {
    const t = k / n, u = 1 - t;
    return [0, 1].map((c) => u * u * u * p0[c] + 3 * u * u * t * p1[c] + 3 * u * t * t * p2[c] + t * t * t * p3[c]);
  });
  function subdivide(pts, closed, step = 0.2) {
    const out = [];
    const n = closed ? pts.length : pts.length - 1;
    for (let k = 0; k < n; k++) {
      const [x0, y0] = pts[k], [x1, y1] = pts[(k + 1) % pts.length];
      const m = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / step));
      for (let q = 0; q < m; q++) out.push([x0 + (x1 - x0) * q / m, y0 + (y1 - y0) * q / m]);
    }
    if (!closed) out.push(pts[pts.length - 1]);
    return out;
  }
  function sketch(path, pts, closed, rand, amp) {
    const sx = (rand() - 0.5) * amp * 1.5, sy = (rand() - 0.5) * amp * 1.5;
    let p = subdivide(pts, closed).map(([x, y]) => [x + sx + (rand() - 0.5) * 2 * amp, y + sy + (rand() - 0.5) * 2 * amp]);
    if (closed) { const a = p[0], b = p[1] || a; p = p.concat([a, [a[0] + (b[0] - a[0]) * 0.6, a[1] + (b[1] - a[1]) * 0.6]]); }
    path.moveTo(p[0][0], p[0][1]);
    for (let k = 1; k < p.length - 1; k++) path.quadraticCurveTo(p[k][0], p[k][1], (p[k][0] + p[k + 1][0]) / 2, (p[k][1] + p[k + 1][1]) / 2);
    path.lineTo(p[p.length - 1][0], p[p.length - 1][1]);
  }
  function icon(draw) {
    return [11, 23, 37].map((seed) => {
      const rand = mulberry(seed * 7919 + draw.length);
      const stroke = new Path2D(), fill = new Path2D();
      let hasFill = false;
      draw((pts, { closed = false, filled = false } = {}) => {
        sketch(stroke, pts, closed, rand, 0.035);
        if (filled) { sketch(fill, pts, true, rand, 0.02); hasFill = true; }
      });
      return { stroke, fill: hasFill ? fill : null };
    });
  }
  const SYMBOLS = [
    icon((s) => { // film · movie camera with two reels
      s(circ(-0.5, -0.5, 0.3), { closed: true });
      s(circ(0.12, -0.5, 0.3), { closed: true });
      s(circ(-0.5, -0.5, 0.07, 8), { closed: true, filled: true });
      s(circ(0.12, -0.5, 0.07, 8), { closed: true, filled: true });
      s(box(-0.85, -0.1, 1.2, 0.72), { closed: true });
      s([[0.35, 0.12], [0.9, -0.08], [0.9, 0.7], [0.35, 0.48]], { closed: true });
      s([[-0.62, 0.62], [-0.78, 0.95]]); s([[-0.2, 0.62], [-0.04, 0.95]]);
    }),
    icon((s) => { // photography · camera
      s([[-0.92, -0.42], [-0.4, -0.42], [-0.28, -0.66], [0.28, -0.66], [0.4, -0.42], [0.92, -0.42], [0.92, 0.66], [-0.92, 0.66]], { closed: true });
      s(circ(0, 0.12, 0.38), { closed: true });
      s(circ(0, 0.12, 0.15, 10), { closed: true, filled: true });
      s(box(0.56, -0.28, 0.2, 0.12), { closed: true });
    }),
    icon((s) => { // design · vector pen tool: a bezier with its anchor and handles
      s(cubic([-0.92, 0.7], [-0.8, -0.05], [-0.45, -0.18], [0, -0.18]).concat(cubic([0, -0.18], [0.45, -0.18], [0.8, -0.05], [0.92, 0.7]).slice(1)));
      s([[-0.62, -0.18], [0.62, -0.18]]);
      s(circ(-0.68, -0.18, 0.09, 8), { closed: true, filled: true });
      s(circ(0.68, -0.18, 0.09, 8), { closed: true, filled: true });
      s(box(-0.13, -0.31, 0.26, 0.26), { closed: true });
      s(box(-1, 0.6, 0.18, 0.18), { closed: true }); s(box(0.82, 0.6, 0.18, 0.18), { closed: true });
    }),
    icon((s) => { // music · one octave of keyboard
      const L = -0.95, Wd = 1.9, T = -0.6, B = 0.62, key = Wd / 7;
      s(box(L, T, Wd, B - T), { closed: true });
      for (let k = 1; k < 7; k++) if (k !== 3) s([[L + k * key, 0.1], [L + k * key, B]]); else s([[L + k * key, T], [L + k * key, B]]);
      for (const k of [1, 2, 4, 5, 6]) s(box(L + k * key - 0.08, T, 0.16, 0.7), { closed: true, filled: true });
    }),
    icon((s) => { // Pakistan · crescent and star from the flag
      const c0 = [-0.12, 0.08], r0 = 0.82, c1 = [0.16, -0.1], r1 = 0.68;
      const phi = Math.atan2(c1[1] - c0[1], c1[0] - c0[0]);
      const outer = [], inner = [];
      for (let k = 1; k < 40; k++) { const a = phi + k / 40 * TAU, p = [c0[0] + Math.cos(a) * r0, c0[1] + Math.sin(a) * r0]; if (Math.hypot(p[0] - c1[0], p[1] - c1[1]) > r1) outer.push(p); }
      for (let k = 0; k < 40; k++) { const a = phi + Math.PI + (k / 40 - 0.5) * TAU, p = [c1[0] + Math.cos(a) * r1, c1[1] + Math.sin(a) * r1]; if (Math.hypot(p[0] - c0[0], p[1] - c0[1]) < r0) inner.push(p); }
      const end = outer[outer.length - 1];
      if (Math.hypot(inner[0][0] - end[0], inner[0][1] - end[1]) > Math.hypot(inner[inner.length - 1][0] - end[0], inner[inner.length - 1][1] - end[1])) inner.reverse();
      s(outer.concat(inner), { closed: true });
      const star = []; for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5 + 0.5, r = k % 2 ? 0.1 : 0.25; star.push([0.6 + Math.cos(a) * r, -0.5 + Math.sin(a) * r]); }
      s(star, { closed: true, filled: true });
    }),
    icon((s) => { // design · cursor clicking
      s([[-0.4, -0.7], [-0.4, 0.62], [-0.08, 0.3], [0.16, 0.85], [0.36, 0.76], [0.12, 0.22], [0.55, 0.2]], { closed: true });
      s([[-0.58, -0.82], [-0.78, -0.98]]); s([[-0.4, -0.9], [-0.38, -1.1]]); s([[-0.62, -0.64], [-0.86, -0.6]]);
    }),
    icon((s) => { // design · paint palette
      const out = []; for (let k = 0; k < 28; k++) { const a = k / 28 * TAU, r = 1 - 0.38 * Math.exp(-(((a - 0.7) / 0.28) ** 2)); out.push([Math.cos(a) * 0.95 * r, Math.sin(a) * 0.75 * r]); }
      s(out, { closed: true });
      for (const [x, y] of [[-0.5, -0.2], [-0.05, -0.42], [0.42, -0.28], [-0.48, 0.28]]) s(circ(x, y, 0.13, 8), { closed: true, filled: true });
      s(circ(0.12, 0.34, 0.13, 8), { closed: true });
    }),
    icon((s) => { // food · paratha roll: a fat wrap on a slant, flaky spiral end, paper round the bottom
      const rot = (pts) => pts.map(([x, y]) => [x * 0.82 + y * 0.57, -x * 0.57 + y * 0.82]);
      s(rot([[0.42, -0.42], [-0.62, -0.42], [-0.86, -0.22], [-0.86, 0.22], [-0.62, 0.42], [0.42, 0.42]]));
      s(rot(circ(0, 0, 1, 22).map(([x, y]) => [0.46 + x * 0.26, y * 0.44])), { closed: true });
      const sp = []; for (let k = 0; k <= 20; k++) { const a = k / 20 * TAU * 2, r = 0.36 * (1 - k / 23); sp.push([0.46 + Math.cos(a) * r * 0.55, Math.sin(a) * r]); }
      s(rot(sp));
      s(rot([[-0.3, -0.48], [-0.86, -0.48], [-0.98, 0], [-0.86, 0.48], [-0.3, 0.48], [-0.16, 0.24], [-0.32, 0], [-0.16, -0.24]]), { closed: true, filled: true });
    }),
    icon((s) => { // music · headphones
      const band = []; for (let k = 0; k <= 14; k++) { const a = Math.PI + k / 14 * Math.PI; band.push([Math.cos(a) * 0.72, 0.1 + Math.sin(a) * 0.78]); }
      s(band);
      s(box(-0.95, 0.02, 0.36, 0.7), { closed: true, filled: true });
      s(box(0.59, 0.02, 0.36, 0.7), { closed: true, filled: true });
    }),
    icon((s) => { // design · sticky note with a folded corner and scribbled notes
      s([[-0.78, -0.78], [0.78, -0.78], [0.78, 0.34], [0.34, 0.78], [-0.78, 0.78]], { closed: true });
      s([[0.78, 0.34], [0.34, 0.34], [0.34, 0.78]]);
      s([[-0.5, -0.4], [0.48, -0.4]]); s([[-0.5, -0.06], [0.36, -0.06]]); s([[-0.5, 0.28], [0.04, 0.28]]);
    }),
  ];
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const mix = (a, b, k) => [0, 1, 2].map((n) => Math.round(a[n] + (b[n] - a[n]) * k));
  // Icon colours come from the project thumbnails' bokeh palettes (bokeh.js): every hue of every project, keeping the
  // vivid ones, one per hue family, ordered around the colour wheel. Falls back to the old piano-key colours.
  const FALLBACK = [[236, 64, 72], [247, 118, 46], [250, 164, 28], [248, 204, 40], [242, 104, 160], [162, 82, 226], [86, 92, 246]];
  const fromBokeh = () => {
    const H = window.Bokeh && window.Bokeh.HUES; if (!H) return null;
    const out = [];
    for (const hex of Object.values(H).flat()) {
      const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)), mx = Math.max(...c), mn = Math.min(...c), d = mx - mn, l = (mx + mn) / 510;
      if (d === 0 || l < 0.35 || l > 0.82 || d / (255 * (1 - Math.abs(2 * l - 1))) < 0.5) continue;   // skip pale or dull colours
      const hue = (mx === c[0] ? ((c[1] - c[2]) / d + 6) % 6 : mx === c[1] ? (c[2] - c[0]) / d + 2 : (c[0] - c[1]) / d + 4) * 60;
      if (!out.some((o) => Math.min(Math.abs(o.hue - hue), 360 - Math.abs(o.hue - hue)) < 14)) out.push({ hue, c });
    }
    out.sort((a, b) => a.hue - b.hue);
    if (out.length < 4) return null;
    return Array.from({ length: 7 }, (_, k) => out[Math.floor((k * out.length) / 7)].c);   // 7 evenly spread around the list
  };
  const KEYS = fromBokeh() || FALLBACK;
  const PALETTE = KEYS.map((c, k) => [c, mix(c, KEYS[(k + 1) % KEYS.length], 0.45)]);
  // Neighbours never share a colour: (3i + 5j) mod 7 differs for every dot touching another
  // (left/right, up/down and diagonals). The shuffle
  // just stops it reading as a rainbow sweep.
  const SHUFFLE = [0, 4, 2, 6, 1, 5, 3];
  const colourOf = (i, j) => SHUFFLE[(((3 * i + 5 * j) % 7) + 7) % 7];
  const SYM_SHUFFLE = [0, 6, 3, 9, 2, 8, 5, 1, 7, 4];
  const GRAY = [158, 158, 154];
  const glyphs = new Map(); // "i,j" -> { h heat, c colour, e shown size, v spring speed } (absent = plain dot)
  const rgb = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;
  function hash(i, j, salt) {
    let h = (Math.imul(i, 73856093) ^ Math.imul(j, 19349663) ^ Math.imul(salt, 83492791)) >>> 0;
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0; h = Math.imul(h ^ (h >>> 13), 3266489909) >>> 0;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  // Motion-driven, like alicezhao.work: moving the pointer "paints" heat into the dots along its
  // path. Heated dots pop open (springy, with a little overshoot) in full colour, the colour cools
  // to gray first, then the shape shrinks back to a dot. Holding still lets everything settle.
  function segDist(px, py, ax, ay, bx, by) {
    const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
    const t = L ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L)) : 0;
    return Math.hypot(px - ax - dx * t, py - ay - dy * t);
  }

  // One "field" = one canvas of dots running the Icons effect: the hero, or a band between sections.
  // { ctx, W, H, dpr, pointer, glyphs, last, fade(x, y) → 0..1, rows?: [first, last] }
  const heroField = { ctx, W: 0, H: 0, dpr: 1, pointer, glyphs, last: { x: 0, y: 0, t: 0, fresh: true }, fade: (x, y) => textFade(x, y) };

  function symbolsFrame(f, now, ox, oy) {
    const { ctx, W, H, dpr, pointer, glyphs } = f;
    let last = f.last;
    const R = 150, MAX = 13.5; // 36px grid: icons up to ~30px wide, with breathing room between
    const dt = Math.min(0.05, last.fresh ? 0.016 : (now - last.t) / 1000);
    if (last.fresh || !pointer.in) { last.x = pointer.x; last.y = pointer.y; }
    const moved = pointer.in ? Math.hypot(pointer.x - last.x, pointer.y - last.y) : 0;
    const push = Math.min(1, moved / 12) * 0.6;
    const ax = last.x, ay = last.y, bx = pointer.x, by = pointer.y;
    last = f.last = { x: pointer.x, y: pointer.y, t: now, fresh: false };

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const i0 = Math.floor(-ox / TILE) - 2, i1 = Math.ceil((W - ox) / TILE) + 2;
    const [j0, j1] = f.rows || [Math.floor(-oy / TILE) - 2, Math.ceil((H - oy) / TILE) + 2];
    const rest = new Path2D();
    const live = [];
    let moving = false;

    for (let j = j0; j <= j1; j++) {
      const y = oy + j * TILE + TILE / 2;
      for (let i = i0; i <= i1; i++) {
        const x = ox + i * TILE + TILE / 2;
        const key = i + ',' + j;
        let add = 0;
        if (push > 0) {
          const d = segDist(x, y, ax, ay, bx, by);
          if (d < R) add = smooth(0, 1, 1 - d / R) * push;
        }
        let g = glyphs.get(key);
        if (!g) {
          if (add === 0) { if (x > -8 && y > -8 && x < W + 8 && y < H + 8) { rest.moveTo(x + DOT_R, y); rest.arc(x, y, DOT_R, 0, TAU); } continue; }
          g = { h: 0, c: 0, e: 0, v: 0 };
          glyphs.set(key, g);
        }
        g.h = Math.min(1, g.h + add); g.c = Math.min(1, g.c + add * 1.2);
        g.h = Math.max(0, g.h - dt * 0.75);   // size lingers ~1.3s
        g.c = Math.max(0, g.c - dt * 1.5);    // colour cools to gray first
        // Spring toward the heat: quick pop with a touch of overshoot, then a soft settle.
        g.v += ((g.h - g.e) * 170 - g.v * 15) * dt;
        g.e = Math.max(0, g.e + g.v * dt);
        if (g.h === 0 && g.c === 0 && g.e < 0.004 && Math.abs(g.v) < 0.02) { glyphs.delete(key); rest.moveTo(x + DOT_R, y); rest.arc(x, y, DOT_R, 0, TAU); continue; }
        moving = true;
        live.push(i, j, x, y, g.e, g.c);   // every dot becomes an icon
      }
    }

    ctx.fillStyle = rgb(BASE);
    ctx.fill(rest);

    ctx.globalAlpha = 1;
    // Smaller first so the big ones sit on top.
    const order = [];
    for (let k = 0; k < live.length; k += 6) order.push(k);
    order.sort((a, b) => live[a + 4] - live[b + 4]);

    for (const k of order) {
      const i = live[k], j = live[k + 1], x = live[k + 2], y = live[k + 3], e = live[k + 4];
      const show = smooth(0.03, 0.16, e);         // dot → icon cross-fade
      if (show < 1) {
        ctx.globalAlpha = 1 - show;
        ctx.fillStyle = rgb(BASE);
        ctx.beginPath(); ctx.arc(x, y, DOT_R * (1 + e * 4), 0, TAU); ctx.fill();
      }
      if (show <= 0) continue;
      const under = f.fade(x, y);
      const sym = SYMBOLS[SYM_SHUFFLE[(((3 * i + 5 * j) % 10) + 10) % 10]]; // touching dots never share an icon
      const size = (0.85 + hash(i, j, 2) * 0.35) * (2.2 + (MAX - 2.2) * Math.pow(e, 1.2));
      const spin = (hash(i, j, 3) - 0.5) * 0.6;
      const angle = spin * (0.35 + Math.max(0, 1 - e) * 1.4); // twists upright as it opens
      const colour = smooth(0.05, 0.5, live[k + 5]);
      const grey = mix(BASE, GRAY, smooth(0, 0.3, e));
      let fill;
      if (colour < 0.02) fill = rgb(grey);
      else {
        const pair = PALETTE[colourOf(i, j)];
        fill = ctx.createLinearGradient(-1, -1, 1, 1);
        fill.addColorStop(0, rgb(mix(grey, pair[0], colour)));
        fill.addColorStop(1, rgb(mix(grey, pair[1], colour)));
      }
      const take = sym[Math.floor(hash(i, j, 6) * sym.length)];
      ctx.globalAlpha = show * under;
      ctx.save();
      ctx.translate(x, y); ctx.rotate(angle); ctx.scale(size, size);
      ctx.fillStyle = fill; ctx.strokeStyle = fill;
      ctx.lineWidth = Math.max(1.1, size * 0.1) / size; // ~2px pen at full size, never thinner than a hairline
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (take.fill) ctx.fill(take.fill);
      ctx.stroke(take.stroke);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    return moving;
  }

  function addDot(buckets, q, x, y, r) {
    if (x < -8 || y < -8 || x > W + 8 || y > H + 8) return;
    let p = buckets.get(q);
    if (!p) buckets.set(q, (p = new Path2D()));
    p.moveTo(x + r, y);
    p.arc(x, y, r, 0, Math.PI * 2);
  }

  function start() {
    if (raf || !enabled()) return;
    if (!hero.classList.contains('dots-live')) measure();
    hero.classList.add('dots-live');
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    dots.clear(); glyphs.clear(); heroField.last.fresh = true; rings = [];
    hero.classList.remove('dots-live');
  }

  function toLocal(e) {
    const r = canvas.getBoundingClientRect();
    pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top;
  }

  function addRing(power) {
    rings.push({ x: pointer.x, y: pointer.y, born: performance.now(), power });
    pointer.lastRingX = pointer.x; pointer.lastRingY = pointer.y;
  }

  hero.addEventListener('pointerenter', (e) => {
    if (e.pointerType === 'touch' || !enabled()) return;
    pointer.in = true; start(); toLocal(e);
    if (effect() === 3) addRing(0.8);
  });
  hero.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch' || !enabled()) return;
    pointer.in = true; toLocal(e); start();
    if (effect() === 3 && Math.hypot(pointer.x - pointer.lastRingX, pointer.y - pointer.lastRingY) > 110) addRing(0.6);
  });
  hero.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch' || !enabled() || effect() !== 3) return;
    toLocal(e); addRing(1.4); start();
  });
  hero.addEventListener('pointerleave', () => { pointer.in = false; });

  window.addEventListener('resize', () => { if (raf) measure(); });

  /* ---------- idle sparkle ----------
     While nobody is hovering the hero, wake 2-3 random dots every couple of seconds so the grid feels alive.
     They use the same pop-open-into-an-icon animation as the hover trail (effect 5 only). */
  function sparkle() {
    setTimeout(sparkle, 1500 + Math.random() * 1500);
    if (pointer.in || document.hidden || effect() !== 5 || !enabled()) return;
    const r = hero.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    start();
    if (!W || !H) return;
    const [ox, oy] = driftOffset();
    for (let n = 0, picked = 0; n < 40 && picked < 2 + Math.round(Math.random()); n++) {
      const x = Math.random() * W, y = Math.random() * H * 0.6;
      if (textFade(x, y) < 0.9) continue;           // skip spots under the headline or portrait
      const i = Math.round((x - ox - TILE / 2) / TILE), j = Math.round((y - oy - TILE / 2) / TILE);
      glyphs.set(i + ',' + j, { h: 1, c: 1, e: 0, v: 0 });
      picked++;
    }
  }
  setTimeout(sparkle, 1200);

  /* ---------- bands between sections ----------
     The 6-row dot bands drawn by .about/.offscreen/.contact::before in alice.css. Each gets its own
     canvas running the Icons effect (only when effect 5 is on); at rest the CSS dots show. */
  const PAD = 24, ROWS = 6;
  const bandStyle = document.createElement('style');
  bandStyle.textContent = `
    .dot-band-canvas { position: absolute; top: calc(var(--band-top) - ${PAD}px); left: calc(50% - 50vw); width: 100vw;
      height: ${ROWS * TILE + PAD * 2}px; pointer-events: none; opacity: 0; grid-column: 1 / -1;
      -webkit-mask-image: linear-gradient(transparent ${PAD}px, #000 ${PAD + 54}px, #000 ${PAD + 162}px, transparent ${PAD + 216}px);
      mask-image: linear-gradient(transparent ${PAD}px, #000 ${PAD + 54}px, #000 ${PAD + 162}px, transparent ${PAD + 216}px); }
    .band-live > .dot-band-canvas { opacity: 1; }
    .band-live::before { background-image: none !important; }`;
  document.head.appendChild(bandStyle);
  const bands = [...document.querySelectorAll('.about, .offscreen, .contact')].map((host) => {
    const cv = document.createElement('canvas');
    cv.className = 'dot-band-canvas';
    cv.setAttribute('aria-hidden', 'true');
    host.prepend(cv);
    return { host, cv, raf: 0, ctx: cv.getContext('2d'), W: 0, H: 0, dpr: 1, 
      pointer: { x: 0, y: 0, in: false }, glyphs: new Map(), last: { x: 0, y: 0, t: 0, fresh: true }, fade: () => 1 };
  });
  const bandsOn = () => enabled() && effect() === 5;

  function bandFrame(b, now) {
    b.raf = 0;
    if (!bandsOn()) { bandStop(b); return; }
    // CSS centres the tiles (background-position 50% 0) and drifts them like the hero (band-drift),
    // so dot centres sit at W/2 + k·36 + drift, rows start PAD down + drift. The mask fades the edges.
    const [dx, dy] = driftOffset(b.host, 'band-drift');
    const busy = symbolsFrame(b, now, (b.W - TILE) / 2 + dx, PAD + dy);
    if (busy || b.pointer.in) b.raf = requestAnimationFrame((t) => bandFrame(b, t));
    else bandStop(b);
  }
  function bandStart(b) {
    if (b.raf) return;
    if (!b.host.classList.contains('band-live')) {
      b.W = b.cv.offsetWidth; b.H = b.cv.offsetHeight; b.dpr = Math.min(window.devicePixelRatio || 1, 2);
      b.cv.width = Math.round(b.W * b.dpr); b.cv.height = Math.round(b.H * b.dpr);
      b.host.classList.add('band-live');
    }
    b.raf = requestAnimationFrame((t) => bandFrame(b, t));
  }
  function bandStop(b) {
    if (b.raf) cancelAnimationFrame(b.raf);
    b.raf = 0; b.glyphs.clear(); b.last.fresh = true; b.pointer.in = false;
    b.host.classList.remove('band-live');
  }
  // The canvases ignore the pointer (so links stay clickable), so watch the page and hit-test each band.
  document.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch' || !bandsOn()) return;
    for (const b of bands) {
      const r = b.cv.getBoundingClientRect();
      const inside = e.clientY >= r.top && e.clientY <= r.bottom && r.height > 0;
      b.pointer.in = inside;
      if (!inside) continue;
      b.pointer.x = e.clientX - r.left; b.pointer.y = e.clientY - r.top;
      bandStart(b);
    }
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => { for (const b of bands) b.pointer.in = false; });
  // Variant, motion or effect changed: drop back to the CSS dots; the next pointer move restarts.
  new MutationObserver(() => { if (!enabled() || raf) stop(); bands.forEach(bandStop); })
    .observe(root, { attributes: true, attributeFilter: ['data-dots', 'data-motion', 'data-v'] });
})();
