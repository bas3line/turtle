# Contributing

Thanks for wanting to make the page better. Fixes, accessibility and performance work, and ideas for the art are all welcome.

## Setup

You need Node 20 or later.

```sh
git clone https://github.com/bas3line/turtle
cd turtle
npm install
npm run dev        # http://localhost:5180
```

## How it fits together

- `src/App.tsx`: the page, top to bottom, in sections.
- `src/site/`: one file per section (`Hero.tsx`, `Review.tsx`, `Race.tsx`, `Footer.tsx`, ...), plus what they share:
  - `hooks.ts`: `useMedia`, `useReducedMotion`, `useInView`.
  - `shared.tsx`: the wordmark, buttons, section heads and `Band`, the framed column every section sits in.
  - `Seal.tsx`: the dot-turtle mark and the approval stamp.
  - `Dots.tsx`: the pieces the card drawings are made of: dotted outlines, dot-filled blocks, mono labels.
  - `cast.ts` and `Sprites.tsx`: the pixel turtle and hares, and the component that draws and walks them.
  - `HeroArt.tsx`, `Scene.tsx`: the two canvases, the hero print with its loupe and the night scene in the footer.
- `src/index.css`: the palette, as CSS variables and Tailwind tokens, and the few classes Tailwind can't express (`frame`, `well`, `px`).
- `public/art/px/`: the prepared museum images.

## The rules the page follows

- **One palette.** White, ink, and one blue (`--blue`, with `--blue-deep`, `--blue-soft` and `--blue-line` around it). The footer's sea blues live in `Scene.tsx`. Use the tokens (`text-blue`, `bg-blue-soft`, `text-ink-2`), not new hex values.
- **Pictures are pixels, drawings are dots.** Museum images are posterized into the page's blues and drawn with `image-rendering: pixelated`; diagrams are SVG built from `Dots.tsx`. Don't mix in halftones, gradients or photos.
- **Art is public domain, and credited on the page.** New museum images come from an open-access collection under CC0 (The Met's is a good start), with the object, the artist or workshop and the date in a caption, and the object's link in the README.
- **Prepare images before they land in `public/art/`.** Woodblock prints posterize well; paintings and line drawings mostly turn to noise. Keep them small: the pixel images here are 90 to 170 pixels wide and under 10 KB each.
- **Every component does something.** A control changes what's shown, a drawing explains how the product works. Decoration with no job gets cut.
- **Reduced motion is respected.** Anything that moves on its own checks `useReducedMotion()` and holds still: the canvases stop moving, the review isn't pinned, the race jumps to the end.
- **No new runtime dependencies without a reason.** The art is canvas 2D, SVG and CSS. If something needs a library, say why in the pull request.
- **Copy says what things are.** Plain verbs, sentence case, no filler. turtle isn't a real product, so its numbers are placeholders; keep them consistent with each other. Install commands point at the reserved `.example` domain and must stay unrunnable.

## Checks

```sh
npm run check      # typecheck, lint, production build
```

CI runs the same on every pull request. Before you open one, also look at your change in a browser at a phone width (390 px) and a laptop one (1440 px), and with reduced motion on (in Chrome's DevTools, Rendering, "Emulate CSS media feature prefers-reduced-motion").

## Pull requests

Keep each one to one change, and say what it changes, how you checked it, and include a screenshot for anything visual. Commits in the imperative ("Add a sixth hare"), one idea each.
