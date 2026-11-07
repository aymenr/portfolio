/* photos.html — lays every photograph (from photos-data.js) out in uneven columns, shortest column first,
   so the wall stays balanced whatever the mix of portrait and landscape. 4 columns on wide screens, 3 on tablets, 2 on phones. */

const wallEl = document.getElementById('wall');
let wallCols = 0;

function colCount() {
  const w = window.innerWidth;
  return w >= 1100 ? 4 : w >= 700 ? 3 : 2;
}

// the photography page shows photographs only (films live on film.html)
function wallItems() {
  return PHOTOS.map((p, i) => ({ it: p, n: i + 1 }));
}

function renderWall() {
  const cols = colCount();
  if (cols === wallCols) return;
  wallCols = cols;
  const startOffsets = [0, 56, 24, 72];                        // matches the staggered start of the home page wall
  const heights = Array.from({ length: cols }, (_, i) => (cols > 2 ? startOffsets[i] : 0) / 300);
  const buckets = Array.from({ length: cols }, () => []);
  wallItems().forEach(({ it, n }, i) => {
    const c = heights.indexOf(Math.min(...heights));
    heights[c] += it.h / it.w + 0.1;                           // item height as a share of column width, plus the caption
    // photos and videos both keep their own shape here
    buckets[c].push(`<figure${isVideo(it) ? ' class="wall-video"' : ''}>${wallFigureInner(it, { aspect: `${it.w} / ${it.h}`, n, eager: i < 8 })}</figure>`);
  });
  wallEl.innerHTML = buckets.map((b) => `<div class="wall-col">${b.join('')}</div>`).join('');
  loadVideos(wallEl);
}

document.querySelectorAll('[data-count]').forEach((el) => { el.textContent = `${PHOTOS.length} photographs.`; });
document.querySelectorAll('[data-year-only]').forEach((el) => { el.textContent = new Date().getFullYear(); });
renderWall();

let resizeTimer;
window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(renderWall, 150); });
