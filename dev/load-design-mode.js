// Design Mode (dev only): the design inspector from ~/Documents/apps/design-mode.
// Loads only when the page is viewed locally (local server, an opened file, or a
// device on the home network), so the live site never sees it.
// To pick up a newer version of the tool, run dev/update-design-mode.sh.
(() => {
  const h = location.hostname;
  const local = location.protocol === 'file:' || h === 'localhost' || h === '127.0.0.1' || h === '[::1]'
    || h.endsWith('.local') || /^(10|192\.168|172\.(1[6-9]|2\d|3[01]))\./.test(h);
  if (!local) return;
  // A plain script tag rather than import(): browsers block module imports on file:// pages.
  const s = document.createElement('script');
  s.src = new URL('design-mode.js', document.currentScript.src).href;
  // Pages listen for this to add their own tabs to the panel (script.js adds "Site").
  s.onload = () => window.dispatchEvent(new Event('designmode:ready'));
  document.body.appendChild(s);
})();
