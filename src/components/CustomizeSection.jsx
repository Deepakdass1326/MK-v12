import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import { OrbitControls } from "@react-three/drei";
import ResponsiveRifleViewer from "./ResponsiveRifleViewer";
import SceneLights from "./SceneLights";
import { SKINS } from "../data/skins";

function Viewer({ skinProps }) {
  return (
    <>
      <SceneLights compact />
      <ResponsiveRifleViewer skinProps={skinProps} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.6}
        maxPolarAngle={Math.PI / 1.7}
        autoRotate
        autoRotateSpeed={0.65}
      />
    </>
  );
}

export default function CustomizeSection() {
  const [activeSkin, setActiveSkin] = useState(SKINS[0]);

  return (
    <section
      id="customize"
      className="relative z-20 overflow-hidden bg-[linear-gradient(180deg,_var(--color-gunmetal-950)_0%,_#111612_48%,_var(--color-gunmetal-950)_100%)] px-[clamp(20px,6vw,64px)] py-24 max-md:py-16"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(231,228,218,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(231,228,218,0.08)_1px,transparent_1px)] [background-size:96px_96px]" />

      <div className="relative mx-auto grid w-full max-w-[1280px] grid-cols-[minmax(300px,430px)_minmax(0,1fr)] items-stretch gap-10 max-lg:grid-cols-1">
        <div className="flex flex-col justify-between border border-line-bright bg-gunmetal-950/62 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.28)] backdrop-blur-md">
          <div>
            <span className="eyebrow">Finish system</span>
            <h2 className="display-heading my-3.5 text-[clamp(2.1rem,4.4vw,3.4rem)]">
              CHOOSE YOUR FINISH
            </h2>
            <p className="max-w-[380px] text-[0.95rem] leading-relaxed text-bone-dim">
              Every coating keeps the same platform geometry, with a different terrain-read and surface response.
            </p>
          </div>

          <div className="mt-8 border-y border-line">
            {SKINS.map((skin) => {
              const isActive = activeSkin.id === skin.id;
              return (
                <button
                  key={skin.id}
                  type="button"
                  onClick={() => setActiveSkin(skin)}
                  className={`group flex min-h-20 w-full items-center gap-4 border-b border-line px-2 py-4 text-left transition-colors duration-300 last:border-b-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass ${
                    isActive ? "bg-brass/10" : "hover:bg-gunmetal-900/80"
                  }`}
                >
                  <span
                    className={`block h-11 w-11 shrink-0 border bg-cover bg-center transition-transform duration-300 group-hover:scale-105 ${
                      isActive ? "border-brass" : "border-line-bright"
                    }`}
                    style={{ backgroundImage: `url(${skin.matcap})` }}
                    aria-hidden="true"
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span
                      className={`font-body text-[0.98rem] font-semibold ${
                        isActive ? "text-brass-bright" : "text-bone"
                      }`}
                    >
                      {skin.name}
                    </span>
                    <span className="font-mono text-[0.66rem] tracking-[0.08em] text-steel">
                      {skin.tagline}
                    </span>
                  </span>
                  <span
                    className={`h-px w-8 shrink-0 transition-colors duration-300 ${
                      isActive ? "bg-brass" : "bg-line-bright"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          <div className="mt-7 grid grid-cols-2 gap-px border border-line bg-line font-mono text-[0.62rem] tracking-[0.12em] text-steel uppercase">
            <div className="bg-gunmetal-950/80 p-3">
              <span className="block text-steel-dim">Active</span>
              <span className="mt-1 block text-bone">{activeSkin.name}</span>
            </div>
            <div className="bg-gunmetal-950/80 p-3">
              <span className="block text-steel-dim">Surface</span>
              <span className="mt-1 block text-bone">Matcap coat</span>
            </div>
          </div>
        </div>

        <div className="relative min-h-[560px] overflow-hidden border border-line-bright bg-[radial-gradient(ellipse_at_50%_56%,_var(--color-gunmetal-800)_0%,_var(--color-gunmetal-950)_72%)] shadow-[0_30px_110px_rgba(0,0,0,0.32)] max-md:min-h-[420px]">
          <div className="pointer-events-none absolute inset-5 border border-line" />
          <div className="pointer-events-none absolute top-5 right-5 left-5 z-10 flex items-center justify-between border-b border-line pb-3 font-mono text-[0.62rem] tracking-[0.16em] text-steel uppercase">
            <span>{activeSkin.id}</span>
            <span>Live finish preview</span>
          </div>
          <Canvas
            dpr={1}
            camera={{ fov: 35, position: [0, 0.16, 5.8], near: 0.1, far: 50 }}
            gl={{ antialias: false, alpha: true, powerPreference: "default" }}
            onCreated={({ gl, scene }) => {
              gl.toneMapping = ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.12;
              gl.outputColorSpace = SRGBColorSpace;
              scene.background = null;
            }}
          >
            <Suspense fallback={null}>
              <Viewer skinProps={activeSkin} />
            </Suspense>
          </Canvas>
          <div className="pointer-events-none absolute right-5 bottom-5 left-5 z-10 flex items-center justify-between border-t border-line pt-3 font-mono text-[0.62rem] tracking-[0.16em] text-steel-dim uppercase">
            <span>MK-VII</span>
            <span>{activeSkin.name}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
