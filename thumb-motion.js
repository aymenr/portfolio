/* Motion thumbnails (the "Thumbs: Motion" option in the dev panel, or ?thumbs=motion).
   Each project card swaps its still image for a small live scene: the real UI from the Figma artboard,
   rebuilt so it can move. Parts of the original artwork are reused as cropped pieces of the same webp
   (no new image files), everything that animates is drawn in CSS. Styles live in thumb-motion.css.

   All sizes are in "artboard pixels" (the original 2400px-wide artboard) through --p, so a scene scales
   with its card. P(n) turns an artboard pixel count into a CSS length. */

const P = (n) => `calc(${n} * var(--p))`;

// a rectangle of a bigger image, drawn as a background so no cropped files are needed
const crop = (src, W, H, x, y, w, h, cls = '', style = '') =>
  `<span class="crop ${cls}" style="aspect-ratio:${w}/${h};background-image:url(${src});background-size:${(W / w) * 100}% ${(H / h) * 100}%;background-position:${w === W ? 0 : (x / (W - w)) * 100}% ${h === H ? 0 : (y / (H - h)) * 100}%;${style}"></span>`;

const at = (cls, x, y, w, h, inner = '', style = '') =>
  `<div class="${cls}" style="left:${P(x)};top:${P(y)};${w != null ? `width:${P(w)};` : ''}${h != null ? `height:${P(h)};` : ''}${style}">${inner}</div>`;

/* ---------------- Lingoda app: three phones ---------------- */

function sceneLingoda() {
  const M = 'mobile-app-items-old.webp', W = 2400, H = 2225;
  const phone = (cls, x, y, w, inner, d) =>
    `<div class="pos rise ${cls}" style="left:${(x / W) * 100}%;top:${(y / H) * 100}%;width:${(w / W) * 100}%;--w:${w};--d:${d}s"><div class="ph">${inner}</div></div>`;

  // yellow sparks that burst out of the character's face when the weekly goal fills up
  const sparks = Array.from({ length: 12 }, (_, i) =>
    `<i class="gspark" style="--a:${i * 30 + (i % 2) * 9}deg;--r:${i % 2 ? 150 : 215};--s:${i % 3 === 0 ? 58 : 40};--j:${(i % 4) * 0.025}s"></i>`).join('');

  const left = phone('ph-l', 68, 243, 872,
    crop(M, W, H, 68, 243, 872, 1895) +
    // a soft highlight steps down the course list, like a finger running over it
    at('hl', 0, 0, 872, 182) + '<i class="glint"></i>', 0.15);

  const right = phone('ph-r', 1450, 243, 873,
    crop(M, W, H, 1450, 243, 873, 1895) +
    at('known', 454, 547, 384, 225) + '<i class="glint"></i>', 0.3);

  const centre = phone('ph-c', 754, 58, 874,
    crop(M, W, H, 754, 58, 874, 462) +
    `<div class="mid">${crop(M, W, H, 754, 520, 874, 1076)}
       ${at('barbg', 186, 126, 628, 30)}
       ${at('trk', 190, 132, 618, 18)}
       ${at('bar2', 190, 132, 618, 18)}
       ${at('num', null, 62, 110, 48, '<b>6/8</b><b>7/8</b><b>8/8</b>', `right:${P(68)}`)}
       ${at('gsparks', 116, 104, 0, 0, sparks)}
       ${at('chk c1', 717, 469, 56, 56, '<svg viewBox="0 0 24 24"><path class="tk0" d="M6 12.5l4 4 8-9"/><path class="tk1" d="M6 12.5l4 4 8-9"/></svg>')}
       ${at('chk c2', 717, 694, 56, 56, '<svg viewBox="0 0 24 24"><path class="tk0" d="M6 12.5l4 4 8-9"/><path class="tk1" d="M6 12.5l4 4 8-9"/></svg>')}
       ${at('btnfx', 70, 849, 732, 106, '<i class="rip"></i>')}
     </div>` +
    crop(M, W, H, 754, 1596, 874, 356) + '<i class="glint"></i>', 0);

  return `<div class="stage" style="aspect-ratio:${W}/${H};--p:calc(100cqw / ${W})">${left}${right}${centre}</div>`;
}

/* ---------------- Fluid Learn monetisation: paywall + out-of-charges ---------------- */

function sceneMonetisation() {
  const W = 2400, H = 1638;
  const dots = Array.from({ length: 8 }, (_, i) => `<i style="--i:${i}"></i>`).join('');
  const paywall = `
    <div class="pos rise tcard pay" style="left:${P(124)};top:${P(105)};width:${P(1024)};height:${P(1422)};--r:-4.8deg;--d:.1s">
      <div class="hop">
        <div class="pay-bg"></div>
        <img class="pay-illo" src="fluid-illustration.webp" alt="" style="left:${P(92)};top:${P(10)};width:${P(840)}">
        <p class="pay-h" style="top:${P(700)}">Enjoying Fluid Learn Mode?</p>
        <p class="pay-s" style="top:${P(808)}">Stay unlimited — upgrade for all question types, hints, and explanations.</p>
        <div class="cta blue pay-go" style="left:${P(90)};top:${P(1040)};width:${P(844)};height:${P(130)}"><span>Get premium</span><i class="shine"></i></div>
        <div class="pay-alt" style="left:${P(90)};top:${P(1200)};width:${P(844)};height:${P(130)}"><span>Continue with limited access</span></div>
      </div>
    </div>`;

  const charges = `
    <div class="pos rise tcard chg" style="left:${P(1179)};top:${P(474)};width:${P(1122)};height:${P(940)};--r:6deg;--d:.3s">
      <div class="hop">
        <div class="batt" style="left:${P(459)};top:${P(80)};width:${P(204)};height:${P(300)}">
          <i class="cap"></i><div class="body"><div class="screen"><i class="fill"></i></div></div>
        </div>
        <p class="chg-h" style="top:${P(425)}">You have <span class="roll"><span><b>2</b><b>0</b></span></span> charges left today</p>
        <p class="chg-s" style="top:${P(545)}">You get 2 new charges in <b>3h 11m</b></p>
        <div class="cta blue" style="left:${P(61)};top:${P(700)};width:${P(1000)};height:${P(170)}"><span>Get premium</span><i class="shine"></i></div>
      </div>
    </div>`;

  return `<div class="stage" style="aspect-ratio:${W}/${H};--p:calc(100cqw / ${W})">${charges}${paywall}</div>`;
}

/* ---------------- Seda: three practice cards beside the illustration ---------------- */

function sceneSeda() {
  const S = 'seda-items.webp', W = 2200, IH = 1638, H = 1366;   // IH = real image height (for crops). The scene shows the bottom 1366 of the 1488px artboard, 200px trimmed off the right (UP = the cropped-off top), so it fills a taller card; the bench's feet sit on the card's bottom edge
  const UP = 122;
  const ph = (x, y, w, h) => crop(S, W, IH, x, y, w, h);

  const illo = `<div class="pos rise illo" style="left:0;top:${P(346)};width:${P(1038)};--d:0s">${ph(0, 672, 830, 816)}</div>`;

  const match = `
    <div class="pos rise tcard sd sd-a" style="left:${P(1626)};top:${P(12)};width:${P(720)};height:${P(888)};--r:-6deg;--d:.2s">
      <div class="hop">
        <p class="sd-t" style="top:${P(40)}">Find the matching picture</p>
        <div class="sd-word" style="top:${P(115)}"><i class="spk"><svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z M15.5 9c1.2 1.6 1.2 4.4 0 6 M18 7c2 2.4 2 7.6 0 10"/></svg></i><span>ரிக்ஷா</span></div>
        <div class="tiles" style="top:${P(250)}">
          <span class="tile">${ph(1704, 350, 252, 252)}</span>
          <span class="tile pick">${ph(2010, 305, 252, 252)}<i class="ok"><svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9"/></svg></i></span>
          <span class="tile low">${ph(1740, 722, 240, 70)}</span>
          <span class="tile low">${ph(2040, 700, 240, 90)}</span>
        </div>
      </div>
    </div>`;

  const name = `
    <div class="pos rise tcard sd sd-b" style="left:${P(1194)};top:${P(672)};width:${P(564)};height:${P(936)};--r:7deg;--d:.35s">
      <div class="hop">
        <p class="sd-t" style="top:${P(40)}">What is this called?</p>
        <div class="frame" style="left:${P(57)};top:${P(110)};width:${P(450)};height:${P(450)}">${ph(1344, 870, 300, 300)}</div>
        <p class="urdu" style="top:${P(535)}">روٹی</p>
        <div class="acts" style="top:${P(690)}">
          <span class="aud"><i><svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z M15.5 9c1.2 1.6 1.2 4.4 0 6 M18 7c2 2.4 2 7.6 0 10"/></svg></i></span>
        </div>
      </div>
    </div>`;

  const spell = `
    <div class="pos rise tcard sd sd-c" style="left:${P(1746)};top:${P(774)};width:${P(624)};height:${P(780)};--r:-3deg;--d:.5s">
      <div class="hop">
        <p class="sd-t" style="top:${P(40)}">Spell the word</p>
        <div class="frame" style="left:${P(75)};top:${P(100)};width:${P(474)};height:${P(450)}">${ph(1896, 988, 330, 330)}</div>
        <div class="boxes" style="top:${P(615)}">
          <i class="b on">P</i><i class="b l1">E</i><i class="b l2">C</i><i class="b l3">I</i>
        </div>
      </div>
    </div>`;

  return `<div class="stage" style="aspect-ratio:${W}/${H};--p:calc(100cqw / ${W})"><div style="position:absolute;inset:0;translate:${P(-180)} ${P(-UP)}">${match}${name}${spell}</div>${illo}</div>`;
}

/* ---------------- registry ----------------
   Every project can have several motion variants (a, b, c ...). THUMB_META drives the dev panel:
   which URL parameter picks the variant, and what each letter is called. Builders return scene markup;
   a variant that needs Rive (or timed JS) also registers an init in THUMB_INIT. */

const THUMB_META = {
  'lingoda-app': { param: 'lingoda', label: 'Lingoda', variants: [['a', 'Live UI']], default: 'd' },
  monetisation: { param: 'fluid', label: 'Fluid Learn', variants: [['a', 'Live UI']], default: 'a' },
  seda: { param: 'seda', label: 'Seda', variants: [['a', 'Practice cards']], default: 'd' },
};
const THUMB_BUILD = { 'lingoda-app:a': sceneLingoda, 'monetisation:a': sceneMonetisation, 'seda:a': sceneSeda };
const THUMB_INIT = {};   // 'project:variant' -> (scene) => ({ start(), stop() })

function addThumbVariant(id, key, name, build, init) {
  THUMB_META[id].variants.push([key, name]);
  THUMB_BUILD[`${id}:${key}`] = build;
  if (init) THUMB_INIT[`${id}:${key}`] = init;
}

function thumbScene(id, variant) {
  const build = THUMB_BUILD[`${id}:${variant}`];
  return build ? `<div class="scene scene-${id}" data-sid="${id}" data-variant="${variant}" aria-hidden="true">${build()}</div>` : null;
}

/* ---------------- Rive ----------------
   The Lingoda mascot (Frank) and the score stars were animated in Rive (.riv files in /rive).
   The runtime is only fetched when a Rive variant is on screen. */

const RIVE_SRC = 'https://cdn.jsdelivr.net/npm/@rive-app/canvas@2.21.6/rive.js';
let riveLoading;
function loadRive() {
  if (window.rive) return Promise.resolve(window.rive);
  if (!riveLoading) riveLoading = new Promise((ok, fail) => {
    const s = document.createElement('script');
    s.src = RIVE_SRC; s.onload = () => ok(window.rive); s.onerror = fail;
    document.head.append(s);
  });
  return riveLoading;
}

// Starts a .riv file on a canvas. Resolves with the Rive instance once it is drawn.
function riveCanvas(canvas, { sm, autoplay = true } = {}) {
  return loadRive().then((rv) => new Promise((ok) => {
    const r = new rv.Rive({
      src: `rive/${canvas.dataset.rive}`, canvas, autoplay, stateMachines: sm || undefined,
      layout: new rv.Layout({ fit: rv.Fit.Contain, alignment: rv.Alignment.Center }),
      onLoad() { r.resizeDrawingSurfaceToCanvas(); ok(r); },
      onLoadError(e) { console.warn('Rive could not load', canvas.dataset.rive, e); },
    });
    new ResizeObserver(() => r.resizeDrawingSurfaceToCanvas()).observe(canvas);
  }));
}

// Runs fn at the given moments (ms) of an 8s loop, lined up with the scene's CSS animation clock.
function onLoopTimes(scene, times, fn, period = 8000) {
  const marker = scene.querySelector('.stage');
  const timers = [];
  const clock = () => { const a = marker.getAnimations({ subtree: true }).find((x) => x.effect?.getTiming().duration === period); return a ? Number(a.currentTime) % period : 0; };
  const t0 = clock();
  times.forEach((t) => {
    const first = (t - t0 + period) % period;
    timers.push(setTimeout(() => { fn(t); timers.push(setInterval(() => fn(t), period)); }, first));
  });
  return () => timers.forEach((x) => { clearTimeout(x); clearInterval(x); });
}

/* ---------------- playback ---------------- */

let sceneIO;
function playScenes() {
  if (sceneIO) sceneIO.disconnect();
  const scenes = document.querySelectorAll('.scene');
  if (!scenes.length) return;
  const set = (s, on) => {
    s.toggleAttribute('data-play', on);
    const mk = THUMB_INIT[`${s.dataset.sid}:${s.dataset.variant}`];
    if (!mk) return;
    if (on) {
      s.__init = s.__init || mk(s);
      Promise.resolve(s.__init).then((h) => { if (s.hasAttribute('data-play')) h.start(); }).catch(() => {});
    } else if (s.__init) Promise.resolve(s.__init).then((h) => h.stop());
  };
  if (!('IntersectionObserver' in window)) { scenes.forEach((s) => set(s, true)); return; }
  sceneIO = new IntersectionObserver((entries) => entries.forEach((e) => set(e.target, e.isIntersecting)), { rootMargin: '80px' });
  scenes.forEach((s) => sceneIO.observe(s));
}
