/* Motion layer for the case-study motion pages. Works on top of the normal page markup:
   - scroll reveals and number count-ups
   - [data-flow]: turns a row of screens into one device that plays through them as a walkthrough
   - [data-anno], [data-uc], .cs-stage-*: switch on their entrance when scrolled into view
   Autoplay is off for people who ask their system for reduced motion. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* run fn(el) once when el is mostly visible (immediately without IntersectionObserver) */
  function whenSeen(els, fn, threshold, margin) {
    if (!('IntersectionObserver' in window)) { els.forEach(fn); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); fn(e.target); } });
    }, { threshold: threshold || 0.15, rootMargin: margin || '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- scroll reveal ---------- */
  function reveals() {
    /* text is not animated: only pictures, figures, cards and stat tiles reveal on scroll */
    var sel = [
      '.cs-body > .cs-callout', '.cs-body > .cs-persona', '.cs-wide', '.cs-uc-fig', '.cs-fig-panel', '.cs-block .cs-ba-bar',
      '.cs-block > .cs-shots:not([data-flow]):not([data-anno]):not(.cs-shots-ba):not(.cs-shots-collage)', '.cs-metrics > li', '.cs-stats > li'
    ].join(',');
    /* data-mo-scope="metrics": only the number tiles reveal (pages whose other content is already animated) */
    if (document.documentElement.getAttribute('data-mo-scope') === 'metrics') sel = '.cs-metrics > li, .cs-stats > li';
    var seen = new Set();
    $$(sel).forEach(function (el) {
      if (seen.has(el) || el.closest('[data-flow], [data-anno], [data-mo-static], [data-story]')) return;
      seen.add(el);
      var sibs = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty('--d', Math.min(sibs, 6) * 80 + 'ms');
      el.classList.add('mo-pre');
    });
    whenSeen($$('.mo-pre'), function (el) { el.classList.add('mo-in'); }, 0.12);
  }

  /* ---------- count-up numbers ---------- */
  function countUps() {
    $$('.cs-stats b, .cs-metrics b').forEach(function (b) {
      var text = b.textContent;
      if (!/\d/.test(text)) return;
      var parts = text.split(/(\d[\d,]*(?:\.\d+)?)/);   /* odd indexes are the numbers */
      b.setAttribute('aria-label', text);
      var final = parts.map(function (p, i) { return i % 2 ? { to: parseFloat(p.replace(/,/g, '')), dec: (p.split('.')[1] || '').length, comma: p.indexOf(',') > -1 } : p; });
      function render(t) {
        b.textContent = final.map(function (p) {
          if (typeof p === 'string') return p;
          /* whole number counts up; the decimals ease from 0 to their final digits once, without cycling through 0-9 */
          var whole = Math.floor(p.to * t), out = p.comma ? whole.toLocaleString('en-US') : String(whole);
          if (p.dec) {
            var fin = Math.round((p.to - Math.floor(p.to)) * Math.pow(10, p.dec));
            var d = String(Math.round(fin * t)); while (d.length < p.dec) d = '0' + d;
            out += '.' + d;
          }
          return out;
        }).join('');
      }
      if (reduce) return;
      render(0);
      whenSeen([b], function () {
        var t0 = performance.now(), dur = 1300;
        (function tick(now) {
          var t = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - t, 3);
          render(e); if (t < 1) requestAnimationFrame(tick); else b.textContent = text;
        })(t0);
      }, 0.6);
    });
  }

  /* ---------- flow player ---------- */
  function flows() {
    $$('[data-flow]').forEach(function (host) {
      var liveKind = host.dataset.live, live = null;
      /* StudySmarter treatments: a row of live phones that play and loop on their own (no step list) */
      if (liveKind && window.FluidLive) {
        var set = window.FluidLive.create(liveKind, document.createElement('div'));
        host.textContent = ''; host.classList.add('fl-set-host');
        host.appendChild(set.el);
        if (!reduce && 'IntersectionObserver' in window) {
          new IntersectionObserver(function (es) { if (es[0].isIntersecting) set.play(); else set.stop(); }, { threshold: 0.35 }).observe(host);
        } else if (!reduce) { set.play(); }
        return;
      }
      var figs = $$('figure', host).map(function (f) {
        var img = f.querySelector('img'), cap = f.querySelector('figcaption');
        return { src: img.getAttribute('src'), alt: img.getAttribute('alt') || '', w: +img.getAttribute('width'), h: +img.getAttribute('height'), cap: cap ? cap.childNodes[0].textContent.trim() : '' };
      });
      if (figs.length < 2) return;
      var wide = figs[0].w > figs[0].h;
      var dwell = +host.dataset.dwell || 2.8;

      var mf = document.createElement('div');
      mf.className = 'mf'; mf.dataset.shape = wide ? 'wide' : 'phone';
      if (live) mf.dataset.live = '1';
      mf.style.setProperty('--mf-ratio', live ? '375 / 812' : figs[0].w + ' / ' + figs[0].h);
      mf.style.setProperty('--dwell', dwell + 's');
      if (reduce) mf.dataset.still = '';
      mf.setAttribute('role', 'group');
      mf.setAttribute('aria-label', 'Walkthrough: ' + figs.map(function (f) { return f.cap; }).join(', then '));
      mf.innerHTML =
        '<div class="mf-device"><div class="mf-screen">' +
        (live ? '' : figs.map(function (f, i) { return '<img src="' + f.src + '" alt="' + f.alt.replace(/"/g, '&quot;') + '" width="' + f.w + '" height="' + f.h + '"' + (i ? ' loading="lazy"' : '') + (i ? ' aria-hidden="true"' : '') + '>'; }).join('')) +
        '</div></div><ol class="mf-steps">' +
        figs.map(function (f, i) { return '<li><button type="button" class="mf-step"' + (f.dwell ? ' style="--dwell:' + f.dwell + 's"' : '') + '><span class="mf-n">' + (i + 1) + '</span><span class="mf-t">' + f.cap + '</span><i class="mf-fill"></i></button></li>'; }).join('') +
        '</ol>';
      host.textContent = '';
      host.appendChild(mf);
      host.classList.add('mf-host');

      var screen = mf.querySelector('.mf-screen');
      if (live) { screen.appendChild(live.el); }
      var imgs = $$('img', mf), steps = $$('.mf-step', mf);
      var cur = -1, wait = null;

      function show(i) {
        if (live) live.show(i);
        else imgs.forEach(function (im, k) {
          im.classList.toggle('is-active', k === i);
          im.classList.toggle('is-prev', k === cur && k !== i);
          im.setAttribute('aria-hidden', k === i ? 'false' : 'true');
        });
        steps.forEach(function (s, k) {
          s.classList.remove('is-on'); void s.offsetWidth;
          s.classList.toggle('is-on', k === i && !reduce);
          s.classList.toggle('is-done', k < i);
          s.setAttribute('aria-current', k === i ? 'step' : 'false');
          if (reduce && k === i) s.classList.add('is-on');
        });
        cur = i;
      }
      /* a quick "press" on the screen, then the next one slides in (the live screens animate themselves) */
      function go(i, instant) {
        i = (i + figs.length) % figs.length;
        clearTimeout(wait);
        if (live || instant || reduce || cur < 0) { show(i); return; }
        screen.classList.add('is-press');
        wait = setTimeout(function () { screen.classList.remove('is-press'); show(i); }, 150);
      }
      steps.forEach(function (s, i) {
        s.addEventListener('click', function () { go(i); });
        s.querySelector('.mf-fill').addEventListener('animationend', function () { if (s.classList.contains('is-on')) go(i + 1); });
      });
      show(0);
      if ('IntersectionObserver' in window) {
        /* scrolled away: pause the walkthrough (the live screen's timers stop too);
           scrolled back: replay the current beat from its start so the screen and the progress bar agree again */
        new IntersectionObserver(function (es) {
          var on = es[0].isIntersecting, was = mf.classList.contains('is-live');
          mf.classList.toggle('is-live', on);
          if (!live) return;
          if (!on) live.stop(); else if (!was && cur >= 0) show(cur);
        }, { threshold: 0.5 }).observe(mf);
      } else { mf.classList.add('is-live'); }
      /* the walkthrough starts from step 1 when it first comes into view */
      whenSeen([mf], function () { go(0, true); }, 0.5);
    });
  }

  /* ---------- annotated screens ---------- */
  function annos() {
    $$('[data-anno]').forEach(function (a) {
      var svg = a.querySelector('.a-lines');
      function measure() {
        if (!svg) return;
        var k = svg.getBoundingClientRect().width / 1920;
        $$('path', svg).forEach(function (p) { p.style.setProperty('--len', Math.ceil(p.getTotalLength() * k + 4) + 'px'); });
      }
      measure(); window.addEventListener('resize', measure);
      whenSeen([a], function () { measure(); a.classList.add('is-in'); }, 0.35);
    });
  }

  /* ---------- use-case diagram ---------- */
  function useCases() {
    $$('[data-uc]').forEach(function (fig) {
      var k = 0;
      var steps = $$('.uc-step > *', fig);
      steps.forEach(function (el, i) { el.style.setProperty('--k', Math.floor(i / 2) * 2); });
      $$('.uc-arrow > *', fig).forEach(function (el, i) { el.style.setProperty('--k', i * 2 + 1); });
      $$('.uc-note', fig).forEach(function (el) { el.style.setProperty('--k', 7); });
      $$('.uc-divider', fig).forEach(function (el) { el.style.setProperty('--k', 8); });
      k = 9;
      $$('.uc-group > *', fig).forEach(function (el, i) { el.style.setProperty('--k', k + i * 2); });
      $$('.uc-link', fig).forEach(function (el) { el.style.setProperty('--k', k + 5); });
      var phones = $$('.uc-phone', fig), ptexts = $$('.uc-ptext', fig), ucs = $$('.uc-uc', fig);
      phones.forEach(function (el, i) {
        var kk = k + 6 + i * 2;
        el.style.setProperty('--k', kk);
        if (ptexts[i]) ptexts[i].style.setProperty('--k', kk + 1);
        if (ucs[i]) ucs[i].style.setProperty('--k', kk + 1);
      });
      $$('.uc-up-arrows', fig).forEach(function (el, i) { el.style.setProperty('--k', k + 18 + i); });
      whenSeen([fig], function () { fig.classList.add('is-in'); }, 0.3);
    });
  }

  /* ---------- StudySmarter collages ---------- */
  function stages() {
    $$('.cs-stage-limits, .cs-stage-fm').forEach(function (st) {
      whenSeen([st], function () {
        st.classList.add('is-in');
        setTimeout(function () { st.classList.add('is-landed'); }, 1900);
      }, 0.3);
    });
  }

  function kz() {
    $$('.kz').forEach(function (el) {
      if (reduce || !('IntersectionObserver' in window)) { el.classList.add('is-in'); return; }
      new IntersectionObserver(function (es) { el.classList.toggle('is-in', es[0].isIntersecting); }, { threshold: 0.3 }).observe(el);
    });
  }

  reveals(); kz(); countUps(); flows(); annos(); useCases(); stages();
})();
