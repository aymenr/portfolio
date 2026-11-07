/* Wall media (home page wall + photos.html): one photo or one video, in a tile of a given shape.
   Vimeo clips play from Vimeo as a silent loop with no frame and no controls; the rest are short local loops (<video>, muted).
   Videos only start loading when they scroll near the screen, and not at all when motion is off or the visitor prefers
   reduced motion (the still poster shows instead). */

const isVideo = (it) => Boolean(it.kind);

function vimeoSrc(v) {
  return `https://player.vimeo.com/video/${v.id}?${v.hash ? `h=${v.hash}&` : ''}background=1&autoplay=1&loop=1&muted=1&autopause=0&dnt=1`;
}

function wallMedia(it, aspect, eager) {
  if (!isVideo(it)) {
    return `<div class="wall-ph" style="aspect-ratio:${aspect}"><img src="${it.src}" alt="Photograph by Aymen" width="${it.w}" height="${it.h}" loading="${eager ? 'eager' : 'lazy'}" decoding="async"></div>`;
  }
  const look = `aspect-ratio:${aspect};background-image:url('${it.poster}')${it.zoom ? `;--zoom:${it.zoom}` : ''}`;
  if (it.kind === 'vimeo') {
    return `<div class="wall-ph wall-embed" data-kind="vimeo" data-src="${vimeoSrc(it)}" style="${look}"><iframe title="${it.title}" tabindex="-1" allow="autoplay; encrypted-media" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
  }
  return `<div class="wall-ph wall-embed" data-kind="file" data-src="${it.src}" style="${look}"><video muted loop playsinline preload="none" tabindex="-1" aria-label="${it.title}"></video></div>`;
}

// photographs have no caption; videos keep their title
const wallFigureInner = (it, o) => `${wallMedia(it, o.aspect, o.eager)}${isVideo(it) && !o.noCaption ? `<figcaption>Video · ${it.title}</figcaption>` : ''}`;

function loadVideos(scope) {
  const off = document.documentElement.dataset.motion === 'off' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (off || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      if (el.dataset.kind === 'vimeo') {
        const frame = el.querySelector('iframe');
        if (frame && !frame.getAttribute('src')) frame.setAttribute('src', el.dataset.src);
      } else {
        const vid = el.querySelector('video');
        if (vid && !vid.getAttribute('src')) { vid.setAttribute('src', el.dataset.src); vid.play().catch(() => {}); }
      }
      io.unobserve(el);
    });
  }, { rootMargin: '300px' });
  (scope || document).querySelectorAll('.wall-embed').forEach((el) => io.observe(el));
}
