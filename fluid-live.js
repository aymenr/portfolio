/* StudySmarter Treatment 1 / 2 as live screens.
   FluidLive.create('1' | '2', container) draws the app at 375x812, scaled to fit, and returns
   { captions, dwell, show(i), stop() }. show(i) plays beat i: it sets the full screen state, then runs a short
   timed sequence (a finger tapping, text typing, a counter ticking). CSS does the actual transitions. */
(function () {
  var U = 'case-studies/fluid-learn/ui/';
  var TXT = 'To Produce Cytokines to regulate inflammation';
  var ICON = {
    x: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    gear: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
    chev: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    lock: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>',
    book: '<svg width="REPLACE" height="REPLACE" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    flag: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V4M4 4h14l-3 4.5L18 13H4"/></svg>',
    cube: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8l9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8"/></svg>'
  };
  var book = function (n) { return ICON.book.replace(/REPLACE/g, n); };

  function status() {
    return '<div class="fl-status"><span class="tm">9:41</span><span class="notch"></span><span class="ic">' +
      '<svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx=".8"/><rect x="4.7" y="5" width="3" height="6" rx=".8"/><rect x="9.4" y="2.5" width="3" height="8.5" rx=".8"/><rect x="14" y="0" width="3" height="11" rx=".8"/></svg>' +
      '<svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor"><path d="M7.5 2.2c2 0 3.8.8 5.2 2l1-1.1A9.3 9.3 0 0 0 7.5.7 9.3 9.3 0 0 0 1.3 3.1l1 1.1a7.7 7.7 0 0 1 5.2-2zm0 3.3c1.1 0 2 .4 2.8 1l1-1.1a6 6 0 0 0-7.6 0l1 1.1c.8-.6 1.7-1 2.8-1zm0 3.2L9.3 7a3.5 3.5 0 0 0-3.6 0z"/></svg>' +
      '<svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x=".5" y=".5" width="21" height="11" rx="3.2" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="15" height="8" rx="2" fill="currentColor"/><path d="M23 4v4c.8-.3 1.5-1 1.5-2S23.800 4.300 23 4z" fill="currentColor" opacity=".45"/></svg></span></div>';
  }

  function markup(t) {
    var t2 = t === '2';
    var chipTxt = '<span>2/2</span>';
    return '<div class="fl-bg"></div>' +
      '<div class="fl-q">' +
        '<div class="fl-head">' +
          '<div class="fl-row"><button class="fl-ib" data-x aria-hidden="true" tabindex="-1">' + ICON.x + '</button><p class="fl-title h">Review: Cell Biology</p>' +
            '<div class="fl-right"><div class="fl-chip" data-chip><img src="' + U + 'book.webp" alt="">' + chipTxt + '<b class="minus">−1</b></div><button class="fl-ib" tabindex="-1" data-gear aria-hidden="true">' + ICON.gear + '</button></div></div>' +
          '<div class="fl-prog"><div class="fl-bar"><div class="g1"><i></i><i></i><i></i></div><div class="g2"><i></i><i></i><i></i></div></div>' +
            '<div class="fl-chip3"><img src="' + U + 'book.webp" alt="">0/3</div></div>' +
        '</div>' +
        '<div class="fl-banner" data-banner-el><span>Unlock all question types, explanations and hints with Premium</span>' + ICON.chev + '</div>' +
        '<div class="fl-main">' +
          '<div class="fl-mascot"><img src="' + U + 'mascot.webp?v=2" alt=""></div>' +
          '<div class="fl-card ty"><p class="lbl">Type your answer</p><p class="qt h">What is the main function of white blood cells in the immune system?</p>' +
            '<div class="fl-in" data-in><span class="val" data-val>Type here</span><i class="caret"></i></div><p class="fl-wrong">' + TXT + '</p>' +
            '<div class="fl-hr"></div><div class="fl-hintrow"><span class="fl-pill hint" data-hint><span class="fl-lock">' + ICON.lock + '</span>Get a hint</span></div></div>' +
          '<div class="fl-card mc"><p class="lbl">Choose answer</p><span class="flag">' + ICON.flag + '</span><p class="qt h">What is the powerhouse of the cell?</p>' +
            '<div class="fl-opt">To engulf and destroy pathogens directly</div><div class="fl-opt">To activate T cells for an immune response</div><div class="fl-opt">To recognize and bind to antigens and pathogens</div><div class="fl-opt">To Produce Cytokines to regulate inflammation</div></div>' +
        '</div>' +
        '<div class="fl-bottom"><div class="fl-btn" data-idk>I don’t know</div><div class="fl-btn dis chk" data-chk>Check answer</div></div>' +
        '<div class="fl-help"><p class="h">Don’t give up!</p><p class="s">Expected answer: ' + TXT.replace('To Produce', 'To produce') + '.</p>' +
          '<div class="btns"><div class="fl-btn expl" data-explain><span class="fl-lock" style="display:grid">' + ICON.lock + '</span>Explain</div><div class="fl-btn dark cont">Continue</div></div></div>' +
      '</div>' +
      '<div class="fl-dim"></div>' +
      '<div class="fl-sheet trigger"><img class="ill" src="' + U + 'trigger-illustration.webp?v=2" alt=""><div class="tx"><p class="h">Enjoying Fluid Learn Mode?</p><p>Stay unlimited — upgrade for all question types, hints, and explanations.</p></div>' +
        '<div class="btns"><div class="fl-btn blue" data-premium-btn>Get premium</div><div class="fl-btn">Continue with limited access</div></div></div>' +
      '<div class="fl-sheet out"><span class="xbtn">' + ICON.x + '</span><div class="books"><img src="' + U + 'book.webp" alt=""><img src="' + U + 'book.webp" alt=""></div>' +
        '<p class="h">You have <span data-left>0</span> sessions left today!</p><p class="s">You get 2 new sessions in <b>3h 11m</b></p>' +
        '<div class="btns"><div class="fl-btn blue" data-unl>' + book(20) + 'Get unlimited sessions</div><div class="fl-btn">Continue with flashcard learning</div></div></div>' +
      '<div class="fl-sheet settings"><div class="top"><p class="h">Settings</p><span class="xbtn">' + ICON.x + '</span></div><p class="sec">Learn Mode</p>' +
        '<div class="set-banner"><span>' + (t2 ? 'Unlock unlimited sessions with Premium' : 'Unlock&nbsp; questions types, explanations and hints') + '</span>' + ICON.chev + '</div>' +
        (t2
          ? '<div class="set-opt locked" data-flm><h4>Fluid Learn Mode <span class="mini"><img src="' + U + 'book.webp" alt="">0/2</span></h4><p>Performance adaptive quiz based on your flashcards</p><i class="rad"></i></div>' +
            '<div class="set-opt" data-flash><h4>Flashcard Mode</h4><p>Legacy Spaced Repetition Flashcard Mode</p><i class="rad"></i></div>'
          : '<div class="set-opt on" data-flm><h4>Fluid Learn Mode</h4><p>Performance adaptive quiz based on your flashcards</p><i class="rad"></i></div>' +
            '<div class="set-opt" data-flash><h4>Flashcard Mode</h4><p>Legacy Spaced Repetition Flashcard Mode</p><i class="rad"></i></div>') +
        '<div class="set-hr"></div><div class="set-row">Sound effects<i class="tgl"></i></div><div class="set-row">Haptics<i class="tgl"></i></div>' +
        '<div class="btns"><div class="fl-btn">Cancel</div><div class="fl-btn dark">Save</div></div></div>' +
      '<div class="fl-prem"><div class="phero"><span class="logo">' + ICON.cube + '</span><span class="close" data-pclose>' + ICON.x.replace('width="20" height="20"', 'width="18" height="18"').replace('currentColor', '#fff') + '</span>' +
        '<div class="ic">' + book(32).replace('currentColor', '#fff') + '</div>' +
        (t2 ? '<h4 class="h" style="top:238px">Unlimited Fluid learning mode sessions</h4><p>Practice all you want with a wide variety of questions.</p>'
            : '<h4>Get the full Fluid Learn Mode</h4><p>All question types, hints and explanations</p>') +
        '<div class="dots"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>' +
        '<p class="choose h">Choose your trial</p>' +
        '<div class="plans"><div class="plan on" data-plan1><b>Free</b><span>for 7 days</span><i class="ck">' + ICON.check + '</i></div><div class="plan" data-plan2><b>6,99€</b><span>for 30 days</span><i class="ck">' + ICON.check + '</i></div></div>' +
        '<div class="notify">Notify me before my trial period ends<i class="sw on" data-sw></i></div>' +
        '<div class="redeem" data-redeem>Redeem 7 days for 0.00€</div><p class="fine">7-day free trial, then 69,99€ per year.<br>Cancel anytime.</p></div>' +
      '<div class="fl-tip hint">Unlock all question types, explanations and hints with Premium</div>' +
      '<div class="fl-tip expl">Unlock all question types, explanations and hints with Premium</div>' +
      status() + '<div class="fl-home"></div><div class="fl-touch"></div>';
  }

  var G_COUNT = { '1': 3, '2': 2 };

  function phone(t, gi, host) {
    var wrap = document.createElement('div'); wrap.className = 'fl-wrap';
    var fl = document.createElement('div'); fl.className = 'fl'; fl.dataset.t = t;
    fl.innerHTML = markup(t); wrap.appendChild(fl); host.appendChild(wrap);
    fl.setAttribute('role', 'img'); fl.setAttribute('aria-label', 'Animated StudySmarter Fluid Learn screens');
    var $ = function (s) { return fl.querySelector(s); };
    var touch = $('.fl-touch'), timers = [], noTouch = t === '1';
    var count = 2;

    function fit() { var w = wrap.getBoundingClientRect().width; if (w) fl.style.setProperty('--k', w / 375); }
    fit();
    if (window.ResizeObserver) new ResizeObserver(fit).observe(wrap); else window.addEventListener('resize', fit);

    function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
    function clear() { timers.forEach(clearTimeout); timers = []; }
    function S(o) { Object.keys(o).forEach(function (k) { fl.dataset[k] = o[k]; }); }
    function base() { S({ sheet: 'none', premium: '0', banner: '0', q: 'type', help: '0', seg: '0', chip3: '0', dry: '0' }); fl.classList.remove('is-ready'); setVal('', false); fl.querySelectorAll('.fl-tip').forEach(function (e) { e.classList.remove('on'); }); touch.classList.remove('on', 'press'); }
    function setVal(s, typing) {
      var v = $('[data-val]'), i = $('[data-in]');
      v.textContent = s || 'Type here'; i.querySelector('.val').style.color = s ? '' : 'var(--t3)';
      i.classList.toggle('is-typing', !!typing);
    }
    function typeText(ms, per) {
      setVal('', true);
      for (var k = 1; k <= TXT.length; k++) (function (k) { at(ms + k * per, function () { setVal(TXT.slice(0, k), true); if (k === 6) { fl.classList.add('is-ready'); } }); })(k);
    }
    function pos(el) {
      var a = el.getBoundingClientRect(), b = fl.getBoundingClientRect(), k = b.width / 375;
      return { x: (a.left - b.left + a.width / 2) / k, y: (a.top - b.top + a.height / 2) / k };
    }
    /* a finger glides to el, presses, lets go */
    function tap(sel, ms, after) {
      at(ms - 600, function () { var el = $(sel); if (!el) return; var p = pos(el); touch.classList.add('jump'); if (!touch.classList.contains('on')) { touch.style.left = p.x + 30 + 'px'; touch.style.top = p.y + 70 + 'px'; } void touch.offsetWidth; touch.classList.remove('jump'); touch.classList.add('on'); });
      at(ms - 450, function () { var el = $(sel); if (!el) return; var p = pos(el); touch.style.left = p.x + 'px'; touch.style.top = p.y + 'px'; });
      at(ms, function () { var el = $(sel); touch.classList.add('press'); if (el) el.classList.add('is-tap'); if (after) after(); });
      at(ms + 180, function () { var el = $(sel); touch.classList.remove('press'); if (el) el.classList.remove('is-tap'); });
      at(ms + 700, function () { touch.classList.remove('on'); });
    }
    function setCount(n, anim) {
      count = n; var chip = $('[data-chip]'); chip.querySelector('span').textContent = n + '/2';
      chip.classList.toggle('is-empty', n === 0);
      if (anim) { chip.classList.remove('pop'); void chip.offsetWidth; chip.classList.add('pop'); var m = chip.querySelector('.minus'); m.classList.remove('go'); void m.offsetWidth; m.classList.add('go'); }
      var l = $('[data-left]'); if (l) l.textContent = n;
    }
    function tip(name, on, sel) {
      var e = $('.fl-tip.' + name);
      if (on && sel) {
        var a = $(sel).getBoundingClientRect(), b = fl.getBoundingClientRect(), k = b.width / 375;
        e.style.left = Math.max(8, (a.left - b.left) / k - 8) + 'px';
        e.style.top = ((a.top - b.top) / k - e.offsetHeight - 14) + 'px';
        e.style.setProperty('--ax', (a.width / k / 2 + 1) + 'px');
      }
      e.classList.toggle('on', on);
    }

    function plans(one) { $('[data-plan1]').classList.toggle('on', one); $('[data-plan2]').classList.toggle('on', !one); }
    function shake(sel) { var h = $(sel); h.classList.remove('shake'); void h.offsetWidth; h.classList.add('shake'); }
    function trialTaps(t0) { tap('[data-redeem]', t0); }   /* the plan selection is not animated, only the redeem press */

    /* Each phone plays one group of the original beats as a single flow and loops. */
    var G = {
      '1': [
        { label: 'Upgrade prompt', dwell: 7.8, run: function () {
          base(); S({ seg: '1' }); plans(true); $('[data-sw]').classList.add('on');
          at(700, function () { S({ sheet: 'trigger' }); });
          tap('[data-premium-btn]', 3200);                       /* the button is pressed first ... */
          at(3600, function () { S({ premium: '1' }); });        /* ... then the sheet comes up */
        } },
        { label: 'Locked hints', dwell: 7.6, run: function () {
          base(); S({ banner: '1', seg: '1', q: 'type' });
          typeText(500, 30);                                                    /* the user fills in the blank ... */
          tap('[data-chk]', 2150);                                              /* ... presses Check answer ... */
          at(2700, function () { S({ help: '1' }); fl.classList.remove('is-ready'); });   /* ... the wrong-answer panel slides in (slowly) ... */
          /* ... 2s later the locked Explain button is pressed, and only then its tooltip appears */
          tap('[data-explain]', 4700, function () { shake('[data-explain]'); at(350, function () { tip('expl', true, '[data-explain]'); }); });
        } },
        { label: 'Settings', dwell: 5.6, run: function () {
          base(); S({ banner: '1', seg: '1' });
          tap('[data-gear]', 700, function () { S({ sheet: 'settings' }); });
          tap('.set-banner', 3500);
        } }
      ],
      '2': [
        { label: 'Out of sessions', dwell: 6.4, run: function () {
          base(); setCount(0, false); S({ seg: '1', dry: '1' }); plans(true);   /* starts already at 0/2, books already grey */
          at(500, function () { S({ sheet: 'out' }); });                     /* only the sheet itself comes in */
          tap('[data-unl]', 3200);
          at(3600, function () { S({ premium: '1' }); });
        } },
        { label: 'Settings', dwell: 4.2, run: function () {
          base(); S({ seg: '1' }); setCount(0, false);
          $('[data-flm]').classList.remove('on'); $('[data-flash]').classList.add('on');
          tap('[data-gear]', 600, function () { at(250, function () { S({ sheet: 'settings' }); }); });   /* gear pressed, the settings sheet comes in, that's all */
        } }
      ]
    };
    var g = G[t][gi];
    base();

    /* play: run the flow, let the phone settle back to the start screen, run it again */
    /* play: run the flow once and hold its last screen, then call onDone (the next flow starts from its own phone) */
    function play(onDone) { clear(); g.run(); at(g.dwell * 1000, function () { if (onDone) onDone(); }); }
    return { label: g.label, dwell: g.dwell, el: wrap, play: play, stop: clear };
  }

  /* one phone at a time with a pill per flow: it plays them in turn and loops; clicking a pill jumps to that flow */
  function create(t, host) {
    var set = document.createElement('div'); set.className = 'fl-one'; set.dataset.t = t;
    var stage = document.createElement('div'); stage.className = 'fl-stage';
    var ol = document.createElement('ol'); ol.className = 'fl-pills';
    var phones = [], btns = [], cur = 0, running = false;
    for (var i = 0; i < G_COUNT[t]; i++) (function (i) {
      var slot = document.createElement('div'); slot.className = 'fl-slot'; stage.appendChild(slot);
      var p = phone(t, i, slot); phones.push(p);
      var li = document.createElement('li'), b = document.createElement('button');
      b.type = 'button'; b.className = 'fl-pill-btn';
      b.innerHTML = '<span class="n">' + (i + 1) + '</span><span class="t">' + p.label + '</span><i class="fill"></i>';
      b.addEventListener('click', function () { show(i); });
      li.appendChild(b); ol.appendChild(li); btns.push(b);
    })(i);
    function show(i) {
      phones.forEach(function (p) { p.stop(); });
      cur = i; running = true;
      Array.prototype.forEach.call(stage.children, function (sl, k) { sl.classList.toggle('is-active', k === i); });
      btns.forEach(function (b, k) {
        b.classList.remove('is-on'); void b.offsetWidth;
        if (k === i) b.style.setProperty('--dwell', phones[i].dwell + 's');
        b.classList.toggle('is-on', k === i); b.classList.toggle('is-done', k < i);
        b.setAttribute('aria-current', k === i ? 'step' : 'false');
      });
      var li = btns[i].parentNode, box = li && li.parentNode;
      if (box && box.scrollWidth > box.clientWidth) box.scrollTo({ left: li.offsetLeft - (box.clientWidth - li.offsetWidth) / 2, behavior: 'smooth' });
      phones[i].play(function () { show((i + 1) % phones.length); });
    }
    set.appendChild(stage); set.appendChild(ol); host.appendChild(set);
    stage.children[0].classList.add('is-active'); btns[0].classList.add('is-on');
    return {
      el: set,
      play: function () { show(cur); },
      stop: function () { phones.forEach(function (p) { p.stop(); }); btns.forEach(function (b) { b.classList.remove('is-on'); }); }
    };
  }
  window.FluidLive = { create: create };
})();
