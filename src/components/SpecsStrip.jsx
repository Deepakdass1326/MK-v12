import { SPECS } from "../data/features";

export default function SpecsStrip() {
  return (
    <section
      id="specs"
      className="relative z-20 overflow-hidden border-y border-line bg-[linear-gradient(180deg,_var(--color-gunmetal-900)_0%,_var(--color-gunmetal-950)_100%)] px-[clamp(20px,6vw,64px)] py-18"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.1] [background-image:linear-gradient(90deg,rgba(231,228,218,0.12)_1px,transparent_1px)] [background-size:120px_100%]" />

      <div className="relative mx-auto grid max-w-[1280px] grid-cols-[minmax(220px,320px)_1fr] gap-10 max-lg:grid-cols-1">
        <div className="border-l border-brass/50 pl-5">
          <span className="eyebrow">Spec sheet</span>
          <h2 className="display-heading mt-3 text-[clamp(1.85rem,3.4vw,3rem)]">
            BUILT FOR REPEATABLE PRECISION
          </h2>
          <p className="mt-4 max-w-[300px] text-[0.9rem] leading-relaxed text-bone-dim">
            As built, unloaded, no optic. Tuned around stability, repeatability, and fast field adjustment.
          </p>
        </div>

        <div className="grid grid-cols-5 gap-px border border-line bg-line max-lg:grid-cols-3 max-sm:grid-cols-2">
          {SPECS.map((s) => (
            <div
              key={s.label}
              className="min-h-[132px] bg-gunmetal-950/92 p-5 transition-colors duration-300 hover:bg-gunmetal-900"
            >
              <span className="block font-mono text-[1.45rem] tracking-[0.02em] text-bone">
                {s.value}
              </span>
              <span className="mt-5 block font-mono text-[0.62rem] leading-relaxed tracking-[0.16em] text-steel uppercase">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
