# Portfolio context: original sources and what was built from them

Keep this file up to date. When a new case study, motion page or source file is added, add it here.
The Figma file is `CAYbZCGMVSEhbhGHS3bpbX` ("claude space for portoflio"). Node ids use `-` in URLs and `:` in the Figma tools.

## Original sources (Figma)

| Case study | Slides (the story) | Design file (the screens) |
|---|---|---|
| **Lingoda mobile app** | https://www.figma.com/slides/u6gcSNcsQySnLz8RTnbWlp | https://www.figma.com/design/CAYbZCGMVSEhbhGHS3bpbX/claude-space-for-portoflio?node-id=18-100047 |
| **StudySmarter, Fluid Learn monetisation** | https://www.figma.com/slides/nzyv8UnkiMRxrxB1GQdivY | https://www.figma.com/design/CAYbZCGMVSEhbhGHS3bpbX/claude-space-for-portoflio?node-id=18-13823 |
| **Lingobites** | https://www.figma.com/slides/YYzEw3D7p7HRJDkXhsx4iP | https://www.figma.com/design/CAYbZCGMVSEhbhGHS3bpbX/claude-space-for-portoflio?node-id=11-2356 |

Older StudySmarter slides link still used by `script.js` (`monetisation` entry): https://www.figma.com/slides/u83ullpzoU9lImNq5NKqCc/Fluid-learn-mode-monetization--FULL-?t=da21xlf379yYpVYi-6 . Check with Aymen which one is current.

The design files are huge (each canvas is hundreds of thousands of characters of metadata). Don't fetch a whole canvas. Fetch single frames by node id.

## Pages and their motion copies

All three case studies: the motion page lives at the normal URL (`lingoda-app.html`, `fluid-learn.html`, `lingobites.html`); the old version is `*-original.html`. The Lingoda use-case diagram is static on the motion page (no `data-uc`).

Each case study has an original page and a `-motion` copy. The design panel (Design Mode, local only) has a **Version** tab that switches between them (`cs-variant.js`).

| Original | Motion copy | Shared files |
|---|---|---|
| `lingoda-app-original.html` | `lingoda-app.html` (default URL) | `case-study-motion.css`, `case-study-motion.js` |
| `fluid-learn-original.html` (StudySmarter) | `fluid-learn.html` (default URL) | `case-study-motion.css/.js`, plus `fluid-live.css/.js` |
| `lingobites-original.html` | `lingobites.html` (default URL) | `case-study-motion.css` (hero cards only: pop in, then float) |

Original pages are not changed by the motion work, apart from one `cs-variant.js` script tag for the Version tab.

## StudySmarter motion page: what is live

Screens that are rebuilt in HTML/CSS (so they can animate) and where their pieces came from:

| Piece on the page | Built from | Figma frames |
|---|---|---|
| Treatment 1: 5-beat phone walkthrough (upgrade prompt, trial sheet, locked questions, locked hints, settings) | `fluid-live.js` (markup + timeline), `fluid-live.css` | Section "Start with full FLM- then downgrade to limited" (node `18:76939`). Mobile frames: `18:77401` upgrade prompt, `18:77720` premium, `18:77478` locked question, `18:77509` explanation blocked, `18:77550` hints blocked, `18:77338` settings |
| Treatment 2: 4-beat phone walkthrough (counter, out of sessions, trial sheet, settings) | same | Section "Have limited FLM sessions/day" (node `18:77823`). Mobile frames: `18:78689` session, `18:78820` out of sessions, `18:79044` premium, `18:78624` settings |
| Hero card 3, "Enjoying Fluid Learn Mode?" | HTML card + the animated illustration `fluid-illustration.webp` (also used by the home-page thumbnail, `thumb-motion.js`) | illustration raw image under `18:77466` |
| Concept 2 cards: battery drains, counter rolls, hearts are lost | HTML cards, reusing the battery look from `thumb-motion.css` | static exports: `case-studies/fluid-learn/screens/charges-hearts.webp`, `hearts.webp` |

Assets exported from Figma live in `case-studies/fluid-learn/ui/` (`mascot.webp`, `book.webp`, `trigger-illustration.webp`).
The mascot export had a baked-in grey background; it was converted to real transparency. If the mascot is re-exported, do the same (colour-to-alpha against `#fafafa`).

Not rebuilt yet (still flat images with entrance motion only): hero cards 1, 2 and 4, Concept 1 keys screens, Concept 3 freemium collage.

## Lingoda motion page: what is live

- **Solution 1 (practice set)** and **Solution 3 (weekly goal)**: one phone that plays the whole flow as a loop, no step pills (`lingoda-live.js`, `lingoda-live.css`, hosts are `[data-story="s1"]` / `[data-story="s3"]`). The flat screenshots are the base; pieces cut out of them (same image, positioned in % of the screen) are animated on top: buttons press in (no touch dots), the "Mark as complete" check fills green and the tick draws, the weekly-goal bar grows and 3/8 rolls to 5/8 on `s1-done` (the last screen, from the slides).
  - Solution 3 skips `s3-progress`. The last screen, "Weekly goal met", is rebuilt: white page plus cut-outs for the text and chrome, Frank is the live Rive file `rive/perfect.riv` (artboard `pasted`, state machine `default`: intro, then loop), confetti is generated and drifts, the goal bar fills to 8/8.
  - Buttons: the cut-out includes the button's soft drop shadow, and behind it sits a clean background made by stretching a 1px column of the screenshot from beside the button, so nothing of the original shows when it shrinks. Only the button shape darkens (a shade laid over it), never the background around it.
  - Transitions: push/pop slide like iOS and hide the covered screen once it is out of sight; "Weekly goal met" is presented as a sheet sliding up over the dimmed goal screen. Each loop waits for its screenshots to decode before it fades in. Frank's Rive canvas stays hidden until his intro starts (the screenshot still shows only if Rive fails). Confetti is seeded, spaced apart, kept off the text, Frank and the bottom bar, and sized in `cqw` so it scales with the phone.
  - All screen coordinates were measured from the screenshots (`case-studies/lingoda-app/screens/`); rects are written in screenshot pixels with `R1()` (753 x 1628, Solution 1) and `R3()` (836 x 1808, Solution 3). Debug: `document.querySelector('[data-story="s1"]')._lx.setVisible(false)` freezes a walkthrough, then `._lx.advance(ms)` steps it frame by frame (animations and timers together); `setVisible(true)` resumes.
  - Reduced motion: the static row of screenshots stays.
- Solution 2: staged build (`[data-anno]` in `case-study-motion.js`). The use-case diagram is static.
- Scroll reveals and count-up numbers as on the other motion pages.

## Other source files worth knowing

- `thumb-motion.js`, `thumb-motion.css`: animated home-page thumbnails. The Fluid Learn thumbnail is the reference for the battery and paywall animation.
- `thumbnail-options/figma/`: exports from the Figma slides used for thumbnails.
- `REFERENCE-VARIANTS.md`: brief for the reference-inspired style variants (separate task).
- `dev/`: Design Mode (local-only design panel). `script.js` adds the "Site" tab, `cs-variant.js` adds the "Version" tab.

## Working notes

- Case study pages don't load `script.js`, so they have their own small scripts (`case-study.js`, `case-study-motion.js`).
- Class name collision to avoid: the site's `.hero` has a dot-grid background. Don't reuse `.hero` inside live screens.
- A page scroll-reveal uses the individual `translate` / `scale` CSS properties so it doesn't fight the `rotate()` the collages already use.

## Lingobites page notes

- Hero follows slide 1: text left, four overlapping exercise images on the gradient right (`.cs-hero-split`, `.cs-hero-stage`).
- Videos in `videos/lingobites/` are re-encoded from the originals in `case-studies/lingobites/aymens export/` at full source width (max 1920px, no audio, CRF 19). Posters are webp frames. Re-encode from the originals, not from these.
- `d2-sol3.mp4` = "A mid score" (from `sol 3 3.mp4`). `feedback-breakdown.mp4` is shown on its own under Design problem 2.
- Access screens come from the Figma slide's raw images (1440 and 2880 px wide).
- All case studies use the slide section order as `cs-q` headers: Final design, Research & insights, Design process, Design explorations, Rollout & impact.

## Lingobites live variant (`lingobites-live.html`)

Same page as `lingobites.html`, but the 8 screen recordings are rebuilt as HTML/CSS/JS animations (`lingobites-live.css`, `lingobites-live.js`). Open it at `/lingobites-live.html`.
- One scene per video: `memory-mixer`, `recall-relate`, `grammar`, `try-first`, `full-translations`, `three-tries`, `feedback-tiers`, `feedback-breakdown`. Each is `{ build, run }` in `lingobites-live.js`, drawn on a 1000x900 stage that is scaled to its card. A fake cursor drives them. They start in view, loop, stop out of view; reduced-motion shows the end state.
- Reused assets: `thumb-assets/lingobites/` (icons, avatars) and the Rive files `rive/good-work.riv`, `rive/good-try.riv` for Frank (local runtime in `rive/runtime/`).
- Source of truth for look and timing: the videos in `videos/lingobites/` (and the originals in `case-studies/lingobites/aymens export/`).
