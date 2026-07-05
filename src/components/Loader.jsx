import { useProgress } from "@react-three/drei";
import BrandMark from "./BrandMark";

export default function Loader() {
  const { active, progress } = useProgress();

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-gunmetal-950 transition-[opacity,visibility] duration-500 ${
        active ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="animate-[spin_3.5s_linear_infinite]">
        <BrandMark size={34} strokeWidth={4} />
      </div>

      <div className="h-px w-[200px] bg-[rgba(231,228,218,0.15)]">
        <div
          className="h-full bg-brass transition-[width] duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="font-mono text-[0.68rem] tracking-[0.24em] text-bone-dim">
        CALIBRATING - {Math.round(progress)}%
      </span>
    </div>
  );
}
