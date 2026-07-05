import { useThree } from "@react-three/fiber";
import RifleModel from "./RifleModel";
import { MODEL_CENTER, MODEL_SIZE } from "../data/modelMetrics";

export default function ResponsiveRifleViewer({ skinProps }) {
  const { viewport } = useThree();

  // Fit the long rifle to the available canvas width first, then cap it so
  // desktop views still feel close enough to inspect surface details.
  const scale = Math.min(
    0.62,
    Math.max(0.28, Math.min(viewport.width / (MODEL_SIZE.x * 1.25), viewport.height / 3.2))
  );

  return (
    <group rotation={[0, 0.55, 0]} scale={scale}>
      <group position={[-MODEL_CENTER.x, -MODEL_CENTER.y, -MODEL_CENTER.z]}>
        <RifleModel skinProps={skinProps} />
      </group>
    </group>
  );
}
