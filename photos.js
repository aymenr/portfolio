/* photos.html — lays every photograph (from photos-data.js) out in uneven columns, shortest column first,
   so the wall stays balanced whatever the mix of portrait and landscape. 4 columns on wide screens, 3 on tablets, 2 on phones. */

const wallEl = document.getElementById('wall');
let wallCols = 0;

function colCount() {
  const w = window.innerWidth;
  return w >= 1100 ? 4 : w >= 700 ? 3 : 2;
}

function renderWall() {
  const cols = colCount();
  if (cols === wallCols) return;
  wallCols = cols;
  const startOffsets = [0, 56, 24, 72];                        // matches the staggered start of the home page wall
  const heights = Array.from({ length: cols }, (_, i) => (cols > 2 ? startOffsets[i] : 0) / 300);
  const buckets = Array.from({ length: cols }, () => []);
  PHOTOS.forEach((p, i) => {
    const c = heights.indexOf(Math.min(...heights));
    heights[c] += p.h / p.w + 0.1;                              // image height as a share of column width, plus the caption
    buckets[c].push(
      `<figure><div class="wall-ph" style="aspect-ratio:${p.w} / ${p.h}"><img src="${p.src}" alt="Photograph by Aymen" width="${p.w}" height="${p.h}" loading="${i < 8 ? 'eager' : 'lazy'}" decoding="async"></div><figcaption>Photograph ${String(i + 1).padStart(2, '0')}</figcaption></figure>`
    );
  });
  wallEl.innerHTML = buckets.map((b) => `<div class="wall-col">${b.join('')}</div>`).join('');
}

document.querySelectorAll('[data-count]').forEach((el) => { el.textContent = `${PHOTOS.length} photographs.`; });
document.querySelectorAll('[data-year-only]').forEach((el) => { el.textContent = new Date().getFullYear(); });
renderWall();

let resizeTimer;
window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(renderWall, 150); });
