/* Lingoda "live carousel" variant: all 24 screens of the Final design carousel, each as its own looping animation.
   Where the pictures come from:
   - case-studies/lingoda-app/live/scr/aN-M.webp : the 24 screens (390 x 844), cut from the Figma exports of the carousel pictures.
   - case-studies/lingoda-app/live/art/*.png     : real Figma exports (2x) of illustration nodes: goal target, bell, vocab mascot, ...
   How it moves: the screen image is the base of every phone. Pieces are cut out of it (same image, positioned in px of the
   390 x 844 screen), sit on top of a cover in the colour behind them, and are animated with the Web Animations API.
   Every animation is paused and driven by one clock per phone (anim.currentTime = t), so a phone can be frozen or scrubbed:
     __lcl.seek('a1', 2, 3000)  ->  slide a1, third phone, at 3.0 s        __lcl.freeze(false)  ->  back to live
   Reduced motion: no script runs, the static screens stay. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DIR = 'case-studies/lingoda-app/live/';
  var W = 390, H = 844;
  var SPRING = 'cubic-bezier(.34,1.56,.64,1)', OUT = 'cubic-bezier(.2,.8,.2,1)';
  var GREEN = '#46ba5c', ORANGE = '#f79830';

  /* ---------- spec helpers (all rects are [x, y, w, h] in screen px) ---------- */
  function L(r, fx, at, o) { o = o || {}; o.r = r; o.fx = fx; o.at = at || 0; return o; }
  function WIPE(r, s, at, d) { return { t: 'wipe', r: r, s: s && s.length ? s : null, col: typeof s === 'string' ? s : null, at: at, d: d || 800 }; }
  function NUM(r, to, at, d, fmt, css, bg) { return { t: 'num', r: r, to: to, at: at, d: d || 1200, fmt: fmt || 'int', css: css || {}, bg: bg }; }
  function REVEAL(r, at, bg) { return { t: 'reveal', r: r, at: at, bg: bg || '#fff' }; }
  function CF(r, at) { return { t: 'cf', r: r, at: at }; }
  function PRESS(r, at) { return L(r, 'press', at, { cv: false }); }
  function STATIC(r, ov) { return L(r, 'none', 0, { nosprite: true, ov: ov }); }

  /* the baked "2500" is Open Sans Bold, not Fredoka (measured against the screen image) */
  var FREDOKA = { font: "700 32px/1 'Open Sans', sans-serif", ls: '.7px', stroke: '.35px' };   /* the baked numbers are Open Sans ExtraBold: a hairline stroke fakes the missing weight */

  var SPEC = {
    /* ---------- slide 1: onboarding and login ---------- */
    'a1-1': { T: 7000, L: [
      L([38, 198, 308, 262], 'pop', 200, { amb: 'float' }),
      L([48, 478, 296, 40], 'rise', 650), L([20, 526, 350, 75], 'rise', 800),
      L([160, 690, 60, 20], 'fade', 1100), L([140, 758, 110, 28], 'rise', 1200), PRESS([140, 758, 110, 28], 4300)] },
    'a1-2': { T: 7000, L: [
      L([135, 85, 125, 95], 'pop', 150),
      L([16, 219, 360, 48], 'rise', 450), L([16, 283, 360, 48], 'rise', 600),
      L([16, 347, 360, 48], 'rise', 750), L([16, 411, 360, 48], 'rise', 900),
      L([30, 560, 330, 284], 'rise', 1050, { dy: 40 }), PRESS([16, 411, 360, 48], 4300)] },
    'a1-3': { T: 7000, L: [
      L([123, 198, 142, 140], 'pop', 150, { art: 'goal-target.png', cvr: [118, 192, 152, 152], amb: 'pulse' }),
      L([80, 360, 230, 40], 'rise', 500), L([26, 408, 338, 78], 'rise', 650),
      L([16, 682, 358, 48], 'rise', 850), L([150, 758, 90, 26], 'fade', 1000), PRESS([16, 682, 358, 48], 4300)] },
    'a1-4': { T: 7000, L: [
      L([16, 124, 358, 50], 'rise', 150), L([16, 188, 358, 48], 'rise', 300), L([16, 252, 358, 48], 'rise', 450),
      PRESS([16, 188, 358, 48], 1500),
      L([16, 596, 358, 122], 'rise', 750), L([16, 746, 358, 48], 'rise', 950), PRESS([16, 746, 358, 48], 4300)] },
    'a1-5': { T: 7000, L: [
      L([124, 198, 141, 140], 'pop', 150, { art: 'bell.png', cvr: [118, 190, 153, 155], amb: 'swing', ambAt: 900 }),
      L([62, 358, 268, 82], 'rise', 500), L([30, 446, 330, 76], 'rise', 650),
      L([16, 682, 358, 48], 'rise', 850), L([150, 758, 90, 26], 'fade', 1000), PRESS([16, 682, 358, 48], 4300)] },
    'a1-6': { T: 7000, L: [
      L([78, 152, 226, 190], 'pop', 150, { amb: 'wave' }),
      L([50, 356, 290, 64], 'rise', 480), L([14, 430, 362, 72], 'rise', 650),
      L([16, 682, 358, 48], 'rise', 850), L([90, 758, 210, 26], 'fade', 1000), PRESS([16, 682, 358, 48], 4300)] },

    /* ---------- slide 2: home, course, classes ---------- */
    'a2-1': { T: 8000, L: [
      L([100, 60, 200, 128], 'pop', 100), L([318, 52, 52, 46], 'fade', 200),
      L([16, 210, 358, 84], 'rise', 400, { ov: [WIPE([84, 261, 93, 11], [190, 261], 1200, 900),
        NUM([322, 232, 40, 22], 3, 1200, 900, 'frac8', { font: "600 14.5px/1 'Open Sans', sans-serif", color: '#0b1a4a', textAlign: 'right' }, '#fff')] }),
      L([16, 322, 220, 30], 'rise', 650), L([16, 364, 358, 318], 'rise', 800),
      L([16, 735, 220, 28], 'fade', 1100), PRESS([32, 612, 326, 48], 4800)] },
    'a2-2': { T: 7500, L: [
      L([34, 116, 324, 444], 'rise', 150, { dy: 30, ov: [WIPE([58, 358, 92, 8], [160, 358], 1100, 900)] }),
      L([0, 116, 20, 444], 'sl', 350), L([370, 116, 20, 444], 'sr', 350),
      L([34, 590, 324, 36], 'fade', 800), PRESS([58, 488, 272, 48], 4600)] },
    'a2-3': { T: 8000, L: [
      L([16, 118, 330, 92], 'rise', 150), L([16, 212, 345, 44], 'rise', 300),
      L([16, 270, 358, 82], 'rise', 450), L([16, 385, 358, 92], 'rise', 570), L([16, 500, 358, 76], 'rise', 690),
      L([16, 612, 358, 76], 'rise', 810), L([16, 722, 358, 36], 'rise', 930)] },
    'a2-4': { T: 8000, L: [
      L([16, 148, 358, 398], 'rise', 150, { ov: [REVEAL([316, 265, 30, 30], 1000), REVEAL([316, 367, 30, 30], 1250), REVEAL([316, 467, 30, 30], 1500)] }),
      L([16, 560, 358, 284], 'fade', 500)] },
    'a2-5': { T: 8000, L: [
      L([16, 128, 360, 34], 'fade', 150), L([16, 172, 358, 232], 'rise', 300), L([16, 420, 358, 194], 'rise', 500),
      L([16, 628, 358, 130], 'rise', 700), PRESS([96, 192, 128, 32], 1500)] },
    'a2-6': { T: 7000, L: [
      L([30, 122, 312, 210], 'pop', 150, { amb: 'float' }),
      L([48, 342, 296, 30], 'rise', 500), L([70, 376, 252, 26], 'rise', 650)] },

    /* ---------- slide 3: vocabulary trainer ---------- */
    'a3-1': { T: 8500, L: [
      L([16, 60, 358, 168], 'rise', 150),
      L([14, 242, 174, 104], 'pop', 400, { ov: [NUM([32, 293, 80, 26], 2500, 900, 1400, 'int', { font: FREDOKA.font, ls: FREDOKA.ls, stroke: FREDOKA.stroke, color: ORANGE }, null)] }),
      L([202, 242, 172, 104], 'pop', 550, { ov: [NUM([219.5, 293, 80, 26], 2500, 1050, 1400, 'int', { font: FREDOKA.font, ls: FREDOKA.ls, stroke: FREDOKA.stroke, color: GREEN }, null)] }),
      L([16, 392, 200, 28], 'rise', 750), L([16, 430, 358, 42], 'rise', 850), L([16, 490, 358, 46], 'rise', 950),
      L([16, 564, 358, 196], 'rise', 1050), PRESS([32, 160, 162, 48], 4800)] },
    'a3-2': { T: 7000, L: [
      L([78, 152, 226, 190], 'pop', 150, { amb: 'wave' }),
      L([50, 356, 290, 64], 'rise', 480), L([14, 430, 362, 72], 'rise', 650),
      L([16, 746, 358, 48], 'rise', 850), PRESS([16, 746, 358, 48], 3900)] },
    'a3-3': { T: 8000, L: [
      STATIC([16, 95, 185, 10], [WIPE([16, 95, 185, 10], '#eceef2', 250, 700)]),
      L([16, 146, 358, 104], 'rise', 150),
      L([16, 272, 358, 48], 'rise', 350), L([16, 336, 358, 48], 'rise', 480), L([16, 400, 358, 48], 'rise', 610), L([16, 464, 358, 48], 'rise', 740),
      PRESS([16, 272, 358, 48], 1700), L([16, 746, 358, 48], 'rise', 1000), PRESS([16, 746, 358, 48], 4000)] },
    'a3-4': { T: 8000, L: [
      STATIC([16, 95, 185, 10], [WIPE([16, 95, 185, 10], '#eceef2', 150, 700)]),
      L([16, 146, 358, 104], 'rise', 100),
      L([16, 272, 358, 48], 'rise', 200), L([16, 336, 358, 48], 'rise', 300), L([16, 400, 358, 48], 'rise', 400), L([16, 464, 358, 48], 'rise', 500),
      PRESS([16, 272, 358, 48], 800),
      L([0, 550, 390, 294], 'up', 1100), L([16, 588, 44, 34], 'pop', 1740, { cvAt: 1730 }), PRESS([16, 746, 358, 48], 4000)] },
    'a3-5': { T: 8000, L: [
      L([49, 146, 291, 186], 'pop', 150, { art: 'vocab-perfect.png', cvr: [96, 138, 178, 196], amb: 'bob' }),
      STATIC([96, 138, 178, 196], [CF([96, 138, 178, 196], 500)]),
      L([140, 346, 110, 30], 'rise', 500), L([18, 385, 354, 50], 'rise', 650),
      L([16, 746, 358, 48], 'rise', 850), PRESS([16, 746, 358, 48], 4000)] },
    'a3-6': { T: 8500, L: [
      L([20, 155, 350, 62], 'rise', 150),
      L([16, 238, 358, 104], 'rise', 400, { ov: [NUM([32, 289, 80, 26], 2500, 800, 1400, 'int', { font: FREDOKA.font, ls: FREDOKA.ls, stroke: FREDOKA.stroke, color: GREEN }, null)] }),
      L([16, 362, 358, 104], 'rise', 600, { ov: [NUM([32, 413, 80, 26], 2500, 1000, 1400, 'int', { font: FREDOKA.font, ls: FREDOKA.ls, stroke: FREDOKA.stroke, color: ORANGE }, null)] }),
      L([16, 682, 358, 48], 'rise', 900), L([90, 758, 210, 26], 'fade', 1000), PRESS([16, 682, 358, 48], 4300)] },

    /* ---------- slide 4: Lingobites ---------- */
    'a4-1': { T: 7500, L: [
      L([20, 125, 350, 280], 'pop', 150, { amb: 'float' }),
      L([16, 596, 358, 122], 'rise', 500), L([16, 746, 358, 48], 'rise', 750), PRESS([16, 746, 358, 48], 4000)] },
    'a4-2': { T: 7500, L: [
      L([30, 170, 330, 192], 'pop', 150, { amb: 'float' }),
      L([110, 392, 170, 34], 'rise', 450), L([20, 430, 350, 50], 'rise', 600), L([55, 550, 285, 28], 'fade', 800),
      L([16, 746, 358, 48], 'rise', 950), PRESS([16, 746, 358, 48], 4000)] },
    'a4-3': { T: 8000, L: [
      L([24, 172, 342, 470], 'rise', 150), PRESS([233, 358, 26, 24], 1200), PRESS([233, 358, 26, 24], 2200),
      L([16, 746, 172, 48], 'rise', 500), L([203, 746, 172, 48], 'rise', 600), PRESS([203, 746, 172, 48], 3500)] },
    'a4-4': { T: 9000, L: [
      L([16, 176, 260, 24], 'fade', 100),
      L([16, 222, 358, 64], 'rise', 300), L([16, 310, 358, 64], 'rise', 450), L([16, 398, 358, 64], 'rise', 600), L([16, 486, 358, 64], 'rise', 750),
      PRESS([16, 310, 171, 64], 2000), PRESS([203, 398, 171, 64], 2300),
      L([105, 698, 190, 28], 'fade', 1100)] },
    'a4-5': { T: 9500, L: [
      L([16, 222, 358, 80], 'rise', 200), L([16, 326, 358, 100], 'rise', 500), L([16, 454, 358, 82], 'rise', 800), L([16, 558, 358, 58], 'rise', 1100),
      L([16, 683, 352, 46], 'rise', 1400), L([16, 747, 352, 46], 'rise', 1550), PRESS([16, 683, 352, 46], 3800)] },
    'a4-6': { T: 8000, L: [
      STATIC([124, 206, 142, 66], [NUM([124, 206, 142, 66], 13, 300, 1200, 'pct', { font: "600 58px/1 Fredoka, 'Open Sans', sans-serif", textAlign: 'center', grad: 'linear-gradient(90deg,#ff7a95,#ff9a78)' }, null)]),
      L([78, 298, 70, 68], 'pop', 1500), L([150, 298, 76, 68], 'fade', 1700), L([248, 298, 66, 68], 'fade', 1850),
      L([16, 622, 358, 98], 'rise', 600), L([16, 746, 358, 48], 'rise', 800), PRESS([16, 746, 358, 48], 4200)] }
  };

  /* ---------- effects: keyframes + duration + easing ---------- */
  var FX = {
    rise:  function (o) { return { k: [{ opacity: 0, transform: 'translateY(' + (o.dy || 18) + 'px)' }, { opacity: 1, transform: 'none' }], d: 560, e: OUT }; },
    pop:   function () { return { k: [{ opacity: 0, transform: 'scale(.55)' }, { opacity: 1, transform: 'scale(1)' }], d: 640, e: SPRING }; },
    fade:  function () { return { k: [{ opacity: 0 }, { opacity: 1 }], d: 450, e: 'ease-out' }; },
    sl:    function () { return { k: [{ opacity: 0, transform: 'translateX(-26px)' }, { opacity: 1, transform: 'none' }], d: 560, e: OUT }; },
    sr:    function () { return { k: [{ opacity: 0, transform: 'translateX(26px)' }, { opacity: 1, transform: 'none' }], d: 560, e: OUT }; },
    up:    function () { return { k: [{ opacity: 0, transform: 'translateY(90px)' }, { opacity: 1, transform: 'none' }], d: 620, e: OUT }; },
    press: function () { return { k: [{ opacity: 1, transform: 'scale(1)' }, { opacity: 1, transform: 'scale(.95)', offset: .4 }, { opacity: 1, transform: 'scale(1)' }], d: 460, e: 'ease-in-out' }; },   /* no brightness filter: the cut-out includes a margin of background, which a filter would grey */
    none:  function () { return null; }
  };
  var AMB = {
    float: { k: [{ transform: 'translateY(0)' }, { transform: 'translateY(-5px)' }], d: 1900, alt: true, e: 'ease-in-out' },
    bob:   { k: [{ transform: 'translateY(0)' }, { transform: 'translateY(-4px)' }], d: 1400, alt: true, e: 'ease-in-out' },
    wave:  { k: [{ transform: 'rotate(-1.6deg)' }, { transform: 'rotate(1.6deg)' }], d: 1100, alt: true, e: 'ease-in-out', origin: '50% 92%' },
    pulse: { k: [{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }], d: 1200, alt: true, e: 'ease-in-out' },
    swing: { k: [{ transform: 'rotate(0)' }, { transform: 'rotate(-13deg)', offset: .12 }, { transform: 'rotate(11deg)', offset: .26 }, { transform: 'rotate(-8deg)', offset: .4 }, { transform: 'rotate(5deg)', offset: .54 }, { transform: 'rotate(0)', offset: .68 }, { transform: 'rotate(0)' }], d: 2600, e: 'ease-in-out', origin: '50% 14%' }
  };

  /* ---------- DOM helpers ---------- */
  function el(cls, parent, tag) { var e = document.createElement(tag || 'div'); if (cls) e.className = cls; if (parent) parent.appendChild(e); return e; }
  function box(e, r, rel) { e.style.left = (r[0] - (rel ? rel[0] : 0)) + 'px'; e.style.top = (r[1] - (rel ? rel[1] : 0)) + 'px'; e.style.width = r[2] + 'px'; e.style.height = r[3] + 'px'; return e; }
  function crop(e, src, r) { e.style.backgroundImage = 'url(' + src + ')'; e.style.backgroundPosition = (-r[0]) + 'px ' + (-r[1]) + 'px'; return e; }

  /* base-image pixels, for cover colours */
  var pix = {};
  function pixels(src, cb) {
    var p = pix[src];
    if (p && p.data) return cb(p.data);
    if (p) return p.q.push(cb);
    p = pix[src] = { q: [cb] };
    var im = new Image();
    im.onload = function () {
      try {
        var c = document.createElement('canvas'); c.width = W; c.height = H;
        var x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0, W, H);
        p.data = x.getImageData(0, 0, W, H).data;
      } catch (e) { p.data = null; p.fail = true; }
      var q = p.q; p.q = [];
      q.forEach(function (f) { f(p.data); });
    };
    im.onerror = function () { p.data = null; p.fail = true; p.q.forEach(function (f) { f(null); }); p.q = []; };
    im.src = src;
  }
  function median(a) { a.sort(function (m, n) { return m - n; }); return a[a.length >> 1]; }
  /* the colour BEHIND a rect: the median of a ring of pixels just outside it (samples inside the screen only).
     Sampling the rect's own edge would pick up the element itself (a dark button gives a dark cover = a ghost). */
  function edgeColour(data, r, inside) {
    if (!data) return '#fff';
    var S = [], pad = inside ? -2 : 4;
    function at(x, y) {
      if (x < 0 || y < 0 || x >= W || y >= H) return;
      var i = (Math.round(y) * W + Math.round(x)) * 4, R = data[i], G = data[i + 1], B = data[i + 2];
      S.push([R + G + B, R, G, B]);
    }
    for (var x = r[0] - pad; x <= r[0] + r[2] + pad; x += 3) { at(x, r[1] - pad); at(x, r[1] + r[3] + pad); }
    for (var y = r[1] - pad; y <= r[1] + r[3] + pad; y += 3) { at(r[0] - pad, y); at(r[0] + r[2] + pad, y); }
    if (S.length < 6) return inside ? '#fff' : edgeColour(data, r, true);
    /* a drop shadow darkens part of the ring: take a sample from the lighter side (70th percentile by brightness), not the median */
    S.sort(function (m, n) { return m[0] - n[0]; });
    var c = S[Math.floor((S.length - 1) * .7)];
    return 'rgb(' + c[1] + ',' + c[2] + ',' + c[3] + ')';
  }

  /* every cut-out is grown by up to 9 px (shadows, 1 px borders and anti-aliasing sit just outside the rects in the spec),
     but never so far that it would overlap another entrance rect of the same screen */
  function padded(l, all) {
    if (l.nosprite || l.art || l.fx === 'none') return l;
    function hit(a, b) { return a[0] < b[0] + b[2] && b[0] < a[0] + a[2] && a[1] < b[1] + b[3] && b[1] < a[1] + a[3]; }
    for (var p = 9; p > 0; p--) {
      var a = [Math.max(0, l.r[0] - p), Math.max(0, l.r[1] - p), 0, 0];
      a[2] = Math.min(W, l.r[0] + l.r[2] + p) - a[0]; a[3] = Math.min(H, l.r[1] + l.r[3] + p) - a[1];
      var ok = all.every(function (o) {
        if (o === l || o.nosprite || o.fx === 'none' || (o.r[0] === l.r[0] && o.r[1] === l.r[1] && o.r[2] === l.r[2] && o.r[3] === l.r[3])) return true;
        var oo = o.art ? (o.cvr || o.r) : o.r;
        return !hit(a, oo);
      });
      if (ok) { var c = {}; for (var k in l) c[k] = l[k]; c.r = a; return c; }
    }
    return l;
  }

  /* ---------- one phone ---------- */
  function Phone(host, key, index) {
    var self = this;
    this.key = key; this.index = index; this.anims = []; this.nums = [];
    this.spec = SPEC[key];
    this.T = this.spec.T;
    this.src = DIR + 'scr/' + key + '.webp';
    var ph = el('lcl-ph', host);
    ph.setAttribute('role', 'img');
    ph.setAttribute('aria-label', host.getAttribute('aria-label') + ', screen ' + (index + 1));
    var inn = this.inn = el('lcl-in', ph);
    var base = el('lcl-base', inn, 'img'); base.src = this.src; base.alt = ''; base.decoding = 'async';
    this.ph = ph;
    this.spec.L.forEach(function (l) { self.layer(padded(l, self.spec.L)); });
    /* the whole screen fades in at the start of each loop and out at the end */
    var fade = inn.animate([{ opacity: 0 }, { opacity: 1, offset: .035 }, { opacity: 1, offset: .95 }, { opacity: 0 }], { duration: this.T, fill: 'both' });
    this.track(fade, 0);
    function fit() { var k = ph.clientWidth / W; if (k) inn.style.transform = 'scale(' + k + ')'; }
    this.fit = fit; fit();
    if (window.ResizeObserver) new ResizeObserver(fit).observe(ph);
  }
  Phone.prototype.track = function (a, delay) { a.pause(); a.currentTime = 0; this.anims.push(a); return a; };
  Phone.prototype.anim = function (target, fx, at, o, dur) {
    var f = FX[fx](o || {}); if (!f) return null;
    return this.track(target.animate(f.k, { duration: f.d, delay: at, easing: f.e, fill: 'both' }));
  };
  Phone.prototype.layer = function (l) {
    var self = this, inn = this.inn;
    if (l.fx === 'press') {
      /* a press only exists for its 460 ms: a cover in the colour behind hides the original, a copy is shrunk on top */
      var pc = box(el('lcl-cv', inn), l.r); pc.style.opacity = 0;
      pixels(this.src, function (d) { pc.style.background = edgeColour(d, l.r); });
      var pw = box(el('lcl-l', inn), l.r); pw.style.opacity = 0;
      crop(el('lcl-s', el('lcl-clip', pw)), this.src, l.r);
      var pf = FX.press(l);
      this.track(pc.animate([{ opacity: 1 }, { opacity: 1 }], { duration: pf.d, delay: l.at, fill: 'none' }));
      this.track(pw.animate(pf.k, { duration: pf.d, delay: l.at, easing: pf.e, fill: 'none' }));
      return;
    }
    var entr = l.fx !== 'none' && l.fx !== 'press';
    var needCover = l.cv !== false && entr && !l.nosprite;
    var cvr = l.cvr || l.r;
    var cv = null;
    if (needCover) {
      cv = box(el('lcl-cv', inn), cvr);
      pixels(this.src, function (d) { cv.style.background = l.cvc || edgeColour(d, cvr); });
      if (l.fx !== 'none') cv.style.background = '#fff';
    }
    var wrap = box(el('lcl-l', inn), l.r);
    if (l.art) wrap.style.mixBlendMode = 'multiply';   /* the exported art has an opaque white backdrop; multiply drops it onto the screen colour */
    if (!l.nosprite) {
      var clip = el('lcl-clip', wrap), s;
      if (l.art) {
        s = el('lcl-art', clip, 'img'); s.src = DIR + 'art/' + l.art; s.alt = '';
        s.style.left = 0; s.style.top = 0; s.style.width = l.r[2] + 'px'; s.style.height = l.r[3] + 'px';
        clip.style.overflow = 'visible';
      } else { s = crop(el('lcl-s', clip), this.src, l.r); }
      if (l.amb) {
        var a = AMB[l.amb];
        if (a.origin) s.style.transformOrigin = a.origin;
        var ent = FX[l.fx] ? FX[l.fx](l) : null;
        var start = l.ambAt != null ? l.ambAt : l.at + (ent ? ent.d : 0);
        var aa = this.track(s.animate(a.k, { duration: a.d, delay: start, easing: a.e, iterations: Infinity, direction: a.alt ? 'alternate' : 'normal', fill: 'backwards' }));
        (this.ambs = this.ambs || []).push(aa);
      }
    }
    this.anim(wrap, l.fx, l.at, l);
    if (cv && l.cvAt != null) this.track(cv.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1, delay: l.cvAt, fill: 'both' }));
    (l.ov || []).forEach(function (o) { self.overlay(wrap, l, o); });
  };
  Phone.prototype.overlay = function (wrap, l, o) {
    var self = this;
    if (o.t === 'wipe') {
      var w = box(el('lcl-wipe', wrap), o.r, l.r);
      if (o.s) crop(w, this.src, o.s); else w.style.background = o.col;
      if (o.s) { w.style.backgroundPosition = (-o.s[0]) + 'px ' + (-o.s[1]) + 'px'; }
      this.track(w.animate([{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }], { duration: o.d, delay: o.at, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'both' }));
    } else if (o.t === 'reveal') {
      var bx = box(el('lcl-cv', wrap), o.r, l.r); bx.style.background = o.bg;
      var sp = crop(box(el('lcl-s', wrap), o.r, l.r), this.src, o.r);      this.track(bx.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1, delay: o.at, fill: 'both', easing: 'steps(1,end)' }));
      this.track(sp.animate([{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 420, delay: o.at, easing: SPRING, fill: 'both' }));
    } else if (o.t === 'num') {
      var nb = box(el('lcl-cv', wrap), o.r, l.r);
      var tx = box(el('lcl-num', wrap), o.r, l.r);
      pixels(this.src, function (d) { nb.style.background = o.bg || edgeColour(d, o.r); });
      var css = o.css || {};
      tx.style.height = o.r[3] + 'px';
      tx.style.display = 'flex'; tx.style.alignItems = 'center';
      tx.style.justifyContent = css.textAlign === 'right' ? 'flex-end' : css.textAlign === 'center' ? 'center' : 'flex-start';
      if (css.font) tx.style.font = css.font;
      if (css.ls) tx.style.letterSpacing = css.ls;
      if (css.stroke) tx.style.webkitTextStroke = css.stroke + ' ' + css.color;
      if (css.color) tx.style.color = css.color;
      if (css.grad) { tx.style.background = css.grad; tx.style.webkitBackgroundClip = 'text'; tx.style.backgroundClip = 'text'; tx.style.color = 'transparent'; tx.style.webkitTextFillColor = 'transparent'; }
      var n = { el: tx, o: o, last: null, cover: nb };
      this.nums.push(n);
      /* hidden until the card is there: ride the entrance (it's a child of the wrapper), show text from t = o.at - 200 */
      this.setNum(n, 0);
    } else if (o.t === 'cf') {
      this.confetti(o);
    }
  };
  Phone.prototype.setNum = function (n, t) {
    var o = n.o, p = Math.max(0, Math.min(1, (t - o.at) / o.d));
    var e = 1 - Math.pow(1 - p, 3);
    var v = Math.round(o.to * e), s;
    if (o.fmt === 'frac8') s = v + '/8'; else if (o.fmt === 'pct') s = v + '%'; else s = String(v);
    if (s !== n.last) { n.el.textContent = s; n.last = s; }
  };
  Phone.prototype.confetti = function (o) {
    var self = this, inn = this.inn, r = o.r;
    var host = box(el('lcl-cf', inn), r); host.style.overflow = 'hidden';
    var cols = ['#ff9b3d', '#4b6bff', '#ff5fa8', '#2bbe56', '#8a5cf6', '#ffd23f'];
    var seed = 7; function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (var i = 0; i < 26; i++) {
      var i2 = el('', host, 'i'), sz = 4 + Math.round(rnd() * 5);
      i2.style.cssText = 'position:absolute;left:' + Math.round(rnd() * (r[2] - sz)) + 'px;top:0;width:' + sz + 'px;height:' + (rnd() > .5 ? sz : Math.round(sz * 2.2)) + 'px;background:' + cols[i % cols.length] + ';border-radius:' + (rnd() > .6 ? '50%' : '1px');
      var dur = 2600 + Math.round(rnd() * 1800);
      var a = i2.animate([
        { opacity: 0, transform: 'translateY(-14px) rotate(0deg)' },
        { opacity: 1, offset: .12 },
        { opacity: 1, offset: .8 },
        { opacity: 0, transform: 'translateY(' + (r[3] + 10) + 'px) rotate(' + Math.round(220 + rnd() * 300) + 'deg)' }
      ], { duration: dur, delay: o.at + Math.round(rnd() * 2400), iterations: Infinity, easing: 'ease-in', fill: 'backwards' });
      this.track(a);
    }
  };
  Phone.prototype.seek = function (t) {
    t = Math.max(0, t % this.T);
    for (var i = 0; i < this.anims.length; i++) this.anims[i].currentTime = t;
    for (var j = 0; j < this.nums.length; j++) this.setNum(this.nums[j], t);
  };

  /* ---------- slides: build phones, run the clock while visible ---------- */
  var slides = [], frozen = false;
  function Slide(host) {
    var self = this;
    this.host = host; this.visible = false; this.t0 = 0; this.phones = [];
    var id = host.getAttribute('data-slide');
    for (var i = 1; i <= 6; i++) if (SPEC[id + '-' + i]) this.phones.push(new Phone(host, id + '-' + i, i - 1));
    this.id = id;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { self.setVisible(es[0].isIntersecting); }, { threshold: 0.35 }).observe(host);
    } else this.setVisible(true);
    this.pose(0);
  }
  Slide.prototype.setVisible = function (on) {
    if (on === this.visible) return;
    this.visible = on;
    if (on) this.t0 = performance.now();
  };
  Slide.prototype.pose = function (now) {
    var self = this;
    this.phones.forEach(function (p, i) {
      var t = now - self.t0 - i * 420;      /* each phone starts a beat after its neighbour, left to right */
      if (t < 0) { p.seek(0); return; }
      p.seek(t);
    });
  };
  (function tick(now) {
    if (!frozen && !document.hidden) slides.forEach(function (s) { if (s.visible) s.pose(now); });
    requestAnimationFrame(tick);
  })(0);

  function init() {
    if (reduce) return;
    document.querySelectorAll('.lcl').forEach(function (h) { if (!h.children.length) slides.push(new Slide(h)); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  /* console / test hooks */
  window.__lcl = {
    slides: slides,
    freeze: function (on) { frozen = on !== false; if (!frozen) slides.forEach(function (s) { s.t0 = performance.now(); }); },
    seek: function (slide, idx, t) {
      frozen = true;
      slides.forEach(function (s) { if (s.id === slide && !s.host.closest('[aria-hidden="true"]')) s.phones[idx].seek(t); });
    },
    seekAll: function (t) { frozen = true; slides.forEach(function (s) { s.phones.forEach(function (p) { p.seek(t); }); }); },
    /* test hook: switch the ambient loops (float / swing / wave ...) off, so a settled phone can be compared with its base image */
    noAmb: function (on) { slides.forEach(function (s) { s.phones.forEach(function (p) { (p.ambs || []).forEach(function (a) { a.effect.updateTiming({ iterations: on === false ? Infinity : 0 }); }); }); }); },
    spec: SPEC
  };
})();
