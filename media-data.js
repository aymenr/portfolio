/* Films and music for film.html and music.html.
   FILMS come from the video portfolio on Notion; TRACKS mix soundcloud.com/paratha-roll, YouTube and videos/music (cover art in music/covers and videos/music).
   Add a film: kind is 'vimeo' or 'youtube', id is the video id, role is what Aymen did on it.
   Add a track: see the note above TRACKS. */

const vimeoThumb = (hash) => `https://i.vimeocdn.com/video/${hash}-d_960`;
const ytThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

const FILMS = [
  { kind: 'youtube', id: 'lGEZff9Nvw0', title: 'dopehar', note: 'paratharoll · Music video', role: 'Direction, videography, editing', poster: 'videos/posters/dopehar.webp' },
  { kind: 'vimeo', id: '177808190', title: 'Mabel Aur Mein', note: 'Trailer', role: 'Direction, videography, post production', poster: vimeoThumb('585303128-02c3c3e7a9ea5421b4b1e531a04035fee73188b79aa48e5913fc8bdccb73cda6') },
  { kind: 'vimeo', id: '339681477', title: 'Awaazen', note: 'Ali Suhail', role: 'Direction, videography, post production', poster: vimeoThumb('787778896-bdc0c8254d6433057d709e9371737dedca358bd096d99a32979c257774d6bb34') },
  { kind: 'youtube', id: '7SHVEV0NUcU', title: 'Trace', note: 'Natasha Noorani feat. Shorbanoor', role: 'Videography', poster: ytThumb('7SHVEV0NUcU') },
  { kind: 'vimeo', id: '135053064', title: 'Khat-e-Falak', note: 'Trailer', role: 'Videography, post production', poster: vimeoThumb('528824519-82e7db484f0a8226c525e32be63a94d502dd34516215288f5b086b30cb854f6e') },
  { kind: 'vimeo', id: '626236240', title: 'NGP Documentary 2015', note: 'Trailer', role: 'Direction, videography, post production', poster: 'videos/posters/ngp-documentary.webp' },
  { kind: 'vimeo', id: '339681928', title: 'Cereal Killer', note: 'Poor Rich Boy', role: 'Direction, videography, post production', poster: vimeoThumb('787779407-5ac1ef9d6ce8c928c6b6334d39d1664aeae62edc485024c9d3e677514bf14103') },
  { kind: 'vimeo', id: '339683331', title: 'Fanoos', note: 'Trailer', role: 'Post production', poster: vimeoThumb('787781169-0f64a0b6cb7e8fece4d0d58aeba33e7542e881479c26368b22697150c1b6bf1e') },
  { kind: 'vimeo', id: '107996110', title: 'Home.', note: 'Short film', role: 'Direction, videography, post production', poster: vimeoThumb('491574041-dc1190461495498c5290fa562fdb2f61dd1166546edbde3ea3951682708dfd01') },
];

// Music: SoundCloud tracks, a YouTube video and full-length videos with sound in videos/music.
// kind is 'soundcloud' (id = track id), 'youtube' (id = video id) or 'file' (src = an .mp4 in videos/music).
// w and h give the tile its shape. sc (only for songs on SoundCloud) makes the title a link to the track.
const SC = 'https://soundcloud.com/paratha-roll';
const TRACKS = [
  { kind: 'youtube', id: 'lGEZff9Nvw0', title: 'dopehar', note: 'Music video', still: 'videos/posters/dopehar.webp', w: 16, h: 9, sc: `${SC}/dopehar-1` },
  { kind: 'file', src: 'videos/music/stranger-kids.mp4', title: 'Kids (Stranger Things)', note: 'Kyle Dixon & Michael Stein cover', still: 'videos/music/stranger-kids.webp', w: 4, h: 5 },
  { kind: 'file', src: 'videos/music/all-i-need.mp4', title: 'All I Need', note: 'Radiohead cover', still: 'videos/music/all-i-need.webp', w: 720, h: 840 },
  { kind: 'file', src: 'videos/music/generative-music.mp4', title: 'Generative ambient', note: 'Ableton experiment with visuals', still: 'videos/music/generative-music.webp', w: 4, h: 5 },
  { kind: 'file', src: 'videos/music/hand-covers-bruise.mp4', title: 'Hand Covers Bruise (The Social Network)', note: 'Trent Reznor & Atticus Ross cover', still: 'videos/music/hand-covers-bruise.webp', w: 538, h: 640 },
  { kind: 'file', src: 'videos/music/please-be-naked.mp4', title: 'Please Be Naked', note: 'The 1975 cover', still: 'videos/music/please-be-naked.webp', w: 4, h: 5 },
  { kind: 'file', src: 'videos/music/baarishspecial.mp4', title: 'baarishspecial.mp3', still: 'videos/music/baarishspecial.webp', w: 1, h: 1, sc: `${SC}/baarishspecialmp3` },
  { kind: 'file', src: 'videos/music/a-real-hero.mp4', title: 'A Real Hero (Drive)', note: 'College & Electric Youth cover', still: 'videos/music/a-real-hero.webp', w: 720, h: 500 },
  { kind: 'file', src: 'videos/music/summertimeny.mp4', title: 'summertimeny', still: 'videos/music/summertimeny.webp', w: 568, h: 438, sc: `${SC}/summertimeny` },
  { kind: 'soundcloud', id: '977145778', title: 'waqt', still: 'music/covers/waqt.jpg', w: 1, h: 1, sc: `${SC}/waqt` },
  { kind: 'soundcloud', id: '968194003', title: '2 am', still: 'music/covers/2-am.jpg', w: 1, h: 1, sc: `${SC}/2-am` },
];
