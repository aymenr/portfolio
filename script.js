/* ==========================================================================
   Aymen Rizwan — portfolio
   - PROJECTS: the single source of truth for project cards
   - VARIANTS: the style explorations (one CSS file each in /variants)
   - Dev mode: a floating panel to flip variants, project order and motion.
     Turn it off for launch by setting DEV_MODE_DEFAULT = false
     (it can still be opened with ?dev in the URL or Shift+D).
   ========================================================================== */

const DEV_MODE_DEFAULT = true;
const DEFAULT_VARIANT = 'alice';

const SLIDES = {
  lingodaApp: 'https://www.figma.com/slides/ebqTfmzGyx9FKhsbFZOwj2/Lingoda-mobile-app--Khan-Academy-?t=da21xlf379yYpVYi-6',
  monetisation: 'https://www.figma.com/slides/u83ullpzoU9lImNq5NKqCc/Fluid-learn-mode-monetization--FULL-?t=da21xlf379yYpVYi-6',
  visual: 'https://www.figma.com/slides/1YRjfgCPjN1GR5ilHCCFuh/Visual-showcase?t=da21xlf379yYpVYi-6',
  lingobites: 'https://www.figma.com/slides/FL6CwLDExS7jJvEU7CxnGL/Lingobites--Full-Archived-?t=da21xlf379yYpVYi-6',
  seda: 'https://www.figma.com/slides/Fb4UyXGj9vCEgv9uC4YToJ/Seda-speech?t=da21xlf379yYpVYi-6',
};

const PROJECTS = [
  {
    id: 'lingoda-app', kind: 'work', org: 'Lingoda', type: 'Case study',
    title: '0 → 1 launch of a mobile app',
    desc: "I designed and launched Lingoda's mobile app from scratch in six months. When I handed it over it had 1000+ installs and a 4.3 rating.",
    stats: [['1000+', 'installs'], ['4.3★', 'store rating'], ['6 mo', 'to launch']],
    img: 'mobile-app.webp', href: SLIDES.lingodaApp, cta: 'View the case study',
  },
  {
    id: 'monetisation', kind: 'work', org: 'StudySmarter', type: 'Case study',
    title: 'Monetisation experiments',
    desc: 'A run of monetisation experiments on Fluid Learn mode that grew premium revenue by a third.',
    stats: [['+33%', 'premium revenue']],
    img: 'monetisation-experiments.webp', href: SLIDES.monetisation, cta: 'View the case study',
  },
  {
    id: 'lingobites', kind: 'work', org: 'Lingoda', type: 'Case study',
    title: 'Designing learning experiences',
    desc: "Lingobites became Lingoda's flagship practice activity, with 16.2% better 7-day retention than any activity before it.",
    stats: [['+16.2%', '7-day retention']],
    img: 'lingobites.webp', href: SLIDES.lingobites, cta: 'View the case study',
  },
  {
    id: 'visual', kind: 'work', org: 'Various', type: 'Showcase',
    title: 'Visual showcase',
    desc: 'A glimpse into projects across different platforms and problem spaces.',
    stats: [],
    img: 'visual-showcase.webp', href: SLIDES.visual, cta: 'Browse the showcase',
  },
  {
    id: 'seda', kind: 'own', org: 'Seda Speech', type: 'Building now',
    title: 'Seda Speech',
    desc: "A speech practice product I'm designing and engineering on my own, from first research to shipped code.",
    stats: [['Solo', 'design + code']],
    cover: 'seda', href: 'https://sedaspeech.com/', cta: 'Visit sedaspeech.com',
    extra: [['Slides', SLIDES.seda]],
  },
  {
    id: 'sampler', kind: 'own', org: 'Side project', type: 'Music toy',
    title: 'Sampler',
    desc: "A toy sampler in the browser. There's a new sample pack every day, and you get 15 minutes to make a 4-bar beat and post it.",
    stats: [['15', 'minutes'], ['4', 'bars'], ['1', 'pack a day']],
    cover: 'sampler', href: 'https://github.com/aymenr/sampler', cta: 'See the project',
  },
  {
    id: 'falsa', kind: 'own', org: 'Falsa Club', type: 'Music tools',
    title: 'Falsa Club',
    desc: 'A home for the browser music tools I design and build, including MIDI Play and a MIDI app.',
    stats: [],
    cover: 'falsa', href: 'https://falsaclub.com/', cta: 'Visit falsaclub.com',
    extra: [['MIDI Play', 'https://midiplay.falsaclub.com/'], ['MIDI app', 'https://midi.falsaclub.com/app/']],
  },
];

// The chosen design (Alice · Final) shows five projects, in this order of importance.
// 'midi' lives here, not in PROJECTS, so the exploration variants stay as they were.
const FINAL_ORDER = ['midi', 'lingoda-app', 'monetisation', 'lingobites', 'seda'];
const FINAL_EXTRA = {
  midi: {
    id: 'midi', kind: 'own', org: 'Falsa Club', type: 'Music tools', title: 'MIDI',
    desc: 'A MIDI app that runs in the browser, from Falsa Club, my home for the music tools I design and build.',
    stats: [],
    img: 'midi-play.webp', href: 'https://midi.falsaclub.com/', cta: 'Open the MIDI app',
    extra: [['Falsa Club', 'https://falsaclub.com/'], ['MIDI Play', 'https://midiplay.falsaclub.com/']],
  },
};

// Order for the "mixed" index: own products woven between case studies
const MIXED_ORDER = ['seda', 'lingoda-app', 'sampler', 'monetisation', 'lingobites', 'falsa', 'visual'];

const VARIANTS = [
  { id: 'alice', name: 'Alice · Final', blurb: 'Alice Zhao style. Projects as masonry, or bento via the Display control.', fonts: 'Hanken Grotesk' },
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
const roman = (n) => ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][n - 1] || n;

function cardHTML(p, i) {
  const no = String(i + 1).padStart(2, '0');
  const media = p.img
    ? `<img src="${p.img}" alt="" loading="lazy" width="2500" height="1594">`
    : `<div class="cover cover-${p.cover}">${coverSVG(p.cover)}<span class="cover-word">${esc(p.title)}</span></div>`;
  const stats = p.stats.length
    ? `<ul class="card-stats">${p.stats.map(([v, l]) => `<li><b>${esc(v)}</b> <span>${esc(l)}</span></li>`).join('')}</ul>`
    : '';
  const extra = p.extra
    ? `<ul class="card-extra">${p.extra.map(([l, h]) => `<li><a href="${h}" target="_blank" rel="noopener">${esc(l)} ↗</a></li>`).join('')}</ul>`
    : '';
  return `
    <article class="card reveal" data-kind="${p.kind}" data-id="${p.id}" data-i="${i}" data-preview="${p.img || ''}" style="--i:${i}">
      <figure class="card-media">${media}<span class="card-plate">Plate ${roman(i + 1)}</span></figure>
      <div class="card-body">
        <div class="card-meta">
          <span class="card-no">${no}</span>
          <span class="card-tag">${esc(p.org)}</span>
          <span class="card-type">${esc(p.type)}</span>
        </div>
        <h3 class="card-title"><a class="card-link" href="${p.href}" target="_blank" rel="noopener">${esc(p.title)}</a></h3>
        <p class="card-desc">${esc(p.desc)}</p>
        ${stats}
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

// Alice · Final: one list in priority order. Masonry = three columns filled left to right; bento = flat grid.
function finalHTML(display) {
  const byId = { ...Object.fromEntries(PROJECTS.map((p) => [p.id, p])), ...FINAL_EXTRA };
  byId.seda = { ...byId.seda, img: 'seda-speech.webp' }; // real thumbnail instead of the drawn cover
  const cards = FINAL_ORDER.map((id, i) => cardHTML(byId[id], i));
  const body = display === 'masonry'
    ? [0, 1, 2].map((c) => `<div class="col">${cards.filter((_, i) => i % 3 === c).join('')}</div>`).join('')
    : cards.join('');
  return `
    <section class="group" id="work" data-group="work">
      <header class="section-head">
        <span class="section-mark">Work</span>
        <h2 class="section-title">Selected work</h2>
        <p class="section-note">Case studies and my own products, in one list.</p>
      </header>
      <div class="cards">${body}</div>
    </section>`;
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
  observeReveals();
}

/* ---------- state ---------- */

const store = {
  get(k) { try { return localStorage.getItem('pf:' + k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem('pf:' + k, v); } catch { /* storage unavailable */ } },
};
const params = new URLSearchParams(location.search);
const state = {
  v: params.get('v') || store.get('v') || DEFAULT_VARIANT,
  order: params.get('order') || store.get('order') || 'work',
  display: params.get('display') || store.get('display') || 'masonry',
  motion: store.get('motion') || 'on',
  dev: params.has('dev') || store.get('dev') === '1' || DEV_MODE_DEFAULT,
};
if (!VARIANTS.some((x) => x.id === state.v)) state.v = DEFAULT_VARIANT;
if (state.display !== 'bento') state.display = 'masonry';
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && !store.get('motion')) state.motion = 'off';

const root = document.documentElement;
const isFinal = () => state.v === 'alice';

function applyVariant(id) {
  const v = VARIANTS.find((x) => x.id === id) || VARIANTS[0];
  const wasFinal = isFinal();
  state.v = v.id;
  if (wasFinal !== isFinal()) renderProjects(state.order);
  store.set('v', v.id);
  const link = document.getElementById('variant-css');
  const href = `variants/${v.id}.css`;
  if (!link.getAttribute('href').endsWith(href)) {
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
  state.display = d === 'bento' ? 'bento' : 'masonry';
  store.set('display', state.display);
  root.dataset.display = state.display;
  if (isFinal()) renderProjects(state.order);
  syncPanel();
}

function applyMotion(m) {
  state.motion = m === 'off' ? 'off' : 'on';
  store.set('motion', state.motion);
  root.dataset.motion = state.motion;
  if (state.motion === 'off') document.querySelectorAll('.reveal.pre').forEach((el) => el.classList.remove('pre'));
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
        <button type="button" data-display="masonry">Masonry</button>
        <button type="button" data-display="bento">Bento</button>
      </div>
      <div class="dev-seg" role="group" aria-label="Project order" data-old-only>
        <span>Order</span>
        <button type="button" data-order="work">Work first</button>
        <button type="button" data-order="mixed">Mixed index</button>
      </div>
      <div class="dev-seg" role="group" aria-label="Motion">
        <span>Motion</span>
        <button type="button" data-motion="on">On</button>
        <button type="button" data-motion="off">Off</button>
        <button type="button" class="dev-replay" data-replay>Replay</button>
      </div>
      <p class="dev-keys"><kbd>[</kbd> <kbd>]</kbd> flip styles · <kbd>O</kbd> order · <kbd>D</kbd> display · <kbd>M</kbd> motion · <kbd>.</kbd> hide panel</p>
    </div>`;
  document.body.appendChild(panel);

  panel.querySelector('#dev-variant').addEventListener('change', (e) => applyVariant(e.target.value));
  panel.querySelectorAll('[data-step]').forEach((b) => b.addEventListener('click', () => step(+b.dataset.step)));
  panel.querySelectorAll('[data-order]').forEach((b) => b.addEventListener('click', () => applyOrder(b.dataset.order)));
  panel.querySelectorAll('[data-display]').forEach((b) => b.addEventListener('click', () => applyDisplay(b.dataset.display)));
  panel.querySelectorAll('[data-motion]').forEach((b) => b.addEventListener('click', () => applyMotion(b.dataset.motion)));
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

function syncPanel() {
  const url = new URL(location.href);
  url.searchParams.set('v', state.v);
  url.searchParams.set('order', state.order);
  url.searchParams.set('display', state.display);
  try { history.replaceState(null, '', url); } catch { /* sandboxed */ }
  if (!panel) return;
  const i = VARIANTS.findIndex((x) => x.id === state.v);
  panel.querySelector('#dev-variant').value = state.v;
  panel.querySelector('.dev-count').textContent = `${i + 1}/${VARIANTS.length}`;
  panel.querySelector('.dev-blurb').textContent = VARIANTS[i].blurb;
  panel.querySelectorAll('[data-order]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.order === state.order)));
  panel.querySelectorAll('[data-display]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.display === state.display)));
  panel.querySelectorAll('[data-motion]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.motion === state.motion)));
  panel.querySelector('[data-final-only]').hidden = !isFinal();
  panel.querySelector('[data-old-only]').hidden = isFinal();
}

document.addEventListener('keydown', (e) => {
  if (e.target.closest('input, select, textarea') || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === 'D' && e.shiftKey) {
    state.dev = !panel;
    store.set('dev', state.dev ? '1' : '0');
    if (!panel) { buildPanel(); syncPanel(); } else { panel.remove(); panel = null; }
    return;
  }
  if (!panel) return;
  if (e.key === ']') step(1);
  else if (e.key === '[') step(-1);
  else if (e.key === 'o' || e.key === 'O') { if (!isFinal()) applyOrder(state.order === 'work' ? 'mixed' : 'work'); }
  else if (e.key === 'd') { if (isFinal()) applyDisplay(state.display === 'masonry' ? 'bento' : 'masonry'); }
  else if (e.key === 'm' || e.key === 'M') applyMotion(state.motion === 'on' ? 'off' : 'on');
  else if (e.key === '.') togglePanel();
});

/* ---------- boot ---------- */

splitLetters();
fillDates();
root.dataset.motion = state.motion;
root.dataset.order = state.order;
root.dataset.display = state.display;
if (state.dev) buildPanel();
renderProjects(state.order);
applyVariant(state.v);
requestAnimationFrame(() => root.classList.add('loaded'));
