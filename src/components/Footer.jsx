import BrandMark from "./BrandMark";

export default function Footer() {
  return (
    <footer className="relative z-20 border-t border-line bg-gunmetal-950 px-[clamp(20px,6vw,64px)] py-8">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-3 font-display text-sm font-bold tracking-[0.08em] text-steel">
          <BrandMark size={18} stroke="#94a19d" />
          <span>MK&#8209;VII</span>
        </div>

        <div className="flex flex-wrap items-center gap-5 font-mono text-[0.62rem] tracking-[0.1em] text-steel-dim uppercase">
          <span>Real-time render</span>
          <span className="h-px w-8 bg-line-bright" aria-hidden="true" />
          <span>Illustrative specification</span>
        </div>

        <span className="font-mono text-[0.62rem] tracking-[0.08em] text-steel-dim">
          &copy; 2026
        </span>
      </div>
    </footer>
  );
}
