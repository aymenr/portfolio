/* Lingobites E: the dialogue exercise rebuilt as live UI, then the score screen.
   Source: Figma "claude space for portfolio" (dialogue exercise frames + the 73% score frame).
   Story, one 12s loop:  last message arrives -> options slide up -> user picks one -> the blank fills ->
   every blank is marked (red / green) -> "3/5 matches!" sheet slides in -> score screen
   (73% counts up, stars from main-score.riv, Frank from good-work.riv, Next lights up).
   All sizes are in Figma frame pixels (1440 x 1024) through --p, like the other scenes. Styles: thumb-bites.css.
   Plugs into the registry in thumb-motion.js / thumb-variants.js (loaded before this file). */

const BX = 'thumb-assets/lingobites/';
const BX_T = 12000;   // loop length in ms; keep in sync with --bx-T in thumb-bites.css

function sceneBitesE() {
  const W = 1440, H = 1024;
  const img = (f, cls = '', style = '') => `<img class="${cls}" src="${BX}${f}" alt="" draggable="false" style="${style}">`;
  // one chat row: avatar + bubble (the bubble has a little arrow pointing at the avatar)
  const row = (id, who, body, wide) =>
    `<div class="bx-row" id="bx-r${id}">${img(`av-${who}.png`, 'bx-av')}<div class="bx-bub${wide ? ' wide' : ''}"><i class="bx-tip"></i><p>${body}</p></div></div>`;

  const chat = [
    row(2, 'orange', 'Natürlich. Ich war früher angestellt als Kfz-Mechatroniker, aber zuletzt war ich freiberuflich tätig. Dabei habe ich viel Berufserfahrung im Handwerk gesammelt.', true),
    row(3, 'pink', '<span class="bx-fill m3">Warum bewerben Sie sich hier?</span>'),
    row(4, 'orange', 'Ihre Firma hat einen guten Ruf und ich möchte meine persönlichen Fähigkeiten weiterentwickeln. Außerdem bin ich fließend in Wort und Schrift in Deutsch und Englisch.', true),
    row(5, 'pink', '<span class="bx-fill m5">Das ist beeindruckend. Was würden Sie als Ihr Vorstellungsgespräch beschreiben?</span>', true),
    row(6, 'orange', 'Meine Stärken sind Zuverlässigkeit und Effizienz. Allerdings kann ich manchmal zu direkt sein, das sehen einige als Schwäche.', true),
    row(7, 'pink', 'Jeder hat Stärken und Schwächen, <span class="bx-fill m7">haben Sie Zeugnisse dabei?</span>', true),
  ].join('');

  const checkpoints = ['cp-done', 'cp-a', 'cp-b', 'cp-c'].map((f, i) => `<img src="${BX}${f}.svg" alt="" style="left:${P([0, 227.4, 454.8, 680.2][i])}">`).join('');

  const exercise = `
    <div class="bx-layer bx-ex">
      <div class="bx-chat"><div class="bx-col">${chat}</div></div>
      <div class="bx-nav">
        <div class="bx-title"><img src="${BX}close.svg" alt=""><span>Lingobites - I can survive in a German classroom</span></div>
        <div class="bx-prog"><i class="bx-track"></i><i class="bx-fillbar"></i>${checkpoints}</div>
        <img class="bx-help" src="${BX}help.svg" alt="">
      </div>
      <div class="bx-bottom">
        <div class="bx-opts">
          <div class="bx-opt o1"><span>haben Sie Zeugnisse dabei?</span></div>
          <div class="bx-opt o2"><span>und es ist wichtig, sie zu akzeptieren und zu nutzen, um persönliches Wachstum.</span></div>
        </div>
      </div>
      <div class="bx-sheet">
        <div class="bx-sheet-in">
          ${img('partial.svg', 'bx-ico')}
          <div class="bx-col2">
            <h3>3/5 matches!</h3>
            <div class="bx-tries">${img('x-round.svg')}${img('target.svg')}${img('target.svg')}<b>2 tries left</b></div>
            <div class="bx-brow"><span class="bx-rep">${img('flag.svg')}Report</span>
              <span class="bx-btns"><span class="bx-ghost">Show answers</span><span class="bx-go">Try again</span></span></div>
          </div>
        </div>
      </div>
    </div>`;

  const score = `
    <div class="bx-layer bx-sc">
      <div class="bx-pct"><b>0</b>%</div>
      ${cv('bx-stars', 'main-score.riv')}
      <div class="bx-frank">${cv('bx-fk', 'good-work.riv')}</div>
      <div class="bx-say">Good effort! Let’s review how you did in each stage. Ready for the next steps?</div>
      <div class="bx-foot"><span class="bx-next">Next</span></div>
    </div>`;

  // the Figma frame has wide white margins, so the visible window is cropped to the middle 1040px (x 200..1240)
  const CW = 1040, CX = 200;
  return `<div class="stage bx" style="--ar:${CW / H};aspect-ratio:${CW} / ${H};--p:calc(100cqw / ${CW})"><div class="bx-in" style="left:${P(-CX)};width:${P(W)}">${exercise}${score}</div></div>`;
}

function initBitesE(scene) {
  const stars = scene.querySelector('canvas.bx-stars'), frank = scene.querySelector('canvas.bx-fk');
  const pct = scene.querySelector('.bx-pct b');
  let raf, starRive, token = 0;
  const countTo = (n, ms) => {
    cancelAnimationFrame(raf);
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / ms);
      pct.textContent = Math.round(n * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  };
  const dropStars = () => { token++; if (starRive) { starRive.cleanup(); starRive = null; } };
  return riveCanvas(frank, { sm: 'default', autoplay: false }).then((fk) => {
    let off = () => {};
    // moments in the loop (ms). The stars file is started fresh each lap just before the score screen shows:
    // an instance kept alive from page load never drew its stars (a new one on the same canvas does).
    const at = { prep: 7600, count: 8500, stars: 8800, frank: 9500, reset: 11940 };
    return {
      start() {
        off = onLoopTimes(scene, Object.values(at), (t) => {
          if (t === at.prep) { dropStars(); const my = token; riveCanvas(stars, { sm: 'State Machine 1', autoplay: true }).then((r) => { if (my === token) starRive = r; else r.cleanup(); }); }
          else if (t === at.count) countTo(73, 900);
          else if (t === at.stars) { const i = starRive && starRive.stateMachineInputs('State Machine 1')?.[0]; if (i) i.value = 2; }
          else if (t === at.frank) restart(fk, 'default');
          else if (t === at.reset) { dropStars(); cancelAnimationFrame(raf); pct.textContent = '0'; fk.stop(); }
        }, BX_T);
      },
      stop() { off(); cancelAnimationFrame(raf); dropStars(); },
    };
  });
}

addThumbVariant('lingobites', 'e', 'Live: exercise → score (Rive)', sceneBitesE, initBitesE);
