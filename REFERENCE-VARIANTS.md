# Task: add one style variant inspired by each reference site

Context for a new Claude session working on Aymen Rizwan's product design portfolio.
The previous session ran in a cloud container that couldn't reach these seven sites, so this part is still to do.
Run this session locally, where the sites can be opened.

## Goal

Add **7 new variants** to the existing style switcher, one inspired by each site below.
Each variant should capture the reference's layout, typography, colour, spacing and motion.
It should not copy the reference's text, images, logos, illustrations or custom fonts.
All content stays Aymen's: the same markup and project data the other 12 variants use.

| Variant id | Reference |
|---|---|
| `ref-alicezhao` | https://alicezhao.work/ |
| `ref-chiquach` | https://chiquach.framer.website/ |
| `ref-astapable` | https://astapable.com/ |
| `ref-anurag` | https://anuraaaggxdesign.framer.website/ |
| `ref-nelli` | https://nellitomatelli.com/ |
| `ref-folasewa` | https://folasewaogunsola.framer.website/ |
| `ref-azeem` | https://azeemdesigns.info/ |

## What Aymen asked for (from the first session)

- One landing page. The product design work is the main focus.
- Photography, film and music get only a menu item and a short mention in the About section.
- All projects link out to their existing URLs; there are no case study pages on this site.
- Motion should be **playful and tactile**: present and pleasing, never slow.
- Two project orderings are supported: "work first" and "mixed index". Every variant must look good in both.
- Each variant gets its own palette.
- Image style is out of scope for now; a later session will choose project imagery.

## Run it

```bash
python3 -m http.server 8080
```

Open http://localhost:8080. Serve it over HTTP rather than opening the file directly, because the switcher loads CSS files.
The dev panel (bottom right) switches variants with `[` / `]`, project order with `O`, and motion with `M`.
A URL such as `?v=riso&order=mixed` opens a given variant and order.

## How the site is built

No build step and no dependencies.

- `index.html`: all markup, shared by every variant. Projects are not in the HTML; `script.js` renders them.
- `base.css`: reset, default structure, the motion system and the dev panel styles. Decorations are hidden by default.
- `variants/<id>.css`: one file per variant. `script.js` swaps the `<link id="variant-css">` href to change variant.
- `script.js`: holds `PROJECTS` (the content), `MIXED_ORDER`, `VARIANTS` (the switcher list), rendering, motion hooks and the dev panel.

### Adding a variant

1. Create `variants/ref-<name>.css`.
   - Start with a Google Fonts `@import` (the only font host used).
   - Then a short comment naming the reference and stating the layout idea in one line.
   - Then a `:root` block of tokens.
2. Add an entry to `VARIANTS` in `script.js`: `{ id, name, blurb, fonts }`.
   - Use a name like `"Ref · Alice Zhao"` so the reference variants are easy to spot in the dropdown.
   - Keep the blurb to one line on what you took from the site.
3. Restyle using the classes below. Keep `index.html` unchanged where you can.
   - If a reference genuinely needs extra markup, add it as an optional element that's hidden in `base.css` by default, as the stickers and doodles are, so the other 12 variants are unaffected.

### Tokens every variant sets

`--bg`, `--ink`, `--muted`, `--paper`, `--accent`, `--accent-2`, `--line`, `--font-display`, `--font-body`, `--font-meta`.
Optional:
- `--letter-anim`: the masthead letter entrance. Values: `letter-rise`, `letter-drop`, `letter-stamp` or `none`.
- `--reveal-from`: the transform that elements start from when they scroll in.
- `--maxw`: the page width.

### Class map

- **Masthead:** `.masthead`, `.mast-top` (issue/date row, hidden by default), `.mast-name` > `.mast-first` / `.mast-last` > `.ch` (one span per letter, for letter animation), `.mast-nav`
- **Hero:** `.hero`, `.hero-kicker`, `.hero-title` (with `em` on "B2C experiences" and "EdTech"), `.hero-sub`, `.hero-portrait` (hidden by default)
- **Optional decorations** (hidden by default; show them with `display: block`):
  - `.sticker-a`, `.sticker-b`, `.stamp`
  - `.doodle-arrow`, `.doodle-circle`, `.doodle-star`: SVG paths with `.draw`, which draw in on load
  - `.marquee`: a ticker band
  - `.cursor-preview`: an image that follows the cursor over project rows
- **Projects:** `.projects` > `.group[data-group="work"|"made"]` > `.section-head` (`.section-mark`, `.section-title`, `.section-note`) + `.cards` > `.card[data-kind="work"|"own"]`
  - The mixed order renders a single group, `#work`.
- **Card:**
  - `.card-media`, which holds an `img` or a drawn `.cover.cover-seda|sampler|falsa`, plus `.card-plate`
  - `.card-body` > `.card-meta` (`.card-no`, `.card-tag`, `.card-type`), `.card-title` > `.card-link`, `.card-desc`, `.card-stats` (`li` > `b` + `span`), `.card-cta`, `.card-extra`
  - Optional `.card-tape` and `.card-disc`
  - `.card-link::after` stretches over the whole card, so the full card is clickable. `.card-extra` links sit above it.
- **About and contact:**
  - `.about`, `.about-body`, `.about-portrait`, `.about-text` > `.lede`
  - `.offscreen`, `.offscreen-head`, `.offscreen-links`, `.contact-sheet` (a horizontal photo strip)
  - `.contact`, `.contact-big`, `.contact-links`, `.colophon`

### Motion hooks

- `.loaded` is added to `<html>` after load. Entrance animations hang off it.
- Elements below the fold get `.reveal.pre` and become `.reveal.in` when they scroll into view. Change the entrance with `--reveal-from`, or with a clip-path as in `catalogue.css`.
- Cards get `--mx` / `--my` (−0.5 to 0.5) on pointer move, for tilt or spotlight effects. See `soft.css` and `night.css`.
- Use the individual `rotate`, `translate` and `scale` properties for hover effects. `transform` is used by the reveal, so setting it on hover would clash.
- `[data-motion="off"]` turns off all animation. Never rely on motion to make content visible.

## Process for each reference

1. Open the site at 1440×900 and at 390×844 (phone). Take screenshots, including a full-page one, and save them in `refs/` (git-ignored, or delete them before committing).
   Scroll through, hover the project cards, and write down:
   - **Layout:** hero structure, project grid or list, how the about and contact sections are built.
   - **Typography:** families, or the closest Google Fonts match if the site uses a paid or custom font; scale, weight and case.
   - **Colour:** background, ink, accents.
   - **Spacing and radius:** how dense or airy the page feels, and the corner radius on cards.
   - **Motion:** load sequence, scroll reveals, hover states, cursor effects.
2. Write a 3–5 line brief at the top of the variant file covering what you're taking and how it's adapted to Aymen's content.
3. Build the variant. Pick a Google Fonts match rather than copying a licensed font. Pick a palette that suits Aymen's work rather than copying the reference's brand colours exactly.
4. Check each variant in both orders, at desktop and phone width, with motion on and off.

Screenshot helper:

```js
// node shoot-refs.js
const { chromium } = require('playwright');
const sites = {
  alicezhao: 'https://alicezhao.work/', chiquach: 'https://chiquach.framer.website/',
  astapable: 'https://astapable.com/', anurag: 'https://anuraaaggxdesign.framer.website/',
  nelli: 'https://nellitomatelli.com/', folasewa: 'https://folasewaogunsola.framer.website/',
  azeem: 'https://azeemdesigns.info/',
};
(async () => {
  const b = await chromium.launch();
  for (const [vw, vh, tag] of [[1440, 900, 'desktop'], [390, 844, 'phone']]) {
    const p = await b.newPage({ viewport: { width: vw, height: vh } });
    for (const [k, u] of Object.entries(sites)) {
      await p.goto(u, { waitUntil: 'networkidle', timeout: 45000 });
      await p.waitForTimeout(2500); // let Framer intro animations finish
      await p.screenshot({ path: `refs/${k}-${tag}.png` });
      await p.screenshot({ path: `refs/${k}-${tag}-full.png`, fullPage: true });
    }
    await p.close();
  }
  await b.close();
})();
```

Framer sites often reveal sections only on scroll, so full-page shots can come out blank lower down. Scroll in steps before the full-page capture if needed.

## Quality bar (the existing 12 variants follow these)

- The page never scrolls sideways at 390px (`document.documentElement.scrollWidth <= innerWidth`).
- No card sits alone in a row:
  - Own products: `base.css` puts the three in one row at ≥900px.
  - Mixed index: the first card (Seda Speech) becomes a full-width feature.
  - If your variant changes the grid, check both orders.
- Everything is readable at rest. Animations start from a visible state, or reveal only content below the fold.
- Keyboard focus is visible, and every link still works.
- No new dependencies and no build step.

## When done

1. Commit on branch `claude/inspiring-johnson-qtidtk` with a clear message, and push.
2. Report back to Aymen with:
   - a short list of the 7 variants, each with one line on what was borrowed from its reference
   - any reference that couldn't be loaded

## Known open items (don't fix unless asked)

- **Unverified copy:** the Seda Speech and Falsa Club descriptions in `PROJECTS` were written without seeing those sites. Aymen should check them.
- **Sampler link:** the card links to the private GitHub repo `aymenr/sampler`; it needs a public URL.
- **Placeholder covers:** Seda, Sampler and Falsa use drawn covers. Real imagery is planned for a later session.
- **Dev mode:** `DEV_MODE_DEFAULT` in `script.js` must be set to `false` before launch.
