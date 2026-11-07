/* Photographs and videos. Shared by the home page wall (script.js) and photos.html (photos.js).
   Add a photo: put a web-sized .webp in photographs/web and add a line to PHOTOS (w and h are its pixel size).
   Videos always keep their own shape. Vimeo clips play inline from Vimeo with no frame and no controls; the others are short
   silent loops in videos/loops (src), with a still in videos/posters (poster), which shows first.
   zoom: for films with black bars baked in (shot wider than 16:9), how far to enlarge them so the bars fall outside the tile. */
// Aymen's choice (photographs/aymens choice), web-sized copies in photographs/web.
const PHOTOS = [
  { src: 'photographs/web/DSC09368.webp', w: 1200, h: 1500 },
  { src: 'photographs/web/ig-CcJXINyNRMG.webp', w: 1200, h: 1500 },
  { src: 'photographs/web/DSC06434.webp', w: 1200, h: 961 },
  { src: 'photographs/web/berlin-1.webp', w: 1200, h: 629 },
  { src: 'photographs/web/DSC09455.webp', w: 1200, h: 1500 },
  { src: 'photographs/web/ig-CB3qeTNlrN3.webp', w: 1200, h: 801 },
  { src: 'photographs/web/DSC08767.webp', w: 1200, h: 629 },
  { src: 'photographs/web/DSC07299.webp', w: 1200, h: 1501 },
  { src: 'photographs/web/ig-CuDEEI-rTuC.webp', w: 1200, h: 900 },
  { src: 'photographs/web/DSC08995.webp', w: 1200, h: 629 },
  { src: 'photographs/web/DSC09486.webp', w: 1200, h: 1500 },
  { src: 'photographs/web/frame-108.webp', w: 1200, h: 801 },
  { src: 'photographs/web/DSC08671.webp', w: 1000, h: 524 },
  { src: 'photographs/web/DSC07806.webp', w: 800, h: 1000 },
  { src: 'photographs/web/ig-CYhIXSpvHf2.webp', w: 1200, h: 803 },
  { src: 'photographs/web/berlin-4.webp', w: 1200, h: 629 },
  { src: 'photographs/web/DSC09769.webp', w: 1200, h: 1500 },
  { src: 'photographs/web/ig-CB3uAh1Fo-r.webp', w: 1200, h: 1141 },
  { src: 'photographs/web/DSC08947.webp', w: 1200, h: 960 },
  { src: 'photographs/web/DSC07301.webp', w: 1200, h: 1500 },
  { src: 'photographs/web/ig-CcLMiYpNOXZ.webp', w: 1200, h: 676 },
  { src: 'photographs/web/berlin-5.webp', w: 1200, h: 629 },
  { src: 'photographs/web/torfstr-2.webp', w: 1200, h: 1497 },
  { src: 'photographs/web/ig-CrgCHe5sGFN.webp', w: 1200, h: 799 },
  { src: 'photographs/web/DSC09807.webp', w: 1200, h: 1500 },
  { src: 'photographs/web/ig-CBs7KYDldC-.webp', w: 1200, h: 900 },
  { src: 'photographs/web/DSC07921-2.webp', w: 1000, h: 524 },
];

const VIDEOS = [
  { kind: 'vimeo', id: '177808190', hash: 'a8e1081be5', title: 'Mabel Aur Mein Trailer', zoom: 1.18, poster: 'videos/posters/mabel-aur-mein.webp', w: 16, h: 9 },
  { kind: 'vimeo', id: '626236240', hash: 'd9bdc5f27c', title: 'NGP Documentary 2015 Trailer', zoom: 1.18, poster: 'videos/posters/ngp-documentary.webp', w: 16, h: 9 },
  { kind: 'vimeo', id: '339681477', hash: '', title: 'Awaazen - Ali Suhail', zoom: 1.26, poster: 'videos/posters/awaazen.webp', w: 16, h: 9 },
  { kind: 'file', src: 'videos/loops/dopehar.mp4', title: 'dopehar', poster: 'videos/posters/dopehar.webp', w: 16, h: 9 },
  { kind: 'file', src: 'videos/loops/generative-music.mp4', title: 'Instagram video', poster: 'videos/posters/generative-music.webp', w: 9, h: 16 },
  { kind: 'file', src: 'videos/loops/all-i-need.mp4', title: 'Instagram video', poster: 'videos/posters/all-i-need.webp', w: 9, h: 16 },
  { kind: 'file', src: 'videos/loops/stranger-kids.mp4', title: 'Instagram video', poster: 'videos/posters/stranger-kids.webp', w: 9, h: 16 },
];
