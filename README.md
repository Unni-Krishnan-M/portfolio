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
│   ├── layout.tsx            document shell — fonts and SEO metadata only
│   ├── (site)/layout.tsx     the portfolio's chrome + JSON-LD
│   ├── (site)/page.tsx       section composition order
│   ├── admin/[key]/          the content studio (secret path + password)
│   ├── globals.css           design tokens, custom utilities, keyframes
│   ├── icon.tsx              generated favicon
│   └── opengraph-image.tsx   generated social card
├── data/
│   ├── content.json          every fact about Unni — single source of truth
│   ├── profile.ts            types + typed reads of content.json
│   └── projects.ts           the real GitHub repositories
├── lib/
│   ├── admin/                studio auth, GitHub commits, content schema
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
├── scripts/
│   └── portrait-matte.py     cuts the portrait out of its studio backdrop
└── public/img/               portrait: raw photograph + derived cut-out
```

### Editing content

Every fact lives in `src/data/content.json`. No component holds hardcoded copy about Unni.
`src/data/profile.ts` and `src/data/projects.ts` still exist and still export the same names —
they now own the *types* and read their values from that JSON, so nothing that imports them
changed. Edit the JSON directly, or use the studio below.

### The content studio

`/admin/<ADMIN_KEY>` is a form editor for all eighteen content groups — add, remove, reorder
and rewrite anything, from a project's metrics to the marquee band. Pressing **Publish**
commits `content.json` to this repository, which makes Vercel rebuild; the live site updates
about a minute later.

**Setup.** Copy `.env.example` to `.env.local` for local use, and add the same variables in
Vercel under *Settings → Environment Variables*. You need:

| Variable | Why |
| --- | --- |
| `ADMIN_KEY` | Secret path segment, 16+ chars. `openssl rand -hex 16` |
| `ADMIN_PASSWORD` | Studio password, 12+ chars |
| `GITHUB_TOKEN` | Fine-grained PAT, **this repo only**, *Contents: read and write* |
| `GITHUB_REPO` | `owner/repository` |

Until `ADMIN_KEY` and `ADMIN_PASSWORD` are both set and long enough the route 404s — the
studio does not run half-configured. Without the GitHub variables it still edits and offers
**Download JSON**, but Publish is disabled.

**Why a password as well as a secret URL.** A secret path alone was the original idea, but URLs
leak — shared-machine history, a screenshot, a referrer header — and this endpoint can rewrite
the entire site. Both gates are checked inside every Server Action, not just when rendering the
page, because an action is a public POST endpoint that can be invoked without ever loading the
UI. Submitted documents are validated against `src/lib/admin/schema.ts` before anything is
written, so a malformed payload cannot break the build.

**Why git rather than a database.** The site stays fully static, so a GitHub outage stops
*editing* but never affects visitors — the failure mode a database would invert. Content also
gets version history and a revert path for free, and it needs no dependency beyond `fetch`.
The trade-off is that publishing takes about a minute instead of being instant.

Two things worth knowing: saves are last-write-wins (the studio is single-user, and git history
holds anything overwritten), and there is no live preview — use **View site** after a publish.
`src/lib/admin/schema.ts` is the one place to add a field; it drives the form controls, the
"Add" blanks and the validation together.

**The portrait** is Unni's own photograph. The raw frame lives at
`public/img/unni-portrait.jpg` — a studio shot over a synthetic backdrop of flat white,
blue diagonal bands and halftone dots. `scripts/portrait-matte.py` cuts the figure out of
it, writing the transparent `public/img/unni-portrait-cutout.webp` that the site actually
loads. Two properties of that backdrop make it separable without a segmentation model: every
backdrop region touches the frame edge (so background = matches the backdrop palette *and*
connects to the border), and blue-minus-red separates the shirt from the bands where low red
alone does not — the shirt's shadowed folds are as red-starved as the navy band, but never as
blue. The matte is then pulled in ~2px to shed the white fringe, subject colour is bled
outward so downscaling cannot halo, and the bottom is feathered where the torso leaves the
frame.

The same script then **grades the frame to the palette**. The raw photograph is lit warm —
skin at R−B ≈ 99, shirt a muted `(37,72,131)` — which fights a `#f7faff` page whose only
accent is `#1261ff`. The grade neutralises that tungsten cast and pulls the shirt and shadows
into the blue family; his hair lands close to `--color-deep` on its own. It deliberately
leaves his complexion alone: the moves are weighted by warmth / blueness / shadow depth
rather than applied as a hue rotation, and mean skin luminance holds at ~116 against the
original ~119, so the skin is tonally where it started — what changes is the light on it.
The script prints both readings so the grade stays auditable, and `GRADE = 0` disables it.

It renders as a flat `next/image` cut-out — a displaced 3D version was built and then
removed by request.

**To replace it:** drop a new photograph at `public/img/unni-portrait.jpg`, run
`python3 scripts/portrait-matte.py` (needs `numpy`, `scipy`, `pillow`), and set the
`width`/`height` and `aspect-[...]` box in
`src/components/sections/about/NeuralPortrait.tsx` to the canvas size it prints. The
palette thresholds at the top of the script are tuned to this backdrop; a different one
needs them re-measured — the script refuses to write if the result looks implausible.
For a photograph already cut out, skip the script and point the component straight at it.

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
