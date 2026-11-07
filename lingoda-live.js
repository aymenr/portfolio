/* Lingoda motion page: Solution 1 (practice set) and Solution 3 (weekly goal) as one continuous phone walkthrough.
   Markup: <div class="cs-shots" data-story="s1|s3"> with the static <figure>s as the no-JS / reduced-motion fallback.
   The real screenshots stay the base of every screen. Small pieces are cut out of them (same image, positioned)
   and animated on top: buttons press in, the "Mark as complete" check fills, the weekly-goal bar grows, checks pop.
   The "Weekly goal met" screen is rebuilt from cut-outs so Frank can be the live Rive file and the confetti can move.
   All positions are percentages of the screen (measured from the screenshots).
   The walkthrough loops, and pauses while scrolled out of view. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  var DIR = 'case-studies/lingoda-app/screens/';
  var EASE_PUSH = 'cubic-bezier(.32,.72,0,1)';
  var SPRING = 'cubic-bezier(.34,1.56,.64,1)';
  var GREEN = '#2bbe56', TRACK = '#eceef2';

  /* ---------- small DOM helpers ---------- */
  function el(cls, parent, tag) { var e = document.createElement(tag || 'div'); if (cls) e.className = cls; if (parent) parent.appendChild(e); return e; }
  function place(e, r) { e.style.left = r[0] + '%'; e.style.top = r[1] + '%'; e.style.width = r[2] + '%'; e.style.height = r[3] + '%'; return e; }
  /* paint the part of screenshot `src` that sits under rect r = [left, top, width, height] (all % of the screen) */
  function crop(e, src, r) {
    e.style.backgroundImage = 'url(' + DIR + src + '.webp)';
    e.style.backgroundSize = (10000 / r[2]) + '% ' + (10000 / r[3]) + '%';
    e.style.backgroundPosition = (r[2] >= 100 ? 0 : r[0] / (100 - r[2]) * 100) + '% ' + (r[3] >= 100 ? 0 : r[1] / (100 - r[3]) * 100) + '%';
    return e;
  }
  function patch(parent, src, r, cls) { return crop(place(el('lx-patch' + (cls ? ' ' + cls : ''), parent), r), src, r); }
  /* rects measured in screenshot pixels [x0, y0, x1, y1] (x1/y1 exclusive), turned into % of the screen.
     Solution 1 screenshots are 753 x 1628, Solution 3 ones 836 x 1808 (same aspect ratio). */
  function R1(x0, y0, x1, y1) { return [x0 / 7.53, y0 / 16.28, (x1 - x0) / 7.53, (y1 - y0) / 16.28]; }
  function R3(x0, y0, x1, y1) { return [x0 / 8.36, y0 / 18.08, (x1 - x0) / 8.36, (y1 - y0) / 18.08]; }

  /* ---------- erasing small drawn details (sparkles, z's) out of a screenshot ----------
     Cuts box [x0,y0,x1,y1] (screenshot px) into a canvas, finds the pixels `hit` matches (plus a 1 px halo),
     and fills them in from their surroundings, ring by ring. Works over two background colours or over hair.
     The result is cached, so every loop reuses it. `R` is R1 or R3 (the screenshot's px -> % helper). */
  var erased = {};
  function erase(scr, src, box, R, hit) {
    var key = src + box.join(','), cv = el('lx-erase', scr, 'canvas');
    place(cv, R(box[0], box[1], box[2], box[3]));
    var w = cv.width = box[2] - box[0], h = cv.height = box[3] - box[1], ctx = cv.getContext('2d');
    var ready = erased[key] || (erased[key] = new Promise(function (ok) {
      var im = new Image(); im.src = DIR + src + '.webp';
      im.decode().then(function () {
        var c = document.createElement('canvas'); c.width = w; c.height = h;
        var x = c.getContext('2d'); x.drawImage(im, -box[0], -box[1]);
        var img = x.getImageData(0, 0, w, h), d = img.data, n = w * h, m = new Uint8Array(n), i, j;
        for (i = 0; i < n; i++) if (hit(d[i * 4], d[i * 4 + 1], d[i * 4 + 2])) m[i] = 1;
        for (var hal = 0; hal < 2; hal++) {                     /* 2 px halo for the soft anti-aliased edge */
          var grow = m.slice();
          for (i = 0; i < n; i++) if (m[i]) [i - 1, i + 1, i - w, i + w].forEach(function (k) { if (k >= 0 && k < n) grow[k] = 1; });
          m = grow;
        }
        for (var pass = 0, left = 1; left && pass < 80; pass++) {
          left = 0; var next = m.slice();
          for (i = 0; i < n; i++) {
            if (!m[i]) continue;
            var r = 0, g = 0, b = 0, c2 = 0, px = i % w;
            [[i - 1, px > 0], [i + 1, px < w - 1], [i - w, i >= w], [i + w, i < n - w]].forEach(function (q) {
              j = q[0]; if (q[1] && !m[j]) { r += d[j * 4]; g += d[j * 4 + 1]; b += d[j * 4 + 2]; c2++; }
            });
            if (c2) { d[i * 4] = r / c2; d[i * 4 + 1] = g / c2; d[i * 4 + 2] = b / c2; next[i] = 0; } else left++;
          }
          m = next;
        }
        x.putImageData(img, 0, 0); ok(c);
      }, function () { ok(null); });
    }));
    ready.then(function (c) { if (c) ctx.drawImage(c, 0, 0); });
    return cv;
  }

  /* the four-point star of the app's sparkles (Frank's stars, the goal screen) */
  var STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C12.9 7 17 11.1 24 12 17 12.9 12.9 17 12 24 11.1 17 7 12.9 0 12 7 11.1 11.1 7 12 0Z"/></svg>';
  function star(scr, R, cx, cy, size, color) {
    var s = place(el('lx-star', scr), R(cx - size / 2, cy - size / 2, cx + size / 2, cy + size / 2));
    s.innerHTML = STAR; s.firstChild.style.fill = color; return s;
  }
  /* the motion of Frank's two-star Rive file (sparkle.riv): a star pops out of nothing, grows past full size and
     shrinks back to nothing; stars take turns. On screens where the stars belong to the design, they then come back. */
  function twinkle(s, delay) {
    return anim(s, [
      { transform: 'scale(1)', easing: 'cubic-bezier(.5,0,.9,.5)' },
      { transform: 'scale(0)', offset: .32, easing: 'cubic-bezier(.15,.7,.35,1)' },
      { transform: 'scale(1.3)', offset: .66, easing: 'ease-in-out' },
      { transform: 'scale(1)' }
    ], { duration: 720, delay: delay, fill: 'forwards' });   /* forwards only: several twinkles can queue on one star */
  }
  /* a slow, subtle float for stars that sit next to Frank: a small rise and fall, a slight turn and a breath in size.
     It moves the star's drawing, so the twinkle (on the star itself) can still play on top. */
  function floatStar(s, i) {
    return anim(s.firstChild, [
      { transform: 'translateY(0) rotate(0deg) scale(1)' },
      { transform: 'translateY(-14%) rotate(' + (i ? -8 : 8) + 'deg) scale(1.08)', offset: .5 },
      { transform: 'translateY(0) rotate(0deg) scale(1)' }
    ], { duration: 2800 + i * 600, delay: -i * 900, iterations: Infinity, easing: 'ease-in-out' });
  }
  function starIn(s, delay) {
    return anim(s, [{ transform: 'scale(0)' }, { transform: 'scale(1.3)', offset: .55, easing: 'ease-in-out' }, { transform: 'scale(1)' }],
      { duration: 460, delay: delay, easing: 'cubic-bezier(.15,.7,.35,1)', fill: 'both' });
  }
  function screenOf(stage, src, label) {
    var s = el('lx-scr', stage);
    var img = el('', s, 'img'); img.src = DIR + src + '.webp'; img.alt = label || '';
    return s;
  }
  /* a tappable button. `r` is the button plus its soft drop shadow, so the whole thing presses in together.
     Behind it sits a clean copy of the background: a 1px-wide column of the screenshot beside the button
     (at `strip`, % from the left), stretched across. The backgrounds behind these buttons are flat or only
     change top-to-bottom, so nothing of the original button can peek out while the face is scaled down. */
  /* `pill` is the button's own shape (no shadow): only that part darkens on press, through a shade laid over it. */
  function button(scr, src, r, strip, pill, scale, radius, light) {
    var wrap = place(el('lx-btn', scr), r);
    crop(wrap, src, [strip, r[1], .14, r[3]]);
    var face = crop(el('lx-face', wrap), src, r);
    face._scale = scale || .95;
    face._shade = place(el('lx-shade', face), [(pill[0] - r[0]) / r[2] * 100, (pill[1] - r[1]) / r[3] * 100, pill[2] / r[2] * 100, pill[3] / r[3] * 100]);
    face._shade.style.borderRadius = radius || '999px';
    if (light) face._shade.classList.add('is-light');   /* white buttons and cards need a lighter tint to read the same */
    return face;
  }

  /* ---------- the player: a clock that only runs while the phone is on screen ---------- */
  function Player(host, build) {
    var self = this;
    this.host = host; this.build = build;
    this.visible = false; this.alive = 0; this.rives = [];
    var waiting = [];
    this.wait = function (ms, gen) {
      return new Promise(function (ok, no) { waiting.push({ left: ms, ok: ok, no: no, gen: gen }); });
    };
    var last = performance.now();
    (function tick(now) {
      var dt = now - last; last = now;
      if (self.visible) {
        for (var i = waiting.length - 1; i >= 0; i--) {
          var w = waiting[i];
          if (w.gen !== self.alive) { waiting.splice(i, 1); w.no('stale'); continue; }
          w.left -= dt;
          if (w.left <= 0) { waiting.splice(i, 1); w.ok(); }
        }
      }
      requestAnimationFrame(tick);
    })(last);
    /* for inspecting frames from the console: while frozen (setVisible(false)), step the whole walkthrough by `ms` */
    this.advance = function (ms) {
      if (self.visible) return Promise.resolve();
      var STEP = 20, left = ms;
      function frame() {
        var dt = Math.min(STEP, left); left -= dt;
        self.host.getAnimations({ subtree: true }).forEach(function (a) {
          if (a.playState === 'finished') return;
          if (a.playState === 'running') a.pause();
          a.currentTime = (a.currentTime || 0) + dt;
          if (a.currentTime >= a.effect.getComputedTiming().endTime) a.finish();
        });
        for (var i = waiting.length - 1; i >= 0; i--) {
          var w = waiting[i];
          if (w.gen !== self.alive) { waiting.splice(i, 1); w.no('stale'); continue; }
          w.left -= dt;
          if (w.left <= 0) { waiting.splice(i, 1); w.ok(); }
        }
        return new Promise(function (r) { setTimeout(r, 0); }).then(function () {
          self.host.getAnimations({ subtree: true }).forEach(function (a) { if (a.playState === 'running') a.pause(); });
          return left > 0 ? frame() : undefined;
        });
      }
      return frame();
    };
  }
  Player.prototype.setVisible = function (on) {
    if (on === this.visible) return;
    this.visible = on;
    this.host.getAnimations({ subtree: true }).forEach(function (a) { if (on) { if (a.playState === 'paused') a.play(); } else if (a.playState === 'running') a.pause(); });
    this.rives.forEach(function (r) { try { if (!on) r.pause(); else if (r._started) r.play(); } catch (e) {} });
  };

  /* ---------- motion primitives ---------- */
  function anim(e, kf, o) { return e.animate(kf, Object.assign({ fill: 'forwards' }, o)); }
  /* press: the face (button + its shadow) dips in and darkens, then springs back */
  function press(face) {
    var o = { duration: 440, easing: 'ease-out' };
    anim(face._shade, [{ opacity: 0 }, { opacity: 1, offset: .4 }, { opacity: 0 }], o);
    return anim(face, [{ transform: 'scale(1)' }, { transform: 'scale(' + face._scale + ')', offset: .4 }, { transform: 'scale(1)' }], o);
  }
  /* once a screen is fully covered it is hidden, so it can never show through or behind the next one */
  function hideAfter(a, e) { a.finished.then(function () { e.style.visibility = 'hidden'; }, function () {}); }
  function push(from, to) {
    to.style.visibility = 'visible'; to.style.zIndex = 2; from.style.zIndex = 1;
    anim(to, [{ transform: 'translateX(100%)' }, { transform: 'translateX(0)' }], { duration: 560, easing: EASE_PUSH });
    hideAfter(anim(from, [{ transform: 'translateX(0)', filter: 'brightness(1)' }, { transform: 'translateX(-28%)', filter: 'brightness(.88)' }], { duration: 560, easing: EASE_PUSH }), from);
  }
  function pop(from, to) {
    to.style.visibility = 'visible'; to.style.zIndex = 1; from.style.zIndex = 2;
    anim(to, [{ transform: 'translateX(-28%)', filter: 'brightness(.88)' }, { transform: 'translateX(0)', filter: 'brightness(1)' }], { duration: 560, easing: EASE_PUSH });
    hideAfter(anim(from, [{ transform: 'translateX(0)' }, { transform: 'translateX(100%)' }], { duration: 560, easing: EASE_PUSH }), from);
  }
  /* present: the new screen slides up over the old one, which dims underneath */
  function present(from, to) {
    to.style.visibility = 'visible'; to.style.zIndex = 2; from.style.zIndex = 1;
    anim(to, [{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], { duration: 600, easing: EASE_PUSH });
    hideAfter(anim(from, [{ filter: 'brightness(1)' }, { filter: 'brightness(.75)' }], { duration: 600, easing: EASE_PUSH }), from);
  }
  function popIn(e, delay) { return anim(e, [{ transform: 'scale(0)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 520, delay: delay || 0, easing: SPRING, fill: 'both' }); }
  function fadeOut(e, delay) { return anim(e, [{ opacity: 1 }, { opacity: 0 }], { duration: 220, delay: delay || 0, fill: 'both' }); }

  /* a progress bar drawn over the screenshot's own bar (cover hides the baked one) */
  function bar(scr, r, from, to) {
    var cover = place(el('lx-cover', scr), [r[0] - .6, r[1] - .35, r[2] + 1.2, r[3] + .7]);
    var track = place(el('lx-track', scr), r); track.style.background = TRACK;
    var fill = el('lx-fill', track); fill.style.background = GREEN; fill.style.width = from + '%';
    return { fill: fill, grow: function (ms, delay) { return anim(fill, [{ width: from + '%' }, { width: to + '%' }], { duration: ms || 1100, delay: delay || 0, easing: 'cubic-bezier(.45,0,.2,1)' }); } };
  }

  /* "3/8" rolls up to "5/8": both are cut from the two screenshots and slide past each other inside a clip */
  function roll(scr, oldSrc, newSrc, r) {
    var box = place(el('lx-roll', scr), r);
    var a = crop(el('lx-roll-i', box), oldSrc, r), b = crop(el('lx-roll-i', box), newSrc, r);
    b.style.transform = 'translateY(100%)';
    return function (delay) {
      anim(a, [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-100%)', opacity: 0 }], { duration: 420, delay: delay, easing: EASE_PUSH, fill: 'both' });
      anim(b, [{ transform: 'translateY(100%)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 420, delay: delay, easing: EASE_PUSH, fill: 'both' });
    };
  }

  /* ============ Solution 1: practice set ============ */
  var S1 = {
    label: 'Walkthrough: from the home screen the learner starts their practice set, completes the vocabulary list, moves to step 2, and returns home with their weekly goal progressing from 3 to 5 of 8.',
    build: function (stage) {
      /* `s1-home-clean` is the home screen exported from Figma (node 24:68598, 836 x 1808): Aymen's header,
         weekly goal 3/8, Frank without his stars. The stars are drawn on top and float gently. */
      var home = screenOf(stage, 's1-home-clean', 'Home: recommended practice');
      var homeBtn = button(home, 's1-home-clean', R3(52, 1290, 784, 1440), 50 / 8.36, R3(69, 1311, 767, 1413), .96);
      [[146, 526, 12.2], [77, 574.5, 15.5]].forEach(function (s, i) { floatStar(star(home, R3, s[0], s[1], s[2], '#ffc783'), i); });

      var step1 = screenOf(stage, 's1-step1', 'Practice set: step 1 of 2');
      var step1Btn = button(step1, 's1-step1', R1(17, 1418, 736, 1552), 1.06, R1(31, 1439, 721, 1531));

      var vocab = screenOf(stage, 's1-vocab', 'Vocabulary list activity');
      var markBtn = button(vocab, 's1-vocab', R1(23, 1434, 727, 1533), 1.06, R1(31, 1438.5, 721, 1531), .95, null, true);
      /* the empty check icon inside the button (212..260 x 1460.7..1508.7 px), redrawn exactly over the screenshot's:
         white circle, light grey ring, faint grey tick. On "Mark as complete" this same icon turns into the checked one. */
      var tick = place(el('lx-tick', markBtn), [(212 - 23) / 704 * 100, (1460.7 - 1434) / 99 * 100, 48 / 704 * 100, 48 / 99 * 100]);
      tick.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle class="lx-tick-o" cx="12" cy="12" r="11"/>' +
        '<path class="lx-tick-grey" d="M7.2 11.9l4.1 3.3 5.8-6.1"/><path class="lx-tick-white" d="M7.2 11.9l4.1 3.3 5.8-6.1"/></svg>';

      var step2 = screenOf(stage, 's1-step2', 'Practice set: step 2 of 2');
      var step2Btn = button(step2, 's1-step2', R1(18, 1410, 736, 1552), 1.06, R1(31, 1429, 721, 1531));

      var done = screenOf(stage, 's1-done', 'Home: weekly goal now 5 of 8, both activities done');
      /* the header (photo, "Welcome, Aymen!") from the Figma home screen, so both home screens match */
      patch(done, 's1-home-clean', [0, 0, 100, 25]);
      /* start the home screen as it was before: empty checks, 3/8.
         Both checks are centred at x 636 px (y 882 and 1079); a 54 px circle covers them with their soft edge. */
      var GREY = R1(609, 855, 663, 909);                     /* empty circle on the home screenshot's first card */
      var checks = [855, 1052].map(function (t) {
        var r = R1(609, t, 663, t + 54);
        crop(place(el('lx-patch lx-round', done), r), 's1-home', GREY); /* same grey circle, placed on either card */
        var g = patch(done, 's1-done', r, 'lx-round');
        g.style.opacity = 0;
        return g;
      });
      /* the track is 161..690.3 x 511..527.6 px; the green part ends at 339.6 px (33.65%), 5/3 of that is 56.1% */
      var goal = bar(done, R1(161, 510.7, 690.3, 527.3), 33.65, 56.1);
      var count = roll(done, 's1-home', 's1-done', [84.8, 27.9, 7.4, 2.3]);
      /* the two orange stars next to Frank's head (centres 131.5,474 and 69.5,517.5 px; 11 and 14 px across):
         the screenshot's own are covered with the white of the card and redrawn, so they can sparkle and grow */
      var stars = [[131.5, 474, 11], [69.5, 517.5, 14]].map(function (s) {
        var h = s[2] / 2 + 1.5;
        place(el('lx-cover', done), R1(s[0] - h, s[1] - h, s[0] + h, s[1] + h));
        return star(done, R1, s[0], s[1], s[2], '#ffc281');
      });
      stars.forEach(function (s, i) { floatStar(s, i); });    /* same gentle float as on the home screen; the twinkle sits on top */

      [step1, vocab, step2, done].forEach(function (s) { s.style.visibility = 'hidden'; });
      return { first: home, run: function (p, gen) {
        var W = function (ms) { return p.wait(ms, gen); };
        return W(1500)
          .then(function () { press(homeBtn); return W(260); })
          .then(function () { push(home, step1); return W(1700); })
          .then(function () { press(step1Btn); return W(260); })
          .then(function () { push(step1, vocab); return W(1700); })
          .then(function () {
            press(markBtn);
            tick.classList.add('is-on');
            /* unfilled -> checked: the ring and the inside turn green, the grey tick fades, a white tick draws in */
            anim(tick.querySelector('.lx-tick-o'), [{ fill: '#fff', stroke: '#d9dae1' }, { fill: '#2bbe56', stroke: '#2bbe56' }], { duration: 300, delay: 140, easing: 'ease-out', fill: 'both' });
            anim(tick.querySelector('.lx-tick-grey'), [{ opacity: 1 }, { opacity: 0 }], { duration: 160, delay: 140, fill: 'both' });
            anim(tick.querySelector('.lx-tick-white'), [{ strokeDashoffset: 16 }, { strokeDashoffset: 0 }], { duration: 340, delay: 340, easing: 'ease-out', fill: 'both' });
            anim(tick.firstChild, [{ transform: 'scale(1)' }, { transform: 'scale(1.14)', offset: .45 }, { transform: 'scale(1)' }], { duration: 460, delay: 140, easing: 'ease-out' });
            return W(1300);
          })
          .then(function () { push(vocab, step2); return W(1600); })
          .then(function () { press(step2Btn); return W(260); })
          .then(function () { pop(step2, done); return W(700); })
          .then(function () {
            popIn(checks[0], 0); popIn(checks[1], 260);
            goal.grow(1000, 700);
            count(1300);
            /* while the bar grows, Frank's stars twinkle the way his Rive sparkle does (out to nothing, pop back past
               full size), taking turns; once more as the count lands on 5/8 */
            twinkle(stars[1], 850); twinkle(stars[0], 1050);
            twinkle(stars[1], 1650); twinkle(stars[0], 1850);
            return W(4200);
          });
      } };
    }
  };

  /* ============ Solution 3: weekly goal ============ */
  var CONFETTI = ['#5b3fe0', '#c792ea', '#f5a63a', '#f07b6c', '#7b2fe6', '#f6c8a0', '#f7b4df', '#9a8cf6', '#ffcf4d'];
  /* the palette of Frank's own Rive confetti and the screenshot's, plus the app's green and blue */
  var POP_COLORS = CONFETTI.concat(['#2bbe56', '#3d7bf7', '#ff6fa8']);
  var POP_SHAPES = ['paper', 'paper', 'strip', 'curl', 'curl', 'dot', 'tri'];
  var POP_MS = 5200;
  /* A party-popper burst: ~110 pieces shoot out in every direction from around Frank, slow down fast in the air,
     then flutter down (paper-like spin and flip) and fall out of the screen.
     Drawn on one canvas. Time comes from a do-nothing Web Animation on the canvas, so the walkthrough's
     pause / resume / frame-stepping drive the confetti exactly like everything else.
     Motion is a closed-form formula of time (drag k, gravity g), in screen widths, so any frame can be drawn directly. */
  function confetti(layer, delay) {
    var H = 1628 / 753;                                      /* screen height in screen widths */
    var seed = 11; function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }  /* same burst every loop */
    var OX = .5, OY = .31 * H;                                /* behind Frank's chest */
    var k = 2.4, g = 1.15, N = 110, pieces = [];
    for (var i = 0; i < N; i++) {
      var a = rnd() * Math.PI * 2;
      var up = -Math.sin(a);                                  /* 1 = straight up */
      var v = (.75 + rnd() * 1.35) * (up > 0 ? 1 + up * .5 : 1 - (-up) * .35);   /* a popper throws harder upward */
      var start = .05 + rnd() * .06;                          /* appear just outside Frank, not on his face */
      pieces.push({
        x0: OX + Math.cos(a) * start * .8, y0: OY + Math.sin(a) * start,
        vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        shape: POP_SHAPES[i % POP_SHAPES.length], color: POP_COLORS[(i * 7) % POP_COLORS.length],
        size: .018 + rnd() * .016,
        rot: rnd() * 6.28, spin: (rnd() - .5) * 14,
        flip: 5 + rnd() * 9, phase: rnd() * 6.28,
        sway: .012 + rnd() * .02, delay: rnd() * .09
      });
    }
    var cv = el('', layer, 'canvas'), ctx = cv.getContext('2d');
    var clock = anim(cv, [{ opacity: 1 }, { opacity: 1 }], { duration: POP_MS, delay: delay, fill: 'both' });

    function draw(tms) {
      var w = layer.clientWidth, h = layer.clientHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
      if (!w) return;
      if (cv.width !== Math.round(w * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      var T = tms / 1000;
      if (T <= 0) return;
      pieces.forEach(function (p) {
        var t = T - p.delay; if (t <= 0) return;
        var e = 1 - Math.exp(-k * t);
        var x = p.x0 + p.vx / k * e + Math.sin(p.flip * .45 * t + p.phase) * p.sway * e;
        var y = p.y0 + (p.vy * e) / k + (g / k) * (t - e / k);  /* drag + gravity: settles to a slow paper fall */
        if (y > H + .05 || x < -.1 || x > 1.1) return;
        var alpha = Math.min(1, t * 12) * (T > 4.2 ? Math.max(0, 1 - (T - 4.2) / .9) : 1);
        var s = p.size * w, flip = Math.cos(p.flip * t + p.phase);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(x * w, y * w);
        ctx.rotate(p.rot + p.spin * t * (1 - e * .6));
        ctx.fillStyle = p.color; ctx.strokeStyle = p.color;
        if (p.shape === 'dot') { ctx.beginPath(); ctx.arc(0, 0, s * .32, 0, 6.283); ctx.fill(); }
        else if (p.shape === 'curl') {                         /* curly streamer, like Frank's */
          ctx.scale(1, .55 + .45 * Math.abs(flip));
          ctx.lineWidth = s * .2; ctx.lineCap = 'round'; ctx.beginPath();
          for (var j = 0; j <= 12; j++) { var u = j / 12; ctx[j ? 'lineTo' : 'moveTo']((u - .5) * s * 1.5, Math.sin(u * 9.4 + p.phase) * s * .28); }
          ctx.stroke();
        } else {
          ctx.scale(1, flip);                                  /* the paper flips over as it falls */
          if (p.shape === 'tri') { ctx.beginPath(); ctx.moveTo(0, -s * .45); ctx.lineTo(s * .45, s * .35); ctx.lineTo(-s * .45, s * .35); ctx.closePath(); ctx.fill(); }
          else if (p.shape === 'strip') ctx.fillRect(-s * .7, -s * .17, s * 1.4, s * .34);
          else ctx.fillRect(-s * .4, -s * .3, s * .8, s * .6);
        }
        ctx.restore();
      });
    }
    var lastT = -1;
    (function loop() {
      if (!cv.isConnected) return;                           /* the loop restarted and this screen was removed */
      var t = (clock.currentTime || 0) - delay;
      if (t !== lastT) { lastT = t; draw(t); }
      if (clock.playState !== 'finished' || t < POP_MS) requestAnimationFrame(loop); else ctx.clearRect(0, 0, cv.width, cv.height);
    })();
    return cv;
  }

  var riveReady;
  function loadRive() {
    if (window.rive) return Promise.resolve(window.rive);
    if (!riveReady) riveReady = new Promise(function (ok, fail) {
      var s = document.createElement('script'); s.src = 'rive/runtime/rive.js';
      s.onload = function () { window.rive.RuntimeLoader.setWasmUrl(new URL('rive/runtime/rive.wasm', location.href).href); ok(window.rive); };
      s.onerror = fail; document.head.appendChild(s);
    });
    return riveReady;
  }

  var S3 = {
    label: 'Walkthrough: from the home screen the learner commits to a goal, picks 10 minutes a day, sees their goal of 9 activities a week, and later celebrates meeting the weekly goal with Frank and confetti.',
    build: function (stage, p) {
      /* `s3-notset-clean` is the same screen exported from Figma (node 24:68598) with Frank's z's removed;
         the z's are drawn here instead, drifting up and away from his head, growing and fading, one after another */
      var notset = screenOf(stage, 's3-notset-clean', 'Home: no goal set');
      var Z0 = [123, 523], Z1 = [150, 498];                    /* where the smallest z sits; where the big Z was */
      var zs = [0, 1, 2].map(function (i) {
        var z = place(el('lx-z', notset), R3(Z0[0] - 6, Z0[1] - 6, Z0[0] + 6, Z0[1] + 6));
        z.innerHTML = '<svg viewBox="0 0 10 10" aria-hidden="true"><path d="M1.6 1.8H8.4L1.6 8.2H8.4"/></svg>';
        /* subtle and slow: a short drift up and to the right, a gentle grow, a soft fade in and out (4.5 s each, staggered) */
        var dx = (Z1[0] - Z0[0]) / 12 * 100, dy = (Z1[1] - Z0[1]) / 12 * 100;
        anim(z, [
          { transform: 'translate(0,0) scale(.8) rotate(-4deg)', opacity: 0 },
          { transform: 'translate(' + dx * .2 + '%,' + dy * .2 + '%) scale(.88) rotate(-2deg)', opacity: .9, offset: .25 },
          { transform: 'translate(' + dx * .75 + '%,' + dy * .75 + '%) scale(1.12) rotate(2deg)', opacity: .9, offset: .7 },
          { transform: 'translate(' + dx * 1.05 + '%,' + dy * 1.05 + '%) scale(1.25) rotate(4deg)', opacity: 0 }
        ], { duration: 4500, delay: -i * 1500, iterations: Infinity, easing: 'ease-in-out', fill: 'both' });
        return z;
      });
      var card = button(notset, 's3-notset-clean', R3(18, 442, 829, 641), .8, R3(36, 457, 800, 626), .975, '4.6% / 22%', true);

      var choose = screenOf(stage, 's3-choose', 'Choose a daily goal');
      var row = button(choose, 's3-choose', R3(28, 410, 808, 536), 1.08, R3(34, 416, 801, 530), .97, null, true);
      /* starts looking unselected (greyed, with the same 2 px light outline as the other rows), then the tap selects it.
         The 4 px ring covers the row's 2 px purple outline and its soft edges (33..802 x 415..530 px). */
      var ring = el('lx-ring', row);
      ring.style.left = (5 / 780 * 100) + '%'; ring.style.right = (6 / 780 * 100) + '%';
      ring.style.top = (5 / 126 * 100) + '%'; ring.style.bottom = (6 / 126 * 100) + '%';
      row.parentNode.classList.add('lx-unpicked');
      var commit = button(choose, 's3-choose', R3(20, 1564, 817, 1722), 1.08, R3(34, 1586, 801, 1700));

      var goal = screenOf(stage, 's3-goal', 'Your weekly goal: 9 activities a week');
      place(el('lx-cover', goal), [4.0, 14.6, 92.0, 22.2]);  /* plain white page behind the card, so it can rise in from nothing */
      var goalCard = patch(goal, 's3-goal', [4.0, 14.6, 92.0, 22.2]);
      goalCard.style.opacity = 0;
      var cont = button(goal, 's3-goal', R3(20, 1574, 817, 1722), 1.08, R3(34, 1597.5, 801, 1700));
      /* the three sparkles beside Frank's OK hand sit across the edge of the speech bubble: erase them from the
         screenshot (filled from the white and lilac around them) and redraw them so they can sparkle */
      erase(goal, 's3-goal', [522, 1358, 618, 1440], R3, function (r, g, b) { return r > 200 && g > 150 && g - b > 22; });   /* orange, not Frank's skin (darker green) */
      var goalStars = [[595, 1384, 35], [558, 1422, 21], [541, 1384.5, 13]].map(function (s) { return star(goal, R3, s[0], s[1], s[2], '#ffad4b'); });

      /* "Weekly goal met", rebuilt: white page, cut-outs for the text and chrome, live Frank, moving confetti */
      var met = screenOf(stage, 's3-met', 'Weekly goal met, 8 of 8');
      var clean = el('lx-clean', met);
      patch(clean, 's3-goal', [0, 0, 100, 5.6]);             /* status bar (same on every screen, no confetti on this one) */
      /* bottom bar, divider, button and home indicator from a Solution 1 screen with nothing drawn over them
         (same layout and the very same button gradient), with the "Go to homepage" label cut into the button */
      patch(clean, 's1-step2', [0, 85.2, 100, 14.8], 'lx-bottom');
      patch(clean, 's3-met', [31.5, 89.2, 37, 3.4], 'lx-bottom');
      var cf = el('lx-confetti', clean);
      var frankBox = place(el('lx-rive', clean), [25, 17.6, 50, 26.8]);
      var canvas = el('', frankBox, 'canvas');
      var frankStill = patch(frankBox, 's3-met', [27, 22, 44, 23], 'lx-frank-still');
      frankStill.style.left = '11.7%'; frankStill.style.top = '15%'; frankStill.style.width = '73.3%'; frankStill.style.height = '71.7%';
      var title = patch(clean, 's3-met', [10, 47.5, 80, 3.5]);
      var sub = patch(clean, 's3-met', [5, 52.1, 90, 5.05]);
      var label = patch(clean, 's3-met', [7.6, 60.2, 36, 3.0]);
      var num = patch(clean, 's3-met', [84.2, 60.7, 8.2, 2.3]);
      /* the bar is 67.5..766.5 x 1161.5..1178.5 px */
      var track = place(el('lx-track', clean), R3(67.5, 1161.5, 766.5, 1178.5)); track.style.background = TRACK;
      var fill = el('lx-fill', track); fill.style.background = GREEN; fill.style.width = '0%';
      [title, sub, label, track].forEach(function (e) { e.style.opacity = 0; });
      num.style.opacity = 0;

      /* Frank: the Rive file plays its intro, then loops. The canvas stays hidden until the intro starts (Rive would
         otherwise show a resting pose first). Only if Rive is late or fails does the still from the screenshot stand in. */
      var rv = null;
      loadRive().then(function (R) {
        rv = new R.Rive({
          src: 'rive/perfect.riv', canvas: canvas, artboard: 'pasted', stateMachines: 'default', autoplay: false,
          layout: new R.Layout({ fit: R.Fit.Contain, alignment: R.Alignment.Center }),
          onLoad: function () { rv.resizeDrawingSurfaceToCanvas(); p.rives.push(rv); if (met._shown) start(); }
        });
      }).catch(function () { frankBox.classList.add('is-still'); });
      function start() {
        try {
          rv.reset({ artboard: 'pasted', stateMachines: 'default', autoplay: true }); rv.resizeDrawingSurfaceToCanvas();
          frankBox.classList.add('is-live'); rv._started = true;
          if (!p.visible) rv.pause();
        } catch (e) { frankBox.classList.add('is-still'); }
      }

      [choose, goal, met].forEach(function (s) { s.style.visibility = 'hidden'; });
      return { first: notset, cleanup: function () { if (rv) { var i = p.rives.indexOf(rv); if (i >= 0) p.rives.splice(i, 1); try { rv.cleanup(); } catch (e) {} } }, run: function (p, gen) {
        var W = function (ms) { return p.wait(ms, gen); };
        return W(1500)
          .then(function () { press(card); return W(260); })
          .then(function () { push(notset, choose); return W(1100); })
          .then(function () { press(row); row.parentNode.classList.remove('lx-unpicked'); return W(1000); })
          .then(function () { press(commit); return W(260); })
          .then(function () {
            push(choose, goal);
            anim(goalCard, [{ transform: 'translateY(6%) scale(.96)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 600, delay: 380, easing: SPRING, fill: 'both' });
            /* Frank's sparkles pop in one after another, then twinkle once (the sparkle.riv motion) */
            goalStars.forEach(function (s, i) { starIn(s, 650 + i * 150); twinkle(s, 1350 + i * 150); });
            return W(1900);
          })
          .then(function () { press(cont); return W(260); })
          .then(function () {
            present(goal, met);
            /* Frank and the confetti start as the screen lands */
            p.wait(380, gen).then(function () { met._shown = true; if (rv) start(); else frankBox.classList.add('is-still'); }, function () {});
            confetti(cf, 380);
            anim(title, [{ opacity: 0, transform: 'translateY(30%)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: 600, easing: 'ease-out', fill: 'both' });
            anim(sub, [{ opacity: 0, transform: 'translateY(20%)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: 700, easing: 'ease-out', fill: 'both' });
            anim(label, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 850, fill: 'both' });
            anim(track, [{ opacity: 0 }, { opacity: 1 }], { duration: 400, delay: 850, fill: 'both' });
            anim(fill, [{ width: '0%' }, { width: '87.5%', offset: .8 }, { width: '100%' }], { duration: 1500, delay: 1100, easing: 'cubic-bezier(.45,0,.2,1)', fill: 'both' });
            popIn(num, 2500);
            anim(fill, [{ filter: 'brightness(1)' }, { filter: 'brightness(1.25)' }, { filter: 'brightness(1)' }], { duration: 500, delay: 2550, composite: 'add' });
            /* Frank's intro (the wave and cheer) runs ~4.4 s from 380 ms; the walkthrough restarts just before it ends,
               so his resting state never shows */
            return W(4500);
          });
      } };
    }
  };

  var STORIES = { s1: S1, s3: S3 };

  function mount(host) {
    var story = STORIES[host.dataset.story]; if (!story) return;
    host.textContent = '';
    host.classList.add('lx-host');
    var wrap = el('lx', host);
    var phone = el('lx-phone', wrap);
    phone.setAttribute('role', 'img'); phone.setAttribute('aria-label', story.label);
    var p = new Player(host, story.build);
    host._lx = p;   /* handle for inspecting a frame from the console: host._lx.setVisible(false) freezes it */
    var current = null;

    function cycle() {
      var gen = ++p.alive;
      var stage = el('lx-stage', phone);
      var built = story.build(stage, p);
      var prev = current; current = { stage: stage, built: built };
      stage.style.zIndex = 5; stage.style.opacity = 0;
      /* every screenshot is decoded before the new loop fades in, so no screen ever paints blank */
      var imgs = Array.prototype.map.call(stage.querySelectorAll('img'), function (i) { return i.decode ? i.decode().catch(function () {}) : null; });
      Promise.all(imgs).then(function () {
        if (gen !== p.alive) return;
        stage.style.opacity = '';
        var fade = anim(stage, [{ opacity: 0 }, { opacity: 1 }], { duration: prev ? 500 : 350, easing: 'ease' });
        if (!p.visible) fade.pause();
        fade.finished.then(function () {
          if (prev) { if (prev.built.cleanup) prev.built.cleanup(); prev.stage.remove(); }
          stage.style.zIndex = '';
        }, function () {});
        built.run(p, gen).then(function () { if (gen === p.alive) cycle(); }, function () {});
      });
    }
    if ('IntersectionObserver' in window) {
      var started = false;
      new IntersectionObserver(function (es) {
        var on = es[0].isIntersecting;
        if (on && !started) { started = true; p.visible = true; cycle(); return; }
        p.setVisible(on);
      }, { threshold: 0.45 }).observe(phone);
    } else { p.visible = true; cycle(); }
  }

  function init() { Array.prototype.forEach.call(document.querySelectorAll('[data-story]'), mount); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
