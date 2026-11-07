/* Bokeh backgrounds, shared by the home page thumbnails (script.js) and the case-study panels that hold screens.
   Every project gets the same recipe: 4 hues, a top-to-bottom gradient base (hue 1 at 0%, hue 2 at 20%, hue 3 at 100%),
   six soft colour blobs on top, and film grain over all of it. Built in JS because the grain is an SVG image and
   CSS variables can't reach inside it. */
(() => {
const DEF = { grain: 0.7, fine: 0.85, tile: 180, tone: 0.55, blob: 0.9, size: 100, lift: 0, csat: 100, clight: 88 };   // csat / clight: saturation and lightness (%) of the flat case-study cards
const HUES = {   // 4 hues per card: main, second, light, accent
  'midi':         ['#ff85c4', '#ffb28f', '#a87de8', '#ff7a8a'],
  'lingoda-app':  ['#428bff', '#ee9fd0', '#dc93c1', '#4082ec'],
  'monetisation': ['#f97f53', '#ffe3d6', '#f77db4', '#edb6cc'],
  'lingobites':   ['#4d77f5', '#d6dbff', '#ff9494', '#ff99b6'],
  'seda':         ['#ff6c47', '#ffa8a8', '#f490cf', '#9265ec'],
};
const POS = {    // where each of the six blobs sits (x%, y%)
  'midi':         [[50, 6], [18, 22], [50, 100], [86, 18], [72, 40], [10, 48]],
  'lingoda-app':  [[20, 24], [78, 18], [64, 70], [18, 80], [50, 48], [86, 52]],
  'monetisation': [[78, 26], [26, 20], [70, 78], [24, 72], [48, 52], [84, 56]],
  'lingobites':   [[24, 30], [80, 24], [74, 72], [30, 84], [54, 50], [12, 56]],
  'seda':         [[70, 20], [18, 34], [80, 80], [26, 76], [50, 56], [88, 46]],
};
const ROLES = [[0, 54, 0], [1, 50, 0], [2, 46, 0], [3, 50, 0], [1, 38, 0.35], [3, 38, 0.35]];   // [hue, radius %, lightened]

function layers(id, o, customHues) {
  o = o || DEF;
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const mixW = (c, t) => c.map((v) => Math.round(v + (255 - v) * t));
  const noise = o.grain > 0 ? `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='${o.tile}' height='${o.tile}'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${o.fine}' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${o.tone} 0 0 0 0 ${o.tone} 0 0 0 0 ${o.tone} 0 0 0 ${o.grain} 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>") 0 0 / ${o.tile}px ${o.tile}px, ` : '';
  const cs = (customHues || HUES[id]).map((h) => mixW(rgb(h), o.lift / 100));
  const a = o.blob;
  const blobs = ROLES.map(([hi, r0, lt], k) => {
    const [r, g, b] = lt ? mixW(cs[hi], lt) : cs[hi]; const r1 = Math.min(100, r0 * o.size / 100); const [x, y] = POS[id][k];
    return `radial-gradient(circle at ${x}% ${y}%, rgba(${r},${g},${b},${a}) 0, rgba(${r},${g},${b},${(a * 0.6).toFixed(2)}) ${Math.round(r1 * 0.37)}%, rgba(${r},${g},${b},0) ${Math.round(r1)}%)`;
  });
  const c3 = (i) => `rgb(${cs[i].join(',')})`;
  return `${noise}${blobs.join(', ')}, linear-gradient(180deg, ${c3(0)} 0%, ${c3(1)} 20%, ${c3(2)} 100%)`;
}

/* Case-study cards (objectives, results, persona, callouts): two flat colours per project, alternating, each a bright pastel of
   a palette colour (hue kept, saturation / lightness from the sliders), with an outline that is the same fill, darker. */
const toHsl = (hex) => {
  const v = [1, 3, 5].map((k) => parseInt(hex.slice(k, k + 2), 16) / 255), mx = Math.max(...v), mn = Math.min(...v), d = mx - mn, l = (mx + mn) / 2;
  const h = d === 0 ? 0 : (mx === v[0] ? ((v[1] - v[2]) / d + 6) % 6 : mx === v[1] ? (v[2] - v[0]) / d + 2 : (v[0] - v[1]) / d + 4) * 60;
  return [h, d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1)), l];
};
const hslHex = (h, s, l) => {
  const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l), f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return '#' + [f(0), f(8), f(4)].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
};
/* The default card colour: the palette colour's hue as a bright pastel (saturation / lightness from the sliders). */
const CARDS = {   // chosen card colours (fill A, fill B); a project not listed here gets pastels made from its palette
  'lingoda-app': ['#eeebff', '#fbe9f4'],
  'monetisation': ['#fff0eb', '#f4f0ff'],
  'lingobites': ['#e8edfd', '#fff5fd'],
};
function cardDefault(id, i, o) { o = o || DEF; return CARDS[id] ? CARDS[id][i] : hslHex(toHsl(HUES[id][i])[0], o.csat / 100, o.clight / 100); }
function cardVars(id, o, custom) {
  o = o || DEF;
  const out = {};
  [0, 1].forEach((i) => {
    const fill = (custom && custom[i]) || cardDefault(id, i, o), [h, s, l] = toHsl(fill), sfx = i ? '-2' : '';
    out['--cs-card' + sfx] = fill;                                           // exactly the colour picked (or the default pastel)
    out['--cs-line' + sfx] = hslHex(h, s, l * 0.82);                           // its own outline: the same colour, darker
  });
  return out;
}
window.Bokeh = { DEF, HUES, POS, ROLES, layers, cardVars, cardDefault };

/* Case-study pages: the panels that hold screens use their project's bokeh (see the --cs-panel rules in case-study.css). */
const file = location.pathname.split('/').pop();
const hit = [[/^lingoda-app/, 'lingoda-app'], [/^fluid-learn/, 'monetisation'], [/^lingobites/, 'lingobites']].find(([re]) => re.test(file));
if (hit) {
  const id = hit[1], h = location.hostname, local = location.protocol === 'file:' || h === 'localhost' || h === '127.0.0.1' || h.endsWith('.local');
  const root = document.documentElement;
  const saved = {};   // tweaks live only until the page is refreshed
  const o = { ...DEF, ...saved };
  const hues = () => saved.hues && saved.hues[id], cards = () => saved.cards && saved.cards[id];
  function apply() {
    root.style.setProperty('--cs-panel', layers(id, o, hues()));
    root.style.setProperty('--cs-panel-text', layers(id, { ...o, lift: Math.max(o.lift, 40), grain: Math.min(o.grain, 0.5), tone: 0.7 }, hues()));   // lighter, for panels with text laid on them
    Object.entries(cardVars(id, o, cards())).forEach(([k, v]) => root.style.setProperty(k, v));
    root.setAttribute('data-cs-panel', '');
    root.setAttribute('data-cs-project', id);
  }
  apply();

  /* Design Mode panel (local only): the same Site controls as the home page, applied live to this page's panels and cards.
     Tweaks are session-only (a refresh clears them); "Copy my changes" gives text to paste to Claude. */
  const CTL = [['grain', 'Grain strength', 0, 1, 0.05], ['fine', 'Grain fineness', 0.2, 1.8, 0.05], ['tile', 'Grain size', 60, 400, 10], ['tone', 'Grain tone', 0, 1, 0.05],
    ['blob', 'Blob strength', 0.3, 1, 0.05], ['size', 'Blob size %', 50, 160, 5], ['lift', 'Lighten', 0, 60, 1], ['csat', 'Card saturation %', 0, 100, 1], ['clight', 'Card lightness %', 60, 98, 1]];
  const persist = () => {};   // nothing is saved: a refresh clears every tweak
  const summary = () => {
    const L = [`Site tweaks to make permanent (${id} case study):`];
    const d = Object.entries(DEF).filter(([k, v]) => o[k] !== v).map(([k, v]) => `${k} ${o[k]} (default ${v})`);
    if (d.length) L.push('Bokeh sliders: ' + d.join(', '));
    if (hues()) L.push(`Bokeh colours ${id}: ${JSON.stringify(hues()).replace(/"/g, "'")}`);
    if (cards()) L.push(`Card colours ${id}: ${JSON.stringify(cards()).replace(/"/g, "'")}`);
    if (L.length === 1) L.push('(no changes)');
    return L.join('\n');
  };
  const copy = (text, btn) => {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).catch(() => { const t = document.createElement('textarea'); t.value = text; document.body.append(t); t.select(); document.execCommand('copy'); t.remove(); });
    const old = btn.textContent; btn.textContent = 'Copied'; setTimeout(() => (btn.textContent = old), 1200);
  };
  function mount(el) {
    const cur = () => (hues() || HUES[id]), cc = () => [0, 1].map((i) => (cards() && cards()[i]) || cardDefault(id, i, o));
    const sw = (kind, i, t, c) => `<label style="display:grid;gap:4px;text-align:center;font-size:11px"><input type="color" data-${kind}="${i}" value="${c}" aria-label="${t}" style="width:100%;height:32px;padding:0;border:0;border-radius:6px;cursor:pointer"><span>${t}</span></label>`;
    el.innerHTML = `<div class="sec">
      <div class="note">Bokeh and cards for this case study. Same settings as the home page's Site tab (each page starts from the defaults).</div>
      ${CTL.map(([k, t, mn, mx, st]) => `<div class="row"><span class="l">${t}</span><div class="ctl" style="display:flex;gap:8px;align-items:center"><input type="range" data-c="${k}" min="${mn}" max="${mx}" step="${st}" value="${o[k]}" aria-label="${t}" style="flex:1;min-width:0"><output data-o="${k}" style="min-width:3.5em;text-align:right">${o[k]}</output></div></div>`).join('')}
      <div class="row"><span class="l">Bokeh colours</span><div class="ctl" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">${['Main', 'Second', 'Light', 'Accent'].map((t, i) => sw('bk', i, t, cur()[i])).join('')}</div></div>
      <div class="row"><span class="l">Card colours</span><div class="ctl" style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">${['Card A', 'Card B'].map((t, i) => sw('ck', i, t, cc()[i])).join('')}</div></div>
      <div class="row"><span class="l"></span><div class="ctl" style="display:flex;gap:8px"><button type="button" class="tab" data-reset>Reset</button><button type="button" class="tab" data-copy>Copy my changes</button></div></div>
      <div class="note">Tweaks here are for this session only and disappear on refresh. Copy them, paste to Claude, and ask for them to be made permanent.</div></div>`;
    el.addEventListener('input', (e) => {
      const t = e.target;
      if (t.dataset.c) { o[t.dataset.c] = +t.value; el.querySelector(`[data-o="${t.dataset.c}"]`).textContent = t.value; }
      else if (t.dataset.bk !== undefined) { saved.hues = saved.hues || {}; (saved.hues[id] = saved.hues[id] || [...HUES[id]])[+t.dataset.bk] = t.value; }
      else if (t.dataset.ck !== undefined) { saved.cards = saved.cards || {}; (saved.cards[id] = saved.cards[id] || [0, 1].map((i) => cardDefault(id, i, o)))[+t.dataset.ck] = t.value; }
      else return;
      apply(); persist();
      if (t.dataset.c === 'csat' || t.dataset.c === 'clight') cc().forEach((c, i) => { const inp = el.querySelector(`[data-ck="${i}"]`); if (inp && !(cards() && cards()[i])) inp.value = c; });
    });
    el.querySelector('[data-copy]').addEventListener('click', (e) => copy(summary(), e.currentTarget));
    el.querySelector('[data-reset]').addEventListener('click', () => {
      Object.assign(o, DEF); if (saved.hues) delete saved.hues[id]; if (saved.cards) delete saved.cards[id];
      apply(); persist(); mount(el);
    });
    return () => {};
  }
  if (local) {
    const add = () => window.__designMode && window.__designMode.addAppTab && window.__designMode.addAppTab({ id: 'site-bokeh', label: 'Site', mount });
    add(); window.addEventListener('designmode:ready', add);
  }
}
})();
