# MK-VII — Precision Platform

A scroll-driven product site for a sniper rifle, built with React + Vite,
`@react-three/fiber` (Three.js), and GSAP/ScrollTrigger for smoothing.

## Run it

```bash
npm install
npm run dev
```

Open the printed local URL. For a production build:

```bash
npm run build
npm run preview
```

## What's inside

- **Header** — fixed nav, blurred glass background.
- **Hero + Features (`HeroFeatureScene.jsx`)** — one pinned, scroll-scrubbed
  scene. GSAP drives the rifle's position/rotation/scale as you scroll so the
  camera appears to move to the optic, barrel, then stock/trigger, with a
  live "range to target" readout counting down from 1200M to 0M. `scrub: 1`
  on the ScrollTrigger is what gives the motion its smoothing/lag.
- **Specs strip** — a plain spec-sheet readout (caliber, range, weight, etc).
- **Customize (`CustomizeSection.jsx`)** — an independent, orbit-controlled
  viewer with 4 finishes (Gunmetal, Desert Tan, Arctic White, Copper Shot).
  Clicking a swatch tweens the material's color with GSAP for a smooth
  cross-fade between finishes.
- **Reticle** — a custom crosshair cursor that trails the pointer using
  `gsap.quickTo`, another smoothing touch (desktop only).

## Editing the rifle's pose per scroll stage

Open `src/components/HeroFeatureScene.jsx` and look at the `STAGES` object.
Each stage has:

- `lx, ly` — the point on the rifle (in the model's local space) to bring to
  the center of the frame.
- `scale` — how "zoomed in" that stage is.
- `rot` — the rifle's rotation at that stage.
- `offset` — a screen-space nudge so the text panel has room next to it.

These were tuned against the model's bounding box (roughly a 9.8-unit-long
mesh along X), so nudge the numbers and refresh to taste — there's no exact
science to it, it's art-directed like a product shoot.

## Swapping in your own model

Replace `public/models/sniper_rifle.glb`. If your file is large, it's worth
compressing it first:

```bash
npx @gltf-transform/cli optimize input.glb public/models/sniper_rifle.glb \
  --texture-size 1024 --texture-compress webp --compress false
```

(The bundled model was optimized this way: 17.8 MB → ~290 KB.)

If your model has multiple materials/meshes rather than one merged mesh, the
finish tinting in `CustomizeSection.jsx` currently grabs the *first* mesh's
material — extend `RifleModel.jsx`'s `onMaterialReady` callback to return a
list of materials and tint all of them instead.

## Notes

- Fonts: Big Shoulders Display (headlines), Inter (body), Space Mono (data
  readouts) — loaded from Google Fonts in `index.html`.
- Colors and other tokens live in `src/index.css` (`:root` variables).
- Reduced motion: the pinned scroll animation currently doesn't check
  `prefers-reduced-motion`; if that matters for your audience, gate the
  `ScrollTrigger` creation in `HeroFeatureScene.jsx` behind a media query
  check and fall back to a static hero image/pose.
