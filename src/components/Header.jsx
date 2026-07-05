import { useEffect, useState } from "react";
import BrandMark from "./BrandMark";

const NAV_LINKS = [
  { href: "#platform", label: "Platform" },
  { href: "#specs", label: "Specs" },
  { href: "#customize", label: "Finish" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };

    window.addEventListener("resize", closeOnDesktop);
    return () => window.removeEventListener("resize", closeOnDesktop);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[100] px-[clamp(16px,4vw,48px)] pt-4">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 border border-line-bright bg-gunmetal-950/72 px-4 py-3 shadow-[0_18px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl">
        <a
          className="flex items-center gap-2.5 font-display text-[1.05rem] font-bold tracking-[0.06em] text-bone"
          href="#top"
        >
          <BrandMark />
          <span>MK&nbsp;-&nbsp;VII</span>
        </a>

        <div className="hidden border-l border-line-bright pl-4 font-mono text-[0.62rem] leading-relaxed tracking-[0.14em] text-steel-dim uppercase lg:block">
          Precision rifle platform
          <br />
          800m field configuration
        </div>

        <nav className="hidden items-center gap-8 font-mono text-xs tracking-[0.16em] text-bone-dim uppercase md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative pb-1 transition-colors duration-300 hover:text-bone"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 h-px w-0 bg-brass transition-[width] duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <a
          className="hidden border border-brass/70 bg-brass/8 px-4 py-2.5 font-mono text-xs tracking-[0.14em] text-brass-bright uppercase transition-colors duration-300 hover:bg-brass hover:text-gunmetal-950 md:inline-block"
          href="#customize"
        >
          Finish Studio
        </a>

      <button
        type="button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 border border-line bg-gunmetal-950/35 md:hidden"
      >
        <span
          className={`h-px w-5 bg-bone transition-transform duration-300 ${
            menuOpen ? "translate-y-[3.5px] rotate-45" : ""
          }`}
        />
        <span
          className={`h-px w-5 bg-bone transition-opacity duration-300 ${
            menuOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`h-px w-5 bg-bone transition-transform duration-300 ${
            menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
          }`}
        />
      </button>

      {menuOpen && (
        <nav className="absolute top-[calc(100%+8px)] right-[clamp(16px,4vw,48px)] left-[clamp(16px,4vw,48px)] flex flex-col gap-1 border border-line-bright bg-gunmetal-950/95 px-6 py-4 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-md md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-line py-3 font-mono text-xs tracking-[0.16em] text-bone-dim uppercase last:border-b-0 hover:text-bone"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#customize"
            onClick={() => setMenuOpen(false)}
            className="mt-2 border border-brass px-4 py-2.5 text-center font-mono text-xs tracking-[0.14em] text-brass-bright uppercase"
          >
            Configure
          </a>
        </nav>
      )}
      </div>
    </header>
  );
}
