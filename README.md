# MK-VII — Precision Platform

> A high-performance, scroll-driven 3D product showcase for the MK-VII sniper rifle. Built with React, Three.js, and GSAP — designed to feel like a cinematic weapons reveal.

---

## ✨ Features

- 🎯 **Scroll-driven 3D animation** — The rifle moves, rotates, and zooms as you scroll through the page, driven by GSAP ScrollTrigger
- 🔭 **Live range readout** — "Range to target" counter counts down from 1200M → 0M in real-time as you scroll
- 🎨 **Interactive finish customizer** — Switch between 4 surface finishes (Gunmetal, Desert Tan, Arctic White, Copper Shot) with smooth GSAP color tweens
- 🖱️ **Custom reticle cursor** — Crosshair cursor that trails the pointer with `gsap.quickTo` for a buttery-smooth feel (desktop only)
- 💎 **Glassmorphism UI** — Frosted glass header with blur effects and premium dark aesthetic
- ⚡ **Blazing fast** — 3D model optimized from 17.8 MB → ~290 KB via `@gltf-transform`

---

## 🛠️ Tech Stack

| Technology | Role |
|---|---|
| React 19 + Vite | UI framework & build tool |
| Three.js + `@react-three/fiber` | 3D rendering engine |
| `@react-three/drei` | Orbit controls, loaders & helpers |
| GSAP + ScrollTrigger | Scroll animations & smooth transitions |
| CSS Custom Properties | Design tokens & theming |
| Google Fonts | Big Shoulders Display, Inter, Space Mono |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install & Run

```bash
# Clone the repository
git clone https://github.com/Deepakdass1326/MK-v12.git
cd MK-v12

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open the local URL printed in your terminal (usually `http://localhost:5173`).

### Production Build

```bash
npm run build      # Compiles & bundles for production → /dist
npm run preview    # Locally preview the production build
```

---

## 📁 Project Structure

```
MK-v12/
├── public/
│   ├── models/
│   │   └── sniper_rifle.glb        # Optimized 3D rifle model (~290 KB)
│   ├── *.jpg                       # Skin/finish textures
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── Header.jsx              # Fixed nav with glass blur effect
│   │   ├── HeroFeatureScene.jsx    # Pinned scroll-driven 3D scene
│   │   ├── SpecsStrip.jsx          # Spec sheet readout
│   │   ├── CustomizeSection.jsx    # Finish/skin selector with orbit viewer
│   │   ├── RifleModel.jsx          # GLB loader + material exposure
│   │   ├── ResponsiveRifleViewer.jsx
│   │   ├── SceneLights.jsx         # Three.js lighting setup
│   │   ├── Reticle.jsx             # Custom crosshair cursor
│   │   ├── Loader.jsx              # Loading screen
│   │   └── BrandMark.jsx           # Logo component
│   ├── data/
│   │   ├── features.js             # Feature card content
│   │   ├── modelMetrics.js         # Spec values
│   │   ├── sceneStages.js          # Scroll stage pose definitions
│   │   └── skins.js                # Finish/color definitions
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                   # Design tokens (CSS variables)
├── index.html
├── vite.config.js
└── package.json
```

---

## 🎬 How the Scroll Animation Works

The hero section is a **pinned GSAP ScrollTrigger** scene. As the user scrolls, the camera appears to move through different parts of the rifle — optic → barrel → stock/trigger.

This is controlled via `STAGES` in `src/data/sceneStages.js`:

```js
{
  lx, ly,    // Point on the rifle (local model space) to center in frame
  scale,     // Zoom level for this stage
  rot,       // Rifle rotation [x, y, z] in radians
  offset,    // Screen-space nudge to make room for the text panel
}
```

> The model spans roughly **9.8 units** along the X axis. Tweak these values and refresh — it's art-directed like a product photoshoot, not an exact science.

`scrub: 1` on the ScrollTrigger is what gives the motion its characteristic smooth lag/momentum feel.

---

## 🎨 Customizing Finishes

The **Customize** section renders an independent orbit-controlled viewer. Each finish is defined in `src/data/skins.js`:

```js
{
  name: "Gunmetal",
  color: "#3a3a3a",
  texture: "/604A30_DC9065_212C14_AC9C92.jpg"
}
```

Clicking a swatch triggers a GSAP tween on the material's color for a smooth cross-fade between finishes.

---

## 🔄 Swapping the 3D Model

Replace `public/models/sniper_rifle.glb` with your own model. For best performance, compress it first:

```bash
npx @gltf-transform/cli optimize input.glb public/models/sniper_rifle.glb \
  --texture-size 1024 --texture-compress webp --compress false
```

> **Note:** The finish tinting in `CustomizeSection.jsx` currently targets the **first mesh's material**. If your model has multiple materials, extend `RifleModel.jsx`'s `onMaterialReady` callback to return and tint all of them.

---

## 🧩 Design Tokens

All colors, spacing, and typographic values are managed as CSS custom properties in `src/index.css`:

```css
:root {
  --color-bg: #0a0a0a;
  --color-accent: #c8a96e;
  /* ... */
}
```

Fonts used:
- **Big Shoulders Display** — headlines
- **Inter** — body text
- **Space Mono** — data readouts & numerical values

---

## ♿ Accessibility Note

The pinned scroll animation currently does **not** respect `prefers-reduced-motion`. If your audience includes users sensitive to motion, gate the `ScrollTrigger` creation in `HeroFeatureScene.jsx` behind a media query check and fall back to a static hero pose.

---

## 📄 License

MIT — feel free to use this as a template for your own 3D product showcases.

---

<div align="center">
  <strong>MK-VII Precision Platform</strong> · Built with ❤️ using React + Three.js + GSAP
</div>
