/* film.html and music.html — a staggered wall of tiles, like photos.html. Each tile is a still (video poster or
   cover art) with a play button; clicking it swaps the still for the real player, playing, in place.
   Uses FILMS / TRACKS from media-data.js. Music tiles can be SoundCloud, YouTube or a local video file. The page says which list it wants with <body data-gallery="film|music">. */

const galleryEl = document.getElementById('wall');
const galleryKind = document.body.dataset.gallery;
let galleryCols = 0;

const escHTML = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function playerSrc(item) {
  if (item.kind === 'soundcloud') {
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(`https://api.soundcloud.com/tracks/${item.id}`)}&auto_play=true&visual=true&hide_related=true&show_comments=false&show_reposts=false&show_teaser=false`;
  }
  if (item.kind === 'vimeo') return `https://player.vimeo.com/video/${item.id}?autoplay=1&dnt=1&title=0&byline=0&portrait=0`;
  return `https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
}

function galleryItems() {
  if (galleryKind === 'music') {
    return TRACKS.map((t) => ({ ...t, ar: `${t.w} / ${t.h}`, h: t.h / t.w, caption: t.title, sub: t.note }));
  }
  return FILMS.map((f) => ({ ...f, ar: '16 / 9', h: 9 / 16, still: f.poster, caption: f.title, sub: f.note, role: f.role }));
}

function tileHTML(item, i) {
  const label = `Play ${item.caption}`;
  return `<figure class="media-tile">
    <button type="button" class="wall-ph media-still" data-i="${i}" style="aspect-ratio:${item.ar};background-image:url('${item.still}')" aria-label="${escHTML(label)}">
      <span class="play" aria-hidden="true">▶</span>
    </button>
    <figcaption>${item.sc ? `<a class="media-title" href="${escHTML(item.sc)}" target="_blank" rel="noopener">${escHTML(item.caption)}</a>` : `<span class="media-title">${escHTML(item.caption)}</span>`}${item.sub ? ` <span class="media-sub">${galleryKind === 'music' ? '– ' : ''}${escHTML(item.sub)}</span>` : ''}${item.role ? `<span class="media-role">${escHTML(item.role)}</span>` : ''}</figcaption>
  </figure>`;
}

function colCount() {
  const w = window.innerWidth;
  if (galleryKind === 'music') return w >= 1100 ? 3 : w >= 600 ? 2 : 1;
  return w >= 1100 ? 3 : w >= 700 ? 2 : 1;
}

function renderGallery() {
  const cols = colCount();
  if (cols === galleryCols) return;
  galleryCols = cols;
  const items = galleryItems();
  const startOffsets = [0, 56, 24];                           // the same staggered start as the photo walls
  const heights = Array.from({ length: cols }, (_, i) => (cols > 1 ? startOffsets[i] : 0) / 300);
  const buckets = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => {
    const c = heights.indexOf(Math.min(...heights));
    heights[c] += item.h + 0.18;                                // tile height as a share of column width, plus the caption
    buckets[c].push(tileHTML(item, i));
  });
  galleryEl.innerHTML = buckets.map((b) => `<div class="wall-col">${b.join('')}</div>`).join('');
}

// click a still: put the player there instead, already playing
galleryEl.addEventListener('click', (e) => {
  const still = e.target.closest('.media-still');
  if (!still) return;
  const item = galleryItems()[+still.dataset.i];
  const frame = document.createElement('div');
  frame.className = 'wall-ph media-player';
  frame.style.aspectRatio = item.ar;
  frame.innerHTML = item.kind === 'file'
    ? `<video src="${escHTML(item.src)}" poster="${escHTML(item.still)}" controls autoplay playsinline title="${escHTML(item.caption)}"></video>`
    : `<iframe src="${playerSrc(item)}" title="${escHTML(item.caption)}" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
  still.replaceWith(frame);
});

document.querySelectorAll('[data-count]').forEach((el) => {
  el.textContent = galleryKind === 'music' ? `${TRACKS.length} tracks.` : `${FILMS.length} films and music videos.`;
});
renderGallery();

let galleryResize;
// re-laying out would stop anything playing, so only do it while nothing is
window.addEventListener('resize', () => {
  clearTimeout(galleryResize);
  galleryResize = setTimeout(() => { if (!galleryEl.querySelector('.media-player')) renderGallery(); }, 150);
});
