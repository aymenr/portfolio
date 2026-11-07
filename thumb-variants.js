/* More motion-thumbnail variants (see thumb-motion.js for how they plug in).
   Lingoda:  B = Frank reacting + score stars, both Rive files; C = the live UI with Frank (Rive) and sparkles popping in.
   Fluid:    B = the "out of sessions" flow in one phone; C = the two experiment treatments side by side.
   Lingobites: A = the matching exercise, B = the reflection step with Frank (Rive), C = practice tiles filling their stars on the course page.
   Seda:     B = relevant-vocabulary photo conveyor; C = "Your progress" panel (spaced retrieval) ticking up.
   Pictures come from the Figma slides' exports in /thumbnail-options/figma and from the Rive files in /rive. */

const FIG = 'thumbnail-options/figma/';
const stageOf = (W, H, cls, inner) => `<div class="stage ${cls}" style="--ar:${W / H};aspect-ratio:${W} / ${H};--p:calc(100cqw / ${W})">${inner}</div>`;
const rpos = (x, y, w, h, inner, extra = '', cls = '') => `<div class="pos rise ${cls}" style="left:${P(x)};top:${P(y)};width:${P(w)};${h ? `height:${P(h)};` : ''}${extra}">${inner}</div>`;
const restart = (r, sm) => { r.stop(); r.play(sm); };
const cv = (cls, file, extra = '') => `<canvas class="${cls}" data-rive="${file}" ${extra}></canvas>`;

/* ================= Lingoda B: Frank reel ================= */

function sceneLingodaB() {
  const W = 1200, H = 1300;
  const names = ['Hello!', 'Good try', 'Good work', 'Perfect!'];
  const files = ['vt-hello', 'vt-good-try', 'vt-good-work', 'vt-perfect'];
  const frank = files.map((f, i) => cv(`frank f${i}`, `${f}.riv`)).join('');
  return stageOf(W, H, 'lb',
    rpos(0, 20, 1200, 790, frank, '--d:.1s', 'lb-hero') +
    rpos(90, 850, 1020, 370,
      `<p class="lb-label"><span>${names.map((n) => `<b>${n}</b>`).join('')}</span></p>${cv('score', 'main-score.riv')}<i class="lb-dots">${names.map((_, i) => `<u class="d${i}"></u>`).join('')}</i>`,
      '--d:.3s', 'lb-card'));
}

function initLingodaB(scene) {
  const SCORES = [0, 1, 2, 100];   // the Score input: 1 and 2 light that many stars, 100 is the gold "Perfect"
  const frank = [...scene.querySelectorAll('canvas.frank')];
  const scoreCanvas = scene.querySelector('canvas.score');
  const ready = Promise.all([...frank.map((c) => riveCanvas(c, { sm: 'default', autoplay: false })), riveCanvas(scoreCanvas, { sm: 'State Machine 1', autoplay: true })]);
  let k = 0, timer;
  const show = (rs, i) => {
    scene.dataset.k = i;
    const r = rs[i];
    restart(r, 'default');
    const score = rs[4], inp = score.stateMachineInputs('State Machine 1')?.[0];
    if (inp) inp.value = SCORES[i];
  };
  return ready.then((rs) => ({
    start() { show(rs, k); timer = setInterval(() => { k = (k + 1) % 4; show(rs, k); }, 2800); },
    stop() { clearInterval(timer); },
  }));
}

/* ================= Lingoda C: live UI + Frank and sparkles ================= */

function sceneLingodaC() {
  const base = sceneLingoda().replace(/<\/div>$/, '');
  // little four-point sparkles pop around each tick (drawn here, not Rive: the sparkle.riv artboard has a solid dark background)
  const star = (x, y, s, d) => `<svg class="spk4" viewBox="0 0 24 24" style="left:${P(x)};top:${P(y)};width:${P(s)};--sd:${d}s"><path d="M12 1c.9 6.2 4.8 10.1 11 11-6.2.9-10.1 4.8-11 11-.9-6.2-4.8-10.1-11-11C7.2 11.1 11.1 7.2 12 1z"/></svg>`;
  const burst = (cls, cx, cy) => `<div class="sp ${cls}">${star(cx - 40, cy - 110, 70, 0)}${star(cx + 50, cy - 40, 48, .06)}${star(cx - 105, cy - 25, 40, .12)}</div>`;
  const extra = burst('sp1', 1493, 1014) + burst('sp2', 1493, 1238) + at('bubble', 1590, 120, 640, 440, cv('frankc', 'vt-good-work.riv'));
  return base + extra + '</div>';
}

function initLingodaC(scene) {
  const frank = scene.querySelector('canvas.frankc');
  return riveCanvas(frank, { sm: 'default', autoplay: false }).then((fr) => {
    let off = () => {};
    return {
      start() { off = onLoopTimes(scene, [3500], () => restart(fr, 'default')); },
      stop() { off(); },
    };
  });
}

/* ================= Fluid Learn B: out of sessions -> paywall ================= */

function sceneMonetB() {
  const W = 1000, H = 1200, M = FIG + 'monet-17-treatment2.png', iw = 1920, ih = 1080;
  const phw = 440, phh = Math.round((phw * 588) / 256);
  const sheetH = Math.round((phw * 220) / 256);
  const phone = `
    <div class="fb-phone">
      <div class="fb-s s1">${crop(M, iw, ih, 325, 70, 256, 588)}</div>
      <div class="fb-dim"></div>
      <div class="fb-s s2" style="height:${P(sheetH)}">${crop(M, iw, ih, 628, 438, 257, 220)}<i class="fb-rip r1" style="left:50%;top:67%"></i></div>
      <div class="fb-s s3">${crop(M, iw, ih, 939, 70, 256, 588)}
        <i class="fb-pick" style="left:${P(17)};top:${P(678)};width:${P(198)};height:${P(81)}"></i>
        <i class="fb-rip r2" style="left:50%;top:85.4%"></i></div>
    </div>`;
  return stageOf(W, H, 'fb', rpos(280, 95, phw, phh, phone, '--d:.1s'));
}

/* ================= Fluid Learn C: two treatments, side by side ================= */

function sceneMonetC() {
  const W = 1100, H = 1300, a = FIG + 'monet-16-treatment1.png', b = FIG + 'monet-17-treatment2.png', iw = 1920, ih = 1080;
  const phw = 440, phh = Math.round((phw * 588) / 256);
  const phone = (cls, layers, label, dots) => `
    <div class="fc-phone ${cls}">${layers.map((src, i) => `<div class="fc-s l${i + 1}">${src}</div>`).join('')}</div>`;
  const left = phone('fc-a', [crop(a, iw, ih, 832, 80, 256, 588), crop(a, iw, ih, 1152, 80, 256, 588), crop(a, iw, ih, 436, 80, 256, 588)]);
  const right = phone('fc-b', [crop(b, iw, ih, 325, 70, 256, 588), crop(b, iw, ih, 628, 70, 256, 588), crop(b, iw, ih, 939, 70, 256, 588)]);
  const pill = (x, y, t, cls) => rpos(x, y, 440, 84, `<span>${t}</span><u><i></i><i></i><i></i></u>`, '--d:.5s', `fc-pill ${cls}`);
  return stageOf(W, H, 'fc',
    rpos(40, 80, phw, phh, left, '--r:-3.5deg;--d:.1s', 'fc-wrap') + rpos(620, 140, phw, phh, right, '--r:3.5deg;--d:.25s', 'fc-wrap') +
    pill(40, 1150, 'Feature-limited access', 'pa') + pill(620, 1210, 'Daily session charges', 'pb'));
}

/* ================= Seda B: relevant vocabulary conveyor ================= */

function sceneSedaB() {
  const W = 2400, H = 1500, S = FIG + 'seda-08-vocab.png', iw = 1920, ih = 1080;
  const photos = [[275, 205, 225], [530, 228, 205], [770, 215, 210], [1010, 225, 200], [1225, 215, 175], [1430, 235, 215]];
  const cards = (suffix) => photos.map(([x, y, s], i) => `<figure class="vc" style="--i:${i};--rot:${i % 2 ? 4 : -4}deg"><span>${crop(S, iw, ih, x, y, s, s)}</span></figure>`).join('');
  const star = `<svg viewBox="0 0 100 100"><path d="M50 8v84M13 29l74 42M13 71l74-42"/></svg>`;
  return stageOf(W, H, 'sb',
    `<div class="belt"><div class="track">${cards('a')}${cards('b')}</div></div>` +
    at('ast', 1650, 880, 220, 220, star));
}

/* ================= Seda C: progress panel ================= */

function sceneSedaC() {
  const W = 1100, H = 940, S = FIG + 'seda-07-adaptive.png', iw = 1920, ih = 1080;
  const roll = (a, b) => `<span class="nr"><span><b>${a}</b><b>${b}</b></span></span>`;
  const speaker = '<svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z M15.5 9c1.2 1.6 1.2 4.4 0 6 M18 7c2 2.4 2 7.6 0 10"/></svg>';
  const panel = `
    <div class="sp-panel">
      <h4>Your progress</h4>
      <p class="sp-sub">Track your therapy journey across different skills</p>
      <div class="sp-tiles">
        <div class="sp-tile learn"><small>Learning</small><strong>${roll(13, 12)}</strong><span class="art">${crop(S, iw, ih, 1612, 185, 118, 125)}</span></div>
        <div class="sp-tile mast"><small>Mastered</small><strong>${roll(46, 47)}</strong><span class="art">${crop(S, iw, ih, 1605, 358, 125, 125)}</span><i class="burst"></i></div>
      </div>
      <h5>Word list (23)</h5>
      <div class="sp-rows">
        <div class="sp-row r1"><span class="th">${crop(S, iw, ih, 1330, 682, 100, 100)}</span><b>পোশাক</b>${speaker}<u><i></i><i></i><i></i></u></div>
        <div class="sp-row r2"><span class="th">${crop(S, iw, ih, 1338, 846, 84, 84)}</span><b>চুলা</b>${speaker}<u><i></i><i></i><i></i></u><em></em></div>
      </div>
    </div>`;
  return stageOf(W, H, 'sc', rpos(80, 60, 940, 820, panel, '--d:.1s'));
}

/* ================= Lingobites A: the matching exercise, live ================= */

function sceneBitesA() {
  const W = 1000, H = 1000;
  const left = ['Meine Kollegen', 'Das Gehalt', 'Wie ist', 'Mein Chef ist', 'Es macht mir'];
  const right = ['dein Chef?', 'manchmal gemein.', 'ist gut.', 'sind sehr freundlich.', 'Spaß.'];
  const pair = [3, 2, 0, 1, 4];                 // which right-hand phrase finishes each left-hand one
  const rowY = (i) => 200 + i * 86;
  const T = 10;                                  // seconds per loop for this scene
  let css = '';
  const kf = (name, on) => { css += `@keyframes ${name} { 0%, ${on - 1}% { background: #fff; border-color: #cfd5e3; } ${on + 2}%, 91% { background: #f1edff; border-color: #6b4be0; } 96%, 100% { background: #fff; border-color: #cfd5e3; } }`; };
  const boxes = left.map((t, i) => {
    const on = 8 + i * 14;
    kf(`mtL${i}`, on); kf(`mtR${pair[i]}`, on + 4);
    return at(`mt-box l l${i}`, 50, rowY(i), 340, 68, `<i>${i + 1}</i><span>${t}</span>`, `animation-name:mtL${i}`);
  }).join('');
  const rbox = right.map((t, r) => at(`mt-box r r${r}`, 530, rowY(r), 340, 68, `<i>${'ABCDE'[r]}</i><span>${t}</span>`, `animation-name:mtR${r}`)).join('');
  const lines = left.map((_, i) => {
    const on = 8 + i * 14 + 4, y1 = rowY(i) + 34, y2 = rowY(pair[i]) + 34;
    css += `@keyframes mtP${i} { 0%, ${on}% { stroke-dashoffset: 1; opacity: 1; } ${on + 4}%, 91% { stroke-dashoffset: 0; opacity: 1; } 96%, 100% { stroke-dashoffset: 1; opacity: 0; } }`;
    return `<path pathLength="1" d="M390 ${y1} C 460 ${y1}, 460 ${y2}, 530 ${y2}" style="animation-name:mtP${i}"/>`;
  }).join('');
  const win = `
    <style>${css}</style>
    <svg class="mt-x" viewBox="0 0 24 24" style="left:${P(40)};top:${P(36)};width:${P(26)}"><path d="M5 5l14 14M19 5L5 19"/></svg>
    <p class="mt-title" style="left:${P(88)};top:${P(34)}">Lingobites - Talking about my work</p>
    <div class="mt-prog" style="left:${P(50)};top:${P(100)};width:${P(780)}"><i class="fill"></i></div>
    <span class="mt-node n1"><svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9"/></svg></span><span class="mt-node n2"></span><span class="mt-node n3"></span><span class="mt-node n4"></span>
    <span class="mt-help" style="left:${P(850)};top:${P(76)}">?</span>
    <p class="mt-cap" style="left:${P(50)};top:${P(160)}">Connect to make full sentences</p>
    ${boxes}${rbox}
    <svg class="mt-lines" viewBox="0 0 920 880" style="left:0;top:0;width:100%;height:100%">${lines}</svg>
    <div class="mt-bar"></div>
    <p class="mt-tries"><u><i></i><i></i><i></i></u>3 tries left</p>
    <div class="mt-check" style="left:${P(300)};top:${P(770)};width:${P(340)};height:${P(66)}"><span>Check</span><i class="rip"></i></div>`;
  return stageOf(W, H, 'mt', rpos(40, 60, 920, 880, win, '--d:.1s', 'mt-win'));
}

/* ================= Lingobites B: reflection step + Frank (Rive) ================= */

function sceneBitesB() {
  const W = 823, H = 585, S = 'case-studies/lingobites/frank-reflection.webp';
  const tile = (n, x, label) => `<div class="rf-tile t${n}" style="left:${P(x)};top:${P(180)}"><span>${crop(S, W, H, x + 8, 205, 80, 75)}</span><b>${label}</b></div>`;
  const win = `
    <svg class="mt-x" viewBox="0 0 24 24" style="left:${P(180)};top:${P(14)};width:${P(16)}"><path d="M5 5l14 14M19 5L5 19"/></svg>
    <p class="rf-top" style="left:${P(203)};top:${P(12)}">Lingobites - I can survive in a German classroom</p>
    <div class="rf-prog" style="left:${P(180)};top:${P(40)};width:${P(405)}"><i></i><i></i><i></i><i></i></div>
    <p class="rf-h" style="top:${P(78)}">Reflection...</p>
    <p class="rf-p" style="left:${P(242)};top:${P(108)};width:${P(350)}">Let’s reflect before we begin. Think back to the lesson ‘[live lesson title]’ you took on [date]. Consider:</p>
    ${tile(1, 252, 'Favorite moments')}${tile(2, 376, 'Key takeaways')}${tile(3, 490, 'Challenges')}
    <p class="rf-skip" style="left:${P(312)};top:${P(350)}"><i></i>Prefer not to reflect? Skip this in the future.</p>
    <div class="rf-frank" style="left:${P(232)};top:${P(436)};width:${P(76)}">${crop(S, W, H, 232, 436, 76, 84)}</div>
    <div class="rf-say" style="left:${P(318)};top:${P(455)};width:${P(268)};height:${P(50)}">Thinking about what we’ve learnt helps understand and remember better</div>
    <div class="rf-next" style="left:${P(291)};top:${P(537)};width:${P(240)};height:${P(30)}"><span>Next</span><i class="rip"></i></div>
    <div class="rf-pop">${cv('rf-canvas', 'vt-good-work.riv')}</div>`;
  return stageOf(W, H, 'rf', rpos(0, 0, W, H, win, '--d:.1s', 'rf-win'));
}

function initBitesB(scene) {
  return riveCanvas(scene.querySelector('canvas.rf-canvas'), { sm: 'default', autoplay: false }).then((fr) => {
    let off = () => {};
    return { start() { off = onLoopTimes(scene, [5700], () => restart(fr, 'default')); }, stop() { off(); } };
  });
}

/* ================= Lingobites C: practice tiles on the My course page ================= */

function sceneBitesC() {
  const W = 600, H = 473, S = 'case-studies/lingobites/course-page.webp', ox = 520, oy = 125;
  const L = (x, y) => [x - ox, y - oy];
  const star = (x, y, cls) => { const [a, b] = L(x, y); return `<svg class="bs ${cls}" viewBox="0 0 24 24" style="left:${P(a - 6)};top:${P(b - 6)};width:${P(12)}"><path d="M12 2.5l2.9 6.2 6.8.8-5 4.7 1.3 6.7L12 17.5 6 20.9l1.3-6.7-5-4.7 6.8-.8z"/></svg>`; };
  const tile = (x, y, w, h, cls) => { const [a, b] = L(x, y); return `<i class="bt ${cls}" style="left:${P(a)};top:${P(b)};width:${P(w)};height:${P(h)}"></i>`; };
  const [cx, cy] = L(1014, 150);
  const sheet = `
    ${crop(S, 1652, 664, ox, oy, W, H)}
    ${tile(803, 453, 45, 49, 'ta')}${tile(803, 510, 45, 49, 'tb')}
    ${star(814, 491, 'a1')}${star(826, 491, 'a2')}${star(838, 491, 'a3')}
    ${star(814, 548, 'b1')}${star(826, 548, 'b2')}${star(838, 548, 'b3')}
    <div class="bc-num" style="left:${P(cx)};top:${P(cy)};width:${P(10)};height:${P(16)}"><span><b>0</b><b>1</b><b>2</b></span></div>
    <svg class="bc-cur" viewBox="0 0 24 24" style="width:${P(26)}"><path d="M5 3l14 8-6 1.5L10 19z"/></svg>`;
  return stageOf(W, H, 'bc', rpos(0, 0, W, H, sheet, '--d:.1s', 'bc-win'));
}

/* ================= Lingoda D: the new Figma screens, static ================= */

function sceneLingodaD() {
  const W = 2400, H = 2225, D = 'mobile-app-v2/';
  // a phone in the same float-in + bob as version A (.rise / .ph), screen picture inside rounded corners
  const phone = (cls, x, y, w, inner, d) =>
    `<div class="pos rise ${cls}" style="left:${P(x)};top:${P(y)};width:${P(w)};--w:${w};--d:${d}s"><div class="ph"><div class="npi">${inner}</div></div></div>`;
  const shot = (img) => `<img class="shot" src="${D}${img}.webp?v=5" alt="" draggable="false">`;

  // onboarding illustration: the picture without its sparks and speech bubbles, then each of those on its own so it can move.
  // Positions are in Figma points on the 390 x 844 screen; the illustration starts at (30.33, 198).
  const OX = 30.34, OY = 198;
  const piece = (file, cls, x, y, w, h) =>
    `<img class="op ${cls}" src="${D}ob/${file}.webp" alt="" draggable="false" style="left:${((OX + x) / 390) * 100}%;top:${((OY + y) / 844) * 100}%;width:${(w / 390) * 100}%;height:${(h / 844) * 100}%">`;
  const onboarding = shot('onboarding') +
    `<img class="op ob-base" src="${D}ob/base.webp" alt="" draggable="false" style="left:${(OX / 390) * 100}%;top:${(OY / 844) * 100}%;width:${(329.34 / 390) * 100}%;height:${(258 / 844) * 100}%">` +
    piece('card', 'ob-card', 55.01, 67.42, 94.76, 66.85) +
    // the "..." bubble: the dots are covered with bubble colour and redrawn as three live dots that bounce in turn, like someone typing
    `<div class="op ob-top" style="left:${((OX + 143.09) / 390) * 100}%;top:${((OY + 19.84) / 844) * 100}%;width:${(44.83 / 390) * 100}%;height:${(24.57 / 844) * 100}%">` +
      `<img src="${D}ob/topbubble.webp" alt="" draggable="false"><i class="tb-patch"></i>` +
      [56, 89, 123].map((cx, i) => `<i class="tb-dot" style="left:${((cx - 8) / 180) * 100}%;--i:${i}"></i>`).join('') + `</div>` +
    piece('heart', 'ob-heart', 142.7, 138.2, 47.67, 47.68) +
    piece('spark-a', 'ob-spark s1', 280.46, 29.95, 21.45, 21.45) +
    piece('spark-b', 'ob-spark s2', 263.37, 4.91, 10.86, 10.86) +
    piece('spark-c', 'ob-spark s3', 122.25, 238.08, 10.86, 10.86) +
    piece('spark-d', 'ob-spark s4', 10.75, 96.79, 21.08, 21.08);

  // the middle phone swipes through the three welcome screens on a loop (see .car in thumb-motion.css).
  // Screens 2 and 3 are a clean background plus the parts that move, each placed in Figma points like the pieces above.
  const pc = (dir, file, x, y, w, h, cls = '', style = '') =>
    `<img class="op ${cls}" src="${D}${dir}/${file}.webp?v=4" alt="" draggable="false" style="left:${(x / 390) * 100}%;top:${(y / 844) * 100}%;width:${(w / 390) * 100}%;height:${(h / 844) * 100}%;${style}">`;
  const patch = '<i class="dpatch"></i>';   // paints over the page dots baked into each screen; one live set of dots is drawn on top instead
  const slide2 = `<div class="sl">${shot('s2/plate')}${patch}` +
    pc('s2', 'chip', 194.57, 297.38, 37.21, 25.67, 'pz-chip') +
    pc('s2', 'check', 222.28, 293, 12.72, 12.72, 'pz-check') + `</div>`;
  const slide3 = `<div class="sl">${shot('s3/plate')}${patch}` +
    pc('s3', 'squiggle1', 127.27, 219.07, 31.35, 27.47, 'fl', '--dx:1.1;--dy:-1.4;--r:6;--t:5.2s;--o:-.4s') +
    pc('s3', 'squiggle2', 97.17, 321.42, 30.41, 30.31, 'fl', '--dx:-.8;--dy:1.2;--r:-7;--t:4.6s;--o:-2.1s') +
    pc('s3', 'grammar', 77.1, 253.19, 53.05, 54.46, 'fl', '--dx:-.6;--dy:-1.6;--r:-4;--t:5.8s;--o:-1.2s') +
    pc('s3', 'quote', 243.66, 213.05, 39.27, 39.27, 'fl', '--dx:.7;--dy:-1.5;--r:5;--t:4.8s;--o:-3s') +
    pc('s3', 'asterisk', 290.82, 242.15, 24.79, 24.79, 'fl ast', '--dx:.4;--dy:-.9;--r:20;--t:4s;--o:-.8s') +
    pc('s3', 'cards', 256.71, 272.25, 60.04, 60.04, 'fl', '--dx:.9;--dy:1.5;--r:-5;--t:6.2s;--o:-2.6s') +
    pc('s3', 'bell', 119.75, 403.36, 29.28, 29, 'bell') + `</div>`;
  const carousel = `<div class="car"><div class="sl">${onboarding}${patch}</div>${slide2}${slide3}</div>` +
    `<div class="dots"><i class="d1"></i><i class="d2"></i><i class="d3"></i></div>`;

  // same positions as the original artwork: course page left, welcome screen in the middle (on top, so its centred text is fully visible), home right
  return stageOf(W, H, 'ld', `<div class="ld-zoom">` +
    phone('ph-l', 68, 243, 872, shot('course'), 0.15) +
    phone('ph-r', 1450, 243, 873, shot('today'), 0.3) +
    phone('ph-c', 754, 58, 874, carousel, 0) + `</div>`);
}

/* ================= Lingobites D: grammar exercise, then the score (recorded video) ================= */

function sceneBitesD() {
  return `<div class="stage bv"><video src="videos/lingobites/exercise-score.mp4" poster="videos/lingobites/exercise-score.jpg" muted loop playsinline preload="auto"></video></div>`;
}
function initBitesD(scene) {
  const v = scene.querySelector('video');
  return { start() { v.play().catch(() => {}); }, stop() { v.pause(); } };
}

/* ---------------- register ---------------- */

THUMB_META.lingobites = { param: 'bites', label: 'Lingobites', variants: [], default: 'e' };
addThumbVariant('lingoda-app', 'b', 'Frank reel (Rive)', sceneLingodaB, initLingodaB);
addThumbVariant('lingoda-app', 'c', 'Live UI + Frank (Rive)', sceneLingodaC, initLingodaC);
addThumbVariant('lingoda-app', 'd', 'New screens (swipe)', sceneLingodaD);
addThumbVariant('monetisation', 'b', 'Out-of-sessions flow', sceneMonetB);
addThumbVariant('monetisation', 'c', 'Two treatments', sceneMonetC);
addThumbVariant('seda', 'b', 'Vocabulary conveyor', sceneSedaB);
addThumbVariant('seda', 'c', 'Your progress', sceneSedaC);

/* ================= Seda D: the Figma layout, three language cards in turn =================
   Bench illustration on the left, a "Find the matching picture" card on the right (with a second card peeking out
   behind it). The right answer is picked, then the card swipes away and the next language comes in:
   Urdu (tea) > Indonesian (gayung) > Hindi (rice). All pictures live in /seda-speech. */

function sceneSedaD() {
  const W = 1292, H = 810, D = 'seda-speech/';
  const speaker = '<svg viewBox="0 0 24 24"><path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z M15.5 9c1.2 1.6 1.2 4.4 0 6 M18 7c2 2.4 2 7.6 0 10"/></svg>';
  const tick = '<svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9"/></svg>';
  const decks = [
    { lang: 'ur', word: 'چائے',  imgs: ['bike', 'cup', 'car', 'motorbike'], ok: 1 },
    { lang: 'id', word: 'gayung', imgs: ['jacket', 'tyre', 'stove', 'dipper'], ok: 3 },
    { lang: 'hi', word: 'चावल',  imgs: ['satay', 'bread', 'rice', 'teapot'], ok: 2 },
  ];
  const card = (d, i) => `
    <div class="dk-card" style="--i:${i};--dl:${[-4.8, -0.8, -8.8][i]}s">
      <p class="dk-t">Find the matching picture</p>
      <div class="dk-word"><i class="dk-spk">${speaker}</i><span class="w-${d.lang}">${d.word}</span></div>
      <div class="dk-grid">${d.imgs.map((n, k) =>
        `<span class="dk-tile${k === d.ok ? ' pick' : ''}"><img src="${D}${n}.png" alt=""><i class="dk-ok">${tick}</i></span>`).join('')}
      </div>
    </div>`;
  return stageOf(W, H, 'sd2',
    `<img class="sd2-bench" src="${D}bench.png?v=3" alt="" style="left:${P(22)};top:${P(220)};width:${P(598)}">` +
    `<div class="sd2-deck" style="left:${P(681)};top:${P(76)};width:${P(486)};height:${P(650)}">${decks.map(card).join('')}</div>`);
}

addThumbVariant('seda', 'd', 'Language cards (Figma layout)', sceneSedaD);
addThumbVariant('lingobites', 'a', 'Matching exercise', sceneBitesA);
addThumbVariant('lingobites', 'b', 'Reflection + Frank (Rive)', sceneBitesB, initBitesB);
addThumbVariant('lingobites', 'c', 'Practice tiles', sceneBitesC);
addThumbVariant('lingobites', 'd', 'Exercise → score (video)', sceneBitesD, initBitesD);
