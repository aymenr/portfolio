/* photos.html — lays every photograph (from photos-data.js) out in uneven columns, shortest column first,
   so the wall stays balanced whatever the mix of portrait and landscape. 4 columns on wide screens, 3 on tablets, 2 on phones. */

const wallEl = document.getElementById('wall');
let wallCols = 0;

function colCount() {
  const w = window.innerWidth;
  return w >= 1100 ? 4 : w >= 700 ? 3 : 2;
}

// photos and videos in one list: a video after every fifth photograph
function wallItems() {
  const items = [];
  let v = 0;
  PHOTOS.forEach((p, i) => {
    items.push({ photo: p, n: i + 1 });
    if ((i + 1) % 5 === 0 && v < VIDEOS.length) items.push({ video: VIDEOS[v++] });
  });
  while (v < VIDEOS.length) items.push({ video: VIDEOS[v++] });
  return items;
}

function renderWall() {
  const cols = colCount();
  if (cols === wallCols) return;
  wallCols = cols;
  const startOffsets = [0, 56, 24, 72];                        // matches the staggered start of the home page wall
  const heights = Array.from({ length: cols }, (_, i) => (cols > 2 ? startOffsets[i] : 0) / 300);
  const buckets = Array.from({ length: cols }, () => []);
  wallItems().forEach((it, i) => {
    const size = it.photo || it.video;
    const c = heights.indexOf(Math.min(...heights));
    heights[c] += (size.h * (size.crop || 1)) / size.w + 0.1;                        // item height as a share of column width, plus the caption
    if (it.photo) {
      const p = it.photo;
      buckets[c].push(
        `<figure><div class="wall-ph" style="aspect-ratio:${p.w} / ${p.h}"><img src="${p.src}" alt="Photograph by Aymen" width="${p.w}" height="${p.h}" loading="${i < 8 ? 'eager' : 'lazy'}" decoding="async"></div><figcaption>Photograph ${String(it.n).padStart(2, '0')}</figcaption></figure>`
      );
    } else {
      const v = it.video;
      buckets[c].push(videoFigure(v, v.kind === 'link' ? `${v.title} ↗` : `Film · ${v.title}`));
    }
  });
  wallEl.innerHTML = buckets.map((b) => `<div class="wall-col">${b.join('')}</div>`).join('');
  loadVideos(wallEl);
}

document.querySelectorAll('[data-count]').forEach((el) => { el.textContent = `${PHOTOS.length} photographs and ${VIDEOS.length} videos.`; });
document.querySelectorAll('[data-year-only]').forEach((el) => { el.textContent = new Date().getFullYear(); });
renderWall();

let resizeTimer;
window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(renderWall, 150); });
