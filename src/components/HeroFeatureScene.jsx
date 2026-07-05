import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RifleModel from "./RifleModel";
import SceneLights from "./SceneLights";
import { FEATURES } from "../data/features";
import { STAGE_ORDER, pose } from "../data/sceneStages";

gsap.registerPlugin(ScrollTrigger);

// @react-three/fiber still emits this warning with three.js r176+.
{
  const originalWarn = console.warn.bind(console);
  console.warn = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("THREE.Clock")) return;
    originalWarn(...args);
  };
}

function ParallaxRig({ children }) {
  const innerRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canFollow =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canFollow) return undefined;

    const onMove = (e) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 0.18;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 0.12;
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(() => {
    if (!innerRef.current) return;
    innerRef.current.rotation.y += (target.current.x - innerRef.current.rotation.y) * 0.025;
    innerRef.current.rotation.x += (-target.current.y - innerRef.current.rotation.x) * 0.025;
  });

  return <group ref={innerRef}>{children}</group>;
}

export default function HeroFeatureScene() {
  const wrapRef = useRef(null);
  const heroPanelRef = useRef(null);
  const featurePanelRefs = useRef([]);
  const scrollCueRef = useRef(null);
  const rangeNumRef = useRef(null);
  const rangeStatusRef = useRef(null);
  const [rigNode, setRigNode] = useState(null);
  const [webglLost, setWebglLost] = useState(false);

  const setFeaturePanelRef = useCallback((el, i) => {
    featurePanelRefs.current[i] = el;
  }, []);

  useEffect(() => {
    const rig = rigNode;
    if (!rig) return undefined;

    const hero = pose("hero");
    gsap.set(rig.position, { x: hero.x, y: hero.y, z: hero.z });
    gsap.set(rig.rotation, { x: hero.rx, y: hero.ry, z: hero.rz });
    gsap.set(rig.scale, { x: hero.scale, y: hero.scale, z: hero.scale });

    const panels = featurePanelRefs.current.filter(Boolean);
    if (panels.length) gsap.set(panels, { opacity: 0, y: 24 });
    if (heroPanelRef.current) gsap.set(heroPanelRef.current, { opacity: 1, y: 0 });

    let removeLoadRefresh = () => {};

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "sine.inOut" },
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "+=6800",
          scrub: 2.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const distance = Math.round(1200 * (1 - self.progress));
            if (rangeNumRef.current) {
              rangeNumRef.current.textContent = distance.toString().padStart(4, "0");
            }
            if (rangeStatusRef.current) {
              rangeStatusRef.current.textContent =
                self.progress > 0.97 ? "TARGET ACQUIRED" : "RANGE TO TARGET";
            }
          },
        },
      });

      if (scrollCueRef.current) tl.to(scrollCueRef.current, { opacity: 0, duration: 0.35 }, 0);
      if (heroPanelRef.current) {
        tl.to(heroPanelRef.current, { opacity: 0, y: -18, duration: 0.8 }, 0);
      }

      STAGE_ORDER.forEach((key, i) => {
        const p = pose(key);
        const panel = panels[i] ?? null;
        const isClose = key === "close";

        tl.to(rig.position, { x: p.x, y: p.y, z: p.z, duration: 1.75 }, "<")
          .to(rig.rotation, { x: p.rx, y: p.ry, z: p.rz, duration: 1.75 }, "<")
          .to(rig.scale, { x: p.scale, y: p.scale, z: p.scale, duration: 1.75 }, "<");

        if (!isClose && panel) {
          tl.fromTo(panel, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.75 }, "-=0.9")
            .to(panel, { opacity: 0, y: -18, duration: 0.75 }, "+=0.85");
        }
      });

      if (heroPanelRef.current) {
        tl.fromTo(
          heroPanelRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.9"
        );
      }

      const refresh = () => ScrollTrigger.refresh();
      requestAnimationFrame(refresh);
      window.addEventListener("load", refresh);
      document.fonts?.ready?.then(refresh);
      removeLoadRefresh = () => window.removeEventListener("load", refresh);
    }, wrapRef);

    return () => {
      removeLoadRefresh();
      ctx.revert();
    };
  }, [rigNode]);

  return (
    <section
      id="platform"
      ref={wrapRef}
      className="relative h-screen min-h-[660px] w-full overflow-hidden bg-[linear-gradient(135deg,_#111712_0%,_var(--color-gunmetal-950)_48%,_#080b0a_100%)] max-md:min-h-[720px]"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] [background-image:linear-gradient(rgba(231,228,218,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(231,228,218,0.08)_1px,transparent_1px)] [background-size:84px_84px]" />
      <div className="pointer-events-none absolute inset-x-[clamp(20px,5vw,56px)] top-24 z-[2] hidden h-px bg-gradient-to-r from-transparent via-line-bright to-transparent md:block" />
      <div className="absolute inset-0">
        <Canvas
          dpr={1}
          camera={{ fov: 35, position: [0, 0.1, 8.2], near: 0.1, far: 50 }}
          gl={{ antialias: false, alpha: true, powerPreference: "default" }}
          onCreated={({ gl, scene }) => {
            gl.domElement.addEventListener("webglcontextlost", (event) => {
              event.preventDefault();
              setWebglLost(true);
            });
            gl.toneMapping = ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.08;
            gl.outputColorSpace = SRGBColorSpace;
            scene.background = null;
          }}
        >
          <SceneLights />
          <Suspense fallback={null}>
            <group ref={setRigNode}>
              <ParallaxRig>
                <RifleModel />
              </ParallaxRig>
            </group>
          </Suspense>
        </Canvas>
      </div>

      {webglLost && (
        <div className="absolute inset-0 z-[5] bg-[radial-gradient(ellipse_at_50%_35%,_rgba(184,134,62,0.18)_0%,_rgba(10,13,12,0)_45%)]" />
      )}

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_52%_42%,_rgba(194,168,108,0.12)_0%,_rgba(10,13,12,0)_48%),linear-gradient(to_bottom,_rgba(10,13,12,0.28)_0%,_rgba(10,13,12,0)_28%,_rgba(10,13,12,0)_72%,_rgba(10,13,12,0.45)_100%)]" />

      <div
        ref={heroPanelRef}
        className="absolute top-1/2 left-[clamp(20px,5vw,56px)] z-10 max-w-[430px] -translate-y-1/2 border-l border-brass/55 pl-5 max-md:top-[60%] max-md:max-w-[82vw]"
      >
        <span className="eyebrow">Long-range precision platform</span>
        <h1 className="display-heading mt-4 mb-5 text-[clamp(2.65rem,7vw,6.2rem)]">
          MK&#8209;VII
          <br />
          HOLDS ITS ZERO
        </h1>
        <p className="max-w-[360px] text-[0.95rem] leading-relaxed text-bone-dim">
          Every part of this rifle exists to remove one variable at a time between you and eight
          hundred metres of open ground.
        </p>
        <div className="mt-7 grid max-w-[380px] grid-cols-3 gap-px border border-line bg-line font-mono text-[0.58rem] tracking-[0.1em] text-steel uppercase">
          <div className="bg-gunmetal-950/70 p-3">
            <span className="block text-bone">800m</span>
            <span className="mt-1 block text-steel-dim">Range</span>
          </div>
          <div className="bg-gunmetal-950/70 p-3">
            <span className="block text-bone">.308</span>
            <span className="mt-1 block text-steel-dim">Caliber</span>
          </div>
          <div className="bg-gunmetal-950/70 p-3">
            <span className="block text-bone">4.9kg</span>
            <span className="mt-1 block text-steel-dim">Weight</span>
          </div>
        </div>
      </div>

      {FEATURES.map((f, i) => (
        <div
          key={f.id}
          ref={(el) => setFeaturePanelRef(el, i)}
          className="absolute top-1/2 right-[clamp(24px,4vw,72px)] z-10 max-w-[min(360px,70vw)] -translate-y-1/2 text-right max-md:top-[62%]"
        >
          <span className="eyebrow">
            {f.index} &mdash; {f.label}
          </span>
          <h2 className="display-heading mt-3 mb-4 text-[clamp(1.55rem,2.6vw,2.28rem)]">
            {f.title}
          </h2>
          <p className="ml-auto max-w-[340px] text-[0.92rem] leading-relaxed text-bone-dim">
            {f.body}
          </p>
        </div>
      ))}

      <div className="absolute top-28 right-[clamp(20px,5vw,56px)] z-10 flex min-w-[168px] flex-col items-end gap-1 border border-line bg-gunmetal-950/58 px-4 py-3 font-mono backdrop-blur-sm max-md:top-24 max-md:min-w-0 max-md:px-3">
        <span ref={rangeStatusRef} className="text-[0.58rem] tracking-[0.2em] text-steel">
          RANGE TO TARGET
        </span>
        <span className="text-[1.55rem] tracking-[0.06em] text-brass-bright">
          <span ref={rangeNumRef}>1200</span>M
        </span>
      </div>

      <div
        ref={scrollCueRef}
        className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2.5 font-mono text-[0.66rem] tracking-[0.28em] text-steel"
      >
        <span>SCROLL</span>
        <div className="h-8 w-px animate-[scrollpulse_1.8s_ease-in-out_infinite] bg-[linear-gradient(to_bottom,_var(--color-brass),_transparent)]" />
      </div>

      <div className="absolute right-[clamp(20px,5vw,56px)] bottom-8 left-[clamp(20px,5vw,56px)] z-10 hidden items-end justify-between gap-8 font-mono text-[0.62rem] tracking-[0.14em] text-steel-dim uppercase md:flex">
        <div className="flex gap-8">
          <span>R-Class chassis</span>
          <span>Cold hammer platform</span>
        </div>
        <span className="max-w-[360px] text-right leading-relaxed">
          Scroll reveals optics, barrel, and chassis geometry without leaving the platform view.
        </span>
      </div>

      <style>{`
        @keyframes scrollpulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
