/* Video tiles for the photo wall (home page + photos.html).
   Vimeo and YouTube play as a silent loop with no frame and no controls. They only start loading when they scroll near the screen,
   and not at all when motion is off or the visitor prefers reduced motion (the poster still shows). */

function videoSrc(v) {
  if (v.kind === 'vimeo') {
    return `https://player.vimeo.com/video/${v.id}?${v.hash ? `h=${v.hash}&` : ''}background=1&autoplay=1&loop=1&muted=1&autopause=0&dnt=1`;
  }
  if (v.kind === 'youtube') {
    return `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${v.id}&modestbranding=1&rel=0&playsinline=1&disablekb=1&iv_load_policy=3&fs=0`;
  }
  return '';
}

function videoFigure(v, caption) {
  const look = `aspect-ratio:${v.w} / ${v.h * (v.crop || 1)};background-image:url('${v.poster}')`;
  if (v.kind === 'link') {
    return `<figure class="wall-video"><a class="wall-ph wall-poster" href="${v.href}" target="_blank" rel="noopener" style="${look}" aria-label="${v.title} (opens Instagram)"><span class="play" aria-hidden="true">▶</span></a><figcaption>${caption}</figcaption></figure>`;
  }
  return `<figure class="wall-video"><div class="wall-ph wall-embed" data-kind="${v.kind}" data-src="${videoSrc(v)}" style="${look}"><iframe title="${v.title}" tabindex="-1" allow="autoplay; encrypted-media" referrerpolicy="strict-origin-when-cross-origin"></iframe></div><figcaption>${caption}</figcaption></figure>`;
}

function loadVideos(scope) {
  const off = document.documentElement.dataset.motion === 'off' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (off || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const frame = e.target.querySelector('iframe');
      if (frame && !frame.getAttribute('src')) frame.setAttribute('src', e.target.dataset.src);
      io.unobserve(e.target);
    });
  }, { rootMargin: '300px' });
  (scope || document).querySelectorAll('.wall-embed').forEach((el) => io.observe(el));
}
