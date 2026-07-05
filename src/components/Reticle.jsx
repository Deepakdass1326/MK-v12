import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Reticle() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  });

  useEffect(() => {
    if (!enabled || !dotRef.current || !ringRef.current) return undefined;

    document.body.classList.add("has-reticle");

    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    gsap.set([dotRef.current, ringRef.current], { xPercent: -50, yPercent: -50, x: startX, y: startY });

    const setDotX = gsap.quickTo(dotRef.current, "x", { duration: 0.12, ease: "power3.out" });
    const setDotY = gsap.quickTo(dotRef.current, "y", { duration: 0.12, ease: "power3.out" });
    const setRingX = gsap.quickTo(ringRef.current, "x", { duration: 0.5, ease: "power3.out" });
    const setRingY = gsap.quickTo(ringRef.current, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (e) => {
      setDotX(e.clientX);
      setDotY(e.clientY);
      setRingX(e.clientX);
      setRingY(e.clientY);
    };

    const onDown = () => gsap.to(ringRef.current, { scale: 0.7, duration: 0.2 });
    const onUp = () => gsap.to(ringRef.current, { scale: 1, duration: 0.3 });

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      document.body.classList.remove("has-reticle");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[300] mix-blend-difference max-md:hidden"
        aria-hidden="true"
      >
        <svg viewBox="0 0 60 60" width="40" height="40">
          <circle cx="30" cy="30" r="18" fill="none" stroke="#b8863e" strokeWidth="1" opacity="0.8" />
          <line x1="30" y1="0" x2="30" y2="10" stroke="#b8863e" strokeWidth="1" opacity="0.8" />
          <line x1="30" y1="50" x2="30" y2="60" stroke="#b8863e" strokeWidth="1" opacity="0.8" />
          <line x1="0" y1="30" x2="10" y2="30" stroke="#b8863e" strokeWidth="1" opacity="0.8" />
          <line x1="50" y1="30" x2="60" y2="30" stroke="#b8863e" strokeWidth="1" opacity="0.8" />
        </svg>
      </div>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[300] h-1 w-1 rounded-full bg-brass-bright mix-blend-difference max-md:hidden"
        aria-hidden="true"
      />
    </>
  );
}
