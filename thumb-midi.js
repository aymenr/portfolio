/* midi.play motion thumbnails (dev panel > MIDI Play). Five compositions of the same two real recordings:
   the landing-page hero (hero.mp4, pixel band moving) and the "Play along" card (falling-notes.mp4).
   The pixel characters are separate transparent images so they can stand on the card.
   Everything is laid out on a 1000 x 750 artboard (the card is 4:3) and sized through --p, like the other scenes. */

const MD = 'thumbnail-options/midi/';
const mdVid = (src, cls = '') => `<video class="${cls}" src="${MD}${src}" muted loop playsinline preload="auto" aria-hidden="true"></video>`;
const mdHero = () => mdVid('hero.mp4');
const mdFall = (cls, x, y, w, h) => `<div class="mfall ${cls}" style="left:${P(x)};top:${P(y)};width:${P(w)};height:${P(h)}">${mdVid('falling-notes.mp4')}</div>`;
const mdSprite = (n, x, y, w, i) => `<img class="mpx" src="${MD}sprite-${n}.webp" alt="" style="left:${P(x)};top:${P(y)};width:${P(w)};--i:${i}">`;
const mdLine = (cls, x, y, w, h, imgW, ix, iy) =>
  `<div class="mline ${cls}" style="left:${P(x)};top:${P(y)};width:${P(w)};height:${P(h)}"><img src="${MD}hero-clean.webp" alt="" style="width:${P(imgW)};left:${P(ix)};top:${P(iy)}"></div>`;
const mdStage = (cls, inner) => stageOf(1000, 750, `md ${cls}`, inner);

// A: your sketch. Hero in a browser window, the card tilted on top, sky-to-peach gradient
function sceneMidiA() {
  return mdStage('ma',
    `<div class="mwin" style="left:${P(70)};top:${P(100)};width:${P(700)}">${mdHero()}</div>` +
    mdFall('', 480, 400, 450, 235));
}
// B: hero bleeds off the left edge on brand orange, card with the app's hard shadow
function sceneMidiB() {
  return mdStage('mb',
    `<div class="mpanel" style="width:${P(740)}"><div class="mhero" style="left:${P(-6)};top:${P(70)};width:${P(880)}">${mdHero()}</div></div>` +
    mdFall('', 500, 400, 470, 245));
}
// C: the band stands on a big piano-roll card
function sceneMidiC() {
  const xs = [150, 290, 430, 570, 710], names = ['guitar', 'keys', 'drums', 'voice', 'bass'];
  return mdStage('mc',
    mdLine('', 180, 60, 640, 70, 1000, -12, -438) +
    mdFall('', 140, 350, 720, 376) +
    names.map((n, i) => mdSprite(n, xs[i], 232, 140, i)).join(''));
}
// D: no cards. The headline fades down into the falling notes and keys
function sceneMidiD() {
  return mdStage('md-d',
    `<div class="mhero" style="left:${P(70)};top:${P(-50)};width:${P(1000)}">${mdHero()}</div>` +
    mdFall('fade', 0, 270, 1000, 480));
}
// E: one line of headline, one small card, two characters on its edge
function sceneMidiE() {
  return mdStage('me',
    mdLine('', 60, 150, 880, 92, 1410, -18, -620) +
    mdFall('', 290, 360, 420, 219) +
    mdSprite('voice', 300, 249, 130, 1) + mdSprite('bass', 570, 249, 130, 0));
}

// F: the band playing on the Play-along card, recorded from the app (thumbnail.html in the app repo) on a transparent background. Fills the whole card.
function sceneMidiF() {
  // Transparent video (the page's own gradient shows around the band). Safari wants HEVC with alpha in a .mov; Chrome and Firefox want VP9 alpha in a .webm.
  const safari = /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
  const src = safari ? 'band-loop-alpha.mov' : 'band-loop.webm';
  return mdStage('mf', `<video class="mfull" src="${MD}${src}" muted loop playsinline preload="auto" aria-hidden="true"></video>`);
}

// G: the same band drawn live by the app's own code (midi-scene.js, built from thumb-scene.ts in the app repo). Transparent, sharp at
// any size and scales with the card. Loaded the first time it is needed.
let midiSceneLoading;
function loadMidiScene() {
  if (window.MidiBandScene) return Promise.resolve(window.MidiBandScene);
  if (!midiSceneLoading) midiSceneLoading = new Promise((ok, fail) => {
    const s = document.createElement('script');
    s.src = 'midi-scene.js?v=2'; s.onload = () => ok(window.MidiBandScene); s.onerror = fail;
    document.head.append(s);
  });
  return midiSceneLoading;
}
function sceneMidiG() { return '<div class="mlive"></div>'; }
function initMidiLive(scene) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  return loadMidiScene().then((M) => M.mount(scene.querySelector('.mlive'), { reduced }));
}

// the recordings only play while the card is on screen
function initMidi(scene) {
  const vids = [...scene.querySelectorAll('video')];
  return Promise.resolve({
    start() { vids.forEach((v) => { v.play().catch(() => {}); }); },
    stop() { vids.forEach((v) => v.pause()); },
  });
}

// G (live) is what the page opens with; F is the recorded video version. `bgs` fills the panel's "MIDI Play bg" dropdown (colours are in thumb-midi.css); first is the default.
THUMB_META.midi = { param: 'midi', label: 'MIDI Play', variants: [], default: 'g', bgs: [
  ['follow', 'Follow Skies'],
  ['dusk', 'Dusk · dark'],
  ['sky', 'Sky (site gradient)'],
  ['dawn', 'Dawn · dark'], ['evening', 'Evening · dark'], ['midnight', 'Midnight · dark'], ['ember', 'Ember · dark'],
  ['softsky', 'Soft sky · light'], ['sunrise', 'Sunrise · light'], ['mint', 'Mint · light'], ['orange', 'Orange glow'],
] };
addThumbVariant('midi', 'a', 'Hero + card (sketch)', sceneMidiA, initMidi);
addThumbVariant('midi', 'b', 'Hero bleeds off edge', sceneMidiB, initMidi);
addThumbVariant('midi', 'c', 'Band on the piano', sceneMidiC, initMidi);
addThumbVariant('midi', 'd', 'Notes fall out of hero', sceneMidiD, initMidi);
addThumbVariant('midi', 'e', 'One line, one card', sceneMidiE, initMidi);
addThumbVariant('midi', 'f', 'Band, recorded video', sceneMidiF, initMidi);
addThumbVariant('midi', 'g', 'Band, live (default)', sceneMidiG, initMidiLive);
