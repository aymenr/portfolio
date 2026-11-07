/* Lingobites live screens.
   The eight screen recordings on the Lingobites case study, rebuilt as real HTML so they can be smoother
   than a video: springy presses, wires that draw themselves, rows that glide into place, counters that roll.
   Each scene is { build(c), run(c) }. `build` draws the first frame, `run` plays the story with a fake cursor.
   A scene starts when it scrolls into view, loops, and stops when it leaves. With "reduce motion" it shows the end state. */
(function () {
  'use strict';
  var SW = 1000, SH = 900;
  var A = 'thumb-assets/lingobites/';
  var REDUCE = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CANCEL = { cancelled: true };

  /* ------------------------------------------------------------ small pieces */
  var IC = {
    s0: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="5" y="4" width="14" height="16" rx="2.5"/><rect x="9" y="9" width="6" height="6" rx="1.5"/></svg>',
    s1: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M5 6h5a2 2 0 1 1 4 0h5v5a2 2 0 1 0 0 4v4h-5a2 2 0 1 0-4 0H5v-5a2 2 0 1 1 0-4z"/></svg>',
    s2: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M5 7h14v8H11l-4 3v-3H5z"/></svg>',
    s3: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M8 3l4 6 4-6M12 9a5 5 0 1 0 .01 0z"/></svg>',
    ck: '<svg class="ck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12.5l4 4 8-9"/></svg>',
    spk: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9.5h3.5L12 5v14l-5.5-4.5H3z"/><path d="M15 9a4 4 0 0 1 0 6M17.5 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    trans: '<svg viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="14" height="14" rx="2.5"/><path d="M7 8h6M10 8v1.5c0 2-1.5 3.5-3.5 4M8 12c.8 1.2 2 2 3.5 2.4"/><rect x="11" y="10" width="14" height="14" rx="2.5" fill="currentColor" fill-opacity=".14"/><path d="M15.5 21l3-7 3 7M16.6 18.6h3.8"/></svg>',
    hand: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2l2 11 2.2-3L10.5 14 12 13 9 9l3.5-.5z"/></svg>',
    cursor: '<svg viewBox="0 0 34 34"><path d="M6 4v21.5l5.6-5.3 3.6 8.4 3.9-1.7-3.6-8.2 7.6-.4z" fill="#111" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>',
    bigok: '<svg viewBox="0 0 64 48" width="64" height="48"><path d="M7 25l17 17L58 7" fill="none" stroke="#4cc260" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    bigko: '<svg viewBox="0 0 48 48" width="48" height="48"><path d="M7 7l34 34M41 7L7 41" fill="none" stroke="#ff4d4d" stroke-width="9" stroke-linecap="round"/></svg>',
    nope: '<svg viewBox="0 0 64 64" width="64" height="64"><circle cx="32" cy="32" r="28" fill="none" stroke="#f26b6b" stroke-width="5"/><path d="M12 52L52 12" stroke="#f26b6b" stroke-width="5" stroke-linecap="round"/><path d="M24 20l26 12-10 3-3 10z" fill="#1d2c6b" stroke="#1d2c6b" stroke-width="3" stroke-linejoin="round"/></svg>',
    bubbles: function (bad) {
      return '<svg viewBox="0 0 74 64" width="74" height="64"><rect x="22" y="5" width="48" height="15" rx="5" fill="#f6c9f1"/><rect x="26" y="9" width="24" height="2.4" rx="1.2" fill="#c27ad8"/><rect x="26" y="13.5" width="16" height="2.4" rx="1.2" fill="#c27ad8"/>' +
        '<rect x="4" y="26" width="38" height="15" rx="5" fill="#d9d1f6"/><rect x="8" y="30" width="22" height="2.4" rx="1.2" fill="#8d7ad8"/><rect x="8" y="34.5" width="14" height="2.4" rx="1.2" fill="#8d7ad8"/>' +
        '<rect x="22" y="47" width="48" height="15" rx="5" fill="#d9d1f6"/><rect x="26" y="51" width="26" height="2.4" rx="1.2" fill="#8d7ad8"/><rect x="26" y="55.5" width="16" height="2.4" rx="1.2" fill="#8d7ad8"/>' +
        '<circle cx="12" cy="12" r="8" fill="#5fd078"/><path d="M8.2 12.2l2.6 2.6 5-5.4" fill="none" stroke="#173a22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
        (bad ? '<circle cx="62" cy="33" r="8" fill="#ff5b5b"/><path d="M58.6 29.6l6.8 6.8M65.4 29.6l-6.8 6.8" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>' : '<circle cx="62" cy="33" r="8" fill="#5fd078"/><path d="M58.2 33.2l2.6 2.6 5-5.4" fill="none" stroke="#173a22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>') +
        '<circle cx="12" cy="54" r="8" fill="#5fd078"/><path d="M8.2 54.2l2.6 2.6 5-5.4" fill="none" stroke="#173a22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    },
    star: function (n) {
      var pts = [], k, a, r;
      for (k = 0; k < 10; k++) { a = (-90 + k * 36) * Math.PI / 180; r = k % 2 ? 30 : 58; pts.push((67 + r * Math.cos(a)).toFixed(1) + ',' + (72 + r * Math.sin(a)).toFixed(1)); }
      return '<svg class="lb-star" viewBox="0 0 134 134"><defs><linearGradient id="SG' + n + '" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#ff5fb0"/><stop offset="1" stop-color="#ffa34f"/></linearGradient></defs><polygon points="' + pts.join(' ') + '" fill="url(#SG' + n + ')" stroke="url(#SG' + n + ')" stroke-width="16" stroke-linejoin="round"/></svg>';
    }
  };
  function triesImgs(used, left) {
    var s = '', i;
    for (i = 0; i < used; i++) s += '<img class="used" src="' + A + 'x-round.svg" alt="">';
    for (i = 0; i < left; i++) s += '<img src="' + A + 'target.svg" alt="">';
    return s;
  }
  function triesRow(used, left, label) { return '<div class="lb-tries">' + triesImgs(used, left) + '<span>' + label + '</span></div>'; }
  function nodesHTML(f) {
    var s = '';
    for (var i = 0; i < 4; i++) {
      var done = f >= i + 1, cur = !done && Math.floor(f) === i;
      s += '<div class="lb-node' + (done ? ' done' : '') + (cur ? ' cur' : '') + '" style="left:' + i * 258 + 'px">' + IC['s' + i] + IC.ck + '</div>';
    }
    return s;
  }
  function frame(o) {
    var top = o.noTop ? '' :
      '<div class="lb-top" style="--prog:' + (o.prog || 0) + '"><img class="lb-close" src="' + A + 'close.svg" alt="">' +
      '<div class="lb-title">Lingobites - Talking about my work</div>' +
      '<div class="lb-prog"><div class="lb-track"><i></i></div>' + nodesHTML(o.prog || 0) + '</div>' +
      '<img class="lb-help" src="' + A + 'help.svg" alt=""></div>';
    return top + '<div class="lb-body">' + o.body + '</div>';
  }
  function footer(used, left, label, extraBtn) {
    return '<div class="lb-foot">' + triesRow(used, left, label) + '<div class="lb-btn check">Check</div></div>';
  }
  function report() { return '<div class="lb-report"><img src="' + A + 'flag.svg" alt="">Report error</div>'; }

  /* ------------------------------------------------------------ rive (Frank) */
  var riveP;
  function loadRive() {
    if (window.rive) return Promise.resolve(window.rive);
    if (!riveP) riveP = new Promise(function (ok, no) {
      var s = document.createElement('script');
      s.src = 'rive/runtime/rive.js';
      s.onload = function () { try { window.rive.RuntimeLoader.setWasmUrl(new URL('rive/runtime/rive.wasm', location.href).href); } catch (e) {} ok(window.rive); };
      s.onerror = no; document.head.appendChild(s);
    });
    return riveP;
  }

  /* ------------------------------------------------------------ the runner */
  function mount(host) {
    var def = SCENES[host.dataset.scene];
    if (!def) return;
    var stage = null, run = null;
    function fit() { host.style.setProperty('--s', (host.clientWidth / SW).toFixed(4)); }
    new ResizeObserver(fit).observe(host); fit();
    if (REDUCE) host.classList.add('lb-still');

    function ctxFor(st, tk) {
      var c = { stage: st, tk: tk, defers: [], pos: { x: 1040, y: 760 } };
      c.$ = function (s) { return st.querySelector(s); };
      c.$$ = function (s) { return Array.prototype.slice.call(st.querySelectorAll(s)); };
      c.wait = function (ms) {
        return new Promise(function (ok, no) {
          if (tk.dead) return no(CANCEL);
          setTimeout(function () { tk.dead ? no(CANCEL) : ok(); }, REDUCE ? 0 : ms);
        });
      };
      c.defer = function (fn) { c.defers.push(fn); };
      c.html = function (h) {
        st.innerHTML = h;
        c.cur = document.createElement('div'); c.cur.className = 'lb-cur'; c.cur.innerHTML = IC.cursor;
        c.cur.style.transform = 'translate(' + (c.pos.x - 6) + 'px,' + (c.pos.y - 4) + 'px)';
        st.appendChild(c.cur);
      };
      /* where an element sits on the stage, in stage pixels */
      c.at = function (el, fx, fy) {
        var sr = st.getBoundingClientRect(), k = sr.width / SW, r = el.getBoundingClientRect();
        return { x: (r.left - sr.left) / k + r.width * (fx == null ? .5 : fx), y: (r.top - sr.top) / k + r.height * (fy == null ? .5 : fy) };
      };
      c.move = function (target, o) {
        o = o || {};
        var p = target instanceof Element ? c.at(target, o.fx, o.fy) : target;
        var d = Math.hypot(p.x - c.pos.x, p.y - c.pos.y);
        var ms = o.ms || Math.max(420, Math.min(1050, 300 + d * 0.95));
        c.cur.style.transition = 'transform ' + ms + 'ms cubic-bezier(.5,.02,.18,1)';
        c.cur.style.transform = 'translate(' + (p.x - 6) + 'px,' + (p.y - 4) + 'px)';
        c.pos = p;
        return c.wait(ms);
      };
      c.ripple = function () {
        var r = document.createElement('div'); r.className = 'lb-rip';
        r.style.left = c.pos.x + 'px'; r.style.top = c.pos.y + 'px'; st.appendChild(r);
        setTimeout(function () { r.remove(); }, 700);
      };
      /* move there, press, run `fn` at the moment of the press, release */
      c.click = function (el, fn, o) {
        o = o || {};
        return c.move(el, o).then(function () {
          el.classList.add('hover'); return c.wait(o.hover == null ? 170 : o.hover);
        }).then(function () {
          c.cur.classList.add('down'); el.classList.add('pressed'); c.ripple();
          if (fn) fn();
          return c.wait(140);
        }).then(function () {
          c.cur.classList.remove('down'); el.classList.remove('pressed');
          if (!o.keepHover) el.classList.remove('hover');
          return c.wait(o.after == null ? 120 : o.after);
        });
      };
      c.setProg = function (f, delay) {
        var top = c.$('.lb-top'); if (!top) return;
        top.style.setProperty('--prog', f);
        var nodes = c.$$('.lb-node');
        setTimeout(function () {
          nodes.forEach(function (n, i) {
            var done = f >= i + 1, was = n.classList.contains('done');
            n.classList.toggle('done', done); n.classList.toggle('cur', !done && Math.floor(f) === i);
            if (done && !was) { n.classList.remove('pop'); void n.offsetWidth; n.classList.add('pop'); }
          });
        }, REDUCE ? 0 : (delay == null ? 650 : delay));
      };
      c.panel = function (html, cls) {
        var old = c.$('.lb-panel');
        if (old) { old.classList.remove('up'); setTimeout(function () { old.remove(); }, 750); }
        var p = document.createElement('div'); p.className = 'lb-panel ' + (cls || ''); p.innerHTML = html;
        st.insertBefore(p, c.cur); void p.offsetWidth;
        requestAnimationFrame(function () { p.classList.add('up'); });
        return p;
      };
      c.hidePanel = function () { var p = c.$('.lb-panel'); if (p) { p.classList.remove('up'); setTimeout(function () { p.remove(); }, 750); } };
      c.swap = function (html) {
        var b = c.$('.lb-body');
        b.style.transition = 'opacity .28s'; b.style.opacity = '0';
        return c.wait(300).then(function () {
          b.innerHTML = html; b.style.opacity = '1';
          Array.prototype.forEach.call(b.children, function (k) { k.classList.add('lb-fade-in'); });
          return c.wait(80);
        });
      };
      c.count = function (el, to, ms, fmt) {
        fmt = fmt || function (n) { return String(n); };
        if (REDUCE) { el.textContent = fmt(to); return Promise.resolve(); }
        var t0 = performance.now();
        return new Promise(function (ok, no) {
          (function step(t) {
            if (tk.dead) return no(CANCEL);
            var k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3);
            el.textContent = fmt(Math.round(to * e));
            if (k < 1) requestAnimationFrame(step); else ok();
          })(t0);
        });
      };
      c.burst = function (x, y, n) {
        for (var i = 0; i < (n || 8); i++) {
          var s = document.createElement('i'); s.className = 'lb-spark';
          var a = (Math.PI * 2 * i) / (n || 8) + Math.random() * .5, d = 60 + Math.random() * 50;
          s.style.left = x + 'px'; s.style.top = y + 'px';
          s.style.setProperty('--dx', Math.cos(a) * d + 'px'); s.style.setProperty('--dy', Math.sin(a) * d + 'px');
          s.style.background = 'radial-gradient(circle,' + (i % 2 ? '#ffd27a' : '#ff8ab8') + ' 0 35%,transparent 38%)';
          st.appendChild(s); setTimeout((function (n) { return function () { n.remove(); }; })(s), 900);
        }
      };
      c.rive = function (canvas, file, sm) {
        return loadRive().then(function (rv) {
          return new Promise(function (ok) {
            var cfg = { src: 'rive/' + file, canvas: canvas, autoplay: true,
              layout: new rv.Layout({ fit: rv.Fit.Contain, alignment: rv.Alignment.BottomCenter }),
              onLoad: function () { try { r.resizeDrawingSurfaceToCanvas(); } catch (e) {} ok(r); }, onLoadError: function () { ok(null); } };
            if (sm) cfg.stateMachines = sm;
            var r = new rv.Rive(cfg);
            c.defer(function () { try { r.cleanup(); } catch (e) {} });
          });
        }).catch(function () { return null; });
      };
      return c;
    }

    function mk() {
      if (stage) stage.remove();
      stage = document.createElement('div'); stage.className = 'lb-stage out';
      host.appendChild(stage); host.dataset.ready = '1';
      return stage;
    }
    function loop(tk) {
      var iter = function () {
        if (tk.dead) return;
        var st = mk(), c = ctxFor(st, tk);
        def.build(c);
        requestAnimationFrame(function () { requestAnimationFrame(function () { st.classList.remove('out'); }); });
        c.wait(700).then(function () { return def.run(c); }).then(function () {
          if (REDUCE) return Promise.reject(CANCEL);
          return c.wait(2600);
        }).then(function () { st.classList.add('out'); return c.wait(650); })
          .then(function () { c.defers.forEach(function (f) { f(); }); iter(); },
            function (e) { if (!(REDUCE && !tk.dead)) c.defers.forEach(function (f) { f(); }); if (e !== CANCEL) console.error(e); });
      };
      iter();
    }
    var io = new IntersectionObserver(function (es) {
      var vis = es[es.length - 1].isIntersecting;
      if (vis && !run) { run = { dead: false }; loop(run); }
      else if (!vis && run) { run.dead = true; run = null; }
    }, { threshold: .3 });
    io.observe(host);
  }

  /* ------------------------------------------------------------ matching helpers */
  var LEFT = ['Meine Kollegen', 'Das Gehalt', 'Wie ist', 'Mein Chef ist', 'Es macht mir'];
  var TR = ['My colleagues are very friendly.', 'The salary is good.', 'What is your boss like?', 'My boss is sometimes mean.', 'I enjoy it.'];
  function words(t) { return t.split(' ').map(function (w) { return '<span class="lb-w">' + w + '</span>'; }).join(' '); }
  function matchHTML(right, o) {
    o = o || {};
    var h = '<div class="lb-match">';
    LEFT.forEach(function (t, i) { h += '<div class="lb-it L" style="--i:' + i + '"><span class="k">' + (i + 1) + '</span><span class="tx">' + (o.words ? words(t) : t) + '</span></div>'; });
    right.forEach(function (r, s) { h += '<div class="lb-it R" data-k="' + r.k + '" style="--s:' + s + '"><span class="k">' + r.k + '</span><span class="tx">' + (o.words ? words(r.t) : r.t) + '</span></div>'; });
    TR.forEach(function (t, i) { h += '<div class="lb-tr" style="--i:' + i + ';--d:' + i * .09 + 's">' + t + '</div>'; });
    for (i = 0; i < 5; i++) h += '<div class="lb-conn" style="--i:' + i + '"></div>';
    h += '<svg class="lb-wires" viewBox="0 0 1000 900"></svg></div>';
    var i; return h;
  }
  function wire(c, li, slot) {
    var y0 = 205, gap = 78, y1 = y0 + li * gap + 29, y2 = y0 + slot * gap + 29;
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('pathLength', '1');
    p.setAttribute('d', y1 === y2 ? 'M483 ' + y1 + ' L517 ' + y2 : 'M483 ' + y1 + ' C 508 ' + y1 + ' 492 ' + y2 + ' 517 ' + y2);
    c.$('.lb-wires').appendChild(p); void p.getBoundingClientRect();
    requestAnimationFrame(function () { p.classList.add('on'); });
  }
  function enableCheck(c, on) { var b = c.$('.lb-btn.check'); b.classList.toggle('on', on); if (!on) b.classList.remove('loading'); }
  function ripple(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

  /* ------------------------------------------------------------ cloze helpers */
  function clozeHTML(o) {
    var h = '<div class="lb-ask">Select the missing word</div>' +
      '<div class="lb-sent">' + IC.spk + '<span>' + o.pre + ' <span class="lb-blank"><b>' + o.word + '</b></span>' + (o.post || '') + '</span></div>' +
      '<div class="lb-sentTr">' + o.tr + '</div><div class="lb-opts">';
    o.opts.forEach(function (t, i) { h += '<div class="lb-opt"><span class="k">' + (i + 1) + '</span>' + t + '</div>'; });
    return h + '</div>' + footer(0, 3, '3 tries left');
  }
  function pickOpt(c, i) {
    var o = c.$$('.lb-opt')[i];
    return c.click(o, function () { c.$$('.lb-opt').forEach(function (x) { x.classList.remove('sel'); }); o.classList.remove('dim'); o.classList.add('sel'); enableCheck(c, true); });
  }
  function pressCheck(c) {
    var b = c.$('.lb-btn.check');
    return c.click(b, function () { b.classList.add('loading'); }, { after: 0 }).then(function () { return c.wait(700); }).then(function () { b.classList.remove('loading'); });
  }
  function revealCloze(c, correctIdx, wrongIdx) {
    c.$('.lb-blank').classList.add('fill');
    c.$('.lb-sentTr').classList.add('on');
    c.$$('.lb-opt').forEach(function (o, i) {
      o.classList.remove('sel');
      if (i === correctIdx) { o.classList.add('ok'); ripple(o, 'bounce'); }
      else if (i === wrongIdx) o.classList.add('ko');
    });
  }
  function correctPanel(o) {
    return '<div class="lb-pbody"><div class="lb-pico">' + IC.bigok + '</div><div class="lb-ph">Correct!</div>' +
      '<div class="lb-prow">' + triesImgs(1, 2) + '<span>It took 1 try</span></div>' +
      '<div class="lb-pword">' + IC.spk + '<b>' + o.w + '</b><em>' + o.en + '</em></div><div class="lb-ptype">' + o.type + '</div><div class="lb-pquote">' + o.q + '</div>' + report() + '</div>' +
      '<div class="lb-btn good lb-pbtn next">Next exercise</div>';
  }

  /* ------------------------------------------------------------ scenes */
  var SCENES = {};

  /* 1. Memory mixer: connect the halves, get the sentences confirmed */
  var MIXER_R = [{ t: 'Spaß.', k: 'A' }, { t: 'ist gut.', k: 'B' }, { t: 'sind sehr freundlich.', k: 'C' }, { t: 'manchmal gemein.', k: 'D' }, { t: 'dein Chef?', k: 'E' }];
  var MIXER_PAIRS = [[0, 2], [1, 1], [2, 4], [3, 3], [4, 0]];
  SCENES['memory-mixer'] = {
    build: function (c) { c.html(frame({ prog: 1, body: '<div class="lb-ask">Connect to make full sentences</div>' + matchHTML(MIXER_R) + fabHTML() + footer(0, 3, '3 tries left') })); },
    run: function (c) {
      var L = c.$$('.lb-it.L'), R = c.$$('.lb-it.R'), conns = c.$$('.lb-conn'), seq = Promise.resolve();
      var slot = [0, 1, 2, 3, 4]; /* slot[rightIndex] = the row it currently sits in */
      MIXER_PAIRS.forEach(function (p) {
        seq = seq.then(function () { return c.click(L[p[0]], function () { L[p[0]].classList.add('sel'); }); })
          .then(function () { return c.click(R[p[1]], function () { R[p[1]].classList.add('sel'); }, { after: 60 }); })
          .then(function () {
            [L[p[0]], R[p[1]]].forEach(function (e) { e.classList.remove('sel'); e.classList.add('m'); });
            /* the right item glides to the left item's row; whoever sat there takes its old row */
            var other = slot.indexOf(p[0]), from = slot[p[1]];
            if (other !== p[1]) { slot[other] = from; R[other].style.setProperty('--s', from); }
            slot[p[1]] = p[0]; R[p[1]].style.setProperty('--s', p[0]);
            conns[p[0]].classList.add('on');
            return c.wait(480);
          });
      });
      return seq.then(function () { enableCheck(c, true); return c.wait(500); })
        .then(function () { return pressCheck(c); })
        .then(function () {
          var s = Promise.resolve();
          MIXER_PAIRS.forEach(function (p) {
            s = s.then(function () {
              [L[p[0]], R[p[1]]].forEach(function (e) { e.classList.remove('m'); e.classList.add('ok'); ripple(e, 'bounce'); });
              conns[p[0]].classList.add('ok');
              return c.wait(130);
            });
          });
          return s;
        })
        .then(function () { return c.wait(700); })
        .then(function () {
          c.setProg(2);
        })
        .then(function () {
          c.panel('<div class="lb-pbody" style="min-height:120px;padding-top:34px"><div class="lb-pico">' + IC.bubbles(false) + '</div><div class="lb-ph">All correct!</div><div class="lb-prow">' + triesImgs(1, 2) + '<span>It took 1 try</span></div>' + report() + '</div><div class="lb-btn good lb-pbtn next">Next exercise</div>');
          return c.wait(1400);
        });
    }
  };

  /* 2. Recall & Relate: flashcards, then fill the gap (twice) */
  function cardHTML(front, type, quote, back, cls) {
    return '<div class="lb-card ' + (cls || '') + '"><div class="flip"><div class="face front"><div class="tab dk">Don’t know</div><div class="tab know">Know</div><div class="w">' + front + IC.spk + '</div><div class="t">' + type + '</div><div class="q">' + quote + '</div><i class="flag"></i></div>' +
      '<div class="face back"><div class="tab dk">Don’t know</div><div class="tab know">Know</div><div class="w" style="font-size:36px">' + back + IC.spk + '</div><i class="flag" style="background:linear-gradient(90deg,#c00 0 33%,#fff 33% 66%,#00f 66%)"></i></div></div></div>';
  }
  SCENES['recall-relate'] = {
    build: function (c) {
      c.html(frame({ prog: .3, body: '<div class="lb-ask c">Remember this word?</div><div class="lb-cards">' +
        cardHTML('freundlich', 'adjective', '„Mein Chef ist sehr nett. Er ist immer freundlich.“', 'friendly', 'behind') +
        cardHTML('langweilig', 'adjective', '„Ich finde einen Bürojob langweilig.“', 'boring', '') +
        '</div><div class="lb-hint">Click card or press <kbd>Space</kbd> to flip card</div><div class="lb-fcreport">' + report().replace('lb-report', 'lb-report" style="justify-content:center;margin:0') + '</div>' +
        '<div class="lb-fcfoot"><div class="lb-fcb dk on"><span class="kbd">1</span>✕</div><div class="lb-fcb kn on">✓<span class="kbd">2</span></div></div>' }));
    },
    run: function (c) {
      var cards = function () { return c.$$('.lb-card'); }, dk = c.$('.lb-fcb.dk'), kn = c.$('.lb-fcb.kn');
      function know(card, nextCard, frac) {
        return c.click(kn, function () {
          card.classList.add('tilt-r'); dk.classList.remove('on'); kn.classList.remove('on');
        }, { after: 200 }).then(function () {
          card.classList.add('fly-r'); if (nextCard) { nextCard.classList.remove('behind'); nextCard.classList.add('in'); }
          c.setProg(frac, 0); return c.wait(700);
        }).then(function () { dk.classList.add('on'); kn.classList.add('on'); card.remove(); });
      }
      var c1 = cards()[1], c2 = cards()[0];
      return c.click(c1, function () { c1.classList.add('flipped'); }, { after: 900 })
        .then(function () { return know(c1, c2, .5); })
        .then(function () { return c.wait(300); })
        .then(function () { return c.click(c2, function () { c2.classList.add('flipped'); }, { after: 900 }); })
        .then(function () { return know(c2, null, .75); })
        .then(function () {
          return c.swap(clozeHTML({ pre: 'Mein Chef ist', post: '.', word: 'sympathisch', tr: 'My boss is nice.', opts: ['sympathisch', 'hoch', 'salzig', 'neu'] }));
        })
        .then(function () { return c.wait(400); })
        .then(function () { return pickOpt(c, 0); })
        .then(function () { return c.wait(300); })
        .then(function () { return pressCheck(c); })
        .then(function () {
          revealCloze(c, 0, -1); c.setProg(1, 0);
          c.panel(correctPanel({ w: 'sympathisch', en: 'nice', type: 'adjective', q: '„Mein Chef ist sympathisch.“' }));
          return c.wait(1700);
        })
        .then(function () { return c.click(c.$('.lb-pbtn'), null, { after: 100 }); })
        .then(function () { c.hidePanel(); return c.swap(clozeHTML({ pre: 'Mein Chef ist wirklich', post: ', aber meine Kollegen sind nett.', word: 'gemein', tr: 'My boss is really mean, but my colleagues are nice.', opts: ['lustig', 'neu', 'nett', 'gemein'] })); })
        .then(function () { return c.wait(300); })
        .then(function () { return pickOpt(c, 3); })
        .then(function () { return c.wait(300); })
        .then(function () { return pressCheck(c); })
        .then(function () {
          revealCloze(c, 3, -1);
          c.panel(correctPanel({ w: 'gemein', en: 'mean', type: 'adjective', q: '„Mein Chef ist wirklich gemein, aber meine Kollegen sind nett.“' }));
          return c.wait(1500);
        });
    }
  };

  /* 3. Grammar in action: finish the dialogue */
  var DIALOGUE = [
    ['m', 'Hallo Pippa, wie geht es dir bei der neuen Arbeit?', 'Hello Pippa, how are you doing at your new job?'],
    ['w', 'Hallo Fabio! Es macht mir Spaß. Meine Kollegen sind sehr freundlich und der Job ist <mark>kreativ</mark>. Und wie läuft es bei dir?', 'Hello Fabio! I’m enjoying it. My colleagues are very friendly and the job is creative. How’s it going for you?'],
    ['m', 'Ach, nicht so gut. Mein <mark>Chef</mark> ist manchmal gemein und die Arbeit ist oft langweilig.', 'Oh, not so good. My boss is sometimes mean, and the work is often boring.'],
    ['w', 'Das klingt <mark>mies</mark>. Aber ist dein Job gut bezahlt?', 'That sounds bad. But is your job well-paid?'],
    ['m', 'Ja, das Gehalt ist gut. Aber Geld ist <mark>nicht</mark> alles. Was ist mit deinem Job? Ist er gut bezahlt?', 'Yes, the salary is good. But money isn’t everything. What about your job? Is it well-paid?'],
    ['w', 'Ehrlich gesagt, ist er <span class="gap"><b>schlecht bezahlt</b></span>. Aber ich möchte Erfahrung sammeln.', 'Honestly, it is badly paid. But I want to gain experience.'],
    ['m', 'Das verstehe ich. Und wie ist dein Chef?', 'I understand. And what is your boss like?'],
    ['w', 'Mein Chef ist sehr freundlich und sympathisch. Er ist jung und hat immer lustige Ideen für das Team.', 'My boss is very friendly and nice. He is young and always has fun ideas for the team.']
  ];
  function dRow(i) {
    var d = DIALOGUE[i];
    return '<div class="lb-row" data-i="' + i + '"><img class="av" src="' + A + (d[0] === 'm' ? 'av-man.png' : 'av-woman.png') + '" alt=""><div class="lb-bub' + (i === 5 ? ' act' : '') + '"><div class="tx">' + d[1] + '</div><div class="tr">' + d[2] + '</div></div></div>';
  }
  function chatScroll(c, top) {
    var chat = c.$('.lb-chat'), vh = 574;
    chat.style.transform = 'translateY(' + (top ? 0 : Math.min(0, vh - chat.offsetHeight)) + 'px)';
  }
  SCENES['grammar'] = {
    build: function (c) {
      var rows = ''; for (var i = 0; i < 6; i++) rows += dRow(i);
      c.html(frame({ prog: 2, body: '<div class="lb-ask c">Complete the dialogue by choosing an answer</div><div class="lb-chatwrap"><div class="lb-chat">' + rows + '</div></div>' +
        '<div class="lb-dopts"><div class="lb-opt"><span class="k">1</span>schlecht bezahlt</div><div class="lb-opt"><span class="k">2</span>gut bezahlt</div></div>' +
        '<div class="lb-foot" style="transform:translateY(140px);transition:transform .6s cubic-bezier(.2,.9,.25,1.02)">' + triesRow(0, 3, '3 tries left') + '<div class="lb-btn check">Check</div></div>' }));
      c.$('.lb-bub.act .gap').classList.remove('fill');
    },
    run: function (c) {
      var chat = c.$('.lb-chat'), rows = c.$$('.lb-row'), seq = Promise.resolve();
      rows.forEach(function (r, i) { seq = seq.then(function () { r.classList.add('on'); chatScroll(c); return c.wait(170); }); });
      return seq.then(function () { return c.wait(500); })
        .then(function () { c.$('.lb-dopts').classList.add('up'); return c.wait(800); })
        .then(function () {
          var o = c.$$('.lb-dopts .lb-opt')[0];
          return c.click(o, function () { o.classList.add('sel'); });
        })
        .then(function () {
          c.$('.lb-bub.act .gap').classList.add('fill'); c.$('.lb-bub.act').classList.remove('act');
          return c.wait(450);
        })
        .then(function () { c.$('.lb-dopts').classList.remove('up'); return c.wait(500); })
        .then(function () {
          function more(i) {
            var tmp = document.createElement('div'); tmp.innerHTML = dRow(i);
            var row = tmp.firstChild; chat.appendChild(row);
            var tx = row.querySelector('.tx'), real = tx.innerHTML;
            tx.innerHTML = '<span class="lb-typing"><i></i><i></i><i></i></span>';
            chatScroll(c); void row.offsetWidth; row.classList.add('on');
            return c.wait(1100).then(function () { tx.innerHTML = real; chatScroll(c); return c.wait(350); });
          }
          return more(6).then(function () { return more(7); });
        })
        .then(function () { c.$('.lb-foot').style.transform = 'none'; return c.wait(900); })
        .then(function () { enableCheck(c, true); return c.wait(500); })
        .then(function () { return pressCheck(c); })
        .then(function () {
          var s = Promise.resolve();
          c.$$('.lb-bub').forEach(function (b) { s = s.then(function () { b.classList.add('chk'); return c.wait(140); }); });
          return s;
        })
        .then(function () { return c.wait(500); })
        .then(function () {
          c.setProg(3);
          c.$$('.lb-bub .tr').forEach(function (t) { t.style.setProperty('--h', (t.scrollHeight + 18) + 'px'); });
          c.$$('.lb-bub .tr').forEach(function (t) { t.classList.add('on'); });
          return c.wait(150);
        })
        .then(function () { chatScroll(c, true); return c.wait(1100); })
        .then(function () {
          c.panel('<div class="lb-pbody" style="min-height:120px;padding-top:34px"><div class="lb-pico">' + IC.bubbles(false) + '</div><div class="lb-ph">All correct!</div><div class="lb-prow">' + triesImgs(1, 2) + '<span>It took 1 try</span></div>' + report() + '</div><div class="lb-btn good lb-pbtn next">Next</div>');
          return c.wait(1500);
        });
    }
  };

  /* 4. Translation support: ask first, then hover to translate */
  var TRY_R = [{ t: 'dein Chef?', k: 'A' }, { t: 'manchmal gemein.', k: 'B' }, { t: 'ist gut.', k: 'C' }, { t: 'sind sehr freundlich.', k: 'D' }, { t: 'Spaß.', k: 'E' }];
  var GLOSS = { 'Meine': 'my', 'Kollegen': 'colleagues', 'Das': 'the', 'Gehalt': 'salary', 'Wie': 'how', 'Chef': 'boss' };
  function fabHTML() { return '<div class="lb-fab">' + IC.trans + '</div><div class="lb-tip">' + IC.trans.replace('<svg ', '<svg style="width:16px;height:16px" ') + 'Hover to translate</div><div class="lb-pop"></div>'; }
  function modalHTML() {
    return '<div class="lb-scrim"></div><div class="lb-modal"><h4>' + IC.trans.replace('<svg ', '<svg style="width:22px;height:22px" ') + 'Translation support</h4><img class="x" src="' + A + 'close.svg" alt="">' +
      '<p>Enable translation support? Studies suggest it’s often better to learn by context rather than translating right away. Use this option only if you’re truly stuck.</p>' +
      '<p class="note">Note: Translations may not always be accurate. Please double-check and report any mistakes.</p>' +
      '<div class="acts"><div class="lb-mb t">Translate anyway</div><div class="lb-mb p">Go back</div></div></div>';
  }
  SCENES['try-first'] = {
    build: function (c) { c.html(frame({ prog: 1, body: '<div class="lb-ask">Connect to make full sentences</div>' + matchHTML(TRY_R, { words: true }) + fabHTML() + footer(0, 3, '3 tries left') + modalHTML() })); },
    run: function (c) {
      var fab = c.$('.lb-fab'), scrim = c.$('.lb-scrim'), modal = c.$('.lb-modal'), pop = c.$('.lb-pop');
      function say(w) {
        var p = c.at(w, .5, 1); pop.textContent = GLOSS[w.textContent] || w.textContent.toLowerCase();
        pop.style.left = p.x + 'px'; pop.style.top = (p.y + 8) + 'px'; pop.classList.add('on');
      }
      return c.wait(500).then(function () { return c.click(fab, function () { scrim.classList.add('on'); modal.classList.add('on'); }, { after: 900 }); })
        .then(function () { return c.wait(900); })
        .then(function () {
          var b = c.$('.lb-mb.t');
          return c.click(b, function () { modal.classList.remove('on'); scrim.classList.remove('on'); fab.classList.add('on'); c.$('.lb-tip').classList.add('on'); c.$('.lb-match').classList.add('lb-tr-on'); }, { after: 900 });
        })
        .then(function () {
          var hov = ['Meine', 'Kollegen', 'Das', 'Gehalt'], ws = c.$$('.lb-it.L .lb-w'), s = Promise.resolve(), last;
          function byText(t) { return ws.filter(function (w) { return w.textContent === t; })[0]; }
          hov.forEach(function (t) {
            s = s.then(function () {
              var w = byText(t);
              return c.move(w, { fy: .5, ms: 620 }).then(function () {
                if (last) { last.classList.remove('hot'); last.closest('.lb-it').classList.remove('hover'); }
                w.classList.add('hot'); w.closest('.lb-it').classList.add('hover'); last = w; say(w); return c.wait(1050);
              });
            });
          });
          return s.then(function () { pop.classList.remove('on'); last.classList.remove('hot'); last.closest('.lb-it').classList.remove('hover'); return c.wait(500); });
        });
    }
  };

  /* 5. Full translations after the exercise: check, then "Show answers" */
  var FULL_R = [{ t: 'sind sehr freundlich.', k: 'B' }, { t: 'ist gut.', k: 'A' }, { t: 'Spaß.', k: 'C' }, { t: 'dein Chef?', k: 'D' }, { t: 'manchmal gemein.', k: 'E' }];
  SCENES['full-translations'] = {
    build: function (c) {
      c.html(frame({ prog: 1, body: '<div class="lb-ask">Connect to make full sentences</div>' + matchHTML(FULL_R) + fabHTML() + footer(0, 3, '3 tries left') }));
      c.$$('.lb-it').forEach(function (e) { e.classList.add('m'); });
      c.$$('.lb-conn').forEach(function (e) { e.classList.add('on'); });
      c.$('.lb-btn.check').classList.add('on');
      c.$('.lb-btn.check').style.animation = 'none';
    },
    run: function (c) {
      var L = c.$$('.lb-it.L'), R = c.$$('.lb-it.R'), conns = c.$$('.lb-conn');
      return c.wait(800).then(function () { return pressCheck(c); })
        .then(function () {
          var s = Promise.resolve();
          [0, 1, 2, 3, 4].forEach(function (i) {
            s = s.then(function () {
              var good = i < 2, cls = good ? 'ok' : 'ko';
              [L[i], R[i]].forEach(function (e) { e.classList.remove('m'); e.classList.add(cls); ripple(e, good ? 'bounce' : 'shake'); });
              conns[i].classList.add(cls); return c.wait(good ? 160 : 120);
            });
          });
          return s;
        })
        .then(function () {
          c.setProg(1.55, 0);
          c.panel('<div class="lb-pbody" style="min-height:120px;padding-top:34px"><div class="lb-pico">' + IC.bubbles(true) + '</div><div class="lb-ph">You got 2/5 matches!</div><div class="lb-prow">' + triesImgs(1, 2) + '<span>2 tries left</span></div>' + report() + '</div><div class="lb-btn sec lb-pbtn one2 sa">Show answers</div><div class="lb-btn pri lb-pbtn one ta">Try again</div>', 'warn');
          return c.wait(1900);
        })
        .then(function () { var b = c.$('.lb-pbtn.sa'); return c.click(b, function () { b.classList.add('loading'); }, { after: 0 }); })
        .then(function () { return c.wait(700); })
        .then(function () {
          c.$('.lb-panel .sa').classList.remove('loading');
          /* right items glide to the matching row and turn solid green; the sentences are translated underneath */
          var order = [0, 1, 3, 4, 2];
          order.forEach(function (rIdx, row) {
            R[rIdx].style.setProperty('--s', row);
            if (row >= 2) { [L[row], R[rIdx]].forEach(function (e) { e.classList.remove('ko'); e.classList.add('ok', 'fix'); }); conns[row].classList.remove('ko'); conns[row].classList.add('ok'); }
          });
          return c.wait(900);
        })
        .then(function () {
          c.setProg(2);
          c.$('.lb-match').style.setProperty('--gap', '100px');
          c.$$('.lb-tr').forEach(function (t) { t.classList.add('on'); });
          return c.wait(500);
        })
        .then(function () {
          c.panel('<div class="lb-pbody" style="min-height:120px;padding-top:34px"><div class="lb-pico">' + IC.bubbles(true).replace('#ff5b5b', '#5fd078') + '</div><div class="lb-ph">Here are the correct answers</div><div class="lb-prow"><span style="margin:0">You got 2/5 answers correct on the first try!</span></div>' + report() + '</div><div class="lb-btn pri lb-pbtn next">Next exercise</div>', 'warn');
          return c.wait(1700);
        });
    }
  };

  /* 6. Three tries: wrong, wrong, wrong, and the answer is shown */
  var TRIES_PANEL = function (left) {
    return '<div class="lb-pbody" style="min-height:120px;padding-top:34px"><div class="lb-pico">' + IC.bigko + '</div><div class="lb-ph">Oops, that’s not right!</div><div class="lb-prow">' + triesImgs(3 - left, left) + '<span>' + left + (left === 1 ? ' try left' : ' tries left') + '</span></div>' + report() + '</div>' +
      '<div class="lb-btn sec lb-pbtn one2 sa">Show answers</div><div class="lb-btn pri lb-pbtn one ta">Try again</div>';
  };
  SCENES['three-tries'] = {
    build: function (c) {
      c.html(frame({ prog: .3, body: clozeHTML({ pre: 'Mein Job ist gut', post: '.', word: 'bezahlt', tr: 'My job is well paid.', opts: ['alt', 'bezahlt', 'gekocht', 'wenig'] }) }));
    },
    run: function (c) {
      var guesses = [0, 3, 2], s = Promise.resolve();
      function setTries(left) { var t = c.$('.lb-tries'); t.innerHTML = triesImgs(3 - left, left) + '<span class="tick">' + left + (left === 1 ? ' try left' : ' tries left') + '</span>'; }
      guesses.forEach(function (g, n) {
        s = s.then(function () { return pickOpt(c, g); })
          .then(function () { return c.wait(250); })
          .then(function () { return pressCheck(c); })
          .then(function () {
            var o = c.$$('.lb-opt')[g]; o.classList.remove('sel'); o.classList.add('ko'); ripple(o, 'shake');
            enableCheck(c, false);
            if (n < 2) {
              c.panel(TRIES_PANEL(2 - n), 'warn');
              return c.wait(1500).then(function () {
                var b = c.$('.lb-pbtn.ta'); return c.click(b, function () { b.classList.add('loading'); }, { after: 0 });
              }).then(function () { return c.wait(500); }).then(function () {
                c.hidePanel(); o.classList.remove('ko'); setTries(2 - n); return c.wait(700);
              });
            }
          });
      });
      return s.then(function () {
        c.$$('.lb-opt').forEach(function (o) { o.classList.remove('dim'); });
        revealCloze(c, 1, 2); c.$$('.lb-opt')[1].classList.add('fix'); c.$$('.lb-opt')[3].classList.remove('ko');
        c.panel('<div class="lb-pbody"><div class="lb-pico">' + IC.nope + '</div><div class="lb-ph">Out of tries.</div><div class="lb-prow">' + triesImgs(3, 0) + '</div>' +
          '<div class="lb-pquest">The correct answer is:</div><div class="lb-pword" style="margin-top:8px">' + IC.spk + '<b>bezahlt</b><em>well-paid</em></div><div class="lb-ptype">phrase</div><div class="lb-pquote">„Mein Job ist gut bezahlt.“</div>' + report() + '</div><div class="lb-btn bad lb-pbtn next">Next exercise</div>', 'bad');
        return c.wait(1900);
      });
    }
  };

  /* 7. Tiered score: 61%, two stars, Frank encourages */
  function scoreBottom(label) {
    return '<div class="lb-frank"><canvas width="480" height="500"></canvas></div><div class="lb-say">' + label + '</div>';
  }
  SCENES['feedback-tiers'] = {
    build: function (c) {
      c.html(frame({ noTop: true, body: '<div class="lb-big">00%</div><div class="lb-stars">' + IC.star(0) + IC.star(1) + IC.star(2) + '</div>' +
        scoreBottom('Good effort! Let’s review how you did in each stage. Ready for the next steps?') +
        '<div class="lb-sfoot"><div class="lb-btn dis only">Next</div></div>' }));
    },
    run: function (c) {
      var big = c.$('.lb-big'), stars = c.$$('.lb-star'), canvas = c.$('.lb-frank canvas');
      var rv = c.rive(canvas, 'good-work.riv', 'default');
      return c.wait(300).then(function () { return c.count(big, 61, 1500, function (n) { return (n < 10 ? '0' : '') + n + '%'; }); })
        .then(function () { return c.wait(150); })
        .then(function () {
          var s = Promise.resolve();
          [0, 1].forEach(function (i) {
            s = s.then(function () { stars[i].classList.add('on'); var p = c.at(stars[i]); setTimeout(function () { stars[i].classList.add('glow'); }, 250); c.burst(p.x, p.y, 9); return c.wait(480); });
          });
          return s.then(function () { stars[2].classList.add('dim'); return c.wait(500); });
        })
        .then(function () { c.$('.lb-frank').classList.add('on'); return c.wait(400); })
        .then(function () { c.$('.lb-say').classList.add('on'); var b = c.$('.lb-btn.only'); b.classList.remove('dis'); b.classList.add('pri', 'on'); return c.wait(2400); });
    }
  };

  /* 8. Score by stage: bars fill, compared to your own average */
  var STAGES = [['Memory mixer', 96, 82, 19, true], ['Recall and relate', 80, 60, 34, true], ['Grammar in action', 50, 60, 16, false]];
  SCENES['feedback-breakdown'] = {
    build: function (c) {
      var bars = STAGES.map(function (s) {
        return '<div class="lb-bar"><label>' + s[0] + '</label><div class="rowx"><div class="trk"><div class="fil" data-w="' + s[1] + '"></div><div class="avg" style="left:' + (516 * s[2] / 100) + 'px"></div></div><div class="dl ' + (s[4] ? 'up' : 'dn') + '"><span>0%</span></div></div></div>';
      }).join('');
      c.html(frame({ noTop: true, body: '<div class="lb-sttl">Your score by stage</div><div class="lb-bars">' + bars + '</div><div class="lb-fb">Give feedback ▢</div>' +
        scoreBottom('To improve your Grammar in action, review the <a>lesson summary</a> and try this Lingobites lesson again to see how much you’ve improved.') +
        '<div class="lb-sfoot"><div class="lb-btn sec dis l">Retry this Lingobites lesson</div><div class="lb-btn dis r">Exit</div></div>' }));
      c.$('.lb-fb').textContent = 'Give feedback';
    },
    run: function (c) {
      var bars = c.$$('.lb-bar'), s = Promise.resolve();
      STAGES.forEach(function (st, i) {
        s = s.then(function () {
          var b = bars[i]; b.classList.add('on');
          return c.wait(250).then(function () {
            b.querySelector('.avg').classList.add('on'); return c.wait(250);
          }).then(function () {
            b.querySelector('.fil').style.width = (516 * st[1] / 100) + 'px';
            return c.wait(900);
          }).then(function () {
            var dl = b.querySelector('.dl'); dl.classList.add('on');
            if (st[4]) { var p = c.at(dl); c.burst(p.x, p.y, 6); }
            return c.count(dl.querySelector('span'), st[3], 700, function (n) { return n + '%'; });
          }).then(function () { return c.wait(250); });
        });
      });
      return s.then(function () { c.$('.lb-fb').classList.add('on'); return c.wait(350); })
        .then(function () {
          var canvas = c.$('.lb-frank canvas'); c.rive(canvas, 'good-try.riv', 'default');
          c.$('.lb-frank').classList.add('on'); return c.wait(450);
        })
        .then(function () {
          c.$('.lb-say').classList.add('on');
          var l = c.$('.lb-btn.l'), r = c.$('.lb-btn.r');
          l.classList.remove('dis'); r.classList.remove('dis'); r.classList.add('pri', 'on');
          return c.wait(2800);
        });
    }
  };

  /* ------------------------------------------------------------ boot */
  function boot() { Array.prototype.forEach.call(document.querySelectorAll('.lb-live[data-scene]'), mount); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
