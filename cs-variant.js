/* Case-study version switch in the Design Mode panel (local only).
   Each case study with a motion copy has two files: name.html and name-motion.html.
   The tab appears on both and just moves between them, keeping the scroll position and #hash. */
(function () {
  var file = location.pathname.split('/').pop() || 'index.html';
  /* two layouts: name.html + name-motion.html (original is default), or name.html (motion, default) + name-original.html */
  var motionDefault = /-original\.html$/.test(file) || document.documentElement.hasAttribute('data-cs-motion') && !/-motion\.html$/.test(file);
  var isMotion, base, motion;
  if (motionDefault) {
    isMotion = !/-original\.html$/.test(file);
    motion = file.replace(/-original\.html$/, '.html');
    base = motion.replace(/\.html$/, '-original.html');
  } else {
    isMotion = /-motion\.html$/.test(file);
    base = file.replace(/-motion\.html$/, '.html');
    motion = base.replace(/\.html$/, '-motion.html');
  }
  function mount(el) {
    el.innerHTML = '<div class="sec"><div class="row"><span class="l">Version</span>' +
      '<div class="seg wide" role="radiogroup" aria-label="Case study version">' +
      '<button type="button" role="radio" data-ver="' + base + '">Original</button>' +
      '<button type="button" role="radio" data-ver="' + motion + '">Motion</button></div></div>' +
      '<div class="note">Motion adds scroll reveals, count-ups and screen walkthroughs. Same content and screens.</div></div>';
    Array.prototype.forEach.call(el.querySelectorAll('[data-ver]'), function (b) {
      var on = b.dataset.ver === (isMotion ? motion : base);
      b.classList.toggle('on', on); b.setAttribute('aria-checked', String(on));
      b.addEventListener('click', function () {
        if (on) return;
        try { sessionStorage.setItem('cs-scroll', String(window.scrollY)); } catch (e) {}
        location.href = b.dataset.ver + location.search + location.hash;
      });
    });
    return function () {};
  }
  function add() { if (window.__designMode && window.__designMode.addAppTab) window.__designMode.addAppTab({ id: 'cs-version', label: 'Version', mount: mount }); }
  window.addEventListener('designmode:ready', add);
  add();
  try {
    var y = sessionStorage.getItem('cs-scroll');
    if (y !== null) { sessionStorage.removeItem('cs-scroll'); window.addEventListener('load', function () { window.scrollTo(0, +y); }); }
  } catch (e) {}
})();
