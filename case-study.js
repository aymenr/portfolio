/* Carousel for case-study pages: scroll-snap track, side arrows, dots, endless loop, auto-advance every 3s.
   The loop uses a clone of the last slide before the first and a clone of the first after the last;
   after a slide settles on a clone we jump (instantly, invisibly) to the real slide.
   Autoplay advances every 3s; it pauses on keyboard focus/touch and while the tab is hidden.
   Reduced-motion users still get the 3s advance, but without the sliding animation. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var behavior = reduce ? 'auto' : 'smooth';
  document.querySelectorAll('.cs-car').forEach(function (car) {
    var stage = car.querySelector('.cs-car-stage');
    var track = car.querySelector('.cs-car-track');
    var real = Array.prototype.slice.call(track.children);
    var n = real.length;
    var dotsEl = car.querySelector('.cs-car-dots');
    var btns = car.querySelectorAll('.cs-car-btn');
    var timer = null, paused = false, settle = null;

    /* clones for the endless loop */
    var firstClone = real[0].cloneNode(true), lastClone = real[n - 1].cloneNode(true);
    [firstClone, lastClone].forEach(function (c) { c.setAttribute('aria-hidden', 'true'); c.querySelectorAll('img').forEach(function (im) { im.loading = 'eager'; }); });
    track.insertBefore(lastClone, real[0]);
    track.appendChild(firstClone);

    var dots = real.map(function (_, i) {
      var d = document.createElement('button');
      d.type = 'button'; d.className = 'cs-car-dot'; d.setAttribute('role', 'tab');
      d.setAttribute('aria-label', 'Slide ' + (i + 1));
      d.addEventListener('click', function () { go(i); restart(); });
      dotsEl.appendChild(d); return d;
    });

    function step() { return real[0].offsetWidth + 16; }
    function pos() { return Math.round(track.scrollLeft / step()); }          /* 0 = last clone, 1..n = real, n+1 = first clone */
    function index() { return (pos() - 1 + n) % n; }                          /* real index 0..n-1 */
    function jump(p) {
      track.style.scrollSnapType = 'none';
      track.scrollLeft = p * step();
      requestAnimationFrame(function () { track.style.scrollSnapType = ''; });
    }
    function go(i) { track.scrollTo({ left: (i + 1) * step(), behavior: behavior }); }  /* i may be -1 or n (the clones) */
    function sync() {
      var i = index();
      dots.forEach(function (d, k) { d.setAttribute('aria-selected', k === i ? 'true' : 'false'); d.classList.toggle('is-on', k === i); });
    }
    function onScroll() {
      window.requestAnimationFrame(sync);
      clearTimeout(settle);
      settle = setTimeout(function () {            /* scrolling has stopped: step off a clone onto the real slide */
        var p = pos();
        if (p === 0) jump(n);
        else if (p === n + 1) jump(1);
      }, 140);
    }
    /* centre the side arrows on the picture, not on the caption below it */
    function place() {
      var art = track.querySelector('.cs-car-art');
      if (art) stage.style.setProperty('--art-h', art.offsetHeight + 'px');
    }

    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() {
      if (paused || document.hidden) return;
      stop(); timer = setInterval(function () { go(index() + 1); }, 3000);
    }
    function restart() { stop(); start(); }
    function pause() { paused = true; stop(); }
    function resume() { paused = false; start(); }

    btns.forEach(function (b) { b.addEventListener('click', function () { go(index() + Number(b.dataset.dir)); restart(); }); });
    track.addEventListener('scroll', onScroll, { passive: true });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(index() + 1); restart(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(index() - 1); restart(); }
    });
    /* only keyboard focus pauses; a mouse click on an arrow must not leave the carousel stuck */
    car.addEventListener('focusin', function (e) { if (e.target.matches && e.target.matches(':focus-visible')) pause(); });
    car.addEventListener('focusout', resume);
    car.addEventListener('touchstart', pause, { passive: true });
    car.addEventListener('touchend', function () { setTimeout(resume, 4000); }, { passive: true });
    document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
    window.addEventListener('resize', function () { place(); jump(index() + 1); });
    track.querySelectorAll('img').forEach(function (im) { im.addEventListener('load', place); });

    jump(1);            /* start on the first real slide */
    place(); sync(); start();
  });
})();

/* Before / After (Visual refresh): one pill flips all three phones together, and it auto-plays
   (every 2.8s) while the section is on screen. Clicking the pill or a phone takes over for 10s. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.cs-shots-ba').forEach(function (panel) {
    var btns = panel.querySelectorAll('.cs-ba-toggle button');
    var timer = null, visible = false, holdUntil = 0;
    function set(state) {
      panel.dataset.state = state;
      btns.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.state === state ? 'true' : 'false'); });
    }
    function flip() { set(panel.dataset.state === 'before' ? 'after' : 'before'); }
    function tick() { if (Date.now() >= holdUntil && !document.hidden) flip(); }
    function start() { if (!timer && visible && !reduce) timer = setInterval(tick, 2800); }
    function stop() { clearInterval(timer); timer = null; }
    function manual(state) { holdUntil = Date.now() + 10000; set(state); }
    btns.forEach(function (b) { b.addEventListener('click', function () { manual(b.dataset.state); }); });
    panel.querySelectorAll('.cs-ba-stage').forEach(function (st) { st.addEventListener('click', function () { manual(panel.dataset.state === 'before' ? 'after' : 'before'); }); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; visible ? start() : stop(); }, { threshold: 0.5 }).observe(panel);
    } else { visible = true; start(); }
    set('after');
  });
})();

/* Screen recordings (Lingobites): silent loops that play while on screen and pause off screen.
   Reduced-motion visitors get play controls instead of autoplay. */
(function () {
  var vids = document.querySelectorAll('video.cs-loop');
  if (!vids.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) { vids.forEach(function (v) { v.controls = true; }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else { v.pause(); }
    });
  }, { threshold: 0.35 });
  vids.forEach(function (v) { io.observe(v); });
})();

/* Screen recordings (Lingobites): silent loops that play while on screen and pause off screen.
   Reduced-motion visitors get play controls instead of autoplay. */
(function () {
  var vids = document.querySelectorAll('video.cs-loop');
  if (!vids.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) { vids.forEach(function (v) { v.controls = true; }); return; }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else { v.pause(); }
    });
  }, { threshold: 0.35 });
  vids.forEach(function (v) { io.observe(v); });
})();
