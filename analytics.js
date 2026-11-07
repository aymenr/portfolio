/* Key analytics events on top of the GA4 tag already in each page's <head>.
   Tracks: case study opens, scroll depth, contact/social/resume clicks,
   "next case study" clicks, outbound links. No personal data is sent. */
(function () {
  if (typeof gtag !== 'function') return;
  var page = location.pathname.split('/').pop().replace('.html', '') || 'home';
  function send(name, params) { try { gtag('event', name, params || {}); } catch (e) {} }

  /* link clicks (one delegated listener) */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var text = (a.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 60);
    if (a.hasAttribute('data-next-case')) return send('next_case_study_click', { from: page, to: href.replace('.html', ''), link_text: text });
    if (/(^|\/)(lingoda-app|fluid-learn|lingobites)\.html/.test(href)) return send('case_study_open', { case_study: href.replace('.html', ''), from: page });
    if (href.indexOf('mailto:') === 0) return send('contact_email_click', { page: page });
    if (/\.pdf($|\?)/.test(href)) return send('resume_click', { page: page });
    if (/linkedin\.com|instagram\.com/.test(href)) return send('social_click', { network: /linkedin/.test(href) ? 'linkedin' : 'instagram', page: page });
    if (/^[a-z]+:\/\//i.test(href) && a.hostname !== location.hostname) return send('outbound_click', { url: a.href, page: page });
    if (/^(photos|film|music)\.html/.test(href)) send('section_open', { section: href.replace('.html', ''), from: page });
  }, true);

  /* scroll depth: 25 / 50 / 75 / 100 once each */
  var seen = {};
  function depth() {
    var h = document.documentElement.scrollHeight - innerHeight;
    if (h <= 0) return;
    var pct = Math.round((scrollY / h) * 100);
    [25, 50, 75, 100].forEach(function (m) {
      if (pct >= m - (m === 100 ? 2 : 0) && !seen[m]) { seen[m] = 1; send('scroll_depth', { percent: m, page: page }); }
    });
  }
  var t; addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(depth, 150); }, { passive: true });

  /* engaged for 30s on the page */
  setTimeout(function () { if (!document.hidden) send('engaged_30s', { page: page }); }, 30000);
})();
