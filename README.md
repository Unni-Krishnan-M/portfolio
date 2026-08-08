# BLUE//MOTION — Unni Krishnan M

An immersive, scroll-driven developer portfolio. Light futuristic editorial design, blue as the only accent, motion used as storytelling rather than decoration.

**Live:** _deploy to Vercel and add the URL here_

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, `src/`) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 — CSS-first `@theme`, no `tailwind.config.js` |
| Scroll animation | GSAP 3.15 + ScrollTrigger, SplitText, DrawSVGPlugin, MotionPathPlugin |
| Component motion | Framer Motion 13 |
| Smooth scroll | Lenis (driven off the GSAP ticker) |
| 3D | React Three Fiber 9 + drei 10 + three 0.185 (hero cube + toolkit constellation) |
| Icons | lucide-react + a local brand-mark set |
| Deployment | Vercel |

No backend, no API keys, no paid services.

---

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
```

---

## Where things live

```
src/
├── app/
│   ├── layout.tsx            fonts, SEO metadata, JSON-LD, global chrome
│   ├── page.tsx              section composition order
│   ├── globals.css           design tokens, custom utilities, keyframes
│   ├── icon.tsx              generated favicon
│   └── opengraph-image.tsx   generated social card
├── data/
│   ├── profile.ts            every fact about Unni — single source of truth
│   └── projects.ts           the real GitHub repositories
├── lib/
│   ├── gsap.ts               registers GSAP plugins exactly once
│   ├── hooks.ts              useMediaQuery / useReducedMotion / useIsDesktop
│   └── utils.ts              cn, clamp, lerp, seeded
├── components/
│   ├── core/                 Preloader, SmoothScroll, CustomCursor, Navigation,
│   │                         ScrollRail, Environment, Section, Reveal,
│   │                         SplitReveal, MagneticButton, SectionHeader
│   ├── icons/                brand marks + the technology registry
│   ├── three/                the hero WebGL scene (code-split, desktop only)
│   └── sections/             Hero, About, Statement, Toolkit, Projects,
│                             Experience, Achievements, Contact, Footer
└── public/img/               portrait asset
```

### Editing content

Almost everything is data-driven. To change a fact, edit `src/data/profile.ts`; to change the work shown, edit `src/data/projects.ts`. No component holds hardcoded copy about Unni.

**Replace the portrait:** the current file is Unni's own photograph with the background
removed locally — a per-material colour model (face, hair, neck, shirt) scored against a
background model sampled from the frame edges, combined with a focus/bokeh score, then
soft-matted through a trimap so hair keeps its strands. To swap it, drop a new cut-out at
`public/img/unni-portrait.webp` (transparent background, figure fading toward the bottom) and
update the `width`/`height` and the `aspect-[920/1021]` box in
`src/components/sections/about/NeuralPortrait.tsx` if the dimensions differ.

---

## AI & Data Science design language

`src/components/core/ai/` is a small domain vocabulary reused across sections, so the
site reads as an AI/DS engineer's portfolio rather than a generic premium template.
Everything in it is light-theme, blue-only, deterministic in layout (so SSR and client
markup match) and reduced-motion aware.

| Component | Draws |
| --- | --- |
| `NeuralField` | node/edge mesh with signals riding weighted edges |
| `LossCurve` | decaying training-loss curve that draws itself |
| `EmbeddingScatter` | 2-D projection with labelled clusters settling into place |
| `ConfusionMatrix` | NxN heatmap, strong diagonal, cells filling in |
| `TensorGrid` | isometric cube volume with a slice sweeping through |
| `NotebookCell` | `In [n]:` frame around real content |
| `Readout` | mono telemetry strip |
| `Brackets` | technical corner framing |

`NotebookCell` and `Readout` frame real content so they are not `aria-hidden`;
everything else is decoration and is, and sits strictly *behind* content.

Where sections show telemetry, the values are **parsed from `src/data/profile.ts`**, not
authored — durations come from the `meta` string or the start/end months, counts are
regex-extracted from the actual bullet text. Nothing in a readout is asserted by hand.

## Motion tokens

`src/lib/motion.ts` holds `EASE`, `DUR`, `STAGGER`, `reveal()` and `reducedMotion()`.
Sections import from here instead of hand-rolling values. The shared entrance
primitives (`Reveal`, `SplitReveal`) read the tokens too, so a timing change is one edit.

## The portrait is real geometry

`PortraitScene` displaces a 320x340-segment plane with maps derived from the photograph:

- **depth** — a distance transform of the alpha matte supplies the volume (the medial
  axis of the silhouette becomes the closest point to camera), plus a luminance high-pass
  for surface relief and a lift so the dark hair doesn't cave inward
- **normal** — Sobel gradient of that depth. Without it `displacementMap` moves vertices
  but leaves the shading flat, so the relief wouldn't read at all
- **alpha / colour** — split out of the cut-out

Data nodes orbit at `z = -2.9` with a capped radius so the furthest-forward node still
sits behind the portrait plane. Orbiting *around* the bust put spheres on his cheek and
ear, which read as blemishes rather than depth.

Regenerate the maps with the script in the commit history if the photo is ever replaced.

## Design system

Tokens are declared in `globals.css` under `@theme`, so they're available as ordinary Tailwind classes.

| Token | Value | Use |
| --- | --- | --- |
| `bg` | `#F7FAFF` | page background |
| `bg-2` | `#FFFFFF` | cards, panels |
| `blue` | `#1261FF` | primary accent |
| `electric` | `#00C2FF` | gradient partner, glows |
| `deep` | `#071A3D` | dark visual panels |
| `soft` | `#EAF2FF` | tinted fills |
| `ink` | `#07111F` | body text |
| `muted` | `#64748B` | secondary text |
| `line` | `#DCE7F5` | borders, hairlines |

Custom utilities: `label-tech`, `glass`, `card-soft`, `tech-grid`, `tech-grid-sm`, `dot-grid`, `text-gradient-blue`, `display-xl`, `display-lg`, `display-md`.

Typography is Plus Jakarta Sans for everything and JetBrains Mono for technical labels — two families, both self-hosted through `next/font`.

---

## Motion notes

- **Preloader** — a boot sequence counting 0→100, then a clip-path wipe. Dispatches `bm:loaded`, which the hero waits on before starting its entrance timeline.
- **Lenis + GSAP** — Lenis is stepped by `gsap.ticker` and calls `ScrollTrigger.update()`, so smooth scroll and scroll-triggered animation share one frame. `lagSmoothing(0)` keeps them locked together.
- **Going inside** — three different depth devices, deliberately not repeated:
  `Gateway variant="portal"` (hero → About) rushes a rounded blue-rimmed window
  past the camera while tunnel rings and radial streaks accelerate outward;
  `Statement` is a word tunnel where each oversized line comes out of the
  distance, fills the screen and passes the camera; `Gateway variant="grid"`
  (→ Projects) flies down a perspective corridor. Ordinary sections use
  `PortalSection`, which opens them from a side-inset rounded window while the
  contents scale up from behind. Projects is deliberately unwrapped —
  `clip-path` creates a containing block and would break its fixed-position pin.
- **Marquee** — giant looping technology band. Runs continuously and takes scroll
  velocity into its `timeScale`, so it lurches when you scroll hard. Two identical
  rows wrapping at `-50%` make the loop seamless with no measurement.
- **Projects** — vertical scroll drives horizontal movement through a pinned track. Per-card animations use ScrollTrigger's `containerAnimation` so they trigger off horizontal position.
- **Warp overlay** — reads Lenis velocity once per frame and writes a single `--warp` custom property; radial streaks and an edge vignette scale off it, so fast scrolling feels like travel. One style write per frame regardless of streak count. It sits at `z-5`, **behind** `<main>` — above the content it painted over card text and muddied every light surface.
- **Two WebGL scenes**, both code-split and both gated on a proven first frame: the hero crystal, and the toolkit constellation (faceted core, three tilted orbit rings, glossy nodes with DOM labels tracked in 3D via drei `Html`, dust field). The CSS/SVG constellation stays underneath at `opacity: 0` — still hit-testable, so hover and keyboard focus keep working while WebGL does the drawing.
- **Project cards tilt** toward the cursor in real perspective. The tilt is gated on the entrance timeline completing: both write the same transform matrix and would otherwise fight.
- **Reduced motion** — every section renders its complete final state when `prefers-reduced-motion: reduce` is set. The preloader resolves immediately, Lenis never initialises, the WebGL scene is replaced by a CSS composition, and no scrubbed timeline runs.
- **Mobile** — the custom cursor, WebGL scene and horizontal pinning are all disabled below `lg` / on coarse pointers. Horizontal sections become vertical storytelling; entrance animations stay.

---

## Accessibility

- Semantic landmarks and one `<h1>`; sections use `<h2>`.
- Skip link to content.
- All decorative layers are `aria-hidden`; all controls are real buttons and links with accessible names.
- The project case-study overlay is a proper modal: `role="dialog"`, focus moved in and trapped, Escape to close, focus restored on close.
- The toolkit category switcher is a keyboard-navigable tablist.
- `prefers-reduced-motion` fully respected.

---

## A note on the project copy

The descriptions in `src/data/projects.ts` are written from what the repositories actually
contain — verified against each one's `package.json` / `pyproject.toml` / `pubspec.yaml` rather
than its README, because several READMEs describe intended rather than shipped functionality.
Where a project is a scaffold, a front-end-only prototype, or has mock endpoints, the entry says
so in its `status` field and the case-study overlay renders that as a "Scope note".

That's deliberate. Every claim on this site should survive a follow-up question in an interview.

---

## Deploy

```bash
npx vercel        # or push to GitHub and import the repo at vercel.com
```

Then set `SITE` in `src/app/layout.tsx` to the real domain so canonical URLs and the
Open Graph card resolve correctly.
