/* ==========================================================================
   Aymen Rizwan — portfolio
   - PROJECTS: the single source of truth for project cards
   - VARIANTS: the style explorations (one CSS file each in /variants)
   - Dev mode: a floating panel to flip variants, project order and motion.
     Hidden by default; press ~ (or open with ?dev in the URL) to show it.
     Without the panel the site always shows Alice · Final with masonry.
   ========================================================================== */

const DEV_MODE_DEFAULT = false;
const DEFAULT_VARIANT = 'alice';

const SLIDES = {
  lingodaApp: 'https://www.figma.com/slides/ebqTfmzGyx9FKhsbFZOwj2/Lingoda-mobile-app--Khan-Academy-?t=da21xlf379yYpVYi-6',
  monetisation: 'https://www.figma.com/slides/u83ullpzoU9lImNq5NKqCc/Fluid-learn-mode-monetization--FULL-?t=da21xlf379yYpVYi-6',
  visual: 'https://www.figma.com/slides/1YRjfgCPjN1GR5ilHCCFuh/Visual-showcase?t=da21xlf379yYpVYi-6',
  lingobites: 'https://www.figma.com/slides/FL6CwLDExS7jJvEU7CxnGL/Lingobites--Full-Archived-?t=da21xlf379yYpVYi-6',
};

const PROJECTS = [
  {
    id: 'lingoda-app', kind: 'work', org: 'Lingoda', type: 'Case study',
    title: '0 → 1 launch of a mobile app',
    desc: "I designed and launched Lingoda's mobile app from scratch in **six months**. When I handed it over it had **1000+ installs** and a **4.3 rating**.",
    img: 'mobile-app.webp', href: 'lingoda-app.html', cta: 'View the case study',
  },
  {
    id: 'monetisation', kind: 'work', org: 'StudySmarter', type: 'Case study',
    title: 'Monetisation experiments',
    desc: "Monetisation experiments on a Learn mode that showed a **30% increase in premium revenue**.",
    img: 'monetisation-experiments.webp', href: 'fluid-learn.html', cta: 'View the case study',
  },
  {
    id: 'lingobites', kind: 'work', org: 'Lingoda', type: 'Case study',
    title: 'Designing learning experiences',
    desc: "Lingoda's flagship practice activity, with **16.2% better 7-day retention** than any activity before it.",
    img: 'lingobites.webp', href: 'lingobites.html', cta: 'View the case study',
  },
  {
    id: 'visual', kind: 'work', org: 'Various', type: 'Showcase',
    title: 'Visual showcase',
    desc: 'A glimpse into projects across different platforms and problem spaces.',
    img: 'visual-showcase.webp', href: SLIDES.visual, cta: 'Browse the showcase',
  },
  {
    id: 'seda', kind: 'own', org: '', type: 'Currently building',
    title: 'Seda Speech',
    desc: "Culturally inclusive speech therapy for patients with aphasia, available in 12+ languages.",
    cover: 'seda', href: 'https://sedaspeech.com/', cta: 'Visit sedaspeech.com',
  },
  {
    id: 'sampler', kind: 'own', org: 'Side project', type: 'Music toy',
    title: 'Sampler',
    desc: "A toy sampler in the browser. There's a **new sample pack every day**, and you get **15 minutes** to make a **4-bar beat** and post it.",
    cover: 'sampler', href: 'https://github.com/aymenr/sampler', cta: 'See the project',
  },
  {
    id: 'falsa', kind: 'own', org: 'Falsa Club', type: 'Music tools',
    title: 'Falsa Club',
    desc: 'A home for the browser music tools I design and build, including MIDI Play and a MIDI app.',
    cover: 'falsa', href: 'https://falsaclub.com/', cta: 'Visit falsaclub.com',
    extra: [['MIDI Play', 'https://midiplay.falsaclub.com/'], ['MIDI app', 'https://midi.falsaclub.com/app/']],
  },
];

// The chosen design (Alice · Final) shows five projects, in this order of importance.
// 'midi' lives here, not in PROJECTS, so the exploration variants stay as they were.
const DEFAULT_DISPLAY = 'even';
const DISPLAYS = [['even', 'Masonry (final)'], ['masonry', 'Masonry · old stagger'], ['bento', 'Bento'], ['ladder', 'Ladder'], ['feature', 'Feature'], ['feature-lead', 'Feature · Large lead'], ['trio', 'Trio'], ['split', 'Split'], ['tall', 'Masonry · Tall middle'], ['wide', 'Masonry · Wide left']];
const PAGE_W = { min: 640, max: 1480 };
const FINAL_ORDER = ['midi', 'lingoda-app', 'monetisation', 'lingobites', 'seda'];
const FINAL_EXTRA = {
  midi: {
    id: 'midi', kind: 'own', org: '', type: 'Currently building', title: 'midi.play',
    desc: "Web app that turns any song or YouTube link into a piano lesson. Play along and learn it by ear and by hand.",
    img: 'midi-thumb.webp', video: 'videos/midi-play.mp4', poster: 'videos/posters/midi-play.webp',
    href: 'https://midi.falsaclub.com/', cta: 'Open the MIDI app',
  },
};

// Order for the "mixed" index: own products woven between case studies
const MIXED_ORDER = ['seda', 'lingoda-app', 'sampler', 'monetisation', 'lingobites', 'falsa', 'visual'];

const VARIANTS = [
  { id: 'alice', name: 'Alice · Final', blurb: 'Alice Zhao style. Projects as masonry, bento, or four flush-row layouts (Ladder, Feature, Trio, Split) via the Display control.', fonts: 'Hanken Grotesk' },
  { id: 'alice-merged', name: 'Alice · Hero + About', blurb: 'Alice · Final with the intro and About me in one opening section.', fonts: 'Hanken Grotesk' },
  { id: 'editorial', name: 'The Quarterly', blurb: 'Old magazine. Masthead, column rules, drop caps, folios.', fonts: 'Bodoni Moda, Newsreader and IBM Plex Mono' },
  { id: 'riso', name: 'Riso Zine', blurb: 'Two-colour risograph. Overprint, misregistration, halftone photos.', fonts: 'Bricolage Grotesque and Atkinson Hyperlegible' },
  { id: 'collage', name: 'Cut & Paste', blurb: 'Kraft paper, masking tape, torn edges, ransom-note letters.', fonts: 'Abril Fatface, Bungee, Special Elite and Courier Prime' },
  { id: 'sketchbook', name: 'Sketchbook', blurb: 'Graph paper and marker. Doodles draw themselves in.', fonts: 'Permanent Marker, Kalam and Caveat' },
  { id: 'index', name: 'Index', blurb: 'Quiet contents page. Hover a row to see the project follow your cursor.', fonts: 'EB Garamond and Fragment Mono' },
  { id: 'catalogue', name: 'Exhibition Catalogue', blurb: 'Gallery catalogue. Plates, captions, Roman numerals, lots of air.', fonts: 'Cormorant Garamond and Jost' },
  { id: 'xerox', name: 'Xerox Punk', blurb: 'Photocopied black and white, highlighter, scrawled notes.', fonts: 'Anton, Courier Prime and Rock Salt' },
  { id: 'swiss', name: 'Swiss Poster', blurb: 'International style. Hard grid, giant numerals, primary colours.', fonts: 'Archivo' },
  { id: 'dossier', name: 'Case File', blurb: 'Manila folders, typewriter, index tabs and rubber stamps.', fonts: 'Special Elite, Courier Prime and Staatliches' },
  { id: 'soft', name: 'Soft Studio', blurb: 'Not print. Warm, rounded, friendly, closest to your current site.', fonts: 'Fraunces and Figtree' },
  { id: 'night', name: 'Night Session', blurb: 'Not print. Dark studio, mono type, ticker, glowing hover.', fonts: 'Big Shoulders Display and JetBrains Mono' },
  { id: 'sleeve', name: 'Record Sleeves', blurb: 'Each project is an LP sleeve. Hover to slide the record out.', fonts: 'Shrikhand and Rubik' },
  { id: 'ref-alicezhao', name: 'Ref · Alice Zhao', blurb: 'Dot-grid hero, grey-and-black statement, wide rows: text left, big rounded image right.', fonts: 'Hanken Grotesk' },
  { id: 'ref-chiquach', name: 'Ref · Chi Quach', blurb: 'Grey desk, glossy ID card hero with a pin, paper prints, tab dock at the bottom.', fonts: 'Instrument Serif, DM Mono and DM Sans' },
  { id: 'ref-astapable', name: 'Ref · Astapable', blurb: 'Floating bar with a dark pill, big bottom-left name, code-comment headings, light and dark tiles.', fonts: 'Instrument Sans' },
  { id: 'ref-anurag', name: 'Ref · Anurag', blurb: 'Dashed column, pinned intro on the left, red serif, mono text, red labels on images.', fonts: 'Instrument Serif and Geist Mono' },
  { id: 'ref-nelli', name: 'Ref · Nelli', blurb: 'Narrow white page, pill tabs, soft grey tiles that hold one image like a book on a shelf.', fonts: 'Newsreader and Inter' },
  { id: 'ref-folasewa', name: 'Ref · Folasewa', blurb: 'Dark page, pill nav, bold serif with coloured words, folder-shaped project cards.', fonts: 'Merriweather and DM Sans' },
  { id: 'ref-azeem', name: 'Ref · Azeem', blurb: 'Plain white, one light headline, masonry of images floating on sky and grass gradients.', fonts: 'Inter Tight' },
];

/* ---------- covers for projects without thumbnails (session 2 will replace these) ---------- */

function coverSVG(kind) {
  if (kind === 'seda') {
    const bars = [18, 34, 52, 30, 64, 80, 46, 70, 38, 58, 26, 44, 20, 36, 14];
    return `<svg viewBox="0 0 300 190" aria-hidden="true">
      <path class="cv-bubble" d="M40 40 h220 a18 18 0 0 1 18 18 v66 a18 18 0 0 1 -18 18 h-150 l-34 26 v-26 h-36 a18 18 0 0 1 -18 -18 v-66 a18 18 0 0 1 18 -18z" fill="none" stroke="currentColor" stroke-width="4"/>
      ${bars.map((h, i) => `<rect class="cv-bar" style="--b:${i}" x="${66 + i * 12}" y="${91 - h / 2.4}" width="6" height="${h / 1.2}" rx="3" fill="currentColor"/>`).join('')}
    </svg>`;
  }
  if (kind === 'sampler') {
    const lit = [0, 5, 6, 10, 15, 3, 12];
    let pads = '';
    for (let i = 0; i < 16; i++) {
      const x = 75 + (i % 4) * 40, y = 20 + Math.floor(i / 4) * 40;
      pads += `<rect class="cv-pad${lit.includes(i) ? ' on' : ''}" style="--p:${i}" x="${x}" y="${y}" width="32" height="32" rx="5" fill="${lit.includes(i) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="3"/>`;
    }
    return `<svg viewBox="0 0 300 190" aria-hidden="true">${pads}</svg>`;
  }
  // falsa: piano keys + a few MIDI notes
  let keys = '';
  for (let i = 0; i < 10; i++) keys += `<rect x="${30 + i * 24}" y="110" width="22" height="64" rx="2" fill="none" stroke="currentColor" stroke-width="3"/>`;
  [0, 1, 3, 4, 5, 7, 8].forEach((i) => { keys += `<rect x="${46 + i * 24}" y="110" width="14" height="38" rx="2" fill="currentColor"/>`; });
  const notes = [[40, 70, 40], [90, 50, 28], [124, 84, 52], [182, 34, 36], [222, 62, 44]];
  const n = notes.map(([x, y, w], i) => `<rect class="cv-note" style="--n:${i}" x="${x}" y="${y}" width="${w}" height="10" rx="3" fill="currentColor"/>`).join('');
  return `<svg viewBox="0 0 300 190" aria-hidden="true">${n}${keys}</svg>`;
}

/* ---------- rendering ---------- */

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// **like this** in a description marks a number or result to set in semi-bold.
const emph = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
const roman = (n) => ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][n - 1] || n;

function cardHTML(p, i) {
  const no = String(i + 1).padStart(2, '0');
  // video: a short silent loop (with a still, poster, shown first); it only starts once the card scrolls into view
  const media = p.video
    ? `<video muted loop playsinline preload="none" poster="${p.poster}" data-src="${p.video}" width="2500" height="1594" aria-hidden="true"></video>`
    : p.scene
    ? p.scene
    : p.img
    ? `<img src="${p.img}" alt="" loading="lazy" width="2500" height="1594">`
    : `<div class="cover cover-${p.cover}">${coverSVG(p.cover)}<span class="cover-word">${esc(p.title)}</span></div>`;
  const extra = p.extra
    ? `<ul class="card-extra">${p.extra.map(([l, h]) => `<li><a href="${h}" target="_blank" rel="noopener">${esc(l)} ↗</a></li>`).join('')}</ul>`
    : '';
  return `
    <article class="card reveal${p.bare ? ' is-bare' : ''}" data-kind="${p.kind}" data-id="${p.id}" data-i="${i}" data-preview="${p.img || ''}" style="--i:${i}">
      <figure class="card-media">${media}<span class="card-plate">Plate ${roman(i + 1)}</span></figure>
      <div class="card-body">
        <div class="card-meta">
          <span class="card-no">${no}</span>
          ${p.org ? `<span class="card-tag">${esc(p.org)}</span>` : ''}
          <span class="card-type">${esc(p.type)}</span>
        </div>
        <h3 class="card-title"><a class="card-link" href="${p.href}"${/^https?:/.test(p.href) ? ' target="_blank" rel="noopener"' : ''}>${esc(p.title)}</a></h3>
        <p class="card-desc">${emph(p.desc)}</p>
        <span class="card-cta" aria-hidden="true">${esc(p.cta)} <span class="arr">↗</span></span>
        ${extra}
      </div>
      <span class="card-tape" aria-hidden="true"></span>
      <span class="card-disc" aria-hidden="true"></span>
    </article>`;
}

function groupHTML(g, items, offset) {
  return `
    <section class="group" id="${g.id}" data-group="${g.id}">
      <header class="section-head">
        <span class="section-mark">${g.mark}</span>
        <h2 class="section-title">${g.title}</h2>
        <p class="section-note">${g.note}</p>
      </header>
      <div class="cards">${items.map((p, i) => cardHTML(p, i + offset)).join('')}</div>
    </section>`;
}

// Alice · Final: one list in priority order.
// Masonry = a loose collage: a wide left column (1st, 3rd, 5th) and a narrower right one that starts lower (2nd, 4th);
// alice.css gives each card its own width, shape and side so nothing lines up in neat rows. Bento = flat grid.
function finalHTML(display) {
  const byId = { ...Object.fromEntries(PROJECTS.map((p) => [p.id, p])), ...FINAL_EXTRA };
  // bare: the image is loose items from a Figma artboard (transparent, shadows baked in),
  // so it sits straight on the card's gradient instead of inside a second framed box
  const bare = { seda: 'seda-items.webp', 'lingoda-app': 'mobile-app-items.webp?v=2', monetisation: 'monetisation-items.webp', lingobites: 'lingobites-items.webp' };
  for (const [id, img] of Object.entries(bare)) byId[id] = { ...byId[id], img, bare: true };
  if (state.motion !== 'off') {
    for (const id of FINAL_ORDER) {
      const v = state.thumb?.[id];
      const scene = v && v !== 'still' && typeof thumbScene === 'function' && thumbScene(id, v);
      if (scene) byId[id] = { ...byId[id], scene, video: undefined };   // a scene replaces the card's hover video too
    }
  }
  const cards = FINAL_ORDER.map((id, i) => cardHTML(byId[id], i));
  const body = display === 'masonry'
    ? [0, 1].map((c) => `<div class="col">${cards.filter((_, i) => i % 2 === c).join('')}</div>`).join('')
    : cards.join('');
  return `
    <section class="group" id="work" data-group="work">
      <header class="section-head">
        <span class="section-mark">Work</span>
        <h2 class="section-title">Selected work</h2>
      </header>
      <div class="cards">${body}</div>
    </section>`;
}

// Card videos start when they scroll near the screen, and never when motion is off (the still shows instead).
let cardVideoIO;
function playCardVideos() {
  if (cardVideoIO) cardVideoIO.disconnect();
  const videos = document.querySelectorAll('.card-media video[data-src]');
  if (!videos.length || state.motion === 'off' || !('IntersectionObserver' in window)) return;
  cardVideoIO = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const v = e.target;
      if (!v.getAttribute('src')) v.setAttribute('src', v.dataset.src);
      v.play().catch(() => {});
      cardVideoIO.unobserve(v);
    });
  }, { rootMargin: '200px' });
  videos.forEach((v) => cardVideoIO.observe(v));
}

function renderProjects(order) {
  const root = document.getElementById('projects');
  const byId = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));
  if (isFinal()) {
    root.innerHTML = finalHTML(state.display);
  } else if (order === 'mixed') {
    root.innerHTML = groupHTML(
      { id: 'work', mark: 'Contents', title: 'Index of work', note: 'Case studies and my own products, in one list.' },
      MIXED_ORDER.map((id) => byId[id]), 0
    );
  } else {
    const work = PROJECTS.filter((p) => p.kind === 'work');
    const own = PROJECTS.filter((p) => p.kind === 'own');
    root.innerHTML =
      groupHTML({ id: 'work', mark: 'Part one', title: 'Selected work', note: 'Case studies from Lingoda and StudySmarter.' }, work, 0) +
      groupHTML({ id: 'made', mark: 'Part two', title: 'Things I make', note: 'Products I design and build myself.' }, own, work.length);
  }
  bindCards();
  playCardVideos();
  if (typeof playScenes === 'function') playScenes();
  observeReveals();
  if (typeof applyCardSkies === 'function' && state.cardSky) applyCardSkies();
}

/* ---------- state ---------- */

const store = {
  get(k) { try { return localStorage.getItem('pf:' + k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem('pf:' + k, v); } catch { /* storage unavailable */ } },
};
const params = new URLSearchParams(location.search);
const devOnLoad = params.has('dev') || DEV_MODE_DEFAULT;
// Stored picks only apply when the dev panel is open on load; everyone else gets the final design.
const state = {
  v: params.get('v') || (devOnLoad && store.get('v')) || DEFAULT_VARIANT,
  order: params.get('order') || (devOnLoad && store.get('order')) || 'work',
  display: params.get('display') || (devOnLoad && store.get('display')) || DEFAULT_DISPLAY,
  width: +(params.get('width') || (devOnLoad && store.get('width')) || PAGE_W.max), // page width in px (Dev panel > Width)
  motion: store.get('motion') || 'on',
  dots: params.get('dots') || (devOnLoad && store.get('dots')) || '5', // hero dot hover effect, see dot-hover.js
  dev: devOnLoad,
};
if (!VARIANTS.some((x) => x.id === state.v)) state.v = DEFAULT_VARIANT;
if (!DISPLAYS.some(([k]) => k === state.display)) state.display = DEFAULT_DISPLAY;
// Motion thumbnails (thumb-motion.js): per project, 'still' or a variant letter. ?thumbs=motion turns every project to variant a.
state.thumb = {};
for (const [id, m] of Object.entries(typeof THUMB_META === 'undefined' ? {} : THUMB_META)) {
  const pick = params.get(m.param) || (params.get('thumbs') === 'motion' ? 'a' : '') || (devOnLoad && store.get('thumb-' + m.param)) || m.default || 'still';
  state.thumb[id] = m.variants.some(([k]) => k === pick) ? pick : 'still';
}
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && !store.get('motion')) state.motion = 'off';

const root = document.documentElement;
// Sky palettes for the thumbnail backgrounds (gradients live in variants/alice.css as html[data-skies]).
const SKIES = [['bokeh-each', 'Bokeh · Each different'], ['original', 'Original'], ['dawn', 'Dawn'], ['sunrise', 'Sunrise'], ['clear', 'Clear day'], ['golden', 'Golden hour'], ['dusk', 'Dusk'], ['twilight', 'Twilight'], ['night', 'Night'], ['misty', 'Misty morning'], ['overcast', 'Overcast'], ['storm', 'Storm'], ['each', 'A · Each different'], ['same', 'B · All the same'], ['family', 'C · Lingoda family + standouts'], ['hues', 'D · One palette, hue shifted'], ['bokeh-meadow', 'Bokeh · Meadow'], ['bokeh-dusk', 'Bokeh · Dusk'], ['bokeh-warm', 'Bokeh · Warm'], ['bokeh-sky', 'Bokeh · Sky']];
state.skies = SKIES.some(([k]) => k === (params.get('skies') || (devOnLoad && store.get('skies')))) ? (params.get('skies') || store.get('skies')) : SKIES[0][0];
root.dataset.skies = state.skies;
// Per-thumbnail sky: a project can use its own sky instead of the global one (dev panel > Gradients). Missing = same as the global Skies setting (Original by default); choosing a global sky resets them all to it.
state.cardSky = {};
try { if (devOnLoad) Object.assign(state.cardSky, JSON.parse(store.get('cardsky') || '{}')); } catch {}
const effSky = (id) => (SKIES.some(([k]) => k === state.cardSky[id]) ? state.cardSky[id] : state.skies);
function applyCardSkies() {
  document.querySelectorAll('.card[data-id]').forEach((c) => {
    const k = state.cardSky?.[c.dataset.id];
    if (k && SKIES.some(([x]) => x === k)) c.dataset.sky = k; else delete c.dataset.sky;
  });
}
function applyCardSky(id, k) {
  if (k) state.cardSky[id] = k; else delete state.cardSky[id];
  if (devOnLoad) store.set('cardsky', JSON.stringify(state.cardSky));
  applyCardSkies(); gradApply();
}
// Optional background choices for a project's thumbnail (THUMB_META[id].bgs: [key, name]), e.g. the MIDI Play gradients.
// The page reads them as html[data-<param>bg="key"] (see thumb-midi.css); the first one is the default.
state.thumbBg = {};
for (const [id, m] of Object.entries(typeof THUMB_META === 'undefined' ? {} : THUMB_META)) {
  if (!m.bgs) continue;
  const pick = params.get(m.param + 'bg') || (devOnLoad && store.get('thumbbg-' + m.param)) || m.bgs[0][0];
  state.thumbBg[id] = m.bgs.some(([k]) => k === pick) ? pick : m.bgs[0][0];
  root.dataset[m.param + 'bg'] = state.thumbBg[id];
}
// Alice · Final and its spin-offs (alice-merged) share the same project layout, wall and controls
const isFinal = () => state.v.startsWith('alice');

// Alice · Hero + About keeps the About text inside the hero; every other style has it in the About section.
function placeAbout() {
  const text = document.querySelector('.about-text');
  const hero = document.querySelector('.hero');
  const body = document.querySelector('.about-body');
  if (!text || !hero || !body) return;
  const target = state.v === 'alice-merged' ? hero : body;
  if (text.parentElement !== target) target.append(text);
}

function applyVariant(id) {
  const v = VARIANTS.find((x) => x.id === id) || VARIANTS[0];
  const wasFinal = isFinal();
  state.v = v.id;
  if (wasFinal !== isFinal()) renderProjects(state.order);
  store.set('v', v.id);
  const link = document.getElementById('variant-css');
  const href = `variants/${v.id}.css`;
  if (!link.getAttribute('href').split('?')[0].endsWith(href)) {
    root.classList.add('switching');
    const next = link.cloneNode();
    next.href = href;
    next.onload = () => {
      link.remove();
      next.id = 'variant-css';
      root.dataset.v = v.id;
      replay();
      requestAnimationFrame(() => root.classList.remove('switching'));
    };
    link.after(next);
    next.id = 'variant-css-next';
  } else {
    root.dataset.v = v.id;
  }
  placeAbout();
  document.querySelectorAll('[data-fonts]').forEach((el) => (el.textContent = v.fonts));
  syncPanel();
}

function applyOrder(order) {
  state.order = order === 'mixed' ? 'mixed' : 'work';
  store.set('order', state.order);
  root.dataset.order = state.order;
  renderProjects(state.order);
  syncPanel();
}

function applyDisplay(d) {
  state.display = DISPLAYS.some(([k]) => k === d) ? d : DEFAULT_DISPLAY;
  store.set('display', state.display);
  root.dataset.display = state.display;
  if (isFinal()) renderProjects(state.order);
  syncPanel();
}

function applyWidth(w) {
  w = Math.round(Math.min(PAGE_W.max, Math.max(PAGE_W.min, +w || PAGE_W.max)));
  state.width = w;
  store.set('width', w);
  if (w >= PAGE_W.max) { root.style.removeProperty('--maxw'); root.style.removeProperty('--page-u'); }
  else { root.style.setProperty('--maxw', w + 'px'); root.style.setProperty('--page-u', (w * 14 / PAGE_W.max).toFixed(2) + 'px'); }
  syncPanel();
}

function applyMotion(m) {
  state.motion = m === 'off' ? 'off' : 'on';
  store.set('motion', state.motion);
  root.dataset.motion = state.motion;
  if (state.motion === 'off') document.querySelectorAll('.reveal.pre').forEach((el) => el.classList.remove('pre'));
  else playCardVideos();
  if (isFinal()) renderProjects(state.order);   // motion thumbnails give way to the stills when motion is off
  syncPanel();
}

function applyThumb(id, v) {
  const m = THUMB_META[id];
  state.thumb[id] = m.variants.some(([k]) => k === v) ? v : 'still';
  store.set('thumb-' + m.param, state.thumb[id]);
  if (isFinal()) renderProjects(state.order);
  syncPanel();
}

function applyThumbBg(id, v) {
  const m = THUMB_META[id];
  state.thumbBg[id] = m.bgs.some(([k]) => k === v) ? v : m.bgs[0][0];
  store.set('thumbbg-' + m.param, state.thumbBg[id]);
  root.dataset[m.param + 'bg'] = state.thumbBg[id];
  syncPanel();
}

/* ---------- Bokeh · Each different (default sky) ----------
   Every thumbnail gets the same recipe: 4 hues, a top-to-bottom gradient base (hue 1 at 0%, hue 2 at 20%, hue 3 at 100%), six soft colour blobs on top, and film grain over all of it.
   The numbers below are the dev panel's "Bokeh" sliders (Site tab). Built in JS because the grain is an SVG
   image and CSS variables can't reach inside it. */
const { DEF: BOKEH_DEF, HUES: BOKEH_HUES, POS: BOKEH_POS, ROLES: BOKEH_ROLES } = window.Bokeh;
const BOKEH_CTL = [['grain', 'Grain strength', 0, 1, 0.05], ['fine', 'Grain fineness', 0.2, 1.8, 0.05], ['tile', 'Grain size', 60, 400, 10], ['tone', 'Grain tone', 0, 1, 0.05],
  ['blob', 'Blob strength', 0.3, 1, 0.05], ['size', 'Blob size %', 50, 160, 5], ['lift', 'Lighten', 0, 60, 1],
  ['csat', 'Card saturation %', 0, 100, 1], ['clight', 'Card lightness %', 60, 98, 1]];
const bokeh = { ...BOKEH_DEF, hues: {}, cards: {} };
const isBokeh = (id) => effSky(id) === 'bokeh-each';
const bokehStyle = (() => { const e = document.createElement('style'); e.id = 'bokeh-each-css'; document.head.append(e); return e; })();
/* Copy every colour / image tweak made in this session as plain text. Tweaks are never saved: a refresh clears them, so paste this to ask for the change to be made permanent. */
function settingsText() {
  const L = ['Site tweaks to make permanent:'];
  const d = Object.entries(BOKEH_DEF).filter(([k, v]) => bokeh[k] !== v).map(([k, v]) => `${k} ${bokeh[k]} (default ${v})`);
  if (d.length) L.push('Bokeh sliders: ' + d.join(', '));
  for (const [id, h] of Object.entries(bokeh.hues)) L.push(`Bokeh colours ${id}: ${JSON.stringify(h).replace(/"/g, "'")}`);
  for (const [id, c] of Object.entries(bokeh.cards)) L.push(`Card colours ${id}: ${JSON.stringify(c).replace(/"/g, "'")}`);
  for (const [id, f] of Object.entries(cardImg)) L.push(`Image for ${id}: GRADIENTS/${f}`);
  for (const [sky, ov] of Object.entries(gradAll)) for (const [id, g] of Object.entries(ov)) L.push(`Gradient for ${id} (${sky}): ${gradCSS(g)}`);
  if (L.length === 1) L.push('(no changes)');
  return L.join('\n');
}
function copyText(text, btn) {
  (navigator.clipboard?.writeText(text) || Promise.reject()).catch(() => {
    const t = document.createElement('textarea'); t.value = text; document.body.append(t); t.select(); document.execCommand('copy'); t.remove();
  });
  if (btn) { const old = btn.textContent; btn.textContent = 'Copied'; setTimeout(() => (btn.textContent = old), 1200); }
}
function bokehApply() {
  const css = Object.keys(BOKEH_HUES).map((id) => `html[data-skies="bokeh-each"] .card[data-id="${id}"], html:root .card[data-sky="bokeh-each"][data-id="${id}"] { --g: ${window.Bokeh.layers(id, bokeh, bokeh.hues[id])}; }`).join('\n');
  bokehStyle.textContent = css;
}
bokehApply();

function applySkies(v) {
  state.skies = SKIES.some(([k]) => k === v) ? v : SKIES[0][0];
  store.set('skies', state.skies);
  root.dataset.skies = state.skies;
  // picking a global sky sets every thumbnail to it; individual thumbnails can then be changed again
  state.cardSky = {}; if (devOnLoad) store.set('cardsky', '{}');
  applyCardSkies();
  if (typeof gradApply === 'function') gradApply();
  syncPanel();
}

let allThumb = 'still';
// every project's thumbnail to the same variant letter (or still); projects without that letter stay as they are
function applyThumbAll(v) {
  for (const [id, m] of Object.entries(THUMB_META)) {
    const next = v === 'still' || m.variants.some(([k]) => k === v) ? v : state.thumb[id];
    state.thumb[id] = next; store.set('thumb-' + m.param, next);
  }
  if (isFinal()) renderProjects(state.order);
  syncPanel();
}

function applyDots(n) {
  state.dots = ['1', '2', '3', '4', '5'].includes(String(n)) ? String(n) : '5';
  store.set('dots', state.dots);
  root.dataset.dots = state.dots;
  syncPanel();
}

/* ---------- motion ---------- */

let io;
function observeReveals() {
  if (io) io.disconnect();
  if (state.motion === 'off' || !('IntersectionObserver' in window)) return;
  io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.remove('pre');
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  const vh = window.innerHeight;
  document.querySelectorAll('.reveal, .section-head, .about-body, .offscreen, .contact').forEach((el) => {
    el.classList.add('reveal');
    const r = el.getBoundingClientRect();
    // Only hide things that start below the fold, so the first screen is complete at rest
    if (r.top > vh * 0.9) { el.classList.add('pre'); el.classList.remove('in'); io.observe(el); }
    else { el.classList.remove('pre'); el.classList.add('in'); }
  });
}

// Re-run the entrance sequence (used when switching variants so each one shows its motion)
function replay() {
  if (state.motion === 'off') return;
  root.classList.remove('loaded');
  void root.offsetWidth;
  root.classList.add('loaded');
  observeReveals();
}

function bindCards() {
  const preview = document.querySelector('.cursor-preview');
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
      preview.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
    card.addEventListener('pointerenter', () => {
      // copy the card's image (or drawn cover) into the floating preview
      preview.innerHTML = card.querySelector('.card-media').innerHTML;
      preview.classList.add('show');
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--mx', 0);
      card.style.setProperty('--my', 0);
      preview.classList.remove('show');
    });
  });
}

function splitLetters() {
  document.querySelectorAll('.mast-first, .mast-last').forEach((el) => {
    const text = el.textContent;
    el.setAttribute('aria-label', text);
    el.innerHTML = [...text].map((c, i) => `<span class="ch" aria-hidden="true" style="--c:${i}">${c}</span>`).join('');
  });
  document.querySelectorAll('.draw').forEach((p) => p.setAttribute('pathLength', '1'));
}

function fillDates() {
  const d = new Date();
  const seasons = ['Winter', 'Winter', 'Spring', 'Spring', 'Spring', 'Summer', 'Summer', 'Summer', 'Autumn', 'Autumn', 'Autumn', 'Winter'];
  document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = `${seasons[d.getMonth()]} ${d.getFullYear()}`));
  document.querySelectorAll('[data-year-only]').forEach((el) => (el.textContent = d.getFullYear()));
}

/* ---------- dev panel ---------- */

let panel;
function buildPanel() {
  panel = document.createElement('aside');
  panel.className = 'devpanel';
  panel.setAttribute('aria-label', 'Design explorations');
  panel.innerHTML = `
    <button class="dev-toggle" type="button" aria-expanded="true" aria-controls="dev-body">Dev</button>
    <div class="dev-body" id="dev-body">
      <div class="dev-head">
        <span class="dev-count"></span>
        <span class="dev-title">Explorations</span>
      </div>
      <div class="dev-row">
        <button type="button" class="dev-btn" data-step="-1" aria-label="Previous style">←</button>
        <label class="sr-only" for="dev-variant">Style</label>
        <select id="dev-variant">${VARIANTS.map((v, i) => `<option value="${v.id}">${i + 1}. ${v.name}</option>`).join('')}</select>
        <button type="button" class="dev-btn" data-step="1" aria-label="Next style">→</button>
      </div>
      <p class="dev-blurb"></p>
      <div class="dev-seg" role="group" aria-label="Project display" data-final-only>
        <span>Display</span>
        <select id="dev-display" aria-label="Project display">${DISPLAYS.map(([k, t]) => `<option value="${k}">${t}</option>`).join('')}</select>
      </div>
      ${Object.entries(THUMB_META).map(([id, m]) => `<div class="dev-seg" role="group" aria-label="${m.label} thumbnail" data-final-only data-thumb-row="${id}">
        <span>${m.label}</span>
        <button type="button" data-thumb="${id}:still">Still</button>
        ${m.variants.map(([k, n]) => `<button type="button" data-thumb="${id}:${k}" title="${esc(n)}">${k.toUpperCase()}</button>`).join('')}
      </div>`).join('')}
      ${Object.entries(THUMB_META).filter(([, m]) => m.bgs).map(([id, m]) => `<div class="dev-seg" role="group" aria-label="${m.label} background" data-final-only data-thumb-bg-row="${id}">
        <span>${m.label} bg</span>
        <select data-thumb-bg="${id}" aria-label="${m.label} background">${m.bgs.map(([k, n]) => `<option value="${k}">${esc(n)}</option>`).join('')}</select>
      </div>`).join('')}
      <div class="dev-seg" role="group" aria-label="Sky colours" data-final-only>
        <span>Skies</span>
        <select data-skies aria-label="Sky colours">${SKIES.map(([k, n]) => `<option value="${k}">${esc(n)}</option>`).join('')}</select>
      </div>
      <div class="dev-bokeh" data-dev-bokeh hidden>
        ${BOKEH_CTL.map(([k, t, mn, mx, st]) => `<div style="display:grid;grid-template-columns:110px 1fr 3.5em;gap:8px;align-items:center"><span style="color:#a8a49a">${t}</span><input type="range" data-bokeh="${k}" min="${mn}" max="${mx}" step="${st}" aria-label="${t}" style="width:100%;min-width:0"><output data-bokeh-out="${k}" style="text-align:right"></output></div>`).join('')}
        <div style="display:flex;gap:8px"><button type="button" class="dev-btn" data-bokeh-reset>Reset bokeh</button><button type="button" class="dev-btn" data-copy-all>Copy my changes</button></div>
      </div>
      <p class="dev-blurb" data-thumb-names></p>
      <div class="dev-seg" role="group" aria-label="Project order" data-old-only>
        <span>Order</span>
        <button type="button" data-order="work">Work first</button>
        <button type="button" data-order="mixed">Mixed index</button>
      </div>
      <div class="dev-seg" role="group" aria-label="Page width">
        <span>Width</span>
        <input type="range" id="dev-width" min="${PAGE_W.min}" max="${PAGE_W.max}" step="20" aria-label="Page width" style="flex:1;min-width:0">
        <output data-width-out></output>
      </div>
      <div class="dev-seg" role="group" aria-label="Motion">
        <span>Motion</span>
        <button type="button" data-motion="on">On</button>
        <button type="button" data-motion="off">Off</button>
        <button type="button" class="dev-replay" data-replay>Replay</button>
      </div>
      <div class="dev-seg" role="group" aria-label="Hero dot hover effect">
        <span>Dots</span>
        <button type="button" data-dots="1" title="Repel">1</button>
        <button type="button" data-dots="2" title="Spotlight">2</button>
        <button type="button" data-dots="3" title="Ripple">3</button>
        <button type="button" data-dots="4" title="Magnet">4</button>
        <button type="button" data-dots="5" title="Symbols">5</button>
      </div>
      <p class="dev-keys"><kbd>[</kbd> <kbd>]</kbd> flip styles · <kbd>O</kbd> order · <kbd>D</kbd> display · <kbd>T</kbd> thumbnails · <kbd>M</kbd> motion · <kbd>.</kbd> collapse · <kbd>~</kbd> hide</p>
    </div>`;
  document.body.appendChild(panel);

  panel.querySelector('#dev-variant').addEventListener('change', (e) => applyVariant(e.target.value));
  panel.querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => step(+b.dataset.step)));
  panel.querySelectorAll('[data-order]').forEach((b) => b.addEventListener('click', () => applyOrder(b.dataset.order)));
  panel.querySelector('#dev-display').addEventListener('change', (e) => applyDisplay(e.target.value));
  panel.querySelectorAll('[data-thumb]').forEach((b) => b.addEventListener('click', () => applyThumb(...b.dataset.thumb.split(':'))));
  panel.querySelector('[data-skies]').addEventListener('change', (e) => applySkies(e.target.value));
  panel.querySelectorAll('[data-bokeh]').forEach((r) => r.addEventListener('input', () => { bokeh[r.dataset.bokeh] = +r.value; panel.querySelector(`[data-bokeh-out="${r.dataset.bokeh}"]`).textContent = r.value; bokehApply(); gradEl?.querySelectorAll('[data-grad]').forEach(gradRow); }));
  panel.querySelector('[data-bokeh-reset]').addEventListener('click', () => { Object.assign(bokeh, BOKEH_DEF); bokehApply(); syncPanel(); });
  panel.querySelector('[data-copy-all]').addEventListener('click', (e) => copyText(settingsText(), e.currentTarget));
  panel.querySelectorAll('[data-thumb-bg]').forEach((s) => s.addEventListener('change', (e) => applyThumbBg(s.dataset.thumbBg, e.target.value)));
  panel.querySelector('#dev-width').addEventListener('input', (e) => applyWidth(e.target.value));
  panel.querySelectorAll('[data-motion]').forEach((b) => b.addEventListener('click', () => applyMotion(b.dataset.motion)));
  panel.querySelectorAll('[data-dots]').forEach((b) => b.addEventListener('click', () => applyDots(b.dataset.dots)));
  panel.querySelector('[data-replay]').addEventListener('click', () => { applyMotion('on'); window.scrollTo({ top: 0 }); replay(); });
  panel.querySelector('.dev-toggle').addEventListener('click', togglePanel);
  if (store.get('devCollapsed') === '1') togglePanel();
}

function togglePanel() {
  const collapsed = panel.classList.toggle('collapsed');
  panel.querySelector('.dev-toggle').setAttribute('aria-expanded', String(!collapsed));
  store.set('devCollapsed', collapsed ? '1' : '0');
}

function step(d) {
  const i = VARIANTS.findIndex((x) => x.id === state.v);
  applyVariant(VARIANTS[(i + d + VARIANTS.length) % VARIANTS.length].id);
}

/* ---------- Explore tab in Design Mode ----------
   The same controls as the dev panel, as a tab inside the Design Mode inspector (dev/load-design-mode.js,
   localhost only). Built from the inspector's own classes so it looks like the rest of its panel. */

let exploreTab = null;
function mountExploreTab(el) {
  const seg = (label, key, opts) => `
    <div class="row" data-row="${key}"><span class="l">${label}</span>
      <div class="seg wide" role="radiogroup" aria-label="${label}">${opts.map(([v, t]) =>
        `<button type="button" role="radio" data-${key}="${v}">${t}</button>`).join('')}</div></div>`;
  el.innerHTML = `
    <div class="sec">
      <div class="row"><span class="l">Style</span>
        <div class="ctl" style="display:flex;gap:4px">
          <button type="button" class="ib sm" data-step="-1" aria-label="Previous style">←</button>
          <select class="input" data-variant aria-label="Style">${VARIANTS.map((v, i) => `<option value="${v.id}">${i + 1}. ${esc(v.name)}</option>`).join('')}</select>
          <button type="button" class="ib sm" data-step="1" aria-label="Next style">→</button>
        </div></div>
      <div class="note" data-blurb></div>
    </div>
    <div class="sec">
      <div class="row" data-row="display"><span class="l">Display</span>
        <select class="input" data-display aria-label="Project display">${DISPLAYS.map(([k, t]) => `<option value="${k}">${esc(t)}</option>`).join('')}</select></div>
      ${Object.entries(THUMB_META).map(([id, m]) => `
        <div class="row" data-row="thumb-${id}"><span class="l">${m.label}</span>
          <div class="seg wide" role="radiogroup" aria-label="${m.label} thumbnail">${[['still', 'Still'], ...m.variants.map(([k, n]) => [k, k.toUpperCase()])].map(([k, t]) =>
            `<button type="button" role="radio" data-thumb="${id}:${k}" ${k === 'still' ? '' : `title="${esc(m.variants.find(([x]) => x === k)[1])}"`}>${t}</button>`).join('')}</div></div>`).join('')}
      ${Object.entries(THUMB_META).filter(([, m]) => m.bgs).map(([id, m]) => `
        <div class="row" data-row="thumbbg-${id}"><span class="l">${m.label} bg</span>
          <select class="input" data-thumb-bg="${id}" aria-label="${m.label} background">${m.bgs.map(([k, n]) => `<option value="${k}">${esc(n)}</option>`).join('')}</select></div>`).join('')}
      <div class="row" data-row="skies"><span class="l">Skies</span>
        <select class="input" data-skies aria-label="Sky colours">${SKIES.map(([k, n]) => `<option value="${k}">${esc(n)}</option>`).join('')}</select></div>
      <div data-bokeh-sec style="display:none">
        ${BOKEH_CTL.map(([k, t, mn, mx, st]) => `<div class="row"><span class="l">${t}</span>
          <div class="ctl" style="display:flex;gap:8px;align-items:center"><input type="range" data-bokeh="${k}" min="${mn}" max="${mx}" step="${st}" aria-label="${t}" style="flex:1;min-width:0"><output data-bokeh-out="${k}" style="min-width:3.5em;text-align:right"></output></div></div>`).join('')}
        <div class="row"><span class="l"></span><div class="ctl" style="display:flex;gap:8px"><button type="button" class="tab" data-bokeh-reset>Reset bokeh</button><button type="button" class="tab" data-copy-all>Copy my changes</button></div></div>
      </div>
      ${seg('Order', 'order', [['work', 'Work first'], ['mixed', 'Mixed']])}
      <div class="row" data-row="width"><span class="l">Width</span>
        <div class="ctl" style="display:flex;gap:8px;align-items:center"><input type="range" data-width min="${PAGE_W.min}" max="${PAGE_W.max}" step="20" aria-label="Page width" style="flex:1;min-width:0"><output data-width-out style="min-width:3.5em;text-align:right"></output></div></div>
      ${seg('Motion', 'motion', [['on', 'On'], ['off', 'Off']])}
      ${seg('Dots', 'dots', [['1', 'Repel'], ['2', 'Glow'], ['3', 'Ripple'], ['4', 'Pull'], ['5', 'Icons']])}
      <div class="row"><span class="l"></span><button type="button" class="tab" data-replay>Replay entrance</button></div>
    </div>
    <div class="sec" data-grad-sec></div>`;
  mountGradients(el.querySelector('[data-grad-sec]'));
  el.querySelector('[data-variant]').addEventListener('change', (e) => applyVariant(e.target.value));
  el.querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => step(+b.dataset.step)));
  el.querySelector('[data-display]').addEventListener('change', (e) => applyDisplay(e.target.value));
  el.querySelectorAll('[data-thumb]').forEach((b) => b.addEventListener('click', () => applyThumb(...b.dataset.thumb.split(':'))));
  el.querySelector('[data-skies]').addEventListener('change', (e) => applySkies(e.target.value));
  el.querySelectorAll('[data-thumb-bg]').forEach((s) => s.addEventListener('change', (e) => applyThumbBg(s.dataset.thumbBg, e.target.value)));
  el.querySelectorAll('[data-order]').forEach((b) => b.addEventListener('click', () => applyOrder(b.dataset.order)));
  el.querySelector('[data-width]').addEventListener('input', (e) => applyWidth(e.target.value));
  el.querySelectorAll('[data-bokeh]').forEach((r) => r.addEventListener('input', () => { bokeh[r.dataset.bokeh] = +r.value; el.querySelector(`[data-bokeh-out="${r.dataset.bokeh}"]`).textContent = r.value; bokehApply(); }));
  el.querySelector('[data-bokeh-reset]').addEventListener('click', () => { Object.assign(bokeh, BOKEH_DEF); bokehApply(); syncExploreTab(); });
  el.querySelector('[data-copy-all]').addEventListener('click', (e) => copyText(settingsText(), e.currentTarget));
  el.querySelectorAll('[data-motion]').forEach((b) => b.addEventListener('click', () => applyMotion(b.dataset.motion)));
  el.querySelectorAll('[data-dots]').forEach((b) => b.addEventListener('click', () => applyDots(b.dataset.dots)));
  el.querySelector('[data-replay]').addEventListener('click', () => { applyMotion('on'); window.scrollTo({ top: 0 }); replay(); });
  exploreTab = el;
  syncExploreTab();
  return () => { exploreTab = null; };
}

function syncExploreTab() {
  const el = exploreTab;
  if (!el) return;
  el.querySelector('[data-variant]').value = state.v;
  el.querySelector('[data-blurb]').textContent = VARIANTS.find((x) => x.id === state.v).blurb;
  el.querySelector('[data-display]').value = state.display;
  el.querySelector('[data-width]').value = state.width;
  el.querySelector('[data-width-out]').textContent = state.width + 'px';
  for (const key of ['order', 'motion', 'dots']) {
    el.querySelectorAll(`[data-${key}]`).forEach((b) => {
      const on = b.dataset[key] === state[key];
      b.classList.toggle('on', on);
      b.setAttribute('aria-checked', String(on));
    });
  }
  // style.display, not `hidden`: the panel's .row { display: grid } would override it
  el.querySelector('[data-row="display"]').style.display = isFinal() ? '' : 'none';
  el.querySelectorAll('[data-thumb]').forEach((b) => {
    const [id, k] = b.dataset.thumb.split(':');
    const on = state.thumb[id] === k;
    b.classList.toggle('on', on); b.setAttribute('aria-checked', String(on));
  });
  for (const id of Object.keys(THUMB_META)) el.querySelector(`[data-row="thumb-${id}"]`).style.display = isFinal() ? '' : 'none';
  el.querySelectorAll('[data-thumb-bg]').forEach((s) => { s.value = state.thumbBg[s.dataset.thumbBg]; el.querySelector(`[data-row="thumbbg-${s.dataset.thumbBg}"]`).style.display = isFinal() ? '' : 'none'; });
  el.querySelector('[data-skies]').value = state.skies; el.querySelector('[data-row="skies"]').style.display = isFinal() ? '' : 'none';
  el.querySelector('[data-bokeh-sec]').style.display = isFinal() && state.skies === 'bokeh-each' ? '' : 'none';
  el.querySelectorAll('[data-bokeh]').forEach((r) => { r.value = bokeh[r.dataset.bokeh]; el.querySelector(`[data-bokeh-out="${r.dataset.bokeh}"]`).textContent = bokeh[r.dataset.bokeh]; });
  el.querySelector('[data-row="order"]').style.display = isFinal() ? 'none' : '';
  refreshGradients();
}

/* ---------- Thumbnail gradients (Site tab > Gradients) ----------
   Per project: angle, three colours (top / middle / bottom) and where the middle one sits.
   Starts from whatever gradient the card has now (the current Skies palette). Edits are applied live as an
   !important override and can be copied as a CSS line. Dev only: kept in localStorage, never shipped. */
const GRAD_PROJECTS = [['midi', 'midi.play'], ['lingoda-app', 'Lingoda app'], ['monetisation', 'Fluid Learn'], ['lingobites', 'Lingobites'], ['seda', 'Seda']];
const cardImg = {};     // id -> file in /GRADIENTS used as that thumbnail's background (dev choice, kept in localStorage)
let gradFiles = null;
const gradImgCSS = (f) => `url("${new URL('GRADIENTS/' + encodeURIComponent(f), location.href).href}") 0 0 / 100% 100% no-repeat`;
async function loadGradFiles() {
  try { const t = await (await fetch('GRADIENTS/')).text(); const m = [...t.matchAll(/href="([^"?#]+\.(?:jpe?g|png|webp|avif))"/gi)].map((x) => decodeURIComponent(x[1])); if (m.length) return m; } catch {}
  try { return await (await fetch('GRADIENTS/manifest.json')).json(); } catch { return []; }
}
const gradAll = {};    // sky -> { id -> { angle, c: [top, mid, bottom], mid } }: edits belong to the sky they were made in
const gradOverFor = (id) => gradAll[effSky(id)] || (gradAll[effSky(id)] = {});
let gradEl = null, gradSkies = null;
const gradStyle = (() => { const e = document.createElement('style'); e.id = 'grad-overrides'; document.head.append(e); return e; })();
const gradCSS = (g) => `linear-gradient(${g.angle}deg, ${g.c[0]} 0%, ${g.c[1]} ${g.mid}%, ${g.c[2]} 100%)`;
function gradApply() {
  // each thumbnail follows the Skies dropdown unless it has an edit saved for the selected sky
  // an edit applies only to a thumbnail whose sky (its own, or the global one) is the sky the edit was made in
  gradStyle.textContent = Object.entries(gradAll).flatMap(([sky, ov]) => Object.entries(ov).filter(([id]) => effSky(id) === sky)
    .filter(([id]) => !isBokeh(id)).map(([id, g]) => `html .card[data-id="${id}"] { --g: ${gradCSS(g)} !important; }`)).join('\n');
  gradStyle.textContent += '\n' + Object.entries(cardImg).map(([id, f]) => `html .card[data-id="${id}"] { --g: ${gradImgCSS(f)} !important; }`).join('\n');
}
gradApply();
function gradDefault(id) {
  // read the card's own gradient with our override switched off
  const off = gradStyle.textContent; gradStyle.textContent = '';
  const card = document.querySelector(`.card[data-id="${id}"]`);
  const scene = id === 'seda' && card?.querySelector('.scene-seda:has(.sd2)');
  const raw = scene ? getComputedStyle(scene).backgroundImage : card ? getComputedStyle(card).getPropertyValue('--g') : '';
  gradStyle.textContent = off;
  const hex = (n) => Math.round(n).toString(16).padStart(2, '0');
  const colors = (raw.match(/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)/gi) || []).map((c) => {
    if (c[0] === '#') return c.length === 4 ? '#' + [...c.slice(1)].map((x) => x + x).join('') : c.slice(0, 7);
    const [r, g, b] = c.match(/[\d.]+/g).map(Number); return '#' + hex(r) + hex(g) + hex(b);
  });
  const mix = (a, b) => '#' + [1, 3, 5].map((i) => hex((parseInt(a.slice(i, i + 2), 16) + parseInt(b.slice(i, i + 2), 16)) / 2)).join('');
  const angle = +(raw.match(/(-?[\d.]+)deg/) || [, 180])[1];
  const midPos = +((raw.match(/\)?\s+([\d.]+)%/g) || []).map((m) => +m.match(/([\d.]+)%/)[1]).find((n) => n > 0 && n < 100) ?? 55);
  const top = colors[0] || '#888888', bot = colors[colors.length - 1] || top;
  const midC = colors.length > 2 ? colors[Math.floor((colors.length - 1) / 2)] : mix(top, bot);
  return { angle, c: [top, midC, bot], mid: colors.length > 2 ? midPos : 50 };
}
function mountGradients(sec) {
    gradEl = sec;
  sec.addEventListener('change', (e) => {
    const row = e.target.closest('[data-grad]'); if (!row || !e.target.matches('[data-sky]')) return;
    applyCardSky(row.dataset.grad, e.target.value); gradRow(row);
  });
  sec.addEventListener('input', (e) => {
    const row = e.target.closest('[data-grad]'); if (!row || e.target.matches('[data-sky]')) return;
    const id = row.dataset.grad;
    if (e.target.dataset.ck !== undefined) { const c = bokeh.cards[id] || (bokeh.cards[id] = [0, 1].map((i) => window.Bokeh.cardDefault(id, i, bokeh))); c[+e.target.dataset.ck] = e.target.value; bokehApply(); return; }
    if (e.target.dataset.bk !== undefined) { const h = bokeh.hues[id] || (bokeh.hues[id] = [...BOKEH_HUES[id]]); h[+e.target.dataset.bk] = e.target.value; bokehApply(); gradRow(row); return; }
    const gradOver = gradOverFor(id); const g = gradOver[id] || (gradOver[id] = gradDefault(id));
    const k = e.target.dataset.k;
    if (k === 'angle') g.angle = +e.target.value; else if (k === 'mid') g.mid = +e.target.value; else g.c[+k] = e.target.value;
    gradApply(); gradRow(row);
  });
  sec.addEventListener('click', (e) => {
    const ca = e.target.closest('[data-copy-all]'); if (ca) { copyText(settingsText(), ca); return; }
    const b = e.target.closest('button'); const row = e.target.closest('[data-grad]'); if (!b || !row) return;
    const id = row.dataset.grad;
    if (b.dataset.img !== undefined) { if (b.dataset.img) cardImg[id] = b.dataset.img; else delete cardImg[id]; gradApply(); gradRow(row); return; }
    if (b.dataset.act === 'reset') { delete cardImg[id]; gradApply(); if (isBokeh(id)) { delete bokeh.hues[id]; delete bokeh.cards[id]; bokehApply(); } else { delete gradOverFor(id)[id]; gradApply(); } gradRow(row); }
    if (b.dataset.act === 'copy') {
      const g = gradOverFor(id)[id] || gradDefault(id);
      const text = cardImg[id] ? `.card[data-id="${id}"] { --g: url("../GRADIENTS/${encodeURIComponent(cardImg[id])}") 0 0 / 100% 100% no-repeat; }` : isBokeh(id) ? `'${id}': ${JSON.stringify(bokeh.hues[id] || BOKEH_HUES[id]).replace(/"/g, "'")},` : `--g: ${gradCSS(g)};`;
      (navigator.clipboard?.writeText(text) || Promise.reject()).catch(() => {
        const t = document.createElement('textarea'); t.value = text; document.body.append(t); t.select(); document.execCommand('copy'); t.remove();
      });
      const old = b.textContent; b.textContent = 'Copied'; setTimeout(() => (b.textContent = old), 1200);
    }
  });
  gradSkies = null; refreshGradients(true);
}
function gradRow(row) {
  const id = row.dataset.grad;
  row.querySelectorAll('[data-img]').forEach((b) => { const on = (b.dataset.img || '') === (cardImg[id] || ''); b.style.borderColor = on ? '#4c8dff' : 'transparent'; b.setAttribute('aria-pressed', String(on)); });
  const bk = isBokeh(id);
  row.querySelector('[data-bk]').style.display = bk ? 'grid' : 'none';
  row.querySelector('[data-ck]').style.display = bk ? 'grid' : 'none';
  if (bk) { const cc = [0, 1].map((i) => (bokeh.cards[id] && bokeh.cards[id][i]) || window.Bokeh.cardDefault(id, i, bokeh)); cc.forEach((c, i) => { const inp = row.querySelector(`[data-ck="${i}"]`); if (inp && document.activeElement !== inp) inp.value = c; }); }
  row.querySelector('[data-ctl]').style.display = bk ? 'none' : 'flex';
  if (bk) {
    const h = bokeh.hues[id] || BOKEH_HUES[id];
    h.forEach((c, i) => { const inp = row.querySelector(`[data-bk="${i}"]`); if (inp && document.activeElement !== inp) inp.value = c; row.querySelector(`[data-bk-hex="${i}"]`).textContent = c; }); row.querySelector('[data-sky]').value = effSky(id);
    row.querySelector('[data-out]').textContent = 'bokeh · 4 hues';
    row.querySelector('[data-bar]').style.background = `linear-gradient(90deg, ${h.join(', ')})`;
    row.querySelector('[data-act="reset"]').disabled = !(bokeh.hues[id] || bokeh.cards[id]);
    row.querySelector('code').textContent = JSON.stringify(h).replace(/"/g, "'");
    return;
  }
  const g = gradOverFor(id)[id] || gradDefault(id), set = (k, v) => { const i = row.querySelector(`[data-k="${k}"]`); if (i && document.activeElement !== i) i.value = v; };
  set('angle', g.angle); set('mid', g.mid); g.c.forEach((c, i) => set(i, c));
  row.querySelector('[data-sky]').value = effSky(id);
  row.querySelector('[data-out]').textContent = g.angle + '° · mid ' + g.mid + '%';
  row.querySelector('[data-bar]').style.background = gradCSS(g);
  row.querySelector('[data-act="reset"]').disabled = !gradOverFor(id)[id];
  row.querySelector('code').textContent = `--g: ${gradCSS(g)};`;
}
function refreshGradients(force) {
  if (!gradEl) return;
  const gk = state.skies + state.v + JSON.stringify(state.cardSky);
  if (!force && gradSkies === gk && gradEl.children.length) return;
  gradApply();
  gradSkies = gk;
  gradEl.innerHTML = `<div class="note">Thumbnail gradients. Changes here are for this session only and disappear on refresh. Use Copy my changes, paste it to Claude, and ask for it to be made permanent. <button type="button" class="tab" data-copy-all style="margin-left:6px">Copy my changes</button></div>` + GRAD_PROJECTS.map(([id, name]) => `
    <div data-grad="${id}" style="display:grid;gap:6px;padding:8px 0;border-top:1px solid rgba(128,128,128,.25)">
      <div style="display:flex;align-items:center;gap:8px"><strong style="flex:1">${esc(name)}</strong><output data-out style="opacity:.6"></output>
        <button type="button" class="tab" data-act="copy">Copy</button><button type="button" class="tab" data-act="reset">Reset</button></div>
      <div style="display:flex;gap:8px;align-items:center"><span style="opacity:.6">Sky</span>
        <select class="input" data-sky aria-label="${esc(name)} sky" style="flex:1">${SKIES.map(([k, n]) => `<option value="${k}">${esc(n)}</option>`).join('')}</select></div>
      <div data-imgs style="display:flex;gap:6px;overflow-x:auto;padding:2px 0 4px"></div>
      <div data-bar style="height:14px;border-radius:4px"></div>
      <div data-bk style="display:none;grid-template-columns:repeat(4,1fr);gap:8px">${['Main', 'Second', 'Light', 'Accent'].map((t, i) => `
        <label style="display:grid;gap:4px;justify-items:stretch;text-align:center;font-size:11px;opacity:.9"><input type="color" data-bk="${i}" aria-label="${esc(name)} ${t} colour" style="width:100%;height:34px;padding:0;border:0;border-radius:6px;cursor:pointer"><span>${t}</span><output data-bk-hex="${i}" style="font:10px ui-monospace,monospace;opacity:.6"></output></label>`).join('')}
      </div>
      <div data-ck style="display:none;grid-template-columns:repeat(2,1fr);gap:8px">${['Card A', 'Card B'].map((t, i) => `
        <label style="display:grid;gap:4px;justify-items:stretch;text-align:center;font-size:11px;opacity:.9"><input type="color" data-ck="${i}" aria-label="${esc(name)} ${t} colour" style="width:100%;height:28px;padding:0;border:0;border-radius:6px;cursor:pointer"><span>${t} (case-study cards)</span></label>`).join('')}
      </div>
      <div data-ctl style="display:flex;gap:6px;align-items:center">
        <input type="color" data-k="0" aria-label="${esc(name)} top colour"><input type="color" data-k="1" aria-label="${esc(name)} middle colour"><input type="color" data-k="2" aria-label="${esc(name)} bottom colour">
        <input type="range" data-k="angle" min="0" max="360" step="5" style="flex:1;min-width:0" aria-label="Angle">
        <input type="range" data-k="mid" min="5" max="95" step="1" style="flex:1;min-width:0" aria-label="Middle colour position">
      </div>
      <code style="font-size:10px;opacity:.55;word-break:break-all;user-select:all"></code>
    </div>`).join('');
  const fillImgs = () => gradEl.querySelectorAll('[data-imgs]').forEach((box) => {
    box.innerHTML = `<button type="button" data-img="" title="No image: use the colours" style="flex:none;width:34px;height:44px;border-radius:5px;border:2px solid transparent;background:rgba(128,128,128,.25);color:inherit;font-size:10px;cursor:pointer">None</button>` +
      (gradFiles || []).map((f) => `<button type="button" data-img="${esc(f)}" title="${esc(f)}" style="flex:none;width:34px;height:44px;border-radius:5px;border:2px solid transparent;cursor:pointer;background:${gradImgCSS(f).replace(/"/g, "'")}"></button>`).join('');
  });
  if (gradFiles) fillImgs(); else loadGradFiles().then((f) => { gradFiles = f; fillImgs(); gradEl?.querySelectorAll('[data-grad]').forEach(gradRow); });
  gradEl.querySelectorAll('[data-grad]').forEach(gradRow);
}

function addExploreTab() {
  window.__designMode?.addAppTab?.({ id: 'explore', label: 'Site', mount: mountExploreTab });
}
window.addEventListener('designmode:ready', addExploreTab);
addExploreTab();

function syncPanel() {
  syncExploreTab();
  // Only settings that differ from the final design go in the address, so the default page stays clean.
  const url = new URL(location.href);
  const defaults = { v: DEFAULT_VARIANT, order: 'work', display: DEFAULT_DISPLAY };
  for (const [k, d] of Object.entries(defaults)) {
    if (state[k] === d) url.searchParams.delete(k); else url.searchParams.set(k, state[k]);
  }
  if (state.width >= PAGE_W.max) url.searchParams.delete('width'); else url.searchParams.set('width', state.width);
  url.searchParams.delete('thumbs');
  if (state.skies === SKIES[0][0]) url.searchParams.delete('skies'); else url.searchParams.set('skies', state.skies);
  for (const [id, m] of Object.entries(THUMB_META)) {
    if (state.thumb[id] === (m.default || 'still')) url.searchParams.delete(m.param); else url.searchParams.set(m.param, state.thumb[id]);
    if (m.bgs) { if (state.thumbBg[id] === m.bgs[0][0]) url.searchParams.delete(m.param + 'bg'); else url.searchParams.set(m.param + 'bg', state.thumbBg[id]); }
  }
  if (url.href !== location.href) try { history.replaceState(null, '', url); } catch { /* sandboxed */ }
  if (!panel) return;
  const i = VARIANTS.findIndex((x) => x.id === state.v);
  panel.querySelector('#dev-variant').value = state.v;
  panel.querySelector('.dev-count').textContent = `${i + 1}/${VARIANTS.length}`;
  panel.querySelector('.dev-blurb').textContent = VARIANTS[i].blurb;
  panel.querySelectorAll('[data-order]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.order === state.order)));
  panel.querySelector('#dev-display').value = state.display;
  panel.querySelectorAll('[data-thumb]').forEach((b) => { const [id, k] = b.dataset.thumb.split(':'); b.setAttribute('aria-pressed', String(state.thumb[id] === k)); });
  panel.querySelector('[data-skies]').value = state.skies;
  { const bs = panel.querySelector('[data-dev-bokeh]'); bs.hidden = !(isFinal() && state.skies === 'bokeh-each');
    bs.querySelectorAll('[data-bokeh]').forEach((r) => { r.value = bokeh[r.dataset.bokeh]; bs.querySelector(`[data-bokeh-out="${r.dataset.bokeh}"]`).textContent = bokeh[r.dataset.bokeh]; }); }
  panel.querySelectorAll('[data-thumb-bg]').forEach((s) => { s.value = state.thumbBg[s.dataset.thumbBg]; });
  panel.querySelector('[data-thumb-names]').textContent = Object.entries(THUMB_META).map(([id, m]) => `${m.label}: ${state.thumb[id] === 'still' ? 'still' : m.variants.find(([k]) => k === state.thumb[id])[1]}`).join(' · ');
  panel.querySelector('#dev-width').value = state.width;
  panel.querySelector('[data-width-out]').textContent = state.width + 'px';
  panel.querySelectorAll('[data-motion]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.motion === state.motion)));
  panel.querySelectorAll('[data-dots]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.dots === state.dots)));
  panel.querySelectorAll('[data-final-only]').forEach((el) => (el.hidden = !isFinal()));
  panel.querySelector('[data-old-only]').hidden = isFinal();
}

document.addEventListener('keydown', (e) => {
  if (e.target.closest('input, select, textarea') || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === '~' || e.key === '`') {
    state.dev = !panel;
    if (!panel) { buildPanel(); syncPanel(); } else { panel.remove(); panel = null; }
    return;
  }
  if (!panel) return;
  if (e.key === ']') step(1);
  else if (e.key === '[') step(-1);
  else if (e.key === 'o' || e.key === 'O') { if (!isFinal()) applyOrder(state.order === 'work' ? 'mixed' : 'work'); }
  else if (e.key === 't') { const order = ['still', 'a', 'b', 'c']; allThumb = order[(order.indexOf(allThumb) + 1) % order.length]; applyThumbAll(allThumb); }
  else if (e.key === 'd') { if (isFinal()) applyDisplay(DISPLAYS[(DISPLAYS.findIndex(([k]) => k === state.display) + 1) % DISPLAYS.length][0]); }
  else if (e.key === 'm' || e.key === 'M') applyMotion(state.motion === 'on' ? 'off' : 'on');
  else if (e.key === '.') togglePanel();
});

/* ---------- photo wall (Alice · Final) ----------
   A mix of photographs and videos. The set is picked with a fixed seed, so the layout is the same on every load, and
   nothing changes while you are on the page. Photos and videos both keep their own shape: wide tiles (16:9) take
   wide photographs and the 16:9 films, std and tall tiles take photographs, the vertical tile takes the vertical clips.
   The photo and video lists live in photos-data.js; the helpers that draw a tile live in video-embed.js. */

const WALL_LAYOUT = [['tall', 'wide', 'std', 'wide'], ['vert', 'std', 'wide'], ['wide', 'std', 'wide', 'std']];
const SLOT_AR = { tall: '4 / 5', std: '4 / 3', wide: '16 / 9', vert: '9 / 16' };
// On the home page Awaazen takes the tile Mabel Aur Mein would get (swapped in the list, so the rest of the wall stays put).
const WALL_SWAP = ['Awaazen - Ali Suhail', 'Mabel Aur Mein Trailer'];
const WALL_ITEMS = typeof PHOTOS === 'undefined' ? [] : PHOTOS.concat(VIDEOS.map((v) => {
  const i = WALL_SWAP.indexOf(v.title);
  return i < 0 ? v : VIDEOS.find((x) => x.title === WALL_SWAP[1 - i]) || v;
}));
const MAX_WIDE_VIDEOS = 2;                                       // clips playing in the wide tiles at once (plus the vertical one)

const shapeOf = (it) => { const r = it.w / it.h; return r < 0.7 ? 'vert' : r < 0.9 ? 'tall' : r > 1.7 ? 'wide' : 'std'; };
// Fixed seed: the wall is laid out identically on every load. Change WALL_SEED to get a different (still fixed) arrangement.
const WALL_SEED = 7;
let seedState = WALL_SEED;
const seededRandom = () => { seedState = (seedState + 0x6D2B79F5) | 0; let t = Math.imul(seedState ^ (seedState >>> 15), 1 | seedState); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const shuffled = (list) => { const a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(seededRandom() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

function buildWall() {
  const wall = document.querySelector('.photo-wall');
  if (!wall || !WALL_ITEMS.length) return;
  const taken = new Set();
  const pick = (cls, video) => {
    const it = shuffled(WALL_ITEMS.filter((x) => shapeOf(x) === cls && !taken.has(x) && (video === undefined || isVideo(x) === video)))[0];
    if (it) taken.add(it);
    return it;
  };
  const wideCount = WALL_LAYOUT.flat().filter((c) => c === 'wide').length;
  const videoWide = new Set(shuffled([...Array(wideCount).keys()]).slice(0, MAX_WIDE_VIDEOS));   // which wide tiles start as films
  let w = 0, n = 0;
  wall.innerHTML = WALL_LAYOUT.map((col) => `<div class="wall-col">${col.map((cls) => {
    const it = cls === 'vert' ? pick('vert', true) : cls === 'wide' ? pick('wide', videoWide.has(w++) ? true : false) : pick(cls, false);
    if (!it) return '';
    n += 1;
    return `<figure data-class="${cls}" data-n="${n}"${isVideo(it) ? ' class="wall-video"' : ''}>${wallFigureInner(it, { aspect: SLOT_AR[cls], n, noCaption: true })}</figure>`;
  }).join('')}</div>`).join('');
  loadVideos(wall);
}

/* ---------- boot ---------- */

splitLetters();
fillDates();
root.dataset.motion = state.motion;
root.dataset.order = state.order;
root.dataset.display = state.display;
applyWidth(state.width);
root.dataset.dots = state.dots;
if (state.dev) buildPanel();
renderProjects(state.order);
buildWall();
applyVariant(state.v);
requestAnimationFrame(() => root.classList.add('loaded'));

/* mobile hamburger for the masthead nav */
(function () {
  var btn = document.querySelector('.mast-menu'), nav = document.getElementById('mast-nav');
  if (!btn || !nav) return;
  function set(open) { btn.setAttribute('aria-expanded', open ? 'true' : 'false'); nav.classList.toggle('is-open', open); }
  btn.addEventListener('click', function (e) { e.stopPropagation(); set(btn.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
  document.addEventListener('click', function (e) { if (!nav.contains(e.target)) set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
})();
